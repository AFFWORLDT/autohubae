import styles from "../../styles/BtnAdd.module.css";
import Modal from "../../ui/Modal";
import ChangeDeveloperAgentForm from "./ChangeDeveloperAgentForm";

function ChangeDeveloperAgents() {

    return (
        <Modal>
            <Modal.Open openWindowName="changeStaff" >
                <button className={styles.btnAdd}>
                    <img src="/icons/add.svg" />
                    <span>Change</span>
                </button>
            </Modal.Open>
            <Modal.Window name="changeStaff" overflow={true}  >
                <ChangeDeveloperAgentForm  />
            </Modal.Window>
        </Modal>
    );
}

export default ChangeDeveloperAgents;
