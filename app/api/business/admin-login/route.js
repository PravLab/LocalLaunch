import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Use Service Role to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, businessSlug } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const emailLower = email.trim().toLowerCase();
    console.log('🔐 Login attempt:', { email: emailLower, businessSlug });

    // Build query - check admin_email OR email field
    let query = supabaseAdmin
      .from('businesses')
      .select('id, slug, business_name, admin_email, email, admin_password')
      .or(`admin_email.eq.${emailLower},email.eq.${emailLower}`);

    if (businessSlug) {
      query = query.eq('slug', businessSlug);
    }

    const { data: businesses, error } = await query;

    if (error) {
      console.error('❌ Database query error:', error);
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 500 }
      );
    }

    console.log('📊 Query result:', { 
      foundCount: businesses?.length || 0,
      businesses: businesses?.map(b => ({ 
        id: b.id, 
        admin_email: b.admin_email,
        email: b.email,
        slug: b.slug 
      }))
    });

    if (!businesses || businesses.length === 0) {
      console.log('⚠️ No business found for email:', emailLower);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // If multiple businesses, try to match by slug or take first
    let business = businesses[0];
    if (businesses.length > 1 && businessSlug) {
      business = businesses.find(b => b.slug === businessSlug) || businesses[0];
    }

    console.log('✅ Found business:', { 
      id: business.id, 
      slug: business.slug,
      hasPassword: !!business.admin_password 
    });

    // Check password field
    const storedPassword = business.admin_password;

    if (!storedPassword) {
      console.error('❌ No admin_password found in database for business:', business.id);
      return NextResponse.json(
        { error: 'Account not properly configured. Please set admin password.' },
        { status: 500 }
      );
    }

    console.log('🔍 Password check:', {
      passwordLength: storedPassword.length,
      isHashed: storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$'),
      firstChars: storedPassword.substring(0, 10)
    });

    // Verify password
    let passwordMatch = false;

    // Check if password is hashed (bcrypt)
    if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$')) {
      try {
        passwordMatch = await bcrypt.compare(password, storedPassword);
        console.log('🔒 Bcrypt comparison:', passwordMatch ? '✅ Match' : '❌ No match');
      } catch (bcryptError) {
        console.error('❌ Bcrypt error:', bcryptError);
        return NextResponse.json(
          { error: 'Password verification failed' },
          { status: 500 }
        );
      }
    } else {
      // Plain text comparison
      passwordMatch = storedPassword === password;
      console.log('📝 Plain text comparison:', passwordMatch ? '✅ Match' : '❌ No match');
      
      if (passwordMatch) {
        console.warn('⚠️ WARNING: Password stored in plain text! Should be hashed.');
      }
    }

    if (!passwordMatch) {
      console.log('❌ Password mismatch for:', emailLower);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Success!
    console.log('✅ Login successful for:', emailLower);
    
    return NextResponse.json({
      success: true,
      business: {
        id: business.id,
        slug: business.slug,
        name: business.business_name,
        admin_email: business.admin_email || business.email,
      },
    });

  } catch (error) {
    console.error('💥 Unexpected login error:', error);
    return NextResponse.json(
      { error: 'Login failed: ' + error.message },
      { status: 500 }
    );
  }
}