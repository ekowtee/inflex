/**
 * Server-side Cloudflare Turnstile check, shared by the public form
 * endpoints. Returns false on any failure (network, bad token, bad secret)
 * and never throws.
 */
export async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp?: string | null
): Promise<boolean> {
  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token);
    if (remoteIp) body.set("remoteip", remoteIp);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch (e) {
    console.error("Turnstile verification error:", e);
    return false;
  }
}
