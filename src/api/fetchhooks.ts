import useSWR from "swr";
import { BlaseballTeam, PlayerMod } from "./types";
import { Player, RosterEntry } from "../models/Player";
import { fetchLeagueData } from "./api";

export interface LeagueData {
    players: Record<string, Player>;
    teams: Record<string, BlaseballTeam>;
    roster: Record<string, RosterEntry[]>;
    mods: Record<string, PlayerMod>;
}

export function useLeagueData(): LeagueData | null {
    const at = null; // todo: fetch this from store somehow?
    const { data } = useSWR(
        `leaguedata/${at}`,
        async () => await fetchLeagueData(at),
        swrSettings
    );
    return data ?? null;
}

const swrSettings = {
    revalidateOnFocus: false,
    focusThrottleInterval: 60 * 60 * 1000,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
};
