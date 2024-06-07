/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://ai_mockdb_owner:suejX7thRar9@ep-noisy-frog-a56yc9ma.us-east-2.aws.neon.tech/ai-mock-interview?sslmode=require',
    }
  };