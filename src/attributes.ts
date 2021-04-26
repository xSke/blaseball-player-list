import { BlaseballPlayer } from "./api/types";
import {
    getBaserunningStars,
    getBattingStars,
    getDefenseStars,
    getPitchingStars,
} from "./players";

export interface Attribute {
    name: string;
    shortName: string;
    accessor: (p: BlaseballPlayer) => number | null;
    inverse: boolean;
}

export interface Category {
    name: string;
    id: string;
    attrs: Attribute[];
    stars: (p: BlaseballPlayer) => number;
    fakeStars: (p: BlaseballPlayer) => number;
}

export const battingAttributes: Category = {
    name: "Batting",
    id: "batting",
    attrs: [
        attr("Buoyancy", "buoy", (p) => p.buoyancy),
        attr("Divinity", "divin", (p) => p.divinity),
        attr("Martyrdom", "mrtyr", (p) => p.martyrdom),
        attr("Moxie", "moxie", (p) => p.moxie),
        attr("Musclitude", "muscl", (p) => p.musclitude),
        attr("Patheticism", "path", (p) => p.patheticism, true),
        attr("Thwackability", "thwck", (p) => p.thwackability),
        attr("Tragicness", "tragc", (p) => p.tragicness, true),
    ],
    stars: getBattingStars,
    fakeStars: (p) =>
        p.hittingRating ? p.hittingRating * 5 : getBattingStars(p),
};

export const pitchingAttributes: Category = {
    name: "Pitching",
    id: "pitching",
    attrs: [
        attr("Coldness", "cold", (p) => p.coldness),
        attr("Overpowerment", "opw", (p) => p.overpowerment),
        attr("Ruthlessness", "ruth", (p) => p.ruthlessness),
        attr("Shakespearianism", "shakes", (p) => p.shakespearianism),
        attr("Suppression", "supp", (p) => p.suppression),
        attr("Unthwackability", "untwk", (p) => p.unthwackability),
    ],
    stars: getPitchingStars,
    fakeStars: (p) =>
        p.pitchingRating ? p.pitchingRating * 5 : getPitchingStars(p),
};

export const baserunningAttributes: Category = {
    name: "Baserunning",
    id: "baserunning",
    attrs: [
        attr("Base Thirst", "thrst", (p) => p.baseThirst),
        attr("Continuation", "cont", (p) => p.continuation),
        attr("Ground Friction", "fric", (p) => p.groundFriction),
        attr("Indulgence", "indlg", (p) => p.indulgence),
        attr("Laserlikeness", "laser", (p) => p.laserlikeness),
    ],
    stars: getBaserunningStars,
    fakeStars: (p) =>
        p.baserunningRating ? p.baserunningRating * 5 : getBaserunningStars(p),
};

export const defenseAttributes: Category = {
    name: "Defense",
    id: "defense",
    attrs: [
        attr("Anticapitalism", "ancap", (p) => p.anticapitalism),
        attr("Chasiness", "chase", (p) => p.chasiness),
        attr("Omniscience", "omni", (p) => p.omniscience),
        attr("Tenaciousness", "tenac", (p) => p.tenaciousness),
        attr("Watchfulness", "watch", (p) => p.watchfulness),
    ],
    stars: getDefenseStars,
    fakeStars: (p) =>
        p.defenseRating ? p.defenseRating * 5 : getDefenseStars(p),
};

export const allCategories = [
    battingAttributes,
    pitchingAttributes,
    baserunningAttributes,
    defenseAttributes,
];

export const pressurization: Attribute = attr(
    "Pressurization",
    "press",
    (p) => p.pressurization ?? null
);
export const cinnamon: Attribute = attr(
    "Cinnamon",
    "cinn",
    (p) => p.cinnamon ?? null
);

function attr(
    name: string,
    shortName: string,
    accessor: (p: BlaseballPlayer) => number | null,
    inverse = false
) {
    return { name, shortName, accessor, inverse };
}
