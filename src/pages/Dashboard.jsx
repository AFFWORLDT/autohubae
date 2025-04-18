import { useEffect, useRef, useState, lazy, Suspense } from "react";
import toast from "react-hot-toast";
import styles from "./Dashboard.module.css";
import useDashboardStats from "../features/dashboard/useDashboardStats";
import PieChartSection from "../ui/PieChartSection";
// Import SVG components
import {
    Activity,
    BarChart2,
    Phone,
    Users,
    Map,
    Building2,
    Home,
    DollarSign,
    Download,
} from "lucide-react";
import SectionTop from "../ui/SectionTop";
import usePropertyReports from "../features/dashboard/usePropertyReports";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
} from "recharts";
import TabBar from "../ui/TabBar";
import ReactApexChart from "react-apexcharts";
import { CSVLink } from "react-csv";

// Lazy load dashboard sections
const DashboardSummary = lazy(() => import("../components/dashboard/sections/DashboardSummary"));
const PropertyStatsSection = lazy(() => import("../components/dashboard/sections/PropertyStatsSection"));
const ListingActivitySection = lazy(() => import("../components/dashboard/sections/ListingActivitySection"));
const PriceDistributionSection = lazy(() => import("../components/dashboard/sections/PriceDistributionSection"));
const LeadActivitySection = lazy(() => import("../components/dashboard/sections/LeadActivitySection"));
const LeadSourceSection = lazy(() => import("../components/dashboard/sections/LeadSourceSection"));
const LeadStatusSection = lazy(() => import("../components/dashboard/sections/LeadStatusSection"));

function DashboardCard({
    icon: Icon,
    label,
    value,
    className = "",
    isImage = false,
}) {
    return (
        <div className={`${styles.infoContainer} ${className}`}>
            <div className={styles.infoIcon}>
                {isImage ? (
                    <img src={"/icons/whatsapp-icon.svg"} alt={label} width="24" height="24" />
                ) : (
                    <Icon size={24} strokeWidth={2} />
                )}
            </div>
            <div className={styles.infoContent}>
                <span className={styles.infoLabel}>{label}</span>
                <span className={styles.infoValue}>{value}</span>
            </div>
        </div>
    );
}

function DashboardChartCard({ children, title }) {
    return (
        <div className={styles.chartContainer}>
            {title ? <h3 className={styles.chartTitle}>{title}</h3> : null}
            {children}
        </div>
    );
}

function PropertyStatesCard({ title, value, description, icon: Icon }) {
    return (
        <div className={styles.propertyStatesCard}>
            <div className={styles.propertyStateTop}>
                <h3>{title}</h3>
                <Icon size={24} strokeWidth={2} />
            </div>
            <div className={styles.propertyStateBottom}>
                <span>{value}</span>
                <p>{description}</p>
            </div>
        </div>
    );
}

// Loading component
const SectionLoader = () => (
  <div className={styles.sectionLoader}>
    <div className={styles.loader}>
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
    </div>
  </div>
);

