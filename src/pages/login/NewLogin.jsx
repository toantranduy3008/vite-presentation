import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { LoadingOverlay } from "@mantine/core"
import axios from "axios"
import NotificationServices from "../../services/notificationServices/NotificationServices"
const NewLogin = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const userRef = useRef(null)
    const passRef = useRef(null)
    const handleChangeUsername = (e) => {
        setUsername(e.target.value)
        setErrorMsg('')
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
        setErrorMsg('')
    }

    const handleLogin = () => {
        if (!username || username.trim().length === 0) {
            userRef.current.focus()
            setErrorMsg('Không được để trống tên đăng nhập')
            return
        }

        if (!password || password.trim().length === 0) {
            passRef.current.focus()
            setErrorMsg('Không được để trống mật khẩu')
            return
        }

        setLoading(true)
        axios.post('/1st/bankdemo/api/auth/signin', {
            username: username,
            password: password
        })
            .then(res => {
                const userSession = JSON.stringify(res.data)
                sessionStorage.setItem('userSession', userSession)
                navigate('/bankdemo/home')
            })
            .catch(err => {
                const { status } = err.response
                userRef.current.focus()
                NotificationServices.error(`${status}: Đăng nhập không thành công!`)
            })
            .finally(() => setLoading(false))
    }
    return (
        <div className="w-screen h-screen bg-slate-900/80 bg-[url('/napas-bg-blue.jpg')] bg-fixed bg-left bg-cover bg-no-repeat">
            <div className="flex w-full h-full backdrop-blur-sm justify-center items-center">
                <div className="relative flex flex-col bg-white/50 w-96 h-96 max-h-full px-10 py-15 gap-2 rounded-md items-center justify-center overflow-y-auto">
                    <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    <img src="/napas-logo.svg" className="h-10" />
                    <p className="flex w-full text-white text-xl font-bold uppercase justify-center items-center text-center m-0 p-0">Hệ thống mô phỏng <br /> giao dịch</p>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={username}
                        onChange={handleChangeUsername}
                        placeholder="Tài khoản"
                        className="w-full px-2 py-2 border-none outline-none rounded placeholder:italic"
                        autoComplete="off"
                        ref={userRef} />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={handleChangePassword}
                        placeholder="Mật khẩu"
                        autoComplete="off"
                        className="w-full px-2 py-2 border-none outline-none rounded placeholder:italic"
                        ref={passRef} />
                    {errorMsg && errorMsg.length > 0 && <p className="w-full m-0 p-0 text-red-900 justify-center items-center text-left">* {errorMsg}</p>}
                    <button
                        type="button"
                        className="w-full px-1 py-2 border-none outline-none rounded bg-indigo-500 text-white hover:bg-indigo-800/80 hover:cursor-pointer"
                        onClick={handleLogin}
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NewLogin