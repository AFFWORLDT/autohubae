import Menus from "../../ui/Menus";
import styles from "./PropertyMenus.module.css";
import { useAuth } from "../../context/AuthContext";

function PropertyMenus({ data }) {
    const { currentUser } = useAuth();

    return (
        <div className={styles.propertyMenus}>
            <Menus>
                <Menus.Toggle id={data.id} />

                <Menus.List id={data.id}>
                    <Menus.Button
                        icon="/icons/share-premium.svg"
                        onClick={() =>
                            window.open(
                                `/share-premium/${data.listingType.toLowerCase()}/${data.propertyId}?pdf=1&userId=${currentUser?.id}`,
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    >
                        Premium PDF
                    </Menus.Button>

                    <Menus.Button
                        icon="/icons/share.svg"
                        onClick={() =>
                            window.open(
                                `/share-property/${data.listingType.toLowerCase()}/${data.propertyId}?pdf=1&userId=${currentUser?.id}`,
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    >
                        Share PDF
                    </Menus.Button>

                    <Menus.Button
                        icon="/icons/share-social.svg"
                        onClick={() =>
                            window.open(
                                `/share-property/${data.listingType.toLowerCase()}/${data.propertyId}?userId=${currentUser?.id}`,
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    >
                        Share Link
                    </Menus.Button>
                </Menus.List>
            </Menus>
        </div>
    );
}

export default PropertyMenus;
