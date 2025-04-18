import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function fetchCustomers(filters, signal) {
    const url = buildUrl("customers", filters);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to fetch customers");

        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}
export async function uploadCustomerExcel(file, agent_id, area_id) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(
            `${getApiUrl()}/customers/upload_excel_to_db?agent_id=${agent_id}&area_id=${area_id}`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${cookies.get("USER").access_token}`,
                },
                body: formData,
            }
        );

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to upload customer excel file");

        return await res.json();
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function downloadCustomerSample() {
    try {
        const response = await fetch(
            `${getApiUrl()}/customers/download_sample`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) throw new Error("Failed to download customer sample");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "customer_sample.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        return { success: true };
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createCustomer(customerData) {
    try {
        const res = await fetch(`${getApiUrl()}/customers/`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(customerData),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to create customer");

        return await res.json();
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function updateCustomer(customerId, customerData) {
    try {
        const res = await fetch(`${getApiUrl()}/customers/${customerId}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(customerData),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to update customer");

        return await res.json();
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteCustomer(customerId) {
    try {
        const res = await fetch(`${getApiUrl()}/customers/${customerId}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to delete customer");

        return await res.json();
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function deleteProject(projectName) {
    try {
        const res = await fetch(`${getApiUrl()}/customers/project/${projectName}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to delete project");

        return await res.json();
    } catch (err) {
        throw new Error(err.message);
    }
}



export async function downloadExampleFile(fileType) {
    try {
        const response = await fetch(
            `${getApiUrl()}/customers/example-file/${fileType}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${cookies.get("USER").access_token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return response;
    } catch (error) {
        throw new Error(error.message || "Error downloading example file");
    }
}
