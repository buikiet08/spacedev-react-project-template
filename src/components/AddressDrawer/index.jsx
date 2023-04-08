import { PATH } from '@/config/path'
import { useQuery } from '@/hooks/useQuery'
import { userService } from '@/services/user'
import { Drawer } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { AddressCard } from '../AddressCard'

function AddressDrawer({onSelect,open,onClose}) {
    const {data,loading,refetch} = useQuery({
        queryFn:() => userService.getAddress(),
        onSuccess: (res) => {
            res?.data.sort(e => e.default ? -1 : 0)
        }
    })
    return (
        <Drawer width={470} open={open} onClose={onClose} headerStyle={{ display: 'none' }} bodyStyle={{ padding: 0 }}>
            <div>
                <div className="modal-content">
                    {/* Close */}
                    <button onClick={onClose} type="button" className="close !outline-none" data-dismiss="modal" aria-label="Close">
                        <i className="fe fe-x" aria-hidden="true" />
                    </button>
                    {/* Header*/}
                    <div className="modal-header line-height-fixed font-size-lg">
                        <strong className="mx-auto">Select your address</strong>
                    </div>
                    {/* List group */}
                    {
                        loading ? <div className="row"><AddressCard loading /></div> :
                        data?.data?.map(e => <div className="row"><AddressCard action onClick={() => {
                            onSelect(e)
                            onClose()
                        }} className={`bg-white ${e.default === true && '!bg-[#eefff3]'} !mb-0 border-b hover:!bg-[#eefff3]`} {...e} key={e.id} /></div>)
                    }
                    {/* Buttons */}
                    <div className="modal-body mt-auto">
                        <Link className="btn btn-block btn-outline-dark" to={PATH.Profile.NewAddress}>Thêm mới</Link>
                    </div>
                </div>
            </div>

        </Drawer>
    )
}

export default AddressDrawer