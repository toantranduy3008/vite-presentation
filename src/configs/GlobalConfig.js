export const listRowsPerPage = [
    { value: '30', label: '30' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
]

export const indicatorResponseCodes = [
    {
        code: "00",
        msg: "SUCCESS"
    },
    {
        code: "25",
        msg: "UNABLE_TO_LOCATE_ORIGINAL_TRANSACTION"
    },
    {
        code: "05",
        msg: "TRANSACTION_NOT_ALLOWED"
    },
    {
        code: "65",
        msg: "TIME_EXCEEDED"
    },
    {
        code: "96",
        msg: "OVER_TIMES_ALLOWED"
    },
    {
        code: "03",
        msg: "RECEIVER_NOT_SUPPORT"
    },
    {
        code: "92",
        msg: "OFFLINE_AGENT"
    },
    {
        code: "68",
        msg: "TIMEOUT_WITH_RECEIVER"
    },
]

export const messageIdentifiers = [
    {
        code: "inquiryrequest",
        name: "Thông điệp truy vấn thông tin khách hàng"
    },
    {
        code: "billinquiryrequest",
        name: "Thông điệp truy vấn thông tin hóa đơn"
    },
    {
        code: "ibftrequest",
        name: "Thông điệp chuyển tiền"
    },
    {
        code: "billpaymentrequest",
        name: "Thông điệp thanh toán hóa đơn"
    },
    {
        code: "returnrequest",
        name: "Thông điệp hoàn trả"
    },
    {
        code: "investigationrequest",
        name: "Thông điệp truy vấn trạng thái giao dịch chuyển tiền/thanh toán"
    },
    {
        code: "copyrequest",
        name: "Thông điệp copy thông tin giao dịch gốc"
    },
    {
        code: "disputerequest",
        name: "Thông điệp tra soát"
    },
    {
        code: "reconciliationreport",
        name: "Thông điệp báo cáo đối soát"
    },
    {
        code: "settlementreport",
        name: "Thông điệp báo cáo quyết toán"
    },
    {
        code: "generalreport",
        name: "Thông điệp báo cáo tổng hợp (dạng file gắn kèm)"
    },
    {
        code: "lookuprequest",
        name: "Thông điệp để lookup thông tin liên quan đến QR Format."
    },
]