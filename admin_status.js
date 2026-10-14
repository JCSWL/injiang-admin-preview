/* State controls describe existing fields; commits remain in PrototypeUI memory. */
(() => {
  'use strict';
  const publish=['上架','下架'],enabled=['启用','停用'];
  const policies={
    merchant:{states:['上架','下架','冻结'],mode:'manage'},
    guide:{states:publish,mode:'confirm'},guide_routes:{states:publish,mode:'direct'},
    activity:{states:publish,mode:'confirm'},
    shop:{states:publish,mode:'direct'},shop_specs:{states:publish,mode:'direct'},
    destination:{states:publish,mode:'direct'},ranking:{states:publish,mode:'direct'},
    content:{states:publish,mode:'direct'},coupon:{states:enabled,mode:'direct'},
    notify:{states:enabled,mode:'direct'},city:{states:enabled,mode:'confirm'},
    account:{states:enabled,mode:'confirm'},member:{states:['正常','封禁'],mode:'reason'}
  };
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const basePage=key=>({guide_routes:'guide',shop_specs:'shop'})[key]||key;
  function allowed(key){return ROLE!=='boss' && ROLE_MENU[ROLE]?.includes(basePage(key));}
  function next(key,current){const p=policies[key];return p?.states.length===2?p.states.find(s=>s!==current):null;}
  function action(key,target,current){
    if(key==='member')return target==='封禁'?'封禁':'解封';
    if(key==='merchant' && current==='冻结' && target!=='冻结')return '解除冻结';
    return target;
  }
  function render(key,values={}) {
    const current=values['状态']||'';const p=policies[key];
    if(!p || !p.states.includes(current) || !allowed(key))return statusChip(current||'未设置');
    if(p.mode==='direct') {
      const active=current===p.states[0],target=next(key,current);
      return `<button type="button" class="ux-state-toggle" data-ux-state="${esc(key)}" role="switch" aria-checked="${active}" aria-label="${esc(current+'，点击'+target)}" title="${esc('点击'+target)}"><span class="ux-state-track" aria-hidden="true"></span><span>${esc(current)}</span></button>`;
    }
    return `<button type="button" class="ux-state-action" data-ux-state="${esc(key)}" aria-label="${esc('当前'+current+'，调整状态')}" aria-haspopup="dialog"><span>${esc(current)}</span><span class="ux-state-arrow" aria-hidden="true">⌄</span></button>`;
  }
  function validate(key,data,target,extra={}) {
    const p=policies[key];
    if(!allowed(key))return '当前角色无权调整状态';
    if(!p || !p.states.includes(target))return '这不是可手动切换的资料状态';
    if(!p.states.includes(data['状态']))return '当前处于业务流程状态，不能直接上下架';
    if(target==='上架' && key==='merchant') {
      const discount=Number(data['会员卡折扣']);
      if(!Number.isFinite(discount)||discount<0.1||discount>1)return '请先完善会员卡折扣，再上架商户';
    }
    if(target==='上架' && key==='guide') {
      if(data['实名审核'] && data['实名审核']!=='已通过')return '请先完成实名材料审核，再上架向导';
      if(data['实名审核']!=='已通过' && !data['实名材料'])return '实名材料缺失，无法上架';
    }
    if(target==='上架' && key==='activity' && /用户自发/.test(data['类型']||'')) {
      if(data['审核状态']!=='已通过')return '请先完成用户自发活动审核，再上架';
    }
    if(target==='上架' && key==='guide_routes' && extra.parentStatus==='下架')return '所属向导已下架，请先上架向导';
    return window.AdminExtensions?.validateStatus(key,data,target,extra)||'';
  }
  function explanation(key,target,current) {
    if(key==='member')return target==='封禁'?'封禁后，该会员无法领会员卡、报名或评论。请填写原因，操作将记录到日志。':'请填写解封原因，操作将记录到日志。';
    if(key==='merchant')return target==='冻结'?'冻结后，商户在关联展示中隐藏，资料保留。请填写冻结原因。':target==='下架'?'下架后，商户在关联展示中隐藏，资料保留。':current==='冻结'?'解除冻结并调整为所选状态，资料保留。':'请确认商户资料和会员卡折扣已完善。';
    if(key==='guide')return target==='下架'?'向导下架后，关联路线同步下架，进行中订单不受影响。':'请确认实名材料审核已完成。';
    if(key==='activity')return '这里只调整活动上下架，不在此操作取消报名或退款。';
    if(key==='city')return '城市开关涉及使用范围和关联配置，请确认后操作；不会删除已有资料。';
    if(key==='account')return target==='停用'?'停用后，该账号无法登录后台。':'启用后，该账号按已有角色与授权范围使用后台。';
    return '';
  }
  const needsReason=(key,target)=>key==='member'||(key==='merchant'&&target==='冻结');
  window.AdminStatus=Object.freeze({policies,allowed,next,action,render,validate,explanation,needsReason,basePage});
})();
