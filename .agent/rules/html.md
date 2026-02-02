---
trigger: model_decision
description: When writing markups
---

# HTML 규칙

## 기본 원칙

- **시맨틱 HTML**: 의미 있는 HTML 태그를 사용하여 문서 구조를 명확하게 표현합니다.
- **접근성 우선**: 모든 사용자가 접근 가능한 마크업을 작성합니다.
- **Next.js 최적화**: Next.js의 최적화된 컴포넌트를 우선 사용합니다.

## 시맨틱 HTML

### 적절한 태그 사용

- 컨텐츠의 의미에 맞는 HTML 태그를 사용합니다.
- `<div>` 남용을 지양하고, `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` 등을 적절히 사용합니다.

```tsx
// 좋은 예
<main>
  <header>
    <h1>페이지 제목</h1>
  </header>
  <section>
    <article>
      {/* 컨텐츠 */}
    </article>
  </section>
</main>

// 나쁜 예
<div>
  <div>
    <div>페이지 제목</div>
  </div>
  <div>
    <div>
      {/* 컨텐츠 */}
    </div>
  </div>
</div>
```

### 제목 계층 구조

- `<h1>`은 페이지당 하나만 사용합니다.
- 제목 계층 구조(`h1` → `h2` → `h3`...)를 올바르게 유지합니다.
- 스타일링을 위해 제목 태그를 건너뛰지 않습니다.

```tsx
// 좋은 예
<h1>메인 제목</h1>
<h2>섹션 제목</h2>
<h3>하위 제목</h3>

// 나쁜 예
<h1>메인 제목</h1>
<h3>섹션 제목</h3> {/* h2를 건너뜀 */}
```

## 이미지 처리

### Next.js Image 컴포넌트 사용

- 모든 이미지는 Next.js의 `Image` 컴포넌트를 사용합니다.
- `alt` 속성은 필수이며, 의미 있는 설명을 제공합니다.
- `width`와 `height` 속성을 명시하여 레이아웃 시프트를 방지합니다.

```tsx
import Image from "next/image";

// 좋은 예
<Image
  src="/assets/logo.svg"
  alt="Liner 로고"
  width={265}
  height={64}
  priority // 중요한 이미지의 경우
/>

// 나쁜 예
<img src="/assets/logo.svg" alt="" /> {/* alt가 비어있음 */}
```

### 이미지 최적화

- 중요한 이미지는 `priority` 속성을 사용하여 우선 로딩합니다.
- 로고, 히어로 이미지 등 첫 화면에 보이는 이미지에 `priority`를 적용합니다.
- `loading="lazy"`는 기본적으로 적용되므로 명시하지 않아도 됩니다.

```tsx
// 좋은 예: 첫 화면 로고
<Image src="/assets/liner-logo.svg" alt="Liner Logo" width={265} height={64} priority />
```

## 접근성 (A11y)

### ARIA 속성

- 시맨틱 HTML로 충분한 경우 ARIA 속성을 추가하지 않습니다.
- 시맨틱 HTML로 표현할 수 없는 경우에만 ARIA 속성을 사용합니다.

```tsx
// 좋은 예: 시맨틱 HTML 사용
<button onClick={handleClick}>클릭</button>

// 좋은 예: 시맨틱 HTML로 표현 불가능한 경우
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  aria-label="메뉴 열기"
>
  <span className="sr-only">메뉴</span>
</div>
```

### 키보드 네비게이션

- 모든 인터랙티브 요소는 키보드로 접근 가능해야 합니다.
- `tabIndex`를 사용할 때는 `0` 또는 `-1`만 사용합니다 (양수 값 지양).

```tsx
// 좋은 예
<button onClick={handleClick}>클릭</button>

// 좋은 예: 커스텀 인터랙티브 요소
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  }}
>
  클릭 가능한 요소
</div>
```

### 포커스 관리

- 포커스 가능한 요소는 명확한 포커스 표시를 가져야 합니다.
- TailwindCSS의 `focus:` 유틸리티를 사용하여 포커스 스타일을 정의합니다.

```tsx
// 좋은 예
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500">클릭</button>
```

### 스크린 리더 지원

