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

