# Feature Specification: Social Features to Connect Nomads

**Feature Branch**: `001-social-features`  
**Created**: 2026-02-22  
**Status**: Draft  
**Input**: User description: "Add social features to connect nomads in the same city"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Discover Nomads in Same City (Priority: P1)

A digital nomad arriving in a new city wants to see who else from the community is currently there. They can view a list of other nomads in the same city, see basic profile information, and identify potential connections.

**Why this priority**: Discovery is the foundation of any social feature. Users must first find other nomads before they can connect, message, or meet up. Without this, all other social features are impossible. This is the absolute MVP.

**Independent Test**: Can be fully tested by setting current location to "Chiang Mai, Thailand" in profile, navigating to the "Nomads Nearby" screen, and seeing a list of other users who have also set Chiang Mai as their current location, with profile photos and brief bios.

**Acceptance Scenarios**:

1. **Given** a user has set their current location in their profile, **When** they navigate to "Nomads Nearby", **Then** they see a list of other users currently in the same city
2. **Given** the nomads list is displayed, **When** a user views each nomad card, **Then** they see profile photo, name, bio snippet, and how long they've been in the city
3. **Given** a user taps on a nomad card, **When** the profile detail opens, **Then** they see the full profile including travel preferences and mutual interests
4. **Given** no other nomads are in the city, **When** a user opens "Nomads Nearby", **Then** they see a message "No nomads found in [City Name]. Be the first!"
5. **Given** a user wants to filter nomads, **When** they apply filters (skills, languages, budget range), **Then** the list updates to show only matching nomads

---

### User Story 2 - Send Connection Requests and Messages (Priority: P2)

A digital nomad who found an interesting person in their city wants to connect and start a conversation. They can send a connection request with an optional message, and once accepted, exchange direct messages.

**Why this priority**: Once users can discover each other (P1), the natural next step is enabling communication. However, the app provides value even if users can only see who's around (e.g., recognize familiar faces, gauge community size). Communication enhances but isn't blocking.

**Independent Test**: Can be tested by viewing another nomad's profile, tapping "Connect," adding a message "Hi! Fellow nomad here, want to grab coffee?", sending the request, having the recipient accept it, and then sending direct messages back and forth.

**Acceptance Scenarios**:

1. **Given** a user views another nomad's profile, **When** they tap "Send Connection Request", **Then** they can optionally add a message (up to 200 characters) and send the request
2. **Given** a user receives a connection request, **When** they open notifications, **Then** they see the request with the sender's profile and optional message, with "Accept" and "Decline" buttons
3. **Given** a connection request is accepted, **When** either user navigates to "Connections", **Then** they see the other person in their connections list
4. **Given** users are connected, **When** one user taps on the connection and selects "Message", **Then** a direct message conversation opens
5. **Given** a user receives a message, **When** they open the app, **Then** they see a notification badge and the message appears in their inbox

---

### User Story 3 - Create and Join City Events (Priority: P3)

A digital nomad wants to organize or join local meetups and events (coffee chats, coworking sessions, group dinners). They can create events, set location and time, and see who's attending. Other nomads can discover and RSVP to these events.

**Why this priority**: Events add significant social value but require the foundation of discovery (P1) and messaging (P2) to be truly useful. Users can coordinate meetups via direct messages if events aren't available yet. This is a valuable enhancement.

**Independent Test**: Can be tested by creating an event "Coffee at Blue Bottle, 10am Saturday," setting location and max attendees (10), posting it, having other nomads discover it in the "Happening This Week" feed, RSVP-ing, and seeing the attendee count update.

**Acceptance Scenarios**:

1. **Given** a user is in a city, **When** they tap "Create Event" from the Nomads Nearby screen, **Then** they see a form to add event title, description, location, date/time, and max attendees
2. **Given** a user creates an event, **When** they tap "Post Event", **Then** the event appears in the city's "Happening This Week" feed
3. **Given** events are displayed in the feed, **When** a user views an event card, **Then** they see event details, host profile, attendee count, and an "RSVP" button
4. **Given** a user wants to attend, **When** they tap "RSVP", **Then** they're added to the attendee list and the event appears in their "My Events"
5. **Given** an event is at capacity, **When** another user tries to RSVP, **Then** they see "Event Full" with an option to join a waitlist

---

### User Story 4 - Share City Tips in Public Feed (Priority: P4)

A digital nomad who has local knowledge wants to share tips, recommendations, and experiences with other nomads in the city. They can post to a city-specific feed (like a local bulletin board), and others can read, like, and comment on posts.

**Why this priority**: A public feed adds community value but is less critical than direct connections and events. Users can share tips through direct messages or event descriptions if needed. This is a "nice to have" that builds community atmosphere.

**Independent Test**: Can be tested by posting "Best coffee shop: Akha Ama on Ratchamankha Road. Fast WiFi and great vibes!" to the Chiang Mai feed, having other nomads see it in the feed, liking the post, and adding a comment "Thanks! Just found my new office."

**Acceptance Scenarios**:

