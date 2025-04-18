import { Download } from "lucide-react";
import { CSVLink } from "react-csv";
import styles from "../../pages/Dashboard.module.css";

function ChartHeader({ title, csvData, filename }) {
    // Only render CSVLink if csvData is valid (an array with items)
    const hasValidData = csvData && Array.isArray(csvData.data) && csvData.data.length > 0;

    return (
        <div className={styles.chartHeader}  >
            <h1 className={styles.dashboardForPropertyReportHeader} >
                {title}
            </h1>
        </div>
    );
}

export default ChartHeader; 