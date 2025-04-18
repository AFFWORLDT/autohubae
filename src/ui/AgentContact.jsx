import useStaff from "../features/admin/staff/useStaff";
import AgentChangeModal from "./AgentChangeModal";
import styles from "./AgentContact.module.css";
import Modal from "./Modal";

function AgentContact({
    onChangeAgent,
    isChangingAgent,
    agentAvatar,
    agentName,
    agentPhone,
    agentMail,
}) {
    const { data, isLoading } = useStaff();

    return (
        <div>
            <div className={styles.agentContent}>
                <div className={styles.agentAvatar}>
                    <img src={agentAvatar} />
                </div>
                <span className={styles.agentName}>{agentName}</span>
                <Modal>
                    <Modal.Open openWindowName="chooseAgent">
                        <button
                            className={styles.btnChooseAgent}
                            disabled={isLoading}
                        >
                            <img src="/icons/chevron-down.svg" />
                        </button>
                    </Modal.Open>
                    <Modal.Window name="chooseAgent">
                        <AgentChangeModal
                            staffData={data}
                            onChangeAgent={onChangeAgent}
                            isChangingAgent={isChangingAgent}
                        />
                    </Modal.Window>
                </Modal>
            </div>

            <div className={styles.itemContact}>
                <a href={`tel:${agentPhone}`}>
                    <img src="/icons/call.svg" />
                    <span>Call</span>
                </a>
                <a href={`mailto:${agentMail}`}>
                    <img src="/icons/mail.svg" />
                    <span>Email</span>
                </a>
            </div>
        </div>
    );
}

export default AgentContact;
