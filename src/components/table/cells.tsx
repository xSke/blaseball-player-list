import { Player, RosterEntry } from "../../models/Player";
import { parseEmoji } from "../../utils";
import Tooltip from "rc-tooltip";
import { useAppSelector } from "../../hooks";
import { getTeamName } from "../../teams";

export function PlayerID(props: { player: Player }): JSX.Element {
    const id = props.player.id;
    return (
        <td
            className="player-id"
            onClick={(e) => {
                const sel = window.getSelection();
                sel?.selectAllChildren(e.target as Node);
            }}
        >
            <code>{id}</code>
        </td>
    );
}

export function PlayerName(props: { player: Player }): JSX.Element {
    const showUnscatteredNames = useAppSelector(
        (state) => state.tableOptions.showUnscatteredNames
    );

    const id = props.player.id;
    const name = props.player.name(showUnscatteredNames);

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
        const team = player.mainTeamData;
        if (!team) {
            if (player.data.deceased) return { emoji: "💀", name: "The Hall" };
            return null;
        }

        const teamName = getTeamName(team);
        return { emoji: parseEmoji(team.emoji), name: teamName.nickname };
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
            // player.data.deceased ||
            player.hasMod("COFFEE_EXIT", "REDACTED", "STATIC") ||
            (player.hasMod("LEGENDARY") && !player.hasMod("REPLICA"))
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
        Base: "⬜",
        Bat: "🏏",
        Board: "🛹",
        Broom: "🧹",
        Cannon: "🔫",
        Cap: "🧢",
        Cape: "👗",
        Chair: "🪑",
        Egg: "🥚",
        Field: "🔵",
        Glove: "🧤",
        Helmet: "⛑️",
        Jersey: "👕",
        Necklace: "📿",
        Phone: "☎️",
        Pillow: "🛏️",
        Potion: "🧪",
        Quill: "🪶",
        Ring: "💍",
        Shoes: "👟",
        Socks: "🧦",
        Sunglasses: "🕶️",
    };

    const itemAmnt = playerItems ? playerItems.length : 0;
    return itemAmnt > 0 ? (
        <td>
            {playerItems?.map((item) => {
                return (
                    <Tooltip
                        placement="top"
                        overlay={
                            <span
                                className={
                                    item.durability === -1
                                        ? "legendary-item-name"
                                        : ""
                                }
                            >
                                {item.name}{" "}
                                <i>
                                    {item.durability === -1
                                        ? "(∞)"
                                        : item.health === 0
                                        ? "(broken)"
                                        : `(${item.health}/${item.durability})`}
                                </i>
                            </span>
                        }
                    >
                        <div
                            className={`item-icon ${
                                item.durability === -1 ? "legendary-item" : ""
                            }`}
                        >
                            {rootNameMap[item.root.name] ?? "❔"}
                            {item.health === 0 ? (
                                <span className="broken-item">❌</span>
                            ) : (
                                <span></span>
                            )}
                        </div>
                    </Tooltip>
                );
            })}
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
