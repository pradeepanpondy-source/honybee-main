import { z } from 'zod';

// User input sanitization function
export const sanitizeInput = (str: string): string => {
    return str.trim().replace(/[<>]/g, ''); // Basic XSS prevention by removing < and >
};

// Signup Schema
export const signUpSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .transform(sanitizeInput),
    email: z.string()
        .email('Invalid email address')
        .max(100, 'Email must be less than 100 characters')
        .transform(sanitizeInput),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters')
        // At least one uppercase, one lowercase, one number
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

// Login Schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address').transform(sanitizeInput),
    password: z.string().min(1, 'Password is required'),
});

// Contact Lemma
export const contactSchema = z.object({
    name: z.string().min(2, 'Name is too short').max(50).transform(sanitizeInput),
    email: z.string().email('Invalid email address').transform(sanitizeInput),
    message: z.string().min(10, 'Message is too short').max(1000).transform(sanitizeInput),
});

// Seller Registration Lemma
export const sellerRegistrationSchema = z.object({
    name: z.string().min(2).max(100).transform(sanitizeInput),
    email: z.string().email().transform(sanitizeInput),
    seller_type: z.enum(['honey', 'beehive']),
    phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number').transform(sanitizeInput),
    address: z.string().min(5).max(200).transform(sanitizeInput),
    city: z.string().min(2).max(50).transform(sanitizeInput),
    state: z.string().min(2).max(50).transform(sanitizeInput),
    zip: z.string().regex(/^\d{5,6}$/, 'Invalid zip code').transform(sanitizeInput),
});

// Product Lemma
export const productSchema = z.object({
    name: z.string().min(2, 'Name is too short').max(100).transform(sanitizeInput),
    description: z.string().min(10, 'Description is too short').max(2000).transform(sanitizeInput),
    price: z.number().positive('Price must be positive'),
    category: z.string().min(1, 'Category is required').transform(sanitizeInput),
    stock: z.number().int().nonnegative('Stock cannot be negative'),
    image_url: z.string().url('Invalid image URL').or(z.literal('')).transform(sanitizeInput),
});
