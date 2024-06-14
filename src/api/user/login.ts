import baseApi from "..";
import { config } from "../../config";
import { FormData } from "../../pages/login";
import { handleAxiosError } from "../error";

export const userLogin = async (data: FormData) => {
    try {
        const responses = await baseApi.post(config.user.path + config.user.login, data);

        return responses.data;
    } catch (error) {
        const response = handleAxiosError(error, 'error while login');
        return response;
    }
}