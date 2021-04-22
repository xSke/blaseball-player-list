import { PlayerMeta, PlayerTeamMapping } from "../../types";
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
    function getTeamData(player: PlayerMeta): { emoji: string; name: string } {
        if (player.player.deceased) return { emoji: "💀", name: "The Hall" };
        const team = player.mainTeamData;
        if (!team) return { emoji: "❓", name: "Null Team" };
        return { emoji: parseEmoji(team.emoji), name: team.nickname };
    }

    const { emoji, name } = getTeamData(props.player);
    return (
        <td className="player-team">
            <span className="emoji">{emoji}</span>
            {name}
        </td>
    );
}

export function PlayerPosition(props: { player: PlayerMeta }): JSX.Element {
    function getPositionName(meta: PlayerMeta, team: PlayerTeamMapping | null) {
        if (
            !team ||
            meta.player.deceased ||
            meta.modifiers.includes("COFFEE_EXIT") ||
            meta.modifiers.includes("REDACTED") ||
            meta.modifiers.includes("STATIC")
        )
            return "-";

        if (team.position === "lineup") return "Lineup";
        if (team.position === "rotation") return "Rotation";
        if (team.position === "bullpen" || team.position === "bench")
            return "Shadows";
    }
    const { mainTeam } = props.player;
    return <td>{getPositionName(props.player, mainTeam)}</td>;
}
