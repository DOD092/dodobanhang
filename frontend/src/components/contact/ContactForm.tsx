'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { ApiError } from '@/apis/client'
import { createContact } from '@/features/contact/contactAPI'
import {
  contactSchema,
  type ContactFormInput,
  type ContactFormValues,
} from '@/features/contact/contactSchema'

type Status = 'idle' | 'success' | 'error'

function FieldError({ name, message }: { name: keyof ContactFormInput; message?: string }) {
  if (!message) return null
  return (
    <p id={`contact-${name}-error`} className="mt-1 mb-0 text-sm text-red-600">
      {message}
    </p>
  )
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  // Thông báo riêng từ backend khi bị chặn gửi quá nhiều (429); lỗi khác dùng câu chung
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', phone: '', email: '', content: '' },
  })

  async function onSubmit(values: ContactFormValues) {
    setStatus('idle')
    setRateLimitMessage(null)
    try {
      await createContact(values)
      reset()
      setStatus('success')
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) setRateLimitMessage(error.message)
      setStatus('error')
    }
  }

  // Class + thuộc tính a11y cho ô nhập; lỗi hiển thị bằng class is-invalid (định nghĩa trong globals.css)
  function fieldProps(name: keyof ContactFormInput) {
    const error = errors[name]
    return {
      id: `contact-${name}`,
      className: `form-input rounded-lg ${error ? 'is-invalid' : ''}`,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `contact-${name}-error` : undefined,
      ...register(name),
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <div>
        <label htmlFor="contact-name" className="sr-only">
          Tên của bạn
        </label>
        <input type="text" autoComplete="name" placeholder="Tên của bạn" {...fieldProps('name')} />
        <FieldError name="name" message={errors.name?.message} />
      </div>

      <div>
        <label htmlFor="contact-phone" className="sr-only">
          Số điện thoại
        </label>
        <input type="tel" autoComplete="tel" placeholder="Số điện thoại" {...fieldProps('phone')} />
        <FieldError name="phone" message={errors.phone?.message} />
      </div>

      <div>
        <label htmlFor="contact-email" className="sr-only">
          Địa chỉ email
        </label>
        <input
          type="email"
          autoComplete="email"
          placeholder="Địa chỉ email"
          {...fieldProps('email')}
        />
        <FieldError name="email" message={errors.email?.message} />
      </div>

      <div>
        <label htmlFor="contact-content" className="sr-only">
          Nội dung liên hệ
        </label>
        <textarea rows={5} placeholder="Nội dung liên hệ" {...fieldProps('content')} />
        <FieldError name="content" message={errors.content?.message} />
      </div>

      {status === 'success' && (
        <div
          className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
          role="status"
        >
          Cảm ơn bạn! Chúng tôi đã nhận được yêu cầu và sẽ liên hệ lại sớm.
        </div>
      )}
      {status === 'error' && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {rateLimitMessage ??
            'Gửi không thành công, vui lòng thử lại hoặc gọi trực tiếp cho chúng tôi.'}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary rounded-full px-6 py-2 font-semibold tracking-wide uppercase"
      >
        {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
      </button>
    </form>
  )
}
