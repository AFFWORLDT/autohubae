import useExampleDownload from "./useExampleDownload";

function DownloadExcelSampleButton() {
    const { isDownloading, download } = useExampleDownload();

    const buttonStyles = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "8px 16px",
        fontSize: "14px",
        borderRadius: "8px",
        transition: "all 0.2s ease",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        cursor: isDownloading ? "not-allowed" : "pointer",
        opacity: isDownloading ? 0.7 : 1,
    };

    const svgStyles = {
        width: "16px",
        height: "16px",
        animation: isDownloading ? "spin 1s linear infinite" : "none",
    };

    const textStyles = {
        whiteSpace: "nowrap",
        fontWeight: 500,
        color: "#1a202c",
    };

    return (
        <button
            style={buttonStyles}
            onClick={download}
            disabled={isDownloading}
            type="button"
        >
            <svg
                style={svgStyles}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                        isDownloading
                            ? "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            : "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    }
                />
            </svg>
            <span style={textStyles}>
                {isDownloading
                    ? "Downloading.........."
                    : "Download Excel Sample"}
            </span>
        </button>
    );
}

export default DownloadExcelSampleButton;
