---
trigger: model_decision
description: When writing Tanstack React Query's options for queries and mutations.
---

# React Query 규칙

- 모든 query 및 mutation 파일은 `queries/**` 디렉터리에 위치합니다.
  `queries` 디렉터리의 하위 디렉터리 구조는 API endpoint depth를 따라갑니다.

예시)

```
queries/
├── users/
│   ├── query.ts
│   ├── mutation.ts
│   ├── type.ts
│   └── constant.ts
└── search/
    ├── query.ts
    └── type.ts
```

- query의 경우 상황에 따라 useQuery/useSuspenseQuery/useInfiniteQuery/useSuspenseInfiniteQuery 중에 가장 적합한 것을 선택해 사용하세요.
- query가 conditional하게 실행되지 않도록 주의하세요.

```typescript
// Bad
if (!query.trim()) {
  return <EmptyStateMessage message="검색어를 입력해주세요" />;
}

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useSuspenseInfiniteQuery(searchDocumentsInfiniteQueryOptions({ query }));
```

## 설정

- **Provider 위치**: `app/providers.tsx`에서 QueryClientProvider가 설정되어 있습니다.
- **기본 설정**:
  - `staleTime`: 60초 (60 \* 1000ms)
  - `refetchOnWindowFocus`: false

## 기본 사용법

```tsx
// API_ENDPOINTS 상수 (constants/api.ts)
export const API_ENDPOINTS = {
  users: {
    index: '/users', // /users
    id: (id: string) => `/users/${id}`, // /users/[id]
    posts: {
      index: '/users/posts',
      id: (id: string) => `/users/posts/${id}`, // /users/posts/[id]
    },
  },
}

// API fetcher 함수 (apis/**.ts)
export const fetchUser = async () => {
  const response = await httpClient.get(API_ENDPOINTS.users.index, {
    params: {
      query,
    },
  })
}

// 검색 결과 쿼리 옵션 factory (queries/**/query.ts)
export const userQueryKeys = ({ userId }: { userId: string }) => [API_ENDPOINTS.users.id(userId)]

export const userQuery = ({ userId }: { userId: string }) =>
  queryOptions({
    queryKey: userQueryKeys(userId),
    queryFn: () => fetchUser({ params: userId }),
  })

// 사용
export function UserProfile({ query }: { query: string }) {
  const { data, isLoading, error } = useQuery(userQuery({ userId }))

  return <div>...</div>
}
```

## API 타입 네이밍 규칙

- API 응답 타입: `Res***` 접두사 사용
  - 예: `ResSearchDocuments`, `ResUserProfile`
- API 요청 타입: `Req***` 접두사 사용
  - 예: `ReqCreateUser`, `ReqUpdateBookmark`

## API fetcher 함수 작성

- API fetcher 함수 내에서 에러를 적절히 처리합니다.
- API fetcher 함수의 반환 타입을 명시합니다.
- API 응답을 검증합니다.

```typescript
interface User {
  id: string
  name: string
  email: string
}

async function fetchUser(userId: string): Promise<User> {
  const response = await httpClient.get(API_ENDPOINTS.users.index, {
    params: {
      query,
    },
  })

  if (!response.status === 200) {
    throw new Error(`Failed to fetch user: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}
```

## 뮤테이션 작성

- 데이터 변경 작업은 mutation을 사용합니다.
- 성공 시 관련 query를 invalidate 처리하여 자동으로 refetch합니다. Query Client 불변 객체는 `shared/Providers/Providers.tsx` 에 있습니다.
- UI 업데이트 정책은 별도의 지시가 없는 한 Optimistic Update 정책을 따릅니다.
- **useMutation 사용 시 반드시 구조 분해 할당으로 `mutateAsync`를 추출하여 명시적인 이름을 부여해야 합니다.**

```typescript
export const updateUserMutation = mutationOptions({
  mutationFn: (data: UpdateUserData) => updateUser(userId, data),
  onSuccess: () => {
    // 관련 쿼리 무효화
    queryClient.invalidateQueries({ queryKey: userQueryKeys({ userId }) });
  },
});

// 사용
export function UpdateUserForm({ userId }: { userId: string }) {
  // ✅ 좋은 예: mutateAsync를 구조 분해 할당으로 추출하여 명시적인 이름 부여
  const { mutateAsync: updateUser } = useMutation(updateUserMutation);

  const handleSubmit = async (data: UpdateUserData) => {
    await updateUser(data, {
      onSuccess: () => {} // optional
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 내용 */}
    </form>
  );
}

// ❌ 나쁜 예: mutation 객체 전체를 변수에 할당
export function UpdateUserForm({ userId }: { userId: string }) {
  const updateUserMutation = useMutation(updateUserMutation);

  const handleSubmit = async (data: UpdateUserData) => {
    await updateUserMutation.mutateAsync(data); // 명시적이지 않음
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## 로딩 및 에러 상태 처리

### 로딩 상태

가능한 <Suspense> 컴포넌트를 사용하여 로딩 상태 UI 관심사를 분리합니다.

```tsx
// 상위 컴포넌트

export function Parent() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <ComponentWithQuery />
    </Suspense>
  )
}

// 하위 컴포넌트
export function ComponentWithQuery({ userId }: { userId: string }) {
  const { data } = useSuspenseQuery(userQuery)

  return <div></div>
}
```

### 에러 상태

- 가능한 <ErrorBoundary> 컴포넌트를 사용하여 에러 상태 UI 관심사를 분리합니다.
- 사용자에게 명확한 에러 메시지를 표시합니다.

```tsx
// 상위 컴포넌트

export function Parent() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <Component />
    </ErrorBoundary>
  )
}

// 하위 컴포넌트
export function Component({ userId }: { userId: string }) {
  // something went wrong

  return <div></div>
}
```
