import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getProjects(filters, signal) {
    let url;
    if (filters.status === "POOL") {
        const poolFilters = { ...filters };
        delete poolFilters.project_status;
        delete poolFilters.status;
        url = buildUrl("properties/pool_projects", poolFilters);
    } else {
        url = buildUrl("properties/projects", filters);
    }

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            signal,
        });

        if (!res.ok) throw new Error("Could not get projects!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createProject(newProject, photos, floorPlanList) {
    const url = `${getApiUrl()}/properties/add_new_project`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(newProject),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not create project!");

        const { id } = await res.json();

        // Now, uploading images
        if (photos?.length) {
            await uploadProjectImages(id, photos);
        }

        // Now, creating floor plans
        if (floorPlanList?.length) {
            await Promise.all(
                floorPlanList.map((floorPlan) => createFloorPlan(id, floorPlan))
            );
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateProject(
    projectId,
    photos,
    updatedProject,
    newFloorPlans
) {
    const url = `${getApiUrl()}/properties/projects/${projectId}`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(updatedProject),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update project!");

        // Now, uploading images
        if (photos?.length) {
            await uploadProjectImages(projectId, photos);
        }

        // Now, creating floor plans
        if (newFloorPlans?.length) {
            await Promise.all(
                newFloorPlans.map((floorPlan) =>
                    createFloorPlan(projectId, floorPlan)
                )
            );
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteProject(projectId) {
    const url = `${getApiUrl()}/properties/projects/${projectId}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete project!");
    } catch (err) {
        throw new Error(err.message);
    }
}

async function uploadProjectImages(projectId, photos) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/upload_photos`;

    const formData = new FormData();

    Array.from(photos).forEach((file) => {
        formData.append("photos", file);
    });

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
        if (!res.ok) throw new Error("Failed to upload photos!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteProjectImage(projectId, imageUrl) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/delete_project_images?photo_urls=${imageUrl}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete image!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createFloorPlan(projectId, newFloorPlan) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/add_floor_plan`;

    const formData = new FormData();
    formData.append("title", newFloorPlan.floorPlanTitle);
    formData.append("Bedroom", newFloorPlan.floorPlanBedroom);
    formData.append("price", newFloorPlan.floorPlanPrice || 0);
    formData.append("size", newFloorPlan.floorPlanSize || 0);
    if (newFloorPlan.floorPlanLayout[0]) {
        formData.append("layout", newFloorPlan.floorPlanLayout[0]);
    }

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
        if (!res.ok) throw new Error("Could not upload floor plan!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateFloorPlan(
    projectId,
    floorPlanId,
    updatedFloorPlan
) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/update_floor_plan/${floorPlanId}`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(updatedFloorPlan),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update floor plan!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteFloorPlan(projectId, floorPlanId) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/floor_plan/${floorPlanId}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete floor plan!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getNewProjectsForMaps( signal) {
    const url = `${getApiUrl()}/properties/get_projects_for_map`;

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
        if (!res.ok) throw new Error("Could not get properties!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}