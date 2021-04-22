import React, { useMemo } from "react";
import { useDebounce } from "use-debounce/lib";
import { PlayerTable } from "../components/table/PlayerTable";
import { PlayerFilterSlice } from "../store/playerFilterSlice";
import { useAppSelector } from "../hooks";
import { PlayerMeta, RosterEntry } from "../types";
import { useLeagueData } from "../fetchhooks";

function AllPlayerPage(): JSX.Element {
    const data = useLeagueData();
    const filters = useAppSelector((state) => state.playerFilter);
    const [filtersDebounced] = useDebounce(filters, 200);

    const filteredPlayers = useMemo(() => {
        if (!data) return null;
        const filtered = applyPlayerFilter(
            Object.values(data.players),
            filters
        );
        return filtered;
    }, [data, filtersDebounced]);

    if (!filteredPlayers) return <div>Loading...</div>;

    return <PlayerTable players={filteredPlayers} pageSize={25} />;
}

function applyPlayerFilter(
    players: PlayerMeta[],
    options: PlayerFilterSlice
): PlayerMeta[] {
    return players.filter((p) => {
        if (!matchTeam(p.teams, options.teams)) return false;
        if (!matchName(p.player.name, options.search)) return false;
        if (!matchMods(p.modifiers, options.mods)) return false;
        if (!matchPositions(p.mainTeam?.position, options.positions))
            return false;
        return true;
    });
}

function matchTeam(teams: RosterEntry[], filterTeams: string[]): boolean {
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

export default AllPlayerPage;
