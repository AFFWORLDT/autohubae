import { useSearchParams } from "react-router-dom";
import styles from "../../styles/MultiStepForm.module.css";
import FormInputCountries from "../../ui/FormInputCountries";
import MultiStepForm, { useMultiStepForm } from "../../ui/MultiStepForm";
import {
    BEDROOM_NUM_OPTIONS,
    GENDER_OPTIONS,
    LEAD_TYPE_OPTIONS,
    NUM_OPTIONS,
    PAYMENT_OPTIONS,
    PRICE_TYPE_OPTIONS,
    PROJECT_OPTIONS,
    PROPERTY_TYPES,
    SOURCE_OPTIONS,
} from "../../utils/constants";
import useStaff from "../admin/staff/useStaff";
import useAreasWithoutCount from "../areas/useAreasWithoutCount";
import usePropertyForMap from "../properties/usePropertyForMap";
import {  useEffect, useState } from "react";

function LeadForm({ leadType }) {
 const [showPopover, setShowPopover] = useState(false)
    const { data: staffData, isLoading: isStaffLoading } = useStaff();
    const { data: areaData, isLoading: isAreaLoading } =
        useAreasWithoutCount(true);
        const [searchParams] = useSearchParams();
        
        const no=searchParams.get('no');
       
    const { data: propertyData, isLoading: isPropertyLoading } = usePropertyForMap()

    const { watch, control,setValue} = useMultiStepForm();
    const clientType = watch("clientType", leadType);


    useEffect(()=>{
        if(no){
            setValue("phone",no);
        }
    },[no])
    const staffOptions = staffData.map((item) => {
        return { value: item.id, label: item.name };
    });
    const areaOptions = areaData.map((item) => {
        return { value: item.id, label: item.name };
    });
    const propertyOptions = propertyData?.map((item) => {
        return { value: item?.id, label: item?.name };
    });

    return (
        <>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/star.svg" />
                    <span>Type</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputSelect
                        registerName="clientType"
                        options={LEAD_TYPE_OPTIONS}
                        required={true}
                        label="Lead Type"
                    />

                    <MultiStepForm.InputDataList
                        registerName="agent_Id"
                        data={staffOptions}
                        isLoading={isStaffLoading}
                        placeholder="Select Agent"
                        label="Agent"
                        required={true}

                    />
                </div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/location.svg" />
                    <span>Location</span>
                </h3>
                <div style={{
                        marginTop: '8px',
                        position: 'relative'
                    }}>
                <div className={styles.formContainer}>
                    <MultiStepForm.InputDataList
                        registerName="area_id"
                        data={areaOptions}
                        isLoading={isAreaLoading}
                        placeholder="Select Location"
                        isMulti={true}
                        label="Preferred Location"
                    />
                </div>
                <button
                            type="button"
                            onMouseEnter={() => setShowPopover(true)}
                            onMouseLeave={() => setShowPopover(false)}
                            style={{
                                padding: '4px 8px',
                                backgroundColor: '#f1f5f9',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                fontWeight: '500',
                                letterSpacing: '0.025em'
                            }}
                        >
                            See Location ({watch('area_id')?.length || 0})
                        </button>

{showPopover && (
        <div 
            onMouseEnter={() => setShowPopover(true)}
            onMouseLeave={() => setShowPopover(false)}
            style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                marginTop: '8px',
                padding: '12px',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                minWidth: '200px',
                maxHeight: '300px',
                overflowY: 'auto'
            }}
        >

            {watch("area_id")?.length > 0 ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                  
                    
                    {watch('area_id').map((lang, index) => (
                        <span
                            key={index}
                            style={{
                                padding: '4px 8px',
                                backgroundColor: '#f8fafc',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        >
                            {lang.label}
                        </span>
                    ))}
                </div>
            ) : (
                <p style={{ color: '#64748b', fontSize: '14px' }}>No languages selected</p>
            )}
        </div>
    )}

</div>
            </div>

            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <h3>
                    <img src="/icons/detail.svg" />
                    <span>Detail</span>
                </h3>
                <div className={styles.formContainer}>
                    <MultiStepForm.Input
                        registerName="name"
                        placeholder="Name"
                        required={true}
                        label="Name"
                    />
                    {clientType === "SELL" && (
                        <MultiStepForm.InputSelect
                            registerName="projectType"
                            options={PROJECT_OPTIONS}
                            label="Project Type"
                        />
                    )}
                    <div className={styles.splitInput}>
                        <div className={styles.inputContainer}>
                            <label>Phone</label>

                            <MultiStepForm.Input
                                registerName="phone"
                                placeholder="Phone Number"
                            />
                        </div>
                    </div>
                    <div className={styles.splitInput}>
                        <div className={styles.inputContainer}>
                            <label>Secondary Phone</label>

                            <MultiStepForm.Input
                                registerName="secondryPhone"
                                placeholder="Phone Number"
                            />
                        </div>
                    </div>
                    <MultiStepForm.Input
                        type="email"
                        registerName="email"
                        placeholder="Email"
                        label="Email"
                    />
                    <div className={styles.inputContainer}>
                        <label>Nationality</label>
                        <FormInputCountries
                            control={control}
                            registerName="nationality"
                            placeholder="Select a country"
                        />
                    </div>
                    <MultiStepForm.InputSelect
                        registerName="gender"
                        options={GENDER_OPTIONS}
                        label="Gender"
                    />

                    <div className={styles.splitInput}>
                        <MultiStepForm.InputSelect
                            registerName="roomsFrom"
                            valueAsNumber={true}
                            options={[
                                { label: "From", value: "" },
                                ...BEDROOM_NUM_OPTIONS.slice(1),
                            ]}
                            label="Preferred Rooms"
                        />
                        <span>-</span>
                        <MultiStepForm.InputSelect
                            registerName="roomsTo"
                            valueAsNumber={true}
                            options={[
                                { label: "To", value: "" },
                                ...BEDROOM_NUM_OPTIONS.slice(1),
                            ]}
                        />
                    </div>
                    <div className={styles.splitInput}>
                        <MultiStepForm.InputSelect
                            registerName="from_bathroom"
                            valueAsNumber={true}
                            options={[
                                { label: "From", value: "" },
                                ...NUM_OPTIONS.slice(1),
                            ]}
                            label="Preferred Bathrooms"
                        />
                        <span>-</span>
                        <MultiStepForm.InputSelect
                            registerName="to_bathroom"
                            valueAsNumber={true}
                            options={[
                                { label: "To", value: "" },
                                ...NUM_OPTIONS.slice(1),
                            ]}
                        />
                    </div>

                    <div className={styles.splitInput}>
                        <MultiStepForm.Input
                            type="number"
                            registerName="budgetFrom"
                            valueAsNumber={true}
                            placeholder="From (in AED)"
                            label="Budget"
                        />
                        <span>-</span>
                        <MultiStepForm.Input
                            type="number"
                            registerName="budgetTo"
                            valueAsNumber={true}
                            placeholder="To (in AED)"
                        />
                    </div>
                    <div style={{
                        marginTop: '8px',
                        position: 'relative'
                    }}>
                    <MultiStepForm.InputDataList
                        registerName="property_type"
                        data={PROPERTY_TYPES}
                        placeholder="Property Type"
                        isMulti={true}
                        label="Preferred  Type"
                    />
                    
                     <button
                            type="button"
                            onMouseEnter={() => setShowPopover(true)}
                            onMouseLeave={() => setShowPopover(false)}
                            style={{
                                padding: '4px 8px',
                                backgroundColor: '#f1f5f9',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                fontWeight: '500',
                                letterSpacing: '0.025em'
                            }}
                        >
                            See Type ({watch('property_type')?.length || 0})
                        </button>

{showPopover && (
        <div 
            onMouseEnter={() => setShowPopover(true)}
            onMouseLeave={() => setShowPopover(false)}
            style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                marginTop: '8px',
                padding: '12px',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                minWidth: '200px',
                maxHeight: '300px',
                overflowY: 'auto'
            }}
        >

            {watch("property_type")?.length > 0 ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    {watch('property_type').map((lang, index) => (
                        <span
                            key={index}
                            style={{
                                padding: '4px 8px',
                                backgroundColor: '#f8fafc',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        >
                            {lang.value}
                        </span>
                    ))}
                </div>
            ) : (
                <p style={{ color: '#64748b', fontSize: '14px' }}>No languages selected</p>
            )}
        </div>
    )}

