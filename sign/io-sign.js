var ut = Object.defineProperty, pt = Object.defineProperties;
var vt = Object.getOwnPropertyDescriptors;
var Ae = Object.getOwnPropertySymbols;
var ft = Object.prototype.hasOwnProperty, gt = Object.prototype.propertyIsEnumerable;
var xe = (s, e, t) => e in s ? ut(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, S = (s, e) => {
  for (var t in e || (e = {}))
    ft.call(e, t) && xe(s, t, e[t]);
  if (Ae)
    for (var t of Ae(e))
      gt.call(e, t) && xe(s, t, e[t]);
  return s;
}, O = (s, e) => pt(s, vt(e));
var V = (s, e, t) => new Promise((i, n) => {
  var o = (l) => {
    try {
      a(t.next(l));
    } catch (d) {
      n(d);
    }
  }, r = (l) => {
    try {
      a(t.throw(l));
    } catch (d) {
      n(d);
    }
  }, a = (l) => l.done ? i(l.value) : Promise.resolve(l.value).then(o, r);
  a((t = t.apply(s, e)).next());
});
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = window, ye = Q.ShadowRoot && (Q.ShadyCSS === void 0 || Q.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, we = Symbol(), Se = /* @__PURE__ */ new WeakMap();
let Be = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== we)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (ye && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = Se.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Se.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const $t = (s) => new Be(typeof s == "string" ? s : s + "", void 0, we), T = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((i, n, o) => i + ((r) => {
    if (r._$cssResult$ === !0)
      return r.cssText;
    if (typeof r == "number")
      return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[o + 1], s[0]);
  return new Be(t, s, we);
}, _t = (s, e) => {
  ye ? s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet) : e.forEach((t) => {
    const i = document.createElement("style"), n = Q.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = t.cssText, s.appendChild(i);
  });
}, Oe = ye ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules)
    t += i.cssText;
  return $t(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var se;
const W = window, Pe = W.trustedTypes, bt = Pe ? Pe.emptyScript : "", Le = W.reactiveElementPolyfillSupport, ce = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? bt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let t = s;
  switch (e) {
    case Boolean:
      t = s !== null;
      break;
    case Number:
      t = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(s);
      } catch (i) {
        t = null;
      }
  }
  return t;
} }, Qe = (s, e) => e !== s && (e == e || s == s), ie = { attribute: !0, type: String, converter: ce, reflect: !1, hasChanged: Qe }, he = "finalized";
let P = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$El = null, this._$Eu();
  }
  static addInitializer(e) {
    var t;
    this.finalize(), ((t = this.h) !== null && t !== void 0 ? t : this.h = []).push(e);
  }
  static get observedAttributes() {
    this.finalize();
    const e = [];
    return this.elementProperties.forEach((t, i) => {
      const n = this._$Ep(i, t);
      n !== void 0 && (this._$Ev.set(n, i), e.push(n));
    }), e;
  }
  static createProperty(e, t = ie) {
    if (t.state && (t.attribute = !1), this.finalize(), this.elementProperties.set(e, t), !t.noAccessor && !this.prototype.hasOwnProperty(e)) {
      const i = typeof e == "symbol" ? Symbol() : "__" + e, n = this.getPropertyDescriptor(e, i, t);
      n !== void 0 && Object.defineProperty(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    return { get() {
      return this[t];
    }, set(n) {
      const o = this[e];
      this[t] = n, this.requestUpdate(e, o, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) || ie;
  }
  static finalize() {
    if (this.hasOwnProperty(he))
      return !1;
    this[he] = !0;
    const e = Object.getPrototypeOf(this);
    if (e.finalize(), e.h !== void 0 && (this.h = [...e.h]), this.elementProperties = new Map(e.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const t = this.properties, i = [...Object.getOwnPropertyNames(t), ...Object.getOwnPropertySymbols(t)];
      for (const n of i)
        this.createProperty(n, t[n]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const n of i)
        t.unshift(Oe(n));
    } else
      e !== void 0 && t.push(Oe(e));
    return t;
  }
  static _$Ep(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  _$Eu() {
    var e;
    this._$E_ = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (e = this.constructor.h) === null || e === void 0 || e.forEach((t) => t(this));
  }
  addController(e) {
    var t, i;
    ((t = this._$ES) !== null && t !== void 0 ? t : this._$ES = []).push(e), this.renderRoot !== void 0 && this.isConnected && ((i = e.hostConnected) === null || i === void 0 || i.call(e));
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
    return _t(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var e;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$ES) === null || e === void 0 || e.forEach((t) => {
      var i;
      return (i = t.hostConnected) === null || i === void 0 ? void 0 : i.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$ES) === null || e === void 0 || e.forEach((t) => {
      var i;
      return (i = t.hostDisconnected) === null || i === void 0 ? void 0 : i.call(t);
    });
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$EO(e, t, i = ie) {
    var n;
    const o = this.constructor._$Ep(e, i);
    if (o !== void 0 && i.reflect === !0) {
      const r = (((n = i.converter) === null || n === void 0 ? void 0 : n.toAttribute) !== void 0 ? i.converter : ce).toAttribute(t, i.type);
      this._$El = e, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$El = null;
    }
  }
  _$AK(e, t) {
    var i;
    const n = this.constructor, o = n._$Ev.get(e);
    if (o !== void 0 && this._$El !== o) {
      const r = n.getPropertyOptions(o), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : ((i = r.converter) === null || i === void 0 ? void 0 : i.fromAttribute) !== void 0 ? r.converter : ce;
      this._$El = o, this[o] = a.fromAttribute(t, r.type), this._$El = null;
    }
  }
  requestUpdate(e, t, i) {
    let n = !0;
    e !== void 0 && (((i = i || this.constructor.getPropertyOptions(e)).hasChanged || Qe)(this[e], t) ? (this._$AL.has(e) || this._$AL.set(e, t), i.reflect === !0 && this._$El !== e && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(e, i))) : n = !1), !this.isUpdatePending && n && (this._$E_ = this._$Ej());
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
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (e = this._$ES) === null || e === void 0 || e.forEach((n) => {
        var o;
        return (o = n.hostUpdate) === null || o === void 0 ? void 0 : o.call(n);
      }), this.update(i)) : this._$Ek();
    } catch (n) {
      throw t = !1, this._$Ek(), n;
    }
    t && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$ES) === null || t === void 0 || t.forEach((i) => {
      var n;
      return (n = i.hostUpdated) === null || n === void 0 ? void 0 : n.call(i);
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
    this._$EC !== void 0 && (this._$EC.forEach((t, i) => this._$EO(i, this[i], t)), this._$EC = void 0), this._$Ek();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
P[he] = !0, P.elementProperties = /* @__PURE__ */ new Map(), P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, Le == null || Le({ ReactiveElement: P }), ((se = W.reactiveElementVersions) !== null && se !== void 0 ? se : W.reactiveElementVersions = []).push("1.6.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var ne;
const Z = window, L = Z.trustedTypes, ke = L ? L.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, ue = "$lit$", _ = `lit$${(Math.random() + "").slice(9)}$`, We = "?" + _, mt = `<${We}>`, C = document, D = () => C.createComment(""), N = (s) => s === null || typeof s != "object" && typeof s != "function", Ze = Array.isArray, yt = (s) => Ze(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", oe = `[ 	
\f\r]`, R = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ie = /-->/g, Te = />/g, m = RegExp(`>|${oe}(?:([^\\s"'>=/]+)(${oe}*=${oe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ue = /'/g, Re = /"/g, Ke = /^(?:script|style|textarea|title)$/i, wt = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), v = wt(1), b = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), Me = /* @__PURE__ */ new WeakMap(), w = C.createTreeWalker(C, 129, null, !1);
function Ge(s, e) {
  if (!Array.isArray(s) || !s.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return ke !== void 0 ? ke.createHTML(e) : e;
}
const Ct = (s, e) => {
  const t = s.length - 1, i = [];
  let n, o = e === 2 ? "<svg>" : "", r = R;
  for (let a = 0; a < t; a++) {
    const l = s[a];
    let d, c, h = -1, p = 0;
    for (; p < l.length && (r.lastIndex = p, c = r.exec(l), c !== null); )
      p = r.lastIndex, r === R ? c[1] === "!--" ? r = Ie : c[1] !== void 0 ? r = Te : c[2] !== void 0 ? (Ke.test(c[2]) && (n = RegExp("</" + c[2], "g")), r = m) : c[3] !== void 0 && (r = m) : r === m ? c[0] === ">" ? (r = n != null ? n : R, h = -1) : c[1] === void 0 ? h = -2 : (h = r.lastIndex - c[2].length, d = c[1], r = c[3] === void 0 ? m : c[3] === '"' ? Re : Ue) : r === Re || r === Ue ? r = m : r === Ie || r === Te ? r = R : (r = m, n = void 0);
    const g = r === m && s[a + 1].startsWith("/>") ? " " : "";
    o += r === R ? l + mt : h >= 0 ? (i.push(d), l.slice(0, h) + ue + l.slice(h) + _ + g) : l + _ + (h === -2 ? (i.push(void 0), a) : g);
  }
  return [Ge(s, o + (s[t] || "<?>") + (e === 2 ? "</svg>" : "")), i];
};
class j {
  constructor({ strings: e, _$litType$: t }, i) {
    let n;
    this.parts = [];
    let o = 0, r = 0;
    const a = e.length - 1, l = this.parts, [d, c] = Ct(e, t);
    if (this.el = j.createElement(d, i), w.currentNode = this.el.content, t === 2) {
      const h = this.el.content, p = h.firstChild;
      p.remove(), h.append(...p.childNodes);
    }
    for (; (n = w.nextNode()) !== null && l.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) {
          const h = [];
          for (const p of n.getAttributeNames())
            if (p.endsWith(ue) || p.startsWith(_)) {
              const g = c[r++];
              if (h.push(p), g !== void 0) {
                const ht = n.getAttribute(g.toLowerCase() + ue).split(_), q = /([.?@])?(.*)/.exec(g);
                l.push({ type: 1, index: o, name: q[2], strings: ht, ctor: q[1] === "." ? At : q[1] === "?" ? St : q[1] === "@" ? Ot : Y });
              } else
                l.push({ type: 6, index: o });
            }
          for (const p of h)
            n.removeAttribute(p);
        }
        if (Ke.test(n.tagName)) {
          const h = n.textContent.split(_), p = h.length - 1;
          if (p > 0) {
            n.textContent = L ? L.emptyScript : "";
            for (let g = 0; g < p; g++)
              n.append(h[g], D()), w.nextNode(), l.push({ type: 2, index: ++o });
            n.append(h[p], D());
          }
        }
      } else if (n.nodeType === 8)
        if (n.data === We)
          l.push({ type: 2, index: o });
        else {
          let h = -1;
          for (; (h = n.data.indexOf(_, h + 1)) !== -1; )
            l.push({ type: 7, index: o }), h += _.length - 1;
        }
      o++;
    }
  }
  static createElement(e, t) {
    const i = C.createElement("template");
    return i.innerHTML = e, i;
  }
}
function k(s, e, t = s, i) {
  var n, o, r, a;
  if (e === b)
    return e;
  let l = i !== void 0 ? (n = t._$Co) === null || n === void 0 ? void 0 : n[i] : t._$Cl;
  const d = N(e) ? void 0 : e._$litDirective$;
  return (l == null ? void 0 : l.constructor) !== d && ((o = l == null ? void 0 : l._$AO) === null || o === void 0 || o.call(l, !1), d === void 0 ? l = void 0 : (l = new d(s), l._$AT(s, t, i)), i !== void 0 ? ((r = (a = t)._$Co) !== null && r !== void 0 ? r : a._$Co = [])[i] = l : t._$Cl = l), l !== void 0 && (e = k(s, l._$AS(s, e.values), l, i)), e;
}
class Et {
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
    const { el: { content: i }, parts: n } = this._$AD, o = ((t = e == null ? void 0 : e.creationScope) !== null && t !== void 0 ? t : C).importNode(i, !0);
    w.currentNode = o;
    let r = w.nextNode(), a = 0, l = 0, d = n[0];
    for (; d !== void 0; ) {
      if (a === d.index) {
        let c;
        d.type === 2 ? c = new z(r, r.nextSibling, this, e) : d.type === 1 ? c = new d.ctor(r, d.name, d.strings, this, e) : d.type === 6 && (c = new Pt(r, this, e)), this._$AV.push(c), d = n[++l];
      }
      a !== (d == null ? void 0 : d.index) && (r = w.nextNode(), a++);
    }
    return w.currentNode = C, o;
  }
  v(e) {
    let t = 0;
    for (const i of this._$AV)
      i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class z {
  constructor(e, t, i, n) {
    var o;
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = n, this._$Cp = (o = n == null ? void 0 : n.isConnected) === null || o === void 0 || o;
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
    e = k(this, e, t), N(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== b && this._(e) : e._$litType$ !== void 0 ? this.g(e) : e.nodeType !== void 0 ? this.$(e) : yt(e) ? this.T(e) : this._(e);
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
    const { values: i, _$litType$: n } = e, o = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = j.createElement(Ge(n.h, n.h[0]), this.options)), n);
    if (((t = this._$AH) === null || t === void 0 ? void 0 : t._$AD) === o)
      this._$AH.v(i);
    else {
      const r = new Et(o, this), a = r.u(this.options);
      r.v(i), this.$(a), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = Me.get(e.strings);
    return t === void 0 && Me.set(e.strings, t = new j(e)), t;
  }
  T(e) {
    Ze(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, n = 0;
    for (const o of e)
      n === t.length ? t.push(i = new z(this.k(D()), this.k(D()), this, this.options)) : i = t[n], i._$AI(o), n++;
    n < t.length && (this._$AR(i && i._$AB.nextSibling, n), t.length = n);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for ((i = this._$AP) === null || i === void 0 || i.call(this, !1, !0, t); e && e !== this._$AB; ) {
      const n = e.nextSibling;
      e.remove(), e = n;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cp = e, (t = this._$AP) === null || t === void 0 || t.call(this, e));
  }
}
class Y {
  constructor(e, t, i, n, o) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e, t = this, i, n) {
    const o = this.strings;
    let r = !1;
    if (o === void 0)
      e = k(this, e, t, 0), r = !N(e) || e !== this._$AH && e !== b, r && (this._$AH = e);
    else {
      const a = e;
      let l, d;
      for (e = o[0], l = 0; l < o.length - 1; l++)
        d = k(this, a[i + l], t, l), d === b && (d = this._$AH[l]), r || (r = !N(d) || d !== this._$AH[l]), d === u ? e = u : e !== u && (e += (d != null ? d : "") + o[l + 1]), this._$AH[l] = d;
    }
    r && !n && this.j(e);
  }
  j(e) {
    e === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e != null ? e : "");
  }
}
class At extends Y {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === u ? void 0 : e;
  }
}
const xt = L ? L.emptyScript : "";
class St extends Y {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    e && e !== u ? this.element.setAttribute(this.name, xt) : this.element.removeAttribute(this.name);
  }
}
class Ot extends Y {
  constructor(e, t, i, n, o) {
    super(e, t, i, n, o), this.type = 5;
  }
  _$AI(e, t = this) {
    var i;
    if ((e = (i = k(this, e, t, 0)) !== null && i !== void 0 ? i : u) === b)
      return;
    const n = this._$AH, o = e === u && n !== u || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, r = e !== u && (n === u || o);
    o && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t, i;
    typeof this._$AH == "function" ? this._$AH.call((i = (t = this.options) === null || t === void 0 ? void 0 : t.host) !== null && i !== void 0 ? i : this.element, e) : this._$AH.handleEvent(e);
  }
}
class Pt {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    k(this, e);
  }
}
const He = Z.litHtmlPolyfillSupport;
He == null || He(j, z), ((ne = Z.litHtmlVersions) !== null && ne !== void 0 ? ne : Z.litHtmlVersions = []).push("2.8.0");
const Lt = (s, e, t) => {
  var i, n;
  const o = (i = t == null ? void 0 : t.renderBefore) !== null && i !== void 0 ? i : e;
  let r = o._$litPart$;
  if (r === void 0) {
    const a = (n = t == null ? void 0 : t.renderBefore) !== null && n !== void 0 ? n : null;
    o._$litPart$ = r = new z(e.insertBefore(D(), a), a, void 0, t != null ? t : {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var re, le;
let f = class extends P {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e, t;
    const i = super.createRenderRoot();
    return (e = (t = this.renderOptions).renderBefore) !== null && e !== void 0 || (t.renderBefore = i.firstChild), i;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Lt(t, this.renderRoot, this.renderOptions);
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
    return b;
  }
};
f.finalized = !0, f._$litElement$ = !0, (re = globalThis.litElementHydrateSupport) === null || re === void 0 || re.call(globalThis, { LitElement: f });
const De = globalThis.litElementPolyfillSupport;
De == null || De({ LitElement: f });
((le = globalThis.litElementVersions) !== null && le !== void 0 ? le : globalThis.litElementVersions = []).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = (s) => (e) => typeof e == "function" ? ((t, i) => (customElements.define(t, i), i))(s, e) : ((t, i) => {
  const { kind: n, elements: o } = i;
  return { kind: n, elements: o, finisher(r) {
    customElements.define(t, r);
  } };
})(s, e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kt = (s, e) => e.kind === "method" && e.descriptor && !("value" in e.descriptor) ? O(S({}, e), { finisher(t) {
  t.createProperty(e.key, s);
} }) : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e.key, initializer() {
  typeof e.initializer == "function" && (this[e.key] = e.initializer.call(this));
}, finisher(t) {
  t.createProperty(e.key, s);
} }, It = (s, e, t) => {
  e.constructor.createProperty(t, s);
};
function x(s) {
  return (e, t) => t !== void 0 ? It(s, e, t) : kt(s, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ee(s) {
  return x(O(S({}, s), { state: !0 }));
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = ({ finisher: s, descriptor: e }) => (t, i) => {
  var n;
  if (i === void 0) {
    const o = (n = t.originalKey) !== null && n !== void 0 ? n : t.key, r = e != null ? { kind: "method", placement: "prototype", key: o, descriptor: e(t.key) } : O(S({}, t), { key: o });
    return s != null && (r.finisher = function(a) {
      s(a, o);
    }), r;
  }
  {
    const o = t.constructor;
    e !== void 0 && Object.defineProperty(t, i, e(i)), s == null || s(o, i);
  }
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var ae;
((ae = window.HTMLSlotElement) === null || ae === void 0 ? void 0 : ae.prototype.assignedElements) != null;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function pe(s, e, t) {
  return s ? e() : t == null ? void 0 : t();
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Tt = (s, e, t) => {
  for (const i of e)
    if (i[0] === s)
      return (0, i[1])();
  return t == null ? void 0 : t();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xe = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, Je = (s) => (...e) => ({ _$litDirective$: s, values: e });
let Ye = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, i) {
    this._$Ct = e, this._$AM = t, this._$Ci = i;
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
let ve = class extends Ye {
  constructor(e) {
    if (super(e), this.et = u, e.type !== Xe.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === u || e == null)
      return this.ft = void 0, this.et = e;
    if (e === b)
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
const Ce = Je(fe);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ut = (s, ...e) => ({
  strTag: !0,
  strings: s,
  values: e
}), K = Ut, Rt = (s) => typeof s != "string" && "strTag" in s, et = (s, e, t) => {
  let i = s[0];
  for (let n = 1; n < s.length; n++)
    i += e[t ? t[n - 1] : n - 1], i += s[n];
  return i;
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const tt = (s) => Rt(s) ? et(s.strings, s.values) : s;
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
class Mt {
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
const Ht = (s) => s.addController(new Mt(s)), st = Ht;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dt = () => (s) => typeof s == "function" ? jt(s) : Nt(s), Ee = Dt, Nt = ({ kind: s, elements: e }) => ({
  kind: s,
  elements: e,
  finisher(t) {
    t.addInitializer(st);
  }
}), jt = (s) => (s.addInitializer(st), s);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class it {
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
for (let s = 0; s < 256; s++)
  $[s] = (s >> 4 & 15).toString(16) + (s & 15).toString(16);
function zt(s) {
  let e = 0, t = 8997, i = 0, n = 33826, o = 0, r = 40164, a = 0, l = 52210;
  for (let d = 0; d < s.length; d++)
    t ^= s.charCodeAt(d), e = t * 435, i = n * 435, o = r * 435, a = l * 435, o += t << 8, a += n << 8, i += e >>> 16, t = e & 65535, o += i >>> 16, n = i & 65535, l = a + (o >>> 16) & 65535, r = o & 65535;
  return $[l >> 8] + $[l & 255] + $[r >> 8] + $[r & 255] + $[n >> 8] + $[n & 255] + $[t >> 8] + $[t & 255];
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qt = "", Vt = "h", Bt = "s";
function Qt(s, e) {
  return (e ? Vt : Bt) + zt(typeof s == "string" ? s : s.join(qt));
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ne = /* @__PURE__ */ new WeakMap(), je = /* @__PURE__ */ new Map();
function Wt(s, e, t) {
  var i;
  if (s) {
    const n = (i = t == null ? void 0 : t.id) !== null && i !== void 0 ? i : Zt(e), o = s[n];
    if (o) {
      if (typeof o == "string")
        return o;
      if ("strTag" in o)
        return et(
          o.strings,
          // Cast `template` because its type wasn't automatically narrowed (but
          // we know it must be the same type as `localized`).
          e.values,
          o.values
        );
      {
        let r = Ne.get(o);
        return r === void 0 && (r = o.values, Ne.set(o, r)), O(S({}, o), {
          values: r.map((a) => e.values[a])
        });
      }
    }
  }
  return tt(e);
}
function Zt(s) {
  const e = typeof s == "string" ? s : s.strings;
  let t = je.get(e);
  return t === void 0 && (t = Qt(e, typeof s != "string" && !("strTag" in s)), je.set(e, t)), t;
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function de(s) {
  window.dispatchEvent(new CustomEvent(ge, { detail: s }));
}
let G = "", M, nt, F, $e, ot, y = new it();
y.resolve();
let B = 0;
const Kt = (s) => (Xt((e, t) => Wt(ot, e, t)), G = nt = s.sourceLocale, F = new Set(s.targetLocales), F.add(s.sourceLocale), $e = s.loadLocale, { getLocale: Gt, setLocale: Ft }), Gt = () => G, Ft = (s) => {
  if (s === (M != null ? M : G))
    return y.promise;
  if (!F || !$e)
    throw new Error("Internal error");
  if (!F.has(s))
    throw new Error("Invalid locale code");
  B++;
  const e = B;
  return M = s, y.settled && (y = new it()), de({ status: "loading", loadingLocale: s }), (s === nt ? (
    // We could switch to the source locale synchronously, but we prefer to
    // queue it on a microtask so that switching locales is consistently
    // asynchronous.
    Promise.resolve({ templates: void 0 })
  ) : $e(s)).then((i) => {
    B === e && (G = s, M = void 0, ot = i.templates, de({ status: "ready", readyLocale: s }), y.resolve());
  }, (i) => {
    B === e && (de({
      status: "error",
      errorLocale: s,
      errorMessage: i.toString()
    }), y.reject(i));
  }), y.promise;
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let H = tt, ze = !1;
function Xt(s) {
  if (ze)
    throw new Error("lit-localize can only be configured once");
  H = s, ze = !0;
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Jt = class extends Event {
  constructor(e, t, i) {
    super("context-request", { bubbles: !0, composed: !0 }), this.context = e, this.callback = t, this.subscribe = i;
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
let Yt = class {
  constructor(e, t, i, n) {
    var o;
    if (this.subscribe = !1, this.provided = !1, this.value = void 0, this.t = (r, a) => {
      this.unsubscribe && (this.unsubscribe !== a && (this.provided = !1, this.unsubscribe()), this.subscribe || this.unsubscribe()), this.value = r, this.host.requestUpdate(), this.provided && !this.subscribe || (this.provided = !0, this.callback && this.callback(r, a)), this.unsubscribe = a;
    }, this.host = e, t.context !== void 0) {
      const r = t;
      this.context = r.context, this.callback = r.callback, this.subscribe = (o = r.subscribe) !== null && o !== void 0 && o;
    } else
      this.context = t, this.callback = i, this.subscribe = n != null && n;
    this.host.addController(this);
  }
  hostConnected() {
    this.dispatchRequest();
  }
  hostDisconnected() {
    this.unsubscribe && (this.unsubscribe(), this.unsubscribe = void 0);
  }
  dispatchRequest() {
    this.host.dispatchEvent(new Jt(this.context, this.t, this.subscribe));
  }
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let es = class {
  constructor(e) {
    this.disposers = /* @__PURE__ */ new Map(), this.updateObservers = () => {
      for (const [t, i] of this.disposers)
        t(this.o, i);
    }, e !== void 0 && (this.value = e);
  }
  get value() {
    return this.o;
  }
  set value(e) {
    this.setValue(e);
  }
  setValue(e, t = !1) {
    const i = t || !Object.is(e, this.o);
    this.o = e, i && this.updateObservers();
  }
  addCallback(e, t) {
    if (t) {
      this.disposers.has(e) || this.disposers.set(e, () => {
        this.disposers.delete(e);
      });
      const i = this.disposers.get(e);
      e(this.value, i);
    } else
      e(this.value);
  }
  clearCallbacks() {
    this.disposers.clear();
  }
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class ts extends Event {
  constructor(e) {
    super("context-provider", { bubbles: !0, composed: !0 }), this.context = e;
  }
}
class ss extends es {
  constructor(e, t, i) {
    super(t.context !== void 0 ? t.initialValue : i), this.onContextRequest = (n) => {
      n.context === this.context && n.composedPath()[0] !== this.host && (n.stopPropagation(), this.addCallback(n.callback, n.subscribe));
    }, this.host = e, t.context !== void 0 ? this.context = t.context : this.context = t, this.attachListeners(), this.host.addController(this);
  }
  attachListeners() {
    this.host.addEventListener("context-request", this.onContextRequest);
  }
  hostConnected() {
    this.host.dispatchEvent(new ts(this.context));
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function is({ context: s }) {
  return Fe({ finisher: (e, t) => {
    const i = /* @__PURE__ */ new WeakMap();
    e.addInitializer((a) => {
      i.set(a, new ss(a, { context: s }));
    });
    const n = Object.getOwnPropertyDescriptor(e.prototype, t), o = n == null ? void 0 : n.set, r = O(S({}, n), { set: function(a) {
      var l;
      (l = i.get(this)) === null || l === void 0 || l.setValue(a), o && o.call(this, a);
    } });
    Object.defineProperty(e.prototype, t, r);
  } });
}
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ns({ context: s, subscribe: e }) {
  return Fe({ finisher: (t, i) => {
    t.addInitializer((n) => {
      new Yt(n, { context: s, callback: (o) => {
        n[i] = o;
      }, subscribe: e });
    });
  } });
}
var os = { BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 };
const rt = Symbol("io-link-provider"), qe = (s, e) => {
  const t = new URL(s, os.VITE_IO_LINK_BASE_URL);
  return Object.entries(e).forEach(([i, n]) => {
    t.searchParams.append(i, n);
  }), t;
};
class rs {
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
const lt = "en", ls = ["it"], as = {
  h74a43a08a000928c: v`Per vedere e firmare i documenti su IO, inquadra<br>questo codice con il tuo dispositivo`,
  ha0d71407af1d41f6: v`Stiamo preparando i<br>documenti...`,
  s0cdf4f51e13b8947: K`Inquadra il codice QR`,
  s986aec5a433b6eb5: K`Non hai l’app IO? Scaricala ora`
}, ds = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  templates: as
}, Symbol.toStringTag, { value: "Module" })), cs = /* @__PURE__ */ new Map([["it", ds]]), { setLocale: hs } = Kt({
  sourceLocale: lt,
  targetLocales: ls,
  loadLocale: (s) => V(void 0, null, function* () {
    const e = cs.get(s);
    if (typeof e == "undefined")
      throw new Error(`Unable to local ${s} locale: templates not found.`);
    return e;
  })
}), us = () => V(void 0, null, function* () {
  const [s] = navigator.language.split("-");
  try {
    hs(s);
  } catch (e) {
    console.warn(
      `Missing locale data for: "${navigator.language}". Using default locale: "${lt}" as fallback.`
    );
  }
}), ps = `<svg
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
var vs = Object.defineProperty, fs = Object.getOwnPropertyDescriptor, at = (s, e, t, i) => {
  for (var n = i > 1 ? void 0 : i ? fs(e, t) : e, o = s.length - 1, r; o >= 0; o--)
    (r = s[o]) && (n = (i ? r(e, t, n) : r(n)) || n);
  return i && n && vs(e, t, n), n;
};
let X = class extends f {
  constructor() {
    super(...arguments), this.disabled = !1;
  }
  render() {
    return v`<button ?disabled="${this.disabled}"><slot></slot></button>`;
  }
};
X.styles = T`:host{--io-button-bg-color:var(--io-primary-color, #0073e6)}button{display:flex;flex-direction:row;justify-content:space-between;align-items:center;font-family:var(--io-font-family,sans-serif);border:0;height:40px;font-size:1em;font-weight:700;padding:.5em 1.2em;border-radius:var(--io-border-radius,4px);min-width:155px;background:var(--io-button-bg-color);color:var(--io-button-color,#fff);transition:filter 250ms cubic-bezier(.4,0,.2,1) 0s}button:hover:not(:disabled){cursor:pointer;filter:brightness(.9)}button:disabled{background-color:var(--io-button-disabled-bg-color,rgba(23,50,77,.12));color:var(--io-button-disabled-color,rgba(23,50,77,.26))}`;
at([
  x({
    type: Boolean
  })
], X.prototype, "disabled", 2);
X = at([
  A("io-button")
], X);
var gs = Object.defineProperty, $s = Object.getOwnPropertyDescriptor, _s = (s, e, t, i) => {
  for (var n = i > 1 ? void 0 : i ? $s(e, t) : e, o = s.length - 1, r; o >= 0; o--)
    (r = s[o]) && (n = (i ? r(e, t, n) : r(n)) || n);
  return i && n && gs(e, t, n), n;
};
let _e = class extends f {
  render() {
    return v`<span></span>`;
  }
};
_e.styles = T`:host{display:inline-block;height:1em;position:relative;overflow:hidden;width:100%;border-radius:5px;background-color:var(--io-skeleton-bg-color,rgb(255,255,255,.3))}@keyframes translate{100%{transform:translateX(100%)}}span{position:absolute;top:0;right:0;bottom:0;left:0;transform:translateX(-100%);background-image:linear-gradient(90deg,rgba(255,255,255,0) 0,rgba(255,255,255,.2) 20%,rgba(255,255,255,.3) 60%,rgba(255,255,255,0));animation:translate 2s infinite}`;
_e = _s([
  A("io-skeleton")
], _e);
const bs = `<svg
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
var ms = Object.defineProperty, ys = Object.getOwnPropertyDescriptor, ws = (s, e, t, i) => {
  for (var n = i > 1 ? void 0 : i ? ys(e, t) : e, o = s.length - 1, r; o >= 0; o--)
    (r = s[o]) && (n = (i ? r(e, t, n) : r(n)) || n);
  return i && n && ms(e, t, n), n;
};
let be = class extends f {
  render() {
    return Ce(bs);
  }
};
be.styles = T`stop{stop-color:var(--io-spinner-color,#fff)}@keyframes spin{100%{transform:rotate(360deg)}}:host{display:inline-flex;margin:0 auto;animation:spin 1s linear infinite}svg{width:var(--io-spinner-size,24px);height:var(--io-spinner-size,24px)}`;
be = ws([
  A("io-spinner")
], be);
const Cs = `<svg
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
var Es = Object.defineProperty, As = Object.getOwnPropertyDescriptor, dt = (s, e, t, i) => {
  for (var n = i > 1 ? void 0 : i ? As(e, t) : e, o = s.length - 1, r; o >= 0; o--)
    (r = s[o]) && (n = (i ? r(e, t, n) : r(n)) || n);
  return i && n && Es(e, t, n), n;
};
let J = class extends f {
  constructor() {
    super(...arguments), this.disableClose = !1;
  }
  handleClick(s) {
    s.stopPropagation();
  }
  dispatchClose() {
    this.dispatchEvent(new Event("close", { bubbles: !0, composed: !0 }));
  }
  render() {
    return v`<div class="backdrop" @click="${this.dispatchClose}"><div class="dialog" @click="${this.handleClick}"><header>${pe(
      !this.disableClose,
      () => v`<button class="close" @click="${this.dispatchClose}">${Ce(Cs)}</button>`
    )}</header><main><slot></slot></main></div></div>`;
  }
};
J.styles = T`.backdrop{display:flex;align-items:center;justify-content:center;position:fixed;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(23,24,26,.4)}.dialog{font-family:var(--io-font-family,sans-serif);color:var(--io-dialog-color,#17324d);background-color:var(--io-dialog-bg-color,#fff);text-align:center;border-radius:var(--io-border-radius,4px);padding:1em;min-width:300px}.dialog header{display:flex;flex-direction:row;justify-content:flex-end}.dialog button.close{border:0;background:0 0;padding:0;margin:0}.dialog button.close:hover{filter:brightness(.9);cursor:pointer}`;
dt([
  x({ attribute: "disable-close", type: Boolean })
], J.prototype, "disableClose", 2);
J = dt([
  A("io-dialog")
], J);
var xs = Object.defineProperty, Ss = Object.getOwnPropertyDescriptor, te = (s, e, t, i) => {
  for (var n = i > 1 ? void 0 : i ? Ss(e, t) : e, o = s.length - 1, r; o >= 0; o--)
    (r = s[o]) && (n = (i ? r(e, t, n) : r(n)) || n);
  return i && n && xs(e, t, n), n;
};
let I = class extends f {
  get qrCodeUrl() {
    if (this.signatureRequestId && this.IOLinkProvider)
      return this.IOLinkProvider.getQrCodeUrl(this.signatureRequestId).href;
  }
  render() {
    return v`<io-dialog><div class="content"><h1>${H(K`Scan the QR code`)}</h1><p>${H(
      v`To view and sign the documents with IO,<br>scan this code with your device`
    )}</p><div><img class="qr-code" src="${this.qrCodeUrl}"></div><span>${H(K`Don’t have the IO app? Download it now`)}</span><div class="app-badges"><a href="https://apps.apple.com/it/app/io/id1501681835" style="display:inline-block;overflow:hidden;border-radius:13px"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/it-it?size=250x83&releaseDate=1586995200" alt="Download on the App Store" style="border-radius:13px;height:40px;width:120px"></a><a href="https://play.google.com/store/apps/details?id=it.pagopa.io.app"><img alt="Disponibile su Google Play" style="height:50px;width:130px" src="https://play.google.com/intl/en_us/badges/static/images/badges/it_badge_web_generic.png"></a></div></div></io-dialog>`;
  }
};
I.styles = T`h1{font-size:1.625em}.app-badges{display:flex;flex-direction:row;align-items:center;justify-content:center;padding:10px}.app-badges a{margin:0 5px}.qr-code{width:150px;height:150px}`;
te([
  ns({ context: rt }),
  x({ attribute: !1 })
], I.prototype, "IOLinkProvider", 2);
te([
  x({
    type: String
  })
], I.prototype, "signatureRequestId", 2);
te([
  ee()
], I.prototype, "qrCodeUrl", 1);
I = te([
  Ee(),
  A("io-sign-qr-dialog")
], I);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct = "important", Os = " !" + ct, Ps = Je(class extends Ye {
  constructor(s) {
    var e;
    if (super(s), s.type !== Xe.ATTRIBUTE || s.name !== "style" || ((e = s.strings) === null || e === void 0 ? void 0 : e.length) > 2)
      throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(s) {
    return Object.keys(s).reduce((e, t) => {
      const i = s[t];
      return i == null ? e : e + `${t = t.includes("-") ? t : t.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${i};`;
    }, "");
  }
  update(s, [e]) {
    const { style: t } = s.element;
    if (this.ht === void 0) {
      this.ht = /* @__PURE__ */ new Set();
      for (const i in e)
        this.ht.add(i);
      return this.render(e);
    }
    this.ht.forEach((i) => {
      e[i] == null && (this.ht.delete(i), i.includes("-") ? t.removeProperty(i) : t[i] = "");
    });
    for (const i in e) {
      const n = e[i];
      if (n != null) {
        this.ht.add(i);
        const o = typeof n == "string" && n.endsWith(Os);
        i.includes("-") || o ? t.setProperty(i, o ? n.slice(0, -11) : n, o ? ct : "") : t[i] = n;
      }
    }
    return b;
  }
});
var Ls = Object.defineProperty, ks = Object.getOwnPropertyDescriptor, Is = (s, e, t, i) => {
  for (var n = i > 1 ? void 0 : i ? ks(e, t) : e, o = s.length - 1, r; o >= 0; o--)
    (r = s[o]) && (n = (i ? r(e, t, n) : r(n)) || n);
  return i && n && Ls(e, t, n), n;
};
let me = class extends f {
  render() {
    return v`<io-dialog disable-close><div class="content"><p>${H(v`Stiamo preparando i<br>documenti...`)}</p><io-spinner style="${Ps({
      "--io-spinner-color": "#0073E6",
      "--io-spinner-size": "40px"
    })}"></io-spinner></div></io-dialog>`;
  }
};
me.styles = T`p{font-size:1.5em;line-height:28px}.content{margin-top:40%;margin-bottom:40%}`;
me = Is([
  Ee(),
  A("io-sign-loader-dialog")
], me);
var Ve = { BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 }, Ts = Object.defineProperty, Us = Object.getOwnPropertyDescriptor, U = (s, e, t, i) => {
  for (var n = i > 1 ? void 0 : i ? Us(e, t) : e, o = s.length - 1, r; o >= 0; o--)
    (r = s[o]) && (n = (i ? r(e, t, n) : r(n)) || n);
  return i && n && Ts(e, t, n), n;
};
us();
let E = class extends f {
  constructor() {
    super(...arguments), this.disabled = !1, this.state = "activating", this.showQrCode = !1, this.IOLinkProvider = new rs(), this.theme = null;
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
      e.id = "io-sign-theme-css", e.rel = "stylesheet", e.href = Ve.VITE_THEME_URL, e.addEventListener("load", () => {
        this.state = "idle";
      }), this.theme = document.head.appendChild(e);
    } else
      this.state = "idle";
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.theme !== null && document.head.removeChild(this.theme);
  }
  handleClick(s) {
    s.preventDefault(), !(this.disabled || this.state !== "idle") && (this.state = "loading", this.dispatchEvent(
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
  redirectOrShowQrCode(s) {
    if (this.state = "idle", this.signatureRequestId = s, /iPhone|Android/i.test(navigator.userAgent)) {
      const t = new URL(
        `/fci/main?signatureRequestId=${this.signatureRequestId}`,
        Ve.VITE_IO_LINK_BASE_URL
      );
      window.location.href = t.href;
    } else
      this.showQrCode = !0;
  }
  render() {
    return v`<io-button @click="${this.handleClick}" ?disabled="${this.disabled}">${Tt(
      this.state,
      [
        ["activating", () => v`<io-skeleton></io-skeleton>`],
        ["loading", () => v`<io-spinner></io-spinner>`]
      ],
      () => v`${Ce(ps)} Firma con IO`
    )}</io-button>${pe(
      this.showQrCode && this.signatureRequestId,
      () => v`<io-sign-qr-dialog .signatureRequestId="${this.signatureRequestId}" @close="${this.handleClose}"></io-sign-qr-dialog>`
    )} ${pe(
      this.state === "loading",
      () => v`<io-sign-loader-dialog @close="${this.handleClose}"></io-sign-loader-dialog>`
    )}`;
  }
};
U([
  x({
    type: Boolean
  })
], E.prototype, "disabled", 2);
U([
  ee()
], E.prototype, "state", 2);
U([
  ee()
], E.prototype, "signatureRequestId", 2);
U([
  ee()
], E.prototype, "showQrCode", 2);
U([
  is({ context: rt }),
  x({ attribute: !1 })
], E.prototype, "IOLinkProvider", 2);
E = U([
  A("io-sign"),
  Ee()
], E);
export {
  E as IOSignElement
};
