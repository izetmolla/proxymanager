import { Main } from "@/components/layout/main";
import { getSingleProxyHost } from "@/services/proxyhost.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { FC } from "react";

interface EditSslKeyProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: any;
}

const meta = {
    title: "Edit SSL Key",
    bareadcrumb: [{ name: "Home", href: "/" }, { name: "SSL keys List List", href: "/ssl-manager" }, { name: "Edit SSL Key" }]
}
const EditSslKey: FC<EditSslKeyProps> = () => {
    const { id } = useParams({ from: "/_authenticated/ssl-manager/$id/" });
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
            edit {id}
        </Main>

    );
};

export default EditSslKey;