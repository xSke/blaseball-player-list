import { ReactNode } from "react";

function CheckboxOption(props: {
    id: string;
    value: boolean;
    setValue: (value: boolean) => void;
    children?: ReactNode;
}): JSX.Element {
    return (
        <div className="form-check">
            <input
                className="form-check-input"
                type="checkbox"
                checked={props.value}
                id={props.id}
                onChange={(e) => props.setValue(e.target.checked)}
            />
            <label className="form-check-label" htmlFor={props.id}>
                {props.children}
            </label>
        </div>
    );
}

export default CheckboxOption;
