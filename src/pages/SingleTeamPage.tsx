import React, { Dispatch, SetStateAction } from "react";
import { useParams } from "react-router";
import { ListOptions } from "../components/sidebar/ListOptionsSelect";
import { PlayerTable } from "../components/table/PlayerTable";
import { usePlayerData, useTeamData } from "../hooks";

function SingleTeamPage(props: {
    options: ListOptions;
    saved: string[];
    setSaved: Dispatch<SetStateAction<string[]>>;
}): JSX.Element {
    const { abbr } = useParams<{ abbr: string }>();

    const teams = useTeamData();
    const players = usePlayerData(teams);

    if (!teams.teamMap) return <div>Loading</div>;
    if (!players) return <div>Loading</div>;

    const team = Object.values(teams.teamMap).find((t) => t.shorthand === abbr);
    if (team == null) return <div>Team not found</div>;

    function TeamPlayerTable({ ids }: { ids: string[] }) {
        return (
            <PlayerTable
                players={ids.map((id) => players[id]).filter((p) => p)}
                options={props.options}
                saved={props.saved}
                setSaved={props.setSaved}
            />
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h4>Lineup</h4>
                <TeamPlayerTable ids={team.lineup} />
            </div>
            <div className="mb-4">
                <h4>Rotation</h4>
                <TeamPlayerTable ids={team.rotation} />
            </div>
            <div className="mb-4">
                <h4>Shadows</h4>
                <TeamPlayerTable ids={[...team.bench, ...team.bullpen]} />
            </div>
        </div>
    );
}

export default SingleTeamPage;
