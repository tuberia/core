export class Document {
  static create(content, meta = {}) {
    let nd = new Document();
    nd.content = content;
    nd.meta = meta;
    return nd;
  }

  constructor() {
    this.meta = {};
    this.content = '';
  }

  addMeta(newMeta = {}, newVal = null) {
    if (typeof newMeta === 'string') {
      this.meta[newMeta] = newVal;
      return;
    }
    for (let key of Object.keys(newMeta)) {
      this.meta[key] = newMeta[key];
    }
  }

  cloneMeta(newMeta = {}) {
    let nd = new Document();
    nd.addMeta(this.meta);
    nd.addMeta(newMeta);
    return nd;
  }

  clone(content = null, newMeta = {}) {
    let nd = new Document();
    if (content == null) {
      nd.content = this.content;
    } else {
      nd.content = content;
    }
    nd.addMeta(this.meta);
    nd.addMeta(newMeta);
    return nd;
  }
}