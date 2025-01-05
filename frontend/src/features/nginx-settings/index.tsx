import { Main } from "@/components/layout/main";
import { NginxSettingsComponentForm } from "./components/nginx-settings-form";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getGeneralNginxConfig } from "@/services/nginxconfig.service";

const NginxSettings = () => {
    const { isLoading, error, data } = useQuery({
        queryKey: ["getGeneralNginxConfig"],
        queryFn: () => getGeneralNginxConfig().then((res) => res.data),
        placeholderData: keepPreviousData,
    });
    return (
        <Main
            loading={isLoading}
            error={error?.message ?? data?.error?.message}
            title="Nginx Settings"
            bareadcrumb={[{ name: "Home", href: "/" }, { name: "Nginx Settings" }]}
        >
            <NginxSettingsComponentForm settings={data?.data} />
        </Main>
    );
}


export default NginxSettings;