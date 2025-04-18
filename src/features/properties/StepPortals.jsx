import styles from "../../styles/MultiStepForm.module.css";
import MultiStepForm, { useMultiStepForm } from "../../ui/MultiStepForm";
import { getBayutLocations, getLocations } from "../../services/apiProperties";
import {
    // formateAgentOptions,
    formateBayutLocationOptions,
    formatLocationsOptions,
} from "../../utils/utils";
// import { getStaff } from "../../services/apiStaff";
import useAllDetails from "../all-details/useAllDetails";
import { AMENITIES_OPTIONS } from "../../utils/constants";
import AmenitiesList from "./Aminities";
import useStaff from "../admin/staff/useStaff";

function StepPortals() {
    const { watch, setValue } = useMultiStepForm();
    const isPropertyFinder = watch("propertyFinder");
    const { data, isLoading } = useStaff();
    const isbayut = watch("bayut");
    const isdubizzle = watch("dubizzle");
    const isPropFusion = watch("propfusionPortal");
    const isOwnPortal = watch("ownPortal");
    const isCustomPortal = watch("customPortal");
    const isBayutOrDubizzle = isbayut || isdubizzle;
    const isShowPropertyAgentTitleOnPage =
        isPropertyFinder ||
        isBayutOrDubizzle ||
        isPropFusion ||
        isOwnPortal ||
        isCustomPortal;
    const { data: allData } = useAllDetails();
    const staffOptions = data?.map((item) => {
        return { value: item.id, label: item.name };
    });
    const amenitiesOptions = AMENITIES_OPTIONS?.map((item) => {
        return { value: item.code, label: item.label };
    });
    const fullUrl = window.location.href;
    const type = new URL(fullUrl);
    const pathname = type.pathname;
    const segments = pathname.split("/");
    const extractedPart = segments[1] ? `${segments[1]}` : "";

    return (
        <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
            <div
                style={{ gridTemplateColumns: "1fr" }}
                className={styles.formContainer}
            >
                <div className={styles.btnsToggleContainer}>
                    <MultiStepForm.InputToggle
                        registerName="bayut"
                        label="Bayut"
                        imgUrl="/icons/bayut.png"
                        valueToEnable="ENABLE"
                    />
                    <MultiStepForm.InputToggle
                        registerName="dubizzle"
                        label="Dubizzle"
                        imgUrl="/icons/dubizzle.png"
                        valueToEnable="ENABLE"
                    />
                    <MultiStepForm.InputToggle
                        registerName="propertyFinder"
                        label="Property Finder"
                        imgUrl="/icons/property-finder.png"
                        valueToEnable="ENABLE"
                    />

                    <MultiStepForm.InputToggle
                        registerName="propfusionPortal"
                        label="propfusion portal"
                        imgUrl="/icons/PROPFUSION_LOGO.png"
                        valueToEnable="ENABLE"
                    />
                    <MultiStepForm.InputToggle
                        registerName="ownPortal"
                        label="Own Portal "
                        imgUrl={allData?.company_settings?.company_logo_url}
                        valueToEnable="ENABLE"
                    />
                    <MultiStepForm.InputToggle
                        registerName="customPortal"
                        label="Custom Portal"
                        imgUrl="/icons/customePortal.png"
                        valueToEnable="ENABLE"
                    />
                </div>
                <div>
                    {extractedPart === "for-rent" && (
                        <div className="mb-3">
                            <MultiStepForm.InputCheckbox
                                registerName="isDtcmPermit"
                                label="DTCM Permit"
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <MultiStepForm.Input
                            registerName="permitNumber"
                            placeholder="Enter Permit Number"
                            label="Permit Number"
                        />
                    </div>
                    <div className="mb-4">
                        <MultiStepForm.Input
                            registerName="permitUrl"
                            placeholder="Enter Permit URL"
                            label="Permit URL"
                        />
                    </div>
                    <MultiStepForm.InputToggle
                        registerName="public_status"
                        label="Public Status"
                        valueToEnable={"YES"}
                    />
                </div>
                <MultiStepForm.InputDataList
                    registerName="amenities"
                    placeholder="Add Amenities"
                    isMulti={true}
                    label="Amenities"
                    data={amenitiesOptions}
                />

                <AmenitiesList watch={watch} setValue={setValue} />

                {isPropertyFinder && (
                    <>
                        <MultiStepForm.InputAsyncDataList
                            registerName="propertyFinderLocation"
                            placeholder="Enter Location"
                            label="Property Finder"
                            required={true}
                            asyncFunc={getLocations}
                            formatFunc={formatLocationsOptions}
                        />

                        <MultiStepForm.InputToggle
                            registerName="price_on_application"
                            label="Hide Price on Portal"
                            valueToEnable="Yes"
                        />
                    </>
                )}
                {isBayutOrDubizzle && (
                    <>
                        <MultiStepForm.InputAsyncDataList
                            registerName="bayutLocation"
                            placeholder="Enter Location"
                            label="Bayut Location"
                            required={true}
                            asyncFunc={getBayutLocations}
                            formatFunc={formateBayutLocationOptions}
                        />

                        {extractedPart === "for-sell" && (
                            <div className={styles.Container}>
                                <div>
                                    <MultiStepForm.Input
                                        registerName="offplanDetails_amountPaid"
                                        placeholder="Enter Amount Paid"
                                        label="Amount Paid"
                                        type="number"
                                        valueAsNumber={true}
                                    />
                                </div>
                                <div>
                                    <MultiStepForm.Input
                                        registerName="offplanDetails_originalPrice"
                                        placeholder="Enter Original Price"
                                        label="Original Price"
                                        type="number"
                                        valueAsNumber={true}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div
                    style={{
                        display: isShowPropertyAgentTitleOnPage
                            ? "block"
                            : "none",
                        marginTop: "5px",
                    }}
                >
                    {isShowPropertyAgentTitleOnPage && (
                        <label>Portal`s Agent</label>
                    )}
                    {isPropertyFinder && (
                        <div style={{ marginBottom: "10px" }}>
                            <MultiStepForm.InputDataList
                                registerName="propertyFinder_agent_Id"
                                placeholder="Enter Agent"
                                label="Property Finder"
                                data={staffOptions}
                                isLoading={isLoading}
                                isDisabled={isLoading}
                            />
                        </div>
                    )}
                    {isBayutOrDubizzle && (
                        <div style={{ marginBottom: "10px" }}>
                            <MultiStepForm.InputDataList
                                registerName="bayut_dubizzle_agent_Id"
                                placeholder="Enter Agent"
                                label="Bayut or Dubizzle"
                                data={staffOptions}
                                isLoading={isLoading}
                                isDisabled={isLoading}
                            />
                        </div>
                    )}
                    {isPropFusion && (
                        <div style={{ marginBottom: "10px" }}>
                            <MultiStepForm.InputDataList
                                registerName="propfusionPortal_agent_Id"
                                placeholder="Enter Agent"
                                label="Propfusion Portal"
                                data={staffOptions}
                                isLoading={isLoading}
                                isDisabled={isLoading}
                            />
                        </div>
                    )}
                    {isOwnPortal && (
                        <div style={{ marginBottom: "10px" }}>
                            <MultiStepForm.InputDataList
                                registerName="ownPortal_agent_Id"
                                placeholder="Enter Agent"
                                label="Own Portal"
                                data={staffOptions}
                                isLoading={isLoading}
                                isDisabled={isLoading}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StepPortals;
