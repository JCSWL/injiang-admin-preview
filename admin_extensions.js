/* 管理端扩展：复用现有编辑、引用和内存记录，不接外部服务。 */
(() => {
  'use strict';
  const modules=[];
  const first=(name,args,fallback)=>{
    for(const mod of modules){
      const value=mod[name]?.(...args);
      if(value!==undefined && value!==false)return value;
    }
    return fallback;
  };
  const merge=(name,args)=>Object.assign({},...modules.map(m=>m[name]?.(...args)||{}));
  window.AdminExtensions={
    register(mod,priority=false){if(!mod || modules.includes(mod))return;priority?modules.unshift(mod):modules.push(mod);},
    afterSave(...args){modules.forEach(m=>m.afterSave?.(...args));},
    recordChanged(...args){modules.forEach(m=>m.recordChanged?.(...args));},
    fieldHTML(...args){return first('fieldHTML',args,undefined);},
    afterEditor(...args){modules.forEach(m=>m.afterEditor?.(...args));},
    collect(...args){return merge('collect',args);},
    validate(...args){return modules.flatMap(m=>m.validate?.(...args)||[]);},
    validateStatus(...args){for(const m of modules){const error=m.validateStatus?.(...args);if(error)return error;}return '';},
    renderPage(...args){return first('renderPage',args,false);},
    bindPage(...args){modules.forEach(m=>m.bindPage?.(...args));},
    openRecord(...args){return first('openRecord',args,false);},
    handleAction(...args){return first('handleAction',args,false);},
    normalizeRecord(...args){return merge('normalizeRecord',args);},
    get moduleCount(){return modules.length;}
  };
})();
