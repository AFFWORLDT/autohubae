import SectionTop from "../../ui/SectionTop";
import AddStaff from "../../features/admin/staff/AddStaff";
import CardGrid from "../../features/admin/staff/CardGrid";
import StaffTable from "../../features/admin/staff/StaffTable";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ChangeStaff from "../../features/admin/staff/ChangeStaff";
import TabBar from "../../ui/TabBar";
import ViewToggle from "../../features/admin/staff/ViewToggle";
import { useState } from "react";

function Staff() {
    const [activeView, setActiveView] = useState('grid');
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === "admin" || currentUser?.role === "super_admin";
    const router = useNavigate();
    
    if (!isAdmin) return router("/404", { replace: true });
    
    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    activeTab="STAFF"
                    tabs={[
                        {
                            id: "STAFF",
                            label: "Staff",
                            bgColor: "#f5f4fa",
                            fontColor: "#341b80",
                            path: "/admin/staff",
                        },
                    ]}
                />
            </SectionTop>

            <section 
                className="sectionStyles" 
                style={{
                    paddingTop: "5rem",
                    paddingLeft: "3rem",
                    backgroundColor: "#f5f4fa",
                }}
            >
                <div style={{backgroundColor: "#f5f4fa", boxShadow: "none"}}>
                    <div style={{
                        display: "flex",
                        gap: "20px", 
                        justifyContent: "end",
                        marginTop: "4rem",
                        alignItems: "center"
                    }}>
                        <ViewToggle activeView={activeView} onViewChange={setActiveView} />
                        <AddStaff />
                        <ChangeStaff/>
                    </div>
                    {activeView === 'grid' ? <CardGrid /> : <StaffTable />}
                </div>
            </section>
        </div>
    );
}

export default Staff;
