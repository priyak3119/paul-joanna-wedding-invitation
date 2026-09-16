export default async (req: Request) => {
  const reply = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (req.method !== "POST") return reply({ ok: false }, 405);
  try {
    const input = await req.json();
    const name = typeof input.name === "string" ? input.name.trim() : "";
    const message = typeof input.message === "string" ? input.message.trim() : "";
    if (!name || name.length > 200 || message.length > 10000 ||
        !["Attending", "Wishes Online"].includes(input.attendance)) return reply({ ok: false }, 400);
    const attending = input.attendance === "Attending";
    if (attending && (!Number.isInteger(input.guests) || input.guests < 1 || input.guests > 8)) return reply({ ok: false }, 400);
    const fields = new URLSearchParams({
      "entry.1086471567": name,
      "entry.1569537959": input.attendance,
      "entry.1424661284": message
    });
    if (attending) {
      fields.set("entry.877086558", input.guests + " Guest");
      if (input.event === true) fields.set("entry.1498135098", "Wedding Celebration — 29th December 2026 · 11:00 AM");
    }
    const response = await fetch("https://docs.google.com/forms/d/e/1FAIpQLScdx9b3gAJPJMJw8WZKV-BglYm90yPK2WaF6sdstiJqnf7dvA/formResponse", {
      method: "POST", body: fields, signal: AbortSignal.timeout(15000)
    });
    const result = await response.text();
    if (!response.ok || !result.includes("Thank you for your response.")) return reply({ ok: false }, 502);
    return reply({ ok: true });
  } catch {
    return reply({ ok: false }, 502);
  }
};
export const config = { path: "/api/wedding-rsvp" };
