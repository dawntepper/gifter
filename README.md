# Gifter

# Gift Recommendation Application

## Overview
This application is a sophisticated gift recommendation system that leverages artificial intelligence to help users find perfect gifts based on recipient descriptions, occasions, and budgets. The application combines modern frontend technologies with powerful backend services to deliver personalized gift suggestions.

## Tech Stack

### Frontend
- **React**: Powers the user interface with a component-based architecture
- **TypeScript**: Provides type safety and better developer experience
- **Vite**: Fast and modern build tool for development and production
- **TanStack Query**: Manages server state and caching for API requests
- **shadcn/ui**: Provides accessible and customizable UI components
- **Tailwind CSS**: Handles styling with utility-first CSS framework
- **Lucide Icons**: Supplies modern icons for the interface

### Backend (Supabase)
- **PostgreSQL Database**: Stores user data, gift recommendations, and application state
- **Row Level Security (RLS)**: Ensures data security at the database level
- **Edge Functions**: Handles serverless computing for AI operations
- **Authentication**: Manages user sessions and access control
- **Real-time Subscriptions**: Enables live updates for chat features

### AI Integration
- **OpenAI GPT-4**: Powers intelligent gift recommendations
- **DALL-E 3**: Generates gift-related imagery (when applicable)

## Core Features

### 1. Gift Recommendation Engine
- Users input recipient details, occasion, and budget
- OpenAI processes these inputs through Supabase Edge Functions
- Returns personalized gift suggestions with reasoning

### 2. Conversation System
- Interactive chat interface for refining recommendations
- AI-powered responses through OpenAI integration
- Conversation history stored in Supabase

### 3. User Management
- Authentication and authorization via Supabase
- Premium user features and limitations
- Personalized recommendation history

### 4. Data Persistence
Key database tables:
- `gift_lists`: Stores user-created gift lists
- `product_recommendations`: Tracks AI-generated suggestions
- `gift_conversations`: Maintains chat history
- `premium_users`: Manages subscription status

## Application Flow

1. **User Authentication**
   - Users sign in through Supabase Auth
   - Premium status checked and enforced

2. **Gift Search Process**
   ```typescript
   // User inputs recipient info
   -> Frontend form submission
   -> Supabase Edge Function
   -> OpenAI API processing
   -> Database storage
   -> Real-time UI update
   ```

3. **Conversation Feature**
   - Limited questions for free users
   - Unlimited for premium users
   - Real-time AI responses

4. **Data Management**
   - Automatic syncing with Supabase
   - Client-side caching with TanStack Query
   - Real-time updates using Supabase subscriptions

## Architecture

```
Frontend (React + TypeScript)
    │
    ├── Components
    │   ├── GiftForm
    │   ├── GiftRecommendations
    │   └── ConversationPanel
    │
    ├── State Management
    │   ├── TanStack Query
    │   └── React Context
    │
    └── API Integration
        └── Supabase Client

Backend (Supabase)
    │
    ├── Database
    │   ├── Tables
    │   └── RLS Policies
    │
    ├── Edge Functions
    │   ├── Gift Recommendations
    │   └── Conversation Handler
    │
    └── Authentication
        └── User Management
```

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Deployment

The application can be deployed through:
1. GPT Engineer's built-in deployment
2. Custom domain setup via Netlify (optional)

## Security Considerations

- All database access is controlled through RLS policies
- Authentication tokens handled securely by Supabase
- API keys and sensitive data stored in environment variables
- Premium features protected by user role verification

## Performance Optimizations

- Client-side caching with TanStack Query
- Lazy loading of components
- Optimized database queries
- Edge function response caching

## Future Enhancements

1. Additional retailer integrations
2. Enhanced AI model capabilities
3. Mobile application development
4. Advanced analytics dashboard

For more information about specific features or technical details, please refer to the corresponding documentation sections or contact the development team.
>>>>>>> 485457c (Updates to push new app)
