import Button from '@/components/Button'
import Field from '@/components/Field'
import { PATH } from '@/config/path'
import { useBodyClass } from '@/hooks/useBodyClass'
import { useForm } from '@/hooks/useForm'
import { useQuery } from '@/hooks/useQuery'
import { userService } from '@/services/user'
import { getUserThunkAction } from '@/stories/auth'
import { getCartAction } from '@/stories/cart'
import { confirm, handleError, regexp, required, setToken } from '@/utils'
import { message } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

function ResetPassword() {
    useBodyClass('bg-light')
    // lấy mã code
    const [search] = useSearchParams()
    const code = search.get('code')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!code) {
            navigate(PATH.Account)
        }
    }, [])
    const {loading,refetch:resetPasswordService } = useQuery({
        enabled:false,
        queryFn: () => userService.changePasswordByCode({
            password: form?.values?.password,
            code
        })
    })
    const form = useForm({
        password: [required()],
        confirmPassword: [required(), confirm('password')]
    })

    const onSubmit = async () => {
        try {
            if(form.validate()) {
                const res = await resetPasswordService()
                message.success('Thay đổi mật khẩu thành công')
                // change thành công set lại toke => gọi hàm lấy lại user vừa thay đổi + cart
                setToken(res.data)
                dispatch(getUserThunkAction())
                dispatch(getCartAction())
            }
        } catch (error) {
            handleError(error)
        }
    }
    return (
        <section className="py-12">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-6 offset-md-3">
                        {/* Card */}
                        <div className="card card-lg mb-10 mb-md-0">
                            <div className="card-body">
                                {/* Heading */}
                                <h6 className="mb-7">Reset Password</h6>
                                {/* Form */}
                                <div className="row">
                                    <div className="col-12">
                                        {/* Email */}
                                        <Field
                                            placeholder='Password *'
                                            {...form.register('password')}
                                        />
                                    </div>
                                    <div className="col-12">
                                        {/* Password */}
                                        <Field
                                            placeholder='Confirm Password *'
                                            {...form.register('confirmPassword')}
                                        />
                                    </div>
                                    <div className="col-12 col-md">
                                    </div>
                                    <div className="col-12 flex justify-center">
                                        {/* Button */}
                                        <Button loading={loading} onClick={onSubmit} className="btn btn-sm btn-dark">
                                            Reset Password
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default ResetPassword