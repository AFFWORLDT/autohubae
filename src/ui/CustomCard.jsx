import { Card, Button, Form, ProgressBar } from "react-bootstrap";
import useUpdateStaffMember from "../features/admin/staff/useUpdateStaffMember";
import useUpdatePass from "../features/admin/staff/useUpdatePass";
import useDeleteStaffMember from "../features/admin/staff/useDeleteStaffMember";
import Modal from "./Modal";
import StaffForm from "../features/admin/staff/StaffForm";
import ResetPassForm from "../features/admin/staff/ResetPassForm";
import { ConfirmDeleteWithAgentForm } from "./ConfirmDelete";
import useBrowserWidth from "../hooks/useBrowserWidth";

const CustomCard = ({ staffData }) => {
    const { updateStaffMember, isPending: isUpdating } = useUpdateStaffMember();
    const { deleteStaffMember, isPending: isDeleting } = useDeleteStaffMember();
    const { changePass, isPending: isUpdatingPass } = useUpdatePass();
    const browserWidth = useBrowserWidth();
    const isActive = staffData.state === "active";

    function handleToggle() {
        updateStaffMember({
            id: staffData.id,
            payload: { ...staffData, state: isActive ? "inactive" : "active" },
        });
        console.log("show switch data", staffData);
    }

    const cardStyle = {
        width: browserWidth > 480 ? "30rem" : "97%",
        backgroundColor: "#ffffff",
        marginTop: "20px",
        borderRadius: "15px",
        padding: "20px",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px, rgba(0, 0, 0, 0.05) 0px 1px 3px",
        border: "2px solid transparent", // Placeholder for the border
        backgroundClip: "padding-box, border-box",
        backgroundImage: `
            linear-gradient(to right, #ffffff, #ffffff),
            linear-gradient(to right, #ffc813, #f8734f)
        `,
        backgroundOrigin: "border-box",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
        position: "relative",
    };

    const cardHoverStyle = {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 30px rgba(0,0,0,0.15)"
    };

    const imageStyle = {
        width: "90px",
        height: "90px",
        borderRadius: "50%",
        objectFit: "cover",
        marginBottom: "15px",
        border: "4px solid #fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        transition: "transform 0.3s ease",
    };

    const buttonStyle = {
        backgroundColor: "transparent",
        border: "none",
        borderRadius: "50%",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.2s ease",
        cursor: "pointer"
    };

    return (
        <Modal>
            <Card
                style={cardStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, cardHoverStyle)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle)}
            >
                <Card.Body style={{ padding: "0" }}>
                    <div style={{ position: "relative", textAlign: "center" }}>
                        <img
                            src={staffData.avatar || "/avtarImage.png"}
                            style={imageStyle}
                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                        />

                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            checked={isActive}
                            onChange={handleToggle}
                            style={{
                                position: "absolute",
                                top: "0",
                                right: "-15px",
                            }}
                        />

                        <div style={{ position: "absolute", right: "-15px", top: "40px", display: "flex", flexDirection: "column", gap: "10px" }}>
                            <Modal.Open openWindowName="editStaff">
                                <Button
                                    style={{ ...buttonStyle, color: "#4a90e2" }}
                                    disabled={isUpdating}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </Button>
                            </Modal.Open>

                            <Modal.Open openWindowName="deleteStaff">
                                <Button
                                    style={{ ...buttonStyle, color: "#e74c3c" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </Button>
                            </Modal.Open>

                            <Modal.Open openWindowName="resetStaffPass">
                                <Button
                                    style={{ ...buttonStyle, color: "#f39c12" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </Button>
                            </Modal.Open>
                        </div>
                    </div>

                    <Card.Title style={{
                        textAlign: "center",
                        marginTop: "15px",
                        marginBottom: "20px",
                        color: "#2c3e50",
                        fontSize: "1.8rem",
                        fontWeight: "600"
                    }}>
                        {staffData.name}
                    </Card.Title>
                    <br />
                    <hr style={{ margin: "2px 0", opacity: "0.2" }} />

                    <div style={{ marginTop: "20px" }}>
                        <ProgressBar
                            variant="info"
                            now={staffData.state === "active" ? 100 : 0}
                            style={{
                                height: "8px",
                                borderRadius: "4px",
                                backgroundColor: "#ffacac"
                            }}
                        />
                    </div>
                </Card.Body>
            </Card>

            <Modal.Window name="editStaff" overflow={true}>
                <StaffForm staffToEdit={staffData} />
            </Modal.Window>

            <Modal.Window name="resetStaffPass">
                <ResetPassForm
                    name={staffData.name}
                    id={staffData.id}
                    onConfirm={changePass}
                    isUpdatingPass={isUpdatingPass}
                />
            </Modal.Window>

            <Modal.Window name="deleteStaff" overflow={true}>
                <ConfirmDeleteWithAgentForm
                    resourceName="staff"
                    agentIdToReplace={staffData.id}
                    onConfirm={() => deleteStaffMember(staffData.id)}
                    isDeleting={isDeleting}
                />
            </Modal.Window>
        </Modal>
    );
};

export default CustomCard;
