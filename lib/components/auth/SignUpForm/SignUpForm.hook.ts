import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Path, useForm, useWatch } from 'react-hook-form'
import * as z from 'zod'

import { useSignUpMutation } from '@/lib/queries/auth/mutation'

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,10}$/

const signUpSchema = z
  .object({
    name: z.string().min(1, '이름을 입력해주세요'),
    email: z.email('유효한 이메일 주소를 입력해주세요'),
    phone: z.object({
      first: z.string().min(1, '휴대폰 번호를 입력해주세요').max(3),
      second: z.string().min(1, '휴대폰 번호를 입력해주세요').max(4),
      third: z.string().min(1, '휴대폰 번호를 입력해주세요').max(4),
    }),
    password: z
      .string()
      .min(6, '비밀번호는 6~10자 이여야 합니다')
      .max(10, '비밀번호는 6~10자 이여야 합니다')
      .regex(passwordRegex, '영문과 숫자를 모두 포함해야 합니다'),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요'),
    role: z.enum(['student', 'instructor']),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  })

export type SignUpValues = z.infer<typeof signUpSchema>

export const useSignUp = () => {
  const { mutate: signupAndLogin, isPending: isLoading } = useSignUpMutation()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      role: 'student',
      phone: {
        first: '010',
        second: '',
        third: '',
      },
      passwordConfirm: '',
    },
  })

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    nextFieldName?: Path<SignUpValues>,
    maxLength: number = 4
  ) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    e.target.value = val // 숫자만 허용

    if (val.length === maxLength && nextFieldName) {
      setFocus(nextFieldName)
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    targetFieldName?: Path<SignUpValues>
  ) => {
    if (e.key === 'Enter' && targetFieldName) {
      e.preventDefault()
      setFocus(targetFieldName)
    }
  }

  const role = useWatch({ control, name: 'role' })

  const onSubmit = (data: SignUpValues) => {
    const phoneString = `${data.phone.first}-${data.phone.second}-${data.phone.third}`

    signupAndLogin(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: phoneString,
        role: data.role.toUpperCase() as 'STUDENT' | 'INSTRUCTOR',
      },
      {
        onError: (err: unknown) => {
          if (axios.isAxiosError(err)) {
            const message = err.response?.data?.message || '회원가입에 실패했습니다.'
            setError('root', { message })
          } else {
            setError('root', {
              message: err instanceof Error ? err.message : '회원가입에 실패했습니다.',
            })
          }
        },
      }
    )
  }

  return {
    register,
    handleSubmit,
    setValue,
    errors,
    role,
    isLoading,
    onSubmit,
    handlePhoneChange,
    handleKeyDown,
  }
}
