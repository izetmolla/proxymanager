



import { CreateRequestTypes, ItemResponseType } from "@/types";
import ApiService from "./api";
import { NginxSettingsForm } from "@/features/nginx-settings/components/nginx-settings-form";

export async function getNginxConfigData(type: string = "editor") {
    return ApiService.fetchData<ItemResponseType<{ file: string }>>({
        url: '/nginxconfig/getdata',
        method: 'get',
        params: {
            type
        }
    })
}

export async function saveNginxConfigFile(data: { file: string }) {
    return ApiService.fetchData<CreateRequestTypes<{ id: string }>>({
        url: '/nginxconfig/save',
        method: 'post',
        data: {
            file: data.file
        },
    })
}


export async function restartNginx() {
    return ApiService.fetchData<ItemResponseType<{ message: string }>>({
        url: '/nginxconfig/restart',
        method: 'get',
    })
}


export interface GetGeneralNginxConfigTypes {
    enableNginxIpv6: boolean
    enableNginxStreams: boolean
    nginxIpv4Address: string
    nginxIpv6Address: string
    nginxHTTPPort: string
    nginxHTTPSPort: string
    ips: {
        ipv4: { value: string, label: string }[]
        ipv6: { value: string, label: string }[]
    }
}

export async function getGeneralNginxConfig() {
    return ApiService.fetchData<ItemResponseType<GetGeneralNginxConfigTypes>>({
        url: '/nginxconfig/general',
        method: 'get',
    })
}

export async function saveGeneralNginxConfig(data: NginxSettingsForm) {
    return ApiService.fetchData<CreateRequestTypes<GetGeneralNginxConfigTypes>>({
        url: '/nginxconfig/savegeneral',
        method: 'post',
        data: data
    })
}