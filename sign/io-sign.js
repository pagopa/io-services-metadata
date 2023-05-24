var ct = Object.defineProperty, dt = Object.defineProperties;
var ht = Object.getOwnPropertyDescriptors;
var Ee = Object.getOwnPropertySymbols;
var ut = Object.prototype.hasOwnProperty, pt = Object.prototype.propertyIsEnumerable;
var xe = (i, e, t) => e in i ? ct(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t, S = (i, e) => {
  for (var t in e || (e = {}))
    ut.call(e, t) && xe(i, t, e[t]);
  if (Ee)
    for (var t of Ee(e))
      pt.call(e, t) && xe(i, t, e[t]);
  return i;
}, P = (i, e) => dt(i, ht(e));
var V = (i, e, t) => new Promise((s, n) => {
  var o = (l) => {
    try {
      a(t.next(l));
    } catch (c) {
      n(c);
    }
  }, r = (l) => {
    try {
      a(t.throw(l));
    } catch (c) {
      n(c);
    }
  }, a = (l) => l.done ? s(l.value) : Promise.resolve(l.value).then(o, r);
  a((t = t.apply(i, e)).next());
});
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = window, ye = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, we = Symbol(), Se = /* @__PURE__ */ new WeakMap();
let Be = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== we)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (ye && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = Se.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Se.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const vt = (i) => new Be(typeof i == "string" ? i : i + "", void 0, we), T = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((s, n, o) => s + ((r) => {
    if (r._$cssResult$ === !0)
      return r.cssText;
    if (typeof r == "number")
      return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[o + 1], i[0]);
  return new Be(t, i, we);
}, ft = (i, e) => {
  ye ? i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet) : e.forEach((t) => {
    const s = document.createElement("style"), n = W.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = t.cssText, i.appendChild(s);
  });
}, Pe = ye ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules)
    t += s.cssText;
  return vt(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var ie;
const Z = window, Oe = Z.trustedTypes, gt = Oe ? Oe.emptyScript : "", ke = Z.reactiveElementPolyfillSupport, he = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? gt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, e) {
  let t = i;
  switch (e) {
    case Boolean:
      t = i !== null;
      break;
    case Number:
      t = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(i);
      } catch (s) {
        t = null;
      }
  }
  return t;
} }, Ve = (i, e) => e !== i && (e == e || i == i), ne = { attribute: !0, type: String, converter: he, reflect: !1, hasChanged: Ve };
let O = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$El = null, this.u();
  }
  static addInitializer(e) {
    var t;
    this.finalize(), ((t = this.h) !== null && t !== void 0 ? t : this.h = []).push(e);
  }
  static get observedAttributes() {
    this.finalize();
    const e = [];
    return this.elementProperties.forEach((t, s) => {
      const n = this._$Ep(s, t);
      n !== void 0 && (this._$Ev.set(n, s), e.push(n));
    }), e;
  }
  static createProperty(e, t = ne) {
    if (t.state && (t.attribute = !1), this.finalize(), this.elementProperties.set(e, t), !t.noAccessor && !this.prototype.hasOwnProperty(e)) {
      const s = typeof e == "symbol" ? Symbol() : "__" + e, n = this.getPropertyDescriptor(e, s, t);
      n !== void 0 && Object.defineProperty(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    return { get() {
      return this[t];
    }, set(n) {
      const o = this[e];
      this[t] = n, this.requestUpdate(e, o, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) || ne;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return !1;
    this.finalized = !0;
    const e = Object.getPrototypeOf(this);
    if (e.finalize(), e.h !== void 0 && (this.h = [...e.h]), this.elementProperties = new Map(e.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const t = this.properties, s = [...Object.getOwnPropertyNames(t), ...Object.getOwnPropertySymbols(t)];
      for (const n of s)
        this.createProperty(n, t[n]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const n of s)
        t.unshift(Pe(n));
    } else
      e !== void 0 && t.push(Pe(e));
    return t;
  }
  static _$Ep(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  u() {
    var e;
    this._$E_ = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (e = this.constructor.h) === null || e === void 0 || e.forEach((t) => t(this));
  }
  addController(e) {
    var t, s;
    ((t = this._$ES) !== null && t !== void 0 ? t : this._$ES = []).push(e), this.renderRoot !== void 0 && this.isConnected && ((s = e.hostConnected) === null || s === void 0 || s.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$ES) === null || t === void 0 || t.splice(this._$ES.indexOf(e) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((e, t) => {
      this.hasOwnProperty(t) && (this._$Ei.set(t, this[t]), delete this[t]);
    });
  }
  createRenderRoot() {
    var e;
    const t = (e = this.shadowRoot) !== null && e !== void 0 ? e : this.attachShadow(this.constructor.shadowRootOptions);
    return ft(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var e;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$ES) === null || e === void 0 || e.forEach((t) => {
      var s;
      return (s = t.hostConnected) === null || s === void 0 ? void 0 : s.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$ES) === null || e === void 0 || e.forEach((t) => {
      var s;
      return (s = t.hostDisconnected) === null || s === void 0 ? void 0 : s.call(t);
    });
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$EO(e, t, s = ne) {
    var n;
    const o = this.constructor._$Ep(e, s);
    if (o !== void 0 && s.reflect === !0) {
      const r = (((n = s.converter) === null || n === void 0 ? void 0 : n.toAttribute) !== void 0 ? s.converter : he).toAttribute(t, s.type);
      this._$El = e, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$El = null;
    }
  }
  _$AK(e, t) {
    var s;
    const n = this.constructor, o = n._$Ev.get(e);
    if (o !== void 0 && this._$El !== o) {
      const r = n.getPropertyOptions(o), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : ((s = r.converter) === null || s === void 0 ? void 0 : s.fromAttribute) !== void 0 ? r.converter : he;
      this._$El = o, this[o] = a.fromAttribute(t, r.type), this._$El = null;
    }
  }
  requestUpdate(e, t, s) {
    let n = !0;
    e !== void 0 && (((s = s || this.constructor.getPropertyOptions(e)).hasChanged || Ve)(this[e], t) ? (this._$AL.has(e) || this._$AL.set(e, t), s.reflect === !0 && this._$El !== e && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(e, s))) : n = !1), !this.isUpdatePending && n && (this._$E_ = this._$Ej());
  }
  _$Ej() {
    return V(this, null, function* () {
      this.isUpdatePending = !0;
      try {
        yield this._$E_;
      } catch (t) {
        Promise.reject(t);
      }
      const e = this.scheduleUpdate();
      return e != null && (yield e), !this.isUpdatePending;
    });
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var e;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((n, o) => this[o] = n), this._$Ei = void 0);
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), (e = this._$ES) === null || e === void 0 || e.forEach((n) => {
        var o;
        return (o = n.hostUpdate) === null || o === void 0 ? void 0 : o.call(n);
      }), this.update(s)) : this._$Ek();
    } catch (n) {
      throw t = !1, this._$Ek(), n;
    }
    t && this._$AE(s);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$ES) === null || t === void 0 || t.forEach((s) => {
      var n;
      return (n = s.hostUpdated) === null || n === void 0 ? void 0 : n.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$EC !== void 0 && (this._$EC.forEach((t, s) => this._$EO(s, this[s], t)), this._$EC = void 0), this._$Ek();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
O.finalized = !0, O.elementProperties = /* @__PURE__ */ new Map(), O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, ke == null || ke({ ReactiveElement: O }), ((ie = Z.reactiveElementVersions) !== null && ie !== void 0 ? ie : Z.reactiveElementVersions = []).push("1.6.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var oe;
const G = window, k = G.trustedTypes, Le = k ? k.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, ue = "$lit$", b = `lit$${(Math.random() + "").slice(9)}$`, Qe = "?" + b, $t = `<${Qe}>`, C = document, j = () => C.createComment(""), N = (i) => i === null || typeof i != "object" && typeof i != "function", We = Array.isArray, bt = (i) => We(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", re = `[ 	
\f\r]`, R = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ie = /-->/g, Te = />/g, m = RegExp(`>|${re}(?:([^\\s"'>=/]+)(${re}*=${re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ue = /'/g, Re = /"/g, Ze = /^(?:script|style|textarea|title)$/i, _t = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), p = _t(1), _ = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), Me = /* @__PURE__ */ new WeakMap(), w = C.createTreeWalker(C, 129, null, !1), mt = (i, e) => {
  const t = i.length - 1, s = [];
  let n, o = e === 2 ? "<svg>" : "", r = R;
  for (let l = 0; l < t; l++) {
    const c = i[l];
    let g, d, h = -1, v = 0;
    for (; v < c.length && (r.lastIndex = v, d = r.exec(c), d !== null); )
      v = r.lastIndex, r === R ? d[1] === "!--" ? r = Ie : d[1] !== void 0 ? r = Te : d[2] !== void 0 ? (Ze.test(d[2]) && (n = RegExp("</" + d[2], "g")), r = m) : d[3] !== void 0 && (r = m) : r === m ? d[0] === ">" ? (r = n != null ? n : R, h = -1) : d[1] === void 0 ? h = -2 : (h = r.lastIndex - d[2].length, g = d[1], r = d[3] === void 0 ? m : d[3] === '"' ? Re : Ue) : r === Re || r === Ue ? r = m : r === Ie || r === Te ? r = R : (r = m, n = void 0);
    const q = r === m && i[l + 1].startsWith("/>") ? " " : "";
    o += r === R ? c + $t : h >= 0 ? (s.push(g), c.slice(0, h) + ue + c.slice(h) + b + q) : c + b + (h === -2 ? (s.push(void 0), l) : q);
  }
  const a = o + (i[t] || "<?>") + (e === 2 ? "</svg>" : "");
  if (!Array.isArray(i) || !i.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return [Le !== void 0 ? Le.createHTML(a) : a, s];
};
class z {
  constructor({ strings: e, _$litType$: t }, s) {
    let n;
    this.parts = [];
    let o = 0, r = 0;
    const a = e.length - 1, l = this.parts, [c, g] = mt(e, t);
    if (this.el = z.createElement(c, s), w.currentNode = this.el.content, t === 2) {
      const d = this.el.content, h = d.firstChild;
      h.remove(), d.append(...h.childNodes);
    }
    for (; (n = w.nextNode()) !== null && l.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) {
          const d = [];
          for (const h of n.getAttributeNames())
            if (h.endsWith(ue) || h.startsWith(b)) {
              const v = g[r++];
              if (d.push(h), v !== void 0) {
                const q = n.getAttribute(v.toLowerCase() + ue).split(b), B = /([.?@])?(.*)/.exec(v);
                l.push({ type: 1, index: o, name: B[2], strings: q, ctor: B[1] === "." ? wt : B[1] === "?" ? At : B[1] === "@" ? Et : ee });
              } else
                l.push({ type: 6, index: o });
            }
          for (const h of d)
            n.removeAttribute(h);
        }
        if (Ze.test(n.tagName)) {
          const d = n.textContent.split(b), h = d.length - 1;
          if (h > 0) {
            n.textContent = k ? k.emptyScript : "";
            for (let v = 0; v < h; v++)
              n.append(d[v], j()), w.nextNode(), l.push({ type: 2, index: ++o });
            n.append(d[h], j());
          }
        }
      } else if (n.nodeType === 8)
        if (n.data === Qe)
          l.push({ type: 2, index: o });
        else {
          let d = -1;
          for (; (d = n.data.indexOf(b, d + 1)) !== -1; )
            l.push({ type: 7, index: o }), d += b.length - 1;
        }
      o++;
    }
  }
  static createElement(e, t) {
    const s = C.createElement("template");
    return s.innerHTML = e, s;
  }
}
function L(i, e, t = i, s) {
  var n, o, r, a;
  if (e === _)
    return e;
  let l = s !== void 0 ? (n = t._$Co) === null || n === void 0 ? void 0 : n[s] : t._$Cl;
  const c = N(e) ? void 0 : e._$litDirective$;
  return (l == null ? void 0 : l.constructor) !== c && ((o = l == null ? void 0 : l._$AO) === null || o === void 0 || o.call(l, !1), c === void 0 ? l = void 0 : (l = new c(i), l._$AT(i, t, s)), s !== void 0 ? ((r = (a = t)._$Co) !== null && r !== void 0 ? r : a._$Co = [])[s] = l : t._$Cl = l), l !== void 0 && (e = L(i, l._$AS(i, e.values), l, s)), e;
}
class yt {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    var t;
    const { el: { content: s }, parts: n } = this._$AD, o = ((t = e == null ? void 0 : e.creationScope) !== null && t !== void 0 ? t : C).importNode(s, !0);
    w.currentNode = o;
    let r = w.nextNode(), a = 0, l = 0, c = n[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let g;
        c.type === 2 ? g = new D(r, r.nextSibling, this, e) : c.type === 1 ? g = new c.ctor(r, c.name, c.strings, this, e) : c.type === 6 && (g = new xt(r, this, e)), this._$AV.push(g), c = n[++l];
      }
      a !== (c == null ? void 0 : c.index) && (r = w.nextNode(), a++);
    }
    return w.currentNode = C, o;
  }
  v(e) {
    let t = 0;
    for (const s of this._$AV)
      s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class D {
  constructor(e, t, s, n) {
    var o;
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = n, this._$Cp = (o = n == null ? void 0 : n.isConnected) === null || o === void 0 || o;
  }
  get _$AU() {
    var e, t;
    return (t = (e = this._$AM) === null || e === void 0 ? void 0 : e._$AU) !== null && t !== void 0 ? t : this._$Cp;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = L(this, e, t), N(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== _ && this._(e) : e._$litType$ !== void 0 ? this.g(e) : e.nodeType !== void 0 ? this.$(e) : bt(e) ? this.T(e) : this._(e);
  }
  k(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  $(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.k(e));
  }
  _(e) {
    this._$AH !== u && N(this._$AH) ? this._$AA.nextSibling.data = e : this.$(C.createTextNode(e)), this._$AH = e;
  }
  g(e) {
    var t;
    const { values: s, _$litType$: n } = e, o = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = z.createElement(n.h, this.options)), n);
    if (((t = this._$AH) === null || t === void 0 ? void 0 : t._$AD) === o)
      this._$AH.v(s);
    else {
      const r = new yt(o, this), a = r.u(this.options);
      r.v(s), this.$(a), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = Me.get(e.strings);
    return t === void 0 && Me.set(e.strings, t = new z(e)), t;
  }
  T(e) {
    We(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, n = 0;
    for (const o of e)
      n === t.length ? t.push(s = new D(this.k(j()), this.k(j()), this, this.options)) : s = t[n], s._$AI(o), n++;
    n < t.length && (this._$AR(s && s._$AB.nextSibling, n), t.length = n);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var s;
    for ((s = this._$AP) === null || s === void 0 || s.call(this, !1, !0, t); e && e !== this._$AB; ) {
      const n = e.nextSibling;
      e.remove(), e = n;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cp = e, (t = this._$AP) === null || t === void 0 || t.call(this, e));
  }
}
class ee {
  constructor(e, t, s, n, o) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e, t = this, s, n) {
    const o = this.strings;
    let r = !1;
    if (o === void 0)
      e = L(this, e, t, 0), r = !N(e) || e !== this._$AH && e !== _, r && (this._$AH = e);
    else {
      const a = e;
      let l, c;
      for (e = o[0], l = 0; l < o.length - 1; l++)
        c = L(this, a[s + l], t, l), c === _ && (c = this._$AH[l]), r || (r = !N(c) || c !== this._$AH[l]), c === u ? e = u : e !== u && (e += (c != null ? c : "") + o[l + 1]), this._$AH[l] = c;
    }
    r && !n && this.j(e);
  }
  j(e) {
    e === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e != null ? e : "");
  }
}
class wt extends ee {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === u ? void 0 : e;
  }
}
const Ct = k ? k.emptyScript : "";
class At extends ee {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    e && e !== u ? this.element.setAttribute(this.name, Ct) : this.element.removeAttribute(this.name);
  }
}
class Et extends ee {
  constructor(e, t, s, n, o) {
    super(e, t, s, n, o), this.type = 5;
  }
  _$AI(e, t = this) {
    var s;
    if ((e = (s = L(this, e, t, 0)) !== null && s !== void 0 ? s : u) === _)
      return;
    const n = this._$AH, o = e === u && n !== u || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, r = e !== u && (n === u || o);
    o && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t, s;
    typeof this._$AH == "function" ? this._$AH.call((s = (t = this.options) === null || t === void 0 ? void 0 : t.host) !== null && s !== void 0 ? s : this.element, e) : this._$AH.handleEvent(e);
  }
}
class xt {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    L(this, e);
  }
}
const He = G.litHtmlPolyfillSupport;
He == null || He(z, D), ((oe = G.litHtmlVersions) !== null && oe !== void 0 ? oe : G.litHtmlVersions = []).push("2.7.4");
const St = (i, e, t) => {
  var s, n;
  const o = (s = t == null ? void 0 : t.renderBefore) !== null && s !== void 0 ? s : e;
  let r = o._$litPart$;
  if (r === void 0) {
    const a = (n = t == null ? void 0 : t.renderBefore) !== null && n !== void 0 ? n : null;
    o._$litPart$ = r = new D(e.insertBefore(j(), a), a, void 0, t != null ? t : {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var le, ae;
let f = class extends O {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e, t;
    const s = super.createRenderRoot();
    return (e = (t = this.renderOptions).renderBefore) !== null && e !== void 0 || (t.renderBefore = s.firstChild), s;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = St(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) === null || e === void 0 || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) === null || e === void 0 || e.setConnected(!1);
  }
  render() {
    return _;
  }
};
f.finalized = !0, f._$litElement$ = !0, (le = globalThis.litElementHydrateSupport) === null || le === void 0 || le.call(globalThis, { LitElement: f });
const je = globalThis.litElementPolyfillSupport;
je == null || je({ LitElement: f });
((ae = globalThis.litElementVersions) !== null && ae !== void 0 ? ae : globalThis.litElementVersions = []).push("3.3.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E = (i) => (e) => typeof e == "function" ? ((t, s) => (customElements.define(t, s), s))(i, e) : ((t, s) => {
  const { kind: n, elements: o } = s;
  return { kind: n, elements: o, finisher(r) {
    customElements.define(t, r);
  } };
})(i, e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Pt = (i, e) => e.kind === "method" && e.descriptor && !("value" in e.descriptor) ? P(S({}, e), { finisher(t) {
  t.createProperty(e.key, i);
} }) : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e.key, initializer() {
  typeof e.initializer == "function" && (this[e.key] = e.initializer.call(this));
}, finisher(t) {
  t.createProperty(e.key, i);
} };
function x(i) {
  return (e, t) => t !== void 0 ? ((s, n, o) => {
    n.constructor.createProperty(o, s);
  })(i, e, t) : Pt(i, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function te(i) {
  return x(P(S({}, i), { state: !0 }));
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ge = ({ finisher: i, descriptor: e }) => (t, s) => {
  var n;
  if (s === void 0) {
    const o = (n = t.originalKey) !== null && n !== void 0 ? n : t.key, r = e != null ? { kind: "method", placement: "prototype", key: o, descriptor: e(t.key) } : P(S({}, t), { key: o });
    return i != null && (r.finisher = function(a) {
      i(a, o);
    }), r;
  }
  {
    const o = t.constructor;
    e !== void 0 && Object.defineProperty(t, s, e(s)), i == null || i(o, s);
  }
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var ce;
((ce = window.HTMLSlotElement) === null || ce === void 0 ? void 0 : ce.prototype.assignedElements) != null;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function pe(i, e, t) {
  return i ? e() : t == null ? void 0 : t();
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ot = (i, e, t) => {
  for (const s of e)
    if (s[0] === i)
      return (0, s[1])();
  return t == null ? void 0 : t();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, Ke = (i) => (...e) => ({ _$litDirective$: i, values: e });
let Xe = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, s) {
    this._$Ct = e, this._$AM = t, this._$Ci = s;
  }
  _$AS(e, t) {
    return this.update(e, t);
  }
  update(e, t) {
    return this.render(...t);
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let ve = class extends Xe {
  constructor(e) {
    if (super(e), this.et = u, e.type !== Fe.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === u || e == null)
      return this.ft = void 0, this.et = e;
    if (e === _)
      return e;
    if (typeof e != "string")
      throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.et)
      return this.ft;
    this.et = e;
    const t = [e];
    return t.raw = t, this.ft = { _$litType$: this.constructor.resultType, strings: t, values: [] };
  }
};
ve.directiveName = "unsafeHTML", ve.resultType = 1;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let fe = class extends ve {
};
fe.directiveName = "unsafeSVG", fe.resultType = 2;
const Ce = Ke(fe);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kt = (i, ...e) => ({
  strTag: !0,
  strings: i,
  values: e
}), F = kt, Lt = (i) => typeof i != "string" && "strTag" in i, Je = (i, e, t) => {
  let s = i[0];
  for (let n = 1; n < i.length; n++)
    s += e[t ? t[n - 1] : n - 1], s += i[n];
  return s;
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ye = (i) => Lt(i) ? Je(i.strings, i.values) : i;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ge = "lit-localize-status";
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class It {
  constructor(e) {
    this.__litLocalizeEventHandler = (t) => {
      t.detail.status === "ready" && this.host.requestUpdate();
    }, this.host = e;
  }
  hostConnected() {
    window.addEventListener(ge, this.__litLocalizeEventHandler);
  }
  hostDisconnected() {
    window.removeEventListener(ge, this.__litLocalizeEventHandler);
  }
}
const Tt = (i) => i.addController(new It(i)), et = Tt;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ut = () => (i) => typeof i == "function" ? Mt(i) : Rt(i), Ae = Ut, Rt = ({ kind: i, elements: e }) => ({
  kind: i,
  elements: e,
  finisher(t) {
    t.addInitializer(et);
  }
}), Mt = (i) => (i.addInitializer(et), i);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class tt {
  constructor() {
    this.settled = !1, this.promise = new Promise((e, t) => {
      this._resolve = e, this._reject = t;
    });
  }
  resolve(e) {
    this.settled = !0, this._resolve(e);
  }
  reject(e) {
    this.settled = !0, this._reject(e);
  }
}
/**
 * @license
 * Copyright 2014 Travis Webb
 * SPDX-License-Identifier: MIT
 */
const $ = [];
for (let i = 0; i < 256; i++)
  $[i] = (i >> 4 & 15).toString(16) + (i & 15).toString(16);
function Ht(i) {
  let e = 0, t = 8997, s = 0, n = 33826, o = 0, r = 40164, a = 0, l = 52210;
  for (let c = 0; c < i.length; c++)
    t ^= i.charCodeAt(c), e = t * 435, s = n * 435, o = r * 435, a = l * 435, o += t << 8, a += n << 8, s += e >>> 16, t = e & 65535, o += s >>> 16, n = s & 65535, l = a + (o >>> 16) & 65535, r = o & 65535;
  return $[l >> 8] + $[l & 255] + $[r >> 8] + $[r & 255] + $[n >> 8] + $[n & 255] + $[t >> 8] + $[t & 255];
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const jt = "", Nt = "h", zt = "s";
function Dt(i, e) {
  return (e ? Nt : zt) + Ht(typeof i == "string" ? i : i.join(jt));
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ne = /* @__PURE__ */ new WeakMap(), ze = /* @__PURE__ */ new Map();
function qt(i, e, t) {
  var s;
  if (i) {
    const n = (s = t == null ? void 0 : t.id) !== null && s !== void 0 ? s : Bt(e), o = i[n];
    if (o) {
      if (typeof o == "string")
        return o;
      if ("strTag" in o)
        return Je(
          o.strings,
          // Cast `template` because its type wasn't automatically narrowed (but
          // we know it must be the same type as `localized`).
          e.values,
          o.values
        );
      {
        let r = Ne.get(o);
        return r === void 0 && (r = o.values, Ne.set(o, r)), P(S({}, o), {
          values: r.map((a) => e.values[a])
        });
      }
    }
  }
  return Ye(e);
}
function Bt(i) {
  const e = typeof i == "string" ? i : i.strings;
  let t = ze.get(e);
  return t === void 0 && (t = Dt(e, typeof i != "string" && !("strTag" in i)), ze.set(e, t)), t;
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function de(i) {
  window.dispatchEvent(new CustomEvent(ge, { detail: i }));
}
let K = "", M, st, X, $e, it, y = new tt();
y.resolve();
let Q = 0;
const Vt = (i) => (Zt((e, t) => qt(it, e, t)), K = st = i.sourceLocale, X = new Set(i.targetLocales), X.add(i.sourceLocale), $e = i.loadLocale, { getLocale: Qt, setLocale: Wt }), Qt = () => K, Wt = (i) => {
  if (i === (M != null ? M : K))
    return y.promise;
  if (!X || !$e)
    throw new Error("Internal error");
  if (!X.has(i))
    throw new Error("Invalid locale code");
  Q++;
  const e = Q;
  return M = i, y.settled && (y = new tt()), de({ status: "loading", loadingLocale: i }), (i === st ? (
    // We could switch to the source locale synchronously, but we prefer to
    // queue it on a microtask so that switching locales is consistently
    // asynchronous.
    Promise.resolve({ templates: void 0 })
  ) : $e(i)).then((s) => {
    Q === e && (K = i, M = void 0, it = s.templates, de({ status: "ready", readyLocale: i }), y.resolve());
  }, (s) => {
    Q === e && (de({
      status: "error",
      errorLocale: i,
      errorMessage: s.toString()
    }), y.reject(s));
  }), y.promise;
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let H = Ye, De = !1;
function Zt(i) {
  if (De)
    throw new Error("lit-localize can only be configured once");
  H = i, De = !0;
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Gt = class extends Event {
  constructor(e, t, s) {
    super("context-request", { bubbles: !0, composed: !0 }), this.context = e, this.callback = t, this.subscribe = s;
  }
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Ft = class {
  constructor(e, t, s, n) {
    var o;
    if (this.subscribe = !1, this.provided = !1, this.value = void 0, this.t = (r, a) => {
      this.unsubscribe && (this.unsubscribe !== a && (this.provided = !1, this.unsubscribe()), this.subscribe || this.unsubscribe()), this.value = r, this.host.requestUpdate(), this.provided && !this.subscribe || (this.provided = !0, this.callback && this.callback(r, a)), this.unsubscribe = a;
    }, this.host = e, t.context !== void 0) {
      const r = t;
      this.context = r.context, this.callback = r.callback, this.subscribe = (o = r.subscribe) !== null && o !== void 0 && o;
    } else
      this.context = t, this.callback = s, this.subscribe = n != null && n;
    this.host.addController(this);
  }
  hostConnected() {
    this.dispatchRequest();
  }
  hostDisconnected() {
    this.unsubscribe && (this.unsubscribe(), this.unsubscribe = void 0);
  }
  dispatchRequest() {
    this.host.dispatchEvent(new Gt(this.context, this.t, this.subscribe));
  }
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Kt = class {
  constructor(e) {
    this.callbacks = /* @__PURE__ */ new Map(), this.updateObservers = () => {
      for (const [t, s] of this.callbacks)
        t(this.o, s);
    }, e !== void 0 && (this.value = e);
  }
  get value() {
    return this.o;
  }
  set value(e) {
    this.setValue(e);
  }
  setValue(e, t = !1) {
    const s = t || !Object.is(e, this.o);
    this.o = e, s && this.updateObservers();
  }
  addCallback(e, t) {
    t && (this.callbacks.has(e) || this.callbacks.set(e, () => {
      this.callbacks.delete(e);
    })), e(this.value);
  }
  clearCallbacks() {
    this.callbacks.clear();
  }
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class Xt extends Event {
  constructor(e) {
    super("context-provider", { bubbles: !0, composed: !0 }), this.context = e, Object.setPrototypeOf(this, new.target.prototype);
  }
}
class Jt extends Kt {
  constructor(e, t, s) {
    super(t.context !== void 0 ? t.initialValue : s), this.onContextRequest = (n) => {
      n.context === this.context && n.composedPath()[0] !== this.host && (n.stopPropagation(), this.addCallback(n.callback, n.subscribe));
    }, this.host = e, t.context !== void 0 ? this.context = t.context : this.context = t, this.attachListeners(), this.host.addController(this);
  }
  attachListeners() {
    this.host.addEventListener("context-request", this.onContextRequest);
  }
  hostConnected() {
    this.host.dispatchEvent(new Xt(this.context));
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Yt({ context: i }) {
  return Ge({ finisher: (e, t) => {
    const s = /* @__PURE__ */ new WeakMap();
    e.addInitializer((a) => {
      s.set(a, new Jt(a, { context: i }));
    });
    const n = Object.getOwnPropertyDescriptor(e.prototype, t), o = n == null ? void 0 : n.set, r = P(S({}, n), { set: function(a) {
      var l;
      (l = s.get(this)) === null || l === void 0 || l.setValue(a), o && o.call(this, a);
    } });
    Object.defineProperty(e.prototype, t, r);
  } });
}
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function es({ context: i, subscribe: e }) {
  return Ge({ finisher: (t, s) => {
    t.addInitializer((n) => {
      new Ft(n, { context: i, callback: (o) => {
        n[s] = o;
      }, subscribe: e });
    });
  } });
}
const nt = Symbol("io-link-provider"), qe = (i, e) => {
  const t = new URL(i, "https://continua.io.pagopa.it");
  return Object.entries(e).forEach(([s, n]) => {
    t.searchParams.append(s, n);
  }), t;
};
class ts {
  getIOLink(e) {
    return qe("open", {
      feat: "firma",
      srid: e
    });
  }
  getQrCodeUrl(e) {
    return qe("qrcode.png", {
      feat: "firma",
      srid: e,
      width: "150",
      color: "#17324dff"
    });
  }
}
const ot = "en", ss = [
  "it"
], is = {
  h74a43a08a000928c: p`Per vedere e firmare i documenti su IO, inquadra<br>questo codice con il tuo dispositivo`,
  ha0d71407af1d41f6: p`Stiamo preparando i<br>documenti...`,
  s0cdf4f51e13b8947: F`Inquadra il codice QR`,
  s986aec5a433b6eb5: F`Non hai l’app IO? Scaricala ora`
}, ns = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  templates: is
}, Symbol.toStringTag, { value: "Module" })), os = /* @__PURE__ */ new Map([["it", ns]]), { setLocale: rs } = Vt({
  sourceLocale: ot,
  targetLocales: ss,
  loadLocale: (i) => V(void 0, null, function* () {
    const e = os.get(i);
    if (typeof e == "undefined")
      throw new Error(`Unable to local ${i} locale: templates not found.`);
    return e;
  })
}), ls = () => V(void 0, null, function* () {
  const [i] = navigator.language.split("-");
  try {
    rs(i);
  } catch (e) {
    console.warn(
      `Missing locale data for: "${navigator.language}". Using default locale: "${ot}" as fallback.`
    );
  }
}), as = `<svg
  width="20"
  heigth="20"
  viewBox="0 0 84 72"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <mask
    id="mask0_0_3113"
    style="mask-type:luminance"
    maskUnits="userSpaceOnUse"
    x="0"
    y="0"
    width="84"
    height="72"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.95446 0.545898C13.8497 0.545898 17.8181 4.51428 17.8181 9.40953C17.8181 14.3048 13.8497 18.2732 8.95446 18.2732C4.05921 18.2732 0.0908203 14.3048 0.0908203 9.40953C0.0908203 4.51428 4.05921 0.545898 8.95446 0.545898ZM83.409 43.0908C83.409 58.7556 70.7102 71.4544 56.396 71.4544C39.3806 71.4544 26.6817 58.7556 26.6817 43.0908C26.6817 27.426 39.3806 14.7271 56.396 14.7271C70.7102 14.7271 83.409 27.426 83.409 43.0908ZM16.0449 34.2277C16.0449 30.3115 12.8702 27.1368 8.95402 27.1368C5.03782 27.1368 1.86311 30.3115 1.86311 34.2277V64.3641C1.86311 68.2803 5.03782 71.455 8.95402 71.455C12.8702 71.455 16.0449 68.2803 16.0449 64.3641V34.2277ZM62.0158 40.1134H65.7919V36.3978H62.043V31.9044H57.9409V46.8534C57.9409 49.2153 58.2669 50.8283 58.946 51.6924C59.598 52.5853 60.8477 53.0173 62.695 53.0173C63.4013 53.0173 64.4608 52.8445 65.8191 52.5277L65.6289 49.0713L63.2926 49.1289C62.8851 49.1289 62.5863 49.0425 62.3961 48.8409C62.206 48.6392 62.0973 48.4088 62.0701 48.1496C62.043 47.8615 62.0158 47.4295 62.0158 46.767V40.1134ZM49.652 36.4263V52.6426H53.7541V36.4263H49.652ZM43.4983 36.0242C44.2152 36.0242 44.8219 36.2657 45.2907 36.7486C45.7595 37.2316 45.9801 37.8219 45.9801 38.5463C45.9801 39.2707 45.7595 39.8341 45.2907 40.3171C44.8495 40.7464 44.2704 40.9879 43.5258 40.9879C42.8089 40.9879 42.2022 40.7464 41.7334 40.2634C41.2646 39.7805 41.0164 39.1902 41.0164 38.4926C41.0164 37.795 41.2646 37.2048 41.7058 36.7218C42.1746 36.2389 42.7813 36.0242 43.4983 36.0242Z"
      fill="white"
    />
  </mask>
  <g mask="url(#mask0_0_3113)">
    <rect
      fill="currentColor"
      x="-134.636"
      y="-141.272"
      width="354.545"
      height="354.545"
    />
  </g>
</svg>`;
var cs = Object.defineProperty, ds = Object.getOwnPropertyDescriptor, rt = (i, e, t, s) => {
  for (var n = s > 1 ? void 0 : s ? ds(e, t) : e, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(e, t, n) : r(n)) || n);
  return s && n && cs(e, t, n), n;
};
let J = class extends f {
  constructor() {
    super(...arguments), this.disabled = !1;
  }
  render() {
    return p`<button ?disabled="${this.disabled}"><slot></slot></button>`;
  }
};
J.styles = T`:host{--io-button-bg-color:var(--io-primary-color, #0073e6)}button{display:flex;flex-direction:row;justify-content:space-between;align-items:center;font-family:var(--io-font-family,sans-serif);border:0;height:40px;font-size:1em;font-weight:700;padding:.5em 1.2em;border-radius:var(--io-border-radius,4px);min-width:155px;background:var(--io-button-bg-color);color:var(--io-button-color,#fff);transition:filter 250ms cubic-bezier(.4,0,.2,1) 0s}button:hover:not(:disabled){cursor:pointer;filter:brightness(.9)}button:disabled{background-color:var(--io-button-disabled-bg-color,rgba(23,50,77,.12));color:var(--io-button-disabled-color,rgba(23,50,77,.26))}`;
rt([
  x({
    type: Boolean
  })
], J.prototype, "disabled", 2);
J = rt([
  E("io-button")
], J);
var hs = Object.defineProperty, us = Object.getOwnPropertyDescriptor, ps = (i, e, t, s) => {
  for (var n = s > 1 ? void 0 : s ? us(e, t) : e, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(e, t, n) : r(n)) || n);
  return s && n && hs(e, t, n), n;
};
let be = class extends f {
  render() {
    return p`<span></span>`;
  }
};
be.styles = T`:host{display:inline-block;height:1em;position:relative;overflow:hidden;width:100%;border-radius:5px;background-color:var(--io-skeleton-bg-color,rgb(255,255,255,.3))}@keyframes translate{100%{transform:translateX(100%)}}span{position:absolute;top:0;right:0;bottom:0;left:0;transform:translateX(-100%);background-image:linear-gradient(90deg,rgba(255,255,255,0) 0,rgba(255,255,255,.2) 20%,rgba(255,255,255,.3) 60%,rgba(255,255,255,0));animation:translate 2s infinite}`;
be = ps([
  E("io-skeleton")
], be);
const vs = `<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M2 12C2 17.5228 6.47715 22 12 22C12.5523 22 13 22.4477 13 23C13 23.5523 12.5523 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 12.5523 23.5523 13 23 13C22.4477 13 22 12.5523 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z"
    fill="var(--io-spinner-color, white)"
  />
  <defs>
    <radialGradient
      id="paint0_angular_117_32"
      cx="0"
      cy="0"
      r="1"
      gradientUnits="userSpaceOnUse"
      gradientTransform="translate(12 12) rotate(15.2551) scale(12.4383)"
    >
      <stop offset="0.203125" stop-opacity="0" />
      <stop offset="0.5" />
      <stop offset="1" />
    </radialGradient>
  </defs>
</svg>`;
var fs = Object.defineProperty, gs = Object.getOwnPropertyDescriptor, $s = (i, e, t, s) => {
  for (var n = s > 1 ? void 0 : s ? gs(e, t) : e, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(e, t, n) : r(n)) || n);
  return s && n && fs(e, t, n), n;
};
let _e = class extends f {
  render() {
    return Ce(vs);
  }
};
_e.styles = T`stop{stop-color:var(--io-spinner-color,#fff)}@keyframes spin{100%{transform:rotate(360deg)}}:host{display:inline-flex;margin:0 auto;animation:spin 1s linear infinite}svg{width:var(--io-spinner-size,24px);height:var(--io-spinner-size,24px)}`;
_e = $s([
  E("io-spinner")
], _e);
const bs = `<svg
  width="14"
  height="14"
  viewBox="0 0 14 14"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <mask
    id="mask0_5971_7089"
    style="mask-type:luminance"
    maskUnits="userSpaceOnUse"
    x="0"
    y="0"
    width="14"
    height="14"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.8101 13.7071C12.4457 14.0976 11.8547 14.0976 11.4902 13.7071L6.55018 8.41421L1.61015 13.7071C1.24566 14.0976 0.654702 14.0976 0.290213 13.7071C-0.0742766 13.3166 -0.0742766 12.6834 0.290213 12.2929L5.23025 7L0.290213 1.70711C-0.0742769 1.31658 -0.0742769 0.683418 0.290213 0.292893C0.654702 -0.0976311 1.24566 -0.0976311 1.61015 0.292893L6.55018 5.58579L11.4902 0.292893C11.8547 -0.0976311 12.4457 -0.0976311 12.8101 0.292893C13.1746 0.683418 13.1746 1.31658 12.8101 1.70711L7.87011 7L12.8101 12.2929C13.1746 12.6834 13.1746 13.3166 12.8101 13.7071Z"
      fill="white"
    />
  </mask>
  <g mask="url(#mask0_5971_7089)">
    <rect
      x="-38.2666"
      y="-34"
      width="93.3333"
      height="100"
      fill="#0073E6"
    />
  </g>
</svg>`;
var _s = Object.defineProperty, ms = Object.getOwnPropertyDescriptor, lt = (i, e, t, s) => {
  for (var n = s > 1 ? void 0 : s ? ms(e, t) : e, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(e, t, n) : r(n)) || n);
  return s && n && _s(e, t, n), n;
};
let Y = class extends f {
  constructor() {
    super(...arguments), this.disableClose = !1;
  }
  handleClick(i) {
    i.stopPropagation();
  }
  dispatchClose() {
    this.dispatchEvent(new Event("close", { bubbles: !0, composed: !0 }));
  }
  render() {
    return p`<div class="backdrop" @click="${this.dispatchClose}"><div class="dialog" @click="${this.handleClick}"><header>${pe(
      !this.disableClose,
      () => p`<button class="close" @click="${this.dispatchClose}">${Ce(bs)}</button>`
    )}</header><main><slot></slot></main></div></div>`;
  }
};
Y.styles = T`.backdrop{display:flex;align-items:center;justify-content:center;position:fixed;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(23,24,26,.4)}.dialog{font-family:var(--io-font-family,sans-serif);color:var(--io-dialog-color,#17324d);background-color:var(--io-dialog-bg-color,#fff);text-align:center;border-radius:var(--io-border-radius,4px);padding:1em;min-width:300px}.dialog header{display:flex;flex-direction:row;justify-content:flex-end}.dialog button.close{border:0;background:0 0;padding:0;margin:0}.dialog button.close:hover{filter:brightness(.9);cursor:pointer}`;
lt([
  x({ attribute: "disable-close", type: Boolean })
], Y.prototype, "disableClose", 2);
Y = lt([
  E("io-dialog")
], Y);
var ys = Object.defineProperty, ws = Object.getOwnPropertyDescriptor, se = (i, e, t, s) => {
  for (var n = s > 1 ? void 0 : s ? ws(e, t) : e, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(e, t, n) : r(n)) || n);
  return s && n && ys(e, t, n), n;
};
let I = class extends f {
  get qrCodeUrl() {
    if (this.signatureRequestId && this.IOLinkProvider)
      return this.IOLinkProvider.getQrCodeUrl(this.signatureRequestId).href;
  }
  render() {
    return p`<io-dialog><div class="content"><h1>${H(F`Scan the QR code`)}</h1><p>${H(p`To view and sign the documents with IO,<br>scan this code with your device`)}</p><div><img class="qr-code" src="${this.qrCodeUrl}"></div><span>${H(F`Don’t have the IO app? Download it now`)}</span><div class="app-badges"><a href="https://apps.apple.com/it/app/io/id1501681835" style="display:inline-block;overflow:hidden;border-radius:13px"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/it-it?size=250x83&releaseDate=1586995200" alt="Download on the App Store" style="border-radius:13px;height:40px;width:120px"></a><a href="https://play.google.com/store/apps/details?id=it.pagopa.io.app"><img alt="Disponibile su Google Play" style="height:50px;width:130px" src="https://play.google.com/intl/en_us/badges/static/images/badges/it_badge_web_generic.png"></a></div></div></io-dialog>`;
  }
};
I.styles = T`h1{font-size:1.625em}.app-badges{display:flex;flex-direction:row;align-items:center;justify-content:center;padding:10px}.app-badges a{margin:0 5px}.qr-code{width:150px;height:150px}`;
se([
  es({ context: nt }),
  x({ attribute: !1 })
], I.prototype, "IOLinkProvider", 2);
se([
  x({
    type: String
  })
], I.prototype, "signatureRequestId", 2);
se([
  te()
], I.prototype, "qrCodeUrl", 1);
I = se([
  Ae(),
  E("io-sign-qr-dialog")
], I);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const at = "important", Cs = " !" + at, As = Ke(class extends Xe {
  constructor(i) {
    var e;
    if (super(i), i.type !== Fe.ATTRIBUTE || i.name !== "style" || ((e = i.strings) === null || e === void 0 ? void 0 : e.length) > 2)
      throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(i) {
    return Object.keys(i).reduce((e, t) => {
      const s = i[t];
      return s == null ? e : e + `${t = t.includes("-") ? t : t.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s};`;
    }, "");
  }
  update(i, [e]) {
    const { style: t } = i.element;
    if (this.ut === void 0) {
      this.ut = /* @__PURE__ */ new Set();
      for (const s in e)
        this.ut.add(s);
      return this.render(e);
    }
    this.ut.forEach((s) => {
      e[s] == null && (this.ut.delete(s), s.includes("-") ? t.removeProperty(s) : t[s] = "");
    });
    for (const s in e) {
      const n = e[s];
      if (n != null) {
        this.ut.add(s);
        const o = typeof n == "string" && n.endsWith(Cs);
        s.includes("-") || o ? t.setProperty(s, o ? n.slice(0, -11) : n, o ? at : "") : t[s] = n;
      }
    }
    return _;
  }
});
var Es = Object.defineProperty, xs = Object.getOwnPropertyDescriptor, Ss = (i, e, t, s) => {
  for (var n = s > 1 ? void 0 : s ? xs(e, t) : e, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(e, t, n) : r(n)) || n);
  return s && n && Es(e, t, n), n;
};
let me = class extends f {
  render() {
    return p`<io-dialog disable-close><div class="content"><p>${H(p`Stiamo preparando i<br>documenti...`)}</p><io-spinner style="${As({
      "--io-spinner-color": "#0073E6",
      "--io-spinner-size": "40px"
    })}"></io-spinner></div></io-dialog>`;
  }
};
me.styles = T`p{font-size:1.5em;line-height:28px}.content{margin-top:40%;margin-bottom:40%}`;
me = Ss([
  Ae(),
  E("io-sign-loader-dialog")
], me);
var Ps = Object.defineProperty, Os = Object.getOwnPropertyDescriptor, U = (i, e, t, s) => {
  for (var n = s > 1 ? void 0 : s ? Os(e, t) : e, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(e, t, n) : r(n)) || n);
  return s && n && Ps(e, t, n), n;
};
ls();
let A = class extends f {
  constructor() {
    super(...arguments), this.disabled = !1, this.state = "activating", this.showQrCode = !1, this.IOLinkProvider = new ts(), this.theme = null;
  }
  // Due to Web Component limitations, it's not possible to
  // declare custom fonts inside the component-scoped CSS
  // So we inject an external stylesheet (at VITE_THEME_URL)
  // into <head> element of the document when the component
  // is mounted to the page.
  // When the external CSS is mounted and loaded ("load" event)
  // we set this component as "idle" (ready to be clicked).
  connectedCallback() {
    if (super.connectedCallback(), document.getElementById("io-sign-theme-css") === null) {
      const e = document.createElement("link");
      e.id = "io-sign-theme-css", e.rel = "stylesheet", e.href = "https://stlucadev.z6.web.core.windows.net/sdk/theme.css", e.addEventListener("load", () => {
        this.state = "idle";
      }), this.theme = document.head.appendChild(e);
    } else
      this.state = "idle";
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.theme !== null && document.head.removeChild(this.theme);
  }
  handleClick(i) {
    i.preventDefault(), !(this.disabled || this.state !== "idle") && (this.state = "loading", this.dispatchEvent(
      new Event("io-sign.cta.click", {
        bubbles: !0,
        composed: !0
      })
    ));
  }
  handleClose() {
    this.showQrCode = !1;
  }
  reset() {
    this.state = "idle", this.signatureRequestId = void 0, this.showQrCode = !1;
  }
  // Show the QrCode dialog or redirect the user to the IO App
  redirectOrShowQrCode(i) {
    if (this.state = "idle", this.signatureRequestId = i, /iPhone|Android/i.test(navigator.userAgent)) {
      const t = new URL(
        `/fci/main?signatureRequestId=${this.signatureRequestId}`,
        "https://continua.io.pagopa.it"
      );
      window.location.href = t.href;
    } else
      this.showQrCode = !0;
  }
  render() {
    return p`<io-button @click="${this.handleClick}" ?disabled="${this.disabled}">${Ot(
      this.state,
      [
        ["activating", () => p`<io-skeleton></io-skeleton>`],
        ["loading", () => p`<io-spinner></io-spinner>`]
      ],
      () => p`${Ce(as)} Firma con IO`
    )}</io-button>${pe(
      this.showQrCode && this.signatureRequestId,
      () => p`<io-sign-qr-dialog .signatureRequestId="${this.signatureRequestId}" @close="${this.handleClose}"></io-sign-qr-dialog>`
    )} ${pe(
      this.state === "loading",
      () => p`<io-sign-loader-dialog @close="${this.handleClose}"></io-sign-loader-dialog>`
    )}`;
  }
};
U([
  x({
    type: Boolean
  })
], A.prototype, "disabled", 2);
U([
  te()
], A.prototype, "state", 2);
U([
  te()
], A.prototype, "signatureRequestId", 2);
U([
  te()
], A.prototype, "showQrCode", 2);
U([
  Yt({ context: nt }),
  x({ attribute: !1 })
], A.prototype, "IOLinkProvider", 2);
A = U([
  E("io-sign"),
  Ae()
], A);
export {
  A as IOSignElement
};
