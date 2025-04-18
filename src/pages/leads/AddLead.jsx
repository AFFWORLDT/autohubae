import LeadForm from "../../features/leads/LeadForm";
import useCreateLead from "../../features/leads/useCreateLead";
import MultiStepForm from "../../ui/MultiStepForm";
import SectionTop from "../../ui/SectionTop";

function renderStep(step) {
    switch (step) {
        case 1:
            return <LeadForm />;
        default:
            return null;
    }
}

function AddLead() {
    const { addLead, isPending } = useCreateLead();
    function handleFormSubmit(data, handleReset) {
        const newLead = {
            ...data,
            agent_Id: data.agent_Id?.value,
            area_id: data.area_id?.map?.((item) => item.value) ?? [],
            property_type:
                data.property_type?.map?.((item) => item.value) ?? [],
            preferred_property: data.preferred_property?.map?.((item) => item.value) ?? [],
            nationality: data.nationality?.value ?? "",
            phone: data.phone
                ? `${data.phone}`
                : "",
            secondryPhone: data.secondryPhone
                ? `${data.secondryPhone}`
                : "",
            status: "ACTIVE",
            isClaim: "NO",
            rent_period: data.rent_period ? data?.rent_period?.value : null
        };

        if (newLead.clientType === "RENT") delete newLead.projectType;
        delete newLead.telCodePrimary;
        delete newLead.telCodeSecondary;

        addLead(newLead, {
            onSettled: handleReset,
        });
    }
    return (
        <div className="sectionContainer">
            <SectionTop heading="Add Lead" />
            <section className="sectionStyles">
                <MultiStepForm
                    totalSteps={1}
                    renderStep={renderStep}
                    onFormSubmit={handleFormSubmit}
                    isSubmitting={isPending}
                    defaultValues={{

                    }}
                />
            </section>
        </div>
    );
}

export default AddLead;
