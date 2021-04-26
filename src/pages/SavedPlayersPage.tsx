import React from "react";
import { PlayerTable } from "../components/table/PlayerTable";
import { useLeagueData } from "../api/fetchhooks";
import { useAppSelector } from "../hooks";

function SavedPlayersPage(): JSX.Element {
    const data = useLeagueData();
    const playerIds = useAppSelector((state) => state.savedPlayers.players);

    if (!data) return <span>Loading...</span>;
    const players = playerIds.map((id) => data.players[id]);

    return (
        <div>
            <h4>Saved players</h4>
            <PlayerTable players={players} />
        </div>
    );
}

export default SavedPlayersPage;
