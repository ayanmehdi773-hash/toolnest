import React, { useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowUpRight, Search, Moon, Sun, Sparkles, Image as ImageIcon, QrCode,
  FileText, Palette, Code2, Scissors, Menu, X, Upload, Download,
  Copy, Check, Zap, ShieldCheck, Globe2, Clock3, Star, ChevronRight,
  RotateCcw, SlidersHorizontal, Type, Maximize2
} from "lucide-react";

const tools = [
  { id:"image", name:"Image Studio", desc:"Compress, resize and convert images in your browser.", category:"Images", icon:ImageIcon, tag:"Popular" },
  { id:"qr", name:"QR Code Studio", desc:"Create custom QR codes for links, text and more.", category:"Generator", icon:QrCode, tag:"Quick" },
  { id:"text", name:"Text Studio", desc:"Count words, characters and clean up your writing.", category:"Text", icon:FileText, tag:"Popular" },
  { id:"color", name:"Color Studio", desc:"Build palettes and copy HEX color values.", category:"Design", icon:Palette, tag:"Creative" },
  { id:"pdf", name:"PDF Studio", desc:"PDF utilities are planned for the next release.", category:"Documents", icon:Scissors, tag:"Coming soon", soon:true },
  { id:"code", name:"Code Playground", desc:"A browser-based HTML, CSS and JavaScript workspace.", category:"Developer", icon:Code2, tag:"Coming soon", soon:true }
];

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

function ImageTool() {
  const [file,setFile] = useState(null), [preview,setPreview] = useState(""), [quality,setQuality] = useState(0.82);
  const [width,setWidth] = useState(""), [height,setHeight] = useState(""), [format,setFormat] = useState("image/jpeg");
  const [busy,setBusy] = useState(false), [result,setResult] = useState(null), [error,setError] = useState("");
  const input = useRef(null);
  function load(f) {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setError("Please choose a valid image file."); return; }
    if (f.size > 20*1024*1024) { setError("Please choose an image smaller than 20 MB."); return; }
    setError(""); setFile(f); setResult(null); setPreview(URL.createObjectURL(f));
    const img = new Image(); img.onload=()=>{setWidth(String(img.naturalWidth));setHeight(String(img.naturalHeight));}; img.src=URL.createObjectURL(f);
  }
  function process() {
    if (!file || !preview) return;
    setBusy(true); setError("");
    const img = new Image();
    img.onload = () => {
      const w = Math.max(1, Math.min(8000, Number(width)||img.naturalWidth));
      const h = Math.max(1, Math.min(8000, Number(height)||img.naturalHeight));
      const canvas = document.createElement("canvas"); canvas.width=w; canvas.height=h;
      const ctx=canvas.getContext("2d"); ctx.drawImage(img,0,0,w,h);
      canvas.toBlob(blob=>{
        setBusy(false);
        if (!blob) { setError("This format could not be exported. Try JPG or PNG."); return; }
        setResult({blob,url:URL.createObjectURL(blob),size:blob.size});
      },format,quality);
    };
    img.onerror=()=>{setBusy(false);setError("Could not read this image.");}; img.src=preview;
  }
  return <div className="tool-workspace">
    <div className="workspace-heading"><div><span className="eyebrow">IMAGE STUDIO</span><h2>Make images work smarter.</h2><p>Resize and compress images locally. Your files stay in this browser.</p></div><span className="privacy-pill"><ShieldCheck size={14}/> On-device processing</span></div>
    <div className="tool-panel">
      <input ref={input} type="file" accept="image/*" hidden onChange={e=>load(e.target.files?.[0])}/>
      {!file ? <button className="dropzone" onClick={()=>input.current?.click()}><span className="upload-icon"><Upload/></span><b>Drop an image here</b><span>or click to browse · JPG, PNG, WebP · max 20 MB</span></button> :
      <div className="image-editor">
        <div className="preview-box"><img src={preview} alt="Selected image preview"/><div className="file-label">{file.name} · {(file.size/1024).toFixed(0)} KB</div></div>
        <div className="controls">
          <label>Output width (px)<input type="number" min="1" max="8000" value={width} onChange={e=>setWidth(e.target.value)}/></label>
          <label>Output height (px)<input type="number" min="1" max="8000" value={height} onChange={e=>setHeight(e.target.value)}/></label>
          <label>Format<select value={format} onChange={e=>setFormat(e.target.value)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>
          <label>Quality · {Math.round(quality*100)}%<input type="range" min=".2" max="1" step=".01" value={quality} onChange={e=>setQuality(Number(e.target.value))}/></label>
          <div className="button-row"><button className="button secondary" onClick={()=>{setFile(null);setPreview("");setResult(null);}}>Reset</button><button className="button primary" onClick={process} disabled={busy}>{busy?"Processing…":"Process image"} <ArrowUpRight size={16}/></button></div>
          {result && <div className="success-result"><Check size={17}/><div><b>Image ready</b><span>{(result.size/1024).toFixed(0)} KB output</span></div><button className="button small primary" onClick={()=>downloadBlob(result.blob,`toolnest-image.${format.split("/")[1]}`)}><Download size={15}/> Download</button></div>}
        </div>
      </div>}
      {error && <p className="error">{error}</p>}
    </div>
  </div>;
}

