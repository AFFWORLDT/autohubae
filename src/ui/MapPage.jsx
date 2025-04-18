import SectionTop from "./SectionTop";
import { useJsApiLoader } from "@react-google-maps/api";
import BootstrapTabs from "./BootstrapTabs";
import TabBar from "./TabBar";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from "react-router-dom";

const MAP_VIEW_TAB = {
    id: "MAP_VIEW",
    label: "Map View",
    bgColor: "#f0f9ff", // Light sky blue
    fontColor: "#0369a1", // Dark blue
    path: "/admin/map"
};

const MapPage = () => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    const navigate = useNavigate();
    const { id } = useParams();

    const handleTabClick = (tabId) => {
        if (tabId === "MAP_VIEW") {
            if (!id) {
                const newId = uuidv4();
                navigate(`/admin/map/${newId}`);
            }
        }
    };

    if (loadError) {
        return <h6>Error loading maps: {loadError.message}</h6>;
    }

    if (!isLoaded) {
        return <h6>Loading maps...</h6>;
    }

    return (
        <div className="sectionContainer">
            <SectionTop heading="MapView">
                <TabBar
                    tabs={[MAP_VIEW_TAB]}
                    activeTab={"MAP_VIEW"}
                    onTabClick={handleTabClick}
                />
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: MAP_VIEW_TAB.bgColor }}>
                <BootstrapTabs />
                {/* <PlotMap addresses={address} /> */}
            </section>
        </div>
    );
};

export default MapPage;
