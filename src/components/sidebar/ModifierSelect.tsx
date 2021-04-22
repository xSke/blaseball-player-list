import Select from "react-select";
import { PlayerMod } from "../../types";

export interface ModifierSelectProps {
    id: string;
    selected: string[];
    setSelected: (mods: string[]) => void;
    mods: PlayerMod[];
}

function ModifierSelect(props: ModifierSelectProps): JSX.Element {
    const options = props.mods.map((mod) => ({
        value: mod.id,
        title: mod.title,
        description: mod.description,
    }));
    options.sort((a, b) => a.title.localeCompare(b.title));

    const selectedOptions = options.filter(
        (o) => props.selected.indexOf(o.value) > -1
    );

    return (
        <Select
            id={props.id}
            isMulti
            options={options}
            value={selectedOptions}
            getOptionValue={(mod) => mod.title}
            formatOptionLabel={(option, { context }) => {
                return (
                    <span>
                        {option.title}{" "}
                        {context === "menu" && (
                            <small className="text-muted">
                                {option.description}
                            </small>
                        )}
                    </span>
                );
            }}
            onChange={(newItems) => {
                const mods = newItems.map((item) => item.value);
                props.setSelected(mods);
            }}
        />
    );
}

export default ModifierSelect;
