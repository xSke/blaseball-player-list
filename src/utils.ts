import { ChroniclerTeam, PlayerMeta, PlayerTeamMap } from "./types";

export function generatePlayerTeamMap(teams: ChroniclerTeam[]): PlayerTeamMap {
    const map: PlayerTeamMap = {};

    function add(
        teamId: string,
        playerIds: string[],
        position: "lineup" | "rotation" | "bullpen" | "bench"
    ) {
        for (let i = 0; i < playerIds.length; i++) {
            const playerId = playerIds[i];
            if (!map[playerId]) map[playerId] = [];
            map[playerId].push({
                player: playerId,
                teamId: teamId,
                position: position,
                index: i,
            });
        }
    }

    for (const team of teams) {
        add(team.id, team.data.lineup, "lineup");
        add(team.id, team.data.rotation, "rotation");
        add(team.id, team.data.bullpen, "bullpen");
        add(team.id, team.data.bench, "bench");
    }

    return map;
}

export function parseEmoji(emoji: string): string {
    return emoji.startsWith("0x") ? String.fromCodePoint(Number(emoji)) : emoji;
}

export function positionSortKey(meta: PlayerMeta): number {
    const team = meta.mainTeam;
    if (!team) return 1000000;

    return (
        ["lineup", "rotation", "bullpen", "bench"].indexOf(team.position) *
            1000 +
        team.index
    );
}
