import { useEffect } from "react";
import styles from "./ManageCompany.module.css";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Spinner from "../../ui/Spinner";
import useUpdateCompanySettings from "../../features/admin/general/useUpdateCompanySettings";
import FormInputCountries from "../../ui/FormInputCountries";
import SectionTop from "../../ui/SectionTop";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useAllDetails from "../../features/all-details/useAllDetails";
import TabBar from "../../ui/TabBar";
import { MANAGE_COMPANY_TABS } from "../../utils/constants";

function ManageCompany() {
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === "admin" || currentUser?.role === "super_admin";
    const router = useNavigate();
    const { isLoading: isCompanyLoading, data: companyData, error } = useAllDetails();

    const { changeCompanySettings, isPending } = useUpdateCompanySettings();
    const { register, handleSubmit, reset, control } = useForm({
        defaultValues: {},
    });

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    useEffect(() => {
        reset({
            ...companyData?.company_settings,
            country_name: JSON.parse(
                companyData?.company_settings?.country_name ?? JSON.stringify({})
            ),
            company_color: companyData?.company_settings?.company_color ?? "#020079", // Default black
        });
    }, [companyData?.company_settings, reset]);

    if (!isAdmin) return router("/404", { replace: true });

    function onSubmit(formData) {
        const hexColorPattern = /^#([0-9A-Fa-f]{6})$/;

        if (!hexColorPattern.test(formData.company_color)) {
            toast.error("Invalid color format. Please provide a valid hex color.");
            return;
        }

        const newSettings = {
            ...formData,
            country_name: JSON.stringify(formData.country_name),
        };

        const keysToCheck = ["company_logo_url", "menu_logo_url"];
        keysToCheck.forEach((key) => {
            if (!newSettings[key] || typeof newSettings[key] === "string") {
                delete newSettings[key];
            }
        });

        changeCompanySettings(newSettings);
    }

    if (isCompanyLoading) return <Spinner type="fullPage" />;

    return (
        <div className="sectionContainer">
            <SectionTop heading="Manage Company">
                <TabBar
                    tabs={MANAGE_COMPANY_TABS}
                    activeTab={"MANAGE_COMPANY"}
                    navigateTo={(id) => MANAGE_COMPANY_TABS.find(tab => tab.id === id)?.path || '/admin/general/manage-company'}
                />
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: MANAGE_COMPANY_TABS[0].bgColor }}>
                <div className="sectionDiv">
                    <div className={styles.companyFormContainer}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <span>Company Name</span>
                                <input
                                    {...register("company_name")}
                                    type="text"
                                    placeholder="Name"
                                />
                            </div>
                            <div>
                                <span>Company email</span>
                                <input
                                    {...register("email")}
                                    type="text"
                                    placeholder="email"
                                />
                            </div>
                            <div>
                                <span>Contact Number</span>
                                <input
                                    {...register("contact_number")}
                                    type="text"
                                    placeholder="contact number"
                                />
                            </div>
                            <div>
                                <span>Website</span>
                                <input
                                    {...register("website")}
                                    type="text"
                                    placeholder="website ulr"
                                />
                            </div>
                            <div>
                                <span>ORN No</span>
                                <input
                                    {...register("orn_no")}
                                    type="text"
                                    placeholder="ORN No"
                                />
                            </div>

                            <div>
                                <span>Country</span>
                                <FormInputCountries
                                    control={control}
                                    registerName="country_name"
                                    placeholder="Select a country"
                                />
                            </div>

                            <div>
                                <span>Billing Address</span>
                                <input
                                    {...register("billing_address")}
                                    type="text"
                                    placeholder="Billing Address"
                                />
                            </div>

                            <div>
                                <span>Address</span>
                                <input
                                    {...register("address")}
                                    type="text"
                                    placeholder="Address"
                                />
                            </div>

                            <div>
                                <span>Brief</span>
                                <textarea
                                    {...register("brief_of_company")}
                                    placeholder="Brief"
                                    rows={5}
                                />
                            </div>

                            <div className={styles.inputFile}>
                                <span>Company Logo</span>
                                <div>
                                    {companyData?.company_settings?.company_logo_url && (
                                        <div className="imgContainer">
                                            <img
                                                src={
                                                    companyData?.company_settings?.company_logo_url
                                                }
                                            />
                                        </div>
                                    )}
                                    <input
                                        {...register("company_logo_url")}
                                        type="file"
                                        accept="image/*"
                                        disabled={isPending}
                                    />
                                </div>
                            </div>

                            <div className={styles.inputFile}>
                                <span>Menu Logo</span>
                                <div>
                                    {companyData?.company_settings?.menu_logo_url && (
                                        <div className="imgContainer">
                                            <img
                                                src={companyData?.company_settings?.menu_logo_url}
                                            />
                                        </div>
                                    )}
                                    <input
                                        {...register("menu_logo_url")}
                                        type="file"
                                        accept="image/*"
                                        disabled={isPending}
                                    />
                                </div>
                            </div>

                            <div>
                                <span>Company Color</span>
                                <input
                                    {...register("sidebar_color_code")}
                                    type="color"
                                    defaultValue="#020079"
                                    disabled={isPending}
                                    style={{
                                        width: "300px"
                                    }}
                                />
                            </div>

                            <div className="btnsContainer">
                                <button
                                    type="submit"
                                    className="btnSubmit"
                                    disabled={isPending}
                                >
                                    {isPending ? "Processing..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ManageCompany;
