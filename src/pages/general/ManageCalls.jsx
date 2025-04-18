import { useEffect, useState } from "react";
import styles from "../../styles/ManageBase.module.css";
import useGetBayutKey from "../../features/admin/general/useGetBayutKey";
import useGetPropertyFinderKeys from "../../features/admin/general/useGetPropertyFinderKeys";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import useCreateBayutKey from "../../features/admin/general/useCreateBayutKey";
import useCreatePropertyFinderKey from "../../features/admin/general/useCreatePropertyFinderKey";
import SectionTop from "../../ui/SectionTop";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TabBar from "../../ui/TabBar";
import { MANAGE_CALLS_TABS } from "../../utils/constants";

function ManageCalls() {
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === "admin" || currentUser?.role === "super_admin";
    const router = useNavigate();
    const {
        isLoading: isLoadingBayut,
        data: dataBayut,
        error: errorBayut,
    } = useGetBayutKey();
    const {
        isLoading: isLoadingPropertyFinder,
        data: dataPropertyFinder,
        error: errorPropertyFinder,
    } = useGetPropertyFinderKeys();

    const { saveBayutKey, isPending: isSavingBayutKey } = useCreateBayutKey();
    const { savePropertyFinderKey, isPending: isSavingPropertyFinderKey } =
        useCreatePropertyFinderKey();

    const [bayutApiKey, setBayutApiKey] = useState("");
    const [propertyFinderKeys, setPropertyFinderKeys] = useState("");

    const [hiddenInputs, setHiddenInputs] = useState({
        bayutApi: true,
        propertyFinderApi: true,
        propertyFinderSecret: true,
    });

    function toggleHide(inputField) {
        setHiddenInputs((currentState) => {
            return {
                ...currentState,
                [inputField]: !currentState[inputField],
            };
        });
    }

    useEffect(() => {
        if (dataBayut) {
            setBayutApiKey(dataBayut);
        }
    }, [dataBayut]);

    useEffect(() => {
        if (dataPropertyFinder) {
            setPropertyFinderKeys(dataPropertyFinder);
        }
    }, [dataPropertyFinder]);

    useEffect(() => {
        if (errorBayut) {
            toast.error(errorBayut.message);
        }
        if (errorPropertyFinder) {
            toast.error(errorPropertyFinder.message);
        }
    }, [errorBayut, errorPropertyFinder]);

    if (!isAdmin) return router("/404", { replace: true });
    function handleBayutForm(e) {
        e.preventDefault();
        if (bayutApiKey === dataBayut) return;
        saveBayutKey({ apiKey: bayutApiKey, source: "Bayut & Dubizzle" });
    }

    function handlePropertyFinderForm(e) {
        e.preventDefault();
        if (
            JSON.stringify(propertyFinderKeys) ===
            JSON.stringify(dataPropertyFinder)
        )
            return;
        savePropertyFinderKey({
            apiKey: propertyFinderKeys.apiKey,
            secretKey: propertyFinderKeys.secretKey,
            source: "Property Finder",
        });
    }

    if (isLoadingBayut || isLoadingPropertyFinder)
        return <Spinner type="fullPage" />;

    return (
        <div className="sectionContainer">
            <SectionTop heading="Manage Calls">
                <TabBar
                    tabs={MANAGE_CALLS_TABS}
                    activeTab={"MANAGE_CALLS"}
                    navigateTo={(id) => MANAGE_CALLS_TABS.find(tab => tab.id === id)?.path || '/admin/general/manage-calls'}
                />
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: MANAGE_CALLS_TABS[0].bgColor }}>
                <div className="sectionDiv">
                    <div className={styles.manage}>
                        <form onSubmit={handleBayutForm}>
                            <div className={styles.formTitle}>
                                <img src="/icons/bayut.png" />
                                <img src="/icons/dubizzle.png" />
                                <h3>Bayut & Dubizzle</h3>
                            </div>

                            <div className={styles.formFlex}>
                                <div>
                                    <label htmlFor="bayutApiKey">API Key</label>
                                    <input
                                        value={bayutApiKey}
                                        onChange={(e) =>
                                            setBayutApiKey(e.target.value)
                                        }
                                        id="bayutApiKey"
                                        type={
                                            hiddenInputs.bayutApi
                                                ? "password"
                                                : "text"
                                        }
                                    />
                                    <BtnHide
                                        inputField="bayutApi"
                                        toggleHide={toggleHide}
                                        hiddenInputs={hiddenInputs}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.btnSave}
                                    disabled={isSavingBayutKey}
                                >
                                    Save
                                </button>
                            </div>
                        </form>

                        <form onSubmit={handlePropertyFinderForm}>
                            <div className={styles.formTitle}>
                                <img src="/icons/property-finder.png" />
                                <h3>Property Finder</h3>
                            </div>

                            <div className={styles.formFlex}>
                                <div>
                                    <label htmlFor="propertyFinderApi">
                                        API Key
                                    </label>
                                    <input
                                        value={propertyFinderKeys.apiKey ?? ""}
                                        onChange={(e) =>
                                            setPropertyFinderKeys({
                                                ...propertyFinderKeys,
                                                apiKey: e.target.value,
                                            })
                                        }
                                        id="propertyFinderApi"
                                        type={
                                            hiddenInputs.propertyFinderApi
                                                ? "password"
                                                : "text"
                                        }
                                    />
                                    <BtnHide
                                        inputField="propertyFinderApi"
                                        toggleHide={toggleHide}
                                        hiddenInputs={hiddenInputs}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.btnSave}
                                    disabled={isSavingPropertyFinderKey}
                                >
                                    Save
                                </button>
                            </div>

                            <div className={styles.formFlex}>
                                <div>
                                    <label htmlFor="propertyFinderSecret">
                                        Secret Key
                                    </label>
                                    <input
                                        value={
                                            propertyFinderKeys.secretKey ?? ""
                                        }
                                        onChange={(e) =>
                                            setPropertyFinderKeys({
                                                ...propertyFinderKeys,
                                                secretKey: e.target.value,
                                            })
                                        }
                                        id="propertyFinderSecret"
                                        type={
                                            hiddenInputs.propertyFinderSecret
                                                ? "password"
                                                : "text"
                                        }
                                    />
                                    <BtnHide
                                        inputField="propertyFinderSecret"
                                        toggleHide={toggleHide}
                                        hiddenInputs={hiddenInputs}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.btnSave}
                                    disabled={isSavingPropertyFinderKey}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

function BtnHide({ inputField, toggleHide, hiddenInputs }) {
    return (
        <button type="button" onClick={() => toggleHide(inputField)}>
            <img
                src={
                    hiddenInputs[inputField]
                        ? "/icons/eye.svg"
                        : "/icons/eye-off.svg"
                }
            />
        </button>
    );
}

export default ManageCalls;
