import Select from "react-select";
import { useLeagueData } from "../../api/fetchhooks";
import { BlaseballTeam } from "../../api/types";
import {
    coffeeTeamIds,
    ilbTeamIds,
    sortTeams,
    specialTeamIds,
    libraryTeamIds,
    getTeamType,
    getTeamName,
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
    const unknownTeams = sortTeams(
        Object.keys(data.teams)
            .filter((t) => getTeamType(t) === null)
            .map((id) => data.teams[id])
    );

    const options = [
        { label: "ILB", options: normalTeams },
        { label: "Library", options: libraryTeams },
        { label: "Coffee Cup", options: coffeeTeams },
        { label: "Special", options: specialTeams },
    ];

    if (unknownTeams.length) {
        options.push({ label: "uhhhhh", options: unknownTeams });
    }

    const formatOptionLabel = (
        option: BlaseballTeam,
        meta: { context: string }
    ) => {
        const teamName = getTeamName(option);
        return (
            <span>
                <span className="emoji">{parseEmoji(option.emoji)}</span>
                {meta.context === "menu" ? teamName.nickname : teamName.nickname}
            </span>
        );
    };

    return (
        <Select
            isMulti={props.multi}
            id={props.id}
            options={options}
            value={props.teams.map((id) => data.teams[id])}
            getOptionValue={(team) => getTeamName(team).fullName}
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
