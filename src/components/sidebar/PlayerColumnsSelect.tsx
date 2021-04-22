import React, { ReactNode } from "react";
import { ListColumn, setColumn } from "../../store/tableOptionsSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import CheckboxOption from "../CheckboxOption";

export function PlayerColumnsSelect(): JSX.Element {
    return (
        <div>
            <div className="form-label">Show columns</div>
            <ColumnCheckbox id="show-batting" column="batting">
                Batting
            </ColumnCheckbox>

            <ColumnCheckbox id="show-pitching" column="pitching">
                Pitching
            </ColumnCheckbox>

            <ColumnCheckbox id="show-baserunning" column="baserunning">
                Baserunning
            </ColumnCheckbox>

            <ColumnCheckbox id="show-defense" column="defense">
                Defense
            </ColumnCheckbox>
        </div>
    );
}

function ColumnCheckbox(props: {
    id: string;
    column: ListColumn;
    children?: ReactNode;
}) {
    const dispatch = useAppDispatch();
    const columns = useAppSelector((state) => state.tableOptions.columns);

    return (
        <CheckboxOption
            id={props.id}
            value={columns[props.column]}
            setValue={(value) => {
                dispatch(setColumn({ column: props.column, value }));
            }}
        >
            {props.children}
        </CheckboxOption>
    );
}
