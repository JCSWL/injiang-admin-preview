/* 业务结果闭环模块：共享资料池上的报名/审核/订单/会员/核销/券/待办/汇总。
 * 只读与登记，不新建断开的数据池；不改订单金额；不执行退款；不发送消息。 */
(() => {
  'use strict';
  const W = window, doc = document;
  const E = W.AdminExtensions;
  const $ = id => doc.getElementById(id);

  const role = () => { try { return (typeof ROLE !== 'undefined' ? ROLE : (W.ROLE || 'ops')); } catch (e) { return 'ops'; } };
  const roleMenus = () => { try { return (typeof ROLE_MENU !== 'undefined' ? ROLE_MENU : W.ROLE_MENU) || {}; } catch (e) { return {}; } };
  const isBoss = () => role() === 'boss';
  const can = page => { try { const m = roleMenus()[role()]; return Array.isArray(m) && m.includes(page); } catch (e) { return true; } };

  const ui = () => W.AdminDemoUI || {};
  const esc = v => {
    if (ui() && typeof ui().esc === 'function') return ui().esc(v);
    return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  };
  const money = v => { try { if (ui() && typeof ui().money === 'function') return ui().money(v); } catch (e) {} return Number(v || 0).toFixed(2); };
  const now = () => { try { if (ui() && typeof ui().now === 'function') return ui().now(); } catch (e) {} return new Date().toLocaleString('zh-CN', { hour12: false }); };

  function demo() { return W.AdminDemoData || {}; }
  function ensureDemo() {
    if (W.AdminDemoData && typeof W.AdminDemoData.ensure === 'function') {
      try { W.AdminDemoData.ensure(); return true; } catch (e) { console.warn('[admin_demo_business] AdminDemoData.ensure failed', e); return false; }
    }
    return false;
  }
  function sharedArr(name) {
    const d = demo();
    if (Array.isArray(d[name])) return d[name];
    if (Array.isArray(W[name])) return W[name];
    return null;
  }
  function pushShared(name, item) {
    const a = sharedArr(name);
    if (!a) { try { PrototypeUI.notice('共享历史数据未就绪，本次未写入历史'); } catch (e) {} return false; }
    a.push(item); return true;
  }
  const signups = () => sharedArr('signups') || [];
  const reviewHistory = () => sharedArr('reviewHistory') || [];
  const events = () => sharedArr('events') || [];
  const couponRecords = () => sharedArr('couponRecords') || [];
  const orderHistory = () => sharedArr('orderHistory') || [];
  function anomalyMap() {
    const d = demo();
    if (d.anomalies instanceof Map) return d.anomalies;
    if (W.anomalies instanceof Map) return W.anomalies;
    return null;
  }

  function records(page) { try { return PrototypeUI.records(page) || []; } catch (e) { return []; } }
  function values(page, id) { try { const v = PrototypeUI.recordValues(page, id); return v || {}; } catch (e) { return {}; } }

  const pick = (v, keys) => {
    if (!v) return '';
    for (const k of keys) { const x = v[k]; if (x != null && x !== '' && x !== '—') return x; }
    return '';
  };
  const NAME_KEYS = {
    member: ['会员昵称', '昵称', '姓名', '会员名', '名称'],
    activity: ['活动名', '名称', '标题'],
    order: ['订单号', '订单编号', '编号'],
    coupon: ['券名', '优惠券名', '名称'],
    guide: ['姓名', '向导名', '名称'],
    review: ['评价对象名', '评价对象', '名称'],
    checkin: ['核销编号', '核销码', '核销单号', '编号']
  };
  const nameOf = (page, v) => pick(v, NAME_KEYS[page] || ['名称', '标题', '姓名']) || '未命名';
  const memberName = v => pick(v, NAME_KEYS.member) || '未命名会员';
  const memberContact = v => pick(v, ['手机号', '电话', '联系方式', '联系电话', '联系人']) || '未提供';

  const relLabel = x => { try { if (W.AdminRelations && W.AdminRelations.label) return W.AdminRelations.label(x); } catch (e) {} return String(x); };
  function show(v) {
    if (v == null || v === '' || v === '—') return '未提供';
    if (Array.isArray(v)) return v.map(x => typeof x === 'string' && x.includes(':') ? relLabel(x) : typeof x === 'object' ? JSON.stringify(x) : String(x)).join('、');
    if (typeof v === 'object') { try { return JSON.stringify(v); } catch (e) { return String(v); } }
    return String(v);
  }
  function chip(v) {
    const s = String(v ?? '—');
    const cls = /通过|正常|上架|已发货|已使用|已核实|已完成|已联系/.test(s) ? 'ok'
      : /驳回|异常|封禁|冻结|下架|待审|待联系|处理中|申请中|待核实|已退款|已换货/.test(s) ? 'warn' : 'mut';
    return `<span class="db-chip ${cls}">${esc(s)}</span>`;
  }
  const grid = (v, keys) => `<dl class="ux-read-grid db-read">${keys.map(k => `<div><dt>${esc(k)}</dt><dd>${esc(show(v[k]))}</dd></div>`).join('')}</dl>`;

  function setTop(title) {
    const tb = $('topbar');
    if (!tb) return;
    let html = '';
    try { html = (typeof W.crumbHTML === 'function' ? W.crumbHTML(title) : `<nav class="crumbs"><strong>${esc(title)}</strong></nav>`) + (typeof W.topRight === 'function' ? W.topRight() : ''); }
    catch (e) { html = `<nav class="crumbs"><strong>${esc(title)}</strong></nav>`; }
    tb.innerHTML = html;
  }
  function screen(title, bodyHtml, backLabel) {
    return `<section class="ux-screen"><header class="ux-header"><button type="button" class="btn btn-outline" data-db-back>← 返回${backLabel ? ' ' + esc(backLabel) : ''}</button><h1>${esc(title)}</h1></header><div class="dc-layout db-screen">${bodyHtml}</div></section>`;
  }
  function bindBack(fn) {
    const b = $('page') && $('page').querySelector('[data-db-back]');
    if (b) b.onclick = () => fn();
  }
  const go = page => { try { navigate(page); } catch (e) { if (typeof navigate === 'function') navigate(page); } };

  let seq = 0;
  const uid = p => `${p}-${Date.now().toString(36)}-${(++seq).toString(36)}`;
  const rolePerson = { boss: '李老板', ops: '王小田', admin: '赵超管' };
  function actorName() {
    try { const a = W.ACCOUNT || W.CURRENT_USER || {}; if (a.name || a.person) return a.name || a.person; } catch (e) {}
    const r = role(); return rolePerson[r] || r;
  }

  function csv(name, headers, rows) {
    const escC = c => {let text=String(c??'');if(/^[\s\uFEFF]*[=+@-]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};
    const text = '\ufeff' + [headers, ...rows].map(r => r.map(escC).join(',')).join('\r\n');
    try {
      const u = ui();
      if (u && typeof u.download === 'function') u.download(name, text, 'text/csv;charset=utf-8');
      else {
        const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
        const a = doc.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = name;
        doc.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }
      try { PrototypeUI.notice(name + ' 已下载'); } catch (e) {}
    } catch (e) { console.error('[admin_demo_business] csv download failed', e); try { PrototypeUI.notice('下载失败'); } catch (_) {} }
  }

  const CAT = { activity: '用户约伴', guide: '向导实名', review: '评价' };
  const catName = t => CAT[t] || t;

  /* ---------- 审核 ---------- */
  let reviewTab = '待审';
  const pending = v => /待审|未审核|待复核/.test(String(v || ''));
  function reviewQueue() {
    const out = [];
    records('activity').forEach(x => {
      const v = x.values || {};
      if (/用户自发/.test(pick(v, ['类型'])) && pending(pick(v, ['审核状态']) || pick(v, ['状态']))) out.push({ type: 'activity', id: x.id, name: nameOf('activity', v), status: pick(v, ['审核状态']) || pick(v, ['状态']), values: v });
    });
    records('guide').forEach(x => {
      const v = x.values || {};
      if (pending(pick(v, ['实名审核']))) out.push({ type: 'guide', id: x.id, name: nameOf('guide', v), status: pick(v, ['实名审核']), values: v });
    });
    records('review').forEach(x => {
      const v = x.values || {};
      if (String(pick(v, ['评价内容']) || '').trim() && pending(pick(v, ['审核状态']))) out.push({ type: 'review', id: x.id, name: nameOf('review', v), status: pick(v, ['审核状态']), values: v });
    });
    return out;
  }
  function historyFor(type, id) { return reviewHistory().filter(h => h.type === type && h.objectId === id).slice().sort((a, b) => String(b.time).localeCompare(String(a.time))); }
  function passedRejected(result) {
    const list = [], seen = new Set();
    reviewHistory().slice().sort((a, b) => String(b.time).localeCompare(String(a.time))).forEach(h => {
      const key = h.type + '/' + h.objectId;
      if (seen.has(key)) return;
      seen.add(key);if(h.result===result)list.push(h);
    });
    return list;
  }
  function objectName(type, id) { const v = values(type, id); return nameOf(type, v) || id; }

  function reviewRowsHTML() {
    if (reviewTab === '待审') {
      const items = reviewQueue();
      if (!items.length) return '<div class="empty"><h3>暂无待审</h3><div>只展示已提交的记录，不从提醒计数生成资料。</div></div>';
      return `<div class="tbl-scroll"><table class="tbl"><thead><tr><th>类型</th><th>对象</th><th>编号</th><th>当前状态</th><th>操作</th></tr></thead><tbody>${items.map(x => `<tr><td>${esc(catName(x.type))}</td><td class="cell-m">${esc(x.name)}</td><td class="num">${esc(x.id)}</td><td>${chip(x.status)}</td><td class="row-acts"><button type="button" class="btn btn-outline" data-db-review-open="${esc(x.type)}|${esc(x.id)}">查看资料</button></td></tr>`).join('')}</tbody></table></div>`;
    }
    const items = passedRejected(reviewTab);
    if (!items.length) return `<div class="empty"><h3>暂无${esc(reviewTab)}记录</h3></div>`;
    return `<div class="tbl-scroll"><table class="tbl"><thead><tr><th>类型</th><th>对象</th><th>编号</th><th>结果</th><th>原因</th><th>人员</th><th>时间</th><th>操作</th></tr></thead><tbody>${items.map(h => `<tr><td>${esc(catName(h.type))}</td><td class="cell-m">${esc(objectName(h.type, h.objectId))}</td><td class="num">${esc(h.objectId)}</td><td>${chip(h.result)}</td><td>${esc(h.reason || '')}</td><td>${esc(h.actor || '')}</td><td>${esc(h.time || '')}</td><td class="row-acts"><button type="button" class="btn btn-outline" data-db-review-open="${esc(h.type)}|${esc(h.objectId)}">查看历史</button></td></tr>`).join('')}</tbody></table></div>`;
  }
  function renderReview() {
    if (!can('review')) return;
    setTop('审核处理');
    const tabs = [['待审', reviewQueue().length], ['已通过', passedRejected('已通过').length], ['已驳回', passedRejected('已驳回').length]];
    $('page').innerHTML = `<div class="pg-hd"><div><h1>审核处理</h1><div class="sub">待审/通过/驳回分列；每次结论保留对象级原因、人员与时间。</div></div></div><div class="card"><div class="tabs rx-tabs">${tabs.map(([k, n]) => `<button type="button" class="tab ${reviewTab === k ? 'active' : ''}" data-db-review-tab="${k}">${esc(k)} · ${n}</button>`).join('')}</div><div class="card-bd pd">${reviewRowsHTML()}</div></div>`;
  }
  function bindReview() {
    $('page').querySelectorAll('[data-db-review-tab]').forEach(b => b.onclick = () => { reviewTab = b.dataset.dbReviewTab; renderReview(); bindReview(); });
    $('page').querySelectorAll('[data-db-review-open]').forEach(b => b.onclick = () => { const parts = b.dataset.dbReviewOpen.split('|'); reviewDetail(parts[0], parts.slice(1).join('|')); });
  }
  function reviewEvidence(v){
    const raw=v['评价图片']||v['图片']||[],images=Array.isArray(raw)?raw:raw?[raw]:[];
    const pictures=images.map(name=>{const url=ui().imageURL?.(name);return url?`<img class="dc-preview-img" src="${esc(url)}" alt="虚构评价图片">`:`<p>${esc(name)}（会话图片未提供）</p>`;}).join('');
    const dimensions=v['各维度星级']&&typeof v['各维度星级']==='object'?v['各维度星级']:{};
    return grid(v,['评价对象ID','会员ID','内容安全结果'])+'<p class="dc-note">内容安全结果与图片为虚构演示样例，不代表真实微信API审核；缺值显示未提供。</p><h3>评价图片 · 只读</h3>'+(pictures||'<p>未提供</p>')+(v['评价对象类型']==='商品'?'<h3>商品评价维度 · 只读</h3>'+grid(dimensions,['商品品质','物流速度','包装']):'');
  }
  function reviewDetail(type, id) {
    if (!can('review') || !can(type)) return;
    const v = values(type, id);
    if (!v || !Object.keys(v).length) { PrototypeUI.notice('未找到审核对象资料'); return; }
    const keys = type === 'guide' ? ['姓名', '主体类型', '实名材料', '认证徽章', '服务城市', '实名审核', '状态']
      : type === 'activity' ? ['活动名', '类型', '用户自发活动发起人', '关联城市', '开始时间', '结束时间', '人数上限', '最低成团人数', '是否付费', '成人价', '退改规则', '审核状态', '状态']
      : ['评价对象类型', '评价对象名', '评价会员', '星级', '评价内容', '提交时间', '审核状态'];
    const hist = historyFor(type, id);
    setTop(catName(type) + '审核');
    $('page').innerHTML = screen(catName(type) + '审核', `
      <section class="card"><div class="card-hd"><h2 class="card-t">提交资料 · 只读</h2></div><div class="card-bd pd">${grid(v, keys)}${type==='review'?reviewEvidence(v):''}</div></section>
      <section class="card"><div class="card-hd"><h2 class="card-t">对象级审核历史</h2></div><div class="card-bd pd">${hist.length ? hist.map(h => `<div class="db-hist"><div class="db-hist-hd">${chip(h.result)}<b>${esc(h.actor || '')}</b><span>${esc(h.time || '')}</span></div><div class="db-hist-bd">${esc(h.reason || '')}</div></div>`).join('') : '<div class="empty">暂无历史结论</div>'}</div></section>
      <section class="card"><div class="card-hd"><h2 class="card-t">本次审核结论</h2></div><div class="card-bd pd">
        <div class="fg"><label for="db-rv-result">审核结果</label><select id="db-rv-result" class="fld"><option value="">请选择</option><option value="已通过">已通过</option><option value="已驳回">已驳回</option></select></div>
        <div class="fg mt-3"><label for="db-rv-reason">审核说明</label><textarea id="db-rv-reason" class="fld" rows="4" placeholder="驳回时必须填写原因"></textarea></div>
        <p class="text-mut mt-3">${type === 'guide' ? '实名材料未提供时不能通过。' : '审核通过不等于立即公开上架，仍需按正常流程处理。'}</p>
        <div class="dc-actions mt-3"><button class="btn btn-primary" id="db-rv-save">保存审核结果</button>${type!=='review'?'<button class="btn btn-outline" id="db-rv-edit">完善资料</button>':''}</div>
        <div id="db-rv-error" class="ux-field-error" role="alert"></div>
      </div></section>`, '审核列表');
    bindBack(() => go('review'));
    $('db-rv-save').onclick = () => saveReview(type, id);
    $('db-rv-edit')?.addEventListener('click',()=>{go(type);const row=[...$('page').querySelectorAll('tbody tr')].find(r=>r.dataset.uxId===id);if(row)PrototypeUI.editor(type,row,false,'完善提交资料');});
  }
  function saveReview(type, id) {
    const result = $('db-rv-result').value, reason = ($('db-rv-reason').value || '').trim();
    const fail = m => { $('db-rv-error').textContent = m; };
    if (!result) return fail('请选择审核结果');
    if (result === '已驳回' && !reason) return fail('请填写驳回原因');
    const cur = values(type, id);
    if (type === 'guide' && result === '已通过' && !pick(cur, ['实名材料'])) return fail('实名材料未提供，请先完善资料');
    const patch = type === 'guide' ? { '实名审核': result, '状态': '下架' }
      : type === 'activity' ? { '审核状态': result, '状态': '下架' }
      : Object.assign({ '审核状态': result }, result === '已驳回' ? { '驳回原因': reason } : {});
    try { if (!PrototypeUI.patchRecord(type, id, patch)) return fail('当前资料不能提交审核结果'); } catch (e) { return fail('当前资料不能提交审核结果'); }
    pushShared('reviewHistory', { id: uid('rv'), type, objectId: id, result, reason, actor: actorName(), time: now() });
    try { PrototypeUI.recordOperation('审核' + result, id, `${result}${reason ? '；' + reason : ''}`); } catch (e) {}
    go('review'); PrototypeUI.notice('审核结果已保存');
  }

  /* ---------- 订单（保留既有详情，增强历史/售后/联系） ---------- */
  const ORDER_GROUPS = [
    ['下单事实', ['订单号', '类型', '下单时间', '支付时间', '买家', '买家电话', '关联对象', '规格', '数量', '使用日期']],
    ['金额与优惠', ['订单原价', '优惠券抵扣', '金额', '使用优惠券', '支付']],
    ['履约与收货', ['履约', '物流公司', '物流单号', '收货人', '收货电话', '收货信息']],
    ['售后记录', ['售后', '售后类型', '售后原因', '售后备注', '联系状态']],
    ['订单备注', ['用户备注', '运营内部备注']]
  ];
  const isAA = v => /用户自发|约伴|AA/.test(pick(v, ['类型']) || '');
  const canShip = v => pick(v, ['类型']) === '商城' && pick(v, ['支付']) === '已付款' && pick(v, ['履约']) === '待发货' && !/申请|处理|已退款|已换货/.test(pick(v, ['售后']) || '');

  function orderDetail(id,returnAction) {
    if (!can('order')) return;
    const source = values('order', id);
    if (!source || !Object.keys(source).length) { PrototypeUI.notice('未找到订单资料'); return; }
    const v = Object.assign({}, source);
    const hist = orderHistory().filter(h => h.orderId === id).slice().sort((a, b) => String(b.time).localeCompare(String(a.time)));
    setTop('订单 ' + nameOf('order', v));
    $('page').innerHTML = screen('订单 ' + esc(nameOf('order', v)), `
      <div class="db-order-sections">${ORDER_GROUPS.map(([t, keys]) => `<section class="card"><div class="card-hd"><h2 class="card-t">${t}</h2></div><div class="card-bd pd">${grid(v, keys)}</div></section>`).join('')}</div>
      <section class="card"><div class="card-hd"><h2 class="card-t">操作历史</h2></div><div class="card-bd pd">${hist.length ? `<ol class="db-timeline">${hist.map(h => `<li><div class="db-tl-hd"><b>${esc(h.action)}</b><time>${esc(h.time || '')}</time></div><div>${esc(h.detail || '')}</div></li>`).join('')}</ol>` : '<div class="empty">暂无操作历史</div>'}</div></section>
      <section class="card"><div class="card-hd"><h2 class="card-t">处理订单</h2></div><div class="card-bd pd">
        <p class="text-mut">订单事实只读；金额与支付记录不改写。</p>
        <div class="dc-actions mt-3">${canShip(v) ? `<button class="btn btn-primary" data-db-order-ship="${esc(id)}">填写物流并发货</button>` : ''}${!isAA(v) && v['支付'] === '已付款' ? `<button class="btn btn-outline" data-db-order-after="${esc(id)}">售后结果登记</button>` : ''}${v['类型'] !== '商城' ? `<button class="btn btn-outline" data-db-order-contact="${esc(id)}">登记联系进度</button>` : ''}</div>
        <p class="db-note mt-3">${isAA(v) ? '用户约伴费用由参与者协商，平台不代收，也不办理平台退款。历史金额与支付记录保留供核对。' : '商城发货填写物流公司和单号。售后仅登记申请/处理/已退款/已换货等本地状态，不执行退款，也不发送通知。'}</p>
      </div></section>`, returnAction?'报名名单':'订单列表');
    bindBack(returnAction||(()=>go('order')));
    const s = $('page').querySelector('[data-db-order-ship]'); if (s) s.onclick = () => orderForm(id, 'ship',returnAction);
    const a = $('page').querySelector('[data-db-order-after]'); if (a) a.onclick = () => orderForm(id, 'after',returnAction);
    const c = $('page').querySelector('[data-db-order-contact]'); if (c) c.onclick = () => orderForm(id, 'contact',returnAction);
  }
  function orderForm(id, mode,returnAction) {
    if (!can('order')) return;
    const v = values('order', id);
    if (!v || !Object.keys(v).length) return;
    if (mode === 'ship' && !canShip(v)) return;
    if (mode === 'after' && (isAA(v) || v['支付'] !== '已付款')) return;
    let body;
    if (mode === 'ship') {
      body = `<div class="fg"><label for="db-company">物流公司</label><select id="db-company" class="fld"><option value="">请选择</option><option>顺丰</option><option>圆通</option><option>其他</option></select></div><div class="fg mt-3"><label for="db-number">物流单号</label><input id="db-number" class="fld" maxlength="100"></div>`;
    } else if (mode === 'after') {
      body = `<div class="fg"><label for="db-after-state">售后结果</label><select id="db-after-state" class="fld"><option>申请中</option><option>处理中</option><option>已退款</option><option>已换货</option></select></div><div class="fg mt-3"><label for="db-after-type">售后类型</label><select id="db-after-type" class="fld"><option value="">未分类</option><option>退货</option><option>换货</option><option>补发</option><option>其他</option></select></div><div class="fg mt-3"><label for="db-reason">售后原因</label><textarea id="db-reason" class="fld" rows="3"></textarea></div><div class="fg mt-3"><label for="db-note">处理备注</label><textarea id="db-note" class="fld" rows="3"></textarea></div><div class="fg mt-3"><label for="db-contact">联系状态</label><select id="db-contact" class="fld"><option value="待联系">待联系</option><option value="已联系">已联系</option></select></div>`;
    } else {
      body = `<div class="fg"><label for="db-contact-state">联系进度</label><select id="db-contact-state" class="fld"><option>待联系</option><option>已联系</option></select></div><p class="text-mut mt-3">仅登记联系进度，不代发微信、短信或群消息。</p>`;
    }
    const root = PrototypeUI.dialog(mode === 'ship' ? '确认发货' : mode === 'after' ? '售后结果登记' : '联系进度', body + '<div id="db-form-error" class="ux-field-error mt-3" role="alert"></div>', '<button type="button" class="btn btn-outline" id="db-form-cancel">取消</button><button type="button" class="btn btn-primary" id="db-form-save">保存</button>');
    if (!root) return;
    if (mode === 'after') {
      const st = $('db-after-state');
      st.value = /处理|售后中/.test(v['售后'] || '') ? '处理中' : ((v['售后'] === '已退款' || v['售后'] === '已换货') ? v['售后'] : '申请中');
      $('db-after-type').value = v['售后类型'] || '';
      $('db-reason').value = v['售后原因'] || '';
      $('db-note').value = v['售后备注'] || '';
      $('db-contact').value = v['联系状态'] || '待联系';
    }
    $('db-form-cancel').onclick = () => PrototypeUI.close();
    $('db-form-save').onclick = () => {
      let patch, summary, action;
      const fail = m => { $('db-form-error').textContent = m; };
      if (mode === 'ship') {
        const company = $('db-company').value, number = ($('db-number').value || '').trim();
        if (!company || !number) return fail('请选择物流公司并填写物流单号');
        patch = { '履约': '已发货', '物流公司': company, '物流单号': number };
        summary = `待发货 → 已发货；${company} ${number}`; action = '订单发货';
      } else if (mode === 'after') {
        const reason = ($('db-reason').value || '').trim();
        if (!reason) return fail('请填写售后原因');
        patch = { '售后': $('db-after-state').value, '售后类型': $('db-after-type').value || '其他', '售后原因': reason, '售后备注': ($('db-note').value || '').trim(), '联系状态': $('db-contact').value };
        summary = `${v['售后'] || '无'} → ${patch['售后']}；${reason}；未执行退款`; action = '售后登记';
      } else {
        patch = { '联系状态': $('db-contact-state').value };
        summary = `${v['联系状态'] || '未提供'} → ${patch['联系状态']}；未发送消息`; action = '联系登记';
      }
      try { if (!PrototypeUI.patchRecord('order', id, patch)) return fail('当前订单状态不允许此操作'); } catch (e) { return fail('当前订单状态不允许此操作'); }
      pushShared('orderHistory', { orderId: id, action, time: now(), detail: summary });
      try { PrototypeUI.recordOperation(action, id, summary); } catch (e) {}
      PrototypeUI.close(); orderDetail(id,returnAction); PrototypeUI.notice('记录已保存');
    };
  }

  /* ---------- 活动报名名单 ---------- */
  const signupFilters=new Map();
  function signupView(s) {
    const m=values('member',s.memberId),o=values('order',s.orderId),a=values('activity',s.activityId);
    const qty=Number(o['数量']),guide=a['类型']==='向导带队';
    return {'报名ID':s.id,'活动ID':s.activityId,'活动名':nameOf('activity',a),'报名人':s.name||memberName(m),'会员ID':s.memberId,'订单ID':s.orderId,'报名人数':Number.isInteger(qty)&&qty>0?qty:'未提供','下单时间':o['下单时间']||'未提供','支付时间':o['支付时间']||(o['支付']==='不涉及平台付款'?'不适用':'未提供'),'支付状态':o['支付']||'未提供','订单原价':o['订单原价']??'未提供','优惠券抵扣':o['优惠券抵扣']??'未提供','实付金额':o['金额']??'未提供','联系电话':memberContact(m)!=='未提供'?memberContact(m):o['买家电话']||'未提供','用户备注':o['用户备注']||'未提供','运营备注':o['运营内部备注']||'未提供','关联向导ID':guide?a['关联向导']||'未提供':'不适用','关联合作方ID':a['类型']==='外部合作旅行团'?a['关联合作方']||'未提供':'不适用','联系进度':s.contact||o['联系状态']||'待联系','是否已加向导微信':guide?s.wechatAdded||'未登记':'不适用'};
  }
  function filteredSignups(activityId){
    const filter=signupFilters.get(activityId)||{q:'',contact:''};
    return signups().filter(s=>s.activityId===activityId).filter(s=>{
      const v=signupView(s);return (!filter.contact||v['联系进度']===filter.contact)&&(!filter.q||[v['报名人'],s.memberId,s.orderId,v['联系电话']].join(' ').toLowerCase().includes(filter.q.toLowerCase()));
    });
  }
  function signupTable(list,highlightId){
    if(!list.length)return '<div class="empty"><h3>暂无匹配的报名记录</h3><div>人数只读取关联订单，不从名单条数猜测。</div></div>';
    const heads=['报名人','会员ID','订单ID','报名人数','支付状态','实付金额','联系进度','是否已加向导微信'];
    return `<div class="tbl-scroll"><table class="tbl"><thead><tr>${heads.map(h=>'<th>'+esc(h)+'</th>').join('')}<th>操作</th></tr></thead><tbody>${list.map(s=>{const v=signupView(s);return `<tr data-db-signup-row="${esc(s.id)}" class="${s.id===highlightId?'db-hl':''}">${heads.map(h=>'<td>'+esc(v[h])+'</td>').join('')}<td class="row-acts"><div class="dc-actions"><button type="button" class="btn btn-outline btn-sm" data-db-signup-detail="${esc(s.id)}">详情</button><button type="button" class="btn btn-outline btn-sm" data-db-contact="${esc(s.id)}">联系进度</button>${v['是否已加向导微信']!=='不适用'?`<button type="button" class="btn btn-outline btn-sm" data-db-wechat="${esc(s.id)}">加微信登记</button>`:''}</div></td></tr>`;}).join('')}</tbody></table></div>`;
  }
  function signupDetails(id){
    const s=signups().find(x=>x.id===id);if(!s||!can('activity'))return;
    const v=signupView(s),root=PrototypeUI.dialog('报名详情 · '+v['报名人'],grid(v,Object.keys(v)),'<button class="btn btn-outline" data-prototype-close>返回名单</button><button class="btn btn-outline" id="db-signup-member">查看会员</button><button class="btn btn-outline" id="db-signup-order">查看订单</button>');
    root.querySelector('#db-signup-member').onclick=()=>{PrototypeUI.close();memberDetail(s.memberId,()=>activitySignups(s.activityId,id));};
    root.querySelector('#db-signup-order').onclick=()=>{PrototypeUI.close();orderDetail(s.orderId,()=>activitySignups(s.activityId,id));};
  }
  function signupWechat(id){
    const s=signups().find(x=>x.id===id);if(!s||!can('activity')||signupView(s)['是否已加向导微信']==='不适用')return;
    const root=PrototypeUI.dialog('登记是否已加向导微信','<label for="db-wechat-value">是否已加向导微信</label><select id="db-wechat-value" class="fld"><option>未登记</option><option>未添加</option><option>已添加</option></select><p class="dc-note">与联系进度独立登记；不发送微信或替用户加好友。</p>','<button class="btn btn-outline" data-prototype-close>取消</button><button class="btn btn-primary" id="db-wechat-save">保存</button>');
    root.querySelector('#db-wechat-value').value=s.wechatAdded||'未登记';root.querySelector('#db-wechat-save').onclick=()=>{const old=s.wechatAdded||'未登记';s.wechatAdded=root.querySelector('#db-wechat-value').value;PrototypeUI.recordOperation('报名微信登记',s.id,old+' → '+s.wechatAdded);PrototypeUI.close();activitySignups(s.activityId,id);};
  }
  function activitySignupCSV(id){if(!can('activity'))return;const list=filteredSignups(id);if(!list.length)return PrototypeUI.notice('没有匹配报名，未生成CSV');const first=signupView(list[0]),heads=Object.keys(first);csv('本活动报名名单.csv',heads,list.map(s=>{const v=signupView(s);return heads.map(h=>v[h]);}));}
  function paintSignupList(id,highlight){const list=filteredSignups(id),all=signups().filter(s=>s.activityId===id),total=list.reduce((n,s)=>n+(typeof signupView(s)['报名人数']==='number'?signupView(s)['报名人数']:0),0),missing=list.filter(s=>typeof signupView(s)['报名人数']!=='number').length;$('db-signup-table').innerHTML=signupTable(list,highlight);$('db-signup-count').textContent=`显示${list.length}/${all.length}条报名；已提供人数合计${total}${missing?'；'+missing+'条人数未提供':''}`;bindSignupRows();}
  function bindSignupRows() {
    $('page').querySelectorAll('[data-db-member]').forEach(b => b.onclick = () => memberDetail(b.dataset.dbMember));
    $('page').querySelectorAll('[data-db-order]').forEach(b => b.onclick = () => orderDetail(b.dataset.dbOrder));
    $('page').querySelectorAll('[data-db-contact]').forEach(b => b.onclick = () => signupContact(b.dataset.dbContact));
    $('page').querySelectorAll('[data-db-signup-detail]').forEach(b=>b.onclick=()=>signupDetails(b.dataset.dbSignupDetail));
    $('page').querySelectorAll('[data-db-wechat]').forEach(b=>b.onclick=()=>signupWechat(b.dataset.dbWechat));
  }
  function activitySignups(activityId, highlightSignupId) {
    if (!can('activity')) return;
    const av = values('activity', activityId);
    if (!av || !Object.keys(av).length) { PrototypeUI.notice('未找到活动资料'); return; }
    const list = signups().filter(s => s.activityId === activityId);
    setTop('活动报名名单');
    $('page').innerHTML = screen(`${nameOf('activity', av)} · 报名名单`, `
      <section class="card"><div class="card-hd"><h2 class="card-t">活动资料</h2></div><div class="card-bd pd">${grid(av, ['活动名', '类型', '用户自发活动发起人', '关联城市', '开始时间', '结束时间', '人数上限', '最低成团人数', '是否付费', '成人价', '审核状态', '状态'])}</div></section>
      <section class="card"><div class="card-hd"><h2 class="card-t">活动进度</h2><button class="btn btn-outline btn-sm" id="db-activity-progress" ${av['状态']==='上架'?'':'disabled title="先完成审核并上架活动"'}>修改进度</button></div><div class="card-bd pd"><strong>${esc(av['履约状态']||'待成行')}</strong><p class="dc-note">待成行：等待确认活动能否组织出发；已成行：已确认成行、尚未结束；已完成：活动服务结束。</p><p class="dc-note">进度由运营登记，与支付、审核和上下架状态分开；保存后同步该活动报名订单。</p></div></section>
      <section class="card"><div class="card-hd"><h2 class="card-t">报名名单</h2><button class="btn btn-outline btn-sm" id="db-signup-export">导出当前名单CSV</button></div><div class="card-bd pd"><div class="dc-actions"><label for="db-signup-query">搜索报名人/会员/订单/电话</label><input id="db-signup-query" class="fld" type="search"><label for="db-signup-contact-filter">联系进度</label><select id="db-signup-contact-filter" class="fld"><option value="">全部</option><option>待联系</option><option>已联系</option></select></div><p id="db-signup-count" class="dc-note"></p><div id="db-signup-table"></div></div></section>`, '活动列表');
    bindBack(() => go('activity'));
    const filter=signupFilters.get(activityId)||{q:'',contact:''};
    $('db-signup-query').value=filter.q;$('db-signup-contact-filter').value=filter.contact;
    const apply=()=>{signupFilters.set(activityId,{q:$('db-signup-query').value.trim(),contact:$('db-signup-contact-filter').value});paintSignupList(activityId,highlightSignupId);};
    $('db-signup-query').oninput=apply;$('db-signup-contact-filter').onchange=apply;
    $('db-signup-export').onclick=()=>activitySignupCSV(activityId);paintSignupList(activityId,highlightSignupId);
    $('db-activity-progress').onclick=()=>W.AdminDemoConfig?.activityProgress(activityId);
  }
  function signupContact(signupId) {
    const s = signups().find(x => x.id === signupId);
    if (!s) { PrototypeUI.notice('未找到报名记录'); return; }
    const body = `<div class="fg"><label for="db-contact">联系进度</label><select id="db-contact" class="fld"><option value="待联系">待联系</option><option value="已联系">已联系</option></select></div><div id="db-contact-error" class="ux-field-error mt-3" role="alert"></div>`;
    const root = PrototypeUI.dialog('报名联系进度', body, '<button type="button" class="btn btn-outline" id="db-contact-cancel">取消</button><button type="button" class="btn btn-primary" id="db-contact-save">保存</button>');
    if (!root) return;
    $('db-contact').value = s.contact || '待联系';
    $('db-contact-cancel').onclick = () => PrototypeUI.close();
    $('db-contact-save').onclick = () => {
      const st = $('db-contact').value;
      if(!PrototypeUI.patchRecord('order',s.orderId,{'联系状态':st}))return $('db-contact-error').textContent='联系状态未保存，请核对订单';
      s.contact = st;
      try { PrototypeUI.recordOperation('报名联系', s.orderId, `${s.name || s.memberId} → ${st}；未发送消息`); } catch (e) {}
      PrototypeUI.close(); activitySignups(s.activityId, s.id); PrototypeUI.notice('联系进度已保存');
    };
  }

  /* ---------- 会员事件时间线 ---------- */
  function memberDetail(id,returnAction) {
    if (!can('member')) return;
    const mv = values('member', id);
    if (!mv || !Object.keys(mv).length) { PrototypeUI.notice('未找到会员资料'); return; }
    const attribution=W.AdminDemoPromo?.memberAttribution?.(id);
    const timeline = events().filter(e => e.memberId === id).slice().sort((a, b) => String(b.time).localeCompare(String(a.time)));
    const mySignups = signups().filter(s => s.memberId === id);
    const myOrders = records('order').filter(r => {
      const oid = r.id;
      if (mySignups.some(s => s.orderId === oid)) return true;
      if (couponRecords().some(c => c.memberId === id && c.orderId === oid)) return true;
      if (events().some(e => e.memberId === id && e.objectId === oid)) return true;
      return false;
    });
    const myCheckins = records('checkin').filter(r => {
      const v = r.values || {};
      return pick(v, ['会员ID', '会员']) === id || String(pick(v, ['会员', '会员昵称'])) === memberName(mv);
    });
    setTop('会员事件时间线');
    $('page').innerHTML = screen(`${memberName(mv)} · 事件时间线`, `
      <section class="card"><div class="card-hd"><h2 class="card-t">会员资料</h2></div><div class="card-bd pd">${grid(mv, ['昵称', '当前等级', '累计到店打卡数', '来源渠道', '来自城市', '注册时间', '累计付费金额', '累计积分', '运营标签', '状态'])}</div></section>
      ${attribution?`<section class="card"><div class="card-hd"><h2 class="card-t">首绑来源 · 虚构推广样例</h2></div><div class="card-bd pd"><p>${esc(attribution.channelName)} · ${esc(attribution.codeId)} · 首绑 ${esc(attribution.at)}</p><p>累计已付款 ¥${money(attribution.amount)}；创建时比例 ${esc(attribution.ratio)}%；参考应分 ¥${money(attribution.commission)}</p><p class="dc-note">与上方原资料来源字段、历史手工单笔依据分开；扫码其他码不会覆盖本来源。</p><button class="btn btn-outline" id="db-promo-source">查看首绑与扫码明细</button></div></section>`:''}
      <section class="card"><div class="card-hd"><h2 class="card-t">关联报名</h2></div><div class="card-bd pd">${mySignups.length ? mySignups.map(s => `<div class="db-line"><span>${esc(nameOf('activity', values('activity', s.activityId)))}</span><span class="text-mut">${esc(s.activityId)} · ${esc(s.orderId)}</span><div class="dc-actions"><button type="button" class="btn btn-outline btn-sm" data-db-order="${esc(s.orderId)}">订单</button></div></div>`).join('') : '<div class="empty">暂无关联报名</div>'}</div></section>
      <section class="card"><div class="card-hd"><h2 class="card-t">事件时间线</h2></div><div class="card-bd pd">${timeline.length ? `<ol class="db-timeline">${timeline.map(e => `<li><div class="db-tl-hd"><b>${esc(e.type || '事件')}</b><span>${esc(e.objectId || '')}</span><time>${esc(e.time || '')}</time></div><div>${esc(e.result || '')}</div></li>`).join('')}</ol>` : '<div class="empty">暂无事件记录</div>'}</div></section>
      <section class="card"><div class="card-hd"><h2 class="card-t">关联订单与核销</h2></div><div class="card-bd pd">${relatedOrderTable(myOrders, myCheckins)}</div></section>`, returnAction?'报名名单':'会员列表');
    bindBack(returnAction||(()=>go('member')));
    $('db-promo-source')?.addEventListener('click',()=>W.AdminDemoPromo.bindingDetails(attribution.codeId));
    $('page').querySelectorAll('[data-db-order]').forEach(b => b.onclick = () => orderDetail(b.dataset.dbOrder));
    $('page').querySelectorAll('[data-db-checkin]').forEach(b => b.onclick = () => checkinDetail(b.dataset.dbCheckin));
  }
  function relatedOrderTable(orders, checkins) {
    const or = orders.map(o => `<tr><td class="cell-m">${esc(nameOf('order', o.values))}</td><td>${esc(pick(o.values, ['支付']))}</td><td>${esc(pick(o.values, ['履约']))}</td><td>${esc(pick(o.values, ['售后']))}</td><td class="row-acts"><button type="button" class="btn btn-outline btn-sm" data-db-order="${esc(o.id)}">订单详情</button></td></tr>`).join('');
    const ck = checkins.map(c => `<tr><td class="cell-m">${esc(nameOf('checkin', c.values))}</td><td>${esc(pick(c.values, ['打卡时间']))}</td><td>${esc(pick(c.values, ['评价内容']) || '')}</td><td class="row-acts"><button type="button" class="btn btn-outline btn-sm" data-db-checkin="${esc(c.id)}">核销详情</button></td></tr>`).join('');
    return `<div class="tbl-scroll"><table class="tbl"><thead><tr><th>订单</th><th>支付</th><th>履约</th><th>售后</th><th>操作</th></tr></thead><tbody>${or || '<tr><td colspan="5">暂无关联订单</td></tr>'}</tbody></table></div>${ck ? `<h3 class="mt-3">核销记录</h3><div class="tbl-scroll"><table class="tbl"><thead><tr><th>核销</th><th>时间</th><th>评价</th><th>操作</th></tr></thead><tbody>${ck}</tbody></table></div>` : ''}`;
  }

  /* ---------- 核销证据与异常核实 ---------- */
  function checkinTable(list) {
    if (!list.length) return '<div class="empty"><h3>暂无核销记录</h3></div>';
    return `<div class="tbl-scroll"><table class="tbl"><thead><tr><th>核销</th><th>时间</th><th>会员</th><th>评价</th><th>操作</th></tr></thead><tbody>${list.map(r => `<tr><td class="cell-m">${esc(nameOf('checkin', r.values))}</td><td>${esc(pick(r.values, ['打卡时间']))}</td><td>${esc(pick(r.values, ['会员', '会员昵称']))}</td><td>${esc(pick(r.values, ['评价内容']) || '')}</td><td class="row-acts"><button type="button" class="btn btn-outline btn-sm" data-db-checkin="${esc(r.id)}">详情</button></td></tr>`).join('')}</tbody></table></div>`;
  }
  function checkinDetail(id) {
    if (!can('checkin')) return;
    if(W.AdminDemoCheckin)return W.AdminDemoCheckin.detail(id);
    const v = values('checkin', id);
    if (!v || !Object.keys(v).length) { PrototypeUI.notice('未找到核销记录'); return; }
    const m = anomalyMap();
    const rec = m ? m.get(id) : null;
    setTop('核销证据与异常核实');
    $('page').innerHTML = screen(`核销 ${esc(nameOf('checkin', v))}`, `
      <section class="card"><div class="card-hd"><h2 class="card-t">核销事实 · 只读</h2></div><div class="card-bd pd">${grid(v, ['核销编号', '打卡时间', '打卡凭据', '会员', '会员ID', '商户', '商户ID', '评价内容', '评价时间', '评价确认', '异常标记'])}</div></section>
      <section class="card"><div class="card-hd"><h2 class="card-t">异常核实（独立结论）</h2></div><div class="card-bd pd">
        <div class="fg"><label for="db-an-result">核实结果</label><select id="db-an-result" class="fld"><option value="">请选择</option><option value="已核实正常">已核实正常</option><option value="已确认异常">已确认异常</option></select></div>
        <div class="fg mt-3"><label for="db-an-note">核实备注</label><textarea id="db-an-note" class="fld" rows="3"></textarea></div>
        <p class="text-mut mt-3">只登记核实结论，不修改扫描事实。</p>
        <div class="dc-actions mt-3"><button class="btn btn-primary" id="db-an-save">保存核实结果</button></div>
        <div id="db-an-error" class="ux-field-error" role="alert"></div>
        ${rec ? `<div class="db-hist mt-3"><div class="db-hist-hd">${chip(rec.result)}<span>${esc(rec.time || '')}</span></div><div class="db-hist-bd">${esc(rec.note || '')}</div></div>` : ''}
      </div></section>`, '核销列表');
    bindBack(() => go('checkin'));
    if (rec) { const sel = $('db-an-result'); if (sel) sel.value = rec.result || ''; const ta = $('db-an-note'); if (ta) ta.value = rec.note || ''; }
    $('db-an-save').onclick = () => {
      const result = $('db-an-result').value, note = ($('db-an-note').value || '').trim();
      const fail = m => { $('db-an-error').textContent = m; };
      if (!result) return fail('请选择核实结果');
      const map = anomalyMap();
      if (!map) return fail('异常核实共享数据未就绪');
      map.set(id, { result, note, time: now() });
      try { PrototypeUI.recordOperation('异常核实', id, `${result}${note ? '；' + note : ''}`); } catch (e) {}
      go('checkin'); PrototypeUI.notice('核实结果已保存');
    };
  }
  function checkinRecords(objectId, backPage) {
    if (!can('checkin')) return;
    if(W.AdminDemoCheckin&&backPage==='merchant')return W.AdminDemoCheckin.listForMerchant(objectId);
    const list = records('checkin').filter(r => {
      const v = r.values || {};
      return pick(v, ['关联商户', '商户ID', '商户']) === objectId || String(pick(v, ['商户', '商户名'])) === objectId;
    });
    setTop('核销记录');
    $('page').innerHTML = screen(`核销记录 · ${esc(objectId)}`, `<section class="card"><div class="card-hd"><h2 class="card-t">核销记录</h2></div><div class="card-bd pd">${checkinTable(list)}</div></section>`, '返回');
    bindBack(() => go(backPage || 'checkin'));
    $('page').querySelectorAll('[data-db-checkin]').forEach(b => b.onclick = () => checkinDetail(b.dataset.dbCheckin));
  }

  /* ---------- 优惠券领取使用记录 ---------- */
  function couponRecordTable(list) {
    if (!list.length) return '<div class="empty"><h3>暂无领取记录</h3></div>';
    return `<div class="tbl-scroll"><table class="tbl"><thead><tr><th>会员</th><th>会员ID</th><th>订单ID</th><th>领取时间</th><th>使用时间</th><th>金额</th><th>操作</th></tr></thead><tbody>${list.map(c => {
      const m = values('member', c.memberId);
      return `<tr><td class="cell-m">${esc(memberName(m))}</td><td class="num">${esc(c.memberId)}</td><td class="num">${esc(c.orderId || '未使用')}</td><td>${esc(c.claimedAt || '')}</td><td>${c.usedAt ? esc(c.usedAt) : chip('未使用')}</td><td class="num">${esc(c.amount ?? '')}</td><td class="row-acts"><button type="button" class="btn btn-outline btn-sm" data-db-member="${esc(c.memberId)}">会员</button>${c.orderId ? `<button type="button" class="btn btn-outline btn-sm" data-db-order="${esc(c.orderId)}">订单</button>` : ''}</td></tr>`;
    }).join('')}</tbody></table></div>`;
  }
  function couponDetail(couponId) {
    if (!can('coupon')) return;
    const cv = values('coupon', couponId);
    const list = couponRecords().filter(c => c.couponId === couponId);
    const claimed = list.length, used = list.filter(c => c.usedAt).length;
    setTop('优惠券领取与使用');
    $('page').innerHTML = screen(`券 ${esc(nameOf('coupon', cv))}`, `
      <section class="card"><div class="card-hd"><h2 class="card-t">券资料</h2></div><div class="card-bd pd">${cv && Object.keys(cv).length ? grid(cv, ['券名', '券类型', '优惠类型', '优惠数值', '使用门槛', '适用范围', '库存', '状态']) : '<div class="text-mut">未找到券资料，仅显示共享领取记录。</div>'}</div></section>
      <section class="card"><div class="card-hd"><div><h2 class="card-t">领取与使用记录</h2></div><span class="text-mut">已领取 ${claimed} · 已使用 ${used}</span></div><div class="card-bd pd">${couponRecordTable(list)}</div></section>`, '券列表');
    bindBack(() => go('coupon'));
    $('page').querySelectorAll('[data-db-member]').forEach(b => b.onclick = () => memberDetail(b.dataset.dbMember));
    $('page').querySelectorAll('[data-db-order]').forEach(b => b.onclick = () => orderDetail(b.dataset.dbOrder));
  }

  /* ---------- 待办 ---------- */
  function anomalyItems() {
    const m = anomalyMap(); const out = [];
    if (!m) return out;
    m.forEach((v, k) => out.push({ id: k, result: v && v.result, note: v && v.note, time: v && v.time, unhandled: !v || !v.result || v.result === '待核实' }));
    return out;
  }
  function buildTodos() {
    const list = [];
    reviewQueue().forEach(r => list.push({ key: 'review-' + r.type + '-' + r.id, group: '审核', text: `${catName(r.type)}待审：${r.name}`, action: 'review', type: r.type, id: r.id }));
    records('order').forEach(r => {
      const v = r.values || {};
      if (canShip(v)) list.push({ key: 'ship-' + r.id, group: '订单', text: `待发货：${nameOf('order', v)}`, action: 'order', id: r.id });
      if (/申请中|处理中/.test(pick(v, ['售后']) || '')) list.push({ key: 'after-' + r.id, group: '售后', text: `售后处理中：${nameOf('order', v)}`, action: 'order', id: r.id });
    });
    signups().forEach(s => {
      const o = values('order', s.orderId);
      if (/待联系/.test(s.contact || pick(o, ['联系状态']) || '')) list.push({ key: 'contact-' + s.id, group: '报名', text: `待联系报名人：${s.name || memberName(values('member', s.memberId))}（${nameOf('activity', values('activity', s.activityId))}）`, action: 'signup', id: s.activityId, sub: s.id });
    });
    anomalyItems().filter(a => a.unhandled).forEach(a => list.push({ key: 'anomaly-' + a.id, group: '核销', text: `核销异常待核实：${a.id}`, action: 'checkin', id: a.id }));
    for(const alert of W.AdminDemoConfig?.alerts?.()||[])list.push({key:'config-'+alert.id,group:alert.kind,text:alert.text,action:'config-alert',id:alert.id});
    return list;
  }
  function renderTodo() {
    if (!can('todo')) return;
    setTop('待办中心');
    const items = buildTodos();
    $('page').innerHTML = `<div class="pg-hd"><div><h1>待办中心</h1><div class="sub">每项待办都指向具体记录；处理后重新进入本页计数会减少。</div></div></div><div class="dc-grid db-todo">${items.length ? items.map((it, i) => `<section class="card db-todo-item"><div class="card-bd pd"><div class="db-todo-top"><span class="db-badge">${esc(it.group)}</span><span class="text-mut">${i + 1}</span></div><h3 class="card-t">${esc(it.text)}</h3><div class="dc-actions mt-3"><button type="button" class="btn btn-primary" data-db-todo="${i}">前往处理</button></div></div></section>`).join('') : '<div class="empty"><h3>暂无待办</h3><div>当前共享资料中无需处理的事项。</div></div>'}</div>`;
  }
  function bindTodo() {
    const items = buildTodos();
    $('page').querySelectorAll('[data-db-todo]').forEach(b => b.onclick = () => openTodo(items[+b.dataset.dbTodo]));
  }
  function openTodo(it) {
    if (!it) return;
    if (it.action === 'review') reviewDetail(it.type, it.id);
    else if (it.action === 'order') orderDetail(it.id);
    else if (it.action === 'checkin') checkinDetail(it.id);
    else if (it.action === 'signup') activitySignups(it.id, it.sub);
    else if(it.action==='config-alert')W.AdminDemoConfig?.openAlert?.(it.id);
  }

  /* ---------- 汇总：dashboard / report / risk ---------- */
  function summaryStats() {
    const signupRows = signups();
    const act = records('activity');
    const members = records('member');
    const orders = records('order');
    const coupons = couponRecords();
    const rq = reviewQueue();
    const hist = reviewHistory();
    const ano = anomalyItems();
    return {
      activities: act.length, members: members.length, orders: orders.length,
      signups: signupRows.length, signupContacted: signupRows.filter(s => /已联系/.test(s.contact || '')).length,
      pendingReview: rq.length, passed: passedRejected('已通过').length, rejected: passedRejected('已驳回').length,
      paidOrders: orders.filter(r => pick(r.values, ['支付']) === '已付款').length,
      openAfter: orders.filter(r => /申请中|处理中/.test(pick(r.values, ['售后']) || '')).length,
      toShip: orders.filter(r => canShip(r.values)).length,
      couponsClaimed: coupons.length, couponsUsed: coupons.filter(c => c.usedAt).length,
      anomalies: ano.length, anomaliesOpen: ano.filter(a => a.unhandled).length,
      events: events().length
    };
  }
  function kpis(s) {
    const k = [['活动报名', s.signups], ['待审', s.pendingReview], ['售后处理中', s.openAfter], ['异常待核实', s.anomaliesOpen], ['券已领/已用', `${s.couponsClaimed}/${s.couponsUsed}`]];
    return `<div class="dc-grid db-kpis">${k.map(([t, v]) => `<div class="card db-kpi"><div class="card-bd pd"><div class="db-kpi-n">${esc(v)}</div><div class="text-mut">${esc(t)}</div></div></div>`).join('')}</div>`;
  }
  function mini(label, value, extra) { return `<dl class="db-mini"><div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>${extra ? `<div><dt>${esc(extra[0])}</dt><dd>${esc(extra[1])}</dd></div>` : ''}</dl>`; }
  function summaryCard(title, html, page, boss) {
    return `<section class="card"><div class="card-hd"><div><h2 class="card-t">${esc(title)}</h2></div>${boss ? '' : `<button type="button" class="btn btn-ghost btn-sm" data-db-goto="${esc(page)}">查看 →</button>`}</div><div class="card-bd pd">${html}</div></section>`;
  }
  const CSV_LABEL = { signups: '报名名单CSV', review: '审核历史CSV', order: '订单历史CSV', coupon: '券记录CSV', events: '会员事件CSV', anomaly: '异常核实CSV', summary: '汇总CSV' };
  const csvButtons = keys => keys.map(k => `<button type="button" class="btn btn-outline" data-db-csv="${k}">${CSV_LABEL[k] || k}</button>`).join('');

  function signupReportTable() {
    const list = signups();
    if (!list.length) return '<div class="empty">暂无报名名单</div>';
    return `<div class="tbl-scroll"><table class="tbl"><thead><tr><th>活动ID</th><th>活动名</th><th>会员ID</th><th>姓名</th><th>联系方式</th><th>订单ID</th><th>联系进度</th></tr></thead><tbody>${list.map(s => { const a = values('activity', s.activityId), m = values('member', s.memberId); return `<tr><td class="num">${esc(s.activityId)}</td><td>${esc(nameOf('activity', a))}</td><td class="num">${esc(s.memberId)}</td><td>${esc(s.name || memberName(m))}</td><td>${esc(memberContact(m))}</td><td class="num">${esc(s.orderId)}</td><td>${chip(s.contact || '待联系')}</td></tr>`; }).join('')}</tbody></table></div>`;
  }
  function reviewHistoryTable() {
    const h = reviewHistory().slice().sort((a, b) => String(b.time).localeCompare(String(a.time)));
    if (!h.length) return '<div class="empty">暂无审核历史</div>';
    return `<div class="tbl-scroll"><table class="tbl"><thead><tr><th>类型</th><th>对象ID</th><th>结果</th><th>原因</th><th>人员</th><th>时间</th></tr></thead><tbody>${h.map(x => `<tr><td>${esc(catName(x.type))}</td><td class="num">${esc(x.objectId)}</td><td>${chip(x.result)}</td><td>${esc(x.reason || '')}</td><td>${esc(x.actor || '')}</td><td>${esc(x.time || '')}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function orderHistoryTable() {
    const h = orderHistory().slice().sort((a, b) => String(b.time).localeCompare(String(a.time)));
    if (!h.length) return '<div class="empty">暂无订单操作历史</div>';
    return `<div class="tbl-scroll"><table class="tbl"><thead><tr><th>订单ID</th><th>动作</th><th>时间</th><th>详情</th></tr></thead><tbody>${h.map(x => `<tr><td class="num">${esc(x.orderId)}</td><td>${esc(x.action)}</td><td>${esc(x.time || '')}</td><td>${esc(x.detail || '')}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function couponReportTable() {
    const list = couponRecords();
    if (!list.length) return '<div class="empty">暂无券记录</div>';
    return `<div class="tbl-scroll"><table class="tbl"><thead><tr><th>券ID</th><th>会员ID</th><th>订单ID</th><th>领取时间</th><th>使用时间</th><th>金额</th></tr></thead><tbody>${list.map(c => `<tr><td class="num">${esc(c.couponId)}</td><td class="num">${esc(c.memberId)}</td><td class="num">${esc(c.orderId || '未使用')}</td><td>${esc(c.claimedAt || '')}</td><td>${esc(c.usedAt || '')}</td><td class="num">${esc(c.amount ?? '')}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function riskAnomalyRows(boss) {
    const ano = anomalyItems().filter(a => a.unhandled);
    if (!ano.length) return '<div class="empty">暂无异常</div>';
    return `<div class="tbl-scroll"><table class="tbl"><thead><tr><th>核销ID</th><th>结果</th><th>备注</th><th>时间</th>${boss ? '' : '<th>操作</th>'}</tr></thead><tbody>${ano.map(a => `<tr><td class="num">${esc(a.id)}</td><td>${chip(a.result || '待核实')}</td><td>${esc(a.note || '')}</td><td>${esc(a.time || '')}</td>${boss ? '' : `<td class="row-acts"><button type="button" class="btn btn-outline btn-sm" data-db-checkin="${esc(a.id)}">去核实</button></td>`}</tr>`).join('')}</tbody></table></div>`;
  }
  function riskAfterRows(boss) {
    const after = records('order').filter(r => /申请中|处理中/.test(pick(r.values, ['售后']) || ''));
    if (!after.length) return '<div class="empty">暂无售后处理中</div>';
    return `<div class="tbl-scroll"><table class="tbl"><thead><tr><th>订单</th><th>售后</th><th>原因</th>${boss ? '' : '<th>操作</th>'}</tr></thead><tbody>${after.map(r => `<tr><td class="cell-m">${esc(nameOf('order', r.values))}</td><td>${chip(pick(r.values, ['售后']))}</td><td>${esc(pick(r.values, ['售后原因']) || '')}</td>${boss ? '' : `<td class="row-acts"><button type="button" class="btn btn-outline btn-sm" data-db-order="${esc(r.id)}">处理</button></td>`}</tr>`).join('')}</tbody></table></div>`;
  }
  function renderSummary(id) {
    if (!can(id)) return;
    const s = summaryStats();
    const boss = isBoss();
    if (id === 'dashboard') {
      setTop('数据看板');
      $('page').innerHTML = `<div class="pg-hd"><div><h1>数据看板</h1><div class="sub">与活动/订单/会员/核销/券共享同一资料池；点击待办可进入具体记录。</div></div><div class="dc-actions">${boss ? '' : '<button type="button" class="btn btn-outline" data-db-goto="todo">待办中心 →</button>'}</div></div>${kpis(s)}<div class="dc-grid">${summaryCard('活动报名', mini('报名人数', s.signups, ['已联系', s.signupContacted]), 'activity', boss)}${summaryCard('审核', mini('待审', s.pendingReview, ['已通过/驳回', `${s.passed}/${s.rejected}`]), 'review', boss)}${summaryCard('订单与售后', mini('售后处理中', s.openAfter, ['待发货', s.toShip]), 'order', boss)}</div><div class="card"><div class="card-hd"><div><h2 class="card-t">下载共享汇总</h2></div></div><div class="card-bd pd"><div class="dc-actions">${csvButtons(boss ? ['summary'] : ['signups', 'review', 'order', 'coupon', 'events', 'summary'])}</div></div></div>`;
    } else if (id === 'report') {
      setTop('经营报表');
      if (boss) { $('page').innerHTML = `<div class="pg-hd"><div><h1>经营报表</h1><div class="sub">范围：当前全部演示样例；刷新恢复初始数据，不按真实经营日期统计。</div></div>${csvButtons(['summary'])}</div>${kpis(s)}<div class="dc-grid">${summaryCard('活动报名', mini('报名人数', s.signups, ['已联系', s.signupContacted]), 'activity', true)}${summaryCard('审核结果', mini('待审', s.pendingReview, ['已通过/驳回', `${s.passed}/${s.rejected}`]), 'review', true)}${summaryCard('业务风险', mini('售后处理中', s.openAfter, ['异常待核实', s.anomaliesOpen]), 'order', true)}</div>`; return; }
      $('page').innerHTML = `<div class="pg-hd"><div><h1>经营报表</h1><div class="sub">报表与看板/风险同源，导出为真实 CSV 文件。</div></div><div class="dc-actions">${csvButtons(boss ? ['summary'] : ['signups', 'review', 'order', 'coupon', 'events', 'summary'])}</div></div><div class="dc-grid"><section class="card"><div class="card-hd"><h2 class="card-t">报名名单</h2></div><div class="card-bd pd">${signupReportTable()}</div></section><section class="card"><div class="card-hd"><h2 class="card-t">审核历史</h2></div><div class="card-bd pd">${reviewHistoryTable()}</div></section></div><div class="dc-grid"><section class="card"><div class="card-hd"><h2 class="card-t">券领取使用</h2></div><div class="card-bd pd">${couponReportTable()}</div></section><section class="card"><div class="card-hd"><h2 class="card-t">订单操作历史</h2></div><div class="card-bd pd">${orderHistoryTable()}</div></section></div>`;
    } else {
      setTop('风险提醒');
      $('page').innerHTML = `<div class="pg-hd"><div><h1>风险提醒</h1><div class="sub">风险来自共享核销异常与售后处理中记录；老板只读汇总。</div></div><div class="dc-actions">${csvButtons(['anomaly', 'summary'])}</div></div><div class="dc-grid"><section class="card"><div class="card-hd"><h2 class="card-t">核销异常（${s.anomaliesOpen}）</h2></div><div class="card-bd pd">${riskAnomalyRows(boss)}</div></section><section class="card"><div class="card-hd"><h2 class="card-t">售后处理中（${s.openAfter}）</h2></div><div class="card-bd pd">${riskAfterRows(boss)}</div></section></div>`;
    }
  }
  function bindSummary() {
    $('page').querySelectorAll('[data-db-goto]').forEach(b => b.onclick = () => go(b.dataset.dbGoto));
    $('page').querySelectorAll('[data-db-csv]').forEach(b => b.onclick = () => runCSV(b.dataset.dbCsv));
    $('page').querySelectorAll('[data-db-checkin]').forEach(b => b.onclick = () => checkinDetail(b.dataset.dbCheckin));
    $('page').querySelectorAll('[data-db-order]').forEach(b => b.onclick = () => orderDetail(b.dataset.dbOrder));
    $('page').querySelectorAll('[data-db-member]').forEach(b => b.onclick = () => memberDetail(b.dataset.dbMember));
  }

  /* ---------- CSV ---------- */
  function signupCSV() {
    if(!can('activity'))return;const list=signups();if(!list.length)return PrototypeUI.notice('没有报名记录，未生成CSV');
    const heads=Object.keys(signupView(list[0]));csv('活动报名名单.csv',heads,list.map(s=>{const v=signupView(s);return heads.map(h=>v[h]);}));
  }
  function reviewCSV() { csv('审核历史.csv', ['类型', '对象ID', '结果', '原因', '人员', '时间'], reviewHistory().map(h => [h.type, h.objectId, h.result, h.reason || '', h.actor || '', h.time || ''])); }
  function orderHistoryCSV() { csv('订单操作历史.csv', ['订单ID', '动作', '时间', '详情'], orderHistory().map(h => [h.orderId, h.action, h.time || '', h.detail || ''])); }
  function couponCSV() { csv('券领取使用.csv', ['券ID', '会员ID', '订单ID', '领取时间', '使用时间', '金额'], couponRecords().map(c => [c.couponId, c.memberId, c.orderId || '', c.claimedAt || '', c.usedAt || '', c.amount ?? ''])); }
  function anomalyCSV() { csv('异常核实.csv', ['核销ID', '核实结果', '备注', '时间'], anomalyItems().map(a => [a.id, a.result || '待核实', a.note || '', a.time || ''])); }
  function eventCSV() { csv('会员事件.csv', ['会员ID', '类型', '对象ID', '时间', '结果'], events().map(e => [e.memberId, e.type, e.objectId, e.time || '', e.result || ''])); }
  function summaryCSV() {
    const s = summaryStats();
    csv('业务结果汇总.csv', ['指标', '数值'], [['活动数', s.activities], ['会员数', s.members], ['订单数', s.orders], ['报名人数', s.signups], ['已联系报名', s.signupContacted], ['待审', s.pendingReview], ['已通过', s.passed], ['已驳回', s.rejected], ['已付款订单', s.paidOrders], ['售后处理中', s.openAfter], ['待发货', s.toShip], ['券已领取', s.couponsClaimed], ['券已使用', s.couponsUsed], ['异常待核实', s.anomaliesOpen], ['事件数', s.events]]);
  }
  function runCSV(k) {
    if (k === 'signups') signupCSV();
    else if (k === 'review') reviewCSV();
    else if (k === 'order') orderHistoryCSV();
    else if (k === 'coupon') couponCSV();
    else if (k === 'events') eventCSV();
    else if (k === 'anomaly') anomalyCSV();
    else summaryCSV();
  }

  /* ---------- 桥接 ---------- */
  function renderPage(id) {
    if (['review', 'todo', 'dashboard', 'report', 'risk'].indexOf(id) < 0) return false;
    if (!can(id)) return false;
    if (id === 'review') renderReview();
    else if (id === 'todo') renderTodo();
    else renderSummary(id);
    return true;
  }
  function bindPage(id) {
    if (id === 'review') bindReview();
    else if (id === 'todo') bindTodo();
    else if (id === 'dashboard' || id === 'report' || id === 'risk') bindSummary();
    else if (id === 'activity') enhanceRows('activity', 'activity-signups', '报名名单');
    else if (id === 'member') enhanceRows('member', 'member-timeline', '事件时间线');
    else if (id === 'coupon') enhanceRows('coupon', 'coupon-records', '领取/使用');
    else if (id === 'order') {
      enhanceRows('order','order-history','操作历史');
      for(const select of $('page').querySelectorAll('.tbar select')){
        const first=select.options[0]?.textContent||'';
        const opts=first.includes('支付')?['待付款','已付款','已取消','不涉及平台付款']:first.includes('履约')?['待发货','已发货','已签收','待成行','已成行','已完成']:[];
        for(const text of opts)if(![...select.options].some(o=>o.value===text))select.add(new Option(text,text));
      }
    }
    else if (id === 'checkin' && !W.AdminDemoCheckin) enhanceRows('checkin', 'checkin-evidence', '详情');
  }
  function enhanceRows(page, action, label) {
    if (!can(page)) return;
    doc.querySelectorAll('#page tbody tr').forEach(row => {
      const id = row.dataset && row.dataset.uxId;
      if (!id) return;
      if (row.querySelector(`[data-db-action="${action}"]`)) return;
      const cell = row.lastElementChild;
      if (!cell) return;
      if(page==='activity'){
        const existing=[...cell.querySelectorAll('button')].find(b=>/^(报名列表|报名名单)$/.test(b.textContent.trim()));
        if(existing){existing.textContent=label;existing.dataset.dbAction=action;existing.dataset.dbId=id;existing.onclick=ev=>{ev.preventDefault();ev.stopPropagation();runAction(action,id);};return;}
      }
      const btn = doc.createElement('button');
      btn.type = 'button'; btn.className = 'btn btn-outline btn-sm';
      btn.dataset.dbAction = action; btn.dataset.dbId = id; btn.textContent = label;
      btn.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); runAction(action, id); });
      cell.appendChild(btn);
    });
  }
  function runAction(action, id) {
    if (action === 'activity-signups') activitySignups(id);
    else if (action === 'member-timeline') memberDetail(id);
    else if (action === 'coupon-records') couponDetail(id);
    else if (action === 'order-history') orderDetail(id);
    else if (action === 'checkin-evidence') checkinDetail(id);
  }
  function openRecord(page, row) {
    const id = row && row.dataset ? row.dataset.uxId : null;
    if (!id) return false;
    if (page === 'order') { orderDetail(id); return true; }
    if (page === 'member') { memberDetail(id); return true; }
    return false;
  }
  function handleAction(button, ctx) {
    const page = ctx && ctx.page;
    const row = ctx && ctx.row;
    const text = String((ctx && ctx.text) || (button && button.textContent) || '').trim();
    const id = row && row.dataset ? row.dataset.uxId : null;
    if (!id) return false;
    if (page === 'activity' && /报名名单|报名列表|报名/.test(text)) { activitySignups(id); return true; }
    if ((page === 'merchant' || page === 'checkin') && /核销记录|到店核销|核销/.test(text)) { checkinRecords(id, page); return true; }
    if (page === 'coupon' && /领取记录|使用记录|券记录|领取|使用/.test(text)) { couponDetail(id); return true; }
    if (page === 'member' && /事件时间线|关联订单|会员事件|时间线/.test(text)) { memberDetail(id); return true; }
    if (page === 'order' && /操作历史|订单详情|历史/.test(text)) { orderDetail(id); return true; }
    return false;
  }

  ensureDemo();
  const mod = { renderPage, bindPage, openRecord, handleAction };
  try { E.register(mod, true); } catch (e) { console.error('[admin_demo_business] register failed', e); }
  W.AdminDemoBusiness = Object.freeze({ orderDetail, memberDetail, activitySignups, couponDetail, checkinDetail, signupCSV, reviewCSV, orderHistoryCSV, couponCSV, anomalyCSV, eventCSV, summaryCSV });
})();
