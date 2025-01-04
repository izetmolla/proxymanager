import { CreateRequestTypes } from "@/types";
import ApiService from "./api";




export async function initSetupApp(data: { id: string }) {
    return ApiService.fetchData<CreateRequestTypes<{ id: string }>>({
        url: '/setup/init',
        method: 'post',
        data: data,
    })
}