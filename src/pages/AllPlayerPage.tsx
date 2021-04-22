import React, { Dispatch, SetStateAction, useMemo } from "react";
import { useDebounce } from "use-debounce/lib";
import { ListOptions } from "../components/sidebar/ListOptionsSelect";
import { PlayerFilters } from "../components/sidebar/Sidebar";
import { PlayerTable } from "../components/table/PlayerTable";
import { usePlayerTeamData } from "../hooks";
import { PlayerMeta, PlayerTeamMapping } from "../types";

function matchTeam(teams: PlayerTeamMapping[], filterTeams: string[]): boolean {
    if (!filterTeams.length) return true;
    for (const team of teams) {
        if (filterTeams.indexOf(team.teamId) !== -1) return true;
    }
    return false;
}

function matchName(name: string, search: string): boolean {
    if (!search) return true;
    return name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1;
}

function matchMods(mods: string[], filterMods: string[]): boolean {
    if (!filterMods.length) return true;
    for (const filterMod of filterMods) {
        if (mods.indexOf(filterMod) > -1) return true;
    }
    return false;
}

function matchPositions(
    position: string | undefined,
    filterPositions: string[]
) {
    if (!filterPositions.length) return true;
    if (!position) return false;
    return filterPositions.indexOf(position) > -1;
}

function applyPlayerFilter(
    players: PlayerMeta[],
    options: PlayerFilters
): PlayerMeta[] {
    return players.filter((p) => {
        if (!matchTeam(p.teams, options.teams)) return false;
        if (!matchName(p.player.name, options.search)) return false;
        if (!matchMods(p.modifiers, options.modifiers)) return false;
        if (!matchPositions(p.mainTeam?.position, options.positions))
            return false;
        return true;
    });
}

function AllPlayerPage(props: {
    filters: PlayerFilters;
    options: ListOptions;
    saved: string[];
    setSaved: Dispatch<SetStateAction<string[]>>;
}): JSX.Element {
    const [filters] = useDebounce(props.filters, 200);

    return (
        <div>
            <PlayerTableWrapper
                filters={filters}
                options={props.options}
                saved={props.saved}
                setSaved={props.setSaved}
            />
        </div>
    );
}

const PlayerTableWrapper = React.memo(function PlayerTableWrapper(props: {
    filters: PlayerFilters;
    options: ListOptions;
    saved: string[];
    setSaved: Dispatch<SetStateAction<string[]>>;
}) {
    const data = usePlayerTeamData();

    const filteredPlayers = useMemo(() => {
        if (!data) return [];
        const filtered = applyPlayerFilter(
            Object.values(data.players),
            props.filters
        );
        return filtered;
    }, [data?.players, props.filters]);

    return (
        <div>
            <h4>Players</h4>
            <PlayerTable
                players={filteredPlayers}
                options={props.options}
                saved={props.saved}
                setSaved={props.setSaved}
            />
        </div>
    );
});

export default AllPlayerPage;
