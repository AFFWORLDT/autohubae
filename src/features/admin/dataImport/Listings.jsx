import Spinner from "../../../ui/Spinner";
import styles from "./Listings.module.css";
import { useGetExcelPropertiesData } from "./useGetExcelPropertiesData";
import { useGetPropertyExcelExample } from "./useGetPropertyExcelExample";
import { usePropertyFinderListings } from "./usePropertyFinderListings";
import { useUploadBulkPropertiesWithExcel } from "./useUploadBulkPropertieswithExel";
import { useRef } from "react";

function Listings() {
    const { fetchPropertyFinderListings, isPending } = usePropertyFinderListings();
    const { mutate, isPending: isGettingExample } = useGetPropertyExcelExample();
    const { mutate: uploadMutate, isPending: isUploading } = useUploadBulkPropertiesWithExcel();
    const { isPending: isFetching, mutate: fetchPropertiesExcel, } = useGetExcelPropertiesData();

    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadMutate(file);
        }
    };

    if (isPending) return <Spinner type="fullPage" />;

    return (
        <>
            <div className={styles.listings}>
                <h3>Import Listings</h3>
                <button onClick={fetchPropertyFinderListings} disabled={isPending}>
                    <img src="/icons/property-finder.png" alt="Import" />
                    <span>Import Property Finder Listings</span>
                </button>
                <hr />
                <h3>Excel hub</h3>

                {/* Download Button */}
                <button onClick={mutate} disabled={isGettingExample}>
                    <img src="/icons/download.svg" alt="Download" />
                    <span>{isGettingExample ? "Downloading..." : "Download"} Excel Sample Sheet</span>
                </button>

                <button onClick={fetchPropertiesExcel} disabled={isFetching}>
                    <img src="/icons/download.svg" alt="Download" />
                    <span>{isFetching ? "Downloading..." : "Download"} Excel Sheet</span>
                </button>

                {/* Upload Button */}
                <button onClick={handleUploadClick} disabled={isUploading}>
                    <img src="/icons/add.svg" alt="Upload" />
                    <span>{isUploading ? "Uploading..." : "Upload"} Property Excel Sheet</span>
                </button>

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                    style={{ display: "none" }}
                />
            </div>
        </>
    );
}

export default Listings;
