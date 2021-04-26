import {
    Attribute,
    baserunningAttributes,
    battingAttributes,
    Category,
    cinnamon,
    defenseAttributes,
    pitchingAttributes,
    pressurization,
} from "../../attributes";
import { TableOptionsSlice } from "../../store/tableOptionsSlice";
import {
    bloodTypes,
    coffeeStyles,
    getCombinedFakeStars,
    getCombinedStars,
} from "../../players";
import { PlayerMeta } from "../../types";
import { positionSortKey as getPositionSortKey } from "../../utils";
import { PlayerName, PlayerPosition, PlayerTeam } from "./cells";
import { attrTiers, combinedStarTiers, numericStat, starTiers } from "./stats";
import { BlaseballPlayer } from "../../api/types";

export function getColumns(options: TableOptionsSlice): ColumnGroup[] {
    const combinedStarGetter = options.useRealStars
        ? getCombinedStars
        : getCombinedFakeStars;

    const cols = options.columns;

    const groups: ColumnGroup[] = [
        {
            name: "Info",
            columns: [
                {
                    id: "name",
                    name: "Name",
                    render: PlayerName,
                    sortKey: (p) => p.name,
                },
                {
                    id: "team",
                    name: "Team",
                    render: PlayerTeam,
                    sortKey: (_, meta) => meta.mainTeam?.teamId ?? "",
                    hidden: !cols.team,
                },
                {
                    id: "position",
                    name: "Position",
                    render: PlayerPosition,
                    sortKey: (_, meta) => getPositionSortKey(meta),
                    hidden: !cols.position,
                },
                {
                    id: "combinedStars",
                    name: "🌟",
                    alt: "Combined Stars",
                    render: numericStat(combinedStarGetter, combinedStarTiers),
                    sortKey: combinedStarGetter,
                    hidden: !options.showAdvancedStats,
                },
            ],
        },
        {
            name: "Stars",
            columns: [
                {
                    id: "combinedStars",
                    name: "🌟",
                    alt: "Combined Stars",
                    render: numericStat(combinedStarGetter, combinedStarTiers),
                    sortKey: combinedStarGetter,
                    hidden: options.showAdvancedStats,
                },
                basicStar(battingAttributes, options, !cols.batting),
                basicStar(pitchingAttributes, options, !cols.pitching),
                basicStar(baserunningAttributes, options, !cols.baserunning),
                basicStar(defenseAttributes, options, !cols.defense),
            ],
            hidden: options.showAdvancedStats,
        },
        ...advancedStats(options),
        {
            name: "Misc",
            columns: [
                {
                    id: "soul",
                    name: "Soul",
                    alt: "Soul",
                    sortKey: (p) => p.soul,
                    render: ({ player }) => (
                        <td className="numeric-stat">{player.player.soul}</td>
                    ),
                    hidden: !options.columns.misc,
                },
                {
                    id: "fate",
                    name: "Fate",
                    alt: "Fate",
                    sortKey: (p) => p.fate ?? -1,
                    render: ({ player }) => (
                        <td className="numeric-stat">{player.player.fate}</td>
                    ),
                    hidden: !options.columns.misc,
                },
                {
                    id: "fingers",
                    name: "Fingers",
                    alt: "Number of fingers",
                    sortKey: (p) => p.totalFingers,
                    render: ({ player }) => (
                        <td className="numeric-stat">
                            {player.player.totalFingers}
                        </td>
                    ),
                    hidden: !options.columns.misc,
                },
                {
                    id: "allergy",
                    name: "Allergy",
                    alt: "Peanut Allergy",
                    sortKey: (p) => (p.peanutAllergy ? 1 : 0),
                    render: ({ player }) => (
                        <td>{player.player.peanutAllergy ? "🤢" : "😋"}</td>
                    ),
                    hidden: !options.columns.misc,
                },
                {
                    id: "eDensity",
                    name: "eDensity",
                    alt: "eDensity",
                    sortKey: (p) => p.eDensity ?? null,
                    render: ({ player }) => (
                        <td className="numeric-stat">
                            {player.player.eDensity
                                ? player.player.eDensity.toFixed(2)
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
                    sortKey: (p) => p.blood ?? -1,
                    render: ({ player }) => (
                        <td className="player-blood">
                            {bloodTypes[player.player.blood] ?? "Blood?"}
                        </td>
                    ),
                },
                {
                    id: "coffee",
                    name: "Coffee",
                    sortKey: (p) => p.coffee ?? -1,
                    render: ({ player }) => (
                        <td className="player-coffee">
                            {coffeeStyles[player.player.coffee] ?? "Coffee?"}
                        </td>
                    ),
                },
                {
                    id: "ritual",
                    name: "Ritual",
                    sortKey: (p) => p.ritual ?? null,
                    render: ({ player }) => (
                        <td className="player-ritual">
                            {player.player.ritual}
                        </td>
                    ),
                },
            ],
        },
    ];

    return groups
        .map((g) => ({ ...g, columns: g.columns.filter((c) => !c.hidden) }))
        .filter((g) => !g.hidden && g.columns.length > 0);
}

function advancedStats(options: TableOptionsSlice): ColumnGroup[] {
    if (!options.showAdvancedStats) return [];
    const cols = options.columns;
    return [
        statCategoryGroup(battingAttributes, options, !cols.batting),
        statCategoryGroup(pitchingAttributes, options, !cols.pitching),
        statCategoryGroup(baserunningAttributes, options, !cols.baserunning),
        statCategoryGroup(defenseAttributes, options, !cols.defense),
        {
            name: "Vibes",
            columns: [
                statAttr(pressurization, !options.columns.vibestats),
                statAttr(cinnamon, !options.columns.vibestats),
            ],
            hidden: !cols.vibestats,
        },
    ];
}

function statCategoryGroup(
    category: Category,
    options: TableOptionsSlice,
    hidden: boolean
): ColumnGroup {
    const starGetter = options.useRealStars
        ? category.stars
        : category.fakeStars;

    return {
        name: category.name,
        columns: [
            {
                id: `${category.id}Stars`,
                name: "⭐",
                alt: `${category.name} Stars`,
                sortKey: starGetter,
                render: numericStat(starGetter, starTiers),
            },
            ...category.attrs.map((a) => statAttr(a)),
        ],
        hidden,
    };
}

function statAttr(attr: Attribute, hidden = false): Column {
    return {
        id: attr.shortName,
        name: attr.shortName,
        alt: attr.name,
        sortKey: attr.accessor,
        render: numericStat(attr.accessor, attrTiers, attr.inverse),
        hidden,
    };
}

function basicStar(
    category: Category,
    options: TableOptionsSlice,
    hidden: boolean
) {
    const starGetter = options.useRealStars
        ? category.stars
        : category.fakeStars;

    return {
        id: `${category.id}Stars`,
        name: category.name,
        alt: `${category.name} Stars`,
        sortKey: starGetter,
        render: numericStat(starGetter, starTiers),
        hidden,
    };
}

export interface ColumnGroup {
    name: string;
    columns: Column[];
    hidden?: boolean;
}

export interface CellProps {
    player: PlayerMeta;
}
export type CellComponent = (props: CellProps) => JSX.Element;

export interface Column {
    id: string;
    name: string;
    alt?: string;
    hidden?: boolean;
    sortKey?: (
        player: BlaseballPlayer,
        meta: PlayerMeta
    ) => string | number | null;
    render?: CellComponent;
}
