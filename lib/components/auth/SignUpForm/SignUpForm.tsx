'use client'

import { Button } from '@/lib/components/ui/Button/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/lib/components/ui/Card/Card'
import { Input } from '@/lib/components/ui/Input/Input'
import { Label } from '@/lib/components/ui/Label/Label'
import { RadioGroup, RadioGroupItem } from '@/lib/components/ui/RadioGroup/RadioGroup'

import { useSignUp } from './SignUpForm.hook'

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    setValue,
    errors,
    role,
    isLoading,
    onSubmit,
    handlePhoneChange,
    handleKeyDown,
  } = useSignUp()

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>필요한 정보를 입력하여 회원가입을 완료하세요.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">이름</Label>
            <Input id="name" placeholder="홍길동" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="example@email.com" {...register('email')} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">휴대폰 번호</Label>
            <div className="flex items-center gap-2">
              <Input
                className="text-center"
                maxLength={3}
                placeholder="010"
                {...register('phone.first', {
                  onChange: (e) => handlePhoneChange(e, 'phone.second', 3),
                })}
                onKeyDown={(e) => handleKeyDown(e, 'phone.second')}
              />
              <span>-</span>
              <Input
                className="text-center"
                maxLength={4}
                placeholder="1234"
                {...register('phone.second', {
                  onChange: (e) => handlePhoneChange(e, 'phone.third', 4),
                })}
                onKeyDown={(e) => handleKeyDown(e, 'phone.third')}
              />
              <span>-</span>
              <Input
                className="text-center"
                maxLength={4}
                placeholder="5678"
                {...register('phone.third', {
                  onChange: (e) => handlePhoneChange(e, undefined, 4),
                })}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500">
                {errors.phone.first?.message ||
                  errors.phone.second?.message ||
                  errors.phone.third?.message ||
                  '휴대폰 번호를 모두 입력해주세요'}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="6~10자, 영문과 숫자 포함"
              {...register('password')}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              {...register('passwordConfirm')}
            />
            {errors.passwordConfirm && (
              <p className="text-sm text-red-500">{errors.passwordConfirm.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>회원 유형</Label>
            <RadioGroup
              defaultValue="student"
              value={role}
              onValueChange={(val) => setValue('role', val as 'student' | 'instructor')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="role-student" />
                <Label htmlFor="role-student">수강생</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instructor" id="role-instructor" />
                <Label htmlFor="role-instructor">강사</Label>
              </div>
            </RadioGroup>
            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
          </div>

          {errors.root && <div className="text-sm text-red-500 mt-2">{errors.root.message}</div>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '가입 중...' : '가입하기'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
