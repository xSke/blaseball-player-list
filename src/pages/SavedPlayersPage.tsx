import React, { Dispatch, SetStateAction } from "react";
import { ListOptions } from "../components/sidebar/ListOptionsSelect";
import { PlayerTable } from "../components/table/PlayerTable";
import { usePlayerTeamData } from "../hooks";

function SavedPlayersPage(props: {
    options: ListOptions;
    saved: string[];
    setSaved: Dispatch<SetStateAction<string[]>>;
}): JSX.Element {
    const data = usePlayerTeamData();
    if (data == null) return <span>Loading...</span>;

    const players = props.saved.map((id) => data.players[id]);

    return (
        <div>
            <h4>Saved players</h4>
            <PlayerTable
                options={props.options}
                players={players}
                saved={props.saved}
                setSaved={props.setSaved}
            />
        </div>
    );
}

export default SavedPlayersPage;
