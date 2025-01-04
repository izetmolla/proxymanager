import { CreateRequestTypes } from "@/types";
import ApiService from "./api";
import { StepsFormData } from "@/features/setup/components/steps-form";




export async function initSetupApp(data: { id: string }) {
    return ApiService.fetchData<CreateRequestTypes<{ id: string }>>({
        url: '/setup/init',
        method: 'post',
        data: data,
    })
}


export interface GetSetupDataResponse {
    ips: { value: string, label: string }[]
    server: {
        step: number
        address: string
        port: number
        baseUrl: string
        access_token_secret: string
        refresh_token_secret: string
        access_token_exp: string
        refresh_token_exp: string
        tokens_issuer: string
        enable_social_auth: boolean
        google_key: string
        google_secret: string
        google_callback: string
        github_key: string
        github_secret: string
        github_callback: string
    }
}

export async function getSetupData() {
    return ApiService.fetchData<CreateRequestTypes<GetSetupDataResponse>>({
        url: '/setup/getdata',
        method: 'get',
    })
}

export async function saveSetupData(data: StepsFormData) {
    return ApiService.fetchData<CreateRequestTypes<GetSetupDataResponse>>({
        url: '/setup/save',
        method: 'post',
        data: data,
    })
}