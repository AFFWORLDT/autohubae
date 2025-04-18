import { createContext, useCallback, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { dateToYMD } from "../utils/utils";
import FormInputSelect from "./FormInputSelect";
import FormInputDataList from "./FormInputDataList";
import FormInputDatePicker from "./FormInputDatePicker";

const FilterContext = createContext();

const dateFields = [
    "dateStart",
    "dateEnd",
    "date_from",
    "date_to",
    "timestamp",
    "from_datetime",
    "to_datetime"
];
const reactSelectFields = [
    "developerIds",
    "developer_id",
    "area_id",
    "agent_id",
    "agent_Id", 
    "owner_id",
    "claimed"
];

let TIMER_ID; // To debounce the updating of searchParams in the URL

function Filter({ defaultValues, children, showReset = true }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { register, handleSubmit, reset, watch, control } = useForm({
        defaultValues,
    });


    const setQuery = useCallback(
        function setQuery(obj) {
            const paramsObj = {};
            for (const [key, val] of Object.entries(obj)) {
                if (val) paramsObj[key] = val;
            }
            setSearchParams(paramsObj);
        },
        [setSearchParams]
    );

    useEffect(() => {
        const subscription = watch((value) => {
            for (const item of dateFields) {
                if (value[item]) value[item] = dateToYMD(value[item]);
            }
            for (const item of reactSelectFields) {
                if (value[item]) {
                    if (Array.isArray(value[item])) {
                        value[item] = value[item].map(v => v.value).join(',');
                    } else {
                        value[item] = value[item].value;
                    }
                }
            }
            if (value.portal) {
                value.portal = value.portal.map((item) => item.value).join(',');
            }
            if (value.property_type) {
                value.property_type = value.property_type.map((item) => item.value).join(',');
            }
            if (value.tag) {
                value.tag = value.tag.map((item) => item.value).join(',');
            }
            if (value.stage) {
                value.stage = value.stage.map((item) => item.value).join(',');
            }
            if (value.group) {
                value.group = value.group.map((item) => item.value).join(',');
            }
            if (value.phone) {
                value.phone = encodeURIComponent(value.phone);
            }
            if (value.handover_year) {
                value.handover_year = new Date(
                    value.handover_year
                ).getFullYear();
            }

            // Debouncing
            if (TIMER_ID) clearTimeout(TIMER_ID);
            TIMER_ID = setTimeout(() => {
                setQuery(value);
                TIMER_ID = null;
            }, 500);
        });
        return () => subscription.unsubscribe();
    }, [watch, setQuery]);

    useEffect(() => {
        const currentFilters = {};
        searchParams.forEach((paramVal, paramKey) => {
            if (reactSelectFields.includes(paramKey)) {
                if (paramVal.includes(',')) {
                    currentFilters[paramKey] = paramVal.split(',').map(val => ({
                        value: Number(val),
                        label: capitalize(val)
                    }));
                } else {
                    currentFilters[paramKey] = { value: Number(paramVal) };
                }
            } else if (paramKey === 'portal') {
                currentFilters[paramKey] = paramVal.split(',').map((item) => ({
                    value: item,
                    label: capitalize(item),
                }));
            } else if (paramKey === 'group') {
                currentFilters[paramKey] = paramVal.split(',').map((item) => ({
                    value: item,
                    label: capitalize(item),
                }));
            } else if (paramKey === 'tag') {
                currentFilters[paramKey] = paramVal.split(',').map((item) => ({
                    value: item,
                    label: capitalize(item),
                }));
            } else if (paramKey === 'stage') {
                currentFilters[paramKey] = paramVal.split(',').map((item) => ({
                    value: item,
                    label: capitalize(item),
                }));
            } else if(paramKey==="property_type"){
                currentFilters[paramKey] = paramVal.split(',').map((item) => ({
                    value: item,
                    label: capitalize(item),
                }));
            } else {
                currentFilters[paramKey] = paramVal;
            }
        });
        reset(currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset]);

    // Helper function to capitalize the portal labels if needed
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }


    function onSubmit(formData) {
        setQuery(formData);
    }

    function handleReset(e) {
        e.preventDefault();
        reset(defaultValues);
        setSearchParams({});
        window.location.reload();
    }

    return (
        <FilterContext.Provider value={{ register, control, handleReset }}>
            <div>
                <form className="filterForm" onSubmit={handleSubmit(onSubmit)}>
                    {children}

                    {showReset && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="btnReset"
                        >
                            <img src="/icons/reset.svg" alt="Reset" />
                            <span>Reset</span>
                        </button>
                    )}

                    <button style={{ display: "none" }} type="submit"></button>
                </form>
            </div>
        </FilterContext.Provider>
    );
}

function Input({ type = "text", registerName, placeholder }) {
    const { register } = useContext(FilterContext);

    return (
        <input
            {...register(registerName)}
            type={type}
            placeholder={placeholder}
        />
    );
}

function InputDatePicker({ registerName, placeholder, isYearPicker = false }) {
    const { control } = useContext(FilterContext);

    return (
        <FormInputDatePicker
            control={control}
            registerName={registerName}
            placeholder={placeholder}
            isYearPicker={isYearPicker}
        />
    );
}

function InputSelect({ registerName, options }) {
    const { register } = useContext(FilterContext);

    return (
        <FormInputSelect
            register={register}
            registerName={registerName}
            options={options}
        />
    );
}

function InputDataList({ registerName, placeholder, data, isLoading, isMulti = false }) {
    const { control } = useContext(FilterContext);

    return (
        <FormInputDataList
            control={control}
            registerName={registerName}
            data={data}
            placeholder={placeholder}
            isLoading={isLoading}
            isMulti={isMulti}
        />
    );
}

Filter.Input = Input;
Filter.InputDatePicker = InputDatePicker;
Filter.InputSelect = InputSelect;
Filter.InputDataList = InputDataList;

export default Filter;
