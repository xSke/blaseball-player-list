import { BlaseballPlayer, BlaseballTeam, ChroniclerEntity } from "../api/types";
import { getTeamType, libraryTeamIds } from "../teams";
import { AdvancedStats } from "./AdvancedStats";
import { Item } from "./Item";
import { Stars } from "./Stars";

export type TeamPosition = "lineup" | "rotation" | "shadows";

export interface RosterEntry {
    player: string;
    teamId: string;
    position: TeamPosition;
    index: number;
}

export type PlayerStatus =
    | "active"
    | "deprecated"
    | "deceased"
    | "retired"
    | "library"
    | "exhibition";

export class Player {
    public readonly id: string;
    public readonly data: BlaseballPlayer;
    public readonly mods: string[];

    public readonly mainTeam: RosterEntry | null;
    public readonly mainTeamData: BlaseballTeam | null;
    public readonly teams: RosterEntry[];

    public readonly stats: AdvancedStats;
    public readonly itemStats: AdvancedStats;
    public readonly adjustedStats: AdvancedStats;
    public readonly itemStars: Stars;

    public readonly items: Item[];
    public readonly names: string[];

    constructor(
        player: ChroniclerEntity<BlaseballPlayer>,
        teams: Record<string, BlaseballTeam>,
        roster: Record<string, RosterEntry[]>
    ) {
        this.id = player.entityId;
        this.data = player.data;
        this.teams = roster[player.entityId] ?? [];

        this.mainTeam = getMainTeam(this.teams);
        this.mainTeamData = this.mainTeam ? teams[this.mainTeam.teamId] : null;

        this.mods = extractPlayerMods(this.data);

        this.stats = AdvancedStats.fromPlayer(this.data);

        this.items = (this.data.items ?? []).map((i) => new Item(i));
        this.itemStats = this.items
            .map((i) => i.stats)
            .reduce((a, b) => a.add(b), AdvancedStats.new());
        this.itemStars = this.items
            .map((i) => i.stars)
            .reduce((a, b) => a.add(b), new Stars());
        this.adjustedStats = this.stats.add(this.itemStats);

        this.names = [this.data.name];
        if (this.data.state?.unscatteredName)
            this.names.push(this.data.state.unscatteredName);
    }

    name(showUnscatteredName: boolean): string {
        if (showUnscatteredName) {
            return this.data.state?.unscatteredName ?? this.data.name;
        }
        return this.data.name;
    }

    hasMod(...mods: string[]): boolean {
        // TODO: O(n^2)
        for (const mod of mods) {
            if (this.mods.includes(mod)) return true;
        }
        return false;
    }

    stars(realStars = true, applyItems = false): Stars {
        if (this.data.hittingRating === undefined) realStars = true;
        if (realStars) {
            const stats = applyItems ? this.adjustedStats : this.stats;
            return stats.stars();
        }
        return this.providedStars(applyItems);
    }

    providedStars(applyItems = false): Stars {
        if (this.data.hittingRating === undefined) {
            // Phantom Sixpack doesn't have this at all, force real formula
            return this.stars(true, applyItems);
        }

        const baseStars = new Stars(
            this.data.hittingRating * 5,
            this.data.pitchingRating * 5,
            this.data.baserunningRating * 5,
            this.data.defenseRating * 5
        );

        return applyItems ? baseStars.add(this.itemStars) : baseStars;
    }

    status(): PlayerStatus {
        if (this.id === "bc4187fa-459a-4c06-bbf2-4e0e013d27ce")
            return "deprecated"; // (hi sixpack)

        if (this.data.deceased) return "deceased";

        // We're making a lot of plot assumptions here :)
        if (
            this.hasMod("RETIRED", "STATIC", "DUST") ||
            (this.hasMod("LEGENDARY") && !this.hasMod("REPLICA"))
        )
            return "retired";

        const team = this.mainTeam?.teamId ?? "";
        if (exhibitionTeams.includes(team)) return "exhibition";
        if (libraryTeamIds.includes(team)) return "library";

        // Percolated players count as Coffee Cup
        if (this.hasMod("COFFEE_EXIT")) return "exhibition";

        return "active";
    }

    blood(): string {
        return bloodTypes[this.data.blood] ?? "Blood?";
    }

    coffee(): string {
        return coffeeStyles[this.data.coffee] ?? "Coffee?";
    }
}

function getMainTeam(teams: RosterEntry[]): RosterEntry | null {
    const leagueTeam = teams.find((t) => getTeamType(t.teamId) === "league");
    const specialTeam = teams.find((t) => getTeamType(t.teamId) === "special");
    const libraryTeam = teams.find((t) => getTeamType(t.teamId) === "library");
    return leagueTeam ?? specialTeam ?? libraryTeam ?? null;
}

const bloodTypes = [
    "A",
    "AAA",
    "AA",
    "Acidic",
    "Basic",
    "O",
    "O No",
    "H₂O",
    "Electric",
    "Love",
    "Fire",
    "Psychic",
    "Grass",
];

const coffeeStyles = [
    "Black",
    "Light & Sweet",
    "Macchiato",
    "Cream & Sugar",
    "Cold Brew",
    "Flat White",
    "Americano",
    "Coffee?",
    "Heavy Foam",
    "Latte",
    "Decaf",
    "Milk Substitute",
    "Plenty of Sugar",
    "Anything",
];

const exhibitionTeams = [
    "d2634113-b650-47b9-ad95-673f8e28e687", // Data Witches
    "3b0a289b-aebd-493c-bc11-96793e7216d5", // Artists
    "7fcb63bc-11f2-40b9-b465-f1d458692a63", // Real Game Band
];

export function extractPlayerMods(player: BlaseballPlayer): string[] {
    const permAttr = player.permAttr ?? [];
    const seasAttr = player.seasAttr ?? [];
    const weekAttr = player.weekAttr ?? [];
    const gameAttr = player.gameAttr ?? [];
    const itemAttr = player.itemAttr ?? [];
    return [...permAttr, ...itemAttr, ...seasAttr, ...weekAttr, ...gameAttr];
}

export function getAllModIds(
    players: ChroniclerEntity<BlaseballPlayer>[]
): string[] {
    const map: Record<string, boolean> = {};
    for (const p of players) {
        for (const mod of extractPlayerMods(p.data)) {
            map[mod] = true;
        }
    }
    return Object.keys(map);
}
