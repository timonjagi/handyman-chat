# Handyman Ordering System

A modern service ordering platform with a dynamic chat interface, built on Next.js and the Vercel AI SDK.

## Features

- Natural language chat interface for service ordering
- Dynamic UI components that adapt to the conversation context
- Modular backend tools for service identification, provider selection, order creation, and payment processing
- Integration with M-Pesa for payments
- Order lifecycle tracking and management
- Review and rebooking capabilities

## Architecture

The Handyman Ordering System consists of:

1. **Chat Interface (Frontend)**: A Next.js application with dynamic UI components
2. **Server (Backend)**: A modular system of tools that power the conversation and workflow logic
3. **External Integrations**: Connections to payment providers, service provider databases, and order management systems

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- OpenAI GPT-4
- Shadcn UI Components
