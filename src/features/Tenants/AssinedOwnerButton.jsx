import { RefreshCcw } from "lucide-react";
import Modal from "../../ui/Modal";
import { AssignOwnerForm } from "../../ui/ConfirmDelete";
import useBulkAssignerAgentToOwner from "../Owner/useBulkAssignerAgentToOwner";
import styles from "./AssignedOwnerButton.module.css";

function AssignedOwnerButton({ id }) {
    const { bulkAssignOwner,isPending  } = useBulkAssignerAgentToOwner();
    function handleConfirm(data) {
        bulkAssignOwner({
            owner_ids: [id],
            new_agent_id: data.newOwnerId?.value,
        },);
    }
    return (
        <Modal>
            <Modal.Open openWindowName="assignOwner">
                <button className={styles.btnAdd}>
                    <RefreshCcw size={16} className={styles.icon} />
                    <span>Assign Agent</span>
                </button>
            </Modal.Open>
            <Modal.Window name="assignOwner" overflow={true}>
                <AssignOwnerForm
                    resourceName={id}
                    onConfirm={handleConfirm}
                    id={id}
                    isPending={isPending}
                />
            </Modal.Window>
        </Modal>
    );
}

export default AssignedOwnerButton;