- 중요한 정보는 `sr-only` 클래스를 사용하여 스크린 리더에만 제공할 수 있습니다.
- 아이콘만 있는 버튼은 `aria-label`을 제공합니다.

```tsx
// 좋은 예
<button aria-label="검색">
  <Image src="/assets/icon-search.svg" alt="" width={24} height={24} />
</button>

// 좋은 예: 추가 설명이 필요한 경우
<button>
  <Image src="/assets/icon-search.svg" alt="" width={24} height={24} />
  <span className="sr-only">검색하기</span>
</button>
```

## 폼 요소

### 라벨 연결

- 모든 입력 필드는 `<label>`과 연결되어야 합니다.
- `htmlFor`와 `id`를 사용하여 연결하거나, `<label>`로 감싸는 방식을 사용합니다.

```tsx
// 좋은 예: htmlFor/id 사용
<label htmlFor="search-input">검색어</label>
<input id="search-input" type="text" />

// 좋은 예: label로 감싸기
<label>
  검색어
  <input type="text" />
</label>

// 나쁜 예: label 없음
<input type="text" placeholder="검색어" />
```

### 필수 입력 표시

- 필수 입력 필드는 `required` 속성과 함께 시각적 표시를 제공합니다.

```tsx
// 좋은 예
<label htmlFor="email">
  이메일 <span aria-label="필수">*</span>
</label>
<input id="email" type="email" required />
```

## 링크와 버튼

### 적절한 요소 사용

- 네비게이션은 `<a>` 태그를 사용합니다.
- 액션(제출, 삭제 등)은 `<button>` 태그를 사용합니다.
- 링크처럼 보이지만 액션인 경우도 `<button>`을 사용합니다.

```tsx
// 좋은 예: 네비게이션
<a href="/search">검색 결과로 이동</a>

// 좋은 예: 액션
<button onClick={handleSubmit}>제출</button>

// 나쁜 예: 링크처럼 보이지만 액션
<a onClick={handleSubmit}>제출</a>
```

### 외부 링크

- 외부 링크는 `target="_blank"`와 함께 `rel="noopener noreferrer"`를 추가합니다.

```tsx
// 좋은 예
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  외부 링크
</a>
```

## 리스트

### 적절한 리스트 태그 사용

- 순서가 있는 리스트는 `<ol>`을 사용합니다.
- 순서가 없는 리스트는 `<ul>`을 사용합니다.
- 단순 스타일링을 위해 리스트 태그를 남용하지 않습니다.

```tsx
// 좋은 예
<ul>
  <li>항목 1</li>
  <li>항목 2</li>
</ul>

// 나쁜 예: 단순 스타일링을 위한 리스트
<ul className="flex">
  <li>항목 1</li>
  <li>항목 2</li>
</ul>
```

## 메타데이터

### 문서 언어

- `app/layout.tsx`에서 `lang` 속성을 올바르게 설정합니다.

```tsx
// 좋은 예
<html lang="ko">{/* 내용 */}</html>
```

### 메타 태그

- Next.js의 `Metadata` API를 사용하여 메타데이터를 관리합니다.
- SEO를 위한 적절한 메타 태그를 설정합니다.

```tsx
// app/layout.tsx 또는 page.tsx
export const metadata: Metadata = {
  title: '페이지 제목',
  description: '페이지 설명',
}
```

## 성능 최적화

### 불필요한 마크업 제거

- 불필요한 중첩 `<div>`를 제거합니다.
- 의미 없는 래퍼 요소를 최소화합니다.

```tsx
// 좋은 예
<main>
  <section>
    <h2>제목</h2>
    <p>내용</p>
  </section>
</main>

// 나쁜 예: 불필요한 중첩
<div>
  <main>
    <div>
      <section>
        <div>
          <h2>제목</h2>
          <div>
            <p>내용</p>
          </div>
        </div>
      </section>
    </div>
  </main>
</div>
```

## 모바일 고려사항

### 뷰포트 메타 태그

- Next.js는 자동으로 뷰포트 메타 태그를 추가하므로 별도 설정이 필요 없습니다.
- 필요시 `app/layout.tsx`에서 커스터마이징할 수 있습니다.
