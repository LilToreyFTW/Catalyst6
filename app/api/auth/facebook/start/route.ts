import { NextResponse } from "next/server";

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/^/, "https://") ??
    "http://localhost:3000"
  );
}

export async function GET() {
  const appId = process.env.FACEBOOK_APP_ID;
  if (!appId) {
    return NextResponse.json(
      { error: "FACEBOOK_APP_ID is not configured." },
      { status: 500 }
    );
  }

  const redirectUri =
    process.env.FACEBOOK_REDIRECT_URI ??
    `${getBaseUrl()}/api/auth/facebook/callback`;

  const state = crypto.randomUUID();
  const authUrl = new URL("https://www.facebook.com/v23.0/dialog/oauth");
  authUrl.searchParams.set("client_id", appId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("scope", "public_profile,email");
  authUrl.searchParams.set("response_type", "code");

  return NextResponse.redirect(authUrl);
}
