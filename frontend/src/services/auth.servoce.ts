import { Tokens, User } from "@/types";
import ApiService from "./api"
import { SignInFormValues } from "@/features/auth/sign-in/components/user-auth-form";




export interface SignInCredentialResponse {
    user: User;
    tokens?: Tokens;
    error?: {
        message: string;
        path?: string;
    };
}

export async function apiSignIn(data: SignInFormValues) {
    return ApiService.fetchData<SignInCredentialResponse>({
        url: '/sign-in',
        method: 'post',
        data,
    })
}