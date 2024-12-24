import { BadRequestException, Injectable } from "@nestjs/common";
import * as moment from 'moment';
import * as _ from 'lodash';
import { Response } from 'express'
import { HttpHelper } from "./http.helper";

@Injectable()
export class Validation {
    constructor(
        private readonly httpHelper: HttpHelper,
    ) { }


    isEmpty(value: any) {
        return _.isEmpty(value);
    }

    isDateGreatherThanNow(inDate: Date): boolean {
        // get current date property
        const currDate = new Date();
        const currYear = currDate.getFullYear();
        const currMonth = currDate.getMonth();

        // get in date property
        const inYear = inDate.getFullYear();
        const inMonth = inDate.getMonth();

        return inYear > currYear || (inYear === currYear && inMonth >= currMonth);
    }

    checkDateRange(startDate: Date, endDate: Date, range: number): boolean {
        // count days between two dates
        const start = moment(startDate);
        const end = moment(endDate);
        const countDays = end.diff(start, 'days');
        if (countDays > range) throw new BadRequestException(`Filter tanggal tidak boleh melebihi ${range} hari`);

        return true;
    }
    errorHandler(response: Response, error: any) {
        console.log(error);
        // check if the error has the structure of RpcCustomException
        if (error && typeof error === 'object' && 'statusCode' in error && 'message' in error) {
            const { statusCode, message } = error;

            return this.httpHelper.formatErrorResponse(response, message, statusCode);
        }

        // check if the error has the structure of RpcException
        if (error && typeof error.error === 'object' && 'statusCode' in error.error && 'message' in error.error) {
            const { statusCode, message } = error.error;
            return this.httpHelper.formatErrorResponse(response, message, statusCode);
        }

        // default error handling
        return this.httpHelper.formatErrorResponse(response, 'Internal server error', 500);
    }
}