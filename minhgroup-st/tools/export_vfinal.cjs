// Render and validate every page, then export one PDF per page for merging.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const output = path.join(process.env.TEMP, 'codex-mtgroup-vfinal-check');
fs.mkdirSync(output, {recursive:true});
(async()=>{
  const browser = await puppeteer.launch({headless:true});
  try {
    const page = await browser.newPage();
    await page.setViewport({width:1000,height:1300,deviceScaleFactor:1});
    const report = [];
    for(let n=1;n<=10;n++){
      const number=String(n).padStart(2,'0');
      const errors=[];
      const onError=e=>errors.push(e.message);
      page.on('pageerror',onError);
      await page.goto(`http://localhost:5180/brochure-vfinal/page-${number}.html`,{waitUntil:'networkidle0'});
      await page.evaluate(()=>document.fonts.ready);
      const check=await page.evaluate(()=>{
        const root=document.querySelector('.page,.sheet');
        const box=root.getBoundingClientRect();
        const images=[...document.images].filter(img=>!img.complete||!img.naturalWidth).map(img=>img.src);
        const overflow=[];
        for(const element of root.querySelectorAll('*')){
          if(['STYLE','SCRIPT','svg','path','use','symbol','g','rect','text'].includes(element.tagName)||element.closest('svg'))continue;
          if(element.children.length||!element.textContent.trim())continue;
          const css=getComputedStyle(element);
          if(css.display==='none'||css.visibility==='hidden')continue;
          const b=element.getBoundingClientRect();
          if(!b.width||!b.height)continue;
          if(b.bottom>box.bottom+1||b.right>box.right+1||b.left<box.left-1)overflow.push(element.textContent.trim());
          if(['hidden','clip'].includes(css.overflowY)&&element.clientHeight&&element.scrollHeight>element.clientHeight+2)overflow.push('clipped: '+element.textContent.trim());
        }
        return {images,overflow,text:root.innerText,width:box.width,height:box.height};
      });
      await (await page.$('.page,.sheet')).screenshot({path:path.join(output,`page-${number}.png`)});
      await page.addStyleTag({content:'@page{size:216mm 303mm;margin:0}html,body{margin:0!important;padding:0!important;width:216mm!important;height:303mm!important}.page,.sheet{margin:0!important;break-after:auto!important;page-break-after:auto!important}'});
      await page.pdf({path:path.join(output,`page-${number}.pdf`),width:'216mm',height:'303mm',printBackground:true,preferCSSPageSize:true,displayHeaderFooter:false,margin:{top:0,right:0,bottom:0,left:0}});
      page.off('pageerror',onError);
      report.push({page:n,errors,...check});
      console.log(JSON.stringify({page:n,errors,images:check.images,overflow:check.overflow}));
    }
    fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));
    console.log('Rendered outputs: '+output);
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
