import styles from "../../styles/BtnAdd.module.css";
import Modal from "../../ui/Modal";
import ChangeAreaAgentForm from "../ChangeAreaAgentForm";

function ChangeAreaAgents() {

    return (
        <Modal>
            <Modal.Open openWindowName="changeStaff" >
                <button className={styles.btnAdd}>
                    <img src="/icons/add.svg" />
                    <span>Change</span>
                </button>
            </Modal.Open>
            <Modal.Window name="changeStaff" overflow={true}  >
                <ChangeAreaAgentForm  />
            </Modal.Window>
        </Modal>
    );
}

export default ChangeAreaAgents;
