'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { ApiError } from '@/apis/client'
import { createMyAddress } from '@/features/address/addressAPI'
import {
  type AddressInput,
  type AddressOutput,
  addressSchema,
} from '@/features/address/addressSchema'
import type { Address } from '@/types/Address'

interface Props {
  token: string
  isFirst: boolean // địa chỉ đầu tiên tự là mặc định (backend), ẩn ô chọn
  onCreated: (address: Address) => void
  onCancel?: () => void
  onUnauthorized: () => void
}

const FIELDS: {
  name: Exclude<keyof AddressInput, 'isDefault'>
  label: string
  autoComplete: string
  span?: boolean
}[] = [
  { name: 'receiverName', label: 'Họ tên người nhận', autoComplete: 'name' },
  { name: 'receiverPhone', label: 'Số điện thoại', autoComplete: 'tel' },
  { name: 'addressLine', label: 'Số nhà, tên đường', autoComplete: 'street-address', span: true },
  { name: 'ward', label: 'Phường / Xã', autoComplete: 'address-level3' },
  { name: 'district', label: 'Quận / Huyện', autoComplete: 'address-level2' },
  { name: 'province', label: 'Tỉnh / Thành phố', autoComplete: 'address-level1', span: true },
]

// Thêm địa chỉ giao hàng (POST /api/addresses/me) ngay trong trang thanh toán
export default function AddressForm({
  token,
  isFirst,
  onCreated,
  onCancel,
  onUnauthorized,
}: Props) {
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState } = useForm<AddressInput, unknown, AddressOutput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      receiverName: '',
      receiverPhone: '',
      addressLine: '',
      ward: '',
      district: '',
      province: '',
      isDefault: false,
    },
  })

  const onSubmit = async (values: AddressOutput) => {
    setError(null)
    try {
      onCreated(await createMyAddress(token, values))
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return onUnauthorized()
      setError(e instanceof ApiError ? e.message : 'Không kết nối được máy chủ')
    }
  }

  return (
    // Không lồng <form> trong form khác: đây là form riêng, trang thanh toán không bọc <form>
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map(({ name, label, autoComplete, span }) => {
          const fieldError = formState.errors[name]?.message
          return (
            <div key={name} className={span ? 'sm:col-span-2' : undefined}>
              <label htmlFor={`address-${name}`} className="mb-1 block text-sm font-medium">
                {label}
              </label>
              <input
                id={`address-${name}`}
                type={name === 'receiverPhone' ? 'tel' : 'text'}
                autoComplete={autoComplete}
                aria-invalid={fieldError ? true : undefined}
                aria-describedby={fieldError ? `address-${name}-error` : undefined}
                className={`form-input ${fieldError ? 'is-invalid' : ''}`}
                {...register(name)}
              />
              {fieldError && (
                <p id={`address-${name}-error`} className="mt-1 mb-0 text-sm text-red-600">
                  {fieldError}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {!isFirst && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 accent-brand-primary"
            {...register('isDefault')}
          />
          Đặt làm địa chỉ mặc định
        </label>
      )}

      {error && (
        <p role="alert" className="mb-0 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="btn btn-primary rounded-lg px-5 py-2.5"
        >
          {formState.isSubmitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline-secondary rounded-lg px-5 py-2.5"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  )
}
