import { useMemo } from "react";
import useSWR from "swr";
import { extractPlayerMods, getAllModIds } from "./players";
import {
    BlaseballTeam,
    ChroniclerPlayers,
    ChroniclerTeams,
    PlayerMeta,
    PlayerMod,
    PlayerTeamMap,
} from "./types";
import { generatePlayerTeamMap } from "./utils";

export interface TeamData {
    teamMap: Record<string, BlaseballTeam>;
    playerTeamMap: PlayerTeamMap;
}

export function useTeamData(): TeamData {
    const { data } = useSWR<ChroniclerTeams>(
        "https://api.sibr.dev/chronicler/v1/teams"
    );

    return useMemo(() => {
        console.log("useTeamData memo");
        if (!data) return { teamMap: {}, playerTeamMap: {} };

        return {
            teamMap: Object.fromEntries(
                data.data.map((team) => [team.id, team.data])
            ),
            playerTeamMap: generatePlayerTeamMap(data.data),
        };
    }, [data]);
}

export function usePlayerData(teamData: TeamData): Record<string, PlayerMeta> {
    const { data: players } = useSWR<ChroniclerPlayers>(
        "https://api.sibr.dev/chronicler/v1/players"
    );

    return useMemo(() => {
        if (!players) return {};

        return Object.fromEntries(
            players.data.map((p) => {
                const playerTeams = teamData.playerTeamMap[p.id] ?? [];
                const mainTeams = playerTeams.filter(
                    (t) => !!teamData.teamMap[t.teamId].stadium
                );
                const mainTeam = !p.data.deceased
                    ? mainTeams[0] ?? playerTeams[0] ?? null
                    : null;

                return [
                    p.id,
                    {
                        id: p.id,
                        teams: teamData.playerTeamMap[p.id] ?? [],
                        mainTeam: mainTeam,
                        mainTeamData:
                            mainTeam !== null
                                ? teamData.teamMap[mainTeam.teamId]
                                : null,
                        player: p.data,
                        modifiers: extractPlayerMods(p.data),
                    },
                ];
            })
        );
    }, [players]);
}

export interface PlayerTeamData {
    players: Record<string, PlayerMeta>;
    teams: Record<string, BlaseballTeam>;
    playerTeamMap: PlayerTeamMap;
}

export function usePlayerTeamData(): PlayerTeamData | null {
    const teamData = useTeamData();
    if (teamData == null) return null;

    const playerData = usePlayerData(teamData);
    if (playerData == null) return null;

    return useMemo(() => {
        console.log("useplayerteamdata");
        return {
            players: playerData,
            teams: teamData.teamMap,
            playerTeamMap: teamData.playerTeamMap,
        };
    }, [teamData, playerData]);
}

export function useAllModifiers(): Record<string, PlayerMod> {
    const data = usePlayerTeamData();

    const allPlayerIds = useMemo(() => {
        if (!data) return [];
        return getAllModIds(Object.values(data.players));
    }, [data?.players]);
    return useModifiers(allPlayerIds);
}

export function useModifiers(ids: string[]): Record<string, PlayerMod> {
    const { data } = useSWR<PlayerMod[]>(
        `https://api.sibr.dev/proxy/database/mods?ids=${ids.join(",")}`
    );

    return useMemo(() => {
        if (!data) return {};
        return Object.fromEntries(data.map((mod) => [mod.id, mod]));
    }, [data]);
}
