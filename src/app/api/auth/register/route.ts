import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { saveUser, findUserByEmail } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import { z } from "zod";

// PERINGATAN: Rate limiter menggunakan in-memory Map yang TIDAK COCOK untuk lingkungan serverless
// (Vercel, AWS Lambda, dll). Data akan hilang setiap server restart/hot reload.
// Untuk produksi, gunakan solusi penyimpanan eksternal seperti Redis.
// Pertimbangkan menggunakan library 'rate-limiter-flexible' yang mendukung berbagai backend.

// Rate limiter configuration
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per window

// In-memory store for rate limiting (reset on server restart)
const requestMap = new Map<string, number[]>();

// Helper function to get client IP
function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }
  // Fallback: this might not work in all environments (e.g., Vercel)
  return 'unknown';
}

// Rate limiter middleware
function rateLimiter(req: Request): { limited: boolean; retryAfter?: number } {
  const ip = getClientIP(req);
  const now = Date.now();
  
  // Get existing timestamps for this IP, or initialize empty array
  const timestamps = requestMap.get(ip) || [];
  
  // Remove timestamps older than the window
  const validTimestamps = timestamps.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS);
  
  // Check if limit exceeded
  if (validTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    // Calculate retry after time (time until oldest request expires)
    const oldestRequest = Math.min(...validTimestamps);
    const retryAfter = Math.ceil((oldestRequest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { limited: true, retryAfter };
  }
  
  // Add current request timestamp and update map
  validTimestamps.push(now);
  requestMap.set(ip, validTimestamps);
  
  return { limited: false };
}

export async function POST(req: Request) {
  // Apply rate limiting
  const rateLimitResult = rateLimiter(req);
  if (rateLimitResult.limited) {
    return NextResponse.json(
      { message: "Terlalu banyak permintaan. Silakan coba lagi nanti." },
      { status: 429, headers: { 'Retry-After': String(rateLimitResult.retryAfter) } }
    );
  }

  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await findUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const newUser = await saveUser({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", user: { id: newUser.id, name: newUser.name, email: newUser.email } },
      { status: 201 }
    );
  } catch (error: any) {
    // Logging detail untuk debugging di server sambil tetap mengirim response generik ke client
    console.error("[REGISTRATION_ERROR] Detailed error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Log spesifik berdasarkan tipe error untuk debugging yang lebih baik
    if (error instanceof z.ZodError) {
      console.error("[REGISTRATION_ZOD_ERROR] Validation failed:", error.errors);
      return NextResponse.json(
        { message: "Data yang dimasukkan tidak valid", errors: error.errors },
        { status: 400 }
      );
    }
    
    // Error untuk in-memory database (jarang terjadi)
    if (error instanceof TypeError || error instanceof ReferenceError) {
      console.error("[REGISTRATION_RUNTIME_ERROR] Runtime error:", error);
    }
    
    return NextResponse.json(
      { message: "Terjadi kesalahan saat registrasi. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
