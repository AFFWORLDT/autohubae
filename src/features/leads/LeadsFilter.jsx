import Filter from "../../ui/Filter";
import {
    BEDROOM_NUM_OPTIONS,
    CLAIM_OPTIONS,
    PROPERTY_TYPES,
    SOURCE_OPTIONS,
} from "../../utils/constants";
import useStaff from "../admin/staff/useStaff";
import useGroups from "../groups/useGroups";
import useStages from "../stages/useStages";
import useTags from "../tags/useTags";

const defaultValues = {
    name: "",
    date_from: "",
    date_to: "",
    agent_id: "",
    phone: "",
    property_type: "",
    rooms: "",
    nationality: "",
    claimed: "",
    client_source: "",
    tag: "",
    stage: "",
    group: "",
};

function LeadsFilter() {
    const { data: staffData, isLoading: isStaffLoading } = useStaff();
    const { data: tagData, isLoading: isTagLoading } = useTags("leads");
    const { data: stagesData, isLoading: isStagesLoading } = useStages("leads");
    const { data: groupsData, isLoading: isGroupsLoading } = useGroups("leads");

    const tagOptions =
        tagData?.map((item) => ({
            value: item._id,
            label: item.name,
        })) || [];

    const stagesOptions =
        stagesData?.map((item) => ({
            value: item._id,
            label: item.name,
        })) || [];

    const groupsOptions =
        groupsData?.map((item) => ({
            value: item._id,
            label: item.name,
        })) || [];

    const staffOptions =
        staffData?.map((item) => ({
            value: item.id,
            label: item.name,
        })) || [];

    return (
        <Filter defaultValues={defaultValues}>
            <ExtraFilters
                staffOptions={staffOptions}
                isStaffLoading={isStaffLoading}
                tagOptions={tagOptions}
                isTagLoading={isTagLoading}
                stagesOptions={stagesOptions}
                isStagesLoading={isStagesLoading}
                groupsOptions={groupsOptions}
                isGroupsLoading={isGroupsLoading}
            />
        </Filter>
    );
}

function ExtraFilters({
    staffOptions,
    isStaffLoading,
    tagOptions,
    isTagLoading,
    stagesOptions,
    isStagesLoading,
    groupsOptions,
    isGroupsLoading,
}) {
    return (
        <>
            <Filter.Input registerName="name" placeholder="Name" />

            <Filter.InputDatePicker
                registerName="date_from"
                placeholder="Start Date"
            />
            <Filter.InputDatePicker
                registerName="date_to"
                placeholder="End Date"
            />
            <Filter.InputDataList
                registerName="agent_id"
                data={staffOptions}
                isLoading={isStaffLoading}
                placeholder="Select Agent"
            />
            <Filter.Input registerName="phone" placeholder="Phone" />
            <Filter.InputSelect
                registerName="property_type"
                options={PROPERTY_TYPES}
            />
            <Filter.InputSelect
                registerName="rooms"
                options={BEDROOM_NUM_OPTIONS}
            />
            <Filter.Input
                registerName="nationality"
                placeholder="Nationality"
            />
            <Filter.InputSelect
                registerName="claimed"
                options={CLAIM_OPTIONS}
            />
            <Filter.InputSelect
                registerName="client_source"
                options={SOURCE_OPTIONS}
            />
            <Filter.InputDataList
                registerName="tag"
                placeholder="Tags"
                data={tagOptions}
                isLoading={isTagLoading}
                isMulti
            />
            <Filter.InputDataList
                registerName="stage"
                placeholder="Stage"
                data={stagesOptions}
                isLoading={isStagesLoading}
                isMulti
            />
            <Filter.InputDataList
                registerName="group"
                placeholder="Group"
                data={groupsOptions}
                isLoading={isGroupsLoading}
                isMulti
            />
        </>
    );
}

export default LeadsFilter;
