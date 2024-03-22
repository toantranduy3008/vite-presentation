import { authHeader } from "../services/AuthServices";
import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const SearchAPI = {
    incoming: async function (apiUrl, paging, filtersInput, cancel = false) {
        const response = await api.request({
            url: `${apiUrl}?${new URLSearchParams(paging).toString()}&${new URLSearchParams(filtersInput).toString()}`,
            method: "GET",
            headers: authHeader(),
            signal: cancel ? cancelApiObject[this.incoming.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    },
    outgoing: async function (apiUrl, paging, filtersInput, cancel = false) {
        const response = await api.request({
            url: `${apiUrl}?${new URLSearchParams(paging).toString()}&${new URLSearchParams(filtersInput).toString()}`,
            method: "GET",
            headers: authHeader(),
            signal: cancel ? cancelApiObject[this.outgoing.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    },
    investigate: async function (requestBody, cancel = false) {
        const response = await api.request({
            url: `bankdemo/api/invest/payment`,
            method: "POST",
            data: requestBody,
            headers: authHeader(),
            signal: cancel ? cancelApiObject[this.investigate.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    },
    returnHistory: async function (seqNo, cancel = false) {
        const response = await api.request({
            url: `/bankdemo/api/payment/${seqNo}/returnRequests`,
            method: "GET",
            headers: authHeader(),
            signal: cancel ? cancelApiObject[this.returnHistory.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    },
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

const cancelApiObject = defineCancelApiObject(SearchAPI)