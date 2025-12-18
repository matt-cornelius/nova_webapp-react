# Product Requirements Document (PRD) - Final
## Dono: AI-Powered Donation Platform

---

## 1. Product Overview (Updated)

Dono addresses the challenge of discovering and supporting charitable causes that align with individual values and interests. Traditional donation platforms often overwhelm users with hundreds of organizations, making it difficult to find causes that resonate personally. Additionally, users lack insight into how their donation patterns reflect their values, and groups coordinating donations have limited tools for collaboration.

The platform serves two primary user types: **individual donors** seeking personalized recommendations and **nonprofit organizations** looking to create compelling donation posts and track their impact. The product also supports **giving circles and groups** who want to coordinate donations around shared causes.

The current prototype is a fully functional web application that enables users to register as either individuals or organizations, browse donation posts, make donations from a virtual wallet, and receive AI-powered recommendations based on their donation history. Organizations can create posts with goals, descriptions, and images, while users can explore posts, donate to causes, and participate in group chats with integrated donation functionality. The platform uses semantic embeddings to understand user preferences and recommend similar causes, creating a personalized discovery experience that improves as users engage with the platform.

---

## 2. Core Features & Status

### Authentication & User Management
- ✅ **User Registration** - *Implemented*: Users can register as individuals or organizations with distinct account types
- ✅ **Login/Logout** - *Implemented*: Email/password authentication with localStorage persistence
- ✅ **Account Types** - *Implemented*: Separate views and functionality for users vs. organizations

### Wallet & Donations
- ✅ **Virtual Wallet** - *Implemented*: Users can add funds to their wallet balance
- ✅ **Donation Processing** - *Implemented*: Donations deduct from wallet and update post amounts
- ✅ **Donation History** - *Implemented*: All donations are tracked and displayed on Home feed
- ✅ **Donation Dialog** - *Implemented*: Quick amount selection ($5, $10, $25, $50, $100) or custom amounts

### Organization Posts
- ✅ **Create Posts** - *Implemented*: Organizations can create donation posts with title, description, images, goals, categories, and tags
- ✅ **Post Feed** - *Implemented*: Explore page displays all organization posts
- ✅ **Post Cards** - *Implemented*: Rich post cards with progress bars, organization info, and donation buttons
- ✅ **Demo Posts** - *Implemented*: 8 default demo posts appear for all users

### AI-Powered Recommendations ⚡
- ✅ **Semantic Similarity** - *Implemented*: Uses OpenAI embeddings to find similar posts
- ✅ **Donation-Based Recommendations** - *Implemented*: Recommends posts based on user's donation history
- ✅ **Top 3 Recommendations** - *Implemented*: Shows exactly 3 highest-recommended posts on Explore page
- ✅ **Real-time Updates** - *Implemented*: Recommendations refresh immediately after donations

### Groups & Chat
- ✅ **Groups List** - *Implemented*: Browse available giving circles and groups
- ✅ **Group Chat** - *Implemented*: Basic chat interface with message history
- ✅ **Group Donations** - *Implemented*: Dollar sign button in chat to donate to group's charity
- ⚠️ **Message Persistence** - *Partially Implemented*: Messages stored in component state (not persisted)

### Social Features
- ✅ **Like Posts** - *Implemented*: Users can like organization posts
- ✅ **Donation Feed** - *Implemented*: Home page shows all public donations with donor and organization info
- ✅ **Profile Pages** - *Implemented*: User and organization profile pages with stats

### Data Persistence
- ✅ **LocalStorage** - *Implemented*: All user data, posts, donations, and preferences stored locally
- ⚠️ **No Backend** - *Limitation*: All data is client-side only, no server synchronization yet

---

## 3. AI Specification (Final)

### What the AI Does

The AI system provides **semantic similarity matching** for donation post recommendations. It analyzes the content of posts (title, description, category, tags) and compares them to posts a user has previously donated to, identifying posts with similar themes, causes, or focus areas.

