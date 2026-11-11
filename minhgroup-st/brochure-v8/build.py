from pathlib import Path
import re,json
ROOT=Path(__file__).resolve().parent
BASE=ROOT.parent
v5=(BASE/'brochure-v5/brochure-v5.html').read_text(encoding='utf-8')
v3=(BASE/'brochure-v3/brochure-v3.html').read_text(encoding='utf-8')
v7=(BASE/'brochure-v7/brochure-v7.html').read_text(encoding='utf-8')
# Reuse the actual V7 leadership cards, including their supplied contact copy.
team_start=v7.index('class="team-new"')
team_start=v7.index('>',team_start)+1
depth=1
for token in re.finditer(r'</?div\b[^>]*>',v7[team_start:]):
    depth += -1 if token.group().startswith('</') else 1
    if depth==0:
        team_v7=v7[team_start:team_start+token.start()]
        break
person_symbol=re.search(r'<symbol\b[^>]*id="i-person".*?</symbol>',v7,re.S).group()
names=['Bìa','Tổng quan','Năng lực thực địa','Công nghệ & Tài chính','Bảo hiểm & An sinh','Hệ sinh thái','Dự án trọng điểm','Lộ trình & Điều hành','Thành tựu','Định hướng & Liên hệ']
shared='''
html,body{overflow:hidden!important;margin:0!important;background:#fffefd!important} .page{margin:0!important;box-shadow:none!important;break-after:auto!important}
.dark,.navy{background:#fdf1eb!important;color:#201e1d!important}.dark .mut,.navy .mut,.dark-band .mut{color:#5c5c5c!important}
.dark .ic2,.dark-band .ic2,.ic2.dk{background:#f6dfd3!important;color:#ca4d25!important}
.dark .pill,.dark-band .pill{background:#fffefd;color:#201e1d;border-color:#e0dcd8}
.dark .boxv{background:#e0dcd8}.dark .srule{background:#e0dcd8}.dark .or{color:#ca4d25}
.v8-footer{position:absolute;left:15mm;right:15mm;bottom:8mm;display:flex;justify-content:space-between;border-top:.2mm solid #e0dcd8;padding-top:3mm;font-size:6.7pt;color:#5c5c5c;background:#fffefd}
.draft-note{font-size:7.5pt;color:#805746;line-height:1.5}
'''
light='''
const selected=document.querySelector('.page');
for(const e of [selected,...selected.querySelectorAll('*')]){
const s=getComputedStyle(e), bg=s.backgroundColor.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
if(bg&&Math.max(+bg[1],+bg[2],+bg[3])<80)e.style.setProperty('background-color','#fdf1eb','important');
}
for(const e of [selected,...selected.querySelectorAll('*')]){
const s=getComputedStyle(e),co=s.color.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
if(co&&Math.min(+co[1],+co[2],+co[3])>220){
let a=e, orange=false;while(a&&a!==selected.parentNode){const b=getComputedStyle(a).backgroundColor;if(['rgb(202, 77, 37)','rgb(169, 61, 27)'].includes(b)){orange=true;break}a=a.parentElement}
if(!orange)e.style.setProperty('color','#201e1d','important');}
}
selected.querySelectorAll('img').forEach(e=>{e.src=e.src.replace('mgst-logo-white.svg','mgst-logo.svg');if(/pvi-w|pti-w/.test(e.src))e.style.filter='brightness(0) saturate(100%)'});
'''
def make(n,version,index,extra='',pre=None,style='',brighten=True):
    src=v3 if version==3 else v5
    if pre: src=pre(src)
    src=src.replace('url(fonts/',f'url(../brochure-v{version}/fonts/')
    src=src.replace('</head>',f'<style>{shared}\n{style}</style></head>')
    # All original generators run before unused pages are removed.
    custom=f'''<script>(()=>{{
const all=[...document.querySelectorAll('.page')];all.forEach((p,i)=>{{if(i!=={index})p.remove()}});
{light if brighten else "const selected=document.querySelector('.page');"}
{extra}
selected.querySelectorAll('.pn').forEach(e=>e.textContent='{n:02}');
document.title='Minh Group ST · V8 · {names[n-1]}';
document.fonts.ready.then(()=>document.documentElement.dataset.ready='true');
}})();</script>'''
    src=src.replace('</body>',custom+'</body>')
    (ROOT/f'page-{n:02}.html').write_text(src,encoding='utf-8')

