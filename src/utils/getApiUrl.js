export const getApiUrl = () => {
    const hostname = window.location.hostname;

    // For localhost development, return the test API
    if (hostname.includes("localhost")) {
        return "https://test-api.propfusion.io";
        // return "https://indr.affworld.cloud";
    }

    const parts = hostname.split(".");
    let apiHostname;

    // Handle cases where the hostname has exactly 3 parts (subdomain, domain, TLD)
    if (parts.length === 3) {
        const [subdomain, domain] = parts;

        if (subdomain === "portal") {
            apiHostname = `${domain}-api.propfusion.io`;
        } else if (subdomain.endsWith("-portal")) {
            const baseSubdomain = subdomain.replace("-portal", "");
            apiHostname = `${baseSubdomain}-api.propfusion.io`;
        } else {
            apiHostname = `${domain}-api.propfusion.io`;
        }
    } else {
        // Default case if the hostname does not match expected patterns
        console.warn("Unexpected hostname structure:", hostname);
        apiHostname = "test-api.propfusion.io"; // Set a fallback or error API URL here
    }

    return `https://${apiHostname}`;
};
