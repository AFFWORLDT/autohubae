import { BEDROOM_NUM_OPTIONS, PORTAL_OPTIONS, PROPERTY_TYPES } from "../../utils/constants";
import Filter from "../../ui/Filter";
// import useBrowserWidth from "../../hooks/useBrowserWidth";
// import Modal from "../../ui/Modal";
import useAreasWithoutCount from "../areas/useAreasWithoutCount";
import useDevelopersWithoutCount from "../developers/useDevelopersWithoutCount";
import useStaff from "../admin/staff/useStaff";

const defaultValues = {
    project_name: "",
    date_from: "",
    date_to: "",
    property_id: "",
    property_type: "",
    area_id: "",
    developer_id: "",
    bedrooms: "",
    agent_id: "",
    portal: [],
    min_price: "",
    max_price: "",
    handover_year: "",
};


function NewPropertiesFilter() {
    // const browserWidth = useBrowserWidth();
    const { isLoading: isDeveloperLoading, data: developerData } =
        useDevelopersWithoutCount(true);
    const { data: areaData, isLoading: isAreaLoading } =
        useAreasWithoutCount(true);
    const { data: agentData, isLoading: isAgentLoading } = useStaff()

    const developerOptions = developerData.map((data) => {
        return {
            value: data.id,
            label: data.name,
        };
    });
    const areaOptions = areaData.map((item) => {
        return { value: item.id, label: item.name };
    });
    const agentOptions = agentData.map((item) => {
        return { value: item.id, label: item.name };
    });

    return (
        <Filter defaultValues={defaultValues}>

            <ExtraFilters
                developerOptions={developerOptions}
                isDeveloperLoading={isDeveloperLoading}
                areaOptions={areaOptions}
                isAreaLoading={isAreaLoading}
                agentOptions={agentOptions}
                isAgentLoading={isAgentLoading}
            />
        </Filter>
    );
}

function ExtraFilters({
    developerOptions,
    isDeveloperLoading,
    areaOptions,
    isAreaLoading,
}) {
    return (
        <>
            <Filter.Input registerName="project_name" placeholder="Name" />

            <Filter.InputDatePicker
                registerName="date_from"
                placeholder="Start date"
            />
            <Filter.InputDatePicker
                registerName="date_to"
                placeholder="End date"
            />
            <Filter.Input
                registerName="project_id"
                placeholder="Property ID"
                type="number"
            />
            <Filter.Input
                registerName="min_price"
                placeholder="Min Price"
                type="number"
            /> <Filter.Input
                registerName="max_price"
                placeholder="Max Price"
                type="number"
            />
            <Filter.InputSelect
                registerName="property_type"
                options={PROPERTY_TYPES}
            />
            <Filter.InputDataList
                registerName="area_id"
                placeholder="Area"
                data={areaOptions}
                isLoading={isAreaLoading}
            />

            <Filter.InputDataList
                registerName="developer_id"
                placeholder="Developer"
                data={developerOptions}
                isLoading={isDeveloperLoading}
            />
            <Filter.InputDataList
                registerName="portals"
                placeholder="Portal"
                data={PORTAL_OPTIONS || []}
                isLoading={isDeveloperLoading}
                isMulti
            />
            <Filter.InputSelect
                registerName="bedrooms"
                options={BEDROOM_NUM_OPTIONS}
            />
            <Filter.InputDatePicker
                registerName="handover_year"
                placeholder="Handover Year"
                isYearPicker={true} />
        </>
    );
}

export default NewPropertiesFilter;
