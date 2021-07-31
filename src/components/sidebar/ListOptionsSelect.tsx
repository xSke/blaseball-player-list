import React from "react";
import {
    setApplyItemAdjustments,
    setShowAdvancedStats,
    setShowUnscatteredNames,
    setUseRealStars,
} from "../../store/tableOptionsSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import CheckboxOption from "../CheckboxOption";

function ListOptionsSelect(): JSX.Element {
    const dispatch = useAppDispatch();
    const opts = useAppSelector((state) => state.tableOptions);

    return (
        <div className="mb-4">
            <CheckboxOption
                id="advanced-stats"
                value={opts.showAdvancedStats}
                setValue={(val) => dispatch(setShowAdvancedStats(val))}
            >
                Show advanced stats
            </CheckboxOption>

            <CheckboxOption
                id="real-stars"
                value={opts.useRealStars}
                setValue={(val) => dispatch(setUseRealStars(val))}
            >
                Use real star formula
            </CheckboxOption>

            <CheckboxOption
                id="apply-item-adj"
                value={opts.applyItemAdjustments}
                setValue={(val) => dispatch(setApplyItemAdjustments(val))}
            >
                Apply item adjustments
            </CheckboxOption>


            <CheckboxOption
                id="unscatter-names"
                value={opts.showUnscatteredNames}
                setValue={(val) => dispatch(setShowUnscatteredNames(val))}
            >
                Unscatter player names
            </CheckboxOption>
        </div>
    );
}

export default ListOptionsSelect;
