from pathlib import Path
import json
import re

def neutralize(source):
    colors = {
        'fdf1eb':'f5f5f5','f6dfd3':'e8e8e8','fbe3d9':'ededed',
        'fffefd':'ffffff','fffaf1':'ffffff','fff9f3':'fafafa',
        'faf7f4':'fafafa','f5f3f1':'f5f5f5','f6e5d5':'ededed',
        'e0dcd8':'dedede','eaded5':'dedede','ebe7e3':'e5e5e5',
        'e5cbbb':'dddddd','d4b68d':'bbbbbb','cbb18a':'bbbbbb',
        'd8cbbd':'dddddd','d6b7a8':'cccccc','d9d6d3':'d9d9d9',
        'd6d1cc':'d6d6d6','a39d98':'999999','8a837d':'777777',
        '806d61':'666666','94745f':'666666','855f4c':'555555',
        '805746':'555555','bba99d':'bbbbbb','c4a18b':'bbbbbb',
        'cbb4a6':'bbbbbb','e6a18a':'dddddd','b7a99f':'bbbbbb',
        'f2a07e':'ca4d25','e5e2de':'e5e5e5','73685f':'666666',
    }
    source=re.sub(r'#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?\b',lambda m:'#'+colors.get(m[1].lower(),m[1])+(m[2] or ''),source)
    source=source.replace('253,241,235','245,245,245').replace('253 241 235','245 245 245')
    return source

COMMON = '''
@font-face{font-family:Inter;src:url(../brochure-v5/fonts/Inter-Regular.ttf);font-weight:400}
@font-face{font-family:Inter;src:url(../brochure-v5/fonts/Inter-SemiBold.ttf);font-weight:600}
@font-face{font-family:Inter;src:url(../brochure-v5/fonts/Inter-Bold.ttf);font-weight:700}
.editorial{--line:#e0dcd8;--head:Inter;--body:Inter}
.editorial .rh{padding-bottom:4mm;border-bottom:.25mm solid #e0dcd8}
.editorial .rh .lbl{color:#a93d1b!important;letter-spacing:.12em}
.editorial .rf{border-top:.25mm solid #e0dcd8;padding-top:3mm;color:#5c5c5c!important}
.editorial .h1,.editorial .h2,.editorial h1,.editorial h2{font-family:Inter,sans-serif;letter-spacing:-.035em}
.editorial .pill{border:0;padding-left:0;background:transparent;font-weight:600;color:#a93d1b}
.editorial .pill .nb{border-radius:1mm}
.editorial .x{opacity:.5}
.editorial .boxv{opacity:.55}
.editorial .cap{font-size:5.5pt}
.editorial .fcard:after{background:linear-gradient(135deg,#fdf1eb 0%,rgba(253,241,235,.94) 32%,rgba(253,241,235,.58) 60%,transparent 92%)}
.editorial .fcard .h3{font-size:13pt;line-height:1.25}
.editorial .stat{font-variant-numeric:tabular-nums}
.editorial .cover-figures{border-top:1mm solid #ca4d25!important}
.editorial .cover-figures .kf{gap:4mm!important}
.editorial .cover-figures .sm{font-weight:600;color:#3d3a38!important}
.editorial .hero .oc{opacity:.5}
.editorial .oc{display:none!important}
.editorial .hero h1{font-weight:700;letter-spacing:-.04em}
.editorial .benefit{border-radius:0!important;border:0!important;border-bottom:.25mm solid #e0dcd8!important}
.editorial .benefit>div:first-child{background:#ca4d25!important;color:#fff!important}
.editorial #leaders{border:0!important;gap:3mm!important;background:transparent!important}
.editorial #leaders>div{border:.25mm solid #e0dcd8;border-top:.7mm solid #ca4d25}
.editorial .closing-slogan{border-radius:0;min-height:38mm}
.editorial.closing-v3 .card{border-radius:3mm;border:0!important}
.editorial.closing-v3 .card .h3{font-size:11pt;line-height:1.35}
.editorial.closing-v3 .card .sm{font-size:8.3pt;line-height:1.5}
.editorial .letter{box-shadow:.5mm 1mm 2mm #d8cbbd;border:.3mm solid #cbb18a}
.editorial .top{padding-bottom:5mm}
.editorial .eyebrow{color:#a93d1b}
'''

