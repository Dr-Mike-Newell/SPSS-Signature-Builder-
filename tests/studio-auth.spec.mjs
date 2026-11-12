import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const source=await readFile("netlify/edge-functions/studio-gate.js","utf8");
const {default:gate}=await import("data:text/javascript;base64,"+Buffer.from(source).toString("base64"));
const base="https://signature-studio.example.netlify.app";
let secret="This is a secure test password 2026!";
globalThis.Netlify={env:{get:name=>name==="SIGNATURE_STUDIO_PASSWORD"?secret:undefined}};
let nextCalls=0;
const context={next:async()=>{nextCalls++;return new Response("Authorized asset or page",{status:200});}};
const call=(path,init={})=>gate(new Request(base+path,init),context);
const check=async(name,test)=>{await test();console.log("PASS:",name);};
await check("Public landing page and hosted Outlook logos remain accessible",async()=>{
 assert.equal((await call("/access.html")).status,200);
 assert.equal((await call("/assets/logos/career-powered-2026.jpg")).status,200);
 assert.equal((await call("/assets/logos/university-of-bedfordshire-master.png")).status,200);
 assert.equal(nextCalls,3);
});
await check("Application HTML, scripts, styles and other routes require a session",async()=>{
 for(const path of ["/","/index.html","/config.js","/app.js","/studio.js","/studio.css","/random"]){
  const r=await call(path);
  assert.equal(r.status,302,path);
  assert.equal(r.headers.get("location"),base+"/access.html");
 }
});
await check("No hardcoded, fallback, or absent password grants access",async()=>{
 secret=undefined;
 const r=await call("/app.js");
 assert.equal(r.status,302);
 assert.ok(r.headers.get("location").includes("setup=required"));
 const auth=await call("/studio-auth",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},
  body:new URLSearchParams({password:"anything"}).toString()});
 assert.equal(auth.status,503);
 secret="This is a secure test password 2026!";
});
await check("Login rejects wrong credentials, malformed requests and cross-origin calls",async()=>{
 const wrong=await call("/studio-auth",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},
  body:new URLSearchParams({password:"definitely-incorrect"}).toString()});
 assert.equal(wrong.status,401);
 assert.equal(wrong.headers.has("set-cookie"),false);
 const cross=await call("/studio-auth",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded","origin":"https://evil.example"},
  body:new URLSearchParams({password:secret}).toString()});
 assert.equal(cross.status,403);
 const invalidType=await call("/studio-auth",{method:"POST",headers:{"content-type":"application/json"},body:"{}"});
 assert.equal(invalidType.status,415);
});
await check("Valid password creates a signed, secure HTTP-only expiring session",async()=>{
 const response=await call("/studio-auth",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded","origin":base},
  body:new URLSearchParams({password:secret}).toString()});
 assert.equal(response.status,200);
 const cookie=response.headers.get("set-cookie");
 assert.match(cookie,/HttpOnly/);
 assert.match(cookie,/Secure/);
 assert.match(cookie,/SameSite=Strict/);
 assert.match(cookie,/Max-Age=28800/);
 const value=cookie.split(";")[0];
 assert.equal((await call("/index.html",{headers:{cookie:value}})).status,200);
 assert.equal((await call("/app.js",{headers:{cookie:value}})).status,200);
 assert.equal((await call("/config.js",{headers:{cookie:value}})).status,200);
 const forgery=value.slice(0,-4)+"AAAA";
 assert.equal((await call("/",{headers:{cookie:forgery}})).status,302);
 const logout=await call("/studio-logout",{method:"POST",headers:{cookie:value}});
 assert.equal(logout.status,200);
 assert.match(logout.headers.get("set-cookie"),/Max-Age=0/);
});
assert.ok(!source.includes("This is a secure test password 2026!"),"Test password must not appear in deployment code");
console.log("PASS: Edge authentication gateway QA complete");