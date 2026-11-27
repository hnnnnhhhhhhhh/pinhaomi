// Shared collage recipe: homepage previews and the editor's random composition.
window.makeRandomMii=function({faceOnly=false}={}){
 const all=[...window.CAT_ASSETS,...(window.PERSONAL_ASSETS||[])];
 const pick=type=>{const pool=all.filter(a=>a.type===type);return pool[Math.floor(Math.random()*pool.length)].id};
 const part=(type,x,y,size)=>({id:pick(type),x,y,size,angle:0,flip:1});
 if(faceOnly)return [part('脑袋',.5,.55,420),part('耳朵',.28,.25,170),part('耳朵',.72,.25,170),part('眼睛',.39,.46,98),part('眼睛',.61,.46,98),part('鼻子',.5,.58,77),part('嘴巴',.5,.69,124)];
 return [part('尾巴',.7,.7,185),part('身体',.5,.68,280),part('脑袋',.5,.34,220),part('耳朵',.38,.18,108),part('耳朵',.62,.18,108),part('眼睛',.44,.33,57),part('眼睛',.56,.33,57),part('鼻子',.5,.404,43),part('嘴巴',.5,.46,73)];
};
