import { BlaseballPlayer } from "../api/types";
import { Stars } from "./Stars";

export type StatName =
    | "tragicness"
    | "buoyancy"
    | "thwackability"
    | "moxie"
    | "divinity"
    | "musclitude"
    | "patheticism"
    | "martyrdom"
    | "cinnamon"
    | "baseThirst"
    | "laserlikeness"
    | "continuation"
    | "indulgence"
    | "groundFriction"
    | "shakespearianism"
    | "suppression"
    | "unthwackability"
    | "coldness"
    | "overpowerment"
    | "ruthlessness"
    | "pressurization"
    | "omniscience"
    | "tenaciousness"
    | "watchfulness"
    | "anticapitalism"
    | "chasiness";

export class AdvancedStats {
    constructor(private data: Record<StatName, number>) {}

    static new(): AdvancedStats {
        const record: Partial<Record<StatName, number>> = {};
        for (const id of statIndices) record[id] = 0;
        return new AdvancedStats(record as Record<StatName, number>);
    }

    static fromPlayer(player: BlaseballPlayer): AdvancedStats {
        const stats = {
            ...player,
            pressurization: player.pressurization ?? 0,
            cinnamon: player.cinnamon ?? 0,
        };
        return new AdvancedStats(stats);
    }

    get(id: StatName): number {
        return this.data[id];
    }

    add(other: AdvancedStats): AdvancedStats {
        const result = new AdvancedStats({ ...this.data });
        for (const id of statIndices) result.data[id] += other.data[id];
        return result;
    }

    stars(): Stars {
        const batting = this.battingStars();
        const pitching = this.pitchingStars();
        const baserunning = this.baserunningStars();
        const defense = this.defenseStars();
        return new Stars(batting, pitching, baserunning, defense);
    }

    battingStars(): number {
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

    pitchingStars(): number {
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

    baserunningStars(): number {
        return (
            5 *
            Math.pow(this.data.laserlikeness, 0.5) *
            Math.pow(this.data.continuation, 0.1) *
            Math.pow(this.data.baseThirst, 0.1) *
            Math.pow(this.data.indulgence, 0.1) *
            Math.pow(this.data.groundFriction, 0.1)
        );
    }

    defenseStars(): number {
        return (
            5 *
            Math.pow(this.data.omniscience, 0.2) *
            Math.pow(this.data.tenaciousness, 0.2) *
            Math.pow(this.data.watchfulness, 0.1) *
            Math.pow(this.data.anticapitalism, 0.1) *
            Math.pow(this.data.chasiness, 0.1)
        );
    }
}

export const statIndices: StatName[] = [
    "tragicness",
    "buoyancy",
    "thwackability",
    "moxie",
    "divinity",
    "musclitude",
    "patheticism",
    "martyrdom",
    "cinnamon",
    "baseThirst",
    "laserlikeness",
    "continuation",
    "indulgence",
    "groundFriction",
    "shakespearianism",
    "suppression",
    "unthwackability",
    "coldness",
    "overpowerment",
    "ruthlessness",
    "pressurization",
    "omniscience",
    "tenaciousness",
    "watchfulness",
    "anticapitalism",
    "chasiness",
];
