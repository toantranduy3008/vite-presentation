import { useState, useRef, useEffect } from "react"
import { Button, LoadingOverlay, PasswordInput, TextInput } from "@mantine/core"

import { useNavigate } from "react-router-dom"
import NotificationServices from "../../services/notificationServices/NotificationServices"
import axiosInstance from "../../services/axiosInstance"
const Login = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [userError, setUserError] = useState('')
    const [passError, setPassError] = useState('')
    const [loading, setLoading] = useState(false)
    const userRef = useRef(null)
    const passRef = useRef(null)

    useEffect(() => {
        userRef.current.focus();
    }, [])

    const handleChangeUsername = (e) => {
        setUsername(e.target.value)
        setUserError('')
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
        setPassError('')
    }

    const handleLogin = () => {
        if (!username || username.trim().length === 0) {
            userRef.current.focus()
            setUserError('Tên tài khoản không hợp lệ')
            return
        }

        if (!password || password.trim().length === 0) {
            passRef.current.focus()
            setPassError('Mật khẩu không hợp lệ')
            return
        }

        setLoading(true)
        axiosInstance.post('/api/bankdemo/api/auth/signin', {
            username: username,
            password: password
        })
            .then(res => {
                const userSession = JSON.stringify(res.data)
                sessionStorage.setItem('userSession', userSession)
                navigate('/bankdemo/new-ibft/search')
            })
            .catch(err => {
                const { status } = err.response
                userRef.current.focus()
                NotificationServices.error(`${status}: Đăng nhập không thành công!`)
            })
            .finally(() => setLoading(false))
    }
    return (
        <div className="flex w-screen h-screen">
            <div className="flex flex-1 h-full justify-center">
                <div className="relative flex flex-col h-full w-full max-w-xl justify-center p-5 gap-5">
                    <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    <div className="flex font-bold">
                        <img src="/vinabank-logo.png" className="h-16" />
                        {/* <p>Ngân hàng Vinabank - Napas</p> */}
                    </div>
                    <TextInput
                        placeholder="Tài khoản"
                        value={username}
                        ref={userRef}
                        error={userError}
                        onChange={handleChangeUsername}
                    />
                    <PasswordInput
                        placeholder="Mật khẩu"
                        value={password}
                        ref={passRef}
                        error={passError}
                        onChange={handleChangePassword}
                    />
                    <Button
                        fullWidth
                        onClick={handleLogin}
                    >
                        Đăng nhập
                    </Button>
                </div>
            </div>
            <div className="flex flex-1 xs:hidden md:flex h-full bg-[url('/napas-bg-blue.jpg')] bg-left bg-cover bg-no-repeat ">
            </div>
        </div>
    )
}

export default Login