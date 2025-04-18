import { useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import Spinner from "./Spinner";
import TabsStyle from "./BootstrapTabs.module.css";
import PlotMap from "./PlotMap";
import toast from "react-hot-toast";
import useAreasWithoutCount from "../features/areas/useAreasWithoutCount";
import useNewPropertiesForMaps from "../features/properties/useNewPropertiesForMaps";
import { useSearchParams } from "react-router-dom";
import useNewProjectForMaps from "../features/newProjects/useNewProjectFroMap";

const BootstrapTabs = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const listingType = searchParams.get("listingType");
    const activeTab =
        listingType === "RENT"
            ? "RentList"
            : listingType === "SELL"
              ? "SellList"
              : null;

    // AreaList functionality
    const {
        isLoading: areasLoading,
        data: areasData,
        error: areasError,
    } = useAreasWithoutCount(true);

    useEffect(() => {
        if (areasError) toast.error(areasError.message);
    }, [areasError]);

    const {
        isLoading: propertiesLoading,
        data: propertiesData,
        error: propertiesError,
    } = useNewPropertiesForMaps();

    useEffect(() => {
        if (propertiesError) toast.error(propertiesError.message);
    }, [propertiesError]);

    const {
       data: projects,
        isLoading:projectLoding,
    } = useNewProjectForMaps();

    const handleSelect = (key) => {
        if (key === "SellList") {
            setSearchParams({ listingType: "SELL" });
        } else if (key === "RentList") {
            setSearchParams({ listingType: "RENT" });
        } else if (key === "AreaList") {
            setSearchParams({});
        }
        else if (key === "NewProject") {
            setSearchParams({});
        }
    };

    if (areasLoading) return <Spinner type="fullPage" />;

    // Rent List
    return (
        <Tabs
            defaultActiveKey={activeTab || "AreaList"}
            id="controlled-tab-example"
            className="mb-3"
            onSelect={handleSelect}
        >
            <Tab
                eventKey="AreaList"
                title="AreaList"
                tabClassName={TabsStyle.customTab}
            >
                {
                    <>
                        {areasLoading ? (
                            <Spinner type="fullPage" />
                        ) : (
                            <div className="sectionDiv">
                                <PlotMap addresses={areasData} />
                            </div>
                        )}
                    </>
                }
            </Tab>
            <Tab
                eventKey="SellList"
                title="SellList"
                tabClassName={TabsStyle.customTab}
            >
                {
                    <div className="sectionDiv">
                        {propertiesLoading ? (
                            <Spinner type="fullPage" />
                        ) : (
                            <>
                                <PlotMap
                                    listingType="sell"
                                    addresses={propertiesData}
                                />
                            </>
                        )}
                    </div>
                }
            </Tab>
            <Tab
                eventKey="RentList"
                title="RentList"
                tabClassName={TabsStyle.customTab}
            >
                {
                    <div className="sectionDiv">
                        {propertiesLoading ? (
                            <Spinner type="fullPage" />
                        ) : (
                            <>
                                <PlotMap
                                    listingType="rent"
                                    addresses={propertiesData}
                                />
                            </>
                        )}
                    </div>
                }
            </Tab>

            <Tab
                eventKey="NewProject"
                title="NewProject"
                tabClassName={TabsStyle.customTab}
            >
                {
                    <>
                        {projectLoding ? (
                            <Spinner type="fullPage" />
                        ) : (
                            <div className="sectionDiv">
                                <PlotMap 
                                 listingType="new"
                                addresses={projects} />
                            </div>
                        )}
                    </>
                }
            </Tab>
        </Tabs>
    );
};

export default BootstrapTabs;
