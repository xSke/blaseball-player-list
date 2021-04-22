import { PlayerMeta, RosterEntry } from "../../types";
import { parseEmoji } from "../../utils";

export function PlayerName(props: { player: PlayerMeta }): JSX.Element {
    const id = props.player.id;
    const name = props.player.player.name;

    return (
        <td className="player-name">
            <a href={`https://blaseball.com/player/${id}`}>{name}</a>
        </td>
    );
}

export function PlayerTeam(props: { player: PlayerMeta }): JSX.Element {
    function getTeamData(
        player: PlayerMeta
    ): { emoji: string; name: string } | null {
        if (player.player.deceased) return { emoji: "💀", name: "The Hall" };
        const team = player.mainTeamData;
        if (!team) return null;
        return { emoji: parseEmoji(team.emoji), name: team.nickname };
    }

    const data = getTeamData(props.player);
    return data ? (
        <td className="player-team">
            <span className="emoji">{data.emoji}</span> {data.name}
        </td>
    ) : (
        <td className="player-team invalid">-</td>
    );
}

export function PlayerPosition(props: { player: PlayerMeta }): JSX.Element {
    function getPositionName(meta: PlayerMeta, team: RosterEntry | null) {
        if (
            !team ||
            meta.player.deceased ||
            meta.modifiers.includes("COFFEE_EXIT") ||
            meta.modifiers.includes("REDACTED") ||
            meta.modifiers.includes("STATIC")
        )
            return null;

        if (team.position === "lineup") return "Lineup";
        if (team.position === "rotation") return "Rotation";
        if (team.position === "shadows") return "Shadows";
    }
    const { mainTeam } = props.player;
    const position = getPositionName(props.player, mainTeam);
    return position ? <td>{position}</td> : <td className="invalid">-</td>;
}
