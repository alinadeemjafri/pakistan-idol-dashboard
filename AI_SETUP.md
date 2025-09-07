# AI Chatbot Setup Guide

## 🚀 Quick Setup

The AI chatbot is now integrated into your Pakistan Idol Dashboard! Here's how to get it working:

### 1. Environment Variables

Add your OpenAI API key to your environment variables:

**For Local Development:**
```bash
# Add to your .env.local file
OPENAI_API_KEY=your_openai_api_key_here
```

**For Production (Vercel):**
1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to "Environment Variables"
4. Add: `OPENAI_API_KEY` with your OpenAI API key

### 2. Features

The AI chatbot can:

#### 📊 **Query Data**
- "Show me all upcoming episodes"
- "Find contestants from Karachi"
- "What episodes are airing this week?"
- "Show me active contestants"

#### ✏️ **Update Data**
- "Update episode 5 title to 'Semi-Finals'"
- "Change contestant John's status to eliminated"
- "Set episode 3 air date to 2025-09-15"
- "Update contestant bio for Sarah"

#### 📈 **Get Statistics**
- "How many contestants are active?"
- "What's the total number of episodes?"
- "Show me dashboard statistics"

### 3. Usage

1. **Floating Button**: Click the chat icon in the bottom-right corner
2. **Minimize**: Click the minimize button to collapse the chat
3. **Fullscreen**: Click the maximize button for a larger view
4. **Close**: Click the X to close the chat

### 4. Example Queries

```
"Show me all episodes scheduled for next week"
"Find all contestants with status 'active'"
"Update episode 1 title to 'Auditions Round 1'"
"Change contestant ID 123 status to eliminated"
"What are the dashboard statistics?"
"Find contestants from Lahore"
```

### 5. Security

- The AI has full read/write access to your database
- All updates are logged and can be tracked
- Be careful with data modifications
- The AI will confirm changes before executing them

## 🎯 Ready to Use!

Once you add your OpenAI API key, the chatbot will be fully functional. It's already integrated into your layout and ready to help with your Pakistan Idol Dashboard management!
