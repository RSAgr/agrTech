import { z } from 'zod';

export const loginSchema = z.object({
  phone: z.string().min(10, 'Invalid phone number'),
  otp: z.string().min(4, 'OTP must be 4 digits')
});

export const languageSchema = z.object({
  lang: z.enum(['en', 'hi', 'bn', 'te', 'mr', 'ta', 'kn', 'gu', 'pa', 'ml'])
});

export const categorySchema = z.object({
  category: z.enum(['fallow', 'cultivating', 'post-harvest'])
});

export const phase1Schema = z.object({
  history: z.string().optional(),
  timeWindow: z.string().optional()
});

export const phase2Schema = z.object({
  crop: z.string().optional(),
  stage: z.string().optional(),
  irrigation: z.string().optional(),
  symptoms: z.string().optional()
});

export const phase3Schema = z.object({
  nextCrop: z.string().optional(),
  targetHarvest: z.string().optional()
});

export const querySchema = z.object({
  query: z.string().min(1, 'Query is required'),
  modelId: z.string().optional(),
  lang: z.string().optional(),
  category: z.string().optional(),
  farmContext: z.any().optional(),  // Full onboarding data for ML personalisation
  userId: z.string().optional(),
});

// ML_ENDPOINT: POST /ml/feedback — farmer follow-up as implicit RLHF signal
export const feedbackSchema = z.object({
  userId: z.string(),
  originalQuery: z.string(),
  mlResponse: z.string(),
  farmerFollowup: z.string(),
  lang: z.string(),
  timestamp: z.number(),
  rating: z.number().optional(),
});