# Cover follows the V5 source composition. Preserve its photographic overlay
# and white-on-photo typography; keep the cover focused on three key figures.
make(1,5,0,'''
selected.classList.add('cover-focused');
const stats=selected.querySelectorAll('.kf');
stats[2].querySelector('.stat').textContent='4';
['Nhân sự thực địa','Ngân hàng đối tác','Lĩnh vực kết nối'].forEach((label,i)=>stats[i].querySelector('.sm').textContent=label);
const figures=stats[0].parentElement;
figures.lastElementChild.remove();
figures.classList.add('cover-figures');
figures.style.gridTemplateColumns='repeat(3,1fr)';
figures.style.setProperty('--h','4');
selected.querySelector('#cv-svc').remove();
selected.querySelector('.hero .pill').remove();
selected.querySelector('.hero h1').style.marginTop='0';
const values=selected.querySelector('.vband');values.style.height='22mm';values.style.fontSize='18pt';
selected.querySelector('.hero img').alt='Cầu Cần Thơ';
''',brighten=False,style='''
.cover-focused .cover-figures .kf{padding:10mm 6mm;justify-content:center;gap:5mm}
.cover-focused .cover-figures .stat{font-size:60pt;font-weight:700;line-height:1;letter-spacing:-.045em}
.cover-focused .cover-figures .stat span{font-size:32pt;vertical-align:.55em;margin-left:1mm}
.cover-focused .cover-figures .sm{font-size:9.2pt;line-height:1.4;color:#5c5c5c}
''')
make(2,5,1)
make(3,5,2,'''
const panel=selected.querySelector('.stat').parentElement.parentElement;
panel.firstElementChild.remove();panel.style.gridTemplateColumns='repeat(3,1fr)';
panel.querySelectorAll(':scope > div').forEach(e=>{e.style.cssText+=';border-top:1mm solid #ca4d25;padding:5mm 4mm;align-items:flex-start;text-align:left';e.querySelector('.stat').style.fontSize='39pt'});
selected.querySelector('#s3').innerHTML='<img src="assets/office-illustration.png" alt="Ảnh AI minh họa đội ngũ làm việc" style="width:100%;height:100%;object-fit:cover;object-position:center 52%;display:block"><span style="position:absolute;bottom:2mm;right:4mm;padding:1mm 2mm;background:#fffefd;color:#5c5c5c;font-size:6pt">Ảnh AI minh họa bố cục</span>';
''')
make(4,5,3,'''
const bankPanel=selected.querySelector('#banks').parentElement;
const bankCopy=bankPanel.querySelector('.sm');
bankCopy.style.setProperty('color','#3d3a38','important');
bankCopy.querySelector('b').style.setProperty('color','#201e1d','important');
bankCopy.querySelector('b').style.fontWeight='700';
bankPanel.querySelector('.stat').style.setProperty('color','#ca4d25','important');
''')
make(5,5,4,'''
selected.querySelector('h2').innerHTML='Bảo hiểm <span>&amp;</span> An sinh';
selected.querySelectorAll('.pill').forEach(e=>{if(e.textContent.includes('Chi trả BTXH'))e.innerHTML='<span class="nb">03</span>Chi trả bảo trợ xã hội'});
selected.querySelector('#proj').remove();
selected.querySelectorAll('.foot').forEach(e=>{if(e.textContent.includes('Phòng Dự án'))e.remove()});
const summary=document.createElement('div');summary.className='g fill';summary.style.cssText='--c:1;--r:14;--w:12;--h:3;display:grid;grid-template-columns:1fr 1fr;background:#fdf1eb';
summary.innerHTML='<div style="padding:6mm;border-right:.25mm solid #e0dcd8"><div class="lbl or">Bảo vệ tài chính</div><p class="h3" style="margin-top:4mm;font-size:17pt">Từng gia đình.<br>Từng giai đoạn cuộc sống.</p></div><div style="padding:6mm"><div class="lbl or">Trách nhiệm tại địa bàn</div><p class="body" style="margin-top:4mm">Đúng người, đúng tiền, đúng hẹn.<br>Kiểm soát tài chính chặt chẽ.<br>Tận tâm với người có công, người cao tuổi.</p></div>';
selected.querySelector('.trim').append(summary);
''')
def four(src):
    start=src.index('/* ---- heptagon');end=src.index('/* ---- roadmap',start)
    segment=src[start:end]
    segment=re.sub(r'const P=\[.*?;\n',"const P=[['Công nghệ','Chuyển đổi số & Y tế số',C.blue],['Tài chính','12+ ngân hàng đối tác',C.blue],['Bảo hiểm & An sinh','BHXH · BHYT · Chi trả',C.green],['Dự án','Ưu tiên phát triển',C.green]];\n",segment,flags=re.S)
    # Preserve V3's perimeter and fine mesh. Only four large numbered nodes
    # are business fields; the four tiny unlabelled dots are line junctions.
    segment=segment.replace('P.map((_,i)=>{const a=-Math.PI/2+i*2*Math.PI/7;', 'Array.from({length:8},(_,i)=>{const a=-3*Math.PI/4+i*2*Math.PI/8;')
    segment=segment.replace('i<7','i<8').replace('j<7','j<8').replace('// all connections (K7)','// V3 mesh with four principal nodes and four small line junctions')
    segment=segment.replace("stroke:'#fff','stroke-opacity':.07", "stroke:'#bba99d','stroke-opacity':.32")
    segment=segment.replace("stroke:C.bl,'stroke-opacity':.55", "stroke:C.blue,'stroke-opacity':.62")
    segment=segment.replace("cy-1,'7'","cy-1,'4'").replace("'TRỤ CỘT'","'LĨNH VỰC'")
    segment=segment.replace("r:17,fill:C.navy2", "r:18,fill:'#fffefd'")
    segment=segment.replace('V.forEach(([x,y,a],i)=>{const col=P[i][2];', "V.filter((_,i)=>i%2===1).forEach(([x,y])=>el('circle',{cx:f(x),cy:f(y),r:1.25,fill:'#fffefd',stroke:'#c4a18b','stroke-width':.4},s));\n  V.filter((_,i)=>i%2===0).forEach(([x,y,a],i)=>{const col=P[i][2];")
    segment=segment.replace("const lx=x+c*10,ly=y+sn*10+(Math.abs(c)<.2?(sn<0?-4:4):0);", "const lx=x+(c>0?10:-10),ly=y-2;")
    segment=segment.replace("'font-size':4.4","'font-size':3.8").replace("'font-size':2.9","'font-size':2.6")
    return src[:start]+segment+src[end:]
