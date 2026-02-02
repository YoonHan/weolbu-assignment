---
trigger: model_decision
description: When writing TailwindCSS utility classes(for styling components)
---

# TailwindCSS 규칙

## 기본 원칙

- **유틸리티 우선**: TailwindCSS의 유틸리티 클래스를 우선 사용합니다. 하지만 기본 제공되는 유틸리티 클래스로 요구 사항을 표현할 수 없는 경우, 직접적인 값(e.g HEX color)을 css variable로 만들어서 사용합니다.
- **인라인 스타일 지양**: 인라인 스타일(`style` 속성) 사용을 지양합니다.
- **커스텀 CSS 최소화**: 커스텀 CSS는 `app/globals.css`에만 추가합니다.
- **cn() 함수 필수**: 모든 `className` 속성에는 반드시 `cn()` 함수를 사용해야 합니다. 문자열 리터럴이나 템플릿 리터럴을 직접 사용하지 않습니다.

## 클래스 작성 규칙

### 클래스 순서

- 레이아웃 관련 클래스 → 크기 관련 클래스 → 색상 관련 클래스 → 기타 순서로 작성합니다.

```tsx
import { cn } from "@/utils/cn";

// 좋은 예: cn() 함수 사용 및 속성별 그룹핑
<div
  className={cn(
    "flex items-center justify-between",
    "w-full h-12",
    "bg-white text-gray-900",
    "rounded-lg shadow-md",
  )}
>
  {/* 내용 */}
</div>

// 나쁜 예: 문자열 리터럴 직접 사용
<div className="bg-white flex rounded-lg w-full h-12 text-gray-900 items-center justify-between shadow-md">
  {/* 내용 */}
</div>
```

### 반응형 디자인

- **모바일 우선**: 기본 스타일은 모바일을 기준으로 작성합니다.
- 반응형 브레이크포인트는 필요시에만 사용합니다 (모바일 타겟이므로 제한적).
- 최대 너비 768px 제한 내에서만 작동합니다.

```tsx
import { cn } from '@/utils/cn'

// 모바일 우선 접근
;<div className={cn('text-sm md:text-base lg:text-lg')}>
  {/* 모바일: text-sm, 768px 이상: text-base */}
</div>
```

### cn() 함수 사용 (필수)

- **모든 className에는 반드시 `cn()` 함수를 사용해야 합니다.**
- `cn()` 함수는 `@/utils/cn`에서 import합니다.
- **성격이 다른 utility class들은 서로 다른 인자로 분리해야 합니다.**
  - 예: 레이아웃/정렬, 크기, 색상, 간격, 기타 등은 각각 별도 인자로 분리
  - 같은 성격의 클래스들만 하나의 문자열로 묶을 수 있습니다

```tsx
import { cn } from "@/utils/cn";

// 좋은 예: cn() 함수 사용
function Button({ variant, disabled }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded",
        variant === "primary" && "bg-blue-500 text-white",
        variant === "secondary" && "bg-gray-200 text-gray-900",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      Click me
    </button>
  );
}

// 좋은 예: 성격별로 분리 (같은 성격의 클래스는 하나의 문자열로 묶을 수 있음)
<div
  className={cn(
    "flex items-center justify-between", // 레이아웃/정렬
    "w-full h-12",                      // 크기
    "bg-white text-gray-900",            // 색상
    "px-4 py-2",                        // 간격
    "rounded-lg shadow-md",             // 기타
  )}
>
  {/* 내용 */}
</div>

// 좋은 예: 성격이 다른 클래스는 각각 별도 인자로 분리
<div className={cn("mx-auto", "max-w-[768px]", "bg-white")}>
  {/* mx-auto: 정렬, max-w-[768px]: 크기, bg-white: 색상 */}
</div>

// 나쁜 예: 성격이 다른 클래스를 하나의 문자열로 묶음
<div className={cn("mx-auto max-w-[768px] bg-white")}>
  {/* 정렬, 크기, 색상이 모두 섞여 있음 */}
</div>

// 나쁜 예: 문자열 리터럴 직접 사용
<div className="flex items-center justify-between w-full h-12 bg-white">
  {/* 내용 */}
</div>

// 나쁜 예: 템플릿 리터럴 사용
<div className={`flex ${isActive ? "bg-blue-500" : "bg-gray-200"}`}>
  {/* 내용 */}
</div>
```

### 조건부 클래스

- 조건부 클래스는 `cn()` 함수 내에서 처리합니다.
- `cn()` 함수는 조건부 클래스와 속성별 그룹핑을 모두 지원합니다.

```tsx
import { cn } from '@/utils/cn'

function Button({ variant, disabled }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-900',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      Click me
    </button>
  )
}
```

## 커스텀 스타일

### globals.css 사용

- 프로젝트 전역에 적용되는 커스텀 스타일은 `app/globals.css`에 추가합니다.
- TailwindCSS의 `@apply` 지시어를 사용하여 유틸리티 클래스를 재사용할 수 있습니다.

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
  }
}
```

### 커스텀 색상

- 프로젝트 전용 색상이 필요한 경우 `tailwind.config.ts`에서 확장합니다.

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
}
```

## 모바일 레이아웃 고려사항

### 뷰포트 제한

- 모든 컴포넌트는 최대 너비 768px, 최소 너비 360px 내에서 작동해야 합니다.
- 패딩과 마진은 모바일 화면을 고려하여 설정합니다.

```tsx
import { cn } from "@/utils/cn";

// 좋은 예: 모바일 친화적인 패딩
<div className={cn("px-4 py-6 md:px-6 md:py-8")}>
  {/* 내용 */}
</div>

// 나쁜 예: 데스크톱 중심의 큰 패딩
<div className={cn("px-24 py-32")}>
  {/* 내용 */}
</div>
```

### 터치 친화적 UI

- 버튼과 클릭 가능한 요소는 최소 44x44px 크기를 유지합니다.
- 터치 영역을 충분히 확보합니다.

```tsx
import { cn } from '@/utils/cn'

// 좋은 예
;<button className={cn('px-6 py-3 min-h-[44px] min-w-[44px]')}>Click me</button>
```

## 성능 최적화

### 불필요한 클래스 제거

- 사용하지 않는 클래스를 제거하여 번들 크기를 줄입니다.
- TailwindCSS의 JIT 모드가 자동으로 사용된 클래스만 포함합니다.

### 다크 모드 (필요시)

- 다크 모드가 필요한 경우 `dark:` 접두사를 사용합니다.
- `tailwind.config.ts`에서 다크 모드 설정을 활성화합니다.

```tsx
import { cn } from '@/utils/cn'
;<div className={cn('bg-white dark:bg-gray-900 text-gray-900 dark:text-white')}>{/* 내용 */}</div>
```

## 접근성

### 색상 대비

- WCAG 가이드라인을 준수하여 충분한 색상 대비를 유지합니다.
- 텍스트와 배경색의 대비 비율을 확인합니다.

```tsx
import { cn } from "@/utils/cn";

// 좋은 예: 충분한 대비
<div className={cn("bg-white text-gray-900")}>
  {/* 내용 */}
</div>

// 나쁜 예: 낮은 대비
<div className={cn("bg-gray-300 text-gray-400")}>
  {/* 내용 */}
</div>
```

### 포커스 상태

- 키보드 네비게이션을 위한 포커스 스타일을 명시합니다.

```tsx
import { cn } from '@/utils/cn'
;<button className={cn('focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2')}>
  Click me
</button>
```
