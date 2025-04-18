import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Menus from "./Menus";
import styles from "./SectionTop.module.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { Book, Calendar, TreePalm } from "lucide-react";
import useAllDetails from "../features/all-details/useAllDetails";
import useBrowserWidth from "../hooks/useBrowserWidth";

const randomId = uuidv4();

const headingStyle = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    padding: '1rem',
    background: 'linear-gradient(to right, #2563eb, #9333ea)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    letterSpacing: '-0.025em',
};


function SectionTop({ heading, children }) {
    const { currentUser, logout } = useAuth();
    const isAdmin = currentUser?.role === "admin" || currentUser?.role === "super_admin";
    const navigate = useNavigate();
    const browserWidth  = useBrowserWidth();
    const adminNavData = [
        { name: "Staff", navigateTo: "/admin/staff", isAdminONly: isAdmin },
        // { name: "Permission", navigateTo: "/admin/permission" },
        { name: "Teams", navigateTo: "/admin/teams", isAdminONly: isAdmin },
        { name: "Watermark", navigateTo: "/admin/watermark" },
        // { name: "Integrations", navigateTo: "/admin/integrations" },
        {
            name: "Data Import",
            navigateTo: "/admin/data-import",
            isAdminONly: isAdmin,
        },
        { name: "General", navigateTo: "/admin/general" },
    ];

    const [toggleActive, setToggleActive] = useState(false);
    const { data: unseenNotificationCount, error, isLoading } = useAllDetails();
    const filteredAdminNavData = !isAdmin
        ? adminNavData
        : adminNavData.filter((item) => !item.isAdminONly);
    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    return (
        <div
            className={styles.sectionTop}
            style={
                children
                    ? { paddingLeft: "2rem", paddingRight: "2rem" }
                    : {
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                    }
            }
        >
            {children ? children : <h1 style={headingStyle}>{heading}</h1>}

            <div className={styles.rightContainer}>
                {(currentUser?.role === "admin" || currentUser?.role === "super_admin") && (
                    <Link
                        to="/admin/requests"
                        className={styles.btnNotification}
                        aria-label={`Requests. ${unseenNotificationCount?.pending_portal_requests_count || 0} new`}
                    >
                        <img src="/icons/request.svg" alt="" />
                        {unseenNotificationCount?.pending_portal_requests_count > 0 && (
                            <div role="status" aria-live="polite">
                                {unseenNotificationCount?.pending_portal_requests_count}
                            </div>
                        )}
                    </Link>
                )}
                {browserWidth > 768 && (
                    <Link to="/calendar">
                        <img src="/icons/calendar.svg" alt="" />
                    </Link>
                )}

                <Link 
                    className={styles.btnNotification} 
                    to="/notifications"
                    aria-label={`Notifications. ${unseenNotificationCount?.unseen_notifications_count || 0} unread`}
                >
                    <img src="/icons/bell.svg" alt="" />
                    {unseenNotificationCount?.unseen_notifications_count > 0 && (
                        <div role="status" aria-live="polite">
                            {unseenNotificationCount?.unseen_notifications_count}
                        </div>
                    )}
                </Link>

                <Menus>
                    <Menus.Toggle id={currentUser?.id} isDisabled={isLoading}>
                        <img
                            src={
                                unseenNotificationCount?.current_user_details
                                    ?.avatar
                            }
                        />
                    </Menus.Toggle>
                    <Menus.List id={currentUser?.id}>
                        <Menus.Button
                            onClick={() => navigate("/profile")}
                            icon="/icons/person.svg"
                        >
                            Profile
                        </Menus.Button>
                        <Menus.Button
                            onClick={() => navigate(`/admin/map/${randomId}`)}
                            icon="/icons/map.svg"
                        >
                            MapView
                        </Menus.Button>

                        <Menus.Button
                            onClick={() => navigate(`/admin/fusionmails`)}
                            icon="/icons/mail.svg"
                        >
                            FusionMails
                        </Menus.Button>
                        <Menus.Button onClick={() => navigate(`/admin/blog`)}>
                            <Book size={24} style={{ marginLeft: "-13px" }} />
                            Blog
                        </Menus.Button>
                        <Menus.Button onClick={() => navigate(`/admin/teams-tree`)}>
                            <TreePalm size={24} style={{ marginLeft: "-13px" }} />
                            Team Tree
                        </Menus.Button>
                        <Menus.Button onClick={() => navigate(`/hrcalendar`)}>
                            <Calendar size={24} style={{ marginLeft: "-13px" }} />
                            Hr Calendar
                        </Menus.Button>

                        <div
                            onClick={() => setToggleActive(!toggleActive)}
                            className={`${styles.btnSettings} ${toggleActive ? styles.toggleActive : ""}`}
                        >
                            <div>
                                <img src="/icons/settings.svg" />
                                <span>Settings</span>
                                <img
                                    className={styles.arrowDown}
                                    src="/icons/arrow-down.svg"
                                />
                            </div>
                            {toggleActive && (
                                <>
                                    {isAdmin && (
                                        <>
                                            <ul>
                                                {adminNavData.map((item) => (
                                                    <li key={item.name}>
                                                        <Link
                                                            to={item.navigateTo}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                    {!isAdmin && (
                                        <ul>
                                            {filteredAdminNavData.map(
                                                (item) => (
                                                    <li key={item.name}>
                                                        <Link
                                                            to={item.navigateTo}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </>
                            )}
                        </div>

                        <Menus.Button
                            customStyle={{
                                color: "#cb1919",
                            }}
                            onClick={logout}
                            icon="/icons/logout.svg"
                        >
                            Logout
                        </Menus.Button>
                    </Menus.List>
                </Menus>
            </div>
        </div>
    );
}

export default SectionTop;
