import { useForm } from "react-hook-form";
import Modal from "../../ui/Modal";
import useStaff from "../admin/staff/useStaff";
import useAreas from "../areas/useAreas";
import styles from "./UploadExcelForm.module.css";
import FormInputDataList from "../../ui/FormInputDataList";
import { useRef, useState } from "react";
import DownloadExcelSampleButton from "./DownloadExcelSampleButton";
import useFileUploadCustomerExcel from "./useFileUploadCustomerExcel";
import toast from "react-hot-toast";

function UploadExcelFile() {
    const { data: staffData, isLoading: staffLoading } = useStaff();
    const { data: areaData, isLoading: areaLoading } = useAreas();
    const staffOptions = staffData?.map((item) => {
        return { value: item.id, label: item.name };
    });

    const areaOptions = areaData?.map((item) => {
        return { value: item.id, label: item.name };
    });

    return (
        <Modal>
            <Modal.Open openWindowName="upload-excel-file">
                <button className={styles.button}>
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
                            d="M3 17h18M12 7v10m0 0l-4-4m4 4l4-4M5.5 10a4.5 4.5 0 019 0c1.3 0 2.5.8 3.2 1.9a4.5 4.5 0 013.3-.4A4.5 4.5 0 0120 14.5a4.5 4.5 0 01-9 0 4.5 4.5 0 01-5.5-4.5z"
                        />
                    </svg>
                    <span className={styles.buttonText}>Upload Excel File</span>
                </button>
            </Modal.Open>

            <Modal.Window name="upload-excel-file">
                <UploadExcelForm
                    staffOptions={staffOptions}
                    areaOptions={areaOptions}
                    isLoadingStaff={staffLoading}
                    isLoadingArea={areaLoading}
                />
            </Modal.Window>
        </Modal>
    );
}

export default UploadExcelFile;

export function UploadExcelForm({
    onCloseModal,
    staffOptions,
    areaOptions,
    isLoadingStaff,
    isLoadingArea,
}) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
    } = useForm();
    const { upload, isPending } = useFileUploadCustomerExcel();

    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    const onSubmit = (data) => {
        console.log(data);
        upload(
            {
                file: data.file,
                agent_id: data.agent_id ? data.agent_id?.value : null,
                area_id: data.area_id ? data.area_id?.value : null,
            },
            {
                onSettled: () => {
                    reset();
                    onCloseModal();
                },
                onSuccess: () => {
                    toast.success("Excel file uploaded successfully");
                },
            }
        );
    };

    const handleFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFileName(selectedFile.name);
            setValue("file", selectedFile);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.formContainer}
        >
            <h1 className="text-2xl font-bold mb-4">Upload Excel File</h1>
            <div className={styles.formContainer}>
                <div>
                    <label>Agent</label>
                    <FormInputDataList
                        control={control}
                        registerName={"agent_id"}
                        data={staffOptions}
                        isLoading={isLoadingStaff}
                        required={true}
                        placeholder="Select Agent"
                    />
                    {errors.agent_id && (
                        <span className={styles.errorText}>
                            This field is required
                        </span>
                    )}
                </div>
                <div>
                    <label>Area</label>
                    <FormInputDataList
                        control={control}
                        registerName={"area_id"}
                        data={areaOptions}
                        isLoading={isLoadingArea}
                        required={true}
                        placeholder="Select Area"
                    />
                    {errors.area_id && (
                        <span className={styles.errorText}>
                            This field is required
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="file">File</label>
                    <div
                        className={styles.fileUploadBox}
                        onClick={handleFileClick}
                    >
                        <svg
                            style={{ width: "40px", height: "40px" }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 10l5-5 5 5M12 4v12"
                            />
                        </svg>
                        <p>{fileName ? fileName : "Click to select a file"}</p>
                    </div>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        {...register("file", { required: "File is required" })}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    {errors.file && (
                        <span className={styles.errorText}>
                            {errors.file.message}
                        </span>
                    )}
                </div>
                <div className={styles.buttonContainer}>
                    <DownloadExcelSampleButton />
                    <button className={`${styles.button} bg-black text-white`}>
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
                                d="M3 17h18M12 7v10m0 0l-4-4m4 4l4-4M5.5 10a4.5 4.5 0 019 0c1.3 0 2.5.8 3.2 1.9a4.5 4.5 0 013.3-.4A4.5 4.5 0 0120 14.5a4.5 4.5 0 01-9 0 4.5 4.5 0 01-5.5-4.5z"
                            />
                        </svg>
                        <span>{isPending ? "Uploading..." : "Upload Excel File"}</span>
                    </button>
                </div>
            </div>
        </form>
    );
}
