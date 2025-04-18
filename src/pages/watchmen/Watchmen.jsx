import useWatchmenLists from "../../features/watchmen/useGetwatchmenLists";
import WatchmenCard from "../../features/watchmen/WatchmenCard";
import SectionTop from "../../ui/SectionTop";
import Spinner from "../../ui/Spinner";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import Modal from "../../ui/Modal";
import AddWatchmenForm from "../../features/watchmen/AddWatchmenForm";
import Button from "../../ui/Button";
import styles from "./Watchmen.module.css";
import useUpdateKycStatus from "../../features/watchmen/useUpdateKycStatus";

function Watchmen() {
    const { watchmen, isLoading, error } = useWatchmenLists();
    const { updateKycStatus, isLoading: isUpdatingKyc } = useUpdateKycStatus();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    const handleUpdateKyc = async (watchmanId, newKycStatus) => {
        try {
            isUpdatingKyc && toast.loading("Updating KYC status...");
             updateKycStatus({ watchmanId, kycStatus: newKycStatus });
        } catch (error) {
            console.error('Error updating KYC status:', error);
        }
    };

    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <div>
            <Modal>
                <SectionTop heading={"Watchmen List"}>
                    <Modal.Open openWindowName="add-watchmen">
                        <Button variation="primary" size="12">
                            <i className="bi bi-plus-lg me-2"></i>
                            Add New Watchman
                        </Button>
                    </Modal.Open>
                </SectionTop>
                <div className="sectionStyles">
                    {/* <div className={styles.filterContainer}>
                        <Filter showReset={false}>
                            <Filter.Input
                                registerName="name"
                                placeholder="Name"
                            />
                        </Filter>
                    </div> */}
                    {watchmen?.length > 0 ? (
                        watchmen.map((watchman) => (
                            <WatchmenCard 
                                key={watchman.id} 
                                watchmen={watchman}
                                onUpdateKyc={handleUpdateKyc}
                            />
                        ))
                    ) : (
                        <div className={styles.noWatchmen}>
                            <p>No watchmen found. Please add a new watchman.</p>
                        </div>
                    )}
                </div>

                <Modal.Window name="add-watchmen">
                    <AddWatchmenForm />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default Watchmen;
