import Button from '@/components/Button'
import Field from '@/components/Field'
import { Portal } from '@/components/Portal'
import { PROFILE_TITLE_ID } from '@/config'
import { PATH } from '@/config/path'
import { useForm } from '@/hooks/useForm'
import { useQuery } from '@/hooks/useQuery'
import { userService } from '@/services/user'
import { handleError, regexp, required } from '@/utils'
import { object } from '@/utils/object'
import { message, Spin } from 'antd'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const rules = {
    fullName: [required()],
    email:[required(), regexp('email')],
    phone:[required(), regexp('phone')],
    province: [required()],
    district: [required()],
    address: [required()],
}
function AddAddress() {
    const form = useForm(rules)
    const {id} = useParams()
    const navigate = useNavigate()
    const {data:dataDetail,loading:loadingDetail} = useQuery({
        enabled:!!id,
        queryFn: () => userService.getAddressDetail(id),
        onSuccess:(res) => {
            form.setValues(res.data)
        },
        onError:() => {
            message.error('Địa chỉ không tồn tại')
            navigate(PATH.Profile.Address)
        }
    })
    const {data,loading, refetch:addAddressServi} = useQuery({
        enabled:false,
        queryFn:({params}) => {
            // có id thì call api update
            if(id) {
                return userService.editAddress(id, ...params)
            } else {
                return userService.addAddress(...params)
            }
        }
    })

    const onSubmit = async () => {
        try {
           if(form.validate()) {
            // ktra dữ kiệu có thay đổi trc khi cập nhật
                if(id && object.isEqual(form.values, dataDetail.data)) {
                    return message.warning('Vui lòng nhập dữ liệu để thay đổi')
                }
                await addAddressServi(form.values)
                message.success(id ? 'Cập nhật địa chỉ thành công': 'Thêm địa chỉ thành công')
                navigate(PATH.Profile.Address)
           }
        } catch (error) {
            handleError(error)
        }
    }

    const idTitle = id
    return (
        <>
            <Portal selector={PROFILE_TITLE_ID}>{idTitle ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ'}</Portal>
            <div>
                {/* Heading */}
                <h6 className="mb-7">
                    Add Address
                </h6>
                {/* Form */}
                    <Spin spinning={loadingDetail}>
                        <div className="row">
                            <div className="col-12">
                                <Field 
                                    label='Full Name *'
                                    placeholder='Full Name *'
                                    {...form.register('fullName')}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <Field 
                                    label='Phone Number*'
                                    placeholder='Phone Number*'
                                    {...form.register('phone')}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <Field 
                                    label='Email Address *'
                                    placeholder='Email Address *'
                                    {...form.register('email')}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <Field 
                                    label='District *'
                                    placeholder='District *'
                                    {...form.register('district')}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <Field 
                                    label='Province / City *'
                                    placeholder='Province / City *'
                                    {...form.register('province')}
                                />
                            </div>
                            <div className="col-12">
                                <Field 
                                    label='Address *'
                                    placeholder='Address *'
                                    {...form.register('address')}
                                />
                            </div>
                            <div className="col-12">
                                <Field 
                                    {...form.register('default')}
                                    renderField={props => (
                                        <div className="custom-control custom-checkbox mb-0">
                                            <input onChange={ev => {
                                                if(dataDetail && dataDetail.data.default) {
                                                    message.warning('Không thể thay đổi địa chỉ mặc định')
                                                } else {
                                                    props?.onChange?.(ev.target.checked)
                                                }
                                            }} checked={props.value} type="checkbox" className="custom-control-input" id="defaultShippingAddress" />
                                            <label className="custom-control-label" htmlFor="defaultShippingAddress">Default shipping address</label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </Spin>
                    {/* Button */}
                    <Button onClick={onSubmit} loading={loading} className="btn btn-dark" type="submit">
                        {idTitle ? 'Cập nhật' : 'Thêm địa chỉ'}
                    </Button>
            </div>

        </>
    )
}

export default AddAddress