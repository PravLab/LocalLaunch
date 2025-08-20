// app/api/auth/signup/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { email, password, slug } = await req.json()

    // 1. Create user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin',
          business_slug: slug
        }
      }
    })

    if (authError) throw authError

    // 2. Immediately sign in
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (signInError) throw signInError

    // 3. Update business record
    const { error: updateError } = await supabase
      .from('businesses')
      .update({
        admin_id: authData.user?.id,
        admin_email: email,
        admin_created_at: new Date().toISOString()
      })
      .eq('slug', slug)
    if (updateError) throw updateError

    // 4. Return success with NO redirect - client will handle
    return NextResponse.json({ 
      success: true,
      userId: authData.user?.id
    })

  } catch (error) {
    return NextResponse.json(
      { error: error.message.includes('already registered') 
        ? 'Email already in use' 
        : 'Signup failed' },
      { status: 400 }
    )
  }
}