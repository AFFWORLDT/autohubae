import { useDownloadLeadsTemplate } from "./useDownloadLeadsTemplate";
import useExportLeadsData from "./useExportLeadsData";
import { useUploadBulkLeads } from "./useUploadBulkLeads";
import styles from "./Listings.module.css";
import { useRef } from "react";
import SyncButtonForBeyutAndPropertyFinder from "../../../pages/leads/SyncButtonForBeyutAndPropertyFinder";
import SyncButtonForPFCallTrackingAndBayutCallLogs from "../../leads/portalCalls/SyncButtonForPFCallTrackingAndBayutCallLogs";

function ListPortalCalls() {
    const { download, isLoading } = useDownloadLeadsTemplate();
    const { mutate: exportLeads, isLoading: exportLoading } =
        useExportLeadsData();
    const { upload, isLoading: uploadLoading } = useUploadBulkLeads();

    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            upload(file);
        }
    };

    return (
        <>
            <div className={styles.listings}>
                <SyncButtonForPFCallTrackingAndBayutCallLogs title={"Sync Portal Calls"} />
            </div>
        </>
    );
}

export default ListPortalCalls;
