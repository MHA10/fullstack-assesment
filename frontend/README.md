# User Registration Portal - Frontend

A modern Next.js frontend application for user registration with email notification capabilities. This application provides a clean, responsive interface for users to create accounts and receive welcome emails.

## Features

- **User Registration Form**: Clean, accessible form with validation
- **Real-time Feedback**: Success and error messages with auto-dismiss
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Modern UI Components**: Built with shadcn/ui components
- **TypeScript**: Full type safety throughout the application
- **Auto-dismiss Notifications**: Toast messages automatically disappear after 5 seconds

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: TypeScript
- **Form Handling**: React state management
- **HTTP Client**: Fetch API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout with metadata
│   └── page.tsx        # Home page with ContactForm
├── components/         # React components
│   ├── ContactForm.tsx # Main registration form
│   └── ui/            # shadcn/ui components
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## API Integration

The frontend communicates with the backend services:

- **SERVER-1** (Port 4000): User creation and database storage
- **SERVER-2** (Port 4001): Email notification service via RabbitMQ

### Form Data

The registration form collects:
- `fullName`: User's full name
- `email`: User's email address
- `message`: Welcome message content

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Deployment

This Next.js application can be deployed on:

- **Vercel** (recommended): Automatic deployments from Git
- **Netlify**: Static site hosting
- **Docker**: Containerized deployment
- **Traditional hosting**: Build and serve static files

For Vercel deployment:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Follow the existing code style and conventions
2. Use TypeScript for all new components
3. Ensure responsive design principles
4. Test form functionality thoroughly
5. Update documentation as needed
