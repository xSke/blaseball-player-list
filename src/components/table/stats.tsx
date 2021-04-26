import clsx from "clsx";
import { PlayerStars } from "../../models/Player";
import { CellComponent, CellProps } from "./columns";
import React from "react";
import Tooltip from "rc-tooltip";
import { useAppSelector } from "../../hooks";
import { StatName } from "../../models/AdvancedStats";

function NumericStat(props: {
    value: number | null;
    itemValue: number | null;
    tiers: number[];
    inverse: boolean;
}) {
    if (props.value === null) return <td className="numeric-stat">-</td>;

    const applyItemAdjustments = useAppSelector(
        (state) => state.tableOptions.applyItemAdjustments
    );

    const itemValue =
        applyItemAdjustments && props.itemValue ? props.itemValue ?? 0 : 0;
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
        const prefix = `Item: ${itemValue > 0 ? "+" : ""}`;
        return (
            <Tooltip
                placement="top"
                overlay={
                    <span>
                        {prefix}
                        {itemValue.toFixed(3)}
                    </span>
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
        const itemValue = props.player.itemStats.get(stat);

        return (
            <NumericStat
                value={value}
                itemValue={itemValue}
                tiers={tiers ?? attrTiers}
                inverse={inverse ?? false}
            />
        );
    }

    return Cell;
}

export function starStat(
    accessor: (stars: PlayerStars) => number,
    tiers: number[]
): CellComponent {
    function Cell(props: CellProps) {
        const useRealStars = useAppSelector(
            (state) => state.tableOptions.useRealStars
        );

        const value = accessor(props.player.stars(useRealStars));
        const itemValue = accessor(props.player.itemStars);

        return (
            <NumericStat
                value={value}
                itemValue={itemValue}
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
