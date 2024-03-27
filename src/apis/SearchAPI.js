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
    investigateTransaction: async function (requestBody, cancel = false) {
        const response = await api.request({
            url: `/bankdemo/api/invest/payment`,
            method: "POST",
            data: requestBody,
            headers: authHeader(),
            signal: cancel ? cancelApiObject[this.investigateTransaction.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    },
    copyTransaction: async function (requestBody, cancel = false) {
        const response = await api.request({
            url: `/bankdemo/api/copy/payment`,
            method: "POST",
            data: requestBody,
            headers: authHeader(),
            signal: cancel ? cancelApiObject[this.copyTransaction.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    },
    investigateMessage: async function (apiUrl, paging, filtersInput, cancel = false) {
        const response = await api.request({
            url: `${apiUrl}?${new URLSearchParams(paging).toString()}&${new URLSearchParams(filtersInput).toString()}`,
            method: "GET",
            headers: authHeader(),
            signal: cancel ? cancelApiObject[this.investigateMessage.name].handleRequestCancellation().signal : undefined,
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