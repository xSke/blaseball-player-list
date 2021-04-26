import { BlaseballPlayer, BlaseballTeam, ChroniclerPlayer } from "../api/types";
import { getTeamType } from "../teams";

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
    }

    hasMod(...mods: string[]): boolean {
        // TODO: O(n^2)
        for (const mod of mods) {
            if (this.mods.includes(mod)) return true;
        }
        return false;
    }

    calculateBattingStars(): number {
        return (
            5 *
            Math.pow(1 - this.data.tragicness, 0.01) *
            Math.pow(this.data.buoyancy, 0) *
            Math.pow(this.data.thwackability, 0.35) *
            Math.pow(this.data.moxie, 0.075) *
            Math.pow(this.data.divinity, 0.35) *
            Math.pow(this.data.musclitude, 0.075) *
            Math.pow(1 - this.data.patheticism, 0.05) *
            Math.pow(this.data.martyrdom, 0.02)
        );
    }

    calculatePitchingStars(): number {
        return (
            5 *
            Math.pow(this.data.shakespearianism, 0.1) *
            Math.pow(this.data.suppression, 0) *
            Math.pow(this.data.unthwackability, 0.5) *
            Math.pow(this.data.coldness, 0.025) *
            Math.pow(this.data.overpowerment, 0.15) *
            Math.pow(this.data.ruthlessness, 0.4)
        );
    }

    calculateBaserunningStars(): number {
        return (
            5 *
            Math.pow(this.data.laserlikeness, 0.5) *
            Math.pow(this.data.continuation, 0.1) *
            Math.pow(this.data.baseThirst, 0.1) *
            Math.pow(this.data.indulgence, 0.1) *
            Math.pow(this.data.groundFriction, 0.1)
        );
    }

    calculateDefenseStars(): number {
        return (
            5 *
            Math.pow(this.data.omniscience, 0.2) *
            Math.pow(this.data.tenaciousness, 0.2) *
            Math.pow(this.data.watchfulness, 0.1) *
            Math.pow(this.data.anticapitalism, 0.1) *
            Math.pow(this.data.chasiness, 0.1)
        );
    }

    stars(realStars = true): PlayerStars {
        // Phantom Sixpack doesn't have this at all, force real formula
        if (this.data.hittingRating === undefined) realStars = true;

        const batting = realStars
            ? this.calculateBattingStars()
            : this.data.hittingRating * 5;

        const pitching = realStars
            ? this.calculateBattingStars()
            : this.data.pitchingRating * 5;

        const baserunning = realStars
            ? this.calculateBattingStars()
            : this.data.baserunningRating * 5;

        const defense = realStars
            ? this.calculateBattingStars()
            : this.data.defenseRating * 5;

        const combined = batting + pitching + baserunning + defense;
        return { batting, pitching, baserunning, defense, combined };
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
