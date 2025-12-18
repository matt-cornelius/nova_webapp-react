# Memo: Building with Generative AI
## Reflections on Developing Dono's AI-Powered Recommendation System

---

## 1. How I Actually Used AI While Building

### Tools and Workflow

I primarily used **Cursor AI** (an AI-powered code editor) as my "vibe coding" tool throughout this project. Cursor integrates directly into the development environment, allowing me to have contextual conversations about code, request implementations, and iterate on features in real-time. Unlike traditional IDEs, Cursor understands the entire codebase context, making it particularly effective for navigating React components, understanding state management patterns, and maintaining consistency across the application.

### Tasks I Relied on AI For

**Code Generation & Implementation**: The majority of feature implementation was done through AI assistance. When I requested "add a dollar sign button to donate to a charity that the group is formed around," Cursor generated the entire `GroupDonationDialog` component, integrated it into the chat interface, and handled the donation flow. Similarly, the recommendation system was largely AI-generated—from the embedding service to the cosine similarity calculations to the React components that display recommendations.

**Debugging & Problem Solving**: When features didn't work as expected (like recommendations not re-rendering after donations), I described the problem to Cursor, and it identified the issue—missing dependency in `useEffect` hooks—and provided the fix. The AI was particularly helpful in debugging React state management issues and identifying where `donationRefreshTrigger` needed to be added.

**Architecture Decisions**: I used AI to explore different approaches to recommendations. When I asked "can you do AI embeddings?", Cursor suggested using OpenAI's embedding API, explained the fallback strategy, and implemented the caching mechanism. However, I made the final decision to use semantic similarity rather than collaborative filtering or other approaches.

**Code Refactoring**: As the codebase grew, I asked Cursor to refactor components, extract services, and improve code organization. For example, separating the embedding logic into `embeddingService.ts` and recommendation logic into `recommendationService.ts` was AI-assisted refactoring.

**Documentation**: The PRD and this memo are written by me, but I used AI to help structure technical explanations and ensure completeness in the PRD's technical architecture section.

### Where Human Judgment Was Critical

**Feature Scoping**: While AI generated code, I made all product decisions. When Cursor initially misunderstood "every donation" to mean "every donation post," I clarified the requirement. The decision to limit recommendations to exactly 3 posts, the similarity threshold of 0.1, and the requirement that users must have donation history—these were all my choices, not AI suggestions.

**User Experience Design**: AI generated functional code, but I designed the UX. The decision to show similarity percentages, the loading states, the placement of the recommendations section—these came from my understanding of user needs, not AI recommendations.

**Simplification Choices**: I explicitly chose semantic similarity over more complex recommendation systems (collaborative filtering, matrix factorization, etc.) because it was simpler to implement and explain. AI could have built a more sophisticated system, but I scoped it down for practicality and clarity.

**Security & Privacy Decisions**: I made the explicit choice to store all data in localStorage rather than building a backend. While AI could have generated backend code, I chose this limitation to keep the prototype simple and avoid handling sensitive data. The decision to require an API key for embeddings (with fallback) was mine—AI suggested it, but I approved and refined the approach.

**Error Handling**: AI generated basic error handling, but I added specific guardrails: the fallback embedding system, the similarity threshold adjustments, the requirement that recommendations only appear after donations. These were intentional limitations I added.

**Testing & Validation**: I manually tested all features, especially the recommendation system. When recommendations weren't appearing, I debugged with AI's help but made the final judgment about what was acceptable behavior. The decision to lower the similarity threshold from 0.3 to 0.1 was based on my testing, not AI suggestions.

---

## 2. Why the AI Feature Looks the Way It Does

### Why Semantic Similarity Over Other Approaches

I chose semantic similarity using embeddings because it directly addresses the core problem: helping users discover causes aligned with their values. When a user donates to "Clean Water Now," they're expressing interest in water access, health, and Africa-focused causes. Semantic embeddings capture these themes and find similar posts, even if they use different wording.

I considered but rejected:
- **Collaborative filtering** ("users who donated to X also donated to Y"): Requires more user data and doesn't capture semantic meaning
- **Content-based filtering with keywords**: Too simplistic, misses nuanced connections
- **Hybrid approaches**: More complex than needed for an MVP

The semantic approach is interpretable (users see "85% match"), doesn't require extensive user data, and works even with a small number of posts.

### What I Simplified

**Limited to 3 Recommendations**: I could have shown 10+ recommendations or made it configurable, but 3 forces quality over quantity and reduces decision paralysis. This was a deliberate UX choice.

