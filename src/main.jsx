import React, {useMemo, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import html2canvas from "html2canvas";
import {createClient} from "@supabase/supabase-js";
import {Heart, ImagePlus, Download, Trash2, Upload, Sparkles, Camera, Type, Palette} from "lucide-react";
import "./style.css";

const url=import.meta.env.VITE_SUPABASE_URL;
const key=import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase=(url&&key&&key!=="YOUR_SUPABASE_ANON_KEY")?createClient(url,key):null;

const backgrounds=[
 {name:"Midnight Love", value:"linear-gradient(135deg,#180b20,#5a163e 55%,#130713)"},
 {name:"Rose Glow", value:"linear-gradient(135deg,#ffb6c9,#7d244d 55%,#281126)"},
 {name:"Sunset", value:"linear-gradient(135deg,#ff9966,#ff5e62 55%,#4d1e4b)"},
 {name:"Aurora", value:"linear-gradient(135deg,#0f2027,#203a43,#2c5364)"},
 {name:"Lavender", value:"linear-gradient(135deg,#654ea3,#eaafc8)"},
 {name:"Custom Color", value:"#241323"}
];

function App(){
 const [photos,setPhotos]=useState([]);
 const [bg,setBg]=useState(backgrounds[0].value);
 const [caption,setCaption]=useState("Jauh di mata, dekat di hati ♡");
 const [filter,setFilter]=useState("none");
 const [loading,setLoading]=useState(false);
 const canvasRef=useRef(null);
 const [gallery,setGallery]=useState([]);

 const addFiles=(e)=>{
   const list=[...e.target.files];
   list.slice(0,4).forEach(f=>{
     const reader=new FileReader();
     reader.onload=ev=>setPhotos(p=>[...p,{url:ev.target.result,file:f}]);
     reader.readAsDataURL(f);
   });
 };
 const remove=(i)=>setPhotos(p=>p.filter((_,x)=>x!==i));
 const download=async()=>{
   if(!canvasRef.current)return;
   const c=await html2canvas(canvasRef.current,{scale:2,useCORS:true,backgroundColor:null});
   const a=document.createElement("a"); a.download="lovebooth.png"; a.href=c.toDataURL("image/png"); a.click();
 };
 const saveOnline=async()=>{
   if(!supabase){alert("Supabase belum dikonfigurasi. Isi file .env terlebih dahulu.");return;}
   if(!photos.length){alert("Tambahkan foto dulu.");return;}
   setLoading(true);
   try{
     const c=await html2canvas(canvasRef.current,{scale:2,useCORS:true});
     const blob=await new Promise(r=>c.toBlob(r,"image/png"));
     const path=`${crypto.randomUUID()}.png`;
     const up=await supabase.storage.from("booth-photos").upload(path,blob,{contentType:"image/png"});
     if(up.error)throw up.error;
     const {data}=supabase.storage.from("booth-photos").getPublicUrl(path);
     const ins=await supabase.from("booth_photos").insert({image_url:data.publicUrl,background:bg,caption});
     if(ins.error)throw ins.error;
     setGallery(g=>[{image_url:data.publicUrl,id:path},...g]);
     alert("Foto tersimpan online ❤️");
   }catch(e){alert(e.message||"Gagal menyimpan");}
   finally{setLoading(false);}
 };
 const deleteOnline=async(item)=>{
   if(!supabase)return;
   const ok=confirm("Hapus foto ini?"); if(!ok)return;
   await supabase.storage.from("booth-photos").remove([item.id]);
   await supabase.from("booth_photos").delete().eq("image_url",item.image_url);
   setGallery(g=>g.filter(x=>x.image_url!==item.image_url));
 };
 const loadGallery=async()=>{
   if(!supabase){alert("Konfigurasi Supabase belum diisi.");return;}
   const {data,error}=await supabase.from("booth_photos").select("*").order("created_at",{ascending:false});
   if(error)alert(error.message); else setGallery(data||[]);
 };
 const photoClass=useMemo(()=>filter,[filter]);

 return <div className="app">
   <header><div className="brand"><Heart fill="currentColor"/> <span>Love<span>Booth</span></span></div><div className="tag">PHOTO BOOTH • LDR</div></header>
   <main>
    <section className="hero"><p className="eyebrow"><Sparkles size={15}/> DIGITAL DATE NIGHT</p><h1>Abadikan momen,<br/><em>meski terpisah jarak.</em></h1><p className="sub">Buat photo booth virtual untuk kamu dan pasangan. Pilih background, tambahkan pesan, lalu simpan kenangan kalian.</p></section>
    <div className="workspace">
      <aside className="panel">
       <div className="section"><h3><Upload size={17}/> Foto</h3><label className="upload"><ImagePlus/><span>Tambah sampai 4 foto</span><input type="file" accept="image/*" multiple onChange={addFiles}/></label>
       <div className="thumbs">{photos.map((p,i)=><div className="thumb" key={p.url}><img src={p.url}/><button onClick={()=>remove(i)}>×</button></div>)}</div></div>
       <div className="section"><h3><Palette size={17}/> Background</h3><div className="bggrid">{backgrounds.map(b=><button key={b.name} title={b.name} style={{background:b.value}} className={bg===b.value?"active":""} onClick={()=>setBg(b.value)}/>)}</div></div>
       <div className="section"><h3><Type size={17}/> Pesan</h3><input className="textinput" value={caption} onChange={e=>setCaption(e.target.value)} maxLength={70}/></div>
       <div className="section"><h3>✨ Filter</h3><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="none">Normal</option><option value="grayscale(1)">Black & White</option><option value="sepia(.35)">Warm</option><option value="saturate(1.5)">Vivid</option></select></div>
       <div className="actions"><button className="primary" onClick={download}><Download size={17}/> Download</button><button className="secondary" onClick={saveOnline} disabled={loading}>{loading?"Menyimpan…":"☁ Simpan Online"}</button></div>
      </aside>
      <section className="previewArea">
       <div className="booth" ref={canvasRef} style={{background:bg}}>
        <div className="stars">✦　·　✧　·　♡　·　✦</div>
        <div className={"photos "+(photos.length===1?"one":"")}>{photos.length?photos.map((p,i)=><div className="photo" key={p.url}><img className={photoClass} src={p.url}/><span>{String(i+1).padStart(2,"0")}</span></div>):<div className="empty"><Camera size={35}/><p>Tambahkan foto kalian</p></div>}</div>
        <div className="boothCaption"><div>♡</div><strong>{caption}</strong><small>LOVEBOOTH • LDR EDITION</small></div>
       </div>
      </section>
    </div>
    <section className="online"><div><p className="eyebrow">KENANGAN ONLINE</p><h2>Galeri foto kalian</h2></div><button className="secondary" onClick={loadGallery}>Muat Galeri</button>
      <div className="gallery">{gallery.length?gallery.map(x=><article key={x.id}><img src={x.image_url}/><button onClick={()=>deleteOnline(x)}><Trash2 size={15}/></button></article>):<p className="muted">Belum ada foto tersimpan.</p>}</div>
    </section>
   </main>
   <footer>Made with <Heart size={14} fill="currentColor"/> for two hearts, one distance.</footer>
 </div>
}
createRoot(document.getElementById("root")).render(<App/>);