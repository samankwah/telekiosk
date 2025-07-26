# Skeleton Loader Implementation Guide

This application now includes skeleton loaders to provide better user experience during content loading.

## Available Skeleton Components

### 1. CardSkeleton
For service cards, news cards, and similar components
```jsx
import { CardSkeleton } from '../components/ui/SkeletonLoader';

<CardSkeleton count={3} />
```

### 2. ServiceDetailSkeleton
For detailed service pages
```jsx
import { ServiceDetailSkeleton } from '../components/ui/SkeletonLoader';

<ServiceDetailSkeleton />
```

### 3. NewsListSkeleton
For news and events listings
```jsx
import { NewsListSkeleton } from '../components/ui/SkeletonLoader';

<NewsListSkeleton count={6} />
```

### 4. HealthTipsSkeleton
For health and wellness tips grid
```jsx
import { HealthTipsSkeleton } from '../components/ui/SkeletonLoader';

<HealthTipsSkeleton count={9} />
```

### 5. HeroSkeleton
For hero sections
```jsx
import { HeroSkeleton } from '../components/ui/SkeletonLoader';

<HeroSkeleton />
```

### 6. HeaderSkeleton
For navigation/header areas
```jsx
import { HeaderSkeleton } from '../components/ui/SkeletonLoader';

<HeaderSkeleton />
```

### 7. TextSkeleton & ButtonSkeleton
For individual text and button elements
```jsx
import { TextSkeleton, ButtonSkeleton } from '../components/ui/SkeletonLoader';

<TextSkeleton lines={3} />
<ButtonSkeleton width={120} height={40} />
```

## Loading Hooks

### useLoading Hook
Simple loading state with timeout
```jsx
import { useLoading } from '../hooks/useLoading';

function MyComponent() {
  const isLoading = useLoading(2000); // 2 seconds
  
  return (
    <div>
      {isLoading ? <CardSkeleton /> : <ActualContent />}
    </div>
  );
}
```

### useMultipleLoading Hook
For multiple sections with different loading times
```jsx
import { useMultipleLoading } from '../hooks/useLoading';

function MyComponent() {
  const loading = useMultipleLoading({
    header: 500,
    content: 1500,
    sidebar: 2000
  });
  
  return (
    <div>
      {loading.header ? <HeaderSkeleton /> : <Header />}
      {loading.content ? <CardSkeleton /> : <Content />}
      {loading.sidebar ? <TextSkeleton /> : <Sidebar />}
    </div>
  );
}
```

### useAsyncLoading Hook
For real async data loading
```jsx
import { useAsyncLoading } from '../hooks/useLoading';

function MyComponent() {
  const { isLoading, data, error } = useAsyncLoading(
    async () => {
      const response = await fetch('/api/data');
      return response.json();
    },
    [] // dependencies
  );
  
  if (isLoading) return <CardSkeleton />;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{/* render data */}</div>;
}
```

## Implemented Pages

The following pages now have skeleton loaders:

1. **HealthWellnessPage** - Shows HealthTipsSkeleton for 1.5 seconds
2. **AllNewsEventsPage** - Shows NewsListSkeleton for 1.2 seconds  
3. **ServicesPage** - Shows ServiceDetailSkeleton for 1 second

## Customization

### Theming
You can customize skeleton colors by modifying the SkeletonTheme:
```jsx
<SkeletonTheme baseColor="#your-base-color" highlightColor="#your-highlight-color">
  <CardSkeleton />
</SkeletonTheme>
```

### Custom Skeletons
Create custom skeleton components by using the base Skeleton component:
```jsx
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function CustomSkeleton() {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="your-container">
        <Skeleton height={40} className="mb-4" />
        <Skeleton count={3} />
      </div>
    </SkeletonTheme>
  );
}
```

## Best Practices

1. **Match Real Content**: Skeleton should closely resemble the actual content structure
2. **Appropriate Timing**: Keep loading times reasonable (1-3 seconds)
3. **Consistent Colors**: Use theme colors that match your design
4. **Responsive**: Ensure skeletons work on all screen sizes
5. **Accessibility**: Skeletons should not interfere with screen readers

## Performance Tips

- Use skeleton loaders for perceived performance improvement
- Consider using them for slow network requests
- Don't overuse - only for sections that take time to load
- Combine with actual loading states for real async operations