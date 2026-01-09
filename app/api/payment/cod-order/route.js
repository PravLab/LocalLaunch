import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const body = await req.json();
    
    const {
      businessId,
      businessSlug,
      customerName,
      customerPhone,
      customerEmail,
      address,
      landmark,
      city,
      state,
      pincode,
      // Single product fields
      productId,
      productName,
      productPrice,
      productImage,
      productSlug,
      // Multiple items fields
      items,
      totalAmount,
    } = body;

    if (!businessId || !customerName || !customerPhone || !address) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Fetch current business
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("orders, business_name, whatsapp, phone")
      .eq("id", businessId)
      .single();

    if (bizError || !business) {
      return Response.json({ success: false, error: "Business not found" }, { status: 404 });
    }

    // Generate order ID
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

    // Build order object
    const newOrder = {
      orderId,
      created_at: new Date().toISOString(),
      status: "pending",
      orderType: "regular",
      paymentMethod: "cod",
      
      // Customer info
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      
      // Address
      address,
      landmark: landmark || null,
      city,
      state,
      pincode,
      
      // Payment
      payment: {
        method: "cod",
        status: "pending",
      },
    };

    // ✅ Handle items array (cart checkout with multiple items)
    if (items && Array.isArray(items) && items.length > 0) {
      newOrder.items = items.map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: item.quantity || 1,
        image: item.image || null,
        size: item.size || null,
      }));
      newOrder.totalAmount = totalAmount || items.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
      newOrder.itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    } 
    // ✅ Handle single product (Buy Now button)
    else if (productName) {
      newOrder.items = [{
        id: productId,
        name: productName,
        price: Number(productPrice) || 0,
        quantity: 1,
        image: productImage || null,
        slug: productSlug || null,
      }];
      newOrder.totalAmount = Number(productPrice) || 0;
      newOrder.itemCount = 1;
    } else {
      return Response.json({ success: false, error: "No products in order" }, { status: 400 });
    }

    // Add order to business orders array
    const existingOrders = business.orders || [];
    const updatedOrders = [newOrder, ...existingOrders];

    const { error: updateError } = await supabase
      .from("businesses")
      .update({ orders: updatedOrders })
      .eq("id", businessId);

    if (updateError) {
      console.error("Order save error:", updateError);
      return Response.json({ success: false, error: "Failed to save order" }, { status: 500 });
    }

    return Response.json({
      success: true,
      order: {
        order_id: orderId,
        items: newOrder.items,
        total: newOrder.totalAmount,
      },
      business: {
        whatsapp: business.whatsapp || business.phone,
      },
    });

  } catch (error) {
    console.error("COD order error:", error);
    return Response.json({ success: false, error: "Server error" }, { status: 500 });
  }
}