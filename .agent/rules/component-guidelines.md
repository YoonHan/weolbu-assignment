---
trigger: model_decision
description: When creating a new component or updating existing component(s)
---

# 컴포넌트 작성 규칙

- **React Server Components**: 기본적으로 Server Components를 사용합니다
- **클라이언트 컴포넌트**: 인터랙티브 기능이 필요한 경우 `"use client"` 지시어를 사용합니다
- **함수형 컴포넌트**: 클래스 컴포넌트 대신 함수형 컴포넌트를 사용합니다
- **TypeScript 타입 명시**: 모든 컴포넌트의 props와 반환 타입을 명시합니다
- **명확한 네이밍**: AI 생성 주석을 최소화하고, 명확한 변수명과 함수명을 사용합니다
- **cn() 함수 필수**: 모든 `className` 속성에는 반드시 `cn()` 함수를 사용해야 합니다 (자세한 내용은 [TailwindCSS 규칙](./tailwindcss.mdc) 참조)

## Props 순서 규칙

컴포넌트의 props는 다음 순서로 작성합니다:

1. **Native element 속성** (가장 위)
   - `id`, `aria-label`, `aria-describedby` 등 접근성 속성
   - `data-*` 속성
   - 기타 HTML 표준 속성

2. **className** (prop보다 상위)
   - `className` 속성은 항상 커스텀 props보다 먼저 위치합니다
   - 여러 영역에 대한 className을 외부에서 커스터마이징할 수 있는 경우, `className` prop은 객체 타입으로 받아서 사용하는 쪽에서 명시적으로 다룰 수 있게 합니다
   - 예: `className?: { overlay?: string; content?: string }`

3. **커스텀 props**
   - 컴포넌트에서 정의한 커스텀 props
   - 예: `size`, `variant` 등

4. **이벤트 핸들러** (항상 마지막)
   - `onClick`, `onChange`, `onSubmit`, `onClose` 등 모든 이벤트 핸들러
   - 컴포넌트 인터페이스 정의 시에도 핸들러는 항상 마지막에 위치해야 합니다

## Hook Return Property 순서 규칙

Hook의 return 객체는 다음 순서로 작성합니다:

1. **상태 값** (가장 위)
   - `useState`, `useRef` 등으로 관리되는 상태 값
   - 예: `isScrolled`, `data`, `ref` 등

2. **함수** (항상 마지막)
   - 모든 함수는 return 객체의 마지막에 위치해야 합니다
   - 예: `handleClick`, `fetchNextPage`, `reset` 등

```tsx
// 좋은 예
export function useScroll() {
  const [isScrolled, setIsScrolled] = useState(false)

  return {
    isScrolled,
    handleScroll, // 함수는 마지막
  }
}

export function useInfiniteQuery() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchNextPage = () => {
    /* ... */
  }
  const reset = () => {
    /* ... */
  }

  return {
    data, // 상태 값
    isLoading, // 상태 값
    fetchNextPage, // 함수
    reset, // 함수 (마지막)
  }
}

// 나쁜 예: 함수가 상태 값 앞에 위치
export function useScroll() {
  const [isScrolled, setIsScrolled] = useState(false)

  return {
    handleScroll, // 함수가 먼저
    isScrolled, // 상태 값이 나중
  }
}
```

```tsx
// 좋은 예
<IconButton
  aria-label="뒤로 가기"
  className={cn("-ml-2")}
  variant="ghost"
  onClick={handleBack}
>
  ...
</IconButton>

<input
  type="text"
  className={cn("flex-1 py-3 pr-4 outline-none", "placeholder:text-gray-300")}
  placeholder="Search keyword"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
/>

// 나쁜 예: className이 prop 뒤에 위치
<IconButton
  aria-label="뒤로 가기"
  variant="ghost"
  className={cn("-ml-2")}
  onClick={handleBack}
>
  ...
</IconButton>
```

## className 객체 타입 사용 규칙

여러 영역에 대한 className을 외부에서 커스터마이징할 수 있는 컴포넌트의 경우, `className` prop은 객체 타입으로 받아서 사용하는 쪽에서 명시적으로 다룰 수 있게 합니다.

```tsx
// 좋은 예: 여러 영역에 대한 className을 객체로 받음
interface DialogProps {
  open: boolean
  className?: {
    overlay?: string
    content?: string
  }
  onClose: () => void
}

export default function Dialog({ open, className, onClose }: DialogProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        'flex items-center justify-center',
        'bg-black/50',
        className?.overlay
      )}
    >
      <div className={cn('relative', 'bg-white', 'rounded-2xl', className?.content)}>
        {/* 내용 */}
      </div>
    </div>
  )
}

// 사용 예시
;<Dialog
  open={isOpen}
  className={{
    overlay: 'bg-black/60',
    content: 'max-w-lg',
  }}
  onClose={handleClose}
/>

// 나쁜 예: 단일 string으로 받아서 명확하지 않음
interface DialogProps {
  className?: string // 어떤 영역에 적용되는지 불명확
  overlayClassName?: string // prop이 많아짐
  contentClassName?: string
}
```
