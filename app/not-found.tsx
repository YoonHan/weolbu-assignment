'use client'

import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/lib/components/ui/Button/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="relative flex flex-col items-center text-center">
        {/* Decorative Background Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute -top-12 h-64 w-64 rounded-full bg-primary blur-3xl"
        />

        {/* 404 Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative text-9xl font-extrabold tracking-tighter text-primary/20 sm:text-[12rem]"
        >
          404
        </motion.h1>

        {/* Messaging */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative mt-8 space-y-6"
        >
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            페이지를 찾을 수 없습니다
          </h2>
          <div className="mx-auto max-w-lg space-y-2 text-balance text-muted-foreground">
            <p>요청하신 페이지가 삭제되었거나, 이름이 변경되었을 수 있습니다.</p>
            <p>입력하신 주소가 정확한지 다시 한번 확인해 주세요.</p>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10"
        >
          <Button asChild size="lg" className="rounded-full px-8 shadow-lg hover:shadow-primary/25">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>홈으로 돌아가기</span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