**Inputs:**
- User's donation history (post IDs they've donated to)
- All available organization posts (title, description, category, tags)
- Post metadata (organization name, category, tags)

**Outputs:**
- Ranked list of up to 3 recommended posts with similarity scores (0-1)
- Similarity percentage displayed to user (e.g., "85% match")

**Task:** Given a user's donation history, find the 3 most semantically similar posts they haven't yet donated to.

### Where in the User Flow

The AI recommendation system appears on the **Explore page**:

1. User navigates to Explore page
2. If user has made at least one donation, a "Recommended for You" section appears at the top
3. System calculates average embedding from user's donated posts
4. Compares against all non-donated posts using cosine similarity
5. Displays top 3 recommendations with similarity percentages
6. Recommendations refresh automatically when user makes a new donation

### Model / Tool

**Primary:** OpenAI Embeddings API (`text-embedding-3-small` model)
- 1536-dimensional embeddings
- Called via REST API: `POST https://api.openai.com/v1/embeddings`
- Requires `VITE_OPENAI_API_KEY` environment variable

**Fallback:** Hash-based embedding generator (384 dimensions)
- Used when API key is not provided
- Simple word-frequency-based vectorization
- Less accurate but functional for development/testing

**Similarity Calculation:** Cosine similarity between embedding vectors
- Formula: `dotProduct / (magnitude1 * magnitude2)`
- Returns value between -1 and 1 (typically 0-1 for normalized embeddings)
- Threshold: 0.1 minimum similarity to display recommendations

### Constraints & Guardrails

1. **API Key Requirement:** System gracefully falls back to hash-based embeddings if OpenAI API key is missing
2. **Rate Limiting:** Embeddings are cached per post ID to minimize API calls
3. **Similarity Threshold:** Minimum 0.1 similarity score required (lowered from 0.3 to ensure recommendations appear)
4. **Donation History Requirement:** Recommendations only appear if user has donated to at least one post
5. **Exclusion Logic:** Posts user has already donated to are automatically excluded
6. **Limit Enforcement:** Maximum 3 recommendations displayed, even if more meet threshold
7. **Error Handling:** API errors fall back to hash-based embeddings with console warnings

---

## 4. Technical Architecture (Reality Check)

### Front-End Technologies

- **React 18** with TypeScript for component-based UI
- **Vite** for build tooling and development server
- **React Router** for client-side routing and navigation
- **Tailwind CSS** for styling and responsive design
- **Lucide React** for icon library
- **Context API** for global state management (Auth, Donations, OrganizationPosts)

### State Management

Three main Context providers:
- **AuthContext**: User authentication, wallet balance, account type
- **DonationsContext**: Donation feed, likes, donation records
- **OrganizationPostsContext**: Post management, post likes, donation triggers

### AI Integration

**Service Layer:**
- `src/services/embeddingService.ts`: Handles OpenAI API calls and fallback embeddings
- `src/services/recommendationService.ts`: Orchestrates recommendation logic
- `src/services/userDonationsService.ts`: Tracks user donation history

**Flow:**
1. User makes donation → recorded in `userDonationsService`
2. `donationRefreshTrigger` increments in `OrganizationPostsContext`
3. `PostRecommendations` component detects trigger change
4. Calls `getRecommendedPosts()` which:
   - Fetches user's donated post IDs
   - Generates/retrieves embeddings for donated posts
   - Calculates average embedding vector
   - Generates/retrieves embeddings for all posts
   - Computes cosine similarity
   - Returns top 3 matches

**Caching:** Embeddings cached in memory (`Map<string, number[]>`) to avoid regenerating for same posts

### External APIs & Services

- **OpenAI Embeddings API**: `https://api.openai.com/v1/embeddings`
  - Model: `text-embedding-3-small`
  - Authentication: Bearer token via environment variable
  - Rate limits: Subject to OpenAI's usage limits

### Data Persistence

