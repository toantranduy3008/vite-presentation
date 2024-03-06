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
                navigate('/bankdemo/new-ibft/search-outgoing')
            })
            .catch(err => {
                const { status } = err.response
                userRef.current.focus()
                NotificationServices.error(`${status}: Đăng nhập không thành công!`)
            })
            .finally(() => setLoading(false))
    }
    return (
        <div className="w-screen h-screen bg-slate-900/80 bg-[url('/napas-bg-blue.jpg')] bg-fixed bg-center bg-cover bg-no-repeat">
            <div className="flex w-full h-full backdrop-blur-sm justify-center items-center">
                <div className="relative flex bg-white/50 h-96 max-h-full justify-center items-center ">
                    <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    <div className="relative flex flex-col w-96 px-10 py-15 gap-2  items-center justify-center overflow-y-auto ">
                        <img src="/bankdemo/napas-logo.svg" className="h-10 md:hidden" />
                        <p className="flex w-full text-white text-xl font-semibold uppercase justify-center items-center text-center m-0 p-0">ibft 2.0 simulator system</p>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={username}
                            onChange={handleChangeUsername}
                            placeholder="Tài khoản"
                            className="w-full px-2 py-2 border-none outline-none placeholder:italic"
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
                            className="w-full px-2 py-2 border-none outline-none placeholder:italic"
                            ref={passRef} />
                        {errorMsg && errorMsg.length > 0 && <p className="flex w-full m-0 p-0 text-red-900 justify-start items-center ">* {errorMsg}</p>}
                        <button
                            type="button"
                            className="w-full px-1 py-2 border-none outline-none bg-indigo-500 text-white hover:bg-indigo-800/80 hover:cursor-pointer"
                            onClick={handleLogin}
                        >
                            Đăng nhập
                        </button>
                    </div>

                    <div className="relative hidden md:flex md:flex-col w-96 px-10 py-15 gap-2 items-center justify-center overflow-y-auto">
                        <img className="w-full aspect-[3/4] max-h-16 " src="/bankdemo/napas-logo.svg" alt="placeholder" />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default NewLogin