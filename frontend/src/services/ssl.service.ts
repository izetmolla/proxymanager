import { ListRequestTypes, ListResponseTypes } from "@/types"
import { SslType } from "@/types/ssl"
import ApiService from "./api"

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