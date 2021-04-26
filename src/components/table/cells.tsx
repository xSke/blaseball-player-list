import { Player, RosterEntry } from "../../models/Player";
import { parseEmoji } from "../../utils";
import Tooltip from "rc-tooltip";

export function PlayerName(props: { player: Player }): JSX.Element {
    const id = props.player.id;
    const name = props.player.data.name;

    return (
        <td className="player-name">
            <a target="_blank" href={`https://blaseball.com/player/${id}`}>
                {name}
            </a>
        </td>
    );
}

export function PlayerTeam(props: { player: Player }): JSX.Element {
    function getTeamData(
        player: Player
    ): { emoji: string; name: string } | null {
        if (player.data.deceased) return { emoji: "💀", name: "The Hall" };
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

export function PlayerPosition(props: { player: Player }): JSX.Element {
    function getPositionName({
        player,
        team,
    }: {
        player: Player;
        team: RosterEntry | null;
    }) {
        if (
            !team ||
            player.data.deceased ||
            player.hasMod("COFFEE_EXIT", "REDACTED", "STATIC", "LEGENDARY")
        )
            return null;

        if (team.position === "lineup") return "Lineup";
        if (team.position === "rotation") return "Rotation";
        if (team.position === "shadows") return "Shadows";
    }
    const { mainTeam } = props.player;
    const position = getPositionName({ player: props.player, team: mainTeam });
    return position ? (
        <td className="player-position">{position}</td>
    ) : (
        <td className="player-position invalid">-</td>
    );
}

export function PlayerItem(props: { player: Player }): JSX.Element {
    // const dispatch = useAppDispatch();
    // const toShow = useAppSelector((state) => state.playerItems.toShow);
    // const showItems = toShow.includes(props.player.id);

    const playerItems = props.player.data.items;
    type itemMap = {
        [key: string]: string;
    };
    const rootNameMap: itemMap = {
        Bat: "🏏",
        Board: "🛹",
        Cap: "🧢",
        Field: "🔵",
        Glove: "🧤",
        Jersey: "👕",
        Necklace: "📿",
        Ring: "💍",
        Shoes: "👟",
        Sunglasses: "🕶️",
    };

    const itemAmnt = playerItems ? playerItems.length : 0;
    return itemAmnt > 0 ? (
        <td>
            {
                playerItems?.map((item) => {
                    return (<Tooltip placement="top" overlay={
                        <span>
                            {item.name}
                        </span>
                    }>
                        <span>{rootNameMap[item.root.name]}</span>
                    </Tooltip>)
                })
            }
            {/* <button
                onClick={() => dispatch(toggle(props.player.id))}
                className="btn item-btn"
            >
                {showItems ? "▴" : "▾"}
            </button> */}
        </td>
    ) : (
        <td>-</td>
    );
}
