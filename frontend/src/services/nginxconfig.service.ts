



import { CreateRequestTypes, ItemResponseType } from "@/types";
import ApiService from "./api";

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