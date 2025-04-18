import styles from './AddLeadFollowup.module.css';
import useCreateFollowUp from "../../features/followUps/useCreateFollowUp";
import Modal from "../../ui/Modal";
import { useForm } from 'react-hook-form';
import FormInputDataList from '../../ui/FormInputDataList';
import useStages from '../../features/stages/useStages';
import useRating from '../../features/rating/useRating';
import useStatus from '../../features/status/useStatus';

function AddLeadFollowup({ type, targetId, maxWidth = null, comment }) {


    return (
        <div className={`${styles.followUpsWrapper} ${maxWidth ? styles.customWidth : ''}`}>
            <div className={styles.followUpsTop}>
                <Modal>
                    <Modal.Open openWindowName="addFollowUp">
                        <button className={styles.btnAddFollowUp}>
                            <img src="/icons/eye.svg" alt="Add Follow Up" />
                        </button>
                    </Modal.Open>
                    <Modal.Window name="addFollowUp">
                        <FollowUpForm type={type} targetId={targetId} comment={comment} />
                    </Modal.Window>
                </Modal>
            </div>
        </div>
    );
}

export function FollowUpForm({ type, targetId, onCloseModal }) {
    const { data: stages, isLoading: isStagesLoading, } = useStages("leads");
    const { data: rating, isLoading: isRatingLoading } = useRating("leads");
    const { data: status, isLoading: isStatusLoading } = useStatus("leads");

    const modifiedStatusData = status?.map((status) => ({
        value: status._id,
        label: status.name,
    }));

    const modifiedRatingData = rating?.map((rating) => ({
        value: rating._id,
        label: rating.name,
    }));

    const modifiedStageData = stages?.map((stage) => ({
        value: stage._id,
        label: stage.name,
    }));
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
    const { addFollowUp, isPending } = useCreateFollowUp();

    const onSubmit = (data) => {
        const followupDateTime = `${data.followupDate}T${data.followupTime}`;

        addFollowUp(
            {
                type,
                target_id: targetId,
                nextfollowupdate: followupDateTime,
                text: data.text,
                stages: data.stages ? data.stages.value.toString() : null,
                "rating": data.rating ? data.rating.value.toString() : null,
                "status": data.status ? data.status.value.toString() : null
            },
            {
                onSettled: () => {
                    reset();
                    onCloseModal();
                },
            }
        );
    };

    return (
        <div className={styles.followUpForm}>
            <h3>Add {type === "lead" ? "Lead" : "Client"} Follow Up</h3>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.followUpFormGrid}>
                <div>

                    <textarea
                        {...register("text")}
                        placeholder="remark"
                        rows={2}
                        className={styles.textareaField}
                    />
                    {(errors.text) && (
                        <span className={styles.error}>
                            {errors.text?.message}
                        </span>
                    )}

                </div>

                <div className={styles.followUpDateTimeGroup}>
                    <div className={styles.formFieldGroup}>
                        <label>Follow-up Date</label>
                        <input
                            type="date"
                            {...register("followupDate")}
                        />
                    </div>
                    <div className={styles.formFieldGroup}>
                        <label>Follow-up Time</label>
                        <input
                            type="time"
                            {...register("followupTime")}
                        />
                    </div>
                </div>
                {(errors.followupDate || errors.followupTime) && (
                    <span className={styles.error}>
                        {errors.followupDate?.message || errors.followupTime?.message}
                    </span>
                )}

                <div className={styles.formFieldGroup}>
                    <label>Stages</label>
                    <FormInputDataList
                        control={control}
                        registerName={"stages"}
                        isLoading={isStagesLoading}
                        placeholder={"Stages"}
                        isDisabled={isStagesLoading}
                        
                        data={modifiedStageData || []} />
                </div>
                <div className={styles.formFieldGroup}>
                    <label>Rating</label>
                    <FormInputDataList
                        control={control}
                        registerName={"rating"}
                        isLoading={isRatingLoading}
                        isDisabled={isRatingLoading}
                        placeholder={"Rating"}
                        
                        data={modifiedRatingData || []} />
                </div>
                <div className={styles.formFieldGroup}>
                    <label>Status</label>
                    <FormInputDataList
                        control={control}
                        registerName={"status"}
                        isLoading={isStatusLoading}
                        isDisabled={isStatusLoading}
                        placeholder={"Status"}
                        
                        data={modifiedStatusData || []} />
                </div>
                <button
                    className={"btnSubmit"}
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? "Adding..." : "Add"}
                </button>
            </form>
        </div>
    );
}

export default AddLeadFollowup;
