import { useState } from "react";
import PropertyImageGallery from "./PropertyImageGallery.jsx";
import AgentContact from "../../ui/AgentContact.jsx";
import styles from "../../styles/ListingItemTop.module.css";
import { formatNum } from "../../utils/utils";
import NewPropertyMenus from "./NewPropertyMenus.jsx";
import useUpdateProperty from "./useUpdateProperty.js";
import { ConfirmDeActivate } from "../../ui/ConfirmDelete.jsx";
import Modal from "../calendar/Modal.jsx";
import useAllDetails from "../all-details/useAllDetails.js";
import { useNavigate } from "react-router-dom";

function NewPropertyTop({ data }) {
    const { changeProperty, isPending } = useUpdateProperty();
    const { data: allData } = useAllDetails();
    const navigate = useNavigate();

    // State for controlling modal
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    function handleChangeAgent(agentId, onCloseModal) {
        changeProperty(
            {
                id: data.id,
                updatedProperty: { ...data, agent_Id: agentId },
            },
            {
                onSettled: onCloseModal,
            }
        );
    }

    function openRemoveLocationModal(locationType) {
        setSelectedLocation(locationType);
        setModalOpen(true);
    }

    function handleConfirmRemoveLocation() {
        if (selectedLocation) {
            changeProperty({
                id: data.id,
                updatedProperty: { ...data, [selectedLocation]: "" },
            });
        }
        setModalOpen(false);
    }

    function handleWhatsappClick() {
        navigate(`/leads/whatsapp-leads?property_id=${data.id}`);
    }

    // WhatsApp icon component
    const WhatsAppIcon = () => {
        const [showPopover, setShowPopover] = useState(false);

        return (
            <div
                onClick={handleWhatsappClick}
                onMouseEnter={() => setShowPopover(true)}
                onMouseLeave={() => setShowPopover(false)}
                style={{ position: "relative" }}
            >
                <img
                    src="/icons/whatsapp.png"
                    alt=""
                    style={{ width: "4rem", height: "4rem" }}
                />
                {showPopover && (
                    <div
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: "#ffffff",
                            color: "#000",
                            padding: "5px 10px",
                            borderRadius: "40px",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            zIndex: 10,
                            border: "1px solid #ccc",
                        }}
                    >
                        See all whatsapp leads for this property
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`sectionDiv ${styles.listingItemTop}`}>
            {/* Property Images */}
            <div style={{ position: "relative" }}>
                {(data.completionStatus === "completed_primary" ||
                    data.completionStatus === "completed") && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            position: "absolute",
                            top: "0px",
                            left: "0px",
                            zIndex: 1,
                        }}
                    >
                        <span
                            style={{
                                padding: "8px 10px",
                                backgroundColor: "#4CAF50", // Green for Completed
                                color: "white",
                                fontWeight: "bold",
                                borderRadius: "12px",
                                fontSize: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                textTransform: "uppercase",
                            }}
                        >
                            Completed
                        </span>
                        <WhatsAppIcon />
                    </div>
                )}
                {(data.completionStatus === "off_plan" ||
                    data.completionStatus === "off_plan_primary") && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            position: "absolute",
                            top: "1px",
                            left: "1px",
                            zIndex: 1,
                        }}
                    >
                        <span
                            style={{
                                padding: "5px 8px",
                                backgroundColor: "#FF5722", // Red for Off Primary
                                color: "white",
                                fontWeight: "bold",
                                borderRadius: "12px",
                                fontSize: "8px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                textTransform: "uppercase",
                            }}
                        >
                            Off Plan
                        </span>
                        <WhatsAppIcon />
                    </div>
                )}
                {!data.completionStatus && (
                    <div
                        style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            zIndex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                    >
                        <WhatsAppIcon />
                    </div>
                )}
                <PropertyImageGallery
                    images={
                        data.photos?.map((url) => {
                            return {
                                original: url,
                                thumbnail: url,
                            };
                        }) || []
                    }
                />
            </div>
            <div className={styles.listingItemTopContent}>
                <NewPropertyMenus data={data} />

                <div className={styles.statusContainer}>
                    <span className={styles.status}>{data.status}</span>
                    <div className={styles.propertyFinderImageContainer}>
                        {data?.propertyFinder && (
                            <span>
                                <img
                                    src="/icons/property-finder.png"
                                    className={`${
                                        data?.propertyFinder === "REQ_ENABLE"
                                            ? "image-adjuster"
                                            : ""
                                    } `}
                                    onClick={() =>
                                        openRemoveLocationModal(
                                            "propertyFinder"
                                        )
                                    }
                                />
                            </span>
                        )}
                        {data?.bayut && (
                            <img
                                className={
                                    data?.bayut === "REQ_ENABLE"
                                        ? "image-adjuster"
                                        : ""
                                }
                                src="/icons/bayut.png"
                                onClick={() => openRemoveLocationModal("bayut")}
                            />
                        )}
                        {data?.dubizzle && (
                            <img
                                className={
                                    data?.dubizzle === "REQ_ENABLE"
                                        ? "image-adjuster"
                                        : ""
                                }
                                src="/icons/dubizzle.png"
                                onClick={() =>
                                    openRemoveLocationModal("dubizzle")
                                }
                            />
                        )}
                        {data?.propfusionPortal && (
                            <span>
                                <img
                                    className={
                                        data?.propfusionPortal === "REQ_ENABLE"
                                            ? "image-adjuster"
                                            : ""
                                    }
                                    src="/icons/PROPFUSION_LOGO.png"
                                    onClick={() =>
                                        openRemoveLocationModal(
                                            "propfusionPortal"
                                        )
                                    }
                                />
                            </span>
                        )}
                        {data?.customPortal && (
                            <img
                                className={
                                    data?.customPortal === "REQ_ENABLE"
                                        ? "image-adjuster"
                                        : ""
                                }
                                src="/icons/customePortal.png"
                                onClick={() =>
                                    openRemoveLocationModal("customPortal")
                                }
                            />
                        )}
                        {data?.ownPortal && (
                            <img
                                className={
                                    data?.ownPortal === "REQ_ENABLE"
                                        ? "image-adjuster"
                                        : ""
                                }
                                src={
                                    allData?.company_settings?.company_logo_url
                                }
                                onClick={() =>
                                    openRemoveLocationModal("ownPortal")
                                }
                            />
                        )}
                    </div>
                </div>

                <h1>{data.title}</h1>
                <p className={styles.location}>
                    <img src="/icons/location.svg" alt="" />
                    <span>{data.area?.name}</span>
                </p>

                <p className={styles.price}>
                    <span>
                        {data.price
                            ? `AED ${formatNum(data.price)}`
                            : "Not specified"}
                        {data.listingType === "RENT" && data?.priceType
                            ? ` / ${data.priceType}`
                            : ""}
                    </span>
                </p>

                <div className={styles.type}>
                    <span>{data.property_type}</span>
                </div>

                <p className={styles.community}>
                    <span>Location: </span>
                    <span>
                        {[
                            data.location?.property_name,
                            data.location?.sub_community,
                            data.location?.community,
                            data.location?.city,
                        ]
                            .filter(Boolean)
                            .map((field, index, array) =>
                                index < array.length - 1 ? `${field}, ` : field
                            )}
                    </span>
                </p>

                <p className={styles.developer}>
                    <span>Developer: </span>
                    <span>{data.developer?.name ?? "N/A"}</span>
                </p>

                <AgentContact
                    onChangeAgent={handleChangeAgent}
                    isChangingAgent={isPending}
                    agentAvatar={data?.agent?.avatar}
                    agentName={data?.agent?.name}
                    agentPhone={data?.agent?.phone}
                    agentMail={data?.agent?.email}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setModalOpen(false);
                }}
                title="Alert!"
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ConfirmDeActivate
                        resourceName={`Property from this portal`}
                        onConfirm={handleConfirmRemoveLocation}
                        onCancel={() => setModalOpen(false)}
                        isDeleting={isPending}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default NewPropertyTop;
