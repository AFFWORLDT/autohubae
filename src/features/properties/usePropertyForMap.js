import { useQuery } from "@tanstack/react-query";
import {
    fetchPropertiesForMap,
} from "../../services/apiProperties";
import { useSearchParams } from "react-router-dom";

function usePropertyForMap() {
    const [searchParams] = useSearchParams();

    const filter = {
        
    };
    for (const [key, value] of searchParams.entries()) {
        if (value) {
            filter[key] = value;
        }
    }
    const { data, isLoading } = useQuery({
        queryKey: ["propertiesForMap", filter],
        queryFn: ({ signal }) => fetchPropertiesForMap(filter, signal),
        keepPreviousData: true,
    });
    return { data, isLoading };
}

export default usePropertyForMap;
