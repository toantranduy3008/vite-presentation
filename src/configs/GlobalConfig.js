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
        label: "Truy vấn thông tin khách hàng"
    },
    {
        value: "billinquiry",
        label: "Truy vấn thông tin hóa đơn"
    },
    {
        value: "ibft",
        label: "Chuyển tiền"
    },
    {
        value: "billpayment",
        label: "Thanh toán hóa đơn"
    },
    {
        value: "return",
        label: "Hoàn trả"
    },
    {
        value: "investigation",
        label: "Truy vấn trạng thái giao dịch chuyển tiền/thanh toán"
    },
    {
        value: "copy",
        label: "Copy thông tin giao dịch gốc"
    },
    {
        value: "dispute",
        label: "Tra soát"
    },
    {
        value: "reconciliationreport",
        label: "Báo cáo đối soát"
    },
    {
        value: "settlementreport",
        label: "Báo cáo quyết toán"
    },
    {
        value: "generalreport",
        label: "Báo cáo tổng hợp (dạng file gắn kèm)"
    },
    {
        value: "lookup",
        label: "QR Format."
    },
]