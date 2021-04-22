import Select from "react-select";
import { useTeamData } from "../../hooks";
import {
    coffeeTeamIds,
    ilbTeamIds,
    sortTeams,
    specialTeamIds,
} from "../../teams";
import { BlaseballTeam } from "../../types";
import { parseEmoji } from "../../utils";

export function TeamSelect(props: {
    id?: string;
    teams: string[];
    setTeams: (teams: string[]) => void;
    multi: boolean;
}): JSX.Element {
    const teams = useTeamData();

    const normalTeams = sortTeams(ilbTeamIds.map((id) => teams.teamMap[id]));
    const coffeeTeams = sortTeams(coffeeTeamIds.map((id) => teams.teamMap[id]));
    const specialTeams = specialTeamIds.map((id) => teams.teamMap[id]);

    const options = [
        { label: "ILB", options: normalTeams },
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
            value={props.teams.map((id) => teams.teamMap[id])}
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
