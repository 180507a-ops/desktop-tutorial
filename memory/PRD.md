# theFRIEND App - Product Requirements Document

## Overview
**theFRIEND** is an emotional wellness app for kids, created to help children manage their emotions and detect potential bullying situations. The app was conceived by 10-year-old girls and aims to be a safe, supportive companion for young users.

## Target Audience
- Children aged 5-18 years
- Primary focus: Kids who need emotional support and a safe space to express their feelings

## Core Requirements

### 1. User Registration
- Name, age, gender, email (parent's)
- No authentication required (prototype phase)
- User data stored in MongoDB

### 2. Daily Mood Check-in (Duolingo-style streak)
- Daily questions about feelings
- Emoji-based mood selection (1-5 scale)
- Questions about bullying ("Is anyone bothering you?")
- Questions about sadness
- Streak counter to encourage daily engagement
- Confetti celebration on check-in completion

### 3. Emotional Analysis
- Rule-based scoring (no AI)
- Trend tracking (improving, stable, needs_attention)
- Alerts for concerning patterns
- Visual progress indicators

### 4. Supportive Content
- Daily motivational messages
- Fun memes/pics section (placeholder for user content)
- Encouraging texts

### 5. Good Deeds Activity List
- List of positive activities
- Completion tracking with celebration
- Point-based reward system

### 6. Character Customization
- Face selection (emoji faces)
- Hair color selection
- Clothes color selection
- Avatar preview

## What's Been Implemented (Jan 31, 2026)

### Design Update (Latest)
- ✅ Custom logo (hand holding heart - blue on pink)
- ✅ Soft pink and blue color scheme
- ✅ Skip registration - auto-creates demo user
- ✅ Human avatar character (not emoji)
- ✅ Avatar customization: 4 unlocked + 4 locked items per category
  - Hair colors (8 total, 4 locked)
  - Face expressions (8 total, 4 locked)
  - Shirt colors (8 total, 4 locked)
  - Pants colors (8 total, 4 locked)
- ✅ Locked items show lock icon + "Earn points to unlock!" hint
- ✅ Points displayed prominently

### Backend (FastAPI + MongoDB)
- ✅ User profile CRUD operations
- ✅ Mood check-in system with streak tracking
- ✅ Good deeds completion tracking
- ✅ Emotional analysis endpoint
- ✅ Static content endpoints (messages, deeds, questions)

### Frontend (React + Tailwind + Framer Motion)
- ✅ Kid-friendly UI with Fredoka/Nunito fonts
- ✅ Animated registration screen
- ✅ Home dashboard with streak badge
- ✅ Daily check-in modal with multi-step flow
- ✅ Good Deeds screen with completion celebration
- ✅ Feelings analysis dashboard
- ✅ Profile screen with avatar customization
- ✅ Bottom navigation
- ✅ Confetti animations

### Design Assets
- Custom mascot character
- Streak flame badge
- Motivational meme placeholder
- Good deed star icon

## Tech Stack
- **Backend**: FastAPI, Motor (async MongoDB), Pydantic
- **Frontend**: React 19, Tailwind CSS, Framer Motion, React Confetti
- **Database**: MongoDB
- **Fonts**: Fredoka (headings), Nunito (body)
- **Languages**: English, Russian (Русский), Kazakh (Қазақша)

## Multi-Language Support (Added Jan 31, 2026)
- ✅ Language selector in top-right corner of all screens
- ✅ Full translation of all UI text, buttons, labels
- ✅ Translated supportive messages
- ✅ Translated good deeds list
- ✅ Language preference saved in localStorage

## Prioritized Backlog

### P0 - Critical (Future)
- [ ] Parent/Guardian dashboard view
- [ ] Real meme content management

### P1 - Important
- [ ] Push notifications for daily reminders
- [ ] Multiple language support
- [ ] Sound effects for interactions

### P2 - Nice to Have
- [ ] Achievement badges system
- [ ] Friend connections
- [ ] Weekly summary emails to parents
- [ ] Dark mode option

## Next Tasks
1. Add authentication for user accounts
2. Build parent dashboard view
3. Add meme upload functionality
4. Implement notification system
