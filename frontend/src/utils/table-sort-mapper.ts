import { SortingState } from "@tanstack/react-table";

export type PaginatedData<T> = {
    result: T[];
    rowCount: number;
  };
  
  export type PaginationParams = { pageIndex: number; pageSize: number };
  export type SortParams = { sortBy: `${string}.${"asc" | "desc"}` };
  export type Filters<T> = Partial<T & PaginationParams & SortParams>;

export const stateToSortBy = (sorting: SortingState | undefined) => {
  if (!sorting || sorting.length == 0) return undefined;

  const sort = sorting[0];

  return `${sort.id}.${sort.desc ? "desc" : "asc"}` as const;
};

export const sortByToState = (sortBy: SortParams["sortBy"] | undefined) => {
  if (!sortBy) return [];

  const [id, desc] = sortBy.split(".");
  return [{ id, desc: desc === "desc" }];
};