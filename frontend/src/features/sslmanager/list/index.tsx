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
import { SslType } from "@/types/ssl";
import { FC, useEffect, useState } from "react";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import { SslManagerListDataTableToolbar } from "./components/data-table-toolbar";
import SslManagerListContextProvider, { SslManagerListDialogType } from "./sslmanager-context";
import useDialogState from "@/hooks/use-dialog-state";
import { IconPlus } from "@tabler/icons-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { getSslList } from "@/services/ssl.service";
import { CreateSslKey } from "./components/create-ssl-key";





interface SslListProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: any;
}
const meta = {
    title: "SSL Keys List",
    bareadcrumb: [{ name: "Home", href: "/" }, { name: "SSL keys List" }]
}

const SslManagerList: FC<SslListProps> = ({ id }) => {
    const [currentRow, setCurrentRow] = useState<SslType | null>(null)
    const [open, setOpen] = useDialogState<SslManagerListDialogType>(null)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const { filters, pagination, setFilters } = useFilters(id);
    const sorting = sortByToState(filters.sortBy);

    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ["sslList", filters],
        queryFn: () => getSslList(filters).then((res) => res.data),
        placeholderData: keepPreviousData,
    });
    const table = useReactTable<SslType>({
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
        <SslManagerListContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
            <Main
                loading={isLoading}
                error={error?.message ?? data?.error?.message}
                title={meta.title}
                bareadcrumb={meta.bareadcrumb}
                rightComponent={
                    <Button className='space-x-1' onClick={() => setOpen('create')}>
                        <IconPlus size={18} /> <span>Create SSL</span>
                    </Button>
                }
            >
                <SslManagerListDataTableToolbar table={table} />
                <DataTable table={table} />
            </Main>
            <CreateSslKey
                key='sslmanager-create'
                open={open === 'create'}
                onOpenChange={() => setOpen('create')}
                onCreated={() => refetch()}
            />
            {currentRow && (
                <>
                    <ConfirmDialog
                        key='sslmanager-delete'
                        destructive
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        handleConfirm={() => {
                            alert("DEleting")
                        }}
                        className='max-w-md'
                        title={`Delete this SSL ${currentRow.name}?`}
                        desc={
                            <>
                                You are about to delete a SSL with the ID {' '}
                                <strong>{currentRow.id}</strong>. <br />
                                This action cannot be undone.
                            </>
                        }
                        confirmText='Delete'
                    />

                </>
            )}
        </SslManagerListContextProvider>
    );
};

export default SslManagerList;