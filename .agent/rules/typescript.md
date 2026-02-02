---
trigger: always_on
---

# TypeScript 규칙

## 설정

- **Strict 모드 활성화**: `tsconfig.json`에서 `strict: true`로 설정되어 있습니다.
- **타입 체크**: 컴파일 타임에 타입 오류를 검사합니다.

## 타입 명시 규칙

### 타입명

- 간결하고 의미가 명확한 이름을 사용합니다.
- 타입 앞에 `I-` prefix를 붙이지 않습니다.

### 필수 타입 명시

- 모든 함수의 매개변수와 반환 타입을 명시합니다.
- 컴포넌트의 props 타입을 명시합니다.
- 변수 선언 시 타입을 추론할 수 없는 경우 명시합니다.

```typescript
// 좋은 예
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

// 나쁜 예
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

### any 타입 지양

- `any` 타입은 사용을 지양합니다.
- 타입을 알 수 없는 경우 `unknown`을 사용하고 타입 가드를 사용합니다.
- 제네릭을 활용하여 타입 안정성을 유지합니다.

```typescript
// 좋은 예
function processData<T>(data: T): T {
  // 처리 로직
  return data
}

// 나쁜 예
function processData(data: any): any {
  return data
}
```

## 타입 정의 가이드라인

### 인터페이스 vs 타입 별칭

- 객체 타입은 `interface`를 우선 사용합니다.
- 유니온 타입, 교차 타입 등은 `type`을 사용합니다.

```typescript
// 인터페이스 사용 (객체 타입)
interface User {
  id: string
  name: string
  email: string
}

// 타입 별칭 사용 (유니온 타입)
type Status = 'pending' | 'completed' | 'failed'
```

### Readonly 사용

- 불변 데이터는 `readonly`를 사용합니다.
- React props는 `Readonly<>` 또는 `ReadonlyArray<>`를 사용할 수 있습니다.

```typescript
interface Config {
  readonly apiUrl: string
  readonly timeout: number
}
```

## 경로 별칭

- `tsconfig.json`에서 `@/*` 별칭이 설정되어 있습니다.
- 상대 경로 대신 절대 경로를 사용합니다.

```typescript
// 좋은 예
import { Button } from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'

// 나쁜 예
import { Button } from '../../components/Button'
import { useAuth } from '../hooks/useAuth'
```

## 타입 가드

- 타입을 좁히기 위해 타입 가드를 사용합니다.
- `typeof`, `instanceof`, 커스텀 타입 가드 함수를 활용합니다.

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function processValue(value: unknown) {
  if (isString(value)) {
    // 여기서 value는 string 타입으로 좁혀짐
    console.log(value.toUpperCase())
  }
}
```

## 제네릭 활용

- 재사용 가능한 타입을 만들기 위해 제네릭을 활용합니다.
- 제네릭에 제약 조건을 추가하여 타입 안정성을 높입니다.

```typescript
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

function fetchUser<T extends { id: string }>(id: string): Promise<ApiResponse<T>> {
  // API 호출 로직
}
```

## 타입 유틸리티 활용

- TypeScript의 내장 타입 유틸리티를 활용합니다.
- `Partial<>`, `Pick<>`, `Omit<>`, `Required<>` 등을 적절히 사용합니다.

```typescript
interface User {
  id: string
  name: string
  email: string
  age?: number
}

type UserUpdate = Partial<Pick<User, 'name' | 'email'>>
type UserRequired = Required<User>
```
