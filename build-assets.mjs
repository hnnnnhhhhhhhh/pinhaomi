import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {featherCropPerimeter} from './feather-edges.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const specs=[
 ['orange-left','cat ears by me.jpeg',735,518,[65,90,230,345],'85,400 87,200 100,111 134,113 218,190 260,277 279,357 157,420'],
 ['orange-right','cat ears by me.jpeg',735,518,[399,90,230,355],'418,347 430,274 491,213 550,139 590,113 606,131 610,241 601,319 611,337 576,422 511,429'],
 ['gray-left','279012139410888826.jpeg',736,414,[85,125,205,260],'104,160 113,137 148,144 205,203 242,269 276,345 223,383 153,361 123,273'],
 ['gray-right','279012139410888826.jpeg',736,414,[430,125,225,270],'439,310 483,232 565,149 607,137 628,162 615,255 598,351 494,386'],
 ['pink-muzzle','Носик.jpeg',736,981,[75,165,590,550],'190,262 269,208 429,190 567,227 625,340 637,481 584,596 431,678 267,657 129,568 96,422'],
 ['gray-head','comme dans la pub_.jpeg',736,1111,[212,98,365,290],'252,136 330,107 441,109 518,151 552,231 537,309 485,358 389,377 286,353 232,292 225,216'],
 ['orange-head','686939749461056244.jpeg',600,504,[28,68,160,140],'49,83 99,80 152,95 174,129 165,170 137,192 89,198 48,171 35,127'],
 ['black-muzzle','Cat nose (1).jpeg',640,478,[45,8,560,400],'185,34 332,15 474,51 555,122 584,239 513,336 369,389 212,365 83,278 62,148'],
 ['gray-body','comme dans la pub_.jpeg',736,1111,[90,338,605,708],'282,355 449,355 548,443 596,574 606,744 563,886 647,940 677,982 609,1002 495,1000 486,1026 331,1048 183,1031 119,979 139,854 173,677 191,533'],
 ['orange-body','shutterstock_177332189.jpeg',735,660,[105,244,470,350],'179,286 315,261 436,262 508,300 552,360 561,407 539,452 514,450 499,411 490,420 480,508 512,543 501,568 462,569 429,533 399,434 313,429 257,466 242,516 274,543 270,563 226,558 196,524 170,464 160,494 154,550 137,576 111,576 120,515 120,432 132,350'],
 ['gray-tail','comme dans la pub_.jpeg',736,1111,[3,866,440,192],'17,953 53,899 113,897 167,931 225,939 317,960 396,990 431,1017 406,1042 313,1050 166,1044 61,1022 20,994'],
 ['dark-tail','Cat.jpeg',736,547,[522,48,194,219],'542,85 570,63 610,68 650,92 670,137 685,179 706,214 700,229 678,223 651,194 632,151 607,126 581,114 571,128 578,153 597,171 578,194 549,172 533,142 535,106']
];
fs.mkdirSync(path.join(root,'assets'),{recursive:true});
for(const [id,file,w,h,crop,points] of specs){const [x,y,cw,ch]=crop;const data=fs.readFileSync(path.join('/Users/hn/Downloads',file)).toString('base64');const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}"><defs><filter id="f" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${Math.max(3,Math.min(cw,ch)*.05)}"/></filter><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${cw}" height="${ch}"><polygon points="${points}" transform="translate(${-x} ${-y})" fill="white" filter="url(#f)"/></mask></defs><image x="${-x}" y="${-y}" width="${w}" height="${h}" href="data:image/jpeg;base64,${data}" mask="url(#m)"/></svg>`;fs.writeFileSync(path.join(root,'assets',id+'.svg'),svg)}
// Head bases have no fixed facial features: both eyes, nose and mouth are transparent.
const headHoles=[
 ['gray-head','<ellipse cx="128" cy="106" rx="28" ry="27" fill="black"/><ellipse cx="248" cy="106" rx="28" ry="27" fill="black"/><ellipse data-part="nose" cx="193" cy="153" rx="24" ry="23" fill="black"/><path data-part="mouth" d="M187 161 Q194 158 200 163 L202 176 Q227 174 244 190 Q225 212 193 210 Q159 211 142 191 Q159 174 185 177Z" fill="black"/>'],
 ['orange-head','<ellipse cx="59" cy="37" rx="14" ry="15" fill="black"/><ellipse cx="109" cy="42" rx="13" ry="14" fill="black"/><ellipse data-part="nose" cx="85" cy="62" rx="19" ry="16" fill="black"/><path data-part="mouth" d="M79 68 Q85 65 91 70 L92 79 Q110 78 120 88 Q110 102 81 101 Q58 100 49 89 Q61 77 77 79Z" fill="black"/>']
];
for(const [id,holes] of headHoles){const file=path.join(root,'assets',id+'.svg');let svg=fs.readFileSync(file,'utf8');svg=svg.replace('</defs>','<filter id="holeFeather"><feGaussianBlur stdDeviation="2.5"/></filter></defs>').replace('</mask>',`<g filter="url(#holeFeather)">${holes}</g></mask>`);fs.writeFileSync(file,svg)}
// Original photograph pixels only. Paths are alpha masks, never painted facial features.
const facial=[
 ['photo01-eye','961659326702321502.jpeg',736,552,[150,75,500,430],'M40 228 Q105 35 290 45 Q456 55 454 210 Q450 355 269 383 Q97 399 40 228Z'],
 ['photo02-eye-a','下载.jpeg',500,498,[0,34,175,165],'M8 65 Q22 6 82 18 Q150 23 164 112 Q135 157 66 151 Q8 137 8 65Z'],
 ['photo02-eye-b','下载.jpeg',500,498,[321,34,179,165],'M10 107 Q22 21 104 18 Q170 20 173 76 Q176 144 103 151 Q35 158 10 107Z'],
 ['photo02-nose','下载.jpeg',500,498,[151,265,178,122],'M15 15 Q85 0 154 18 L150 52 Q110 63 99 105 L78 108 Q65 69 25 56Z'],
 ['photo02-mouth','下载.jpeg',500,498,[154,365,187,85],'M12 28 Q47 12 85 19 Q124 12 170 32 Q148 66 92 69 Q39 68 12 28Z'],
 ['photo03-eye',"My cat's eye.jpeg",736,981,[70,228,590,460],'M35 121 Q181 13 357 45 Q516 80 549 208 Q554 342 409 400 Q229 439 110 348 Q43 301 35 121Z'],
 ['photo04-eye-a','kittyy.jpeg',675,1200,[148,135,285,323],'M26 211 Q18 70 128 43 Q243 29 252 124 Q242 229 110 292 Q55 292 26 211Z',-90],
 ['photo04-eye-b','kittyy.jpeg',675,1200,[174,727,309,380],'M42 139 Q43 42 130 37 Q238 35 270 142 Q298 263 227 333 Q119 345 63 235Z',-90],
 ['photo05-eye','463026405463584523.jpeg',736,981,[180,306,478,412],'M29 232 Q63 69 232 40 Q355 5 424 54 Q453 214 339 314 Q181 403 72 320Z'],
 ['photo06-eye-a','1144899536546499699.jpeg',500,327,[13,107,165,150],'M12 25 Q73 8 135 87 Q147 111 115 128 Q39 153 13 76Z'],
 ['photo06-eye-b','1144899536546499699.jpeg',500,327,[311,99,163,152],'M12 102 Q61 18 135 22 Q159 89 111 128 Q64 148 12 102Z'],
 ['photo07-eye','#cat #eyes.jpeg',736,736,[0,102,723,574],'M30 302 Q50 118 235 67 Q426 10 637 89 Q716 217 621 365 Q508 522 271 533 Q58 513 30 302Z'],
 ['photo08-eye','580331102030755245.jpeg',736,981,[168,236,495,445],'M33 259 Q47 99 208 48 Q357 11 427 112 Q453 272 335 359 Q147 430 55 353Z'],
 ['photo09-eye-a','903112531589538705.jpeg',736,1308,[302,116,380,392],'M33 188 Q44 43 173 26 Q301 23 331 176 Q333 319 192 352 Q68 367 33 188Z',-90],
 ['photo09-eye-b','903112531589538705.jpeg',736,1308,[287,823,403,403],'M37 177 Q62 40 200 35 Q333 36 355 198 Q351 336 217 362 Q57 364 37 177Z',-90],
 ['photo09-nose','903112531589538705.jpeg',736,1308,[0,481,269,327],'M9 121 Q81 104 155 24 Q244 43 239 167 Q220 276 160 298 Q92 224 12 208Z',-90],
 ['photo10-eye-a','61220876155392212.jpeg',500,353,[13,13,163,143],'M11 67 Q17 9 83 10 Q138 9 149 76 Q144 123 88 131 Q24 129 11 67Z'],
 ['photo10-eye-b','61220876155392212.jpeg',500,353,[312,13,164,143],'M12 72 Q24 10 83 10 Q141 8 151 63 Q150 128 83 130 Q23 128 12 72Z'],
 ['photo10-nose','61220876155392212.jpeg',500,353,[170,169,149,109],'M12 34 Q29 5 78 12 Q126 9 138 37 Q99 57 88 93 L70 97 Q59 58 12 34Z'],
 ['photo10-mouth','61220876155392212.jpeg',500,353,[167,275,164,64],'M10 39 Q39 15 77 12 Q123 14 153 39 Q108 57 77 43 Q40 57 10 39Z'],
 ['photo11-eye','730216527056019083.jpeg',735,490,[167,80,403,300],'M29 92 Q99 14 227 43 Q318 64 367 199 Q266 276 148 253 Q58 229 29 92Z'],
 ['photo12-nose','Cat (1).jpeg',675,1200,[260,365,400,410],'M31 210 Q169 171 223 46 Q277 11 328 53 Q375 186 348 325 Q316 396 260 359 Q185 244 31 239Z',-90],
 ['photo12-mouth','Cat (1).jpeg',675,1200,[0,264,251,580],'M16 65 Q64 17 116 60 Q173 119 216 240 Q241 341 182 455 Q133 533 71 543 Q8 489 14 372 Q33 244 10 149Z',-90],
 ['photo13-nose','969540626063686179.jpeg',736,736,[217,57,300,248],'M22 62 Q55 19 151 29 Q240 17 278 66 Q266 112 214 121 L157 224 Q118 172 94 119 Q35 114 22 62Z'],
 ['photo13-mouth','969540626063686179.jpeg',736,736,[144,294,453,335],'M23 133 Q69 55 155 39 Q212 13 270 48 Q355 65 421 146 Q424 221 345 276 Q224 319 105 276 Q23 247 23 133Z'],
 ['photo14-nose','1003880573176739734.jpeg',536,480,[141,20,257,214],'M24 68 Q60 24 130 20 Q204 20 232 69 Q215 101 167 110 L137 190 Q108 185 92 115 Q36 111 24 68Z'],
 ['photo14-mouth','1003880573176739734.jpeg',536,480,[118,213,313,132],'M21 90 Q81 37 143 22 Q182 14 218 52 Q265 63 291 99 Q233 115 169 103 Q80 118 21 90Z'],
 ['photo15-nose','下载 (1).jpeg',736,502,[231,18,272,209],'M23 77 Q48 22 138 22 Q227 20 251 77 Q228 110 187 112 Q166 172 143 188 Q113 184 94 119 Q47 116 23 77Z'],
 ['photo15-mouth','下载 (1).jpeg',736,502,[207,237,330,139],'M18 97 Q97 44 152 17 Q185 21 214 45 Q275 63 311 101 Q230 114 160 90 Q85 117 18 97Z'],
 ['photo16-nose','♥.jpeg',736,460,[212,80,305,241],'M22 58 Q48 23 148 33 Q246 20 283 64 Q259 115 208 121 Q187 188 156 217 Q114 195 99 127 Q46 111 22 58Z'],
 ['photo16-mouth','♥.jpeg',736,460,[210,343,310,91],'M15 57 Q78 23 146 23 Q224 18 293 58 Q217 76 151 58 Q83 76 15 57Z'],
 ['photo17-nose','1688918603656243.jpeg',640,1136,[0,332,640,602],'M22 182 Q34 73 157 53 Q251 49 303 68 Q388 41 497 61 Q595 72 616 186 Q598 253 528 266 Q470 294 451 397 Q417 511 332 558 Q246 536 202 439 Q172 333 165 270 Q54 288 22 182Z'],
 ['photo17-mouth','1688918603656243.jpeg',640,1136,[167,901,325,188],'M18 115 Q56 49 130 30 Q160 23 186 45 Q258 55 301 125 Q233 158 164 126 Q92 163 18 115Z']
];
for(const [id,file,w,h,[x,y,cw,ch],d,rotation] of facial){
 const data=fs.readFileSync(path.join('/Users/hn/Downloads',file)).toString('base64');
 const content=`<defs><filter id="f" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${Math.max(3,Math.min(cw,ch)*.05)}"/></filter><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${cw}" height="${ch}"><path d="${d}" fill="white" filter="url(#f)"/></mask></defs><image x="${-x}" y="${-y}" width="${w}" height="${h}" href="data:image/jpeg;base64,${data}" mask="url(#m)"/>`;
 fs.writeFileSync(path.join(root,'assets',id+'.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="${rotation?ch:cw}" height="${rotation?cw:ch}" viewBox="0 0 ${rotation?ch:cw} ${rotation?cw:ch}">${rotation?`<g transform="translate(0 ${cw}) rotate(-90)">${content}</g>`:content}</svg>`);
}
for(const [id] of [...specs,...facial]){const file=path.join(root,'assets',id+'.svg');fs.writeFileSync(file,featherCropPerimeter(fs.readFileSync(file,'utf8')))}
for(const side of ['left','right'])for(const color of ['blue','yellow'])for(const pupil of ['slit','round']){const old=path.join(root,'assets',`eye-${side}-${color}-${pupil}.svg`);if(fs.existsSync(old))fs.unlinkSync(old)}
console.log(`Built ${specs.length+facial.length} photograph-only prizes: 16 eyes, 9 noses, 8 mouths, 12 existing parts.`);
