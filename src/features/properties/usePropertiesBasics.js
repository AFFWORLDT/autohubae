import { useQuery } from '@tanstack/react-query';
import { getPropertiesBasics } from '../../services/apiProperties';
import { useSearchParams } from 'react-router-dom';

export const usePropertiesBasics = (fetchAll = false) => {
    const [searchParams] = useSearchParams();

    const filters = {

    };
    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {
            filters[key] = Number(val) || 1;
            continue;
        }
        if (val) filters[key] = val;
    }

    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['propertiesBasics', filters, fetchAll],
        queryFn: () => getPropertiesBasics(filters, fetchAll),
    });

    return {
        properties: data?.properties || [],
        totalProperties: data?.totalProperties || 0,
        loading: isLoading,
        error: error?.message,
        refetch
    };
};
