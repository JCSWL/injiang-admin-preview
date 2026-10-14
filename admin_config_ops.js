/* 首页配置、一期边界与公开知识库导出。仅使用公共桥；不联网、不写持久存储。 */
(() => {
  'use strict';
  const W = window;
  const S = W.ADMIN_SCHEMA;
  if (!S || !W.AdminExtensions) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
  const fields = key => S[key]?.groups?.flatMap(g => g.fields || []) || [];
  const clone = value => JSON.parse(JSON.stringify(value));
  const targets = ['热门玩法', '本地美食', '目的地', '同游', 'in向导'];
  const boards = ['只有新疆才有', '本地人带你玩', '和大家一起玩', '把新疆味道带回家'];
  const feeAA = 'AA协商（平台不代收）';
  const canUseService = () => typeof ROLE !== 'undefined' &&
    ['ops', 'admin'].includes(ROLE) &&
    (typeof ROLE_MENU === 'undefined' || ROLE_MENU[ROLE]?.includes('service'));

  // 独立配置沿用 core 的 home/home_N_M/config 草稿身份，不另建存储。
  const quickGroup = S.home?.groups?.[2];
  if (quickGroup) {
    quickGroup.title = '快捷入口字段（5 个图标）';
    const target = quickGroup.fields.find(f => f.label === '跳转目标');
    if (target) Object.assign(target, {options: targets.slice(), hint: targets.join(' / ')});
    const sort = quickGroup.fields.find(f => f.label === '排序');
    if (sort) sort.hint = '1-5 的整数；数字越小越靠前';
    for (let i = 0; i < 5; i++) {
      const key = `home_2_${i}`;
      if (!S[key]) S[key] = {groups: [clone(quickGroup)]};
    }
  }
  const boardGroup = S.home?.groups?.[3];
  if (boardGroup) {
    for (let i = 0; i < 4; i++) {
      const key = `home_3_${i}`;
      if (!S[key]) S[key] = {groups: [clone(boardGroup)]};
    }
    const local = S.home_3_1.groups[0];
    // 此板块不再把名片与售卖路线塞进同一字段；关联选择由 AdminRelations 接管。
    if (!local.fields.some(f => f.label === '向导名片')) {
      const at = local.fields.findIndex(f => f.label === '上榜项');
      const refs = ['向导名片', '推荐路线'].map(label => ({
        label, type: '多选', required: false, readonly: false,
        hint: label === '向导名片' ? '多选已上架向导名片，与推荐路线分别维护' : '多选已上架向导路线；不等同于向导名片'
      }));
      if (at >= 0) local.fields.splice(at, 1, ...refs);
      else local.fields.push(...refs);
    }
    const firstPool = fields('home_3_0').find(f => f.label === '上榜项');
    if (firstPool) firstPool.hint = '选择已上架公开资料，可包含公开攻略；关联ID保存，不接收私人草稿';
  }
  const goods = fields('shop');
  if (goods.length && !goods.some(f => f.label === '配送要求')) {
    const group = S.shop.groups.find(g => g.fields.some(f => f.label === '状态')) || S.shop.groups[0];
    group.fields.splice(Math.max(0, group.fields.findIndex(f => f.label === '状态')), 0, {
      label: '配送要求', type: '下拉', required: false, readonly: false,
      options: ['常温配送', '需冷链'],
      hint: '未提供时留空，不根据商品类目推断。明确需冷链的商品一期不可上架。'
    });
  }
  const paidField = fields('activity').find(f => f.label === '是否付费');
  if (paidField) {
    paidField.options = [...new Set([...(paidField.options || []), feeAA])];
    paidField.hint = '付费指平台付费；用户自发起不可平台收费。AA费用由参与者协商、平台不代收，不等同于免费。';
  }

  function configRow(key, title, detail) {
    return `<div class="cfg-ops-row"><div><h3>${esc(title)}</h3><p>${esc(detail)}</p></div><button class="btn btn-outline btn-sm" data-schema-key="${key}" data-editor-title="${esc(title)}">编辑</button></div>`;
  }
  function renderPage(id) {
    if (id !== 'home') return false; // 服务配置保持 core 原有页面与草稿。
    const root = document.getElementById('page');
    if (!root) return false;
    root.innerHTML = `<div class="pg-hd"><div><h1>首页配置</h1><div class="sub">按展示区域维护；编辑后保存当前配置。</div></div></div>
      <div class="cfg-ops-layout">
        <section class="card cfg-ops-section"><div class="card-hd"><h2 class="card-t">顶部与会员横条</h2></div>
          ${configRow('home_0', '顶部主图区', '背景图、主副标题与天气配置；天气密钥不进入知识库导出。')}
          ${configRow('home_1', '会员卡横条', '横条文案、角标与跳转目标。')}</section>
        <section class="card cfg-ops-section"><div class="card-hd"><div><h2 class="card-t">5 个快捷入口</h2><p class="cfg-ops-caption">每个入口维护图标、名称、目标与排序（1–5）。支持热门玩法 / 本地美食 / 目的地 / 同游 / in向导。</p></div></div>
          ${targets.map((name, i) => configRow(`home_2_${i}`, `快捷入口 ${i + 1}`, `独立入口配置；可选择${name}等已支持页面。`)).join('')}</section>
        <section class="card cfg-ops-section"><div class="card-hd"><h2 class="card-t">四大板块内容池</h2></div>
          ${boards.map((name, i) => configRow(`home_3_${i}`, name, i === 1 ? '向导名片与推荐路线：两个独立多选引用，不混为同一种资料。' : i === 0 ? '维护标题、公开上榜项（含攻略）、全部跳转与状态。' : '维护标题、上榜项、全部跳转与状态。')).join('')}</section>
      </div>`;
    return true;
  }
  function validateStatus(key, values, target) {
    if (target !== '上架') return '';
    if (key === 'shop' && values?.['配送要求'] === '需冷链') {
      return '该商品明确需要冷链配送，一期不可上架。请保持下架；不要为上架而误填常温配送。';
    }
    if (key === 'activity' && values?.['类型'] === '用户自发起' &&
        ['付费', '平台付费', true].includes(values['是否付费'])) {
      return '用户自发起活动不允许平台付费；有费用请核实为AA协商，平台不代收，不能直接改称免费。';
    }
    return '';
  }
  function validate(state, input) {
    const values = {...state.values, ...input};
    const errors = [];
    const fail = (label, message) => errors.push({label, message});
    const key = state.key;
    if (/^home_2_[0-4]$/.test(key)) {
      const sort = values['排序'];
      if (sort === '' || sort == null || !Number.isInteger(Number(sort)) || Number(sort) < 1 || Number(sort) > 5) fail('排序', '排序须为1–5的整数。');
      if (!targets.includes(values['跳转目标'])) fail('跳转目标', '请选择已支持的热门玩法、本地美食、目的地、同游或in向导。');
      if (!String(values['名称'] || '').trim()) fail('名称', '请填写入口名称。');
    }
    if (key === 'shop') {
      const delivery = values['配送要求'];
      if (delivery && !['常温配送', '需冷链'].includes(delivery)) fail('配送要求', '请选择常温配送或需冷链；未确认可以留空。');
      const message = validateStatus(key, values, values['状态']);
      if (message) fail('配送要求', message);
    }
    if (key === 'activity') {
      const message = validateStatus(key, values, '上架');
      if (message) fail('是否付费', message);
    }
    return errors;
  }
  function afterEditor(state, root) {
    if (!root) return;
    if (/^home_2_[0-4]$/.test(state.key)) {
      const index = state.fields.findIndex(f => f.label === '排序');
      const sort = root.querySelector(`[data-field-index="${index}"]`);
      if (sort?.tagName === 'INPUT') { sort.min = '1'; sort.max = '5'; sort.step = '1'; }
    }
  }
  // 白名单与存储 schema 解耦：新加内部字段不会自动进入导出。
  const publicFields = {
    merchant: ['商户名', '类目', '人均消费', '详细地址', '交通说明', '营业时间', '到店高峰提示', '会员卡折扣', '招牌套餐折扣', '认证徽章', '状态'],
    guide_routes: ['路线名', '副标题标签', '时长', '接送方式', '费用怎么算', '避坑指南', '是否纯玩不进店', '门市价', '成团价', '成交价', '最低成团人数', '人数上限', '差人成团退款保障', '退改规则', '状态'],
    content: ['标题', '分类', '内容形式', '正文', '行程天数', '适合人群', '出行建议', '排序权重', '状态'],
    destination: ['目的地名', '主题类型', '副标题', '详细介绍', '详细地址', '开放时间', '购票说明', '外部购票链接', '排序权重', '状态'],
    ranking: ['榜单名', '主题类型', '更新频率', '状态']
  };
  const itineraryKeys = ['提示', '天数', '天', '日期', '标题', '描述', '内容', '时间', '地点', 'day', 'title', 'description', 'content', 'time', 'location'];
  const publicLists = {
    merchant: {'美食细分类': [], '套餐条目': ['套餐名','包含内容','门市价'], '招牌菜品列表': ['名称', '菜名', '价格', '必点', '是否必点', '标签', 'name', 'price', 'mustTry']},
    guide_routes: {'行程节点': itineraryKeys, '精华景点亮点': ['景点名', '名称', '描述', '一句描述', 'name', 'description']},
    content: {'行程节点': itineraryKeys, '行程安排': itineraryKeys},
    destination: {'入口列表':['入口名','位置说明'],'实用提示':['提示']}
  };
  const publicRelations = {
    merchant: {'商圈': ['zone'], '关联城市': ['city']},
    guide_routes: {'关联向导': ['guide'], '所属向导': ['guide'], '沿途商户挂载': ['merchant'], '关联城市': ['city']},
    content: {'关联商户': ['merchant'], '关联城市': ['city'], '关联目的地': ['destination'], '关联向导路线': ['guide_routes']},
    destination: {'关联城市': ['city'], '关联商圈': ['zone'], '挂载商户': ['merchant'], '挂载向导路线': ['guide_routes'], '挂载活动': ['activity']},
    ranking: {'关联城市': ['city'], '上榜项': ['merchant', 'guide_routes', 'content', 'destination', 'activity']}
  };
  const exportTypes = Object.keys(publicFields);
  const scalar = value => typeof value === 'string' || typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value));
  function pickScalars(value, names) {
    const result = {};
    for (const name of names) if (scalar(value?.[name])) result[name] = value[name];
    return result;
  }
  function listValue(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim().startsWith('[')) {
      try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : []; } catch (_) { return []; }
    }
    return [];
  }
  function isPublic(values) {
    if (values?.['状态'] !== '上架') return false;
    if ([false, '否', '不公开', '私密'].includes(values['是否公开'])) return false;
    return !['可见性', '可见范围', '公开范围', '发布范围', '内容来源'].some(key =>
      typeof values[key] === 'string' && /私密|私人|私有|仅自己|草稿|private|draft/i.test(values[key]));
  }
  function recordID(type, id) {
    if (!['string', 'number'].includes(typeof id)) return '';
    const raw = String(id);
    if (!raw || raw.length > 256 || !/^[A-Za-z0-9_./:-]+$/.test(raw)) return '';
    return raw.startsWith(type + ':') ? raw : `${type}:${raw}`;
  }
  function relationIDs(value, types, published) {
    const list = Array.isArray(value) ? value : typeof value === 'string' && value.trim().startsWith('[') ? listValue(value) : [value];
    const ids = list.map(item => typeof item === 'string' ? item : item?.id || item?.ref).filter(id => {
      if (typeof id !== 'string' || id.length > 280 || !/^[a-z_]+:[A-Za-z0-9_%./:-]+$/.test(id)) return false;
      const type = id.split(':')[0];
      return types.includes(type) && (!exportTypes.includes(type) || published.has(id));
    });
    return [...new Set(ids)];
  }
  function buildKnowledgeBase() {
    if (!canUseService()) throw new Error('当前账号没有知识库导出权限。');
    if (typeof W.PrototypeUI?.records !== 'function') throw new Error('共享资料接口尚未就绪，无法导出。');
    const source = {};
    const published = new Set();
    for (const type of exportTypes) {
      const rows = W.PrototypeUI.records(type);
      source[type] = (Array.isArray(rows) ? rows : []).filter(row => isPublic(row?.values)).map(row => ({
        id: recordID(type, row.id), values: row.values
      })).filter(row => row.id);
      source[type].forEach(row => published.add(row.id));
    }
    const data = {};
    for (const type of exportTypes) {
      data[type] = source[type].map(row => {
        const values = pickScalars(row.values, publicFields[type]);
        for (const [name, names] of Object.entries(publicLists[type] || {})) {
          if(name==='美食细分类'){
            const allowed=['本地小吃','烧烤','大盘鸡','拌面','甜品奶茶','夜市'];
            const selected=listValue(row.values[name]).filter(x=>allowed.includes(x));if(selected.length)values[name]=selected;continue;
          }
          const items = listValue(row.values[name]).filter(item => item && typeof item === 'object' && !Array.isArray(item))
            .map(item => {
              const picked=pickScalars(item,names);
              if(['行程节点','精华景点亮点'].includes(name)){
                const ids=relationIDs(item['关联目的地'],['destination'],published);
                if(ids.length)picked['关联目的地']=ids[0];
              }
              return picked;
            }).filter(item => Object.keys(item).length);
          if (items.length) values[name] = items;
        }
        for (const [name, types] of Object.entries(publicRelations[type] || {})) {
          const ids = relationIDs(row.values[name], types, published);
          if (ids.length) values[name] = ids;
        }
        return {id: row.id, values};
      });
    }
    return {schemaVersion: 1, exportedAt: new Date().toISOString(), data};
  }
  function exportSummary(payload) {
    return exportTypes.map(type => `${type}: ${payload.data[type].length}条`).join('；');
  }
  function logExport(action, payload) {
    if (typeof W.PrototypeUI?.recordOperation !== 'function') throw new Error('操作日志接口尚未就绪，暂不能导出。');
    W.PrototypeUI.recordOperation(action, 'knowledge-base', `${exportSummary(payload)}；仅公开白名单，无AI调用`);
  }
  function previewKnowledgeBase() {
    const ui = W.PrototypeUI;
    try {
      if (typeof ui?.dialog !== 'function' || typeof ui.recordOperation !== 'function') throw new Error('导出预览与日志接口尚未就绪。');
      const payload = buildKnowledgeBase();
      const description = exportTypes.map(type => `<div><b>${esc(type)}</b>：${esc(publicFields[type].join('、'))}${publicLists[type] ? '；结构化公开节点' : ''}；允许的关联ID</div>`).join('');
      const root = ui.dialog('公开知识库 JSON', `<div class="cfg-ops-export">
        <p>只包含商户、向导路线、公开攻略、目的地、榜单中状态为“上架”的记录。关联只导出ID，不展开个人资料；五类资料中已下架的关联会排除。</p>
        <p>排除实名材料、文件、会员、订单、密钥与内部字段。保留服务配置，不触发自动同步或真实AI调用。</p>
        <p class="cfg-ops-count" data-cfg-count>${esc(exportSummary(payload))}</p>
        <details><summary>查看公开字段白名单</summary><div class="cfg-ops-whitelist">${description}</div></details>
        <label for="cfg-ops-json">JSON 预览（只读）</label><textarea id="cfg-ops-json" class="cfg-ops-json" data-cfg-json readonly spellcheck="false" aria-label="公开知识库JSON预览"></textarea></div>`,
        '<button class="btn btn-outline" data-cfg-close>关闭</button><button class="btn btn-primary" data-cfg-download>下载 JSON</button>');
      if (!root) throw new Error('无法打开JSON预览。');
      root.querySelector('[data-cfg-json]').value = JSON.stringify(payload, null, 2);
      root.querySelector('[data-cfg-close]').onclick = () => ui.close();
      root.querySelector('[data-cfg-download]').onclick = () => {
        let url = '';
        let link;
        try {
          // 下载时重新读取共享记录，避免拿旧预览导出已下架资料。
          const current = buildKnowledgeBase();
          const json = JSON.stringify(current, null, 2);
          JSON.parse(json);
          root.querySelector('[data-cfg-json]').value = json;
          root.querySelector('[data-cfg-count]').textContent = exportSummary(current);
          url = URL.createObjectURL(new Blob([json], {type: 'application/json;charset=utf-8'}));
          link = document.createElement('a');
          link.href = url;
          link.download = `injiang-knowledge-${current.exportedAt.replace(/[:.]/g, '-')}.json`;
          link.hidden = true;
          document.body.append(link);
          link.click();
          logExport('知识库JSON下载', current);
          ui.notice('已生成本地JSON下载，请在浏览器下载列表查看。');
        } catch (error) {
          ui.notice(error.message || 'JSON下载失败，请重试。');
        } finally {
          link?.remove();
          if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
      };
      logExport('知识库JSON预览', payload);
    } catch (error) {
      ui?.notice(error.message || '无法生成知识库JSON。');
    }
  }
  function bindPage(id) {
    const root = document.getElementById('page');
    if (!root) return;
    if (id === 'service' && !root.querySelector('[data-cfg-export-info]')) {
      const existing = [...root.querySelectorAll('button')].find(button => /导出/.test(button.textContent));
      if (existing) existing.textContent = '预览并导出公开知识库 JSON';
      const html = `<section class="cfg-ops-export-info" data-cfg-export-info><h2>公开知识库导出</h2>
        <p>商户 / 向导路线 / 公开攻略 / 目的地 / 榜单。仅上架资料，字段白名单与关联ID；预览及下载都会记入操作日志。</p>
        <p>JSON仅在本地生成，不含天气密钥、实名材料、会员或订单，不向AI服务发送。</p>
        ${existing ? '' : '<button class="btn btn-outline" data-cfg-export>预览并导出 JSON</button>'}</section>`;
      root.insertAdjacentHTML('beforeend', html);
      root.querySelectorAll('[data-cfg-export]').forEach(button => { button.onclick = previewKnowledgeBase; });
    }
  }
  function handleAction(button, context) {
    const page = context?.page || W.PrototypeUI?.page;
    const text = context?.text || button?.textContent || '';
    if (page === 'service' && /导出|知识库.*预览/.test(text)) {
      previewKnowledgeBase();
      return true;
    }
    return false;
  }
  W.AdminExtensions.register({renderPage, bindPage, afterEditor, validate, validateStatus, handleAction});
  // 可测试的只读构建器；同样检查服务页角色权限，调用不会下载或记录业务动作。
  W.AdminConfigOps = Object.freeze({buildKnowledgeBase});
})();