function QRTool() {
  const [value,setValue]=useState("https://toolnest.example");
  const [fg,setFg]=useState("#111827"),[bg,setBg]=useState("#ffffff");
  const ref=useRef(null);
  function save(){const svg=ref.current?.querySelector("svg"); if(!svg)return; const blob=new Blob([new XMLSerializer().serializeToString(svg)],{type:"image/svg+xml"});downloadBlob(blob,"toolnest-qr.svg");}
  return <div className="tool-workspace"><div className="workspace-heading"><div><span className="eyebrow">QR CODE STUDIO</span><h2>Turn anything into a QR.</h2><p>Create a scannable QR code instantly, right here.</p></div><span className="privacy-pill"><ShieldCheck size={14}/> No upload</span></div>
    <div className="tool-panel qr-layout"><div className="controls"><label>Website or text<textarea rows="4" value={value} onChange={e=>setValue(e.target.value)} placeholder="Enter a URL or text…"/></label><div className="color-fields"><label>Foreground<input type="color" value={fg} onChange={e=>setFg(e.target.value)}/></label><label>Background<input type="color" value={bg} onChange={e=>setBg(e.target.value)}/></label></div><button className="button primary" onClick={save} disabled={!value.trim()}><Download size={16}/> Download SVG</button></div><div className="qr-preview" ref={ref}><div className="qr-paper" style={{background:bg}}><QRCodeSVG value={value||" "} size={190} fgColor={fg} bgColor={bg} level="H" includeMargin/></div><b>Live preview</b><span>Scan to test your QR code</span></div></div>
  </div>;
}

function TextTool(){
 const [value,setValue]=useState("");
 const words=value.trim()?value.trim().split(/\s+/).length:0;
 const chars=value.length, sentences=value.trim()?((value.match(/[.!?]+(?=\s|$)/g)||[]).length||1):0;
 const copy=()=>navigator.clipboard?.writeText(value);
 return <div className="tool-workspace"><div className="workspace-heading"><div><span className="eyebrow">TEXT STUDIO</span><h2>Clarity in every character.</h2><p>Measure, clean and transform text without sending it anywhere.</p></div><span className="privacy-pill"><ShieldCheck size={14}/> Private by design</span></div><div className="tool-panel"><textarea className="text-editor" value={value} onChange={e=>setValue(e.target.value)} placeholder="Start typing or paste your text here…"/><div className="stats-grid"><div><b>{words}</b><span>Words</span></div><div><b>{chars}</b><span>Characters</span></div><div><b>{sentences}</b><span>Sentences</span></div><div><b>{Math.ceil(words/200)}</b><span>Min. read</span></div></div><div className="button-row"><button className="button secondary" onClick={()=>setValue("")}><RotateCcw size={15}/> Clear</button><button className="button secondary" onClick={()=>setValue(value.toUpperCase())}>UPPERCASE</button><button className="button secondary" onClick={()=>setValue(value.toLowerCase())}>lowercase</button><button className="button primary" onClick={copy}><Copy size={15}/> Copy text</button></div></div></div>;
}

