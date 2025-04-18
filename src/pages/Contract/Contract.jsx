import { useState } from "react";
import {
    FileText,
    Home,
    Briefcase,
    Building,
    X,
    Check,
    Clock,
    Shield,
} from "lucide-react";
import styles from "./Contract.module.css";
import SectionTop from "../../ui/SectionTop";
import { useNavigate } from "react-router-dom";
import form1 from "./../../assets/form1.png";
import TabBar from "../../ui/TabBar";
import { TENANT_OWNER_CONTRACT_TABS } from "../../utils/constants";
import useAllDetails from "../../features/all-details/useAllDetails";

function Contract() {
    // Find the matching tab to get the background color
    const currentTab = TENANT_OWNER_CONTRACT_TABS.find(
        (tab) => tab.id === "CONTRACTS"
    );
    const bgColor = currentTab?.bgColor || "#ffffff"; // Default to white if no match
    const [isOpen, setIsOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState("");
    const navigate = useNavigate();
    const contracts = [
        {
            id: 1,
            title: "Tenancy Contract",
            description:
                "Create and manage residential or commercial property lease agreements with customizable terms.",
            icon: <Home size={28} color="#3B82F6" />,
            disabled: false,
            status: "Active",
        },
        {
            id: 2,
            title: "Lease-contract",
            description:
                "lease-brokerage-agreement-between-the-broker-and-tenant .",
            icon: <Briefcase size={28} color="#9CA3AF" />,
            disabled: false,
            status: "Active",
        },
        {
            id: 3,
            title: "Property View Contract",
            description:
                "Comprehensive Property View agreements for partnerships, services, and operations.",
            icon: <Building size={28} color="#9CA3AF" />,
            disabled: false,
            status: "active",
        },
        {
            id: 4,
            title: "Owner-and-Broker ",
            description:
                "lease-brokerage-agreement-between-the-owner-and-broker",
            icon: <FileText size={28} color="#9CA3AF" />,
            disabled: false,
            status: "active",
        },
        {
            id: 5,
            title: "AgentA to AgentB ",
            description:
                "",
            icon: <FileText size={28} color="#9CA3AF" />,
            disabled: false,
            status: "active",
        },
    ];
    const { data: companyData } = useAllDetails();

    const handleContractClick = (contract) => {
        if (!contract.disabled) {
            if (contract.id === 1) {
                setIsOpen(true);
            } else {
                const redirectMapping = {
                    2: "/contract/lease-contract",
                    3: "/contract/property-view-contract",
                    4: "/contract/owner-and-broker",
                    5: "/contract/agent-contract",
                };

                const redirectUrl = redirectMapping[contract.id];

                if (redirectUrl) {
                    navigate(redirectUrl);
                } else {
                    console.error(
                        "No redirect URL defined for this contract:",
                        contract.id
                    );
                }
            }
        }
    };

    const handleContractSelect = (value) => {
        setSelectedContract(value);

        const redirectMapping = {
            dubai: "/contract/dubai-TenantForm",
            abudhabi: "/abudhabi",
        };

        const redirectUrl = redirectMapping[value];

        if (redirectUrl) {
            navigate(redirectUrl);
        } else {
            console.error("Invalid value selected:", value);
        }
    };

    return (
        <div className="sectionContainer">
            <SectionTop heading="Contract">
                <TabBar
                    tabs={TENANT_OWNER_CONTRACT_TABS}
                    activeTab={"CONTRACTS"}
                    navigateTo={(tabId) => {
                        const tab = TENANT_OWNER_CONTRACT_TABS.find(
                            (t) => t.id === tabId
                        );
                        return tab?.path || "/";
                    }}
                />
            </SectionTop>
            <div
                className="sectionStyles"
                style={{
                    paddingTop: "4rem ",
                    paddingLeft: "3rem ",
                    backgroundColor: bgColor,
                }}
            >
                <div style={{ paddingTop: "4rem ", height: "100vh" }}>
                    <h1 className={styles.title}>Smart Contract Solutions</h1>
                    <p className={styles.subtitle}>
                        Choose from our range of legally-verified contract
                        templates
                    </p>

                    <div className={styles.gridContainer}>
                        {contracts.map((contract) => (
                            <div
                                key={contract.id}
                                onClick={() => handleContractClick(contract)}
                                className={`${styles.card} ${contract.disabled ? styles.disabled : ""}`}
                            >
                                <span
                                    className={`${styles.status} ${contract.disabled ? styles.statusDisabled : styles.statusActive}`}
                                >
                                    {contract.status}
                                </span>
                                <div className={styles.cardContent}>
                                    <div className={styles.iconWrapper}>
                                        {contract.icon}
                                    </div>
                                    <h3 className={styles.cardTitle}>
                                        {contract.title}
                                    </h3>
                                    <p className={styles.cardDescription}>
                                        {contract.description}
                                    </p>

                                    <div style={{ marginBottom: "2rem" }}>
                                    <button
                                            className={styles.agreementButton}
                                            style={{
                                                background:
                                                    companyData
                                                        ?.company_settings
                                                        ?.sidebar_color_code ||
                                                    "#020079",
                                            }}
                                        >
                                            <FileText size={18} />
                                            Create New
                                        </button>
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/contract/agrement-table"
                                                )
                                            }
                                            className={styles.agreementButton}
                                            style={{
                                                background:
                                                    companyData
                                                        ?.company_settings
                                                        ?.sidebar_color_code ||
                                                    "#020079",
                                            }}
                                        >
                                            <FileText size={18} />
                                            View Liblary
                                        </button>
                                      
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isOpen && (
                        <div className={styles.overlay}>
                            <div className={styles.modal}>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X size={24} />
                                </button>

                                <h2 className={styles.modalTitle}>
                                    Choose Your Tenancy Contract
                                </h2>
                                <p className={styles.modalSubtitle}>
                                    Select the appropriate contract format based
                                    on your location
                                </p>

                                <div className={styles.radioGroup}>
                                    <label className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="contractType"
                                            value="dubai"
                                            checked={
                                                selectedContract === "dubai"
                                            }
                                            onChange={(e) =>
                                                handleContractSelect(
                                                    e.target.value
                                                )
                                            }
                                            className={styles.radioInput}
                                        />
                                        <div className={styles.contractDetails}>
                                            <img
                                                src={form1}
                                                alt="Dubai Contract"
                                                className={styles.contractImage}
                                            />
                                            <h3
                                                className={
                                                    styles.contractTypeTitle
                                                }
                                            >
                                                Dubai Tenancy Contract
                                            </h3>
                                            <p
                                                className={
                                                    styles.contractDescription
                                                }
                                            >
                                                Standard RERA-approved tenancy
                                                contract template for Dubai
                                                properties. Includes all
                                                mandatory clauses and follows
                                                Dubai s real estate regulations.
                                            </p>
                                            <div className={styles.features}>
                                                <span
                                                    className={styles.feature}
                                                >
                                                    <Check
                                                        size={16}
                                                        className={
                                                            styles.featureIcon
                                                        }
                                                    />{" "}
                                                    RERA Compliant
                                                </span>
                                                <span
                                                    className={styles.feature}
                                                >
                                                    <Clock
                                                        size={16}
                                                        className={
                                                            styles.featureIcon
                                                        }
                                                    />{" "}
                                                    15 Minutes
                                                </span>
                                                <span
                                                    className={styles.feature}
                                                >
                                                    <Shield
                                                        size={16}
                                                        className={
                                                            styles.featureIcon
                                                        }
                                                    />{" "}
                                                    Legal Verified
                                                </span>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="contractType"
                                            value="abudhabi"
                                            checked={
                                                selectedContract === "abudhabi"
                                            }
                                            onChange={(e) =>
                                                handleContractSelect(
                                                    e.target.value
                                                )
                                            }
                                            className={`${styles.radioInput} ${styles.disabled}`}
                                            disabled
                                        />
                                        <div className={styles.contractDetails}>
                                            <img
                                                src="https://cdn.jotfor.ms/assets/img/templates/og-images/pdf-templates/contract-form.png"
                                                alt="Abu Dhabi Contract"
                                                className={styles.contractImage}
                                            />
                                            <h3
                                                className={
                                                    styles.contractTypeTitle
                                                }
                                            >
                                                Abu Dhabi Tenancy Contract
                                            </h3>
                                            <p
                                                className={
                                                    styles.contractDescription
                                                }
                                            >
                                                Official Tawtheeq-compliant
                                                tenancy contract template for
                                                Abu Dhabi properties. Includes
                                                all required terms as per Abu
                                                Dhabi real estate laws.
                                            </p>
                                            <div className={styles.features}>
                                                <span
                                                    className={styles.feature}
                                                >
                                                    <Check
                                                        size={16}
                                                        className={
                                                            styles.featureIcon
                                                        }
                                                    />{" "}
                                                    Tawtheeq Ready
                                                </span>
                                                <span
                                                    className={styles.feature}
                                                >
                                                    <Clock
                                                        size={16}
                                                        className={
                                                            styles.featureIcon
                                                        }
                                                    />{" "}
                                                    15 Minutes
                                                </span>
                                                <span
                                                    className={styles.feature}
                                                >
                                                    <Shield
                                                        size={16}
                                                        className={
                                                            styles.featureIcon
                                                        }
                                                    />{" "}
                                                    Legal Verified
                                                </span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Contract;
