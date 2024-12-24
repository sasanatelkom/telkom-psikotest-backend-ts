import * as _ from 'lodash';
import * as path from 'path';


export const isEmpty = (value: any) => {
    return _.isEmpty(value);
}

export const videoFileFilter = (req, file, callback) => {
    var allowedExtension = ['.mp4'];
    let ext = path.extname(file.originalname);
    let validExt = false;

    for (let x in allowedExtension) {
        if (ext === allowedExtension[x]) validExt = true;
    }

    if (validExt) {
        return callback(null, true);
    } else {
        req.fileValidationError = 'Invalid file type';
        return callback(new Error('Invalid file type'), false);
    }
}