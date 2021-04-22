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
import { getCombinedFakeStars, getCombinedStars } from "../../players";
import { BlaseballPlayer, PlayerMeta } from "../../types";
import { positionSortKey as getPositionSortKey } from "../../utils";
import { ListOptions } from "../sidebar/ListOptionsSelect";
import { PlayerName, PlayerPosition, PlayerTeam } from "./cells";
import { attrTiers, combinedStarTiers, numericStat, starTiers } from "./stats";

export function getColumns(options: ListOptions): ColumnGroup[] {
    const combinedStarGetter = options.useRealStars
        ? getCombinedStars
        : getCombinedFakeStars;

    return [
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
                },
                {
                    id: "position",
                    name: "Position",
                    render: PlayerPosition,
                    sortKey: (_, meta) => getPositionSortKey(meta),
                },
                {
                    id: "combinedStars",
                    name: "🌟",
                    alt: "Combined Stars",
                    render: numericStat(combinedStarGetter, combinedStarTiers),
                    sortKey: combinedStarGetter,
                },
            ],
        },
        ...(options.showAdvancedStats
            ? advancedStats(options)
            : basicStars(options)),
        {
            name: "Misc",
            columns: [
                statAttr(pressurization),
                statAttr(cinnamon),
                {
                    id: "soul",
                    name: "Soul",
                    sortKey: (p) => p.soul,
                    render: ({ player }) => <td>{player.player.soul}</td>,
                },
                {
                    id: "fate",
                    name: "Fate",
                    sortKey: (p) => p.fate,
                    render: ({ player }) => <td>{player.player.fate}</td>,
                },
                {
                    id: "fingers",
                    name: "Fingers",
                    sortKey: (p) => p.totalFingers,
                    render: ({ player }) => (
                        <td>{player.player.totalFingers}</td>
                    ),
                },
                {
                    id: "eDensity",
                    name: "eD",
                    alt: "eDensity",
                    sortKey: (p) => p.eDensity ?? null,
                    render: ({ player }) => (
                        <td>
                            {player.player.eDensity
                                ? player.player.eDensity.toFixed(2)
                                : "-"}
                        </td>
                    ),
                },
            ],
        },
    ];
}

function advancedStats(options: ListOptions): ColumnGroup[] {
    const groups = [];
    if (options.columns.includes("batting"))
        groups.push(statCategoryGroup(battingAttributes, options));

    if (options.columns.includes("pitching"))
        groups.push(statCategoryGroup(pitchingAttributes, options));

    if (options.columns.includes("baserunning"))
        groups.push(statCategoryGroup(baserunningAttributes, options));

    if (options.columns.includes("defense"))
        groups.push(statCategoryGroup(defenseAttributes, options));

    return groups;
}

function statCategoryGroup(
    category: Category,
    options: ListOptions
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
            ...category.attrs.map(statAttr),
        ],
    };
}

function statAttr(attr: Attribute): Column {
    return {
        id: attr.shortName,
        name: attr.shortName,
        alt: attr.name,
        sortKey: attr.accessor,
        render: numericStat(attr.accessor, attrTiers, attr.inverse),
    };
}

function basicStars(options: ListOptions): ColumnGroup[] {
    return [
        {
            name: "Stars",
            columns: [
                basicStar(battingAttributes, options),
                basicStar(pitchingAttributes, options),
                basicStar(baserunningAttributes, options),
                basicStar(defenseAttributes, options),
            ],
        },
    ];
}

function basicStar(category: Category, options: ListOptions) {
    const starGetter = options.useRealStars
        ? category.stars
        : category.fakeStars;

    return {
        id: `${category.id}Stars`,
        name: category.name,
        alt: `${category.name} Stars`,
        sortKey: starGetter,
        render: numericStat(starGetter, starTiers),
    };
}

export interface ColumnGroup {
    name: string;
    columns: Column[];
}

export interface CellProps {
    player: PlayerMeta;
    options: ListOptions;
}
export type CellComponent = (props: CellProps) => JSX.Element;

export interface Column {
    id: string;
    name: string;
    alt?: string;
    sortKey?: (
        player: BlaseballPlayer,
        meta: PlayerMeta
    ) => string | number | null;
    render?: CellComponent;
}
