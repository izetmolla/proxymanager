import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import siteConfig from '@/configs/app.config';
import {
    PERSIST_STORE_NAME,
    REQUEST_HEADER_AUTH_KEY,
    TOKEN_TYPE,
} from '@/configs/api.constant';
import deepParseJson from '@/utils/deepParseJson';
import store from '../store';
import { jwtDecode } from 'jwt-decode';
import { setAccessToken, signOutSuccess } from '@/store/slices/authSlice';

const unauthorizedCode = [401];
const serverErrorCode = [500];

const BaseService = axios.create({
    timeout: 60000,
    baseURL: siteConfig.apiPrefix,
});

BaseService.interceptors.request.use(
    async (config) => {
        const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME);
        const persistData = deepParseJson(rawPersistData);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let accessToken = (persistData as any)?.auth?.tokens?.access_token;
        if (!accessToken) {
            accessToken = store.getState()?.auth?.tokens?.access_token;
        }

        if (accessToken) {
            const decoded = jwtDecode(accessToken);
            if (Number(decoded.exp) * 1000 < Date.now()) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const pd = persistData as any;
                const refreshToken = pd?.auth?.session?.tokens?.refresh_token || '';
                const { data } = await axios.post(
                    siteConfig.apiPrefix + '/refresh_token',
                    {},
                    {
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    }
                );
                if (data?.accessToken) {
                    config.headers[REQUEST_HEADER_AUTH_KEY] =
                        `${TOKEN_TYPE}${data.accessToken}`;
                    store.dispatch(setAccessToken(data.accessToken));
                }
                return config;
            } else {
                config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`;
                return config;
            }
        } else {
            return config;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

BaseService.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response && unauthorizedCode.includes(response.status)) {
            console.log('Unauthorized', response);
            //   toast.error("Unauthorized", {
            //     position: toast.POSITION.BOTTOM_RIGHT,
            //   });
            store.dispatch(signOutSuccess());
        }
        if (response && serverErrorCode.includes(response.status)) {
            console.log('Server error with code 500!', response);
            //   toast.error("Server error with code 500!", {
            //     position: toast.POSITION.BOTTOM_RIGHT,
            //   });
        }

        return Promise.reject(error);
    }
);

const ApiService = {
    fetchData<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>
    ) {
        return new Promise<AxiosResponse<Response>>((resolve, reject) => {
            BaseService(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response);
                })
                .catch((errors: AxiosError) => {
                    reject(errors);
                });
        });
    },
};

export default ApiService;