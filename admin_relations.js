/*
 * AdminRelations — 本地关联选择控件，无请求、无存储、无演示记录生成。
 * 主脚本接入：
 *   capture(pageId, [{id, values: 中文列值}]); // 幂等增量采集，不以表格计数推断关系
 *   fieldHTML(key, field, value, index) ?? 原字段HTML;
 *   bind(editorRoot, () => editorState); // state: {key, values, fields?, readOnly?}
 *   const values = {...普通字段值, ...collect(editorRoot)};
 *   register(page, stableId, values);    // 创建/保存已有资料；或 commit('page:id', values)
 *   hasReferences(page, stableId);      // 删除前检查；remove 被引用时返回 false
 *
 * ID 是 page:原始ID；多选 hidden 值为 JSON 数组，单选为 ID 字符串。
 * commit 是已保存关系的唯一账本，collect/浏览/取消均不会提交关系。
 * register/rename 会同时提交传入的关联字段；capture 只采集明确 ID 关系。
 * capture 增量 upsert，不将分页缺席视为删除；删除必须显式 remove。
 * reset 清除本模块会话状态并重新索引当前 DATA；不修改 DATA/ADMIN_SCHEMA。
 * 城市只来自 capture/register(city)，路线只来自 capture/register(guide_routes)。
 * 渠道、分类、商圈为已有资料的索引视图，不复制成新的业务记录。
 */
