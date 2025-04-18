import Modal from "../../../ui/Modal";
import styles from "../../../styles/BtnAdd.module.css";
import TeamForm from "./TeamForm";

function AddTeam() {
    return (
        <Modal>
            <Modal.Open openWindowName="addTeam">
                <button className={styles.btnAdd}>
                    <img src="/icons/add.svg" />
                    <span>Add</span>
                </button>
            </Modal.Open>
            <Modal.Window name="addTeam">
                <TeamForm />
            </Modal.Window>
        </Modal>
    );
}

export default AddTeam;
