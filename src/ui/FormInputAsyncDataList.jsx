/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react";
import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const FormInputAsyncDataList = ({
    control,
    registerName,
    placeholder,
    required,
    asyncFunc,
    formatFunc,
}) => {
    const debouncedLoadOptions = useCallback(
        debounce(async (inputValue, callback) => {
            try {
                const data = await asyncFunc(inputValue);
                const options = formatFunc(data);
                callback(options);
            } catch (error) {
                console.error("Error loading options:", error);
                callback([]);
            }
        }, 300),
        [asyncFunc, formatFunc]
    );

    return (
        <Controller
            name={registerName}
            control={control}
            rules={{
                required: required ? "This field is required" : false,
            }}
            defaultValue=""
            render={({ field }) => (
                <AsyncSelect
                    {...field}
                    cacheOptions
                    loadOptions={debouncedLoadOptions}
                    defaultOptions
                    placeholder={placeholder}
                    required={required}
                    onChange={(selectedOption) =>
                        field.onChange(selectedOption)
                    }
                />
            )}
        />
    );
};

export default FormInputAsyncDataList;
