import { ListPaymentCards } from '@/components/PaymentCard'
import { Portal } from '@/components/Portal'
import { PROFILE_TITLE_ID } from '@/config'
import { PATH } from '@/config/path'
import { useQuery } from '@/hooks/useQuery'
import { userService } from '@/services/user'
import React from 'react'
import { Link } from 'react-router-dom'

function PaymentPage() {
    const {data,loading,refetch} = useQuery({
        queryFn:() => userService.getPayment(),
        onSuccess: (res) => {
            res?.data.sort(e => e.default ? -1 : 0)
        }
    })
    return (
        <div className="row">
            <Portal selector={PROFILE_TITLE_ID}>Số thanh toán</Portal>
            <ListPaymentCards
                data={data?.data}
                loading={!data?.data && loading}
                onChangeDefaultPayment={refetch}
                onDeletePayment={refetch}
            />
            <div className="col-12">
                {/* Button */}
                <Link className="btn btn-block btn-lg btn-outline-border" to={PATH.Profile.NewPayment}>
                    Add Payment Method <i className="fe fe-plus" />
                </Link>
            </div>
        </div>

    )
}

export default PaymentPage