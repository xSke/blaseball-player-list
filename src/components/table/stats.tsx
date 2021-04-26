import { BlaseballPlayer } from "../../api/types";
import { CellComponent, CellProps } from "./columns";

export function NumericStat(props: {
    value: number;
    tiers?: number[];
    inverse?: boolean;
}): JSX.Element {
    const tiers = props.tiers ?? attrTiers;
    const value = props.inverse ? 1 - props.value : props.value;
    const tier = getTier(value, tiers);

    return (
        <td className={`numeric-stat numeric-stat-${tier}`}>
            {props.value.toFixed(3)}
        </td>
    );
}

export function numericStat(
    accessor: (p: BlaseballPlayer) => number | null,
    tiers?: number[],
    inverse?: boolean
): CellComponent {
    const actualTiers = tiers ?? attrTiers;

    function Cell(props: CellProps) {
        const value = accessor(props.player.player);
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
