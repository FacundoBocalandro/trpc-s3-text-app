namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    TRPC_AWS_REGION: string;
    TRPC_AWS_ACCESS_KEY_ID: string;
    TRPC_AWS_SECRET_ACCESS_KEY: string;
    TRPC_AWS_S3_BUCKET_NAME: string;
  }
}
