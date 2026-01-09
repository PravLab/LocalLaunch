// app/api/register/route.js
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { jwtVerify } from "jose";

// Schema
const ProductSchema = z.object({
  name: z.string().min(1, "Product name required"),
  price: z.union([z.string(), z.number()]).transform((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? 0 : num;
  }),
  image: z.string().optional().default(""),
  category: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

const BusinessSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be 10 digits").max(15),
  email: z.string().email().optional().or(z.literal("")),
  type: z.string().min(2, "Business type required"),
  customType: z.string().optional().default(""),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  whatsapp: z.string().min(10, "WhatsApp must be 10 digits").max(15),
  logo: z.string().optional().default(""),
  products: z.array(ProductSchema).min(1, "At least one product required"),
  enable_subdomain: z.boolean().optional().default(false),
  // Payment fields
  paymentId: z.string().min(1, "Payment ID required"),
  orderId: z.string().min(1, "Order ID required"),
  orderRef: z.string().optional(),
  plan: z.string().optional().default("pro_monthly"),
});

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return sanitizeHtml(str, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Database not configured");
  }

  return createClient(url, key);
}

async function generateUniqueSlug(supabase, baseName) {
  let slug = baseName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .slice(0, 50);

  const { data: existing } = await supabase
    .from("businesses")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    const suffix = Math.random().toString(36).substring(2, 6);
    slug = `${slug.slice(0, 45)}-${suffix}`;
  }

  return slug;
}

async function verifyPayment(cookieStore) {
  const accessToken = cookieStore.get("registration_access")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(accessToken, secret);
    return payload;
  } catch (e) {
    return null;
  }
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();

    // Verify payment token
    const paymentData = await verifyPayment(cookieStore);
    
    if (!paymentData) {
      return Response.json(
        { error: "Payment verification required. Please complete payment first." },
        { status: 401 }
      );
    }

    // Initialize Supabase
    let supabase;
    try {
      supabase = getSupabase();
    } catch (e) {
      return Response.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    // Parse body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Validate payment IDs match
    if (body.paymentId !== paymentData.paymentId) {
      return Response.json(
        { error: "Payment verification failed." },
        { status: 401 }
      );
    }

    // Validate with Zod
    const parse = BusinessSchema.safeParse(body);
    
    if (!parse.success) {
      return Response.json(
        { 
          error: "Validation failed", 
          details: parse.error.errors 
        },
        { status: 400 }
      );
    }

    const data = parse.data;

    // Sanitize
    const sanitizedData = {
      businessName: sanitize(data.businessName),
      ownerName: sanitize(data.ownerName),
      phone: data.phone.replace(/\D/g, '').slice(0, 10),
      email: data.email || '',
      type: data.type === 'other' ? sanitize(data.customType) : sanitize(data.type),
      description: sanitize(data.description),
      address: sanitize(data.address),
      whatsapp: data.whatsapp.replace(/\D/g, '').slice(0, 10),
      logo: data.logo || '',
      products: data.products.map(p => ({
        name: sanitize(p.name),
        price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
        image: p.image || '',
        category: sanitize(p.category || ''),
        description: sanitize(p.description || ''),
      })).filter(p => p.name && p.price > 0),
      enable_subdomain: data.enable_subdomain || false,
    };

    if (sanitizedData.products.length === 0) {
      return Response.json(
        { error: "At least one valid product required" },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = await generateUniqueSlug(supabase, sanitizedData.businessName);

    // Check duplicate phone
    const { data: phoneExists } = await supabase
      .from("businesses")
      .select("id")
      .eq("phone", sanitizedData.phone)
      .maybeSingle();

    if (phoneExists) {
      return Response.json(
        { error: "This phone number is already registered" },
        { status: 409 }
      );
    }

    // Insert business
    const { data: inserted, error: insertError } = await supabase
      .from("businesses")
      .insert([{
        business_name: sanitizedData.businessName,
        owner_name: sanitizedData.ownerName,
        phone: sanitizedData.phone,
        email: sanitizedData.email,
        type: sanitizedData.type,
        description: sanitizedData.description,
        address: sanitizedData.address,
        whatsapp: sanitizedData.whatsapp,
        logo: sanitizedData.logo,
        slug: slug,
        products: sanitizedData.products,
        enable_subdomain: sanitizedData.enable_subdomain,
        is_verified: false,
        is_active: true,
        // Payment info
        payment_id: paymentData.paymentId,
        order_id: paymentData.orderId,
        plan: paymentData.plan,
        subscription_status: "active",
        subscription_start: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }])
      .select("id, slug")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return Response.json(
        { error: "Failed to create business." },
        { status: 500 }
      );
    }

    // Create auth token
    const token = jwt.sign(
      { 
        slug: inserted.slug,
        id: inserted.id,
        type: 'owner'
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Set auth cookie
    cookieStore.set({
      name: "local_launch_auth",
      value: token,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    // Clear registration access (one-time use)
    cookieStore.delete("registration_access");

    return Response.json(
      { 
        success: true,
        slug: inserted.slug,
        message: "Store created successfully!" 
      },
      { status: 201 }
    );

  } catch (err) {
    console.error("Registration error:", err);
    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}