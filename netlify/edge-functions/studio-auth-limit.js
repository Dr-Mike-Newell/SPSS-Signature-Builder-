// Restrict repeated requests to the staff login endpoint only.
// Netlify's native function rate-limit window is capped at 180 seconds.
// Authentication itself remains handled by studio-gate.js.
export default async function handler(request, context) {
  return context.next();
}

export const config = {
  path: "/studio-auth",
  method: "POST",
  rateLimit: {
    action: "rate_limit",
    aggregateBy: "ip",
    windowLimit: 5,
    windowSize: 180,
  },
};
