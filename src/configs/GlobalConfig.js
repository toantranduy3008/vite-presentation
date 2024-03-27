export const listRowsPerPage = [
    { value: '30', label: '30' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
]

export const indicatorResponseCodes = [
    {
        value: "00",
        msg: "SUCCESS"
    },
    {
        value: "25",
        msg: "UNABLE_TO_LOCATE_ORIGINAL_TRANSACTION"
    },
    {
        value: "05",
        msg: "TRANSACTION_NOT_ALLOWED"
    },
    {
        value: "65",
        msg: "TIME_EXCEEDED"
    },
    {
        value: "96",
        msg: "OVER_TIMES_ALLOWED"
    },
    {
        value: "03",
        msg: "RECEIVER_NOT_SUPPORT"
    },
    {
        value: "92",
        msg: "OFFLINE_AGENT"
    },
    {
        value: "68",
        msg: "TIMEOUT_WITH_RECEIVER"
    },
]

export const listMessageIdentifier = [
    {
        value: "",
        label: "Tất cả"
    },
    {
        value: "inquiry",
        label: "Thông điệp truy vấn thông tin khách hàng"
    },
    {
        value: "billinquiry",
        label: "Thông điệp truy vấn thông tin hóa đơn"
    },
    {
        value: "ibft",
        label: "Thông điệp chuyển tiền"
    },
    {
        value: "billpayment",
        label: "Thông điệp thanh toán hóa đơn"
    },
    {
        value: "return",
        label: "Thông điệp hoàn trả"
    },
    {
        value: "investigation",
        label: "Thông điệp truy vấn trạng thái giao dịch chuyển tiền/thanh toán"
    },
    {
        value: "copy",
        label: "Thông điệp copy thông tin giao dịch gốc"
    },
    {
        value: "dispute",
        label: "Thông điệp tra soát"
    },
    {
        value: "reconciliationreport",
        label: "Thông điệp báo cáo đối soát"
    },
    {
        value: "settlementreport",
        label: "Thông điệp báo cáo quyết toán"
    },
    {
        value: "generalreport",
        label: "Thông điệp báo cáo tổng hợp (dạng file gắn kèm)"
    },
    {
        value: "lookup",
        label: "Thông điệp để lookup thông tin liên quan đến QR Format."
    },
]