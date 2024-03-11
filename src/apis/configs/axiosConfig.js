import axios from "axios"
import NotificationServices from "../../services/notificationServices/NotificationServices"

export const api = axios.create({
    baseURL: '',
})

const errorHandler = (error) => {
    const statusCode = error.response?.status
    if (error.code === "ERR_CANCELED") {
        NotificationServices.error('Yêu cầu đã bị hủy bỏ.')
        return Promise.resolve()
    }

    // logging only errors that are not 401
    if (statusCode && statusCode !== 401) {
        console.error(error)
    }

    return Promise.reject(error)
}

api.interceptors.response.use(undefined, (error) => {
    return errorHandler(error)
})