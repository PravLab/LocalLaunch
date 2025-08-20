// app/api/is-deliverable/route.js

import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { address, slug } = await req.json();

    if (!address || !slug) {
      return new Response(JSON.stringify({ deliverable: false, reason: "Missing data" }), {
        status: 400,
      });
    }

    // Step 1: Get delivery area for the business
    const { data: business, error } = await supabase
      .from("businesses")
      .select("delivery_area")
      .eq("slug", slug)
      .single();

    if (error || !business) {
      return new Response(JSON.stringify({ deliverable: false, reason: "Business not found" }), {
        status: 404,
      });
    }

    if (!business.delivery_area || business.delivery_area.length === 0) {
      return new Response(JSON.stringify({ deliverable: false, reason: "No delivery area set" }), {
        status: 200,
      });
    }

    // Step 2: Get geolocation info from OpenStreetMap
    const nominatimURL = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json&addressdetails=1`;

    const geoRes = await fetch(nominatimURL, {
      headers: {
        "User-Agent": "LocalLaunchBot/1.0 (hello@locallaunch.in)",
        "Referer": "https://locallaunch.in",
      },
    });

    if (!geoRes.ok) {
      return new Response(
        JSON.stringify({ deliverable: false, reason: "Nominatim API failed" }),
        { status: 500 }
      );
    }

    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      return new Response(JSON.stringify({ deliverable: false, reason: "Location not found" }), {
        status: 200,
      });
    }

    const addressInfo = geoData[0].address || {};
    const deliveryAreas = business.delivery_area.map((area) => area.trim().toLowerCase());

    const priorityFields = [
      addressInfo.city,
      addressInfo.town,
      addressInfo.village,
      addressInfo.suburb,
      addressInfo.county,
      addressInfo.district,
      addressInfo.state_district,
      addressInfo.postcode,
    ].filter(Boolean).map((x) => x.trim().toLowerCase());

    // Fuzzy match (either includes the other)
    const isDeliverable = priorityFields.some((field) =>
      deliveryAreas.some((area) =>
        field.includes(area) || area.includes(field)
      )
    );

    // Debug logs
    console.log("📦 User Address Parts:", priorityFields);
    console.log("🚚 Delivery Areas:", deliveryAreas);
    console.log("✅ Deliverable:", isDeliverable);

    return new Response(JSON.stringify({ deliverable: isDeliverable }), {
      status: 200,
    });

  } catch (err) {
    console.error("❌ API error:", err);
    return new Response(JSON.stringify({ deliverable: false, reason: "Server error" }), {
      status: 500,
    });
  }
}
