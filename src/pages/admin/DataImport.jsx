import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DataImportContainer from "../../features/admin/dataImport/DataImportContainer";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";

function DataImport() {
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === "admin" || currentUser?.role === "super_admin";
    const router = useNavigate();
    if (!isAdmin) return router("/404", { replace: true });
    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    activeTab="DATA_IMPORT"
                    tabs={[
                        {
                            id: "DATA_IMPORT",
                            label: "Data Import",
                            bgColor: "#ecfdf5",
                            fontColor: "#047857",
                            path: "/admin/data-import",
                        },
                    ]}
                />
            </SectionTop>
            <section 
                className="sectionStyles"
                style={{
                    backgroundColor: "#ecfdf5",
                    height: "100vh"
                }}
            >
                <div style={{backgroundColor: "#ecfdf5", boxShadow: "none"}}>
                    <DataImportContainer />
                </div>
            </section>
        </div>
    );
}

export default DataImport;
