import clsx from "clsx";
import { CellComponent, CellProps } from "./columns";
import React from "react";
import Tooltip from "rc-tooltip";
import { useAppSelector } from "../../hooks";
import { StatName } from "../../models/AdvancedStats";
import { Stars } from "../../models/Stars";
import { Item } from "../../models/Item";

function NumericStat(props: {
    value: number | null;
    items: Item[];
    itemValue: (item: Item) => number;
    tiers: number[];
    inverse: boolean;
}) {
    if (props.value === null) return <td className="numeric-stat">-</td>;

    const applyItemAdjustments = useAppSelector(
        (state) => state.tableOptions.applyItemAdjustments
    );

    const itemValues = applyItemAdjustments
        ? props.items
              .map((item) => ({
                  item,
                  value: props.itemValue(item),
              }))
              .filter((i) => i.value)
        : [];

    const itemValue = itemValues.reduce((a, b) => a + b.value, 0);
    const value = props.value + itemValue;
    const tier = getTier(value, props.tiers, props.inverse);

    const tableCell = (
        <td
            className={clsx(
                "numeric-stat",
                `numeric-stat-${tier}`,
                itemValue && "numeric-stat-item"
            )}
        >
            {value.toFixed(3)}
        </td>
    );

    if (itemValue) {
        return (
            <Tooltip
                placement="top"
                overlay={
                    <div>
                        {itemValues.map((i) => {
                            const sign = i.value > 0 ? "+" : "";
                            return (
                                <span>
                                    {i.item.data.name}: {sign}
                                    {i.value.toFixed(3)}
                                </span>
                            );
                        })}
                    </div>
                }
            >
                {tableCell}
            </Tooltip>
        );
    } else {
        return tableCell;
    }
}

export function advancedStat(
    stat: StatName,
    tiers?: number[],
    inverse?: boolean
): CellComponent {
    function Cell(props: CellProps) {
        const value = props.player.stats.get(stat);

        return (
            <NumericStat
                value={value}
                items={props.player.items}
                itemValue={(i) => i.stats.get(stat)}
                tiers={tiers ?? attrTiers}
                inverse={inverse ?? false}
            />
        );
    }

    return Cell;
}

export function starStat(
    accessor: (stars: Stars) => number,
    tiers: number[]
): CellComponent {
    function Cell(props: CellProps) {
        const useRealStars = useAppSelector(
            (state) => state.tableOptions.useRealStars
        );

        const value = accessor(props.player.stars(useRealStars));

        return (
            <NumericStat
                value={value}
                items={props.player.items}
                itemValue={(i) => accessor(i.stars)}
                tiers={tiers}
                inverse={false}
            />
        );
    }

    return Cell;
}

export const attrTiers = [0.125, 0.35, 0.45, 0.75, 1.0];
export const starTiers = [1, 2, 3, 4, 5];
export const combinedStarTiers = [4, 8, 12, 16, 20];

function getTier(value: number, tiers: number[], inverse: boolean): number {
    const tierValue = inverse ? 1 - value : value;
    for (let i = 0; i < tiers.length; i++) {
        if (tierValue < tiers[i]) return i;
    }
    return tiers.length;
}
