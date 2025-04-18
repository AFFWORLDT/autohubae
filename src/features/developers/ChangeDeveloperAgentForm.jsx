import { useForm } from "react-hook-form";
import styles from "../../styles/FormGrid.module.css";
import FormInputDataList from "../../ui/FormInputDataList";
import toast from "react-hot-toast";
import useAssignedBulkAgentToDeveloper from "./useAssignedBulkAgentToDeveloper";
import useDevelopers from "./useDevelopers";
import useStaff from "../admin/staff/useStaff";

function ChangeDeveloperAgentForm({ onCloseModal }) {
    const { data: staffData, isLoading: isLoadingStaff } = useStaff();
    const { data: developerData, isLoading: isDeveloperLoading } = useDevelopers();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({});
    const { isPending, assignAgents } = useAssignedBulkAgentToDeveloper();

    const staffOptions = staffData.map((item) => {
        return { value: item.id, label: item.name };
    });
    const areaOption = developerData?.map((item) => {
        return { value: item.id, label: item.name };
    });

    const onSubmit = (data) => {
        if (!data.new_agent_id) {
            toast.error("Please select agent to replace with");
            return;
        }

        if (data.developer_ids) {
            assignAgents(
                {
                    developer_ids: [data.developer_ids.value],
                    new_agent_id: data.new_agent_id.value,
                },
                {
                    onSettled: () => {
                        onCloseModal();
                    },
                }
            );
        }
    };

    return (
        <div className={styles.bodyContainer}>
            <form className={styles.formGrid} onSubmit={handleSubmit(onSubmit)}>
                <h2>Change Agent</h2>
                <div className="mt-5">
                    <label htmlFor="developer_ids">Select Developer </label>
                    <FormInputDataList
                        id="developer_ids"
                        control={control}
                        data={areaOption || []}
                        placeholder={"Select Developer"}
                        registerName={"developer_ids"}
                        required={true}
                        isDisabled={isDeveloperLoading}
                        isLoading={isDeveloperLoading}
                    />
                    {errors.developer_ids && (
                        <span className="text-red-500">
                            {errors.developer_ids.message}
                        </span>
                    )}
                </div>

                <div className="mt-5">
                    <label htmlFor="new_agent_id">Select New Agent</label>
                    <FormInputDataList
                        id="new_agent_id"
                        control={control}
                        data={staffOptions || []}
                        placeholder={"Select Agent"}
                        registerName={"new_agent_id"}
                        isDisabled={isPending}
                        isLoading={isLoadingStaff}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "end",
                        marginTop: "2.8rem",
                    }}
                >
                    <button
                        className="btnSubmit"
                        type="submit"
                        disabled={isPending}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChangeDeveloperAgentForm;
