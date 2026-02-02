---
trigger: model_decision
description: When creating a new file or updating/moving existing files.
---

# 파일 구조 규칙

## 디렉터리 구조

### App Router (`app/`)

- Next.js App Router 전용 디렉터리입니다.
- `page.tsx`, `layout.tsx`, `route.ts` 등 Next.js 내장 기능만 포함합니다.
- 얇은 레이어로 유지하며, 실제 컴포넌트 로직은 `components/` 디렉터리에 배치합니다.

### Components (`components/`)

모든 컴포넌트는 `components/` 디렉터리에서 관리됩니다.

#### `components/ui/`

디자인 시스템 컴포넌트를 관리합니다. 재사용 가능한 기본 UI 컴포넌트들이 여기에 속합니다.

#### `components/shared/`

여러 페이지에서 공통으로 사용되는 컴포넌트를 관리합니다.

#### `components/page/`

특정 페이지에 속한 컴포넌트를 관리합니다. 각 페이지별로 디렉터리가 생성됩니다.
페이지 컴포넌트는 반드시 `-Page` postfix를 포함해야 합니다 (예: `HomePage`, `SearchPage`).

#### 컴포넌트 디렉터리 구조

각 컴포넌트는 독립적인 디렉터리로 관리되며, 관련된 모든 파일을 포함합니다:

```
components/[category]/[ComponentName]/
├── [ComponentName].tsx          # 메인 컴포넌트 파일
├── [ComponentName].hook.ts       # 컴포넌트 전용 hook (선택사항)
├── [ComponentName].constants.ts  # 컴포넌트 상수 (선택사항)
└── [ComponentName].type.ts      # 컴포넌트 타입 정의 (선택사항)
```

### Hooks (`hooks/`)

프로젝트 전역에서 사용되는 커스텀 React Hook을 관리합니다.
컴포넌트 전용 hook은 해당 컴포넌트 디렉터리 내부에 위치합니다.

### Constants (`constants/`)

프로젝트 전역에서 사용되는 상수 파일을 관리합니다.

### Utils (`utils/`)

프로젝트 전역에서 사용되는 유틸리티 함수 파일을 관리합니다.

### Types (`types/`)

프로젝트 전역 타입 정의 파일을 관리합니다.

## 네이밍 규칙

- **디렉터리명**: PascalCase (예: `Button`, `SearchBar`)
- **컴포넌트 파일**: `[ComponentName].tsx`
- **관련 파일**: `[ComponentName].[type].ts` (hook, constants, type)
- **TypeScript 사용**: 모든 파일은 `.ts` 또는 `.tsx` 확장자를 사용합니다.
- **페이지 컴포넌트**: `components/page/` 디렉터리에 있는 페이지 컴포넌트는 반드시 `-Page` postfix를 포함해야 합니다 (예: `HomePage`, `SearchPage`)

## Barrel File 금지

- `index.ts` 또는 `index.tsx` 파일을 사용한 barrel export는 사용하지 않습니다.
- 각 파일을 직접 import하여 사용합니다.

```tsx
// 좋은 예
import DialogHeader from '@/components/ui/Dialog/DialogHeader'

// 나쁜 예: barrel file 사용
import { DialogHeader } from '@/components/ui/Dialog'
```

## 경로 별칭

- `@/*` 별칭을 사용하여 절대 경로로 import할 수 있습니다.
- 예시:
  - `@/components/ui/Button/Button`
  - `@/components/ui/Dialog/Dialog`
  - `@/components/shared/SearchBar/SearchBar`
  - `@/components/page/HomePage/HomePage`
  - `@/hooks/useResizeObserver`
  - `@/constants/api`
  - `@/utils/http`
