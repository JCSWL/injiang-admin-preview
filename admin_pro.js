// ===== icons =====
const ICO = {
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>',
  file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  store:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1-5h16l1 5M4 9v11h16V9M9 22V12h6v10"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  msg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
  qr:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h4v4h-4z"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>',
  buoy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>',
  bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>',
  gift:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  check2:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  dl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  filter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  more:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  trend:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
};

// ===== menu =====
const MENU = [
  { g:"工作台", items:[
    {id:"todo",n:"待办中心",i:"check",b:"5"},
    {id:"review",n:"审核处理",i:"check2"},
    {id:"dashboard",n:"数据看板",i:"chart"},
    {id:"report",n:"经营报表",i:"dl"},
    {id:"risk",n:"风险提醒",i:"bell",b:"3"},
  ]},
  { g:"日常业务", items:[
    {id:"order",n:"订单管理",i:"buoy"},
    {id:"activity",n:"活动与旅行团",i:"cal",b:"3"},
    {id:"checkin",n:"到店核销",i:"check2"},
    {id:"member",n:"会员管理",i:"user"},
  ]},
  { g:"内容资料", items:[
    {id:"merchant",n:"商户管理",i:"store"},
    {id:"guide",n:"向导管理",i:"users"},
    {id:"shop",n:"商品管理",i:"bag"},
    {id:"content",n:"攻略图文",i:"file"},
    {id:"destination",n:"目的地管理",i:"pin"},
    {id:"ranking",n:"玩法榜单",i:"gift"},
  ]},
  { g:"展示与推广", items:[
    {id:"home",n:"首页配置",i:"home"},
    {id:"coupon",n:"优惠券管理",i:"gift"},
    {id:"promo",n:"场景推广码",i:"qr"},
  ]},
  { g:"客服与通知", items:[
    {id:"group_qr",n:"官方社群",i:"msg"},
    {id:"notify",n:"消息通知",i:"bell"},
    {id:"service",n:"客服 + AI 向导",i:"msg"},
  ]},
  { g:"系统设置", items:[
    {id:"account",n:"账号与权限",i:"shield"},
    {id:"city",n:"多城市管理",i:"pin"},
    {id:"oplog",n:"操作日志",i:"file"},
  ]},
];

// ===== 角色模型：管理层只看经营汇总，运营/超管分工 =====
const ROLES = {
  boss:  { short:'管理层', full:'管理层(老板层面)', char:'管', person:'李老板', city:'全部城市', scopeLabel:'查看范围', readonly:true },
  ops:   { short:'运营',   full:'运营人员',         char:'运', person:'王小田', city:'乌鲁木齐', scopeLabel:'授权城市', readonly:false },
  admin: { short:'超管',   full:'超级管理员',       char:'超', person:'赵超管', city:'全部城市', scopeLabel:'管理范围', readonly:false },
};
const ROLE_ORDER = ['boss','ops','admin'];
let ROLE = 'ops';
// 管理层不是运营明细的只读副本；审核仅运营/超管可进入。
const ROLE_MENU = {
  boss:  ['dashboard','report','risk'],
  ops:   ['dashboard','todo','review','merchant','guide','activity','shop','destination','ranking','content','checkin','order','promo','coupon','member','notify','service','group_qr','home'],
  admin: ['dashboard','todo','review','merchant','guide','activity','shop','destination','ranking','content','checkin','order','promo','coupon','member','notify','service','group_qr','home','city','account','oplog'],
};

