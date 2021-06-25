import Select from "react-select";
import { useLeagueData } from "../../api/fetchhooks";
import { BlaseballTeam } from "../../api/types";
import {
    coffeeTeamIds,
    ilbTeamIds,
    sortTeams,
    specialTeamIds,
    libraryTeamIds,
} from "../../teams";
import { parseEmoji } from "../../utils";

export function TeamSelect(props: {
    id?: string;
    teams: string[];
    setTeams: (teams: string[]) => void;
    multi: boolean;
}): JSX.Element | null {
    const data = useLeagueData();
    if (!data) return null;

    const normalTeams = sortTeams(ilbTeamIds.map((id) => data.teams[id]));
    const coffeeTeams = sortTeams(coffeeTeamIds.map((id) => data.teams[id]));
    const specialTeams = specialTeamIds.map((id) => data.teams[id]);
    const libraryTeams = sortTeams(
        libraryTeamIds.map((id) => data.teams[id]).filter((t) => !!t)
    );

    const options = [
        { label: "ILB", options: normalTeams },
        { label: "Library", options: libraryTeams },
        { label: "Coffee Cup", options: coffeeTeams },
        { label: "Special", options: specialTeams },
    ];

    const formatOptionLabel = (
        option: BlaseballTeam,
        meta: { context: string }
    ) => {
        return (
            <span>
                <span className="emoji">{parseEmoji(option.emoji)}</span>
                {meta.context === "menu" ? option.nickname : option.nickname}
            </span>
        );
    };

    return (
        <Select
            isMulti={props.multi}
            id={props.id}
            options={options}
            value={props.teams.map((id) => data.teams[id])}
            getOptionValue={(team) => team.fullName}
            formatOptionLabel={formatOptionLabel}
            onChange={(value) => {
                // depends whether multi flag is set
                if (Array.isArray(value)) {
                    const teams = value.map((item) => item.id);
                    props.setTeams(teams);
                } else {
                    props.setTeams(value ? [(value as BlaseballTeam).id] : []);
                }
            }}
        />
    );
}