function ColorTool(){
 const [colors,setColors]=useState(["#8B5CF6","#22D3EE","#F472B6","#F59E0B","#34D399"]);
 function generate(){setColors(Array.from({length:5},()=>"#"+Math.floor(Math.random()*16777215).toString(16).padStart(6,"0").toUpperCase()));}
 return <div className="tool-workspace"><div className="workspace-heading"><div><span className="eyebrow">COLOR STUDIO</span><h2>Find your next favorite color.</h2><p>Generate a palette and copy any HEX value.</p></div><span className="privacy-pill"><Palette size={14}/> Design tools</span></div><div className="tool-panel"><div className="palette">{colors.map((c,i)=><button key={i} style={{background:c}} onClick={()=>navigator.clipboard?.writeText(c)} title={`Copy ${c}`}><span>{c}</span><Copy size={15}/></button>)}</div><button className="button primary" onClick={generate}><Sparkles size={16}/> Generate new palette</button><p className="muted">Tip: click any color block to copy its HEX code.</p></div></div>;
}

export default function App(){
 const [active,setActive]=useState("home"),[query,setQuery]=useState(""),[mobileOpen,setMobileOpen]=useState(false),[light,setLight]=useState(false);
 const [favorites,setFavorites]=useState(()=>JSON.parse(localStorage.getItem("tn-favorites")||"[]"));
 const filtered=useMemo(()=>tools.filter(t=>(t.name+" "+t.desc+" "+t.category).toLowerCase().includes(query.toLowerCase())),[query]);
 const current=tools.find(t=>t.id===active);
 function open(id){if(tools.find(t=>t.id===id)?.soon)return;setActive(id);setMobileOpen(false);localStorage.setItem("tn-recent",id);}
 function toggleFavorite(id){const next=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];setFavorites(next);localStorage.setItem("tn-favorites",JSON.stringify(next));}
 return <div className={light?"app light":"app"}>
  <aside className={`sidebar ${mobileOpen?"open":""}`}>
   <div className="brand"><div className="brand-mark"><Sparkles size={19}/></div><span>toolnest<span className="brand-dot">.</span></span><button className="mobile-close" onClick={()=>setMobileOpen(false)}><X/></button></div>
   <div className="side-label">WORKSPACE</div>
   <button className={`nav-item ${active==="home"?"selected":""}`} onClick={()=>open("home")}><Globe2 size={17}/> Discover</button>
   <div className="side-label spaced">YOUR TOOLS</div>
   {tools.filter(t=>!t.soon).map(t=><button key={t.id} className={`nav-item ${active===t.id?"selected":""}`} onClick={()=>open(t.id)}><t.icon size={17}/>{t.name}</button>)}
   <div className="side-label spaced">COMING NEXT</div>
   {tools.filter(t=>t.soon).map(t=><div key={t.id} className="nav-item disabled"><t.icon size={17}/>{t.name}<span className="soon-dot"/></div>)}
   
   <div className="sidebar-bottom">
     <div className="privacy-card"><ShieldCheck size={17}/><b>Your files stay yours.</b><span>Tools process locally in your browser wherever supported.</span></div>
     
     {/* Professional Legal Footer Links added inside sidebar */}
     <div className="legal-links-sidebar" style={{display: 'flex', flexWrap: 'wrap', gap: '6px 8px', fontSize: '11px', color: '#94a3b8', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px'}}>
       <button onClick={() => { setActive("privacy"); setMobileOpen(false); }} style={{background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0}}>Privacy Policy</button>
       <span>•</span>
       <button onClick={() => { setActive("disclaimer"); setMobileOpen(false); }} style={{background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0}}>Disclaimer</button>
       <span>•</span>
       <button onClick={() => { setActive("contact"); setMobileOpen(false); }} style={{background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0}}>Contact Us</button>
     </div>

     <span className="version" style={{marginTop: '8px', display: 'block'}}>TOOLNEST · VERSION 1.0</span>
   </div>
  </aside>
  {mobileOpen&&<button className="scrim" onClick={()=>setMobileOpen(false)} aria-label="Close menu"/>}
  <main className="main">
   <header className="topbar"><button className="mobile-menu" onClick={()=>setMobileOpen(true)}><Menu/></button><div className="breadcrumb">Workspace <ChevronRight size={14}/> <b>{active === "privacy" ? "Privacy Policy" : active === "disclaimer" ? "Disclaimer" : active === "contact" ? "Contact Us" : current?.name || "Discover"}</b></div><div className="top-actions"><button className="icon-button" onClick={()=>setLight(!light)} title="Toggle theme">{light?<Moon size={18}/>:<Sun size={18}/>}</button><div className="avatar">T</div></div></header>
   
   {active==="home"?<div className="content">
    <section className="hero"><div className="hero-orb orb-one"/><div className="hero-orb orb-two"/><div className="hero-content"><span className="hero-kicker"><Sparkles size={14}/> YOUR EVERYDAY DIGITAL TOOLKIT</span><h1>Small tasks.<br/><em>Big momentum.</em></h1><p>Thoughtful tools for the things you do every day. Fast, free, and designed to keep your work moving.</p><div className="hero-search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="What would you like to do today?"/><kbd>⌘ K</kbd></div><div className="hero-trust"><span><Zap size={14}/> Fast by design</span><span><ShieldCheck size={14}/> Privacy-first</span><span><Star size={14}/> Free to use</span></div></div><div className="hero-art"><div className="art-card art-main"><div className="art-top"><span/><span/><span/></div><div className="art-spark"><Sparkles size={36}/></div><div className="art-line wide"/><div className="art-line"/><div className="art-mini"><span/><span/><span/></div></div><div className="floating-chip chip-a"><ImageIcon size={17}/> Image tools</div><div className="floating-chip chip-b"><QrCode size={17}/> QR studio</div></div></section>
    <div className="section-head"><div><span className="eyebrow">THE TOOL LIBRARY</span><h2>{query?`Results for “${query}”`:"Find your flow."}</h2><p>Purpose-built utilities, all in one calm workspace.</p></div><span className="count-pill">{filtered.length} TOOLS</span></div>
    <div className="tool-grid">{filtered.map(t=><article key={t.id} className={`tool-card ${t.soon?"is-soon":""}`}><div className="card-top"><div className="tool-icon"><t.icon size={20}/></div><button className={`favorite ${favorites.includes(t.id)?"active":""}`} onClick={()=>toggleFavorite(t.id)} aria-label="Toggle favorite"><Star size={17} fill={favorites.includes(t.id)?"currentColor":"none"}/></button></div><div className="card-meta"><span>{t.category}</span><span className={t.soon?"coming-tag":"live-tag"}>{t.tag}</span></div><h3>{t.name}</h3><p>{t.desc}</p><button className="card-link" onClick={()=>open(t.id)} disabled={t.soon}>{t.soon?"Coming soon":"Open tool"} <ArrowUpRight size={16}/></button></article>)}</div>
    <section className="bottom-banner"><div className="banner-icon"><ShieldCheck size={22}/></div><div><b>Your work stays yours.</b><p>Privacy-first tools that process files on your device whenever possible. No account needed to get started.</p></div><span className="banner-tag">BUILT FOR EVERYONE</span></section>
    <footer><div className="footer-brand">toolnest<span>.</span></div><span>All Tools. One Universe.</span><span>© 2026 ToolNest · Built with care.</span></footer>
   </div> : active === "privacy" ? (
     <div className="content inner-content">
       <div className="tool-workspace">
         <div className="workspace-heading">
           <div>
             <span className="eyebrow">LEGAL</span>
             <h2>Privacy Policy</h2>
             <p>Last updated: November 2026</p>
           </div>
           <span className="privacy-pill"><ShieldCheck size={14}/> Secured</span>
         </div>
         <div className="tool-panel" style={{lineHeight: '1.7', color: '#cbd5e1'}}>
           <p style={{marginBottom: '1rem'}}>Welcome to ToolNest. We respect your privacy and are deeply committed to protecting your personal data. Most of our digital tools process your tasks locally right inside your browser, meaning your files, images, and text contents are never uploaded or stored on our servers.</p>
           <h3 style={{color: '#fff', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem'}}>Information Collection & Usage</h3>
           <p style={{marginBottom: '1rem'}}>We do not collect personal files or private notes. Standard anonymous analytical information may be utilized via reliable third-party networks to maintain high performance and user experience.</p>
           <h3 style={{color: '#fff', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem'}}>Contact Information</h3>
           <p>If you have any questions or concerns regarding our Privacy Policy, please contact us directly at <a href="mailto:ayanmehdi773@gmail.com" style={{color: '#a78bfa', textDecoration: 'underline'}}>ayanmehdi773@gmail.com</a>.</p>
         </div>
       </div>
       <button className="back-link" onClick={()=>setActive("home")}>← Back to all tools</button>
     </div>
   ) : active === "disclaimer" ? (
     <div className="content inner-content">
       <div className="tool-workspace">
         <div className="workspace-heading">
           <div>
             <span className="eyebrow">LEGAL</span>
             <h2>Disclaimer</h2>
             <p>Important information regarding tool outputs</p>
           </div>
         </div>
         <div className="tool-panel" style={{lineHeight: '1.7', color: '#cbd5e1'}}>
           <p style={{marginBottom: '1rem'}}>All the utilities and tools provided on ToolNest are offered for general informational and utility purposes only. While we strive to make every tool fast and accurate, we make no warranties or guarantees about the completeness, reliability, or accuracy of the outputs.</p>
           <p style={{marginBottom: '1rem'}}>Any action you take using the tools found on this website is strictly at your own risk. ToolNest will not be held liable for any losses, errors, or damages in connection with the use of our platform.</p>
           <p>For inquiries, reach out at <a href="mailto:ayanmehdi773@gmail.com" style={{color: '#a78bfa', textDecoration: 'underline'}}>ayanmehdi773@gmail.com</a>.</p>
         </div>
       </div>
       <button className="back-link" onClick={()=>setActive("home")}>← Back to all tools</button>
     </div>
   ) : active === "contact" ? (
     <div className="content inner-content">
       <div className="tool-workspace">
         <div className="workspace-heading">
           <div>
             <span className="eyebrow">SUPPORT</span>
             <h2>Contact Us</h2>
             <p>Have questions, feedback, or suggestions? Get in touch with us.</p>
           </div>
         </div>
         <div className="tool-panel" style={{maxWidth: '600px'}}>
           <div style={{background: 'rgba(15, 23, 42, 0.6)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.08)'}}>
             <label style={{display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem', letterSpacing: '0.05em'}}>Direct Email Support</label>
             <a href="mailto:ayanmehdi773@gmail.com" style={{fontSize: '1.1rem', fontWeight: '600', color: '#a78bfa', textDecoration: 'none'}}>ayanmehdi773@gmail.com</a>
             <p style={{fontSize: '0.85rem', color: '#94a3b8', marginTop: '1rem', lineHeight: '1.6'}}>
               We typically reply within 24 to 48 hours. Please include relevant details or screenshots if you are reporting any bug or feature request.
             </p>
           </div>
         </div>
       </div>
       <button className="back-link" onClick={()=>setActive("home")}>← Back to all tools</button>
     </div>
   ) : <div className="content inner-content">{active==="image"?<ImageTool/>:active==="qr"?<QRTool/>:active==="text"?<TextTool/>:<ColorTool/>}<button className="back-link" onClick={()=>setActive("home")}>← Back to all tools</button></div>}
  </main>
 </div>;
}