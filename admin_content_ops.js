/* 公开内容、重复图文与已有对象引用；不管理用户私人草稿。 */
(() => {
  'use strict';
  const S=window.ADMIN_SCHEMA,E=window.AdminExtensions;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const f=(label,type='文本',hint='',options)=>({label,type,hint,options,required:false,readonly:false});
  const ui=()=>window.AdminDemoUI;
  const imageURL=name=>{try{return ui()?.imageURL?.(String(name))||'';}catch(_){return '';}};
  let assetSeq=0;
  const remember=file=>{if(!file||!/^image\//.test(file.type))return '';const dot=file.name.lastIndexOf('.'),stem=dot<0?file.name:file.name.slice(0,dot),ext=dot<0?'':file.name.slice(dot);const name=`${stem} (会话${++assetSeq})${ext}`;ui().remember(new File([file],name,{type:file.type}));return name;};
  function extend(key,title,fields){
    const old=S[key].groups.flatMap(g=>g.fields),fresh=fields.filter(x=>!old.some(o=>o.label===x.label));
    if(fresh.length)S[key].groups.push({title,fields:fresh});
  }
  extend('content','公开攻略形式',[f('内容形式','下拉','由运营维护公开内容；私人行程不进入运营池。',['图文攻略','行程攻略']),f('行程节点','结构列表','逐个维护日程、地点、说明与图片。')]);
  extend('guide','从业与作品',[f('从业开始年份','整数','用于从业时间排序；未提供不猜填。'),f('作品引用','多选','引用已有路线或公开攻略，不重复上传作品。')]);
  extend('destination','到访实用信息',[f('详细地址'),f('开放时间'),f('入口列表','结构列表'),f('实用提示','结构列表'),f('购票说明','多行文本','仅展示信息；不在平台售票。'),f('外部购票链接','链接','仅填写已确认的购票渠道链接。')]);
  extend('merchant','美食细分与套餐',[f('美食细分类','选择列表','与商户大类分开。',['本地小吃','烧烤','大盘鸡','拌面','甜品奶茶','夜市']),f('套餐条目','结构列表','优惠沿用本商户招牌套餐折扣，不再设多档拼团价。')]);
  extend('guide_routes','人数安排',[f('人数上限','整数','不低于最低成团人数；仅一个成交价，不另设拼团档位。')]);
  const routePrice=S.guide_routes.groups.flatMap(g=>g.fields).find(x=>x.label==='成团价');
  if(routePrice)routePrice.hint='单一成交价；不高于门市价，不是多档拼团价格。';
  // 招牌菜品列表：逐条名称/价格/是否必点/图片，最多 10 条；与套餐条目分开维护。
  const dishField=S.merchant.groups.flatMap(g=>g.fields).find(x=>x.label==='招牌菜品列表');
  if(dishField){dishField.type='结构列表';dishField.hint='每条：名称 + 价格 + 是否“必点”标签 + 图片，最多 10 条；旧文本按行保留为菜名，不自动补价。';}
  // 榜单侧信息存同一记录的技术字段；不进列表、不进知识库白名单。
  const RANK_SUB_FIELD='上榜项副标题';
  if(S.ranking){
    const rg=S.ranking.groups.find(g=>Array.isArray(g.fields))||S.ranking.groups[0];
    if(rg&&!rg.fields.some(x=>x.label===RANK_SUB_FIELD))rg.fields.push({label:RANK_SUB_FIELD,type:'文本',required:false,readonly:false,hint:'内部技术字段：按上榜项稳定ID保存副标题标签，不进入列表与知识库导出。'});
  }
  const defs={
    'guide_routes/行程节点':[['天数','text'],['标题','text'],['关联目的地','ref'],['描述','area'],['图片','file'],['提示','area']],
    'guide_routes/精华景点亮点':[['景点名','text'],['关联目的地','ref'],['描述','area'],['图片','file']],
    'content/行程节点':[['天数','text'],['标题','text'],['关联目的地','ref'],['描述','area'],['图片','file']],
    'destination/入口列表':[['入口名','text'],['位置说明','area']],
    'destination/实用提示':[['提示','area']],
    'merchant/套餐条目':[['套餐名','text'],['包含内容','area'],['门市价','number'],['图片','file']],
    'merchant/招牌菜品列表':[['名称','text'],['价格','number'],['是否必点','choice'],['图片','file']]
  };
  const LIST_MAX={'merchant/招牌菜品列表':10};
  // 图片组：多选/排序/移除/保存重开；文件仅存文件名与顺序。
  const IMAGE_FIELDS={
    'shop/主图':{min:1,max:8},
    'shop/详情图':{min:0,max:15},
    'merchant/图片库':{min:3,max:8},
    'destination/详情图组':{min:0,max:8}
  };
  for(const label of ['行程节点','精华景点亮点']){
    const field=S.guide_routes.groups.flatMap(g=>g.fields).find(x=>x.label===label);
    field.type='结构列表';field.hint='逐项填写，可添加、删除及调整顺序；地点可引用已有目的地。';
  }
  function list(value){
    if(Array.isArray(value))return value.map(x=>typeof x==='object'&&x?{...x}:{描述:String(x)});
    if(typeof value==='string'&&value.trim()){
      try{const parsed=JSON.parse(value);if(Array.isArray(parsed))return list(parsed);}catch(_){}
      return [{描述:value}];
    }
    return [];
  }
  // 旧招牌菜文本按行保留为菜名，不猜测价格/必点/图片。
  function dishList(value){
    if(Array.isArray(value))return value.map(x=>typeof x==='object'&&x?{...x}:{名称:String(x)});
    if(typeof value==='string'&&value.trim()){
      try{const parsed=JSON.parse(value);if(Array.isArray(parsed))return dishList(parsed);}catch(_){}
      return value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(s=>({名称:s}));
    }
    return [];
  }
  function itemsFor(key,label,value){return label==='招牌菜品列表'?dishList(value):list(value);}
  function imgName(x){
    if(typeof x==='string')return x;
    if(x&&typeof x==='object'){const v=x.file||x.name||x['图片']||x['图片名']||x.url;if(typeof v==='string')return v;}
    return '';
  }
  function imageList(value){
    if(Array.isArray(value))return value.map(imgName).map(s=>s.trim()).filter(Boolean);
    if(value&&typeof value==='object'){const n=imgName(value);return n?[n]:[];}
    if(typeof value==='string'&&value.trim()){
      const s=value.trim();
      if(s.startsWith('[')){try{const p=JSON.parse(s);if(Array.isArray(p))return imageList(p);}catch(_){}}
      return s.split(/、|\r?\n/).map(x=>x.trim()).filter(Boolean);
    }
    return [];
  }
  function subMap(v){
    if(v&&typeof v==='object'&&!Array.isArray(v))return {...v};
    if(typeof v==='string'&&v.trim()){
      try{const p=JSON.parse(v);if(p&&typeof p==='object'&&!Array.isArray(p))return p;}catch(_){}
    }
    return {};
  }
  function readItemHTML(def,item,i){
    return `<article class="cx-read"><strong>第 ${i+1} 项</strong>${Object.entries(item).map(([k,v])=>{
      const spec=(def.find(d=>d[0]===k)||[])[1];
      if(spec==='file'&&v){const url=imageURL(v);return `<p><small>${esc(k)}</small>${url?`<img class="cx-image" src="${esc(url)}" alt="${esc(k)}预览">`:''}<span>${esc(v)}</span></p>`;}
      return `<p><small>${esc(k)}</small> ${esc(k==='关联目的地'?AdminRelations.label(v):v)}</p>`;
    }).join('')}</article>`;
  }
  function imageReadHTML(name,i){
    const url=imageURL(name);
    return `<div class="cx-img-item cx-img-read"><span class="cx-img-num">第 ${i+1} 张</span>${url?`<img class="cx-img-thumb" src="${esc(url)}" alt="${esc(name)}">`:'<div class="cx-img-ph">无预览</div>'}<div class="cx-img-name">${esc(name)}</div></div>`;
  }
  function imageFieldHTML(key,field,value,index,readOnly){
    const cfg=IMAGE_FIELDS[key+'/'+field.label];
    const items=imageList(value);
    const hidden=`<input type="hidden" id="prototype-field-${index}" data-field-index="${index}" value="${esc(JSON.stringify(items))}">`;
    if(readOnly)return `<div class="fg full cx-imgs" data-cx-imgs="${esc(field.label)}" data-cx-key="${esc(key)}" data-cx-index="${index}"><label for="prototype-field-${index}">${esc(field.label)}${field.required?'<span class="req">*</span>':''}<small class="text-mut">只读</small></label>${hidden}<div class="cx-img-list">${items.map((n,i)=>imageReadHTML(n,i)).join('')||'<div class="cx-empty">尚未选择图片</div>'}</div></div>`;
    return `<section class="fg full cx-imgs" data-cx-imgs="${esc(field.label)}" data-cx-key="${esc(key)}" data-cx-index="${index}" data-cx-min="${cfg.min}" data-cx-max="${cfg.max}" role="group" aria-labelledby="cx-img-label-${index}"><label id="cx-img-label-${index}" for="cx-img-add-${index}">${esc(field.label)}${field.required?'<span class="req">*</span>':''}</label>${hidden}<div class="cx-img-list" data-cx-img-list></div><div class="cx-img-actions"><input id="cx-img-add-${index}" type="file" accept="image/*" multiple data-cx-img-add aria-label="添加${esc(field.label)}"><span class="cx-img-count" data-cx-img-count></span></div><div class="hint">${esc(field.hint||'')}${field.hint?' · ':''}已选 <span data-cx-img-num>${items.length}</span> / ${cfg.max} 张</div><div class="cx-img-status" role="status" aria-live="polite"></div></section>`;
  }
  function fieldHTML(key,field,value,index,readOnly){
    if(key==='ranking'&&field.label===RANK_SUB_FIELD){
      return `<input type="hidden" id="prototype-field-${index}" data-field-index="${index}" data-cx-rank-sub value="${esc(JSON.stringify(subMap(value)))}">`;
    }
    const imgKey=key+'/'+field.label;
    if(IMAGE_FIELDS[imgKey])return imageFieldHTML(key,field,value,index,readOnly);
    const def=defs[imgKey];
    if(def){
      const items=itemsFor(key,field.label,value);
      if(readOnly)return `<section class="fg full cx-repeat"><h3>${esc(field.label)}</h3>${items.length?items.map((x,i)=>readItemHTML(def,x,i)).join(''):'<div class="prototype-value">尚未提供</div>'}</section>`;
      return `<section class="fg full cx-repeat" data-cx-field="${esc(field.label)}" data-cx-key="${esc(key)}" data-cx-index="${index}" role="group" aria-labelledby="cx-label-${index}"><label id="cx-label-${index}">${esc(field.label)}</label><input type="hidden" id="prototype-field-${index}" data-field-index="${index}" value="${esc(JSON.stringify(items))}"><div data-cx-items></div><button type="button" class="btn btn-outline" data-cx-add>添加条目</button><div class="hint">${esc(field.hint||'每项独立维护，顺序即展示顺序。')}</div></section>`;
    }
    if(field.label==='美食细分类'&&key==='merchant'){
      const selected=Array.isArray(value)?value:typeof value==='string'?value.split('、').filter(Boolean):[];
      if(readOnly)return `<div class="fg full"><label>美食细分类</label><div class="prototype-value">${esc(selected.join('、')||'尚未提供')}</div></div>`;
      return `<div class="fg full cx-choices" data-cx-choices="${index}"><label>美食细分类</label><input type="hidden" id="prototype-field-${index}" data-field-index="${index}" value="${esc(JSON.stringify(selected))}"><div>${field.options.map((x,i)=>`<label for="cx-choice-${index}-${i}"><input id="cx-choice-${index}-${i}" type="checkbox" value="${esc(x)}" ${selected.includes(x)?'checked':''}>${esc(x)}</label>`).join('')}</div></div>`;
    }
    if(field.type==='多行文本')return `<div class="fg full"><label for="prototype-field-${index}">${esc(field.label)}</label>${readOnly?`<div class="prototype-value">${esc(value||'尚未提供')}</div>`:`<textarea class="fld" rows="3" id="prototype-field-${index}" data-field-index="${index}">${esc(value||'')}</textarea>`}<div class="hint">${esc(field.hint)}</div></div>`;
  }
  function bindImageGroup(group){
    const label=group.dataset.cxImgs,max=Number(group.dataset.cxMax||99),hidden=group.querySelector('input[type=hidden]'),listEl=group.querySelector('[data-cx-img-list]'),add=group.querySelector('[data-cx-img-add]'),numEl=group.querySelector('[data-cx-img-num]'),countEl=group.querySelector('[data-cx-img-count]'),statusEl=group.querySelector('.cx-img-status');
    if(!hidden||!listEl||!add)return;
    const read=()=>imageList(hidden.value);
    const render=(next=read())=>{
      hidden.value=JSON.stringify(next);
      const items=read();
      listEl.innerHTML=items.map((n,i)=>`<div class="cx-img-item"><span class="cx-img-num">第 ${i+1} 张</span>${imageURL(n)?`<img class="cx-img-thumb" src="${esc(imageURL(n))}" alt="${esc(n)}">`:'<div class="cx-img-ph">无预览</div>'}<div class="cx-img-name">${esc(n)}</div><div class="cx-img-ops"><button type="button" class="btn btn-ghost" data-cx-img-move="-1" data-cx-img-index="${i}" ${i===0?'disabled':''}>↑</button><button type="button" class="btn btn-ghost" data-cx-img-move="1" data-cx-img-index="${i}" ${i===items.length-1?'disabled':''}>↓</button><button type="button" class="btn btn-ghost" data-cx-img-remove data-cx-img-index="${i}">移除</button></div></div>`).join('')||'<div class="cx-empty">尚未选择图片</div>';
      if(numEl)numEl.textContent=String(items.length);
      if(countEl)countEl.textContent=`已选 ${items.length} / ${max}`;
    };
    listEl.addEventListener('click',event=>{
      const btn=event.target.closest('button');if(!btn)return;
      const items=read(),i=Number(btn.dataset.cxImgIndex);
      if(btn.hasAttribute('data-cx-img-remove')){items.splice(i,1);render(items);if(statusEl)statusEl.textContent=`已移除第 ${i+1} 张图片；保存表单后生效。`;}
      else if(btn.hasAttribute('data-cx-img-move')){const to=i+Number(btn.dataset.cxImgMove);if(to>=0&&to<items.length){[items[i],items[to]]=[items[to],items[i]];render(items);if(statusEl)statusEl.textContent='已调整图片顺序。';}}
    });
    add.addEventListener('change',()=>{
      const files=[...add.files];add.value='';
      if(!files.length)return;
      const items=read(),room=max-items.length;
      if(room<=0){if(statusEl)statusEl.textContent=`最多 ${max} 张，请先移除部分图片。`;return;}
      const take=files.slice(0,room);
      for(const file of take){const name=remember(file);if(name)items.push(name);}
      if(statusEl)statusEl.textContent=`已添加 ${take.length} 张${files.length-take.length?`，超出上限忽略 ${files.length-take.length} 张`:''}；保存表单后生效。`;
      render(items);
    });
    render();
  }
  function insertAfterName(chip,el){
    const first=chip.querySelector('button');
    if(first)chip.insertBefore(el,first);else chip.append(el);
  }
  function bindRankingSubs(state,root){
    if(state.key!=='ranking')return;
    const box=root.querySelector('.ar-field[data-rel-name="上榜项"]');
    const hidden=root.querySelector('[data-cx-rank-sub]');
    if(!box||!hidden)return;
    const input=box.querySelector('input[data-rel-label]'),chips=box.querySelector('.ar-chips');
    if(!input||!chips)return;
    const readOnly=state.readOnly;
    const readIDs=()=>{try{const v=input.value;if(Array.isArray(v))return v;if(typeof v==='string'&&v.trim()){const p=JSON.parse(v);if(Array.isArray(p))return p;}}catch(_){}return [];};
    let syncing=false;
    const sync=()=>{
      if(syncing)return;syncing=true;
      try{
        const ids=readIDs(),map=subMap(hidden.value),next={};
        for(const id of ids)if(map[id]!=null&&String(map[id]).trim())next[id]=String(map[id]);
        hidden.value=JSON.stringify(next);
        chips.querySelectorAll('[data-rel-chip]').forEach(chip=>{
          const id=chip.dataset.relChip;
          if(chip.querySelector('.cx-rank-sub-wrap,.cx-rank-sub'))return;
          const sub=next[id]||'';
          if(readOnly){
            if(sub){const el=document.createElement('small');el.className='cx-rank-sub';el.textContent=`副标题：${sub}`;insertAfterName(chip,el);}
          }else{
            const wrap=document.createElement('label');wrap.className='cx-rank-sub-wrap';
            const inp=document.createElement('input');inp.className='cx-rank-sub';inp.type='text';inp.value=sub;inp.placeholder='副标题标签';inp.setAttribute('aria-label',`上榜项副标题标签`);
            wrap.append('副标题',inp);
            inp.addEventListener('input',()=>{
              const m=subMap(hidden.value);
              if(inp.value.trim())m[id]=inp.value.trim();else delete m[id];
              hidden.value=JSON.stringify(m);
            });
            insertAfterName(chip,wrap);
          }
        });
      }finally{syncing=false;}
    };
    if(box._cxRankObs)box._cxRankObs.disconnect();
    box._cxRankObs=new MutationObserver(()=>sync());
    box._cxRankObs.observe(chips,{childList:true,subtree:true});
    sync();
  }
  function afterEditor(state,root){
    root.querySelectorAll('[data-cx-field]').forEach(group=>{
      const label=group.dataset.cxField,def=defs[state.key+'/'+label],hidden=group.querySelector('input[type=hidden]');
      const items=itemsFor(state.key,label,JSON.parse(hidden.value)),box=group.querySelector('[data-cx-items]');
      const sync=()=>{hidden.value=JSON.stringify(items);};
      const render=()=>{
        sync();box.innerHTML=items.map((item,i)=>`<article class="cx-item"><header><strong>第 ${i+1} 项</strong><div><button type="button" class="btn btn-ghost" data-cx-move="${i}" data-cx-delta="-1" ${i===0?'disabled':''}>上移</button><button type="button" class="btn btn-ghost" data-cx-move="${i}" data-cx-delta="1" ${i===items.length-1?'disabled':''}>下移</button><button type="button" class="btn btn-ghost" data-cx-remove="${i}">删除条目</button></div></header><div class="cx-grid">${def.map(([name,type],j)=>{
          const id=`cx-${group.dataset.cxIndex}-${i}-${j}`,base=`id="${id}" class="fld" data-cx-item="${i}" data-cx-name="${esc(name)}"`,value=item[name]??'';
          let control;
          if(type==='area')control=`<textarea ${base} rows="3">${esc(value)}</textarea>`;
          else if(type==='file'){const url=imageURL(value);control=`<input ${base} type="file" accept="image/*"><small>${esc(value||'尚未选择图片')}</small>${url?`<img class="cx-image" src="${esc(url)}" alt="条目图片预览">`:''}`;}
          else if(type==='choice')control=`<select ${base}><option value="">未设置</option><option value="必点" ${value==='必点'?'selected':''}>必点</option><option value="非必点" ${value==='非必点'?'selected':''}>非必点</option></select>`;
          else if(type==='ref'){
            const options=PrototypeUI.records('destination').filter(x=>x.values['状态']==='上架'||x.id===value);
            control=`<select ${base}><option value="">选择已有目的地</option>${options.map(x=>`<option value="${esc(x.id)}" ${x.id===value?'selected':''}>${esc(x.values['目的地名']||x.values['目的地'])}</option>`).join('')}</select>`;
          }else control=`<input ${base} type="${type==='number'?'number':'text'}" ${type==='number'?'min="0" step="any"':''} value="${esc(value)}">`;
          return `<div class="fg ${type==='area'?'cx-wide':''}"><label for="${id}">${esc(name)}</label>${control}</div>`;
        }).join('')}</div></article>`).join('')||'<div class="cx-empty">尚未添加条目</div>';
      };
      group.querySelector('[data-cx-add]').onclick=()=>{
        const max=LIST_MAX[state.key+'/'+label];
        if(max&&items.length>=max){window.PrototypeUI?.notice?.(`${label}最多 ${max} 条`);return;}
        items.push({});render();
      };
      box.onclick=event=>{
        const remove=event.target.closest('[data-cx-remove]'),move=event.target.closest('[data-cx-move]');
        if(remove){items.splice(Number(remove.dataset.cxRemove),1);render();}
        if(move){const i=Number(move.dataset.cxMove),to=i+Number(move.dataset.cxDelta);if(to>=0&&to<items.length){[items[i],items[to]]=[items[to],items[i]];render();}}
      };
      const change=event=>{
        const input=event.target;if(!input.dataset.cxName)return;
        const item=items[Number(input.dataset.cxItem)];if(!item)return;
        if(input.type==='file'){
          if(event.type!=='change'||!input.files[0])return;
          const file=input.files[0],name=remember(file);if(!name){window.PrototypeUI?.notice?.('请选择图片文件');return;}item[input.dataset.cxName]=name;render();
        }else{item[input.dataset.cxName]=input.value;sync();}
      };
      box.addEventListener('input',change);box.addEventListener('change',change);render();
    });
    root.querySelectorAll('[data-cx-imgs]').forEach(bindImageGroup);
    root.querySelectorAll('[data-cx-choices]').forEach(group=>{group.onchange=()=>{group.querySelector('input[type=hidden]').value=JSON.stringify([...group.querySelectorAll('input[type=checkbox]:checked')].map(x=>x.value));};});
    if(state.key==='ranking')bindRankingSubs(state,root);
    if(state.key==='guide_routes'){
      root.querySelectorAll('.fg>label').forEach(label=>{if(label.textContent.trim()==='成团价')label.childNodes.forEach(n=>{if(n.nodeType===3)n.textContent='成交价';});});
    }
    if(state.key==='content'){
      const index=state.fields.findIndex(x=>x.label==='内容形式'),select=root.querySelector(`[data-field-index="${index}"]`),nodes=root.querySelector('[data-cx-field="行程节点"]');
      if(select&&nodes){const update=()=>nodes.hidden=(select.value||state.values['内容形式']||'图文攻略')!=='行程攻略';select.addEventListener('change',update);update();}
    }
  }
  function collect(state,root){
    const values={};
    root.querySelectorAll('[data-cx-field]').forEach(group=>values[group.dataset.cxField]=itemsFor(state.key,group.dataset.cxField,JSON.parse(group.querySelector('input[type=hidden]').value)));
    root.querySelectorAll('[data-cx-imgs]').forEach(group=>{const hidden=group.querySelector('input[type=hidden]');if(hidden)values[group.dataset.cxImgs]=imageList(hidden.value);});
    const choices=root.querySelector('[data-cx-choices]');if(choices)values['美食细分类']=JSON.parse(choices.querySelector('input[type=hidden]').value);
    const rank=root.querySelector('[data-cx-rank-sub]');
    if(state.key==='ranking'&&rank)values[RANK_SUB_FIELD]=subMap(rank.value);
    return values;
  }
  function validate(state,values){
    const out=[];
    if(state.key==='guide_routes'){
      const cap=values['人数上限'],min=values['最低成团人数'];
      if(cap!==''&&cap!=null&&(!Number.isInteger(Number(cap))||Number(cap)<1||Number(cap)<Number(min)))out.push({label:'人数上限',message:'人数上限须为正整数，且不低于最低成团人数'});
      if(values['成团价']!==''&&values['成团价']!=null&&(!Number.isFinite(Number(values['成团价']))||Number(values['成团价'])<0||(values['门市价']!==''&&Number(values['成团价'])>Number(values['门市价']))))out.push({label:'成团价',message:'成交价须为非负数且不高于门市价'});
    }
    if(state.key==='guide'&&values['从业开始年份']!==''){
      const year=Number(values['从业开始年份']);if(!Number.isInteger(year)||year<1||year>new Date().getFullYear())out.push({label:'从业开始年份',message:'请填写不晚于今年的有效整数年份'});
    }
    if(state.key==='destination'&&values['外部购票链接']){try{const u=new URL(values['外部购票链接']);if(!['http:','https:'].includes(u.protocol))throw new Error();}catch(_){out.push({label:'外部购票链接',message:'请填写有效的网页链接'});}}
    for(const [key,cfg]of Object.entries(IMAGE_FIELDS)){
      const [page,label]=key.split('/');if(page!==state.key)continue;
      const imgs=imageList(values[label]);
      if((state.creating||JSON.stringify(imgs)!==JSON.stringify(imageList(state.values?.[label])))&&imgs.length<cfg.min)out.push({label,message:`${label}至少选择 ${cfg.min} 张图片`});
      if(imgs.length>cfg.max)out.push({label,message:`${label}最多 ${cfg.max} 张图片`});
    }
    if(state.key==='merchant'&&values['招牌菜品列表']){
      const dishes=itemsFor('merchant','招牌菜品列表',values['招牌菜品列表']);
      if(dishes.length>10)out.push({label:'招牌菜品列表',message:'招牌菜品列表最多 10 条'});
      if(dishes.some(x=>!String(x['名称']||'').trim()))out.push({label:'招牌菜品列表',message:'每条菜品请填写名称；不自动猜填价格或图片'});
    }
    for(const [key,def]of Object.entries(defs)){
      const [page,label]=key.split('/');if(page!==state.key)continue;
      for(const item of itemsFor(state.key,label,values[label]))for(const [name,type]of def){
        if(type==='number'&&item[name]!==''&&item[name]!=null&&(!Number.isFinite(Number(item[name]))||Number(item[name])<0))out.push({label,message:`${name}不能为负数`});
        if(type==='ref'&&item[name]){
          const existing=itemsFor(state.key,label,state.values?.[label]).some(x=>x[name]===item[name]);
          if(!PrototypeUI.records('destination').some(x=>x.id===item[name]&&(x.values['状态']==='上架'||existing)))out.push({label,message:'请选择已有上架目的地；原有引用可保留'});
        }
      }
    }
    return out;
  }
  function normalizeRecord(key,values){
    const patch={};
    for(const k of Object.keys(defs)){const [page,label]=k.split('/');if(page===key&&values[label])patch[label]=itemsFor(key,label,values[label]);}
    for(const k of Object.keys(IMAGE_FIELDS)){const [page,label]=k.split('/');if(page===key&&Object.hasOwn(values,label)&&values[label]!==undefined)patch[label]=imageList(values[label]);}
    if(key==='content'&&!values['内容形式'])patch['内容形式']='图文攻略';return patch;
  }
  E.register({fieldHTML,afterEditor,collect,validate,normalizeRecord});
})();
