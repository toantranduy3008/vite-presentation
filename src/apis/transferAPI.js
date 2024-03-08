import { authHeader } from "../services/AuthServices";
import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const TransferAPI = {
    inquiry: async function (bankId, toAccount, toAccountType, cancel = false) {
        const response = await api.request({
            url: `/bankdemo/api/payment/investigatename?creditorAgent=${bankId}&toAccount=${toAccount}&toAccountType=${toAccountType}`,
            method: "GET",
            headers: authHeader(),
            signal: cancel ? cancelApiObject[this.inquiry.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    },
    transfer: async function (requestBody, cancel = false) {
        const response = await api.request({
            url: '/bankdemo/api/payment/fundtransfer',
            method: 'POST',
            data: requestBody,
            headers: authHeader(),
            signal: cancel ? cancelApiObject[this.transfer.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    }
}

const cancelApiObject = defineCancelApiObject(TransferAPI)