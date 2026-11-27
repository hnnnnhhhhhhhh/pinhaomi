// Alpha-only feather: photograph RGB remains untouched. Fade the crop perimeter
// as well, so a blurred contour cannot be abruptly clipped by its SVG viewport.
export function featherCropPerimeter(svg){
 const match=svg.match(/<svg\b[^>]*width="([\d.]+)"[^>]*height="([\d.]+)"[^>]*>/);
 if(!match)throw Error('Missing SVG dimensions');
 const w=Number(match[1]),h=Number(match[2]),inset=Math.min(w,h)*.085;
 const gradient=(id,length)=>`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${length}" y2="0"><stop offset="0" stop-color="white" stop-opacity="0"/><stop offset="${inset/length}" stop-color="white"/><stop offset="${1-inset/length}" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>`;
 const defs=`<defs>${gradient('cropFadeX',w)}${gradient('cropFadeY',h).replace(`x2="${h}" y2="0"`,`x2="0" y2="${h}"`)}<mask id="cropMaskX" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="url(#cropFadeX)"/></mask><mask id="cropMaskY" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="url(#cropFadeY)"/></mask></defs>`;
 return svg.replace(match[0],match[0]+defs+'<g mask="url(#cropMaskX)"><g mask="url(#cropMaskY)">').replace('</svg>','</g></g></svg>');
}
