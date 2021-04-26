import Select from "react-select";
import { useAllModifiers } from "../../api/fetchhooks";

function ModifierSelect(props: {
    id: string;
    mods: string[];
    setMods: (mods: string[]) => void;
}): JSX.Element {
    const allMods = useAllModifiers() ?? {};
    const options = Object.values(allMods).map((mod) => ({
        value: mod.id,
        title: mod.title,
        description: mod.description,
    }));
    options.sort((a, b) => a.title.localeCompare(b.title));

    const selectedOptions = options.filter((o) => props.mods.includes(o.value));

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
                            <div className="small text-muted">
                                {option.description}
                            </div>
                        )}
                    </span>
                );
            }}
            onChange={(newItems) => {
                const mods = newItems.map((item) => item.value);
                props.setMods(mods);
            }}
        />
    );
}

export default ModifierSelect;
