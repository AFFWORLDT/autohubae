import { useInfiniteQuery } from "@tanstack/react-query";
import { getLeads } from "../../services/apiLeads";
import { useSearchParams } from "react-router-dom";

function useInfiniteLeads(leadType) {
    const [searchParams] = useSearchParams();
    const filters = {
        clientType: leadType,
        sortType: searchParams.get("sortType") ?? "DESC",
        status: searchParams.get("status") ?? "ACTIVE",
        dateSortType: searchParams.get("dateSortType") ?? "DESC",
    };

    // Add any additional filters from search params
    for (const [key, val] of searchParams.entries()) {
        if (val) filters[key] = val;
    }

    const result = useInfiniteQuery({
        queryKey: ['leads', leadType, filters],
        queryFn: ({ pageParam = 1 }) => getLeads({ ...filters, page: pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.leads.length) return undefined;
            if (lastPage.totalLeads <= allPages.length * 12) return undefined;
            return allPages.length + 1;
        },
    });

    return {
        ...result,
        leads: result.data?.pages.flatMap(page => page.leads) ?? [],
        totalSize: result.data?.pages[0]?.totalLeads ?? 0,
    };
}

export default useInfiniteLeads; 