# UI Layer (src/ui/)

## Overview

The **UI Layer** contains all visual components, containers, and styling. This layer is responsible for rendering the user interface and handling user interactions.

## Purpose

- Provide **reusable UI components** (buttons, inputs, cards)
- Create **smart containers** that connect UI to business logic
- Maintain **consistent design system** through theme
- Ensure **accessibility** and **responsive design**

## Structure

```
ui/
├── components/                       # Reusable presentational components
│   ├── Accordion.tsx                 # Expandable content sections
│   ├── Badge.tsx                     # Small status indicators
│   ├── BottomSheet.tsx               # Modal bottom sheets
│   ├── BottomSheetMap.tsx            # Bottom sheet with map
│   ├── Box.tsx                       # Layout container with spacing
│   ├── Button.tsx                    # Primary action button
│   ├── CategoryBadge.tsx             # Category indicator
│   ├── CityCard.tsx                  # City preview card
│   ├── Divider.tsx                   # Visual separator
│   ├── Icon.tsx                      # Icon wrapper
│   ├── IconButton.tsx                # Icon-only button
│   ├── Screen.tsx                    # Screen wrapper with safe areas
│   ├── SearchInput.tsx               # Search text input
│   ├── Text.tsx                      # Themed text component
│   └── TextInput.tsx                 # Form text input
├── containers/                       # Smart components with business logic
│   ├── BottomSheetMap.tsx            # Map with city markers
│   ├── CityDetailsHeader.tsx         # City detail header section
│   ├── CityDetailsInfo.tsx           # City information section
│   ├── CityDetailsMap.tsx            # City location map
│   ├── CityDetailsRelatedCities.tsx  # Related cities carousel
│   ├── CityDetailsTouristAttractions.tsx # Tourist attractions list
│   ├── CityFilter.tsx                # City filtering UI
│   ├── Header.tsx                    # App header with navigation
│   ├── Logo.tsx                      # App logo component
│   └── TextLink.tsx                  # Navigational text link
└── theme/                            # Design system and theming
    ├── theme.ts                      # Theme tokens and configuration
    └── useAppTheme.ts                # Theme hook
```

## Component Architecture

### Presentational Components (`components/`)

**Pure, reusable UI components** with no business logic.

**Characteristics**:

- Receive data via props
- No API calls or domain operations
- No direct context usage (except theme)
- Highly reusable across screens
- Focused on visual presentation

```typescript
// Good example: Pure presentational component
export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  const theme = useAppTheme();

  return (
    <Pressable style={[styles.button, styles[variant]]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}
```

### Container Components (`containers/`)

**Smart components** that connect UI to business logic.

**Characteristics**:

- Use domain operations (hooks)
- Fetch and manage data
- Handle user interactions
- Compose presentational components
- Screen-specific or feature-specific

```typescript
// Good example: Smart container component
export function CityDetailsInfo({ cityId }: Props) {
  const { data: city, isLoading } = useCityFindById(cityId);
  const { data: relatedCities } = useRelatedCities(cityId);

  if (isLoading) return <LoadingSpinner />;
  if (!city) return <NotFound />;

  return (
    <Box>
      <Text variant="h1">{city.name}</Text>
      <Text variant="body">{city.description}</Text>
      <CityStats
        costOfLiving={city.cost_of_living}
        internetSpeed={city.internet_speed}
        safetyScore={city.safety_score}
      />
    </Box>
  );
}
```

## Design System (Theme)

### Theme Structure

```typescript
// src/ui/theme/theme.ts
export const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    background: '#FFFFFF',
    foreground: '#000000',
    card: '#F2F2F7',
    border: '#C6C6C8',
    text: {
      primary: '#000000',
      secondary: '#3C3C43',
      tertiary: '#8E8E93',
      disabled: '#C7C7CC',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 999,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    h3: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: 'normal' },
    caption: { fontSize: 14, fontWeight: 'normal' },
    small: { fontSize: 12, fontWeight: 'normal' },
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};
```

### Using Theme

```typescript
import { useAppTheme } from '@/src/ui/theme/useAppTheme';

export function MyComponent() {
  const theme = useAppTheme();

  return (
    <View style={{
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
    }}>
      <Text style={{
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.text.primary,
      }}>
        Hello World
      </Text>
    </View>
  );
}
```

## Component Patterns

### 1. Box Component (Layout)

Foundation component for spacing and layout.

```typescript
<Box padding="md" gap="sm">
  <Text>Title</Text>
  <Text>Description</Text>
</Box>
```

**Features**:

- Automatic spacing with `gap`, `padding`, `margin`
- Theme-aware spacing values
- Flexbox shortcuts

### 2. Text Component (Typography)

Themed typography component.

```typescript
<Text variant="h1">Heading</Text>
<Text variant="body" color="secondary">
  Body text
</Text>
<Text variant="caption" color="tertiary">
  Small caption
</Text>
```

**Features**:

- Predefined variants (h1, h2, body, caption, etc.)
- Theme colors
- Consistent typography

### 3. Button Component

Primary interaction component.

```typescript
<Button
  title="Sign In"
  onPress={handleSignIn}
  variant="primary"
  loading={isLoading}
  disabled={!isValid}
/>
```

**Variants**:

- `primary`: Main actions
- `secondary`: Secondary actions
- `outline`: Less prominent actions
- `ghost`: Minimal visual weight

