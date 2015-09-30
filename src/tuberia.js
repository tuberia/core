import Document from './tuberia-document';
import { forcePromise } from './promise-utils';

let pipelineCount = 0;
let handleList = function handleList(docs, ctx, mods) {
  if (!mods || !mods.length) {
    return Promise.resolve();
  }
  let mod = mods.shift();
  if (ctx.debug) {
    console.log('About to execute module:', mod.constructor.name);
  }
  let modPromise = forcePromise(mod.execute.bind(mod), docs, ctx);
  let modlen = mods.length;
  while (modlen) {
    modPromise = modPromise.then(function (res) {
      if (!ctx.abort) {
        let lmod = mods.shift();
        if (ctx.debug) {
          console.log('About to execute module:', lmod.constructor.name);
        }
        return forcePromise(lmod.execute.bind(lmod), res, ctx);
      }
      return res;
    });
    modlen--;
  }
  return modPromise;
};

class Pipeline {

  constructor(name, modules) {
    this.name = name || 'pipeline ' + (++pipelineCount);
    this.modules = modules || [];
    this.running = false;
  }

  execute(docs, ctx) {
    let mods = this.modules;
    if (ctx.debug) {
      console.log('Starting', this.name, 'pipeline...');
    }
    return handleList(docs, ctx, mods).then(r => {
      if (ctx.debug) {
        console.log('Pipeline "' + this.name + '" ran with', this.modules.length, 'modules', ctx.debug ? ' in debug mode' : '');
      }
      return r;
    });
  }

  run(ctx, opts = {}) {
    if (this.running) {
      return;
    }
    this.running = true;
    let docs = opts.docs || [new Document()];
    let context = ctx || {};
    if (opts.debug) {
      context.debug = true;
    }
    this.context = context;
    return this.execute(docs, context).then(res => {
      this.running = false;
      return res;
    });
  }
}

export function pipeline(...args) {
  let name;
  if (args.length && typeof args[0] === 'string') {
    name = args.shift();
  }
  return new Pipeline(name, args);
}
