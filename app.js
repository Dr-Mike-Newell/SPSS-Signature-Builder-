/* SPSS signature builder: all form processing stays client-side. */
(function(){
"use strict";
const C=window.SPSS_CONFIG;
if(!C)throw new Error("Missing config.js");
const $=x=>document.getElementById(x);
let selectedLogos=[],selectedClaims=[];
const fields=["name","postnominals","job","address","phone","email","website","orcid"];
const E=x=>String(x==null?"":x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const val=x=>($(x)?.value||"").trim();
const url=(text)=>{let s=(text||"").trim();if(!s)return "";if(!/^https?:\/\//i.test(s))s="https://"+s;try{const u=new URL(s);return u.protocol==="https:"&&u.hostname&&u.username===""&&u.password===""?u.href:"";}catch(_){return "";}};
const emailValid=x=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
const imageUrl=(path,exported)=>{if(!path)return "";return exported?new URL(path,C.emailImageBase||C.pagesBase).href:path;};
function orcid(input){
 let value=(input||"").trim().replace(/\/$/,"");
 if(!value)return null;
 value=value.replace(/^https?:\/\/(?:www\.)?orcid\.org\//i,"");
 value=value.replace(/\s/g,"").toUpperCase();
 if(/^\d{15}[\dX]$/.test(value))value=value.replace(/^(.{4})(.{4})(.{4})(.{4})$/,"$1-$2-$3-$4");
 if(!/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(value))return false;
 const body=value.replace(/-/g,"");
 let total=0;
 for(let i=0;i<15;i++)total=(total+Number(body[i]))*2;
 const result=(12-(total%11))%11,expected=result===10?"X":String(result);
 return expected===body[15]?{id:value,url:"https://orcid.org/"+value}:false;
}
function staffValid(){
 const nm=val("name"),em=val("email"),web=val("website"),oc=val("orcid");
 if(!nm)return "Enter your full name before copying.";
 if(!em||!emailValid(em))return "Enter a valid staff email address before copying.";
 if(web&&!url(web))return "Enter a valid HTTPS staff profile link.";
 if(oc&&!orcid(oc))return "Enter a valid ORCID iD, including the check digit, or leave it blank.";
 return "";
}
function notice(message,problem=false){$("status").textContent=message;$("status").style.color=problem?"#b01c30":"#147450";}
function eligible(logo){const d=val("discipline");return d==="head"||logo.audience.includes("all")||logo.audience.includes(d);}
function logoTile(l){
 const picked=selectedLogos.includes(l.id),disabled=l.status==="pending-asset"||!eligible(l);
 const b=document.createElement("button");
 b.type="button";b.className="logo-tile"+(picked?" selected":"");
 b.disabled=disabled;b.dataset.logoId=l.id;b.setAttribute("aria-pressed",String(picked));b.title=l.note;
 const img=l.path?'<img src="'+E(imageUrl(l.path,false))+'" alt="" loading="lazy">':'<span class="logo-text">Image pending</span>';
 b.innerHTML='<span class="tick" aria-hidden="true">'+(picked?"✓":disabled?"–":"+")+'</span>'+img+
 '<span class="tile-name">'+E(l.name)+'</span><span class="tile-sub">'+E(l.status==="pending-asset"?"Awaiting approved logo":l.status==="historical"?"Historical 2023/24":l.status==="restricted"?"Restricted use":"For pilot review")+'</span>';
 const image=b.querySelector("img");if(image)image.addEventListener("error",()=>{image.style.display="none";b.insertAdjacentHTML("afterbegin",'<span class="logo-text">'+E(l.name)+'</span>');});
 b.addEventListener("click",()=>{
  if(selectedLogos.includes(l.id))selectedLogos=selectedLogos.filter(x=>x!==l.id);
  else {
   if(!eligible(l)){notice("This affiliation is not listed for your selected subject. Choose the appropriate subject area or contact the School administrator.",true);return;}
   selectedLogos.push(l.id);
  }
  render();
  document.querySelector('[data-logo-id="'+l.id+'"]')?.focus({preventScroll:true});
 });
 return b;
}
function claimTile(c){
 const picked=selectedClaims.includes(c.id);
 const b=document.createElement("button");b.type="button";
 b.className="claim"+(picked?" selected":"");b.dataset.claimId=c.id;b.setAttribute("aria-pressed",String(picked));
 b.innerHTML='<strong>'+E(c.figure)+'</strong><span class="claim-text"><b>'+E(c.headline)+'</b><span class="claim-source">'+E(c.source)+' · '+E(C.disciplines.find(d=>d.id===c.discipline)?.name || "School-wide")+" · "+E(c.status==="pilot-review"?"Pilot review":"Approved")+'</span></span><span class="tick" aria-hidden="true">'+(picked?"✓":"+")+'</span>';
 b.addEventListener("click",()=>{
  if(picked)selectedClaims=selectedClaims.filter(x=>x!==c.id);
  else if(selectedClaims.length<C.maxClaims)selectedClaims.push(c.id);
  else{notice("You can select up to "+C.maxClaims+" marketing claims. Remove one first.",true);return;}
  render();
  document.querySelector('[data-claim-id="'+c.id+'"]')?.focus({preventScroll:true});
 });
 return b;
}
function claimsVisible(){
 const d=val("discipline"),cat=val("category");
 return C.claims.filter(x=>(d==="head"||x.discipline==="all"||x.discipline===d)&&x.status!=="withdrawn"&&(!cat||x.category===cat)).sort((a,b)=>a.priority-b.priority);
}
function draw(){
 const lg=$("logoGrid");lg.replaceChildren();
 C.affiliations.forEach(x=>lg.appendChild(logoTile(x)));
 const cg=$("claimGrid");cg.replaceChildren();
 const visible=claimsVisible();
 if(!val("discipline"))cg.innerHTML='<p class="muted">Choose your discipline above to see applicable marketing claims. School-wide claims will be added as supplied.</p>';
 else if(!visible.length)cg.innerHTML='<p class="muted">No marketing statistics have been supplied for this selection. The signature can still be generated without claims.</p>';
 else visible.forEach(x=>cg.appendChild(claimTile(x)));
 $("claimCounter").textContent=selectedClaims.length+" / "+C.maxClaims+" claims selected";
 const order=$("claimOrder");order.replaceChildren();
 if(!selectedClaims.length)order.innerHTML='<span class="muted">No claims selected. Select up to three above.</span>';
 selectedClaims.forEach((id,i)=>{
  const c=C.claims.find(x=>x.id===id),row=document.createElement("div");row.className="order-row";
  const name=document.createElement("span");name.className="order-label";name.textContent=(i+1)+". "+c.figure+" "+c.headline;row.append(name);
  for(const [sym,delta] of [["↑",-1],["↓",1]]){
   const b=document.createElement("button");b.type="button";b.className="order-btn";b.textContent=sym;b.title=(delta<0?"Move up":"Move down");
   b.setAttribute("aria-label",b.title+": "+c.figure);b.disabled=i+delta<0||i+delta>=selectedClaims.length;
   b.onclick=()=>{const k=i+delta;[selectedClaims[i],selectedClaims[k]]=[selectedClaims[k],selectedClaims[i]];render();};row.append(b);
  }
  order.append(row);
 });
}
function contact(){
 // Separate primary and secondary contact details to avoid unreadable
 // single-line runs on Outlook and narrow preview panels.
 const primary=[],secondary=[];
 if(val("phone"))primary.push('<span style="color:#717171;">T:</span> '+E(val("phone")));
 if(val("email"))primary.push('<span style="color:#717171;">E:</span> <a href="mailto:'+E(val("email"))+'" style="color:#252525;text-decoration:underline;">'+E(val("email"))+'</a>');
 if(url(val("website")))secondary.push('<span style="color:#717171;">W:</span> <a href="'+E(url(val("website")))+'" style="color:#252525;text-decoration:underline;">Staff profile</a>');
 const o=orcid(val("orcid"));
 if(o&&typeof o==="object")secondary.push('<a href="'+E(o.url)+'" style="color:#303030;text-decoration:underline;"><img src="'+E(C.orcidIcon)+'" alt="ORCID iD" width="16" height="16" style="display:inline-block;width:16px;height:16px;vertical-align:middle;border:0;margin-right:5px;">'+E(o.id)+'</a>');
 if(!primary.length&&!secondary.length)return "";
 const divider='<span style="color:#c8102e;padding:0 7px;"> | </span>';
 const line=(cells,padding)=>cells.length?'<tr><td style="padding-top:'+padding+'px;font:11px/17px Arial,Helvetica,sans-serif;color:#303030;word-wrap:break-word;">'+cells.join(divider)+'</td></tr>':"";
 return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">'+line(primary,9)+line(secondary,3)+'</table>';
}
function logos(exported){
 if(!selectedLogos.length)return "";
 const chosen=selectedLogos.map(id=>C.affiliations.find(a=>a.id===id)).filter(x=>x&&x.path&&x.status!=="pending-asset");
 if(!chosen.length)return "";
 let rows="";
 // At most five independently selected logos per row. Natural-width cells keep
 // the logos together instead of stretching them over the signature's full width.
 for(let i=0;i<chosen.length;i+=5){
  const group=chosen.slice(i,i+5);
  let cells="";
  for(const l of group){
   const scale=Math.min(96/l.w,44/l.h,1);
   const w=Math.max(1,Math.round(l.w*scale)),h=Math.max(1,Math.round(l.h*scale));
   cells+='<td valign="middle" style="vertical-align:middle;padding:0 8px 0 0;white-space:nowrap;">'+
    '<img src="'+E(imageUrl(l.path,exported))+'" alt="'+E(l.name)+'" width="'+w+'" height="'+h+'" style="display:block;width:'+w+'px;height:'+h+'px;border:0;"></td>';
  }
  // Separate nested table per row prevents a sparse final row from spreading
  // the other columns; tables and inline styles remain Outlook compatible.
  rows+='<tr><td style="padding:6px 0 2px 0;vertical-align:middle;">'+
   '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;table-layout:auto;"><tr>'+cells+'</tr></table></td></tr>';
 }
 return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;border-top:1px solid #e5e5e5;margin-top:10px;">'+rows+'</table>';
}
function claims(){
 if(!selectedClaims.length)return "";
 let html='<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;">';
 for(const [i,id] of selectedClaims.entries()){
  const c=C.claims.find(x=>x.id===id);if(!c)continue;
  html+='<tr><td style="padding-top:'+(i?5:0)+'px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:#151519;"><tr>'+
  '<td width="90" style="width:90px;background-color:#c8102e;color:#fff;vertical-align:middle;text-align:center;padding:9px 7px;font:900 25px Arial,Helvetica,sans-serif;">'+E(c.figure)+'</td>'+
  '<td style="vertical-align:middle;padding:8px 12px;color:#fff;font:700 12px/16px Arial,Helvetica,sans-serif;">'+E(c.headline)+'<div style="padding-top:3px;color:#d8d8d8;font:10px/14px Arial,Helvetica,sans-serif;">'+E(c.source)+'</div></td></tr></table></td></tr>';
 }
 return html+'</table>';
}
// The University promotional campaign is fixed alongside the selected claims,
// rather than offered as a selectable professional affiliation. The layout uses
// nested presentation tables and inline CSS for classic and modern Outlook.
function promotionalClaims(exported){
 if(!selectedClaims.length)return "";
 const brand=C.promotionalBrand;
 // Match artwork size to one, two or three ranking bars so one chosen
 // achievement does not leave a large empty black promo column.
 const w=selectedClaims.length===1?88:selectedClaims.length===2?100:brand.displayWidth;
 const h=Math.round(w*brand.nativeHeight/brand.nativeWidth),colWidth=w+16;
 const artwork='<img src="'+E(imageUrl(brand.path,exported))+'" alt="'+E(brand.name)+'" width="'+w+'" height="'+h+'" style="display:block;width:'+w+'px;height:'+h+'px;border:0;">';
 return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin-top:12px;">'+
  '<tr><td width="'+colWidth+'" valign="middle" style="width:'+colWidth+'px;background-color:#090909;padding:8px;vertical-align:middle;text-align:center;">'+artwork+'</td>'+
  '<td valign="middle" style="vertical-align:middle;padding:0 0 0 7px;">'+claims()+'</td></tr></table>';
}
function studentSupport(){
 // Single-column contact directory, readable in Outlook and mobile email.
 // All nine addresses remain present in both standard and compact signatures.
 let h='<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin-top:13px;border-top:2px solid #c8102e;">'+
 '<tr><td style="padding:9px 0 3px;font:700 11px/15px Arial,Helvetica,sans-serif;color:#c8102e;letter-spacing:0.3px;">STUDENT SUPPORT CONTACTS</td></tr>'+
 '<tr><td style="padding:2px 0 7px;font:10.5px/15px Arial,Helvetica,sans-serif;color:#595959;">'+E(C.supportIntro)+'</td></tr><tr><td>'+
 '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">';
 for(const item of C.support){
  h+='<tr><td valign="top" style="vertical-align:top;padding:3px 0 5px;font:10.5px/15px Arial,Helvetica,sans-serif;color:#484848;word-wrap:break-word;">'+
   '<a href="mailto:'+E(item.email)+'" style="color:#c8102e;text-decoration:underline;font-weight:700;">'+E(item.email)+'</a>'+
   '<span style="color:#777;"> &nbsp;–&nbsp; </span>'+E(item.description)+'</td></tr>';
 }
 return h+'</table></td></tr></table>';
}
function signature(kind="standard",exported=false){
 const compact=kind==="compact",b=C.brand;
 const image='<img src="'+E(imageUrl(b.logoPath,exported))+'" alt="'+E(b.university)+'" width="'+b.logoWidth+'" height="'+b.logoHeight+'" style="display:block;width:'+b.logoWidth+'px;height:'+b.logoHeight+'px;border:0;">';
 const heading='<div style="font:700 17px/21px Arial,Helvetica,sans-serif;color:#151515;">'+E(val("name")||"Your name")+' <span style="font:400 12px Arial,Helvetica,sans-serif;color:#666;">'+E(val("postnominals"))+'</span></div>';
 const role='<div style="padding-top:4px;font:13px/17px Arial,Helvetica,sans-serif;color:#262626;">'+E(val("job"))+'</div>';
 const school='<div style="padding-top:5px;font:700 12px/17px Arial,Helvetica,sans-serif;color:'+b.colour+';">'+E(b.school)+'</div>';
 const faculty='<div style="padding-top:3px;font:12px/16px Arial,Helvetica,sans-serif;color:#555;">'+E(b.faculty)+'</div>';
 const address=(!compact&&val("address"))?'<div style="padding-top:6px;font:11px/15px Arial,Helvetica,sans-serif;color:#666;">'+E(val("address"))+'</div>':"";
 const top='<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">'+
 '<tr><td style="vertical-align:top;padding-right:10px;">'+heading+role+school+faculty+address+'</td>'+
 '<td width="'+(b.logoWidth+4)+'" style="width:'+(b.logoWidth+4)+'px;vertical-align:top;text-align:right;">'+image+'</td></tr></table>';
 const identity='<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>'+
 '<td style="border-left:4px solid '+b.colour+';padding:0 0 0 13px;">'+top+contact()+'</td></tr></table>';
 const promo=compact?"":logos(exported)+promotionalClaims(exported);
 return '<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:100%;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;background:#fff;"><tr><td>'+identity+promo+studentSupport()+'</td></tr></table>';
}
function refreshPreview(){
 draw();$("preview").innerHTML=signature("standard",false);
 const warning=staffValid();
 const awaitingBasics=!val("name")||!val("email");
 $("validation").textContent=awaitingBasics?"Your signature updates as you enter your details.":(warning||"Your signature details are ready.");
 $("validation").style.color=awaitingBasics?"#666d73":(warning?"#a91b30":"#237352");
}
function render(){refreshPreview();}
function fileHtml(kind){return '<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>SPSS Outlook signature</title></head><body style="margin:8px;background:#fff;">'+signature(kind,true)+'</body></html>';}
function download(kind){
 const blob=new Blob([fileHtml(kind)],{type:"text/html;charset=utf-8"}),object=URL.createObjectURL(blob);
 const a=document.createElement("a");a.href=object;a.download="SPSS-Outlook-"+kind+"-signature.html";
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(object),1000);notice("Downloaded the "+kind+" signature HTML. Open it in a browser and copy the rendered signature into Outlook.");
}
async function copy(kind){
 const invalid=staffValid();if(invalid){notice(invalid,true);return;}
 const html=signature(kind,true),plain=[val("name")+(val("postnominals")?" "+val("postnominals"):""),val("job"),C.brand.school,C.brand.faculty,val("phone"),val("email"),url(val("website")),orcid(val("orcid"))?.url||"",...C.support.map(x=>x.email)].filter(Boolean).join("\n");
 try {
  if(navigator.clipboard&&window.ClipboardItem&&navigator.clipboard.write){
   const item=new ClipboardItem({"text/html":new Blob([fileHtml(kind)],{type:"text/html"}),"text/plain":new Blob([plain],{type:"text/plain"})});
   await navigator.clipboard.write([item]);
   notice((kind==="standard"?"Standard":"Compact reply")+" signature copied. Paste into Outlook's signature editor and test an external email.");
   return;
  }
  throw new Error("ClipboardItem unavailable");
 }catch(_){
  const staging=document.createElement("div");staging.innerHTML=html;
  staging.style.cssText="position:absolute;left:-99999px;top:0;background:#fff;";
  document.body.appendChild(staging);
  try{
   const range=document.createRange();range.selectNodeContents(staging);const selection=window.getSelection();
   selection.removeAllRanges();selection.addRange(range);
   const ok=document.execCommand("copy");selection.removeAllRanges();
   staging.remove();
   if(ok){notice("Signature copied using compatibility mode. Test the image links in Outlook.");return;}
  }catch(err){staging.remove();}
  download(kind);
  notice("Your browser blocked direct copying. An HTML signature has been downloaded as a fallback.",true);
 }
}
function start(){
 const disc=$("discipline"),cats=$("category");
 C.disciplines.forEach(d=>{const o=document.createElement("option");o.value=d.id;o.textContent=d.name;disc.append(o);});
 [...new Set(C.claims.map(x=>x.category))].forEach(c=>{const o=document.createElement("option");o.value=c;o.textContent=c;cats.append(o);});
 disc.addEventListener("change",()=>{
  selectedClaims=selectedClaims.filter(k=>{const c=C.claims.find(x=>x.id===k);return c&&(disc.value==="head"||c.discipline==="all"||c.discipline===disc.value);});
  selectedLogos=selectedLogos.filter(k=>{const l=C.affiliations.find(x=>x.id===k);return l&&eligible(l);});
  cats.value=""; // Clear category filters when switching subjects.
  notice("");render();
 });
 cats.addEventListener("change",render);
 fields.forEach(id=>$(id).addEventListener("input",()=>{notice("");render();}));
 $("copyStandard").addEventListener("click",()=>copy("standard"));
 $("copyCompact").addEventListener("click",()=>copy("compact"));
 $("downloadStandard").addEventListener("click",()=>{const warning=staffValid();if(warning){notice(warning,true);return;}download("standard");});
 $("downloadCompact").addEventListener("click",()=>{const warning=staffValid();if(warning){notice(warning,true);return;}download("compact");});
 render();
}
window.SPSS_QA={signature,orcid,staffValid,claimsVisible,config:C,selectClaim:id=>{const c=C.claims.find(x=>x.id===id);if(c&&!selectedClaims.includes(id)&&selectedClaims.length<C.maxClaims){selectedClaims.push(id);render();}},selectedClaims:()=>selectedClaims.slice()};
start();
})();