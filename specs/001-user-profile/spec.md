# Feature Specification: User Profile Management with Travel Preferences

**Feature Branch**: `001-user-profile`  
**Created**: 2026-02-22  
**Status**: Draft  
**Input**: User description: "Add user profile management with travel preferences"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Basic Profile Management (Priority: P1)

A digital nomad user wants to create and maintain their profile with basic information including name, profile photo, bio, and current location. This allows other nomads to identify and learn about them in the community.

**Why this priority**: This is the foundation for any user-related features. Without basic profile data, users cannot personalize their experience or be identified in the system. This is the absolute MVP.

**Independent Test**: Can be fully tested by creating a new user account, filling in profile information (name, bio, photo), saving it, and verifying the information persists and displays correctly on the profile screen.

**Acceptance Scenarios**:

1. **Given** a new user has signed in, **When** they navigate to their profile, **Then** they see a profile creation form with fields for name, bio, profile photo, and current location
2. **Given** a user has entered profile information, **When** they tap "Save", **Then** the profile is saved and they see a success confirmation
3. **Given** a user has a saved profile, **When** they navigate to their profile screen, **Then** they see their saved information displayed correctly
4. **Given** a user wants to update their profile, **When** they edit any field and save, **Then** the updated information is persisted and displayed
5. **Given** a user hasn't uploaded a photo, **When** viewing their profile, **Then** they see a default avatar placeholder

---

### User Story 2 - Travel Preferences Setup (Priority: P2)

A digital nomad wants to set their travel preferences (budget range, preferred climate, required internet speed, visa requirements, safety concerns, language preferences) so the app can provide personalized city recommendations.

**Why this priority**: This enables the core value proposition of the app - personalized recommendations. However, users can explore cities without preferences set (using default filters), so it's not blocking for basic usage.

**Independent Test**: Can be tested by accessing the preferences screen, setting various preferences (budget: $1500-2500/month, climate: warm, internet: >50Mbps), saving them, and verifying they persist and are displayed correctly when returning to the preferences screen.

**Acceptance Scenarios**:

1. **Given** a user with a profile, **When** they navigate to "Travel Preferences", **Then** they see a form with preference categories (budget, climate, internet, visa, safety, language)
2. **Given** a user is setting budget preferences, **When** they select a range (e.g., $1000-2000/month), **Then** the selection is visually confirmed
3. **Given** a user has set multiple preferences, **When** they tap "Save Preferences", **Then** all preferences are persisted and a confirmation is shown
4. **Given** a user returns to preferences, **When** the screen loads, **Then** all previously saved preferences are pre-selected
5. **Given** a user wants to clear preferences, **When** they tap "Reset to Defaults", **Then** all custom preferences are cleared and defaults are applied

---

### User Story 3 - View Compatibility Score (Priority: P3)

When a digital nomad views a city, they can see how well it matches their saved travel preferences through a compatibility score and breakdown showing which preferences are met or not met.

**Why this priority**: This provides additional value on top of preferences but isn't essential for basic profile or preference functionality. Users can manually evaluate cities even without this visual scoring.

**Independent Test**: Can be tested by setting specific preferences (e.g., budget $1500-2000, warm climate), navigating to a city details page (e.g., Chiang Mai), and verifying a compatibility score is displayed with a breakdown showing which preferences match.

**Acceptance Scenarios**:

1. **Given** a user has set travel preferences, **When** they view a city details page, **Then** they see a compatibility percentage (0-100%) at the top
2. **Given** a user taps the compatibility score, **When** the breakdown opens, **Then** they see which specific preferences are met (green checkmarks) and not met (red X)
3. **Given** a user has no preferences set, **When** they view a city, **Then** they see a prompt to set preferences instead of a score
4. **Given** a user updates their preferences, **When** they return to a previously viewed city, **Then** the compatibility score updates to reflect the new preferences

---

### Edge Cases

- What happens when a user tries to save a profile without a required field (name)?
- How does the system handle profile photo uploads that exceed size limits (e.g., >5MB)?
- What happens when a user sets conflicting preferences (e.g., very low budget + expensive cities marked as favorites)?
- How does compatibility scoring handle cities with incomplete data?
- What happens when a user changes their location while traveling?
- How does the system handle special characters or emojis in bio text?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow authenticated users to create and edit their profile with name, bio, profile photo, and current location
- **FR-002**: System MUST validate that profile name is not empty and is between 2-50 characters
- **FR-003**: System MUST support profile photo uploads in common formats (JPEG, PNG, WebP) up to 5MB
- **FR-004**: System MUST provide a default avatar when no profile photo is uploaded
- **FR-005**: System MUST persist profile data and make it available across app sessions
- **FR-006**: System MUST allow users to set travel preferences including budget range, climate preference, internet speed requirements, visa considerations, safety level, and language preferences
- **FR-007**: System MUST save preference selections and restore them when the user reopens the preferences screen
- **FR-008**: System MUST calculate a compatibility score (0-100%) between user preferences and city data
- **FR-009**: System MUST display which specific preferences are met or not met for each city
- **FR-010**: System MUST handle cases where users have no preferences set by showing appropriate prompts
- **FR-011**: System MUST allow users to reset preferences to default values
- **FR-012**: System MUST update compatibility scores when preferences change

### Key Entities

- **UserProfile**: Represents a digital nomad's profile containing identifying information (id, name, bio, photoUrl, currentLocation, createdAt, updatedAt)
- **TravelPreferences**: Represents a user's travel preferences (userId, budgetMin, budgetMax, climatePreference, minInternetSpeed, visaRequirements, safetyLevel, languagePreferences, updatedAt)
- **CityCompatibility**: Represents the calculated match between user preferences and a city (userId, cityId, compatibilityScore, matchedPreferences, unmatchedPreferences, calculatedAt)

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can complete profile creation in under 2 minutes from first viewing the profile screen
- **SC-002**: Users can set and save travel preferences in under 3 minutes
- **SC-003**: Profile data persists correctly across app restarts with 100% reliability
- **SC-004**: Compatibility scores are calculated and displayed within 1 second of viewing a city
- **SC-005**: 80% of users who create a profile also set at least 3 travel preferences within their first session
- **SC-006**: Users can successfully upload profile photos under 5MB with a 95% success rate
- **SC-007**: The preferences experience is intuitive enough that users complete setup without external help (measured by task completion rate >85%)

## Assumptions

- User authentication system already exists (users can sign in/sign up)
- City data with relevant attributes (cost of living, climate, internet speed, etc.) is available in the system
- Image storage infrastructure is available for profile photos
- Users have internet connectivity when setting up profiles (offline editing not required in MVP)
- Default preference values are: budget $500-3000/month, any climate, internet >10Mbps, no visa restrictions, any safety level, English accepted
- Compatibility score algorithm uses weighted matching: budget (30%), climate (20%), internet (20%), visa (15%), safety (10%), language (5%)
