import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import CustomerRow from "./CustomerRow";

function CustomerTable({ data, isLoading }) {
    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <Table
            columns="1.20fr 1fr 1.20fr 1fr 1fr 1fr 1.40fr 1fr 1fr 1fr 1fr"
            rowWidth="280rem"
            transparent={true}
            hasShadow={true}
            hasBorder={true}
        >
            <Table.Header>
                <div>Project Name</div>
                <div>Unit Number</div>
                <div>Name</div>
                <div>Rooms</div>
                <div>Nationality</div>
                <div>Email</div>
                <div>Contact Number</div>
                <div>Second Number</div>
                <div>Agent Name</div>
                <div>Area Name</div>
                <div>Action</div>
            </Table.Header>
            <Table.Body
                data={data}
                render={(customerObj) => (
                    <CustomerRow
                        customerData={customerObj}
                        key={customerObj?._id}
                    />
                )}
            />
        </Table>
    );
}

export default CustomerTable;
