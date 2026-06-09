import { NextResponse } from "next/server";

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/^/, "https://") ??
    "http://localhost:3000"
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/?facebook=error&reason=${encodeURIComponent(error)}`, getBaseUrl())
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?facebook=missing_code", getBaseUrl()));
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri =
    process.env.FACEBOOK_REDIRECT_URI ??
    `${getBaseUrl()}/api/auth/facebook/callback`;

  if (!appId || !appSecret) {
    return NextResponse.redirect(new URL("/?facebook=missing_env", getBaseUrl()));
  }

  const tokenUrl = new URL("https://graph.facebook.com/v23.0/oauth/access_token");
  tokenUrl.searchParams.set("client_id", appId);
  tokenUrl.searchParams.set("client_secret", appSecret);
  tokenUrl.searchParams.set("redirect_uri", redirectUri);
  tokenUrl.searchParams.set("code", code);

  try {
    const tokenResponse = await fetch(tokenUrl, { cache: "no-store" });
    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL("/?facebook=token_error", getBaseUrl()));
    }

    const tokenPayload = await tokenResponse.json();
    const accessToken = tokenPayload.access_token;
    if (!accessToken) {
      return NextResponse.redirect(new URL("/?facebook=token_missing", getBaseUrl()));
    }

    const meUrl = new URL("https://graph.facebook.com/me");
    meUrl.searchParams.set("fields", "id,name,email");
    meUrl.searchParams.set("access_token", accessToken);

    const meResponse = await fetch(meUrl, { cache: "no-store" });
    if (!meResponse.ok) {
      return NextResponse.redirect(new URL("/?facebook=profile_error", getBaseUrl()));
    }

    const mePayload = await meResponse.json();
    const response = NextResponse.redirect(new URL("/?facebook=connected", getBaseUrl()));
    response.cookies.set(
      "catalyst6_facebook_profile",
      JSON.stringify({
        id: mePayload.id,
        name: mePayload.name,
        email: mePayload.email ?? null
      }),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: getBaseUrl().startsWith("https://"),
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      }
    );
    return response;
  } catch {
    return NextResponse.redirect(new URL("/?facebook=request_failed", getBaseUrl()));
  }
}