- **LocalStorage** for all persistent data:
  - `registeredUsers`: User accounts and passwords
  - `organizationPosts`: User-created posts
  - `userPostDonations`: Donation history for recommendations
  - `donations`: Donation records for Home feed
  - `likedOrganizationPosts`: Post likes
  - `likedDonations`: Donation likes

**No backend server** - all data stored client-side in browser localStorage

---

## 5. Prompting & Iteration Summary

### Key Prompts That Shaped the Product

**1. Initial Recommendation System Request**
> "I want to use embeddings to find similar posts based on ones I as the user have donated to"

This prompt led to the core AI feature. Initially, we implemented basic embedding generation and similarity calculation. The user then refined requirements:
- "I'd like to be sure that at any given point in time, there is only three posts I can view that are the 3 highest recommended posts"
- "The recommended for you content does not display to me unless I refresh and then it flashes for a second. I think that everything I click 'donate' the entire feed should re-render"

**Iteration:** Added `donationRefreshTrigger` state to force re-renders, implemented strict limit of 3 recommendations, and added loading states to prevent flashing.

**2. Home Feed Donation Tracking**
> "let's edit the Home screen now. First, I want every donation to appear there"
> "ok that's not what I want home to be. Home Screen was where any user could view donations that others made to organizations. What i meant was that when I click a button to donate, I want that catalogued on the Home Screen"

**Iteration:** Initially misunderstood as showing posts, then clarified to show donation records. Implemented `addDonation()` function in DonationsContext and integrated donation recording into OrganizationPostCard.

**3. Groups Chat Donation Feature**
> "let's add a feature to the groups chat"
> "let's add a dollar sign button to donate to a charity that the group is formed around"

**Iteration:** Created GroupDonationDialog component, linked groups to organizations, and added donation button to chat interface. Integrated with existing donation flow.

**4. Embedding Service Implementation**
> "Before you do anything, can you do AI embeddings?"

**Iteration:** Built embedding service with OpenAI API integration, added fallback for development, implemented cosine similarity, and created recommendation service that averages user donation embeddings.

### Prompt Design Learnings

1. **Clarification is Critical**: Initial prompts often needed refinement (e.g., "every donation" vs "donation posts"). Asking follow-up questions prevented wasted work.

2. **Incremental Feature Building**: Breaking complex features into steps (embeddings → similarity → recommendations → UI) made implementation manageable.

3. **State Management Prompts**: When users reported UI issues ("doesn't re-render"), prompts focused on React state and dependency arrays led to effective solutions.

4. **User Flow Context**: Prompts that included user journey context ("when I click donate, I want...") helped ensure features integrated properly with existing flows.

5. **Technical Constraints**: Prompts that acknowledged limitations ("if API key not found, use fallback") led to more robust implementations.

---

## 6. UX & Limitations

### Intended User Journey

**New User (Individual):**
1. Register → Create account → Add funds to wallet
2. Browse Explore page → See demo posts
3. Donate to a post → Funds deducted, donation recorded
4. Return to Explore → See "Recommended for You" section (if donation history exists)
5. Browse Home feed → See all donations from platform
6. Join a group → Chat with members → Donate via group chat

**Organization User:**
1. Register as organization → Create account
2. Navigate to Explore → Create donation post
3. View Dashboard → See donations received, stats
4. Monitor post progress → Track goal completion

**Group Member:**
1. Browse Groups page → Select a group
2. Enter group chat → See message history
3. Click dollar button → Donate to group's charity
4. Chat message appears → Announcement of donation

### Known Limitations & "Janky" Bits

1. **No Backend Persistence**: All data stored in localStorage
   - Data lost if browser cleared
   - No cross-device synchronization
   - No server-side validation

2. **Message Persistence**: Group chat messages reset on page refresh
   - Messages stored in component state only
   - No localStorage persistence implemented

3. **Recommendation Loading**: Initial load may show "Loading..." briefly
   - Embeddings generated on-demand
   - No pre-computation or background processing

4. **API Key Dependency**: Recommendations less accurate without OpenAI API key
   - Fallback embeddings are simplistic
   - Similarity scores may be unreliable

