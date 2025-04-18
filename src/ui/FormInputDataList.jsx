import { Controller } from "react-hook-form";
import Select from "react-select";
import REACT_SELECT_STYLES from "../styles/reactSelectStyles";

function FormInputDataList({
    control,
    registerName,
    data,
    placeholder,
    isLoading,
    isDisabled,
    required,
    isMulti,
}) {
    // Custom MultiValue component to show only first value and count
    const MultiValue = ({ index, getValue }) => {
        const values = getValue();
        if (index === 0) {
            return values[0].label;
        }
        if (index === 1 && values.length > 1) {
            return `+${values.length - 1}`;
        }
        return null;
    };

    return (
        <Controller
            name={registerName}
            control={control}
            rules={{
                required: required ? "This field is required" : false,
            }}
            defaultValue=""
            render={({ field }) => (
                <Select
                    {...field}
                    options={data}
                    isMulti={isMulti}
                    placeholder={placeholder}
                    isDisabled={isLoading || isDisabled}
                    styles={{
                        ...REACT_SELECT_STYLES,
                        multiValue: (base) => ({
                            ...base,
                            backgroundColor: '#e2e8f0',
                            borderRadius: '4px',
                            padding: '2px 6px',
                        }),
                        multiValueLabel: (base) => ({
                            ...base,
                            color: '#1a202c',
                            fontSize: '14px',
                        }),
                    }}
                    required={required}
                    components={isMulti ? {
                        MultiValue,
                    } : undefined}
                />
            )}
        />
    );
}

export default FormInputDataList;