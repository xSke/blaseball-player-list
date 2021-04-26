import React, { ReactNode } from "react";
import { ListColumn, setColumn } from "../../store/tableOptionsSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import CheckboxOption from "../CheckboxOption";

export function PlayerColumnsSelect(): JSX.Element {
    const advanced = useAppSelector(
        (state) => state.tableOptions.showAdvancedStats
    );

    return (
        <div>
            <div className="form-label">Show columns</div>
            <ColumnCheckbox column="team">Team</ColumnCheckbox>
            <ColumnCheckbox column="position">Position</ColumnCheckbox>
            <ColumnCheckbox column="items">Items</ColumnCheckbox>
            <ColumnCheckbox column="batting">Batting</ColumnCheckbox>
            <ColumnCheckbox column="pitching">Pitching</ColumnCheckbox>
            <ColumnCheckbox column="baserunning">Baserunning</ColumnCheckbox>
            <ColumnCheckbox column="defense">Defense</ColumnCheckbox>
            {advanced && (
                <ColumnCheckbox column="vibestats">Vibes</ColumnCheckbox>
            )}
            <ColumnCheckbox column="misc">Misc</ColumnCheckbox>
        </div>
    );
}

function ColumnCheckbox(props: { column: ListColumn; children?: ReactNode }) {
    const dispatch = useAppDispatch();
    const columns = useAppSelector((state) => state.tableOptions.columns);

    return (
        <CheckboxOption
            id={`column-${props.column}`}
            value={columns[props.column]}
            setValue={(value) => {
                dispatch(setColumn({ column: props.column, value }));
            }}
        >
            {props.children}
        </CheckboxOption>
    );
}
