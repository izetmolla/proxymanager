
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SetupStepsForm } from "./components/steps-form";
import { getSetupData } from "@/services/setup.service";
import { LoadingPage } from "@/components/loading-page";

const SetUpApp = () => {
    const { isLoading, error, data } = useQuery({
        queryKey: ["getSetupData"],
        queryFn: () => getSetupData().then((res) => res.data),
        placeholderData: keepPreviousData,
    });
    return (
        <LoadingPage
            loading={isLoading}
            error={error?.message ?? data?.error?.message}
            meta={{
                title: "Setup Your Nginx Proxy Manager",
            }}
        >
            <SetupStepsForm data={data}/>
        </LoadingPage>
    );
}

export default SetUpApp;