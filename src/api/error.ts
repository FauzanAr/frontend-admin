import { AxiosError } from "axios"

export const handleAxiosError = (err: any, defaultMsg: string) => {
    try {
        const error = err as AxiosError;
        if (error.response?.data) {
            return error.response?.data
        }
    
        return defaultMsg
    } catch (error) {
        console.log('error: ', error)
        return defaultMsg
    }
}