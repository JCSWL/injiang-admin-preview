/* 审核与履约记录：只在本页内存登记，不付款、不退款、不发送消息。 */
(() => {
  'use strict';
  const W=window,E=W.AdminExtensions,S=W.ADMIN_SCHEMA;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const can=page=>ROLE!=='boss'&&ROLE_MENU[ROLE].includes(page);
  const pending=v=>/待审|未审核|待复核/.test(String(v||''));
  const show=v=>v==null||v===''||v==='—'?'未提供':Array.isArray(v)?v.map(x=>typeof x==='string'&&x.includes(':')?AdminRelations.label(x):JSON.stringify(x)).join('、'):typeof v==='object'?JSON.stringify(v):String(v);
  const grid=(values,keys)=>`<dl class="ux-read-grid rx-grid">${keys.map(k=>`<div><dt>${esc(k)}</dt><dd>${esc(show(values[k]))}</dd></div>`).join('')}</dl>`;
  let reviewType='activity';
  DATA.reviews=DATA.reviews||[];
  if(!S.guide.groups.flatMap(g=>g.fields).some(f=>f.label==='实名审核'))S.guide.groups.push({title:'实名审核记录',fields:[{label:'实名审核',type:'只读',readonly:true,required:false,hint:'由审核处理更新；审核通过不自动上架。'}]});
  const categories={activity:'用户约伴',guide:'向导实名',review:'评价'};
  function queue(type){
    return PrototypeUI.records(type).filter(x=>type==='activity'?/用户自发/.test(x.values['类型'])&&pending(x.values['审核状态']||x.values['状态']):type==='guide'?pending(x.values['实名审核']):!!x.values['评价内容']&&pending(x.values['审核状态']));
  }
  function reviewPage(){
    if(!can('review'))return;
    $('topbar').innerHTML=crumbHTML('审核处理')+topRight();
    const items=queue(reviewType);
    $('page').innerHTML=`<div class="pg-hd"><div><h1>审核处理</h1><div class="sub">查看提交资料、填写结论并保留记录；通过审核后再按正常流程上架。</div></div></div><div class="card"><div class="tabs rx-tabs">${Object.entries(categories).map(([k,n])=>`<button type="button" class="tab ${reviewType===k?'active':''}" data-rx-tab="${k}">${n} · ${queue(k).length}</button>`).join('')}</div>${items.length?`<div class="tbl-scroll"><table class="tbl rx-table"><thead><tr><th>审核对象</th><th>编号</th><th>当前状态</th><th>操作</th></tr></thead><tbody>${items.map(x=>`<tr><td>${esc(x.values['姓名']||x.values['活动名']||x.values['评价对象名']||'评价')}</td><td class="num">${esc(x.id)}</td><td>${statusChip(x.values['审核状态']||x.values['实名审核']||x.values['状态'])}</td><td class="row-acts"><button class="btn btn-outline" data-rx-open="${esc(x.id)}">查看资料</button></td></tr>`).join('')}</tbody></table></div>`:`<div class="empty"><h3>暂无待审${categories[reviewType]}</h3><div>只展示已提交的记录，不从提醒计数生成资料。</div></div>`}</div>`;
  }
  function bindReview(){
    $('page').querySelectorAll('[data-rx-tab]').forEach(b=>b.onclick=()=>{reviewType=b.dataset.rxTab;navigate('review');});
    $('page').querySelectorAll('[data-rx-open]').forEach(b=>b.onclick=()=>reviewDetail(reviewType,b.dataset.rxOpen));
  }
  function editSource(type,id){
    navigate(type);const row=[...$('page').querySelectorAll('tbody tr')].find(x=>x.dataset.uxId===id);
    if(row)PrototypeUI.editor(type,row,false,'完善提交资料');
  }
  function reviewDetail(type,id){
    if(!can(type)||!can('review'))return;
    const v=PrototypeUI.recordValues(type,id);if(!v)return;
    const keys=type==='guide'?['姓名','主体类型','实名材料','认证徽章','服务城市','实名审核','状态']:type==='activity'?['活动名','类型','用户自发活动发起人','关联城市','开始时间','结束时间','人数上限','最低成团人数','是否付费','成人价','退改规则','审核状态','状态']:['评价对象类型','评价对象名','评价会员','星级','评价内容','提交时间','审核状态'];
    $('page').innerHTML=`<section class="ux-screen"><header class="ux-header"><button class="btn btn-outline" id="rx-review-back">返回审核列表</button><h1>${esc(categories[type])}审核</h1></header><div class="rx-layout"><section class="card"><div class="card-hd"><h2 class="card-t">提交资料 · 只读</h2></div><div class="card-bd pd">${grid(v,keys)}${type==='activity'?'<p class="text-mut">用户约伴费用自行协商，平台不代收。原记录价格保留供核对，不代表当前允许平台收费。</p>':''}</div></section><section class="card"><div class="card-hd"><h2 class="card-t">审核结论</h2></div><div class="card-bd pd"><div class="fg"><label for="rx-review-result">审核结果</label><select id="rx-review-result" class="fld"><option value="">请选择</option><option>已通过</option><option>已驳回</option></select></div><div class="fg mt-3"><label for="rx-review-reason">审核说明</label><textarea id="rx-review-reason" class="fld" rows="4" placeholder="驳回时必须填写原因"></textarea></div><p class="text-mut mt-3">${type==='guide'?'实名材料未提供时不能通过。':'审核通过不等于立即公开上架。'}</p><div class="rx-actions mt-3"><button class="btn btn-primary" id="rx-review-save">保存审核结果</button>${type!=='review'?'<button class="btn btn-outline" id="rx-review-edit">完善资料</button>':''}</div><div id="rx-review-error" class="ux-field-error" role="alert"></div></div></section></div></section>`;
    $('rx-review-back').onclick=()=>navigate('review');$('rx-review-edit')?.addEventListener('click',()=>editSource(type,id));
    $('rx-review-save').onclick=()=>{
      const result=$('rx-review-result').value,reason=$('rx-review-reason').value.trim(),current=PrototypeUI.recordValues(type,id);
      const fail=m=>{$('rx-review-error').textContent=m;};
      if(!result)return fail('请选择审核结果');if(result==='已驳回'&&!reason)return fail('请填写驳回原因');
      if(type==='guide'&&result==='已通过'&&!current['实名材料'])return fail('实名材料未提供，请先完善资料');
      const patch=type==='guide'?{'实名审核':result,'状态':'下架'}:type==='activity'?{'审核状态':result,'状态':'下架'}:{'审核状态':result,'驳回原因':reason};
      if(!PrototypeUI.patchRecord(type,id,patch))return fail('当前资料不能提交审核结果');
      PrototypeUI.recordOperation('审核'+result,id,`${result}${reason?'；'+reason:''}`);navigate('review');PrototypeUI.notice('审核结果已保存');
    };
  }
  function normalizeRecord(page,values,id){
    if(page==='guide'&&id?.includes('demo-')&&!values['实名审核'])return {'实名审核':'待审核'};
    if(page==='order')return orderSupplement(values);
    return {};
  }
  PAGES.review=reviewPage;
  function bindPage(id){if(id==='review')bindReview();}
  // 只在三项身份都一致时复用旧商城数量/单号，不按列表顺序拼接。
  function orderSupplement(v){
    const x=(DATA.orders||[]).find(x=>x.id===v['订单号']&&x.buyer===v['买家']&&x.product===v['关联对象']);
    return v['类型']==='商城'&&x?{'数量':x.qty,'物流单号':v['物流单号']||x.logistics||''}:{};
  }
  const isAA=v=>/用户自发|约伴|AA/.test(v['类型']||'');
  const canShip=v=>v['类型']==='商城'&&v['支付']==='已付款'&&v['履约']==='待发货'&&!/申请|处理|售后/.test(v['售后']||'');
  function orderDetail(id){
    if(!can('order'))return;
    const source=PrototypeUI.recordValues('order',id);if(!source)return;
    const v={...source,...orderSupplement(source)};
    const groups=[['下单事实',['订单号','类型','下单时间','支付时间','买家','买家电话','关联对象','规格','数量','使用日期']],['金额与优惠',['订单原价','优惠券抵扣','金额','使用优惠券','支付']],['履约与收货',['履约','物流公司','物流单号','收货人','收货电话','收货信息']],['售后记录',['售后','售后类型','售后原因','售后备注','联系状态']],['订单备注',['用户备注','运营内部备注']]];
    $('page').innerHTML=`<section class="ux-screen"><header class="ux-header"><button class="btn btn-outline" id="rx-order-back">返回订单列表</button><h1>订单 ${esc(v['订单号'])}</h1></header><div class="rx-layout"><div class="rx-order-sections">${groups.map(([title,keys])=>`<section class="card"><div class="card-hd"><h2 class="card-t">${title}</h2></div><div class="card-bd pd">${grid(v,keys)}</div></section>`).join('')}</div><section class="card"><div class="card-hd"><h2 class="card-t">处理订单</h2></div><div class="card-bd pd"><p class="text-mut">订单事实只读；缺少的信息显示“未提供”，不按当前商品资料推算。</p><div class="rx-actions mt-3">${canShip(v)?'<button class="btn btn-primary" id="rx-ship">填写物流并发货</button>':''}${!isAA(v)&&v['支付']==='已付款'?'<button class="btn btn-outline" id="rx-after">客服售后登记</button>':''}${v['类型']!=='商城'?'<button class="btn btn-outline" id="rx-contact">登记联系进度</button>':''}</div><p class="rx-order-note">${isAA(v)?'用户约伴费用由参与者协商，平台不代收，也不办理平台退款。历史金额与支付记录保留供核对。':'商城发货填写物流公司和单号。售后仅登记申请与处理进度，不执行退款，也不发送通知。'}</p></div></section></div></section>`;
    $('rx-order-back').onclick=()=>navigate('order');$('rx-ship')?.addEventListener('click',()=>orderForm(id,'ship'));$('rx-after')?.addEventListener('click',()=>orderForm(id,'after'));$('rx-contact')?.addEventListener('click',()=>orderForm(id,'contact'));
  }
  function orderForm(id,mode){
    const v=PrototypeUI.recordValues('order',id);if(!v||!can('order')||(mode==='ship'&&!canShip(v))||(mode==='after'&&(isAA(v)||v['支付']!=='已付款')))return;
    const body=mode==='ship'?'<div class="fg"><label for="rx-company">物流公司</label><select id="rx-company" class="fld"><option value="">请选择</option><option>顺丰</option><option>圆通</option><option>其他</option></select></div><div class="fg mt-3"><label for="rx-number">物流单号</label><input id="rx-number" class="fld" maxlength="100"></div>':mode==='after'?`<div class="fg"><label for="rx-after-state">售后进度</label><select id="rx-after-state" class="fld"><option>申请中</option><option>处理中</option></select></div><div class="fg mt-3"><label for="rx-reason">售后原因</label><textarea id="rx-reason" class="fld" rows="3"></textarea></div><div class="fg mt-3"><label for="rx-note">处理备注</label><textarea id="rx-note" class="fld" rows="3"></textarea></div>`:'<div class="fg"><label for="rx-contact-state">联系进度</label><select id="rx-contact-state" class="fld"><option>待联系</option><option>已联系</option></select></div><p class="text-mut mt-3">仅登记联系进度，不代发微信、短信或群消息。</p>';
    const root=PrototypeUI.dialog(mode==='ship'?'确认发货':mode==='after'?'客服售后登记':'联系进度',body+'<div id="rx-form-error" class="ux-field-error mt-3" role="alert"></div>','<button class="btn btn-outline" id="rx-form-cancel">取消</button><button class="btn btn-primary" id="rx-form-save">保存</button>');
    if(mode==='after'){$('rx-after-state').value=/处理|售后中/.test(v['售后']||'')?'处理中':'申请中';$('rx-reason').value=v['售后原因']||'';$('rx-note').value=v['售后备注']||'';}
    $('rx-form-cancel').onclick=()=>PrototypeUI.close();$('rx-form-save').onclick=()=>{
      let patch,summary;const fail=m=>{$('rx-form-error').textContent=m;};
      if(mode==='ship'){const company=$('rx-company').value,number=$('rx-number').value.trim();if(!company||!number)return fail('请选择物流公司并填写物流单号');patch={'履约':'已发货','物流公司':company,'物流单号':number};summary=`待发货 → 已发货；${company} ${number}`;}
      else if(mode==='after'){const reason=$('rx-reason').value.trim();if(!reason)return fail('请填写售后原因');patch={'售后':$('rx-after-state').value,'售后原因':reason,'售后备注':$('rx-note').value.trim()};summary=`${v['售后']||'无'} → ${patch['售后']}；${reason}；未执行退款`;}
      else{patch={'联系状态':$('rx-contact-state').value};summary=patch['联系状态']+'；未发送消息';}
      if(!PrototypeUI.patchRecord('order',id,patch))return fail('当前订单状态不允许此操作');PrototypeUI.recordOperation(mode==='ship'?'订单发货':mode==='after'?'售后登记':'联系登记',id,summary);PrototypeUI.close();orderDetail(id);PrototypeUI.notice('记录已保存');
    };
  }
  function openRecord(page,row){if(page!=='order')return false;orderDetail(row.dataset.uxId);return true;}
  function validate(state,values){
    return state.key==='guide'&&state.creating&&values['状态']==='上架'?[{label:'状态',message:'请先保存为下架，提交实名审核，通过后再上架'}]:[];
  }
  E.register({bindPage,normalizeRecord,openRecord,validate});
  W.AdminRecordOps=Object.freeze({orderDetail});
})();
