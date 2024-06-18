import baseApi from "..";
import { config } from "../../config";
import { handleAxiosError } from "../error";

export interface GetUser {
    token: string
}

export interface GetUserByAccount {
    token: string
    accountNo: string
}

export const getUser = async (payload: GetUser) => {
    try {
        const headers = {
            Authorization: `Bearer ${payload.token}`
        }
        const responses = await baseApi.get(config.user.path + config.user.getUser, {headers:headers});

        return responses.data;
    } catch (error) {
        const response = handleAxiosError(error, 'error while login');
        return response;
    }
}

export const getUserByAccount = async (payload: GetUserByAccount) => {
    try {
        const headers = {
            Authorization: `Bearer ${payload.token}`
        }
        const responses = await baseApi.get(config.user.path + config.user.getUserByAccount + `?accountNo=${payload.accountNo}`, {headers:headers});

        return responses.data;
    } catch (error) {
        const response = handleAxiosError(error, 'error while login');
        return response;
    }
}