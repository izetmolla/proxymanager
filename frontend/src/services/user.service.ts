import { ListRequestTypes, ListResponseTypes } from "@/types"
import ApiService from "./api"
import { UserType } from "@/types/user"



interface GetUsersListTypes extends UserType {
    roles?: string[]
}
export async function getUsersList(params: ListRequestTypes) {
    return ApiService.fetchData<ListResponseTypes<GetUsersListTypes>>({
        url: '/users/getdata',
        method: 'get',
        params,
    })
}