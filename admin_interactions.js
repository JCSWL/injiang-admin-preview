/* UI/UX原型交互：仅修改内存中的演示内容，不请求后台，不发送/付款。 */
(() => {
  'use strict';
  const drafts = new Map();
  const rowPatches = new Map();
  const addedRows = new Map();
  const removedRows = new Set();
  const ui = { page: 'dashboard', drawer: null, returnFocus: null, full:false, mode:'edit' }; 
  const schema = window.ADMIN_SCHEMA;
  const part = (key, group) => ({groups: [schema[key].groups[group]]});
  schema.promo_channel=part('promo',0);schema.promo_landing=part('promo',1);schema.promo_batch=part('promo',2);
  schema.checkin_rules=part('checkin',0);
  schema.member_tags={groups:[{title:'运营标签',fields:schema.member.groups[0].fields.filter(f=>f.label==='运营标签')}]};
  schema.home.groups.forEach((g,i)=>schema[`home_${i}`]={groups:[g]});
  schema.service.groups.forEach((g,i)=>schema[`service_${i}`]={groups:[g]});
  for(const key of ['notify','shop_specs','guide']) for(const f of schema[key].groups.flatMap(g=>g.fields)) {
    if(['微信订阅消息模板 ID','规格编码','已带旅友数'].includes(f.label)) f.readonly=false;
  }
  const sections = {
    merchant:[['基础资料',['商户名','类目','商圈','地图坐标','详细地址','联系电话','营业时间']],['展示内容',['图片库','交通说明','到店高峰提示','招牌菜品列表']],['会员优惠与状态',['人均消费','认证徽章','会员卡折扣','招牌套餐折扣','状态']]],
    guide:[['基础资料',['姓名','主体类型','向导标签','简介','服务城市']],['认证资料',['实名材料','头像','认证徽章']],['展示数据与状态',['评分','已带旅友数','状态']]],
    activity:[['基础信息',['活动名','类型','用户自发活动发起人','审核状态','关联向导','关联合作方','路线/地点','关联城市']],['报名与价格',['开始时间','结束时间','报名截止','人数上限','最低成团人数','是否付费','成人价','儿童价']],['展示与退改',['副标题标签','活动看什么(亮点)','主办方介绍','退改规则','封面图','活动描述','状态']]],
    destination:[['基础资料',['目的地名','主题类型','副标题','关联城市','关联商圈']],['展示内容',['封面图','详情图组','详细介绍']],['关联与状态',['挂载商户','挂载向导路线','挂载活动','排序权重','状态']]],
    shop:[['基础资料',['商品名','类目','产地','品牌/合作社','关联城市']],['展示内容',['主图','详情图','产地故事标签','产地故事']],['权益与状态',['支持退换','支持新人券抵扣','支持旅友会员优惠','状态']]],
    member:[['会员资料（只读）',['昵称 / 头像 / 手机号','会员编号','来源渠道','来自城市','停留天数','兴趣标签','注册时间','当前等级']],['行为与数据（只读）',['累计到店打卡数','累计付费金额','累计积分','收藏商户/玩法/目的地数','足迹地点数 + 累计公里数','收货地址','行为记录']],['运营维护',['运营标签','备注','状态']]],
    coupon:[['优惠规则',['券名','券类型','优惠类型','优惠数值','使用门槛']],['发放与使用',['适用范围','指定对象','领取上限(人均)','有效期类型','生效期','库存','状态']]]
  };
  for(const [key,groups] of Object.entries(sections)) {
    const all=schema[key].groups.flatMap(g=>g.fields);
    schema[key].groups=groups.map(([title,labels])=>({title,fields:labels.map(label=>all.find(f=>f.label===label)).filter(Boolean)}));
  }
  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const close = () => {
    document.querySelector('.ux-popover')?.remove();
    const modal=!!document.querySelector('.ux-dialog');
    $('modal-root').replaceChildren();
    if(modal && ui.full){ui.drawer=ui.hostState||ui.drawer;ui.hostState=null;return;}
    if(ui.full && ui.drawer?.returnToChildren){const back=ui.drawer.returnToChildren;ui.drawer=null;ui.full=false;ui.hostState=null;back();return;}
    const full=ui.full; ui.full=false; ui.drawer=null;ui.hostState=null;
    if(full) navigate(ui.page);
    else if(ui.returnFocus?.isConnected) ui.returnFocus.focus();
  };
  function notice(text) {
    let node = document.getElementById('prototype-feedback');
    if (!node) { node = document.createElement('div'); node.id = 'prototype-feedback'; node.setAttribute('role','status'); document.body.append(node); }
    node.textContent = text;
    clearTimeout(notice.timer); notice.timer = setTimeout(() => node.remove(), 4500);
  }
  const pageName = id => MENU.flatMap(g => g.items).find(it => it.id === id)?.n || id;
  const fieldsFor = key => window.ADMIN_SCHEMA?.[key]?.groups || [];
  const flatFields = key => fieldsFor(key).flatMap(g => g.fields || []);
  function rowData(row) {
    if (!row) return {};
    if(!row.closest('table')) return row.uxValues||{};
    const table = row.closest('table');
    const heads = [...table.querySelectorAll('thead tr:first-child th')];
    const cells = [...row.cells];
    const result = {};
    heads.forEach((head, index) => {
      const label = head.textContent.trim();
      if (!label || label === '操作') return;
      const cell = cells[index];
      if (cell) result[label] = cell.dataset.listValue ?? cell.innerText.trim();
    });
    return result;
  }
  function rowIndex(row) { return Number(row?.dataset.prototypeIndex ?? 0); }
  const aliases = {
    '商户名':['商户'], '人均消费':['人均'], '会员卡折扣':['折扣'], '联系电话':['商户'],
    '姓名':['向导','姓名'], '主体类型':['主体类型'], '评分':['评分'],
    '活动名':['活动'], '名称':['活动'], '活动名称':['活动'], '关联向导':['关联向导 / 合作方'],
    '目的地名':['目的地'], '主题类型':['主题'], '挂载商户':['挂商户'], '挂载向导路线':['挂向导路线'], '挂载活动':['挂活动'],
    '榜单名':['榜单'], '上榜项':['上榜项'], '商品名':['商品'], '商品名称':['商品'], '分类':['分类','类目'],
    '排序权重':['排序'], '券名':['券'], '券类型':['类型'], '领取上限(人均)':['领取上限'],
    '领取上限（人均）':['领取上限'], '生效期':['有效期'], '库存':['库存/已领','库存'],
    '渠道类型':['渠道'], '批次名称':['批次名'], '批次名':['批次名'], '生成数量':['生成量'],
    '账号名':['账号'], '手机号':['手机'], '城市名称':['城市'], '城市名':['城市'], '城市代码':['代码'], '商圈列表':['商圈'],
    '模板名称':['模板名'], '模板名':['模板名'], '微信模板 ID':['微信模板 ID'],
    '客服号显示名':['客服号显示名'], '服务时间说明':['服务时间说明'],
    '来源渠道':['来源渠道'], '累计到店打卡数':['打卡'], '累计付费金额':['累计消费'], '累计积分':['积分'], '运营标签':['标签']
  };
  function seedFields(key, row, groups) {
    const data = rowData(row);
    const index = rowIndex(row);
    const obj = row ? ({merchant: DATA.merchants, guide:DATA.guides, activity:DATA.activities, shop:DATA.products, member:DATA.members})[key]?.[index] : null;
    const values = {...(row?.uxValues || {})};
    if(row?.uxValues) return {...values,...window.AdminExtensions?.normalizeRecord(key,values,row.dataset.uxId)};
    if (['guide_routes','shop_specs'].includes(key)) return {...values,...window.AdminExtensions?.normalizeRecord(key,values,row?.dataset.uxId)};
    for (const group of groups) for (const f of group.fields || []) {
      let val = data[f.label];
      if (val === undefined) val = (aliases[f.label] || []).map(alias => data[alias]).find(v => v !== undefined);
      if (obj) {
        const keys = ({merchant:{'商户名':'name','类目':'cat','人均消费':'avg','商圈':'zone','联系电话':'tel','会员卡折扣':'disc','认证徽章':'cert','状态':'status'},
          guide:{'姓名':'name','主体类型':'type','评分':'rating','认证徽章':'cert','状态':'status'},
          activity:{'活动名':'name','活动名称':'name','价格':'price','人数上限':'cap','最低成团人数':'min','开始时间':'start','状态':'status'},
          shop:{'商品名':'name','商品名称':'name','类目':'cat','产地':'origin','库存':'stock','状态':'status'},
          member:{'昵称':'nick','头像':'avatar','来源渠道':'src','来自城市':'from','注册时间':'reg','累计到店打卡数':'hits','累计付费金额':'spent','累计积分':'points','运营标签':'tag','状态':'status'}})[key];
        if (keys?.[f.label] && obj[keys[f.label]] !== undefined) val = obj[keys[f.label]];
      }
      if (key === 'member' && f.label === '当前等级' && obj) val = obj.hits >= 5 ? '挚友 LV.3' : obj.hits >= 1 ? '常客 LV.2' : '旅友 LV.1';
      if (Array.isArray(val)) val = val.join('、');
      if (typeof val === 'string') {
        if (['商户名','姓名','目的地名','商品名','商品名称','活动名','活动名称'].includes(f.label)) val = val.split('\n')[0].replace(/认证$/, '').trim();
        if (f.type === '数字' || f.type === '整数') val = val.match(/-?\d+(\.\d+)?/)?.[0] || '';
        if (['图片','文件','图标'].some(t => f.type?.includes(t))) val = '';
      }
      if(key==='member' && f.label==='昵称 / 头像 / 手机号' && obj) val=`${obj.nick} / ${obj.avatar} / 未提供手机号`;
      if(key==='member' && f.label==='会员编号' && obj) val=obj.id;
      if(key==='activity' && f.label==='成人价' && obj) val=obj.price;
      if(key==='activity' && f.label==='是否付费' && obj) val=obj.paid?'付费':'免费';
      if(key==='checkin_rules') val=({'评价推送延迟':3,'评价确认有效期':24,'每人每店日限打卡次数':1})[f.label];
      if(key==='coupon' && f.label==='库存' && data['库存/已领']) val=data['库存/已领'].split('/').at(-1);
      if(['挂载商户','挂载向导路线','挂载活动','关联商户','上榜项'].includes(f.label)) val='';
      if(key==='notify' && f.label==='微信订阅消息模板 ID') val=data['微信模板 ID']||'';
      values[f.label] = val ?? '';
    }
    return {...values,...window.AdminExtensions?.normalizeRecord(key,values,row?.dataset.uxId)};
  }
  function couponPeriodHTML(value,index,locked) {
    const p=value&&typeof value==='object'?value:{};
    if(locked)return `<div class="fg full"><label>生效期<small class="text-mut">只读</small></label><div class="prototype-value">${safe(couponValidityText({'有效期类型':p.days!=null?'领取后 N 天有效':'固定日期','生效期':p}))}</div></div>`;
    return `<div class="fg full ux-coupon-period" data-period-field-index="${index}" role="group" aria-labelledby="ux-period-label"><label id="ux-period-label">生效期<span class="req">*</span></label><div data-period-mode="days"><label for="ux-period-days">领取后有效天数</label><input id="ux-period-days" class="fld" type="number" step="1" min="1" value="${safe(p.days??'')}" data-period-part="days"></div><div class="ux-period-inputs" data-period-mode="fixed"><div><label for="ux-period-start">开始日期（可选）</label><input id="ux-period-start" class="fld" type="date" value="${safe(p.start||'')}" data-period-part="start"></div><div><label for="ux-period-end">到期日期</label><input id="ux-period-end" class="fld" type="date" value="${safe(p.end||'')}" data-period-part="end"></div></div><div class="hint" data-period-prompt>先选择有效期类型；固定日期可填写到期日，也可填写起止区间。</div></div>`;
  }
  function bindCouponEditor(root,state) {
    if(state.key!=='coupon' || state.readOnly)return;
    const index=state.fields.findIndex(f=>f.label==='有效期类型'),type=root.querySelector(`[data-field-index="${index}"]`);
    const switchPeriod=()=>{
      root.querySelectorAll('[data-period-mode]').forEach(group=>{
        const active=group.dataset.periodMode===(type.value==='领取后 N 天有效'?'days':type.value==='固定日期'?'fixed':'');
        group.hidden=!active;group.querySelectorAll('input').forEach(input=>input.disabled=!active);
      });
      clearCouponError(root,'生效期');
    };
    type.addEventListener('change',switchPeriod);switchPeriod();
    root.querySelectorAll('input,select').forEach(input=>{
      const label=input.dataset.periodPart?'生效期':state.fields[Number(input.dataset.fieldIndex)]?.label;
      if(!label)return;
      input.addEventListener('blur',()=>{
        const error=couponErrors(state,collectEditorValues(state,root)).find(e=>e.label===label);
        clearCouponError(root,label);if(error)paintCouponError(root,state,error);
      });
      input.addEventListener('input',()=>clearCouponError(root,label));
    });
  }
  function fieldHTML(field, value, index, readOnly) {
    const id = `prototype-field-${index}`;
    const extended=window.AdminExtensions?.fieldHTML(ui.editKey,field,value,index,readOnly||!!field.readonly);
    if(extended!==undefined)return extended;
    if(ui.editKey==='coupon' && field.label==='生效期')return couponPeriodHTML(value,index,readOnly||field.readonly);
    const type = field.type || '文本';
    const locked = readOnly || !!field.readonly;
    const label = `<label for="${id}">${safe(field.label)}${field.required ? '<span class="req">*</span>' : ''}${locked ? '<small class="text-mut">只读</small>' : ''}</label>`;
    const base = `id="${id}" data-field-index="${index}" class="fld"`;
    let control;
    if (locked) {
      const display=Array.isArray(value)?value.map(v=>window.AdminRelations?.label(v)||v).join('、'):typeof value==='string'&&/^[a-z_]+:/.test(value)?window.AdminRelations?.label(value)||value:value;
      control = `<div id="${id}" class="prototype-value">${safe(display || '—').replace(/\n/g,'<br>')}</div>`;
    } else if (window.AdminRelations?.fieldHTML(ui.editKey,field,value,index)) {
      return window.AdminRelations.fieldHTML(ui.editKey,field,value,index);
    } else if (type.includes('图片') || type.includes('文件') || type.includes('图标')) {
      control = `<input ${base} type="file" accept="${type.includes('图标')?'image/svg+xml':'image/*'}" ${/组|库|材料/.test(field.label) ? 'multiple' : ''}><div class="prototype-upload-value">${safe(value || '尚未选择文件')}</div>`;
    } else if (field.label==='分发对象登记表') {
      control=`<input ${base} type="file" accept=".xlsx,.xls,.csv"><div class="prototype-upload-value">${safe(value || '尚未选择登记表')}</div>`;
    } else if ((type.includes('下拉') || type === '开关') && (field.options?.length || type === '开关')) {
      const options = field.options?.length ? field.options : ['开启','关闭'];
      const selected = typeof value === 'boolean' ? (value ? options[0] : options[1]) : value;
      control = `<select ${base}><option value="">请选择</option>${[...new Set([...options, ...(selected && !options.includes(selected) ? [selected] : [])])].map(o => `<option ${o===selected?'selected':''}>${safe(o)}</option>`).join('')}</select>`;
    } else if (type.includes('多选') || type.includes('列表') || type.includes('数组') || type.includes('富文本') || type.includes('经纬度')) {
      control = `<textarea ${base} rows="3" placeholder="${/列表|数组/.test(type)?'每行一项':'填写内容'}">${safe(Array.isArray(value)?value.join('\n'):value)}</textarea>`;
    } else {
      const inputType = field.label.includes('Key') ? 'password' : /数字|整数/.test(type) ? 'number' : type.includes('日期') ? (['开始时间','结束时间','报名截止'].includes(field.label)?'datetime-local':'date') : 'text';
      const initial = inputType === 'date' ? String(value).slice(0,10) : inputType==='datetime-local'?String(value).replace(' ','T'):value;
      control = `<input ${base} type="${inputType}" ${inputType==='number'?'step="any"':''} value="${safe(initial)}" placeholder="尚未填写">`;
    }
    return `<div class="fg ${/列表|富文本|图片|简介|说明|备注|地址|介绍/.test(type+' '+field.label)?'full':''}">${label}${control}${field.hint ? `<div class="hint">${safe(field.hint)}</div>` : ''}</div>`;
  }
  function drawer(title, body, footer) {
    ui.returnFocus = document.activeElement;
    if(ui.full)ui.hostState=ui.drawer;
    $('modal-root').innerHTML=`<div class="ux-dialog-mask"><div class="ux-dialog" role="dialog" aria-modal="true" aria-label="${safe(title)}" tabindex="-1"><div class="ux-dialog-head"><h2>${safe(title)}</h2><button class="btn btn-ghost btn-icon" data-prototype-close aria-label="关闭">${ico('x')}</button></div><div class="ux-dialog-body">${body}</div><div class="ux-dialog-footer">${footer || '<button class="btn btn-outline" data-prototype-close>关闭</button>'}</div></div></div>`;
    const mask=document.querySelector('.ux-dialog-mask');mask.onclick=e=>{if(e.target===mask)close();};
    const box = document.querySelector('.ux-dialog');
    box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true'); box.setAttribute('aria-label',title);
    box.tabIndex = -1;
    box.querySelectorAll('[data-prototype-close]').forEach(b=>b.onclick=close);
    box.querySelectorAll('[data-prototype-save]').forEach(b=>b.onclick=save);
    window.AdminRelations?.bind(box,()=>ui.drawer);
    box.focus();
  }
  function info(title, text) { drawer(title, `<div class="prototype-explain">${safe(text).replace(/\n/g,'<br>')}</div>`); }
  function editor(key, row, creating = false, customTitle = '', viewOnly = false) {
    let groups = fieldsFor(key);
    if(key==='home_0' && ROLE!=='admin') groups=groups.map(g=>({...g,fields:g.fields.filter(f=>!['天气 API Key','天气数据源','天气默认城市'].includes(f.label))}));
    if(key==='service_0' && ROLE!=='admin') groups=groups.map(g=>({...g,fields:g.fields.map(f=>f.label==='AI 服务商'?{...f,readonly:true}:f)}));
    if (ROLE==='boss') return info('只读视角','管理层仅查看经营汇总，不进入资料编辑。');
    if (!groups.some(g => g.fields?.length)) return info(customTitle || pageName(key), '暂无可配置内容。');
    if(row && !creating && window.AdminStatus?.policies[key]) groups=groups.map(g=>({...g,fields:g.fields.map(f=>f.label==='状态'?{...f,readonly:true,hint:'在列表的状态列调整；需要原因的操作会单独确认。'}:f)}));
    const index = creating ? 'new' : row ? `${row.dataset.prototypeTable||0}/${rowIndex(row)}` : 'config';
    const identity = `${ui.page}/${key}/${row?.dataset.uxId||index}`;
    const fields = groups.flatMap(g => g.fields || []);
    const values = {...seedFields(key,row,groups), ...(creating?{}:(drafts.get(identity) || {}))};
    const readOnly = viewOnly || ROLE === 'boss' || ['checkin_record','order_detail','activity_signup'].includes(key);
    ui.editKey=key;
    const title=customTitle || `${creating?'新增':'资料详情'} · ${pageName(key)}`;
    const state = { key, row, fields, identity, creating, values, readOnly, page:ui.page };
    if(['merchant','guide','activity','destination','ranking','shop','content','member','guide_routes','shop_specs'].includes(key)||key.startsWith('home_')) {
      fullEditor(title,groups,state);
    } else {
      let cursor=0;
      const body=groups.map(g=>`<section class="ux-form-section"><h3>${safe(g.title)}</h3><div class="form-grid">${g.fields.map(f=>fieldHTML(f,values[f.label],cursor++,readOnly)).join('')}</div></section>`).join('')+(window.AdminLists?.extraHTML(row,fields,aliases)||'');
      drawer(title,body,`<button class="btn btn-outline" data-prototype-close>${readOnly?'关闭':'取消'}</button>${!readOnly?'<button class="btn btn-primary" data-prototype-save>保存</button>':''}`);
      ui.drawer=state;
    }
    window.AdminRelations?.bind(ui.full?$('page'):document.querySelector('.ux-dialog'),()=>ui.drawer);
    bindCouponEditor(ui.full?$('page'):document.querySelector('.ux-dialog'),state);
    window.AdminExtensions?.afterEditor(state,ui.full?$('page'):document.querySelector('.ux-dialog'));
  }
  function fullEditor(title,groups,state) {
    ui.full=true;ui.drawer=state;
    const displayName=Object.values(state.values).find(v=>typeof v==='string'&&v.length>1)||title;
    const footer=`<div class="ux-footer"><span></span><div class="flex gap-2"><button class="btn btn-outline" data-prototype-close>${state.readOnly?'返回列表':'取消'}</button>${state.readOnly?'<button class="btn btn-primary" data-ux-edit>编辑资料</button>':'<button class="btn btn-primary" data-prototype-save>保存</button>'}</div></div>`;
    let n=0;
    const panels=groups.map((g,i)=>`<section class="ux-panel" data-panel="${i}" ${i?'hidden':''}><div class="ux-form-section"><h3>${safe(g.title)}</h3><div class="form-grid">${g.fields.map(f=>fieldHTML(f,state.values[f.label],n++,state.readOnly)).join('')}</div></div></section>`).join('');
    const imageField=state.fields.find(f=>/图|头像/.test(f.label)&&f.type==='图片');
    const aside=`<aside class="ux-editor-aside">${window.AdminLists?.extraHTML(state.row,state.fields,aliases)||''}<div class="ux-upload-preview">${ico(state.key==='guide'?'user':state.key==='shop'?'bag':'file')}<span>${imageField?safe(imageField.label)+'预览':'资料预览'}</span><small>尚未提供图片</small></div><div class="prototype-note">${state.readOnly?'当前为只读详情。':state.creating && state.key==='shop'?'先保存商品资料，再配置规格与库存。':state.creating && state.key==='guide'?'先保存向导资料，再新增路线。':'信息按任务分组；关联对象从已有资料中选择。'}</div></aside>`;
    let body;
    if(state.key==='content') {
      const mainFields=state.fields.filter(f=>['正文','行程节点'].includes(f.label));const rest=state.fields.filter(f=>!mainFields.includes(f));
      body=`<div class="ux-content-layout"><div class="ux-editor-main"><section class="ux-form-section"><h3>攻略内容</h3>${mainFields.map(f=>fieldHTML(f,state.values[f.label],state.fields.indexOf(f),state.readOnly)).join('')}</section></div><aside class="ux-editor-aside"><section class="ux-form-section"><h3>发布设置</h3><div class="form-grid">${rest.map(f=>fieldHTML(f,state.values[f.label],state.fields.indexOf(f),state.readOnly)).join('')}</div></section>${window.AdminLists?.extraHTML(state.row,state.fields,aliases)||''}</aside></div>`;
    } else if(state.key==='shop_specs') {
      body=`<div class="ux-record-summary"><span>规格独立配置价格与库存</span><span>最多 5 个规格</span></div><div class="ux-editor-grid"><div class="ux-editor-main">${panels}</div>${aside}</div>`;
    } else if(state.key.startsWith('home_')) {
      body=`<div class="ux-home-layout"><div class="ux-editor-main">${panels}</div><aside class="ux-editor-aside"><div class="ux-phone-preview"><div class="text-mut text-xs">小程序板块示意</div><h3 data-ux-live-title>${safe(state.values['板块名']||state.values['名称']||state.values['横条文案']||title)}</h3><p data-ux-live-sub>${safe(state.values['副标题']||'配置内容显示位置')}</p><div class="ux-upload-preview">图片 / 关联内容</div></div></aside></div>`;
    } else {
      const tabs=groups.map((g,i)=>`<button class="${i?'':'active'}" data-ux-tab="${i}">${safe(g.title.replace('（只读）',''))}</button>`).join('');
      body=`<div class="ux-tabs">${tabs}${state.key==='merchant'?'<button data-ux-records>到店核销</button>':''}${state.key==='guide'?`<button data-ux-child="guide_routes" ${state.creating?'disabled title="先保存向导资料，再新增路线"':''}>关联路线</button>`:''}${state.key==='shop'?`<button data-ux-child="shop_specs" ${state.creating?'disabled title="先保存商品资料，再配置规格"':''}>规格与库存</button>`:''}</div><div class="ux-editor-grid"><div class="ux-editor-main">${panels}</div>${aside}</div>`;
    }
    const entity=state.creating?'新建资料':state.values['商户名']||state.values['姓名']||state.values['商品名']||state.values['目的地名']||state.values['活动名']||state.values['标题']||state.values['榜单名']||displayName;
    $('page').innerHTML=`<div class="ux-screen" data-ux-key="${safe(state.key)}"><header class="ux-header"><button class="ux-back btn btn-outline" data-prototype-close>← 返回列表</button><div class="ux-heading"><h1>${safe(title)}</h1><div class="text-mut text-xs">${state.readOnly?'查看资料':'编辑资料'} · ${safe(pageName(state.page))}</div></div></header><div class="ux-identity"><div class="brand-logo">${safe(String(entity).slice(0,1))}</div><div><strong>${safe(entity)}</strong><div class="text-mut text-xs">${safe(state.values['状态']||'尚未设置状态')}</div></div></div>${body}${footer}</div>`;
    document.querySelector('.main').scrollTop=0;
    const root=$('page');
    root.querySelectorAll('[data-prototype-close]').forEach(b=>b.onclick=close);
    root.querySelectorAll('[data-prototype-save]').forEach(b=>b.onclick=save);
    root.querySelector('[data-ux-edit]')?.addEventListener('click',()=>editor(state.key,state.row,false,`编辑资料 · ${pageName(state.key)}`));
    root.querySelectorAll('[data-ux-tab]').forEach(b=>b.onclick=()=>{
      root.querySelectorAll('[data-ux-tab]').forEach(t=>t.classList.toggle('active',t===b));
      root.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==b.dataset.uxTab);
    });
    root.querySelector('[data-ux-records]')?.addEventListener('click',()=>related(state.row,'核销记录'));
    root.querySelector('[data-ux-child]')?.addEventListener('click',e=>childManager(state,e.currentTarget.dataset.uxChild));
    root.querySelectorAll('input,textarea').forEach(input=>input.addEventListener('input',()=>{
      const label=state.fields[Number(input.dataset.fieldIndex)]?.label;
      if(['板块名','名称','横条文案'].includes(label))root.querySelector('[data-ux-live-title]').textContent=input.value;
      if(label==='副标题'&&root.querySelector('[data-ux-live-sub]'))root.querySelector('[data-ux-live-sub]').textContent=input.value;
    }));
  }
  const childItems=new Map();
  function childManager(state,key) {
    const owner=state.row?.dataset.uxId;
    if(!owner || state.creating)return notice(key==='shop_specs'?'请先保存商品资料，再配置规格与库存':'请先保存向导资料，再新增路线');
    const items=childItems.get(`${owner}/${key}`)||[];
    drawer(key==='guide_routes'?'关联路线':'规格与库存', `<div class="flex between center mb-3"><span class="text-mut">${items.length} 条已有资料</span><button class="btn btn-primary" id="ux-new-child">新增${key==='guide_routes'?'路线':'规格'}</button></div><div id="ux-child-items">${items.map((item,i)=>`<div class="ux-child-row"><button class="prototype-module-item" data-child-index="${i}">${safe(item['路线名']||item['规格名'])}<span>编辑 →</span></button><div data-child-status="${i}">${window.AdminStatus?.render(key,item)||statusChip(item['状态']||'未设置')}</div></div>`).join('')||'<div class="empty">暂无关联资料</div>'}</div>`);
    const open=(item,index)=>{
      if(key==='shop_specs' && index===items.length && items.length>=5)return notice('一个商品最多配置 5 个规格');
      const parent=ui.full && ui.hostState===state?state:null;
      if(parent && !parent.readOnly)parent.values=collectEditorValues(parent,$('page'));
      const held=parent?{nodes:[...$('page').childNodes],scroll:document.querySelector('.main').scrollTop}:null;
      closeModalOnly();ui.hostState=null;
      const virtual=makeVirtualRow(state.page,`${owner}/${key}/${index}`,item);
      editor(key,virtual,index===items.length,`${index===items.length?'新增':'编辑'}${key==='guide_routes'?'路线':'规格'}`);
      Object.assign(ui.drawer,{owner,childIndex:index,childKey:`${owner}/${key}`,returnToChildren:()=>{
        if(parent){
          ui.full=true;ui.drawer=parent;ui.editKey=parent.key;
          $('page').replaceChildren(...held.nodes);document.querySelector('.main').scrollTop=held.scroll;
          ui.returnFocus=$('page').querySelector('[data-ux-child]');
        }else{
          navigate(state.page);
          state.row=[...$('page').querySelectorAll('tbody tr')].find(r=>r.dataset.uxId===owner)||state.row;
        }
        childManager(state,key);
      }});
    };
    $('ux-new-child').onclick=()=>open({},items.length);
    document.querySelectorAll('[data-child-index]').forEach(b=>b.onclick=()=>open(items[Number(b.dataset.childIndex)],Number(b.dataset.childIndex)));
    document.querySelectorAll('[data-child-status] [data-ux-state]').forEach(b=>b.onclick=()=>{
      const index=Number(b.closest('[data-child-status]').dataset.childStatus);
      const row=makeVirtualRow(state.page,`${owner}/${key}/${index}`,items[index]);
      requestStatus(row,key,{childKey:`${owner}/${key}`,childIndex:index,parentId:owner,parentStatus:rowData(state.row)['状态']||state.values?.['状态'],after:()=>childManager(state,key)});
    });
  }
  function closeModalOnly(){ $('modal-root').replaceChildren(); }
  function collectEditorValues(state,root) {
    const values={...state.values};
    root?.querySelectorAll('[data-field-index]').forEach(input=>{
      const field=state.fields[Number(input.dataset.fieldIndex)];
      if(!field || field.readonly || !input.matches('input,select,textarea') || input.hasAttribute('data-rel-label'))return;
      values[field.label]=input.type==='file'?(input.files.length?[...input.files].map(f=>f.name).join('、'):values[field.label]):input.value;
    });
    Object.assign(values,window.AdminRelations?.collect(root)||{});
    if(state.key==='coupon' && root?.querySelector('[data-period-field-index]')){
      values['生效期']=values['有效期类型']==='领取后 N 天有效'?{days:root.querySelector('#ux-period-days').value}:{start:root.querySelector('#ux-period-start').value,end:root.querySelector('#ux-period-end').value};
    }
    Object.assign(values,window.AdminExtensions?.collect(state,root)||{});
    if(state.key==='city')values['商圈列表']=Array.isArray(values['商圈列表'])?values['商圈列表']:String(values['商圈列表']||'').split(/\n|\s*·\s*/).map(x=>x.trim()).filter(Boolean);
    return values;
  }
  function couponErrors(state,values) {
    const errors=[],add=(label,message)=>errors.push({label,message});
    const empty=v=>v==null || (typeof v==='string'&&!v.trim()) || (Array.isArray(v)&&!v.length);
    for(const f of state.fields){
      if(f.readonly || f.label==='生效期')continue;
      const value=values[f.label];
      if(f.required && empty(value))add(f.label,`请填写${f.label}`);
      else if(!empty(value) && f.options?.length && !f.options.includes(value))add(f.label,`请选择有效的${f.label}`);
    }
    for(const label of ['优惠数值','使用门槛']){
      const v=values[label];if(!empty(v) && (!Number.isFinite(Number(v)) || Number(v)<0))add(label,`${label}须为不小于 0 的数字`);
    }
    if(values['优惠类型']==='满减' && empty(values['使用门槛']))add('使用门槛','满减券需填写使用门槛');
    if(values['优惠类型']==='折扣' && !empty(values['优惠数值']) && (Number(values['优惠数值'])<0.1 || Number(values['优惠数值'])>0.99))add('优惠数值','折扣数值须在 0.1–0.99 之间');
    for(const label of ['领取上限(人均)','库存']){
      const v=values[label];if(!empty(v) && (!Number.isInteger(Number(v)) || Number(v)<0))add(label,`${label}须为不小于 0 的整数`);
    }
    if(values['适用范围']?.startsWith('指定') && !values['指定对象']?.length)add('指定对象','请从已有资料中选择指定对象');
    const p=values['生效期']||{};
    if(values['有效期类型']==='领取后 N 天有效'){
      if(empty(p.days) || !Number.isInteger(Number(p.days)) || Number(p.days)<1)add('生效期','有效天数须为大于 0 的整数');
    }else if(values['有效期类型']==='固定日期'){
      const valid=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'') && Number.isFinite(Date.parse(s+'T00:00:00Z')) && new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
      if(!valid(p.end))add('生效期','请填写有效的到期日期');
      else if(p.start && !valid(p.start))add('生效期','请填写有效的开始日期');
      else if(p.start && p.start>p.end)add('生效期','开始日期不能晚于到期日期');
    }
    return errors;
  }
  function clearCouponError(root,label) {
    root?.querySelectorAll('[data-error-for]').forEach(group=>{
      if(group.dataset.errorFor!==label)return;
      group.querySelector('.ux-field-error')?.remove();
      group.querySelectorAll('[aria-invalid]').forEach(input=>{input.removeAttribute('aria-invalid');if(input.dataset.priorDescription)input.setAttribute('aria-describedby',input.dataset.priorDescription);else input.removeAttribute('aria-describedby');delete input.dataset.priorDescription;});
      delete group.dataset.errorFor;
    });
  }
  function paintCouponError(root,state,error,focus=false) {
    const index=state.fields.findIndex(f=>f.label===error.label);
    const field=root.querySelector(`[data-field-index="${index}"]`)||root.querySelector(`[data-period-field-index="${index}"]`);
    const group=field?.closest('.fg');if(!group)return;
    clearCouponError(root,error.label);group.dataset.errorFor=error.label;
    const message=document.createElement('div');message.className='ux-field-error';message.id=`ux-field-error-${index}`;message.setAttribute('role','alert');message.textContent=error.message;group.append(message);
    const inputs=[...group.querySelectorAll('input:not([type=hidden]),select,textarea,button')].filter(n=>!n.disabled&&n.getClientRects().length);
    inputs.forEach(input=>{input.dataset.priorDescription=input.getAttribute('aria-describedby')||'';input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby',message.id);});
    if(focus){group.scrollIntoView({block:'nearest'});inputs[0]?.focus();}
  }
  function save() {
    const state = ui.drawer;
    if (!state || state.readOnly || ROLE === 'boss') return;
    const root=ui.full?$('page'):document.querySelector('.ux-dialog');
    const values = collectEditorValues(state,root);
    const extensionErrors=window.AdminExtensions?.validate(state,values)||[];
    if(extensionErrors.length){extensionErrors.forEach((e,i)=>paintCouponError(root,state,e,i===0));return notice(extensionErrors[0].message);}
    if(state.key==='coupon'){
      state.fields.forEach(f=>clearCouponError(root,f.label));
      const errors=couponErrors(state,values);
      if(errors.length){errors.forEach((e,i)=>paintCouponError(root,state,e,i===0));return notice('请补齐或修正标出的资料');}
      for(const label of ['优惠数值','使用门槛','领取上限(人均)','库存'])if(values[label]!=='')values[label]=Number(values[label]);
      if(values['有效期类型']==='领取后 N 天有效')values['生效期']={days:Number(values['生效期'].days)};
    }
    const firstName = state.fields.find(f => /^(商户名|姓名|活动名|活动名称|目的地名|榜单名|商品名|商品名称|标题|券名|账号名|路线名|规格名|城市名|模板名)$/.test(f.label));
    if (firstName && !String(values[firstName.label] || '').trim()) return notice(`请填写${firstName.label}`);
    if(!state.creating && state.row && window.AdminStatus?.policies[state.key] && values['状态']!==state.values['状态'])return notice('请在列表状态列调整状态');
    if(state.creating && values['状态']==='冻结')return notice('请先保存商户资料，再在状态列填写冻结原因');
    if(state.creating && values['状态']==='上架' && ['merchant','guide','activity','shop'].includes(state.key)) {
      const error=AdminStatus.validate(state.key,{...values,'状态':'下架'},'上架');if(error)return notice(error);
    }
    if(state.key==='member_tags') {
      $('page').querySelectorAll('tbody tr').forEach(row=>{
        if(row.querySelector('input[type=checkbox]')?.checked) {
          const patch={...(rowPatches.get(row.dataset.uxId)||{}),'运营标签':values['运营标签']}; rowPatches.set(row.dataset.uxId,patch); patchRow(row,patch);
        }
      });
    }
    if(state.key==='guide_routes' && values['状态']==='上架' && state.owner){
      const parent=recordValues('guide',state.owner);
      if(!parent||parent['状态']!=='上架'||parent['实名审核']!=='已通过')return notice('所属向导须通过实名审核并上架后，路线才能上架');
    }
    if(state.childKey) {
      const items=childItems.get(state.childKey)||[];items[state.childIndex]=values;childItems.set(state.childKey,items);
      const childId=`${state.owner}/${state.key}/${state.childIndex}`;
      window.AdminRelations?.register(state.key,childId,values);
      window.AdminRelations?.commit?.(childId,values);
    }
    if(state.creating && state.key===state.page && ['merchant','guide','activity','destination','ranking','shop','content','coupon','notify','city','account'].includes(state.key)) {
      const items=addedRows.get(state.page)||[];
      const id=`${state.page}:demo-${Date.now()}`;
      items.push({id,values});addedRows.set(state.page,items);
      window.AdminRelations?.register(state.page,id,values);
      window.AdminRelations?.commit?.(id,values);
    }
    drafts.set(state.identity, values);
    if(state.key.startsWith('home_') || state.key.startsWith('promo_'))window.AdminRelations?.commit?.(`${state.key}:config`,values);
    if (state.row && state.key === state.page && !state.creating) {
      const patch = rowPatches.get(state.row.dataset.uxId) || {};
      state.fields.filter(f=>!f.readonly).forEach(f=>patch[f.label]=values[f.label]);
      rowPatches.set(state.row.dataset.uxId,patch);
      state.row.uxValues=values;
      window.AdminRelations?.rename(state.page,state.row.dataset.uxId,values);
      window.AdminRelations?.commit?.(state.row.dataset.uxId,values);
      patchRow(state.row,patch);
    }
    window.AdminExtensions?.afterSave(state,values);
    window.AdminExtensions?.recordChanged(state.key,state.row?.dataset.uxId||state.identity,state.values,values,'保存');
    recordOperation(state.creating?'新增资料':'保存资料',state.row?.dataset.uxId||state.identity,'资料已保存');
    close();
    if(state.creating && state.key==='coupon')navigate(state.page);
    notice(state.creating?'新增成功':'保存成功');
  }
  function patchRow(row, patch) {
    if(!row.closest('table'))return;
    const heads = [...row.closest('table').querySelectorAll('thead tr:first-child th')];
    for (const [label,value] of Object.entries(patch)) {
      const column = heads.findIndex(th => th.textContent.trim() === label || (aliases[label] || []).includes(th.textContent.trim()));
      if (column < 0 || value === '' || /图片|挂载|上榜项|电话/.test(label)) continue;
      const cell = row.cells[column];
      if (!cell || cell.classList.contains('row-acts')) continue;
      delete cell.dataset.listValue;
      const target = cell.querySelector('.ux-row-title') || cell.querySelector('.cell-m') || cell.querySelector('.chip') || cell;
      if (label === '会员卡折扣') target.textContent = `${(Number(value)*10).toFixed(1)}折`;
      else if (/人均消费/.test(label)) target.textContent = `¥${value}`;
      else if(label==='状态') cell.innerHTML=statusChip(String(value));
      else if(!Array.isArray(value)) target.textContent = typeof value==='string'&&/^[a-z_]+:/.test(value)?window.AdminRelations?.label(value)||value:value;
    }
    if(row.dataset.uxId?.startsWith('coupon:')){
      const values={...(row.uxValues||{}),...patch};
      const set=(label,text)=>{const index=heads.findIndex(th=>th.textContent.trim()===label),cell=row.cells[index];if(cell){cell.textContent=text;cell.dataset.listValue=text;}};
      set('规则',couponRuleText(values));set('有效期',couponValidityText(values));set('适用范围',couponScopeText(values));
      set('领取上限',`${values['领取上限(人均)']} 张/人`);
      set('库存/已领',`${row.uxMeta?.claimed||0}/${values['库存']}`);
    }
  }
  function readRow(row, title) {
    if(window.AdminExtensions?.openRecord(ui.page,row,title))return;
    const data = rowData(row);
    const main=['order','checkin'].includes(ui.page);
    const content=`<div class="ux-record-summary">${Object.entries(data).slice(0,3).map(([k,v])=>`<div><small>${safe(k)}</small><strong>${safe(v)}</strong></div>`).join('')}</div><div class="ux-read-grid">${Object.entries(data).slice(3).map(([k,v])=>`<div><dt>${safe(k)}</dt><dd>${safe(v).replace(/\n/g,'<br>')}</dd></div>`).join('')}</div>`;
    if(main) {
      ui.full=true;ui.drawer=null;
      $('page').innerHTML=`<div class="ux-screen"><header class="ux-header"><button class="btn btn-outline" data-prototype-close>← 返回列表</button><div class="ux-heading"><h1>${safe(title)}</h1><div class="text-mut text-xs">业务记录只读，不改写历史数据</div></div></header>${content}</div>`;
      $('page').querySelector('[data-prototype-close]').onclick=close;
    } else drawer(title,content);
  }
  function recordList(title, labels, records) {
    const content = `<div class="tbl-scroll"><table class="tbl"><thead><tr>${labels.map(k=>`<th>${safe(k)}</th>`).join('')}</tr></thead><tbody>${records.map(r=>`<tr>${labels.map(k=>`<td>${safe(r[k])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${records.length?'':'<div class="empty"><h3>暂无记录</h3><div>当前没有相关记录。</div></div>'}`;
    drawer(title,content);
    document.querySelector('.ux-dialog').style.width='900px';
    window.AdminLists?.apply(ui.page,document.querySelector('.ux-dialog'));
  }
  function related(row, text) {
    const index = rowIndex(row);
    if (text === '核销记录') {
      if(window.AdminDemoCheckin)return window.AdminDemoCheckin.listForMerchant(row.dataset.uxId);
      const name = row.uxValues?.['商户名'] || DATA.merchants[index]?.name;
      return recordList(`到店核销数据 · ${name}`,['核销编号','会员','打卡时间','评价确认','异常标记'],DATA.checkins.filter(c=>c.merch===name).map(c=>({'核销编号':c.id,'会员':c.user,'打卡时间':c.time,'评价确认':c.reviewed?'已确认':'待确认','异常标记':c.flag||'—'})));
    }
    if (text === '路线') return childManager({page:ui.page,row},'guide_routes');
    if (text === '规格') return childManager({page:ui.page,row},'shop_specs');
    if (text === '报名列表') return recordList(`报名列表 · ${DATA.activities[index]?.name || ''}`,['报名用户','下单时间','支付状态','金额','联系电话','备注','是否已加向导微信'],[]);
    if (ui.page==='member') return editor('member',row,false,'会员资料',true);
    return readRow(row, `${text} · ${pageName(ui.page)}`);
  }
  const help = {
    '批量生成':'创建一批带来源参数的推广码。',
    '渠道类型管理':'维护推广码的渠道类型，生成推广码时可直接选择。',
    '落地页模板':'配置推广码进入小程序后的通用落地页。',
    '全部标记已读':'当前提醒的已读状态暂不可更新。审核和售后处理不受影响。',
    '地图选点':'地图服务暂不可用，请填写地图坐标。',
    '下载':'暂无可下载的二维码图片。',
    '处理':'暂无可查看的处理记录。'
  };
  function exportPreview() {
    const tables = [...$('page').querySelectorAll('table')];
    const lines = tables.map(t => [...t.rows].filter(r=>!r.hidden).map(r=>[...r.cells].filter(c=>getComputedStyle(c).display!=='none' && !c.classList.contains('row-acts')).map(c=>c.innerText.trim()).join(' | ')).join('\n')).join('\n\n');
    const content = lines || $('page').innerText;
    drawer('导出预览', `<pre class="prototype-export">${safe(content)}</pre>`);
  }
  const stateLogs=[];
  function statusContext(row,key=ui.page,extra={}) {
    if(!row)return null;
    const values={...rowData(row),...seedFields(key,row,fieldsFor(key)),...(row.uxValues||{})};
    return {row,key,id:row.dataset.uxId,values,...extra};
  }
  function commitStatus(ctx,target,reason='') {
    const child=ctx.childKey?childItems.get(ctx.childKey)?.[ctx.childIndex]:null;
    const current={...ctx.values,...(rowPatches.get(ctx.id)||{}),...(ctx.row.uxValues||{}),...(child||{})};
    const parentStatus=ctx.parentId?(rowPatches.get(ctx.parentId)?.['状态']||ctx.parentStatus):ctx.parentStatus;
    const error=AdminStatus.validate(ctx.key,current,target,{...ctx,parentStatus});
    if(error){notice(error);return false;}
    if(AdminStatus.needsReason(ctx.key,target)&&!reason.trim()){notice('请填写操作原因');return false;}
    const from=current['状态'];if(from===target)return false;
    const values={...current,'状态':target};ctx.row.uxValues=values;ctx.values=values;
    if(ctx.childKey) {
      const items=childItems.get(ctx.childKey)||[];items[ctx.childIndex]=values;childItems.set(ctx.childKey,items);
    } else rowPatches.set(ctx.id,{...(rowPatches.get(ctx.id)||{}),'状态':target});
    for(const [id,draft] of drafts)if(id.endsWith('/'+ctx.id))drafts.set(id,{...draft,'状态':target});
    window.AdminRelations?.rename(ctx.key,ctx.id,{'状态':target});
    if(ctx.key==='guide' && target==='下架') {
      const children=childItems.get(`${ctx.id}/guide_routes`)||[];
      children.forEach((item,i)=>{item['状态']='下架';AdminRelations.rename('guide_routes',`${ctx.id}/guide_routes/${i}`,{'状态':'下架'});for(const [id,draft]of drafts)if(id.endsWith(`/${ctx.id}/guide_routes/${i}`))drafts.set(id,{...draft,'状态':'下架'});});
    }
    const cell=[...(ctx.row.cells||[])].find((c,i)=>ctx.row.closest('table')?.querySelectorAll('th')[i]?.textContent.trim()==='状态');
    let control,focused=false;
    if(cell){
      focused=cell.contains(document.activeElement);const restoreFocus=cell.contains(ui.returnFocus);
      cell.dataset.listValue=target;cell.innerHTML=AdminStatus.render(ctx.key,values);control=cell.querySelector('[data-ux-state]');
      control?.addEventListener('click',()=>requestStatus(ctx.row,ctx.key));if(restoreFocus)ui.returnFocus=control;
    }
    if(ctx.key==='city')ctx.row.style.opacity=target==='停用'?'.6':'';
    ctx.row.closest('table')?.uxFilter?.();
    if(focused){if(!ctx.row.hidden)control?.focus();else ctx.row.closest('.card')?.querySelector('.tbar input')?.focus();}
    stateLogs.unshift({'时间':new Date().toLocaleString('sv-SE'),'账号':ROLES[ROLE].person,'操作类型':AdminStatus.action(ctx.key,target,from),'操作对象':ctx.id,'前后差异摘要':`${from} → ${target}${reason?'；原因：'+reason.trim():''}`});
    window.AdminExtensions?.recordChanged(ctx.key,ctx.id,{...values,'状态':from},values,'状态');
    notice(`已${AdminStatus.action(ctx.key,target,from)}`);
    return from;
  }
  function requestStatus(row,key=ui.page,extra={}) {
    const ctx=statusContext(row,key,extra);if(!ctx || !AdminStatus.allowed(key))return;
    const policy=AdminStatus.policies[key];if(!policy)return;
    const current=ctx.values['状态'];
    if(!policy.states.includes(current))return notice('当前状态需先完成对应业务流程');
    let target=AdminStatus.next(key,current)|| (current==='上架'||current==='冻结'?'下架':'上架');
    if(policy.mode==='direct') {
      const from=commitStatus(ctx,target);if(!from)return;
      ctx.after?.();
      const node=$('prototype-feedback'),undo=document.createElement('button');undo.className='ux-undo';undo.textContent='撤销';
      undo.onclick=()=>{if(ctx.values['状态']!==target)return;commitStatus(ctx,from);ctx.after?.();};node?.append(undo);return;
    }
    const choice=policy.states.length>2;
    if(!choice){const error=AdminStatus.validate(key,ctx.values,target,ctx);if(error)return notice(error);}
    const body=`<p class="prototype-explain">${safe(row.querySelector('.ux-row-title')?.textContent||ctx.values['商户名']||ctx.values['姓名']||ctx.values['账号']||ctx.values['昵称 / 头像 / 手机号']?.split('/')[0]||ctx.id)}</p>${choice?`<div class="fg"><label for="ux-state-target">目标状态</label><select class="fld" id="ux-state-target">${policy.states.map(s=>`<option ${s===target?'selected':''}>${safe(s)}</option>`).join('')}</select></div>`:''}<p id="ux-state-effect" class="text-mut text-sm mt-3"></p><div class="fg mt-3" id="ux-state-reason-group"><label for="ux-state-reason" id="ux-state-reason-label">操作原因 <span class="req">*</span></label><textarea class="fld" id="ux-state-reason" rows="3" placeholder="请填写原因"></textarea></div>`;
    drawer(choice?'调整商户状态':`确认${AdminStatus.action(key,target,current)}`,body,'<button class="btn btn-outline" data-prototype-close>取消</button><button class="btn btn-primary" id="ux-state-confirm">确认</button>');
    const dialog=document.querySelector('.ux-dialog');dialog.classList.add('small');
    const cancel=()=>{close();ctx.after?.();};dialog.querySelectorAll('[data-prototype-close]').forEach(b=>b.onclick=cancel);
    document.querySelector('.ux-dialog-mask').onclick=e=>{if(e.target===e.currentTarget)cancel();};
    const refresh=()=>{
      target=$('ux-state-target')?.value||target;
      const error=AdminStatus.validate(key,ctx.values,target,ctx);
      $('ux-state-effect').textContent=error||AdminStatus.explanation(key,target,current);
      const required=AdminStatus.needsReason(key,target);$('ux-state-reason-group').hidden=!required;$('ux-state-reason').required=required;
      $('ux-state-reason-label').firstChild.textContent=`${AdminStatus.action(key,target,current)}原因 `;
      $('ux-state-confirm').textContent=`确认${AdminStatus.action(key,target,current)}`;$('ux-state-confirm').disabled=target===current||!!error;
    };
    $('ux-state-target')?.addEventListener('change',refresh);refresh();
    $('ux-state-confirm').onclick=()=>{const reason=$('ux-state-reason').value;if(commitStatus(ctx,target,reason)){close();ctx.after?.();}};
  }
  function statusPreview(row,target) { return requestStatus(row,ui.page); }
  function renderStateLogs() {
    const table=$('page').querySelector('table'),body=table?.tBodies[0];if(!body)return;
    const labels=[...table.querySelectorAll('th')].map(h=>h.textContent.trim());
    for(const entry of [...stateLogs].reverse()){const tr=document.createElement('tr');tr.innerHTML=labels.map(k=>`<td>${safe(entry[k]||'—')}</td>`).join('');body.prepend(tr);}
  }
  function buttonAction(button) {
    const text=button.textContent.trim().replace(/\s+/g,' ');
    const row=button.closest('tbody tr');
    if(window.AdminExtensions?.handleAction(button,{page:ui.page,row,text}))return;
    if(button.dataset.uxState) return requestStatus(row,button.dataset.uxState);
    if (text.includes('导出')) return exportPreview();
    if(text==='处理 →') {
      const item=button.parentElement.innerText;
      if(item.includes('向导实名')||item.includes('用户自发起活动')||item.includes('评价')) return navigate('review');
      if(item.includes('成团未达标')) return navigate('activity');
      if(item.includes('打卡告警')) return navigate('checkin');
      if(item.includes('客诉')||item.includes('退款')) return navigate('order');
      if(item.includes('群码')) return navigate('group_qr');
      return info('评价审核','暂无可查看的评价记录。');
    }
    if(button.hasAttribute('data-record-log')) return recordList('AI问答日志',['用户问题','AI答复','用户是否满意','时间','是否兜底转人工'],[]);
    if(button.dataset.schemaKey) return editor(button.dataset.schemaKey,null,false,button.dataset.editorTitle || text);
    if (text==='运营维护' && row) return editor('member',row,false,'运营维护');
    if (text==='编辑') {
      if (ui.page==='checkin' && !row) return ruleEditor();
      if (ui.page==='service') return editor('service',null,false,'客服与向导配置');
      return editor(ui.page,row,false,`编辑资料 · ${pageName(ui.page)}`);
    }
    if (['查看','详情','明细','核销记录','路线','规格','报名列表'].includes(text) && row) return related(row,text);
    if (/新增|新建|发布活动/.test(text)) return editor(ui.page,null,true,`${text} · ${pageName(ui.page)}`);
    if (text==='核销规则配置') return ruleEditor();
    if (text==='批量生成') return editor('promo_batch',null,true,'批量生成推广码');
    if (text==='渠道类型管理') return editor('promo_channel',null,false,'渠道类型配置');
    if (text==='落地页模板') return editor('promo_landing',null,false,'通用落地页配置');
    if (text==='替换新码') return uploadQR();
    if (['启用','停用','下架','上架'].includes(text)) return statusPreview(row,text);
    if (text==='批量打标签') {
      const selected=[...$('page').querySelectorAll('tbody tr')].filter(r=>r.querySelector('input[type=checkbox]')?.checked);
      if(!selected.length) return notice('请先勾选要打标签的会员');
      return editor('member_tags',null,false,`批量打标签 · 已选${selected.length}位会员`);
    }
    if (text.includes('查看全部')) {
      const isTodo=button.closest('.card')?.innerText.includes('待办');
      if(ROLE==='boss') return info(isTodo?'风险摘要':'商户到店排行',isTodo?'这里展示运营待办的只读摘要，处理由运营完成。':'排行已在当前看板下方展示，管理层无需进入商户编辑列表。');
      return navigate(isTodo?'todo':'merchant');
    }
    if((!text||text==='更多') && row) return moreMenu(row,button);
    if(help[text]) return info(text,help[text]);
    return info(text || '通知', '当前没有可处理的内容。');
  }
  function moreActions(row) {
    const resources=['merchant','guide','activity','destination','ranking','shop','content'];
    const inline=[...row.querySelectorAll('.row-acts button')].map(b=>b.textContent.trim());
    const actions=[];
    if(!row.querySelector('.ux-row-title') && !inline.some(t=>['查看','详情','明细'].includes(t))) actions.push(['查看详情',()=>editor(ui.page,row,false,`资料详情 · ${pageName(ui.page)}`,true)]);
    if(resources.includes(ui.page)) {
      if(!inline.includes('编辑'))actions.push(['编辑资料',()=>editor(ui.page,row,false,`编辑资料 · ${pageName(ui.page)}`)]);
      actions.push(['删除',()=>removePreview(row),true]);
    } else if(['coupon','notify','city','account'].includes(ui.page)) {
      if(!inline.includes('编辑'))actions.push(['编辑资料',()=>editor(ui.page,row,false,`编辑资料 · ${pageName(ui.page)}`)]);
      actions.push(['删除',()=>removePreview(row),true]);
    } else if(ui.page==='member' && !inline.includes('运营维护')) actions.push(['运营维护',()=>editor('member',row,false,'运营维护')]);
    return actions;
  }
  function moreMenu(row,anchor) {
    document.querySelector('.ux-popover')?.remove();
    const actions=moreActions(row);
    if(!actions.length)return;
    const menu=document.createElement('div');menu.className='ux-popover';menu.setAttribute('role','menu');
    menu.innerHTML=actions.map(([title,fn,danger],i)=>`<button class="ux-menu-item ${danger?'danger':''}" role="menuitem" data-menu-action="${i}">${safe(title)}</button>`).join('');document.body.append(menu);
    const rect=(anchor||row.querySelector('button')).getBoundingClientRect();
    menu.style.left=`${Math.max(8,Math.min(innerWidth-180,rect.right-170))}px`;menu.style.top=`${Math.min(innerHeight-menu.offsetHeight-8,rect.bottom+6)}px`;
    menu.querySelectorAll('button').forEach(b=>b.onclick=()=>{menu.remove();actions[Number(b.dataset.menuAction)][1]();});
    menu.querySelector('button').focus();
  }
  function removePreview(row) {
    const page=ui.page,id=row.dataset.uxId;
    const state=rowData(row)['状态']||row.uxValues?.['状态'];
    const isNew=id?.includes('demo-');
    const blocked=(!isNew)||['上架','启用'].includes(state)||window.AdminRelations?.hasReferences(page,id);
    drawer('删除资料', `<p class="prototype-explain">${safe(rowData(row)[Object.keys(rowData(row))[0]]||pageName(page))}</p><p>${blocked?'这条资料不支持直接删除。请下架或停用，以保留已有业务记录。':'确定删除这条资料吗？'}</p>`, `<button class="btn btn-outline" data-prototype-close>取消</button>${blocked?'':'<button class="btn btn-primary" id="ux-confirm-delete">确认删除</button>'}`);
    document.querySelector('.ux-dialog').classList.add('small');
    document.getElementById('ux-confirm-delete')?.addEventListener('click',()=>{removedRows.add(id);window.AdminRelations?.remove(page,id);close();navigate(page);notice('删除成功');});
  }
  function uploadQR() {
    drawer('替换官方社群二维码','<div class="fg"><label for="prototype-qr-file">二维码图片</label><input id="prototype-qr-file" class="fld" type="file" accept="image/*"><div class="hint">请选择清晰的二维码图片。</div></div><img id="prototype-qr-preview" alt="所选二维码图片预览" hidden>','<button class="btn btn-outline" data-prototype-close>取消</button><button class="btn btn-primary" id="prototype-qr-confirm">保存</button>');
    $('prototype-qr-file').onchange=()=>{const file=$('prototype-qr-file').files[0];if(file){const preview=$('prototype-qr-preview');preview.src=URL.createObjectURL(file);preview.hidden=false;}};
    $('prototype-qr-confirm').onclick=()=>{if(!$('prototype-qr-file').files.length)return notice('请先选择图片');close();notice('已选择二维码图片');};
  }
  function ruleEditor() {
    const groups=fieldsFor('checkin_rules');
    if(groups.length) return editor('checkin_rules',null,false,'到店核销规则');
    return info('到店核销规则','店内静态二维码 + 事后评价确认。');
  }
  const catalog = new Map();
  let catalogReady=false;
  function stableId(page,row,index) {
    const array=({merchant:DATA.merchants,guide:DATA.guides,activity:DATA.activities,shop:DATA.products,member:DATA.members,checkin:DATA.checkins,promo:DATA.promos})[page];
    if(array?.[index]?.id)return `${page}:${array[index].id}`;
    const data=rowData(row);return `${page}:${data.ID||data['订单号']||data['账号']||data['代码']||index}`;
  }
  function initializeCatalog() {
    if(catalogReady || !window.AdminRelations)return;
    const page=$('page'),top=$('topbar');const keep=[...page.childNodes],head=[...top.childNodes];
    for(const id of ['merchant','guide','activity','shop','member','destination','ranking','content','coupon','city','account','promo','order']) {
      PAGES[id]();
      const rows=[...page.querySelector('table')?.querySelectorAll('tbody tr')||[]];
      const entries=rows.map((row,i)=>{row.dataset.prototypeIndex=i;const values={...rowData(row),...seedFields(id,row,fieldsFor(id))};
        if(id==='city') {
          values['城市名']=String(values['城市名']||values['城市']||'').replace(/^[^\u4e00-\u9fffA-Za-z]+/,'');
          values['商圈列表']=values['商圈']||'';
          if(values['城市名']==='乌鲁木齐')values['商圈列表']=['大巴扎商圈','新市区','南门商圈','高新区','水磨沟区','红山'];
        }
        return {id:stableId(id,row,i),values};});
      catalog.set(id,entries);if(id!=='order')window.AdminRelations.capture(id,entries);
    }
    page.replaceChildren(...keep);top.replaceChildren(...head);catalogReady=true;
  }
  function makeVirtualRow(page,id,values) {
    const row=document.createElement('tr');row.dataset.uxId=id;row.uxValues=values;row.dataset.prototypeIndex='0';row.dataset.prototypeTable='0';
    return row;
  }
  function normalizeRows(page) {
    $('page').querySelectorAll('table').forEach((table,ti)=>{
      const body=table.querySelector('tbody');if(!body)return;
      body.querySelectorAll('tr').forEach((row,i)=>{
        row.dataset.prototypeIndex=i;row.dataset.prototypeTable=ti;row.dataset.uxId=stableId(page,row,i);
        const seeded=recordValues(page,row.dataset.uxId);if(seeded){row.uxValues=seeded;patchRow(row,seeded);}
        const patch=rowPatches.get(row.dataset.uxId);if(patch){row.uxValues={...seedFields(page,row,fieldsFor(page)),...patch};patchRow(row,patch);}
      });
      if(ti===0)for(const item of addedRows.get(page)||[]) {
        if(removedRows.has(item.id))continue;
        const row=makeVirtualRow(page,item.id,item.values);
        const heads=[...table.querySelectorAll('thead tr:first-child th')];
        heads.forEach(head=>{
          const cell=document.createElement('td'),label=head.textContent.trim();
          if(head.querySelector('input[type=checkbox]'))cell.innerHTML='<input type="checkbox">';
          else if(label==='操作'){cell.className='row-acts';cell.innerHTML='<button class="btn btn-ghost">编辑</button>';}
          else {
            const name=Object.keys(item.values).find(k=>k===label||(aliases[k]||[]).includes(label));
            cell.textContent=label==='ID'?item.id.split(':').at(-1):name?(Array.isArray(item.values[name])?item.values[name].map(v=>window.AdminRelations?.label(v)||v).join('、'):String(item.values[name])):'—';
            if(label==='状态')cell.innerHTML=statusChip(String(item.values['状态']||'下架'));
          }row.append(cell);
        });
        rowPatches.has(item.id)&&Object.assign(row.uxValues,rowPatches.get(item.id));
        body.append(row);patchRow(row,row.uxValues);
      }
      body.querySelectorAll('tr').forEach(row=>{
        if(removedRows.has(row.dataset.uxId)){row.remove();return;}
        const controls=row.querySelector('.row-acts');
        if(controls) {
          controls.querySelectorAll('button').forEach(b=>{if(!b.textContent.trim()){b.textContent='更多';b.classList.remove('btn-icon');b.setAttribute('aria-haspopup','menu');}});
          if(['merchant','guide','activity','shop','destination','ranking','content','coupon','notify','city','account'].includes(page)&&![...controls.querySelectorAll('button')].some(b=>b.textContent.trim()==='更多')) {
            const b=document.createElement('button');b.className='btn btn-ghost';b.textContent='更多';b.setAttribute('aria-haspopup','menu');controls.append(b);
          }
        }
        if(['merchant','guide','activity','shop','destination','ranking','content','member'].includes(page)) {
          const heads=[...table.querySelectorAll('th')];const c=heads.findIndex(h=>/^(商户|向导|活动|商品|目的地|榜单|标题|会员)$/.test(h.textContent.trim()));
          const cell=row.cells[c];if(cell){const target=cell.querySelector('.cell-m')||cell;const values=seedFields(page,row,fieldsFor(page));const title=values['商户名']||values['姓名']||values['活动名']||values['商品名']||values['目的地名']||values['榜单名']||values['标题']||values['昵称 / 头像 / 手机号']?.split('/')[0].trim()||target.textContent;const b=document.createElement('button');b.className='ux-row-title';b.textContent=title;b.onclick=()=>editor(page,row,false,`${title} · 资料详情`,true);target.replaceChildren(b);}
        }
      });
    });
  }
  function bindPage(id) {
    ui.full=false;ui.page=id;close();
    window.AdminDemoData?.ensure();
    const rendered=window.AdminExtensions?.renderPage(id);
    if(id==='home' && !rendered) homeConfig();
    if(id==='service' && !rendered) serviceConfig();
    if(id==='oplog') renderStateLogs();
    initializeCatalog();
    normalizeRows(id);
    window.AdminLists?.apply(id);
    $('page').querySelectorAll('button').forEach(button=> {
      if(button.classList.contains('ux-row-title')) return;
      if(button.classList.contains('pag-btn')) {button.onclick=()=>notice('已显示全部记录');return;}
      const row=button.closest('tbody tr');
      if(row&&button.getAttribute('aria-haspopup')==='menu'){
        const actions=moreActions(row);
        if(actions.length===1){
          button.textContent=actions[0][0];
          button.removeAttribute('aria-haspopup');button.removeAttribute('aria-label');
          button.onclick=actions[0][1];return;
        }
      }
      button.onclick=()=>buttonAction(button);
    });
    $('page').querySelectorAll('.tab').forEach(tab=>{
      tab.setAttribute('role','button');tab.tabIndex=0;
      const action=()=> {
        const text=tab.textContent.trim();
        if(text.includes('榜单')) return navigate('ranking');
        if(text.includes('美食地图')) {navigate('ranking');notice('美食地图由玩法榜单的“必吃美食”类型展示');return;}
        if(/订单|售后/.test(text)) {navigate('order');notice(text.includes('售后')?'请在订单详情中查看售后状态':'订单统一在订单管理查看');return;}
        if(id==='notify' && text.includes('企微')) return info('企微群推送','大促、运营通告和活动预告，由运营在企业微信后台手动发送。');
        if(id==='notify' && text.includes('发送记录')) return recordList('发送记录',['发送时间','接收用户','模板名','状态','失败原因'],[]);
        tab.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t===tab));
        notice('已显示当前列表');
      };
      tab.onclick=action;tab.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();action();}};
    });
    $('page').querySelectorAll('.tbl thead input[type=checkbox]').forEach(input=> {
      input.setAttribute('aria-label','全选当前列表');
      input.onchange=()=> input.closest('table').querySelectorAll('tbody tr:not([hidden]) input[type=checkbox]').forEach(c=>c.checked=input.checked);
    });
    $('page').querySelectorAll('.tbl tbody input[type=checkbox]').forEach(input=>input.setAttribute('aria-label','选择当前记录'));
    if(id==='compliance') {
      const heading=$('page').querySelector('.pg-hd .sub');
      heading.textContent='查看安全机制与服务状态。';
    }
    $('page').querySelectorAll('.switch input').forEach(input=>input.onchange=()=>notice('已更新开关设置'));
    bindFilters();
    const search=document.querySelector('.search-box');
    if(search){search.tabIndex=0;search.setAttribute('role','button');search.onclick=moduleSearch;search.onkeydown=e=>{if(e.key==='Enter')moduleSearch();};}
    const bell=document.querySelector('.tb-r>.btn');
    if(bell){bell.setAttribute('aria-label','查看提醒');bell.onclick=()=>navigate(ROLE==='boss'?'risk':'todo');}
    $('page').querySelectorAll('.pg-hd-r select,.card-hd select').forEach(select=>select.onchange=()=>notice('已选择筛选条件'));
    window.AdminExtensions?.bindPage(id);
  }
  function configCards(key, title) {
    let groups=fieldsFor(key);
    if(key==='home_0' && ROLE!=='admin') groups=groups.map(g=>({...g,fields:g.fields.filter(f=>!f.label.startsWith('天气'))}));
    return `<div class="card mb-4"><div class="card-hd"><div class="card-t">${safe(title)}</div><button class="btn btn-outline btn-sm" data-schema-key="${key}" data-editor-title="${safe(title)}">编辑</button></div><div class="card-bd pd"><div class="text-mut text-sm">${safe(groups.flatMap(g=>g.fields.map(f=>f.label)).join(' / '))}</div></div></div>`;
  }
  function homeConfig() {
    const groups=fieldsFor('home');
    if(!groups.length)return;
    const quick=['快捷入口 1','快捷入口 2','快捷入口 3','快捷入口 4'];
    const boards=['只有新疆才有','本地人带你玩','和大家一起玩','把新疆味道带回家'];
    const blocks=(items,group)=>items.map((title,i)=>{const key=`home_${group}_${i}`;schema[key]={groups:[schema.home.groups[group]]};return `<button class="btn btn-outline" data-schema-key="${key}" data-editor-title="${safe(title)}">${safe(title)}</button>`;}).join('');
    $('page').innerHTML=`<div class="pg-hd"><div><h1>首页配置</h1><div class="sub">维护主图、会员卡横条、快捷入口和四大板块。</div></div></div>${configCards('home_0','顶部主图区')}${configCards('home_1','会员卡横条')}<div class="card mb-4"><div class="card-hd"><div class="card-t">四个快捷入口</div></div><div class="card-bd pd flex gap-2" style="flex-wrap:wrap">${blocks(quick,2)}</div></div><div class="card mb-4"><div class="card-hd"><div class="card-t">四大板块内容池</div></div><div class="card-bd pd flex gap-2" style="flex-wrap:wrap">${blocks(boards,3)}</div></div>`;
  }
  function serviceConfig() {
    const groups=fieldsFor('service');
    if(!groups.length)return;
    $('page').innerHTML=`<div class="pg-hd"><div><h1>客服 + AI 向导</h1><div class="sub">自动应答与转人工入口配置</div></div></div>${groups.map((g,i)=>configCards(`service_${i}`,g.title)).join('')}<div class="card"><div class="card-bd pd flex gap-2"><button class="btn btn-outline">导出知识库预览</button><button class="btn btn-outline" data-record-log>查看问答日志</button></div></div>`;
  }
  function bindFilters() {
    $('page').querySelectorAll('.card').forEach(card=> {
      const table=card.querySelector('table');const bar=card.querySelector('.tbar');if(!table||!bar)return;
      const rows=[...table.querySelectorAll('tbody tr')];const input=bar.querySelector('input');const selects=[...bar.querySelectorAll('select')];
      const existingPag=card.querySelector('.pag');
      const count=document.createElement('div');count.className='prototype-count';count.textContent=`共 ${rows.length} 条记录`;
      if(existingPag)existingPag.replaceWith(count);else card.append(count);
      const empty=document.createElement('div');empty.className='empty';empty.hidden=true;empty.textContent='没有符合条件的记录';table.parentElement.after(empty);
      function filter() {
        const query=input?.value.trim().toLowerCase()||'';
        const conditions=selects.map(s=>s.selectedIndex? s.value:'').filter(Boolean);
        let matches=0;
        rows.forEach(row=> {
          const data=Object.values(rowData(row)).join(' ').toLowerCase();
          row.hidden=!(data.includes(query)&&conditions.every(v=>data.includes(v.toLowerCase())));
          if(!row.hidden)matches++;
        });
        empty.hidden=matches>0;count.textContent=`显示 ${matches} / ${rows.length} 条记录`;
      }
      table.uxFilter=filter;
      if(input){input.setAttribute('aria-label',input.placeholder||'搜索记录');input.oninput=filter;}
      selects.forEach(s=>{s.setAttribute('aria-label',s.options[0]?.text||'筛选');s.onchange=filter;});
    });
  }
  function moduleSearch() {
    drawer('查找功能','<div class="fg"><label for="prototype-module-query">功能名称</label><input class="fld" id="prototype-module-query" placeholder="例如：商户、订单、客服"></div><div id="prototype-module-results"></div>');
    const input=$('prototype-module-query');
    const refresh=()=> {
      const allowed=ROLE_MENU[ROLE];
      const items=MENU.flatMap(g=>g.items).filter(it=>allowed.includes(it.id)&&it.n.includes(input.value));
      $('prototype-module-results').innerHTML=items.map(it=>`<button class="prototype-module-item" data-module="${it.id}">${safe(it.n)} <span>进入 →</span></button>`).join('')||'<div class="empty">没有可见的匹配功能</div>';
      $('prototype-module-results').querySelectorAll('button').forEach(b=>b.onclick=()=>{close();navigate(b.dataset.module);});
    };input.oninput=refresh;refresh();input.focus();
  }
  document.addEventListener('change',e=>{
    const input=e.target;
    if(input.matches('[data-field-index][type=file]')) {
      input.nextElementSibling.textContent=[...input.files].map(f=>f.name).join('、')||'尚未选择文件';
      const file=input.files[0];const image=document.querySelector('.ux-editor-aside .ux-upload-preview');
      if(file?.type.startsWith('image/')&&image){image.replaceChildren();const preview=document.createElement('img');preview.src=URL.createObjectURL(file);preview.alt='所选图片预览';image.append(preview);}
    }
  });
  document.addEventListener('keydown',e=>{
    const box=document.querySelector('.ux-dialog');
    if(e.key==='Escape'&&document.querySelector('.ux-popover')){document.querySelector('.ux-popover').remove();return;}
    if(e.key==='Escape'&&box){e.preventDefault();close();return;}
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();moduleSearch();return;}
    if(e.key!=='Tab'||!box)return;
    const list=[...box.querySelectorAll('button,input,select,textarea,summary,[tabindex="0"]')].filter(n=>!n.disabled&&n.getClientRects().length);
    const first=list[0],last=list.at(-1);
    if(e.shiftKey&&(document.activeElement===first||document.activeElement===box)){e.preventDefault();last?.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
  });
  document.addEventListener('pointerdown',e=>{const menu=document.querySelector('.ux-popover');if(menu&&!menu.contains(e.target)&&!e.target.closest('[aria-haspopup=menu]'))menu.remove();});
  const copyRecord=value=>JSON.parse(JSON.stringify(value));
  function records(page) {
    initializeCatalog();
    const list=[];
    if(['guide_routes','shop_specs'].includes(page)){
      for(const [key,items]of childItems)if(key.endsWith('/'+page))items.forEach((values,index)=>list.push({id:`${page}:${key}/${index}`,values}));
    }else if(page==='review')list.push(...(DATA.reviews||[]).filter(x=>x.id&&x.values).map(x=>({id:String(x.id).startsWith('review:')?x.id:`review:${x.id}`,values:x.values})));
    else list.push(...(catalog.get(page)||[]),...(addedRows.get(page)||[]));
    return list.filter(item=>!removedRows.has(item.id)).map(item=>{
      const values={...item.values,...(rowPatches.get(item.id)||{})};
      Object.assign(values,window.AdminExtensions?.normalizeRecord(page,values,item.id)||{});
      return {id:item.id,values:copyRecord(values)};
    });
  }
  function recordValues(page,id){return records(page).find(item=>item.id===id)?.values||null;}
  function patchRecord(page,id,patch) {
    if(ROLE==='boss'||!ROLE_MENU[ROLE].includes(page))return false;
    const fields={order:['履约','售后','物流公司','物流单号','售后类型','售后原因','售后备注','联系状态'],activity:['审核状态','状态','履约状态','联系状态'],guide:['实名审核','状态'],review:['审核状态','驳回原因']}[page];
    const current=fields&&recordValues(page,id);
    if(!current||Object.keys(patch).some(key=>!fields.includes(key)))return false;
    const next={...current,...patch};
    if(page==='order'){
      const aa=/用户自发|约伴|AA/.test(current['类型']||'');
      if(patch['履约']||patch['物流公司']||patch['物流单号']){
        if(current['类型']==='商城'){
          if(current['支付']!=='已付款'||current['履约']!=='待发货'||/申请|处理|售后/.test(current['售后']||'')||patch['履约']!=='已发货'||!['顺丰','圆通','其他'].includes(next['物流公司'])||!String(next['物流单号']||'').trim())return false;
        }else if(patch['物流公司']||patch['物流单号']||!['待成行','已成行','已完成'].includes(patch['履约']))return false;
      }
      if(['售后','售后类型','售后原因','售后备注'].some(k=>k in patch)&&(aa||current['支付']!=='已付款'||!['申请中','处理中','已退款','已换货'].includes(next['售后'])||!String(next['售后原因']||'').trim()))return false;
      if(patch['联系状态']&&!['待联系','已联系'].includes(patch['联系状态']))return false;
    }
    if(page==='review'&&(!['已通过','已驳回'].includes(next['审核状态'])||(next['审核状态']==='已驳回'&&!String(next['驳回原因']||'').trim())))return false;
    if(patch['状态']){const error=AdminStatus.validate(page,next,patch['状态']);if(error){notice(error);return false;}}
    rowPatches.set(id,{...(rowPatches.get(id)||{}),...copyRecord(patch)});
    for(const [key,draft]of drafts)if(key.endsWith('/'+id))drafts.set(key,{...draft,...patch});
    window.AdminRelations?.rename(page,id,patch);
    const row=[...$('page').querySelectorAll('tbody tr')].find(r=>r.dataset.uxId===id);
    if(row){row.uxValues=next;patchRow(row,patch);window.AdminLists?.apply(page);}
    window.AdminExtensions?.recordChanged(page,id,current,next,'处理');
    return true;
  }
  function recordOperation(action,objectId,summary){
    if(ROLE==='boss')return false;
    stateLogs.unshift({'时间':new Date().toLocaleString('sv-SE'),'账号':ROLES[ROLE].person,'操作类型':String(action),'操作对象':String(objectId),'前后差异摘要':String(summary)});return true;
  }
  function seedRecords(page,list){
    initializeCatalog();
    if(page==='review'){DATA.reviews=copyRecord(list);return;}
    const map=new Map((catalog.get(page)||[]).map(x=>[x.id,x]));
    for(const item of list){const old=map.get(item.id);map.set(item.id,{id:item.id,values:{...(old?.values||{}),...copyRecord(item.values)}});}
    catalog.set(page,[...map.values()]);
    if(!['order','review','checkin','notify'].includes(page))AdminRelations.capture(page,[...map.values()]);
  }
  function children(owner,key){return copyRecord(childItems.get(`${owner}/${key}`)||[]);}
  function seedChildren(owner,key,list){
    if(childItems.has(`${owner}/${key}`))return;
    childItems.set(`${owner}/${key}`,copyRecord(list));
    list.forEach((values,i)=>AdminRelations.register(key,`${owner}/${key}/${i}`,values));
  }
  function seedConfig(key,values){const page=key.split('_')[0],id=`${page}/${key}/config`;if(!drafts.has(id))drafts.set(id,copyRecord(values));}
  function configValues(key){const entries=[...drafts].filter(([id])=>id.includes('/'+key+'/'));return copyRecord(entries.at(-1)?.[1]||{});}
  window.PrototypeUI = { seedRecords,seedChildren,children,seedConfig,configValues,get currentEditor(){return ui.drawer;}, bind: bindPage, editor, info, close, notice, rowData, requestStatus, records, recordValues, patchRecord, recordOperation, virtualRow:makeVirtualRow, dialog:(title,body,footer)=>{drawer(title,body,footer);return document.querySelector('.ux-dialog');}, get page(){return ui.page;} };
})();
