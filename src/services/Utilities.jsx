import { Badge } from "@mantine/core";
import { authHeader } from "./AuthServices";
import NotificationServices from "./notificationServices/NotificationServices";
import axios from "axios";
export const getTheme = () => {
    return localStorage.theme ? localStorage.theme : 'auto'
}

export const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export const formatVietnamese = (string) => {
    return removeVietnameseTones(string).replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
}

const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    // str = str.replace(/ + /g, " ");
    // str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, "");
    return str;
}

export const setBadge = (status, displayLabel = true) => {
    return (
        <Badge
            size="md"
            color={status === '00' ? 'green' : status === '68' ? 'yellow' : 'red'}
            className="text-[10px]"
        >
            {status} {displayLabel && (status === '00' ? '-Thành công' : status === '68' ? '-Đang xử lý' : '-Thất bại')}
        </Badge>
    )
}

export const validateInValidAmount = amount => {
    // số tiền phải lớn hơn 2000 & nhỏ hơn 500M
    return (amount <= 2000 || amount >= 500000000)
}

export const validateInvalidAccount = acc => {
    return (acc && typeof (acc) !== 'undefined' && acc.trim().length > 0)
}

export const generateUID = () => {
    let id = "id" + Math.random().toString(16).slice(2);
    return id;
}

export const fetchBankList = async () => {
    let acquirer = localStorage.getItem('acquirer')
    let issuer = localStorage.getItem('issuer')
    if (
        acquirer &&
        typeof (acquirer) === 'string' &&
        Array.isArray(JSON.parse(acquirer)) &&
        JSON.parse(acquirer).length > 0 &&
        issuer &&
        typeof (issuer) === 'string' &&
        Array.isArray(JSON.parse(issuer)) &&
        JSON.parse(issuer).length > 0
    ) {
        return [JSON.parse(acquirer), JSON.parse(issuer)]
    } else {
        const [fetchFromBankList, fetchToBankList] = await Promise.allSettled([
            axios.get('/1st/bankdemo/api/payment/getListFromBank', { headers: authHeader() }),
            axios.get('/1st/bankdemo/api/payment/getListBank', { headers: authHeader() }),
        ])

        if (fetchFromBankList.status === 'rejected') {
            NotificationServices.error('Không lấy được danh sách ngân hàng phát lệnh');
            return;
        }

        if (fetchToBankList.status === 'rejected') {
            NotificationServices.error('Không lấy được danh sách ngân hàng nhận lệnh');
            return;
        }

        acquirer = fetchFromBankList.value.data.listBank.map(item => {
            return {
                value: item.id,
                label: item.name
            }
        })

        issuer = fetchToBankList.value.data.listBank.map(item => {
            return {
                value: item.id,
                label: item.name
            }
        })

        localStorage.setItem('acquirer', JSON.stringify(acquirer))
        localStorage.setItem('issuer', JSON.stringify(issuer))

        return [acquirer, issuer]
    }

}