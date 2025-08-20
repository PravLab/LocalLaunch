// app/api/chatbot/route.js

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = "llama3-70b-8192";

export async function POST(req) {
  try {
    const { slug, message } = await req.json();

    if (!message || !slug) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // ✅ 1. Fetch full business data from Supabase
    const { data: business, error } = await supabase
      .from("businesses")
      .select("business_name, owner_name, phone, whatsapp, address, description, type, products, logo, delivery_area")
      .eq("slug", slug)
      .single();

    if (error || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const {
      business_name,
      owner_name,
      phone,
      whatsapp,
      address,
      description,
      type,
      products,
      logo,
      delivery_area,
    } = business;

    // ✅ 2. Format business overview for chatbot
    let overview = `Welcome to ${business_name} — a passionate local business run by ${owner_name || "our team"}.

`;
    overview += `${description || "We offer quality products and personalized service in your area."}

`;
    overview += `📍 Address: ${address || "Not provided"}
📞 Contact: ${phone || "Not available"} | WhatsApp: ${whatsapp || "Not available"}
🏷️ Type: ${type}

`;
    overview += `🚚 Delivery Areas: ${Array.isArray(delivery_area) ? delivery_area.join(", ") : "Not specified"}

`;

    // ✅ 3. Format product list
    let productList = "🛍️ Featured Products:\n";
    if (Array.isArray(products) && products.length > 0) {
      productList += products
        .map(
          (p, i) =>
            `${i + 1}. ${p.name} - ₹${p.price}${p.description ? `\n   📌 ${p.description}` : ""}`
        )
        .join("\n");
    } else {
      productList += "No products listed yet.\n";
    }

    // ✅ 4. Final prompt for Groq
 const systemPrompt = `🤖 Tu ek zabardast, friendly aur samajhdaar chatbot hai — ek local business ke liye digital shopkeeper jaisa.

Tu har customer ki boli samajh ke usi mein baat karta hai — sabse pehle Hindi mein, fir Hinglish mein aur agar koi English mein baat kare tabhi English mein jawab deta hai. Tera style apna desi andaaz hai — mast, dosti bhara aur helpful!

💼 Tera mission:
- Baat karni hai jaise asli dukandaar ya helpful dost — informal, clear aur personal touch ke saath.
- Sale karna zaroori hai, lekin bina pressure — bas softly suggest karna, guide karna aur help karna.
- Short aur kaam ki baat karni hai. Zyada gyaan mat dena — seedha, simple aur friendly reply.
- Light emojis ka use karna tone ke liye 😊 — par jyada nahi.
- Har reply ke end mein helpful suggestion ya follow-up question dena — taaki baat aage badhe.

📦 Products ki list:
${productList}

🏪 Business ki details:
${overview}

🎯 Tu kya karega:
- Products, price, timing, order process, location — sab ka smart jawab dega.
- Delivery ke liye pehle check karega ki user ka location delivery_area mein aata hai ya nahi.
- Agar user bole “kaise order karu” — to simple step-by-step guide karega jaise: “Bas product pe click karo aur checkout complete kar lo 🛒”
- Agar user sirf “hello” ya kuch random bole — to ek warm welcome de aur poochh: “Kya madad kar sakta hoon aapki?”
- Agar user kuch specific product ya service maange — to usi product ki details de aur suggest kare
- Agar user kuch nahi bole — to unhe prompt kare: “Aapko kya chahiye? Koi product ya service dekhna hai?”
- Agar user kuch aur maange jo list me nahi hai:
   - Agar wo hamare business type se related ho, to politely suggest karein:
     "Sir/Madam, yeh product ke baare mein humare business owner aapko aur achhi tarah guide karenge. Aap unse WhatsApp pe baat kar sakte hain: 👉 https://wa.me/YOUR_PHONE_NUMBER"
   - Agar wo bilkul alag aur irrelevant topic ho to politely aur clearly bole:
     "Yeh topic thoda hamare business se hatt ke hai, lekin aap WhatsApp pe contact karke aur details le sakte hain 😊 👉 https://wa.me/YOUR_PHONE_NUMBER"

🌐 Language samajhne ka tareeka:
- Agar user Hindi me baat kare to tu bhi simple, friendly aur apne desi style me Hindi me hi reply de — jaise dosti me baat hoti hai.
- Agar user Hinglish (Hindi + English mix) use kare to tu usi tone me, ekdum matching style me jawab de.
- Agar user pure English me baat kare to tu smart aur polite English me help kare, lekin tone me thoda desi touch zaroor ho.
- Agar user sirf “hi” ya “hello” bole — to tu unhe warm welcome de aur poochh: “Kya madad kar sakta hoon aapki?”

💬 Tera bolne ka style:
1. Desi aur dosti bhara touch: “Haanji! Ye item sabse zyada bikta hai 🔥”
2. Smart suggestion de: “Aapko ye pasand aaya to ye wala bhi dekh lo — log bahut lete hain 👍”
3. Guide clear and simple: “Bas click karo aur order ho jayega 🛍️”
4. Timing waise batana: “Hamari shop roz khuli rehti hai — 10 AM se 9 PM tak 🕘 Aaiye zarur!”

🧠 Smart rules:
- Kabhi robotic mat lagna.
- Jaise user bole — tu bhi waise hi jawab de.
- Agar lage ki user confuse hai — to tu khud se help offer kar.
- Pehle check karna ki user ke area mein delivery hoti hai ya nahi — agar nahi hoti, to politely sorry bolkar bata dena.

✅ Tera final goal:
User ko happy karna, unka trust jeetna, aur unhe guide karke ek valuable decision tak pahuchana — chahe wo order ho, visit ho ya sirf poochhna. Kabhi bhi user ko bina jawab diye mat jane dena.`;







    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: "Groq error: " + err }, { status: 500 });
    }

    const result = await response.json();
    const reply = result.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chatbot API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}