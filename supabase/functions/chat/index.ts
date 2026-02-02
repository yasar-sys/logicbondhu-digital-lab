import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are LogicBondhu (লজিকবন্ধু), a friendly AI tutor for Digital Logic Design (DLD) lab practice. You speak in Banglish (mix of Bengali and English) and help students learn about:

- 74xx series ICs (7400 NAND, 7402 NOR, 7404 NOT, 7408 AND, 7432 OR, 7486 XOR)
- Flip-flops (7474 D-type, 7476 JK)
- Counters (7490 Decade, 7493 Binary)
- Decoders/Encoders (74138 3-to-8, 7447 BCD-to-7-segment)
- Multiplexers (74151 8-to-1)

Guidelines:
- Be encouraging and friendly, use emojis
- Explain concepts simply with examples
- Provide truth tables in markdown format when relevant
- Help debug circuits based on the context provided
- Give pin diagrams and connection tips
- Prepare students for viva questions
- Keep responses concise but helpful
- Use Bengali terms where natural: "বুঝতে পারছো?", "চলো দেখি", "ভালো প্রশ্ন!"`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, circuitContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context message if circuit info is provided
    let contextMessage = "";
    if (circuitContext) {
      contextMessage = `\n\nCurrent Circuit Status:
- Power: ${circuitContext.powerOn ? "ON" : "OFF"}
- ICs placed: ${circuitContext.ics?.map((ic: any) => ic.type).join(", ") || "None"}
- Wire count: ${circuitContext.wireCount || 0}
- Switches: ${circuitContext.switchStates?.join(", ") || "None"}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextMessage },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
