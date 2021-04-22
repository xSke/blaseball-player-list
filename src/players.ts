import { BlaseballPlayer, PlayerMeta } from "./types";

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

export function getAllModIds(players: PlayerMeta[]): string[] {
    const map: Record<string, boolean> = {};
    for (const p of players) {
        for (const mod of p.modifiers) {
            map[mod] = true;
        }
    }
    return Object.keys(map);
}
