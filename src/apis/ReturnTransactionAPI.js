import { authHeader } from "../services/AuthServices";
import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const ReturnTransactionAPI = {
    returnTransaction: async function (requestBody, cancel = false) {
        const response = await api.request({
            url: `/bankdemo/api/payment/returnIbft`,
            method: "POST",
            data: requestBody,
            headers: authHeader(),
            signal: cancel ? cancelApiObject[this.returnTransaction.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    }
}

const cancelApiObject = defineCancelApiObject(ReturnTransactionAPI)