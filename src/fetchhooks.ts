import { useMemo } from "react";
import useSWR from "swr";
import { getAllModIds, getPlayerMeta } from "./players";
import {
    BlaseballTeam,
    ChroniclerPlayer,
    ChroniclerTeam,
    PlayerMeta,
    PlayerMod,
    RosterEntry,
} from "./types";
import { generatePlayerTeamMap } from "./utils";

export interface LeagueData {
    players: Record<string, PlayerMeta>;
    teams: Record<string, BlaseballTeam>;
    roster: Record<string, RosterEntry[]>;
}

export interface TeamData {
    teams: Record<string, BlaseballTeam>;
    roster: Record<string, RosterEntry[]>;
}

export function useLeagueData(): LeagueData | null {
    const teamData = useTeamData();
    const { data: playersRaw } = usePlayersRaw();

    return useMemo(() => {
        if (!teamData || !playersRaw) return null;

        const players = Object.fromEntries(
            playersRaw.map((p) => [
                p.id,
                getPlayerMeta(p, teamData.teams, teamData.roster),
            ])
        );

        return {
            teams: teamData.teams,
            roster: teamData.roster,
            players,
        };
    }, [teamData, playersRaw]);
}

export function useTeamData(): TeamData | null {
    const { data: teamsRaw } = useTeamsRaw();
    return useMemo(() => {
        if (!teamsRaw) return null;

        const teams = Object.fromEntries(teamsRaw?.map((t) => [t.id, t.data]));
        const roster = generatePlayerTeamMap(teamsRaw);
        return { teams, roster };
    }, [teamsRaw]);
}

export function useAllModifiers(): Record<string, PlayerMod> | null {
    const { data: playersRaw } = usePlayersRaw();

    const modIds = useMemo(() => {
        if (!playersRaw) return null;
        return getAllModIds(playersRaw.map((p) => p.data));
    }, [playersRaw]);

    const { data: modsRaw } = useModifiersRaw(modIds);

    return useMemo(() => {
        if (!modsRaw) return null;
        return Object.fromEntries(modsRaw.map((m) => [m.id, m]));
    }, [modsRaw]);
}

const swrSettings = {
    revalidateOnFocus: false,
    focusThrottleInterval: 60 * 60 * 1000,
};

function usePlayersRaw() {
    return useSWR<ChroniclerPlayer[]>(
        "https://api.sibr.dev/chronicler/v1/players",
        (url) =>
            fetch(url)
                .then((r) => r.json())
                .then((r) => r.data),
        swrSettings
    );
}

function useTeamsRaw() {
    return useSWR<ChroniclerTeam[]>(
        "https://api.sibr.dev/chronicler/v1/teams",
        (url) =>
            fetch(url)
                .then((r) => r.json())
                .then((r) => r.data),
        swrSettings
    );
}

function useModifiersRaw(ids: string[] | null) {
    return useSWR<PlayerMod[]>(
        () =>
            ids
                ? `https://api.sibr.dev/proxy/database/mods?ids=${ids.join(
                      ","
                  )}`
                : null,
        swrSettings
    );
}
