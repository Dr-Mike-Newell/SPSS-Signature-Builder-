// Netlify Edge gateway for the Signature Studio application.
// No password, hash, or usable authentication token is committed to Git.
// Set SIGNATURE_STUDIO_PASSWORD in Netlify project environment variables,
// with scope Functions, then redeploy. When unset the app FAILS CLOSED.
//
// Images used in external Outlook signatures MUST remain publicly retrievable,
// so only /assets/logos/*.png|jpg|jpeg|webp bypasses authentication.
// This exception does NOT expose app.js, config.js, studio.js, or index.html.
const COOKIE = "spss_studio_access";
const LIFETIME_MS = 8 * 60 * 60 * 1000;
const enc = new TextEncoder();

async function sha256(value) {
 return new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(value)));
}
function equalBytes(a, b) {
 if(a.length !== b.length)return false;
 let different = 0;
 for(let i=0;i<a.length;i++)different |= a[i] ^ b[i];
 return different === 0;
}
async function matchingPassword(supplied, expected) {
 return equalBytes(await sha256(supplied), await sha256(expected));
}
async function hmac(password, message) {
 const key = await crypto.subtle.importKey(
  "raw", enc.encode("SPSS signature studio session v1:" + password),
  {name:"HMAC",hash:"SHA-256"}, false, ["sign"]
 );
 return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
}
function base64Url(bytes) {
 let text = "";
 for(const b of bytes)text += String.fromCharCode(b);
 return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
async function authenticated(cookieHeader, password) {
 const cookieValue=(cookieHeader || "").split(";").map(x=>x.trim())
  .find(x=>x.startsWith(COOKIE + "="))?.slice(COOKIE.length+1);
 if(!cookieValue)return false;
 const parts=cookieValue.split(".");
 if(parts.length!==3||parts[0]!=="v1"||!/^\d{13}$/.test(parts[1])||! /^[A-Za-z0-9_-]{43}$/.test(parts[2]))return false;
 const expires=Number(parts[1]);
 if(expires<=Date.now() || expires>Date.now()+LIFETIME_MS+60_000)return false;
 const signature=base64Url(await hmac(password,"v1."+parts[1]));
 const supplied=parts[2];
 let different=signature.length^supplied.length;
 for(let i=0;i<Math.max(signature.length,supplied.length);i++)
  different |= (signature.charCodeAt(i)||0)^(supplied.charCodeAt(i)||0);
 return different===0;
}
function json(message,status,extraHeaders={}) {
 return new Response(JSON.stringify({message}),{
  status,headers:{"content-type":"application/json; charset=utf-8",
   "cache-control":"no-store","x-content-type-options":"nosniff",...extraHeaders}
 });
}
function unauthenticated(request,unconfigured=false){
 const next=new URL("/access.html",request.url);
 if(unconfigured)next.searchParams.set("setup","required");
 return Response.redirect(next.href,302);
}
export default async function handler(request,context){
 const url=new URL(request.url);
 const path=url.pathname;
 // Public artwork used by signatures that have already been delivered.
 if(/^\/assets\/logos\/[a-zA-Z0-9._-]+\.(?:png|jpe?g|webp)$/.test(path))return context.next();
 if(path==="/access.html" && request.method==="GET")return context.next();
 const password=Netlify.env.get("SIGNATURE_STUDIO_PASSWORD");
 if(path==="/studio-auth" && request.method==="POST"){
  if(!password || password.length<12)return json("Access is not configured. Ask the site administrator to set the Netlify password.",503);
  const origin=request.headers.get("origin");
  if(origin && origin!==url.origin)return json("Invalid request origin.",403);
  const type=request.headers.get("content-type")||"";
  if(!type.toLowerCase().startsWith("application/x-www-form-urlencoded"))return json("Invalid form submission.",415);
  const body=await request.text();
  if(body.length>1024)return json("Invalid form submission.",413);
  const supplied=new URLSearchParams(body).get("password")||"";
  if(!await matchingPassword(supplied,password))return json("Incorrect password. Please try again.",401);
  const expiry=String(Date.now()+LIFETIME_MS);
  const signed=base64Url(await hmac(password,"v1."+expiry));
  return json("Access granted.",200,{
   "set-cookie":COOKIE+"=v1."+expiry+"."+signed+"; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age="+(LIFETIME_MS/1000)
  });
 }
 if(path==="/studio-auth" && request.method==="GET")return json("Method not allowed.",405);
 if(path==="/studio-logout" && request.method==="POST")
  return json("Signed out.",200,{"set-cookie":COOKIE+"=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"});
 // Any app pages and scripts, including routes that do not exist, are protected.
 if(!password || password.length<12)return unauthenticated(request,true);
 if(await authenticated(request.headers.get("cookie"),password))return context.next();
 return unauthenticated(request);
}
