import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {featherCropPerimeter} from './feather-edges.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)),out=path.join(root,'assets');
// Every shape is an alpha mask over the supplied photo. No feature is painted.
// Ellipses: [cx,cy,rx,ry]; ears use a polygon in source coordinates.
const faces=[
 {key:'silver-grumpy',file:'IMG_5388.jpg',w:1022,h:1089,name:'银虎斑·不高兴',eyes:[[352,662,122,66],[718,638,123,72]],nose:[550,815,89,67],mouth:[548,933,126,49],ears:['10,220 108,256 268,369 195,492 95,449 28,331','732,313 873,164 997,88 1007,191 944,414 842,461']},
 {key:'silver-calm',file:'IMG_5392.jpg',w:1206,h:1351,name:'银虎斑·乖巧',eyes:[[449,718,104,74],[777,678,109,87]],nose:[637,876,75,51],mouth:[638,982,129,43],ears:['116,245 171,225 355,346 373,521 242,520 167,396','740,346 844,198 990,120 1021,183 1008,407 897,500']},
 {key:'silver-round',file:'IMG_5393.jpg',w:1144,h:1127,name:'银虎斑·震惊',eyes:[[363,478,84,83],[669,399,89,87]],nose:[511,503,78,62],mouth:[543,621,130,58],ears:['152,289 191,281 318,343 320,420 246,472 186,417','686,269 760,144 815,112 851,202 852,344 780,363']},
 {key:'gold-squint',file:'IMG_5384.jpg',w:678,h:635,name:'金虎斑·眯眼',eyes:[[298,399,73,47],[459,411,58,40]],nose:[379,491,54,37],mouth:[387,548,62,30],ears:['105,92 176,113 291,153 307,243 220,262 149,189','437,201 522,171 637,162 557,228 511,269 461,262']},
 {key:'white-hat',file:'IMG_3153.JPG',w:2136,h:3443,name:'奶牛猫·绿帽',eyes:[[610,1241,166,92],[1236,1175,166,107]],nose:[902,1504,162,115],mouth:[923,1682,180,72],ears:[]},
 {key:'tabby-sleepy',file:'IMG_2901.JPG',w:1080,h:1920,name:'狸花白·困困',eyes:[[353,747,78,60],[674,855,91,39]],nose:[445,1008,91,61],mouth:[449,1102,111,44],ears:['263,449 283,272 322,200 384,312 440,483 384,561']},
 {key:'tabby-window',file:'IMG_2682.JPG',w:2529,h:2335,name:'狸花白·窗边',eyes:[[1057,1102,91,76],[1370,1128,94,76]],nose:[1160,1287,90,60],mouth:[1191,1396,138,49],ears:['859,585 968,630 1113,757 1051,921 929,925 878,766','1435,797 1575,665 1645,645 1708,734 1713,925 1619,1000']},
 {key:'tabby-proud',file:'IMG_2611.JPG',w:914,h:719,name:'狸花白·抬头',eyes:[[442,222,62,37],[605,190,47,39]],nose:[568,267,47,36],mouth:[581,334,63,30],ears:['246,66 285,61 378,125 359,217 290,254 258,181','547,120 583,35 631,9 650,43 649,133 609,155']},
 {key:'tabby-smile',file:'cat-3018.jpg',converted:true,w:1400,h:1050,name:'狸花白·笑眯眯',eyes:[[467,532,111,61],[850,527,106,59]],nose:[633,694,67,47],mouth:[633,758,103,38],ears:['255,105 304,159 456,242 451,370 320,362 287,243','827,289 941,216 1035,165 970,243 948,327 868,374']},
 {key:'tabby-flat',file:'cat-2453.jpg',converted:true,w:1050,h:1400,name:'狸花白·淡定',eyes:[[390,703,91,53],[649,707,93,54]],nose:[521,867,59,44],mouth:[523,950,91,39],ears:['125,314 166,304 296,393 325,511 243,592 170,528 132,417','716,444 837,344 884,332 908,386 891,519 832,608 753,589']},
 {key:'cow-hat',file:'cat-3126.jpg',converted:true,w:1400,h:1050,name:'奶牛猫·魔法帽',eyes:[[707,583,65,52],[914,598,63,52]],nose:[807,723,53,39],mouth:[811,797,83,33],ears:[]}
];
const catalog=[];
function writeCut(id,name,type,file,w,h,shape){
 const data=fs.readFileSync(file).toString('base64');let x,y,cw,ch,mask;
 if(Array.isArray(shape)){const[cx,cy,rx,ry]=shape,pad=Math.max(5,Math.min(rx,ry)*.32);x=Math.max(0,cx-rx-pad);y=Math.max(0,cy-ry-pad);cw=Math.min(w-x,2*(rx+pad));ch=Math.min(h-y,2*(ry+pad));mask=`<ellipse cx="${cx-x}" cy="${cy-y}" rx="${rx}" ry="${ry}"/>`}
 else{const pts=shape.split(' ').map(v=>v.split(',').map(Number));x=Math.max(0,Math.min(...pts.map(p=>p[0]))-8);y=Math.max(0,Math.min(...pts.map(p=>p[1]))-8);cw=Math.min(w-x,Math.max(...pts.map(p=>p[0]))-x+8);ch=Math.min(h-y,Math.max(...pts.map(p=>p[1]))-y+8);mask=`<polygon points="${shape}" transform="translate(${-x} ${-y})"/>`}
 const feather=Math.max(3,Math.min(cw,ch)*.05);
 fs.writeFileSync(path.join(out,id+'.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}"><defs><filter id="f" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${feather}"/></filter><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${cw}" height="${ch}"><g fill="white" filter="url(#f)">${mask}</g></mask></defs><image x="${-x}" y="${-y}" width="${w}" height="${h}" href="data:image/jpeg;base64,${data}" mask="url(#m)"/></svg>`);
 const target=path.join(out,id+'.svg');fs.writeFileSync(target,featherCropPerimeter(fs.readFileSync(target,'utf8')));
 catalog.push({id,name,type,url:`assets/${id}.svg`});
}
for(const f of faces){const file=f.converted?path.join(root,'source-photos',f.file):path.join('/Users/hn/Downloads',f.file);f.eyes.forEach((s,i)=>writeCut(`personal-${f.key}-eye-${i}`,`${f.name}·眼${i+1}`,'眼睛',file,f.w,f.h,s));f.ears.forEach((s,i)=>writeCut(`personal-${f.key}-ear-${i}`,`${f.name}·耳${i+1}`,'耳朵',file,f.w,f.h,s));writeCut(`personal-${f.key}-nose`,`${f.name}·鼻子`,'鼻子',file,f.w,f.h,f.nose);writeCut(`personal-${f.key}-mouth`,`${f.name}·嘴巴`,'嘴巴',file,f.w,f.h,f.mouth)}
writeCut('personal-balls','猫咪蛋蛋','蛋蛋','/Users/hn/Downloads/IMG_5391.jpg',832,711,[450,278,112,104]);
fs.writeFileSync(path.join(root,'personal-data.js'),'window.PERSONAL_ASSETS='+JSON.stringify(catalog,null,2)+';\n');
console.log(`Added ${catalog.length} personal photo cutouts from 12 unique photos; duplicate JPEG copies omitted.`);
// Photograph-filled graphic swatches for the cover.
for(const[id,file,w,h,crop]of [['fur-orange','shutterstock_177332189.jpeg',735,660,[240,282,220,180]],['fur-gray','comme dans la pub_.jpeg',736,1111,[235,435,270,260]],['fur-white','♥.jpeg',736,460,[25,25,170,170]]]){const[x,y,cw,ch]=crop;const b64=fs.readFileSync(path.join('/Users/hn/Downloads',file)).toString('base64');fs.writeFileSync(path.join(out,id+'.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}"><image x="${-x}" y="${-y}" width="${w}" height="${h}" href="data:image/jpeg;base64,${b64}"/></svg>`)}
