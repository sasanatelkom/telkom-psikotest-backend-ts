import { IMessageStatusCode } from "./interfaces/http-helper.interface";


export const getMessageStatusCode = (status: number): IMessageStatusCode => {
    var isSuccess: boolean = false;
    var message: string;
    switch (status) {
        case 200:
            isSuccess = true;
            message = 'OK';
            break;
        case 201:
            isSuccess = true
            message = 'CREATED';
            break;
        case 400:
            message = 'BAD_REQUEST';
            break;
        default:
            message = 'NOT_DEFINED';
    }

    return { isSuccess, message }
}

export const formatErrorResponse = (message: string) => {
    return { isSuccess: false, message };
}