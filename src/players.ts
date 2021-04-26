import { BlaseballPlayer, BlaseballTeam, ChroniclerPlayer } from "./api/types";
import { getTeamType } from "./teams";
import { PlayerMeta, RosterEntry } from "./types";

export function getBattingStars(player: BlaseballPlayer): number {
    return (
        5 *
        Math.pow(1 - player.tragicness, 0.01) *
        Math.pow(player.buoyancy, 0) *
        Math.pow(player.thwackability, 0.35) *
        Math.pow(player.moxie, 0.075) *
        Math.pow(player.divinity, 0.35) *
        Math.pow(player.musclitude, 0.075) *
        Math.pow(1 - player.patheticism, 0.05) *
        Math.pow(player.martyrdom, 0.02)
    );
}

export function getPitchingStars(player: BlaseballPlayer): number {
    return (
        5 *
        Math.pow(player.shakespearianism, 0.1) *
        Math.pow(player.suppression, 0) *
        Math.pow(player.unthwackability, 0.5) *
        Math.pow(player.coldness, 0.025) *
        Math.pow(player.overpowerment, 0.15) *
        Math.pow(player.ruthlessness, 0.4)
    );
}

export function getBaserunningStars(player: BlaseballPlayer): number {
    return (
        5 *
        Math.pow(player.laserlikeness, 0.5) *
        Math.pow(player.continuation, 0.1) *
        Math.pow(player.baseThirst, 0.1) *
        Math.pow(player.indulgence, 0.1) *
        Math.pow(player.groundFriction, 0.1)
    );
}

export function getDefenseStars(player: BlaseballPlayer): number {
    return (
        5 *
        Math.pow(player.omniscience, 0.2) *
        Math.pow(player.tenaciousness, 0.2) *
        Math.pow(player.watchfulness, 0.1) *
        Math.pow(player.anticapitalism, 0.1) *
        Math.pow(player.chasiness, 0.1)
    );
}

export function getCombinedStars(player: BlaseballPlayer): number {
    return (
        getBattingStars(player) +
        getPitchingStars(player) +
        getBaserunningStars(player) +
        getDefenseStars(player)
    );
}

export function getCombinedFakeStars(player: BlaseballPlayer): number {
    // phantom sixpack-proof
    if (player.hittingRating === undefined) return getCombinedStars(player);

    return (
        (player.hittingRating +
            player.pitchingRating +
            player.baserunningRating +
            player.defenseRating) *
        5
    );
}

export interface PlayerStars {
    batting: number;
    pitching: number;
    baserunning: number;
    defense: number;
    combined: number;
}

export function getPlayerStars(
    player: BlaseballPlayer,
    useRealStars = true
): PlayerStars {
    // phantom sixpack-proof
    if (useRealStars || player.hittingRating === undefined) {
        const batting = getBattingStars(player);
        const pitching = getPitchingStars(player);
        const baserunning = getBaserunningStars(player);
        const defense = getDefenseStars(player);
        const combined = batting + pitching + baserunning + defense;
        return { batting, pitching, baserunning, defense, combined };
    } else {
        const batting = player.hittingRating * 5;
        const pitching = player.pitchingRating * 5;
        const baserunning = player.baserunningRating * 5;
        const defense = player.defenseRating * 5;
        const combined = batting + pitching + baserunning + defense;
        return { batting, pitching, baserunning, defense, combined };
    }
}

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

export function getPlayerMeta(
    player: ChroniclerPlayer,
    teams: Record<string, BlaseballTeam>,
    roster: Record<string, RosterEntry[]>
): PlayerMeta {
    const modifiers = extractPlayerMods(player.data);
    const playerTeams = roster[player.id] ?? [];

    const leagueTeam = playerTeams.find(
        (t) => getTeamType(t.teamId) === "league"
    );
    const specialTeam = playerTeams.find(
        (t) => getTeamType(t.teamId) === "special"
    );
    const mainTeam = leagueTeam ?? specialTeam ?? null;

    return {
        id: player.id,
        player: player.data,
        modifiers,
        teams: playerTeams,
        mainTeam,
        mainTeamData: mainTeam ? teams[mainTeam.teamId] : null,
    };
}

export type PlayerStatus =
    | "active"
    | "deprecated"
    | "deceased"
    | "retired"
    | "exhibition";

export function getPlayerStatus(meta: PlayerMeta): PlayerStatus {
    const team = meta.mainTeam?.teamId ?? "";

    if (meta.id === "bc4187fa-459a-4c06-bbf2-4e0e013d27ce") return "deprecated"; // (hi sixpack)
    if (meta.player.deceased) return "deceased";
    if (hasModifier(meta, "RETIRED", "STATIC")) return "retired";

    if (team === "d2634113-b650-47b9-ad95-673f8e28e687") return "exhibition";
    if (team === "3b0a289b-aebd-493c-bc11-96793e7216d5") return "exhibition";
    if (team === "7fcb63bc-11f2-40b9-b465-f1d458692a63") return "exhibition";
    if (hasModifier(meta, "COFFEE_EXIT")) return "exhibition";

    return "active";
}

export function hasModifier(meta: PlayerMeta, ...mods: string[]): boolean {
    return mods.some((m) => meta.modifiers.includes(m));
}

export const bloodTypes = [
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

export const coffeeStyles = [
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
