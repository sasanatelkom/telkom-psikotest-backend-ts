import { Injectable } from "@nestjs/common"
import { Observable, catchError, of } from "rxjs"
import { Response } from 'express'
import { IFormatErrorResponse, IFormatResponse, IMessageStatusCode } from "./interfaces/http-helper.interface"


@Injectable()
export class HttpHelper {
    constructor() { }

    responseHttpHandler = (http: Observable<any>) => {
        http.pipe(
            catchError(error => {
                console.error('Error occurred:', error.cause)
                return of(null)
            })
        ).subscribe(
            (response) => {
                if (response !== null) {
                    console.log(response.data)
                }
            }
        )
    }

    getMessageStatusCode = (status: number): IMessageStatusCode => {
        var isSuccess: boolean = false
        var message: string
        switch (status) {
            case 200:
                isSuccess = true
                message = 'OK'
                break
            case 201:
                isSuccess = true
                message = 'CREATED'
                break
            case 400:
                message = 'BAD_REQUEST'
                break
            default:
                message = 'NOT_DEFINED'
        }
        return { isSuccess, message }
    }

    formatResponse = (response: Response, status: number, data: any, meta?: any): Response<any, Record<string, IFormatResponse>> => {
        const { isSuccess, message } = this.getMessageStatusCode(status)
        const res: IFormatResponse = { isSuccess, message, data, meta }
        return response.status(status).send(res);
    }

    formatErrorResponse = (response: Response, message: string, statusCode: number): Response<any, Record<string, IFormatErrorResponse>> => {
        const res = { isSuccess: false, message };

        return response.status(statusCode).send(res);
    }
}