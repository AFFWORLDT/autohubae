import { Activity, BarChart2, Phone, Users, Map } from "lucide-react";
import styles from "../../../pages/Dashboard.module.css";
import { DashboardCard, DashboardChartCard } from "../DashboardCards";
import PieChart from "../charts/PieChart";
import { chartTheme, prepareCSVData } from "../utils/chartUtils";
import ChartHeader from "../ChartHeader";

function DashboardSummary({ data }) {
    const dataListings = [
        { type: "Sell", value: data?.listings?.sell || 0, color: "#FF6B6B" },
        { type: "Rent", value: data?.listings?.rent || 0, color: "#4ECDC4" },
        {
            type: "Projects",
            value: data?.listings?.projects || 0,
            color: "#96C93D",
        },
    ];

    const dataLeads = [
        { type: "Sell", value: data?.leads?.buy || 0, color: "#A78BFA" },
        { type: "Rent", value: data?.leads?.rent || 0, color: "#F472B6" },
    ];

    // CSV data preparation
    const listingsCSVData = prepareCSVData(
        dataListings.map(item => ({ Type: item.type, Value: item.value })),
        "Listings Distribution"
    );

    return (
        <div className={styles.dashboard} >
            <div className={styles.dashboardGroup}>
                <DashboardCard
                    icon={BarChart2}
                    label="Total Listings"
                    value={data?.listings?.total || 0}
                />
                <DashboardChartCard>
                    <div className={styles.chartHeader}>
                        <ChartHeader 
                            title="Listings Distribution" 
                            csvData={listingsCSVData} 
                        />
                    </div>
                    <PieChart 
                        data={dataListings} 
                        chartTheme={chartTheme} 
                    />
                </DashboardChartCard>
            </div>

            {/* Leads Group */}
            <div className={styles.dashboardGroup}>
                <DashboardCard
                    icon={Activity}
                    label="Total Leads"
                    value={data?.leads?.total || 0}
                />
                <DashboardChartCard>
                    <ChartHeader 
                        title="Lead Distribution" 
                        csvData={prepareCSVData(
                            dataLeads.map(item => ({ Type: item.type, Value: item.value })),
                            "Lead Distribution"
                        )} 
                    />
                    <PieChart 
                        data={dataLeads} 
                        chartTheme={chartTheme} 
                    />
                </DashboardChartCard>
            </div>

            {/* Individual Metrics */}
            <DashboardCard
                icon={Phone}
                label="TOTAL WHATSAPP LEADS"
                value={data?.whatsapp_leads || 0}
                isImage={true}
            />

            <DashboardCard
                icon={Users}
                label="Active Developers"
                value={data?.developers || 0}
            />

            <DashboardCard
                icon={Map}
                label="Coverage Areas"
                value={data?.areas || 0}
            />
        </div>
    );
}

export default DashboardSummary; 