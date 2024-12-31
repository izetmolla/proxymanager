import { Main } from "@/components/layout/main";
import { getSingleProxyHost } from "@/services/proxyhost.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { FC } from "react";
import { ComponentNavigation } from "./components/navigation";
import Locations from "./locations";
import { ProxyHostOverviewForm } from "./components/overview-form";



interface ProxyHostListProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: any;
}

const meta = {
    title: "Edit Proxy Host",
    bareadcrumb: [{ name: "Home", href: "/" }, { name: "Proxy Hosts List", href: "/proxy-manager" }, { name: "Edit Proxy Host" }]
}
const EditProxyManager: FC<ProxyHostListProps> = () => {
    const { id, nav } = useParams({ from: "/_authenticated/proxy-manager/$id/$nav/" });
    const { isLoading, error, data } = useQuery({
        queryKey: ["singleProxyHost", id],
        queryFn: () => getSingleProxyHost({ id }).then((res) => res.data),
        placeholderData: keepPreviousData,
    });
    if (!isLoading && !data?.data) return <div>Not Found</div>;
    return (
        <Main
            loading={isLoading}
            error={error?.message ?? data?.error?.message}
            title={meta.title}
            bareadcrumb={meta.bareadcrumb}
        >
            <ComponentNavigation />
            {data?.data && (
                <>
                    {nav == "overview" && <ProxyHostOverviewForm proxyHost={data?.data} />}
                    {nav == "locations" && <Locations />}
                </>
            )}
        </Main>

    );
};

export default EditProxyManager;