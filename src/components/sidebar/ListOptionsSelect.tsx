import React, { Dispatch, SetStateAction } from "react";
import CheckboxOption from "../CheckboxOption";
import { ListColumn } from "./PlayerColumnsSelect";

export interface ListOptions {
    showAdvancedStats: boolean;
    useRealStars: boolean;

    columns: ListColumn[];
}

function ListOptionsSelect(props: {
    options: ListOptions;
    setOptions: Dispatch<SetStateAction<ListOptions>>;
}): JSX.Element {
    return (
        <div className="sidebar-section">
            <CheckboxOption
                id="Show advanced stats"
                value={props.options.showAdvancedStats}
                setValue={(val) =>
                    props.setOptions((opts) => ({
                        ...opts,
                        showAdvancedStats: val,
                    }))
                }
            >
                Show advanced stats
            </CheckboxOption>

            <CheckboxOption
                id="real-stars"
                value={props.options.useRealStars}
                setValue={(val) =>
                    props.setOptions((opts) => ({
                        ...opts,
                        useRealStars: val,
                    }))
                }
            >
                Use real star formula
            </CheckboxOption>
        </div>
    );
}

export default ListOptionsSelect;
