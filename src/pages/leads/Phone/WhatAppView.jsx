import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./../../../styles/PhoneView.module.css"
import SectionTop from "../../../ui/SectionTop";
import { LEAD_TABS_TYPE_OPTIONS } from "../../../utils/constants";
import TabBar from "../../../ui/TabBar";
import ScrollToTop from "../../../ui/ScrollToTop";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import useWhatapp from "../../../features/leads/Phone/useWhatsapp";

  const WhatAppView = () => {
    const { 
        isLoading, 
        portalCalls,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage 
    } = useWhatapp();
    const [selectedSource, setSelectedSource] = useState("all");
const data= portalCalls


    const containerRef = useRef(null);
     const handleScroll = useCallback(() => {
            if (!containerRef?.current) return;
    
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
            if (scrollPercentage > 80 && hasNextPage && !isFetchingNextPage) {
                console.log('Fetching next page...', { scrollPercentage, hasNextPage, isFetchingNextPage });
                fetchNextPage();
            }
        }, [containerRef, hasNextPage, isFetchingNextPage, fetchNextPage]);
    
        useEffect(() => {
            const currentRef = containerRef?.current;
            if (!currentRef) return;
    
            currentRef.addEventListener("scroll", handleScroll);
            return () => currentRef.removeEventListener("scroll", handleScroll);
        }, [containerRef, handleScroll]);
    

    const currentTab = LEAD_TABS_TYPE_OPTIONS.find(
        (tab) => tab.id === "WHATAPP-VIEW"
    );
    const bgColor = currentTab?.bgColor || "#ffffff";

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);
    // Filter data based on search term and selected source
    const filteredData = data.filter(item => {
    
        
      const sourceMatches = selectedSource === "all" || item.source === selectedSource;
      
      return  sourceMatches;
    });
  
    if (isLoading && !data?.length) {
        return <Spinner type="fullPage" />;
    }

    if (!data?.length) {
        return (
            <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                color: '#666'
            }}>
                No portal calls found
            </div>
        );
    }

  

  
    return (
        <div className="sectionContainer">
        <SectionTop heading={`WHATAPP VIEW`}>
        <TabBar
            tabs={[
              LEAD_TABS_TYPE_OPTIONS[3],
              LEAD_TABS_TYPE_OPTIONS[4],
              LEAD_TABS_TYPE_OPTIONS[5],
              LEAD_TABS_TYPE_OPTIONS[6],
              LEAD_TABS_TYPE_OPTIONS[7],
          ]}
            activeTab={"Whatsapp View"}
            navigateTo={(tabId) => `/leads/${tabId.toLowerCase()}`}
        />
    </SectionTop>
    <section
                ref={containerRef}
                className="sectionStyles"
                style={{
                    paddingTop: "4rem",
                    paddingLeft: "3rem",
                    backgroundColor: bgColor,
                    height: "calc(100vh)",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                 <style>
                    {`
                        .sectionStyles::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>WHATAPP Views Analytics</h1>
          <p className={styles.subtitle}>Total WHATAPP VIEW: {filteredData.length} | Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className={styles.searchWrapper}>
         
         <div className={styles.sourceFilter}>
  <span className={styles.filterLabel}>Filter by source:</span>
  <div className={styles.filterOptions}>
    <label className={styles.filterOption}>
      <input
        type="radio"
        className={styles.radioInput}
        name="source"
        value="all"
        checked={selectedSource === "all"}
        onChange={() => setSelectedSource("all")}
      />
      <span className={styles.radioLabel}>All</span>
    </label>
    <label className={styles.filterOption}>
      <input
        type="radio"
        className={styles.radioInput}
        name="source"
        value="bayut"
        checked={selectedSource === "bayut"}
        onChange={() => setSelectedSource("bayut")}
      />
      <span className={styles.radioLabel}>Bayut</span>
    </label>
    <label className={styles.filterOption}>
      <input
        type="radio"
        className={styles.radioInput}
        name="source"
        value="dubizzle"
        checked={selectedSource === "dubizzle"}
        onChange={() => setSelectedSource("dubizzle")}
      />
      <span className={styles.radioLabel}>Dubizzle</span>
    </label>
  </div>
</div>
</div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.headerCell}>Date</th>
                <th className={styles.headerCell}>Property</th>
                <th className={styles.headerCell}>Agent</th>
                <th className={styles.headerCell}>Reference</th>
                <th className={styles.headerCell}>Source</th>
                <th className={styles.headerCell}>whatsapp views</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
  {filteredData.map((item, index) => (
    <tr key={index} className={styles.row}>
      <td className={styles.cell}>{item.date_time}</td>
      <td className={styles.cell}>
        {item.property_info ? (
          <div>
            <div className={styles.propertyTitle}>{item.property_info.title}</div>
            <span className={`${styles.badge} ${item.property_info.listingType === "SELL" ? styles.badgeSell : styles.badgeRent}`}>
              {item.property_info.listingType}
            </span>
          </div>
        ) : (
          <span className={styles.unavailable}>N/A</span>
        )}
      </td>
      <td className={styles.cell}>
        {item.agent_info ? (
          <div className={styles.agentInfo}>
            {item.agent_info.avatar ? (
              <img src={item?.agent_info?.avatar} alt={item.agent_info.name} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {item.agent_info.name.charAt(0)}
              </div>
            )}
            <div className={styles.agentDetails}>
              <div className={styles.agentName}>{item.agent_info.name}</div>
              <div className={styles.agentPhone}>{item.agent_info.phone}</div>
            </div>
          </div>
        ) : (
          <span className={styles.unavailable}>N/A</span>
        )}
      </td>
      <td className={styles.cell}>
        {item.listing_reference || <span className={styles.unavailable}>N/A</span>}
      </td>
      <td className={styles.cell}>
        <span className={`${styles.badge} ${item.source === "bayut" ? styles.badgeBayut : styles.badgeDubizzle}`}>
          {item.source}
        </span>
      </td>
      <td className={styles.cell}>
        <span className={styles.viewCount}>{item.whatsapp_views}</span>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
        
      
      </div>
      <ScrollToTop containerRef={containerRef} />
      {isFetchingNextPage && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    padding: '2rem',
                    backgroundColor: 'transparent' 
                }}>
                    <Spinner />
                </div>
            )}
      </section>
      </div>
    );
  };
  
  export default WhatAppView;