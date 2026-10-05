/* ==========================================================
   DEFINITIVE ADDON
   NPC talk + mini map + district accent
========================================================== */

const NPC_DIALOGUE = {
  office:["まだ灯りが消えないビルが多いですね。","この雨、钱江新城のネオンが一番きれいに映るんです。"],
  student:["夜の杭州は、歩いているだけでも面白いですよ。","武林夜市まで行くなら、路地も覗いてみて。"],
  delivery:["外卖です。雨の日は少し忙しいですね。","この先の路地、スクーターが多いので気をつけて。"],
  shopkeeper:["欢迎光临。夜はまだ長いですよ。","杭州らしいものなら、もう少し奥も見ていって。"],
  security:["夜間巡回中です。","建物の入口付近は足元に気をつけてください。"],
  elder:["昔の杭州は、今よりずっと暗い街でしたよ。","西湖は夜更けになると、また別の顔になります。"],
  street:["雨上がりの杭州も悪くないでしょう。","この辺は表通りより裏道の方が面白いですよ。"]
};

let dialogueState={active:false,text:"",timer:0};

function nearestTalkNPC(){
  if(scene!=="city") return null;
  let best=null,bestD=74;
  for(const npc of NPCS){const d=dist(player.x,player.y,npc.x,npc.y);if(d<bestD){best=npc;bestD=d;}}
  return best;
}

const _updateInteraction=updateInteraction;
updateInteraction=function(){
  _updateInteraction();
  if(scene!=="city" || interactionTarget) return;
  const npc=nearestTalkNPC();
  if(npc){interactionTarget={type:"npc",npc};interactionBox.classList.remove("hidden");interactionText.textContent="話す";}
};

const _interact=interact;
interact=function(){
  if(interactionTarget?.type==="npc"){
    const npc=interactionTarget.npc;
    const lines=NPC_DIALOGUE[npc.type]||NPC_DIALOGUE.street;
    dialogueState.active=true;dialogueState.text=lines[Math.floor(Math.random()*lines.length)];dialogueState.timer=5;
    return;
  }
  _interact();
};

const _update=update;
update=function(dt){_update(dt);if(dialogueState.timer>0){dialogueState.timer-=dt;if(dialogueState.timer<=0)dialogueState.active=false;}};

function drawMiniMap(){
  if(scene!=="city") return;
  const mw=154,mh=128,x=W-mw-24,y=24;
  ctx.save();ctx.fillStyle="rgba(3,8,13,.78)";roundedRect(x,y,mw,mh,8);ctx.fill();
  ctx.strokeStyle="rgba(91,225,245,.18)";ctx.stroke();
  const sx=(mw-20)/WORLD.width, sy=(mh-35)/WORLD.height;
  ctx.fillStyle="rgba(130,155,165,.20)";
  for(const b of BUILDINGS) ctx.fillRect(x+10+b.x*sx,y+25+b.y*sy,Math.max(2,b.w*sx),Math.max(2,b.h*sy));
  ctx.fillStyle="#5beaff";ctx.beginPath();ctx.arc(x+10+player.x*sx,y+25+player.y*sy,3,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="rgba(230,245,248,.75)";ctx.font="10px sans-serif";ctx.fillText(currentMap.name,x+10,y+15);ctx.restore();
}

function drawDialogue(){
  if(!dialogueState.active) return;
  const bw=Math.min(620,W-60),bh=92,x=(W-bw)/2,y=H-155;
  ctx.save();ctx.fillStyle="rgba(3,8,12,.94)";roundedRect(x,y,bw,bh,8);ctx.fill();
  ctx.strokeStyle="rgba(90,229,248,.30)";ctx.stroke();
  ctx.fillStyle="#62e9ff";ctx.font="700 11px sans-serif";ctx.fillText("杭州の人",x+22,y+26);
  ctx.fillStyle="#eef7f7";ctx.font="14px sans-serif";ctx.fillText(dialogueState.text,x+22,y+58);ctx.restore();
}

const _draw=draw;
draw=function(){_draw();drawMiniMap();drawDialogue();};
