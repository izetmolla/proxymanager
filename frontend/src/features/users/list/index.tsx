import { DataTable } from "@/components/data-table";
import {
    useReactTable,
    getCoreRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";
import { useFilters } from "@/hooks/use-table-filters";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { columns } from "./components/columns";
import { sortByToState, stateToSortBy } from "@/utils/table-sort-mapper";
import { UserType } from "@/types/user";
import { getUsersList } from "@/services/user.service";
import { FC, useEffect, useState } from "react";
import { Main } from "@/components/layout/main";
import { CreateUserDrawer } from "./components/create-user-dialog";
import { Button } from "@/components/ui/button";
import { UsersListDataTableToolbar } from "./components/data-table-toolbar";
import UsersListContextProvider, { UsersListDialogType } from "./user-context";
import useDialogState from "@/hooks/use-dialog-state";





interface UsersListProps {
    // eslint-disable-next-line
    id: any; 
}

const UsersList: FC<UsersListProps> = ({ id }) => {
    const [currentRow, setCurrentRow] = useState<UserType | null>(null)
    const [open, setOpen] = useDialogState<UsersListDialogType>(null)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const { filters, pagination, setFilters } = useFilters(id);
    const sorting = sortByToState(filters.sortBy);

    const { data } = useQuery({
        queryKey: ["usersList", filters],
        queryFn: () => getUsersList(filters).then((res) => res.data),
        placeholderData: keepPreviousData,
    });
    const table = useReactTable<UserType>({
        columns,
        state: {
            pagination,
            sorting: sorting,
            columnFilters
        },
        data: data?.data ?? [],
        manualFiltering: true,
        manualSorting: true,
        manualPagination: true,        
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: (pg) => {
            setFilters(typeof pg === "function" ? pg(pagination) : pg);
        },
        onSortingChange: (st) => {
            setFilters({ sortBy: stateToSortBy(typeof st === "function" ? st(sorting) : st) });
        },
        pageCount: data?.pageCount ?? -1,
        rowCount: data?.rowCount,
    });


    useEffect(() => {
        console.log(columnFilters)
    }, [columnFilters]);



    return (
        <UsersListContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
            <Main
                title="Users List"
                description="Manage your users here"
                rightComponent={
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setOpen("create")}
                            className="btn btn-primary"
                        >
                            Create User
                        </Button>
                    </div>
                }
            >
                <UsersListDataTableToolbar table={table} />
                <DataTable table={table} />
            </Main>
            <CreateUserDrawer
                key='user-create'
                open={open === 'create'}
                onOpenChange={() => setOpen('create')}
            />
        </UsersListContextProvider>
    );
};

export default UsersList;