make(6,3,5,'''
selected.classList.remove('navy');selected.classList.add('ecosystem-v3');
selected.querySelector('h1').parentElement.style.setProperty('--s','12');selected.querySelector('h1').style.fontSize='23pt';selected.querySelector('h1').innerHTML='4 lĩnh vực –<br><span style="color:#ca4d25">Một hệ sinh thái kết nối.</span>';
const network=selected.querySelector('#hepta');network.style.top='51mm';
network.setAttribute('role','img');network.setAttribute('aria-label','Bốn lĩnh vực kết nối: Công nghệ, Tài chính, Bảo hiểm và An sinh, Dự án. Các chấm nhỏ là điểm nối của mạng lưới.');
network.querySelectorAll('text').forEach(e=>{const t=e.textContent;if(!/^0[1-4]$/.test(t))e.setAttribute('fill',t==='4'||t==='LĨNH VỰC'?'#ca4d25':e.getAttribute('font-size')==='2.6'?'#5c5c5c':'#201e1d')});
network.querySelector('circle[r="18"]').setAttribute('stroke','#ca4d25');
const benefits=[...selected.querySelector('.trim').children].find(e=>e.style.top==='195mm');
benefits.classList.add('benefits');
[...benefits.children].forEach((row,i)=>{row.classList.add('benefit');row.firstElementChild.style.setProperty('color',i<2?'#fff':'#ca4d25','important');row.lastElementChild.style.color=i<2?'#ca4d25':'#201e1d'});
selected.querySelectorAll('.h3').forEach(e=>e.style.color='#201e1d');
''',pre=four,style='''
.ecosystem-v3{background:#fffefd!important;color:#201e1d}
.ecosystem-v3 .benefit{background:#fdf1eb!important;border:.25mm solid #eaded5;border-radius:2.4mm}
.ecosystem-v3 .benefit .mut{color:#5c5c5c!important}
.ecosystem-v3 .benefit:last-child>div:first-child{background:#f6dfd3!important}
.ecosystem-v3 .rf{color:#5c5c5c!important}
.ecosystem-v3 .rh .lbl{color:#ca4d25!important}
''')
make(8,3,6,'''
selected.querySelector('.rh .lbl').textContent='Lộ trình & Điều hành';
const directory=selected.querySelector('#leaders');
directory.innerHTML=V7_DIRECTORY_JSON;
directory.style.cssText+=';display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,43mm);gap:.25mm;background:#e0dcd8;border:.25mm solid #e0dcd8;font-family:Inter,sans-serif';
directory.querySelectorAll(':scope > div').forEach(card=>{
 card.style.cssText+=';grid-template-columns:22mm 1fr;gap:3.5mm;padding:4mm;background:#fffefd';
 const portrait=card.querySelector('.ht');portrait.style.width='22mm';portrait.style.height='26mm';
});
const note=document.createElement('div');note.className='gx';note.style.cssText='--c:1;--s:12;top:272mm;font-family:Inter,sans-serif;font-size:6.5pt;color:#806d61';note.textContent='Ảnh chân dung: chờ ảnh chính thức của từng lãnh đạo.';selected.querySelector('.trim').append(note);
selected.insertAdjacentHTML('beforeend',V7_SYMBOL_JSON);
'''.replace('V7_DIRECTORY_JSON',json.dumps(team_v7,ensure_ascii=False)).replace('V7_SYMBOL_JSON',json.dumps('<svg width="0" height="0" style="position:absolute">'+person_symbol+'</svg>',ensure_ascii=False)),style='''
@font-face{font-family:Inter;src:url(../brochure-v5/fonts/Inter-Regular.ttf);font-weight:400}
@font-face{font-family:Inter;src:url(../brochure-v5/fonts/Inter-SemiBold.ttf);font-weight:600}
@font-face{font-family:Inter;src:url(../brochure-v5/fonts/Inter-Bold.ttf);font-weight:700}
#leaders .h3{font-family:Inter,sans-serif;font-weight:600;line-height:1.25}
#leaders .sm{font-size:8.2pt;line-height:1.4}
#leaders .xs{font-size:7.3pt;line-height:1.4}
#leaders .or{color:#ca4d25}
#leaders .ht{background:repeating-linear-gradient(135deg,#fffefd 0 2mm,#f6dfd3 2mm 2.2mm)}
''')
make(10,3,7,'''
selected.classList.remove('navy');selected.classList.add('closing-v3');
selected.querySelectorAll('[style*="color:var(--blue-l)"],[style*="color:var(--green-l)"]').forEach(e=>e.style.color='#ca4d25');
selected.querySelectorAll('.card').forEach(e=>{e.style.setProperty('background','#fdf1eb','important');e.style.border='.25mm solid #eaded5'});
selected.querySelectorAll('.mut').forEach(e=>e.style.setProperty('color','#5c5c5c','important'));
selected.querySelectorAll('#back-net [stroke="#FFFFFF"]').forEach(e=>{e.setAttribute('stroke','#b7a99f');e.setAttribute('stroke-opacity','.55')});
selected.querySelectorAll('#back-net circle[fill="#201E1D"]').forEach(e=>e.setAttribute('fill','#fffefd'));
// No fake QR: keep the verified contact text from the supplied PDF.
const qr=selected.querySelector('#qr'), box=qr.parentElement;
box.innerHTML='<a href="https://mgst.com.vn" target="_blank" rel="noopener"><img src="assets/website-qr.png" alt="Quét mã truy cập https://mgst.com.vn" style="width:42mm;height:42mm;display:block"></a><div class="h3" style="margin-top:4mm">Quét để kết nối</div><a href="https://mgst.com.vn" style="margin-top:2mm;font-size:9pt;color:#ca4d25;text-decoration:none">mgst.com.vn</a>';
box.style.background='#fdf1eb';box.parentElement.style.border='.25mm solid #e0dcd8';
selected.querySelectorAll('.card .icb').forEach(e=>{e.style.setProperty('background','#ca4d25','important');e.style.setProperty('color','#fff','important')});
const slogan=[...selected.querySelector('.trim').children].find(e=>e.style.top==='232mm');
slogan.classList.add('closing-slogan');
slogan.style.top='229mm';
slogan.firstElementChild.style.cssText='font-family:var(--head);font-weight:800;font-size:29pt;line-height:1.12;letter-spacing:-.025em;color:#fff';
slogan.querySelector('span').style.color='#fff';
[...selected.querySelector('.trim').children].find(e=>e.style.top==='266mm').style.top='274mm';
const contact=box.parentElement;
contact.querySelectorAll('.row').forEach(row=>{const value=row.lastElementChild.lastElementChild;const txt=value.textContent.trim();if(txt==='0977 726 700'||txt==='minhgroupst@mgst.com.vn'){const a=document.createElement('a');a.href=txt.includes('@')?'mailto:'+txt:'tel:+84977726700';a.textContent=txt;a.style.cssText='color:inherit;text-decoration:none';value.replaceChildren(a)}});
''',style='.closing-v3{background:#fffefd!important;color:#201e1d}.closing-v3 .h3{color:#201e1d!important}.closing-slogan{background:#ca4d25;padding:7mm 8mm;border-radius:3mm;min-height:36mm}.closing-v3 .card .ic{color:#fff!important}')

