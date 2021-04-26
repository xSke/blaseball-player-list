import clsx from "clsx";
import { Player, StatName } from "../../models/Player";
import { CellComponent, CellProps } from "./columns";
import React from "react";
import Tooltip from "rc-tooltip";
import { useAppSelector } from "../../hooks";

export function advancedStat(
    stat: StatName,
    tiers?: number[],
    inverse?: boolean
): CellComponent {
    const actualTiers = tiers ?? attrTiers;

    function Cell(props: CellProps): JSX.Element {
        const applyItemAdjustments = useAppSelector(
            (state) => state.tableOptions.applyItemAdjustments
        );

        const baseValue = props.player.stats[stat];
        if (baseValue === null) return <td className="numeric-stat">-</td>;
        const itemAdj = applyItemAdjustments ? props.player.itemStats[stat] : 0;
        const value = baseValue + itemAdj;

        const tierValue = inverse ? 1 - value : value;
        const tier = getTier(tierValue, actualTiers);

        const hasItem = itemAdj != 0;

        const inner = (
            <td
                className={clsx(
                    "numeric-stat",
                    `numeric-stat-${tier}`,
                    hasItem && "numeric-stat-item"
                )}
            >
                {value.toFixed(3)}
            </td>
        );

        if (hasItem)
            return (
                <Tooltip
                    placement="top"
                    overlay={
                        <span>
                            {`Item: ${itemAdj > 0 ? "+" : ""}${itemAdj.toFixed(
                                3
                            )}`}
                        </span>
                    }
                >
                    {inner}
                </Tooltip>
            );
        else return inner;
    }

    return Cell;
}

export function numericStat(
    accessor: (p: Player) => number | null,
    tiers?: number[],
    inverse?: boolean
): CellComponent {
    const actualTiers = tiers ?? attrTiers;

    function Cell(props: CellProps) {
        const value = accessor(props.player);
        if (value === null) return <td className="numeric-stat">-</td>;

        const tierValue = inverse ? 1 - value : value;
        const tier = getTier(tierValue, actualTiers);

        return (
            <td className={`numeric-stat numeric-stat-${tier}`}>
                {value.toFixed(3)}
            </td>
        );
    }

    return Cell;
}

export const attrTiers = [0.125, 0.35, 0.45, 0.75, 1.0];
export const starTiers = [1, 2, 3, 4, 5];
export const combinedStarTiers = [4, 8, 12, 16, 20];

function getTier(value: number, tiers: number[]): number {
    for (let i = 0; i < tiers.length; i++) {
        if (value < tiers[i]) return i;
    }
    return tiers.length;
}
