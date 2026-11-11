import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

await mkdir("test-artifacts",{recursive:true});
const browser=await chromium.launch({headless:true});
const errors=[];
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
page.on("pageerror",e=>errors.push(e.message));
const check=async (label,run)=>{await run();console.log("PASS:",label)};
try{
 await page.goto("http://127.0.0.1:8765/",{waitUntil:"domcontentloaded"});
 await page.locator("#preview table").first().waitFor({timeout:12000});
 await check("Live app and institutional identity",async()=>{
  assert.match(await page.title(),/Signature Studio/);
  assert.match(await page.locator("#preview").innerText(),/School of Sport, Psychology and Social Science/);
  assert.match(await page.locator("#preview").innerText(),/Faculty of Technologies, Education and Social Sciences/);
  assert.equal(await page.locator('#preview a[href^="mailto:"]').count(),9);
  assert.equal(await page.locator("#preview img").first().getAttribute("src"),"assets/logos/university-of-bedfordshire-master.png");
 });
 await check("Guided form validates required details",async()=>{
  await page.locator("#goPersonalise").click();
  assert.match(await page.locator("#stepError").innerText(),/full name/i);
  await page.locator("#name").fill("Dr Alex Taylor");
  await page.locator("#email").fill("alex.taylor@beds.ac.uk");
  await page.locator("#goPersonalise").click();
  assert.equal(await page.locator('[data-panel="2"]').isVisible(),true);
  assert.equal(await page.locator('[data-panel="1"]').isVisible(),false);
 });
 await check("Discipline-specific affiliations and claims",async()=>{
  await page.locator("#discipline").selectOption("sport");
  await page.locator('[data-logo-id="cases"]').click();
  assert.equal(await page.locator('[data-logo-id="cases"]').getAttribute("aria-pressed"),"true");
  await page.locator('[data-claim-id="subject15"]').click();
  assert.equal(await page.locator("#claimCounter").innerText(),"1 / 3 claims selected");
  assert.match(await page.locator("#preview").innerText(),/15th/);
  assert.equal(await page.locator("#preview").locator('img[alt="CASES"]').count(),1);
  assert.equal(await page.locator('[data-logo-id="ahcs"]').isDisabled(),true);
  assert.equal(await page.locator('[data-logo-id="bps"]').isDisabled(),true);
  await page.locator('[data-logo-id="cases"]').focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator('[data-logo-id="cases"]').evaluate(x=>document.activeElement===x),true);
  await page.keyboard.press("Enter"); // Restore the selection for the export tests.
 });
 await check("Preserved HTML generation for Outlook",async()=>{
  const generated=await page.evaluate(()=>({
    standard:window.SPSS_QA.signature("standard",true),
    compact:window.SPSS_QA.signature("compact",true),
    support:window.SPSS_QA.config.support
  }));
  assert.equal(generated.support.length,9);
  for(const entry of generated.support){assert.ok(generated.standard.includes(entry.email));assert.ok(generated.compact.includes(entry.email));}
  assert.ok(generated.standard.includes("CASES"));
  assert.ok(!generated.compact.includes('alt="CASES"'));
  assert.ok(generated.standard.includes("15th"));
  assert.ok(!generated.compact.includes("15th"));
  assert.ok(generated.standard.includes('width="176"'));
  assert.ok(generated.standard.includes("https://mikelnewell.github.io/SPSS-Signature-Builder-/assets/"));
  assert.ok(!generated.standard.includes("(unauthenticated)"));
 });
 await check("Completion and Outlook actions",async()=>{
  await page.locator("#goReady").click();
  assert.equal(await page.locator('[data-panel="3"]').isVisible(),true);
  assert.equal(await page.locator("#copyStandard").isVisible(),true);
  assert.equal(await page.locator("#copyCompact").isVisible(),true);
  assert.equal(await page.locator("#installHelp summary").count(),1);
  await page.context().grantPermissions(["clipboard-read","clipboard-write"]);
  await page.locator("#copyStandard").click();
  await page.waitForFunction(()=>/copied|blocked|download/i.test(document.querySelector("#status")?.textContent||""),{},{timeout:10000});
  assert.match(await page.locator("#status").innerText(),/copied/i);
 });
 await page.screenshot({path:"test-artifacts/desktop.png",fullPage:true});
 await check("Changing subjects clears incompatible selections",async()=>{
  await page.locator("#backToPersonalise").click();
  await page.locator("#discipline").selectOption("psychology");
  assert.equal(await page.locator("#claimCounter").innerText(),"0 / 3 claims selected");
  assert.equal(await page.locator('[data-logo-id="cases"]').isDisabled(),true);
  assert.equal(await page.locator('[data-logo-id="bps"]').isEnabled(),true);
  assert.equal(await page.locator('[data-claim-id="psych-support96"]').isVisible(),true);
 });
 await check("Mobile layout stays within viewport",async()=>{
  await page.setViewportSize({width:390,height:844});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator("#preview table").first().waitFor();
  const geometry=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(geometry.scroll<=geometry.w+2,JSON.stringify(geometry));
  assert.equal(await page.locator('[data-jump-preview]').first().isVisible(),true);
  await page.locator('[data-jump-preview]').first().click();
  assert.equal(await page.locator("#previewRail").isVisible(),true);
  await page.screenshot({path:"test-artifacts/mobile.png",fullPage:true});
 });
 assert.deepEqual(errors,[],"Browser errors");
 console.log("PASS: No uncaught browser errors");
}finally{
 await browser.close();
}