css='''
@font-face{font-family:Inter;src:url(../brochure-v5/fonts/Inter-Regular.ttf);font-weight:400}@font-face{font-family:Inter;src:url(../brochure-v5/fonts/Inter-SemiBold.ttf);font-weight:600}@font-face{font-family:Inter;src:url(../brochure-v5/fonts/Inter-Bold.ttf);font-weight:700}
@page{size:216mm 303mm;margin:0}*{box-sizing:border-box}html,body{overflow:hidden}body{margin:0;color:#201e1d;font-family:Inter,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}.sheet{width:216mm;height:303mm;padding:16mm 18mm;position:relative;background:#fffefd;overflow:hidden}.top{display:flex;align-items:center;justify-content:space-between;border-bottom:.25mm solid #e0dcd8;padding-bottom:6mm}.top img{height:7mm}.eyebrow{font-size:7pt;text-transform:uppercase;letter-spacing:1pt;color:#ca4d25;font-weight:600}h1{font-size:29pt;letter-spacing:-1pt;line-height:1.13;margin:10mm 0 5mm;font-weight:600}h1 span{color:#ca4d25}p{font-size:10pt;line-height:1.55;margin:0}h2{font-size:14pt;margin:0;font-weight:600}.footer{position:absolute;left:18mm;right:18mm;bottom:12mm;border-top:.25mm solid #e0dcd8;padding-top:4mm;display:flex;justify-content:space-between;font-size:7pt;color:#5c5c5c}.grid{display:grid;gap:0;border-top:.25mm solid #e0dcd8;border-left:.25mm solid #e0dcd8}.grid>*{border-bottom:.25mm solid #e0dcd8;border-right:.25mm solid #e0dcd8;padding:5mm}.num{font-size:25pt;color:#ca4d25;font-weight:600}.meta{font-size:8pt;line-height:1.5;color:#806d61}.slot{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;background:#fdf1eb;color:#855f4c;border:.25mm solid #e5cbbb;font-size:8pt;padding:3mm}.slot strong{font-weight:600}.slot small{font-size:6.5pt;margin-top:2mm;color:#94745f}.letter{background:#fffaf1;border:.5mm double #d4b68d;box-shadow:1mm 2mm 4mm #d8cbbd;padding:5mm;display:flex;flex-direction:column;align-items:center;justify-content:center}.letter b{font-family:Georgia,serif;font-size:17pt;color:#a94324}.letter small{font-size:8pt;text-align:center;line-height:1.7;color:#806d61;margin-top:6mm}
'''
def own(n,body):
    h=f'''<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>V8 · {names[n-1]}</title><style>{css}</style></head><body><section class="sheet"><header class="top"><img src="../assets/logo/mgst-logo.svg" alt="Minh Group ST"><span class="eyebrow">{names[n-1]}</span></header>{body}<footer class="footer"><span>Minh Group ST · Hồ sơ năng lực 2026</span><span>{n:02}</span></footer></section></body></html>'''
    (ROOT/f'page-{n:02}.html').write_text(h,encoding='utf-8')

