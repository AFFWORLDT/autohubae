import Table from "../../ui/Table";
import DeleteCustomer from "./DeleteCustomer";
import EditCustomerButton from "./EditCustomerButton";

function CustomerRow({ customerData }) {
    const {
        "Project name": Project_name,
        "Unit number": Unit_number,
        Name,
        Rooms,
        // "Total area": Total_area,
        Nationality,
        "E-mail": email,
        "Contact number": contact_number,
        "Second number": second_number,
        // agent_id,
        // area_id,
        customer_id,
        // _id,
        area: { name: area_name },
        agent: { name: agent_name },
    } = customerData;

    return (
        <Table.Row>
            <div>{Project_name}</div>
            <div>{Unit_number}</div>
            <div>{Name}</div>
            <div>{Rooms}</div>
            <div>{Nationality}</div>
            <div>{email}</div>
            <div>{contact_number}</div>
            <div>{second_number}</div>
            <div>{agent_name}</div>
            <div>{area_name}</div>
            <div style={{ display: "flex", gap: "12px" }}>
                <EditCustomerButton
                    customerId={customer_id}
                    customerData={customerData}
                />

                <DeleteCustomer customerId={customer_id} customerName={Name} />
            </div>
        </Table.Row>
    );
}

export default CustomerRow;
