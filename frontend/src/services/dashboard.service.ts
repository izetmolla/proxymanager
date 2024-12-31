import { ItemResponseType } from "@/types";
import ApiService from "./api";

export async function getDashboardData() {
    return ApiService.fetchData<ItemResponseType<{ stat: string }>>({
        url: '/dashboard/getdata',
        method: 'get'
    })
}