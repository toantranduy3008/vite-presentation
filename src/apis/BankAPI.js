import { authHeader } from "../services/AuthServices";
import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const BankAPI = {
    getAll: async function (cancel = false) {
        const response = await api.request({
            url: `/bankdemo/api/bank`,
            method: "GET",
            headers: authHeader(),
            signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    }
}

const cancelApiObject = defineCancelApiObject(BankAPI)