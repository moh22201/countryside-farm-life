/* Unified economy integration for Qaryati.
   Town Star Standard Rules are the baseline; this file wires verified timing,
   sale-price references, existing worker homes and current game systems.
*/
(() => {
  const byName = name => ITEMS.findIndex(d => d[2] === name);
  const addItem = item => { if (byName(item[2]) < 0) ITEMS.push(item); };

  // Existing drawn assets that were missing from the active catalog.
  addItem([11,'منزل عامل الحيوانات','Animal Worker House','B','#c8d8b0','#6b8b45','#f2c030','c','🐄']);
  addItem([11,'منزل عامل الصناعة','Industrial Worker House','B','#b8c8d8','#526a82','#f2c030','g','🏭']);
  addItem([9,'مصنع الصناديق والطرود','Boxing Facility','Y','#c4a070','#7a8a98','#c9a46a','b','📦']);

  // Hide fishing assets without shifting ITEM indexes used by saved towns.
  ['Fishing Spot','Salmon Farm'].forEach(name => {
    const i = byName(name);
    if (i >= 0) ITEMS[i][0] = -1;
  });
  const oldFishButton = document.querySelector('#cat button[data-c="13"]');
  if (oldFishButton) oldFishButton.remove();

  Object.assign(RS, {
    brine:['crop','🧂'], sugarcane:['crop','🎋'], oakWood:['wood','🪵'], energy:['goods','⚡'], waterDrum:['goods','🛢️'], cabernetGrapes:['crop','🍇'], chardonnayGrapes:['crop','🍇'], pinotGrapes:['crop','🍇'],
    chromium:['goods','🔩'], limestone:['goods','🪨'], silica:['goods','🏖️'],
    petroleum:['fuel','🛢️'], gasoline:['fuel','⛽'], jetFuel:['fuel','✈️'],
    wineBottle:['goods','🍾'], oakBarrel:['goods','🛢️'],
    cottonYarn:['goods','🧵'], woolYarn:['goods','🧶'], uniforms:['goods','👕'],
    dough:['food','🥣'], butter:['food','🧈'], batter:['food','🥣'],
    baguette:['food','🥖'], pumpkinPie:['food','🥧'], candyCanes:['food','🍬'],
    blueSteel:['goods','🔷'], honeycomb:['goods','🍯'], wax:['goods','🕯️'],
    ceramicBowl:['goods','🏺'], foodParcel:['goods','📦'], giftParcel:['goods','🎁'],
    woodenBox:['goods','🪵'], fabricBox:['goods','🧵'], supplyBox:['goods','📦'],
    partyBox:['goods','🎁'], stackBox:['goods','📦']
  });
  Object.assign(RN, {
    brine:'محلول ملحي',sugarcane:'قصب السكر',oakWood:'خشب البلوط',energy:'طاقة',waterDrum:'برميل ماء',cabernetGrapes:'عنب كابيرنيه',chardonnayGrapes:'عنب شاردونيه',pinotGrapes:'عنب بينو نوار',chromium:'كروم',
    limestone:'حجر جيري',silica:'سيليكا',petroleum:'بترول',gasoline:'بنزين',
    jetFuel:'وقود طائرات',wineBottle:'زجاجة نبيذ',oakBarrel:'برميل بلوط',
    cottonYarn:'خيط قطني',woolYarn:'خيط صوفي',uniforms:'زي موحد',
    dough:'عجين',butter:'زبدة',batter:'خليط الكعك',baguette:'رغيف باغيت',
    pumpkinPie:'فطيرة قرع',candyCanes:'حلوى قصب',blueSteel:'فولاذ أزرق',
    honeycomb:'قرص عسل',wax:'شمع',ceramicBowl:'وعاء سيراميك',
    foodParcel:'طرد غذائي',giftParcel:'طرد هدايا',woodenBox:'صندوق خشبي',
    fabricBox:'صندوق قماشي',supplyBox:'صندوق إمدادات',partyBox:'صندوق حفلات',
    stackBox:'صندوق مركب'
  });

  RS.sugar=['goods','🍬'];
  SG.silo=SG.silo.filter(r=>r!=='sugar');
  SG.silo.push('brine','sugarcane','cabernetGrapes','chardonnayGrapes','pinotGrapes');
  SG.store.push('oakWood');
  SG.depot.push('sugar');
  SG.depot.push('chromium','limestone','silica','energy','wineBottle','oakBarrel',
    'cottonYarn','woolYarn','uniforms','blueSteel','honeycomb','wax','ceramicBowl',
    'foodParcel','giftParcel','woodenBox','fabricBox','supplyBox','partyBox','stackBox');
  SG.pantry.push('dough','butter','batter','baguette','pumpkinPie','candyCanes');
  SG.fuelst.push('petroleum','gasoline','jetFuel','waterDrum');
  if (FO['Salt Field']) FO['Salt Field'] = 'brine';
  FO['Sugarcane Field']='sugarcane';
  FO['Oak Tree Farm']='oakWood';
  FO['Cabernet Vines']='cabernetGrapes';
  FO['Chardonnay Vines']='chardonnayGrapes';
  FO['Pinot Noir Vines']='pinotGrapes';

  // Beekeeper House is a worker home, not a jam factory.
  delete RC['Beekeeper House'];
  RC['Boxing Facility'] = {in:{bread:1,jam:1,honey:1},out:'foodParcel',oc:10,t:60};

  // Verified Windmill flour batch.
  if (RC.Windmill) {
    RC.Windmill.in = {wheat:5,wood:3};
    RC.Windmill.out = 'flour';
    RC.Windmill.ic = {wheat:15,wood:9};
    RC.Windmill.oc = 50;
    RC.Windmill.t = 30;
  }

  // Agreed Qaryati battery rule: 5 before Power Plant, 1 after installation.
  ['bat','brine','sugarcane','oakWood','cabernetGrapes','chardonnayGrapes','pinotGrapes'].forEach(r=>DIRECT.add(r));
  if (RC.Bakery) RC.Bakery.in.bat=5;
  FARMN.clear();
  const syncBakeryEnergy = () => {
    const powered = objs.some(o => o.mv && o.ci >= 0 &&
      ITEMS[o.ci] && ITEMS[o.ci][2] === 'Power Plant' && o.act !== false);
    const rc = RC.Bakery;
    if (!rc) return;
    rc.in.bat = powered ? 1 : 5;
    rc.ic = Object.assign({},rc.ic||{},{bat:rc.in.bat*3});
  };
  syncBakeryEnergy();
  setInterval(syncBakeryEnergy,1000);

  // Published Town Star Standard Rules base production times.
  const FIELD_SECONDS = {
    'Wheat Field':20,'Cotton Field':20,'Sugarcane Field':20,
    'Tree Farm':20,'Oak Tree Farm':60,'Peppermint Field':240,
    'Pumpkin Patch':300,'Salt Field':475,'Cabernet Vines':420,
    'Chardonnay Vines':360,'Pinot Noir Vines':450
  };
  const PRODUCER_SECONDS = {
    'Iron Mine':30,'Sand Mine':565,'Oil Pump':180,'Wind Turbine':60,
    'Power Plant':10,'Nuclear Power':20
  };
  const PROCESS_SECONDS = {
    'Windmill':30,'Bakery':60,'Cakery':60,'Candy Shop':360,
    'Winery':300,'Fabric Plant':60,'Glass Factory':60,
    'Lumber Mill':10,'Steel Mill':90,'Refinery':30,
    'Power Plant':10,'Boxing Facility':60
  };
  Object.entries(PRODUCER_SECONDS).forEach(([n,t]) => { if (PR[n]) PR[n].t=t; });
  Object.entries(PROCESS_SECONDS).forEach(([n,t]) => { if (RC[n]) RC[n].t=t; });
  window.QARYATI_TOWNSTAR_BASELINE = {
    source:'Gala Games – The Town Star Rulebook, Standard Rules (Jan 4, 2022)',
    fields:FIELD_SECONDS,producers:PRODUCER_SECONDS,processors:PROCESS_SECONDS
  };
  const tickBase = tick;
  tick = function(o,dt) {
    if (!o || o.k === 'veh' || !o.mv) return tickBase(o,dt);
    const n = o.ci >= 0 && ITEMS[o.ci] ? ITEMS[o.ci][2] : '';
    if (o.role === 'field' && FIELD_SECONDS[n]) return tickBase(o,dt*10/FIELD_SECONDS[n]);
    if (o.role === 'prod' && PRODUCER_SECONDS[n]) {
      const base=(PR[n]&&PR[n].t)||20;
      return tickBase(o,dt*base/PRODUCER_SECONDS[n]);
    }
    if (o.role === 'proc' && PROCESS_SECONDS[n]) return tickBase(o,dt*30/PROCESS_SECONDS[n]);
    return tickBase(o,dt);
  };

  // Official per-10 sale values converted to per-unit values for the truck.
  const SALE_PER_UNIT = {
    wheat:300,wood:250,oakWood:250,cotton:350,sugarcane:400,sugar:3150,brine:300,
    mint:340,pumpkin:1000,cabernetGrapes:1820,chardonnayGrapes:810,pinotGrapes:2670,egg:1650,milk:4000,wool:4550,
    feed:340,flour:2250,salt:2550,energy:150,oil:50,petroleum:450,
    fuel:1450,gasoline:1450,jetFuel:1900,ore:4600,chromium:4600,
    limestone:4600,sand:1000,silica:1000,plank:1350,
    steel:47000,blueSteel:270950,waterDrum:50,wineBottle:12800,
    oakBarrel:5500,cottonYarn:3250,woolYarn:24250,uniforms:34450,
    bread:91300,butter:16250,dough:29150,batter:48700,cake:178050,
    candyCanes:25700,pumpkinPie:49750
  };
  window.QARYATI_SALE_PER_UNIT = SALE_PER_UNIT;
  Object.keys(SB).forEach(k=>SB[k]=10);
  Object.keys(TO).forEach(k=>TO[k]=Math.min(10,TO[k]||10));

  // Existing worker homes only; no generic houses are invented.
  Object.assign(HS,{animalHouse:1,industryHouse:1,beeHouse:1,builderHouse:1});
  PRICE['Animal Worker House']=PRICE['Worker House']||700;
  PRICE['Industrial Worker House']=PRICE['Worker House']||700;
  PRICE['Boxing Facility']=PRICE['Steel Mill']||3500;
  PR['Water Facility']={out:'waterDrum',t:30};
  PR['Nuclear Power']={out:'energy',t:20};
  const baseRoleOf = roleOf;
  roleOf = function(d) {
    const n=d&&d[2];
    const homes={
      'Farm House':'fhouse','Lumberjack House':'lhouse','Worker House':'whouse',
      'Animal Worker House':'animalHouse','Industrial Worker House':'industryHouse',
      'Beekeeper House':'beeHouse','Builder House':'builderHouse'
    };
    if(n==='Water Facility')return 'prod';
    return homes[n] || baseRoleOf(d);
  };
  spawnFor = function(o) {
    const roles={
      fhouse:'farm',lhouse:'wood',whouse:'hand',
      animalHouse:'animal',industryHouse:'industry',
      beeHouse:'bee',builderHouse:'builder'
    };
    const role=roles[o.role];
    if(!role)return;
    const p=fr(o);
    objs.push({k:'worker',role,home:o,x:p.x,y:p.y,st:'idle',tm:0,
      car:null,fx:1,mvg:0,walk:false});
  };

  // Dedicated farmer, animal worker, industrial worker and beekeeper task loops.
  const basePlan=plan;
  const reserve=key=>!CL.has(key);
  const stock=r=>objs.filter(q=>ACC[q.role]&&q.act!==false&&q.inv&&(q.inv[r]||0)>0);
  const deliverSteps=(source,res,prefix,w)=>{
    const key=prefix+oid(source);
    if(!reserve(key))return null;
    let amount=0,drop=null;
    cl(key);w.ks=[key];
    return [
      {go:()=>source.role==='field'?ct(source):ft(source)},
      {d:1.2,st:'take',fn:()=>{
        if(!(source.out>0))return false;
        amount=source.out;w.n=amount;w.car=res;source.out=0;
        if(source.role==='field'){source.st=0;source.t=0}
      }},
      {go:()=>{drop=dst(res,amount,w);return drop&&ft(drop)}},
      {d:.6,st:'drop',fn:()=>{if(drop)give(drop,res,amount);w.car=null}}
    ];
  };
  const fieldPlan=w=>{
    const ripe=nearest(objs.filter(o=>o.role==='field'&&o.st===2&&o.out>0&&reserve('c'+oid(o))),w);
    if(ripe){const steps=deliverSteps(ripe,ripe.ores,'c',w);if(steps)return steps}
    const dry=nearest(objs.filter(o=>o.role==='field'&&o.st===0&&reserve('w'+oid(o))),w);
    const water=wsrc(w);
    if(dry&&water){
      const key='w'+oid(dry);cl(key);w.ks=[key];
      return [
        {go:once(()=>wsrc(w))},{d:1.2,st:'fill',fn:()=>{w.car='bucket'}},
        {go:()=>ct(dry)},{d:1.5,st:'water',fn:()=>{if(dry.st!==0)return false;dry.st=1;dry.t=0;w.car=null}}
      ];
    }
    return null;
  };
  const animalPlan=w=>{
    const ready=nearest(objs.filter(o=>o.role==='pen'&&o.out>0&&reserve('c'+oid(o))),w);
    if(ready){const steps=deliverSteps(ready,ready.ores,'c',w);if(steps)return steps}
    const hungry=nearest(objs.filter(o=>o.role==='pen'&&o.nf>0&&reserve('f'+oid(o))),w);
    const feedStore=nearest(stock('feed').concat(stock('corn')),hungry||w);
    if(hungry&&feedStore){
      const key='f'+oid(hungry);cl(key);w.ks=[key];let qty=0;
      const kind=feedStore.inv.feed>0?'feed':'corn';
      return [
        {go:()=>ft(feedStore)},{d:.8,st:'take',fn:()=>{qty=Math.min(feedStore.inv[kind]||0,hungry.nf);if(qty<1)return false;feedStore.inv[kind]-=qty;w.n=qty;w.car='feed'}},
        {go:()=>ft(hungry)},{d:1.5,st:'feed',fn:()=>{hungry.nf=Math.max(0,hungry.nf-qty);w.car=null;penDone(hungry)}}
      ];
    }
    const thirsty=nearest(objs.filter(o=>o.role==='pen'&&o.nw&&reserve('p'+oid(o))),w);
    const water=wsrc(w);
    if(thirsty&&water){
      const key='p'+oid(thirsty);cl(key);w.ks=[key];
      return [
        {go:once(()=>wsrc(w))},{d:1.2,st:'fill',fn:()=>{w.car='bucket'}},
        {go:()=>ft(thirsty)},{d:1.5,st:'water',fn:()=>{thirsty.nw=0;w.car=null;penDone(thirsty)}}
      ];
    }
    return null;
  };
  const beePlan=w=>{
    const hive=nearest(objs.filter(o=>o.role==='prod'&&ITEMS[o.ci]&&
      ITEMS[o.ci][2]==='Beehive'&&o.out>0&&reserve('b'+oid(o))),w);
    if(hive){const steps=deliverSteps(hive,'honey','b',w);if(steps)return steps}
    return null;
  };
  const generalPlan=w=>{
    const full=nearest(objs.filter(o=>['silo','store','depot','pantry','fuelst'].includes(o.role)&&
      o.inv&&o.cap&&tot(o)>=o.cap*.8&&reserve('t'+oid(o))),w);
    const wh=full&&nearest(objs.filter(o=>o.role==='wh'&&o.inv&&tot(o)<o.cap),full);
    if(!full||!wh)return null;
    const item=Object.keys(full.inv).find(k=>full.inv[k]>0);
    if(!item)return null;
    const key='t'+oid(full);cl(key);w.ks=[key];let qty=0;
    return [
      {go:()=>ft(full)},{d:1,st:'take',fn:()=>{qty=Math.min(10,full.inv[item],wh.cap-tot(wh));if(qty<1)return false;full.inv[item]-=qty;w.n=qty;w.car=item}},
      {go:()=>ft(wh)},{d:.8,st:'drop',fn:()=>{give(wh,item,qty);w.car=null}}
    ];
  };
  plan=function(w){
    if(w.role==='farm')return fieldPlan(w);
    if(w.role==='animal')return animalPlan(w);
    if(w.role==='bee')return beePlan(w);
    if(w.role==='industry'){
      const role=w.role;w.role='hand';
      const result=basePlan(w);
      w.role=role;return result;
    }
    if(w.role==='hand')return generalPlan(w);
    return null;
  };

  // The balance remains usable in-game; withdrawals and financial rewards are suspended.
  rWallet=function(){
    return '<div class="wal"><small>رصيد اللعبة</small><div class="big">💰 '+Math.floor(money).toLocaleString()+
      '</div><small>رصيد داخلي للبناء والتشغيل والتجارة</small></div><p>لا توجد حالياً عمليات سحب أو مكافآت مالية. يُؤجّل ذلك إلى حين إطلاق نظام بيع الأصول داخل اللعبة مقابل أموال حقيقية.</p>';
  };
  rProf=function(){
    const n=objs.filter(o=>o.mv).length;
    return '<div class="bigav">'+(UP.av?'<img src="'+UP.av+'">':'🧑‍🌾')+'</div>'+
      '<div style="text-align:center;margin-bottom:10px"><label class="btn gray" style="display:inline-block">📷 تغيير الصورة<input id="pf" type="file" accept="image/*" hidden></label></div>'+
      '<div class="row"><input id="pnm" type="text" maxlength="20" value="'+UP.name+'" placeholder="اسم اللاعب"></div>'+
      kv('المنشآت',n)+kv('العمال',objs.filter(o=>o.k==='worker').length)+
      kv('الشاحنات',objs.filter(o=>o.role==='truck').length)+
      kv('إجمالي المبيعات',(UP.sold||0).toLocaleString()+'$')+kv('مساحة الأرض',W*H+' مربع');
  };

  let selectedSaleItem=null;
  rTruck=function(){
    const st=whStock();
    const keys=Object.keys(st).filter(k=>st[k]>0);
    if(!keys.includes(selectedSaleItem))selectedSaleItem=keys[0]||null;
    Object.keys(TO).forEach(k=>delete TO[k]);
    if(selectedSaleItem)TO[selectedSaleItem]=10;
    const rows=keys.map(k=>{
      const chosen=k===selectedSaleItem;
      return '<div class="row" style="border:'+(chosen?'2px solid #4caf50':'1px solid transparent')+'">'+
        '<span style="font-size:24px">'+RS[k][1]+'</span><div style="flex:1"><b>'+
        (RN[k]||k)+'</b><div style="font-size:11px;opacity:.75">المخزون '+st[k]+
        ' · سعر 10 وحدات '+(price(k)*10).toLocaleString()+'$</div></div>'+
        '<button class="btn '+(chosen?'':'gray')+'" data-a="saleSelect" data-k="'+k+'">'+
        (chosen?'محدد':'اختيار')+'</button></div>';
    }).join('')||'<p style="opacity:.7">لا توجد منتجات في المستودع العام.</p>';
    const enough=selectedSaleItem&&st[selectedSaleItem]>=10;
    return '<div class="row"><span style="font-size:28px">🚚</span><div style="flex:1">الشاحنة: '+
      objs.filter(o=>o.k==='veh'&&o.role==='truck').length+
      ' · الوقود '+fuelHave()+' برميل · كل رحلة تستهلك 10 براميل</div></div>'+
      rows+'<div class="row"><div style="flex:1">الكمية الثابتة: 10 وحدات'+
      (selectedSaleItem ? ' · الإيراد المتوقع ' + (price(selectedSaleItem)*10).toLocaleString() + String.fromCharCode(36) : '') +
      '</div><button class="btn" data-a="send" '+(enough?'':'disabled')+'>إرسال للبيع</button></div>';
  };
  window.QARYATI_SELECT_SALE=k=>{selectedSaleItem=k};
  sendTruck=function(){
    const tr=objs.find(o=>o.k==='veh'&&o.role==='truck'&&o.st==='idle'&&!o.away&&!o.order);
    if(!tr)return toast('لا توجد شاحنة بيع متاحة');
    const st=whStock(),r=selectedSaleItem;
    if(!r||!TO[r])return toast('اختر منتجاً للبيع أولاً');
    if((st[r]||0)<10)return toast('يلزم توفر 10 وحدات من المنتج المختار');
    const have=fuelHave();
    if(have<10)return toast('الوقود غير كافٍ: الرحلة تحتاج 10 براميل (المتوفر '+have+')');
    const tx=Math.floor(tr.x),ty=Math.floor(tr.y);
    if(!asph(tx,ty)||!bfs(tx,ty,brd))return toast('الشاحنة تحتاج طريقاً أسفلتياً يصل إلى حافة المدينة');
    let need=10;
    objs.filter(o=>o.role==='fuelst'&&o.inv&&(o.inv.fuel||0)>0).forEach(o=>{
      if(need<=0)return;const n=Math.min(need,o.inv.fuel);o.inv.fuel-=n;need-=n;
    });
    tr.order=[{r,n:10}];
    toast('🚚 انطلقت الشاحنة: '+RS[r][1]+' 10 وحدات (−10 ⛽)');
  };
  window.QARYATI_ECONOMY_VERSION='unified-townstar-baseline-1';
})();
