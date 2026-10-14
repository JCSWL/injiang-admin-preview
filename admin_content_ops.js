/* 公开内容、重复图文与已有对象引用；不管理用户私人草稿。 */
(() => {
  'use strict';
  const S=window.ADMIN_SCHEMA,E=window.AdminExtensions;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const f=(label,type='文本',hint='',options)=>({label,type,hint,options,required:false,readonly:false});
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
  const defs={
    'guide_routes/行程节点':[['天数','text'],['标题','text'],['关联目的地','ref'],['描述','area'],['图片','file'],['提示','area']],
    'guide_routes/精华景点亮点':[['景点名','text'],['关联目的地','ref'],['描述','area'],['图片','file']],
    'content/行程节点':[['天数','text'],['标题','text'],['关联目的地','ref'],['描述','area'],['图片','file']],
    'destination/入口列表':[['入口名','text'],['位置说明','area']],
    'destination/实用提示':[['提示','area']],
    'merchant/套餐条目':[['套餐名','text'],['包含内容','area'],['门市价','number'],['图片','file']]
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
  function fieldHTML(key,field,value,index,readOnly){
    const def=defs[key+'/'+field.label];
    if(def){
      const items=list(value);
      if(readOnly)return `<section class="fg full cx-repeat"><h3>${esc(field.label)}</h3>${items.length?items.map((x,i)=>`<article class="cx-read"><strong>第 ${i+1} 项</strong>${Object.entries(x).map(([k,v])=>`<p><small>${esc(k)}</small> ${esc(k==='关联目的地'?AdminRelations.label(v):v)}</p>`).join('')}</article>`).join(''):'<div class="prototype-value">尚未提供</div>'}</section>`;
      return `<section class="fg full cx-repeat" data-cx-field="${esc(field.label)}" data-cx-key="${esc(key)}" data-cx-index="${index}" role="group" aria-labelledby="cx-label-${index}"><label id="cx-label-${index}">${esc(field.label)}</label><input type="hidden" id="prototype-field-${index}" data-field-index="${index}" value="${esc(JSON.stringify(items))}"><div data-cx-items></div><button type="button" class="btn btn-outline" data-cx-add>添加条目</button><div class="hint">${esc(field.hint||'每项独立维护，顺序即展示顺序。')}</div></section>`;
    }
    if(field.label==='美食细分类'&&key==='merchant'){
      const selected=Array.isArray(value)?value:typeof value==='string'?value.split('、').filter(Boolean):[];
      if(readOnly)return `<div class="fg full"><label>美食细分类</label><div class="prototype-value">${esc(selected.join('、')||'尚未提供')}</div></div>`;
      return `<div class="fg full cx-choices" data-cx-choices="${index}"><label>美食细分类</label><input type="hidden" id="prototype-field-${index}" data-field-index="${index}" value="${esc(JSON.stringify(selected))}"><div>${field.options.map((x,i)=>`<label for="cx-choice-${index}-${i}"><input id="cx-choice-${index}-${i}" type="checkbox" value="${esc(x)}" ${selected.includes(x)?'checked':''}>${esc(x)}</label>`).join('')}</div></div>`;
    }
    if(field.type==='多行文本')return `<div class="fg full"><label for="prototype-field-${index}">${esc(field.label)}</label>${readOnly?`<div class="prototype-value">${esc(value||'尚未提供')}</div>`:`<textarea class="fld" rows="3" id="prototype-field-${index}" data-field-index="${index}">${esc(value||'')}</textarea>`}<div class="hint">${esc(field.hint)}</div></div>`;
  }
  function afterEditor(state,root){
    root.querySelectorAll('[data-cx-field]').forEach(group=>{
      const label=group.dataset.cxField,def=defs[state.key+'/'+label],hidden=group.querySelector('input[type=hidden]');
      const items=list(JSON.parse(hidden.value)),images=new WeakMap(),box=group.querySelector('[data-cx-items]');
      const sync=()=>{hidden.value=JSON.stringify(items);};
      const render=()=>{
        sync();box.innerHTML=items.map((item,i)=>`<article class="cx-item"><header><strong>第 ${i+1} 项</strong><div><button type="button" class="btn btn-ghost" data-cx-move="${i}" data-cx-delta="-1" ${i===0?'disabled':''}>上移</button><button type="button" class="btn btn-ghost" data-cx-move="${i}" data-cx-delta="1" ${i===items.length-1?'disabled':''}>下移</button><button type="button" class="btn btn-ghost" data-cx-remove="${i}">删除条目</button></div></header><div class="cx-grid">${def.map(([name,type],j)=>{
          const id=`cx-${group.dataset.cxIndex}-${i}-${j}`,base=`id="${id}" class="fld" data-cx-item="${i}" data-cx-name="${esc(name)}"`,value=item[name]??'';
          let control;
          if(type==='area')control=`<textarea ${base} rows="3">${esc(value)}</textarea>`;
          else if(type==='file')control=`<input ${base} type="file" accept="image/*"><small>${esc(value||'尚未选择图片')}</small>${(images.get(item)||window.AdminDemoUI?.imageURL(value))?`<img class="cx-image" src="${images.get(item)||window.AdminDemoUI.imageURL(value)}" alt="条目图片预览">`:''}`;
          else if(type==='ref'){
            const options=PrototypeUI.records('destination').filter(x=>x.values['状态']==='上架'||x.id===value);
            control=`<select ${base}><option value="">选择已有目的地</option>${options.map(x=>`<option value="${esc(x.id)}" ${x.id===value?'selected':''}>${esc(x.values['目的地名']||x.values['目的地'])}</option>`).join('')}</select>`;
          }else control=`<input ${base} type="${type==='number'?'number':'text'}" ${type==='number'?'min="0" step="any"':''} value="${esc(value)}">`;
          return `<div class="fg ${type==='area'?'cx-wide':''}"><label for="${id}">${esc(name)}</label>${control}</div>`;
        }).join('')}</div></article>`).join('')||'<div class="cx-empty">尚未添加条目</div>';
      };
      group.querySelector('[data-cx-add]').onclick=()=>{items.push({});render();};
      box.onclick=event=>{
        const remove=event.target.closest('[data-cx-remove]'),move=event.target.closest('[data-cx-move]');
        if(remove){const item=items.splice(Number(remove.dataset.cxRemove),1)[0];if(images.get(item))URL.revokeObjectURL(images.get(item));render();}
        if(move){const i=Number(move.dataset.cxMove),to=i+Number(move.dataset.cxDelta);if(to>=0&&to<items.length){[items[i],items[to]]=[items[to],items[i]];render();}}
      };
      const change=event=>{
        const input=event.target;if(!input.dataset.cxName)return;
        const item=items[Number(input.dataset.cxItem)];if(!item)return;
        if(input.type==='file'){
          if(event.type!=='change'||!input.files[0])return;
          const file=input.files[0];item[input.dataset.cxName]=file.name;if(images.get(item))URL.revokeObjectURL(images.get(item));images.set(item,URL.createObjectURL(file));render();
        }else{item[input.dataset.cxName]=input.value;sync();}
      };
      box.addEventListener('input',change);box.addEventListener('change',change);render();
    });
    root.querySelectorAll('[data-cx-choices]').forEach(group=>{group.onchange=()=>{group.querySelector('input[type=hidden]').value=JSON.stringify([...group.querySelectorAll('input[type=checkbox]:checked')].map(x=>x.value));};});
    if(state.key==='guide_routes'){
      root.querySelectorAll('.fg>label').forEach(label=>{if(label.textContent.trim()==='成团价')label.childNodes.forEach(n=>{if(n.nodeType===3)n.textContent='成交价';});});
    }
    if(state.key==='content'){
      const index=state.fields.findIndex(x=>x.label==='内容形式'),select=root.querySelector(`[data-field-index="${index}"]`),nodes=root.querySelector('[data-cx-field="行程节点"]');
      if(select&&nodes){const update=()=>nodes.hidden=(select.value||state.values['内容形式']||'图文攻略')!=='行程攻略';select.addEventListener('change',update);update();}
    }
  }
  function collect(state,root){
    const values={};root.querySelectorAll('[data-cx-field]').forEach(group=>values[group.dataset.cxField]=list(JSON.parse(group.querySelector('input[type=hidden]').value)));
    const choices=root.querySelector('[data-cx-choices]');if(choices)values['美食细分类']=JSON.parse(choices.querySelector('input[type=hidden]').value);
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
    for(const [key,def]of Object.entries(defs)){
      const [page,label]=key.split('/');if(page!==state.key)continue;
      for(const item of list(values[label]))for(const [name,type]of def){
        if(type==='number'&&item[name]!==''&&item[name]!=null&&(!Number.isFinite(Number(item[name]))||Number(item[name])<0))out.push({label,message:`${name}不能为负数`});
        if(type==='ref'&&item[name]){
          const existing=list(state.values?.[label]).some(x=>x[name]===item[name]);
          if(!PrototypeUI.records('destination').some(x=>x.id===item[name]&&(x.values['状态']==='上架'||existing)))out.push({label,message:'请选择已有上架目的地；原有引用可保留'});
        }
      }
    }
    return out;
  }
  function normalizeRecord(key,values){
    const patch={};for(const k of Object.keys(defs)){const [page,label]=k.split('/');if(page===key&&values[label])patch[label]=list(values[label]);}
    if(key==='content'&&!values['内容形式'])patch['内容形式']='图文攻略';return patch;
  }
  E.register({fieldHTML,afterEditor,collect,validate,normalizeRecord});
})();
