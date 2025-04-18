import { useNavigate } from "react-router-dom";
import ConfirmDelete, { ConfirmApiCall } from "../../ui/ConfirmDelete";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import styles from "./PropertyMenus.module.css";
import RentalAgreementForm from "../rental-agreement/RentalAgreementForm";
import useCreateRentalAgreement from "../rental-agreement/useCreateRentalAgreement";
import useDeleteProperty from "./useDeleteProperty";
import useCreateProperty from "./useCreateProperty";
import useUpdateProperty from "./useUpdateProperty";
import { useAuth } from "../../context/AuthContext";
import { useRefreshProperties } from "./useRefreshProperties";
import { useForm } from "react-hook-form";
import useImagesStore from "../../store/imagesStore";

function NewPropertyMenus({ data }) {
    const { currentUser } = useAuth();
    const { mutate, isPending } = useRefreshProperties();
    const { removeProperty, isPending: isDeletingProperty } =
        useDeleteProperty();
    const { register, watch } = useForm();
    const portal = watch("portal");
    const { addProperty } = useCreateProperty();
    const { changeProperty } = useUpdateProperty();
    const navigate = useNavigate();
    const { addRentalAgreement: createRentalAgreement, isPending: isCreatingAgreement } = useCreateRentalAgreement();


    const { clearAllImages } = useImagesStore();
    function handleDuplicateInSell(currentListingType) {
        const newProperty = {
            ...data,
            title: `Copy of ${data.title}`,
            listingType: "SELL",
        };

        delete newProperty.id;

        if (currentListingType === "RENT") {
            delete newProperty.cheques;
            delete newProperty.deposit;
            delete newProperty.priceType;
            delete newProperty.availabilityDate;
            return navigate("/for-sell/add", { state: newProperty });
        }

        addProperty({ newProperty }, { onSettled: () => navigate(-1) });
    }

    function handleDuplicateInRent(currentListingType) {
        const newProperty = {
            ...data,
            title: `Copy of ${data.title}`,
            listingType: "RENT",
        };

        delete newProperty.id;

        if (currentListingType === "SELL") {
            delete newProperty.completionStatus;
            delete newProperty.acCharge;
            delete newProperty.serviceCharge;
            delete newProperty.hasMortgage;
            return navigate("/for-rent/add", { state: newProperty });
        }

        addProperty({ newProperty }, { onSettled: () => navigate(-1) });
    }

    function handleChangeStatus(status) {
        const updatedProperty = {
            ...data,
            status,
        };

        delete updatedProperty.id;

        changeProperty({ id: data.id, updatedProperty });
    }
    function handleChangePublicStatus(status) {
        const updatedProperty = {
            ...data,
            public_status: status,
        };

        delete updatedProperty.id;

        changeProperty({ id: data.id, updatedProperty });
    }

    return (
        <div className={styles.propertyMenus}>
            <Modal>
                <Menus>
                    <Menus.Toggle id={data.id} />

                    <Menus.List id={data.id}>
                        <Modal.Open openWindowName="ownerInfo">
                            <Menus.Button icon="/icons/info.svg">
                                Owner Info
                            </Menus.Button>
                        </Modal.Open>

                        <>
                            <Menus.Button
                                onClick={() => handleChangePublicStatus(data?.public_status === true ? false : true)}
                                icon={`${data?.public_status === true ? "/icons/eye-off.svg" : "/icons/eye.svg"}`}

                            >
                                {data?.public_status === true ? "Make Private" : "Make Public"}                        </Menus.Button>
                        </>


                        {data.status !== "ACTIVE" && (
                            <>
                                <Menus.Button
                                    onClick={() => handleChangeStatus("ACTIVE")}
                                    icon="/icons/eye.svg"
                                >
                                    Activate
                                </Menus.Button>
                            </>
                        )}

                        {data.status !== "INACTIVE" && (
                            <>
                                <Menus.Button
                                    onClick={() =>
                                        handleChangeStatus("INACTIVE")
                                    }
                                    icon="/icons/eye-off.svg"
                                >
                                    Inactivate
                                </Menus.Button>
                            </>
                        )}

                        {data?.status !== "SOLD" && data.listingType === "SELL" && (
                            <Menus.Button
                                onClick={() =>
                                    handleChangeStatus("SOLD")
                                }
                                icon="/icons/sold.svg"
                            >
                                Mark as Sold
                            </Menus.Button>


                        )

                        }
                        {
                            data?.status !== "RENTED" && data.listingType === "RENT" && (
                                <>
                                    <Modal.Open openWindowName="rentalAgreement">
                                        <Menus.Button
                                            icon="/icons/sold.svg"

                                        >
                                            Rental Agreement
                                        </Menus.Button>
                                    </Modal.Open>

                                    <Menus.Button
                                        onClick={() => handleChangeStatus("RENTED")}
                                        disabled={isPending}
                                        icon="/icons/refresh.svg"
                                    >
                                        Mark as Rented
                                    </Menus.Button>
                                </>
                            )
                        }
                        <Modal.Open openWindowName="RefreshListing">
                            <Menus.Button
                                disabled={isPending}
                                icon="/icons/refresh.svg"
                            >
                                Refresh Listing
                            </Menus.Button>
                        </Modal.Open>

                        <Menus.Button
                            onClick={() => {
                                clearAllImages();
                                navigate(
                                    `/for-${data.listingType.toLowerCase()}/edit/${data.id}`
                                );
                            }}
                            icon="/icons/edit.svg"
                        >
                            Edit
                        </Menus.Button>

                        <Menus.Button
                            onClick={() =>
                                handleDuplicateInSell(data.listingType)
                            }
                            icon="/icons/duplicate.svg"
                        >
                            Duplicate in Sell
                        </Menus.Button>

                        <Menus.Button
                            onClick={() =>
                                handleDuplicateInRent(data.listingType)
                            }
                            icon="/icons/duplicate.svg"
                        >
                            Duplicate in Rent
                        </Menus.Button>

                        <Modal.Open openWindowName="deleteProperty">
                            <Menus.Button icon="/icons/delete.svg">
                                Delete
                            </Menus.Button>
                        </Modal.Open>

                        <Menus.Button
                            icon="/icons/share.svg"
                            onClick={() =>
                                window.open(
                                    `/share-new-property/${data.listingType.toLowerCase()}/${data.id}?pdf=1&userId=${currentUser?.id}`,
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                        >
                            Share PDF
                        </Menus.Button>

                        <Menus.Button
                            icon="/icons/share-premium.svg"
                            onClick={() =>
                                window.open(
                                    `/share-premium/${data.listingType.toLowerCase()}/${data.id}?pdf=1&userId=${currentUser?.id}`,
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                        >
                            Premium PDF
                        </Menus.Button>

                        <Menus.Button
                            icon="/icons/share-social.svg"
                            onClick={() =>
                                window.open(
                                    `/share-new-property/${data.listingType.toLowerCase()}/${data.id}?userId=${currentUser?.id}`,
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                        >
                            Share Link
                        </Menus.Button>
                    </Menus.List>
                </Menus>

                <Modal.Window name="ownerInfo">
                    <div className={styles.ownerInfo}>
                        <h3>Owner Info</h3>
                        <ul>
                            <li>
                                <span>Name:</span>
                                <span>{data?.owner_info?.lessor_name}</span>
                            </li>
                            <li>
                                <span>Phone:</span>
                                <span>{data?.owner_info?.lessor_phone}</span>
                            </li>
                            <li>
                                <span>Secondary Phone:</span>
                                <span>{data?.owner_info?.secondryPhone}</span>
                            </li>
                            <li>
                                <span>Email:</span>
                                <span>{data?.owner_info?.lessor_email}</span>
                            </li>
                            <li>
                                <span>Unit Number: </span>
                                <span>{data?.houseNo}</span>
                            </li>
                            <li>
                                <span>Nationality:</span>
                                <span>
                                    {typeof data?.ownerParam?.nationality ===
                                        "string" &&
                                        data?.ownerParam?.nationality !== "null"
                                        ? data?.ownerParam?.nationality
                                        : ""}
                                </span>
                            </li>
                        </ul>
                    </div>
                </Modal.Window>

                <Modal.Window name="deleteProperty">
                    <ConfirmDelete
                        resourceName="property"
                        onConfirm={() =>
                            removeProperty(data.id, {
                                onSettled: () => navigate(-1),
                            })
                        }
                        isDeleting={isDeletingProperty}
                    />
                </Modal.Window>

                <Modal.Window name="RefreshListing">
                    <ConfirmApiCall
                        resourceName="Refresh Listing"
                        onConfirm={() =>
                            mutate({
                                portal,
                            })
                        }
                    >
                        <form style={{ padding: "0rem" }}>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "2rem",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="radio"
                                        {...register("portal")}
                                        value="bayut"
                                        style={{ cursor: "pointer" }}
                                    />
                                    Bayut
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="radio"
                                        {...register("portal")}
                                        value="propertyfinder"
                                        style={{ cursor: "pointer" }}
                                    />
                                    Property Finder
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="radio"
                                        {...register("portal")}
                                        value="both"
                                        defaultChecked={true}
                                        style={{ cursor: "pointer" }}
                                    />
                                    Both
                                </label>
                            </div>
                        </form>
                    </ConfirmApiCall>
                </Modal.Window>

                <Modal.Window name="rentalAgreement" overflow={true} >
                    <div className={styles.rentalAgreementModal}>
                        <h3>Create Rental Agreement</h3>
                        <RentalAgreementForm
                            isLoading={isCreatingAgreement}
                            isShowPropertyField={false}
                            onSubmit={(formData) => {
                                createRentalAgreement({
                                    property_id: data.id,
                                    tenant_id: formData.tenant_id.value,
                                    payment_frequency: formData.payment_frequency.value,
                                    number_of_cheques: formData.number_of_cheques,
                                    status: "ACTIVE",
                                    start_date: formData.start_date,
                                    end_date: formData.end_date,
                                    terms_and_conditions: formData.terms_and_conditions,
                                    rent_amount: formData?.rent_amount,
                                    security_deposit:formData?.security_deposit,
                                    cheque_payments:formData?.cheque_payments

                                }, {
                                    onSuccess: (res) => {
                                        handleChangeStatus("RENTED");
                                        navigate(`/rental-agreement/list/${res.id}`);
                                    },

                                });
                            }}

                            onCloseModal={() => {

                            }}
                        />
                    </div>
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default NewPropertyMenus;
