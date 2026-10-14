/* List presentation only. Hidden columns remain available to details/search. */
(() => {
  'use strict';
  const layouts = {
    merchant:['商户','类目','商圈','状态'],
    guide:['向导','主体类型','擅长区域','实名审核','状态'],
    activity:['活动','类型','报名进度','开始时间','状态'],
    shop:['商品','类目','价格','库存','状态'],
    destination:['目的地','主题','关联城市','状态'],
    ranking:['榜单','主题','关联城市','上次更新','状态'],
    content:['标题','分类','发布时间','状态'],
    checkin:['会员','商户','打卡时间','评价确认','异常标记'],
    order:['订单号','关联对象','金额','履约','售后'],
    promo:['批次名','渠道','生成量','累计扫码','注册数'],
    coupon:['券','规则','有效期','状态'],
    member:['会员','等级','来源渠道','标签','状态'],
    notify:['模板名','触发时机','状态'],
    city:['城市','商圈','状态'],
    account:['账号','姓名','角色','授权城市','状态']
  };
  const titleNames = {merchant:'商户',guide:'向导',activity:'活动',shop:'商品',destination:'目的地',ranking:'榜单',content:'标题',coupon:'券',member:'会员',notify:'模板名',city:'城市',account:'账号',promo:'批次名',order:'订单号',checkin:'会员'};
  const direct = {
    merchant:['编辑','核销记录','更多'],guide:['编辑','路线','更多'],
    activity:['编辑','报名列表','更多'],shop:['编辑','规格','更多'],
    destination:['编辑','更多'],ranking:['编辑','更多'],content:['编辑','更多'],
    coupon:['编辑','更多'],notify:['编辑','更多'],city:['编辑','更多'],
    account:['编辑','更多'],member:['运营维护'],
    checkin:['详情'],order:['详情'],promo:['明细']
  };
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function width(label,title,actionWidth) {
    if(!label)return 34;
    if(label==='操作')return actionWidth || 240;
    if(label===title)return title==='订单号'?164:205;
    if(/时间|上次更新/.test(label))return 140;
    if(label==='商圈')return 130;
    if(label==='关联对象')return 230;
    if(label==='规则')return 166;
    if(label==='有效期')return 146;
    if(label==='主体类型'||label==='触发时机')return 130;
    if(label==='异常标记'||label==='标签')return 126;
    if(label==='来源渠道')return 125;
    if(label==='状态')return 112;
    if(label==='实名审核'||label==='评价确认')return 88;
    return 90;
  }
  function apply(page,root=document.getElementById('page')) {
    root.querySelectorAll('table.tbl').forEach((table,ti)=> {
      const heads=[...table.querySelectorAll('thead tr:first-child th')];
      if(!heads.length)return;
      const labels=heads.map(h=>h.textContent.trim());
      const rows=[...table.querySelectorAll('tbody tr')];
      const hasActions=rows.some(r=>r.querySelector('td.row-acts'));
      // A permission matrix or summary is not a resource list.
      const selection=hasActions && (ti===0 ? layouts[page] : null);
      let actionWidth=hasActions?108:0;
      const buttons=direct[page];
      if(buttons && hasActions) {
        actionWidth=24+buttons.reduce((n,s)=>n+Math.max(44,s.length*12+16),0)+(buttons.length-1)*4;
        rows.forEach(row=> {
          const cell=row.querySelector('td.row-acts');if(!cell)return;
          const holder=document.createElement('div');holder.className='ux-row-controls';
          buttons.forEach(label=> {
            const b=document.createElement('button');b.className='btn btn-ghost';b.textContent=label;
            if(label==='更多'){b.setAttribute('aria-haspopup','menu');b.setAttribute('aria-label','更多操作');}
            holder.append(b);
          });
          cell.replaceChildren(holder);
        });
      }
      const title=titleNames[page];
      const titleIndex=labels.indexOf(title);
      const idIndex=labels.indexOf('ID');
      const colgroup=document.createElement('colgroup');
      let totalWidth=0;
      heads.forEach((head,index)=> {
        const label=labels[index];
        const isAction=hasActions && label==='操作' && index===heads.length-1;
        const roleHidden=head.style.display==='none';
        const hide=roleHidden || !!(selection && label && !selection.includes(label) && !isAction);
        head.hidden=hide;
        const right=head.classList.contains('text-r') || rows.some(r=>r.cells[index]?.classList.contains('text-r'));
        const align=!label?'ux-align-center':right?'ux-align-right':'ux-align-left';
        head.classList.remove('ux-align-left','ux-align-right','ux-align-center');head.classList.add(align);
        if(isAction)head.classList.add('ux-actions-col');
        if(index===titleIndex)head.classList.add('ux-title-col');
        rows.forEach(row=> {
          const cell=row.cells[index];if(!cell)return;
          if(label && !isAction && cell.dataset.listValue===undefined)cell.dataset.listValue=cell.innerText.trim();
          cell.hidden=hide;
          if(selection && label==='状态' && window.AdminStatus)cell.innerHTML=AdminStatus.render(page,{...window.PrototypeUI.rowData(row),...(row.uxValues||{})});
          cell.classList.remove('ux-align-left','ux-align-right','ux-align-center');cell.classList.add(align);
          if(isAction)cell.classList.add('ux-actions-col');
          if(index===titleIndex)cell.classList.add('ux-title-col');
        });
        if(!hide) {
          const w=width(label,title,actionWidth);totalWidth+=w;
          const col=document.createElement('col');col.style.width=`${w}px`;colgroup.append(col);
        }
      });
      if(selection && titleIndex>=0)rows.forEach(row=> {
        const cell=row.cells[titleIndex];if(!cell)return;
        let existing=cell.querySelector('.ux-row-title');
        if(!existing && ['coupon','notify','city','account'].includes(page)) {
          existing=document.createElement('button');existing.className='ux-row-title';
          existing.textContent=(cell.dataset.listValue||cell.textContent).split('\n')[0];
          existing.onclick=()=>window.PrototypeUI.editor(page,row,false,'资料详情',true);
        }
        const main=document.createElement('div');main.className='ux-cell-main';
        if(existing)main.append(existing);
        else main.textContent=cell.dataset.listValue || cell.textContent;
        const sub=document.createElement('div');sub.className='ux-cell-sub';
        const id=idIndex>=0 ? row.cells[idIndex]?.dataset.listValue : '';
        if(id)sub.textContent=id;
        else if(page==='order')sub.textContent=row.cells[labels.indexOf('买家')]?.dataset.listValue || '';
        else if(page==='checkin')sub.textContent=row.cells[labels.indexOf('核销 ID')]?.dataset.listValue || '';
        const content=document.createElement('div');content.className='ux-cell-content';content.append(main);
        if(sub.textContent)content.append(sub);
        cell.replaceChildren(content);
      });
      table.querySelector('colgroup')?.remove();table.prepend(colgroup);
      table.classList.add('ux-list');table.style.setProperty('--list-min-width',`${totalWidth}px`);
      const scroller=table.parentElement;
      if(scroller.classList.contains('tbl-scroll')) {
        scroller.tabIndex=0;scroller.setAttribute('role','region');
        const name=MENU.flatMap(g=>g.items).find(it=>it.id===page)?.n||'数据';
        scroller.setAttribute('aria-label',`${name}列表`);
      }
    });
  }
  function extraHTML(row,fields,aliases={}) {
    if(!row?.closest('table'))return '';
    const data=window.PrototypeUI.rowData(row);
    const covered=new Set(fields.flatMap(f=>[f.label,...(aliases[f.label]||[])]));
    const hidden=[...row.closest('table').querySelectorAll('thead tr:first-child th')]
      .filter(h=>h.hidden && h.textContent.trim() && !covered.has(h.textContent.trim()))
      .map(h=>h.textContent.trim());
    if(!hidden.length)return '';
    return `<section class="ux-form-section"><h3>其他信息</h3><div class="fg">${hidden.map(k=>`<div><div class="text-mut text-xs">${esc(k)}</div><div class="prototype-value">${esc(data[k]||'—')}</div></div>`).join('')}</div></section>`;
  }
  window.AdminLists=Object.freeze({apply,extraHTML,layouts});
})();
