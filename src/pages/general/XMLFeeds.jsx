import toast from "react-hot-toast";
import styles from "../../styles/ManageBase.module.css";
import SectionTop from "../../ui/SectionTop";
import { getApiUrl } from "../../utils/getApiUrl";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TabBar from "../../ui/TabBar";
import { XML_FEEDS_TABS } from "../../utils/constants";

const BAYUT_XML_URL = `${getApiUrl()}/properties/bayut_xml_feed`;
const PF_XML_URL = `${getApiUrl()}/properties/pf_xml_feed`;

function XMLFeeds() {
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === "admin" || currentUser?.role === "super_admin";
    const router = useNavigate();
    if (!isAdmin) return router("/404", { replace: true });
    return (
        <div className="sectionContainer">
            <SectionTop heading="XML Feeds">
                <TabBar
                    tabs={XML_FEEDS_TABS}
                    activeTab={"XML_FEEDS"}
                    navigateTo={(id) => XML_FEEDS_TABS.find(tab => tab.id === id)?.path || '/admin/general/xml-feeds'}
                />
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: XML_FEEDS_TABS[0].bgColor }}>
                <div className="sectionDiv">
                    <div className={styles.manage}>
                        <div>
                            <div
                                style={{ marginBottom: "1.6rem" }}
                                className={styles.formTitle}
                            >
                                <img src="/icons/bayut.png" />
                                <img src="/icons/dubizzle.png" />
                                <h3>Bayut & Dubizzle</h3>
                            </div>

                            <div className={styles.formFlex}>
                                <div>
                                    <pre>
                                        <a href={BAYUT_XML_URL} target="_blank">
                                            {BAYUT_XML_URL}
                                        </a>
                                    </pre>
                                </div>
                                <button
                                    type="button"
                                    className={styles.btnFunctionality}
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            BAYUT_XML_URL
                                        );
                                        toast.success("Link copied!");
                                    }}
                                >
                                    <img src="/icons/copy.svg" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <div
                                style={{ marginBottom: "1.6rem" }}
                                className={styles.formTitle}
                            >
                                <img src="/icons/property-finder.png" />
                                <h3>Property Finder</h3>
                            </div>

                            <div className={styles.formFlex}>
                                <div>
                                    <pre>
                                        <a href={PF_XML_URL} target="_blank">
                                            {PF_XML_URL}
                                        </a>
                                    </pre>
                                </div>
                                <button
                                    type="button"
                                    className={styles.btnFunctionality}
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            PF_XML_URL
                                        );
                                        toast.success("Link copied!");
                                    }}
                                >
                                    <img src="/icons/copy.svg" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default XMLFeeds;
