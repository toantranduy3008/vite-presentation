import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const SignInAPI = {
    signIn: async function (requestBody, cancel = false) {
        const response = await api.request({
            url: `/bankdemo/api/auth/signin`,
            method: "POST",
            data: requestBody,
            signal: cancel ? cancelApiObject[this.signIn.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    }
}

const cancelApiObject = defineCancelApiObject(SignInAPI)