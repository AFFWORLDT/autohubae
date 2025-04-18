import { getApiUrl } from "../utils/getApiUrl";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function createArea(data) {
    const url = `${getApiUrl()}/properties/add_area_with_image`;
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", data.logo);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);

        return res;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function getAreas(filters, fetchAll, signal) {
    const url = buildUrl(
        "properties/get_areas_with_property_counts",
        filters,
        fetchAll
    );

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            signal,
        });

        if (!res.ok) throw new Error("Could not get areas!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAreasWithoutCount(fetchAll, signal) {
    let url = `${getApiUrl()}/properties/get_areas?size=${fetchAll ? 1000 : 10}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            signal,
        });

        if (!res.ok) throw new Error("Could not get areas!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadAreaImage(id, imageFile) {
    const url = `${getApiUrl()}/properties/areas/${id}/upload_img`;

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to update image!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function bulkAssignedAreas(payload) {
    const url = `${getApiUrl()}/properties/bulk-assign_areas`;
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(payload),
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not assigned agent to owner!");
        return await res.json();
    } catch (error) {
        throw new Error(error.message);
    }
}
