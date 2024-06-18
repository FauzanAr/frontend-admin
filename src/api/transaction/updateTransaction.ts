import baseApi from "..";
import { config } from "../../config";
import { handleAxiosError } from "../error"

export interface UpdateTransaction {
    token: string
    status: string
    id: number
}

export const updateTransactions = async (payload: UpdateTransaction) => {
    try {
        const header = {
            Authorization: `Bearer ${payload.token}`
        }
        const responses = await baseApi.put(config.transaction.path + config.transaction.updateTransaction + `/${payload.id}`,
            {status: payload.status},
            {headers: header},
        )

        return responses.data;
    } catch (error) {
        const responses = handleAxiosError(error, 'error while fetch transaction');
        return responses;
    }
}