import { PATH } from "@/config/path"
import { useAction } from "@/hooks/useAction"
import { userService } from "@/services/user"
import { cn, handleError } from "@/utils"
import { withListLoading } from "@/utils/withListLoading"
import { withLoading } from "@/utils/withLoading"
import { message } from "antd"
import { useRef } from "react"
import { generatePath, Link } from "react-router-dom"
import Button from "../Button"
import { Skeleton } from "../Skeleton"
import { AddressCartStyle } from "./style"


const AddressCardLoading = () => {
    return (
        <div className="col-12">
            {/* Card */}
            <div className="card card-lg bg-light mb-8 h-[270px]">
                <div className="card-body">
                    {/* Text */}
                    <p className="flex flex-col gap-4 font-size-sm mb-0 leading-[35px]">
                        <Skeleton width='70%' height={27} />
                        <Skeleton width={'40%'} height={20} />
                        <Skeleton width={'30%'} height={20} />
                        <Skeleton width={'30%'} height={20} />
                        <Skeleton width={'25%'} height={20} />
                        <Skeleton width={'20%'} height={20} />
                        
                    </p>
                </div>
            </div>
        </div>
    )
}
export const AddressCard = withLoading(({onClick,action,onDeleteAddress,onChangeDefaultAddress,_id,fullName, email, phone, province, district, address, default: addressDefault,className }) => {
    const flagRemoveRef = useRef(false)

    const onChangeDefault = useAction({
        service:() => userService.editAddress(`${_id}`, {default: true}),
        loadingMessage:'Thao tác đang được thực hiện',
        successMessage:'Thay đổi địa chỉ mặc định thành công',
        onSuccess:onChangeDefaultAddress
    })
    // const onChangeDefault = async () => {
    //     const key = 'change-default-address'
    //     try {
    //         message.loading({
    //             key,
    //             content:'Thao tác đang được thực hiện'
    //         })
    //         await userService.editAddress(`${_id}`, {default: true})
    //         onChangeDefaultAddress?.()
    //         message.success({
    //             key,
    //             content:'Thay đổi địa chỉ mặc định thành công'
    //         })
    //     } catch (error) {
    //         handleError(error)
    //     }
    // }
    const _onDeleteAddress = useAction({
        service:() => userService.deleteAddress(_id),
        loadingMessage:'Thao tác đang được thực hiện',
        successMessage:'Xóa địa chỉ thành công thành công',
        onSuccess:onDeleteAddress,
        retry:false
    })
    // const _onDeleteAddress = async () => {
    //     if(flagRemoveRef.current) return

    //     flagRemoveRef.current = true
    //     const key = 'change-delete-address'
    //     try {
    //         message.loading({
    //             key,
    //             content:'Thao tác đang được thực hiện'
    //         })
    //         await userService.deleteAddress(_id)
    //         onDeleteAddress?.()
    //         message.success({
    //             key,
    //             content:'Xóa địa chỉ thành công thành công'
    //         })
    //     } catch (error) {
    //         handleError(error, key)
    //     }

    // }
    return (
        <AddressCartStyle className="col-12" onClick={onClick}>
            {/* Card */}
            <div className={cn("card card-lg bg-light mb-8", className)} >
                <div className="card-body">
                    {/* Text */}
                    <p className="font-size-sm mb-0 leading-[35px]">
                        <a className="text-body text-xl font-bold " href="./product.html">{fullName}</a> <br />
                        <b>Số điện thoại:</b> {phone} <br />
                        <b>Email:</b>{email}<br />
                        <b>Quận / Huyện:</b> {district} <br />
                        <b>Tỉnh / thành phố:</b> {province} <br />
                        <b>Địa chỉ:</b> {address}
                    </p>
                    {
                        !action &&
                        <>
                        <div className="card-action-right-bottom">
                            {
                                addressDefault ?
                                <div className="color-success cursor-pointer">
                                    Địa chỉ mặc định
                                </div> :
                                <Button onClick={onChangeDefault} outline className="hidden btn-change-default bg-black text-white border-black p-2">
                                    Đặt làm địa chỉ mặc định
                                </Button>
                            }
                        </div>
                        <div className="card-action card-action-right flex gap-3">
                            {/* Button */}
                            <Link className="btn btn-xs btn-circle btn-white-primary" to={generatePath(PATH.Profile.EditAddress , {id:_id})}>
                                <i className="fe fe-edit-2" />
                            </Link>
                            {
                                !addressDefault && <button onClick={_onDeleteAddress} className="btn btn-xs btn-circle btn-white-primary" href="account-address-edit.html">
                                    <i className="fe fe-x" />
                                </button>
                            }
                        </div>
                        </>
                    }
                    {action}
                </div>
            </div>
        </AddressCartStyle>
    )
},AddressCardLoading )


export const ListAddressCard = withListLoading(AddressCard, AddressCardLoading)