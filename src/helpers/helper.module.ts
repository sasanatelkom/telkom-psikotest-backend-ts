import { Module } from '@nestjs/common';
import { HttpHelper } from './http.helper';
import { Validation } from './validation.helper';


@Module({
    imports: [],
    providers: [
        HttpHelper,
        Validation
    ],
    exports: [
        HttpHelper,
        Validation
    ],
})

export class HelperModule { }