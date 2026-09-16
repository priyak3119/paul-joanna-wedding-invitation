import submitRsvp from "./netlify/functions/wedding-rsvp";
export default {
  async fetch(request: Request, env: { ASSETS: { fetch(request: Request): Promise<Response> } }): Promise<Response> {
    if (new URL(request.url).pathname === "/api/wedding-rsvp") return submitRsvp(request);
    return env.ASSETS.fetch(request);
  }
};