// ===== helpers =====
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => { const e = document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; };
function svg(name){ return `<svg class="ico">${ICO[name]||ICO.home}</svg>`.replace('<svg class="ico">','<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">').replace('viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">','viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'); }
function ico(name){ return ICO[name] ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO[name])}</svg>` : ''; }
function extract(svgStr){ return svgStr.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,''); }

function openDrawer(title, body, footer){
  const root = $('modal-root');
  root.innerHTML = `<div class="modal-mask" onclick="if(event.target===this)this.remove()">
    <div class="drawer" onclick="event.stopPropagation()">
      <div class="dr-hd"><div class="dr-t">${title}</div><button class="btn btn-ghost btn-icon" onclick="document.querySelector('.modal-mask').remove()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
      <div class="dr-bd">${body}</div>
      ${footer?`<div class="dr-ft">${footer}</div>`:''}
    </div>
  </div>`;
}

// ===== Fake data =====
const DATA = {
  merchants: [
    {id:'M1024', name:'塞外馕坑', cat:'美食', avg:68, zone:'大巴扎商圈', disc:0.8, cert:true, tel:'0991-8823456', hits:127, status:'上架'},
    {id:'M1025', name:'阿依努古丽手抓饭', cat:'美食', avg:52, zone:'新市区', disc:0.85, cert:true, tel:'0991-4667788', hits:98, status:'上架'},
    {id:'M1026', name:'和田玉石文化馆', cat:'购物', avg:280, zone:'国际大巴扎', disc:0.9, cert:true, tel:'0991-2331122', hits:34, status:'上架'},
    {id:'M1027', name:'穆罕默德烤全羊', cat:'美食', avg:158, zone:'南门商圈', disc:0.75, cert:true, tel:'0991-5678901', hits:216, status:'上架'},
    {id:'M1028', name:'红山公园观景台餐厅', cat:'景点', avg:88, zone:'红山', disc:0.85, cert:false, tel:'0991-2231122', hits:12, status:'下架'},
    {id:'M1029', name:'吐鲁番葡萄园直营店', cat:'购物', avg:120, zone:'新市区', disc:0.88, cert:true, tel:'0991-3344556', hits:76, status:'上架'},
    {id:'M1030', name:'古丽新疆家宴', cat:'美食', avg:95, zone:'高新区', disc:0.8, cert:true, tel:'0991-6677889', hits:143, status:'上架'},
    {id:'M1031', name:'伊犁风味大盘鸡', cat:'美食', avg:78, zone:'水磨沟区', disc:0.82, cert:true, tel:'0991-7788990', hits:67, status:'冻结'},
  ],
  guides: [
    {id:'G001', name:'阿依古丽', type:'个人向导', region:'南疆环线', rating:4.9, tours:12, cert:true, status:'上架'},
    {id:'G002', name:'马木提', type:'亲属名下团', region:'喀纳斯专线', rating:4.8, tours:8, cert:true, status:'上架'},
    {id:'G003', name:'新疆天山旅行社', type:'外部合作旅行团', region:'全境', rating:4.7, tours:32, cert:true, status:'上架'},
    {id:'G004', name:'古丽米娜', type:'个人向导', region:'伊犁草原', rating:4.9, tours:15, cert:true, status:'上架'},
    {id:'G005', name:'艾克拜尔', type:'个人向导', region:'吐鲁番', rating:4.6, tours:6, cert:false, status:'下架'},
  ],
  activities: [
    {id:'A2601', name:'五一南疆环线 6 日', type:'向导带队', guide:'阿依古丽', paid:true, price:3800, cap:15, min:6, joined:11, start:'2026-05-01', status:'上架'},
    {id:'A2602', name:'喀纳斯秋色 4 日', type:'向导带队', guide:'马木提', paid:true, price:2800, cap:12, min:6, joined:8, start:'2026-10-15', status:'上架'},
    {id:'A2603', name:'官方 · 大巴扎美食夜游', type:'官方带队', guide:'-', paid:false, price:0, cap:30, min:8, joined:22, start:'2026-04-20', status:'上架'},
    {id:'A2604', name:'伊犁草原骑行 3 日', type:'向导带队', guide:'古丽米娜', paid:true, price:1980, cap:10, min:5, joined:3, start:'2026-06-08', status:'上架'},
    {id:'A2605', name:'吐鲁番葡萄采摘一日', type:'外部合作旅行团', guide:'新疆天山旅行社', paid:true, price:288, cap:40, min:15, joined:37, start:'2026-08-25', status:'上架'},
    {id:'U2601', name:'沙漠露营局', type:'用户自发起', guide:'甜甜圈（发起人）', paid:true, price:280, cap:8, min:4, joined:5, start:'2026-05-03', status:'待审'},
    {id:'U2602', name:'一起去大巴扎逛吃', type:'用户自发起', guide:'旅友_明月（发起人）', paid:false, price:0, cap:6, min:3, joined:2, start:'2026-04-25', status:'待审'},
    {id:'U2603', name:'南山骑行', type:'用户自发起', guide:'背包客小王（发起人）', paid:true, price:120, cap:6, min:3, joined:1, start:'2026-05-10', status:'待审'},
  ],
  members: [
    {id:'U10001', nick:'旅友_明月', avatar:'明', src:'出租车推广码', from:'上海', reg:'2026-03-01', hits:8, spent:3800, points:4120, tag:['深度旅友'], status:'正常'},
    {id:'U10002', nick:'背包客小王', avatar:'王', src:'直接注册', from:'北京', reg:'2026-03-04', hits:12, spent:5680, points:6350, tag:['深度旅友','已复购'], status:'正常'},
    {id:'U10003', nick:'摄影师阿黎', avatar:'黎', src:'分享裂变', from:'广州', reg:'2026-03-08', hits:5, spent:1580, points:1810, tag:[], status:'正常'},
    {id:'U10004', nick:'甜甜圈', avatar:'甜', src:'酒店推广码', from:'成都', reg:'2026-03-12', hits:3, spent:288, points:410, tag:['新人'], status:'正常'},
    {id:'U10005', nick:'徐先生', avatar:'徐', src:'直接注册', from:'杭州', reg:'2026-03-14', hits:0, spent:0, points:100, tag:[], status:'封禁'},
    {id:'U10006', nick:'远方的舟', avatar:'舟', src:'大巴扎推广码', from:'南京', reg:'2026-03-16', hits:6, spent:2288, points:2500, tag:['深度旅友'], status:'正常'},
  ],
  checkins: [
    {id:'C88201', user:'旅友_明月', merch:'塞外馕坑', time:'2026-04-15 12:34', reviewed:true, flag:''},
    {id:'C88202', user:'背包客小王', merch:'穆罕默德烤全羊', time:'2026-04-15 19:22', reviewed:true, flag:''},
    {id:'C88203', user:'摄影师阿黎', merch:'和田玉石文化馆', time:'2026-04-16 10:11', reviewed:false, flag:''},
    {id:'C88204', user:'背包客小王', merch:'塞外馕坑', time:'2026-04-16 13:45', reviewed:true, flag:''},
    {id:'C88205', user:'甜甜圈', merch:'古丽新疆家宴', time:'2026-04-16 20:03', reviewed:false, flag:'疑似批量刷卡'},
    {id:'C88206', user:'甜甜圈', merch:'伊犁风味大盘鸡', time:'2026-04-16 20:07', reviewed:false, flag:'疑似批量刷卡'},
    {id:'C88207', user:'远方的舟', merch:'吐鲁番葡萄园直营店', time:'2026-04-17 15:22', reviewed:true, flag:''},
  ],
  orders: [
    {id:'O26041001', buyer:'旅友_明月', product:'和田大枣 · 500g 礼盒', qty:2, amt:136, status:'待发货', logistics:'', payTime:'2026-04-14 10:22'},
    {id:'O26041002', buyer:'远方的舟', product:'阿克苏混合坚果 · 1kg', qty:1, amt:88, status:'已发货', logistics:'SF1234567890', payTime:'2026-04-14 15:04'},
    {id:'O26041003', buyer:'背包客小王', product:'哈萨克手工奶疙瘩 · 500g', qty:3, amt:135, status:'已签收', logistics:'SF0987654321', payTime:'2026-04-13 09:11'},
    {id:'O26041004', buyer:'摄影师阿黎', product:'吐鲁番葡萄干 · 礼盒装', qty:1, amt:68, status:'售后中', logistics:'SF6543219870', payTime:'2026-04-12 18:50'},
  ],
  products: [
    {id:'P0001', name:'和田大枣 · 精选礼盒', cat:'干果蜜饯', origin:'和田', skus:3, stock:428, price:68, sales:127, status:'上架'},
    {id:'P0002', name:'阿克苏混合坚果', cat:'干果蜜饯', origin:'阿克苏', skus:2, stock:216, price:88, sales:86, status:'上架'},
    {id:'P0003', name:'哈萨克手工奶疙瘩', cat:'奶制品', origin:'伊犁', skus:2, stock:108, price:45, sales:52, status:'上架'},
    {id:'P0004', name:'吐鲁番葡萄干', cat:'干果蜜饯', origin:'吐鲁番', skus:4, stock:520, price:38, sales:203, status:'上架'},
    {id:'P0005', name:'新疆手工艾德莱斯丝巾', cat:'手工艺', origin:'和田', skus:5, stock:32, price:158, sales:12, status:'下架'},
    {id:'P0006', name:'塔城手工大馕（10 个装）', cat:'馕与主食', origin:'塔城', skus:2, stock:180, price:39, sales:64, status:'上架'},
  ],
  promos: [
    {id:'PC-001', channel:'出租车', batch:'202609 出租车首批', qty:1000, scans:3421, regs:287, gmv:34580, ratio:1.0},
    {id:'PC-002', channel:'酒店', batch:'202609 酒店合作方 A', qty:200, scans:1128, regs:156, gmv:22400, ratio:2.0},
    {id:'PC-003', channel:'大巴扎', batch:'202609 大巴扎摊主', qty:150, scans:842, regs:89, gmv:12800, ratio:1.5},
    {id:'PC-004', channel:'导游', batch:'202609 导游合作', qty:80, scans:220, regs:44, gmv:6600, ratio:3.0},
  ],
};

// ===== Common components =====
function statusChip(status){
  const map = {
    '上架':['success','上架'], '下架':['mut','下架'], '冻结':['err','冻结'],
    '正常':['success','正常'], '封禁':['err','封禁'],
    '待发货':['warn','待发货'], '已发货':['info','已发货'], '已签收':['success','已签收'], '售后中':['err','售后中'], '待付款':['mut','待付款'], '已取消':['mut','已取消'],
    '启用':['success','启用'], '停用':['mut','停用'],
    '疑似批量刷卡':['err','疑似批量刷卡'], '疑似异常放量':['warn','疑似异常放量'],
    '已确认':['success','已确认'], '待确认':['warn','待确认'], '已作废':['mut','已作废'],
    '待审':['warn','待审'], '已通过':['success','已通过'], '已拒绝':['err','已拒绝'],
    '待成行':['warn','待成行'], '已成行':['success','已成行'],
  };
  const [cls, lbl] = map[status] || ['mut', status];
  return `<span class="chip chip-dot ${cls}">${lbl}</span>`;
}

function crumbHTML(page){
  return `<div class="crumb"><span>in疆 管理端</span><span class="sep">/</span><span class="cur">${page}</span></div>`;
}

function topRight(){
  const r = ROLES[ROLE];
  const sw = ROLE_ORDER.map(k=>`<button class="rs-btn${k===ROLE?' on':''}" data-role="${k}">${ROLES[k].short}</button>`).join('');
  return `<div class="tb-r">
    <div class="search-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">${extract(ICO.search)}</svg>搜索模块或字段<span class="kbd">⌘K</span></div>
    <div class="role-switch" id="roleSwitch">${sw}</div>
    <button class="btn btn-ghost btn-icon">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'+extract(ICO.bell)+'</svg>'}</button>
    <div class="avatar" title="${r.full}">${r.char}</div>
  </div>`;
}

function paginationHTML(total, pageSize, current){
  const totalPages = Math.max(1, Math.ceil(total/pageSize));
  let btns = '';
  const cur = current||1;
  btns += `<button class="pag-btn" ${cur<=1?'disabled':''}>‹</button>`;
  for(let i=1;i<=Math.min(totalPages,5);i++){
    btns += `<button class="pag-btn ${i===cur?'active':''}">${i}</button>`;
  }
  btns += `<button class="pag-btn" ${cur>=totalPages?'disabled':''}>›</button>`;
  return `<div class="pag"><div>共 <strong>${total}</strong> 条 · 每页 ${pageSize} 条</div><div class="pag-btns">${btns}</div></div>`;
}

function tableToolbar(searchPh, filters, actions){
  return `<div class="tbar">
    <div class="tbar-l">
      <div class="inp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.search)}</svg><input placeholder="${searchPh}"/></div>
      ${filters||''}
    </div>
    <div class="tbar-r">${actions||''}</div>
  </div>`;
}

// ===== Sidebar =====
function renderSidebar(activeId){
  const r = ROLES[ROLE];
  const allowed = ROLE_MENU[ROLE] || [];
  let html = `<div class="brand">
    <div class="brand-logo">in</div>
    <div class="brand-txt"><div class="brand-name">in疆 管理端</div><div class="brand-tag">乌鲁木齐 · v1.0</div></div>
  </div>`;
  MENU.forEach(g=>{
    const items = g.items.filter(it=>allowed.includes(it.id));
    if(!items.length) return;
    const isActive = items.some(it=>it.id===activeId);
    html += `<div class="grp${isActive?'':' collapsed'}">
      <div class="grp-t"><span class="grp-chev"></span><span>${g.g}</span></div>
      <div class="grp-body">`;
    items.forEach(it=>{
      const active = it.id===activeId?' active':'';
      const bdg = it.b ? `<span class="bdg" style="background:#d70015;color:#fff">${it.b}</span>` : '';
      html += `<div class="nav${active}" data-id="${it.id}"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO[it.i])}</svg><span class="lbl">${it.n}</span>${bdg}</div>`;
    });
    html += `</div></div>`;
  });
  html += `<div class="side-ft">当前登录：${r.short} · ${r.person}<br/>${r.scopeLabel}：${r.city}</div>`;
  $('sidebar').innerHTML = html;
  $('sidebar').querySelectorAll('.nav').forEach(el=>{
    el.addEventListener('click',()=>navigate(el.dataset.id));
  });
  $('sidebar').querySelectorAll('.grp-t').forEach(el=>{
    el.addEventListener('click',()=>el.parentElement.classList.toggle('collapsed'));
  });
}

function navigate(id){
  if(!ROLE_MENU[ROLE].includes(id) || !PAGES[id]) id = 'dashboard';
  $('modal-root').replaceChildren();
  renderSidebar(id);
  const fn = PAGES[id] || PAGES.dashboard;
  fn();
  bindRoleSwitch();
  wrapTables();
  applyRoleUI();
  simplifyPage(id);
  window.PrototypeUI?.bind(id);
  location.hash = id;
  document.querySelector('.main').scrollTop = 0;
}

// 给每张表格套一层横向滚动容器，窄屏下滚动而非被裁剪
function wrapTables(){
  document.querySelectorAll('.tbl').forEach(t=>{
    if(t.parentElement.classList.contains('tbl-scroll')) return;
    const w = document.createElement('div');
    w.className = 'tbl-scroll';
    t.parentNode.insertBefore(w, t);
    w.appendChild(t);
  });
}

function bindRoleSwitch(){
  const sw = $('roleSwitch');
  if(!sw) return;
  sw.querySelectorAll('.rs-btn').forEach(b=>{
    b.onclick = ()=>{
      const next = b.dataset.role;
      if(next===ROLE) return;
      ROLE = next;
      const cur = (location.hash||'#dashboard').slice(1);
      const allowed = ROLE_MENU[ROLE] || [];
      navigate(allowed.includes(cur) && PAGES[cur] ? cur : 'dashboard');
    };
  });
}

// 只读角色：渲染后收紧交互（隐藏操作列、主按钮、导入/新增类动作，保留查看/导出）
function applyRoleUI(){
  const r = ROLES[ROLE];
  document.body.classList.toggle('readonly', !!r.readonly);
  if(!r.readonly) return;
  document.querySelectorAll('.row-acts').forEach(n=>n.style.display='none');
  document.querySelectorAll('.btn-primary').forEach(n=>n.style.display='none');
  document.querySelectorAll('.tbl thead th').forEach(n=>{ if(n.querySelector('input[type=checkbox]') || n.textContent.trim()==='操作') n.style.display='none'; });
  document.querySelectorAll('.tbl tbody tr').forEach(tr=>{
    const first = tr.querySelector('td:first-child');
    if(first && first.querySelector('input[type=checkbox]')) first.style.display='none';
  });
  // 工具栏/页头按钮：只保留 查看/导出/下载/刷新 这类只读动作
  document.querySelectorAll('.tbar-r .btn, .pg-hd-r .btn').forEach(n=>{
    const t = n.textContent.trim();
    if(!/导出|查看|下载|刷新|详情/.test(t)) n.style.display='none';
  });
}

// 列表页去掉顶部统计大卡，界面更简洁；数据看板/待办中心保留
function simplifyPage(id){
  if(id==='dashboard' || id==='todo') return;
  document.querySelectorAll('.pg .kpi-grid').forEach(n=>n.remove());
}

const PAGES = {};

// ==================== 数据看板 ====================
PAGES.dashboard = function(){
  $('topbar').innerHTML = crumbHTML('数据看板') + topRight();
  const bars = [42,58,67,73,89,102,95,118,132,145,138,162,178,195];
  const maxBar = Math.max(...bars);
  const funnels = [
    {name:'打开小程序', val:8420, rate:100},
    {name:'完成会员注册', val:3162, rate:37.6},
    {name:'到店打卡成功', val:1287, rate:15.3},
    {name:'评价确认（已核销）', val:892, rate:10.6},
  ];
  const merchTop = [...DATA.merchants].sort((a,b)=>b.hits-a.hits).slice(0,6);
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>数据看板</h1><div class="sub">乌鲁木齐 · 更新于 2 分钟前</div></div>
      <div class="pg-hd-r">
        <select class="sel"><option>本周</option><option>今日</option><option>本月</option><option>自定义</option></select>
        <button class="btn btn-outline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.dl)}</svg>导出</button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-l">日活会员<svg class="kpi-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.trend)}</svg></div><div class="kpi-v">2,148</div><div class="kpi-d">↑ 12.4% vs 上周</div></div>
      <div class="kpi"><div class="kpi-l">新增会员<svg class="kpi-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.user)}</svg></div><div class="kpi-v">576</div><div class="kpi-d">↑ 8.7% vs 上周</div></div>
      <div class="kpi"><div class="kpi-l">已确认核销<svg class="kpi-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.check)}</svg></div><div class="kpi-v">892</div><div class="kpi-d">打卡 1,287 · 确认率 69%</div></div>
      <div class="kpi"><div class="kpi-l">用户自发上车<svg class="kpi-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.users)}</svg></div><div class="kpi-v">42</div><div class="kpi-d">成行 28 · 未成 14</div></div>
    </div>

    <div class="three-col mb-4">
      <div class="card">
        <div class="card-hd"><div class="card-hd-l"><div class="card-t">近 14 天新增会员</div><div class="card-d">按天分层展示注册量</div></div><select class="sel"><option>全部渠道</option><option>推广码</option><option>分享裂变</option></select></div>
        <div class="chart-box">
          <div class="mini-bars">
            ${bars.map(v=>`<div class="bar" style="height:${(v/maxBar*100).toFixed(0)}%" title="${v}"></div>`).join('')}
          </div>
          <div class="bars-lbl"><span>04-05</span><span>04-09</span><span>04-13</span><span>04-17</span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-hd"><div class="card-hd-l"><div class="card-t">转化漏斗</div><div class="card-d">4 步转化</div></div></div>
        <div class="chart-box">
          ${funnels.map((f,i)=>`<div class="funnel-row"><div class="bg" style="width:${f.rate}%"></div><div class="content"><span class="name">${i+1}. ${f.name}</span><span><span class="val">${f.val.toLocaleString()}</span><span class="rate">${f.rate}%</span></span></div></div>`).join('')}
        </div>
      </div>
    </div>

    <div class="two-col mb-4">
      <div class="card">
        <div class="card-hd"><div class="card-hd-l"><div class="card-t">4 Tab 命中率</div><div class="card-d">用户打开首页后点了哪个 Tab</div></div></div>
        <div class="chart-box" style="display:flex;align-items:center;gap:24px">
          <div style="position:relative;width:140px;height:140px;flex-shrink:0">
            <svg viewBox="0 0 42 42" width="140" height="140">
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#f4f4f5" stroke-width="4"/>
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#18181b" stroke-width="4" stroke-dasharray="42 58" stroke-dashoffset="25" transform="rotate(-90 21 21)"/>
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#3b82f6" stroke-width="4" stroke-dasharray="28 72" stroke-dashoffset="-17" transform="rotate(-90 21 21)"/>
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#22c55e" stroke-width="4" stroke-dasharray="18 82" stroke-dashoffset="-45" transform="rotate(-90 21 21)"/>
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#f59e0b" stroke-width="4" stroke-dasharray="12 88" stroke-dashoffset="-63" transform="rotate(-90 21 21)"/>
            </svg>
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><div style="font-size:20px;font-weight:600">8,420</div><div class="text-mut text-xs">今日 UV</div></div>
          </div>
          <div style="flex:1">
            <div class="flex center between" style="padding:6px 0"><span class="flex center gap-2 text-sm"><span style="width:10px;height:10px;background:#18181b;border-radius:2px"></span>首页停留</span><span class="num cell-m">42%</span></div>
            <div class="flex center between" style="padding:6px 0"><span class="flex center gap-2 text-sm"><span style="width:10px;height:10px;background:#3b82f6;border-radius:2px"></span>攻略点击</span><span class="num cell-m">28%</span></div>
            <div class="flex center between" style="padding:6px 0"><span class="flex center gap-2 text-sm"><span style="width:10px;height:10px;background:#22c55e;border-radius:2px"></span>同游点击</span><span class="num cell-m">18%</span></div>
            <div class="flex center between" style="padding:6px 0"><span class="flex center gap-2 text-sm"><span style="width:10px;height:10px;background:#f59e0b;border-radius:2px"></span>商城点击</span><span class="num cell-m">12%</span></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-hd"><div class="card-hd-l"><div class="card-t">今日待办摘要</div><div class="card-d">来自待办中心</div></div><button class="btn btn-ghost btn-sm" onclick="navigate('todo')">查看全部 →</button></div>
        <div class="chart-box">
          <div style="padding:10px 12px;background:#fee2e2;border-radius:6px;margin-bottom:6px" class="flex center between"><span class="text-sm">🔴 待审核用户自发起活动</span><span class="cell-m">3 条</span></div>
          <div style="padding:10px 12px;background:#fee2e2;border-radius:6px;margin-bottom:6px" class="flex center between"><span class="text-sm">🔴 商户异常打卡告警</span><span class="cell-m">2 条</span></div>
          <div style="padding:10px 12px;background:#fef3c7;border-radius:6px;margin-bottom:6px" class="flex center between"><span class="text-sm">🟡 待审核评价</span><span class="cell-m">8 条</span></div>
          <div style="padding:10px 12px;background:#fef3c7;border-radius:6px" class="flex center between"><span class="text-sm">🟡 待审核向导实名</span><span class="cell-m">1 条</span></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-hd"><div class="card-hd-l"><div class="card-t">商户到店打卡 Top 排行</div><div class="card-d">按已确认核销数排序</div></div><button class="btn btn-ghost btn-sm">查看全部 →</button></div>
      <table class="tbl">
        <thead><tr><th style="width:60px">排名</th><th>商户</th><th>类目</th><th>商圈</th><th class="text-r">已确认核销</th><th class="text-r">当月新增</th><th class="text-r">占比</th></tr></thead>
        <tbody>
          ${merchTop.map((m,i)=>`<tr>
            <td class="num cell-m">${i+1}</td>
            <td class="cell-m">${m.name}</td>
            <td>${m.cat}</td>
            <td class="cell-mut">${m.zone}</td>
            <td class="num text-r">${m.hits}</td>
            <td class="num text-r" style="color:#16a34a">+${Math.floor(m.hits*0.15)}</td>
            <td class="num text-r">${(m.hits/892*100).toFixed(1)}%</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
};

