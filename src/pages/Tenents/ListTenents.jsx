import { PlusCircle, Search } from "lucide-react";
import styles from "./TenantList.module.css";
import SectionTop from "../../ui/SectionTop";
import NewTenants from "../../features/Tenants/NewTenants";
import { useState, useRef, useCallback, useEffect } from "react";
import TenantFormModal from "../../features/Tenants/TenantFormModal";
import TabBar from "../../ui/TabBar";
import { TENANT_OWNER_CONTRACT_TABS } from "../../utils/constants";
import { useLocation } from "react-router-dom";
import ScrollToTop from "../../ui/ScrollToTop";
import Spinner from "../../ui/Spinner";
import useInfiniteTenants from "../../features/Tenants/useInfiniteTenants";

function ListTenants() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    const containerRef = useRef(null);

    const {
        tenants,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteTenants(searchQuery);

    const activeTab =
        TENANT_OWNER_CONTRACT_TABS.find((tab) => tab.path === location.pathname)
            ?.id || "TENANTS";

    const currentTab = TENANT_OWNER_CONTRACT_TABS.find(
        (tab) => tab.id === activeTab
    );
    const bgColor = currentTab?.bgColor || "#ffffff";

    const handleAddClick = () => {
        setShowAddModal(true);
    };

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

        if (scrollPercentage > 80 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll]);

    return (
        <div className="sectionContainer">
            <SectionTop heading="Tenants Management">
                <TabBar
                    tabs={TENANT_OWNER_CONTRACT_TABS}
                    activeTab={activeTab}
                    navigateTo={(tabId) => {
                        const tab = TENANT_OWNER_CONTRACT_TABS.find(
                            (t) => t.id === tabId
                        );
                        return tab?.path || "/";
                    }}
                />
            </SectionTop>

            <section 
                className="sectionStyles" 
                style={{ 
                    backgroundColor: bgColor,
                    height: "calc(100vh)",
                    overflow: "hidden",
                    position: "relative"
                }}
            >
                <div 
                    ref={containerRef}
                    style={{
                        paddingTop: "4rem",
                        height: "100%",
                        backgroundColor: bgColor,
                        boxShadow: "none",
                        overflowY: "auto",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        position: "relative"
                    }}
                >
                    <div className={styles.header}>
                        <div className={styles.searchContainer}>
                            <Search size={20} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search tenants..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                        <button
                            className={styles.addButton}
                            onClick={handleAddClick}
                        >
                            <PlusCircle size={20} />
                            <span>Add Tenant</span>
                        </button>
                    </div>

                    <NewTenants 
                        searchQuery={searchQuery} 
                        containerRef={containerRef}
                        isLoading={isLoading}
                        error={error}
                        tenants={tenants}
                    />

                    {isFetchingNextPage && (
                        <div className={styles.loadingMore}>
                            <Spinner />
                        </div>
                    )}
                </div>
                <ScrollToTop containerRef={containerRef} />
            </section>

            <TenantFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                mode="add"
            />
        </div>
    );
}

export default ListTenants;