NETWORK = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 136" role="img" aria-label="Bốn lĩnh vực Công nghệ, Tài chính, Bảo hiểm và An sinh, Dự án cùng kết nối trong hệ sinh thái Minh Group ST">
<circle cx="90" cy="65" r="48" fill="#fdf1eb"/>
<g fill="none" stroke="#ca4d25" stroke-width=".5"><path d="M53 28L127 28L127 102L53 102Z"/><path d="M53 28L90 17L127 28L138 65L127 102L90 113L53 102L42 65Z" stroke-opacity=".35"/><path d="M53 28L127 102M127 28L53 102" stroke-opacity=".4"/></g>
<g stroke="#cbb4a6" stroke-width=".25" fill="none"><path d="M90 17L42 65L90 113L138 65Z"/><path d="M53 28L138 65L53 102M127 28L42 65L127 102"/></g>
<circle cx="90" cy="65" r="21" fill="#fffefd" stroke="#ca4d25" stroke-width=".45"/>
<image href="../assets/logo/mgst-mark.svg" x="77" y="52.5" width="26" height="25" preserveAspectRatio="xMidYMid meet"/>
{nodes}</svg>'''

def network():
    nodes=[]
    for num,x,y,title,sub in [('01',53,28,'Công nghệ','Chuyển đổi số & Y tế số'),('02',127,28,'Tài chính','12+ ngân hàng đối tác'),('03',127,102,'Bảo hiểm & An sinh','BHXH · BHYT · Chi trả'),('04',53,102,'Dự án','Ưu tiên phát triển')]:
        yy=12 if y==28 else 122
        nodes.append(f'<circle cx="{x}" cy="{y}" r="6.5" fill="#ca4d25"/><text x="{x}" y="{y+1.3}" font-family="Inter" text-anchor="middle" font-size="3.7" font-weight="700" fill="white">{num}</text><text x="{x}" y="{yy}" font-family="Inter" text-anchor="middle" font-size="4" font-weight="600" fill="#201e1d">{title}</text><text x="{x}" y="{yy+5}" font-family="Inter" text-anchor="middle" font-size="2.6" fill="#5c5c5c">{sub}</text>')
    return NETWORK.replace('{nodes}',''.join(nodes))

def enhance(root):
    titles=['Bìa','Tổng quan','Năng lực thực địa','Công nghệ & Tài chính','Bảo hiểm & An sinh','Hệ sinh thái','Dự án trọng điểm','Lộ trình & Điều hành','Thành tựu','Định hướng & Liên hệ']
    for n in range(1,11):
        path=root/f'page-{n:02}.html'
        source=path.read_text(encoding='utf-8')
        js="const p=document.querySelector('.page,.sheet');p.classList.add('editorial');"
        js+=f"const label=p.querySelector('.rh .lbl');if(label)label.textContent={json.dumps(f'{n:02} / {titles[n-1]}',ensure_ascii=False)};"
        if n==2:
            js+="p.querySelectorAll('.h2').forEach(e=>{e.style.fontSize='19pt';e.style.marginTop='3mm'});"
            js+="""const cards=[...p.querySelectorAll('#philo>div')];
cards.forEach(card=>{card.style.background='#ffffff';card.style.color='#201e1d';const icon=card.firstElementChild;icon.classList.add('ic2');icon.style.setProperty('background','#f5f5f5','important');icon.style.color='#ca4d25';const caption=card.querySelector('.sm');caption.style.opacity='1';caption.style.color='#5c5c5c'});
p.querySelectorAll('.lbl').forEach(e=>{if(e.textContent.trim()==='Thông điệp thương hiệu')e.remove()});
"""
        if n==3:
            js+="p.querySelectorAll('.stat').forEach(e=>e.style.fontSize='42pt');"
            js+="const board=[...p.querySelectorAll('.g')].find(e=>e.textContent.trim().toLocaleLowerCase('vi')==='ban giám đốc');board.style.setProperty('background','#ca4d25','important');board.style.setProperty('color','#fff','important');board.querySelectorAll('*').forEach(e=>e.style.setProperty('color','#fff','important'));"
        if n in [4,5]:
            js+="p.querySelector('h2').style.fontSize='27pt';"
        if n==4:
            js+="""p.querySelectorAll('.fcard .nb').forEach(e=>e.remove());
const features=p.querySelector('#b-list');features.style.setProperty('--r','8');
const banks=p.querySelector('#banks'),bankPanel=banks.parentElement;
bankPanel.style.setProperty('--r','11');bankPanel.style.setProperty('--h','2');bankPanel.style.padding='3mm 4mm';
bankPanel.querySelector('.stat').style.fontSize='36pt';banks.style.marginTop='2mm';
const divider=[...p.querySelectorAll('.g.fill')].find(e=>e.textContent.trim()==='Kênh y tế số · PKD Y');
divider.style.setProperty('--w','12');divider.style.borderTop='.25mm solid #dedede';divider.style.borderBottom='.25mm solid #dedede';divider.style.background='#f5f5f5';
"""
        if n==5:
            js+="""p.querySelectorAll('.fcard .nb').forEach(e=>e.remove());
const commit=p.querySelector('#commit'), parts=[...commit.children];
commit.replaceChildren();
for(let i=0;i<3;i++){
 const card=document.createElement('div');card.style.cssText='display:flex;flex-direction:column;align-items:center;text-align:center;padding:3mm 2mm;gap:1.5mm';
 const number=parts[i*2],content=parts[i*2+1];
 number.style.cssText='font-size:12pt;font-weight:700;color:#ca4d25;line-height:1.1';
 content.style.cssText='display:flex;flex-direction:column;align-items:center;gap:1mm';
 content.querySelector('.h3').style.fontSize='9pt';content.querySelector('.xs').style.cssText='font-size:6.8pt;line-height:1.35;color:#5c5c5c';
 card.append(number,content);commit.append(card);
}
commit.style.setProperty('--h','2');commit.style.gridTemplateColumns='repeat(3,1fr)';commit.style.gridTemplateRows='1fr';
const divider=[...p.querySelectorAll('.g.fill')].find(e=>e.textContent.trim()==='Phòng Kinh doanh An sinh');
divider.style.setProperty('--w','12');divider.style.borderTop='.25mm solid #dedede';divider.style.borderBottom='.25mm solid #dedede';divider.style.background='#f5f5f5';
"""
        if n==6:
            js+=f"const net=p.querySelector('#hepta');net.innerHTML={json.dumps(network())};net.setAttribute('aria-label','Bốn lĩnh vực kết nối: Công nghệ, Tài chính, Bảo hiểm và An sinh, Dự án.');net.style.top='50mm';net.style.height='139mm';"
            js+="p.querySelector('h1').style.fontSize='27pt';"
            js+="p.querySelectorAll('.benefit>div:first-child').forEach(e=>{e.style.setProperty('background','#ca4d25','important');e.style.setProperty('color','#fff','important')});"
            js+="const benefitValues=p.querySelectorAll('.benefit>div:last-child');const ref=getComputedStyle(benefitValues[1]);['fontFamily','fontSize','fontWeight','lineHeight','textAlign'].forEach(k=>benefitValues[2].style[k]=ref[k]);benefitValues[2].style.setProperty('color','#ca4d25','important');"
        if n==8:
            js+="""p.querySelector('h1').style.fontSize='25pt';
const kids=[...p.querySelector('.trim').children];
kids.find(e=>e.style.top==='128mm').style.top='112mm';
const d=p.querySelector('#leaders');d.style.top='125mm';d.style.gridTemplateRows='repeat(3,45mm)';
d.querySelectorAll(':scope > div').forEach(e=>e.style.padding='5mm 4mm');
"""
        if n==7:
            js+="""p.querySelector('h1').style.fontSize='33pt';
const list=p.querySelector('.grid');list.style.borderLeft='0';list.style.borderTop='0';list.style.gap='2mm';list.style.gridTemplateRows='repeat(5,21mm)';
list.querySelectorAll(':scope>div').forEach((e,i)=>{e.style.border='0';e.style.background=i%2?'#fffefd':'#fdf1eb';e.style.padding='3mm 4mm';e.style.borderBottom='.25mm solid #e0dcd8';e.querySelector('.num').style.fontWeight='700'});
"""
        if n==9:
            js+="""p.querySelector('h1').style.fontSize='29pt';
p.querySelectorAll('div').forEach(e=>{if(e.style.height==='85mm')e.style.height='79mm'});
p.querySelectorAll('.letter').forEach(e=>e.style.height='62mm');
p.querySelectorAll('figcaption').forEach(e=>{e.style.fontSize='6.7pt';e.style.color='#3d3a38';e.style.background='#fffefd';e.style.padding='1.8mm 2mm'});
"""
        if n==10:
            js+="""p.querySelector('h1').style.fontSize='23pt';
p.querySelectorAll('.card').forEach(e=>e.style.minHeight='56mm');
p.querySelector('.closing-slogan').firstElementChild.style.fontSize='30pt';
"""
        js+="""p.querySelectorAll('*').forEach(e=>{
if(e.classList.contains('ht')||getComputedStyle(e).backgroundImage.includes('repeating-linear-gradient')){
e.style.setProperty('background','#ffffff','important');
if(!e.children.length&&!e.textContent.trim()){
if(getComputedStyle(e).position==='static')e.style.position='relative';
const square=document.createElement('span');square.setAttribute('aria-hidden','true');square.style.cssText='position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:5mm;height:5mm;background:#ca4d25;display:block';e.append(square);
}
}});
"""
        source=source.replace('</head>',f'<style>{COMMON}</style></head>')
        source=source.replace('</body>',f'<script>(()=>{{{js}}})();</script></body>')
        path.write_text(neutralize(source),encoding='utf-8')
    for filename in ['brochure-v8.html','print.html']:
        p=root/filename
        s=p.read_text(encoding='utf-8')
        for n in range(1,11):
            s=s.replace(f'src="page-{n:02}.html"',f'src="page-{n:02}.html?revision=comments3-20261106"')
        p.write_text(neutralize(s),encoding='utf-8')