function Dashboard() {
    const { data, isLoading, error } = useDashboardStats();
    const { data: propertyReports } = usePropertyReports("property");
    const { data: leadReports } = usePropertyReports("lead");
    const [showPercentage, setShowPercentage] = useState(false);

    // Process data for charts
    const overviewData = propertyReports?.timeline?.daily_listings;
    const overviewLeadData = leadReports?.timeline?.daily_leads;
    
    const portalObject = propertyReports?.statistics?.portals || {};
    const portals = Object.entries(portalObject || {}).map(
        ([name, { enabled_count = 0, percentage = 0 }]) => ({
            name,
            count: enabled_count || 0,
            percentage: percentage || 0,
        })
    );

    const priceRanges = propertyReports?.statistics?.price_ranges || {};
    
    const leadTypeData = [
        {
            type: "Sell",
            value: leadReports?.statistics?.client_type_distribution?.SELL || 0,
            color: "#FF6B6B",
        },
        {
            type: "Rent",
            value: leadReports?.statistics?.client_type_distribution?.RENT || 0,
            color: "#4ECDC4",
        },
        {
            type: "Undefined",
            value:
                leadReports?.statistics?.client_type_distribution?.UNDEFINED ||
                0,
            color: "#95A5A6",
        },
    ];

    const transformedData = [
        {
            range: "0-100K",
            rent: priceRanges["RENT_0-100K"]?.count || 0,
            sale: priceRanges["SELL_0-100K"]?.count || 0,
        },
        {
            range: "100K-500K",
            rent: priceRanges["RENT_100K-500K"]?.count || 0,
            sale: priceRanges["SELL_100K-500K"]?.count || 0,
        },
        {
            range: "500K-1M",
            rent: priceRanges["RENT_500K-1M"]?.count || 0,
            sale: priceRanges["SELL_500K-1M"]?.count || 0,
        },
        {
            range: "1M-5M",
            rent: priceRanges["RENT_1M-5M"]?.count || 0,
            sale: priceRanges["SELL_1M-5M"]?.count || 0,
        },
        {
            range: "5M+",
            rent: priceRanges["RENT_5M+"]?.count || 0,
            sale: priceRanges["SELL_5M+"]?.count || 0,
        },
    ];

    const resultArray = overviewData
        ? Object.entries(overviewData || {})
              .map(([date, listings]) => ({ date, listings: listings || 0 }))
              .sort(
                  (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
              )
        : [];
        
    const resultLeadArray = overviewLeadData
        ? Object.entries(overviewLeadData || {})
              .map(([date, listings]) => ({ date, listings: listings || 0 }))
              .sort(
                  (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
              )
        : [];

    useEffect(() => {
        if (error) {
            toast.error("Failed to load dashboard data", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
        }
    }, [error]);

    const propertyTypeData = propertyReports?.statistics?.property_type
        ? [
              {
                  type: "Apartment",
                  value:
                      propertyReports.statistics.property_type.APARTMENT
                          ?.count || 0,
                  color: "#A78BFA",
              },
              {
                  type: "Villa",
                  value:
                      (propertyReports.statistics.property_type.VILLA?.count ||
                          0) +
                      (propertyReports.statistics.property_type.Villa?.count ||
                          0),
                  color: "#F472B6",
              },
              {
                  type: "Townhouse",
                  value:
                      propertyReports.statistics.property_type.TOWNHOUSE
                          ?.count || 0,
                  color: "#96C93D",
              },
              {
                  type: "Penthouse",
                  value:
                      propertyReports.statistics.property_type.PENTHOUSE
                          ?.count || 0,
                  color: "#FFB74D",
              },
              {
                  type: "Commercial",
                  value:
                      (propertyReports.statistics.property_type.RETAIL?.count ||
                          0) +
                      (propertyReports.statistics.property_type[
                          "COMMERCIAL PLOT"
                      ]?.count || 0),
                  color: "#4FC3F7",
              },
              {
                  type: "Compound",
                  value:
                      propertyReports.statistics.property_type.COMPOUND
                          ?.count || 0,
                  color: "#FF6B6B",
              },
              {
                  type: "Duplex",
                  value:
                      propertyReports.statistics.property_type.DUPLEX?.count ||
                      0,
                  color: "#5906a2",
              },
              {
                  type: "House",
                  value:
                      propertyReports.statistics.property_type.LAND?.count || 0,
                  color: "#ffd12b",
              },
              {
                  type: "H Apartment",
                  value:
                      propertyReports.statistics.property_type[
                          "HOTEL APARTMENT"
                      ]?.count || 0,
                  color: "#f94e48",
              },
              {
                  type: "Undefined",
                  value:
                      propertyReports.statistics.property_type.null?.count || 0,
                  color: "#95A5A6",
              },
          ]
        : [];

    const propertyLeadTypeDistribution = leadReports?.statistics
        ?.property_type_distribution
        ? [
              {
                  type: "Apartment",
                  value:
                      (leadReports?.statistics?.property_type_distribution
                          ?.APARTMENT || 0) +
                          (leadReports?.statistics?.property_type_distribution
                              ?.Apartment || 0) || 0,
                  color: "#A78BFA",
              },
              {
                  type: "Villa",
                  value:
                      (leadReports.statistics?.property_type_distribution
                          ?.VILLA || 0) +
                      (leadReports.statistics?.property_type_distribution
                          ?.Villa || 0),
                  color: "#F472B6",
              },
              {
                  type: "Townhouse",
                  value:
                      leadReports.statistics.property_type_distribution
                          ?.TOWNHOUSE || 0,
                  color: "#96C93D",
              },
              {
                  type: "Penthouse",
                  value:
                      leadReports.statistics.property_type_distribution
                          ?.PENTHOUSE || 0,
                  color: "#FFB74D",
              },
              {
                  type: "Commercial",
                  value:
                      (leadReports.statistics?.property_type_distribution
                          ?.RETAIL || 0) +
                      (leadReports.statistics?.property_type_distribution[
                          "COMMERCIAL PLOT"
                      ] || 0),
                  color: "#4FC3F7",
              },
              {
                  type: "Compound",
                  value:
                      leadReports.statistics?.property_type_distribution
                          ?.COMPOUND || 0,
                  color: "#FF6B6B",
              },
              {
                  type: "Duplex",
                  value:
                      leadReports.statistics?.property_type_distribution
                          ?.DUPLEX || 0,
                  color: "#5906a2",
              },
              {
                  type: "House",
                  value:
                      leadReports.statistics.property_type_distribution.LAND ||
                      0,
                  color: "#ffd12b",
              },
              {
                  type: "H Apartment",
                  value:
                      leadReports.statistics.property_type_distribution[
                          "HOTEL APARTMENT"
                      ] || 0,
                  color: "#f94e48",
              },
              {
                  type: "Undefined",
                  value:
                      (leadReports.statistics.property_type_distribution.null ||
                          0) +
                          leadReports.statistics.property_type_distribution[
                              ""
                          ] || 0,
                  color: "#95A5A6",
              },
              {
                  type: "Office Space",
                  value:
                      leadReports.statistics.property_type_distribution[
                          "Office Space"
                      ]?.count || 0,
                  color: "#ffd12b",
              },
              {
                  type: "Land",
                  value:
                      leadReports.statistics.property_type_distribution["Land"]
                          ?.count || 0,
                  color: "#f94e48",
              },
          ]
        : [];

    const leadSourceDistribution = [
        {
            type: "Property Finder",
            value:
                leadReports?.statistics?.source_distribution?.property_finder ||
                0,
            color: "#4ECDC4",
        },
    ];
    
    const leadStatusDistribution = [
        {
            type: "Active",
            value: leadReports?.statistics?.status_distribution?.ACTIVE || 0,
            color: "#FF6B6B",
        },
        {
            type: "Inactive",
            value: leadReports?.statistics?.status_distribution?.INACTIVE || 0,
            color: "#4ECDC4",
        },
        {
            type: "Sold",
            value: leadReports?.statistics?.status_distribution?.SOLD || 0,
            color: "#95A5A6",
        },
        {
            type: "Draft",
            value: leadReports?.statistics?.status_distribution?.DRAFT || 0,
            color: "#f5f799",
        },
    ];

    const LeadAgentTypeDistribution = [
        {
            type: "Unassigned",
            value:
                leadReports?.statistics?.agent_distribution?.Unassigned
                    ?.count || 0,
            color: "#FF6B6B",
        },
        {
            type: "Propfusion Listings",
            value:
                leadReports?.statistics?.agent_distribution?.[
                    "propfusion listings"
                ]?.count || 0,
            color: "#4ECDC4",
        },
        {
            type: "Propfusion Leads",
            value:
                leadReports?.statistics?.agent_distribution?.[
                    "propfusion leads"
                ]?.count || 0,
            color: "#c5cd4e",
        },
        {
            type: "Talin",
            value:
                leadReports?.statistics?.agent_distribution?.Talin?.count || 0,
            color: "#4e5bcd0",
        },
        {
            type: "Bipin kuma",
            value:
                leadReports?.statistics?.agent_distribution?.["Bipin kumar"]
                    ?.count || 0,
            color: "#b105d7",
        },
    ];

    if (isLoading) {
        return (
            <div className="sectionContainer">
                <SectionTop>
                    <TabBar
                        activeTab="DASHBOARD"
                        tabs={[
                            {
                                id: "DASHBOARD",
                                label: "Dashboard",
                                bgColor: "#f5f4fa",
                                fontColor: "#341b80",
                                path: "/dashboard",
                            },
                        ]}
                    />
                </SectionTop>
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}>
                        <div className={styles.circle}></div>
                        <div className={styles.circle}></div>
                        <div className={styles.circle}></div>
                        <div className={styles.circle}></div>
                    </div>
                    <span className={styles.loaderText}>
                        Loading dashboard data...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    activeTab="DASHBOARD"
                    tabs={[
                        {
                            id: "DASHBOARD",
                            label: "Dashboard",
                            bgColor: "#f5f4fa",
                            fontColor: "#341b80",
                            path: "/dashboard",
                        },
                    ]}
                />
            </SectionTop>
            <section
                className="sectionStyles"
                style={{
                    paddingTop: "4rem ",
                    paddingLeft: "3rem ",
                    backgroundColor: "#f5f4fa",
                }}
            >
                <Suspense fallback={<SectionLoader />}>
                    <DashboardSummary data={data || {}} />
                </Suspense>
                
                {propertyReports && (
                    <Suspense fallback={<SectionLoader />}>
                        <PropertyStatsSection propertyReports={propertyReports} />
                    </Suspense>
                )}
                
                {resultArray && resultArray?.length > 0 && propertyTypeData && propertyTypeData?.length > 0 && (
                    <Suspense fallback={<SectionLoader />}>
                        <ListingActivitySection 
                            resultArray={resultArray} 
                            propertyTypeData={propertyTypeData} 
                        />
                    </Suspense>
                )}
                
                {transformedData && transformedData?.length > 0 && portals && portals?.length > 0 && (
                    <Suspense fallback={<SectionLoader />}>
                        <PriceDistributionSection 
                            transformedData={transformedData} 
                            portals={portals} 
                        />
                    </Suspense>
                )}
                
                {resultLeadArray && resultLeadArray?.length > 0 && leadTypeData && leadTypeData?.length > 0 && (
                    <Suspense fallback={<SectionLoader />}>
                        <LeadActivitySection 
                            resultLeadArray={resultLeadArray} 
                            leadTypeData={leadTypeData} 
                            propertyLeadTypeDistribution={propertyLeadTypeDistribution || []} 
                        />
                    </Suspense>
                )}
                
                {/* {leadSourceDistribution && leadSourceDistribution?.length > 0 && (
                    <Suspense fallback={<SectionLoader />}>
                        <LeadSourceSection 
                            leadSourceDistribution={leadSourceDistribution} 
                            propertyLeadTypeDistribution={propertyLeadTypeDistribution || []} 
                        />
                    </Suspense>
                )}
                
                {leadStatusDistribution && leadStatusDistribution?.length > 0 && (
                    <Suspense fallback={<SectionLoader />}>
                        <LeadStatusSection 
                            leadStatusDistribution={leadStatusDistribution} 
                            LeadAgentTypeDistribution={LeadAgentTypeDistribution || []} 
                        />
                    </Suspense>
                )} */}
            </section>
        </div>
    );
}

const styled = {
    wrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        borderRadius: "8px",
        padding: "16px",
        maxHeight: "300px",
        overflowY: "scroll",
    },

    cardTitle: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#333",
    },
    cardContent: {
        padding: "16px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
    },
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },
    portalContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    portalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "14px",
    },
    portalInfo: {
        display: "flex",
        gap: "8px",
        alignItems: "center",
    },
    percentageCircle: {
        height: "62px",
        width: "62px",
        borderRadius: "50%",
        backgroundColor: "#d1e7ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "background-color 0.3s ease",
    },
    percentageText: {
        fontWeight: "600",
        color: "#007bff",
    },
    portalName: {
        fontWeight: "500",
        color: "#333",
    },
    propertyCount: {
        fontSize: "12px",
        color: "#888",
    },
    progressWrapper: {
        width: "100%",
        height: "2px",
        backgroundColor: "#f0f0f0",
        borderRadius: "4px",
    },
    progressBar: {
        height: "2px",
        backgroundColor: "#007bff",
        transition: "height 0.3s ease",
    },
};

export default Dashboard;
