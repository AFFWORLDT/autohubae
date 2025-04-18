import {
    BEDROOM_NUM_OPTIONS,
    PORTAL_OPTIONS,
    PROPERTY_TYPES_GROUPS_OPTION,
    COMPLETION_STATUS_OPTIONS
} from "../../utils/constants";
import Filter from "../../ui/Filter";
import useBrowserWidth from "../../hooks/useBrowserWidth";
import useAreasWithoutCount from "../areas/useAreasWithoutCount";
import useDevelopersWithoutCount from "../developers/useDevelopersWithoutCount";
import useStaff from "../admin/staff/useStaff";
// import useOwner from "../Owner/useOwner";
import useInfiniteOwners from "../Owner/useInfiniteOwners";

const defaultValues = {
    title: "",
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
    owner_id: "",
    completion_status: ""
};

function NewPropertiesFilter() {
    const browserWidth = useBrowserWidth();
    const { isLoading: isDeveloperLoading, data: developerData } =
        useDevelopersWithoutCount(true);
    const { data: areaData, isLoading: isAreaLoading } =
        useAreasWithoutCount(true);
    const { data: agentData, isLoading: isAgentLoading } = useStaff();
    // const {
    //     data: Owner,
    //     isLoading: isOwnerLoading,
    //     isError: isOwnerError,
    // } = useOwner();

    const { owners: Owner, isLoading: isOwnerLoading, isError: isOwnerError } =
        useInfiniteOwners("", true);
    const ownersOption = Owner?.map((data) => {
        return {
            value: data?.id,
            label: data?.owner_name,
        };
    });



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
            {browserWidth > 480 ? (
                <ExtraFilters
                    developerOptions={developerOptions}
                    isDeveloperLoading={isDeveloperLoading}
                    areaOptions={areaOptions}
                    isAreaLoading={isAreaLoading}
                    agentOptions={agentOptions}
                    isAgentLoading={isAgentLoading}
                    ownersOption={ownersOption}
                    isOwnerLoading={isOwnerLoading}
                    isOwnerError={isOwnerError}
                />
            ) : (

                <div className="filterModalContainer">
                    <ExtraFilters
                        developerOptions={developerOptions}
                        isDeveloperLoading={isDeveloperLoading}
                        areaOptions={areaOptions}
                        isAreaLoading={isAreaLoading}
                        agentOptions={agentOptions}
                        isAgentLoading={isAgentLoading}
                        ownersOption={ownersOption}
                        isOwnerLoading={isOwnerLoading}
                        isOwnerError={isOwnerError}
                    />
                </div>
            )}
        </Filter>
    );
}

function ExtraFilters({
    developerOptions,
    isDeveloperLoading,
    areaOptions,
    agentOptions,
    isAgentLoading,
    isAreaLoading,
    ownersOption,
    isOwnerLoading,
}) {
    const fullUrl = window.location.href;
    const type = new URL(fullUrl);
    const pathname = type.pathname;
    const segments = pathname.split("/");
    const extractedPart = segments[1] ? `${segments[1]}` : "";
    return (
        <>
            <Filter.Input registerName="title" placeholder="Name" />

            <Filter.InputDatePicker
                registerName="date_from"
                placeholder="Start date"
            />
            <Filter.InputDatePicker
                registerName="date_to"
                placeholder="End date"
            />
            <Filter.Input
                registerName="property_id"
                placeholder="Property ID"
            />
            <Filter.Input
                registerName="min_price"
                placeholder="Min price"
                type="number"
            />{" "}
            <Filter.Input
                registerName="max_price"
                placeholder="Max price"
                type="number"
            />
            <Filter.InputDataList
                registerName="property_type"
                placeholder="Property Type"
                data={PROPERTY_TYPES_GROUPS_OPTION}
                isMulti
            />
            <Filter.InputDataList
                registerName="area_id"
                placeholder="Area"
                data={areaOptions}
                isLoading={isAreaLoading}
            />
            <Filter.InputDataList
                registerName={"owner_id"}
                placeholder={"Owner"}
                data={ownersOption || []}
                isLoading={isOwnerLoading}
            />
            {/* <Filter.InputDataList
                registerName="agent_id"
                placeholder="Agent"
                data={agentOptions}
                isLoading={isAgentLoading}
            /> */}
            <Filter.InputDataList
                registerName="developer_id"
                placeholder="Developer"
                data={developerOptions}
                isLoading={isDeveloperLoading}
            />
            <Filter.InputDataList
                registerName="portal"
                placeholder="Portal"
                data={PORTAL_OPTIONS || []}
                isMulti
            />{
                extractedPart === "for-sell" && (
                    <Filter.InputSelect
                        registerName="completion_status"
                        placeholder="completion_status"
                        options={COMPLETION_STATUS_OPTIONS}
                    />
                )
            }

            <Filter.InputSelect
                registerName="bedrooms"
                options={BEDROOM_NUM_OPTIONS}
            />
        </>
    );
}

export default NewPropertiesFilter;
