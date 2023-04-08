import Button from '@/components/Button'
import Field from '@/components/Field'
import FogotPasswordModal from '@/components/FogotPasswordModal'
import { PATH } from '@/config/path'
import { copyToClipboard } from '@/hooks/copyToClipboard'
import { useAuth } from '@/hooks/useAuth'
import { useBodyClass } from '@/hooks/useBodyClass'
import { useForm } from '@/hooks/useForm'
import { useQuery } from '@/hooks/useQuery'
import { useSearch } from '@/hooks/useSearch'
import { authService } from '@/services/auth'
import { loginByCodeThunkAction, loginThunkAction } from '@/stories/auth'
import { confirm, handleError, regexp, required } from '@/utils'
import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Account() {
    useBodyClass('bg-light')
    const [search] = useSearch()
    const dispatch = useDispatch()
    const { loginLoading} = useAuth()
    const navigate = useNavigate()
    const [openFogotPassword,setOpenFogotPassword] = useState(false)
    const {loading,refetch: registerService} = useQuery({
        enabled:false,
        queryFn: () => authService.register({
            ...formRegister.values,
            redirect: window.location.origin + window.location.pathname,
            limitDuration: 3000
        })
    })

    useEffect(() => {
        if(search.code) {
            dispatch(loginByCodeThunkAction({code : search.code}))
        }
    }, [])
    // const {loading: loadingLogin,refetch: loginService} = useQuery({
    //     enabled:false,
    //     queryFn: () => authService.login({
    //         ...formLogin.values,
    //         redirect: window.location.origin + window.location.pathname,
    //         limitDuration: 3000
    //     })
    // })

    const formLogin = useForm({
        username: [
            required(),
            regexp('email')
        ],
        password: [
            required()
        ],
    })
    const formRegister = useForm({
        name: [
            required()
        ],
        username: [
            required(),
            regexp('email')
        ],
        password: [
            required()
        ],
        confirmPassword: [
            confirm('password')
        ]
    }, {
        dependencies: {
            password: ['confirmPassword']
        }
    })


    const onLogin = async () => {
        if(formLogin.validate()) {
            try {
                dispatch(loginThunkAction(formLogin.values));
                // await dispatch(loginThunkAction(formLogin.values)).unwrap();
                message.success('Login success')
                // navigate(PATH.Profile.index)
            } catch (error) {
                handleError(error)
            }
        }
    }

    const onRegister = async () => {
        if(formRegister.validate()) {
            try {
                const res = await registerService()
                message.success(res.message)
            } catch (error) {
                handleError(error)
            }
        }
    }

    const _copyToClipboard = (ev) => {
        copyToClipboard(ev.target.innerText)
        message.info('copy to clipboard')
    }
    return (
        <>
            <FogotPasswordModal open={openFogotPassword} onClose={() => setOpenFogotPassword(false)} />
            <section className="py-12">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            {/* Card */}
                            <div className="card card-lg mb-10 mb-md-0">
                                <div className="card-body">
                                    {/* Heading */}
                                    <h6 className="mb-7">Returning Customer</h6>
                                    {/* Form */}
                                    <div>
                                        <div className="row">
                                            <div className="col-12">
                                                {/* Email */}
                                                <Field {...formLogin.register('username')} placeholder="Email Address *" />
                                            </div>
                                            <div className="col-12">
                                                {/* Password */}
                                                <Field {...formLogin.register('password')} placeholder="Password *" />
                                            </div>
                                            <div className="col-12 col-md">
                                                {/* Remember */}
                                                <div className="form-group">
                                                    <div className="custom-control custom-checkbox">
                                                        <input className="custom-control-input" id="loginRemember" type="checkbox" />
                                                        <label className="custom-control-label" htmlFor="loginRemember">
                                                            Remember me
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-auto">
                                                {/* Link */}
                                                <div className="form-group">
                                                    <a onClick={(ev) => {
                                                        ev.preventDefault()
                                                        setOpenFogotPassword(true)
                                                    }} className="font-size-sm text-reset" data-toggle="modal" href="#modalPasswordReset">Forgot
                                                        Password?</a>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                {/* Button */}
                                                <Button loading={loginLoading} disabled={loginLoading} onClick={onLogin}>Sign In</Button>
                                            </div>
                                            <div className="col-12">
                                                <p className="font-size-sm text-muted mt-5 mb-2 font-light">Tài khoản demo: <b className="text-black"><span onClick={_copyToClipboard} className="cursor-pointer underline">demo@spacedev.com</span> / <span onClick={_copyToClipboard} className="cursor-pointer underline">Spacedev@123</span></b></p>
                                                <p className="font-size-sm text-muted mt-5 mb-2 font-light text-justify">
                                                    Chúng tôi cung cấp cho bạn tài khoản demo vì mục đích học tập, để đảm bảo những người khác có thể sử dụng chung tài khoản chúng tôi sẽ
                                                    hạn chế rất nhiều quyền trên tài khoản này ví dụ:  <br />
                                                    - Không thay đổi thông tin cá nhân, mật khẩu <br />
                                                    - không reset password,... <br /><br />
                                                    Để có thể sử dụng toàn bộ chức năng trên website, vui lòng tiến hành <b className="text-black">đăng ký</b> bằng tài khoản email có thật
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            {/* Card */}
                            <div className="card card-lg">
                                <div className="card-body">
                                    {/* Heading */}
                                    <h6 className="mb-7">New Customer</h6>
                                    {/* Form */}
                                    <div>
                                        <div className="row">
                                            <div className="col-12">
                                                {/* Email */}
                                                <Field {...formRegister.register('name')} placeholder="Full Name *" />
                                            </div>
                                            <div className="col-12">
                                                {/* Email */}
                                                <Field {...formRegister.register('username')} placeholder="Email Address *" />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                {/* Password */}
                                                <Field {...formRegister.register('password')} placeholder="Password *" />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                {/* Password */}
                                                <Field {...formRegister.register('confirmPassword')} placeholder="Confirm Password *" />
                                            </div>
                                            <div className="col-12 col-md-auto">
                                                {/* Link */}
                                                <div className="form-group font-size-sm text-muted font-light">
                                                    By registering your details, you agree with our Terms &amp; Conditions,
                                                    and Privacy and Cookie Policy.
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                {/* Button */}
                                                <Button loading={loading} disabled={loading} onClick={onRegister}>Register</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>

    )
}

export default Account