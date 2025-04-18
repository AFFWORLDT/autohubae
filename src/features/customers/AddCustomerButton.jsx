import Modal from "../../ui/Modal";
import useCreateCustomer from "./useCreateCustomer";
import styles from "./UploadExcelForm.module.css";
import CustomerForm from "./CustomerForm";
function AddCustomerButton() {
    const { create, isCreating } = useCreateCustomer();
    const handleSubmit = (data) => {
        create(data);
    };
    return (
        <Modal>
            <Modal.Open openWindowName="add-customer" >
                <button className={`${styles.button} `}>
                    <svg
                        className={styles.buttonIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    <span>Add Customer</span>
                </button>
            </Modal.Open>

            <Modal.Window name="add-customer" overflow={true}>
                <CustomerForm onSubmit={handleSubmit} isWorking={isCreating} />
            </Modal.Window>
        </Modal>
    );
}

export default AddCustomerButton;
