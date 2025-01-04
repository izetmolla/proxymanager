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
import { ProxyHostType } from "@/types/proxyhost";
import { deleteProxyHost, disableProxyHost, getProxyHostList } from "@/services/proxyhost.service";
import { FC, useEffect, useState } from "react";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import { ProxyManagersListDataTableToolbar } from "./components/data-table-toolbar";
import ProxyManagersListContextProvider, { ProxyManagersListDialogType } from "./proxymanager-context";
import useDialogState from "@/hooks/use-dialog-state";
import { CreateProxyHost } from "./components/create-proxyhost-dialog";
import { IconPlus } from "@tabler/icons-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/hooks/use-toast";





interface ProxyHostListProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: any;
}
const meta = {
    title: "Proxy Hosts List",
    bareadcrumb: [{ name: "Home", href: "/" }, { name: "Proxy Hosts List" }]
}

const ProxyManagersList: FC<ProxyHostListProps> = ({ id }) => {
    const { toast } = useToast()
    const [currentRow, setCurrentRow] = useState<ProxyHostType | null>(null)
    const [open, setOpen] = useDialogState<ProxyManagersListDialogType>(null)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const { filters, pagination, setFilters } = useFilters(id);
    const sorting = sortByToState(filters.sortBy);

    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ["proxyHostList", filters],
        queryFn: () => getProxyHostList(filters).then((res) => res.data),
        placeholderData: keepPreviousData,
    });


    const handleChangeStatus = (id: string, status: string) => {
        disableProxyHost({ id, status }).then((res) => res.data).then(() => {
            toast({
                title: 'Success',
                description: status == "disable" ? 'Proxy host disabled' : 'Proxy host enabled',
            })
            refetch()
        }).catch((e) => {
            toast({
                title: 'Error',
                description: e.message,
                variant: "destructive",
            })
        })
    }

    const table = useReactTable<ProxyHostType>({
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
        meta: {
            handleChangeStatus
        }
    });


    useEffect(() => {
        console.log(columnFilters)
    }, [columnFilters]);



    return (
        <ProxyManagersListContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
            <Main
                loading={isLoading}
                error={error?.message ?? data?.error?.message}
                title={meta.title}
                bareadcrumb={meta.bareadcrumb}
                rightComponent={
                    <Button className='space-x-1' onClick={() => setOpen('create')}>
                        <span>Add Proxy</span> <IconPlus size={18} />
                    </Button>
                }
            >
                <ProxyManagersListDataTableToolbar table={table} />
                <DataTable table={table} />
            </Main>
            <CreateProxyHost
                key='proxymanager-create'
                open={open === 'create'}
                onOpenChange={() => setOpen('create')}
            />
            {currentRow && (
                <>
                    <ConfirmDialog
                        key='proxymanager-delete'
                        destructive
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        handleConfirm={() => {
                            deleteProxyHost({ id: currentRow.id }).then(res => res.data).then(({ error }) => {
                                if (error) {
                                    toast({
                                        variant: 'destructive',
                                        title: `Internal Server Error: ! ${error?.message}`,
                                    })
                                } else {
                                    toast({
                                        variant: "default",
                                        title: "Deleted Successfully",
                                        description: "The proxy host has been deleted successfully.",
                                    })
                                    setCurrentRow(null)
                                    setOpen(null)
                                    refetch()
                                }
                            }).catch((e) => {
                                toast({
                                    variant: 'destructive',
                                    title: `Internal Server Error: ! ${e?.message}`,
                                })
                            })
                        }}
                        className='max-w-md'
                        title={`Delete this Proxy Host: ${currentRow.domains.length > 0 ? currentRow.domains[0] : currentRow.id} ?`}
                        desc={
                            <>
                                You are about to delete a Proxy Host with the ID {' '}
                                <strong>{currentRow.id}</strong>. <br />
                                This action cannot be undone.
                            </>
                        }
                        confirmText='Delete'
                    />

                </>
            )}
        </ProxyManagersListContextProvider>
    );
};

export default ProxyManagersList;