1. **Given** a user is viewing a city (current or exploring), **When** they navigate to the city's "Community Feed" tab, **Then** they see recent posts from nomads in that city
2. **Given** a user wants to share a tip, **When** they tap "New Post" and write content (text up to 500 characters, optional photo), **Then** they can post it to the city feed
3. **Given** posts are displayed in the feed, **When** a user reads a post, **Then** they see the author's profile photo and name, post content, timestamp, and like/comment counts
4. **Given** a user finds a post helpful, **When** they tap the heart icon, **Then** the like count increments and the icon fills in
5. **Given** a user wants to add to the conversation, **When** they tap "Comment" and write a response, **Then** their comment appears under the post
6. **Given** a user posts inappropriate content, **When** other users tap "Report", **Then** the post is flagged for moderation review

---

### Edge Cases

- What happens when a user changes their current location frequently?
- How does the system handle connection requests to users who have left the app?
- What happens when an event host needs to cancel an event with attendees already RSVP'd?
- How does the system prevent spam or inappropriate messages?
- What happens when a user blocks another user?
- How does the feed handle very popular posts with hundreds of comments?
- What happens when GPS location doesn't match the city a user manually set?
- How does the system handle privacy for users who don't want to be discovered?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a list of nomads currently in the same city as the user based on their set location
- **FR-002**: System MUST show each nomad with profile photo, name, bio snippet, and duration in city
- **FR-003**: System MUST allow filtering nomads by skills, languages, and travel preferences
- **FR-004**: System MUST handle cities with zero nomads by displaying an appropriate message
- **FR-005**: System MUST allow users to send connection requests with an optional message (up to 200 chars)
- **FR-006**: System MUST notify users when they receive connection requests
- **FR-007**: System MUST allow users to accept or decline connection requests
- **FR-008**: System MUST maintain a connections list for accepted connections
- **FR-009**: System MUST enable direct messaging between connected users
- **FR-010**: System MUST notify users when they receive new messages
- **FR-011**: System MUST allow users to create events with title, description, location, date/time, and max attendees
- **FR-012**: System MUST display events in a city-specific "Happening This Week" feed
- **FR-013**: System MUST allow users to RSVP to events and track attendee counts
- **FR-014**: System MUST prevent RSVP when events reach capacity and offer waitlist option
- **FR-015**: System MUST provide a city-specific community feed for sharing posts
- **FR-016**: System MUST allow users to create posts with text (up to 500 chars) and optional photos
- **FR-017**: System MUST display posts chronologically with most recent first
- **FR-018**: System MUST allow users to like and comment on posts
- **FR-019**: System MUST provide a reporting mechanism for inappropriate content
- **FR-020**: System MUST allow users to control their visibility in nomad discovery (public/connections-only/private)

### Key Entities

- **NomadPresence**: Represents a nomad's current location status (userId, cityId, arrivedAt, plannedDeparture, isVisible)
- **Connection**: Represents a connection between two users (userId1, userId2, status, requestMessage, connectedAt)
- **DirectMessage**: Represents a message between connected users (senderId, recipientId, content, sentAt, readAt)
- **CityEvent**: Represents a local meetup or event (id, hostId, cityId, title, description, location, dateTime, maxAttendees, createdAt)
- **EventAttendee**: Links users to events they're attending (eventId, userId, rsvpAt, status)
- **CityPost**: Represents a feed post for a city (id, authorId, cityId, content, photoUrl, createdAt, likeCount, commentCount)
- **PostComment**: Represents a comment on a post (postId, authorId, content, createdAt)

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can discover nomads in their city within 5 seconds of opening the "Nomads Nearby" screen
- **SC-002**: Connection requests are delivered to recipients within 10 seconds
- **SC-003**: Direct messages are delivered within 5 seconds when both users are online
- **SC-004**: 60% of users who discover at least 3 nomads in their city send at least one connection request
- **SC-005**: Events created are visible in the city feed within 2 seconds to all users viewing that city
- **SC-006**: RSVP actions update attendee counts in real-time (within 3 seconds)
- **SC-007**: Posts to the city feed appear for all city viewers within 5 seconds
- **SC-008**: 40% of users who join events report meeting at least one new connection in-person (measured via follow-up survey)
- **SC-009**: Inappropriate content reports are reviewed within 24 hours
- **SC-010**: Users understand privacy controls well enough that <5% request support for visibility settings

## Assumptions

- Users update their current location manually (automatic GPS tracking raises privacy concerns)
- "Current location" is the city set in user profile, not real-time GPS coordinates
- Users can only be in one city at a time for nomad discovery purposes
- Connection requests expire after 30 days if not accepted or declined
- Direct messaging supports text only in MVP (photos/files are future enhancements)
- Events are limited to the next 30 days (past events are automatically archived)
- City feed posts remain visible for 60 days before archiving
- Moderation for reported content is manual (no auto-moderation AI in MVP)
- Block functionality is one-way: blocked users cannot see the blocker's profile or send messages
- Users must have a complete profile (photo, bio, current location) to appear in nomad discovery
- Default privacy setting is "public" (visible to all nomads in the same city)
