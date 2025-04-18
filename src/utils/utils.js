import { PAGE_SIZE } from "../utils/constants";
import { getApiUrl } from "./getApiUrl";

export function buildUrl(resource, filters, fetchAll) {
    let url = `${getApiUrl()}/${resource}?size=${fetchAll ? 1000 : PAGE_SIZE}`;

    for (const [key, val] of Object.entries(filters)) {
        if (val) {
            url += `&${key}=${val}`;
        }
    }

    return url;
}
export function buildUrlforLeads(resource, filters, fetchAll) {
    let url = `${getApiUrl()}/${resource}?size=${fetchAll ? 1000 : 100}`;

    for (const [key, val] of Object.entries(filters)) {
        if (val) {
            url += `&${key}=${val}`;
        }
    }

    return url;
}

function showOfflineNotification() {
    // Create notification element if it doesn't exist
    if (!document.getElementById("offline-notification")) {
        const notification = document.createElement("div");
        notification.id = "offline-notification";
        notification.style.position = "fixed";
        notification.style.top = "0";
        notification.style.left = "0";
        notification.style.right = "0";
        notification.style.backgroundColor = "#f44336";
        notification.style.color = "white";
        notification.style.padding = "12px";
        notification.style.textAlign = "center";
        notification.style.zIndex = "9999";
        notification.textContent =
            "You are currently offline. Please connect to the internet to continue.";

        document.body.appendChild(notification);

        // Add event listener to remove notification when online
        window.addEventListener("online", function () {
            const notification = document.getElementById(
                "offline-notification"
            );
            if (notification) {
                notification.remove();
                // Optionally refresh or retry authentication when back online
                window.location.reload();
            }
        });
    }
}

export function formatNum(number) {
    return new Intl.NumberFormat("en-US").format(number);
}

export function secondsToHMS(secondsInput) {
    const hours = Math.floor(secondsInput / 3600);
    const minutes = Math.floor((secondsInput % 3600) / 60);
    const seconds = secondsInput % 60;

    const pad = (num) => String(num).padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function dateToYMD(dateString) {
    const dateObj = new Date(dateString);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const date = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${date}`;
}

export function getDaysFromCurrentDate(date) {
    return Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
}

export function bedroomString(roomNum) {
    return roomNum === 0 ? "Studio" : roomNum || "N/A";
}
export function formatLocationsOptions(data) {
    return data.map((obj) => {
        return {
            value: { ...obj },
            label: `${obj?.property_name ? obj.property_name + ", " : ""}${obj?.sub_community ? obj.sub_community + ", " : ""}${obj?.community ? obj.community + ", " : ""}${obj?.city ? obj.city : ""}`,
        };
    });
}
export function formatLocationsCommunityOptions(data) {
    return data.map((obj) => {
        return {
            value: obj,
            label: `${obj?.property_name ? obj.property_name + ", " : ""}${obj?.sub_community ? obj.sub_community + ", " : ""}${obj?.community ? obj.community + ", " : ""}${obj?.city ? obj.city : ""}`,
        };
    });
}

export const formateBayutLocationOptions = (data) => {
    return data.map((obj) => {
        return {
            value: { ...obj },
            label: `${obj.hierarchy}`,
        };
    });
};

export const formateAgentOptions = (data) => {
    return data.map((obj) => {
        return {
            value: obj.id,
            label: `${obj.name}`,
        };
    });
};

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function checkUnauthorized(status, cookies) {
    if (status === 401 || !cookies.get("USER")) {
        cookies.remove("USER", { path: "/" });
        localStorage.removeItem("CRMUSER");
        window.location.replace("/login");
        throw new Error("You're not authorized. Please Log in again!");
    }
}
