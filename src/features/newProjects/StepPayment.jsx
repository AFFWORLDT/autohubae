import styles from "../../styles/MultiStepForm.module.css";
import MultiStepForm, { useMultiStepForm } from "../../ui/MultiStepForm";

function StepPayment() {
    const { watch } = useMultiStepForm();
    const firstInstallment = watch("first_installment");
    const underConstruction = watch("under_construction");
    const postHandover = watch("on_handover");
    const onHandover = watch("post_handover");

    const totalPercent =
        (Number(firstInstallment) || 0) +
        (Number(underConstruction) || 0) +
        (Number(postHandover) || 0) +
        (Number(onHandover) || 0);

    function validatePercent() {
        if (totalPercent === 100) {
            // return true;
        }
        // return "The 'Total Percentage' should be 100%";
    }

    return (
        <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
            <div className={styles.formContainer}>
                <MultiStepForm.Input
                    registerName="first_installment"
                    type="number"
                    placeholder="(in %)"
                    valueAsNumber={true}
                    customValidation={validatePercent}
                    label="First Installment"
                />
                <MultiStepForm.Input
                    registerName="under_construction"
                    type="number"
                    placeholder="(in %)"
                    valueAsNumber={true}
                    customValidation={validatePercent}
                    label="Under Construction"
                />
                <MultiStepForm.Input
                    registerName="on_handover"
                    type="number"
                    placeholder="(in %)"
                    valueAsNumber={true}
                    customValidation={validatePercent}
                    label="On Handover"
                />
                <MultiStepForm.Input
                    registerName="post_handover"
                    type="number"
                    placeholder="(in %)"
                    valueAsNumber={true}
                    customValidation={validatePercent}
                    label="Post Handover"
                />
                <div className={styles.inputContainer}>
                    <label>Total Percentage: </label>
                    <div className={styles.subContainer}>
                        <input
                            type="text"
                            value={`${totalPercent}%`}
                            disabled
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StepPayment;
