/* 推广码完整闭环（纯 HTML 演示）。
 * 只使用公共桥（AdminExtensions / PrototypeUI / AdminDemoUI / AdminDemoData）。
 * 数据仅保存在当前页面内存，刷新恢复样例；无后端、无微信码、无真实结算。
 * 演示码图片仅用于展示编号，不是微信小程序码。
 */
(() => {
  'use strict';
  const W = window;
  const E = W.AdminExtensions;
  if (!E) return;

  /* ---------- 公共桥复用（缺失时降级为本地实现） ---------- */
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
  const localMoney = value => {
    const n = Number(value);
    return (Number.isFinite(n) ? n : 0).toFixed(2);
  };
  const money = value => (W.AdminDemoUI?.money ? W.AdminDemoUI.money(value) : localMoney(value));
  const pad = (n, len = 2) => String(n).padStart(len, '0');
  const now = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const notice = msg => { try { W.PrototypeUI?.notice?.(msg); } catch (_) { /* ignore */ } };
  const closeDialog = () => { try { W.PrototypeUI?.close?.(); } catch (_) { /* ignore */ } };
  const openDialog = (title, body, footer) => {
    if (typeof W.PrototypeUI?.dialog !== 'function') { notice('弹窗接口尚未就绪。'); return null; }
    return W.PrototypeUI.dialog(title, body, footer);
  };
  const logOp = (action, id, summary) => {
    try { W.PrototypeUI?.recordOperation?.(action, id, summary); } catch (_) { /* ignore */ }
  };
  const sharedCard = (title, body) => {
    if (typeof W.AdminDemoUI?.card === 'function') return W.AdminDemoUI.card(title, body);
    return `<section class="card"><div class="card-hd"><h2 class="card-t">${esc(title)}</h2></div>${body}</section>`;
  };
  const tableHTML = (headers, rows) =>
    `<div class="dp-tbl-wrap"><table class="tbl dp-tbl"><thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${Array.isArray(rows) ? rows.join('') : rows}</tbody></table></div>`;
  const pill = (on, onText, offText) => `<span class="dp-pill ${on ? 'dp-on' : 'dp-off'}">${esc(on ? onText : offText)}</span>`;
  const emptyHTML = text => `<div class="dp-empty">${esc(text)}</div>`;

  /* ---------- 本地存储与虚构样例 ---------- */
  // No persistent browser storage is used.
  const STATUS = ['已生成', '已分发', '已登记订单'];

  function seed() {
    return {
      seq: { channel: 5, template: 3, batch: 3, code: 8 },
      channels: [
        { id: 'CH001', name: '门店收银台', enabled: true, note: '收银台台卡与桌贴' },
        { id: 'CH002', name: '地推传单', enabled: true, note: '社区地推随单物料' },
        { id: 'CH003', name: '小红书笔记', enabled: true, note: '笔记末尾挂载' },
        { id: 'CH004', name: '客服企微', enabled: false, note: '暂停投放，保留登记' }
      ],
      templates: [
        {
          id: 'TPL001', name: '新疆游图文', channelId: 'CH001', enabled: true,
          items: [
            { title: '赛里木湖2日游', target: '详情页 / 线路下单' },
            { title: '那拉提拼车', target: '拼车咨询窗口' },
            { title: '伊犁环线结伴', target: '结伴报名表' }
          ]
        },
        {
          id: 'TPL002', name: '美食探店图文', channelId: 'CH003', enabled: true,
          items: [
            { title: '大巴扎夜市攻略', target: '攻略详情页' },
            { title: '本地人套餐', target: '套餐领券入口' }
          ]
        }
      ],
      batches: [
        { id: 'BAT001', name: '门店首发', channelId: 'CH001', templateId: 'TPL001', qty: 3, ratio: 8, note: '样例批次，比例 8%', createdAt: '2026-10-14 10:00' },
        { id: 'BAT002', name: '地推试点', channelId: 'CH002', templateId: 'TPL002', qty: 2, ratio: 6, note: '样例批次，比例 6%', createdAt: '2026-10-14 10:10' }
      ],
      codes: [
        { id: 'PR000001', channelId: 'CH001', templateId: 'TPL001', batchId: 'BAT001', ratio: 8, amount: 58.00, distributor: '小马', status: '已分发', orderId: '', note: '', createdAt: '2026-10-14 10:00' },
        { id: 'PR000002', channelId: 'CH001', templateId: 'TPL001', batchId: 'BAT001', ratio: 8, amount: '', distributor: '', status: '已生成', orderId: '', note: '', createdAt: '2026-10-14 10:00' },
        { id: 'PR000003', channelId: 'CH001', templateId: 'TPL001', batchId: 'BAT001', ratio: 8, amount: 96.00, distributor: '小马', status: '已登记订单', orderId: 'O26041001', note: '样例订单依据', createdAt: '2026-10-14 10:00' },
        { id: 'PR000004', channelId: 'CH002', templateId: 'TPL002', batchId: 'BAT002', ratio: 6, amount: 39.90, distributor: '阿丽', status: '已分发', orderId: '', note: '', createdAt: '2026-10-14 10:10' },
        { id: 'PR000005', channelId: 'CH002', templateId: 'TPL002', batchId: 'BAT002', ratio: 6, amount: '', distributor: '', status: '已生成', orderId: '', note: '', createdAt: '2026-10-14 10:10' },
        { id: 'PR000006', channelId: 'CH003', templateId: '', batchId: '', ratio: 12, amount: 88.00, distributor: '热娜', status: '已分发', orderId: '', note: '独立登记码', createdAt: '2026-10-14 10:20' },
        { id: 'PR000007', channelId: 'CH004', templateId: '', batchId: '', ratio: 5, amount: '', distributor: '', status: '已生成', orderId: '', note: '渠道暂停，码保留', createdAt: '2026-10-14 10:30' }
      ]
    };
  }

  let store = load();
  function load() {
    const s=seed();
    s.channels=[{id:'CH001',name:'出租车',ratio:1,enabled:true,note:''},{id:'CH002',name:'酒店',ratio:2,enabled:true,note:''},{id:'CH003',name:'大巴扎',ratio:1.5,enabled:true,note:''},{id:'CH004',name:'导游',ratio:3,enabled:false,note:'暂停新增，保留已有记录'}];
    s.templates=[{id:'TPL001',name:'出行场景',channelId:'',enabled:true,image:'demo-content.svg',headline:'在新疆轻松出行',button:'查看热门玩法',target:'热门玩法',items:[{title:'城市轻旅行',target:'热门玩法'}]},{id:'TPL002',name:'酒店周边',channelId:'CH002',enabled:true,image:'demo-goods.svg',headline:'发现酒店附近的好味道',button:'查看本地美食',target:'本地美食',items:[{title:'在地美食',target:'本地美食'}]}];
    s.batches=[{id:'BAT001',name:'出租车首批',channelId:'CH001',templateId:'TPL001',qty:3,ratio:1,createdAt:'2026-04-10 10:00'},{id:'BAT002',name:'酒店首批',channelId:'CH002',templateId:'TPL002',qty:2,ratio:2,createdAt:'2026-04-10 10:10'},{id:'BAT003',name:'大巴扎首批',channelId:'CH003',templateId:'TPL001',qty:1,ratio:1.5,createdAt:'2026-04-10 10:20'},{id:'BAT004',name:'导游首批',channelId:'CH004',templateId:'TPL001',qty:1,ratio:3,createdAt:'2026-04-10 10:30'}];
    const defs=[['CH001','BAT001','小马','O26041004'],['CH001','BAT001','',''],['CH001','BAT001','小马','O26041001'],['CH002','BAT002','阿丽','O26041002'],['CH002','BAT002','',''],['CH003','BAT003','热娜','O26041006'],['CH004','BAT004','','']];
    const phones={'小马':'0991-6000001','阿丽':'0991-6000002','热娜':'0991-6000003'};
    s.codes=defs.map(([ch,batch,person,order],i)=>({id:'PR'+String(i+1).padStart(6,'0'),channelId:ch,batchId:batch,templateId:ch==='CH002'?'TPL002':'TPL001',ratio:s.channels.find(c=>c.id===ch).ratio,amount:0,distributor:person,distributorPhone:phones[person]||'',orderId:order,status:order?'已登记订单':person?'已分发':'已生成',note:'',createdAt:'2026-04-10 10:00'}));
    // 生命周期首绑（明确虚构种子，独立于历史单订单归属；不根据历史订单推断）。
    s.firstbinds=[
      {memberId:'member:U10001',codeId:'PR000001',at:'2026-04-10 11:00',fictional:true,note:'虚构样例：生命周期首绑，独立于历史订单依据'},
      {memberId:'member:U10003',codeId:'PR000007',at:'2026-04-10 11:10',fictional:true,note:'虚构样例：渠道停用不改变来源'},
      {memberId:'member:U10006',codeId:'PR000006',at:'2026-04-10 10:20',fictional:true,note:'虚构样例：同一会员多笔已付款订单归同一码'},
      {memberId:'member:U10004',codeId:'PR000004',at:'2026-04-10 11:20',fictional:true,note:'虚构样例：无平台代收订单的会员'}
    ];
    s.scans=[
      {id:'SCN001',codeId:'PR000001',memberId:'member:U10001',at:'2026-04-10 11:00',newMember:true,boundCodeId:'PR000001'},
      {id:'SCN002',codeId:'PR000007',memberId:'member:U10003',at:'2026-04-10 11:10',newMember:true,boundCodeId:'PR000007'},
      {id:'SCN003',codeId:'PR000006',memberId:'member:U10006',at:'2026-04-10 10:20',newMember:true,boundCodeId:'PR000006'},
      {id:'SCN004',codeId:'PR000003',memberId:'member:U10006',at:'2026-04-11 09:05',newMember:false,boundCodeId:'PR000006'},
      {id:'SCN005',codeId:'PR000004',memberId:'member:U10004',at:'2026-04-10 11:20',newMember:true,boundCodeId:'PR000004'}
    ];
    s.seq={channel:5,template:3,batch:5,code:8};return s;
  }
  function save() { /* All changes are deliberately page-memory only. */ }

  const chById = id => store.channels.find(c => c.id === id);
  const tplById = id => store.templates.find(t => t.id === id);
  const batchById = id => store.batches.find(b => b.id === id);
  const codeById = id => store.codes.find(c => c.id === id);
  const nextId = kind => {
    const n = Number(store.seq?.[kind] || 1);
    store.seq = store.seq || {};
    store.seq[kind] = n + 1;
    const prefix = kind === 'channel' ? 'CH' : kind === 'template' ? 'TPL' : kind === 'batch' ? 'BAT' : 'PR';
    return prefix + String(n).padStart(6, '0');
  };

  /* ---------- 页面状态 ---------- */
  let activeTab = 'channels';
  let selectedBatchId = '';
  const filters = { channel: '', status: '', distributor: '', q: '' };

  /* ---------- 工具：CSV / 筛选 ---------- */
  function csvCell(value) {
    let s = String(value ?? '');
    // 表格注入防护：以公式引导符开头的单元格前置单引号，避免被 Excel 当作公式执行。
    if (/^[\s\uFEFF]*[=+\-@]/.test(s)) s = "'" + s;
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function buildCSV(codes) {
    const header = ['独立码ID', '渠道ID', '批次ID', '模板ID', '比例', '首绑累计已付款金额', '订单依据金额', '分发人', '分发人电话', '状态', '订单依据', '备注'];
    const rows = codes.map(c => [c.id, c.channelId, c.batchId || '', c.templateId || '', String(c.ratio ?? ''), money(attributedAmount(c)), money(turnover(c)), c.distributor || '', c.distributorPhone || '', c.status || '', c.orderId || '', c.note || ''].map(csvCell).join(','));
    return [header.map(csvCell).join(','), ...rows].join('\r\n');
  }
  function parseCSV(text) {
    const rows = [];
    let row = [], cur = '', inQ = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQ) {
        if (ch === '"') {
          if (text[i + 1] === '"') { cur += '"'; i++; } else inQ = false;
        } else cur += ch;
      } else if (ch === '"') inQ = true;
      else if (ch === ',') { row.push(cur); cur = ''; }
      else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
      else if (ch === '\r') { /* skip */ }
      else cur += ch;
    }
    if(inQ)throw new Error('CSV引号未闭合');
    if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
    return rows.filter(r => r.some(c => String(c).trim() !== ''));
  }
  function filteredCodes() {
    let list = store.codes.slice();
    if (filters.channel) list = list.filter(c => c.channelId === filters.channel);
    if (filters.status) list = list.filter(c => c.status === filters.status);
    const d = filters.distributor.trim().toLowerCase();
    if (d) list = list.filter(c => String(c.distributor || '').toLowerCase().includes(d));
    const q = filters.q.trim().toLowerCase();
    if (q) list = list.filter(c => [c.id, c.channelId, c.batchId, c.templateId, c.orderId, c.note].some(x => String(x || '').toLowerCase().includes(q)));
    return list;
  }
  function orderFor(c){return c.orderId?W.PrototypeUI?.recordValues('order',c.orderId.startsWith('order:')?c.orderId:'order:'+c.orderId):null;}
  function turnover(c){const o=orderFor(c);return o&&o['支付']==='已付款'?Number(String(o['金额']).replace(/[^\d.-]/g,''))||0:0;}
  const canUse=()=>typeof ROLE!=='undefined'&&ROLE!=='boss'&&ROLE_MENU[ROLE]?.includes('promo');
  function paidAmount(o){const n=Number(String(o?.['金额']||'').replace(/[^\d.-]/g,''));return Number.isFinite(n)&&n>=0?n:0;}
  function memberPaidOrders(memberId){const bind=store.firstbinds.find(x=>x.memberId===memberId);if(!bind)return [];const since=new Date(bind.at.replace(' ','T')).getTime();return W.PrototypeUI.records('order').filter(r=>{const v=r.values,at=new Date(String(v['支付时间']||'').replace(' ','T')).getTime();return (v['会员ID']||v['买家ID'])===memberId&&v['支付']==='已付款'&&Number.isFinite(at)&&at>=since;});}
  function attributedOrders(codeId){return store.firstbinds.filter(x=>x.codeId===codeId).flatMap(x=>memberPaidOrders(x.memberId));}
  function attributedAmount(c){return attributedOrders(c.id).reduce((sum,o)=>sum+paidAmount(o.values),0);}
  function commission(c){return attributedAmount(c)*Number(c.ratio||0)/100;}
  function codeAmountText(c){return money(attributedAmount(c));}
  function memberAttribution(id){id=String(id).startsWith('member:')?String(id):'member:'+id;const bind=store.firstbinds.find(x=>x.memberId===id);if(!bind)return null;const c=codeById(bind.codeId),orders=memberPaidOrders(id),amount=orders.reduce((s,o)=>s+paidAmount(o.values),0);return {...bind,channelId:c.channelId,channelName:chById(c.channelId)?.name,ratio:c.ratio,amount,commission:amount*Number(c.ratio)/100,orderIds:orders.map(x=>x.id)};}
  function captureScan(memberId,codeId){if(!canUse())return false;const c=codeById(codeId),m=W.PrototypeUI.recordValues('member',memberId);if(!c||!m||!chById(c.channelId)?.enabled)return false;let bind=store.firstbinds.find(x=>x.memberId===memberId);const first=!bind;if(!bind){bind={memberId,codeId,at:now(),fictional:true,note:'本次会话模拟首次注册归属'};store.firstbinds.push(bind);}store.scans.push({id:'SCN'+String(store.scans.length+1).padStart(3,'0'),memberId,codeId,at:now(),newMember:first,boundCodeId:bind.codeId});logOp('推广扫码演示',memberId,codeId+'；首绑保留 '+bind.codeId);return {...bind};}
  function scanDemo(){const members=W.PrototypeUI.records('member'),codes=store.codes.filter(c=>chById(c.channelId)?.enabled);const root=openDialog('模拟扫码注册 · 仅演示','<p class="dp-muted">无首绑样例的会员首次登记归此码；已有首绑只记扫码，不改变来源，不是生产注册。</p><label>会员<select class="fld" id="dp-scan-member">'+members.map(m=>'<option value="'+esc(m.id)+'">'+esc(m.values['昵称']||m.id)+'</option>').join('')+'</select></label><label>扫码对象<select class="fld" id="dp-scan-code">'+codes.map(c=>'<option>'+esc(c.id)+'</option>').join('')+'</select></label>','<button class="btn btn-outline" data-dp-cancel>取消</button><button class="btn btn-primary" id="dp-scan-save">记录演示扫码</button>');root.querySelector('[data-dp-cancel]').onclick=closeDialog;root.querySelector('#dp-scan-save').onclick=()=>{const result=captureScan(root.querySelector('#dp-scan-member').value,root.querySelector('#dp-scan-code').value);if(!result)return notice('无效会员、码或权限');closeDialog();rerender();notice('首绑来源保留：'+result.codeId);};}
  function bindingDetails(codeId){if(!canUse())return;const rows=store.firstbinds.filter(x=>x.codeId===codeId).map(x=>{const m=W.PrototypeUI.recordValues('member',x.memberId)||{},a=memberAttribution(x.memberId);return '<tr><td>'+esc(x.memberId+' · '+(m['昵称']||''))+'</td><td>'+esc(x.at)+'</td><td>'+money(a.amount)+'</td><td>'+money(a.commission)+'</td><td>'+esc(a.orderIds.join('、')||'无已付款订单')+'</td></tr>';}).join('');const scans=store.scans.filter(x=>x.codeId===codeId).map(x=>'<tr><td>'+esc(x.memberId)+'</td><td>'+esc(x.at)+'</td><td>'+esc(x.boundCodeId)+'</td></tr>').join('');openDialog('首绑与扫码明细 · '+codeId,tableHTML(['首绑会员','首绑时间','累计已付款金额','参考应分','订单ID'],rows)+tableHTML(['扫码会员','时间','保留首绑码'],scans)+'<p class="dp-muted">明确虚构首绑样例，与旧手工单笔订单依据分开。全部已付款原金额累计，未定义退款净额；比例为码创建时快照。</p>');}

  /* ---------- 面板渲染 ---------- */
  function channelsPanel() {
    const rows = store.channels.map(c => {
      const count = store.codes.filter(x => x.channelId === c.id).length;
      return `<tr>
        <td>${esc(c.id)}</td>
        <td><b>${esc(c.name)}</b></td>
        <td>${money(c.ratio)}%</td><td>${count}</td>
        <td>${pill(c.enabled, '启用', '停用')}</td>
        <td>${esc(c.note || '—')}</td>
        <td class="dc-actions">
          <button class="btn btn-outline btn-sm" data-dp-action="ch-edit" data-dp-id="${esc(c.id)}">编辑</button>
          <button class="btn btn-outline btn-sm" data-dp-action="ch-toggle" data-dp-id="${esc(c.id)}">${c.enabled ? '停用' : '启用'}</button>
          <button class="btn btn-outline btn-sm" data-dp-action="ch-del" data-dp-id="${esc(c.id)}">删除</button>
        </td></tr>`;
    }).join('');
    return sharedCard('渠道列表', `<div class="dp-bar-sub"><span>新增、编辑、启停渠道；停用渠道不再参与新批次。</span><button class="btn btn-primary btn-sm" data-dp-action="ch-add">新增渠道</button></div>
      ${store.channels.length ? tableHTML(['渠道ID', '名称', '当前比例', '码数量', '状态', '备注', '操作'], rows) : emptyHTML('还没有渠道，先新增一个。')}`);
  }

  function templatesPanel() {
    const cards = store.templates.map(t => {
      const refs = store.batches.filter(b => b.templateId === t.id).length;
      const thumbs = t.items.slice(0, 3).map(item =>
        `<div class="dp-thumb"><span class="dp-thumb-ic">${esc((item.title || '图').slice(0, 1))}</span><b>${esc(item.title)}</b><i>${esc(item.target || '—')}</i></div>`).join('');
      return `<article class="dp-tpl card">
        <div class="card-hd"><h3 class="card-t">${esc(t.id)} ${esc(t.name)}</h3><span class="dp-muted">渠道 ${esc(t.channelId || '通用')} · ${t.items.length} 份图文 · 被批次引用 ${refs} 次</span></div>
        <div class="dp-tpl-thumbs">${thumbs || emptyHTML('暂无图文目标')}</div>
        <div class="dc-actions">
          <button class="btn btn-outline btn-sm" data-dp-action="tpl-preview" data-dp-id="${esc(t.id)}">预览</button>
          <button class="btn btn-outline btn-sm" data-dp-action="tpl-edit" data-dp-id="${esc(t.id)}">编辑</button>
          <button class="btn btn-outline btn-sm" data-dp-action="tpl-del" data-dp-id="${esc(t.id)}">删除</button>
        </div></article>`;
    }).join('');
    return `<div class="dp-bar-sub"><span>每份场景独立维护图片、文案与跳转目标；创建批次时引用。</span><button class="btn btn-primary btn-sm" data-dp-action="tpl-add">新增模板</button></div>
      <div class="dp-grid">${cards || emptyHTML('还没有场景模板。')}</div>`;
  }

  function batchesPanel() {
    const rows = store.batches.map(b => {
      const ch = chById(b.channelId);
      const tpl = tplById(b.templateId);
      return `<tr>
        <td>${esc(b.id)}</td>
        <td><b>${esc(b.name)}</b></td>
        <td>${esc(ch?.name || b.channelId)}</td>
        <td>${esc(tpl?.name || b.templateId || '—')}</td>
        <td>${esc(String(b.qty))}</td>
        <td>${esc(String(b.ratio))}%</td>
        <td>${esc(b.createdAt || '')}</td>
        <td class="dc-actions">
          <button class="btn btn-outline btn-sm" data-dp-action="batch-codes" data-dp-id="${esc(b.id)}">结果码</button>
          <button class="btn btn-outline btn-sm" data-dp-action="batch-zip" data-dp-id="${esc(b.id)}">导出ZIP</button>
        </td></tr>`;
    }).join('');

    let codeRows = '';
    let codeTitle = '结果码列表';
    const active = batchById(selectedBatchId) || store.batches[0];
    if (active) {
      const list = store.codes.filter(c => c.batchId === active.id);
      codeTitle = `批次 ${active.id} 结果码（${list.length}/${active.qty}）`;
      codeRows = list.length ? tableHTML(['码ID', '渠道', '比例', '金额', '分发人', '状态', '订单依据', '操作'],
        list.map(c => `<tr>
          <td><code>${esc(c.id)}</code></td>
          <td>${esc(chById(c.channelId)?.name || c.channelId)}</td>
          <td>${esc(String(c.ratio))}%</td>
          <td>${esc(codeAmountText(c))}</td>
          <td>${esc(c.distributor || '—')}</td>
          <td>${esc(c.status || '')}</td>
          <td>${esc(c.orderId || '—')}</td>
          <td class="dc-actions"><button class="btn btn-outline btn-sm" data-dp-action="code-edit" data-dp-id="${esc(c.id)}">登记</button></td>
        </tr>`).join('')) : emptyHTML('该批次暂无结果码。');
    } else {
      codeRows = emptyHTML('还没有批次，先创建一批码。');
    }
    return `<div class="dp-bar-sub"><span>批次创建数量校验 1–5000；每个码保留创建时比例，不做金额平均。</span><button class="btn btn-primary btn-sm" data-dp-action="batch-add">创建批次</button></div>
      ${store.batches.length ? tableHTML(['批次ID', '名称', '渠道', '场景模板', '数量', '比例', '创建时间', '操作'], rows) : emptyHTML('还没有批次。')}
      <section class="card"><div class="card-hd"><h2 class="card-t">${esc(codeTitle)}</h2><button class="btn btn-outline btn-sm" data-dp-action="batch-zip" data-dp-id="${esc(active?.id || '')}" ${active ? '' : 'disabled'}>导出该批ZIP</button></div>${codeRows}</section>`;
  }

  function codesPanel() {
    const channelOpts = store.channels.map(c => `<option value="${esc(c.id)}" ${filters.channel === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
    const statusOpts = STATUS.map(s => `<option value="${esc(s)}" ${filters.status === s ? 'selected' : ''}>${esc(s)}</option>`).join('');
    const list = filteredCodes();
    const shown = list.slice(0, 200);
    const rows = shown.map(c => `<tr>
      <td><code>${esc(c.id)}</code></td>
      <td>${esc(chById(c.channelId)?.name || c.channelId)}</td>
      <td>${esc(c.batchId || '独立码')}</td>
      <td>${esc(String(c.ratio))}%</td>
      <td>${esc(codeAmountText(c))}</td><td>${money(commission(c))}</td>
      <td>${esc(c.distributor || '—')}</td>
      <td>${esc(c.status || '')}</td>
      <td>${c.orderId?`<button class="btn btn-ghost" data-dp-action="order-view" data-dp-id="${esc(c.orderId)}">${esc(c.orderId)}</button>`:'—'}</td>
      <td class="dc-actions"><button class="btn btn-outline btn-sm" data-dp-action="code-edit" data-dp-id="${esc(c.id)}">登记</button><button class="btn btn-outline btn-sm" data-dp-action="bind-view" data-dp-id="${esc(c.id)}">首绑明细</button></td>
    </tr>`).join('');

    const byPerson = new Map();
    for (const c of store.codes) {
      if (!c.distributor) continue;
      const cur = byPerson.get(c.distributor) || { count: 0, total: 0, share:0 };
      cur.count += 1;
      cur.total+=attributedAmount(c);cur.share+=commission(c);
      byPerson.set(c.distributor, cur);
    }
    const personRows = [...byPerson.entries()].map(([name, v]) => `<tr><td>${esc(name)}</td><td>${v.count}</td><td>${money(v.total)}</td><td>${money(v.share)}</td></tr>`).join('');
    const orderRows = store.codes.filter(c => c.orderId).map(c => `<tr>
      <td><code>${esc(c.id)}</code></td>
      <td>${esc(c.orderId)}</td>
      <td>${esc(c.distributor || '—')}</td>
      <td>${money(turnover(c))}</td>
      <td>${esc(c.status || '')}</td></tr>`).join('');

    return `<section class="card"><div class="card-hd"><h2 class="card-t">逐码数据</h2>
      <button class="btn btn-outline btn-sm" data-dp-action="scan-demo">模拟扫码注册</button><button class="btn btn-outline btn-sm" data-dp-action="code-csv">当前筛选CSV</button><button class="btn btn-outline btn-sm" data-dp-action="code-zip">导出ZIP（码PNG+CSV清单）</button></div>
      <div class="dp-filters">
        <select class="fld" data-dp-filter="channel"><option value="">全部渠道</option>${channelOpts}</select>
        <select class="fld" data-dp-filter="status"><option value="">全部状态</option>${statusOpts}</select>
        <input class="fld" type="text" placeholder="分发人" data-dp-filter-text="distributor" value="${esc(filters.distributor)}">
        <input class="fld" type="text" placeholder="码ID / 订单 / 备注" data-dp-filter-text="q" value="${esc(filters.q)}">
        <button class="btn btn-outline btn-sm" data-dp-action="filter-apply">筛选</button>
        <button class="btn btn-outline btn-sm" data-dp-action="filter-clear">清除</button>
      </div>
      ${list.length ? tableHTML(['码ID', '渠道', '批次', '创建时比例', '首绑累计付款', '参考应分', '分发人', '状态', '订单依据', '操作'], rows) : emptyHTML('没有符合条件的码，试试调整筛选条件。')}
      ${list.length > 200 ? `<p class="dp-muted">共 ${list.length} 条，仅显示前 200 条；请用筛选缩小范围。</p>` : `<p class="dp-muted">当前筛选命中 ${list.length} 条。</p>`}
      </section>
      <section class="card"><div class="card-hd"><h2 class="card-t">按分发人汇总</h2></div>
      ${personRows ? tableHTML(['分发人', '码数量', '成交金额', '参考应分'], personRows) : emptyHTML('暂无已登记分发人的码。')}</section>
      <section class="card"><div class="card-hd"><h2 class="card-t">历史单笔订单依据（不等于会员首绑）</h2></div>
      ${orderRows ? tableHTML(['码ID', '订单依据', '分发人', '金额', '状态'], orderRows) : emptyHTML('暂无订单依据；新生成码为零业务数据，登记订单后出现在这里。')}</section>`;
  }

  function ioPanel() {
    const example = store.codes.slice(0, 2);
    return sharedCard('导入 / 导出 CSV 登记模板', `<div class="dp-io">
      <p>填写独立码ID、分发人/电话、状态及历史订单依据。先逐行预检，确认后只应用有效行；<b>不覆盖金额、创建时比例或会员首绑</b>。清单沿用码数据页当前筛选。</p>
      <div class="dc-actions">
        <button class="btn btn-outline" data-dp-action="io-template">下载登记模板</button>
        <button class="btn btn-outline" data-dp-action="io-export">下载当前码清单 CSV</button>
        <label class="btn btn-outline">导入登记 CSV<input type="file" accept=".csv,text/csv" data-dp-file hidden></label>
      </div>
      <div class="dp-io-note">演示码图片仅用于展示编号，不是微信小程序码；无真实结算与微信码接口。ZIP 内含每个码的 PNG 与 CSV 清单，及说明文本。</div>
      ${example.length ? `<details class="dp-details"><summary>查看模板示例（当前前 2 个码）</summary><pre class="dp-pre">${esc(buildCSV(example))}</pre></details>` : ''}</div>`);
  }

  function pageHTML() {
    const active = activeTab || 'channels';
    const tabs = [['channels', '渠道'], ['templates', '场景模板'], ['batches', '批次与结果码'], ['codes', '码数据与汇总'], ['io', '导入导出']];
    return `<div class="pg-hd"><div><h1>场景推广码</h1><div class="sub">按渠道与场景管理推广批次，查看逐码归属与个人数据。</div></div></div>
      <div class="dp-bar">
        <div class="dp-counts">渠道 ${store.channels.length} · 模板 ${store.templates.length} · 批次 ${store.batches.length} · 码 ${store.codes.length}</div>

      </div>
      <nav class="dp-tabs">${tabs.map(([k, label]) => `<button class="dp-tab ${active === k ? 'active' : ''}" data-dp-tab="${k}">${esc(label)}</button>`).join('')}</nav>
      <section class="dp-panel ${active === 'channels' ? '' : 'dp-hidden'}">${channelsPanel()}</section>
      <section class="dp-panel ${active === 'templates' ? '' : 'dp-hidden'}">${templatesPanel()}</section>
      <section class="dp-panel ${active === 'batches' ? '' : 'dp-hidden'}">${batchesPanel()}</section>
      <section class="dp-panel ${active === 'codes' ? '' : 'dp-hidden'}">${codesPanel()}</section>
      <section class="dp-panel ${active === 'io' ? '' : 'dp-hidden'}">${ioPanel()}</section>`;
  }

  /* ---------- 渠道表单 ---------- */
  function openChannelForm(id) {
    const ch = id ? chById(id) : null;
    const root = openDialog(ch ? '编辑渠道' : '新增渠道',
      `<div class="dp-form">
        <label>渠道名称<input class="fld" data-dp-f="name" value="${esc(ch?.name || '')}" maxlength="40"></label>
        <label>统一分成比例（%）<input class="fld" type="number" min="0" max="100" step="0.01" data-dp-f="ratio" value="${ch?.ratio??1}"></label>
        <label>备注<input class="fld" data-dp-f="note" value="${esc(ch?.note || '')}" maxlength="120"></label>
      </div>`,
      '<button class="btn btn-outline" data-dp-cancel>取消</button><button class="btn btn-primary" data-dp-ok>保存</button>');
    if (!root) return;
    root.querySelector('[data-dp-cancel]').onclick = closeDialog;
    root.querySelector('[data-dp-ok]').onclick = () => {
      if(!canUse())return;
      const name = root.querySelector('[data-dp-f="name"]').value.trim();
      const note = root.querySelector('[data-dp-f="note"]').value.trim();
      if (!name) { notice('请填写渠道名称。'); return; }
      const ratio=Number(root.querySelector('[data-dp-f="ratio"]').value);
      if(!Number.isFinite(ratio)||ratio<0||ratio>100)return notice('比例须为0–100之间的数字');
      if(store.channels.some(x=>x.id!==ch?.id&&x.name===name))return notice('渠道名称不能重复');
      if (ch) { ch.name = name; ch.note = note; ch.ratio=ratio; }
      else { store.channels.push({ id: nextId('channel'), name, enabled: true, note,ratio }); }
      save(); logOp('推广渠道保存', ch?.id || 'new', name); notice('渠道已保存。'); closeDialog(); rerender();
    };
  }

  /* ---------- 模板表单 ---------- */
  function parseItems(text) {
    return String(text || '').split('\n').map(l => l.trim()).filter(Boolean).map(line => {
      const i = line.indexOf('|');
      if (i < 0) return { title: line, target: '' };
      return { title: line.slice(0, i).trim(), target: line.slice(i + 1).trim() };
    }).filter(item => item.title);
  }
  function itemsToText(items) {
    return (items || []).map(item => `${item.title}|${item.target || ''}`).join('\n');
  }
  function openTemplateForm(id) {
    const t = id ? tplById(id) : null;
    const channelOpts = ['<option value="">通用</option>'].concat(store.channels.map(c => `<option value="${esc(c.id)}" ${t?.channelId === c.id ? 'selected' : ''}>${esc(c.name)}</option>`)).join('');
    const root = openDialog(t ? '编辑场景模板' : '新增场景模板',
      `<div class="dp-form">
        <label>模板名称<input class="fld" data-dp-f="name" value="${esc(t?.name || '')}" maxlength="40"></label>
        <label>适用渠道<select class="fld" data-dp-f="channel">${channelOpts}</select></label>
        <label>顶部图片<input class="fld" type="file" accept="image/*" data-dp-f="image"><small>${esc(t?.image||'尚未选择')}</small></label>
        <label>主文案<input class="fld" data-dp-f="headline" value="${esc(t?.headline||'')}"></label>
        <label>副文案<textarea class="fld" data-dp-f="subtitle">${esc(t?.subtitle||'')}</textarea></label>
        <label>主按钮文案<input class="fld" data-dp-f="button" value="${esc(t?.button||'')}"></label>
        <label>跳转目标<select class="fld" data-dp-f="target">${['首页','热门玩法','本地美食','目的地','同游','in向导'].map(x=>`<option ${t?.target===x?'selected':''}>${x}</option>`).join('')}</select></label>
      </div>`,
      '<button class="btn btn-outline" data-dp-cancel>取消</button><button class="btn btn-primary" data-dp-ok>保存</button>');
    if (!root) return;
    root.querySelector('[data-dp-cancel]').onclick = closeDialog;
    root.querySelector('[data-dp-ok]').onclick = () => {
      if(!canUse())return;
      const name = root.querySelector('[data-dp-f="name"]').value.trim();
      const channelId = root.querySelector('[data-dp-f="channel"]').value;
      const headline=root.querySelector('[data-dp-f="headline"]').value.trim(),subtitle=root.querySelector('[data-dp-f="subtitle"]').value.trim(),button=root.querySelector('[data-dp-f="button"]').value.trim(),target=root.querySelector('[data-dp-f="target"]').value;
      const file=root.querySelector('[data-dp-f="image"]').files[0],image=file?(W.AdminDemoUI.remember(file),file.name):t?.image||'demo-content.svg';
      const items=[{title:headline,target}];
      if (!name) { notice('请填写模板名称。'); return; }
      if(!headline||!button)return notice('请填写主文案和主按钮文案');
      if (t) { Object.assign(t,{name,channelId,items,headline,subtitle,button,target,image}); }
      else { store.templates.push({ id: nextId('template'), name, channelId, enabled: true, items,headline,subtitle,button,target,image }); }
      save(); logOp('推广模板保存', t?.id || 'new', `${name}·${items.length}份图文`); notice('模板已保存。'); closeDialog(); rerender();
    };
  }
  function previewTemplate(id) {
    const t = tplById(id);
    if (!t) return;
    const refs = store.batches.filter(b => b.templateId === t.id);
    const body = `<img class="dc-preview-img" src="${W.AdminDemoUI.imageURL(t.image)}" alt="落地页图片"><h2>${esc(t.headline||t.name)}</h2><p>${esc(t.subtitle||'')}</p><button class="btn btn-primary" data-dp-preview-target>${esc(t.button||'查看内容')}</button><div class="dp-tpl-full">${t.items.map(item => `<div class="dp-thumb"><span class="dp-thumb-ic">${esc((item.title || '图').slice(0, 1))}</span><b>${esc(item.title)}</b><i>${esc(item.target || '—')}</i></div>`).join('')}</div>
      <p class="dp-muted">渠道 ${esc(t.channelId || '通用')} · 被批次引用：${refs.length ? refs.map(b => esc(b.id)).join('、') : '暂无'}</p>`;
    const root = openDialog(`预览 ${esc(t.id)} ${esc(t.name)}`, body, '<button class="btn btn-outline" data-dp-cancel>关闭</button>');
    if (!root) return;
    root.querySelector('[data-dp-cancel]').onclick = closeDialog;
    root.querySelector('[data-dp-preview-target]').onclick=()=>{closeDialog();navigate({'首页':'home','热门玩法':'ranking','本地美食':'merchant','目的地':'destination','同游':'activity','in向导':'service'}[t.target]||'home');};
  }

  /* ---------- 批次创建 ---------- */
  function openBatchForm() {
    const enabledChannels = store.channels.filter(c => c.enabled);
    if (!enabledChannels.length) { notice('没有启用中的渠道，请先启用渠道。'); return; }
    if (!store.templates.length) { notice('请先新增场景模板。'); return; }
    const channelOpts = enabledChannels.map(c => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');
    const templateOpts = store.templates.map(t => `<option value="${esc(t.id)}">${esc(t.name)}</option>`).join('');
    const root = openDialog('创建推广批次',
      `<div class="dp-form">
        <label>批次名称<input class="fld" data-dp-f="name" placeholder="如：门店首发" maxlength="40"></label>
        <label>渠道<select class="fld" data-dp-f="channel">${channelOpts}</select></label>
        <label>场景模板<select class="fld" data-dp-f="template">${templateOpts}</select></label>
        <label>生成数量（1–5000）<input class="fld" type="number" data-dp-f="qty" min="1" max="5000" step="1" value="10"></label>
        <label>创建时比例（%，随渠道读取）<input class="fld" type="number" data-dp-f="ratio" readonly value="${enabledChannels[0].ratio}"></label>
        <label>备注<input class="fld" data-dp-f="note" maxlength="120" placeholder="可选"></label>
        <p class="dp-muted">新生成的码为零业务数据：无分发人、无金额、无订单依据；每码固定记录创建时比例，不按批次金额平均。</p>
      </div>`,
      '<button class="btn btn-outline" data-dp-cancel>取消</button><button class="btn btn-primary" data-dp-ok>生成批次</button>');
    if (!root) return;
    root.querySelector('[data-dp-f="channel"]').onchange=()=>root.querySelector('[data-dp-f="ratio"]').value=chById(root.querySelector('[data-dp-f="channel"]').value)?.ratio??0;
    root.querySelector('[data-dp-cancel]').onclick = closeDialog;
    root.querySelector('[data-dp-ok]').onclick = () => {
      if(!canUse())return;
      const name = root.querySelector('[data-dp-f="name"]').value.trim();
      if(!name)return notice('请填写批次名称');
      const channelId = root.querySelector('[data-dp-f="channel"]').value;
      const templateId = root.querySelector('[data-dp-f="template"]').value;
      const qty = Number(root.querySelector('[data-dp-f="qty"]').value);
      const ratio = Number(root.querySelector('[data-dp-f="ratio"]').value);
      const note = root.querySelector('[data-dp-f="note"]').value.trim();
      if (!Number.isInteger(qty) || qty < 1 || qty > 5000) { notice('生成数量须为 1–5000 的整数。'); return; }
      if (!(ratio >= 0 && ratio <= 100)) { notice('比例须为 0–100。'); return; }
      const template = tplById(templateId);
      if (!template || (template.channelId && template.channelId !== channelId)) return notice('请选择适用当前渠道的场景模板，或通用模板。');
      const batchId = nextId('batch');
      const codes = [];
      for (let i = 0; i < qty; i++) {
        codes.push({
          id: nextId('code'), channelId, templateId, batchId, ratio,
          amount: '', distributor: '', distributorPhone:'', status: '已生成', orderId: '', note, createdAt: now()
        });
      }
      store.batches.push({ id: batchId, name, channelId, templateId, qty, ratio, note, createdAt: now() });
      store.codes.push(...codes);
      save(); logOp('推广批次创建', batchId, `${channelId}·${templateId}·${qty}码·比例${ratio}%`);
      notice(`已创建批次 ${batchId}，生成 ${qty} 个码（零业务数据）。`);
      closeDialog(); selectedBatchId = batchId; activeTab = 'batches'; rerender();
    };
  }

  /* ---------- 独立码登记 ---------- */
  function openCodeForm(id) {
    const c = codeById(id);
    if (!c) return;
    const ch = chById(c.channelId);
    const statusOpts = STATUS.map(s => `<option value="${esc(s)}" ${c.status === s ? 'selected' : ''}>${esc(s)}</option>`).join('');
    const root = openDialog(`登记独立码 ${esc(c.id)}`,
      `<div class="dp-form">
        <p class="dp-muted">渠道 ${esc(ch?.name || c.channelId || '—')} · 批次 ${esc(c.batchId || '独立码')} · 创建时比例 ${esc(String(c.ratio))}%（只读，不覆盖）</p>
        <label>订单成交金额（只读）<input class="fld" type="number" data-dp-f="amount" readonly value="${money(turnover(c))}"></label>
        <p class="dp-muted">首绑会员累计已付款：¥${money(attributedAmount(c))}，参考应分 ¥${money(commission(c))}；旧单笔订单依据独立保留，不自动推断会员来源。</p><label>分发人<input class="fld" data-dp-f="distributor" value="${esc(c.distributor || '')}" maxlength="40"></label><label>分发联系电话<input class="fld" data-dp-f="distributor-phone" value="${esc(c.distributorPhone||'')}" maxlength="30"></label>
        <label>状态<select class="fld" data-dp-f="status">${statusOpts}</select></label>
        <label>订单依据（已有样例订单）<select class="fld" data-dp-f="order"><option value="">暂未关联订单</option>${W.PrototypeUI.records('order').filter(x=>x.values['支付']==='已付款').map(x=>{const id=x.values['订单号'];return `<option value="${esc(id)}" ${id===c.orderId?'selected':''}>${esc(id+' · '+x.values['买家']+' · '+x.values['金额'])}</option>`;}).join('')}</select></label>
        <label>备注<input class="fld" data-dp-f="note" value="${esc(c.note || '')}" maxlength="120"></label>
      </div>`,
      '<button class="btn btn-outline" data-dp-cancel>取消</button><button class="btn btn-primary" data-dp-ok>保存登记</button>');
    if (!root) return;
    root.querySelector('[data-dp-f="order"]').onchange=()=>root.querySelector('[data-dp-f="amount"]').value=money(turnover({...c,orderId:root.querySelector('[data-dp-f="order"]').value}));
    root.querySelector('[data-dp-cancel]').onclick = closeDialog;
    root.querySelector('[data-dp-ok]').onclick = () => {
      if(!canUse())return;
      const amountText = root.querySelector('[data-dp-f="amount"]').value.trim();
      const amount = amountText === '' ? '' : Number(amountText);
      if (amount !== '' && (!Number.isFinite(amount) || amount < 0)) { notice('金额须为非负数字。'); return; }
      const distributor = root.querySelector('[data-dp-f="distributor"]').value.trim();
      const status = root.querySelector('[data-dp-f="status"]').value;
      const orderId = root.querySelector('[data-dp-f="order"]').value.trim();
      const note = root.querySelector('[data-dp-f="note"]').value.trim();
      if((orderId||status!=='已生成')&&!distributor)return notice('请填写分发人');
      if(orderId&&store.codes.some(x=>x.id!==c.id&&x.orderId===orderId))return notice('这笔订单已归属其他码，不重复计算');
      c.amount = orderId?turnover({...c,orderId}):0;
      c.distributor = distributor;
      c.distributorPhone=root.querySelector('[data-dp-f="distributor-phone"]').value.trim();
      c.status = orderId?'已登记订单':distributor?'已分发':'已生成';
      c.orderId = orderId;
      c.note = note;
      save(); logOp('推广码登记', c.id, `${c.distributor || '未登记'}/${c.status}/${c.orderId || '无订单'}`);
      notice(`码 ${c.id} 已保存登记。`); closeDialog(); rerender();
    };
  }

  /* ---------- ZIP 导出 ---------- */
  async function exportZip(codes) {
    const ui = W.AdminDemoUI;
    if(!canUse())return;
    if (!ui?.zip || !ui?.codeImage || !ui?.downloadBlob) { notice('ZIP 接口尚未就绪。'); return; }
    if (!codes.length) { notice('没有可导出的码。'); return; }
    notice(`正在生成 ${codes.length} 个码图片与清单…`);
    const files = [];
    for (const c of codes) {
      try {
        const blob = await ui.codeImage(c.id);
        files.push({ name: `${c.id}.png`, data: blob });
      } catch (error) { notice('码图片生成失败：'+c.id+'；未生成不完整ZIP');return; }
    }
    files.push({ name: '码清单.csv', data: '\uFEFF' + buildCSV(codes) });
    files.push({ name: '说明.txt', data: '本文件内的码图片仅用于演示编号，不是微信小程序码；无真实结算与微信码接口。\n' });
    try {
      const blob = await ui.zip(files);
      const stamp = new Date().toISOString().slice(0, 10);
      ui.downloadBlob(`promo-codes-${stamp}.zip`, blob);
      logOp('推广码ZIP导出', 'promo-zip', `${codes.length}码PNG+清单`);
      notice('ZIP 已生成下载，请在浏览器下载列表查看。');
    } catch (error) {
      notice('ZIP 生成失败：' + (error?.message || error));
    }
  }

  /* ---------- 导入导出 ---------- */
  function downloadText(name, text) {
    const ui = W.AdminDemoUI;
    const csvText = '\uFEFF' + text;
    if (ui?.download) { ui.download(name, csvText, 'text/csv;charset=utf-8'); return; }
    try {
      const url = URL.createObjectURL(new Blob([csvText], { type: 'text/csv;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url; a.download = name; a.hidden = true; document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (_) { notice('浏览器不支持下载。'); }
  }
  function importCSV(text) {
    if(!canUse())return;
    let rows;try{rows=parseCSV(String(text||'').replace(/^\uFEFF/,''));}catch(err){notice(err.message);return;}
    if(rows.length<2)return notice('CSV没有数据行');
    const head=rows[0].map(x=>String(x).trim()),idx=k=>head.indexOf(k);
    if(idx('独立码ID')<0||idx('分发人')<0)return notice('CSV须包含独立码ID和分发人列，请使用登记模板。');
    if(new Set(head).size!==head.length)return notice('CSV表头重复，请检查后重新导入');
    const valid=[],bad=[],seen=new Map(),claimed=new Set();
    rows.slice(1).forEach(row=>{const id=String(row[idx('独立码ID')]||'').trim();seen.set(id,(seen.get(id)||0)+1);});
    rows.slice(1).forEach((row,index)=>{
      const get=k=>idx(k)<0?'':String(row[idx(k)]||'').trim(),id=get('独立码ID'),code=codeById(id),errors=[];
      if(row.length!==head.length)errors.push('列数与表头不一致');
      if(!id)errors.push('缺少独立码ID');else if(!code)errors.push('独立码ID不存在');
      if(seen.get(id)>1)errors.push('CSV内重复码ID');
      const person=get('分发人')||code?.distributor||'',phone=get('分发人电话')||code?.distributorPhone||'',note=get('备注')||code?.note||'',orderId=(get('订单依据')||code?.orderId||'').replace(/^order:/,'');
      if(person.length>40)errors.push('分发人最多40字');if(phone.length>30)errors.push('联系电话最多30字');if(note.length>120)errors.push('备注最多120字');
      if(get('状态')&&!STATUS.includes(get('状态')))errors.push('状态不在已有枚举中');
      if(orderId){const order=W.PrototypeUI.recordValues('order','order:'+orderId);if(!person)errors.push('有关联订单时须提供分发人');if(!order||order['支付']!=='已付款')errors.push('订单不存在或未付款');if(claimed.has(orderId)||store.codes.some(x=>x.id!==id&&String(x.orderId).replace(/^order:/,'')===orderId))errors.push('订单已归属其他码');}
      const item={line:index+2,id,raw:row.join(' | ')};
      if(errors.length)bad.push({...item,reason:errors.join('；')});else{if(orderId)claimed.add(orderId);valid.push({...item,before:JSON.stringify(code),patch:{distributor:person,distributorPhone:phone,note,orderId,status:orderId?'已登记订单':person?'已分发':'已生成'}});}
    });
    const errorRows=bad.map(x=>'<tr><td>'+x.line+'</td><td>'+esc(x.id)+'</td><td>'+esc(x.reason)+'</td></tr>').join('');
    const root=openDialog('CSV导入预检','<p id="dp-import-count">有效 '+valid.length+' 行，错误 '+bad.length+' 行；尚未应用。</p><p class="dp-muted">金额、比例及首绑归属始终只读，不接受CSV覆盖。状态由分发人/订单依据推导；空值保留原值。确认仅应用有效行。</p>'+tableHTML(['有效行号','码ID','将保存的登记'],valid.map(x=>'<tr><td>'+x.line+'</td><td>'+esc(x.id)+'</td><td>'+esc(x.patch.distributor+' / '+x.patch.distributorPhone+' / '+x.patch.status)+'</td></tr>').join(''))+tableHTML(['错误行号','码ID','原因'],errorRows),'<button class="btn btn-outline" data-dp-cancel>取消</button><button class="btn btn-outline" id="dp-errors-download" '+(bad.length?'':'disabled')+'>下载错误行CSV</button><button class="btn btn-primary" id="dp-import-apply" '+(valid.length?'':'disabled')+'>确认应用有效行</button>');
    root.querySelector('[data-dp-cancel]').onclick=closeDialog;
    root.querySelector('#dp-errors-download').onclick=()=>downloadText('promo-错误行.csv',[['行号','码ID','原因','原始数据'],...bad.map(x=>[x.line,x.id,x.reason,x.raw])].map(row=>row.map(csvCell).join(',')).join('\r\n'));
    root.querySelector('#dp-import-apply').onclick=()=>{if(!canUse())return;if(valid.some(x=>JSON.stringify(codeById(x.id))!==x.before))return notice('预检后资料发生变化，请重新导入核对');for(const x of valid)Object.assign(codeById(x.id),x.patch);save();logOp('推广码导入','promo-csv','确认更新'+valid.length+'行，错误'+bad.length+'行未应用');closeDialog();rerender();notice('已应用'+valid.length+'个码登记，错误行未应用');};
  }

  /* ---------- 动作分发 ---------- */
  function runAction(action, id, button) {
    if(!canUse())return true;
    switch (action) {
      case 'save': save(); notice('当前页面已保存，返回后可重开；刷新恢复样例。'); return true;
      case 'ch-add': openChannelForm(); return true;
      case 'ch-edit': openChannelForm(id); return true;
      case 'ch-toggle': {
        const ch = chById(id); if (!ch) return true;
        ch.enabled = !ch.enabled; save(); logOp('推广渠道启停', id, ch.enabled ? '启用' : '停用');
        notice(`渠道 ${id} 已${ch.enabled ? '启用' : '停用'}。`); rerender(); return true;
      }
      case 'ch-del': {
        const ch = chById(id); if (!ch) return true;
        const used = store.codes.filter(c => c.channelId === id).length + store.batches.filter(b => b.channelId === id).length + store.templates.filter(t => t.channelId === id).length;
        if (used) { notice(`渠道 ${id} 已有 ${used} 条码/批次引用，不能删除；可先停用。`); return true; }
        store.channels = store.channels.filter(c => c.id !== id); save(); logOp('推广渠道删除', id, ch.name);
        notice('渠道已删除。'); rerender(); return true;
      }
      case 'tpl-add': openTemplateForm(); return true;
      case 'tpl-edit': openTemplateForm(id); return true;
      case 'tpl-preview': previewTemplate(id); return true;
      case 'tpl-del': {
        const t = tplById(id); if (!t) return true;
        const used = store.batches.filter(b => b.templateId === id).length;
        if (used) { notice(`模板 ${id} 被 ${used} 个批次引用，不能删除。`); return true; }
        store.templates = store.templates.filter(x => x.id !== id); save(); logOp('推广模板删除', id, t.name);
        notice('模板已删除。'); rerender(); return true;
      }
      case 'batch-add': openBatchForm(); return true;
      case 'batch-codes': selectedBatchId = id; activeTab = 'batches'; rerender(); return true;
      case 'batch-zip': {
        const list = id ? store.codes.filter(c => c.batchId === id) : store.codes.slice();
        exportZip(list); return true;
      }
      case 'order-view': closeDialog();navigate('order');W.AdminDemoBusiness.orderDetail(id.startsWith('order:')?id:'order:'+id);return true;
      case 'bind-view': bindingDetails(id);return true;
      case 'scan-demo': scanDemo();return true;
      case 'code-csv': {const list=filteredCodes();if(!list.length)return notice('没有符合条件的码');downloadText('promo-当前筛选.csv',buildCSV(list));logOp('推广筛选CSV','promo-csv',list.length+'码');return true;}
      case 'code-edit': openCodeForm(id); return true;
      case 'code-zip': exportZip(filteredCodes()); return true;
      case 'filter-apply': rerender(); return true;
      case 'filter-clear': filters.channel = ''; filters.status = ''; filters.distributor = ''; filters.q = ''; rerender(); return true;
      case 'io-template': {
        const example = store.codes.slice(0, 2);
        const sample = example.length ? buildCSV(example) : buildCSV([{ id: 'PR000001', channelId: 'CH001', batchId: 'BAT001', templateId: 'TPL001', ratio: 8, amount: 58.00, distributor: '小马', status: '已分发', orderId: '', note: '示例行' }]);
        downloadText('promo-登记模板.csv', sample); logOp('推广码模板下载', 'promo-csv-template', '');
        notice('登记模板已下载。'); return true;
      }
      case 'io-export': downloadText('promo-码清单.csv', buildCSV(filteredCodes())); logOp('推广码清单导出', 'promo-csv', `${filteredCodes().length}码`); notice('当前码清单 CSV 已下载。'); return true;
      default: return false;
    }
  }

  /* ---------- 桥接 ---------- */
  function renderPage(id) {
    if (id !== 'promo') return false;
    const root = document.getElementById('page');
    if (!root) return false;
    root.innerHTML = pageHTML();
    return true;
  }
  function bindPage(id) {
    if (id !== 'promo') return;
    const root = document.getElementById('page');
    if (!root) return;
    root.querySelectorAll('[data-dp-action],[data-dp-tab]').forEach(b=>b.onclick=null);
    if(root.dataset.dpBound)return;
    root.dataset.dpBound = '1';
    root.addEventListener('click', event => {
      const tab = event.target.closest('[data-dp-tab]');
      if (tab) { activeTab = tab.dataset.dpTab; rerender(); return; }
      const btn = event.target.closest('[data-dp-action]');
      if (!btn) return;
      event.preventDefault();
      runAction(btn.dataset.dpAction, btn.dataset.dpId || '', btn);
    });
    root.addEventListener('change', event => {
      const filter = event.target.closest('[data-dp-filter]');
      if (filter) { filters[filter.dataset.dpFilter] = filter.value; rerender(); return; }
      const file = event.target.closest('[data-dp-file]');
      if (file && file.files?.[0]) {
        const reader = new FileReader();
        reader.onload = () => importCSV(String(reader.result || ''));
        reader.readAsText(file.files[0], 'utf-8');
        file.value = '';
      }
    });
    root.addEventListener('input', event => {
      const text = event.target.closest('[data-dp-filter-text]');
      if (text) filters[text.dataset.dpFilterText] = text.value;
    });
  }
  function handleAction(button, context) {
    const btn = button?.closest ? button.closest('[data-dp-action]') : null;
    if (!btn) return false;
    return runAction(btn.dataset.dpAction, btn.dataset.dpId || '', btn);
  }
  function rerender() {
    const root = document.getElementById('page');
    if (!root) return;
    root.innerHTML = pageHTML();
  }

  E.register({ renderPage, bindPage, handleAction },true);
  W.AdminDemoPromo={get records(){return JSON.parse(JSON.stringify(store));},memberAttribution,captureScan,attributedAmount,buildCSV,bindingDetails};
  try { W.AdminDemoData?.ensure?.(); } catch (_) { /* 演示推广闭环不依赖共享主数据 */ }
})();
