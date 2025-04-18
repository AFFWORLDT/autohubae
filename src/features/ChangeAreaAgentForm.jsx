import { useForm } from "react-hook-form";
import styles from "../styles/FormGrid.module.css";
import useStaff from "./admin/staff/useStaff";
import FormInputDataList from "../ui/FormInputDataList";
import toast from "react-hot-toast";
import useAssignBulkAgentToArea from "./areas/useAssingesBulkAgentToArea";
import useAreas from "./areas/useAreas";

function ChangeAreaAgentForm({ onCloseModal }) {
    const { data: staffData, isLoading: isLoadingStaff } = useStaff();
    const { data: areaData, isLoading: isAreasLoading } = useAreas();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({});
    const { isPending, assignAgents } = useAssignBulkAgentToArea();

    const staffOptions = staffData.map((item) => {
        return { value: item.id, label: item.name };
    });
    const areaOption = areaData?.map((item) => {
        return { value: item.id, label: item.name };
    });

    const onSubmit = (data) => {
        if (!data.new_agent_id) {
            toast.error("Please select agent to replace with");
            return;
        }

        if (data.area_ids) {
            assignAgents(
                {
                    area_ids: [data.area_ids.value],
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
                    <label htmlFor="area_ids">Select Areas </label>
                    <FormInputDataList
                        id="area_ids"
                        control={control}
                        data={areaOption || []}
                        placeholder={"Select Areas"}
                        registerName={"area_ids"}
                        required={true}
                        isDisabled={isAreasLoading}
                        isLoading={isAreasLoading}
                    />
                    {errors.area_ids && (
                        <span className="text-red-500">
                            {errors.area_ids.message}
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

export default ChangeAreaAgentForm;
