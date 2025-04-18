import { Link } from "react-router-dom";
import SectionTop from "../../ui/SectionTop";
import styles from "./General.module.css";
import { Mail, MessageCircle, Server } from "lucide-react";
import { useDefaultSetting } from "../../store/defaultSettingStore";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import TabBar from "../../ui/TabBar";

function General() {
    const { view, setDefaultListView } = useDefaultSetting();
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === "admin" || currentUser?.role === "super_admin";

    return (
        <div className="sectionContainer">
            <SectionTop heading={`General`}>
                <TabBar
                    tabs={[
                        {
                            id: "GENERAL",
                            label: "General",
                            bgColor: "#f8f5ff",
                            fontColor: "#6b46c1",
                            path: "/admin/general",
                        },
                    ]}
                    activeTab={"GENERAL"}
                    navigateTo={() => `/admin/general`}
                />
            </SectionTop>
            <section className="sectionStyles" style={{
                backgroundColor: "#f8f5ff",
            }}  >
                <div className={` ${styles.generalContainer}`} style={{
                    boxShadow: "none",
                    backgroundColor: "#f8f5ff",
                    paddingTop: "1rem"
                }}>
                    <ul className={styles.generalList}>
                        <li>Info</li>
                        <li>
                            <Link to="manage-leads-interfaces">
                                <img src="/icons/build.svg" />
                                <span>Manage Leads Interfaces</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="manage-areas">
                                <img src="/icons/location.svg" />
                                <span>Manage Areas</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="manage-developers">
                                <img src="/icons/build.svg" />
                                <span>Manage Developers</span>
                            </Link>
                        </li>
                        {isAdmin && (
                            <>
                                <li>
                                    <Link to="manage-company">
                                        <img src="/icons/detail.svg" />
                                        <span>Manage Company Details</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="manage-calls">
                                        <img src="/icons/settings.svg" />
                                        <span>Manage Calls</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="xml-feeds">
                                        <img src="/icons/settings.svg" />
                                        <span>XML Feeds</span>
                                    </Link>
                                </li>
                            </>
                        )}

                        <li>
                            <Link to="https://affworld.io/campaign/PropFusion">
                                <img src="/icons/share-social.svg" />
                                <span>Share with Friends</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="">
                                <img src="/icons/tag.svg" />
                                <span>White Label</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="smtp-setting">
                                <Mail />
                                <span>Smtp Setting</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="web-apis">
                                <Server />
                                <span>Website Apis</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/whatsapp-logs">
                                <MessageCircle />
                                <span>Whatsapp Logs</span>
                            </Link>
                        </li>

                    </ul>

                    <ul className={styles.generalList}>
                        <li>Product</li>
                        {isAdmin && (
                            <li>
                                <Link to="subscription">
                                    <img src="/icons/person-add.svg" />
                                    <span>Subscription Details</span>
                                </Link>
                            </li>
                        )}
                        <li
                            style={{
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                view === "card"
                                    ? setDefaultListView("list")
                                    : setDefaultListView("card");
                                toast.success(
                                    `Default listing view changed to  ${view === "card" ? "List" : "Card"}`
                                );
                            }}
                        >
                            <div>
                                <img
                                    src="/icons/eye.svg"
                                    alt=""
                                    style={{
                                        marginRight: "10px",
                                    }}
                                />

                                <span>
                                    Default Listing View -{" "}
                                    {view === "card" ? "Card" : "List"}
                                </span>
                            </div>
                        </li>
                        <li>
                            <Link to="">
                                <img src="/icons/mail.svg" />
                                <span>Contact Us</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="request-feature">
                                <img src="/icons/sparkles.svg" />
                                <span>Request a Feature</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="">
                                <img src="/icons/feedback.svg" />
                                <span>Feedback</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="report-bug">
                                <img src="/icons/bug.svg" />
                                <span>Report a Bug</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="updates">
                                <img src="/icons/notifications.svg" />
                                <span>Updates</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="support">
                                <img src="/icons/support.svg" />
                                <span>Support</span>
                            </Link>
                        </li>
                    </ul>

                    <ul className={styles.generalList}>
                        <li>Legal Policies</li>
                        <li>
                            <Link to="/propfusion-policies">
                                <img src="/icons/detail.svg" />
                                <span>Policies</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default General;
