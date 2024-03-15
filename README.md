
![chat](https://github.com/harshOpensource/chatwithpdf/assets/135038577/7c3cc943-d1b1-449c-bd1b-019204f5125e)

![chatwithpdf](https://github.com/harshOpensource/chatwithpdf/assets/135038577/dbd33832-a1d6-4646-88c6-11a6b1bbe7ab)

# Overview

Welcome to the "Chat With PDF" project, a comprehensive chat application with PDF integration. This project is designed to provide a seamless chat experience where users can upload PDF files, create chats around them, and interact with an AI assistant. The AI assistant uses the OpenAI API to generate responses based on the chat context. The application also includes a subscription feature, where users can subscribe to access premium features. The subscription process is handled using Stripe for payments and webhooks for event processing.

## Technologies and Frameworks

* Next.js
* React
* TypeScript
* Tailwind CSS
* Clerk
* Drizzle ORM
* PostgreSQL
* Uploadthing
* OpenAI API
* Stripe
* Axios
* Pinecone
* Drizzle-kit
* OpenAI Edge
* Neon Database Serverless
* Drizzle-orm/neon-http
* @tanstack/react-query
* @clerk/nextjs
* clsx
* tailwind-merge

## Installation

### Follow the steps below to install and setup the project:

### 1. Clone the repository
```
git clone https://github.com/harshOpensource/chatwithpdf.git
```

### 2. Navigate to the project directory
```
cd chatwithpdf
```

### 3. Install the required dependencies
```
npm install
```

### 4. Setup environment variables

Create a ```.env``` file in the root directory of your project and add the required environment variables.

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

NEXT_PUBLIC_DATABASE_URL=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

#Pinecone
PINECONE_ENVIRONMENT=
PINECONE_API_KEY=

OPENAI_API_KEY=

STRIPE_API_KEY=

NEXT_BASE_URL=http://localhost:3000
```

### 5. Run the Project
```
npm run dev
```

### Open http://localhost:3000 with your browser to see the result.