</div>
                    <MultiStepForm.InputSelect
                        registerName="payMethod"
                        options={PAYMENT_OPTIONS}
                        label="Payment Method"
                    />
                    <MultiStepForm.InputSelect
                        registerName="clientSource"
                        options={SOURCE_OPTIONS}
                        label="Source of Lead"
                    />
 <div style={{
                        marginTop: '8px',
                        position: 'relative'
                    }}>
                    <MultiStepForm.InputDataList
                        registerName="preferred_property"
                        data={propertyOptions}
                        isLoading={isPropertyLoading}
                        placeholder="Select Property"
                        isMulti={true}
                        label="Preferred Property"
                    />
                    <button
                            type="button"
                            onMouseEnter={() => setShowPopover(true)}
                            onMouseLeave={() => setShowPopover(false)}
                            style={{
                                padding: '4px 8px',
                                backgroundColor: '#f1f5f9',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                fontWeight: '500',
                                letterSpacing: '0.025em'
                            }}
                        >
                            See Property ({watch('preferred_property')?.length || 0})
                        </button>

{showPopover && (
        <div 
            onMouseEnter={() => setShowPopover(true)}
            onMouseLeave={() => setShowPopover(false)}
            style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                marginTop: '8px',
                padding: '12px',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                minWidth: '200px',
                maxHeight: '300px',
                overflowY: 'auto'
            }}
        >

            {watch("preferred_property")?.length > 0 ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    {watch('preferred_property').map((lang, index) => (
                        <span
                            key={index}
                            style={{
                                padding: '4px 8px',
                                backgroundColor: '#f8fafc',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        >
                            {lang.label}
                        </span>
                    ))}
                </div>
            ) : (
                <p style={{ color: '#64748b', fontSize: '14px' }}>No languages selected</p>
            )}
        </div>
    )}

</div>

                    {clientType === "RENT" &&
                        <MultiStepForm.InputSelect
                            registerName="rent_period"
                            options={PRICE_TYPE_OPTIONS}
                            placeholder="Select Rent Period"
                            label="Rent Period"
                        />}
                </div>
               
            </div>
        </>
    );
}

export default LeadForm;
