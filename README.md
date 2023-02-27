# TRPC+S3 Text App V1

## Description

This is a non-authenticated chat room app where anyone can enter a message into the single (global) room. You can optionally upload an image which will be attached to the message and always displayed. Anyone can delete any message by clicking the delete icon. Messages are displayed with their timestamp. The app uses TypeScript for strong type-checking, trpc for client-API communication with Zod for schema validation, and Mantine for UX. The web client communicates directly to S3 via pre-signed URLs. S3 is secured and does not allow uploading without a signed URL. MongoDB is used for storage of the message while S3 is used for storage of the images.

## Tech Stack

- [TypeScript](https://www.typescriptlang.org/)
- [trpc](https://trpc.io/)
- [Zod](https://zod.dev/)
- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [AWS S3](https://aws.amazon.com/s3/)
- [Mantine](https://mantine.dev/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)

## Routes

The following API routes are available:

- msg.list - retrieves a list of messages
- msg.add - adds a message to the chat room
- msg.delete - deletes a message from the chat room

## Set Up

To get started with the app:

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Set up environment variables by creating a .env.local file at the root of the project and adding the following variables:

`TRPC_AWS_ACCESS_KEY_ID=your_aws_access_key_id
TRPC_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
TRPC_AWS_REGION=your_aws_region
TRPC_AWS_S3_BUCKET_NAME=your_aws_s3_bucket_name
DATABASE_URL=your_mongodb_url`

Make sure to replace the values with your own AWS and MongoDB credentials.

4. Run the app with `pnpm run dev`
5. Open http://localhost:3000 to view the app in the browser.

## Extra Credit Features

- msg.add and msg.delete have optimistic updates for fast perceived performance.
- Used Mantine for UX.
- Used prettier and linter to make code reasonable looking.

## Deployment

The app is deployed on Vercel and can be accessed [here](https://trpc-s3-text-app.vercel.app/)