projects=''.join(f'''<div style="display:grid;grid-template-columns:15mm 1fr;gap:4mm;align-items:center"><span class="num">0{i}</span><div><h2 style="font-size:12pt">Tên dự án đang cập nhật</h2><p class="meta" style="margin-top:2mm">Mục tiêu · Địa bàn · Quy mô · Đối tác triển khai</p></div></div>''' for i in range(1,6))
own(7,f'''<h1>Dự án trọng điểm<br><span>triển khai.</span></h1><div style="background:#ca4d25;color:white;padding:5mm 6mm;display:flex;gap:6mm;align-items:center"><strong style="font-size:13pt;max-width:43mm;line-height:1.2">Ưu tiên<br>phát triển</strong><p style="font-size:9pt;border-left:.25mm solid #e6a18a;padding-left:6mm">Phòng Dự án · Hạt nhân chiến lược<br>Từ nghiên cứu đến kết nối nguồn lực.</p></div><div class="grid" style="margin-top:7mm;grid-template-rows:repeat(5,23mm)">{projects}</div><p class="meta" style="margin:3mm 0 5mm">Danh mục 5 dự án: chờ xác nhận nội dung chính thức.</p><div class="eyebrow">Từ ý tưởng đến triển khai</div><div class="grid" style="grid-template-columns:repeat(3,1fr);margin-top:4mm;min-height:43mm">{''.join('<div><h2 style="font-size:11pt">'+t+'</h2><p style="font-size:8pt;margin-top:3mm">'+d+'</p></div>' for t,d in [('Nghiên cứu thị trường','Khảo sát nhu cầu, phân tích đối thủ và tiềm năng vùng.'),('Xây dựng mô hình','Phương án vận hành khả thi, có khả năng sinh lời.'),('Kết nối nguồn lực','Gọi vốn, đối tác công – tư (PPP), nguồn lực xã hội.')])}</div>''')
def slot(t):return f'<div class="slot"><strong>{t}</strong><small>Chờ tư liệu thực tế</small></div>'
own(9,f'''<div style="display:grid;grid-template-columns:repeat(4,1fr);height:31mm;margin-top:6mm;gap:1.5mm">{''.join(slot(t) for t in ['Trao bằng khen','Trao tiền ủng hộ','Trao bằng khen','Trao tiền ủng hộ'])}</div><div style="display:grid;grid-template-columns:29mm 1fr 29mm;gap:3mm;margin-top:3mm;height:200mm"><aside style="display:grid;grid-template-rows:repeat(4,1fr);gap:2mm">{''.join(slot(t) for t in ['Trao bằng khen','Hoạt động cộng đồng','Trao tiền ủng hộ','Trao bằng khen'])}</aside><div style="position:relative;padding:1mm 2mm;background:#fff9f3"><h1 style="font-size:25pt;margin:5mm 0 3mm">Thành tựu<br><span>&amp; cộng đồng.</span></h1><p style="font-size:8.5pt">Sự ghi nhận từ những giá trị sẻ chia.</p><div class="slot" style="height:77mm;margin-top:6mm;background:#f6e5d5"><strong style="font-size:13pt">Hoạt động trồng cây</strong><small>Vị trí ảnh trung tâm · chờ ảnh chính thức</small></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:3mm;position:relative;margin:0 1mm;top:-4mm"><div class="letter" style="height:70mm;transform:rotate(-5deg)"><b>Thư cảm ơn</b><small>Chờ bản chụp<br>thư chính thức</small></div><div class="letter" style="height:70mm;transform:rotate(5deg)"><b>Thư cảm ơn</b><small>Chờ bản chụp<br>thư chính thức</small></div></div></div><aside style="display:grid;grid-template-rows:repeat(4,1fr);gap:2mm">{''.join(slot(t) for t in ['Trao tiền ủng hộ','Trao bằng khen','Hoạt động cộng đồng','Trao tiền ủng hộ'])}</aside></div><p class="meta" style="margin-top:4mm;font-size:7pt">Bố cục ảnh theo mẫu tham khảo; nội dung thành tựu sẽ dùng tư liệu do doanh nghiệp cung cấp.</p>''')

