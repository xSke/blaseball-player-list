import { TableOptionsSlice } from "../../store/tableOptionsSlice";
import { positionSortKey as getPositionSortKey } from "../../utils";
import { PlayerName, PlayerPosition, PlayerTeam } from "./cells";
import { advancedStat, attrTiers, numericStat, starTiers } from "./stats";
import { Player, PlayerStars, StatName } from "../../models/Player";

export function getColumns(opts: TableOptionsSlice): ColumnGroup[] {
    const cols = opts.columns;

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
                    opts,
                    opts.showAdvancedStats,
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
                    opts,
                    opts.showAdvancedStats,
                    "🌟"
                ),
                star(
                    "Batting",
                    (s) => s.batting,
                    opts,
                    !cols.batting,
                    "Batting"
                ),
                star(
                    "Pitching",
                    (s) => s.pitching,
                    opts,
                    !cols.pitching,
                    "Pitching"
                ),
                star(
                    "Baserunning",
                    (s) => s.baserunning,
                    opts,
                    !cols.baserunning,
                    "Baserunning"
                ),
                star(
                    "Defense",
                    (s) => s.defense,
                    opts,
                    !cols.defense,
                    "Defense"
                ),
            ],
            hidden: opts.showAdvancedStats,
        },
        {
            name: "Batting",
            hidden: !cols.batting,
            columns: [
                star("Batting", (s) => s.batting, opts),
                attr(opts, "Buoyancy", "buoy", "buoyancy"),
                attr(opts, "Divinity", "divin", "divinity"),
                attr(opts, "Martyrdom", "mrtyr", "martyrdom"),
                attr(opts, "Moxie", "moxie", "moxie"),
                attr(opts, "Musclitude", "muscl", "musclitude"),
                attr(opts, "Patheticism", "path", "patheticism"),
                attr(opts, "Thwackability", "thwck", "thwackability"),
                attr(opts, "Tragicness", "tragc", "tragicness", true),
            ],
        },
        {
            name: "Pitching",
            hidden: !cols.pitching,
            columns: [
                star("Pitching", (s) => s.pitching, opts),
                attr(opts, "Coldness", "cold", "coldness"),
                attr(opts, "Overpowerment", "opw", "overpowerment"),
                attr(opts, "Ruthlessness", "ruth", "ruthlessness"),
                attr(opts, "Shakespearianism", "shakes", "shakespearianism"),
                attr(opts, "Suppression", "supp", "suppression"),
                attr(opts, "Unthwackability", "untwk", "unthwackability"),
            ],
        },
        {
            name: "Baserunning",
            hidden: !cols.baserunning,
            columns: [
                star("Baserunning", (s) => s.baserunning, opts),
                attr(opts, "Base Thirst", "thrst", "baseThirst"),
                attr(opts, "Continuation", "cont", "continuation"),
                attr(opts, "Ground Friction", "fric", "groundFriction"),
                attr(opts, "Indulgence", "indlg", "indulgence"),
                attr(opts, "Laserlikeness", "laser", "laserlikeness"),
            ],
        },
        {
            name: "Defense",
            hidden: !cols.defense,
            columns: [
                star("Defense", (s) => s.defense, opts),
                attr(opts, "Anticapitalism", "ancap", "anticapitalism"),
                attr(opts, "Chasiness", "chase", "chasiness"),
                attr(opts, "Omniscience", "omni", "omniscience"),
                attr(opts, "Tenaciousness", "tenac", "tenaciousness"),
                attr(opts, "Watchfulness", "watch", "watchfulness"),
            ],
        },
        {
            name: "Vibes",
            hidden: !cols.vibestats,
            columns: [
                attr(opts, "Pressurization", "press", "pressurization"),
                attr(opts, "Cinnamon", "cinn", "cinnamon"),
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
                    hidden: !opts.columns.misc,
                },
                {
                    id: "fate",
                    name: "Fate",
                    alt: "Fate",
                    sortKey: (p) => p.data.fate ?? -1,
                    render: ({ player }) => (
                        <td className="numeric-stat">{player.data.fate}</td>
                    ),
                    hidden: !opts.columns.misc,
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
                    hidden: !opts.columns.misc,
                },
                {
                    id: "allergy",
                    name: "Allergy",
                    alt: "Peanut Allergy",
                    sortKey: (p) => (p.data.peanutAllergy ? 1 : 0),
                    render: ({ player }) => (
                        <td>{player.data.peanutAllergy ? "🤢" : "😋"}</td>
                    ),
                    hidden: !opts.columns.misc,
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
                    hidden: !opts.columns.misc,
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
    opts: TableOptionsSlice,
    name: string,
    shortname: string,
    stat: StatName,
    inverse = false
): Column {
    return {
        id: shortname,
        name: shortname,
        alt: name,
        sortKey: (p) =>
            p.stats[stat] + (opts.applyItemAdjustments ? p.itemStats[stat] : 0),
        render: advancedStat(stat, attrTiers, inverse),
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
