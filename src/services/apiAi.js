import { getApiUrl } from "../utils/getApiUrl";
import { checkUnauthorized } from "../utils/utils";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export async function generatePropertyContent(payload) {
    const url = `${getApiUrl()}/ai/generate-property-content`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        checkUnauthorized(res.status, cookies);

        if (!res.ok) throw new Error("Could not generate property content!");

        return await res.json();
    } catch (err) {
        throw new Error(err.message);
    }
}