**Average Embedding Instead of Weighted**: I average all donated post embeddings equally. A more sophisticated approach would weight by recency, amount, or frequency. I simplified because the average works reasonably well and is easier to explain.

**No Machine Learning Model Training**: I use pre-trained embeddings (OpenAI's model) rather than fine-tuning or training a custom model. This was a practical choice—training requires data infrastructure I don't have.

**Threshold Lowered for Visibility**: The 0.1 similarity threshold is quite low (originally 0.3). I lowered it because users need to see recommendations even if they're not perfect matches. This prioritizes engagement over precision.

**Fallback System**: The hash-based fallback embeddings are intentionally simple. They're not as good as real embeddings, but they allow the app to function without an API key. This was a pragmatic choice for development and demos.

### Connection to Core Value Proposition

The recommendation system directly supports Dono's core value: **helping people discover causes that align with their values**. Without AI, users would browse posts chronologically or by category—both are limited. With semantic similarity, the platform learns from each donation and surfaces relevant causes automatically.

However, the connection isn't fully realized yet:
- **Cold Start Problem**: New users see no recommendations until they donate. I could add category-based or trending recommendations for new users.
- **No Feedback Loop**: The system doesn't learn from which recommendations users actually click or donate to. A production system would track engagement and refine recommendations.
- **Limited Personalization**: The system only considers donation history, not browsing behavior, likes, or other signals.

The AI feature is functional and demonstrates the concept, but it's a foundation rather than a complete solution.

---

## 3. Risks, Trade-offs, and Integrity

### Privacy, Data Use, and Security

**LocalStorage-Only Storage**: I made an explicit choice to store all data client-side. This means:
- No data leaves the user's browser (except API calls to OpenAI)
- No server-side data breaches possible
- But also: no data backup, no cross-device sync, data lost if browser cleared

This was a trade-off: simplicity and privacy (no backend to secure) vs. functionality (no persistence). For a prototype, this was acceptable. For production, I would need proper backend infrastructure with encryption, access controls, and compliance (GDPR, etc.).

**API Key Handling**: The OpenAI API key is stored in environment variables, never committed to git. However, in a production app, API keys should be on the backend, not exposed in client-side code. Currently, if someone inspects the network requests, they could see the API key. This is a known limitation I'm aware of.

**Donation Data**: All donation records are stored locally. This means users' donation history is private to their device, but also means organizations can't see real-time donation data. Again, a trade-off for prototype simplicity.

**No User Data Collection**: I don't track user behavior, browsing patterns, or analytics. The only data collected is what users explicitly provide (donations, posts). This prioritizes privacy but limits the ability to improve recommendations.

### Bias and Fairness

**Embedding Bias**: OpenAI's embedding model may have biases encoded in its training data. For example, posts about certain regions, causes, or languages might be underrepresented in the embedding space. I haven't tested for this, but it's a known risk with pre-trained models.

**Recommendation Diversity**: The system recommends similar posts, which could create echo chambers—users only see causes similar to what they've already supported. I haven't implemented diversity constraints (e.g., "show at least one post from a different category"). This is a limitation.

**Category Representation**: If demo posts are skewed toward certain categories (e.g., more health posts than education), recommendations will reflect that bias. The system doesn't actively balance representation.

**Fairness to Organizations**: Smaller or newer organizations might be less likely to appear in recommendations if their posts have less semantic similarity to common donation patterns. The system doesn't explicitly promote diversity or fairness.

I acknowledge these limitations. In production, I would add diversity constraints, test for bias, and potentially use multiple recommendation strategies.

### Over-reliance on AI / User Trust

**Transparency**: I show similarity percentages (e.g., "85% match") to give users insight into why posts are recommended. However, I don't explain what "similarity" means or how it's calculated. Users might over-trust the recommendations without understanding their limitations.

**No Verification**: Recommendations are based on semantic similarity, not on organization legitimacy, financial transparency, or impact. Users should research organizations independently, but the UI doesn't emphasize this. The PRD notes this limitation, but the app itself doesn't warn users.

**Fallback Quality**: When the fallback embedding system is used (no API key), recommendations are less accurate. Users might not realize this and could make decisions based on poor recommendations. I added console warnings, but users don't see those.

**No Human Oversight**: There's no moderation or human review of recommendations. Problematic or inappropriate posts could be recommended if they're semantically similar. This is a risk I'm aware of but haven't addressed.

### Academic Integrity and Honest Use of AI

**Code Attribution**: I used Cursor AI extensively for code generation. However, I:
- Made all architectural and product decisions myself
- Understood and modified all generated code
- Tested and debugged all features
- Wrote documentation (PRD, memo) myself, with AI assistance only for structure

I consider this honest use: AI was a tool, like a compiler or framework, not a replacement for my work. The product decisions, user experience design, and problem-solving were mine.

**Learning**: I learned about embeddings, cosine similarity, and recommendation systems through this project. While AI generated code, I researched the concepts, understood the math, and made informed choices about implementation.

**Limitations Acknowledged**: I'm transparent about what AI does (semantic similarity) and what it doesn't do (verify organizations, ensure fairness, etc.). The PRD explicitly notes limitations and when users should not rely on the tool.

### Explicit Choices to Limit AI

**No Generative Content**: I don't use AI to generate post descriptions, organization bios, or user content. All content is user-created or demo data. This avoids issues with AI-generated misinformation or inappropriate content.

**No Chatbot**: While there's a group chat, it's not AI-powered. Messages are user-written. I could have added an AI assistant to help users find causes, but I chose not to to avoid over-reliance on AI.

**Recommendations Only**: AI is used only for recommendations, not for other features (authentication, payments, etc.). This limits AI's scope and potential for errors or bias.

**Fallback System**: The hash-based fallback ensures the app works without AI. This was intentional—I didn't want the app to be completely dependent on external AI services.

**Threshold and Limits**: The similarity threshold (0.1) and recommendation limit (3) are conservative choices. I could have been more aggressive, but I chose to limit AI's influence to ensure quality.

---

## 4. What I Learned About Building with GenAI

### Biggest Surprise or Challenge

The biggest surprise was how **context-dependent** effective AI assistance is. Early in the project, when I asked vague questions like "add a feature," AI generated code that didn't fit the existing architecture. But as the codebase grew and Cursor understood the context better, its suggestions became more aligned with my patterns and preferences.

The challenge was learning to **prompt effectively**. I learned that:
- Including user flow context ("when I click donate, I want...") produces better results than technical requests ("add a function")
- Acknowledging constraints upfront ("if API key not found, use fallback") leads to more robust code
- Iterative refinement works better than trying to specify everything upfront

Another challenge was **knowing when to override AI**. AI suggested more complex solutions sometimes (like collaborative filtering), but I had to judge when simplicity was better. Learning to say "no, let's do it this way instead" was important.

### One Thing I Would Teach Another Founder

**Use AI as a pair programmer, not a code generator.** The most effective workflow was:
1. Describe the problem or feature in user-facing terms
2. Review AI's suggested approach
3. Ask clarifying questions or request modifications
4. Understand the generated code before accepting it
5. Test and iterate

Don't just accept AI's first suggestion. Ask "why did you do it this way?" or "can we simplify this?" The back-and-forth conversation produces better results than one-shot generation.

Also: **AI is great at implementation, but you need to own the decisions.** Product choices, UX design, architecture—these require human judgment. Use AI to execute your vision, not to define it.

### How This Affects My Thinking About AI

**AI as Infrastructure**: I now think of AI (especially embeddings) as infrastructure, like a database or API. It's a tool that enables features, not the feature itself. The recommendation system uses AI, but the value is in helping users discover causes—AI is just the mechanism.

**Pragmatic AI Integration**: I learned to integrate AI where it adds clear value (semantic similarity) and avoid it where it doesn't (generating content, replacing human judgment). Not every feature needs AI, and over-using it can create complexity and trust issues.

**Transparency Matters**: Showing similarity percentages helps users understand recommendations. In future projects, I'll prioritize transparency—explaining what AI does, why, and its limitations.

**Fallbacks Are Essential**: The fallback embedding system taught me that AI-dependent features need graceful degradation. Users shouldn't be blocked if AI services are unavailable.

**Ethics Can't Be Afterthoughts**: Thinking about bias, fairness, and trust upfront (even if not fully addressed) shaped better design decisions. In future projects, I'll build ethics into the design process, not add it later.

For my capstone or future ventures, I'll:
- Use AI for specific, well-defined tasks (like semantic search)
- Always provide fallbacks and human alternatives
- Be transparent about AI's role and limitations
- Test for bias and fairness explicitly
- Keep humans in the loop for important decisions

This project showed me that AI is powerful but requires careful integration, clear boundaries, and honest communication with users.

