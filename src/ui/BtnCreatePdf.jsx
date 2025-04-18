import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./BtnCreatePdf.module.css";

function BtnCreatePdf({ id }) {
    async function handlePdf() {
        const element = document.getElementById(id);

        // Hiding the button temporarily to hide it from the PDF
        const btnCreatePdf = element.querySelector("button");
        btnCreatePdf.style.display = "none";

        // Generating PDF
        const canvas = await html2canvas(element, {
            scale: window.devicePixelRatio,
            useCORS: true,
            backgroundColor: "#f3f4f6",
            scrollY: -window.scrollY,
        });
        const imgData = canvas.toDataURL("image/png");

        // Get dimensions of the image
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Calculate the PDF dimensions based on the content
        const pdf = new jsPDF({
            orientation: imgWidth > imgHeight ? "landscape" : "portrait",
            unit: "px",
            format: [imgWidth, imgHeight], // Set the format dynamically
            compress: true,
        });

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        const pdfBlob = pdf.output("blob");
        const url = URL.createObjectURL(pdfBlob);

        const newTab = window.open(url, "_blank");
        if (newTab) {
            newTab.focus();
        } else {
            alert("Please allow pop-ups for this website");
        }

        // Displaying the button again
        btnCreatePdf.style.display = "block";
    }

    return (
        <button onClick={handlePdf} className={styles.btnCreatePdf}>
            Create PDF
        </button>
    );
}

export default BtnCreatePdf;
