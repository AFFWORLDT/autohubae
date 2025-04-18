import { useEffect } from "react";
import useCustomers from "../../features/customers/useCustomer";
import SectionTop from "../../ui/SectionTop";
import toast from "react-hot-toast";
import CustomerFilters from "../../features/customers/CustomerFiters";
import UploadExcelFile from "../../features/customers/UploadExcelFile";
import AddCustomerButton from "../../features/customers/AddCustomerButton";
import ProjectTable from "../../features/database/ProjectTable";
import ToggleButton from "../../ui/ToggleButton";
import { Search } from "lucide-react";
import { DATA_BASE_CUSTOMER_TABS } from "../../utils/constants";
import TabBar from "../../ui/TabBar";

function DataBase() {
    const {
        data: customersData,
        isLoading: customersLoading,
        error: customersError,
    } = useCustomers();

    useEffect(() => {
        if (customersError) toast.error(customersError.message);
    }, [customersError]);
    const currentTab = DATA_BASE_CUSTOMER_TABS.find(
        (tab) => tab.id === "CUSTOMERS"
    );
    const bgColor = currentTab?.bgColor || "#ffffff"; // Default to white if no match
    return (
        <div className="sectionContainer">
            <SectionTop heading="Database"  >
                <TabBar
                    tabs={DATA_BASE_CUSTOMER_TABS}  
                    activeTab={"DATABASE"}
                    navigateTo={(tabId) => {
                        const tab = DATA_BASE_CUSTOMER_TABS.find(
                            (t) => t.id === tabId
                        );
                        return tab?.path || "/";
                    }}
                />
            </SectionTop>
            <section className="sectionStyles"    style={{
                    paddingTop: "4rem ",
                    paddingLeft: "3rem ",
                    backgroundColor: bgColor,
                }}>
                <div>
                    <ToggleButton>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "1rem",
                            marginBottom: "1rem",

                            paddingTop: "4rem",
                        }}
                        >
                            <div className="flex-between-wrap">
                                <AddCustomerButton />
                                <UploadExcelFile />
                            </div>
                            <ToggleButton.Button
                                label="Advanced Filter"
                                icon={<Search />}
                                style={{
                                    "--toggleBtn-primary": "#000",
                                    border: "1px solid #000",
                                    backgroundColor: "transparent",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "0.5rem",
                                    color: "#000",
                                }}
                            />
                        </div>
                        <ToggleButton.Content>
                            <div
                                style={{
                                    padding: "1.5rem",
                                    borderTop: "1px solid #eee",
                                }}
                            >
                                <CustomerFilters />
                            </div>
                        </ToggleButton.Content>
                    </ToggleButton>

                    <ProjectTable
                        data={customersData}
                        isLoading={customersLoading}
                    />
                </div>
            </section>
        </div>
    );
}

export default DataBase;
