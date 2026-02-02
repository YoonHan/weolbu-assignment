---
trigger: model_decision
description: When using useEffect() in an React component
---

# React Effects 사용 규칙

## 원칙

**useEffect는 React 패러다임에서 벗어나는 escape hatch입니다.** 외부 시스템(비-React 위젯, 네트워크, 브라우저 DOM 등)과 동기화할 때만 사용해야 합니다. 외부 시스템이 관련되지 않은 경우(예: props나 state 변경에 따라 컴포넌트 state를 업데이트하는 경우) useEffect가 필요하지 않습니다.

불필요한 Effects를 제거하면 코드가 더 이해하기 쉽고, 더 빠르게 실행되며, 오류가 덜 발생합니다.

참고: https://react.dev/learn/you-might-not-need-an-effect

## useEffect를 사용하지 말아야 하는 경우

### 1. 렌더링을 위한 데이터 변환

**❌ 나쁜 예:**

```tsx
const [filteredList, setFilteredList] = useState([])

useEffect(() => {
  setFilteredList(list.filter((item) => item.active))
}, [list])
```

**✅ 좋은 예:**

```tsx
const filteredList = list.filter((item) => item.active)
```

### 2. 사용자 이벤트 처리

**❌ 나쁜 예:**

```tsx
useEffect(() => {
  if (product.isInCart) {
    showNotification(`Added ${product.name} to cart!`)
  }
}, [product])

function handleBuyClick() {
  addToCart(product)
}
```

**✅ 좋은 예:**

```tsx
function handleBuyClick() {
  addToCart(product)
  showNotification(`Added ${product.name} to cart!`)
}
```

### 3. props나 state 기반 state 업데이트

**❌ 나쁜 예:**

```tsx
const [fullName, setFullName] = useState('')

useEffect(() => {
  setFullName(firstName + ' ' + lastName)
}, [firstName, lastName])
```

**✅ 좋은 예:**

```tsx
const fullName = firstName + ' ' + lastName
```

### 4. 비용이 큰 계산 캐싱

**❌ 나쁜 예:**

```tsx
const [visibleTodos, setVisibleTodos] = useState([])

useEffect(() => {
  setVisibleTodos(getFilteredTodos(todos, filter))
}, [todos, filter])
```

**✅ 좋은 예:**

```tsx
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter)
}, [todos, filter])
```

### 5. prop 변경 시 state 리셋

**❌ 나쁜 예:**

```tsx
useEffect(() => {
  setComment('')
}, [userId])
```

**✅ 좋은 예:**

```tsx
<Profile userId={userId} key={userId} />
```

## useEffect를 사용해야 하는 경우

### 1. 외부 시스템과 동기화

- 브라우저 API (예: `navigator.onLine`, `window.addEventListener`)
- 서드파티 라이브러리 (예: jQuery 위젯)
- 타이머 (`setInterval`, `setTimeout`)

**✅ 좋은 예:**

```tsx
useEffect(() => {
  const subscription = subscribe()
  return () => subscription.unsubscribe()
}, [])
```

### 2. 데이터 페칭 (단, React Query 등 더 나은 방법 고려)

**✅ 좋은 예:**

```tsx
useEffect(() => {
  let ignore = false

  fetchData().then((data) => {
    if (!ignore) {
      setData(data)
    }
  })

  return () => {
    ignore = true
  }
}, [query])
```

**⚠️ 참고:** React Query, SWR 등 전용 데이터 페칭 라이브러리를 사용하는 것이 더 좋습니다.

### 3. 컴포넌트가 화면에 표시되었을 때 실행되어야 하는 로직

**✅ 좋은 예:**

```tsx
useEffect(() => {
  post('/analytics/event', { eventName: 'visit_form' })
}, [])
```

## 체크리스트

useEffect를 사용하기 전에 다음을 확인하세요:

1. **렌더링 중에 계산할 수 있나요?** → useEffect 불필요
2. **사용자 이벤트로 인한 로직인가요?** → 이벤트 핸들러로 이동
3. **props나 state로부터 계산할 수 있나요?** → 렌더링 중 계산
4. **외부 시스템과 동기화가 필요한가요?** → useEffect 사용 가능
5. **컴포넌트가 표시되었을 때 실행되어야 하나요?** → useEffect 사용 가능

## 권장 사항

- **데이터 페칭**: React Query, SWR 등 전용 라이브러리 사용
- **외부 스토어 구독**: `useSyncExternalStore` 사용
- **비용이 큰 계산**: `useMemo` 사용
- **이벤트 핸들링**: 이벤트 핸들러에서 직접 처리

## 예외

다음과 같은 경우에는 useEffect 사용이 적절합니다:

- 브라우저 API와의 동기화
- 서드파티 라이브러리와의 통합
- 컴포넌트 마운트 시 한 번만 실행되어야 하는 초기화 로직 (단, cleanup 함수 필수)
- 네트워크 요청 (단, race condition 처리 필수)