# Restore concept photography as explicitly illustrative assets, never as factual evidence.
def photo(asset,label,pos='center'):
    return f'<figure style="margin:0;position:relative;height:100%;min-height:0;overflow:hidden;background:#fdf1eb"><img src="assets/{asset}-illustration.png" alt="Ảnh AI minh họa: {label}" style="width:100%;height:100%;object-fit:cover;object-position:{pos};display:block"><figcaption style="position:absolute;bottom:0;left:0;right:0;background:#fffefde8;padding:2mm;font-size:6.5pt;color:#5c5c5c">{label} · Ảnh AI minh họa</figcaption></figure>'
letter='<div class="letter" style="height:66mm;padding:4mm"><b style="font-size:15pt">Thư cảm ơn</b><small style="margin-top:5mm;font-size:7.5pt;text-align:left">Kính gửi Quý đơn vị,<br><br>Trân trọng cảm ơn sự đồng hành và sẻ chia cùng cộng đồng.</small><span style="font-size:6pt;color:#a94324;margin-top:7mm;letter-spacing:.6pt">MẪU MINH HỌA</span></div>'
own(9,f'''<div style="display:grid;grid-template-columns:repeat(3,1fr);height:40mm;margin-top:6mm;gap:2mm">{photo('awards','Trao bằng khen')}{photo('donation','Trao hỗ trợ')}{photo('office','Hoạt động đội ngũ')}</div><div style="display:grid;grid-template-columns:1fr 44mm;gap:4mm;margin-top:4mm;height:188mm"><div><h1 style="font-size:25pt;margin:3mm 0 3mm">Thành tựu<br><span>&amp; cộng đồng.</span></h1><p style="font-size:8.5pt;margin-bottom:4mm">Sự ghi nhận từ những giá trị sẻ chia.</p><div style="height:85mm">{photo('tree','Hoạt động trồng cây')}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin:0 3mm;position:relative;top:3mm"><div style="transform:rotate(-4deg)">{letter}</div><div style="transform:rotate(4deg)">{letter}</div></div></div><aside style="display:grid;grid-template-rows:repeat(3,1fr);gap:3mm">{photo('donation','Trao hỗ trợ','60% center')}{photo('awards','Trao bằng khen','72% center')}{photo('tree','Hoạt động cộng đồng','35% center')}</aside></div><p class="meta" style="margin-top:5mm;font-size:6.7pt">Hình ảnh và thư là minh họa thiết kế, sẽ thay bằng tư liệu chính thức của doanh nghiệp.</p>''')

