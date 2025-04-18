import Filter from "../../../ui/Filter";

export default function RequestFilter() {
    return (
        <Filter>
            <Filter.Input
                registerName="portal_name"
                placeholder="Portal name example: dubizzle"
            />
            <Filter.Input
                registerName="agent_id"
                placeholder="Agent id"
            />
            <Filter.Input
                registerName="property_id"
                placeholder="Property id"
            />
            <Filter.InputSelect
                options={[
                    { value: "pending", label: "Pending" },
                    { value: "approved", label: "Approved" },
                    { value: "disapproved", label: "Rejected" },
                ]}
                registerName="status"
                placeholder="Status"
            />

        </Filter>
    );
}
