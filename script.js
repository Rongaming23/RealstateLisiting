const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "jobPromoContacts_v1";
let contacts = loadContacts();

function loadContacts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  renderContacts(); renderStats();
}
function yes(v) { return ["yes","true","1","y","opt-in","optin"].includes(String(v || "").trim().toLowerCase()); }
function parseCSV(text) {
  const rows=[]; let row=[], cell="", quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i], next=text[i+1];
    if(c === '"' && quoted && next === '"'){cell+='"';i++;}
    else if(c === '"'){quoted=!quoted;}
    else if(c === ',' && !quoted){row.push(cell);cell="";}
    else if((c === '\n' || c === '\r') && !quoted){
      if(c==='\r' && next==='\n') i++;
      row.push(cell); if(row.some(x=>x.trim())) rows.push(row);
      row=[];cell="";
    } else cell+=c;
  }
  row.push(cell); if(row.some(x=>x.trim())) rows.push(row);
  if(!rows.length) return [];
  const headers=rows.shift().map(h=>h.trim().toLowerCase().replace(/^\uFEFF/,""));
  return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]||"").trim()])));
}
function escapeHTML(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderStats(){
  $("totalCount").textContent=contacts.length;
  $("waCount").textContent=contacts.filter(c=>c.consent_whatsapp&&!c.unsubscribed).length;
  $("igCount").textContent=contacts.filter(c=>c.consent_instagram&&!c.unsubscribed).length;
  $("stopCount").textContent=contacts.filter(c=>c.unsubscribed).length;
}
function renderContacts(){
  const body=$("contactsBody");
  if(!contacts.length){body.innerHTML='<tr><td colspan="7" class="empty">Import a CSV to begin.</td></tr>';return;}
  body.innerHTML=contacts.map((c,i)=>`<tr>
    <td>${escapeHTML(c.name)}</td><td>${escapeHTML(c.phone||"—")}</td><td>${escapeHTML(c.instagram||"—")}</td>
    <td><span class="pill ${c.consent_whatsapp?'':'no'}">${c.consent_whatsapp?'Yes':'No'}</span></td>
    <td><span class="pill ${c.consent_instagram?'':'no'}">${c.consent_instagram?'Yes':'No'}</span></td>
    <td>${c.unsubscribed?'<span class="pill no">STOP</span>':'<span class="pill">Active</span>'}</td>
    <td><button class="small-btn danger" data-stop="${i}">${c.unsubscribed?'Restore':'Mark STOP'}</button></td>
  </tr>`).join("");
  body.querySelectorAll("[data-stop]").forEach(btn=>btn.addEventListener("click",()=>{
    const c=contacts[Number(btn.dataset.stop)]; c.unsubscribed=!c.unsubscribed; save();
  }));
}
function campaign(){
  return {name:$("campaignName").value.trim()||"Job campaign",role:$("role").value.trim(),location:$("location").value.trim(),salary:$("salary").value.trim(),apply_link:$("applyLink").value.trim(),template:$("template").value};
}
function makeMessage(c){
  const data={...campaign(),name:c.name||"there"};
  return data.template.replace(/\{(name|role|location|salary|apply_link)\}/gi,(_,key)=>data[key.toLowerCase()]||"");
}
function eligible(channel){
  const key=channel==="whatsapp"?"consent_whatsapp":"consent_instagram";
  return contacts.filter(c=>c[key]&&!c.unsubscribed);
}
function csvEscape(value){const s=String(value??"");return '"'+s.replace(/"/g,'""')+'"';}
function downloadCSV(filename, rows){
  const content=rows.map(row=>row.map(csvEscape).join(",")).join("\r\n");
  const blob=new Blob(["\uFEFF"+content],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob), a=document.createElement("a");
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
$("csvFile").addEventListener("change",async e=>{
  const file=e.target.files[0];if(!file)return;
  try{
    const rows=parseCSV(await file.text());
    const added=rows.filter(r=>r.name||r.phone||r.instagram).map(r=>({
      name:r.name||"",phone:r.phone||"",instagram:(r.instagram||"").replace(/^@/,""),
      consent_whatsapp:yes(r.consent_whatsapp),consent_instagram:yes(r.consent_instagram),
      unsubscribed:yes(r.unsubscribed)
    }));
    const existing=new Set(contacts.map(c=>(c.phone||"")+"|"+(c.instagram||"").toLowerCase()));
    const fresh=added.filter(c=>!existing.has((c.phone||"")+"|"+(c.instagram||"").toLowerCase()));
    contacts.push(...fresh);save();
    $("importStatus").textContent=`Imported ${fresh.length} new contacts. ${added.length-fresh.length} duplicate(s) skipped.`;
  }catch(err){$("importStatus").textContent="Could not read that CSV. Please check the format.";}
  e.target.value="";
});
$("downloadSample").addEventListener("click",()=>downloadCSV("sample_candidates.csv",[
  ["name","phone","instagram","consent_whatsapp","consent_instagram"],
  ["Asha","+919876543210","asha.example","yes","no"],
  ["Ravi","+919876543211","ravi.example","no","yes"]
]));
$("clearContacts").addEventListener("click",()=>{
  if(confirm("Delete all contacts stored in this browser?")){contacts=[];save();$("previews").innerHTML='<p class="empty">Generate previews to review messages here.</p>';$("importStatus").textContent="All contacts cleared.";}
});
$("exportContactsBtn").addEventListener("click",()=>downloadCSV("contacts_backup.csv",[
  ["name","phone","instagram","consent_whatsapp","consent_instagram","unsubscribed"],
  ...contacts.map(c=>[c.name,c.phone,c.instagram,c.consent_whatsapp?"yes":"no",c.consent_instagram?"yes":"no",c.unsubscribed?"yes":"no"])
]));
$("previewBtn").addEventListener("click",()=>{
  const active=contacts.filter(c=>(c.consent_whatsapp||c.consent_instagram)&&!c.unsubscribed);
  $("previews").innerHTML=active.length?active.map(c=>`<article class="preview"><h3>${escapeHTML(c.name||"Candidate")}</h3><p>${escapeHTML(makeMessage(c))}</p><small>WhatsApp: ${c.consent_whatsapp?'opted in':'not opted in'} · Instagram: ${c.consent_instagram?'opted in':'not opted in'}</small></article>`).join(""):'<p class="empty">No active opted-in contacts yet.</p>';
  $("campaignStatus").textContent=`Generated ${active.length} preview(s).`;
});
function exportDrafts(channel){
  const list=eligible(channel);
  if(!list.length){$("campaignStatus").textContent=`No active contacts opted in to ${channel}.`;return;}
  const headers=channel==="whatsapp"?["name","phone","message","campaign"]:["name","instagram","message","campaign"];
  const rows=[headers,...list.map(c=>channel==="whatsapp"?[c.name,c.phone,makeMessage(c),campaign().name]:[c.name,c.instagram,makeMessage(c),campaign().name])];
  downloadCSV(`${channel}_job_drafts.csv`,rows);
  $("campaignStatus").textContent=`Exported ${list.length} ${channel} draft(s). These are drafts, not sent messages.`;
}
$("exportWa").addEventListener("click",()=>exportDrafts("whatsapp"));
$("exportIg").addEventListener("click",()=>exportDrafts("instagram"));
renderContacts();renderStats();
