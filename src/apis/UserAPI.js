import { authHeader } from "../services/AuthServices";
import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const UserAPI = {
    getCurrentUserInfo: async function (cancel = false) {
        const response = await api.request({
            url: `/bankdemo/api/user/currentUserInfo`,
            method: "GET",
            headers: authHeader(),
            signal: cancel ? cancelApiObject[this.getCurrentUserInfo.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    }
}

const cancelApiObject = defineCancelApiObject(UserAPI)