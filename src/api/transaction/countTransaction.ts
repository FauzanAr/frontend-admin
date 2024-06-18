import baseApi from '..';
import { config } from '../../config';
import { handleAxiosError } from '../error';

export interface CountTransaction {
    token: string
}

export const countTransaction = async (payload: CountTransaction) => {
    try {
        const headers = {
            Authorization: `Bearer ${payload.token}`
        }
        const responses = await baseApi.get(config.transaction.path + config.transaction.countTransaction, {headers: headers});

        return responses.data;
    } catch (error) {
        const responses = handleAxiosError(error, 'error while count transaction');
        return responses;
    }
}