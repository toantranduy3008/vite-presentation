import axios, { AxiosResponse } from "axios"
import { authHeader } from "./AuthServices"
type paging = {
    page: number,
    size: number,
    sort: string
}

export const getWithPaging = (apiUrl: string, paging: paging, filterInput: any): Promise<AxiosResponse<any>> => {
    return axios.get(`${apiUrl}search?${new URLSearchParams(paging).toString()}&${new URLSearchParams(filterInput).toString()}`, { headers: authHeader() })
}

export const getWithoutPaging = () => {

}