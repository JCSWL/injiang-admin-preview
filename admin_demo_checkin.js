/* 到店核销 Demo: shared core facts + derived results, page memory only.
 * Load after admin_demo_shared.js / admin_demo_business.js and before initial bind.
 * summary.confirmed means INCLUDED check-ins (same definition as memberStats).
 * No scan/evaluation action, network request, persistent storage or real timer.
 */
(() => {
  'use strict';
  const W = window, doc = document;
  const U = () => W.PrototypeUI, D = () => W.AdminDemoData, H = () => W.AdminDemoUI;
  const esc = value => H().esc(value);
  const OBSERVED = '2026-04-17 18:00';
  const DEFAULTS = Object.freeze({'评价推送延迟': 3, '评价确认有效期': 24, '每人每店日限打卡次数': 1});
  const observation = '样例观察时刻：2026-04-17 18:00；仅页面内存，刷新恢复样例。不使用今天的时间判断过期。';
  let initialized = false, initializing = false;
  let filters = {keyword: '', status: '', merchant: '', start: '', end: ''};
  const pageRoot = () => doc.getElementById('page');
  const notice = text => U()?.notice(text);
  const fullId = (kind, id) => String(id || '').startsWith(kind + ':') ? String(id) : kind + ':' + String(id || '');
  function allowed() {
    const role = typeof ROLE !== 'undefined' ? ROLE : W.ROLE;
    const menus = typeof ROLE_MENU !== 'undefined' ? ROLE_MENU : W.ROLE_MENU;
    return ['ops', 'admin'].includes(role) && !!menus?.[role]?.includes('checkin');
  }
  function authorize() {
    if (allowed()) return true;
    notice('仅有到店核销权限的运营/超管可查看或处理核销明细。');
    return false;
  }
  const timestamp = value => {
    const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(String(value || ''));
    return match ? Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], +(match[6] || 0)) : NaN;
  };
  const stamp = value => Number.isFinite(value) ? new Date(value).toISOString().slice(0, 16).replace('T', ' ') : '—';
  const observedAt = timestamp(OBSERVED);
  const flagOf = values => ['', '—', '无', '正常'].includes(String(values['异常标记'] || '').trim()) ? '' : String(values['异常标记']);
  const reviewed = values => values['评价确认'] === '已确认';
  const freeze = object => {
    if (object && typeof object === 'object') { Object.values(object).forEach(freeze); Object.freeze(object); }
    return object;
  };

  function ensure() {
    if (initialized) return true;
    if (initializing || !U() || !D()?.ensure || !H()) return false;
    // Set this before D.ensure: member normalization can call memberStats while D seeds.
    initializing = true;
    try {
      D().ensure();
      // Core can normalize members during D.ensure itself. Wait until the shared
      // check-in fixtures/events exist rather than racing its remaining seeds.
      if (!D().events.some(event => event.objectId === 'checkin:C88203')) return false;
      const original = U().records('checkin');
      const members = new Map(original.map(r => [r.values['会员ID'], r.values['会员']]));
      const merchant = U().recordValues('merchant', 'merchant:M1024') || {};
      const merchantName = merchant['商户名'] || merchant['商户名称'] || merchant['商户'] || original.find(r => r.values['商户ID'] === 'merchant:M1024')?.values['商户'] || 'M1024';
      const changes = original.map(r => ({id: r.id, values: {
        '打卡凭据': 'QR-STORE-' + String(r.values['商户ID'] || '').replace(/^merchant:/, ''),
        ...(r.id === 'checkin:C88203' ? {'打卡时间': '2026-04-17 16:30'} : {})
      }}));
      const fixture = (id, mid, time, confirmed, flag, extras = {}) => ({id: 'checkin:' + id, values: {
        '核销编号': id, '会员ID': 'member:' + mid, '会员': members.get('member:' + mid) || D().memberNames?.['member:' + mid] || mid,
        '商户ID': 'merchant:M1024', '商户': merchantName, '打卡凭据': 'QR-STORE-M1024', '打卡时间': time,
        '评价确认': confirmed ? '已确认' : '待确认', '评价内容': confirmed ? '体验满意，现场服务清楚。（虚构样例）' : '',
        '评价时间': confirmed ? '2026-04-17 11:00' : '', '异常标记': flag || '—', ...extras
      }});
      const extra = [
        fixture('CEXPIRED', 'U10006', '2026-04-16 12:00', false, ''),
        fixture('CGEO', 'U10001', '2026-04-17 10:00', true, '疑似二维码被盗贴', {'GPS授权': '已授权（虚构样例）', '距门店米数': 850}),
        fixture('CBATCH', 'U10004', '2026-04-16 20:01', false, '疑似批量刷卡')
      ];
      U().seedRecords('checkin', changes.concat(extra));
      U().seedConfig('checkin_rules', {...DEFAULTS});
      extra.filter(r => flagOf(r.values)).forEach(r => {
        if (!D().anomalies.has(r.id)) D().anomalies.set(r.id, {result: '待核实', note: ''});
      });
      for (const event of D().events) {
        if (event.objectId === 'checkin:C88203' && event.type === '到店打卡') event.time = '2026-04-17 16:30';
      }
      for (const r of extra) {
        if (!D().events.some(e => e.id === 'EV-' + r.values['核销编号'])) D().events.push({
          id: 'EV-' + r.values['核销编号'], memberId: r.values['会员ID'], objectId: r.id, merchantId: r.values['商户ID'],
          type: '到店打卡', time: r.values['打卡时间'], result: reviewed(r.values) ? '已评价确认；异常待核实，暂不计入' : '待评价（核销结果按样例观察时刻及当前规则计算）'
        });
      }
      if (!D().events.some(e => e.id === 'EV-CGEO-REVIEW')) D().events.push({
        id: 'EV-CGEO-REVIEW', memberId: 'member:U10001', merchantId: 'merchant:M1024', objectId: 'checkin:CGEO',
        type: '评价确认', time: '2026-04-17 11:00', result: '用户已评价确认（事实）；异常核实结论独立，不修改评价'
      });
      initialized = true;
      return true;
    } finally { initializing = false; }
  }
  function rules() {
    const values = U().configValues('checkin_rules');
    return Object.fromEntries(Object.entries(DEFAULTS).map(([key, fallback]) => {
      const n = Number(values[key]);
      return [key, Number.isFinite(n) && n > 0 ? n : fallback];
    }));
  }
  function conclusion(row) { return flagOf(row.values) ? D().anomalies.get(row.id)?.result || '待核实' : '无需核实'; }
  function rows() {
    if (!ensure()) return [];
    const rule = rules();
    const result = U().records('checkin').map(record => {
      const values = freeze(record.values), scan = timestamp(values['打卡时间']);
      const deadline = scan + rule['评价确认有效期'] * 3600000;
      const status = reviewed(values) ? '已确认' : observedAt > deadline ? '已作废' : '待确认';
      const row = {id: record.id, values, status, included: status === '已确认', reason: '',
        reminderAt: stamp(scan + rule['评价推送延迟'] * 3600000), deadlineAt: stamp(deadline)};
      const issues = [];
      if (status === '已作废') issues.push('未评价超时：超过当前 ' + rule['评价确认有效期'] + ' 小时确认有效期');
      else if (status === '待确认') issues.push('尚未评价确认');
      if (flagOf(values) && conclusion(row) !== '已核实正常') {
        row.included = false;
        issues.push(conclusion(row) === '已确认异常' ? '已确认异常，不计入核销' : '异常待复核，暂不计入核销');
      }
      if (!Number.isFinite(scan)) { row.included = false; issues.push('扫码时间不完整，不能计入'); }
      row.reason = issues.join('；') || (flagOf(values) ? '已评价确认，异常已核实正常，计入核销' : '已评价确认，无待核实异常，计入核销');
      return row;
    });
    // Daily cap is derived, never written back to scan/evaluation facts.
    const perDay = new Map();
    [...result].sort((a, b) => timestamp(a.values['打卡时间']) - timestamp(b.values['打卡时间']) || a.id.localeCompare(b.id)).forEach(row => {
      if (!row.included) return;
      const key = [row.values['会员ID'], row.values['商户ID'], row.values['打卡时间']?.slice(0, 10)].join('|');
      const count = (perDay.get(key) || 0) + 1; perDay.set(key, count);
      if (count > rule['每人每店日限打卡次数']) { row.included = false; row.reason = '已评价确认，但超过每人每店每日 ' + rule['每人每店日限打卡次数'] + ' 次计入上限'; }
    });
    return result;
  }
  function memberStats(id) { return {confirmed: rows().filter(r => r.values['会员ID'] === fullId('member', id) && r.included).length}; }
  function summary() {
    const list = rows();
    return {total: list.length, confirmed: list.filter(r => r.included).length, pending: list.filter(r => r.status === '待确认').length,
      invalid: list.filter(r => r.status === '已作废').length, excluded: list.filter(r => !r.included).length,
      anomalyOpen: list.filter(r => flagOf(r.values) && !['已核实正常', '已确认异常'].includes(conclusion(r))).length};
  }
  const button = (action, label, extra = '') => `<button type="button" class="btn btn-outline" data-qc="${action}" ${extra}>${esc(label)}</button>`;
  const badge = (text, danger = false) => `<span class="qc-badge${danger ? ' qc-warning' : ''}">${esc(text)}</span>`;
  const option = (value, title, selected) => `<option value="${esc(value)}"${value === selected ? ' selected' : ''}>${esc(title)}</option>`;
  function ruleHTML() {
    const r = rules();
    return `<dl class="qc-rules"><div><dt>评价推送延迟</dt><dd>${esc(r['评价推送延迟'])} 小时</dd></div><div><dt>评价确认有效期</dt><dd>${esc(r['评价确认有效期'])} 小时（从扫码起）</dd></div><div><dt>每人每店日限打卡次数</dt><dd>${esc(r['每人每店日限打卡次数'])} 次</dd></div></dl>`;
  }
  function filteredRows() {
    const query = filters.keyword.trim().toLocaleLowerCase();
    return rows().filter(r => {
      const v = r.values, day = String(v['打卡时间'] || '').slice(0, 10);
      return (!query || [r.id, v['会员'], v['会员ID'], v['商户'], v['商户ID'], v['打卡凭据']].join(' ').toLocaleLowerCase().includes(query)) &&
        (!filters.status || r.status === filters.status) && (!filters.merchant || v['商户ID'] === filters.merchant) &&
        (!filters.start || day >= filters.start) && (!filters.end || day <= filters.end);
    });
  }
  function tableHTML(list) {
    if (!list.length) return '<div class="empty" data-qc="empty">没有符合条件的核销记录。</div>';
    return `<div class="tbl-scroll qc-scroll" tabindex="0" role="region" aria-label="核销记录，可横向滚动"><table class="tbl dc-table qc-table" data-qc="table"><thead><tr>${['会员', '商户', '打卡时间', '评价确认', '异常标记', '计入核销', '操作'].map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${list.map(r => `<tr data-ux-id="${esc(r.id)}" data-qc="row"><td>${esc(r.values['会员'])}<small>${esc(r.values['核销编号'] || r.id)}</small></td><td>${esc(r.values['商户'])}</td><td>${esc(r.values['打卡时间'])}</td><td>${badge(r.status, r.status === '已作废')}<small>${esc(r.values['评价时间'] || '尚未评价')}</small></td><td>${esc(flagOf(r.values) || '—')}</td><td data-qc="included" title="${esc(r.reason)}">${badge(r.included ? '计入' : '不计入', !r.included)}</td><td class="row-acts"><div class="ux-row-controls">${button('detail', '详情', `data-qc-id="${esc(r.id)}"`)}</div></td></tr>`).join('')}</tbody></table></div>`;
  }
  function statsHTML() {
    const s = summary();
    return [['total', '核销记录'], ['confirmed', '计入核销'], ['pending', '待确认'], ['invalid', '已作废'], ['excluded', '不计入'], ['anomalyOpen', '异常待核实']]
      .map(([key, label]) => `<div><dt>${label}</dt><dd data-qc="stat-${key}">${s[key]}</dd></div>`).join('');
  }
  function paintList() {
    const root = pageRoot()?.querySelector('[data-qc="list"]');
    if (!root) return;
    const list = filteredRows();
    root.innerHTML = tableHTML(list);
    const count = pageRoot().querySelector('[data-qc="count"]');
    if (count) count.textContent = `显示 ${list.length} / ${rows().length} 条；统计为全部样例。`;
    const error = pageRoot().querySelector('[data-qc="filter-error"]');
    if (error) error.textContent = filters.start && filters.end && filters.start > filters.end ? '起始日期不得晚于截止日期，请调整筛选。' : '';
    bindRows(root, null);
  }
  function renderPage(id) {
    ensure(); // Must run for every page, even dashboard/member/risk.
    if (id !== 'checkin') return false;
    const root = pageRoot();
    if (!root) return true;
    if (!allowed()) { root.innerHTML = '<div class="empty">当前角色无到店核销权限。</div>'; return true; }
    const merchants = [...new Map(rows().map(r => [r.values['商户ID'], r.values['商户']])).entries()];
    root.innerHTML = `<div class="qc-page" data-qc="page"><div class="pg-hd"><div><h1>到店核销</h1><div class="sub">店内静态二维码 + 用户事后评价确认；运营仅核实异常。</div></div>${button('rules', '核销规则配置')}</div>
      <p class="qc-note" data-qc="observation">${observation}</p>
      ${H().card('当前核销规则', '<div data-qc="rules-summary">' + ruleHTML() + '</div>')}
      ${H().card('固定异常规则（不可配置）', '<ul class="qc-explain"><li>同一用户 10 分钟内跨 ≥3 家不同商户：疑似批量刷卡。</li><li>同一商户日打卡量超过历史均值 3 倍：异常放量。</li><li>已授权 GPS 且扫码位置偏离门店 &gt;500 米：疑似二维码被盗贴；未授权不推断距离。</li></ul>')}
      <dl class="qc-stats" data-qc="stats">${statsHTML()}</dl>
      <section class="card"><div class="card-hd"><h2 class="card-t">核销记录</h2>${button('export', '导出核销记录')}</div><div class="card-bd pd">
        <div class="qc-filters"><label>关键词<input class="fld" type="search" data-qc="keyword" placeholder="会员 / 商户 / 码ID" value="${esc(filters.keyword)}"></label>
        <label>状态<select class="fld" aria-label="评价状态" data-qc="status">${option('', '全部状态', filters.status)}${['已确认', '待确认', '已作废'].map(s => option(s, s, filters.status)).join('')}</select></label>
        <label>商户<select class="fld" aria-label="商户筛选" data-qc="merchant">${option('', '全部商户', filters.merchant)}${merchants.map(([key, name]) => option(key, name, filters.merchant)).join('')}</select></label>
        <label>起始日期<input class="fld" type="date" data-qc="start" value="${esc(filters.start)}"></label><label>截止日期<input class="fld" type="date" data-qc="end" value="${esc(filters.end)}"></label>${button('reset', '重置筛选')}</div>
        <div class="ux-field-error" role="alert" data-qc="filter-error"></div><p class="qc-note" data-qc="count" role="status"></p><div data-qc="list"></div>
      </div></section></div>`;
    paintList(); bindPage(id); return true;
  }
  function goList() {
    if (!authorize()) return;
    if (typeof W.navigate === 'function') W.navigate('checkin');
    else { renderPage('checkin'); bindPage('checkin'); }
  }
  function fieldsHTML(fields) {
    return '<dl class="qc-facts">' + fields.map(([key, value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value === '' || value == null ? '—' : value)}</dd></div>`).join('') + '</dl>';
  }
  function evidenceHTML(row) {
    const v = row.values;
    if (row.id === 'checkin:CGEO') return '<p class="qc-note">虚构 GPS 授权样例：扫码位置距门店 850 米，超过固定 500 米阈值。仅展示样例，无 GPS 请求。</p>';
    if (flagOf(v).includes('批量')) {
      const group = rows().filter(r => r.values['会员ID'] === v['会员ID'] && Math.abs(timestamp(r.values['打卡时间']) - timestamp(v['打卡时间'])) <= 600000);
      return '<p>同用户可核对的扫码证据：CBATCH 20:01、C88205 20:03、C88206 20:07，三家不同商户 / 6 分钟；每条核实结论独立。</p>' + H().table(['核销ID', '商户ID / 名称', '扫码时间', '核实结论'], group.map(r => [esc(r.id), esc(r.values['商户ID'] + ' / ' + r.values['商户']), esc(r.values['打卡时间']), esc(conclusion(r))]));
    }
    return '<p class="qc-note">没有新增定位或扫码行为；异常标记与核实结论分别保留。</p>';
  }
  function detailHTML(row) {
    const v = row.values, anomaly = D().anomalies.get(row.id);
    const timeline = [
      [v['打卡时间'], '用户扫商户店内码', v['打卡凭据']],
      [row.reminderAt, '评价提醒计划（按当前规则推算）', timestamp(row.reminderAt) > observedAt ? '样例观察时刻尚未到提醒时间；未发送消息' : '样例提醒计划时间已到；不代表真实消息已发送'],
      [v['评价时间'] || '尚未评价', '用户评价事实', reviewed(v) ? '已确认；运营不能替用户确认评价' : '未评价；无运营确认入口'],
      [row.deadlineAt, '评价确认截止（扫码起算）', row.status === '已作废' ? '未评价超时，已作废' : reviewed(v) ? '已有评价事实，不改写为超时' : '尚在当前确认有效期内'],
      [OBSERVED, '当前派生结果', `${row.status} / ${row.included ? '计入' : '不计入'}：${row.reason}`]
    ];
    if (anomaly?.time) timeline.push([anomaly.time, '异常核实（独立结论）', `${anomaly.result}；${anomaly.note}`]);
    return `<div class="qc-detail" data-qc="detail-view" data-qc-id="${esc(row.id)}"><p class="qc-note">${observation}</p>
      ${H().card('核销事实 · 只读', fieldsHTML([
        ['核销ID', row.id], ['会员', v['会员']], ['用户 / 会员ID', v['会员ID']], ['商户', v['商户']], ['商户ID', v['商户ID']], ['店内二维码ID', v['打卡凭据']],
        ['扫码时间', v['打卡时间']], ['提醒时间（计划）', row.reminderAt], ['评价确认事实', v['评价确认']], ['评价时间', v['评价时间']], ['评价内容', v['评价内容']], ['确认截止时间', row.deadlineAt],
        ['异常标记', flagOf(v) || '无'], ['GPS授权', v['GPS授权'] || '未提供（不推断定位）'], ['距离', v['距门店米数'] == null ? '未提供' : v['距门店米数'] + ' 米（虚构）'],
        ['当前状态', row.status], ['核实结果', conclusion(row)], ['是否计入', row.included ? '计入' : '不计入'], ['原因', row.reason]
      ]))}
      <p class="qc-note" data-qc="points-note">20 积分说明：用户完成评价确认后的 20 积分奖励仅作规则说明；本 Demo 不调用积分或消息服务、不实际发放。异常核实不修改扫码或评价事实。</p>
      ${H().card('结果时间线', '<ol class="qc-timeline">' + timeline.map(([time, title, description]) => `<li><time>${esc(time)}</time><strong>${esc(title)}</strong><p>${esc(description)}</p></li>`).join('') + '</ol>')}
      ${H().card('异常证据与独立复核', evidenceHTML(row) + (flagOf(v) ? `
        ${fieldsHTML([['已保存核实结论', conclusion(row)], ['已保存备注', anomaly?.note], ['核实时间（样例观察时刻）', anomaly?.time]])}
        <div class="qc-review"><label>核实结果<select class="fld" aria-label="核实结果" data-qc="review-result" required>${option('', '请选择', '')}${['已核实正常', '已确认异常'].map(s => option(s, s, anomaly?.result)).join('')}</select></label>
        <label>核实备注（必填）<textarea class="fld" aria-label="核实备注" data-qc="review-note" rows="3" required>${esc(anomaly?.note || '')}</textarea></label>
        <p class="qc-note">仅保存独立核实结论；取消或返回不保存输入。核实正常且已评价才可计入。</p><div class="ux-field-error" role="alert" data-qc="review-error"></div>
        <div class="qc-actions">${button('review-cancel', '取消')}${button('review-save', '保存核实结果')}</div></div>` : '<p>本条没有异常，无需人工复核；评价事实不可编辑。</p>'))}</div>`;
  }
  function showDetail(id, merchantContext = null) {
    if (!authorize()) return false;
    const row = rows().find(r => r.id === fullId('checkin', id));
    if (!row) { notice('未找到核销记录。'); return false; }
    const back = () => merchantContext ? listForMerchant(merchantContext) : goList();
    let root;
    if (merchantContext) root = U().dialog('核销详情 · ' + row.values['核销编号'], detailHTML(row), button('back', '返回商户核销记录'));
    else {
      pageRoot().innerHTML = `<div class="qc-page"><div class="pg-hd"><h1>核销详情 · ${esc(row.values['核销编号'] || row.id)}</h1>${button('back', '返回核销列表')}</div>${detailHTML(row)}</div>`;
      root = pageRoot();
    }
    root.querySelector('[data-qc="back"]').onclick = back;
    const cancel = root.querySelector('[data-qc="review-cancel"]');
    if (cancel) cancel.onclick = back;
    const save = root.querySelector('[data-qc="review-save"]');
    if (save) save.onclick = () => {
      if (!authorize()) return;
      const result = root.querySelector('[data-qc="review-result"]').value;
      const note = root.querySelector('[data-qc="review-note"]').value.trim();
      const error = root.querySelector('[data-qc="review-error"]');
      if (!['已核实正常', '已确认异常'].includes(result)) { error.textContent = '请选择核实结果。'; return; }
      if (!note) { error.textContent = '请填写核实备注，取消不会保存。'; root.querySelector('[data-qc="review-note"]').focus(); return; }
      const current = rows().find(r => r.id === row.id);
      if (!current || !flagOf(current.values)) { error.textContent = '当前记录没有可复核异常。'; return; }
      const before = D().anomalies.get(row.id);
      D().anomalies.set(row.id, {result, note, time: OBSERVED});
      D().events.push({id: `EV-QC-REVIEW-${D().events.length + 1}`, memberId: row.values['会员ID'], merchantId: row.values['商户ID'], objectId: row.id, type: '核销异常核实', time: OBSERVED, result: `${result}；${note}（不改扫码/评价事实）`});
      U().recordOperation('异常核实', row.id, `${before?.result || '待核实'} → ${result}；${note}；样例观察时刻 ${OBSERVED}`);
      back(); notice('核实结论已保存；扫码与评价事实未变。');
    };
    return true;
  }
  function detail(id) { return showDetail(id); }
  function listForMerchant(id) {
    if (!authorize()) return false;
    const merchantId = fullId('merchant', id), list = rows().filter(r => r.values['商户ID'] === merchantId);
    const name = list[0]?.values['商户'] || merchantId;
    const root = U().dialog('商户核销记录 · ' + name,
      `<div class="qc-page" data-qc="merchant-list" data-qc-merchant="${esc(merchantId)}"><p class="qc-note">${observation}</p><p>按商户ID ${esc(merchantId)} 筛选，共 ${list.length} 条。</p>${tableHTML(list)}</div>`,
      '<button type="button" class="btn btn-outline" data-qc="merchant-close" data-prototype-close>关闭，返回商户资料</button>');
    bindRows(root, merchantId);
    return true;
  }
  function bindRows(root, merchantId) {
    root.querySelectorAll('tr[data-ux-id]').forEach(row => {
      // AdminLists rebuilds row-acts, so recover selectors and handlers at final bind.
      row.querySelectorAll('td.row-acts button').forEach(b => {
        b.dataset.qc = 'detail'; b.dataset.qcId = row.dataset.uxId;
        b.onclick = () => showDetail(row.dataset.uxId, merchantId);
      });
    });
  }
  function exportCSV() {
    if (!authorize()) return;
    const list = filteredRows();
    if (!list.length) { notice('没有匹配的核销记录，未生成 CSV；请调整筛选。'); return; }
    const headers = ['核销ID', '会员ID', '会员名称', '商户ID', '商户名称', '店内二维码ID', '扫码时间', '提醒计划时间', '确认截止时间', '评价状态', '评价时间', '当前核销状态', '异常标记', '核实结果', '核实备注', '是否计入', '原因'];
    // Quote every cell, escape embedded quotes and neutralize spreadsheet formulas.
    const cell = value => {
      let text = String(value ?? '');
      if (/^[\s\uFEFF]*[=+@-]/.test(text)) text = "'" + text;
      return '"' + text.replace(/"/g, '""') + '"';
    };
    const content = [headers, ...list.map(r => [r.id, r.values['会员ID'], r.values['会员'], r.values['商户ID'], r.values['商户'], r.values['打卡凭据'], r.values['打卡时间'], r.reminderAt, r.deadlineAt, r.values['评价确认'], r.values['评价时间'], r.status, flagOf(r.values) || '无', conclusion(r), D().anomalies.get(r.id)?.note || '', r.included ? '是' : '否', r.reason])]
      .map(line => line.map(cell).join(',')).join('\r\n');
    H().download('核销记录_筛选结果_20260417.csv', '\uFEFF' + content, 'text/csv;charset=utf-8');
    U().recordOperation('导出核销记录', 'checkin:filtered', `筛选结果 ${list.length} 条；${JSON.stringify(filters)}`);
    notice(`已下载 ${list.length} 条筛选后的核销记录。`);
  }
  function openRules() {
    if (!authorize()) return;
    ensure();
    // Only this checkin-page entry is exposed; matches seedConfig's identity.
    if (U().page !== 'checkin') goList();
    U().editor('checkin_rules', null, false, '核销规则配置');
  }
  function bindPage(id) {
    if (id !== 'checkin') return;
    const root = pageRoot();
    if (!root?.querySelector('[data-qc="page"]')) return;
    // Core normalization patches evaluation facts over derived status cells and
    // AdminLists hides the additional included column. Repaint our table at the
    // final binding stage, then bind its sole detail action using stable IDs.
    paintList();
    root.querySelectorAll('[data-qc]').forEach(node => {
      const action = node.dataset.qc;
      if (action === 'rules') node.onclick = openRules;
      if (action === 'export') node.onclick = exportCSV;
      if (action === 'reset') node.onclick = () => { filters = {keyword: '', status: '', merchant: '', start: '', end: ''}; renderPage('checkin'); };
      if (Object.hasOwn(filters, action)) {
        const refresh = () => { filters[action] = node.value; paintList(); };
        node.onchange = refresh;
        if (node.tagName === 'INPUT') node.oninput = refresh;
      }
    });
  }
  function validate(state, values) {
    if (state.key !== 'checkin_rules') return [];
    if (!allowed()) return [{label: '评价推送延迟', message: '当前角色无核销规则配置权限。'}];
    const errors = [];
    Object.keys(DEFAULTS).forEach(label => {
      const value = values[label], n = Number(value);
      if (value == null || String(value).trim() === '') errors.push({label, message: '请填写' + label});
      else if (!Number.isFinite(n) || n <= 0 || (label === '评价推送延迟' && (n < 2 || n > 4)) || (label === '每人每店日限打卡次数' && !Number.isInteger(n))) {
        errors.push({label, message: label === '评价推送延迟' ? '评价推送延迟须为 2–4 小时的数字。' : label === '每人每店日限打卡次数' ? '日限打卡次数须为正整数。' : '评价确认有效期须为正数。'});
      }
    });
    return errors;
  }
  function afterSave(state) {
    if (state.key !== 'checkin_rules') return;
    const root = pageRoot();
    const card = root?.querySelector('[data-qc="rules-summary"]');
    if (card) card.innerHTML = ruleHTML();
    const stats = root?.querySelector('[data-qc="stats"]');
    if (stats) stats.innerHTML = statsHTML();
    paintList();
  }
  function handleAction(b, context = {}) {
    const action = b?.dataset?.qc, page = context.page || U()?.page;
    if (action === 'rules') { openRules(); return true; }
    if (action === 'export') { exportCSV(); return true; }
    if (action === 'detail') { detail(b.dataset.qcId || b.closest('tr')?.dataset.uxId); return true; }
    if (page === 'merchant' && b?.textContent.trim() === '核销记录') {
      const id = context.row?.dataset?.uxId || b.closest('tr')?.dataset.uxId || U()?.currentEditor?.row?.dataset.uxId;
      if (id) { listForMerchant(id); return true; }
    }
    return false;
  }
  function openRecord(page, row) {
    if (page !== 'checkin') return false;
    detail(row?.dataset?.uxId || row?.id); return true;
  }
  W.AdminDemoCheckin = {get ready(){return initialized;}, ensure, rows, detail, listForMerchant, memberStats, summary};
  W.AdminExtensions.register({renderPage, bindPage, handleAction, validate, afterSave, openRecord}, true);
})();
