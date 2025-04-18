import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "../../services/apiCustomer";
import { useSearchParams } from "react-router-dom";

function useCustomers() {
    const [searchParams] = useSearchParams();
    const filters = {};

    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {
            filters[key] = Number(val) || 1;
            continue;
        }
        if (val) filters[key] = val;
    }
    const { isLoading, data, error } = useQuery({
        queryFn: ({ signal }) => fetchCustomers(filters, signal),
        queryKey: ["customers", filters],
    });

    return { isLoading, error, data };
}

export default useCustomers;
