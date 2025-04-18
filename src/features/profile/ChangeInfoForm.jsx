import { useForm } from "react-hook-form";
import styles from "../../styles/FormGrid.module.css";
import { GENDER_OPTIONS } from "../../utils/constants";
import useUpdateStaffMember from "../admin/staff/useUpdateStaffMember";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStaff } from "../../services/apiStaff";
import toast from "react-hot-toast";

function ChangeInfoForm({ userData }) {
    const queryClient = useQueryClient();
    const { updateStaffMember, isPending } = useUpdateStaffMember();
    const { register, handleSubmit, setValue, reset, watch } = useForm({
        defaultValues: {
            ...userData,
            whatsapp_notification: Boolean(userData.whatsapp_notification)
        },
    });

    const whatsappNotification = watch("whatsapp_notification");

    const { mutate: updateWhatsAppNotification, isPending: isUpdatingNotification } = useMutation({
        mutationFn: ({ id, whatsapp_notification }) => 
            updateStaff(id, { whatsapp_notification }),
        onSuccess: () => {
            toast.success("WhatsApp notification settings updated!");
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
        onError: (err) => toast.error(err.message),
    });

    function onSubmit(data) {
        updateStaffMember({ 
            id: userData.id, 
            payload: {
                ...data,
                whatsapp_notification: Boolean(data.whatsapp_notification)
            } 
        });
    }

    const handleReset = () => {
        reset({
            ...userData,
            whatsapp_notification: Boolean(userData.whatsapp_notification)
        });
    };

    const handleWhatsAppToggle = (e) => {
        const newValue = e.target.checked;
        setValue('whatsapp_notification', newValue);
        updateWhatsAppNotification({
            id: userData.id,
            whatsapp_notification: newValue
        });
    };

    return (
        <form className={styles.formGrid} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formContainer}>
                <div>
                    <label>Name</label>
                    <input type="text" required {...register("name")} />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" required {...register("email")} />
                </div>
                <div>
                    <label>Phone</label>
                    <div className="d-flex">
                        <PhoneInput
                            country={'us'} // Default country code
                            value={userData.phone} // Pre-fill with userData
                            onChange={(phone, countryData) => {
                                setValue('phone', phone); // Set phone value in form state
                                setValue('nationality', countryData.name); // Set nationality based on countryData
                            }}
                            inputProps={{
                                name: 'phone',
                                required: true,
                            }}
                            inputStyle={{
                                width: "100%",
                                height: "40px",
                                backgroundColor: "whitesmoke",
                                border: "none"

                            }}
                            buttonStyle={{
                                height: "40px",
                            }}
                        />
                    </div>

                </div>
                <div>
                    <label>Gender</label>
                    <select required {...register("gender")}>
                        {GENDER_OPTIONS.map((item) => (
                            <option value={item.value} key={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    marginBottom: '15px'
                }}>
                    <label style={{ 
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#333'
                    }}>WhatsApp Notifications</label>
                    <label style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '50px',
                        height: '24px'
                    }}>
                        <input
                            type="checkbox"
                            checked={whatsappNotification}
                            onChange={handleWhatsAppToggle}
                            disabled={isUpdatingNotification}
                            style={{
                                opacity: 0,
                                width: 0,
                                height: 0
                            }}
                        />
                        <span style={{
                            position: 'absolute',
                            cursor: isUpdatingNotification ? 'not-allowed' : 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: whatsappNotification ? '#4CAF50' : '#ccc',
                            transition: '0.3s',
                            borderRadius: '24px',
                            opacity: isUpdatingNotification ? 0.7 : 1
                        }}>
                            <span style={{
                                position: 'absolute',
                                content: '""',
                                height: '18px',
                                width: '18px',
                                left: '3px',
                                bottom: '3px',
                                backgroundColor: 'white',
                                transition: '0.3s',
                                borderRadius: '50%',
                                transform: whatsappNotification ? 'translateX(26px)' : 'translateX(0)'
                            }} />
                        </span>
                    </label>
                </div>

                <div className="btnsContainer">
                    <button
                        onClick={handleReset}
                        className="btnFormNormal"
                        type="button"
                        disabled={isPending}
                    >
                        Cancel
                    </button>
                    <button
                        className="btnSubmit"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? "Processing..." : "Submit"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default ChangeInfoForm;
