import { useState } from "react";
import styles from "./CustomSideNav.module.css";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useAllDetails from "../features/all-details/useAllDetails";

function CustomSideNav() {
    const [isHamburgerActive, setIsHamburgerActive] = useState(false);
    const { data } = useAllDetails();
    const { currentUser } = useAuth();

    function handleToggleHamburger() {
        setIsHamburgerActive((prevState) => !prevState);
        document.documentElement.style.setProperty(
            "--side-nav-width",
            isHamburgerActive ? "10rem" : "25rem"
        );
    }
    const isBuildingFunctionalityEnabled =
        data?.company_settings?.building_func === "true" ? true : false;

    return (
        <>
            <aside
                className={`${styles.sideNav} ${isHamburgerActive ? styles.hamburgerActive : ""}`}
                style={{
                    background:
                        data?.company_settings?.sidebar_color_code || "#020079",
                }}
            >
                <div
                    onClick={handleToggleHamburger}
                    className={styles.toggleArrow}
                    style={{
                        background:
                            data?.company_settings?.sidebar_color_code ||
                            "#020079",
                    }}
                >
                    <img src="/icons/chevron-left.svg" alt="Toggle sidebar" />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        flexDirection: "column",
                    }}
                >
                    <Link to="/">
                        <img
                            className={styles.logo}
                            src={data?.company_settings?.menu_logo_url}
                        />
                    </Link>
                </div>

                <nav>
                    <div className={styles.menuItems}>
                        <ul>
                            <li>
                                <NavLink to="/dashboard">
                                    <img
                                        src="/icons/dashboard.svg"
                                        alt="Dashboard Icon"
                                    />
                                    <span>Dashboard</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/for-sell/new-list">
                                    <img
                                        src="/icons/for-sell.svg "
                                        alt="Sell Icon"
                                    />
                                    <span>Sell List</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/for-rent/new-list">
                                    <img
                                        src="/icons/for-rent.svg"
                                        alt="Rent Icon"
                                    />
                                    <span>Rent List</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/new-projects/list">
                                    <img
                                        src="/icons/new-projects.svg"
                                        alt="Projects Icon"
                                    />
                                    <span>New Projects List</span>
                                </NavLink>
                            </li>
                            {isBuildingFunctionalityEnabled && (
                                <>
                                    <li>
                                        <NavLink to="new-building/list">
                                            <img
                                                src="/icons/building-icon.svg"
                                                alt="New Buildings Icon"
                                            />
                                            <span>New Buildings List</span>
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            <div className={styles.divider} />

                            <li>
                                <NavLink to="/developers/list">
                                    <img
                                        src="/icons/developers.svg"
                                        alt="Developers Icon"
                                    />
                                    <span>Developers List</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/areas/list">
                                    <img
                                        src="/icons/areas.svg"
                                        alt="Areas Icon"
                                    />
                                    <span>Areas List</span>
                                </NavLink>
                            </li>
                            <div className={styles.divider} />
                            <li>
                                <NavLink to="/leads/sell">
                                    <img
                                        src="/icons/dollar-lead-icon.svg"
                                        alt="Leads Icon"
                                    />
                                    <span>Sell Leads</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/leads/rent">
                                    <img
                                        src="/icons/rent-lead-icon.svg"
                                        alt="Leads Icon"
                                    />
                                    <span>Rent Leads</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/leads/undefined">
                                    <img
                                        src="/icons/question-circle.svg"
                                        alt="Leads Icon"
                                    />
                                    <span>Undefined Leads</span>
                                </NavLink>
                            </li>
                            <div className={styles.divider} />

                            {(currentUser?.role === "admin" ||
                                currentUser?.role === "super_admin") && (
                                <li>
                                    <NavLink to="/leads/portal-calls">
                                        <img
                                            src="/icons/call.svg"
                                            alt="Leads Icon"
                                            style={{
                                                filter: "brightness(0) invert(1)",
                                            }}
                                        />
                                        <span>Portal Calls</span>
                                    </NavLink>
                                </li>
                            )}

                            <li>
                                <NavLink to="/leads/whatsapp-leads">
                                    <img
                                        src="/icons/whatsapp-icon.svg"
                                        alt="Leads Icon"
                                    />
                                    <span>Portal Whatsapp Leads</span>
                                </NavLink>
                            </li>
                            {/* <li>
                                <NavLink to="/leads/phone-view">
                                    <img src="/icons/phone-icon.svg" alt="Leads Icon" /> 
                                    <span>Phone View</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/leads/sms-view">
                                    <img src="/icons/whatsapp-icon.svg" alt="Leads Icon" />
                                    <span>Sms View</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/leads/whatsapp-view">
                                    <img src="/icons/whatsapp-icon.svg" alt="Leads Icon" />
                                    <span>WhatsApp View</span>
                                </NavLink>
                            </li> */}
                            <div className={styles.divider} />

                            <li>
                                <NavLink to="/contract/new-contract">
                                    <img
                                        src="/icons/handshake.svg"
                                        alt="Management Icon"
                                    />
                                    <span>Contract</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/for-owner/new-list">
                                    <img
                                        src="/icons/real-estate-owner.svg"
                                        alt="Management Icon"
                                    />
                                    <span>Owner List</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/for-tenants/new-list">
                                    <img
                                        src="/icons/household-family-inhabitants-tenants.svg"
                                        alt="Management Icon"
                                    />
                                    <span>Tenants List</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/rental-agreement/list">
                                    <img
                                        src="/icons/rental-agreement.svg"
                                        alt="Rental Agreement Icon"
                                    />
                                    <span>Rental Agreements</span>
                                </NavLink>
                            </li>
                            <div className={styles.divider} />

                            <li>
                                <NavLink to="/database/list">
                                    <img
                                        src="/icons/database.svg"
                                        alt="Database Icon"
                                    />
                                    <span>Projects</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/database/list/customers">
                                    <img
                                        src="/icons/customer.svg"
                                        alt="Database Icon"
                                    />
                                    <span>Customers</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/new-watchmen/list">
                                    <img
                                        src="/icons/watchmen.svg"
                                        alt="WatchMen Icon"
                                    />
                                    <span>Watchmen</span>
                                </NavLink>
                            </li>
                            <div className={styles.divider} />

                            <li>
                                <NavLink to="/vehicles/for-rent">
                                    <img
                                        src="/icons/car.svg"
                                        alt="Vehicles Icon"
                                    />
                                    <span>Rent Vehicles list</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/vehicles/for-sell">
                                    <img
                                        src="/icons/car.svg"
                                        alt="Vehicles Icon"
                                    />
                                    <span>Sell Vehicles list</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </aside>

            <div
                onClick={handleToggleHamburger}
                className={styles.mobileToggle}
                style={{
                    background:
                        data?.company_settings?.sidebar_color_code || "#020079",
                }}
            >
                <img src="/icons/chevron-left.svg" alt="Toggle mobile menu" />
            </div>

            <div
                className={styles.menuOverlay}
                onClick={handleToggleHamburger}
            ></div>
        </>
    );
}

export default CustomSideNav;
