// // lib/supabase.js

// import { createClient } from '@supabase/supabase-js';

// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );



// @/lib/supabase.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fixed getBusinessBySlug function
export const getBusinessBySlug = async (slug) => {
  try {
    if (!slug) {
      throw new Error('Slug is required');
    }

    console.log('Fetching business with slug:', slug);

    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      throw new Error(`No business found with slug: ${slug}`);
    }

    console.log('Business found:', data);
    return data;

  } catch (error) {
    console.error('Error in getBusinessBySlug:', error);
    throw error;
  }
};

// Alternative function if your table structure is different
export const getBusinessBySlugAlternative = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        id,
        name,
        business_name,
        slug,
        description,
        logo_url,
        template_id,
        created_at,
        updated_at
      `)
      .eq('slug', slug)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors if no data found

    if (error) {
      console.error('Database error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
};

// Function to create business if it doesn't exist
export const createBusinessIfNotExists = async (slug, businessName) => {
  try {
    // First check if business exists
    let business = await getBusinessBySlugAlternative(slug);
    
    if (!business) {
      // Create new business
      const { data, error } = await supabase
        .from('businesses')
        .insert([
          {
            slug: slug,
            name: businessName || 'Unnamed Business',
            business_name: businessName || 'Unnamed Business',
            template_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      business = data;
    }

    return business;
  } catch (error) {
    console.error('Error creating/fetching business:', error);
    throw error;
  }
};