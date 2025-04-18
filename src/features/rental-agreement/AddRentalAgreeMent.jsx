import Modal from "../../ui/Modal";
import RentalAgreementForm from "./RentalAgreementForm";
import useCreateRentalAgreement from "./useCreateRentalAgreement";
function AddRentalAgreeMent({ children

}) {
    const { addRentalAgreement, isLoading, } = useCreateRentalAgreement();
    const handleSubmit = (data) => {
        const formData = {
            ...data,
            property_id: data.property_id.value,
            tenant_id: data.tenant_id.value,
            payment_frequency: data.payment_frequency.value,
            number_of_cheques: data.number_of_cheques,
            rent_amount: Number(data.rent_amount),
            security_deposit: Number(data.security_deposit),
            status: "ACTIVE",
        }
        addRentalAgreement(formData);
    }
    return <Modal>
        <Modal.Open openWindowName="add-rental-agreement">
            {children}
        </Modal.Open>
        <Modal.Window name="add-rental-agreement" overflow={true} >
            <RentalAgreementForm onSubmit={handleSubmit} submitButtonText="Add Rental Agreement" isLoading={isLoading} />
        </Modal.Window>


    </Modal>;
}

export default AddRentalAgreeMent;
