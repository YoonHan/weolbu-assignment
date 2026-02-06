import axios from 'axios'
import { NextResponse } from 'next/server'

import { serverApiClient } from '@/lib/http/server'

type Context = {
  params: Promise<{ path: string[] }>
}

export async function GET(request: Request, context: Context) {
  return handleProxy(request, context)
}

export async function POST(request: Request, context: Context) {
  return handleProxy(request, context)
}

export async function PUT(request: Request, context: Context) {
  return handleProxy(request, context)
}

export async function DELETE(request: Request, context: Context) {
  return handleProxy(request, context)
}

async function handleProxy(request: Request, context: Context) {
  const { path: pathSegments } = await context.params
  const path = pathSegments.join('/')
  const url = new URL(request.url)
  const searchParams = url.searchParams.toString()
  const targetPath = `/${path}${searchParams ? `?${searchParams}` : ''}`

  try {
    const body = request.method !== 'GET' ? await request.json().catch(() => ({})) : undefined

    console.log({ request, targetPath, body })

    const response = await serverApiClient({
      method: request.method,
      url: targetPath,
      data: body,
    })

    return NextResponse.json(response.data, { status: response.status })
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status })
    }

    console.error('Proxy error:', error)
    return NextResponse.json({ message: 'Proxy request failed' }, { status: 500 })
  }
}
