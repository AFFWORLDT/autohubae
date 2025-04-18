import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AddTeam from "../../features/admin/teams/AddTeam";
import TeamsTable from "../../features/admin/teams/TeamsTable";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";

function Teams() {
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === "admin" || currentUser?.role === "super_admin";
    const router = useNavigate();

    const navigate = useNavigate();


    if (!isAdmin) return router("/404", { replace: true });
    return (
        <div className="sectionContainer">

           


            <SectionTop>
                <TabBar
                    activeTab="TEAMS"
                    tabs={[
                        {
                            id: "TEAMS",
                            label: "Teams",
                            bgColor: "#e8f6ff",
                            fontColor: "#0369a1",
                            path: "/admin/teams",
                        },
                    ]}
                />
            </SectionTop>


            <section 
                className="sectionStyles" 
                style={{
                    paddingTop: "5rem",
                    paddingLeft: "3rem",
                    backgroundColor: "#e8f6ff",
                    height:"100vh"
                }}
            >
                <div style={{backgroundColor: "#e8f6ff", boxShadow: "none"}}>
                    <div style={{
                        display: "flex",
                        gap: "20px", 
                        justifyContent: "end",
                        marginTop: "4rem",
                        marginBottom: "2rem"
                    }}>
                        <AddTeam />
                    </div>
                    <TeamsTable />
                </div>

            <div className="d-flex justify-content-end">
                {/* <button className="btn btn-primary" onClick={() => navigate("/admin/teams-tree")}>Teams Tree</button> */}
            </div>
            </section>
        </div>
    );
}

export default Teams;
