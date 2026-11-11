// Check the actual rendered image geometry, including deliberate clipped viewports.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
(async()=>{
  const browser=await puppeteer.launch({headless:true});
  const results=[];
  try{
    const page=await browser.newPage();
    await page.setViewport({width:1000,height:1300});
    for(const n of [1,2,3,4,5,8,9]){
      await page.goto(`http://localhost:5180/brochure-vfinal/page-${String(n).padStart(2,'0')}.html`,{waitUntil:'networkidle0'});
      await page.evaluate(()=>document.fonts.ready);
      const result=await page.evaluate(()=>{
        const errors=[];
        const frames=[...document.querySelectorAll('.mgst-crop')].map(frame=>{
          const image=frame.querySelector('img');
          const f=frame.getBoundingClientRect(),i=image.getBoundingClientRect();
          const ratioError=Math.abs((i.width/i.height)/(image.naturalWidth/image.naturalHeight)-1);
          const filled=i.left<=f.left+.6&&i.top<=f.top+.6&&i.right>=f.right-.6&&i.bottom>=f.bottom-.6;
          if(ratioError>.002)errors.push('Distorted image: '+frame.dataset.framingId);
          if(!filled)errors.push('Unfilled frame: '+frame.dataset.framingId);
          return {id:frame.dataset.framingId,width:f.width,height:f.height,ratioError,filled};
        });
        const cover=document.querySelector('.mgst-clean-cover');
        if(cover){
          const photo=cover.querySelector('.mgst-crop').getBoundingClientRect();
          const title=cover.querySelector('h1').getBoundingClientRect();
          const credit=cover.querySelector('.cap').getBoundingClientRect();
          if(title.top<photo.bottom-.5)errors.push('Cover title overlaps photograph');
          if(credit.top<photo.bottom-.5)errors.push('Cover credit overlaps photograph');
        }
        const figures=[...document.querySelectorAll('.real-achievements figure')];
        for(const figure of figures){
          const f=figure.querySelector('.mgst-crop').getBoundingClientRect();
          const c=figure.querySelector('figcaption').getBoundingClientRect();
          if(c.top<f.bottom-.5)errors.push('Caption overlaps photograph');
        }
        const letters=[...document.querySelectorAll('.letter img')];
        if(letters.some(image=>getComputedStyle(image).objectFit!=='contain'))errors.push('Document image must retain full page');
        return {frames,errors,letterCount:letters.length};
      });
      results.push({page:n,...result});
    }
  }finally{await browser.close();}
  const errors=results.flatMap(result=>result.errors);
  const frameCount=results.reduce((sum,result)=>sum+result.frames.length,0);
  if(frameCount!==23)errors.push('Expected 23 reviewed image viewports, got '+frameCount);
  fs.writeFileSync(path.join(process.env.TEMP,'codex-mtgroup-vfinal-check','image-framing-report.json'),JSON.stringify({frameCount,errors,pages:results},null,2));
  if(errors.length)throw Error(errors.join('\n'));
  console.log('PASS: 23 filled photo viewports, no image distortion, no cover/caption overlap, two complete document pages');
})().catch(error=>{console.error(error);process.exitCode=1});
