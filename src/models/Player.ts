import {
    BlaseballPlayer,
    BlaseballTeam,
    ChroniclerPlayer,
    PlayerItem,
} from "../api/types";
import { getTeamType } from "../teams";
import { AdvancedStats } from "./AdvancedStats";

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
    | "exhibition";

export interface PlayerStars {
    combined: number;
    batting: number;
    pitching: number;
    baserunning: number;
    defense: number;
}

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
    public readonly itemStars: PlayerStars;

    constructor(
        player: ChroniclerPlayer,
        teams: Record<string, BlaseballTeam>,
        roster: Record<string, RosterEntry[]>
    ) {
        this.id = player.id;
        this.data = player.data;
        this.teams = roster[player.id] ?? [];

        this.mainTeam = getMainTeam(this.teams);
        this.mainTeamData = this.mainTeam ? teams[this.mainTeam.teamId] : null;

        this.mods = extractPlayerMods(this.data);

        this.stats = AdvancedStats.fromPlayer(this.data);
        this.itemStats = AdvancedStats.fromItems(this.data.items ?? []);
        this.adjustedStats = this.stats.add(this.itemStats);
        this.itemStars = getItemStars(this.data.items ?? []);
    }

    hasMod(...mods: string[]): boolean {
        // TODO: O(n^2)
        for (const mod of mods) {
            if (this.mods.includes(mod)) return true;
        }
        return false;
    }

    stars(realStars = true, applyItems = false): PlayerStars {
        if (this.data.hittingRating === undefined) realStars = true;
        if (realStars) {
            const stats = applyItems ? this.adjustedStats : this.stats;
            return stats.stars();
        }
        return this.providedStars(applyItems);
    }

    providedStars(applyItems = false): PlayerStars {
        if (this.data.hittingRating === undefined) {
            // Phantom Sixpack doesn't have this at all, force real formula
            return this.stars(true, applyItems);
        }

        const stars = {
            batting: this.data.hittingRating * 5,
            pitching: this.data.pitchingRating * 5,
            baserunning: this.data.baserunningRating * 5,
            defense: this.data.defenseRating * 5,
            combined:
                (this.data.hittingRating +
                    this.data.pitchingRating +
                    this.data.baserunningRating +
                    this.data.defenseRating) *
                5,
        };

        if (applyItems) {
            stars.batting += this.itemStars.batting;
            stars.pitching += this.itemStars.pitching;
            stars.baserunning += this.itemStars.baserunning;
            stars.defense += this.itemStars.defense;
            stars.combined += this.itemStars.combined;
        }

        return stars;
    }

    status(): PlayerStatus {
        if (this.id === "bc4187fa-459a-4c06-bbf2-4e0e013d27ce")
            return "deprecated"; // (hi sixpack)

        if (this.data.deceased) return "deceased";

        // We're making a lot of plot assumptions here :)
        if (this.hasMod("RETIRED", "STATIC", "LEGENDARY")) return "retired";

        const team = this.mainTeam?.teamId ?? "";
        if (exhibitionTeams.includes(team)) return "exhibition";

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
    return leagueTeam ?? specialTeam ?? null;
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

export function getAllModIds(players: BlaseballPlayer[]): string[] {
    const map: Record<string, boolean> = {};
    for (const p of players) {
        for (const mod of extractPlayerMods(p)) {
            map[mod] = true;
        }
    }
    return Object.keys(map);
}

function getItemStars(items: PlayerItem[]): PlayerStars {
    const stars = {
        batting: 0,
        pitching: 0,
        baserunning: 0,
        defense: 0,
        combined: 0,
    };
    for (const item of items) {
        stars.batting += item.hittingRating * 5;
        stars.pitching += item.pitchingRating * 5;
        stars.baserunning += item.baserunningRating * 5;
        stars.defense += item.defenseRating * 5;
    }
    stars.combined =
        stars.batting + stars.pitching + stars.baserunning + stars.defense;
    return stars;
}
