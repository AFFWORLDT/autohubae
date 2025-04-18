import { useInfiniteQuery } from "@tanstack/react-query";
import { getProjects } from "../../services/apiNewProjects";
import { useSearchParams } from "react-router-dom";

function useInfiniteProjects() {
    const [searchParams] = useSearchParams();
    const filters = {
        sort_by_date: searchParams.get("sortType") ?? "DESC",
        project_status: searchParams.get("status") ?? "ACTIVE",
    };

    for (const [key, val] of searchParams.entries()) {
        if (val) filters[key] = val;
    }

    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["projects", filters],
        queryFn: ({ pageParam = 1 }) => {
            return getProjects({ 
                ...filters,
                page: pageParam,
            });
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.projects.length) return undefined;
            
            const totalPages = Math.ceil(lastPage.totalProjects / 12);
            const nextPage = allPages.length + 1;
            
            return nextPage <= totalPages ? nextPage : undefined;
        },
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
    });

    const allProjects = data?.pages.flatMap((page) => page.projects) ?? [];
    const totalProjects = data?.pages[0]?.totalProjects ?? 0;

    return {
        projects: allProjects,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        totalSize: totalProjects,
    };
}

export default useInfiniteProjects;
