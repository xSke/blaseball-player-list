import React from "react";
import { useParams } from "react-router";
import { PlayerTable } from "../components/table/PlayerTable";
import { useLeagueData } from "../api/fetchhooks";

function SingleTeamPage(): JSX.Element {
    const { abbr } = useParams<{ abbr: string }>();
    const data = useLeagueData();
    if (data === null) return <div>Loading</div>;

    const team = Object.values(data.teams).find((t) => t.shorthand === abbr);
    if (team == null) return <div>Team not found</div>;

    return (
        <div>
            <div className="mb-4">
                <h4>Lineup</h4>
                <PlayerTable
                    players={team.lineup.map((id) => data.players[id])}
                />
            </div>
            <div className="mb-4">
                <h4>Rotation</h4>
                <PlayerTable
                    players={team.rotation.map((id) => data.players[id])}
                />
            </div>
            <div className="mb-4">
                <h4>Shadows</h4>
                <PlayerTable
                    players={(team.shadows ?? [...(team.bench ?? []), ...(team.bullpen ?? [])]).map(
                        (id) => data.players[id]
                    )}
                />
            </div>
        </div>
    );
}

export default SingleTeamPage;
