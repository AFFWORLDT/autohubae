import Modal from "../../ui/Modal";
import styles from "./FollowUps.module.css";
import useCreateFollowUp from "./useCreateFollowUp";
import useFollowUps from "./useFollowUps";
import { getDaysFromCurrentDate } from "../../utils/utils";
import useStages from "../stages/useStages";
import useRating from "../rating/useRating";
import useStatus from "../status/useStatus";
import { useForm } from "react-hook-form";
import FormInputDataList from "../../ui/FormInputDataList";
import { format } from 'date-fns';

function
    FollowUps({ type, targetId, maxWidth = null, isForProperty = false }) {
    const { isLoading, data, error } = useFollowUps(type, targetId);

    return (
        <div style={{ maxWidth }} className={`sectionDiv ${styles.followUps}`}>
            <div className={styles.followUpsTop}>
                <h3>
                    <img src="/icons/description.svg" alt="" />
                    <span>Follow Up</span>
                </h3>
                <Modal>
                    <Modal.Open openWindowName="addFollowUp">
                        <button className={styles.btnAddFollowUp}>
                            <img src="/icons/add.svg" />
                            <span>Add</span>
                        </button>
                    </Modal.Open>
                    <Modal.Window name="addFollowUp">
                        <FollowUpForm type={type} targetId={targetId} isForProperty={isForProperty} />
                    </Modal.Window>
                </Modal>
            </div>

            <div
                style={{
                    gridTemplateColumns: maxWidth ? "repeat(1, 1fr)" : "",
                    gap: "1.9rem",
                }}
                className={styles.followUpsContent}
            >
                {isLoading || error || !data.length ? (
                    <p >No Data Found</p>
                ) : (
                    data.map((item) => (
                        <div className={styles.followUpItem} key={item.id}>
                            <div>
                                <img src={item.agent_avatar} />
                                <h4>{item.agent_name}</h4>

                                <span>
                                    {`${getDaysFromCurrentDate(item.created_at)} days ago`}
                                </span>
                            </div>

                            <div>
                                <p>{item.text}</p>
                            </div>
                            <h4 style={{
                                color: item.stage_data?.color_code
                            }}>{item.stage_data?.name}</h4>

                            <h4 style={{
                                color: item.rating_data?.color_code
                            }}>{item.rating_data?.name}</h4>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function FollowUpForm({ type, targetId, onCloseModal, isForProperty = false }) {
    const { addFollowUp, isPending } = useCreateFollowUp();
    const { data: stages, isLoading: isStagesLoading, } = useStages("leads");
    const { data: rating, isLoading: isRatingLoading } = useRating("leads");
    const { data: status, isLoading: isStatusLoading } = useStatus("leads");
    
    const getCurrentDateTime = () => {
        const now = new Date();
        return {
            date: format(now, 'yyyy-MM-dd'),
            time: format(now, 'HH:mm')
        };
    };

    const currentDateTime = getCurrentDateTime();

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

    const { register, handleSubmit, reset, control } = useForm({
        defaultValues: {
            followupDate: currentDateTime.date,
            followupTime: currentDateTime.time
        }
    });

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
                </div>

                <div className={styles.followUpDateTimeGroup}>
                    <div className={styles.formFieldGroup}>
                        <label>Follow-up Date</label>
                        <input
                            type="date"
                            {...register("followupDate")}
                            defaultValue={currentDateTime.date}
                        />
                    </div>
                    <div className={styles.formFieldGroup}>
                        <label>Follow-up Time</label>
                        <input
                            type="time"
                            {...register("followupTime")}
                            defaultValue={currentDateTime.time}
                        />
                    </div>
                </div>

                {!isForProperty && <><div className={styles.formFieldGroup}>
                    <label>Stages</label>
                    <FormInputDataList
                        control={control}
                        registerName={"stages"}
                        isLoading={isStagesLoading}
                        placeholder={"Stages"}
                        isDisabled={isStagesLoading}
                        data={modifiedStageData || []} />
                </div><div className={styles.formFieldGroup}>
                        <label>Rating</label>
                        <FormInputDataList
                            control={control}
                            registerName={"rating"}
                            isLoading={isRatingLoading}
                            isDisabled={isRatingLoading}
                            placeholder={"Rating"}
                            data={modifiedRatingData || []} />
                    </div><div className={styles.formFieldGroup}>
                        <label>Status</label>
                        <FormInputDataList
                            control={control}
                            registerName={"status"}
                            isLoading={isStatusLoading}
                            isDisabled={isStatusLoading}
                            placeholder={"Status"}
                            data={modifiedStatusData || []} />
                    </div></>}
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

export default FollowUps;
