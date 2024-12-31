import { Main } from "@/components/layout/main";
import { getDashboardData } from "@/services/dashboard.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";


const Dashboard = () => {
    const { isLoading, error, data, refetch, isFetching, isRefetching } = useQuery({
        queryKey: ["dashboard"],
        queryFn: () => getDashboardData().then((res) => res.data),
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isFetching || !isRefetching) {
                refetch();
            }

        }, 3000);

        return () => clearInterval(interval);
    }, [refetch, isFetching, isRefetching]);

    return (
        <Main
            loading={isLoading}
            error={error?.message ?? data?.error?.message}
            title="Dashboard"
        >
            <h1>{data?.data?.stat}</h1>

        </Main>
    );
}

export default Dashboard;