# Preview and print are separate: print never inherits screen zoom or navigation.
nav=''.join(f'<a href="#page-{i:02}">{i:02} {name}</a>' for i,name in enumerate(names,1))
frames=''.join(f'<section class="frame" id="page-{i:02}"><iframe title="{i:02} {name}" src="page-{i:02}.html"></iframe></section>' for i,name in enumerate(names,1))
viewer=f'''<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Minh Group ST · Brochure V8</title><style>body{{margin:0;background:#e5e2de;font:14px Arial,sans-serif;color:#201e1d}}header{{position:sticky;top:0;z-index:4;background:#fffefd;border-bottom:1px solid #ddd;padding:16px 24px;display:flex;gap:18px;align-items:center}}header strong{{margin-right:auto}}a{{color:#a93d1b;text-decoration:none}}nav{{display:flex;gap:16px;padding:14px 24px;overflow:auto;white-space:nowrap;background:#fdf1eb}}main{{padding:24px 12px}}.frame{{width:816.38px;height:1145.2px;margin:0 auto 28px;scroll-margin-top:86px;box-shadow:0 3px 22px #0001;background:white}}iframe{{width:816.38px;height:1145.2px;border:0;display:block}}.note{{font-size:12px;color:#73685f;max-width:816px;margin:0 auto 20px}}@media(max-width:850px){{main{{overflow-x:auto}}header{{flex-wrap:wrap}}}}@media print{{header,nav,.note{{display:none}}main{{padding:0}}.frame{{margin:0;box-shadow:none;break-after:page}}}}</style></head><body><header><strong>MINH GROUP ST / V8</strong><span>10 trang · Bản duyệt</span><a href="MinhGroupST-V8-review.pdf" download>Tải PDF</a><a href="print.html" target="_blank">Bản in</a></header><nav aria-label="Mục lục">{nav}</nav><main><p class="note">Nội dung theo PDF cung cấp. Trang 07 và 09 còn chờ tên dự án và tư liệu thành tựu chính thức.</p>{frames}</main></body></html>'''
(ROOT/'brochure-v8.html').write_text(viewer,encoding='utf-8')
(ROOT/'print.html').write_text(f'''<!doctype html><html><head><meta charset="utf-8"><title>MinhGroupST V8</title><style>@page{{size:216mm 303mm;margin:0}}*{{box-sizing:border-box}}html,body{{margin:0;padding:0}}.frame{{width:216mm;height:303mm;margin:0;padding:0;break-after:page}}.frame:last-child{{break-after:auto}}iframe{{display:block;border:0;width:216mm;height:303mm}}</style></head><body>{frames}</body></html>''',encoding='utf-8')
print('Built 10 V8 pages and preview.')

# Final editorial pass is shared by the browser preview and PDF export.
from enhance import enhance
enhance(ROOT)