5. **No Real-time Updates**: Donations don't sync across browser tabs
   - Each tab maintains separate state
   - Refresh required to see others' donations

6. **Demo Data Mixing**: Demo posts and user posts merged in feed
   - Demo posts always appear
   - No way to disable demo content

7. **No Payment Processing**: Virtual wallet only
   - No real money transactions
   - Funds added manually via UI

8. **Limited Error Handling**: Some edge cases not handled
   - Network failures may cause silent failures
   - Invalid API responses may break recommendations

### Ethical & Trust Limitations

**When Users Should NOT Rely on This Tool:**

1. **Real Donations**: This is a prototype with virtual currency. Users should NOT expect real donations to reach organizations. No payment processing is implemented.

2. **Data Privacy**: All data stored locally means:
   - No encryption at rest
   - No GDPR compliance
   - Data accessible to anyone with device access
   - Should NOT be used with sensitive personal information

3. **Recommendation Accuracy**: AI recommendations are based on semantic similarity only:
   - No verification of organization legitimacy
   - No financial transparency checks
   - Similarity doesn't guarantee quality or trustworthiness
   - Users should research organizations independently

4. **Group Chat Security**: Group chats have no moderation:
   - No content filtering
   - No user verification
   - No reporting mechanisms
   - Should NOT be used for sensitive discussions

5. **Financial Transactions**: Wallet system is simulated:
   - No actual money handling
   - No transaction records
   - No tax documentation
   - Should NOT be used for real financial planning

---

## 7. Future Roadmap

### Product Improvements

- **Backend Integration**: Replace localStorage with proper database and API
  - User authentication via JWT tokens
  - PostgreSQL/MongoDB for data persistence
  - RESTful API for all operations
  - Real-time updates via WebSockets

- **Payment Processing**: Integrate Stripe/PayPal for real donations
  - Secure payment gateway
  - Transaction receipts and tax documentation
  - Recurring donation support
  - Payment method management

- **Enhanced Group Features**: Expand group functionality
  - Group goals and progress tracking
  - Group member management (invite, remove)
  - Group donation history and analytics
  - Group event scheduling

### Stronger AI Integration

- **Multi-Modal Recommendations**: Expand beyond text embeddings
  - Image analysis for post images
  - User behavior pattern recognition
  - Collaborative filtering (users with similar donation patterns)
  - Time-based recommendations (seasonal causes, trending)

- **Natural Language Post Creation**: AI-assisted post writing
  - Generate post descriptions from organization goals
  - Suggest tags and categories
  - Optimize titles for engagement
  - Multi-language support

- **Donation Impact Predictions**: ML models for impact forecasting
  - Predict goal completion likelihood
  - Estimate time-to-goal based on historical data
  - Suggest optimal goal amounts
  - Identify high-potential posts

### Data, Evaluation & Safety

- **Recommendation Evaluation**: Metrics and testing framework
  - A/B testing for recommendation algorithms
  - Click-through rate tracking
  - Donation conversion metrics
  - User satisfaction surveys

- **Content Moderation**: Safety and trust features
  - AI-powered content filtering for posts
  - Organization verification system
  - User reporting mechanisms
  - Automated fraud detection

- **Privacy & Compliance**: GDPR and data protection
  - Encrypted data storage
  - User data export/deletion tools
  - Privacy policy and terms of service
  - Cookie consent management

- **Analytics Dashboard**: Data insights for organizations
  - Donation trends and patterns
  - Donor demographics (aggregated)
  - Post performance metrics
  - Engagement analytics

### Additional Features

- **Social Features**: Enhanced community engagement
  - Comments on posts
  - Share posts to social media
  - Follow organizations
  - Donation leaderboards

- **Mobile App**: Native mobile experience
  - React Native or Flutter app
  - Push notifications
  - Mobile-optimized donation flow
  - Offline support

- **Internationalization**: Multi-language and currency support
  - Translate UI to multiple languages
  - Support multiple currencies
  - Region-specific payment methods
  - Localized content recommendations

