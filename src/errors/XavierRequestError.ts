import XavierError from './XavierError';


const FAILED_TO_FETCH = 'Failed to fetch';


function normalizeErrorData(data) {
    if (!data.error && data.message && data.message.indexOf(FAILED_TO_FETCH) !== -1) {
        return {
            error: -1,
            message: 'failed to fetch'
        };
    } else {
        return data;
    }
}


export default class XavierRequestError extends XavierError {

    constructor(url, data) {
        super(`Server request to '${url}' has failed`, normalizeErrorData(data));
        this.name = 'XavierRequestError';
    }

}