### 4. Screen Component

Full-screen wrapper with safe areas.

```typescript
<Screen>
  <Header title="Cities" />
  <ScrollView>
    {/* Content */}
  </ScrollView>
</Screen>
```

**Features**:

- Automatic SafeAreaView
- StatusBar configuration
- Keyboard avoiding behavior

### 5. Card Components

Content containers for lists and grids.

```typescript
<CityCard
  city={city}
  onPress={() => router.push(`/city-details/${city.id}`)}
/>
```

**Features**:

- Image with loading state
- Consistent shadows and borders
- Pressable with feedback

## Styling Patterns

### StyleSheet API

Use React Native's StyleSheet for performance.

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
```

### Dynamic Styles

Combine static and dynamic styles.

```typescript
const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
  },
});

// In component
<Pressable
  style={[
    styles.button,
    { backgroundColor: theme.colors.primary },
    disabled && { opacity: 0.5 },
  ]}
/>
```

### Responsive Design

Use dimensions for responsive layouts.

```typescript
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

const styles = StyleSheet.create({
  container: {
    padding: isSmallDevice ? 12 : 16,
  },
});
```

## Accessibility

### Labels and Hints

```typescript
<Button
  title="Sign In"
  accessibilityLabel="Sign in to your account"
  accessibilityHint="Opens the sign-in form"
/>
```

### Roles

```typescript
<Pressable
  accessibilityRole="button"
  accessibilityState={{ disabled: isDisabled }}
>
  <Text>Action</Text>
</Pressable>
```

### Focus Management

```typescript
import { useRef } from 'react';

const inputRef = useRef<TextInput>(null);

<TextInput
  ref={inputRef}
  returnKeyType="next"
  onSubmitEditing={() => nextInputRef.current?.focus()}
/>
```

## Performance Optimizations

### 1. Memoization

```typescript
import { memo } from 'react';

export const CityCard = memo(function CityCard({ city }: Props) {
  return (
    <Pressable>
      <Image source={{ uri: city.image_url }} />
      <Text>{city.name}</Text>
    </Pressable>
  );
});
```

### 2. FlatList for Lists

```typescript
<FlatList
  data={cities}
  renderItem={({ item }) => <CityCard city={item} />}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

### 3. Image Optimization

```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: city.image_url }}
  contentFit="cover"
  cachePolicy="memory-disk"
  placeholder={require('@/assets/placeholder.png')}
/>
```

### 4. Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>
```

## Form Handling

### Controlled Inputs

```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

<TextInput
  value={email}
  onChangeText={setEmail}
  placeholder="Email"
  keyboardType="email-address"
  autoCapitalize="none"
/>

<TextInput
  value={password}
  onChangeText={setPassword}
  placeholder="Password"
  secureTextEntry
/>
```

### Validation

```typescript
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidForm = email && password && isValidEmail(email);

<Button
  title="Sign In"
  disabled={!isValidForm}
  onPress={handleSignIn}
/>
```

## Icon System

Custom icon font from Icomoon.

```typescript
<Icon name="search" size={24} color={theme.colors.text.primary} />
<Icon name="heart" size={20} color={theme.colors.error} />
<Icon name="location" size={16} color={theme.colors.text.secondary} />
```

**Icon Names**:

- UI: `search`, `filter`, `close`, `chevron-right`, `chevron-down`
- Actions: `heart`, `heart-filled`, `share`, `bookmark`
- Navigation: `home`, `explore`, `profile`, `settings`
- Maps: `location`, `map-marker`, `navigation`

## Animation Patterns

### Subtle Interactions

```typescript
import { Animated } from 'react-native';

const scale = useRef(new Animated.Value(1)).current;

const handlePressIn = () => {
  Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
};

const handlePressOut = () => {
  Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
};

<Animated.View style={{ transform: [{ scale }] }}>
  <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
    {/* Content */}
  </Pressable>
</Animated.View>
```

## Best Practices

1. **Component Composition**: Build complex UIs from simple components
2. **Single Responsibility**: Each component does one thing well
3. **Props over State**: Prefer props for reusability
4. **Accessibility First**: Always add accessibility props
5. **Performance**: Memoize expensive components
6. **Theme Consistency**: Use theme values, not hardcoded colors
7. **Type Safety**: Strictly type all props
8. **Reusability**: Design components for reuse from the start
9. **Testing**: Test UI components with React Native Testing Library

## Naming Conventions

- **Components**: PascalCase (e.g., `Button`, `CityCard`, `SearchInput`)
- **Props**: camelCase (e.g., `onPress`, `isLoading`, `cityId`)
- **Style objects**: camelCase (e.g., `styles.container`, `styles.primaryButton`)
- **Event handlers**: `handle` prefix (e.g., `handlePress`, `handleSubmit`)

## Notes for AI Agents

- Presentational components should never call domain operations
- Containers bridge UI and domain layers
- Always use theme values for colors, spacing, typography
- Use StyleSheet.create for performance
- Memoize components that render in lists
- FlatList for long lists, ScrollView for short content
- Image component from expo-image for better performance
- All text must use the Text component for theme consistency
- Icons use custom font from assets/icons
- Accessibility is non-negotiable - always add labels
- Forms use controlled components pattern
- Never hardcode colors or spacing values
