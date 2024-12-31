import { CreateRequestTypes, ListRequestTypes, ListResponseTypes } from "@/types"
import ApiService from "./api"
import { ProxyHostType } from "@/types/proxyhost"
import { CreateProxyHostForm } from "@/features/proxymanager/list/components/create-proxyhost-dialog"
import { OverviewForm } from "@/features/proxymanager/edit/components/overview-form"



interface GetProxyManagersListTypes extends ProxyHostType {
    roles?: string[]
}
export async function getProxyHostList(params: ListRequestTypes) {
    return ApiService.fetchData<ListResponseTypes<GetProxyManagersListTypes>>({
        url: '/proxyhosts/getdata',
        method: 'get',
        params,
    })
}


export async function getSingleProxyHost(params: { id: string }) {
    return ApiService.fetchData<CreateRequestTypes<ProxyHostType>>({
        url: '/proxyhosts/getitem',
        method: 'get',
        params,
    })
}

export async function createProxyHost(data: CreateProxyHostForm) {
    return ApiService.fetchData<CreateRequestTypes<{ id: string }>>({
        url: '/proxyhosts/create',
        method: 'post',
        data: {
            domains: data.domains.map((d) => d.value),
            enableSSL: data.enableSSL,
            locations: [{
                path: '/',
                proxy_pass: `${data.protocol}://${data.host}`,
                properties: []
            }]
        },
    })
}

export async function saveProxyHostOverview(data: OverviewForm) {
    return ApiService.fetchData<CreateRequestTypes<{ id: string }>>({
        url: '/proxyhosts/overview/save',
        method: 'post',
        data: {
            id: data.id,
            domains: data.domains.map((d) => d.value),
            locations: [{
                path: '/',
                proxy_pass: `${data.protocol}://${data.host}`,
                properties: []
            }]
        },
    })
}

export async function deleteProxyHost(params: { id: string }) {
    return ApiService.fetchData<CreateRequestTypes<null>>({
        url: '/proxyhosts/delete',
        method: 'delete',
        params,
    })
}