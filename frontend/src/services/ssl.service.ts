import { CreateRequestTypes, ListRequestTypes, ListResponseTypes } from "@/types"
import { SslType } from "@/types/ssl"
import ApiService from "./api"
import { CreateSslKeyForm } from "@/features/sslmanager/list/components/create-ssl-key"

interface GetSslListTypes extends SslType {
    roles?: string[]
}
export async function getSslList(params: ListRequestTypes) {
    return ApiService.fetchData<ListResponseTypes<GetSslListTypes>>({
        url: '/ssl/getdata',
        method: 'get',
        params,
    })
}

export async function createSslKey(data: CreateSslKeyForm) {
    return ApiService.fetchData<CreateRequestTypes<{ id: string }>>({
        url: '/ssl/create',
        method: 'post',
        data: {
            ...data,
            domains: data.domains.map(x => x.value)
        },
    })
}


export async function deleteSslKey(id: string) {
    return ApiService.fetchData<CreateRequestTypes<{ id: string }>>({
        url: '/ssl/delete',
        method: 'delete',
        params: { id },
    })
}


export async function downloadSslKey(id: string) {
    return ApiService.fetchData<CreateRequestTypes<{ id: string }>>({
        url: '/ssl/download',
        method: 'get',
        params: { id },
    })
}



export async function getSslKeysSearch(name: string) {
    return ApiService.fetchData<ListResponseTypes<{ data: { label: string, value: string | number; }[] }>>({
        url: '/ssl/search',
        method: 'get',
        params: { name },
    })
}