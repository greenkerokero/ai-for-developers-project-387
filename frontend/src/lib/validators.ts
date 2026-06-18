import { z } from "zod";

export const eventTypeSchema = z.object({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens are allowed"),
  name: z.string().min(1, "Name is required"),
  description: z.string().max(500, "Max 500 characters").optional().or(z.literal('')),
  durationMinutes: z.number().int().positive("Duration must be a positive integer"),
});

export const bookingCreateSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  guestName: z.string().min(1, "Name is required"),
  guestEmail: z.string().email("Invalid email address"),
  guestComment: z.string().optional(),
});

export const availabilityRuleSchema = z.object({
  dayOfWeek: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Must be in HH:MM format"),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Must be in HH:MM format"),
  isAvailable: z.boolean(),
});

export const availabilityScheduleSchema = z.object({
  rules: z.array(availabilityRuleSchema),
});
