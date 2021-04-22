import React, { ReactNode } from "react";
import CheckboxOption from "../CheckboxOption";

export type ListColumn = "batting" | "pitching" | "baserunning" | "defense";

export function PlayerColumnsSelect(props: {
    columns: ListColumn[];
    setColumns: (columns: ListColumn[]) => void;
}): JSX.Element {
    return (
        <div className="sidebar-section">
            <div className="form-label">Columns</div>
            <ColumnCheckboxOption id="show-batting" column="batting" {...props}>
                Batting
            </ColumnCheckboxOption>

            <ColumnCheckboxOption
                id="show-pitching"
                column="pitching"
                {...props}
            >
                Pitching
            </ColumnCheckboxOption>

            <ColumnCheckboxOption
                id="show-baserunning"
                column="baserunning"
                {...props}
            >
                Baserunning
            </ColumnCheckboxOption>

            <ColumnCheckboxOption id="show-defense" column="defense" {...props}>
                Defense
            </ColumnCheckboxOption>
        </div>
    );
}

function ColumnCheckboxOption(props: {
    id: string;
    column: ListColumn;
    columns: ListColumn[];
    setColumns: (columns: ListColumn[]) => void;
    children?: ReactNode;
}) {
    const checked = props.columns.includes(props.column);
    return (
        <CheckboxOption
            id={props.id}
            value={checked}
            setValue={(val) => {
                if (val) props.setColumns([...props.columns, props.column]);
                else
                    props.setColumns(
                        props.columns.filter((col) => col !== props.column)
                    );
            }}
        >
            {props.children}
        </CheckboxOption>
    );
}
