import { PATH } from "@/config/path"
import { useAction } from "@/hooks/useAction"
import { userService } from "@/services/user"
import { handleError } from "@/utils"
import { withListLoading } from "@/utils/withListLoading"
import { withLoading } from "@/utils/withLoading"
import { message } from "antd"
import moment from "moment"
import { generatePath, Link } from "react-router-dom"
import Button from "../Button"
import { Skeleton } from "../Skeleton"
import { PaymentCartStyle } from "./style"

const PaymentCard = ({_id,onChangeDefaultPayment,type,onDeletePayment, cardName,cardNumber,expired,cvv,default: paymentDefault}) => {
    const t = expired?.split('/')
    const month = t[0]
    const year = t[1]

    const onChangeDefault = useAction({
        service:() => userService.editPayment(`${_id}`, {default: true}),
        loadingMessage:'Thao tác đang được thực hiện',
        successMessage:'Thay đổi sổ thanh toán mặc định thành công',
        onSuccess:onChangeDefaultPayment
    })
    // const onChangeDefault = async () => {
    //     const key = 'change-default-payment'
    //     try {
    //         message.loading({
    //             key,
    //             content:'Thao tác đang được thực hiện'
    //         })
    //         await userService.editPayment(`${_id}`, {default: true})
    //         onChangeDefaultPayment?.()
    //         message.success({
    //             key,
    //             content:'Thay đổi sổ thanh toán mặc định thành công'
    //         })
    //     } catch (error) {
    //         handleError(error)
    //     }
    // }

    const _onDeleteAddress = useAction({
        service: () => userService.deletePayment(_id),
        loadingMessage:'Thao tác đang được thực hiện',
        successMessage:'Xóa sổ thanh toán thành công',
        onSuccess:onDeletePayment,
        retry:false
    })
    // const _onDeleteAddress = async () => {
    //     const key = 'change-delete-payment'
    //     try {
    //         message.loading({
    //             key,
    //             content:'Thao tác đang được thực hiện'
    //         })
    //         await userService.deletePayment(_id)
    //         onDeletePayment?.()
    //         message.success({
    //             key,
    //             content:'Xóa sổ thanh toán thành công'
    //         })
    //     } catch (error) {
    //         handleError(error)
    //     }
    // }
    return (
        <PaymentCartStyle className="col-12">
            {/* Card */}
            <div className="payment-card card card-lg bg-light mb-8">
                <div className="card-body">
                    {/* Heading */}
                    <h6 className="mb-6">
                        {type === "card" ? 'Debit / Credit Card' : 'Paypall'}
                    </h6>
                    {/* Text */}
                    <p className="mb-5">
                        <strong>Card Number:</strong> <br />
                        <span className="text-muted">{cardNumber}</span>
                    </p>
                    {/* Text */}
                    <p className="mb-5">
                        <strong>Expiry Date:</strong> <br />
                        <span className="text-muted">{moment(`${month}/01/${year}`).format('MMMM, YYYY')}</span>
                    </p>
                    {/* Text */}
                    <p className="mb-0">
                        <strong>Name on Card:</strong> <br />
                        <span className="text-muted">{cardName}</span>
                    </p>
                    <div className="card-action-right-bottom">
                        {
                            paymentDefault ?
                            <a href="#" className="color-success">
                                Thanh toán mặc định
                            </a>:
                            <Button onClick={onChangeDefault} outline className="hidden btn-change-default bg-black text-white border-black p-2">
                                    Đặt làm thanh toán mặc định
                            </Button>
                        }
                    </div>
                    {/* Action */}
                    <div className="card-action card-action-right flex gap-3">
                        {/* Button */}
                        <Link className="btn btn-xs btn-circle btn-white-primary" to={generatePath(PATH.Profile.EditPayment , {id:_id})}>
                            <i className="fe fe-edit-2" />
                        </Link>
                        {
                            !paymentDefault && <button onClick={_onDeleteAddress} className="btn btn-xs btn-circle btn-white-primary" href="account-address-edit.html">
                                <i className="fe fe-x" />
                            </button>
                        }
                    </div>
                </div>
            </div>
        </PaymentCartStyle>
    )
}

const PaymentCardLoading = () => {
    return (
        <div className="col-12">
            {/* Card */}
            <div className="payment-card card card-lg bg-light mb-8">
                <div className="card-body flex flex-col gap-5">
                    {/* Heading */}
                    <Skeleton height={24} width='70%' />
                    <Skeleton height={48} width='60%' />
                    <Skeleton height={48} width='50%' />
                    <Skeleton height={48} width='50%' />
                </div>
            </div>
        </div>
    )
}

export default withLoading(PaymentCard,PaymentCardLoading)

export const ListPaymentCards = withListLoading(PaymentCard,PaymentCardLoading)