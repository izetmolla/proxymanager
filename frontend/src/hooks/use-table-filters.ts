import {
    getRouteApi,
    RegisteredRouter,
    RouteIds,
    SearchParamOptions,
} from "@tanstack/react-router";
import { cleanEmptyParams } from "@/utils/clean-empty-params";

export function useFilters<
    TId extends RouteIds<RegisteredRouter["routeTree"]>,
    TSearchParams extends SearchParamOptions<
        RegisteredRouter,
        TId,
        TId
    >["search"],
>(routeId: TId) {
    const routeApi = getRouteApi<TId>(routeId);
    const navigate = routeApi.useNavigate();
    const filters = routeApi.useSearch();

    const setFilters = (partialFilters: Partial<TSearchParams>) =>
        navigate({
            search: cleanEmptyParams({
                ...filters,
                ...partialFilters,
            }) as TSearchParams,
        });

    const resetFilters = () => navigate({ search: {} as TSearchParams });
    const pagination = {
        pageIndex: (filters as { pageIndex?: number })?.pageIndex ?? 0,
        pageSize: (filters as { pageSize?: number })?.pageSize ?? 10,
    };

    return { filters, pagination, setFilters, resetFilters };
}