// ==================== 商户管理 ====================
PAGES.merchant = function(){
  $('topbar').innerHTML = crumbHTML('商户管理') + topRight();
  const rows = DATA.merchants;
  const filters = `<select class="sel"><option>全部状态</option><option>上架</option><option>下架</option><option>冻结</option></select>`;
  const actions = `<button class="btn btn-outline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.dl)}</svg>导出</button><button class="btn btn-primary" onclick="openMerchDrawer()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.plus)}</svg>新增商户</button>`;

  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>商户管理</h1><div class="sub">商户不登录后台，全部由运营录入。分佣不入后台，运营在线下 Excel 独立维护。</div></div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="kpi"><div class="kpi-l">总商户数</div><div class="kpi-v">${rows.length}</div><div class="kpi-d">上架 ${rows.filter(r=>r.status==='上架').length}</div></div>
      <div class="kpi"><div class="kpi-l">本月新增</div><div class="kpi-v">3</div><div class="kpi-d">↑ 目标 5 家</div></div>
      <div class="kpi"><div class="kpi-l">认证商户</div><div class="kpi-v">${rows.filter(r=>r.cert).length}</div><div class="kpi-d">占比 ${(rows.filter(r=>r.cert).length/rows.length*100).toFixed(0)}%</div></div>
      <div class="kpi"><div class="kpi-l">本月核销</div><div class="kpi-v">892</div><div class="kpi-d">↑ 15.2%</div></div>
    </div>

    <div class="card">
      ${tableToolbar('搜索商户名 / ID / 电话', filters, actions)}
      <table class="tbl">
        <thead><tr>
          <th style="width:30px"><input type="checkbox"/></th>
          <th>商户</th>
          <th>ID</th>
          <th>类目</th>
          <th>商圈</th>
          <th class="text-r">人均</th>
          <th class="text-r">折扣</th>
          <th class="text-r">本月核销</th>
          <th>状态</th>
          <th style="width:150px">操作</th>
        </tr></thead>
        <tbody>
          ${rows.map(m=>`<tr>
            <td><input type="checkbox"/></td>
            <td>
              <div class="flex center gap-2">
                <div style="width:32px;height:32px;background:linear-gradient(135deg,#f97316,#dc2626);border-radius:5px;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600">${m.name[0]}</div>
                <div><div class="cell-m">${m.name}${m.cert?'<span class="chip info" style="margin-left:6px;font-size:10px">认证</span>':''}</div><div class="cell-mut text-xs">${m.tel}</div></div>
              </div>
            </td>
            <td class="num cell-mut">${m.id}</td>
            <td>${m.cat}</td>
            <td class="cell-mut">${m.zone}</td>
            <td class="num text-r">¥${m.avg}</td>
            <td class="num text-r cell-m">${(m.disc*10).toFixed(1)}折</td>
            <td class="num text-r">${m.hits}</td>
            <td>${statusChip(m.status)}</td>
            <td class="row-acts">
              <button class="btn btn-ghost" onclick="openMerchDrawer('${m.id}')">编辑</button>
              <button class="btn btn-ghost">核销记录</button>
              <button class="btn btn-ghost btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.more)}</svg></button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${paginationHTML(rows.length,10,1)}
    </div>
  `;
};

// Legacy merchant links delegate to the same editor as every other entry.
window.openMerchDrawer = function(id){
  const row=id?[...$('page').querySelectorAll('tbody tr')].find(r=>r.dataset.uxId===`merchant:${id}`):null;
  window.PrototypeUI?.editor('merchant',row,!id,id?'编辑商户':'新增商户');
};

// ==================== 向导管理 ====================
PAGES.guide = function(){
  $('topbar').innerHTML = crumbHTML('向导管理') + topRight();
  const rows = DATA.guides;
  const filters = `<select class="sel"><option>全部状态</option><option>上架</option><option>下架</option></select>`;
  const actions = `<button class="btn btn-outline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.dl)}</svg>导出</button><button class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.plus)}</svg>新增向导</button>`;

  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>向导管理</h1><div class="sub">向导不登录后台。分佣比例由运营在线下 Excel 单独维护，后台通过报名管理页的订单金额供核算。</div></div>
    </div>

    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-l">向导总数</div><div class="kpi-v">${rows.length}</div><div class="kpi-d">上架 ${rows.filter(r=>r.status==='上架').length}</div></div>
      <div class="kpi"><div class="kpi-l">个人向导</div><div class="kpi-v">${rows.filter(r=>r.type==='个人向导').length}</div><div class="kpi-d">占比 ${(rows.filter(r=>r.type==='个人向导').length/rows.length*100).toFixed(0)}%</div></div>
      <div class="kpi"><div class="kpi-l">合作旅行社</div><div class="kpi-v">${rows.filter(r=>r.type==='外部合作旅行团').length}</div><div class="kpi-d">具备牌照</div></div>
      <div class="kpi"><div class="kpi-l">本月总带团</div><div class="kpi-v">${rows.reduce((s,r)=>s+r.tours,0)}</div><div class="kpi-d">↑ 22.3%</div></div>
    </div>

    <div class="card">
      ${tableToolbar('搜索向导 / 路线', filters, actions)}
      <table class="tbl">
        <thead><tr>
          <th style="width:30px"><input type="checkbox"/></th>
          <th>向导</th>
          <th>ID</th>
          <th>主体类型</th>
          <th>擅长区域</th>
          <th class="text-r">评分</th>
          <th class="text-r">本月带团</th>
          <th>实名审核</th>
          <th>状态</th>
          <th style="width:150px">操作</th>
        </tr></thead>
        <tbody>
          ${rows.map(g=>`<tr>
            <td><input type="checkbox"/></td>
            <td>
              <div class="flex center gap-2">
                <div style="width:32px;height:32px;background:linear-gradient(135deg,#8b5cf6,#6366f1);border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600">${g.name[0]}</div>
                <div class="cell-m">${g.name}</div>
              </div>
            </td>
            <td class="num cell-mut">${g.id}</td>
            <td><span class="chip mut">${g.type}</span></td>
            <td class="cell-mut">${g.region}</td>
            <td class="num text-r cell-m">⭐ ${g.rating}</td>
            <td class="num text-r">${g.tours}</td>
            <td>${g.cert?'<span class="chip success">已通过</span>':'<span class="chip warn">待审核</span>'}</td>
            <td>${statusChip(g.status)}</td>
            <td class="row-acts">
              <button class="btn btn-ghost">编辑</button>
              <button class="btn btn-ghost">路线</button>
              <button class="btn btn-ghost btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.more)}</svg></button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${paginationHTML(rows.length,10,1)}
    </div>
  `;
};

// ==================== 活动与旅行团 ====================
PAGES.activity = function(){
  $('topbar').innerHTML = crumbHTML('活动与旅行团') + topRight();
  const rows = DATA.activities;
  const filters = `<select class="sel"><option>全部状态</option><option>上架</option><option>下架</option><option>待审</option></select>`;
  const actions = `<button class="btn btn-outline">批量导出</button><button class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.plus)}</svg>发布活动</button>`;

  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>活动与旅行团</h1><div class="sub">官方、向导及合作活动可按收费方式管理；用户约伴费用自行协商，平台不代收。</div></div>
    </div>

    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-l">上架活动</div><div class="kpi-v">${rows.filter(r=>r.status==='上架').length}</div></div>
      <div class="kpi"><div class="kpi-l">已成团</div><div class="kpi-v">${rows.filter(r=>r.joined>=r.min).length}</div><div class="kpi-d">达最低成团人数</div></div>
      <div class="kpi"><div class="kpi-l">未达成团</div><div class="kpi-v">${rows.filter(r=>r.joined<r.min).length}</div><div class="kpi-d down">需运营干预</div></div>
      <div class="kpi"><div class="kpi-l">用户自发起待审</div><div class="kpi-v" style="color:#dc2626">${rows.filter(r=>r.type==='用户自发起' && r.status==='待审').length}</div><div class="kpi-d down">需人工审核</div></div>
    </div>

    <div class="card">
      ${tableToolbar('搜索活动名 / ID', filters, actions)}
      <table class="tbl">
        <thead><tr>
          <th>活动</th>
          <th>类型</th>
          <th>关联向导 / 合作方</th>
          <th class="text-r">价格</th>
          <th>报名进度</th>
          <th>开始时间</th>
          <th>状态</th>
          <th style="width:130px">操作</th>
        </tr></thead>
        <tbody>
          ${rows.map(a=>{
            const pct = Math.min(100, (a.joined/a.cap*100)).toFixed(0);
            const reachMin = a.joined>=a.min;
            return `<tr>
              <td><div class="cell-m">${a.name}</div><div class="cell-mut text-xs num">${a.id}</div></td>
              <td><span class="chip ${a.type==='官方带队'?'primary':a.type==='向导带队'?'info':a.type==='用户自发起'?'warn':'mut'}">${a.type}</span></td>
              <td class="cell-mut">${a.guide}</td>
              <td class="num text-r cell-m">${a.paid?'¥'+a.price:'<span class="chip success">免费</span>'}</td>
              <td>
                <div class="flex center gap-2">
                  <div style="flex:1;height:6px;background:#f4f4f5;border-radius:3px;overflow:hidden;min-width:80px"><div style="height:100%;background:${reachMin?'#22c55e':'#f59e0b'};width:${pct}%"></div></div>
                  <span class="num text-xs">${a.joined}/${a.cap} · 最低${a.min}</span>
                </div>
              </td>
              <td class="num cell-mut text-xs">${a.start}</td>
              <td>${statusChip(a.status)}</td>
              <td class="row-acts">
                <button class="btn btn-ghost">报名列表</button>
                <button class="btn btn-ghost">编辑</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      ${paginationHTML(rows.length,10,1)}
    </div>
  `;
};

// ==================== 会员管理 ====================
PAGES.member = function(){
  $('topbar').innerHTML = crumbHTML('会员管理') + topRight();
  const rows = DATA.members;
  const filters = `<select class="sel"><option>全部状态</option><option>正常</option><option>封禁</option></select>`;
  const actions = `<button class="btn btn-outline">批量打标签</button><button class="btn btn-outline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.dl)}</svg>导出</button>`;

  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>会员管理</h1><div class="sub">会员三档等级：旅友 LV.1 / 常客 LV.2 / 挚友 LV.3。积分只累计不兑换。</div></div>
    </div>

    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-l">会员总数</div><div class="kpi-v">3,247</div><div class="kpi-d">↑ 576 本周</div></div>
      <div class="kpi"><div class="kpi-l">已核销会员</div><div class="kpi-v">892</div><div class="kpi-d">占比 27.5%</div></div>
      <div class="kpi"><div class="kpi-l">复购会员</div><div class="kpi-v">218</div><div class="kpi-d">↑ 15.4%</div></div>
      <div class="kpi"><div class="kpi-l">三档等级分布</div><div class="kpi-v" style="font-size:14px;line-height:1.4"><span class="chip mut" style="margin-right:4px">旅友 2,355</span><span class="chip info" style="margin-right:4px">常客 673</span><span class="chip primary">挚友 219</span></div><div class="kpi-d">挚友已解锁专属向导</div></div>
    </div>

    <div class="card">
      ${tableToolbar('搜索昵称 / 手机 / ID', filters, actions)}
      <table class="tbl">
        <thead><tr>
          <th style="width:30px"><input type="checkbox"/></th>
          <th>会员</th>
          <th>来源渠道</th>
          <th>来自城市</th>
          <th>等级</th>
          <th class="text-r">打卡</th>
          <th class="text-r">累计消费</th>
          <th class="text-r">积分</th>
          <th>标签</th>
          <th>状态</th>
          <th style="width:100px">操作</th>
        </tr></thead>
        <tbody>
          ${rows.map(m=>`<tr>
            <td><input type="checkbox"/></td>
            <td>
              <div class="flex center gap-2">
                <div style="width:30px;height:30px;background:linear-gradient(135deg,#8b5cf6,#6366f1);border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600">${m.avatar}</div>
                <div><div class="cell-m">${m.nick}</div><div class="cell-mut text-xs num">${m.id}</div></div>
              </div>
            </td>
            <td>${m.src.includes('推广码')?`<span class="chip info">${m.src}</span>`:m.src==='分享裂变'?'<span class="chip warn">'+m.src+'</span>':m.src}</td>
            <td class="cell-mut">${m.from}</td>
            <td>${m.hits>=5?'<span class="chip primary">挚友 LV.3</span>':m.hits>=1?'<span class="chip info">常客 LV.2</span>':'<span class="chip mut">旅友 LV.1</span>'}</td>
            <td class="num text-r">${m.hits}</td>
            <td class="num text-r cell-m">¥${m.spent.toLocaleString()}</td>
            <td class="num text-r">${m.points.toLocaleString()}</td>
            <td>${m.tag.map(t=>`<span class="chip ${t==='深度旅友'?'primary':t==='已复购'?'success':'mut'}" style="font-size:10px">${t}</span>`).join(' ')}</td>
            <td>${statusChip(m.status)}</td>
            <td class="row-acts">
              <button class="btn btn-ghost">查看</button>
              <button class="btn btn-ghost btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.more)}</svg></button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${paginationHTML(3247,10,1)}
    </div>
  `;
};

// ==================== 到店核销 ====================
PAGES.checkin = function(){
  $('topbar').innerHTML = crumbHTML('到店核销') + topRight();
  const rows = DATA.checkins;
  const filters = `<select class="sel"><option>全部状态</option><option>已确认</option><option>待确认</option><option>已作废</option></select>`;
  const actions = `<button class="btn btn-outline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.dl)}</svg>导出核销记录</button>`;

  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>到店核销</h1><div class="sub">方案 M · 店内静态二维码 + 事后评价确认。用户扫店内码唤起会员卡，事后评价才计入核销。</div></div>
      <div class="pg-hd-r"><button class="btn btn-outline">核销规则配置</button></div>
    </div>

    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-l">今日打卡</div><div class="kpi-v">124</div><div class="kpi-d">↑ 12 vs 昨日</div></div>
      <div class="kpi"><div class="kpi-l">已确认</div><div class="kpi-v">87</div><div class="kpi-d">确认率 70%</div></div>
      <div class="kpi"><div class="kpi-l">待确认（24h内）</div><div class="kpi-v">28</div><div class="kpi-d">已推送评价</div></div>
      <div class="kpi"><div class="kpi-l">异常标记</div><div class="kpi-v">9</div><div class="kpi-d down">需运营核实</div></div>
    </div>

    <div class="two-col mb-4">
      <div class="card">
        <div class="card-hd"><div class="card-hd-l"><div class="card-t">核销规则配置</div></div><button class="btn btn-ghost btn-sm">编辑</button></div>
        <div class="card-bd pd">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
            <div><div class="text-mut text-xs mb-3">评价推送延迟</div><div style="font-size:20px;font-weight:600">3 <span class="text-sm text-mut">小时</span></div></div>
            <div><div class="text-mut text-xs mb-3">评价确认有效期</div><div style="font-size:20px;font-weight:600">24 <span class="text-sm text-mut">小时</span></div></div>
            <div><div class="text-mut text-xs mb-3">每人每店日限打卡</div><div style="font-size:20px;font-weight:600">1 <span class="text-sm text-mut">次</span></div></div>
            <div><div class="text-mut text-xs mb-3">异常告警阈值</div><div style="font-size:20px;font-weight:600">3× <span class="text-sm text-mut">日均</span></div></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-hd"><div class="card-hd-l"><div class="card-t">异常监控自动规则</div></div></div>
        <div class="card-bd pd">
          <div class="flex center between mb-3" style="padding:8px 10px;background:var(--accent);border-radius:5px"><span class="text-sm">同用户 10 分钟内跨 3 个及以上不同商户</span><span class="chip err">批量刷卡</span></div>
          <div class="flex center between" style="padding:8px 10px;background:var(--accent);border-radius:5px"><span class="text-sm">同一商户日打卡数超过历史均值 3 倍</span><span class="chip warn">异常放量</span></div>
        </div>
      </div>
    </div>

    <div class="card">
      ${tableToolbar('搜索核销 ID / 用户 / 商户', filters, actions)}
      <table class="tbl">
        <thead><tr>
          <th>核销 ID</th>
          <th>会员</th>
          <th>商户</th>
          <th>打卡时间</th>
          <th>凭据</th>
          <th>评价确认</th>
          <th>异常标记</th>
          <th style="width:100px">操作</th>
        </tr></thead>
        <tbody>
          ${rows.map(c=>`<tr>
            <td class="num cell-mut">${c.id}</td>
            <td class="cell-m">${c.user}</td>
            <td>${c.merch}</td>
            <td class="num cell-mut text-xs">${c.time}</td>
            <td class="cell-mut text-xs">店内二维码</td>
            <td>${c.reviewed?'<span class="chip success">已确认</span>':'<span class="chip warn">待确认</span>'}</td>
            <td>${c.flag?statusChip(c.flag):'<span class="text-mut text-xs">—</span>'}</td>
            <td class="row-acts"><button class="btn btn-ghost">详情</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${paginationHTML(1287,10,1)}
    </div>
  `;
};

// ==================== 首页配置 ====================
PAGES.home = function(){
  $('topbar').innerHTML = crumbHTML('首页配置') + topRight();
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>首页配置</h1><div class="sub">只保留轮播图（最多 3 张）。首页其他入口和板块由前端代码写死。</div></div>
      <div class="pg-hd-r"><button class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.plus)}</svg>添加轮播</button></div>
    </div>
    <div class="card">
      <div class="card-hd"><div class="card-hd-l"><div class="card-t">轮播图（2/3 位已使用）</div><div class="card-d">拖拽调整排序，实时生效</div></div></div>
      <div class="card-bd pd">
        <div class="banner-card">
          <div class="banner-img">五一南疆环线<br/>限时报名</div>
          <div class="banner-info">
            <div class="n">五一南疆环线 6 日</div>
            <div class="m">→ /pages/activity/detail?id=A2601</div>
            <div class="text-mut text-xs mt-3">上线 2026-04-01 · 下线 2026-05-05 · 排序 <b>1</b></div>
          </div>
          <div class="banner-acts">
            <label class="switch"><input type="checkbox" checked/><span class="track"></span></label>
            <button class="btn btn-outline btn-sm">编辑</button>
            <button class="btn btn-ghost btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.more)}</svg></button>
          </div>
        </div>
        <div class="banner-card">
          <div class="banner-img b2">大巴扎美食夜游<br/>免费参与</div>
          <div class="banner-info">
            <div class="n">官方 · 大巴扎美食夜游</div>
            <div class="m">→ /pages/activity/detail?id=A2603</div>
            <div class="text-mut text-xs mt-3">上线 2026-04-01 · 无下线时间 · 排序 <b>2</b></div>
          </div>
          <div class="banner-acts">
            <label class="switch"><input type="checkbox" checked/><span class="track"></span></label>
            <button class="btn btn-outline btn-sm">编辑</button>
            <button class="btn btn-ghost btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.more)}</svg></button>
          </div>
        </div>
        <div class="banner-card" style="border-style:dashed;background:var(--accent);cursor:pointer;justify-content:center">
          <div class="text-mut text-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="vertical-align:middle;margin-right:6px">${extract(ICO.plus)}</svg>添加第 3 张轮播（还剩 1 个槽位）</div>
        </div>
      </div>
    </div>
    <div class="alert info mt-3">首页的推荐板块入口 · 攻略入口 · 榜单入口 · 美食地图入口 · 找搭子 · 商城 · 我的向导 · 我的会员卡 · 找客服等，全部由前端代码写死跳转，无需后台配置。</div>
  `;
};

// ==================== 内容管理 ====================
PAGES.content = function(){
  $('topbar').innerHTML = crumbHTML('内容管理') + topRight();
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>内容管理</h1><div class="sub">攻略、榜单、美食地图三类。榜单按大众点评式"标签 + 排名 + 关联商户"。</div></div>
    </div>
    <div class="card">
      <div class="tabs">
        <div class="tab active">攻略图文 · 18</div>
        <div class="tab">榜单 · 4</div>
        <div class="tab">美食地图 · 2</div>
      </div>
      ${tableToolbar('搜索标题 / ID', `<select class="sel"><option>全部分类</option><option>美食</option><option>景点</option><option>交通</option><option>自驾</option></select><select class="sel"><option>全部状态</option><option>上架</option><option>下架</option></select>`, `<button class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.plus)}</svg>新建攻略</button>`)}
      <table class="tbl">
        <thead><tr>
          <th style="width:30px"><input type="checkbox"/></th>
          <th>标题</th>
          <th>分类</th>
          <th>关联商户</th>
          <th class="text-r">阅读</th>
          <th class="text-r">排序</th>
          <th>发布时间</th>
          <th>状态</th>
          <th style="width:100px">操作</th>
        </tr></thead>
        <tbody>
          ${[
            {t:'乌鲁木齐三日必吃美食清单',c:'美食',m:12,r:8420,s:10,d:'2026-04-01',st:'上架'},
            {t:'新疆自驾必看：南疆环线全攻略',c:'自驾',m:5,r:5670,s:20,d:'2026-03-28',st:'上架'},
            {t:'伊犁草原骑马体验避雷指南',c:'景点',m:3,r:3120,s:30,d:'2026-03-25',st:'上架'},
            {t:'吐鲁番葡萄园自由行',c:'自由行',m:2,r:1890,s:40,d:'2026-03-20',st:'上架'},
            {t:'红山公园周边推荐（旧版）',c:'景点',m:6,r:780,s:100,d:'2026-02-10',st:'下架'},
          ].map(a=>`<tr>
            <td><input type="checkbox"/></td>
            <td class="cell-m">${a.t}</td>
            <td><span class="chip mut">${a.c}</span></td>
            <td class="cell-mut">${a.m} 家</td>
            <td class="num text-r">${a.r.toLocaleString()}</td>
            <td class="num text-r">${a.s}</td>
            <td class="num cell-mut text-xs">${a.d}</td>
            <td>${statusChip(a.st)}</td>
            <td class="row-acts"><button class="btn btn-ghost">编辑</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${paginationHTML(18,10,1)}
    </div>
  `;
};

// ==================== 商品管理 ====================
PAGES.shop = function(){
  $('topbar').innerHTML = crumbHTML('商品管理') + topRight();
  const rows = DATA.products;
  const orders = DATA.orders;
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>商品管理</h1><div class="sub">自营模式 · 多规格 · 未开封 7 天退换 · 一期不开发票</div></div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-l">在售商品</div><div class="kpi-v">${rows.filter(r=>r.status==='上架').length}</div><div class="kpi-d">规格共 ${rows.reduce((s,r)=>s+r.skus,0)} 个</div></div>
      <div class="kpi"><div class="kpi-l">本月订单</div><div class="kpi-v">143</div><div class="kpi-d">↑ 27.3%</div></div>
      <div class="kpi"><div class="kpi-l">待发货</div><div class="kpi-v">12</div><div class="kpi-d down">需处理</div></div>
      <div class="kpi"><div class="kpi-l">本月 成交额</div><div class="kpi-v">¥18,240</div><div class="kpi-d">客单 127 元</div></div>
    </div>
    <div class="card mb-4">
      <div class="tabs">
        <div class="tab active">商品 · ${rows.length}</div>
        <div class="tab">订单 · ${orders.length}</div>
        <div class="tab">售后 · 3</div>
      </div>
      ${tableToolbar('搜索商品名 / ID', `<select class="sel"><option>全部类目</option><option>干果蜜饯</option><option>奶制品</option><option>馕与主食</option><option>手工艺</option></select><select class="sel"><option>全部产地</option><option>和田</option><option>阿克苏</option><option>吐鲁番</option></select>`, `<button class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.plus)}</svg>新增商品</button>`)}
      <table class="tbl">
        <thead><tr>
          <th>商品</th>
          <th>类目</th>
          <th>产地</th>
          <th class="text-r">规格数</th>
          <th class="text-r">库存</th>
          <th class="text-r">价格</th>
          <th class="text-r">本月销量</th>
          <th>状态</th>
          <th style="width:130px">操作</th>
        </tr></thead>
        <tbody>
          ${rows.map(p=>`<tr>
            <td>
              <div class="flex center gap-2">
                <div style="width:36px;height:36px;background:linear-gradient(135deg,#f97316,#dc2626);border-radius:5px;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600">${p.name[0]}</div>
                <div><div class="cell-m">${p.name}</div><div class="cell-mut text-xs num">${p.id}</div></div>
              </div>
            </td>
            <td><span class="chip mut">${p.cat}</span></td>
            <td class="cell-mut">${p.origin}</td>
            <td class="num text-r">${p.skus}</td>
            <td class="num text-r ${p.stock<50?'text-mut':''}" style="${p.stock<50?'color:#dc2626':''}">${p.stock}</td>
            <td class="num text-r cell-m">¥${p.price}起</td>
            <td class="num text-r">${p.sales}</td>
            <td>${statusChip(p.status)}</td>
            <td class="row-acts"><button class="btn btn-ghost">规格</button><button class="btn btn-ghost">编辑</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${paginationHTML(rows.length,10,1)}
    </div>
  `;
};

// ==================== 场景推广码 ====================
PAGES.promo = function(){
  $('topbar').innerHTML = crumbHTML('场景推广码') + topRight();
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>场景推广码</h1><div class="sub">按渠道类型批量生成推广码，分成比例生成时写死。</div></div>
      <div class="pg-hd-r">
        <button class="btn btn-outline">落地页模板</button>
        <button class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.plus)}</svg>批量生成</button>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-l">已生成码</div><div class="kpi-v">${DATA.promos.reduce((s,p)=>s+p.qty,0).toLocaleString()}</div><div class="kpi-d">4 类渠道</div></div>
      <div class="kpi"><div class="kpi-l">总扫码</div><div class="kpi-v">${DATA.promos.reduce((s,p)=>s+p.scans,0).toLocaleString()}</div><div class="kpi-d">↑ 32.1%</div></div>
      <div class="kpi"><div class="kpi-l">通过码注册</div><div class="kpi-v">${DATA.promos.reduce((s,p)=>s+p.regs,0).toLocaleString()}</div><div class="kpi-d">转化 15%</div></div>
      <div class="kpi"><div class="kpi-l">带来 成交额</div><div class="kpi-v">¥${DATA.promos.reduce((s,p)=>s+p.gmv,0).toLocaleString()}</div></div>
    </div>
    <div class="card">
      ${tableToolbar('搜索批次名 / 分发对象', '', '<button class="btn btn-outline">渠道类型管理</button>')}
      <table class="tbl">
        <thead><tr>
          <th>渠道</th>
          <th>批次名</th>
          <th class="text-r">生成量</th>
          <th class="text-r">分成比例</th>
          <th class="text-r">累计扫码</th>
          <th class="text-r">注册数</th>
          <th class="text-r">带来 成交额</th>
          <th class="text-r">参考应分</th>
          <th style="width:100px">操作</th>
        </tr></thead>
        <tbody>
          ${DATA.promos.map(p=>`<tr>
            <td><span class="chip primary">${p.channel}</span></td>
            <td class="cell-m">${p.batch}</td>
            <td class="num text-r">${p.qty.toLocaleString()}</td>
            <td class="num text-r cell-m">${p.ratio}%</td>
            <td class="num text-r">${p.scans.toLocaleString()}</td>
            <td class="num text-r">${p.regs.toLocaleString()}</td>
            <td class="num text-r">¥${p.gmv.toLocaleString()}</td>
            <td class="num text-r cell-mut">¥${(p.gmv*p.ratio/100).toFixed(0)}</td>
            <td class="row-acts"><button class="btn btn-ghost">明细</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
};

// ==================== 官方社群 ====================
PAGES.group_qr = function(){
  $('topbar').innerHTML = crumbHTML('官方社群') + topRight();
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>官方社群</h1><div class="sub">一期只有一个官方企微群码，用于免费活动、领会员卡入口。</div></div>
    </div>
    <div class="two-col">
      <div class="card">
        <div class="card-hd"><div class="card-hd-l"><div class="card-t">当前群码</div><div class="card-d">上传满 25 天时会提醒运营更换</div></div></div>
        <div class="card-bd pd text-c">
          <div style="width:180px;height:180px;background:repeating-linear-gradient(45deg,#18181b 0 8px,#fff 8px 12px);margin:12px auto;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.1);position:relative">
            <div style="position:absolute;inset:60px;background:#fff;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#18181b;font-weight:600;font-size:11px">in疆<br/>旅友群</div>
          </div>
          <div class="cell-m mb-3">扫码加入 in疆 旅友群</div>
          <div class="text-mut text-xs">上传于 2026-04-01 · 剩余有效期 <b style="color:#f59e0b">20 天</b></div>
          <div class="mt-3 flex gap-2 center" style="justify-content:center">
            <button class="btn btn-outline btn-sm">下载</button>
            <button class="btn btn-primary btn-sm">替换新码</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-hd"><div class="card-hd-l"><div class="card-t">使用场景</div></div></div>
        <div class="card-bd pd">
          <div style="padding:10px 12px;background:var(--accent);border-radius:6px;margin-bottom:8px;font-size:13px"><b>免费活动报名成功页</b><div class="text-mut text-xs mt-3">支付流程之外的免费活动，报名后弹此码引导入群</div></div>
          <div style="padding:10px 12px;background:var(--accent);border-radius:6px;margin-bottom:8px;font-size:13px"><b>领会员卡成功页</b><div class="text-mut text-xs mt-3">用户领取会员卡后弹此码</div></div>
          <div style="padding:10px 12px;background:var(--accent);border-radius:6px;font-size:13px"><b>"加入群聊"通用入口</b><div class="text-mut text-xs mt-3">小程序底部/我的页的通用入群按钮</div></div>
          <div class="alert mt-3">付费活动<b>不弹群码</b>，支付成功后由向导主动加用户微信告知集合信息。</div>
        </div>
      </div>
    </div>
  `;
};

// ==================== 消息通知 ====================
PAGES.notify = function(){
  $('topbar').innerHTML = crumbHTML('消息通知') + topRight();
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>消息通知</h1><div class="sub">一期两个通道：微信订阅消息 + 企微群推送。不做站内消息中心，不做短信。</div></div>
      <div class="pg-hd-r"><button class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.plus)}</svg>新增模板</button></div>
    </div>
    <div class="card mb-4">
      <div class="tabs">
        <div class="tab active">订阅消息模板 · 7</div>
        <div class="tab">企微群推送 · 2</div>
        <div class="tab">发送记录</div>
      </div>
      ${tableToolbar('搜索模板', '<select class="sel"><option>全部触发时机</option><option>报名成功</option><option>活动开始前 24h</option><option>评价提醒</option></select>', '')}
      <table class="tbl">
        <thead><tr><th>模板名</th><th>触发时机</th><th>微信模板 ID</th><th>发送次数</th><th>状态</th><th style="width:100px">操作</th></tr></thead>
        <tbody>
          ${[
            {n:'报名成功通知',t:'报名成功',id:'wx_tpl_a1b2c3',c:342,s:'启用'},
            {n:'活动开始前 24h 提醒',t:'活动开始前 24h',id:'wx_tpl_d4e5f6',c:198,s:'启用'},
            {n:'打卡后评价提醒',t:'打卡成功',id:'wx_tpl_g7h8i9',c:892,s:'启用'},
            {n:'活动成行通知',t:'活动成行',id:'wx_tpl_j1k2l3',c:89,s:'启用'},
            {n:'退款通知',t:'售后退款',id:'wx_tpl_m4n5o6',c:35,s:'启用'},
            {n:'活动变更通知',t:'活动变更',id:'wx_tpl_p7q8r9',c:12,s:'启用'},
            {n:'临时活动测试',t:'其他',id:'wx_tpl_s0t0u0',c:0,s:'停用'},
          ].map(m=>`<tr>
            <td class="cell-m">${m.n}</td>
            <td><span class="chip mut">${m.t}</span></td>
            <td class="num cell-mut text-xs">${m.id}</td>
            <td class="num">${m.c.toLocaleString()}</td>
            <td>${statusChip(m.s)}</td>
            <td class="row-acts"><button class="btn btn-ghost">编辑</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
};

// ==================== 客服 + AI 向导 ====================
PAGES.service = function(){
  $('topbar').innerHTML = crumbHTML('客服 + AI 向导') + topRight();
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>客服 + AI 向导</h1><div class="sub">所有需要人工介入的场景都走"联系客服 → 加企微号 → 人工回复"。</div></div>
    </div>
    <div class="two-col">
      <div class="card">
        <div class="card-hd"><div class="card-hd-l"><div class="card-t">企微客服号配置</div></div><button class="btn btn-ghost btn-sm">编辑</button></div>
        <div class="card-bd pd">
          <div class="text-c mb-4">
            <div style="width:140px;height:140px;background:repeating-linear-gradient(45deg,#18181b 0 6px,#fff 6px 10px);margin:0 auto 10px;border-radius:8px;position:relative">
              <div style="position:absolute;inset:50px;background:#fff;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#18181b;font-weight:600;font-size:10px">in疆<br/>小助手</div>
            </div>
            <div class="cell-m">in疆小助手</div>
            <div class="text-mut text-xs mt-3">服务时间 9:00-22:00</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-hd"><div class="card-hd-l"><div class="card-t">AI 知识库</div><div class="card-d">从商户/向导/攻略一键导出，供后期喂 AI 客服</div></div></div>
        <div class="card-bd pd">
          <div class="text-mut text-xs mb-3">最近一次更新：2026-04-15 10:32</div>
          <div style="padding:10px 12px;background:var(--accent);border-radius:6px;margin-bottom:6px" class="flex center between">
            <span class="text-sm">上架商户资料</span><span class="chip mut">${DATA.merchants.filter(m=>m.status==='上架').length} 条</span>
          </div>
          <div style="padding:10px 12px;background:var(--accent);border-radius:6px;margin-bottom:6px" class="flex center between">
            <span class="text-sm">上架向导路线</span><span class="chip mut">${DATA.guides.filter(g=>g.status==='上架').length} 位向导 · 18 条路线</span>
          </div>
          <div style="padding:10px 12px;background:var(--accent);border-radius:6px;margin-bottom:14px" class="flex center between">
            <span class="text-sm">上架攻略正文</span><span class="chip mut">4 篇</span>
          </div>
          <button class="btn btn-primary" style="width:100%"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.dl)}</svg>一键导出 Excel</button>
        </div>
      </div>
    </div>
  `;
};

// ==================== 多城市 ====================
PAGES.city = function(){
  $('topbar').innerHTML = crumbHTML('多城市') + topRight();
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>多城市管理</h1><div class="sub">一期只启用乌鲁木齐。后台预留多城市数据结构。</div></div>
      <div class="pg-hd-r"><button class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.plus)}</svg>新增城市</button></div>
    </div>
    <div class="card">
      <table class="tbl">
        <thead><tr><th>城市</th><th>代码</th><th>商圈</th><th class="text-r">商户数</th><th class="text-r">向导数</th><th class="text-r">会员数</th><th>状态</th><th style="width:130px">操作</th></tr></thead>
        <tbody>
          <tr><td class="cell-m">🏙️ 乌鲁木齐</td><td class="num cell-mut">urumqi</td><td class="cell-mut">大巴扎 · 新市区 · 南门 · 高新 · 水磨沟 · 红山</td><td class="num text-r">${DATA.merchants.length}</td><td class="num text-r">${DATA.guides.length}</td><td class="num text-r">3,247</td><td>${statusChip('启用')}</td><td class="row-acts"><button class="btn btn-ghost">编辑</button></td></tr>
          <tr style="opacity:.6"><td class="cell-m">🏙️ 喀什</td><td class="num cell-mut">kashi</td><td class="cell-mut">槽位保留</td><td class="num text-r">0</td><td class="num text-r">0</td><td class="num text-r">0</td><td>${statusChip('停用')}</td><td class="row-acts"><button class="btn btn-ghost">启用</button></td></tr>
          <tr style="opacity:.6"><td class="cell-m">🏙️ 伊犁</td><td class="num cell-mut">yili</td><td class="cell-mut">槽位保留</td><td class="num text-r">0</td><td class="num text-r">0</td><td class="num text-r">0</td><td>${statusChip('停用')}</td><td class="row-acts"><button class="btn btn-ghost">启用</button></td></tr>
        </tbody>
      </table>
    </div>
    <div class="alert info mt-3">运营账号按城市授权，只能操作授权城市的数据。所有商户/向导/活动/内容/会员的"来自城市"字段必须归属某城市。</div>
  `;
};

// ==================== 账号与权限 ====================
PAGES.account = function(){
  $('topbar').innerHTML = crumbHTML('账号与权限') + topRight();
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>账号与权限</h1><div class="sub">三角色（硬编码不做自定义）：超级管理员 / 运营人员 / 管理层。逐级包含：管理层 ⊂ 运营 ⊂ 超级管理员。</div></div>
      <div class="pg-hd-r"><button class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.plus)}</svg>新增账号</button></div>
    </div>
    <div class="card mb-4">
      <div class="tabs"><div class="tab active">账号 · 5</div></div>
      <table class="tbl">
        <thead><tr><th>账号</th><th>姓名</th><th>手机</th><th>角色</th><th>授权城市</th><th>最近登录</th><th>状态</th><th style="width:130px">操作</th></tr></thead>
        <tbody>
          <tr><td class="num cell-m">admin</td><td>赵超管</td><td class="num cell-mut">138****8888</td><td><span class="chip primary">超级管理员</span></td><td>全部</td><td class="cell-mut text-xs num">2026-04-17 14:22</td><td>${statusChip('启用')}</td><td class="row-acts"><button class="btn btn-ghost">编辑</button></td></tr>
          <tr><td class="num cell-m">wangxiaotian</td><td>王小田</td><td class="num cell-mut">139****1234</td><td><span class="chip info">运营人员</span></td><td>乌鲁木齐</td><td class="cell-mut text-xs num">2026-04-17 09:12</td><td>${statusChip('启用')}</td><td class="row-acts"><button class="btn btn-ghost">编辑</button></td></tr>
          <tr><td class="num cell-m">liuxin</td><td>刘欣</td><td class="num cell-mut">137****5566</td><td><span class="chip info">运营人员</span></td><td>乌鲁木齐</td><td class="cell-mut text-xs num">2026-04-16 18:34</td><td>${statusChip('启用')}</td><td class="row-acts"><button class="btn btn-ghost">编辑</button></td></tr>
          <tr><td class="num cell-m">gulinur</td><td>古丽娜尔</td><td class="num cell-mut">186****2233</td><td><span class="chip info">运营人员</span></td><td>乌鲁木齐</td><td class="cell-mut text-xs num">2026-04-10 10:08</td><td>${statusChip('停用')}</td><td class="row-acts"><button class="btn btn-ghost">启用</button></td></tr>
          <tr><td class="num cell-m">liboss</td><td>李老板</td><td class="num cell-mut">135****0001</td><td><span class="chip mut">管理层</span></td><td>全部</td><td class="cell-mut text-xs num">2026-04-18 08:55</td><td>${statusChip('启用')}</td><td class="row-acts"><button class="btn btn-ghost">查看</button></td></tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hd"><div class="card-hd-l"><div class="card-t">权限矩阵</div></div></div>
      <table class="tbl">
        <thead><tr><th>操作</th><th>超级管理员</th><th>运营人员</th><th>管理层</th></tr></thead>
        <tbody>
          <tr><td>商户/向导/活动/内容/商品的上下架与删除</td><td>✓</td><td>✓（限授权城市）</td><td>—</td></tr>
          <tr><td>会员管理与封禁</td><td>✓</td><td>✓（限授权城市）</td><td>—</td></tr>
          <tr><td>推广码分成比例修改</td><td>✓</td><td>✓</td><td>—</td></tr>
          <tr><td>核销规则配置</td><td>✓</td><td>✓</td><td>—</td></tr>
          <tr><td>查看数据看板/报表/只读列表</td><td>✓</td><td>✓</td><td>✓</td></tr>
          <tr><td>导出报表</td><td>✓</td><td>✓</td><td>✓</td></tr>
          <tr><td>城市启用/停用</td><td>✓</td><td>—</td><td>—</td></tr>
          <tr><td>账号管理</td><td>✓</td><td>—</td><td>—</td></tr>
          <tr><td>操作日志查看</td><td>✓</td><td>—</td><td>—</td></tr>
        </tbody>
      </table>
    </div>
  `;
};

// ==================== 合规 ====================
PAGES.compliance = function(){
  $('topbar').innerHTML = crumbHTML('合规基础') + topRight();
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>合规基础</h1><div class="sub">微信支付兜底实名 · 内容安全 API 主检 · 埋点方案</div></div>
    </div>
    <div class="two-col mb-4">
      <div class="card">
        <div class="card-hd"><div class="card-hd-l"><div class="card-t">内容审核</div></div></div>
        <div class="card-bd pd">
          <div class="flex center between mb-3"><span class="text-sm">微信内容安全 API（主检）</span><span class="chip success">已启用</span></div>
          <div class="flex center between mb-3"><span class="text-sm">敏感词自维护列表</span><span class="chip mut">42 条</span></div>
          <div class="flex center between mb-3"><span class="text-sm">图片审核</span><span class="chip success">已启用</span></div>
          <div class="flex center between"><span class="text-sm">人工复核队列</span><span class="chip warn">3 条待处理</span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-hd"><div class="card-hd-l"><div class="card-t">实名与授权</div></div></div>
        <div class="card-bd pd">
          <div class="flex center between mb-3"><span class="text-sm">C 端会员：微信支付兜底实名</span><span class="chip success">已启用</span></div>
          <div class="flex center between mb-3"><span class="text-sm">向导实名审核（运营肉眼审）</span><span class="chip mut">${DATA.guides.filter(g=>!g.cert).length} 条待审</span></div>
          <div class="flex center between mb-3"><span class="text-sm">微信订阅消息授权</span><span class="chip success">已启用</span></div>
          <div class="flex center between"><span class="text-sm">数据境内存储</span><span class="chip success">已确认</span></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-hd"><div class="card-hd-l"><div class="card-t">埋点事件清单</div><div class="card-d">供数据看板使用</div></div></div>
      <table class="tbl">
        <thead><tr><th>事件名</th><th>触发时机</th><th class="text-r">今日触发</th><th>状态</th></tr></thead>
        <tbody>
          ${[['小程序启动','用户打开小程序',8420,'启用'],['注册成功','完成会员注册',287,'启用'],['扫码来源识别','通过场景推广码进入',1284,'启用'],['扫店内码打卡','扫店内二维码',124,'启用'],['评价提交','用户完成商户评价',87,'启用'],['商品下单','商城下单成功',18,'启用'],['支付成功','微信支付回调成功',34,'启用'],['分享出去','用户分享小程序',156,'启用'],['用户自发发起活动','用户在同游 Tab 发起',24,'启用'],['用户自发上车','用户报名自发起活动',42,'启用']].map(r=>`<tr><td class="cell-m">${r[0]}</td><td class="cell-mut">${r[1]}</td><td class="num text-r">${r[2].toLocaleString()}</td><td>${statusChip(r[3])}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
};

// ==================== 待办中心 ====================
PAGES.todo = function(){
  $('topbar').innerHTML = crumbHTML('待办中心') + topRight();
  const items = [
    {n:'待审核用户自发起活动',c:3,d:'community.html · 用户自己发车',cta:'activity',color:'#dc2626'},
    {n:'待审核向导实名',c:1,d:'G005 · 艾克拜尔',cta:'guide',color:'#f59e0b'},
    {n:'待审核评价',c:8,d:'涉及 5 家商户',cta:'',color:'#f59e0b'},
    {n:'商户异常打卡告警',c:2,d:'M1030 · 疑似批量刷卡',cta:'checkin',color:'#dc2626'},
    {n:'未处理客诉/退款',c:1,d:'O26041004 · 订单售后',cta:'order',color:'#dc2626'},
    {n:'成团未达标活动',c:1,d:'A2604 · 3/5 人',cta:'activity',color:'#f59e0b'},
    {n:'官方群码过期提醒',c:0,d:'剩余 20 天',cta:'group_qr',color:'#16a34a'},
  ];
  const total = items.reduce((s,i)=>s+i.c,0);
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>待办中心</h1><div class="sub">汇总所有需要运营处理的审核队列、异常告警、未处理工单。</div></div>
      <div class="pg-hd-r"><button class="btn btn-outline">全部标记已读</button></div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-l">待处理总数</div><div class="kpi-v">${total}</div><div class="kpi-d">较昨日 +3</div></div>
      <div class="kpi"><div class="kpi-l">紧急（红）</div><div class="kpi-v">${items.filter(i=>i.color==='#dc2626').reduce((s,i)=>s+i.c,0)}</div><div class="kpi-d down">立即处理</div></div>
      <div class="kpi"><div class="kpi-l">需关注（橙）</div><div class="kpi-v">${items.filter(i=>i.color==='#f59e0b').reduce((s,i)=>s+i.c,0)}</div></div>
      <div class="kpi"><div class="kpi-l">正常（绿）</div><div class="kpi-v">${items.filter(i=>i.color==='#16a34a').reduce((s,i)=>s+i.c,0)}</div></div>
    </div>
    <div class="card">
      <div class="card-hd"><div class="card-hd-l"><div class="card-t">待办列表</div><div class="card-d">点击卡片跳转到对应模块处理</div></div></div>
      <div style="padding:8px 12px">
        ${items.map(it=>`
          <div style="display:flex;align-items:center;padding:12px 14px;margin:4px 0;background:${it.c>0?'#fff':'#fafafa'};border:1px solid var(--border);border-radius:6px;${it.c>0?'':'opacity:.6'}">
            <div style="width:8px;height:8px;border-radius:50%;background:${it.color};margin-right:12px;flex-shrink:0"></div>
            <div style="flex:1"><div class="cell-m">${it.n}</div><div class="cell-mut text-xs" style="margin-top:2px">${it.d}</div></div>
            <div style="font-size:20px;font-weight:600;color:${it.color};margin-right:12px;min-width:32px;text-align:right">${it.c}</div>
            <button class="btn btn-outline btn-sm" ${it.cta?`onclick="navigate('${it.cta}')"`:''} ${it.c===0?'disabled style="opacity:.4"':''}>处理 →</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

// ==================== 目的地 ====================
PAGES.destination = function(){
  $('topbar').innerHTML = crumbHTML('目的地') + topRight();
  const rows = [
    {id:'D001',n:'喀什老城',theme:'出片圣地',sub:'土黄巷子 · 千年烟火',city:'喀什',shops:8,routes:2,acts:3,st:'上架'},
    {id:'D002',n:'喀纳斯神仙湾',theme:'绝美秘境',sub:'晨雾 · 图瓦人村落',city:'喀纳斯',shops:2,routes:5,acts:2,st:'上架'},
    {id:'D003',n:'沙漠冲浪 + 星空',theme:'限定玩法',sub:'越野飙沙丘 · 银河下露营',city:'乌鲁木齐',shops:0,routes:4,acts:6,st:'上架'},
    {id:'D004',n:'夜市撸串大盘鸡',theme:'必吃美食',sub:'本地人下班就来',city:'乌鲁木齐',shops:12,routes:0,acts:1,st:'上架'},
    {id:'D005',n:'天山天池',theme:'绝美秘境',sub:'雪山湖畔 · 一日往返',city:'乌鲁木齐',shops:3,routes:6,acts:2,st:'下架'},
  ];
  const themeChip = t => `<span class="chip ${t==='限定玩法'?'primary':t==='绝美秘境'?'info':t==='出片圣地'?'warn':'success'}">${t}</span>`;
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>目的地管理</h1><div class="sub">主题化目的地：4 大主题（绝美秘境/出片圣地/限定玩法/必吃美食）。挂载商户/向导路线/活动。</div></div>
      <div class="pg-hd-r"><button class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.plus)}</svg>新增目的地</button></div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-l">目的地总数</div><div class="kpi-v">${rows.length}</div></div>
      <div class="kpi"><div class="kpi-l">4 大主题覆盖</div><div class="kpi-v">4/4</div><div class="kpi-d">全部启用</div></div>
      <div class="kpi"><div class="kpi-l">已挂商户</div><div class="kpi-v">${rows.reduce((s,r)=>s+r.shops,0)}</div></div>
      <div class="kpi"><div class="kpi-l">已挂向导路线</div><div class="kpi-v">${rows.reduce((s,r)=>s+r.routes,0)}</div></div>
    </div>
    <div class="card">
      ${tableToolbar('搜索目的地名', `<select class="sel"><option>全部主题</option><option>绝美秘境</option><option>出片圣地</option><option>限定玩法</option><option>必吃美食</option></select><select class="sel"><option>全部状态</option><option>上架</option><option>下架</option></select>`, '')}
      <table class="tbl">
        <thead><tr><th style="width:30px"><input type="checkbox"/></th><th>目的地</th><th>ID</th><th>主题</th><th>关联城市</th><th class="text-r">挂商户</th><th class="text-r">挂向导路线</th><th class="text-r">挂活动</th><th>状态</th><th style="width:100px">操作</th></tr></thead>
        <tbody>
          ${rows.map(r=>`<tr>
            <td><input type="checkbox"/></td>
            <td><div class="cell-m">${r.n}</div><div class="cell-mut text-xs">${r.sub}</div></td>
            <td class="num cell-mut">${r.id}</td>
            <td>${themeChip(r.theme)}</td>
            <td class="cell-mut">${r.city}</td>
            <td class="num text-r">${r.shops}</td>
            <td class="num text-r">${r.routes}</td>
            <td class="num text-r">${r.acts}</td>
            <td>${statusChip(r.st)}</td>
            <td class="row-acts"><button class="btn btn-ghost">编辑</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${paginationHTML(rows.length,10,1)}
    </div>
  `;
};

// ==================== 玩法榜单 ====================
PAGES.ranking = function(){
  $('topbar').innerHTML = crumbHTML('玩法榜单') + topRight();
  const rows = [
    {id:'R001',n:'限定玩法 · 本周热门 Top 8',theme:'限定玩法',city:'乌鲁木齐',items:8,freq:'每周',up:'2026-04-15',st:'上架'},
    {id:'R002',n:'绝美秘境 · 出片必去',theme:'绝美秘境',city:'全境',items:6,freq:'每月',up:'2026-04-01',st:'上架'},
    {id:'R003',n:'必吃美食 · 本地人推荐',theme:'必吃美食',city:'乌鲁木齐',items:10,freq:'手动',up:'2026-04-12',st:'上架'},
    {id:'R004',n:'出片圣地 · 摄影推荐',theme:'出片圣地',city:'喀什',items:5,freq:'手动',up:'2026-03-28',st:'上架'},
  ];
  const themeChip = t => `<span class="chip ${t==='限定玩法'?'primary':t==='绝美秘境'?'info':t==='出片圣地'?'warn':'success'}">${t}</span>`;
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>玩法榜单</h1><div class="sub">按主题维护上榜项（可关联向导路线/活动/目的地）。取代传统美食景点榜。</div></div>
      <div class="pg-hd-r"><button class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.plus)}</svg>新增榜单</button></div>
    </div>
    <div class="card">
      ${tableToolbar('搜索榜单名', `<select class="sel"><option>全部主题</option><option>限定玩法</option><option>绝美秘境</option><option>出片圣地</option><option>必吃美食</option></select>`, '')}
      <table class="tbl">
        <thead><tr><th>榜单</th><th>ID</th><th>主题</th><th>关联城市</th><th class="text-r">上榜项</th><th>更新频率</th><th>上次更新</th><th>状态</th><th style="width:100px">操作</th></tr></thead>
        <tbody>
          ${rows.map(r=>`<tr>
            <td class="cell-m">${r.n}</td>
            <td class="num cell-mut">${r.id}</td>
            <td>${themeChip(r.theme)}</td>
            <td class="cell-mut">${r.city}</td>
            <td class="num text-r">${r.items}</td>
            <td>${r.freq}</td>
            <td class="cell-mut text-xs num">${r.up}</td>
            <td>${statusChip(r.st)}</td>
            <td class="row-acts"><button class="btn btn-ghost">编辑</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
};

// ==================== 订单管理 ====================
PAGES.order = function(){
  $('topbar').innerHTML = crumbHTML('订单管理') + topRight();
  const rows = [
    {id:'O26041001',type:'商城',buyer:'旅友_明月',target:'和田大枣 · 500g 礼盒',amt:136,pay:'已付款',fulfill:'待发货',after:'-',time:'2026-04-14 10:22'},
    {id:'O26041002',type:'商城',buyer:'远方的舟',target:'阿克苏混合坚果 · 1kg',amt:88,pay:'已付款',fulfill:'已发货',after:'-',time:'2026-04-14 15:04'},
    {id:'O26041003',type:'活动',buyer:'背包客小王',target:'五一南疆环线 6 日',amt:3800,pay:'已付款',fulfill:'待成行',after:'-',time:'2026-04-13 09:11'},
    {id:'O26041004',type:'商城',buyer:'摄影师阿黎',target:'吐鲁番葡萄干 · 礼盒装',amt:68,pay:'已付款',fulfill:'已签收',after:'售后中',time:'2026-04-12 18:50'},
    {id:'O26041005',type:'用户自发上车',buyer:'甜甜圈',target:'沙漠露营局',amt:280,pay:'已付款',fulfill:'待成行',after:'-',time:'2026-04-15 22:14'},
    {id:'O26041006',type:'旅行团',buyer:'远方的舟',target:'吐鲁番葡萄采摘一日',amt:288,pay:'已付款',fulfill:'待成行',after:'-',time:'2026-04-15 11:03'},
  ];
  const typeChip = t => `<span class="chip ${t==='商城'?'info':t==='活动'?'primary':t==='用户自发上车'?'warn':'mut'}">${t}</span>`;
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>订单管理</h1><div class="sub">合并四类订单：商城 / 活动 / 旅行团 / 用户自发上车。</div></div>
      <div class="pg-hd-r"><button class="btn btn-outline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.dl)}</svg>导出</button></div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-l">今日订单</div><div class="kpi-v">42</div><div class="kpi-d">↑ 8.2%</div></div>
      <div class="kpi"><div class="kpi-l">今日 成交额</div><div class="kpi-v">¥12,480</div></div>
      <div class="kpi"><div class="kpi-l">待发货</div><div class="kpi-v">12</div><div class="kpi-d down">需处理</div></div>
      <div class="kpi"><div class="kpi-l">售后中</div><div class="kpi-v">1</div><div class="kpi-d down">1 条待处理</div></div>
    </div>
    <div class="card">
      ${tableToolbar('搜索订单号 / 买家', `<select class="sel"><option>全部类型</option><option>商城</option><option>活动</option><option>旅行团</option><option>用户自发上车</option></select><select class="sel"><option>全部支付状态</option><option>已付款</option><option>待付款</option></select><select class="sel"><option>全部履约状态</option><option>待发货</option><option>已发货</option><option>已完成</option></select>`, '')}
      <table class="tbl">
        <thead><tr><th>订单号</th><th>类型</th><th>买家</th><th>关联对象</th><th class="text-r">金额</th><th>支付</th><th>履约</th><th>售后</th><th>下单时间</th><th style="width:100px">操作</th></tr></thead>
        <tbody>
          ${rows.map(r=>`<tr>
            <td class="num cell-m">${r.id}</td>
            <td>${typeChip(r.type)}</td>
            <td>${r.buyer}</td>
            <td class="cell-mut">${r.target}</td>
            <td class="num text-r cell-m">¥${r.amt}</td>
            <td>${statusChip(r.pay)}</td>
            <td>${statusChip(r.fulfill)}</td>
            <td>${r.after==='-'?'<span class="text-mut text-xs">—</span>':statusChip(r.after)}</td>
            <td class="num cell-mut text-xs">${r.time}</td>
            <td class="row-acts"><button class="btn btn-ghost">详情</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${paginationHTML(842,10,1)}
    </div>
  `;
};

// ==================== 优惠券 ====================
// 资料与统计分开；原样例未提供的固定日期及对象 ID 不猜填。
DATA.coupons = [
  {id:'CP001',n:'山海市集新人券',type:'新人券',discount:'满减',amount:15,threshold:89,scope:'全部商品',limit:1,validity:'领取后 N 天有效',period:{days:7},stock:1000,used:342,st:'启用'},
  {id:'CP002',n:'旅友会员满减券',type:'会员券',discount:'满减',amount:10,threshold:99,scope:'全部商品',limit:2,validity:'固定日期',period:{start:'',end:''},stock:500,used:87,st:'启用'},
  {id:'CP003',n:'挚友专享大额券',type:'会员券',discount:'满减',amount:25,threshold:199,scope:'全部商品',limit:1,validity:'固定日期',period:{start:'',end:''},stock:200,used:12,st:'启用'},
  {id:'CP004',n:'五一活动券',type:'活动券',discount:'立减',amount:20,threshold:'',scope:'指定活动',limit:1,validity:'固定日期',period:{start:'2026-05-01',end:'2026-05-07'},stock:300,used:0,st:'停用'},
];
function couponFields(r){return {'券名':r.n,'券类型':r.type,'优惠类型':r.discount,'优惠数值':r.amount,'使用门槛':r.threshold,'适用范围':r.scope,'指定对象':[],'领取上限(人均)':r.limit,'有效期类型':r.validity,'生效期':{...r.period},'库存':r.stock,'状态':r.st};}
function couponRuleText(v){
  const type=v['优惠类型'],amount=v['优惠数值'],threshold=v['使用门槛'];
  if(amount==='' || amount==null)return '优惠未设置';
  if(type==='满减')return `满 ${threshold} 减 ${amount}`;
  if(type==='折扣')return `${Number((Number(amount)*10).toFixed(2))} 折`;
  return type==='立减'?`立减 ${amount} 元`:'优惠未设置';
}
function couponValidityText(v){
  const p=v['生效期']||{};
  if(v['有效期类型']==='领取后 N 天有效')return p.days?`领后 ${p.days} 天`:'有效天数未设置';
  return p.end?(p.start?`${p.start} 到 ${p.end}`:`至 ${p.end}`):'固定日期（未设置）';
}
function couponScopeText(v){
  const scope=v['适用范围'],ids=v['指定对象']||[];
  if(!scope?.startsWith('指定'))return scope||'—';
  return ids.length?`${scope} · ${ids.length} 项`:`${scope}（未设置）`;
}
PAGES.coupon = function(){
  $('topbar').innerHTML = crumbHTML('优惠券管理') + topRight();
  const rows = DATA.coupons;
  const typeChip = t => `<span class="chip ${t==='新人券'?'success':t==='会员券'?'primary':'warn'}">${t}</span>`;
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>优惠券管理</h1><div class="sub">新人券 · 会员券 · 活动券。</div></div>
      <div class="pg-hd-r"><button class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.plus)}</svg>新增券</button></div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-l">在用券</div><div class="kpi-v">${rows.filter(r=>r.st==='启用').length}</div></div>
      <div class="kpi"><div class="kpi-l">本月领取</div><div class="kpi-v">${rows.reduce((s,r)=>s+r.used,0)}</div></div>
      <div class="kpi"><div class="kpi-l">本月核销</div><div class="kpi-v">218</div><div class="kpi-d">核销率 52.4%</div></div>
      <div class="kpi"><div class="kpi-l">带来 成交额</div><div class="kpi-v">¥18,240</div></div>
    </div>
    <div class="card">
      ${tableToolbar('搜索券名', `<select class="sel"><option>全部类型</option><option>新人券</option><option>会员券</option><option>活动券</option></select>`, '')}
      <table class="tbl">
        <thead><tr><th>券</th><th>ID</th><th>类型</th><th>规则</th><th>适用范围</th><th class="text-r">领取上限</th><th>有效期</th><th class="text-r">库存/已领</th><th>状态</th><th style="width:100px">操作</th></tr></thead>
        <tbody>
          ${rows.map(r=>`<tr>
            <td class="cell-m">${r.n}</td>
            <td class="num cell-mut">${r.id}</td>
            <td>${typeChip(r.type)}</td>
            <td class="cell-m">${couponRuleText(couponFields(r))}</td>
            <td class="cell-mut">${couponScopeText(couponFields(r))}</td>
            <td class="num text-r">${r.limit} 张/人</td>
            <td class="cell-mut text-xs">${couponValidityText(couponFields(r))}</td>
            <td class="num text-r">${r.used}/${r.stock}</td>
            <td>${statusChip(r.st)}</td>
            <td class="row-acts"><button class="btn btn-ghost">编辑</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
  $('page').querySelectorAll('tbody tr').forEach((row,i)=>{row.uxValues=couponFields(rows[i]);row.uxMeta={claimed:rows[i].used};});
};

// ==================== 操作日志（仅超管） ====================
PAGES.oplog = function(){
  $('topbar').innerHTML = crumbHTML('操作日志') + topRight();
  const rows = [
    {t:'2026-04-17 15:22', u:'运营 · 王小田', act:'审核通过', obj:'用户自发起活动 U2601 沙漠露营局', diff:'状态：待审 → 上架'},
    {t:'2026-04-17 14:40', u:'运营 · 王小田', act:'核销确认', obj:'核销单 C88207 · 吐鲁番葡萄园直营店', diff:'评价确认 → 已核销'},
    {t:'2026-04-17 10:11', u:'超管 · 赵超管', act:'账号授权', obj:'运营账号 王小田', diff:'授权城市：乌鲁木齐 → 乌鲁木齐+喀什'},
    {t:'2026-04-16 20:03', u:'系统', act:'异常告警', obj:'会员 甜甜圈', diff:'疑似批量刷卡，连续 2 次打卡'},
    {t:'2026-04-16 18:27', u:'运营 · 王小田', act:'商品上架', obj:'P0005 新疆手工艾德莱斯丝巾', diff:'状态：下架 → 上架'},
    {t:'2026-04-16 11:52', u:'超管 · 赵超管', act:'密钥配置', obj:'第三方服务 · 天气', diff:'更新 API 密钥（值已脱敏）'},
    {t:'2026-04-15 09:30', u:'运营 · 王小田', act:'商户录入', obj:'M1031 伊犁风味大盘鸡', diff:'新增商户并提交认证'},
  ];
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>操作日志</h1><div class="sub">记录所有账号的关键操作，含前后差异摘要。仅超级管理员可见。</div></div>
      <div class="pg-hd-r"><button class="btn btn-outline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.dl)}</svg>导出</button></div>
    </div>
    <div class="card">
      ${tableToolbar('搜索账号 / 操作对象', `<select class="sel"><option>全部账号</option><option>运营 · 王小田</option><option>超管 · 赵超管</option></select><select class="sel"><option>全部类型</option><option>审核</option><option>配置</option><option>录入</option></select>`, '')}
      <table class="tbl">
        <thead><tr><th style="width:150px">时间</th><th style="width:140px">账号</th><th style="width:120px">操作类型</th><th>操作对象</th><th>前后差异摘要</th></tr></thead>
        <tbody>
          ${rows.map(r=>`<tr>
            <td class="num cell-mut">${r.t}</td>
            <td class="cell-m">${r.u}</td>
            <td>${statusChip(r.act==='异常告警'?'疑似异常放量':r.act)}</td>
            <td class="cell-m">${r.obj}</td>
            <td class="cell-mut">${r.diff}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${paginationHTML(rows.length,10,1)}
    </div>
  `;
};

// ==================== 经营报表（管理层/超管） ====================
PAGES.report = function(){
  $('topbar').innerHTML = crumbHTML('经营报表') + topRight();
  const statRow = (title, arr) => `
    <div class="card mb-4">
      <div class="card-hd"><div class="card-hd-l"><div class="card-t">${title}</div></div></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr)">
        ${arr.map(s=>`<div style="padding:16px 18px;border-right:1px solid var(--border)"><div class="text-mut text-xs">${s.k}</div><div style="font-size:22px;font-weight:600;margin-top:6px">${s.v}</div></div>`).join('')}
      </div>
    </div>`;
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>经营报表</h1><div class="sub">核心经营指标汇总，可导出，口径与数据看板一致。</div></div>
      <div class="pg-hd-r">
        <select class="sel"><option>本周</option><option>本月</option><option>本季度</option><option>自定义</option></select>
        <button class="btn btn-outline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${extract(ICO.dl)}</svg>导出报表</button>
      </div>
    </div>
    ${statRow('会员概览', [
      {k:'会员总数', v:'3,247'}, {k:'本周新增', v:'576'}, {k:'复购会员', v:'218'}, {k:'已核销会员', v:'892'},
    ])}
    ${statRow('交易概览', [
      {k:'本月订单', v:'143'}, {k:'本月成交额', v:'¥18,240'}, {k:'到店核销', v:'892'}, {k:'推广码成交额', v:'¥76,380'},
    ])}
    ${statRow('供给概览', [
      {k:'在架商户', v:DATA.merchants.filter(m=>m.status==='上架').length},
      {k:'在架向导', v:DATA.guides.filter(g=>g.status==='上架').length},
      {k:'上架活动', v:DATA.activities.filter(a=>a.status==='上架').length},
      {k:'在售商品', v:DATA.products.filter(p=>p.status==='上架').length},
    ])}
  `;
};

// ==================== 风险提醒（管理层） ====================
PAGES.risk = function(){
  $('topbar').innerHTML = crumbHTML('风险提醒') + topRight();
  const rows = [
    {lv:'err', n:'商户异常打卡', d:'古丽新疆家宴 · 疑似批量刷卡', t:'2 条'},
    {lv:'err', n:'未处理客诉/退款', d:'订单 O26041004 · 售后中', t:'1 条'},
    {lv:'warn', n:'成团未达标活动', d:'伊犁草原骑行 3 日 · 3/5 人', t:'1 条'},
    {lv:'warn', n:'官方群码即将过期', d:'剩余 20 天', t:'1 项'},
  ];
  $('page').innerHTML = `
    <div class="pg-hd">
      <div><h1>风险提醒</h1><div class="sub">需要关注的风险与异常，只读展示；处理由运营在对应模块完成。</div></div>
    </div>
    <div class="card">
      <div style="padding:8px 12px">
        ${rows.map(r=>`
          <div style="display:flex;align-items:center;padding:14px;margin:4px 0;border:1px solid var(--border);border-radius:6px">
            <div style="width:8px;height:8px;border-radius:50%;background:${r.lv==='err'?'#dc2626':'#f59e0b'};margin-right:12px;flex-shrink:0"></div>
            <div style="flex:1"><div class="cell-m">${r.n}</div><div class="cell-mut text-xs" style="margin-top:2px">${r.d}</div></div>
            <span class="chip ${r.lv==='err'?'err':'warn'}">${r.t}</span>
          </div>`).join('')}
      </div>
    </div>
  `;
};

// ===== bootstrap =====
window.addEventListener('DOMContentLoaded',()=>{
  const initId = (location.hash||'#dashboard').slice(1);
  navigate(PAGES[initId] && ROLE_MENU[ROLE].includes(initId) ? initId : 'dashboard');
});
