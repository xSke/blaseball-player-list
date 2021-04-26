import React, { useMemo, useState } from "react";
import Pagination from "../Pagination";
import { ColumnGroup, getColumns } from "./columns";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { save, unsave } from "../../store/savedPlayersSlice";
import { Player } from "../../models/Player";

export type SortKeyGetter = (p: Player) => string | number;

export interface SortState {
    column: string | null;
    dir?: "asc" | "desc";
    key?: SortKeyGetter;
}

interface SortStateProps {
    sort: SortState;
    setSort: (sort: SortState) => void;
}

export interface PlayerTableProps {
    players: Player[];
    pageSize?: number;
}

export function PlayerTable(props: PlayerTableProps): JSX.Element {
    const [sort, setSort] = useState<SortState>({ column: null });
    const [page, setPage] = useState<number>(0);
    const tableOptions = useAppSelector((state) => state.tableOptions);

    const columns = useMemo(() => getColumns(tableOptions), [tableOptions]);
    const sortedPlayers = useMemo(
        () => sortPlayers(props.players, columns, sort),
        [columns, props.players, tableOptions, sort]
    );

    const pageCount = props.pageSize
        ? Math.ceil(props.players.length / props.pageSize)
        : 0;

    const pagedPlayers = useMemo(() => {
        if (!props.pageSize) return sortedPlayers;

        const pageCount = Math.ceil(props.players.length / props.pageSize);
        const actualPage = Math.min(page, pageCount - 1);
        return sortedPlayers.slice(
            actualPage * props.pageSize,
            (actualPage + 1) * props.pageSize
        );
    }, [sortedPlayers, page, props.pageSize]);

    return (
        <div>
            <table className="table table-sm table-hover player-table">
                <TableColgroups columns={columns} />
                <TableHeader columns={columns} sort={sort} setSort={setSort} />
                <TableBody players={pagedPlayers} columns={columns} />
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
                    key={cg.name}
                    // Make the first group a bit longer to handle the checkbox
                    span={cg.columns.length + (i === 0 ? 1 : 0)}
                />
            ))}
        </>
    );
}

interface TableBodyProps {
    players: Player[];
    columns: ColumnGroup[];
}

function TableBody(props: TableBodyProps) {
    return (
        <tbody>
            {props.players.map((p) => (
                <TableRow key={p.id} player={p} columns={props.columns} />
            ))}
        </tbody>
    );
}

interface TableRowProps {
    player: Player;
    columns: ColumnGroup[];
}

function TableRow(props: TableRowProps) {
    const toShow = useAppSelector((state) => state.playerItems.toShow);
    const showItems = toShow.includes(props.player.id);

    return (
        <tr>
            <SaveCheckbox id={props.player.id} />
            {props.columns.flatMap((cg) => {
                return cg.columns.map((c) => {
                    const Cell = c.render;
                    if (!Cell) return <td key={c.id} />;
                    return <Cell key={c.id} player={props.player} />;
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

function SaveCheckbox(props: { id: string }) {
    const dispatch = useAppDispatch();
    const players = useAppSelector((state) => state.savedPlayers.players);
    const checked = players.includes(props.id);

    return (
        <td className="selectbox">
            <input
                className="form-check-input"
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                    if (e.target.checked) {
                        dispatch(save(props.id));
                    } else {
                        dispatch(unsave(props.id));
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
    players: Player[],
    columns: ColumnGroup[],
    sort: SortState
): Player[] {
    if (!sort.column) return players;

    const sortColumn = columns
        .flatMap((cg) => cg.columns)
        .filter((c) => c.id === sort.column)[0];

    const sortKey = sortColumn?.sortKey;
    if (!sortKey) return players;

    return [...players].sort((a, b) => {
        const keyA = sortKey(a) ?? 0;
        const keyB = sortKey(b) ?? 0;
        const comp = keyA > keyB ? 1 : keyA < keyB ? -1 : 0;
        return sort.dir === "asc" ? comp : -comp;
    });
}
