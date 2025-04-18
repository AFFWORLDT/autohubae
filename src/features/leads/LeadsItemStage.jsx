import styles from "./LeadsItemStage.module.css";
import useStages from "../stages/useStages";

function LeadsItemStage({ leadData }) {
    const { data, isLoading } = useStages("leads");

    if (isLoading) return null;

    let stageDetails = data.find(
        (stageObj) => stageObj._id === Number(leadData?.latest_followup?.stages)
    );

    return (
        <div>
            <span className={styles.stageName} style={{
                color: stageDetails?.color_code ?? "#606266",
                borderColor: stageDetails?.color_code ?? "#606266",
            }}>
                {stageDetails?.name || "No Stage"}
            </span>

        </div>
    );
}

export default LeadsItemStage;
