import { BlaseballTeam, ChroniclerEntity } from "./api/types";
import { Player, RosterEntry, TeamPosition } from "./models/Player";

export function generatePlayerTeamMap(
    teams: ChroniclerEntity<BlaseballTeam>[]
): Record<string, RosterEntry[]> {
    const map: Record<string, RosterEntry[]> = {};

    function add(teamId: string, playerIds: string[], position: TeamPosition) {
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
        add(team.entityId, team.data.lineup, "lineup");
        add(team.entityId, team.data.rotation, "rotation");
        add(team.entityId, team.data.shadows, "shadows");
    }

    return map;
}

export function parseEmoji(emoji: string): string {
    return emoji.startsWith("0x") ? String.fromCodePoint(Number(emoji)) : emoji;
}

export function positionSortKey(meta: Player): number {
    const team = meta.mainTeam;
    if (!team) return 1000000;

    return (
        ["lineup", "rotation", "shadows"].indexOf(team.position) * 1000 +
        team.index
    );
}
