import { TableOptionsSlice } from "../../store/tableOptionsSlice";
import { positionSortKey as getPositionSortKey } from "../../utils";
import { PlayerName, PlayerPosition, PlayerTeam, PlayerItem } from "./cells";
import { attrTiers, combinedStarTiers, numericStat, starTiers } from "./stats";
import { BlaseballPlayer } from "../../api/types";
import { Player, PlayerStars } from "../../models/Player";

export function getColumns(options: TableOptionsSlice): ColumnGroup[] {
    const cols = options.columns;

    const groups: ColumnGroup[] = [
        {
            name: "Info",
            columns: [
                {
                    id: "name",
                    name: "Name",
                    render: PlayerName,
                    sortKey: (p) => p.data.name,
                },
                {
                    id: "item",
                    name: "Items",
                    render: PlayerItem,
                    sortKey: (p) => p.data.items ? p.data.items.length : 0
                },
                {
                    id: "team",
                    name: "Team",
                    render: PlayerTeam,
                    sortKey: (p) => p.mainTeam?.teamId ?? "",
                    hidden: !cols.team,
                },
                {
                    id: "position",
                    name: "Position",
                    render: PlayerPosition,
                    sortKey: (p) => getPositionSortKey(p),
                    hidden: !cols.position,
                },
                star(
                    "Combined",
                    (s) => s.combined,
                    options,
                    options.showAdvancedStats,
                    "🌟"
                ),
            ],
        },
        {
            name: "Stars",
            columns: [
                star(
                    "Combined",
                    (s) => s.combined,
                    options,
                    options.showAdvancedStats,
                    "🌟"
                ),
                star(
                    "Batting",
                    (s) => s.batting,
                    options,
                    !cols.batting,
                    "Batting"
                ),
                star(
                    "Pitching",
                    (s) => s.pitching,
                    options,
                    !cols.pitching,
                    "Pitching"
                ),
                star(
                    "Baserunning",
                    (s) => s.baserunning,
                    options,
                    !cols.baserunning,
                    "Baserunning"
                ),
                star(
                    "Defense",
                    (s) => s.defense,
                    options,
                    !cols.defense,
                    "Defense"
                ),
            ],
            hidden: options.showAdvancedStats,
        },
        {
            name: "Batting",
            hidden: !cols.batting,
            columns: [
                star("Batting", (s) => s.batting, options),
                attr("Buoyancy", "buoy", (p) => p.buoyancy),
                attr("Divinity", "divin", (p) => p.divinity),
                attr("Martyrdom", "mrtyr", (p) => p.martyrdom),
                attr("Moxie", "moxie", (p) => p.moxie),
                attr("Musclitude", "muscl", (p) => p.musclitude),
                attr("Patheticism", "path", (p) => p.patheticism, true),
                attr("Thwackability", "thwck", (p) => p.thwackability),
                attr("Tragicness", "tragc", (p) => p.tragicness, true),
            ],
        },
        {
            name: "Pitching",
            hidden: !cols.pitching,
            columns: [
                star("Pitching", (s) => s.pitching, options),
                attr("Coldness", "cold", (p) => p.coldness),
                attr("Overpowerment", "opw", (p) => p.overpowerment),
                attr("Ruthlessness", "ruth", (p) => p.ruthlessness),
                attr("Shakespearianism", "shakes", (p) => p.shakespearianism),
                attr("Suppression", "supp", (p) => p.suppression),
                attr("Unthwackability", "untwk", (p) => p.unthwackability),
            ],
        },
        {
            name: "Baserunning",
            hidden: !cols.baserunning,
            columns: [
                star("Baserunning", (s) => s.baserunning, options),
                attr("Base Thirst", "thrst", (p) => p.baseThirst),
                attr("Continuation", "cont", (p) => p.continuation),
                attr("Ground Friction", "fric", (p) => p.groundFriction),
                attr("Indulgence", "indlg", (p) => p.indulgence),
                attr("Laserlikeness", "laser", (p) => p.laserlikeness),
            ],
        },
        {
            name: "Defense",
            hidden: !cols.defense,
            columns: [
                star("Defense", (s) => s.defense, options),
                attr("Anticapitalism", "ancap", (p) => p.anticapitalism),
                attr("Chasiness", "chase", (p) => p.chasiness),
                attr("Omniscience", "omni", (p) => p.omniscience),
                attr("Tenaciousness", "tenac", (p) => p.tenaciousness),
                attr("Watchfulness", "watch", (p) => p.watchfulness),
            ],
        },
        {
            name: "Vibes",
            hidden: !cols.vibestats,
            columns: [
                attr(
                    "Pressurization",
                    "press",
                    (p) => p.pressurization ?? null
                ),
                attr("Cinnamon", "cinn", (p) => p.cinnamon ?? null),
            ],
        },
        {
            name: "Misc",
            columns: [
                {
                    id: "soul",
                    name: "Soul",
                    alt: "Soul",
                    sortKey: (p) => p.data.soul,
                    render: ({ player }) => (
                        <td className="numeric-stat">{player.data.soul}</td>
                    ),
                    hidden: !options.columns.misc,
                },
                {
                    id: "fate",
                    name: "Fate",
                    alt: "Fate",
                    sortKey: (p) => p.data.fate ?? -1,
                    render: ({ player }) => (
                        <td className="numeric-stat">{player.data.fate}</td>
                    ),
                    hidden: !options.columns.misc,
                },
                {
                    id: "fingers",
                    name: "Fingers",
                    alt: "Number of fingers",
                    sortKey: (p) => p.data.totalFingers,
                    render: ({ player }) => (
                        <td className="numeric-stat">
                            {player.data.totalFingers}
                        </td>
                    ),
                    hidden: !options.columns.misc,
                },
                {
                    id: "allergy",
                    name: "Allergy",
                    alt: "Peanut Allergy",
                    sortKey: (p) => (p.data.peanutAllergy ? 1 : 0),
                    render: ({ player }) => (
                        <td>{player.data.peanutAllergy ? "🤢" : "😋"}</td>
                    ),
                    hidden: !options.columns.misc,
                },
                {
                    id: "eDensity",
                    name: "eDensity",
                    alt: "eDensity",
                    sortKey: (p) => p.data.eDensity ?? null,
                    render: ({ player }) => (
                        <td className="numeric-stat">
                            {player.data.eDensity
                                ? player.data.eDensity.toFixed(2)
                                : "-"}
                        </td>
                    ),
                    hidden: !options.columns.misc,
                },
            ],
        },
        {
            name: "Interviews",
            hidden: true, // i'll probably add this in some day
            columns: [
                {
                    id: "blood",
                    name: "Blood",
                    sortKey: (p) => p.data.blood ?? -1,
                    render: ({ player }) => (
                        <td className="player-blood">{player.blood()}</td>
                    ),
                },
                {
                    id: "coffee",
                    name: "Coffee",
                    sortKey: (p) => p.data.coffee ?? -1,
                    render: ({ player }) => (
                        <td className="player-coffee">{player.coffee()}</td>
                    ),
                },
                {
                    id: "ritual",
                    name: "Ritual",
                    sortKey: (p) => p.data.ritual ?? null,
                    render: ({ player }) => (
                        <td className="player-ritual">{player.data.ritual}</td>
                    ),
                },
            ],
        },
    ];

    return groups
        .map((g) => ({ ...g, columns: g.columns.filter((c) => !c.hidden) }))
        .filter((g) => !g.hidden && g.columns.length > 0);
}

function star(
    name: string,
    accessor: (s: PlayerStars) => number,
    options: TableOptionsSlice,
    hidden = false,
    display = "⭐"
): Column {
    const getter = (p: Player) => accessor(p.stars(options.useRealStars));
    return {
        id: `${name}Stars`,
        name: display,
        alt: `${name} Stars`,
        sortKey: getter,
        render: numericStat(getter, starTiers),
        hidden,
    };
}

function attr(
    name: string,
    shortname: string,
    accessor: (p: BlaseballPlayer) => number | null,
    inverse = false
): Column {
    const getter = (p: Player) => accessor(p.data);
    return {
        id: shortname,
        name: shortname,
        alt: name,
        sortKey: getter,
        render: numericStat(getter, attrTiers, inverse),
    };
}

export interface ColumnGroup {
    name: string;
    columns: Column[];
    hidden?: boolean;
}

export interface CellProps {
    player: Player;
}
export type CellComponent = (props: CellProps) => JSX.Element;

export interface Column {
    id: string;
    name: string;
    alt?: string;
    hidden?: boolean;
    sortKey?: (player: Player) => string | number | null;
    render?: CellComponent;
}
