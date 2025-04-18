import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/MultiStepForm.module.css";
import MultiStepForm from "../../ui/MultiStepForm";
import useStaff from "../admin/staff/useStaff";
import useAreasWithoutCount from "../areas/useAreasWithoutCount";
import useDevelopersWithoutCount from "../developers/useDevelopersWithoutCount";

function StepLocation() {
    const { currentUser } = useAuth();
    const { data: developerData, isLoading: isDeveloperLoading } =
        useDevelopersWithoutCount(true);
    const { data: areaData, isLoading: isAreaLoading } =
        useAreasWithoutCount(true);
    const { data: staffData, isLoading: isStaffLoading } = useStaff();

    const developerOptions = developerData.map((item) => {
        return {
            value: item.id,
            label: item.name,
        };
    });
    const areaOptions = areaData.map((item) => {
        return { value: item.id, label: item.name };
    });
    const staffOptions = staffData.map((item) => {
        return { value: item.id, label: item.name };
    });

    return (
        <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
            <div className={styles.formContainer}>
                <MultiStepForm.Input
                    registerName="name"
                    placeholder="Project Name"
                    label="Project Name"
                    required={true}
                />
                <MultiStepForm.InputDataList
                    registerName="area_id"
                    data={areaOptions}
                    isLoading={isAreaLoading}
                    placeholder="Select Area"
                    label="Area"
                    required={true}
                />
                <MultiStepForm.InputDataList
                    registerName="developerId"
                    placeholder="Developer"
                    data={developerOptions}
                    isLoading={isDeveloperLoading}
                    label="Developer"
                    required={true}
                />
                <MultiStepForm.InputDataList
                    registerName="agent_Id"
                    placeholder="Agent"
                    data={staffOptions}
                    isLoading={isStaffLoading}
                    isDisabled={currentUser?.role !== "admin" && currentUser?.role !== "super_admin"}
                    label="Agent"
                />
            </div>
        </div>
    );
}

export default StepLocation;
