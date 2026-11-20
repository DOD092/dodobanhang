'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { ApiError } from '@/apis/client'
import { useAuth } from '@/features/auth/AuthProvider'
import { getMyProfile, updateMyAvatar, updateMyProfile } from '@/features/customer/customerAPI'
import {
  AVATAR_MAX_BYTES,
  AVATAR_TYPES,
  GENDER_OPTIONS,
  type ProfileInput,
  profileSchema,
} from '@/features/customer/profileSchema'
import type { CustomerProfile } from '@/types/Customer'
import { resolveImageUrl } from '@/utils/imageUrl'

/*
  Hồ sơ khách hàng ở /account (chỉ role CUSTOMER):
  - GET   /api/customers/me/profile  -> điền form
  - PATCH /api/customers/me/profile  -> lưu họ tên, SĐT, ngày sinh, giới tính
  - PATCH /api/customers/me/avatar   -> đổi ảnh (multipart, jpg/png/webp <= 2MB, kiểm tra trước ở client)
  Lưu xong gọi refreshUser() để chỗ khác dùng user (lời chào...) cập nhật theo. 401 -> đăng xuất.
*/
function messageOf(e: unknown) {
  return e instanceof ApiError ? e.message : 'Không kết nối được máy chủ'
}

// Chỉ gửi field có giá trị: dateOfBirth rỗng thì backend báo sai định dạng ngày
function toPayload(values: ProfileInput) {
  return {
    fullName: values.fullName,
    phone: values.phone,
    gender: values.gender,
    ...(values.dateOfBirth ? { dateOfBirth: values.dateOfBirth } : {}),
  }
}

function toFormValues(profile: CustomerProfile): ProfileInput {
  const gender = GENDER_OPTIONS.some((o) => o.value === profile.gender) ? profile.gender : ''
  return {
    fullName: profile.fullName ?? '',
    phone: profile.phone ?? '',
    dateOfBirth: profile.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : '',
    gender: (gender ?? '') as ProfileInput['gender'],
  }
}

export default function ProfileSection() {
  const router = useRouter()
  const { token, logout, refreshUser } = useAuth()
  const [profile, setProfile] = useState<CustomerProfile | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState, reset } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: '', phone: '', dateOfBirth: '', gender: '' },
  })

  const handleAuthError = (e: unknown) => {
    if (e instanceof ApiError && e.status === 401) {
      logout()
      router.replace('/login')
      return true
    }
    return false
  }

  useEffect(() => {
    if (!token) return
    getMyProfile(token)
      .then((data) => {
        setProfile(data)
        reset(toFormValues(data))
      })
      .catch((e) => {
        if (!handleAuthError(e)) setLoadError(messageOf(e))
      })
    // Chỉ tải lại khi token đổi (handleAuthError dùng logout/router, ổn định giữa các lần render)
  }, [token, reset])

  const onSubmit = async (values: ProfileInput) => {
    if (!token) return
    setStatus(null)
    try {
      const updated = await updateMyProfile(token, toPayload(values))
      setProfile(updated)
      reset(toFormValues(updated))
      await refreshUser()
      setStatus({ ok: true, text: 'Đã lưu thông tin.' })
    } catch (e) {
      if (!handleAuthError(e)) setStatus({ ok: false, text: messageOf(e) })
    }
  }

  const onPickAvatar = async (file: File | undefined) => {
    if (!file || !token) return
    setStatus(null)
    if (!AVATAR_TYPES.includes(file.type)) {
      setStatus({ ok: false, text: 'Chỉ chấp nhận ảnh jpg, png, webp.' })
      return
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setStatus({ ok: false, text: 'Ảnh tối đa 2MB.' })
      return
    }
    setUploading(true)
    try {
      const { avatarUrl } = await updateMyAvatar(token, file)
      setProfile((p) => (p ? { ...p, avatarUrl } : p))
      setStatus({ ok: true, text: 'Đã đổi ảnh đại diện.' })
    } catch (e) {
      if (!handleAuthError(e)) setStatus({ ok: false, text: messageOf(e) })
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = '' // chọn lại cùng file vẫn kích hoạt onChange
    }
  }

  if (loadError) {
    return (
      <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
        {loadError}
      </p>
    )
  }
  if (!profile) return <p className="text-sm text-neutral-500">Đang tải hồ sơ...</p>

  const initial = profile.fullName?.trim().charAt(0).toUpperCase() || '?'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {profile.avatarUrl ? (
          // <img> thay vì next/image: ảnh Google là domain ngoài, không khai báo trong remotePatterns
          <img
            src={resolveImageUrl(profile.avatarUrl)}
            alt="Ảnh đại diện"
            referrerPolicy="no-referrer"
            className="size-20 rounded-full border-2 border-neutral-200 object-cover"
          />
        ) : (
          <span className="flex size-20 items-center justify-center rounded-full bg-brand-primary text-3xl font-bold text-white">
            {initial}
          </span>
        )}
        <div>
          <input
            ref={fileRef}
            type="file"
            accept={AVATAR_TYPES.join(',')}
            className="sr-only"
            id="avatar-input"
            onChange={(e) => onPickAvatar(e.target.files?.[0])}
          />
          <label
            htmlFor="avatar-input"
            aria-disabled={uploading}
            className={`btn btn-outline-primary cursor-pointer rounded-lg px-4 py-2 text-sm ${
              uploading ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            {uploading ? 'Đang tải ảnh...' : 'Đổi ảnh đại diện'}
          </label>
          <p className="mt-1 mb-0 text-xs text-neutral-500">JPG, PNG hoặc WEBP, tối đa 2MB.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
            Họ tên
          </label>
          <input
            id="fullName"
            autoComplete="name"
            className="form-input"
            {...register('fullName')}
          />
          <p className="mt-1 mb-0 text-sm text-red-600">{formState.errors.fullName?.message}</p>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="profile-email" className="mb-1 block text-sm font-medium">
            Email <span className="font-normal text-neutral-500">(không đổi được)</span>
          </label>
          <input
            id="profile-email"
            value={profile.email}
            disabled
            className="form-input bg-neutral-100"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium">
            Số điện thoại
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className="form-input"
            {...register('phone')}
          />
          <p className="mt-1 mb-0 text-sm text-red-600">{formState.errors.phone?.message}</p>
        </div>
        <div>
          <label htmlFor="dateOfBirth" className="mb-1 block text-sm font-medium">
            Ngày sinh
          </label>
          <input
            id="dateOfBirth"
            type="date"
            autoComplete="bday"
            max={new Date().toISOString().slice(0, 10)}
            className="form-input"
            {...register('dateOfBirth')}
          />
          <p className="mt-1 mb-0 text-sm text-red-600">{formState.errors.dateOfBirth?.message}</p>
        </div>
        <div>
          <label htmlFor="gender" className="mb-1 block text-sm font-medium">
            Giới tính
          </label>
          <select id="gender" className="form-input" {...register('gender')}>
            {GENDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {status && (
          <p
            role={status.ok ? 'status' : 'alert'}
            className={`mb-0 rounded-lg px-3 py-2 text-sm sm:col-span-2 ${
              status.ok ? 'bg-brand-primary-light text-brand-primary' : 'bg-red-50 text-red-800'
            }`}
          >
            {status.text}
          </p>
        )}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={formState.isSubmitting || !formState.isDirty}
            className="btn btn-primary rounded-lg px-5 py-2.5"
          >
            {formState.isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}
          </button>
        </div>
      </form>
    </div>
  )
}