(() => {
  'use strict';
  const W = window;
  const doc = W.document;
  const records = new Map();
  const removed = new Map();
  const saved = new Map();
  const bindings = new Set();
  const bound = new WeakMap();
  let initialized = false;
  let serial = 0;
  let popup = null;
  let refreshing = false;

  const names = Object.freeze({
    merchant: '商户管理', guide: '向导管理', guide_routes: '向导管理 · 路线资料',
    activity: '活动与旅行团', shop: '商品管理', member: '会员管理',
    destination: '目的地管理', ranking: '玩法榜单', content: '攻略图文',
    city: '多城市管理', zone: '多城市管理 · 商圈列表',
    promo: '场景推广码 · 已有批次', promo_channel: '场景推广码 · 渠道类型',
    content_category: '攻略图文 · 分类配置', shop_category: '商品管理 · 类目配置',
    coupon: '优惠券管理', account: '账号管理'
  });
  const aliases = Object.freeze({
    merchants: 'merchant', guides: 'guide', activities: 'activity', products: 'shop',
    members: 'member', promos: 'promo', promo_batch: 'promo', cities: 'city',
    destinations: 'destination', rankings: 'ranking'
  });
  const pageOf = page => aliases[String(page)] || String(page || '');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[ch]);
  const text = value => typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
  const first = (values, keys) => {
    for (const k of keys) if (values?.[k] !== undefined && values[k] !== '') return values[k];
    return '';
  };
  const cleanName = value => text(value).split(/\r?\n/)[0].replace(/^[\s\uFE0F\u200B]+/, '').trim();
  const unique = list => [...new Set(list)];
  const array = value => Array.isArray(value) ? value : [];
  const schemaFields = key => {
    const schema = W.ADMIN_SCHEMA || {};
    let groups = schema[key]?.groups;
    if (!groups && /^home_[0-3](?:_[0-3])?$/.test(key)) groups = [schema.home?.groups?.[Number(key.split('_')[1])]];
    if (!groups && key === 'promo_batch') groups = [schema.promo?.groups?.[2]];
    return (groups || []).flatMap(g => g?.fields || []);
  };
  const idFor = (page, id) => {
    page = pageOf(page);
    const raw = text(id);
    if (!page || !raw) return '';
    return raw.startsWith(page + ':') ? raw : `${page}:${raw}`;
  };
  const canonical = value => {
    const raw = text(value);
    const colon = raw.indexOf(':');
    if (colon < 1) return '';
    const page = pageOf(raw.slice(0, colon));
    return Object.hasOwn(names, page) && raw.slice(colon + 1) ? `${page}:${raw.slice(colon + 1)}` : '';
  };
  const readJSON = value => {
    if (typeof value !== 'string') return value;
    if (/^\s*[\["]/.test(value)) {
      try { return JSON.parse(value); } catch (_) { /* 旧值不是 JSON 时仅按名称匹配 */ }
    }
    return value;
  };
  const emptyToken = value => !text(value) || /^(?:[-—–]|全部|槽位保留|暂无|未提供|\d+(?:\s*(?:家|条|个|项))?)$/.test(text(value));

  function recordName(page, values) {
    const keys = {
      merchant: ['商户名', '商户', 'name'], guide: ['姓名', '向导', 'name'],
      guide_routes: ['路线名', '路线名称'], activity: ['活动名', '活动名称', '活动', 'name'],
      shop: ['商品名', '商品名称', '商品', 'name'], member: ['昵称', '会员', '昵称 / 头像 / 手机号', 'nick'],
      destination: ['目的地名', '目的地名称', '目的地'], ranking: ['榜单名', '榜单'],
      city: ['城市名', '城市名称', '城市'], promo: ['批次名', '批次名称', 'batch'],
      promo_channel: ['渠道类型名', '渠道类型', '渠道'], coupon: ['券名', '券'],
      content: ['标题'], account: ['账号名', '账号']
    };
    return cleanName(first(values, keys[page] || ['名称', 'name']));
  }

  function put(page, id, values, source) {
    page = pageOf(page);
    id = idFor(page, id);
    if (!id || !values || typeof values !== 'object' || Array.isArray(values)) return null;
    const previous = records.get(id);
    const merged = {...(previous?.values || {}), ...values};
    // 路线计数/所属线路区域不是一条路线资料，必须有明确路线名。
    if (page === 'guide_routes' && !recordName(page, merged)) return null;
    const item = {id, page, values: merged, source: source || previous?.source || names[page] || page};
    records.set(id, item);
    removed.delete(id);
    return item;
  }

  function bootstrap() {
    if (initialized) return;
    // DATA 在页面是顶层 const，并不一定挂在 window 上。
    let data;
    try { data = typeof DATA !== 'undefined' ? DATA : W.DATA; } catch (_) { data = W.DATA; }
    if (!data) return;
    initialized = true;
    const sets = {merchant: 'merchants', guide: 'guides', activity: 'activities', shop: 'products', member: 'members', promo: 'promos'};
    for (const [page, key] of Object.entries(sets)) {
      for (const row of array(data[key] || data[page])) {
        if (row?.id !== undefined) put(page, row.id, row, `DATA.${key}`);
      }
    }
    // 故意不读取 guides.tours/region，也不把 activities 的名称当作路线。
  }

  function statusOf(item) {
    const value = first(item?.values, ['状态', 'status']);
    if (value === false) return '停用';
    if (value === true) return '启用';
    return text(value);
  }
  function unavailable(item) {
    if (!item) return '来源已删除或尚未采集';
    if (item.parent) {
      const parent = records.get(item.parent);
      if (!parent) return '来源城市已删除';
      const reason = unavailable(parent);
      if (reason) return `所属城市不可用：${reason}`;
    }
    const state = statusOf(item);
    if (/停用|下架|冻结|封禁|禁用|关闭|待审|拒绝|驳回|已删除|未启用|未上架/.test(state)) return state;
    if (item.page === 'city' && !['启用', '已启用', '开启'].includes(state)) return '城市尚未确认启用';
    if (item.page === 'activity' && /用户自发/.test(text(first(item.values, ['类型', 'type'])))) {
      const audit = text(first(item.values, ['审核状态', 'auditStatus']));
      if (!['已通过', '通过', '审核通过'].includes(audit) && !['已通过', '审核通过'].includes(state)) return '用户自发活动尚未审核通过';
    }
    return '';
  }

  function enumRecord(page, value, source, extra = {}) {
    return {id: `${page}:${encodeURIComponent(value)}`, page, values: {'名称': value}, source, derived: true, ...extra};
  }
  function optionsFor(key, label) {
    return unique(array(schemaFields(key).find(f => f.label === label)?.options).map(text).filter(Boolean));
  }
  function zoneNames(value) {
    value = readJSON(value);
    const list = Array.isArray(value) ? value : text(value).split(/\r?\n|、|，|,|；|;|\s*·\s*/);
    return unique(list.map(v => typeof v === 'object' && v ? cleanName(first(v, ['商圈名', '名称', 'name'])) : cleanName(v)).filter(v => !emptyToken(v)));
  }

  // 返回来源索引的实时视图；枚举复用 schema 和已采集资料，不造业务行。
  function catalog() {
    bootstrap();
    const result = new Map(records);
    const add = item => { if (!removed.has(item.id) && !result.has(item.id)) result.set(item.id, item); };
    for (const [key, field, page] of [['content', '分类', 'content_category'], ['shop', '类目', 'shop_category']]) {
      for (const value of optionsFor(key, field)) add(enumRecord(page, value, `ADMIN_SCHEMA.${key} · ${field}`));
    }
    const managedChannels = new Map();
    for (const item of records.values()) if (item.page === 'promo_channel') managedChannels.set(recordName(item.page, item.values), item);
    for (const item of records.values()) {
      if (item.page === 'city') {
        for (const zone of zoneNames(first(item.values, ['商圈列表', '商圈']))) {
          add({id: `zone:${encodeURIComponent(item.id)}:${encodeURIComponent(zone)}`, page: 'zone',
            values: {'名称': zone}, source: `${names.city} · ${recordName('city', item.values)} · 商圈列表`, parent: item.id, derived: true});
        }
      }
      if (item.page === 'promo') {
        const value = cleanName(first(item.values, ['渠道类型', '渠道', 'channel']));
        if (value && !canonical(value) && !managedChannels.has(value)) {
          add(enumRecord('promo_channel', value, `${names.promo} · ${recordName('promo', item.values) || item.id}`, {origin: item.id}));
        }
      }
      if (item.page === 'content' || item.page === 'shop') {
        const page = item.page === 'content' ? 'content_category' : 'shop_category';
        const value = cleanName(first(item.values, item.page === 'content' ? ['分类'] : ['类目', 'cat']));
        if (value && !canonical(value)) add(enumRecord(page, value, `${names[item.page]} · 已有${item.page === 'content' ? '分类' : '类目'}`));
      }
    }
    return result;
  }
  function label(id) {
    const item = catalog().get(String(id)) || removed.get(String(id));
    return item ? (item.derived ? text(item.values['名称']) : recordName(item.page, item.values)) || String(id) : String(id ?? '');
  }

  function relation(key, field, values = {}, initial = false) {
    const name = typeof field === 'string' ? field : field?.label;
    const multi = /多选|列表|数组/.test(typeof field === 'object' ? field.type || '' : '');
    const spec = (pages, multiple = false, extra = {}) => ({pages, multiple, ordered: false, ...extra});
    if (['关联商户', '挂载商户', '沿途商户挂载'].includes(name)) return spec(['merchant'], true);
    if (name === '挂载向导路线') return spec(['guide_routes'], true);
    if (key==='guide' && ['作品','作品引用'].includes(name))return spec(['guide_routes','content'],true,{ordered:true});
    if (/^home_/.test(key) && name==='向导名片')return spec(['guide'],true,{ordered:true});
    if (/^home_/.test(key) && name==='推荐路线')return spec(['guide_routes'],true,{ordered:true});
    if (name === '挂载活动') return spec(['activity'], true);
    if (name === '挂载商品') return spec(['shop'], true);
    if (name === '关联优惠券') return spec(['coupon'], false, {newcomer: true});
    if (name === '关联向导') return spec(['guide']);
    if (name === '关联合作方') return spec(['guide'], false, {partner: true});
    if (name === '用户自发活动发起人') return spec(['member']);
    if (['服务城市', '授权城市'].includes(name)) return spec(['city'], true);
    if (['关联城市', '天气默认城市'].includes(name)) return spec(['city']);
    if (['商圈', '关联商圈'].includes(name)) return spec(['zone']);
    if (name === '关联城市/商圈') return spec(['city', 'zone'], multi);
    if (name === '渠道类型') return spec(['promo_channel']);
    if (name === '分类' && key === 'content') return spec(['content_category']);
    if (name === '指定对象' && key === 'coupon') {
      const scope = text(values['适用范围']);
      if (scope === '指定商品') return spec(['shop'], true);
      if (scope === '指定活动') return spec(['activity'], true);
      if (scope === '指定类目') return spec(['shop_category'], true);
      if (initial) return spec(['shop', 'activity', 'shop_category'], true);
      return spec([], true, {message: scope.startsWith('全部') ? '当前适用范围覆盖全部对象，无需指定。' : '请先选择适用范围，再选择已有对象。'});
    }
    if (name === '上榜项') {
      if (key === 'ranking') return spec(['merchant', 'guide_routes', 'activity', 'destination','content'], true, {ordered: true});
      if (/^home(?:_|$)/.test(key)) {
        const matched = key.match(/^home_[23]_([0-3])$/);
        const titles = ['只有新疆才有', '本地人带你玩', '和大家一起玩', '把新疆味道带回家'];
        const index = matched ? Number(matched[1]) : titles.indexOf(text(values['板块名']));
        const pages = [['destination', 'merchant', 'guide_routes', 'activity','content'], ['guide_routes'], ['activity'], ['shop']][index];
        return spec(pages || [], true, {ordered: true, board: index, message: pages ? '' : '请从具体首页板块进入配置，不能混选不同板块对象。'});
      }
    }
    return null;
  }

  function baseAllowed(item, spec) {
    if (!item || !spec?.pages.includes(item.page)) return false;
    if (spec.partner && text(first(item.values, ['主体类型', 'type'])) !== '外部合作旅行团') return false;
    if (spec.newcomer && text(first(item.values, ['券类型', '类型'])) !== '新人券') return false;
    if (spec.board === 0 && item.page !== 'destination') {
      // 首页只能复用真实榜单条目，榜单表上的“8 项”不是条目。
      return [...saved.entries()].some(([owner, selection]) => owner.startsWith('ranking:') && selection.fields['上榜项']?.includes(item.id) && !unavailable(records.get(owner)));
    }
    return true;
  }
  function options(spec, values) {
    const all = catalog();
    const citySpec = {pages: ['city'], multiple: false};
    const chosenCity = normalize(values?.['关联城市'], citySpec).ids[0];
    return [...all.values()].filter(item => baseAllowed(item, spec) && !(item.page === 'zone' && chosenCity && item.parent !== chosenCity));
  }

  function normalize(value, spec, strict = false) {
    const all = catalog();
    const candidates = [...all.values()].filter(item => spec.pages.includes(item.page));
    let list = readJSON(value);
    list = Array.isArray(list) ? list : [list];
    const ids = [], unresolved = [];
    function accept(raw) {
      raw = text(raw);
      if (!raw) return;
      const explicit = canonical(raw);
      if (explicit && spec.pages.includes(explicit.split(':')[0])) { ids.push(explicit); return; }
      if (strict) return;
      // 首先整体匹配，避免含“、”的真实名称被拆散；同名记录不猜。
      const matches = candidates.filter(item => item.id === raw || item.id.slice(item.id.indexOf(':') + 1) === raw || (item.derived ? text(item.values['名称']) : recordName(item.page, item.values)) === raw);
      if (matches.length === 1) { ids.push(matches[0].id); return; }
      if (emptyToken(raw)) return;
      const pieces = spec.multiple ? raw.split(/\r?\n|、|，|,|；|;/).map(text).filter(Boolean) : [raw];
      if (pieces.length > 1) pieces.forEach(accept);
      else unresolved.push(raw);
    }
    list.forEach(v => { if (typeof v === 'string' || typeof v === 'number') accept(v); });
    return {ids: unique(ids).slice(0, spec.multiple ? Infinity : 1), unresolved: unique(unresolved)};
  }

  function relationFields(key, values) {
    const fields = new Map(schemaFields(key).map(f => [f.label, f]));
    for (const name of Object.keys(values || {})) if (!fields.has(name)) fields.set(name, {label: name});
    return [...fields.values()].filter(f => relation(key, f, values));
  }
  function saveSelection(ownerId, values, merge = false, strict = true, keyOverride) {
    const owner = canonical(ownerId) || text(ownerId);
    if (!owner) return false;
    const key = keyOverride || owner.split(':')[0];
    const fields = merge ? {...(saved.get(owner)?.fields || {})} : {};
    for (const field of relationFields(key, values)) {
      if (!Object.hasOwn(values, field.label)) continue;
      const spec = relation(key, field, values, true);
      const selected = normalize(values[field.label], spec, strict).ids;
      // 采集计数或不明确的表格文本不覆盖已经提交过的选择。
      if (merge && strict && !selected.length && !Array.isArray(readJSON(values[field.label])) && values[field.label] !== '') continue;
      fields[field.label] = selected;
    }
    if(['content','guide_routes'].includes(key)){
      for(const label of ['行程节点','精华景点亮点']){
        if(!Object.hasOwn(values,label))continue;
        const items=readJSON(values[label]);
        fields[label+'/目的地']=unique((Array.isArray(items)?items:[]).map(x=>x?.['关联目的地']).filter(id=>typeof id==='string'&&id.startsWith('destination:')&&catalog().has(id)));
      }
    }
    saved.set(owner, {key, fields});
    return true;
  }
  function commit(ownerId, values) {
    bootstrap();
    const ok = saveSelection(ownerId, values || {}, false, true);
    refresh();
    return ok;
  }
  function capture(pageId, tableRows) {
    bootstrap();
    const page = pageOf(pageId);
    const found = [];
    for (const row of array(tableRows)) {
      if (!row || row.id === undefined || row.id === null) continue;
      const item = put(page, row.id, row.values, names[page] || page);
      if (item) found.push(item);
    }
    for (const item of found) saveSelection(item.id, item.values, true, true, page);
    refresh();
    return found.map(item => item.id);
  }
  function register(page, id, values) {
    bootstrap();
    page = pageOf(page);
    const item = put(page, id, values, names[page] || page);
    if (!item) return null;
    saveSelection(item.id, values, true, true, page);
    refresh();
    return item.id;
  }
  function rename(page, id, values) {
    bootstrap();
    const key = idFor(page, id);
    if (!records.has(key)) return false;
    return register(page, id, values);
  }
  function hasReferences(page, id) {
    const target = idFor(page, id);
    const all = catalog();
    for (const selection of saved.values()) {
      for (const ids of Object.values(selection.fields)) {
        if (ids.includes(target)) return true;
        // 城市商圈/批次衍生选项仍引用原来的源资料。
        if (ids.some(chosen => all.get(chosen)?.parent === target || all.get(chosen)?.origin === target)) return true;
      }
    }
    return false;
  }
  function remove(page, id) {
    bootstrap();
    const target = idFor(page, id);
    if (!target || hasReferences(page, id)) return false;
    const item = catalog().get(target);
    if (!item) return false;
    removed.set(target, item);
    records.delete(target);
    saved.delete(target);
    refresh();
    return true;
  }

  function hint(spec) {
    if (spec.message) return spec.message;
    const sources = unique(spec.pages.map(p => names[p] || p)).join(' / ');
    const extra = spec.pages.includes('guide_routes') ? '路线仅取明确的路线资料；不使用路线计数或活动名称代替。' : '';
    const city = spec.pages.some(p => p === 'city' || p === 'zone') ? '城市及商圈须先采集多城市管理资料，仅启用城市可新选。' : '';
    const ranked = spec.board === 0 ? '仅可选目的地或已保存的玩法榜单真实条目；统计数量不是条目。' : '';
    return `来源：${sources}。仅引用已有资料，不复制。${extra}${city}${ranked}`;
  }
  function serialize(ids, multiple) { return multiple ? JSON.stringify(ids) : ids[0] || ''; }
  function fieldHTML(key, field, value, index) {
    const spec = relation(key, field, {}, true);
    if (!spec) return null;
    const normalized = normalize(value, spec);
    const id = `admin-rel-${++serial}`;
    const locked = !!field.readonly;
    return `<div class="fg full ar-field" data-rel-key="${esc(key)}" data-rel-name="${esc(field.label)}" data-rel-type="${esc(field.type || '')}" data-rel-locked="${locked ? '1' : '0'}" data-rel-unresolved="${esc(JSON.stringify(normalized.unresolved))}">
      <label id="${id}-label" for="${id}-add">${esc(field.label)}${field.required ? '<span class="req">*</span>' : ''}${locked ? ' <small>只读</small>' : ''}</label>
      <input type="hidden" data-rel-label="${esc(field.label)}" data-field-index="${esc(index)}" data-rel-multiple="${spec.multiple ? '1' : '0'}" value="${esc(serialize(normalized.ids, spec.multiple))}">
      <div class="ar-selection" role="group" aria-labelledby="${id}-label"><div class="ar-chips">${chipsHTML(normalized.ids, spec, locked)}</div>
        <button type="button" id="${id}-add" class="ar-add" data-rel-add aria-haspopup="dialog" aria-expanded="false"${locked ? ' disabled' : ''}>${spec.multiple ? '＋ 添加关联' : '选择关联'}</button>
      </div><div class="ar-hint">${esc(hint(spec))}</div>
      ${field.hint ? `<div class="hint">${esc(field.hint)}</div>` : ''}<div class="ar-message" role="status" aria-live="polite"></div>
    </div>`;
  }
  function chipsHTML(ids, spec, locked) {
    if (!ids.length) return '<span class="ar-empty-selection">尚未选择</span>';
    const all = catalog();
    return ids.map((id, i) => {
      const item = all.get(id);
      const reason = unavailable(item);
      const title = label(id);
      return `<span class="ar-chip${reason ? ' ar-stale' : ''}" data-rel-chip="${esc(id)}">
        <span>${spec.ordered ? `${i + 1}. ` : ''}${esc(title)}</span>${reason ? `<small title="${esc(reason)}">${esc(reason)} · 已选可保留</small>` : ''}
        <button type="button" data-rel-view="${esc(id)}" aria-label="${esc(`查看来源：${title}`)}">查看来源</button>
        ${spec.ordered && !locked ? `<button type="button" data-rel-move="${esc(id)}" data-rel-step="-1" aria-label="${esc(`上移：${title}`)}"${i === 0 ? ' disabled' : ''}>↑</button><button type="button" data-rel-move="${esc(id)}" data-rel-step="1" aria-label="${esc(`下移：${title}`)}"${i === ids.length - 1 ? ' disabled' : ''}>↓</button>` : ''}
        ${locked ? '' : `<button type="button" data-rel-remove="${esc(id)}" aria-label="${esc(`移除：${title}`)}">×</button>`}</span>`;
    }).join('');
  }

  function inputs(root) { return [...root.querySelectorAll('input[data-rel-label]')]; }
  function readInput(input) {
    const value = readJSON(input.value);
    const ids = Array.isArray(value) ? value : [value];
    return unique(ids.map(canonical).filter(Boolean));
  }
  function stateFor(binding) {
    const state = binding.getState?.() || {};
    const values = {...(state.values || {})};
    const fields = state.fields || schemaFields(state.key || '');
    for (const input of binding.root.querySelectorAll('[data-field-index]')) {
      const field = fields[Number(input.dataset.fieldIndex)];
      if (!field || input.type === 'file') continue;
      values[field.label] = input.hasAttribute('data-rel-label') ? (input.dataset.relMultiple === '1' ? readInput(input) : readInput(input)[0] || '') : input.value;
    }
    for (const input of inputs(binding.root)) values[input.dataset.relLabel] = input.dataset.relMultiple === '1' ? readInput(input) : readInput(input)[0] || '';
    return {...state, values};
  }
  function contextFor(box, binding) {
    const state = stateFor(binding);
    const field = {label: box.dataset.relName, type: box.dataset.relType};
    const key = box.dataset.relKey;
    // 宿主可能先插入表单再赋 editor 状态；不能以旧状态清掉新表单的选择。
    const ready = state.key === key;
    return {state, key, ready, spec: relation(key, field, ready ? state.values : {}, !ready), locked: box.dataset.relLocked === '1' || (ready && !!state.readOnly)};
  }
  function announce(box, message) {
    const node = box.querySelector('.ar-message');
    if (node) node.textContent = message;
  }
  function changeValue(box, ids, spec, notify = true) {
    const input = box.querySelector('input[data-rel-label]');
    const next = serialize(unique(ids), spec.multiple);
    input.dataset.relMultiple = spec.multiple ? '1' : '0';
    if (input.value === next) return;
    input.value = next;
    if (notify) {
      input.dispatchEvent(new W.Event('input', {bubbles: true}));
      input.dispatchEvent(new W.Event('change', {bubbles: true}));
    }
  }
  function renderBox(box, binding, enforce = false) {
    const {spec, state, locked, ready} = contextFor(box, binding);
    if (!spec) return;
    const input = box.querySelector('input[data-rel-label]');
    let ids = readInput(input);
    const unresolved = array(readJSON(box.dataset.relUnresolved));
    if (unresolved.length) {
      const recovered = normalize(unresolved, spec);
      ids = unique([...ids, ...recovered.ids]).slice(0, spec.multiple ? Infinity : 1);
      box.dataset.relUnresolved = JSON.stringify(recovered.unresolved);
      if (recovered.unresolved.length) announce(box, '原值未能唯一匹配已有资料，未转为关联。请从来源中选择；数量不代表明细。');
      else announce(box, '已匹配来源资料。');
    }
    if (enforce && ready && !locked) {
      // 只在切换适用范围/城市时剔除跨类型或跨城市项；停用的已选对象保留。
      const all = catalog();
      const city = normalize(state.values['关联城市'], {pages: ['city'], multiple: false}).ids[0];
      const valid = ids.filter(id => spec.pages.includes(id.split(':')[0]) && !(id.startsWith('zone:') && city && all.get(id)?.parent && all.get(id).parent !== city));
      if (valid.length !== ids.length) announce(box, '已清除不属于当前范围的关联，请重新选择。');
      ids = valid;
    }
    changeValue(box, ids, spec, false);
    box.querySelector('.ar-chips').innerHTML = chipsHTML(ids, spec, locked);
    box.querySelector('.ar-hint').textContent = hint(spec);
    const add = box.querySelector('[data-rel-add]');
    add.disabled = locked || !spec.pages.length;
    add.textContent = spec.multiple ? '＋ 添加关联' : ids.length ? '更换关联' : '选择关联';
  }
  function refresh() {
    if (refreshing) return;
    refreshing = true;
    try {
      for (const binding of bindings) {
        if (binding.root.isConnected === false) { binding.dispose(); continue; }
        for (const box of binding.root.querySelectorAll('.ar-field')) renderBox(box, binding);
      }
      if (popup) {
        if (!popup.anchor.isConnected) closePopup(false);
        else if (popup.mode === 'choose') renderOptions();
        else renderSource();
      }
    } finally { refreshing = false; }
  }
  function collect(root) {
    if (!root?.querySelectorAll) return {};
    const binding = bound.get(root);
    if (binding) for (const box of root.querySelectorAll('.ar-field')) renderBox(box, binding, true);
    return Object.fromEntries(inputs(root).map(input => [input.dataset.relLabel, input.dataset.relMultiple === '1' ? readInput(input) : readInput(input)[0] || '']));
  }

  function ensureStyle() {
    if (!doc || doc.getElementById('admin-rel-style')) return;
    const style = doc.createElement('style');
    style.id = 'admin-rel-style';
    style.textContent = `
      .ar-field{min-width:0}.ar-selection{display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap;padding:10px;border:1px solid #d9d5cd;border-radius:9px;background:#fff}
      .ar-chips{display:flex;flex-wrap:wrap;gap:6px;max-width:100%}.ar-chip{display:inline-flex;align-items:center;flex-wrap:wrap;gap:5px;padding:5px 7px;border-radius:7px;background:#f1eee8;border:1px solid #ded9cf;max-width:100%;overflow-wrap:anywhere;font-size:12px}
      .ar-chip small{font-size:11px}.ar-chip.ar-stale{background:#fff4e5;color:#82520d;border-color:#e7c99a}.ar-chip button,.ar-add,.ar-pop button{font:inherit;cursor:pointer}.ar-chip button{border:0;background:transparent;color:inherit;padding:3px;text-decoration:underline}
      .ar-add{border:1px solid #c3b7a6;background:#fff;border-radius:6px;padding:7px 10px;color:#604830;white-space:nowrap;font-size:12px}.ar-field button:disabled,.ar-pop button:disabled{cursor:not-allowed;opacity:.55}
      .ar-hint,.ar-message,.ar-empty-selection{font-size:12px;line-height:1.6;color:#726a60}.ar-hint{margin-top:6px}.ar-message{color:#865816}.ar-empty-selection{padding:5px}
      .ar-pop{position:fixed;z-index:400;box-sizing:border-box;display:flex;flex-direction:column;gap:8px;padding:12px;border:1px solid #cfc6b9;border-radius:10px;background:#fff;color:#302a24;box-shadow:0 12px 38px #302a2433;font:13px/1.5 system-ui,sans-serif;overflow:auto;isolation:isolate}
      .ar-pop *{box-sizing:border-box}.ar-pop-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.ar-pop-close{background:transparent;border:1px solid #ddd3c5;border-radius:5px;padding:3px 8px}.ar-search{width:100%;border:1px solid #cfc6b9;border-radius:6px;padding:8px;font:inherit}.ar-options{overflow:auto;min-height:0;max-height:280px;display:flex;flex-direction:column;gap:4px}.ar-option{display:flex;flex-direction:column;align-items:flex-start;text-align:left;width:100%;padding:8px;border:1px solid transparent;background:#f8f6f2;border-radius:6px;overflow-wrap:anywhere;color:inherit;flex-shrink:0}.ar-option:hover:not(:disabled){border-color:#ab8050}.ar-option small,.ar-pop-note{color:#74685a;font-size:11px}.ar-pop-note{white-space:pre-wrap;overflow-wrap:anywhere}.ar-pop .ar-source-body{white-space:pre-wrap;overflow-wrap:anywhere;margin:0;font:inherit}.ar-pop button:focus-visible,.ar-field button:focus-visible,.ar-search:focus-visible{outline:2px solid #8e6236;outline-offset:2px}.ar-pop-empty{padding:12px 4px;color:#74685a}
    `;
    (doc.head || doc.documentElement).append(style);
  }
  function closePopup(restore = true) {
    if (!popup) return;
    const old = popup;
    popup = null;
    old.node.remove();
    old.anchor.setAttribute('aria-expanded', 'false');
    old.anchor.removeAttribute('aria-controls');
    doc.removeEventListener('pointerdown', old.outside, true);
    doc.removeEventListener('focusin', old.focusOutside, true);
    doc.removeEventListener('keydown', old.keyboard, true);
    W.removeEventListener('resize', positionPopup);
    W.removeEventListener('scroll', positionPopup, true);
    W.visualViewport?.removeEventListener('resize', positionPopup);
    W.visualViewport?.removeEventListener('scroll', positionPopup);
    if (restore && old.anchor.isConnected) old.anchor.focus();
  }
  function positionPopup() {
    if (!popup) return;
    if (!popup.anchor.isConnected || !popup.anchor.getClientRects().length) { closePopup(false); return; }
    const node = popup.node;
    const rect = popup.anchor.getBoundingClientRect();
    const viewport = W.visualViewport;
    const width = viewport?.width || W.innerWidth || doc.documentElement.clientWidth;
    const height = viewport?.height || W.innerHeight || doc.documentElement.clientHeight;
    const x = viewport?.offsetLeft || 0, y = viewport?.offsetTop || 0;
    const margin = Math.min(8, width / 8, height / 8);
    node.style.width = `${Math.min(380, Math.max(0, width - margin * 2))}px`;
    node.style.maxHeight = `${Math.min(440, Math.max(0, height - margin * 2))}px`;
    const size = node.getBoundingClientRect();
    const left = Math.max(x + margin, Math.min(rect.left, x + width - size.width - margin));
    const below = rect.bottom + 6;
    const above = rect.top - size.height - 6;
    const top = below + size.height <= y + height - margin ? below : above >= y + margin ? above : Math.max(y + margin, Math.min(below, y + height - size.height - margin));
    node.style.left = `${left}px`;
    node.style.top = `${top}px`;
  }
  function popupKey(event) {
    if (!popup) return;
    if (event.key === 'Escape') {
      event.preventDefault(); event.stopImmediatePropagation(); closePopup(); return;
    }
    const node = popup.node;
    if (!node.contains(event.target)) return;
    // 浮层挂到 body，隔离宿主抽屉的 focus-trap；原生按钮 Enter/Space 保留。
    event.stopPropagation();
    if (event.key === 'Tab') {
      const items = [...node.querySelectorAll('button:not(:disabled),input:not(:disabled)')];
      const at = items.indexOf(doc.activeElement);
      const next = event.shiftKey ? (at <= 0 ? items.length - 1 : at - 1) : (at + 1) % items.length;
      event.preventDefault(); items[next]?.focus();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) && popup.mode === 'choose') {
      if (event.target === popup.search && !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
      const items = [...node.querySelectorAll('[data-rel-option]:not(:disabled)')];
      const at = items.indexOf(doc.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : event.key === 'ArrowDown' ? (at + 1) % items.length : (at < 0 ? items.length - 1 : (at - 1 + items.length) % items.length);
      event.preventDefault(); items[next]?.focus();
    }
  }
  function openPopup(anchor, box, binding, mode, id) {
    if (popup?.anchor === anchor) { closePopup(); return; }
    closePopup(false);
    ensureStyle();
    const node = doc.createElement('div');
    node.className = 'ar-pop'; node.id = `admin-rel-pop-${++serial}`;
    node.setAttribute('role', 'dialog'); node.setAttribute('aria-modal', 'false');
    node.setAttribute('aria-label', mode === 'choose' ? `选择${box.dataset.relName}` : '关联来源');
    node.innerHTML = `<div class="ar-pop-head"><strong>${mode === 'choose' ? esc(`选择${box.dataset.relName}`) : '查看来源'}</strong><button type="button" class="ar-pop-close" data-rel-close aria-label="关闭关联浮层">关闭</button></div>${mode === 'choose' ? '<input class="ar-search" type="search" aria-label="搜索已有资料" placeholder="搜索名称 / ID / 来源"><div class="ar-options"></div><div class="ar-pop-note" role="status" aria-live="polite"></div>' : '<div class="ar-source-body"></div>'}`;
    const outside = e => { if (popup && !node.contains(e.target) && !anchor.contains(e.target)) closePopup(false); };
    const focusOutside = e => { if (popup && !node.contains(e.target) && !anchor.contains(e.target)) closePopup(false); };
    popup = {node, anchor, box, binding, mode, id, outside, focusOutside, keyboard: popupKey, search: node.querySelector('.ar-search')};
    doc.body.append(node);
    anchor.setAttribute('aria-expanded', 'true'); anchor.setAttribute('aria-controls', node.id);
    node.addEventListener('click', e => {
      const button = e.target.closest('button');
      if (!button) return;
      e.stopPropagation();
      if (button.hasAttribute('data-rel-close')) closePopup();
      else if (button.hasAttribute('data-rel-option')) choose(button.dataset.relOption);
    });
    if (mode === 'choose') {
      popup.search.addEventListener('input', renderOptions);
      renderOptions();
    } else renderSource();
    doc.addEventListener('pointerdown', outside, true);
    doc.addEventListener('focusin', focusOutside, true);
    doc.addEventListener('keydown', popupKey, true);
    W.addEventListener('resize', positionPopup);
    W.addEventListener('scroll', positionPopup, true);
    W.visualViewport?.addEventListener('resize', positionPopup);
    W.visualViewport?.addEventListener('scroll', positionPopup);
    positionPopup();
    (popup?.search || node.querySelector('[data-rel-close]'))?.focus();
  }
  function renderOptions() {
    if (!popup || popup.mode !== 'choose') return;
    const {node, box, binding, search} = popup;
    const {spec, state, locked} = contextFor(box, binding);
    if (!spec || locked) { closePopup(); return; }
    const ids = readInput(box.querySelector('input[data-rel-label]'));
    const query = search.value.trim().toLocaleLowerCase();
    const list = options(spec, state.values).filter(item => `${label(item.id)} ${item.id} ${item.source}`.toLocaleLowerCase().includes(query));
    const focused = doc.activeElement?.dataset?.relOption;
    node.querySelector('.ar-options').innerHTML = list.map(item => {
      const chosen = ids.includes(item.id);
      const reason = unavailable(item);
      return `<button type="button" class="ar-option" data-rel-option="${esc(item.id)}"${reason || chosen ? ' disabled' : ''}><span>${chosen ? '✓ ' : ''}${esc(label(item.id))}</span><small>${esc(names[item.page] || item.page)} · ${esc(item.id)}</small><small>${esc(chosen ? `已选择${reason ? ` · ${reason}，可保留或移除` : ''}` : reason ? `${reason}：不可新选；现有已选可保留` : item.source)}</small></button>`;
    }).join('') || `<div class="ar-pop-empty">${query ? '没有匹配的已有资料。' : '暂无可关联资料。'}<br>${esc(hint(spec))}<br>请先到来源模块维护资料并采集；此处不提供自由输入。</div>`;
    node.querySelector('.ar-pop-note').textContent = `${list.length} 条来源 · 已选 ${ids.length} 项。${spec.ordered ? '添加顺序即排名，可用已选项的上移/下移调整。' : ''}${spec.multiple ? '可连续选择；Escape 关闭。' : '选择后自动收起。'}`;
    if (focused) [...node.querySelectorAll('[data-rel-option]')].find(b => b.dataset.relOption === focused && !b.disabled)?.focus();
    positionPopup();
  }
  function renderSource() {
    if (!popup || popup.mode !== 'source') return;
    const item = catalog().get(popup.id);
    const reason = unavailable(item);
    const lines = [`名称：${label(popup.id)}`, `稳定 ID：${popup.id}`];
    if (item) {
      lines.push(`来源模块：${names[item.page] || item.page}`, `来源：${item.source}`, `状态：${reason || statusOf(item) || '来源未提供状态'}`);
      if (item.parent) lines.push(`所属城市：${label(item.parent)}`);
      if (item.page === 'promo_channel' && item.origin) lines.push('复用已有批次中的渠道类型；不从示例字段新增渠道。');
      lines.push('这是源资料的引用，不复制资料，也不会关闭当前编辑器。');
    } else lines.push('来源已删除或尚未采集。既有 ID 保留；不能作为新选项。');
    popup.node.querySelector('.ar-source-body').textContent = lines.join('\n');
    positionPopup();
  }
  function choose(id) {
    if (!popup) return;
    const {box, binding, search} = popup;
    const {spec, state, locked} = contextFor(box, binding);
    const item = options(spec, state.values).find(candidate => candidate.id === id);
    if (locked || !item || unavailable(item)) { renderOptions(); return; }
    const ids = readInput(box.querySelector('input[data-rel-label]'));
    if (ids.includes(id)) return;
    changeValue(box, spec.multiple ? [...ids, id] : [id], spec);
    box.dataset.relUnresolved = '[]';
    renderBox(box, binding);
    announce(box, `已选择：${label(id)}。保存表单后生效。`);
    if (spec.multiple) { renderOptions(); search.focus(); }
    else closePopup();
  }

  function bind(root, getState) {
    if (!root?.querySelectorAll) return () => {};
    ensureStyle();
    if (bound.has(root)) bound.get(root).dispose();
    for (const previous of bindings) if (previous.root.isConnected === false) previous.dispose();
    const binding = {root, getState: typeof getState === 'function' ? getState : () => ({})};
    const click = e => {
      const button = e.target.closest?.('button');
      const box = button?.closest('.ar-field');
      if (!box || !root.contains(box)) return;
      if (!['data-rel-add', 'data-rel-remove', 'data-rel-view', 'data-rel-move'].some(attr => button.hasAttribute(attr))) return;
      e.preventDefault(); e.stopPropagation();
      const {spec, locked} = contextFor(box, binding);
      if (!spec) return;
      if (button.hasAttribute('data-rel-view')) { openPopup(button, box, binding, 'source', button.dataset.relView); return; }
      if (locked || button.disabled) return;
      if (button.hasAttribute('data-rel-add')) { openPopup(button, box, binding, 'choose'); return; }
      const ids = readInput(box.querySelector('input[data-rel-label]'));
      if (button.hasAttribute('data-rel-remove')) {
        changeValue(box, ids.filter(id => id !== button.dataset.relRemove), spec);
        announce(box, '已移除当前选择；保存表单后生效，不删除来源资料。');
      } else {
        const at = ids.indexOf(button.dataset.relMove), to = at + Number(button.dataset.relStep);
        if (at < 0 || to < 0 || to >= ids.length) return;
        [ids[at], ids[to]] = [ids[to], ids[at]];
        changeValue(box, ids, spec);
        announce(box, '已调整关联顺序。');
      }
      renderBox(box, binding);
      box.querySelector('[data-rel-add]')?.focus();
      if (popup?.mode === 'choose') renderOptions();
    };
    const change = e => {
      if (!e.target.matches?.('[data-field-index]')) return;
      const state = stateFor(binding);
      const field = (state.fields || schemaFields(state.key || ''))[Number(e.target.dataset.fieldIndex)];
      const enforce = ['适用范围', '关联城市'].includes(field?.label);
      for (const box of root.querySelectorAll('.ar-field')) renderBox(box, binding, enforce);
      if (popup?.binding === binding && popup.mode === 'choose') renderOptions();
    };
    root.addEventListener('click', click);
    root.addEventListener('change', change);
    binding.dispose = () => {
      root.removeEventListener('click', click);
      root.removeEventListener('change', change);
      if (popup?.binding === binding) closePopup(false);
      bindings.delete(binding);
      if (bound.get(root) === binding) bound.delete(root);
    };
    bound.set(root, binding); bindings.add(binding);
    for (const box of root.querySelectorAll('.ar-field')) renderBox(box, binding, true);
    return binding.dispose;
  }
  function reset() {
    closePopup(false);
    records.clear(); removed.clear(); saved.clear(); initialized = false;
    bootstrap();
    for (const binding of bindings) {
      for (const box of binding.root.querySelectorAll('.ar-field')) {
        const input = box.querySelector('input[data-rel-label]');
        input.value = input.dataset.relMultiple === '1' ? '[]' : '';
        box.dataset.relUnresolved = '[]';
        announce(box, '关联会话已重置。');
      }
    }
    refresh();
  }

  W.AdminRelations = Object.freeze({capture, fieldHTML, bind, collect, hasReferences, label, register, remove, rename, reset, commit});
})();
