export interface ResponseError {
    message: string;
    path?: string;
}
export interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    img: string;
    firstName: string;
    lastName: string;
}

export interface Tokens {
    access_token: string;
    refresh_token: string;
}



export interface ListRequestTypes {
    pageIndex: number;
    pageSize: number;
    keyword?: string;
}

export interface ListResponseTypes<T> {
    error: ResponseError;
    data: T[];
    pageCount: number,
    rowCount: number
}

export interface ItemResponseType<T> {
    error: ResponseError;
    data: T;
}

export interface CreateRequestTypes<T> {
    error: ResponseError;
    data: T;
}


