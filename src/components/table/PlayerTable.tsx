import React, { useMemo, useState } from "react";
import { BlaseballPlayer, PlayerMeta } from "../../types";
import { ListOptions } from "../sidebar/ListOptionsSelect";
import Pagination from "../Pagination";
import { ColumnGroup, getColumns } from "./columns";

export type SetSaved = (fn: (old: string[]) => string[]) => void;

export interface SavedPlayerProps {
    saved: string[];
    setSaved: SetSaved;
}

export type SortKeyGetter = (
    p: BlaseballPlayer,
    meta: PlayerMeta
) => string | number;

export interface SortState {
    column: string | null;
    dir?: "asc" | "desc";
    key?: SortKeyGetter;
}

interface SortStateProps {
    sort: SortState;
    setSort: (sort: SortState) => void;
}

export interface PlayerTableProps extends SavedPlayerProps {
    players: PlayerMeta[];
    options: ListOptions;
}

export function PlayerTable(props: PlayerTableProps): JSX.Element {
    const [sort, setSort] = useState<SortState>({ column: null });
    const [page, setPage] = useState<number>(0);

    const pageSize = 50;
    const pageCount = Math.ceil(props.players.length / pageSize);

    const columns = useMemo(() => getColumns(props.options), [props.options]);
    const sortedPlayers = useMemo(
        () => sortPlayers(props.players, columns, sort),
        [columns, props.players, props.options, sort]
    );

    const pagedPlayers = useMemo(() => {
        const actualPage = Math.min(page, pageCount - 1);
        return sortedPlayers.slice(
            actualPage * pageSize,
            (actualPage + 1) * pageSize
        );
    }, [sortedPlayers, page, pageSize, pageCount]);

    return (
        <div>
            <table className="table table-sm table-hover player-table">
                <TableColgroups columns={columns} />
                <TableHeader columns={columns} sort={sort} setSort={setSort} />
                <TableBody
                    players={pagedPlayers}
                    columns={columns}
                    options={props.options}
                    saved={props.saved}
                    setSaved={props.setSaved}
                />
            </table>
            <Pagination
                pageCount={pageCount}
                pageIndex={page}
                gotoPage={setPage}
            />
        </div>
    );
}

function TableColgroups(props: { columns: ColumnGroup[] }) {
    return (
        <>
            {props.columns.map((cg, i) => (
                <colgroup
                    key={i}
                    // Make the first group a bit longer to handle the checkbox
                    span={cg.columns.length + (i === 0 ? 1 : 0)}
                />
            ))}
        </>
    );
}

interface TableBodyProps extends SavedPlayerProps {
    players: PlayerMeta[];
    columns: ColumnGroup[];
    options: ListOptions;
}

function TableBody(props: TableBodyProps) {
    return (
        <tbody>
            {props.players.map((p) => (
                <TableRow
                    key={p.id}
                    player={p}
                    columns={props.columns}
                    options={props.options}
                    saved={props.saved}
                    setSaved={props.setSaved}
                />
            ))}
        </tbody>
    );
}

interface TableRowProps extends SavedPlayerProps {
    player: PlayerMeta;
    columns: ColumnGroup[];
    options: ListOptions;
}

function TableRow(props: TableRowProps) {
    return (
        <tr>
            <SaveCheckbox
                id={props.player.id}
                saved={props.saved}
                setSaved={props.setSaved}
            />
            {props.columns.flatMap((cg) => {
                return cg.columns.map((c) => {
                    const Cell = c.render;
                    if (!Cell) return <td key={c.id} />;
                    return (
                        <Cell
                            key={c.id}
                            player={props.player}
                            options={props.options}
                        />
                    );
                });
            })}
        </tr>
    );
}

interface TableHeaderProps extends SortStateProps {
    columns: ColumnGroup[];
}

function TableHeader(props: TableHeaderProps) {
    const flatColumns = props.columns.flatMap((cg) => cg.columns);
    return (
        <thead>
            <tr>
                <th />
                {props.columns.map((cg, i) => (
                    <th key={i} colSpan={cg.columns.length}>
                        {cg.name}
                    </th>
                ))}
            </tr>
            <tr>
                <th />
                {flatColumns.map((c) => (
                    <TableColumnHeader
                        key={c.id}
                        id={c.id}
                        title={c.alt}
                        name={c.name}
                        sort={props.sort}
                        setSort={props.setSort}
                    />
                ))}
            </tr>
        </thead>
    );
}

interface TableColumnHeaderProps extends SortStateProps {
    id: string;
    title?: string;
    name: string;
}

function TableColumnHeader(props: TableColumnHeaderProps) {
    const symbol = getSortSymbol(props.id, props.sort);

    return (
        <th
            title={props.title}
            onClick={(e) => {
                e.preventDefault();
                props.setSort(getSortState(props.id, props.sort));
            }}
        >
            {props.name}
            {symbol}
        </th>
    );
}

function SaveCheckbox(props: {
    id: string;
    saved: string[];
    setSaved: SetSaved;
}) {
    const checked = props.saved.indexOf(props.id) !== -1;

    return (
        <td>
            <input
                className="form-check-input"
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                    if (e.target.checked) {
                        props.setSaved((old) => [...old, props.id]);
                    } else {
                        props.setSaved((old) =>
                            old.filter((id) => id !== props.id)
                        );
                    }
                }}
            />
        </td>
    );
}

function getSortSymbol(thisId: string, state: SortState) {
    if (thisId !== state.column) return null;
    if (state.dir === "asc") return "☝";
    if (state.dir === "desc") return "👇";
    return null;
}

function getSortState(thisId: string, state: SortState): SortState {
    // Click on different column, set ascending
    if (state.column !== thisId) return { column: thisId, dir: "asc" };

    // Toggle ascending to descending
    if (state.dir === "asc") return { column: thisId, dir: "desc" };

    // Toggle descending to null
    return { column: null, dir: undefined };
}

function sortPlayers(
    players: PlayerMeta[],
    columns: ColumnGroup[],
    sort: SortState
): PlayerMeta[] {
    if (!sort.column) return players;

    const sortColumn = columns
        .flatMap((cg) => cg.columns)
        .filter((c) => c.id === sort.column)[0];

    const sortKey = sortColumn?.sortKey;
    if (!sortKey) return players;

    return [...players].sort((a, b) => {
        const keyA = sortKey(a.player, a) ?? 0;
        const keyB = sortKey(b.player, b) ?? 0;
        const comp = keyA > keyB ? 1 : keyA < keyB ? -1 : 0;
        return sort.dir === "asc" ? comp : -comp;
    });
}
