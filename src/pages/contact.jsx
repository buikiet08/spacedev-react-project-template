import Button from '@/components/Button'
import Field from '@/components/Field'
import { useForm } from '@/hooks/useForm'
import { useQuery } from '@/hooks/useQuery'
import { organizationService } from '@/services/organization'
import { handleError, regexp, required } from '@/utils'
import { message } from 'antd'
import React from 'react'

function Contact() {
    const {loading, refetch:contactService} = useQuery({
        queryFn: () => organizationService.contact(form.values)
    })
    const form = useForm({
        nem: [required()],
        email: [required(), regexp('email')],
        phone: [required(), regexp('phone')],
        title: [required()],
        content: [required()]
    })
    const onSubmit = async () => {
        try {
            if (form.validate()) {
                await contactService()
                message.success('Gửi liên hệ thành công')
                form.reset()
            }
        } catch (error) {
            handleError(error)
        }
    }
    return (
        <section className="pt-7 pb-12">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {/* Heading */}
                        <h3 className="mb-10 text-center">Contact Us</h3>
                    </div>
                </div>
                <div className="row justify-content-between">
                    <div className="col-12 col-md-4 col-xl-3">
                        <aside className="mb-9 mb-md-0">
                            {/* Heading */}
                            <h6 className="mb-6">
                                <i className="fe fe-phone text-primary mr-4" /> Call to Us:
                            </h6>
                            {/* Text */}
                            <p className="text-gray-500">
                                We're available from 10 am - 10 pm EST,
                                7 days a week.
                            </p>
                            <p>
                                <strong>Customer Service:</strong><br />
                                <a className="text-gray-500" href="tel:60146-389-574">6-146-389-574</a>
                            </p>
                            <p className="mb-0">
                                <strong>Careers:</strong><br />
                                <a className="text-gray-500" href="tel:60146-389-574">6-146-389-574</a>
                            </p>
                            {/* Divider */}
                            <hr />
                            {/* Heading */}
                            <h6 className="mb-6">
                                <i className="fe fe-mail text-primary mr-4" /> Write to Us:
                            </h6>
                            {/* Text */}
                            <p className="text-gray-500">
                                Fill out our form and we will contact you
                                within 24 hours.
                            </p>
                            <p>
                                <strong>Customer Service:</strong><br />
                                <a className="text-gray-500" href="mailto:customer@example.com">customer@example.com</a>
                            </p>
                            <p className="mb-0">
                                <strong>Careers:</strong><br />
                                <a className="text-gray-500" href="mailto:careers@example.com">careers@example.com</a>
                            </p>
                            {/* Divider */}
                            <hr />
                            {/* Heading */}
                            <h6 className="mb-6">
                                <i className="fe fe-mail text-primary mr-4" /> Find Us:
                            </h6>
                            {/* Text */}
                            <p className="mb-0 text-gray-500">
                                Want to visit our Offline Stores?
                            </p>
                            {/* Button */}
                            <p className="mb-0">
                                <a className="btn btn-link px-0 text-body" href="store-locator.html">
                                    Go to Store Locator <i className="fe fe-arrow-right ml-2" />
                                </a>
                            </p>
                        </aside>
                    </div>
                    <div className="col-12 col-md-8">
                        {/* Form */}
                        {/* Email */}
                        <Field
                            placeholder='Your Name *'
                            {...form.register('name')}
                        />
                        {/* Email */}
                        <Field
                            placeholder='Your Email *'
                            {...form.register('email')}
                        />
                        <Field
                            placeholder='Your Phone *'
                            {...form.register('phone')}
                        />
                        {/* Email */}
                        <Field
                            placeholder='Title *'
                            {...form.register('title')}
                        />
                        {/* Email */}
                        <Field
                            placeholder='Message *'
                            {...form.register('content')}
                            renderField={props => <textarea {...props} onChange={ev => props.onChange(ev.target.value)} className="form-control form-control-sm" rows={5} placeholder="Message *" defaultValue={""} />}
                        />
                        {/* Button */}
                        <Button loading={loading} disabled={loading} onClick={onSubmit} className="btn btn-dark">
                            Send Message
                        </Button>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Contact