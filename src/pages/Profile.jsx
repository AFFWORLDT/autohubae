import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import SectionTop from "../ui/SectionTop";
import { useAuth } from "../context/AuthContext";
import useStaff from "../features/admin/staff/useStaff";
import toast from "react-hot-toast";
import useTeam from "../features/admin/teams/useTeam";
import Spinner from "../ui/Spinner";
import ChangeInfoForm from "../features/profile/ChangeInfoForm";
import ChangePassForm from "../features/profile/ChangePassForm";
import TabBar from "../ui/TabBar";
import { MENU_TABS } from "../utils/constants";

function Profile() {
    const [activeProfileTab, setActiveProfileTab] = useState("info");
    const { currentUser } = useAuth();
    const { data: userData, isLoading, error } = useStaff(currentUser?.id);
    const { data: teamData } = useTeam(userData?.team);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    return (
        <div className="sectionContainer">
            <SectionTop heading="Profile">
                <TabBar
                    tabs={MENU_TABS}
                    activeTab={"PROFILE"}
                    navigateTo={(id) =>
                        MENU_TABS.find((tab) => tab.id === id)?.path ||
                        "/profile"
                    }
                />
            </SectionTop>
            <section
                className="sectionStyles"
                style={{ backgroundColor: MENU_TABS[0].bgColor }}
            >
                {isLoading ? (
                    <Spinner type="fullPage" />
                ) : (
                    <div className={styles.profile}>
                        <div
                            className={`sectionDiv ${styles.profileContainer}`}
                        >
                            <div className={styles.profileTabs}>
                                <button
                                    className={
                                        activeProfileTab === "info"
                                            ? styles.activeProfileTab
                                            : ""
                                    }
                                    onClick={() => setActiveProfileTab("info")}
                                >
                                    General Information
                                </button>
                                <button
                                    className={
                                        activeProfileTab === "pass"
                                            ? styles.activeProfileTab
                                            : ""
                                    }
                                    onClick={() => setActiveProfileTab("pass")}
                                >
                                    Change Password
                                </button>
                            </div>
                            {activeProfileTab === "info" && (
                                <ChangeInfoForm userData={userData} />
                            )}
                            {activeProfileTab === "pass" && (
                                <ChangePassForm id={userData.id} />
                            )}
                        </div>

                        <div className={`sectionDiv ${styles.profileDetails}`}>
                            <img
                                className={styles.avatar}
                                src={userData.avatar}
                            />
                            <h3>{userData.name}</h3>
                            <ul>
                                <li>
                                    <p>
                                        <img src="/icons/call.svg" />
                                        <span>Phone</span>
                                    </p>
                                    <span>{userData.phone}</span>
                                </li>
                                <li>
                                    <p>
                                        <img src="/icons/mail.svg" />
                                        <span>Email</span>
                                    </p>
                                    <span>{userData.email}</span>
                                </li>
                                <li>
                                    <p>
                                        <img src="/icons/info.svg" />
                                        <span>Team</span>
                                    </p>
                                    <span>{teamData?.name}</span>
                                </li>
                                <li>
                                    <p>
                                        <img src="/icons/person.svg" />
                                        <span>Permissions</span>
                                    </p>
                                    <span>{userData.role}</span>
                                </li>
                                <li>
                                    <p>
                                        <img src="/icons/time.svg" />
                                        <span>Created At</span>
                                    </p>
                                    <span>
                                        {new Date(
                                            userData.created_at
                                        ).toLocaleString()}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Profile;
