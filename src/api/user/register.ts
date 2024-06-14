import baseApi from "..";
import { config } from "../../config";
import { FormData } from "../../pages/register";
import { handleAxiosError } from "../error";

export const userSendRegister = async (data: FormData) => {
    try {
        const responses = await baseApi.post(config.user.path + config.user.register, data);

        return responses.data;
    } catch (error) {
        const response = handleAxiosError(error, 'error while send register');
        return response;
    }
}