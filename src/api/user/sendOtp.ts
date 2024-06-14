import baseApi from "..";
import { config } from "../../config";
import { SendOtp } from "../../pages/register";
import { handleAxiosError } from "../error";

export const userSendOTP = async (data: SendOtp) => {
    try {
        const responses = await baseApi.post(config.user.path + config.user.sendOtp, data);

        return responses.data;
    } catch (error) {
        const response = handleAxiosError(error, 'error while send otp');
        return response;
    }
}