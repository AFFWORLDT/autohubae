import { useState, useEffect } from "react";
import { FileDown, Save } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import styles from "./TenancyContracts.module.css";
import SectionTop from "../../ui/SectionTop";
import useSaveTanance from "../../features/Contract/useSaveTanance";
import useAllDetails from "../../features/all-details/useAllDetails";
function AgentContract() {
    const [formData, setFormData] = useState({
      Image1_af_image: null ,
      Name_of_Establishment:"",
      Address:"",
POBox:"",
Phone:"",
Fax:"",
Email:"",
ORN:"",
DEDLicense:"",
NameRegisteredAgent:"",
BRN:"",
DateIssued:"",
Mobile:"",
EmailAgent:"",
PropertyAddress:"",
MasterDeveloper:"",
MasterProject:"",
BuildingName:"",
ListedPrice:"",
Name_of_EstablishmentB:"",
AddressB:"",
POBoxB:"",
PhoneB:"",
FaxB:"",
EmailB:"",
ORNB:"",
DEDLicenseB:"",
NameRegisteredAgentB:"",
BRNB:"",
DateIssuedB:"",
MobileB:"",
EmailAgentB:"",
fsig_a:"",
ssig_b:"",
date:"",
agenta:"",
agentb:"",
clientName:"",
cemail:"",
cwebsite:"",
clocation:""

    });
    const { data: companyData } = useAllDetails();

    const [pdfUrl, setPdfUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
        const handleInputChange = async (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            const newFormData = {
                ...formData,
                [name]: checked,
            };

            setFormData(newFormData);
            await updatePDFPreview(newFormData);
        } else {
            const newFormData = {
                ...formData,
                [name]: value,
            };
            setFormData(newFormData);
            await updatePDFPreview(newFormData);
        }
    };
    useEffect(() => {
        if (companyData?.company_settings?.website) {
            setFormData(prevFormData => ({
                ...prevFormData,
                cwebsite: companyData.company_settings.website,
                cemail:companyData.company_settings.email
            }));
        }
    }, [companyData]); 
    const updatePDFPreview = async (currentFormData) => {
        try {
            setIsLoading(true);
            const existingPdfBytes = await fetch(
                "/Agent.pdf"
            ).then((res) => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const form = pdfDoc.getForm();
            const field = form.getFields();
            field.forEach((field) => {
                console.log(field.getName());
            });
            const setTextField = (fieldName, value) => {
                form.getTextField(fieldName)?.setText(String(value || ""));
              };
          
              // Set text fields with the correct values (ensuring string conversion)
              setTextField("name", currentFormData.Name_of_Establishment);
              setTextField("2", currentFormData.Address);
              setTextField("3", currentFormData.POBox);
              setTextField("4", currentFormData.Phone);
              setTextField("5", currentFormData.Fax);
              setTextField("6", currentFormData.ORN);
              setTextField("8", currentFormData.DEDLicense);
              setTextField("9", currentFormData.NameRegisteredAgent);
              setTextField("10", currentFormData.BRN);
              setTextField("11", currentFormData.DateIssued);
              setTextField("12", currentFormData.Mobile);
              setTextField("13", currentFormData.EmailAgent);
              setTextField("14", currentFormData.PropertyAddress);
              setTextField("15", currentFormData.MasterDeveloper);
              setTextField("16", currentFormData.MasterProject);
              setTextField("17", currentFormData.BuildingName);
              setTextField("18", currentFormData.ListedPrice);
              setTextField("Party A", currentFormData.fsig_a);
              setTextField("Party B", currentFormData.ssig_b);
              setTextField("DATE", currentFormData.date);
              setTextField("19", currentFormData.Name_of_EstablishmentB);
              setTextField("20", currentFormData.AddressB);
              setTextField("21", currentFormData.POBoxB);
              setTextField("22", currentFormData.PhoneB);
              setTextField("23", currentFormData.FaxB);
              setTextField("24", currentFormData.EmailB);
              setTextField("25", currentFormData.ORNB);
              setTextField("26", currentFormData.DEDLicenseB);
              setTextField("27", currentFormData.NameRegisteredAgentB);
              setTextField("28", currentFormData.BRNB);
              setTextField("29", currentFormData.DateIssuedB);
              setTextField("30", currentFormData.MobileB);
              setTextField("31", currentFormData.EmailAgentB);
              setTextField("Agent B", currentFormData.agentb);
              setTextField("Agent A", currentFormData.agenta);
              setTextField("Clientss Name", currentFormData.clientName);
              setTextField("Text3", currentFormData.cemail);
              setTextField("Text4", currentFormData.cwebsite);
              setTextField("Text5", currentFormData.clocation);
              
            
            const fields = form.getFields();
            fields.forEach((field) => {
                field.enableReadOnly();
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
            setPdfUrl(url);
        } catch (error) {
            console.error("Error updating PDF preview:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const generatePDF = async () => {
        try {
            const existingPdfBytes = await fetch(
                "/Agent.pdf"
            ).then((res) => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const form = pdfDoc.getForm();

            const field = form.getFields();
            field.forEach((field) => {
                console.log(field.getName());
            });
            await updatePDFPreview(formData);

            const fields = form.getFields();
            fields.forEach((field) => {
                field.enableReadOnly();
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Generated_Tenancy_Contract.pdf";
            link.click();
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);
    const { saveTanance, isPending }=useSaveTanance()
    const handelSave = ()=>{

        const payload = {
            master_developer_name: formData.MasterDeveloper,
            master_project_name: formData.MasterProject,
            agent_a_name: formData.Name_of_Establishment,
            agent_a_establishment: formData.Name_of_Establishment,
            agent_a_address: formData.Address,
            agent_a_pobox: formData.POBox,
            agent_a_phone: formData.Phone,
            agent_a_fax: formData.Fax,
            agent_a_email: formData.Email,
            agent_a_orn: formData.ORN,
            agent_a_ded_license: formData.DEDLicense,
            agent_a_registered_agent: formData.NameRegisteredAgent,
            agent_a_brn: formData.BRN,
            agent_a_date_issued: `${formData.DateIssued}T00:00:00Z`,
            agent_a_mobile: formData.Mobile,
            agent_b_name: formData.Name_of_EstablishmentB,
            agent_b_establishment: formData.Name_of_EstablishmentB,
            agent_b_address: formData.AddressB,
            agent_b_pobox: formData.POBoxB,
            agent_b_phone: formData.PhoneB,
            agent_b_fax: formData.FaxB,
            agent_b_email: formData.EmailB,
            agent_b_orn: formData.ORN,
            agent_b_ded_license: formData.DEDLicenseB,
            agent_b_registered_agent: formData.NameRegisteredAgentB,
            agent_b_brn: formData.BRN,
            agent_b_date_issued: `${formData.DateIssuedB}T00:00:00Z`,
            agent_b_mobile: formData.MobileB,
            party_a_signature: formData.fsig_a,
            party_b_signature: formData.ssig_b,
            agent_a_type: formData.agenta,
            agent_b_type: formData.agentb,
            client_name: formData.clientName,
            declaration_by_agent_a: "", // not present in form data
            declaration_by_agent_b: "", // not present in form data
              agreement_type:"A2A"
          };
     saveTanance(payload)
     }



    return (
        <div className="sectionContainer">
            <SectionTop heading="AgentA And AgentB Contract" />
            <section className="sectionStyles">
                <div className={styles.mainContainer}>
                    <div className={styles.formSection}>
                        <div className={styles.formContainer}>
                            <h2 className={styles.title}>
                                Lease Information Form
                            </h2>

                            <form onSubmit={(e) => e.preventDefault()}>

                            

                                <div className={styles.formGrid}>
                                     <div className={styles.formGroup}>
                                                                    <label className={styles.label}>
                                                                        Date
                                                                    </label>
                                                                    <input
                                                                        type="date"
                                                                        name="date"
                                                                        value={formData.date || ""}
                                                                        onChange={handleInputChange}
                                                                        className={styles.input}
                                                                    />
                                                                </div>

                                    {/* Lessor Information */}
                                    <h3
                                        className={styles.sectionHeader}
                                        id="owner"
                                    >
                                       Agent A
                                    </h3>
                                    <div className={styles.formGroup}>
                                        <label
                                            className={`${styles.label} ${styles.required}`}
                                        >
                                          Name of Establishment:
                                        </label>
                                        <input
                                            type="text"
                                            name="Name_of_Establishment"
                                            value={formData.Name_of_Establishment}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label
                                            className={`${styles.label} ${styles.required}`}
                                        >
                                            ORN
                                        </label>
                                        <input
                                            type="text"
                                            name="ORN"
                                            value={formData.ORN}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            P.O.BOX
                                        </label>
                                        <input
                                            type="text"
                                            name="POBox"
                                            value={formData.POBox}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                             Phone No.
                                        </label>
                                        <input
                                            type="text"
                                            name="Phone"
                                            value={formData.Phone}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                          Address
                                        </label>
                                        <input
                                            type="text"
                                            name="Address"
                                            value={formData.Address}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                           Email
                                        </label>
                                        <input
                                            type="text"
                                            name="Email"
                                            value={formData.Email}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                         Fax
                                        </label>
                                        <input
                                            type="text"
                                            name="Fax"
                                            value={formData.Fax}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                        DED License:
                                        </label>
                                        <input
                                            type="text"
                                            name="DEDLicense"
                                            value={formData.DEDLicense}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    {/* <h3
                                        className={styles.sectionHeader}
                                        id="tenant"
                                    >
                                        Tenant DETAILS
                                    </h3> */}

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                        Name of Registered Agent
                                        </label>
                                        <input
                                            type="text"
                                            name="NameRegisteredAgent"
                                            value={formData.NameRegisteredAgent}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                        BRN
                                        </label>
                                        <input
                                            type="text"
                                            name="BRN"
                                            value={formData.BRN}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                                                    <label className={styles.label}>
                                                                        Date Issue
                                                                    </label>
                                                                    <input
                                                                        type="date"
                                                                        name="DateIssued"
                                                                        value={formData.DateIssued || ""}
                                                                        onChange={handleInputChange}
                                                                        className={styles.input}
                                                                    />
                                                                </div>

                                   
                                    
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                             Email
                                        </label>
                                        <input
                                            type="text"
                                            name="EmailAgent"
                                            value={formData.EmailAgent}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                   
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Mobile No.
                                        </label>
                                        <input
                                            type="text"
                                            name="Mobile"
                                            value={formData.Mobile}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                   
                                    <h3
                                        className={styles.sectionHeader}
                                        id="owner"
                                    >
                                       Agent B
                                    </h3>
                                    <div className={styles.formGroup}>
                                        <label
                                            className={`${styles.label} ${styles.required}`}
                                        >
                                          Name of Establishment:
                                        </label>
                                        <input
                                            type="text"
                                            name="Name_of_EstablishmentB"
                                            value={formData.Name_of_EstablishmentB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label
                                            className={`${styles.label} ${styles.required}`}
                                        >
                                            ORN
                                        </label>
                                        <input
                                            type="text"
                                            name="ORNB"
                                            value={formData.ORNB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            P.O.BOX
                                        </label>
                                        <input
                                            type="text"
                                            name="POBoxB"
                                            value={formData.POBoxB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                             Phone No.
                                        </label>
                                        <input
                                            type="text"
                                            name="PhoneB"
                                            value={formData.PhoneB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                          Address
                                        </label>
                                        <input
                                            type="text"
                                            name="AddressB"
                                            value={formData.AddressB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                           Email
                                        </label>
                                        <input
                                            type="text"
                                            name="EmailB"
                                            value={formData.EmailB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                         Fax
                                        </label>
                                        <input
                                            type="text"
                                            name="FaxB"
                                            value={formData.FaxB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                        DED License:
                                        </label>
                                        <input
                                            type="text"
                                            name="DEDLicenseB"
                                            value={formData.DEDLicenseB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    {/* <h3
                                        className={styles.sectionHeader}
                                        id="tenant"
                                    >
                                        Tenant DETAILS
                                    </h3> */}

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                        Name of Registered Agent
                                        </label>
                                        <input
                                            type="text"
                                            name="NameRegisteredAgentB"
                                            value={formData.NameRegisteredAgentB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                        BRN
                                        </label>
                                        <input
                                            type="text"
                                            name="BRNB"
                                            value={formData.BRNB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                                                    <label className={styles.label}>
                                                                    Date Issue
                                                                    </label>
                                                                    <input
                                                                        type="date"
                                                                        name="DateIssuedB"
                                                                        value={formData.DateIssuedB || ""}
                                                                        onChange={handleInputChange}
                                                                        className={styles.input}
                                                                    />
                                                                </div>

                                   
                                    
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                             Email
                                        </label>
                                        <input
                                            type="text"
                                            name="EmailAgentB"
                                            value={formData.EmailAgentB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                   
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Mobile No.
                                        </label>
                                        <input
                                            type="text"
                                            name="MobileB"
                                            value={formData.MobileB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                   

                                    <h3
                                        className={styles.sectionHeader}
                                        id="property"
                                    >
                                        Property DETAILS{" "}
                                    </h3>
                                  

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                        Property Address
                                        </label>
                                        <input
                                            type="text"
                                            name="PropertyAddress"
                                            value={formData.PropertyAddress}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                        Master Developer
                                        </label>
                                        <input
                                            type="text"
                                            name="MasterDeveloper"
                                            value={formData.MasterDeveloper}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                        Master Project
                                        </label>
                                        <input
                                            type="text"
                                            name="MasterProject"
                                            value={formData.MasterProject}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                        Building Name
                                        </label>
                                        <input
                                            type="text"
                                            name="BuildingName"
                                            value={formData.BuildingName}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                        Listed Price
                                        </label>
                                        <input
                                            type="text"
                                            name="ListedPrice"
                                            value={formData.ListedPrice}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                   
                                    <h3
                                        className={styles.sectionHeader}
                                        id="term"
                                    >
                                      THE COMMISSION (split)
                                      The following commission split is agreed between the 2 agents.
                                    </h3>
                                    
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                       Agent A
                                        </label>
                                        <input
                                            type="text"
                                            name="agenta"
                                            value={formData.agenta}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                       Agent B
                                        </label>
                                        <input
                                            type="text"
                                            name="agentb"
                                            value={formData.agentb}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                       Client Name
                                        </label>
                                        <input
                                            type="text"
                                            name="clientName"
                                            value={formData.clientName}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <h3
                                        className={styles.sectionHeader}
                                        id="term"
                                    >
                                      SIGNATURES
                                    </h3>
                                    
                                    
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Sign Agent A
                                        </label>
                                        <input
                                            type="text"
                                            name="fsig_a"
                                            value={formData.fsig_a}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                   

                                  
                                  
                                    
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Sign Agent B
                                        </label>
                                        <input
                                            type="text"
                                            name="ssig_b"
                                            value={formData.ssig_b}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    
                                </div>
                                <h3
                                        className={styles.sectionHeader}
                                        id="term"
                                    >
                                      Company Info
                                    </h3>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            name="cemail"
                                            value={formData.cemail}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                           Website
                                        </label>
                                        <input
                                            type="text"
                                            name="cwebsite"
                                            value={formData.cwebsite}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                           Location
                                        </label>
                                        <input
                                            type="text"
                                            name="clocation"
                                            value={formData.clocation}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                <div className={styles.buttonGroup}>
                     * <button
                            type="button"
                            onClick={handelSave}
                            className={styles.button}
                            disabled={isPending}
                            
                        >
                            <Save className="w-5 h-5" />
                            Save
                        </button> 
                     <button
                            type="button"
                            onClick={generatePDF}
                            className={styles.button}
                            
                        >
                            <FileDown className="w-5 h-5" />
                            Generate PDF
                        </button>
                    
                     </div>
                            </form>
                        </div>
                    </div>

                    <div className={styles.previewSection}>
                        <div className={styles.previewContainer}>
                            {isLoading && (
                                <div className={styles.previewLoading}>
                                    Loading preview...
                                </div>
                            )}
                            {pdfUrl && (
                                <iframe
                                    src={pdfUrl}
                                    className={styles.previewFrame}
                                    title="PDF Preview"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AgentContract;
