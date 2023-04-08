import { PATH } from '@/config/path'
import { useForm } from '@/hooks/useForm'
import { useQuery } from '@/hooks/useQuery'
import { userService } from '@/services/user'
import { handleError, regexp, required } from '@/utils'
import { message, Modal } from 'antd'
import React from 'react'
import Button from '../Button'
import Field from '../Field'

function FogotPasswordModal({open, onClose}) {
    const {loading, refetch: fogotPassword} = useQuery({
        queryFn: () => userService.resetPassword({
            ...form.values,
            redirect: window.location.origin + PATH.ResetPassword
        })
    })
    const form = useForm({
        username: [required('Vui lòng nhập emai'), regexp('email', 'Vui lòng nhập đúng email')]
    })

    const onSubmit = async () => {
        try {
            if(form.validate()){
                const res = await fogotPassword()
                message.success(res.message)
                onClose?.()
            }
        } catch (error) {
            handleError(error)
        }
    }
    return (
        <Modal centered open={open} onCancel={onClose} closeIcon={<></>} footer={false}>
            <div className="modal-content">
                {/* Close */}
                <button onClick={onClose} type="button" className="close !outline-none" data-dismiss="modal" aria-label="Close">
                    <i className="fe fe-x" aria-hidden="true" />
                </button>
                {/* Header*/}
                <div className="modal-header line-height-fixed font-size-lg">
                    <strong className="mx-auto">Forgot Password?</strong>
                </div>
                {/* Body */}
                <div className="modal-body text-center">
                    {/* Text */}
                    <p className="mb-7 font-size-sm text-gray-500">
                        Please enter your Email Address. You will receive a link
                        to create a new password via Email.
                    </p>
                    {/* Email */}
                    <Field 
                        placeholder='Email Address *'
                        {...form.register('username')}
                    />
                    {/* Button */}
                    <div className='flex justify-center items-start'>
                        <Button loading={loading} onClick={onSubmit} className="btn btn-sm btn-dark">
                            Reset Password
                        </Button>
                    </div>
                </div>
            </div>

        </Modal>
    )
}

export default FogotPasswordModal