import Modal from "../../ui/Modal";
import RentalAgreementForm from "./RentalAgreementForm";
import { useUpdateRentalAgreement } from "./useUpdateRentalAgreement";
function EditRentalAgreeMent({ children, defaultValues }) {
    const { updateStatus, isLoading, } = useUpdateRentalAgreement();
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
        updateStatus({
            id: defaultValues.id,
            payload: formData,
        });
    }
    return <Modal>
        <Modal.Open openWindowName="edit-rental-agreement">
            {children}
        </Modal.Open>
        <Modal.Window name="edit-rental-agreement" overflow={true} >
            <RentalAgreementForm onSubmit={handleSubmit} submitButtonText="Edit Rental Agreement" isLoading={isLoading} defaultValues={defaultValues} />
        </Modal.Window>


    </Modal>;
}

export default EditRentalAgreeMent;
