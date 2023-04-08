import Button from '@/components/Button'
import Field from '@/components/Field'
import { Portal } from '@/components/Portal'
import UploadFile from '@/components/UploadFile'
import { PROFILE_TITLE_ID } from '@/config'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from '@/hooks/useForm'
import { useQuery } from '@/hooks/useQuery'
import { fileService } from '@/services/file'
import { userService } from '@/services/user'
import { setUserThunkAction } from '@/stories/auth'
import { confirm, handleError, minMax, regexp, required, validate } from '@/utils'
import { object } from '@/utils/object'
import { DatePicker, message } from 'antd'
import dayjs from 'dayjs'
import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'

const rules = {
    name: [
        required()
    ],
    phone: [
        required(),
        regexp('phone')
    ],
    currentPassword: [
        (_,forms) => {
            if(forms.newPassword) {
                const errorObj = validate({
                    currentPassword: [required(), minMax(6, 12)]
                }, forms)
                return errorObj.currentPassword
            }
        }
    ],
    newPassword: [
        (value,forms) => {
            if(forms.currentPassword) {
                if(forms.currentPassword === value) return "Vui lòng điền giống mật khẩu cũ"
                const errorObj = validate({
                    newPassword: [required(), minMax(6, 12)]
                }, forms)
                return errorObj.newPassword
            }
        }
    ],
    confirmPassword: [
        confirm('newPassword')
    ]
}
function Profile() {
    const dispatch = useDispatch()
    const {user} = useAuth()
    const inputRef = useRef()
    const formUpdate = useForm(rules, {initialValue: user})

    const {loading, refetch: updateService} = useQuery({
        enabled:false,
        queryFn: ({params}) => userService.updateProfile(...params)
    })

    const {loading:loadingChangePassword, refetch:changePasswordService} = useQuery({
        enabled:false,
        queryFn: ({params}) => userService.changePassword(...params)
    })

    const onSubmit = async () => {
        const checkOldData = object.isEqual(user, formUpdate.values, 'name', 'phone', 'birthday')
        let avatar
        if(inputRef.current) {
            const res = await fileService.uploadFile(inputRef.current)
            if(res.link) {
                avatar = res.link
            }
        }
        console.log(formUpdate.values)
        if(!avatar && !formUpdate.values.newPassword && checkOldData) {
            message.warning('Vui lòng nhập thông tin để thay đổi')
        }
        if(formUpdate.validate()) {
            if(avatar || !checkOldData) {
                updateService({
                    ...formUpdate.values,
                    avatar
                })
                .then(res => {
                    dispatch(setUserThunkAction(res.data))
                    inputRef.current = null
                    message.success('Cập nhật thông tin tài khoản thành công')
                }).catch(handleError)
            }

            if(formUpdate.values.newPassword) {
                changePasswordService({
                    currentPassword: formUpdate.values.currentPassword,
                    newPassword: formUpdate.values.newPassword
                })
                .then(res => {
                    formUpdate.setValues({
                        currentPassword:'',
                        newPassword:'',
                        confirmPassword:''
                    })
                    message.success('Thay đổi mật khẩu thành công')
                }).catch(handleError)

            }
        }
    }
    const avatarDefault = 'https://cdn.landesa.org/wp-content/uploads/default-user-image.png'
    return (
        <div>
            <Portal selector={PROFILE_TITLE_ID}>Thông tin cá nhân</Portal>
            <div className="row">
                <div className="col-12 mb-4">
                    <UploadFile onChange={(file) => inputRef.current = file}>
                        {(imagePreview,trigger) => (
                            <div className="profile-avatar">
                                <div className="wrap" onClick={trigger}>
                                    <img src={imagePreview || user?.avatar || avatarDefault} />
                                    <i className="icon">
                                        <img src="/img/icons/icon-camera.svg" />
                                    </i>
                                </div>
                            </div>
                        )}
                    </UploadFile>
                    
                </div>
                <div className="col-12">
                    {/* Email */}
                    <Field 
                        {...formUpdate.register('name')}
                        label='Full Name *'
                        placeholder='Full Name *'
                    />
                </div>
                <div className="col-md-6">
                    {/* Email */}
                    <Field 
                        {...formUpdate.register('phone')}
                        label='Phone Number *'
                        placeholder='Phone Number *'
                    />
                </div>
                <div className="col-md-6">
                    {/* Email */}
                    <Field 
                        {...formUpdate.register('username')}
                        label='Email Address *'
                        placeholder='Email Address *'
                        disabled
                    />
                </div>
                <div className="col-12 col-md-12">
                    {/* Password */}
                    <Field 
                        {...formUpdate.register('currentPassword')}
                        label='Current Password'
                        placeholder='Current Password'
                        type='password'
                        autoComplete='Current Password'
                    />
                </div>
                <div className="col-12 col-md-6">
                    <Field 
                        {...formUpdate.register('newPassword')}
                        label='New Password'
                        placeholder='New Password'
                        type='password'
                        autoComplete='New Password'
                    />
                </div>
                <div className="col-12 col-md-6">
                    <Field 
                        {...formUpdate.register('confirmPassword')}
                        label='Conform Password'
                        placeholder='Conform Password'
                        type='password'
                        autoComplete='Conform Password'
                    />
                </div>
                <div className="col-12 col-lg-6">
                    <Field 
                        label='Date of Birth'
                        {...formUpdate.register('birthday')}
                        renderField={(props) => <DatePicker className="form-control form-control-sm" format='DD/MM/YYYY' value={props.value ? dayjs(props.value, 'DD/MM/YYYY') : undefined} onChange={(ev,date) => props?.onChange?.(date)} />}
                    />
                </div>
                {/* <div className="col-12 col-lg-6">
                    <div className="form-group mb-8">
                        <label>Gender</label>
                        <div className="btn-group-toggle" data-toggle="buttons">
                            <label className="btn btn-sm btn-outline-border active">
                                <input type="radio" name="gender" defaultChecked /> Male
                            </label>
                            <label className="btn btn-sm btn-outline-border">
                                <input type="radio" name="gender" /> Female
                            </label>
                        </div>
                    </div>
                </div> */}
                <div className="col-12">
                    {/* Button */}
                    <Button onClick={onSubmit} loading={loading} disabled={loading}>Save Changes</Button>
                </div>
            </div>
        </div>
    )
}

export default Profile