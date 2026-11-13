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
    blueSteel:['goods','🔷'], cabernetSauvignon:['food','🍷'], chardonnay:['food','🥂'], pinotNoir:['food','🍷'], candy:['food','🍬'], honeycomb:['goods','🍯'], wax:['goods','🕯️'],
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
    pumpkinPie:'فطيرة قرع',candyCanes:'حلوى قصب',candy:'حلوى قصب',cabernetSauvignon:'نبيذ كابيرنيه',chardonnay:'نبيذ شاردونيه',pinotNoir:'نبيذ بينو نوار',blueSteel:'فولاذ أزرق',
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
    candy:25700,candyCanes:25700,cabernetSauvignon:42000,chardonnay:27950,pinotNoir:57200,pumpkinPie:49750
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
  const baseLoad = load;
  load = function(){
    baseLoad();
    for(let i=objs.length-1;i>=0;i--){
      const o=objs[i];
      if(o.k==='cat'&&o.ci>=0&&ITEMS[o.ci]&&ITEMS[o.ci][0]===-1){occ(o,0);objs.splice(i,1)}
    }
  };
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

  // ===== Per-facility multi-recipe production engine =====
  Object.assign(RS, {
    sugar:['goods','🍬'], salt:['goods','🧂'], lumber:['goods','🪵'],
    baguette:['food','🥖'], cabernetSauvignon:['food','🍷'],
    chardonnay:['food','🥂'], pinotNoir:['food','🍷']
  });
  Object.assign(RN, {
    sugar:'سكر',salt:'ملح',lumber:'خشب منشور',baguette:'رغيف باغيت',
    cabernetSauvignon:'نبيذ كابيرنيه',chardonnay:'نبيذ شاردونيه',
    pinotNoir:'نبيذ بينو نوار'
  });
  SG.depot.push('sugar','salt','lumber','cottonYarn','woolYarn','uniforms');
  SG.pantry.push('baguette','dough','butter','batter','cake','pumpkinPie','candyCanes','choco');
  Object.assign(SALE_PER_UNIT,{
    sugar:3150,salt:2550,lumber:1350,baguette:91300,dough:29150,
    butter:16250,batter:48700,cake:178050,pumpkinPie:49750,
    candyCanes:25700,choco:6650,cottonYarn:3250,woolYarn:24250,
    uniforms:34450
  });

  const QARYATI_RECIPES = {
    'Windmill':[
      {id:'flour',label:'الدقيق',in:{wheat:5,wood:3},out:'flour',time:30},
      {id:'sugar',label:'السكر',in:{sugarcane:6,wood:3},out:'sugar',time:30},
      {id:'salt',label:'الملح',in:{brine:6,wood:3},out:'salt',time:30}
    ],
    'Bakery':[
      {id:'butter',label:'الزبدة',in:{milk:2,salt:2,sugar:1},out:'butter',time:30},
      {id:'dough',label:'العجين',in:{flour:5,egg:1,butter:1},out:'dough',time:30},
      {id:'baguette',label:'الباغيت',in:{dough:2,butter:2,wood:2},out:'baguette',time:60}
    ],
    'Cakery':[
      {id:'batter',label:'خليط الكعك',in:{flour:5,egg:3,butter:2},out:'batter',time:30},
      {id:'cake',label:'الكعكة',in:{batter:3,sugar:6,energy:3},out:'cake',time:60},
      {id:'pumpkinPie',label:'فطيرة القرع',in:{pumpkin:1,sugar:5,egg:10},out:'pumpkinPie',time:180}
    ],
    'Candy Shop':[
      {id:'candyCanes',label:'حلوى قصب',in:{sugar:6,mint:4,energy:10},out:'candyCanes',time:360}
    ],
    'Chocolate Shop':[
      {id:'choco',label:'ألواح الشوكولاتة',in:{cocoa:3,sugar:2,milk:1},out:'choco',time:90}
    ],
    'Lumber Mill':[
      {id:'lumber',label:'الخشب المنشور',in:{wood:2},out:'lumber',time:10}
    ],
    'Fabric Plant':[
      {id:'cottonYarn',label:'خيط قطني',in:{cotton:5,lumber:1,energy:1},out:'cottonYarn',time:60},
      {id:'woolYarn',label:'خيط صوفي',in:{wool:5,lumber:1,energy:1},out:'woolYarn',time:60},
      {id:'uniforms',label:'الأزياء الموحدة',in:{cottonYarn:3,woolYarn:1,lumber:1},out:'uniforms',time:60}
    ],
    'Refinery':[
      {id:'petroleum',label:'البترول المكرر',in:{oil:2,energy:2,waterDrum:1},out:'petroleum',time:30},
      {id:'gasoline',label:'البنزين',in:{petroleum:1,energy:6,waterDrum:2},out:'gasoline',time:30}
    ],
    'Boxing Facility':[
      {id:'foodParcel',label:'الطرد الغذائي',in:{baguette:3,jam:2,honey:1},out:'foodParcel',time:30}
    ]
  };
  window.QARYATI_RECIPES = QARYATI_RECIPES;

  // Keep the agreed battery requirement on every Bakery cycle.
  const qBakeryBattery = () => RC.Bakery && RC.Bakery.in ? (RC.Bakery.in.bat || 5) : 5;
  const qRecipe = (name,id) => {
    const list=QARYATI_RECIPES[name]||[];
    return list.find(r=>r.id===id)||list[0]||null;
  };
  const qCoreRecipe = (name,recipe) => {
    const inputs=Object.assign({},recipe.in);
    if(name==='Bakery')inputs.bat=qBakeryBattery();
    return {in:inputs,out:recipe.out,oc:10,t:recipe.time};
  };
  const qBaseTick = tick;
  tick = function(o,dt) {
    if(o && o.role==='proc' && o.mv) {
      const name=o.ci>=0&&ITEMS[o.ci]?ITEMS[o.ci][2]:'';
      const list=QARYATI_RECIPES[name];
      if(list && list.length) {
        const wasRunning=!!o.run;
        const recipe= qRecipe(name,wasRunning?(o.activeRecipeId||o.recipeId):o.recipeId);
        if(recipe) {
          const old=RC[name];
          RC[name]=qCoreRecipe(name,recipe);
          const standard=PROCESS_SECONDS[name]||30;
          let result;
          try {
            result=qBaseTick(o,dt*standard/recipe.time);
            if(!wasRunning && o.run) o.activeRecipeId=recipe.id;
            if(wasRunning && !o.run) delete o.activeRecipeId;
          } finally {
            RC[name]=old;
          }
          return result;
        }
      }
    }
    return qBaseTick(o,dt);
  };

  // Industrial workers now service each factory's own selected recipe.
  const qOldPlan=plan;
  const qIndustryPlan = w => {
    const ready=nearest(objs.filter(o=>(o.role==='proc'||o.role==='prod')&&o.out>0&&
      o.ores&&reserve('c'+oid(o))),w);
    if(ready) {
      const steps=deliverSteps(ready,ready.ores,'c',w);
      if(steps)return steps;
    }
    const candidates=[];
    objs.filter(p=>p.role==='proc'&&p.mv&&p.inv&&p.act!==false).forEach(p=>{
      const name=ITEMS[p.ci]&&ITEMS[p.ci][2];
      const recipe=qRecipe(name,p.recipeId);
      if(!recipe)return;
      Object.entries(recipe.in).forEach(([resource,required])=>{
        const target=required*3;
        const missing=target-(p.inv[resource]||0);
        const key='d'+oid(p)+resource;
        if(missing<=0||CL.has(key))return;
        const source=nearest(stock(resource),p);
        if(source)candidates.push({p,x:p.x,y:p.y,resource,source,amount:Math.min(6,missing,source.inv[resource]||0),key});
      });
    });
    const job=nearest(candidates,w);
    if(job&&job.amount>0) {
      cl(job.key);w.ks=[job.key];let amount=0;
      return [
        {go:()=>ft(job.source)},
        {d:.8,st:'take',fn:()=>{
          amount=Math.min(job.amount,job.source.inv[job.resource]||0);
          if(amount<1)return false;
          job.source.inv[job.resource]-=amount;w.n=amount;w.car=job.resource;
        }},
        {go:()=>ft(job.p)},
        {d:.8,st:'drop',fn:()=>{
          job.p.inv[job.resource]=(job.p.inv[job.resource]||0)+amount;
          w.car=null;
        }}
      ];
    }
    return generalPlan(w);
  };
  plan = function(w) {
    if(w.role==='industry')return qIndustryPlan(w);
    return qOldPlan(w);
  };

  // Per-building recipe selector in the facility details panel.
  const qBaseRDet=rDet;
  rDet=function(o) {
    if(!o||o.role!=='proc')return qBaseRDet(o);
    const name=ITEMS[o.ci]&&ITEMS[o.ci][2];
    const list=QARYATI_RECIPES[name];
    if(!list||!list.length)return qBaseRDet(o);
    const selected=qRecipe(name,o.recipeId);
    const old=RC[name];
    if(selected)RC[name]=qCoreRecipe(name,selected);
    let html=qBaseRDet(o);
    RC[name]=old;
    const buttons=list.map(r=>{
      const active=selected&&r.id===selected.id;
      const inputs=Object.entries(r.in).map(([k,v])=>v+' '+(RN[k]||k)).join(' + ');
      return '<button class="btn '+(active?'':'gray')+'" data-a="recipe" data-r="'+r.id+'" '+
        (o.run?'disabled':'')+' style="margin:3px;white-space:normal;height:auto;line-height:1.35;padding:8px">'+
        (active?'✓ ':'')+r.label+'<div style="font-size:10px;font-weight:400;margin-top:3px">'+
        inputs+' → '+(RN[r.out]||r.out)+' · '+r.time+'ث</div></button>';
    }).join('');
    html += '<div style="margin-top:12px;padding-top:10px;border-top:1px solid #9996">'+
      '<b>اختيار وصفة هذه المنشأة</b><div style="font-size:11px;opacity:.75;margin:5px 0">'+
      (o.run?'المنشأة تنفذ وصفة حالياً؛ انتظر اكتمال الدورة قبل تغييرها.':
      'اختيار الوصفة مستقل لكل منشأة، وتُحفظ مع تقدمك.')+'</div><div style="display:flex;flex-wrap:wrap;gap:4px">'+buttons+'</div></div>';
    return html;
  };
  const qOldRFact=rFact;
  rFact=function(){
    const rows=Object.keys(RC).map(name=>{
      const i=ITEMS.findIndex(d=>d[2]===name);
      if(i<0)return '';
      const buildings=objs.filter(o=>o.k==='cat'&&o.ci===i);
      const recipes=QARYATI_RECIPES[name]||[];
      const recipeNames=recipes.length?recipes.map(r=>r.label+' ('+r.time+'ث)').join(' · '):
        ((RN[RC[name].out]||RC[name].out||'')+' · '+(RC[name].t||30)+'ث');
      const active=buildings.filter(o=>o.run).length;
      return '<div class="row"><img src="'+icon(i)+'" style="width:58px"><div style="flex:1">'+
        '<b>'+dSafe(ITEMS[i][1])+'</b><div style="font-size:11px">'+recipeNames+'</div>'+
        '<div style="font-size:11px;opacity:.7">المنشآت: '+buildings.length+' · دورات جارية: '+active+'</div></div>'+
        '<button class="btn" data-a="pick" data-i="'+i+'">بناء</button></div>';
    }).join('');
    return rows;
  };
  function dSafe(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  const qOldSheetClick=$('sb').onclick;
  $('sb').onclick=function(e){
    const b=e.target.closest('[data-a="recipe"]');
    if(b) {
      if(!detObj||detObj.run){toast('انتظر اكتمال دورة الإنتاج قبل تغيير الوصفة');return;}
      detObj.recipeId=b.dataset.r;
      save();
      toast('تم اختيار وصفة '+(qRecipe(ITEMS[detObj.ci][2],detObj.recipeId).label)+' لهذه المنشأة');
      render();
      return;
    }
    return qOldSheetClick.call(this,e);
  };

  // Correct Food Parcel recipe and keep it in the Boxing Facility.
  RC['Boxing Facility']={in:{baguette:3,jam:2,honey:1},out:'foodParcel',oc:10,t:30};
  PROCESS_SECONDS['Chocolate Shop']=90;
  PROCESS_SECONDS['Boxing Facility']=30;

  // ===== Mineral production + steel recipes =====
  // Standard Rulebook confirms the base timers; recipe quantities below are
  // explicitly a local adaptation based on the documented legacy production guide.
  Object.assign(RS,{
    iron:['goods','⛓️'],chromium:['goods','🔩'],limestone:['goods','🪨']
  });
  Object.assign(RN,{
    iron:'حديد',chromium:'كروم',limestone:'حجر جيري'
  });
  SG.depot.push('iron','chromium','limestone');
  const QARYATI_PRODUCER_RECIPES={
    'Iron Mine':[
      {id:'iron',label:'استخراج الحديد',out:'ore',time:30},
      {id:'chromium',label:'استخراج الكروم',out:'chromium',time:60},
      {id:'limestone',label:'استخراج الحجر الجيري',out:'limestone',time:60}
    ]
  };
  window.QARYATI_PRODUCER_RECIPES=QARYATI_PRODUCER_RECIPES;
  // The existing local resource key "ore" is retained for compatibility;
  // its displayed name is now "حديد".
  RN.ore='حديد';
  QARYATI_RECIPES['Steel Mill']=[
    {id:'steel',label:'الفولاذ',in:{ore:10,bat:5,waterDrum:5},out:'steel',time:90,source:'adapted'},
    {id:'blueSteel',label:'الفولاذ الأزرق',in:{steel:5,bat:10,uniforms:1},out:'blueSteel',time:90,source:'adapted'}
  ];
  if(!SALE_PER_UNIT.blueSteel)SALE_PER_UNIT.blueSteel=270950;
  if(!SALE_PER_UNIT.steel)SALE_PER_UNIT.steel=47000;
  const qProducerRecipe=(name,id)=>{
    const list=QARYATI_PRODUCER_RECIPES[name]||[];
    return list.find(r=>r.id===id)||list[0]||null;
  };
  const qProducerBaseTick=tick;
  tick=function(o,dt){
    if(o&&o.role==='prod'&&o.mv){
      const name=ITEMS[o.ci]&&ITEMS[o.ci][2];
      const list=QARYATI_PRODUCER_RECIPES[name];
      if(list&&list.length){
        const recipe=qProducerRecipe(name,o.recipeId);
        if(recipe){
          const old=PR[name];
          // Keep the original internal tick threshold; scale real time to the
          // selected Standard Rulebook duration without altering other producers.
          PR[name]=Object.assign({},old||{},{out:recipe.out});
          try{
            const result=qProducerBaseTick(o,dt*30/recipe.time);
            return result;
          }finally{PR[name]=old;}
        }
      }
    }
    return qProducerBaseTick(o,dt);
  };
  const qMetalBaseRDet=rDet;
  rDet=function(o){
    let html=qMetalBaseRDet(o);
    if(!o||o.role!=='prod')return html;
    const name=ITEMS[o.ci]&&ITEMS[o.ci][2];
    const list=QARYATI_PRODUCER_RECIPES[name];
    if(!list||!list.length)return html;
    const selected=qProducerRecipe(name,o.recipeId);
    const buttons=list.map(r=>{
      const active=selected&&selected.id===r.id;
      return '<button class="btn '+(active?'':'gray')+'" data-a="mine-recipe" data-r="'+r.id+'" '+
        'style="margin:3px;white-space:normal;height:auto;line-height:1.35;padding:8px">'+
        (active?'✓ ':'')+r.label+'<div style="font-size:10px;font-weight:400">'+
        (RN[r.out]||r.out)+' · '+r.time+'ث</div></button>';
    }).join('');
    html+='<div style="margin-top:12px;padding-top:10px;border-top:1px solid #9996">'+
      '<b>اختيار ناتج المنجم</b><div style="font-size:11px;opacity:.75;margin:5px 0">'+
      'يمكن تغيير الناتج بعد انتهاء الجمع الحالي.</div>'+buttons+'</div>';
    return html;
  };
  const qMetalSheetClick=$('sb').onclick;
  $('sb').onclick=function(e){
    const b=e.target.closest('[data-a="mine-recipe"]');
    if(b){
      if(!detObj||detObj.role!=='prod'){toast('اختر المنجم أولاً');return;}
      if(detObj.out>0){toast('اجمع الناتج الحالي قبل تغيير نوع الاستخراج');return;}
      detObj.recipeId=b.dataset.r;
      save();
      const name=ITEMS[detObj.ci]&&ITEMS[detObj.ci][2];
      const recipe=qProducerRecipe(name,detObj.recipeId);
      toast('تم اختيار '+recipe.label);
      render();
      return;
    }
    return qMetalSheetClick.call(this,e);
  };


  // ===== Wine production chain =====
  // Ingredient quantities are cross-checked against community production
  // guides; the Standard Rulebook is used for the production timers.
  QARYATI_PRODUCER_RECIPES['Sand Mine']=[
    {id:'silica',label:'استخراج السيليكا',out:'silica',time:565}
  ];
  QARYATI_RECIPES['Lumber Mill']=[
    {id:'lumber',label:'الخشب المنشور',in:{wood:2},out:'lumber',time:10},
    {id:'oakBarrel',label:'برميل البلوط',in:{ore:1,oakWood:3,bat:1},out:'oakBarrel',time:30,source:'community-guide'}
  ];
  QARYATI_RECIPES['Glass Factory']=[
    {id:'wineBottle',label:'زجاجة النبيذ',in:{silica:3,chromium:1,limestone:1},out:'wineBottle',time:60,source:'community-guide'}
  ];
  QARYATI_RECIPES['Winery']=[
    {id:'cabernet',label:'نبيذ كابيرنيه',in:{cabernetGrapes:5,oakBarrel:1,wineBottle:1},out:'cabernetSauvignon',time:270,source:'community-guide'},
    {id:'chardonnay',label:'نبيذ شاردونيه',in:{chardonnayGrapes:5,oakBarrel:1,wineBottle:1},out:'chardonnay',time:240,source:'community-guide'},
    {id:'pinotNoir',label:'نبيذ بينو نوار',in:{pinotGrapes:5,oakBarrel:1,wineBottle:1},out:'pinotNoir',time:300,source:'community-guide'}
  ];
  window.QARYATI_WINE_CHAIN={
    ingredientsSource:'Town Star Crafts + community production guide (not official Rulebook quantities)',
    timersSource:'Gala Games Standard Rulebook',
    sangriaIncluded:false
  };

  window.QARYATI_ECONOMY_VERSION='unified-townstar-multirecipe-4';

})();
