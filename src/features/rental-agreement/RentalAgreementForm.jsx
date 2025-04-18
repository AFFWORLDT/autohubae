import { useForm } from "react-hook-form";
import styles from "./RentalAgreementForm.module.css";
import { usePropertiesBasics } from "../properties/usePropertiesBasics";
import { useSimplifiedTenantLists } from "../../pages/Tenents/useSimplifiedTenantLists";
import FormInputDataList from "../../ui/FormInputDataList";
import { CHEQUE_OPTIONS } from "../../utils/constants";
import Spinner from "../../ui/Spinner";

function RentalAgreementForm({ onSubmit, defaultValues = {}, submitButtonText = "Create Rental Agreement", isLoading, onCloseModal, isShowPropertyField = true }) {
  const { properties, isLoading: isPropertiesLoading } = usePropertiesBasics(true);
  const { tenants, isLoading: isTenantsLoading } = useSimplifiedTenantLists(true);
  const propertyOptions = properties.map((property) => ({
    label: property.title
    ,
    value: property.id,
  }));
  const tenantOptions = tenants?.map((tenant) => ({
    label: tenant.tenant_name,
    value: tenant.id,
  }));
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      property_id: defaultValues.property_id ? {
        label: defaultValues.property?.title,
        value: defaultValues.property?.id,
      } : "",
      tenant_id: defaultValues.tenant_id ? {
        label: defaultValues.tenant?.name,
        value: defaultValues.tenant?.id,
      } : "",
      start_date: defaultValues.start_date ? new Date(defaultValues.start_date).toISOString().split('T')[0] : "",
      end_date: defaultValues.end_date ? new Date(defaultValues.end_date).toISOString().split('T')[0] : "",
      rent_amount: +defaultValues.rent_amount || 0,
      payment_frequency: defaultValues.payment_frequency ? {
        label: defaultValues?.payment_frequency,
        value: defaultValues?.payment_frequency,
      } : "",
      security_deposit: +defaultValues?.security_deposit || 0,
      number_of_cheques: defaultValues?.number_of_cheques || "",
      terms_and_conditions: defaultValues?.terms_and_conditions || "",
      status: defaultValues?.status?.toUpperCase() || "DRAFT",
    },
  });

  const onSubmitHandler = (data) => {
    const formattedData = {
      ...data,
      start_date: data?.start_date ? new Date(data?.start_date).toISOString() : null,
      end_date: data?.end_date ? new Date(data?.end_date).toISOString() : null,
    };
    onCloseModal();
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
      {isShowPropertyField && (
        <div className={styles.formGroup}>
          <label htmlFor="property_id">Property </label>
          <FormInputDataList
            data={propertyOptions}
            isLoading={isPropertiesLoading}
            control={control}
            registerName={"property_id"}
            placeholder="Select Property"

          />
        </div>
      )}
      <div className={styles.formGroup}>
        <label htmlFor="tenant_id">Tenant </label>
        <FormInputDataList
          data={tenantOptions}
          isLoading={isTenantsLoading}
          control={control}
          registerName={"tenant_id"}
          placeholder="Select Tenant"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="start_date">Start Date</label>
        <input
          style={{ width: "100%" }}
          type="date"
          id="start_date"
          {...register("start_date")}
        />
        {errors.start_date && (
          <span className={styles.error}>{errors.start_date.message}</span>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="end_date">End Date</label>
        <input
          style={{ width: "100%" }}
          type="date"
          id="end_date"
          {...register("end_date",)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="rent_amount">Rent Amount</label>
        <input
          style={{ width: "100%" }}
          type="number"
          id="rent_amount"
          step="0.01"
          {...register("rent_amount", {
            min: { value: 0, message: "Rent amount must be positive" },
            valueAsNumber: true
          })}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="payment_frequency">Payment Frequency</label>
        <FormInputDataList
          data={[
            { label: "Weekly", value: "WEEKLY" },
            { label: "Monthly", value: "MONTHLY" },
            { label: "Quarterly", value: "QUARTERLY" },
            { label: "Yearly", value: "YEARLY" },
          ]}
          control={control}
          registerName={"payment_frequency"}
          placeholder="Select Payment Frequency"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="security_deposit">Security Deposit</label>
        <input
          style={{ width: "100%" }}
          type="number"
          id="security_deposit"
          step="0.01"
          {...register("security_deposit", {
            min: { value: 0, message: "Security deposit must be positive" },
            valueAsNumber: true
          })}
        />
        {errors.security_deposit && (
          <span className={styles.error}>{errors.security_deposit.message}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="number_of_cheques">Number of Cheques</label>
        <input
          style={{ width: "100%" }}
          type="number"
          id="number_of_cheques"
          min="1"
          {...register("number_of_cheques", {
            min: { value: 1, message: "Number of cheques must be at least 1" },
            valueAsNumber: true
          })}
        />
        {errors.number_of_cheques && (
          <span className={styles.error}>{errors.number_of_cheques.message}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="terms_and_conditions">Terms and Conditions</label>
        <textarea
          style={{ width: "100%" }}
          id="terms_and_conditions"
          {...register("terms_and_conditions")}
          rows="4"
        />
        {errors.terms_and_conditions && (
          <span className={styles.error}>{errors.terms_and_conditions.message}</span>
        )}
      </div>
      <button type="submit" className={'btnSubmit'} style={{ width: "100%" }} disabled={isLoading} >
        {submitButtonText} {isLoading && <Spinner type={"spine"} />}
      </button>
    </form>
  );
}

export default RentalAgreementForm;
