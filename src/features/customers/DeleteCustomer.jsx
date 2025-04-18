import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import useDeleteCustomer from "./useDeleteCustomer";
import { TrashIcon } from "lucide-react";

function DeleteCustomer({ customerId, customerName }) {
    const { deleteCustomer, isDeleting } = useDeleteCustomer();

    const commonButtonStyles = {
        padding: "6px 12px",
        borderRadius: "8px",
        backgroundColor: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "14px",
        fontWeight: "800",
        transition: "all 0.2s ease",
    };

    return (
        <Modal>
            <Modal.Open openWindowName="deleteCustomer">
                <button
                    style={{
                        ...commonButtonStyles,
                        border: "0.1px dashed #db0a0a",
                        color: "#db0a0a",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#fce1e1";
                        e.target.style.color = "#db0a0a";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "#db0a0a";
                    }}
                >
                    <TrashIcon size={20} /> Delete
                </button>
            </Modal.Open>
            <Modal.Window name="deleteCustomer">
                <ConfirmDelete
                    resourceName={`Customer ${customerName}`}
                    onConfirm={() => {
                        deleteCustomer(customerId);
                    }}
                    isDeleting={isDeleting}
                />
            </Modal.Window>
        </Modal>
    );
}

export default DeleteCustomer;
