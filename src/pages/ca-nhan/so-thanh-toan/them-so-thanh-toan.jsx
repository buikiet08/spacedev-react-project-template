import Field from '@/components/Field'
import { Portal } from '@/components/Portal'
import { Select } from '@/components/Select'
import { PROFILE_TITLE_ID } from '@/config'
import { PATH } from '@/config/path'
import { useForm } from '@/hooks/useForm'
import { useQuery } from '@/hooks/useQuery'
import { userService } from '@/services/user'
import { handleError, required } from '@/utils'
import { object } from '@/utils/object'
import { Button, message, Radio, Spin } from 'antd'
import moment from 'moment/moment'
import React, { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function AddPayment() {
    const typeRef = useRef('card')
    const {id} = useParams()
    const [step,setStep] = useState(id ? 1 : 0)
    const navigate = useNavigate()
    const form = useForm({
        cardName : [required()],
        cardNumber : [required()],
        cvv: [required()],
        month: [required()],
        year: [required()],
    })

    const {data:dataDetail,loading:loadingDetail} = useQuery({
        enabled:!!id,
        queryFn: () => userService.getPaymentDetail(id),
        onSuccess:(res) => {
            const t = res?.data.expired?.split('/')
            const month = t[0]
            const year = t[1]
            form.setValues({
                ...res.data,
                month,year
            })
        },
        onError:() => {
            message.error('Sổ thanh toán không tồn tại')
            navigate(PATH.Profile.Payment)
        }
    })
    const {loading, refetch:paymentService} = useQuery({
        enabled:false,
        queryFn:({params}) => {
            if(id) {
                return userService.editPayment(id,...params)
            } else {
                return userService.addPayment(...params)
            }
        }
    })
    const onSubmit = async () => {
        try {
            if(form.validate()) {
                if(id && object.isEqual(form.values, dataDetail.data)) {
                    return message.warning('Vui lòng nhập dữ liệu để thay đổi')
                }
                await paymentService({
                    ...form.values,
                    type:typeRef.current?.target?.value,
                    expired: `${form.values.month}/${form.values.year}`
                })

                message.success(id ? 'Cập nhật sổ thanh toán thành công': 'Thêm sổ thanh toán thành công')
                navigate(PATH.Profile.Payment)
            }
        } catch (error) {
            handleError(error)
        }
    }
    const idTitle = id
    return (
        <>
            <Portal selector={PROFILE_TITLE_ID}>{idTitle ? 'Sửa thanh toán' : 'Thêm thanh toán'}</Portal>
            <div>
                {
                    step === 0 && <div>
                        {/* Card */}
                        <Radio.Group defaultValue='card' onChange={value => typeRef.current = value}>
                            <div className="form-group card card-sm border">
                                <div className="card-body">
                                    <Radio value='card'>
                                        I want to add Debit / Credit Card <img className="ml-2" src="/img/brands/color/cards.svg" alt="..." />
                                    </Radio>
                                </div>
                            </div>
                            {/* Card */}
                            <div className="form-group card card-sm border">
                                <div className="card-body">
                                    <Radio value="paypall">I want to add PayPall <img src="/img/brands/color/paypal.svg" alt="..." /></Radio>
                                </div>
                            </div>
                        </Radio.Group>
                        {/* Button */}
                        <Button onClick={() => setStep(1)} className="btn btn-dark" type="submit">
                            Continue <i className="fe fe-arrow-right ml-2" />
                        </Button>
                    </div>
                }
                {
                    step === 1 && <>
                        <Spin spinning={loadingDetail}>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <Field 
                                        label='Card Number *'
                                        placeholder='Card Number *'
                                        {...form.register('cardNumber')}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <Field 
                                        label='Name on Card *'
                                        placeholder='Name on Card *'
                                        {...form.register('cardName')}
                                    />
                                </div>
                                <div className="col-12">
                                    {/* Label */}
                                    <label>
                                        Expiry Date *
                                    </label>
                                </div>
                                <div className="col-12 col-md-4">
                                    <Field 
                                        {...form.register('month')}
                                        renderField={(props) => (
                                            <Select {...props}>
                                                <option selected disabled value>Month *</option>
                                                {
                                                    Array.from(Array(12)).map((_,i) => <option>{moment(`${i + 1}/01/2000`).format('MMMM')}</option>)
                                                }
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <Field 
                                        {...form.register('year')}
                                        renderField={(props) => (
                                            <Select {...props}>
                                                <option selected disabled value>Year *</option>
                                                {
                                                    Array.from(Array(30)).map((_,i) => {
                                                        const value = (new Date()).getFullYear() - 15 + i
                                                        return <option key={i}>{value}</option>
                                                    })
                                                }
                                                
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <Field 
                                        label='CVV *'
                                        placeholder='CVV *'
                                        {...form.register('cvv')}
                                    />
                                </div>
                                <div className="col-12">
                                    <Field 
                                        {...form.register('default')}
                                        renderField={props => (
                                            <div className="custom-control custom-checkbox mb-0">
                                                <input onChange={ev => {
                                                    if(dataDetail && dataDetail.data.default) {
                                                        message.warning('Không thể thay đổi thanh toán mặc định')
                                                    } else {
                                                        props?.onChange?.(ev.target.checked)
                                                    }
                                                }} checked={props.value} type="checkbox" className="custom-control-input" id='defaultShippingPayment' />
                                                <label className="custom-control-label" htmlFor="defaultShippingPayment">Default shipping address</label>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </Spin>
                        {/* Button */}
                        <Button loading={loading} onClick={onSubmit} className="btn btn-dark" type="submit">
                            {idTitle ? 'Edit Card' : 'Add Card'}
                        </Button>
                    </>
                }
            </div>

        </>
    )
}

export default AddPayment