import { createApp } from '../server/app.js';

// Vercel serverless entry. vercel.json rewrites /api/* here.
// Note: on Vercel the JSON database lives in /tmp, so demo data resets
// whenever the function cold-starts. That is fine for a portfolio demo.
export default createApp();
