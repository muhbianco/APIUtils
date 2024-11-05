/**
* @vue/shared v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function Ts(t, e) {
  const n = new Set(t.split(","));
  return (r) => n.has(r);
}
const pe = {}, jt = [], $e = () => {
}, Za = () => !1, pr = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // uppercase letter
(t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97), Ds = (t) => t.startsWith("onUpdate:"), ye = Object.assign, Rs = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, Wa = Object.prototype.hasOwnProperty, ie = (t, e) => Wa.call(t, e), J = Array.isArray, Kt = (t) => dr(t) === "[object Map]", Zc = (t) => dr(t) === "[object Set]", ne = (t) => typeof t == "function", me = (t) => typeof t == "string", tn = (t) => typeof t == "symbol", de = (t) => t !== null && typeof t == "object", Wc = (t) => (de(t) || ne(t)) && ne(t.then) && ne(t.catch), Jc = Object.prototype.toString, dr = (t) => Jc.call(t), Ja = (t) => dr(t).slice(8, -1), Yc = (t) => dr(t) === "[object Object]", Ls = (t) => me(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, pn = /* @__PURE__ */ Ts(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), gr = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, Ya = /-(\w)/g, Qe = gr((t) => t.replace(Ya, (e, n) => n ? n.toUpperCase() : "")), Xa = /\B([A-Z])/g, Ft = gr(
  (t) => t.replace(Xa, "-$1").toLowerCase()
), mr = gr((t) => t.charAt(0).toUpperCase() + t.slice(1)), Br = gr((t) => t ? `on${mr(t)}` : ""), _t = (t, e) => !Object.is(t, e), Zn = (t, e) => {
  for (let n = 0; n < t.length; n++)
    t[n](e);
}, Qn = (t, e, n) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    value: n
  });
}, fs = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
}, Qa = (t) => {
  const e = me(t) ? Number(t) : NaN;
  return isNaN(e) ? t : e;
};
let mo;
const Xc = () => mo || (mo = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Tn(t) {
  if (J(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const r = t[n], s = me(r) ? rl(r) : Tn(r);
      if (s)
        for (const o in s)
          e[o] = s[o];
    }
    return e;
  } else if (me(t) || de(t))
    return t;
}
const el = /;(?![^(]*\))/g, tl = /:([^]+)/, nl = /\/\*[^]*?\*\//g;
function rl(t) {
  const e = {};
  return t.replace(nl, "").split(el).forEach((n) => {
    if (n) {
      const r = n.split(tl);
      r.length > 1 && (e[r[0].trim()] = r[1].trim());
    }
  }), e;
}
function nn(t) {
  let e = "";
  if (me(t))
    e = t;
  else if (J(t))
    for (let n = 0; n < t.length; n++) {
      const r = nn(t[n]);
      r && (e += r + " ");
    }
  else if (de(t))
    for (const n in t)
      t[n] && (e += n + " ");
  return e.trim();
}
function hs(t) {
  if (!t)
    return null;
  let { class: e, style: n } = t;
  return e && !me(e) && (t.class = nn(e)), n && (t.style = Tn(n)), t;
}
const sl = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", ol = /* @__PURE__ */ Ts(sl);
function Qc(t) {
  return !!t || t === "";
}
const vn = (t) => me(t) ? t : t == null ? "" : J(t) || de(t) && (t.toString === Jc || !ne(t.toString)) ? JSON.stringify(t, ei, 2) : String(t), ei = (t, e) => e && e.__v_isRef ? ei(t, e.value) : Kt(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce(
    (n, [r, s], o) => (n[Pr(r, o) + " =>"] = s, n),
    {}
  )
} : Zc(e) ? {
  [`Set(${e.size})`]: [...e.values()].map((n) => Pr(n))
} : tn(e) ? Pr(e) : de(e) && !J(e) && !Yc(e) ? String(e) : e, Pr = (t, e = "") => {
  var n;
  return tn(t) ? `Symbol(${(n = t.description) != null ? n : e})` : t;
};
/**
* @vue/reactivity v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let qe;
class cl {
  constructor(e = !1) {
    this.detached = e, this._active = !0, this.effects = [], this.cleanups = [], this.parent = qe, !e && qe && (this.index = (qe.scopes || (qe.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  run(e) {
    if (this._active) {
      const n = qe;
      try {
        return qe = this, e();
      } finally {
        qe = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    qe = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    qe = this.parent;
  }
  stop(e) {
    if (this._active) {
      let n, r;
      for (n = 0, r = this.effects.length; n < r; n++)
        this.effects[n].stop();
      for (n = 0, r = this.cleanups.length; n < r; n++)
        this.cleanups[n]();
      if (this.scopes)
        for (n = 0, r = this.scopes.length; n < r; n++)
          this.scopes[n].stop(!0);
      if (!this.detached && this.parent && !e) {
        const s = this.parent.scopes.pop();
        s && s !== this && (this.parent.scopes[this.index] = s, s.index = this.index);
      }
      this.parent = void 0, this._active = !1;
    }
  }
}
function il(t, e = qe) {
  e && e.active && e.effects.push(t);
}
function ti() {
  return qe;
}
function al(t) {
  qe && qe.cleanups.push(t);
}
let Nt;
class Ns {
  constructor(e, n, r, s) {
    this.fn = e, this.trigger = n, this.scheduler = r, this.active = !0, this.deps = [], this._dirtyLevel = 4, this._trackId = 0, this._runnings = 0, this._shouldSchedule = !1, this._depsLength = 0, il(this, s);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1, Bt();
      for (let e = 0; e < this._depsLength; e++) {
        const n = this.deps[e];
        if (n.computed && (ll(n.computed), this._dirtyLevel >= 4))
          break;
      }
      this._dirtyLevel === 1 && (this._dirtyLevel = 0), Pt();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(e) {
    this._dirtyLevel = e ? 4 : 0;
  }
  run() {
    if (this._dirtyLevel = 0, !this.active)
      return this.fn();
    let e = gt, n = Nt;
    try {
      return gt = !0, Nt = this, this._runnings++, _o(this), this.fn();
    } finally {
      bo(this), this._runnings--, Nt = n, gt = e;
    }
  }
  stop() {
    var e;
    this.active && (_o(this), bo(this), (e = this.onStop) == null || e.call(this), this.active = !1);
  }
}
function ll(t) {
  return t.value;
}
function _o(t) {
  t._trackId++, t._depsLength = 0;
}
function bo(t) {
  if (t.deps.length > t._depsLength) {
    for (let e = t._depsLength; e < t.deps.length; e++)
      ni(t.deps[e], t);
    t.deps.length = t._depsLength;
  }
}
function ni(t, e) {
  const n = t.get(e);
  n !== void 0 && e._trackId !== n && (t.delete(e), t.size === 0 && t.cleanup());
}
let gt = !0, ps = 0;
const ri = [];
function Bt() {
  ri.push(gt), gt = !1;
}
function Pt() {
  const t = ri.pop();
  gt = t === void 0 ? !0 : t;
}
function Is() {
  ps++;
}
function Ms() {
  for (ps--; !ps && ds.length; )
    ds.shift()();
}
function si(t, e, n) {
  if (e.get(t) !== t._trackId) {
    e.set(t, t._trackId);
    const r = t.deps[t._depsLength];
    r !== e ? (r && ni(r, t), t.deps[t._depsLength++] = e) : t._depsLength++;
  }
}
const ds = [];
function oi(t, e, n) {
  Is();
  for (const r of t.keys()) {
    let s;
    r._dirtyLevel < e && (s ?? (s = t.get(r) === r._trackId)) && (r._shouldSchedule || (r._shouldSchedule = r._dirtyLevel === 0), r._dirtyLevel = e), r._shouldSchedule && (s ?? (s = t.get(r) === r._trackId)) && (r.trigger(), (!r._runnings || r.allowRecurse) && r._dirtyLevel !== 2 && (r._shouldSchedule = !1, r.scheduler && ds.push(r.scheduler)));
  }
  Ms();
}
const ci = (t, e) => {
  const n = /* @__PURE__ */ new Map();
  return n.cleanup = t, n.computed = e, n;
}, er = /* @__PURE__ */ new WeakMap(), It = Symbol(""), gs = Symbol("");
function Me(t, e, n) {
  if (gt && Nt) {
    let r = er.get(t);
    r || er.set(t, r = /* @__PURE__ */ new Map());
    let s = r.get(n);
    s || r.set(n, s = ci(() => r.delete(n))), si(
      Nt,
      s
    );
  }
}
function rt(t, e, n, r, s, o) {
  const c = er.get(t);
  if (!c)
    return;
  let i = [];
  if (e === "clear")
    i = [...c.values()];
  else if (n === "length" && J(t)) {
    const a = Number(r);
    c.forEach((l, u) => {
      (u === "length" || !tn(u) && u >= a) && i.push(l);
    });
  } else
    switch (n !== void 0 && i.push(c.get(n)), e) {
      case "add":
        J(t) ? Ls(n) && i.push(c.get("length")) : (i.push(c.get(It)), Kt(t) && i.push(c.get(gs)));
        break;
      case "delete":
        J(t) || (i.push(c.get(It)), Kt(t) && i.push(c.get(gs)));
        break;
      case "set":
        Kt(t) && i.push(c.get(It));
        break;
    }
  Is();
  for (const a of i)
    a && oi(
      a,
      4
    );
  Ms();
}
function ul(t, e) {
  var n;
  return (n = er.get(t)) == null ? void 0 : n.get(e);
}
const fl = /* @__PURE__ */ Ts("__proto__,__v_isRef,__isVue"), ii = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(tn)
), vo = /* @__PURE__ */ hl();
function hl() {
  const t = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((e) => {
    t[e] = function(...n) {
      const r = ae(this);
      for (let o = 0, c = this.length; o < c; o++)
        Me(r, "get", o + "");
      const s = r[e](...n);
      return s === -1 || s === !1 ? r[e](...n.map(ae)) : s;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((e) => {
    t[e] = function(...n) {
      Bt(), Is();
      const r = ae(this)[e].apply(this, n);
      return Ms(), Pt(), r;
    };
  }), t;
}
function pl(t) {
  const e = ae(this);
  return Me(e, "has", t), e.hasOwnProperty(t);
}
class ai {
  constructor(e = !1, n = !1) {
    this._isReadonly = e, this._isShallow = n;
  }
  get(e, n, r) {
    const s = this._isReadonly, o = this._isShallow;
    if (n === "__v_isReactive")
      return !s;
    if (n === "__v_isReadonly")
      return s;
    if (n === "__v_isShallow")
      return o;
    if (n === "__v_raw")
      return r === (s ? o ? Cl : hi : o ? fi : ui).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(r) ? e : void 0;
    const c = J(e);
    if (!s) {
      if (c && ie(vo, n))
        return Reflect.get(vo, n, r);
      if (n === "hasOwnProperty")
        return pl;
    }
    const i = Reflect.get(e, n, r);
    return (tn(n) ? ii.has(n) : fl(n)) || (s || Me(e, "get", n), o) ? i : Se(i) ? c && Ls(n) ? i : i.value : de(i) ? s ? Bs(i) : Fs(i) : i;
  }
}
class li extends ai {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, n, r, s) {
    let o = e[n];
    if (!this._isShallow) {
      const a = Xt(o);
      if (!tr(r) && !Xt(r) && (o = ae(o), r = ae(r)), !J(e) && Se(o) && !Se(r))
        return a ? !1 : (o.value = r, !0);
    }
    const c = J(e) && Ls(n) ? Number(n) < e.length : ie(e, n), i = Reflect.set(e, n, r, s);
    return e === ae(s) && (c ? _t(r, o) && rt(e, "set", n, r) : rt(e, "add", n, r)), i;
  }
  deleteProperty(e, n) {
    const r = ie(e, n);
    e[n];
    const s = Reflect.deleteProperty(e, n);
    return s && r && rt(e, "delete", n, void 0), s;
  }
  has(e, n) {
    const r = Reflect.has(e, n);
    return (!tn(n) || !ii.has(n)) && Me(e, "has", n), r;
  }
  ownKeys(e) {
    return Me(
      e,
      "iterate",
      J(e) ? "length" : It
    ), Reflect.ownKeys(e);
  }
}
class dl extends ai {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, n) {
    return !0;
  }
  deleteProperty(e, n) {
    return !0;
  }
}
const gl = /* @__PURE__ */ new li(), ml = /* @__PURE__ */ new dl(), _l = /* @__PURE__ */ new li(
  !0
), Os = (t) => t, _r = (t) => Reflect.getPrototypeOf(t);
function qn(t, e, n = !1, r = !1) {
  t = t.__v_raw;
  const s = ae(t), o = ae(e);
  n || (_t(e, o) && Me(s, "get", e), Me(s, "get", o));
  const { has: c } = _r(s), i = r ? Os : n ? $s : yn;
  if (c.call(s, e))
    return i(t.get(e));
  if (c.call(s, o))
    return i(t.get(o));
  t !== s && t.get(e);
}
function Fn(t, e = !1) {
  const n = this.__v_raw, r = ae(n), s = ae(t);
  return e || (_t(t, s) && Me(r, "has", t), Me(r, "has", s)), t === s ? n.has(t) : n.has(t) || n.has(s);
}
function Bn(t, e = !1) {
  return t = t.__v_raw, !e && Me(ae(t), "iterate", It), Reflect.get(t, "size", t);
}
function yo(t) {
  t = ae(t);
  const e = ae(this);
  return _r(e).has.call(e, t) || (e.add(t), rt(e, "add", t, t)), this;
}
function xo(t, e) {
  e = ae(e);
  const n = ae(this), { has: r, get: s } = _r(n);
  let o = r.call(n, t);
  o || (t = ae(t), o = r.call(n, t));
  const c = s.call(n, t);
  return n.set(t, e), o ? _t(e, c) && rt(n, "set", t, e) : rt(n, "add", t, e), this;
}
function Eo(t) {
  const e = ae(this), { has: n, get: r } = _r(e);
  let s = n.call(e, t);
  s || (t = ae(t), s = n.call(e, t)), r && r.call(e, t);
  const o = e.delete(t);
  return s && rt(e, "delete", t, void 0), o;
}
function ko() {
  const t = ae(this), e = t.size !== 0, n = t.clear();
  return e && rt(t, "clear", void 0, void 0), n;
}
function Pn(t, e) {
  return function(r, s) {
    const o = this, c = o.__v_raw, i = ae(c), a = e ? Os : t ? $s : yn;
    return !t && Me(i, "iterate", It), c.forEach((l, u) => r.call(s, a(l), a(u), o));
  };
}
function $n(t, e, n) {
  return function(...r) {
    const s = this.__v_raw, o = ae(s), c = Kt(o), i = t === "entries" || t === Symbol.iterator && c, a = t === "keys" && c, l = s[t](...r), u = n ? Os : e ? $s : yn;
    return !e && Me(
      o,
      "iterate",
      a ? gs : It
    ), {
      // iterator protocol
      next() {
        const { value: f, done: h } = l.next();
        return h ? { value: f, done: h } : {
          value: i ? [u(f[0]), u(f[1])] : u(f),
          done: h
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function ct(t) {
  return function(...e) {
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function bl() {
  const t = {
    get(o) {
      return qn(this, o);
    },
    get size() {
      return Bn(this);
    },
    has: Fn,
    add: yo,
    set: xo,
    delete: Eo,
    clear: ko,
    forEach: Pn(!1, !1)
  }, e = {
    get(o) {
      return qn(this, o, !1, !0);
    },
    get size() {
      return Bn(this);
    },
    has: Fn,
    add: yo,
    set: xo,
    delete: Eo,
    clear: ko,
    forEach: Pn(!1, !0)
  }, n = {
    get(o) {
      return qn(this, o, !0);
    },
    get size() {
      return Bn(this, !0);
    },
    has(o) {
      return Fn.call(this, o, !0);
    },
    add: ct("add"),
    set: ct("set"),
    delete: ct("delete"),
    clear: ct("clear"),
    forEach: Pn(!0, !1)
  }, r = {
    get(o) {
      return qn(this, o, !0, !0);
    },
    get size() {
      return Bn(this, !0);
    },
    has(o) {
      return Fn.call(this, o, !0);
    },
    add: ct("add"),
    set: ct("set"),
    delete: ct("delete"),
    clear: ct("clear"),
    forEach: Pn(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((o) => {
    t[o] = $n(
      o,
      !1,
      !1
    ), n[o] = $n(
      o,
      !0,
      !1
    ), e[o] = $n(
      o,
      !1,
      !0
    ), r[o] = $n(
      o,
      !0,
      !0
    );
  }), [
    t,
    n,
    e,
    r
  ];
}
const [
  vl,
  yl,
  xl,
  El
] = /* @__PURE__ */ bl();
function qs(t, e) {
  const n = e ? t ? El : xl : t ? yl : vl;
  return (r, s, o) => s === "__v_isReactive" ? !t : s === "__v_isReadonly" ? t : s === "__v_raw" ? r : Reflect.get(
    ie(n, s) && s in r ? n : r,
    s,
    o
  );
}
const kl = {
  get: /* @__PURE__ */ qs(!1, !1)
}, wl = {
  get: /* @__PURE__ */ qs(!1, !0)
}, Al = {
  get: /* @__PURE__ */ qs(!0, !1)
}, ui = /* @__PURE__ */ new WeakMap(), fi = /* @__PURE__ */ new WeakMap(), hi = /* @__PURE__ */ new WeakMap(), Cl = /* @__PURE__ */ new WeakMap();
function Sl(t) {
  switch (t) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Tl(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : Sl(Ja(t));
}
function Fs(t) {
  return Xt(t) ? t : Ps(
    t,
    !1,
    gl,
    kl,
    ui
  );
}
function Dl(t) {
  return Ps(
    t,
    !1,
    _l,
    wl,
    fi
  );
}
function Bs(t) {
  return Ps(
    t,
    !0,
    ml,
    Al,
    hi
  );
}
function Ps(t, e, n, r, s) {
  if (!de(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const o = s.get(t);
  if (o)
    return o;
  const c = Tl(t);
  if (c === 0)
    return t;
  const i = new Proxy(
    t,
    c === 2 ? r : n
  );
  return s.set(t, i), i;
}
function Zt(t) {
  return Xt(t) ? Zt(t.__v_raw) : !!(t && t.__v_isReactive);
}
function Xt(t) {
  return !!(t && t.__v_isReadonly);
}
function tr(t) {
  return !!(t && t.__v_isShallow);
}
function pi(t) {
  return Zt(t) || Xt(t);
}
function ae(t) {
  const e = t && t.__v_raw;
  return e ? ae(e) : t;
}
function di(t) {
  return Object.isExtensible(t) && Qn(t, "__v_skip", !0), t;
}
const yn = (t) => de(t) ? Fs(t) : t, $s = (t) => de(t) ? Bs(t) : t;
class gi {
  constructor(e, n, r, s) {
    this.getter = e, this._setter = n, this.dep = void 0, this.__v_isRef = !0, this.__v_isReadonly = !1, this.effect = new Ns(
      () => e(this._value),
      () => Wn(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    ), this.effect.computed = this, this.effect.active = this._cacheable = !s, this.__v_isReadonly = r;
  }
  get value() {
    const e = ae(this);
    return (!e._cacheable || e.effect.dirty) && _t(e._value, e._value = e.effect.run()) && Wn(e, 4), mi(e), e.effect._dirtyLevel >= 2 && Wn(e, 2), e._value;
  }
  set value(e) {
    this._setter(e);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(e) {
    this.effect.dirty = e;
  }
  // #endregion
}
function Rl(t, e, n = !1) {
  let r, s;
  const o = ne(t);
  return o ? (r = t, s = $e) : (r = t.get, s = t.set), new gi(r, s, o || !s, n);
}
function mi(t) {
  var e;
  gt && Nt && (t = ae(t), si(
    Nt,
    (e = t.dep) != null ? e : t.dep = ci(
      () => t.dep = void 0,
      t instanceof gi ? t : void 0
    )
  ));
}
function Wn(t, e = 4, n) {
  t = ae(t);
  const r = t.dep;
  r && oi(
    r,
    e
  );
}
function Se(t) {
  return !!(t && t.__v_isRef === !0);
}
function Le(t) {
  return Ll(t, !1);
}
function Ll(t, e) {
  return Se(t) ? t : new Nl(t, e);
}
class Nl {
  constructor(e, n) {
    this.__v_isShallow = n, this.dep = void 0, this.__v_isRef = !0, this._rawValue = n ? e : ae(e), this._value = n ? e : yn(e);
  }
  get value() {
    return mi(this), this._value;
  }
  set value(e) {
    const n = this.__v_isShallow || tr(e) || Xt(e);
    e = n ? e : ae(e), _t(e, this._rawValue) && (this._rawValue = e, this._value = n ? e : yn(e), Wn(this, 4));
  }
}
function se(t) {
  return Se(t) ? t.value : t;
}
const Il = {
  get: (t, e, n) => se(Reflect.get(t, e, n)),
  set: (t, e, n, r) => {
    const s = t[e];
    return Se(s) && !Se(n) ? (s.value = n, !0) : Reflect.set(t, e, n, r);
  }
};
function _i(t) {
  return Zt(t) ? t : new Proxy(t, Il);
}
function Ml(t) {
  const e = J(t) ? new Array(t.length) : {};
  for (const n in t)
    e[n] = ql(t, n);
  return e;
}
class Ol {
  constructor(e, n, r) {
    this._object = e, this._key = n, this._defaultValue = r, this.__v_isRef = !0;
  }
  get value() {
    const e = this._object[this._key];
    return e === void 0 ? this._defaultValue : e;
  }
  set value(e) {
    this._object[this._key] = e;
  }
  get dep() {
    return ul(ae(this._object), this._key);
  }
}
function ql(t, e, n) {
  const r = t[e];
  return Se(r) ? r : new Ol(t, e, n);
}
/**
* @vue/runtime-core v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function mt(t, e, n, r) {
  try {
    return r ? t(...r) : t();
  } catch (s) {
    br(s, e, n);
  }
}
function Ue(t, e, n, r) {
  if (ne(t)) {
    const o = mt(t, e, n, r);
    return o && Wc(o) && o.catch((c) => {
      br(c, e, n);
    }), o;
  }
  const s = [];
  for (let o = 0; o < t.length; o++)
    s.push(Ue(t[o], e, n, r));
  return s;
}
function br(t, e, n, r = !0) {
  const s = e ? e.vnode : null;
  if (e) {
    let o = e.parent;
    const c = e.proxy, i = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; o; ) {
      const l = o.ec;
      if (l) {
        for (let u = 0; u < l.length; u++)
          if (l[u](t, c, i) === !1)
            return;
      }
      o = o.parent;
    }
    const a = e.appContext.config.errorHandler;
    if (a) {
      mt(
        a,
        null,
        10,
        [t, c, i]
      );
      return;
    }
  }
  Fl(t, n, s, r);
}
function Fl(t, e, n, r = !0) {
  console.error(t);
}
let xn = !1, ms = !1;
const Ce = [];
let Je = 0;
const Wt = [];
let lt = null, Tt = 0;
const bi = /* @__PURE__ */ Promise.resolve();
let Us = null;
function Qt(t) {
  const e = Us || bi;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function Bl(t) {
  let e = Je + 1, n = Ce.length;
  for (; e < n; ) {
    const r = e + n >>> 1, s = Ce[r], o = En(s);
    o < t || o === t && s.pre ? e = r + 1 : n = r;
  }
  return e;
}
function zs(t) {
  (!Ce.length || !Ce.includes(
    t,
    xn && t.allowRecurse ? Je + 1 : Je
  )) && (t.id == null ? Ce.push(t) : Ce.splice(Bl(t.id), 0, t), vi());
}
function vi() {
  !xn && !ms && (ms = !0, Us = bi.then(xi));
}
function Pl(t) {
  const e = Ce.indexOf(t);
  e > Je && Ce.splice(e, 1);
}
function $l(t) {
  J(t) ? Wt.push(...t) : (!lt || !lt.includes(
    t,
    t.allowRecurse ? Tt + 1 : Tt
  )) && Wt.push(t), vi();
}
function wo(t, e, n = xn ? Je + 1 : 0) {
  for (; n < Ce.length; n++) {
    const r = Ce[n];
    if (r && r.pre) {
      if (t && r.id !== t.uid)
        continue;
      Ce.splice(n, 1), n--, r();
    }
  }
}
function yi(t) {
  if (Wt.length) {
    const e = [...new Set(Wt)].sort(
      (n, r) => En(n) - En(r)
    );
    if (Wt.length = 0, lt) {
      lt.push(...e);
      return;
    }
    for (lt = e, Tt = 0; Tt < lt.length; Tt++)
      lt[Tt]();
    lt = null, Tt = 0;
  }
}
const En = (t) => t.id == null ? 1 / 0 : t.id, Ul = (t, e) => {
  const n = En(t) - En(e);
  if (n === 0) {
    if (t.pre && !e.pre)
      return -1;
    if (e.pre && !t.pre)
      return 1;
  }
  return n;
};
function xi(t) {
  ms = !1, xn = !0, Ce.sort(Ul);
  try {
    for (Je = 0; Je < Ce.length; Je++) {
      const e = Ce[Je];
      e && e.active !== !1 && mt(e, null, 14);
    }
  } finally {
    Je = 0, Ce.length = 0, yi(), xn = !1, Us = null, (Ce.length || Wt.length) && xi();
  }
}
function zl(t, e, ...n) {
  if (t.isUnmounted)
    return;
  const r = t.vnode.props || pe;
  let s = n;
  const o = e.startsWith("update:"), c = o && e.slice(7);
  if (c && c in r) {
    const u = `${c === "modelValue" ? "model" : c}Modifiers`, { number: f, trim: h } = r[u] || pe;
    h && (s = n.map((d) => me(d) ? d.trim() : d)), f && (s = n.map(fs));
  }
  let i, a = r[i = Br(e)] || // also try camelCase event handler (#2249)
  r[i = Br(Qe(e))];
  !a && o && (a = r[i = Br(Ft(e))]), a && Ue(
    a,
    t,
    6,
    s
  );
  const l = r[i + "Once"];
  if (l) {
    if (!t.emitted)
      t.emitted = {};
    else if (t.emitted[i])
      return;
    t.emitted[i] = !0, Ue(
      l,
      t,
      6,
      s
    );
  }
}
function Ei(t, e, n = !1) {
  const r = e.emitsCache, s = r.get(t);
  if (s !== void 0)
    return s;
  const o = t.emits;
  let c = {}, i = !1;
  if (!ne(t)) {
    const a = (l) => {
      const u = Ei(l, e, !0);
      u && (i = !0, ye(c, u));
    };
    !n && e.mixins.length && e.mixins.forEach(a), t.extends && a(t.extends), t.mixins && t.mixins.forEach(a);
  }
  return !o && !i ? (de(t) && r.set(t, null), null) : (J(o) ? o.forEach((a) => c[a] = null) : ye(c, o), de(t) && r.set(t, c), c);
}
function vr(t, e) {
  return !t || !pr(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), ie(t, e[0].toLowerCase() + e.slice(1)) || ie(t, Ft(e)) || ie(t, e));
}
let ve = null, ki = null;
function nr(t) {
  const e = ve;
  return ve = t, ki = t && t.type.__scopeId || null, e;
}
function st(t, e = ve, n) {
  if (!e || t._n)
    return t;
  const r = (...s) => {
    r._d && qo(-1);
    const o = nr(e);
    let c;
    try {
      c = t(...s);
    } finally {
      nr(o), r._d && qo(1);
    }
    return c;
  };
  return r._n = !0, r._c = !0, r._d = !0, r;
}
function $r(t) {
  const {
    type: e,
    vnode: n,
    proxy: r,
    withProxy: s,
    props: o,
    propsOptions: [c],
    slots: i,
    attrs: a,
    emit: l,
    render: u,
    renderCache: f,
    data: h,
    setupState: d,
    ctx: m,
    inheritAttrs: _
  } = t;
  let R, T;
  const D = nr(t);
  try {
    if (n.shapeFlag & 4) {
      const B = s || r, P = B;
      R = We(
        u.call(
          P,
          B,
          f,
          o,
          d,
          h,
          m
        )
      ), T = a;
    } else {
      const B = e;
      R = We(
        B.length > 1 ? B(
          o,
          { attrs: a, slots: i, emit: l }
        ) : B(
          o,
          null
          /* we know it doesn't need it */
        )
      ), T = e.props ? a : Hl(a);
    }
  } catch (B) {
    _n.length = 0, br(B, t, 1), R = ge(ze);
  }
  let I = R;
  if (T && _ !== !1) {
    const B = Object.keys(T), { shapeFlag: P } = I;
    B.length && P & 7 && (c && B.some(Ds) && (T = Vl(
      T,
      c
    )), I = bt(I, T));
  }
  return n.dirs && (I = bt(I), I.dirs = I.dirs ? I.dirs.concat(n.dirs) : n.dirs), n.transition && (I.transition = n.transition), R = I, nr(D), R;
}
const Hl = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || pr(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, Vl = (t, e) => {
  const n = {};
  for (const r in t)
    (!Ds(r) || !(r.slice(9) in e)) && (n[r] = t[r]);
  return n;
};
function Gl(t, e, n) {
  const { props: r, children: s, component: o } = t, { props: c, children: i, patchFlag: a } = e, l = o.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return r ? Ao(r, c, l) : !!c;
    if (a & 8) {
      const u = e.dynamicProps;
      for (let f = 0; f < u.length; f++) {
        const h = u[f];
        if (c[h] !== r[h] && !vr(l, h))
          return !0;
      }
    }
  } else
    return (s || i) && (!i || !i.$stable) ? !0 : r === c ? !1 : r ? c ? Ao(r, c, l) : !0 : !!c;
  return !1;
}
function Ao(t, e, n) {
  const r = Object.keys(e);
  if (r.length !== Object.keys(t).length)
    return !0;
  for (let s = 0; s < r.length; s++) {
    const o = r[s];
    if (e[o] !== t[o] && !vr(n, o))
      return !0;
  }
  return !1;
}
function jl({ vnode: t, parent: e }, n) {
  for (; e; ) {
    const r = e.subTree;
    if (r.suspense && r.suspense.activeBranch === t && (r.el = t.el), r === t)
      (t = e.vnode).el = n, e = e.parent;
    else
      break;
  }
}
const Kl = "components", wi = Symbol.for("v-ndc");
function Zl(t) {
  return me(t) ? Wl(Kl, t, !1) || t : t || wi;
}
function Wl(t, e, n = !0, r = !1) {
  const s = ve || ke;
  if (s) {
    const o = s.type;
    {
      const i = Hu(
        o,
        !1
      );
      if (i && (i === e || i === Qe(e) || i === mr(Qe(e))))
        return o;
    }
    const c = (
      // local registration
      // check instance[type] first which is resolved for options API
      Co(s[t] || o[t], e) || // global registration
      Co(s.appContext[t], e)
    );
    return !c && r ? o : c;
  }
}
function Co(t, e) {
  return t && (t[e] || t[Qe(e)] || t[mr(Qe(e))]);
}
const Jl = (t) => t.__isSuspense;
function Yl(t, e) {
  e && e.pendingBranch ? J(t) ? e.effects.push(...t) : e.effects.push(t) : $l(t);
}
const Xl = Symbol.for("v-scx"), Ql = () => Jt(Xl), Un = {};
function Jn(t, e, n) {
  return Ai(t, e, n);
}
function Ai(t, e, {
  immediate: n,
  deep: r,
  flush: s,
  once: o,
  onTrack: c,
  onTrigger: i
} = pe) {
  if (e && o) {
    const y = e;
    e = (...W) => {
      y(...W), P();
    };
  }
  const a = ke, l = (y) => r === !0 ? y : (
    // for deep: false, only traverse root-level properties
    Rt(y, r === !1 ? 1 : void 0)
  );
  let u, f = !1, h = !1;
  if (Se(t) ? (u = () => t.value, f = tr(t)) : Zt(t) ? (u = () => l(t), f = !0) : J(t) ? (h = !0, f = t.some((y) => Zt(y) || tr(y)), u = () => t.map((y) => {
    if (Se(y))
      return y.value;
    if (Zt(y))
      return l(y);
    if (ne(y))
      return mt(y, a, 2);
  })) : ne(t) ? e ? u = () => mt(t, a, 2) : u = () => (d && d(), Ue(
    t,
    a,
    3,
    [m]
  )) : u = $e, e && r) {
    const y = u;
    u = () => Rt(y());
  }
  let d, m = (y) => {
    d = I.onStop = () => {
      mt(y, a, 4), d = I.onStop = void 0;
    };
  }, _;
  if (wr)
    if (m = $e, e ? n && Ue(e, a, 3, [
      u(),
      h ? [] : void 0,
      m
    ]) : u(), s === "sync") {
      const y = Ql();
      _ = y.__watcherHandles || (y.__watcherHandles = []);
    } else
      return $e;
  let R = h ? new Array(t.length).fill(Un) : Un;
  const T = () => {
    if (!(!I.active || !I.dirty))
      if (e) {
        const y = I.run();
        (r || f || (h ? y.some((W, $) => _t(W, R[$])) : _t(y, R))) && (d && d(), Ue(e, a, 3, [
          y,
          // pass undefined as the old value when it's changed for the first time
          R === Un ? void 0 : h && R[0] === Un ? [] : R,
          m
        ]), R = y);
      } else
        I.run();
  };
  T.allowRecurse = !!e;
  let D;
  s === "sync" ? D = T : s === "post" ? D = () => Ne(T, a && a.suspense) : (T.pre = !0, a && (T.id = a.uid), D = () => zs(T));
  const I = new Ns(u, $e, D), B = ti(), P = () => {
    I.stop(), B && Rs(B.effects, I);
  };
  return e ? n ? T() : R = I.run() : s === "post" ? Ne(
    I.run.bind(I),
    a && a.suspense
  ) : I.run(), _ && _.push(P), P;
}
function eu(t, e, n) {
  const r = this.proxy, s = me(t) ? t.includes(".") ? Ci(r, t) : () => r[t] : t.bind(r, r);
  let o;
  ne(e) ? o = e : (o = e.handler, n = e);
  const c = Dn(this), i = Ai(s, o.bind(r), n);
  return c(), i;
}
function Ci(t, e) {
  const n = e.split(".");
  return () => {
    let r = t;
    for (let s = 0; s < n.length && r; s++)
      r = r[n[s]];
    return r;
  };
}
function Rt(t, e, n = 0, r) {
  if (!de(t) || t.__v_skip)
    return t;
  if (e && e > 0) {
    if (n >= e)
      return t;
    n++;
  }
  if (r = r || /* @__PURE__ */ new Set(), r.has(t))
    return t;
  if (r.add(t), Se(t))
    Rt(t.value, e, n, r);
  else if (J(t))
    for (let s = 0; s < t.length; s++)
      Rt(t[s], e, n, r);
  else if (Zc(t) || Kt(t))
    t.forEach((s) => {
      Rt(s, e, n, r);
    });
  else if (Yc(t))
    for (const s in t)
      Rt(t[s], e, n, r);
  return t;
}
function Si(t, e) {
  if (ve === null)
    return t;
  const n = Ar(ve) || ve.proxy, r = t.dirs || (t.dirs = []);
  for (let s = 0; s < e.length; s++) {
    let [o, c, i, a = pe] = e[s];
    o && (ne(o) && (o = {
      mounted: o,
      updated: o
    }), o.deep && Rt(c), r.push({
      dir: o,
      instance: n,
      value: c,
      oldValue: void 0,
      arg: i,
      modifiers: a
    }));
  }
  return t;
}
function kt(t, e, n, r) {
  const s = t.dirs, o = e && e.dirs;
  for (let c = 0; c < s.length; c++) {
    const i = s[c];
    o && (i.oldValue = o[c].value);
    let a = i.dir[r];
    a && (Bt(), Ue(a, n, 8, [
      t.el,
      i,
      t,
      e
    ]), Pt());
  }
}
const ut = Symbol("_leaveCb"), zn = Symbol("_enterCb");
function tu() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return vt(() => {
    t.isMounted = !0;
  }), Hs(() => {
    t.isUnmounting = !0;
  }), t;
}
const Pe = [Function, Array], Ti = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: Pe,
  onEnter: Pe,
  onAfterEnter: Pe,
  onEnterCancelled: Pe,
  // leave
  onBeforeLeave: Pe,
  onLeave: Pe,
  onAfterLeave: Pe,
  onLeaveCancelled: Pe,
  // appear
  onBeforeAppear: Pe,
  onAppear: Pe,
  onAfterAppear: Pe,
  onAppearCancelled: Pe
}, nu = {
  name: "BaseTransition",
  props: Ti,
  setup(t, { slots: e }) {
    const n = Bu(), r = tu();
    return () => {
      const s = e.default && Ri(e.default(), !0);
      if (!s || !s.length)
        return;
      let o = s[0];
      if (s.length > 1) {
        for (const h of s)
          if (h.type !== ze) {
            o = h;
            break;
          }
      }
      const c = ae(t), { mode: i } = c;
      if (r.isLeaving)
        return Ur(o);
      const a = So(o);
      if (!a)
        return Ur(o);
      const l = _s(
        a,
        c,
        r,
        n
      );
      bs(a, l);
      const u = n.subTree, f = u && So(u);
      if (f && f.type !== ze && !Dt(a, f)) {
        const h = _s(
          f,
          c,
          r,
          n
        );
        if (bs(f, h), i === "out-in")
          return r.isLeaving = !0, h.afterLeave = () => {
            r.isLeaving = !1, n.update.active !== !1 && (n.effect.dirty = !0, n.update());
          }, Ur(o);
        i === "in-out" && a.type !== ze && (h.delayLeave = (d, m, _) => {
          const R = Di(
            r,
            f
          );
          R[String(f.key)] = f, d[ut] = () => {
            m(), d[ut] = void 0, delete l.delayedLeave;
          }, l.delayedLeave = _;
        });
      }
      return o;
    };
  }
}, ru = nu;
function Di(t, e) {
  const { leavingVNodes: n } = t;
  let r = n.get(e.type);
  return r || (r = /* @__PURE__ */ Object.create(null), n.set(e.type, r)), r;
}
function _s(t, e, n, r) {
  const {
    appear: s,
    mode: o,
    persisted: c = !1,
    onBeforeEnter: i,
    onEnter: a,
    onAfterEnter: l,
    onEnterCancelled: u,
    onBeforeLeave: f,
    onLeave: h,
    onAfterLeave: d,
    onLeaveCancelled: m,
    onBeforeAppear: _,
    onAppear: R,
    onAfterAppear: T,
    onAppearCancelled: D
  } = e, I = String(t.key), B = Di(n, t), P = ($, Q) => {
    $ && Ue(
      $,
      r,
      9,
      Q
    );
  }, y = ($, Q) => {
    const z = Q[1];
    P($, Q), J($) ? $.every((oe) => oe.length <= 1) && z() : $.length <= 1 && z();
  }, W = {
    mode: o,
    persisted: c,
    beforeEnter($) {
      let Q = i;
      if (!n.isMounted)
        if (s)
          Q = _ || i;
        else
          return;
      $[ut] && $[ut](
        !0
        /* cancelled */
      );
      const z = B[I];
      z && Dt(t, z) && z.el[ut] && z.el[ut](), P(Q, [$]);
    },
    enter($) {
      let Q = a, z = l, oe = u;
      if (!n.isMounted)
        if (s)
          Q = R || a, z = T || l, oe = D || u;
        else
          return;
      let L = !1;
      const ee = $[zn] = (A) => {
        L || (L = !0, A ? P(oe, [$]) : P(z, [$]), W.delayedLeave && W.delayedLeave(), $[zn] = void 0);
      };
      Q ? y(Q, [$, ee]) : ee();
    },
    leave($, Q) {
      const z = String(t.key);
      if ($[zn] && $[zn](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return Q();
      P(f, [$]);
      let oe = !1;
      const L = $[ut] = (ee) => {
        oe || (oe = !0, Q(), ee ? P(m, [$]) : P(d, [$]), $[ut] = void 0, B[z] === t && delete B[z]);
      };
      B[z] = t, h ? y(h, [$, L]) : L();
    },
    clone($) {
      return _s($, e, n, r);
    }
  };
  return W;
}
function Ur(t) {
  if (yr(t))
    return t = bt(t), t.children = null, t;
}
function So(t) {
  return yr(t) ? (
    // #7121 ensure get the child component subtree in case
    // it's been replaced during HMR
    t.children ? t.children[0] : void 0
  ) : t;
}
function bs(t, e) {
  t.shapeFlag & 6 && t.component ? bs(t.component.subTree, e) : t.shapeFlag & 128 ? (t.ssContent.transition = e.clone(t.ssContent), t.ssFallback.transition = e.clone(t.ssFallback)) : t.transition = e;
}
function Ri(t, e = !1, n) {
  let r = [], s = 0;
  for (let o = 0; o < t.length; o++) {
    let c = t[o];
    const i = n == null ? c.key : String(n) + String(c.key != null ? c.key : o);
    c.type === Ae ? (c.patchFlag & 128 && s++, r = r.concat(
      Ri(c.children, e, i)
    )) : (e || c.type !== ze) && r.push(i != null ? bt(c, { key: i }) : c);
  }
  if (s > 1)
    for (let o = 0; o < r.length; o++)
      r[o].patchFlag = -2;
  return r;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Ve(t, e) {
  return ne(t) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    ye({ name: t.name }, e, { setup: t })
  ) : t;
}
const dn = (t) => !!t.type.__asyncLoader, yr = (t) => t.type.__isKeepAlive;
function su(t, e) {
  Li(t, "a", e);
}
function ou(t, e) {
  Li(t, "da", e);
}
function Li(t, e, n = ke) {
  const r = t.__wdc || (t.__wdc = () => {
    let s = n;
    for (; s; ) {
      if (s.isDeactivated)
        return;
      s = s.parent;
    }
    return t();
  });
  if (xr(e, r, n), n) {
    let s = n.parent;
    for (; s && s.parent; )
      yr(s.parent.vnode) && cu(r, e, n, s), s = s.parent;
  }
}
function cu(t, e, n, r) {
  const s = xr(
    e,
    t,
    r,
    !0
    /* prepend */
  );
  Vs(() => {
    Rs(r[e], s);
  }, n);
}
function xr(t, e, n = ke, r = !1) {
  if (n) {
    const s = n[t] || (n[t] = []), o = e.__weh || (e.__weh = (...c) => {
      if (n.isUnmounted)
        return;
      Bt();
      const i = Dn(n), a = Ue(e, n, t, c);
      return i(), Pt(), a;
    });
    return r ? s.unshift(o) : s.push(o), o;
  }
}
const ot = (t) => (e, n = ke) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!wr || t === "sp") && xr(t, (...r) => e(...r), n)
), iu = ot("bm"), vt = ot("m"), au = ot("bu"), lu = ot("u"), Hs = ot("bum"), Vs = ot("um"), uu = ot("sp"), fu = ot(
  "rtg"
), hu = ot(
  "rtc"
);
function pu(t, e = ke) {
  xr("ec", t, e);
}
function rr(t, e, n, r) {
  let s;
  const o = n;
  if (J(t) || me(t)) {
    s = new Array(t.length);
    for (let c = 0, i = t.length; c < i; c++)
      s[c] = e(t[c], c, void 0, o);
  } else if (typeof t == "number") {
    s = new Array(t);
    for (let c = 0; c < t; c++)
      s[c] = e(c + 1, c, void 0, o);
  } else if (de(t))
    if (t[Symbol.iterator])
      s = Array.from(
        t,
        (c, i) => e(c, i, void 0, o)
      );
    else {
      const c = Object.keys(t);
      s = new Array(c.length);
      for (let i = 0, a = c.length; i < a; i++) {
        const l = c[i];
        s[i] = e(t[l], l, i, o);
      }
    }
  else
    s = [];
  return s;
}
function Mt(t, e, n = {}, r, s) {
  if (ve.isCE || ve.parent && dn(ve.parent) && ve.parent.isCE)
    return e !== "default" && (n.name = e), ge("slot", n, r && r());
  let o = t[e];
  o && o._c && (o._d = !1), Z();
  const c = o && Ni(o(n)), i = be(
    Ae,
    {
      key: n.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      c && c.key || `_${e}`
    },
    c || (r ? r() : []),
    c && t._ === 1 ? 64 : -2
  );
  return i.scopeId && (i.slotScopeIds = [i.scopeId + "-s"]), o && o._c && (o._d = !0), i;
}
function Ni(t) {
  return t.some((e) => or(e) ? !(e.type === ze || e.type === Ae && !Ni(e.children)) : !0) ? t : null;
}
const vs = (t) => t ? Gi(t) ? Ar(t) || t.proxy : vs(t.parent) : null, gn = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ ye(/* @__PURE__ */ Object.create(null), {
    $: (t) => t,
    $el: (t) => t.vnode.el,
    $data: (t) => t.data,
    $props: (t) => t.props,
    $attrs: (t) => t.attrs,
    $slots: (t) => t.slots,
    $refs: (t) => t.refs,
    $parent: (t) => vs(t.parent),
    $root: (t) => vs(t.root),
    $emit: (t) => t.emit,
    $options: (t) => Gs(t),
    $forceUpdate: (t) => t.f || (t.f = () => {
      t.effect.dirty = !0, zs(t.update);
    }),
    $nextTick: (t) => t.n || (t.n = Qt.bind(t.proxy)),
    $watch: (t) => eu.bind(t)
  })
), zr = (t, e) => t !== pe && !t.__isScriptSetup && ie(t, e), du = {
  get({ _: t }, e) {
    const { ctx: n, setupState: r, data: s, props: o, accessCache: c, type: i, appContext: a } = t;
    let l;
    if (e[0] !== "$") {
      const d = c[e];
      if (d !== void 0)
        switch (d) {
          case 1:
            return r[e];
          case 2:
            return s[e];
          case 4:
            return n[e];
          case 3:
            return o[e];
        }
      else {
        if (zr(r, e))
          return c[e] = 1, r[e];
        if (s !== pe && ie(s, e))
          return c[e] = 2, s[e];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (l = t.propsOptions[0]) && ie(l, e)
        )
          return c[e] = 3, o[e];
        if (n !== pe && ie(n, e))
          return c[e] = 4, n[e];
        ys && (c[e] = 0);
      }
    }
    const u = gn[e];
    let f, h;
    if (u)
      return e === "$attrs" && Me(t, "get", e), u(t);
    if (
      // css module (injected by vue-loader)
      (f = i.__cssModules) && (f = f[e])
    )
      return f;
    if (n !== pe && ie(n, e))
      return c[e] = 4, n[e];
    if (
      // global properties
      h = a.config.globalProperties, ie(h, e)
    )
      return h[e];
  },
  set({ _: t }, e, n) {
    const { data: r, setupState: s, ctx: o } = t;
    return zr(s, e) ? (s[e] = n, !0) : r !== pe && ie(r, e) ? (r[e] = n, !0) : ie(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (o[e] = n, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: n, ctx: r, appContext: s, propsOptions: o }
  }, c) {
    let i;
    return !!n[c] || t !== pe && ie(t, c) || zr(e, c) || (i = o[0]) && ie(i, c) || ie(r, c) || ie(gn, c) || ie(s.config.globalProperties, c);
  },
  defineProperty(t, e, n) {
    return n.get != null ? t._.accessCache[e] = 0 : ie(n, "value") && this.set(t, e, n.value, null), Reflect.defineProperty(t, e, n);
  }
};
function To(t) {
  return J(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
let ys = !0;
function gu(t) {
  const e = Gs(t), n = t.proxy, r = t.ctx;
  ys = !1, e.beforeCreate && Do(e.beforeCreate, t, "bc");
  const {
    // state
    data: s,
    computed: o,
    methods: c,
    watch: i,
    provide: a,
    inject: l,
    // lifecycle
    created: u,
    beforeMount: f,
    mounted: h,
    beforeUpdate: d,
    updated: m,
    activated: _,
    deactivated: R,
    beforeDestroy: T,
    beforeUnmount: D,
    destroyed: I,
    unmounted: B,
    render: P,
    renderTracked: y,
    renderTriggered: W,
    errorCaptured: $,
    serverPrefetch: Q,
    // public API
    expose: z,
    inheritAttrs: oe,
    // assets
    components: L,
    directives: ee,
    filters: A
  } = e;
  if (l && mu(l, r, null), c)
    for (const v in c) {
      const C = c[v];
      ne(C) && (r[v] = C.bind(n));
    }
  if (s) {
    const v = s.call(n, n);
    de(v) && (t.data = Fs(v));
  }
  if (ys = !0, o)
    for (const v in o) {
      const C = o[v], j = ne(C) ? C.bind(n, n) : ne(C.get) ? C.get.bind(n, n) : $e, te = !ne(C) && ne(C.set) ? C.set.bind(n) : $e, re = Re({
        get: j,
        set: te
      });
      Object.defineProperty(r, v, {
        enumerable: !0,
        configurable: !0,
        get: () => re.value,
        set: (ue) => re.value = ue
      });
    }
  if (i)
    for (const v in i)
      Ii(i[v], r, n, v);
  if (a) {
    const v = ne(a) ? a.call(n) : a;
    Reflect.ownKeys(v).forEach((C) => {
      Eu(C, v[C]);
    });
  }
  u && Do(u, t, "c");
  function F(v, C) {
    J(C) ? C.forEach((j) => v(j.bind(n))) : C && v(C.bind(n));
  }
  if (F(iu, f), F(vt, h), F(au, d), F(lu, m), F(su, _), F(ou, R), F(pu, $), F(hu, y), F(fu, W), F(Hs, D), F(Vs, B), F(uu, Q), J(z))
    if (z.length) {
      const v = t.exposed || (t.exposed = {});
      z.forEach((C) => {
        Object.defineProperty(v, C, {
          get: () => n[C],
          set: (j) => n[C] = j
        });
      });
    } else
      t.exposed || (t.exposed = {});
  P && t.render === $e && (t.render = P), oe != null && (t.inheritAttrs = oe), L && (t.components = L), ee && (t.directives = ee);
}
function mu(t, e, n = $e) {
  J(t) && (t = xs(t));
  for (const r in t) {
    const s = t[r];
    let o;
    de(s) ? "default" in s ? o = Jt(
      s.from || r,
      s.default,
      !0
    ) : o = Jt(s.from || r) : o = Jt(s), Se(o) ? Object.defineProperty(e, r, {
      enumerable: !0,
      configurable: !0,
      get: () => o.value,
      set: (c) => o.value = c
    }) : e[r] = o;
  }
}
function Do(t, e, n) {
  Ue(
    J(t) ? t.map((r) => r.bind(e.proxy)) : t.bind(e.proxy),
    e,
    n
  );
}
function Ii(t, e, n, r) {
  const s = r.includes(".") ? Ci(n, r) : () => n[r];
  if (me(t)) {
    const o = e[t];
    ne(o) && Jn(s, o);
  } else if (ne(t))
    Jn(s, t.bind(n));
  else if (de(t))
    if (J(t))
      t.forEach((o) => Ii(o, e, n, r));
    else {
      const o = ne(t.handler) ? t.handler.bind(n) : e[t.handler];
      ne(o) && Jn(s, o, t);
    }
}
function Gs(t) {
  const e = t.type, { mixins: n, extends: r } = e, {
    mixins: s,
    optionsCache: o,
    config: { optionMergeStrategies: c }
  } = t.appContext, i = o.get(e);
  let a;
  return i ? a = i : !s.length && !n && !r ? a = e : (a = {}, s.length && s.forEach(
    (l) => sr(a, l, c, !0)
  ), sr(a, e, c)), de(e) && o.set(e, a), a;
}
function sr(t, e, n, r = !1) {
  const { mixins: s, extends: o } = e;
  o && sr(t, o, n, !0), s && s.forEach(
    (c) => sr(t, c, n, !0)
  );
  for (const c in e)
    if (!(r && c === "expose")) {
      const i = _u[c] || n && n[c];
      t[c] = i ? i(t[c], e[c]) : e[c];
    }
  return t;
}
const _u = {
  data: Ro,
  props: Lo,
  emits: Lo,
  // objects
  methods: hn,
  computed: hn,
  // lifecycle
  beforeCreate: De,
  created: De,
  beforeMount: De,
  mounted: De,
  beforeUpdate: De,
  updated: De,
  beforeDestroy: De,
  beforeUnmount: De,
  destroyed: De,
  unmounted: De,
  activated: De,
  deactivated: De,
  errorCaptured: De,
  serverPrefetch: De,
  // assets
  components: hn,
  directives: hn,
  // watch
  watch: vu,
  // provide / inject
  provide: Ro,
  inject: bu
};
function Ro(t, e) {
  return e ? t ? function() {
    return ye(
      ne(t) ? t.call(this, this) : t,
      ne(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function bu(t, e) {
  return hn(xs(t), xs(e));
}
function xs(t) {
  if (J(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++)
      e[t[n]] = t[n];
    return e;
  }
  return t;
}
function De(t, e) {
  return t ? [...new Set([].concat(t, e))] : e;
}
function hn(t, e) {
  return t ? ye(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function Lo(t, e) {
  return t ? J(t) && J(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : ye(
    /* @__PURE__ */ Object.create(null),
    To(t),
    To(e ?? {})
  ) : e;
}
function vu(t, e) {
  if (!t)
    return e;
  if (!e)
    return t;
  const n = ye(/* @__PURE__ */ Object.create(null), t);
  for (const r in e)
    n[r] = De(t[r], e[r]);
  return n;
}
function Mi() {
  return {
    app: null,
    config: {
      isNativeTag: Za,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let yu = 0;
function xu(t, e) {
  return function(r, s = null) {
    ne(r) || (r = ye({}, r)), s != null && !de(s) && (s = null);
    const o = Mi(), c = /* @__PURE__ */ new WeakSet();
    let i = !1;
    const a = o.app = {
      _uid: yu++,
      _component: r,
      _props: s,
      _container: null,
      _context: o,
      _instance: null,
      version: Gu,
      get config() {
        return o.config;
      },
      set config(l) {
      },
      use(l, ...u) {
        return c.has(l) || (l && ne(l.install) ? (c.add(l), l.install(a, ...u)) : ne(l) && (c.add(l), l(a, ...u))), a;
      },
      mixin(l) {
        return o.mixins.includes(l) || o.mixins.push(l), a;
      },
      component(l, u) {
        return u ? (o.components[l] = u, a) : o.components[l];
      },
      directive(l, u) {
        return u ? (o.directives[l] = u, a) : o.directives[l];
      },
      mount(l, u, f) {
        if (!i) {
          const h = ge(r, s);
          return h.appContext = o, f === !0 ? f = "svg" : f === !1 && (f = void 0), u && e ? e(h, l) : t(h, l, f), i = !0, a._container = l, l.__vue_app__ = a, Ar(h.component) || h.component.proxy;
        }
      },
      unmount() {
        i && (t(null, a._container), delete a._container.__vue_app__);
      },
      provide(l, u) {
        return o.provides[l] = u, a;
      },
      runWithContext(l) {
        const u = mn;
        mn = a;
        try {
          return l();
        } finally {
          mn = u;
        }
      }
    };
    return a;
  };
}
let mn = null;
function Eu(t, e) {
  if (ke) {
    let n = ke.provides;
    const r = ke.parent && ke.parent.provides;
    r === n && (n = ke.provides = Object.create(r)), n[t] = e;
  }
}
function Jt(t, e, n = !1) {
  const r = ke || ve;
  if (r || mn) {
    const s = r ? r.parent == null ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : mn._context.provides;
    if (s && t in s)
      return s[t];
    if (arguments.length > 1)
      return n && ne(e) ? e.call(r && r.proxy) : e;
  }
}
function ku(t, e, n, r = !1) {
  const s = {}, o = {};
  Qn(o, kr, 1), t.propsDefaults = /* @__PURE__ */ Object.create(null), Oi(t, e, s, o);
  for (const c in t.propsOptions[0])
    c in s || (s[c] = void 0);
  n ? t.props = r ? s : Dl(s) : t.type.props ? t.props = s : t.props = o, t.attrs = o;
}
function wu(t, e, n, r) {
  const {
    props: s,
    attrs: o,
    vnode: { patchFlag: c }
  } = t, i = ae(s), [a] = t.propsOptions;
  let l = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (r || c > 0) && !(c & 16)
  ) {
    if (c & 8) {
      const u = t.vnode.dynamicProps;
      for (let f = 0; f < u.length; f++) {
        let h = u[f];
        if (vr(t.emitsOptions, h))
          continue;
        const d = e[h];
        if (a)
          if (ie(o, h))
            d !== o[h] && (o[h] = d, l = !0);
          else {
            const m = Qe(h);
            s[m] = Es(
              a,
              i,
              m,
              d,
              t,
              !1
            );
          }
        else
          d !== o[h] && (o[h] = d, l = !0);
      }
    }
  } else {
    Oi(t, e, s, o) && (l = !0);
    let u;
    for (const f in i)
      (!e || // for camelCase
      !ie(e, f) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = Ft(f)) === f || !ie(e, u))) && (a ? n && // for camelCase
      (n[f] !== void 0 || // for kebab-case
      n[u] !== void 0) && (s[f] = Es(
        a,
        i,
        f,
        void 0,
        t,
        !0
      )) : delete s[f]);
    if (o !== i)
      for (const f in o)
        (!e || !ie(e, f)) && (delete o[f], l = !0);
  }
  l && rt(t, "set", "$attrs");
}
function Oi(t, e, n, r) {
  const [s, o] = t.propsOptions;
  let c = !1, i;
  if (e)
    for (let a in e) {
      if (pn(a))
        continue;
      const l = e[a];
      let u;
      s && ie(s, u = Qe(a)) ? !o || !o.includes(u) ? n[u] = l : (i || (i = {}))[u] = l : vr(t.emitsOptions, a) || (!(a in r) || l !== r[a]) && (r[a] = l, c = !0);
    }
  if (o) {
    const a = ae(n), l = i || pe;
    for (let u = 0; u < o.length; u++) {
      const f = o[u];
      n[f] = Es(
        s,
        a,
        f,
        l[f],
        t,
        !ie(l, f)
      );
    }
  }
  return c;
}
function Es(t, e, n, r, s, o) {
  const c = t[n];
  if (c != null) {
    const i = ie(c, "default");
    if (i && r === void 0) {
      const a = c.default;
      if (c.type !== Function && !c.skipFactory && ne(a)) {
        const { propsDefaults: l } = s;
        if (n in l)
          r = l[n];
        else {
          const u = Dn(s);
          r = l[n] = a.call(
            null,
            e
          ), u();
        }
      } else
        r = a;
    }
    c[
      0
      /* shouldCast */
    ] && (o && !i ? r = !1 : c[
      1
      /* shouldCastTrue */
    ] && (r === "" || r === Ft(n)) && (r = !0));
  }
  return r;
}
function qi(t, e, n = !1) {
  const r = e.propsCache, s = r.get(t);
  if (s)
    return s;
  const o = t.props, c = {}, i = [];
  let a = !1;
  if (!ne(t)) {
    const u = (f) => {
      a = !0;
      const [h, d] = qi(f, e, !0);
      ye(c, h), d && i.push(...d);
    };
    !n && e.mixins.length && e.mixins.forEach(u), t.extends && u(t.extends), t.mixins && t.mixins.forEach(u);
  }
  if (!o && !a)
    return de(t) && r.set(t, jt), jt;
  if (J(o))
    for (let u = 0; u < o.length; u++) {
      const f = Qe(o[u]);
      No(f) && (c[f] = pe);
    }
  else if (o)
    for (const u in o) {
      const f = Qe(u);
      if (No(f)) {
        const h = o[u], d = c[f] = J(h) || ne(h) ? { type: h } : ye({}, h);
        if (d) {
          const m = Oo(Boolean, d.type), _ = Oo(String, d.type);
          d[
            0
            /* shouldCast */
          ] = m > -1, d[
            1
            /* shouldCastTrue */
          ] = _ < 0 || m < _, (m > -1 || ie(d, "default")) && i.push(f);
        }
      }
    }
  const l = [c, i];
  return de(t) && r.set(t, l), l;
}
function No(t) {
  return t[0] !== "$" && !pn(t);
}
function Io(t) {
  return t === null ? "null" : typeof t == "function" ? t.name || "" : typeof t == "object" && t.constructor && t.constructor.name || "";
}
function Mo(t, e) {
  return Io(t) === Io(e);
}
function Oo(t, e) {
  return J(e) ? e.findIndex((n) => Mo(n, t)) : ne(e) && Mo(e, t) ? 0 : -1;
}
const Fi = (t) => t[0] === "_" || t === "$stable", js = (t) => J(t) ? t.map(We) : [We(t)], Au = (t, e, n) => {
  if (e._n)
    return e;
  const r = st((...s) => js(e(...s)), n);
  return r._c = !1, r;
}, Bi = (t, e, n) => {
  const r = t._ctx;
  for (const s in t) {
    if (Fi(s))
      continue;
    const o = t[s];
    if (ne(o))
      e[s] = Au(s, o, r);
    else if (o != null) {
      const c = js(o);
      e[s] = () => c;
    }
  }
}, Pi = (t, e) => {
  const n = js(e);
  t.slots.default = () => n;
}, Cu = (t, e) => {
  if (t.vnode.shapeFlag & 32) {
    const n = e._;
    n ? (t.slots = ae(e), Qn(e, "_", n)) : Bi(
      e,
      t.slots = {}
    );
  } else
    t.slots = {}, e && Pi(t, e);
  Qn(t.slots, kr, 1);
}, Su = (t, e, n) => {
  const { vnode: r, slots: s } = t;
  let o = !0, c = pe;
  if (r.shapeFlag & 32) {
    const i = e._;
    i ? n && i === 1 ? o = !1 : (ye(s, e), !n && i === 1 && delete s._) : (o = !e.$stable, Bi(e, s)), c = e;
  } else
    e && (Pi(t, e), c = { default: 1 });
  if (o)
    for (const i in s)
      !Fi(i) && c[i] == null && delete s[i];
};
function ks(t, e, n, r, s = !1) {
  if (J(t)) {
    t.forEach(
      (h, d) => ks(
        h,
        e && (J(e) ? e[d] : e),
        n,
        r,
        s
      )
    );
    return;
  }
  if (dn(r) && !s)
    return;
  const o = r.shapeFlag & 4 ? Ar(r.component) || r.component.proxy : r.el, c = s ? null : o, { i, r: a } = t, l = e && e.r, u = i.refs === pe ? i.refs = {} : i.refs, f = i.setupState;
  if (l != null && l !== a && (me(l) ? (u[l] = null, ie(f, l) && (f[l] = null)) : Se(l) && (l.value = null)), ne(a))
    mt(a, i, 12, [c, u]);
  else {
    const h = me(a), d = Se(a);
    if (h || d) {
      const m = () => {
        if (t.f) {
          const _ = h ? ie(f, a) ? f[a] : u[a] : a.value;
          s ? J(_) && Rs(_, o) : J(_) ? _.includes(o) || _.push(o) : h ? (u[a] = [o], ie(f, a) && (f[a] = u[a])) : (a.value = [o], t.k && (u[t.k] = a.value));
        } else
          h ? (u[a] = c, ie(f, a) && (f[a] = c)) : d && (a.value = c, t.k && (u[t.k] = c));
      };
      c ? (m.id = -1, Ne(m, n)) : m();
    }
  }
}
const Ne = Yl;
function Tu(t) {
  return Du(t);
}
function Du(t, e) {
  const n = Xc();
  n.__VUE__ = !0;
  const {
    insert: r,
    remove: s,
    patchProp: o,
    createElement: c,
    createText: i,
    createComment: a,
    setText: l,
    setElementText: u,
    parentNode: f,
    nextSibling: h,
    setScopeId: d = $e,
    insertStaticContent: m
  } = t, _ = (p, g, b, k = null, S = null, O = null, E = void 0, M = null, N = !!g.dynamicChildren) => {
    if (p === g)
      return;
    p && !Dt(p, g) && (k = yt(p), ue(p, S, O, !0), p = null), g.patchFlag === -2 && (N = !1, g.dynamicChildren = null);
    const { type: x, ref: U, shapeFlag: V } = g;
    switch (x) {
      case Er:
        R(p, g, b, k);
        break;
      case ze:
        T(p, g, b, k);
        break;
      case Vr:
        p == null && D(g, b, k, E);
        break;
      case Ae:
        L(
          p,
          g,
          b,
          k,
          S,
          O,
          E,
          M,
          N
        );
        break;
      default:
        V & 1 ? P(
          p,
          g,
          b,
          k,
          S,
          O,
          E,
          M,
          N
        ) : V & 6 ? ee(
          p,
          g,
          b,
          k,
          S,
          O,
          E,
          M,
          N
        ) : (V & 64 || V & 128) && x.process(
          p,
          g,
          b,
          k,
          S,
          O,
          E,
          M,
          N,
          xt
        );
    }
    U != null && S && ks(U, p && p.ref, O, g || p, !g);
  }, R = (p, g, b, k) => {
    if (p == null)
      r(
        g.el = i(g.children),
        b,
        k
      );
    else {
      const S = g.el = p.el;
      g.children !== p.children && l(S, g.children);
    }
  }, T = (p, g, b, k) => {
    p == null ? r(
      g.el = a(g.children || ""),
      b,
      k
    ) : g.el = p.el;
  }, D = (p, g, b, k) => {
    [p.el, p.anchor] = m(
      p.children,
      g,
      b,
      k,
      p.el,
      p.anchor
    );
  }, I = ({ el: p, anchor: g }, b, k) => {
    let S;
    for (; p && p !== g; )
      S = h(p), r(p, b, k), p = S;
    r(g, b, k);
  }, B = ({ el: p, anchor: g }) => {
    let b;
    for (; p && p !== g; )
      b = h(p), s(p), p = b;
    s(g);
  }, P = (p, g, b, k, S, O, E, M, N) => {
    g.type === "svg" ? E = "svg" : g.type === "math" && (E = "mathml"), p == null ? y(
      g,
      b,
      k,
      S,
      O,
      E,
      M,
      N
    ) : Q(
      p,
      g,
      S,
      O,
      E,
      M,
      N
    );
  }, y = (p, g, b, k, S, O, E, M) => {
    let N, x;
    const { props: U, shapeFlag: V, transition: G, dirs: Y } = p;
    if (N = p.el = c(
      p.type,
      O,
      U && U.is,
      U
    ), V & 8 ? u(N, p.children) : V & 16 && $(
      p.children,
      N,
      null,
      k,
      S,
      Hr(p, O),
      E,
      M
    ), Y && kt(p, null, k, "created"), W(N, p, p.scopeId, E, k), U) {
      for (const q in U)
        q !== "value" && !pn(q) && o(
          N,
          q,
          null,
          U[q],
          O,
          p.children,
          k,
          S,
          _e
        );
      "value" in U && o(N, "value", null, U.value, O), (x = U.onVnodeBeforeMount) && Ze(x, k, p);
    }
    Y && kt(p, null, k, "beforeMount");
    const w = Ru(S, G);
    w && G.beforeEnter(N), r(N, g, b), ((x = U && U.onVnodeMounted) || w || Y) && Ne(() => {
      x && Ze(x, k, p), w && G.enter(N), Y && kt(p, null, k, "mounted");
    }, S);
  }, W = (p, g, b, k, S) => {
    if (b && d(p, b), k)
      for (let O = 0; O < k.length; O++)
        d(p, k[O]);
    if (S) {
      let O = S.subTree;
      if (g === O) {
        const E = S.vnode;
        W(
          p,
          E,
          E.scopeId,
          E.slotScopeIds,
          S.parent
        );
      }
    }
  }, $ = (p, g, b, k, S, O, E, M, N = 0) => {
    for (let x = N; x < p.length; x++) {
      const U = p[x] = M ? ft(p[x]) : We(p[x]);
      _(
        null,
        U,
        g,
        b,
        k,
        S,
        O,
        E,
        M
      );
    }
  }, Q = (p, g, b, k, S, O, E) => {
    const M = g.el = p.el;
    let { patchFlag: N, dynamicChildren: x, dirs: U } = g;
    N |= p.patchFlag & 16;
    const V = p.props || pe, G = g.props || pe;
    let Y;
    if (b && wt(b, !1), (Y = G.onVnodeBeforeUpdate) && Ze(Y, b, g, p), U && kt(g, p, b, "beforeUpdate"), b && wt(b, !0), x ? z(
      p.dynamicChildren,
      x,
      M,
      b,
      k,
      Hr(g, S),
      O
    ) : E || C(
      p,
      g,
      M,
      null,
      b,
      k,
      Hr(g, S),
      O,
      !1
    ), N > 0) {
      if (N & 16)
        oe(
          M,
          g,
          V,
          G,
          b,
          k,
          S
        );
      else if (N & 2 && V.class !== G.class && o(M, "class", null, G.class, S), N & 4 && o(M, "style", V.style, G.style, S), N & 8) {
        const w = g.dynamicProps;
        for (let q = 0; q < w.length; q++) {
          const H = w[q], X = V[H], fe = G[H];
          (fe !== X || H === "value") && o(
            M,
            H,
            X,
            fe,
            S,
            p.children,
            b,
            k,
            _e
          );
        }
      }
      N & 1 && p.children !== g.children && u(M, g.children);
    } else
      !E && x == null && oe(
        M,
        g,
        V,
        G,
        b,
        k,
        S
      );
    ((Y = G.onVnodeUpdated) || U) && Ne(() => {
      Y && Ze(Y, b, g, p), U && kt(g, p, b, "updated");
    }, k);
  }, z = (p, g, b, k, S, O, E) => {
    for (let M = 0; M < g.length; M++) {
      const N = p[M], x = g[M], U = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        N.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (N.type === Ae || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Dt(N, x) || // - In the case of a component, it could contain anything.
        N.shapeFlag & 70) ? f(N.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          b
        )
      );
      _(
        N,
        x,
        U,
        null,
        k,
        S,
        O,
        E,
        !0
      );
    }
  }, oe = (p, g, b, k, S, O, E) => {
    if (b !== k) {
      if (b !== pe)
        for (const M in b)
          !pn(M) && !(M in k) && o(
            p,
            M,
            b[M],
            null,
            E,
            g.children,
            S,
            O,
            _e
          );
      for (const M in k) {
        if (pn(M))
          continue;
        const N = k[M], x = b[M];
        N !== x && M !== "value" && o(
          p,
          M,
          x,
          N,
          E,
          g.children,
          S,
          O,
          _e
        );
      }
      "value" in k && o(p, "value", b.value, k.value, E);
    }
  }, L = (p, g, b, k, S, O, E, M, N) => {
    const x = g.el = p ? p.el : i(""), U = g.anchor = p ? p.anchor : i("");
    let { patchFlag: V, dynamicChildren: G, slotScopeIds: Y } = g;
    Y && (M = M ? M.concat(Y) : Y), p == null ? (r(x, b, k), r(U, b, k), $(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      g.children || [],
      b,
      U,
      S,
      O,
      E,
      M,
      N
    )) : V > 0 && V & 64 && G && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    p.dynamicChildren ? (z(
      p.dynamicChildren,
      G,
      b,
      S,
      O,
      E,
      M
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (g.key != null || S && g === S.subTree) && $i(
      p,
      g,
      !0
      /* shallow */
    )) : C(
      p,
      g,
      b,
      U,
      S,
      O,
      E,
      M,
      N
    );
  }, ee = (p, g, b, k, S, O, E, M, N) => {
    g.slotScopeIds = M, p == null ? g.shapeFlag & 512 ? S.ctx.activate(
      g,
      b,
      k,
      E,
      N
    ) : A(
      g,
      b,
      k,
      S,
      O,
      E,
      N
    ) : K(p, g, N);
  }, A = (p, g, b, k, S, O, E) => {
    const M = p.component = Fu(
      p,
      k,
      S
    );
    if (yr(p) && (M.ctx.renderer = xt), Pu(M), M.asyncDep) {
      if (S && S.registerDep(M, F), !p.el) {
        const N = M.subTree = ge(ze);
        T(null, N, g, b);
      }
    } else
      F(
        M,
        p,
        g,
        b,
        S,
        O,
        E
      );
  }, K = (p, g, b) => {
    const k = g.component = p.component;
    if (Gl(p, g, b))
      if (k.asyncDep && !k.asyncResolved) {
        v(k, g, b);
        return;
      } else
        k.next = g, Pl(k.update), k.effect.dirty = !0, k.update();
    else
      g.el = p.el, k.vnode = g;
  }, F = (p, g, b, k, S, O, E) => {
    const M = () => {
      if (p.isMounted) {
        let { next: U, bu: V, u: G, parent: Y, vnode: w } = p;
        {
          const we = Ui(p);
          if (we) {
            U && (U.el = w.el, v(p, U, E)), we.asyncDep.then(() => {
              p.isUnmounted || M();
            });
            return;
          }
        }
        let q = U, H;
        wt(p, !1), U ? (U.el = w.el, v(p, U, E)) : U = w, V && Zn(V), (H = U.props && U.props.onVnodeBeforeUpdate) && Ze(H, Y, U, w), wt(p, !0);
        const X = $r(p), fe = p.subTree;
        p.subTree = X, _(
          fe,
          X,
          // parent may have changed if it's in a teleport
          f(fe.el),
          // anchor may have changed if it's in a fragment
          yt(fe),
          p,
          S,
          O
        ), U.el = X.el, q === null && jl(p, X.el), G && Ne(G, S), (H = U.props && U.props.onVnodeUpdated) && Ne(
          () => Ze(H, Y, U, w),
          S
        );
      } else {
        let U;
        const { el: V, props: G } = g, { bm: Y, m: w, parent: q } = p, H = dn(g);
        if (wt(p, !1), Y && Zn(Y), !H && (U = G && G.onVnodeBeforeMount) && Ze(U, q, g), wt(p, !0), V && Mn) {
          const X = () => {
            p.subTree = $r(p), Mn(
              V,
              p.subTree,
              p,
              S,
              null
            );
          };
          H ? g.type.__asyncLoader().then(
            // note: we are moving the render call into an async callback,
            // which means it won't track dependencies - but it's ok because
            // a server-rendered async wrapper is already in resolved state
            // and it will never need to change.
            () => !p.isUnmounted && X()
          ) : X();
        } else {
          const X = p.subTree = $r(p);
          _(
            null,
            X,
            b,
            k,
            p,
            S,
            O
          ), g.el = X.el;
        }
        if (w && Ne(w, S), !H && (U = G && G.onVnodeMounted)) {
          const X = g;
          Ne(
            () => Ze(U, q, X),
            S
          );
        }
        (g.shapeFlag & 256 || q && dn(q.vnode) && q.vnode.shapeFlag & 256) && p.a && Ne(p.a, S), p.isMounted = !0, g = b = k = null;
      }
    }, N = p.effect = new Ns(
      M,
      $e,
      () => zs(x),
      p.scope
      // track it in component's effect scope
    ), x = p.update = () => {
      N.dirty && N.run();
    };
    x.id = p.uid, wt(p, !0), x();
  }, v = (p, g, b) => {
    g.component = p;
    const k = p.vnode.props;
    p.vnode = g, p.next = null, wu(p, g.props, k, b), Su(p, g.children, b), Bt(), wo(p), Pt();
  }, C = (p, g, b, k, S, O, E, M, N = !1) => {
    const x = p && p.children, U = p ? p.shapeFlag : 0, V = g.children, { patchFlag: G, shapeFlag: Y } = g;
    if (G > 0) {
      if (G & 128) {
        te(
          x,
          V,
          b,
          k,
          S,
          O,
          E,
          M,
          N
        );
        return;
      } else if (G & 256) {
        j(
          x,
          V,
          b,
          k,
          S,
          O,
          E,
          M,
          N
        );
        return;
      }
    }
    Y & 8 ? (U & 16 && _e(x, S, O), V !== x && u(b, V)) : U & 16 ? Y & 16 ? te(
      x,
      V,
      b,
      k,
      S,
      O,
      E,
      M,
      N
    ) : _e(x, S, O, !0) : (U & 8 && u(b, ""), Y & 16 && $(
      V,
      b,
      k,
      S,
      O,
      E,
      M,
      N
    ));
  }, j = (p, g, b, k, S, O, E, M, N) => {
    p = p || jt, g = g || jt;
    const x = p.length, U = g.length, V = Math.min(x, U);
    let G;
    for (G = 0; G < V; G++) {
      const Y = g[G] = N ? ft(g[G]) : We(g[G]);
      _(
        p[G],
        Y,
        b,
        null,
        S,
        O,
        E,
        M,
        N
      );
    }
    x > U ? _e(
      p,
      S,
      O,
      !0,
      !1,
      V
    ) : $(
      g,
      b,
      k,
      S,
      O,
      E,
      M,
      N,
      V
    );
  }, te = (p, g, b, k, S, O, E, M, N) => {
    let x = 0;
    const U = g.length;
    let V = p.length - 1, G = U - 1;
    for (; x <= V && x <= G; ) {
      const Y = p[x], w = g[x] = N ? ft(g[x]) : We(g[x]);
      if (Dt(Y, w))
        _(
          Y,
          w,
          b,
          null,
          S,
          O,
          E,
          M,
          N
        );
      else
        break;
      x++;
    }
    for (; x <= V && x <= G; ) {
      const Y = p[V], w = g[G] = N ? ft(g[G]) : We(g[G]);
      if (Dt(Y, w))
        _(
          Y,
          w,
          b,
          null,
          S,
          O,
          E,
          M,
          N
        );
      else
        break;
      V--, G--;
    }
    if (x > V) {
      if (x <= G) {
        const Y = G + 1, w = Y < U ? g[Y].el : k;
        for (; x <= G; )
          _(
            null,
            g[x] = N ? ft(g[x]) : We(g[x]),
            b,
            w,
            S,
            O,
            E,
            M,
            N
          ), x++;
      }
    } else if (x > G)
      for (; x <= V; )
        ue(p[x], S, O, !0), x++;
    else {
      const Y = x, w = x, q = /* @__PURE__ */ new Map();
      for (x = w; x <= G; x++) {
        const Oe = g[x] = N ? ft(g[x]) : We(g[x]);
        Oe.key != null && q.set(Oe.key, x);
      }
      let H, X = 0;
      const fe = G - w + 1;
      let we = !1, On = 0;
      const Et = new Array(fe);
      for (x = 0; x < fe; x++)
        Et[x] = 0;
      for (x = Y; x <= V; x++) {
        const Oe = p[x];
        if (X >= fe) {
          ue(Oe, S, O, !0);
          continue;
        }
        let Ke;
        if (Oe.key != null)
          Ke = q.get(Oe.key);
        else
          for (H = w; H <= G; H++)
            if (Et[H - w] === 0 && Dt(Oe, g[H])) {
              Ke = H;
              break;
            }
        Ke === void 0 ? ue(Oe, S, O, !0) : (Et[Ke - w] = x + 1, Ke >= On ? On = Ke : we = !0, _(
          Oe,
          g[Ke],
          b,
          null,
          S,
          O,
          E,
          M,
          N
        ), X++);
      }
      const po = we ? Lu(Et) : jt;
      for (H = po.length - 1, x = fe - 1; x >= 0; x--) {
        const Oe = w + x, Ke = g[Oe], go = Oe + 1 < U ? g[Oe + 1].el : k;
        Et[x] === 0 ? _(
          null,
          Ke,
          b,
          go,
          S,
          O,
          E,
          M,
          N
        ) : we && (H < 0 || x !== po[H] ? re(Ke, b, go, 2) : H--);
      }
    }
  }, re = (p, g, b, k, S = null) => {
    const { el: O, type: E, transition: M, children: N, shapeFlag: x } = p;
    if (x & 6) {
      re(p.component.subTree, g, b, k);
      return;
    }
    if (x & 128) {
      p.suspense.move(g, b, k);
      return;
    }
    if (x & 64) {
      E.move(p, g, b, xt);
      return;
    }
    if (E === Ae) {
      r(O, g, b);
      for (let V = 0; V < N.length; V++)
        re(N[V], g, b, k);
      r(p.anchor, g, b);
      return;
    }
    if (E === Vr) {
      I(p, g, b);
      return;
    }
    if (k !== 2 && x & 1 && M)
      if (k === 0)
        M.beforeEnter(O), r(O, g, b), Ne(() => M.enter(O), S);
      else {
        const { leave: V, delayLeave: G, afterLeave: Y } = M, w = () => r(O, g, b), q = () => {
          V(O, () => {
            w(), Y && Y();
          });
        };
        G ? G(O, w, q) : q();
      }
    else
      r(O, g, b);
  }, ue = (p, g, b, k = !1, S = !1) => {
    const {
      type: O,
      props: E,
      ref: M,
      children: N,
      dynamicChildren: x,
      shapeFlag: U,
      patchFlag: V,
      dirs: G
    } = p;
    if (M != null && ks(M, null, b, p, !0), U & 256) {
      g.ctx.deactivate(p);
      return;
    }
    const Y = U & 1 && G, w = !dn(p);
    let q;
    if (w && (q = E && E.onVnodeBeforeUnmount) && Ze(q, g, p), U & 6)
      Te(p.component, b, k);
    else {
      if (U & 128) {
        p.suspense.unmount(b, k);
        return;
      }
      Y && kt(p, null, g, "beforeUnmount"), U & 64 ? p.type.remove(
        p,
        g,
        b,
        S,
        xt,
        k
      ) : x && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (O !== Ae || V > 0 && V & 64) ? _e(
        x,
        g,
        b,
        !1,
        !0
      ) : (O === Ae && V & 384 || !S && U & 16) && _e(N, g, b), k && xe(p);
    }
    (w && (q = E && E.onVnodeUnmounted) || Y) && Ne(() => {
      q && Ze(q, g, p), Y && kt(p, null, g, "unmounted");
    }, b);
  }, xe = (p) => {
    const { type: g, el: b, anchor: k, transition: S } = p;
    if (g === Ae) {
      Ut(b, k);
      return;
    }
    if (g === Vr) {
      B(p);
      return;
    }
    const O = () => {
      s(b), S && !S.persisted && S.afterLeave && S.afterLeave();
    };
    if (p.shapeFlag & 1 && S && !S.persisted) {
      const { leave: E, delayLeave: M } = S, N = () => E(b, O);
      M ? M(p.el, O, N) : N();
    } else
      O();
  }, Ut = (p, g) => {
    let b;
    for (; p !== g; )
      b = h(p), s(p), p = b;
    s(g);
  }, Te = (p, g, b) => {
    const { bum: k, scope: S, update: O, subTree: E, um: M } = p;
    k && Zn(k), S.stop(), O && (O.active = !1, ue(E, p, g, b)), M && Ne(M, g), Ne(() => {
      p.isUnmounted = !0;
    }, g), g && g.pendingBranch && !g.isUnmounted && p.asyncDep && !p.asyncResolved && p.suspenseId === g.pendingId && (g.deps--, g.deps === 0 && g.resolve());
  }, _e = (p, g, b, k = !1, S = !1, O = 0) => {
    for (let E = O; E < p.length; E++)
      ue(p[E], g, b, k, S);
  }, yt = (p) => p.shapeFlag & 6 ? yt(p.component.subTree) : p.shapeFlag & 128 ? p.suspense.next() : h(p.anchor || p.el);
  let zt = !1;
  const cn = (p, g, b) => {
    p == null ? g._vnode && ue(g._vnode, null, null, !0) : _(
      g._vnode || null,
      p,
      g,
      null,
      null,
      null,
      b
    ), zt || (zt = !0, wo(), yi(), zt = !1), g._vnode = p;
  }, xt = {
    p: _,
    um: ue,
    m: re,
    r: xe,
    mt: A,
    mc: $,
    pc: C,
    pbc: z,
    n: yt,
    o: t
  };
  let In, Mn;
  return {
    render: cn,
    hydrate: In,
    createApp: xu(cn, In)
  };
}
function Hr({ type: t, props: e }, n) {
  return n === "svg" && t === "foreignObject" || n === "mathml" && t === "annotation-xml" && e && e.encoding && e.encoding.includes("html") ? void 0 : n;
}
function wt({ effect: t, update: e }, n) {
  t.allowRecurse = e.allowRecurse = n;
}
function Ru(t, e) {
  return (!t || t && !t.pendingBranch) && e && !e.persisted;
}
function $i(t, e, n = !1) {
  const r = t.children, s = e.children;
  if (J(r) && J(s))
    for (let o = 0; o < r.length; o++) {
      const c = r[o];
      let i = s[o];
      i.shapeFlag & 1 && !i.dynamicChildren && ((i.patchFlag <= 0 || i.patchFlag === 32) && (i = s[o] = ft(s[o]), i.el = c.el), n || $i(c, i)), i.type === Er && (i.el = c.el);
    }
}
function Lu(t) {
  const e = t.slice(), n = [0];
  let r, s, o, c, i;
  const a = t.length;
  for (r = 0; r < a; r++) {
    const l = t[r];
    if (l !== 0) {
      if (s = n[n.length - 1], t[s] < l) {
        e[r] = s, n.push(r);
        continue;
      }
      for (o = 0, c = n.length - 1; o < c; )
        i = o + c >> 1, t[n[i]] < l ? o = i + 1 : c = i;
      l < t[n[o]] && (o > 0 && (e[r] = n[o - 1]), n[o] = r);
    }
  }
  for (o = n.length, c = n[o - 1]; o-- > 0; )
    n[o] = c, c = e[c];
  return n;
}
function Ui(t) {
  const e = t.subTree.component;
  if (e)
    return e.asyncDep && !e.asyncResolved ? e : Ui(e);
}
const Nu = (t) => t.__isTeleport, Ae = Symbol.for("v-fgt"), Er = Symbol.for("v-txt"), ze = Symbol.for("v-cmt"), Vr = Symbol.for("v-stc"), _n = [];
let Ge = null;
function Z(t = !1) {
  _n.push(Ge = t ? null : []);
}
function Iu() {
  _n.pop(), Ge = _n[_n.length - 1] || null;
}
let kn = 1;
function qo(t) {
  kn += t;
}
function zi(t) {
  return t.dynamicChildren = kn > 0 ? Ge || jt : null, Iu(), kn > 0 && Ge && Ge.push(t), t;
}
function ce(t, e, n, r, s, o) {
  return zi(
    he(
      t,
      e,
      n,
      r,
      s,
      o,
      !0
    )
  );
}
function be(t, e, n, r, s) {
  return zi(
    ge(
      t,
      e,
      n,
      r,
      s,
      !0
    )
  );
}
function or(t) {
  return t ? t.__v_isVNode === !0 : !1;
}
function Dt(t, e) {
  return t.type === e.type && t.key === e.key;
}
const kr = "__vInternal", Hi = ({ key: t }) => t ?? null, Yn = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? me(t) || Se(t) || ne(t) ? { i: ve, r: t, k: e, f: !!n } : t : null);
function he(t, e = null, n = null, r = 0, s = null, o = t === Ae ? 0 : 1, c = !1, i = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && Hi(e),
    ref: e && Yn(e),
    scopeId: ki,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: o,
    patchFlag: r,
    dynamicProps: s,
    dynamicChildren: null,
    appContext: null,
    ctx: ve
  };
  return i ? (Ws(a, n), o & 128 && t.normalize(a)) : n && (a.shapeFlag |= me(n) ? 8 : 16), kn > 0 && // avoid a block node from tracking itself
  !c && // has current parent block
  Ge && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || o & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && Ge.push(a), a;
}
const ge = Mu;
function Mu(t, e = null, n = null, r = 0, s = null, o = !1) {
  if ((!t || t === wi) && (t = ze), or(t)) {
    const i = bt(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && Ws(i, n), kn > 0 && !o && Ge && (i.shapeFlag & 6 ? Ge[Ge.indexOf(t)] = i : Ge.push(i)), i.patchFlag |= -2, i;
  }
  if (Vu(t) && (t = t.__vccOpts), e) {
    e = Ks(e);
    let { class: i, style: a } = e;
    i && !me(i) && (e.class = nn(i)), de(a) && (pi(a) && !J(a) && (a = ye({}, a)), e.style = Tn(a));
  }
  const c = me(t) ? 1 : Jl(t) ? 128 : Nu(t) ? 64 : de(t) ? 4 : ne(t) ? 2 : 0;
  return he(
    t,
    e,
    n,
    r,
    s,
    c,
    o,
    !0
  );
}
function Ks(t) {
  return t ? pi(t) || kr in t ? ye({}, t) : t : null;
}
function bt(t, e, n = !1) {
  const { props: r, ref: s, patchFlag: o, children: c } = t, i = e ? Vi(r || {}, e) : r;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: i,
    key: i && Hi(i),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && s ? J(s) ? s.concat(Yn(e)) : [s, Yn(e)] : Yn(e)
    ) : s,
    scopeId: t.scopeId,
    slotScopeIds: t.slotScopeIds,
    children: c,
    target: t.target,
    targetAnchor: t.targetAnchor,
    staticCount: t.staticCount,
    shapeFlag: t.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: e && t.type !== Ae ? o === -1 ? 16 : o | 16 : o,
    dynamicProps: t.dynamicProps,
    dynamicChildren: t.dynamicChildren,
    appContext: t.appContext,
    dirs: t.dirs,
    transition: t.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: t.component,
    suspense: t.suspense,
    ssContent: t.ssContent && bt(t.ssContent),
    ssFallback: t.ssFallback && bt(t.ssFallback),
    el: t.el,
    anchor: t.anchor,
    ctx: t.ctx,
    ce: t.ce
  };
}
function Zs(t = " ", e = 0) {
  return ge(Er, null, t, e);
}
function Fe(t = "", e = !1) {
  return e ? (Z(), be(ze, null, t)) : ge(ze, null, t);
}
function We(t) {
  return t == null || typeof t == "boolean" ? ge(ze) : J(t) ? ge(
    Ae,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : typeof t == "object" ? ft(t) : ge(Er, null, String(t));
}
function ft(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : bt(t);
}
function Ws(t, e) {
  let n = 0;
  const { shapeFlag: r } = t;
  if (e == null)
    e = null;
  else if (J(e))
    n = 16;
  else if (typeof e == "object")
    if (r & 65) {
      const s = e.default;
      s && (s._c && (s._d = !1), Ws(t, s()), s._c && (s._d = !0));
      return;
    } else {
      n = 32;
      const s = e._;
      !s && !(kr in e) ? e._ctx = ve : s === 3 && ve && (ve.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else
    ne(e) ? (e = { default: e, _ctx: ve }, n = 32) : (e = String(e), r & 64 ? (n = 16, e = [Zs(e)]) : n = 8);
  t.children = e, t.shapeFlag |= n;
}
function Vi(...t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    for (const s in r)
      if (s === "class")
        e.class !== r.class && (e.class = nn([e.class, r.class]));
      else if (s === "style")
        e.style = Tn([e.style, r.style]);
      else if (pr(s)) {
        const o = e[s], c = r[s];
        c && o !== c && !(J(o) && o.includes(c)) && (e[s] = o ? [].concat(o, c) : c);
      } else
        s !== "" && (e[s] = r[s]);
  }
  return e;
}
function Ze(t, e, n, r = null) {
  Ue(t, e, 7, [
    n,
    r
  ]);
}
const Ou = Mi();
let qu = 0;
function Fu(t, e, n) {
  const r = t.type, s = (e ? e.appContext : t.appContext) || Ou, o = {
    uid: qu++,
    vnode: t,
    type: r,
    parent: e,
    appContext: s,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new cl(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: e ? e.provides : Object.create(s.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: qi(r, s),
    emitsOptions: Ei(r, s),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: pe,
    // inheritAttrs
    inheritAttrs: r.inheritAttrs,
    // state
    ctx: pe,
    data: pe,
    props: pe,
    attrs: pe,
    slots: pe,
    refs: pe,
    setupState: pe,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return o.ctx = { _: o }, o.root = e ? e.root : o, o.emit = zl.bind(null, o), t.ce && t.ce(o), o;
}
let ke = null;
const Bu = () => ke || ve;
let cr, ws;
{
  const t = Xc(), e = (n, r) => {
    let s;
    return (s = t[n]) || (s = t[n] = []), s.push(r), (o) => {
      s.length > 1 ? s.forEach((c) => c(o)) : s[0](o);
    };
  };
  cr = e(
    "__VUE_INSTANCE_SETTERS__",
    (n) => ke = n
  ), ws = e(
    "__VUE_SSR_SETTERS__",
    (n) => wr = n
  );
}
const Dn = (t) => {
  const e = ke;
  return cr(t), t.scope.on(), () => {
    t.scope.off(), cr(e);
  };
}, Fo = () => {
  ke && ke.scope.off(), cr(null);
};
function Gi(t) {
  return t.vnode.shapeFlag & 4;
}
let wr = !1;
function Pu(t, e = !1) {
  e && ws(e);
  const { props: n, children: r } = t.vnode, s = Gi(t);
  ku(t, n, s, e), Cu(t, r);
  const o = s ? $u(t, e) : void 0;
  return e && ws(!1), o;
}
function $u(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = di(new Proxy(t.ctx, du));
  const { setup: r } = n;
  if (r) {
    const s = t.setupContext = r.length > 1 ? zu(t) : null, o = Dn(t);
    Bt();
    const c = mt(
      r,
      t,
      0,
      [
        t.props,
        s
      ]
    );
    if (Pt(), o(), Wc(c)) {
      if (c.then(Fo, Fo), e)
        return c.then((i) => {
          Bo(t, i, e);
        }).catch((i) => {
          br(i, t, 0);
        });
      t.asyncDep = c;
    } else
      Bo(t, c, e);
  } else
    ji(t, e);
}
function Bo(t, e, n) {
  ne(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : de(e) && (t.setupState = _i(e)), ji(t, n);
}
let Po;
function ji(t, e, n) {
  const r = t.type;
  if (!t.render) {
    if (!e && Po && !r.render) {
      const s = r.template || Gs(t).template;
      if (s) {
        const { isCustomElement: o, compilerOptions: c } = t.appContext.config, { delimiters: i, compilerOptions: a } = r, l = ye(
          ye(
            {
              isCustomElement: o,
              delimiters: i
            },
            c
          ),
          a
        );
        r.render = Po(s, l);
      }
    }
    t.render = r.render || $e;
  }
  {
    const s = Dn(t);
    Bt();
    try {
      gu(t);
    } finally {
      Pt(), s();
    }
  }
}
function Uu(t) {
  return t.attrsProxy || (t.attrsProxy = new Proxy(
    t.attrs,
    {
      get(e, n) {
        return Me(t, "get", "$attrs"), e[n];
      }
    }
  ));
}
function zu(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    get attrs() {
      return Uu(t);
    },
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function Ar(t) {
  if (t.exposed)
    return t.exposeProxy || (t.exposeProxy = new Proxy(_i(di(t.exposed)), {
      get(e, n) {
        if (n in e)
          return e[n];
        if (n in gn)
          return gn[n](t);
      },
      has(e, n) {
        return n in e || n in gn;
      }
    }));
}
function Hu(t, e = !0) {
  return ne(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function Vu(t) {
  return ne(t) && "__vccOpts" in t;
}
const Re = (t, e) => Rl(t, e, wr);
function Ki(t, e, n) {
  const r = arguments.length;
  return r === 2 ? de(e) && !J(e) ? or(e) ? ge(t, null, [e]) : ge(t, e) : ge(t, null, e) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && or(n) && (n = [n]), ge(t, e, n));
}
const Gu = "3.4.21";
/**
* @vue/runtime-dom v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const ju = "http://www.w3.org/2000/svg", Ku = "http://www.w3.org/1998/Math/MathML", ht = typeof document < "u" ? document : null, $o = ht && /* @__PURE__ */ ht.createElement("template"), Zu = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, r) => {
    const s = e === "svg" ? ht.createElementNS(ju, t) : e === "mathml" ? ht.createElementNS(Ku, t) : ht.createElement(t, n ? { is: n } : void 0);
    return t === "select" && r && r.multiple != null && s.setAttribute("multiple", r.multiple), s;
  },
  createText: (t) => ht.createTextNode(t),
  createComment: (t) => ht.createComment(t),
  setText: (t, e) => {
    t.nodeValue = e;
  },
  setElementText: (t, e) => {
    t.textContent = e;
  },
  parentNode: (t) => t.parentNode,
  nextSibling: (t) => t.nextSibling,
  querySelector: (t) => ht.querySelector(t),
  setScopeId(t, e) {
    t.setAttribute(e, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(t, e, n, r, s, o) {
    const c = n ? n.previousSibling : e.lastChild;
    if (s && (s === o || s.nextSibling))
      for (; e.insertBefore(s.cloneNode(!0), n), !(s === o || !(s = s.nextSibling)); )
        ;
    else {
      $o.innerHTML = r === "svg" ? `<svg>${t}</svg>` : r === "mathml" ? `<math>${t}</math>` : t;
      const i = $o.content;
      if (r === "svg" || r === "mathml") {
        const a = i.firstChild;
        for (; a.firstChild; )
          i.appendChild(a.firstChild);
        i.removeChild(a);
      }
      e.insertBefore(i, n);
    }
    return [
      // first
      c ? c.nextSibling : e.firstChild,
      // last
      n ? n.previousSibling : e.lastChild
    ];
  }
}, it = "transition", an = "animation", wn = Symbol("_vtc"), ir = (t, { slots: e }) => Ki(ru, Wu(t), e);
ir.displayName = "Transition";
const Zi = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: !0
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
ir.props = /* @__PURE__ */ ye(
  {},
  Ti,
  Zi
);
const At = (t, e = []) => {
  J(t) ? t.forEach((n) => n(...e)) : t && t(...e);
}, Uo = (t) => t ? J(t) ? t.some((e) => e.length > 1) : t.length > 1 : !1;
function Wu(t) {
  const e = {};
  for (const L in t)
    L in Zi || (e[L] = t[L]);
  if (t.css === !1)
    return e;
  const {
    name: n = "v",
    type: r,
    duration: s,
    enterFromClass: o = `${n}-enter-from`,
    enterActiveClass: c = `${n}-enter-active`,
    enterToClass: i = `${n}-enter-to`,
    appearFromClass: a = o,
    appearActiveClass: l = c,
    appearToClass: u = i,
    leaveFromClass: f = `${n}-leave-from`,
    leaveActiveClass: h = `${n}-leave-active`,
    leaveToClass: d = `${n}-leave-to`
  } = t, m = Ju(s), _ = m && m[0], R = m && m[1], {
    onBeforeEnter: T,
    onEnter: D,
    onEnterCancelled: I,
    onLeave: B,
    onLeaveCancelled: P,
    onBeforeAppear: y = T,
    onAppear: W = D,
    onAppearCancelled: $ = I
  } = e, Q = (L, ee, A) => {
    Ct(L, ee ? u : i), Ct(L, ee ? l : c), A && A();
  }, z = (L, ee) => {
    L._isLeaving = !1, Ct(L, f), Ct(L, d), Ct(L, h), ee && ee();
  }, oe = (L) => (ee, A) => {
    const K = L ? W : D, F = () => Q(ee, L, A);
    At(K, [ee, F]), zo(() => {
      Ct(ee, L ? a : o), at(ee, L ? u : i), Uo(K) || Ho(ee, r, _, F);
    });
  };
  return ye(e, {
    onBeforeEnter(L) {
      At(T, [L]), at(L, o), at(L, c);
    },
    onBeforeAppear(L) {
      At(y, [L]), at(L, a), at(L, l);
    },
    onEnter: oe(!1),
    onAppear: oe(!0),
    onLeave(L, ee) {
      L._isLeaving = !0;
      const A = () => z(L, ee);
      at(L, f), Qu(), at(L, h), zo(() => {
        L._isLeaving && (Ct(L, f), at(L, d), Uo(B) || Ho(L, r, R, A));
      }), At(B, [L, A]);
    },
    onEnterCancelled(L) {
      Q(L, !1), At(I, [L]);
    },
    onAppearCancelled(L) {
      Q(L, !0), At($, [L]);
    },
    onLeaveCancelled(L) {
      z(L), At(P, [L]);
    }
  });
}
function Ju(t) {
  if (t == null)
    return null;
  if (de(t))
    return [Gr(t.enter), Gr(t.leave)];
  {
    const e = Gr(t);
    return [e, e];
  }
}
function Gr(t) {
  return Qa(t);
}
function at(t, e) {
  e.split(/\s+/).forEach((n) => n && t.classList.add(n)), (t[wn] || (t[wn] = /* @__PURE__ */ new Set())).add(e);
}
function Ct(t, e) {
  e.split(/\s+/).forEach((r) => r && t.classList.remove(r));
  const n = t[wn];
  n && (n.delete(e), n.size || (t[wn] = void 0));
}
function zo(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let Yu = 0;
function Ho(t, e, n, r) {
  const s = t._endId = ++Yu, o = () => {
    s === t._endId && r();
  };
  if (n)
    return setTimeout(o, n);
  const { type: c, timeout: i, propCount: a } = Xu(t, e);
  if (!c)
    return r();
  const l = c + "end";
  let u = 0;
  const f = () => {
    t.removeEventListener(l, h), o();
  }, h = (d) => {
    d.target === t && ++u >= a && f();
  };
  setTimeout(() => {
    u < a && f();
  }, i + 1), t.addEventListener(l, h);
}
function Xu(t, e) {
  const n = window.getComputedStyle(t), r = (m) => (n[m] || "").split(", "), s = r(`${it}Delay`), o = r(`${it}Duration`), c = Vo(s, o), i = r(`${an}Delay`), a = r(`${an}Duration`), l = Vo(i, a);
  let u = null, f = 0, h = 0;
  e === it ? c > 0 && (u = it, f = c, h = o.length) : e === an ? l > 0 && (u = an, f = l, h = a.length) : (f = Math.max(c, l), u = f > 0 ? c > l ? it : an : null, h = u ? u === it ? o.length : a.length : 0);
  const d = u === it && /\b(transform|all)(,|$)/.test(
    r(`${it}Property`).toString()
  );
  return {
    type: u,
    timeout: f,
    propCount: h,
    hasTransform: d
  };
}
function Vo(t, e) {
  for (; t.length < e.length; )
    t = t.concat(t);
  return Math.max(...e.map((n, r) => Go(n) + Go(t[r])));
}
function Go(t) {
  return t === "auto" ? 0 : Number(t.slice(0, -1).replace(",", ".")) * 1e3;
}
function Qu() {
  return document.body.offsetHeight;
}
function ef(t, e, n) {
  const r = t[wn];
  r && (e = (e ? [e, ...r] : [...r]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
const ar = Symbol("_vod"), Wi = Symbol("_vsh"), tf = {
  beforeMount(t, { value: e }, { transition: n }) {
    t[ar] = t.style.display === "none" ? "" : t.style.display, n && e ? n.beforeEnter(t) : ln(t, e);
  },
  mounted(t, { value: e }, { transition: n }) {
    n && e && n.enter(t);
  },
  updated(t, { value: e, oldValue: n }, { transition: r }) {
    !e != !n && (r ? e ? (r.beforeEnter(t), ln(t, !0), r.enter(t)) : r.leave(t, () => {
      ln(t, !1);
    }) : ln(t, e));
  },
  beforeUnmount(t, { value: e }) {
    ln(t, e);
  }
};
function ln(t, e) {
  t.style.display = e ? t[ar] : "none", t[Wi] = !e;
}
const nf = Symbol(""), rf = /(^|;)\s*display\s*:/;
function sf(t, e, n) {
  const r = t.style, s = me(n);
  let o = !1;
  if (n && !s) {
    if (e)
      if (me(e))
        for (const c of e.split(";")) {
          const i = c.slice(0, c.indexOf(":")).trim();
          n[i] == null && Xn(r, i, "");
        }
      else
        for (const c in e)
          n[c] == null && Xn(r, c, "");
    for (const c in n)
      c === "display" && (o = !0), Xn(r, c, n[c]);
  } else if (s) {
    if (e !== n) {
      const c = r[nf];
      c && (n += ";" + c), r.cssText = n, o = rf.test(n);
    }
  } else
    e && t.removeAttribute("style");
  ar in t && (t[ar] = o ? r.display : "", t[Wi] && (r.display = "none"));
}
const jo = /\s*!important$/;
function Xn(t, e, n) {
  if (J(n))
    n.forEach((r) => Xn(t, e, r));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const r = of(t, e);
    jo.test(n) ? t.setProperty(
      Ft(r),
      n.replace(jo, ""),
      "important"
    ) : t[r] = n;
  }
}
const Ko = ["Webkit", "Moz", "ms"], jr = {};
function of(t, e) {
  const n = jr[e];
  if (n)
    return n;
  let r = Qe(e);
  if (r !== "filter" && r in t)
    return jr[e] = r;
  r = mr(r);
  for (let s = 0; s < Ko.length; s++) {
    const o = Ko[s] + r;
    if (o in t)
      return jr[e] = o;
  }
  return e;
}
const Zo = "http://www.w3.org/1999/xlink";
function cf(t, e, n, r, s) {
  if (r && e.startsWith("xlink:"))
    n == null ? t.removeAttributeNS(Zo, e.slice(6, e.length)) : t.setAttributeNS(Zo, e, n);
  else {
    const o = ol(e);
    n == null || o && !Qc(n) ? t.removeAttribute(e) : t.setAttribute(e, o ? "" : n);
  }
}
function af(t, e, n, r, s, o, c) {
  if (e === "innerHTML" || e === "textContent") {
    r && c(r, s, o), t[e] = n ?? "";
    return;
  }
  const i = t.tagName;
  if (e === "value" && i !== "PROGRESS" && // custom elements may use _value internally
  !i.includes("-")) {
    const l = i === "OPTION" ? t.getAttribute("value") || "" : t.value, u = n ?? "";
    (l !== u || !("_value" in t)) && (t.value = u), n == null && t.removeAttribute(e), t._value = n;
    return;
  }
  let a = !1;
  if (n === "" || n == null) {
    const l = typeof t[e];
    l === "boolean" ? n = Qc(n) : n == null && l === "string" ? (n = "", a = !0) : l === "number" && (n = 0, a = !0);
  }
  try {
    t[e] = n;
  } catch {
  }
  a && t.removeAttribute(e);
}
function Gt(t, e, n, r) {
  t.addEventListener(e, n, r);
}
function lf(t, e, n, r) {
  t.removeEventListener(e, n, r);
}
const Wo = Symbol("_vei");
function uf(t, e, n, r, s = null) {
  const o = t[Wo] || (t[Wo] = {}), c = o[e];
  if (r && c)
    c.value = r;
  else {
    const [i, a] = ff(e);
    if (r) {
      const l = o[e] = df(r, s);
      Gt(t, i, l, a);
    } else
      c && (lf(t, i, c, a), o[e] = void 0);
  }
}
const Jo = /(?:Once|Passive|Capture)$/;
function ff(t) {
  let e;
  if (Jo.test(t)) {
    e = {};
    let r;
    for (; r = t.match(Jo); )
      t = t.slice(0, t.length - r[0].length), e[r[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : Ft(t.slice(2)), e];
}
let Kr = 0;
const hf = /* @__PURE__ */ Promise.resolve(), pf = () => Kr || (hf.then(() => Kr = 0), Kr = Date.now());
function df(t, e) {
  const n = (r) => {
    if (!r._vts)
      r._vts = Date.now();
    else if (r._vts <= n.attached)
      return;
    Ue(
      gf(r, n.value),
      e,
      5,
      [r]
    );
  };
  return n.value = t, n.attached = pf(), n;
}
function gf(t, e) {
  if (J(e)) {
    const n = t.stopImmediatePropagation;
    return t.stopImmediatePropagation = () => {
      n.call(t), t._stopped = !0;
    }, e.map((r) => (s) => !s._stopped && r && r(s));
  } else
    return e;
}
const Yo = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // lowercase letter
t.charCodeAt(2) > 96 && t.charCodeAt(2) < 123, mf = (t, e, n, r, s, o, c, i, a) => {
  const l = s === "svg";
  e === "class" ? ef(t, r, l) : e === "style" ? sf(t, n, r) : pr(e) ? Ds(e) || uf(t, e, n, r, c) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : _f(t, e, r, l)) ? af(
    t,
    e,
    r,
    o,
    c,
    i,
    a
  ) : (e === "true-value" ? t._trueValue = r : e === "false-value" && (t._falseValue = r), cf(t, e, r, l));
};
function _f(t, e, n, r) {
  if (r)
    return !!(e === "innerHTML" || e === "textContent" || e in t && Yo(e) && ne(n));
  if (e === "spellcheck" || e === "draggable" || e === "translate" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA")
    return !1;
  if (e === "width" || e === "height") {
    const s = t.tagName;
    if (s === "IMG" || s === "VIDEO" || s === "CANVAS" || s === "SOURCE")
      return !1;
  }
  return Yo(e) && me(n) ? !1 : e in t;
}
const Xo = (t) => {
  const e = t.props["onUpdate:modelValue"] || !1;
  return J(e) ? (n) => Zn(e, n) : e;
};
function bf(t) {
  t.target.composing = !0;
}
function Qo(t) {
  const e = t.target;
  e.composing && (e.composing = !1, e.dispatchEvent(new Event("input")));
}
const Zr = Symbol("_assign"), vf = {
  created(t, { modifiers: { lazy: e, trim: n, number: r } }, s) {
    t[Zr] = Xo(s);
    const o = r || s.props && s.props.type === "number";
    Gt(t, e ? "change" : "input", (c) => {
      if (c.target.composing)
        return;
      let i = t.value;
      n && (i = i.trim()), o && (i = fs(i)), t[Zr](i);
    }), n && Gt(t, "change", () => {
      t.value = t.value.trim();
    }), e || (Gt(t, "compositionstart", bf), Gt(t, "compositionend", Qo), Gt(t, "change", Qo));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(t, { value: e }) {
    t.value = e ?? "";
  },
  beforeUpdate(t, { value: e, modifiers: { lazy: n, trim: r, number: s } }, o) {
    if (t[Zr] = Xo(o), t.composing)
      return;
    const c = s || t.type === "number" ? fs(t.value) : t.value, i = e ?? "";
    c !== i && (document.activeElement === t && t.type !== "range" && (n || r && t.value.trim() === i) || (t.value = i));
  }
}, yf = ["ctrl", "shift", "alt", "meta"], xf = {
  stop: (t) => t.stopPropagation(),
  prevent: (t) => t.preventDefault(),
  self: (t) => t.target !== t.currentTarget,
  ctrl: (t) => !t.ctrlKey,
  shift: (t) => !t.shiftKey,
  alt: (t) => !t.altKey,
  meta: (t) => !t.metaKey,
  left: (t) => "button" in t && t.button !== 0,
  middle: (t) => "button" in t && t.button !== 1,
  right: (t) => "button" in t && t.button !== 2,
  exact: (t, e) => yf.some((n) => t[`${n}Key`] && !e.includes(n))
}, Ef = (t, e) => {
  const n = t._withMods || (t._withMods = {}), r = e.join(".");
  return n[r] || (n[r] = (s, ...o) => {
    for (let c = 0; c < e.length; c++) {
      const i = xf[e[c]];
      if (i && i(s, e))
        return;
    }
    return t(s, ...o);
  });
}, kf = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, wf = (t, e) => {
  const n = t._withKeys || (t._withKeys = {}), r = e.join(".");
  return n[r] || (n[r] = (s) => {
    if (!("key" in s))
      return;
    const o = Ft(s.key);
    if (e.some((c) => c === o || kf[c] === o))
      return t(s);
  });
}, Af = /* @__PURE__ */ ye({ patchProp: mf }, Zu);
let ec;
function Cf() {
  return ec || (ec = Tu(Af));
}
const Sf = (...t) => {
  const e = Cf().createApp(...t), { mount: n } = e;
  return e.mount = (r) => {
    const s = Df(r);
    if (!s)
      return;
    const o = e._component;
    !ne(o) && !o.render && !o.template && (o.template = s.innerHTML), s.innerHTML = "";
    const c = n(s, !1, Tf(s));
    return s instanceof Element && (s.removeAttribute("v-cloak"), s.setAttribute("data-v-app", "")), c;
  }, e;
};
function Tf(t) {
  if (t instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && t instanceof MathMLElement)
    return "mathml";
}
function Df(t) {
  return me(t) ? document.querySelector(t) : t;
}
const un = {
  webhookUrl: "https://webhook.muhbianco.com.br",
  webhookConfig: {
    method: "POST",
    headers: {
      accept: "application/json"
    }
  },
  target: "#n8n-chat",
  mode: "window",
  loadPreviousSession: !0,
  chatInputKey: "chatInput",
  chatSessionKey: "sessionId",
  defaultLanguage: "en",
  showWelcomeScreen: !1,
  initialMessages: ["Olá! 👋", "Eu sou o Smarty Bot, digite algo para começar."],
  i18n: {
    en: {
      title: "Olá! 👋",
      subtitle: "Estamos aqui para te ajudar.",
      footer: "",
      getStarted: "Nova conversa",
      inputPlaceholder: "Digite aqui..",
      closeButtonTooltip: "Fechar conversa"
    }
  },
  theme: {}
}, Rf = "#n8n-chat", Lf = "n8n-chat", tc = `${Lf}/sessionId`, Ji = "Chat", Yi = "ChatOptions";
var Ee = [];
for (var Wr = 0; Wr < 256; ++Wr)
  Ee.push((Wr + 256).toString(16).slice(1));
function Nf(t, e = 0) {
  return (Ee[t[e + 0]] + Ee[t[e + 1]] + Ee[t[e + 2]] + Ee[t[e + 3]] + "-" + Ee[t[e + 4]] + Ee[t[e + 5]] + "-" + Ee[t[e + 6]] + Ee[t[e + 7]] + "-" + Ee[t[e + 8]] + Ee[t[e + 9]] + "-" + Ee[t[e + 10]] + Ee[t[e + 11]] + Ee[t[e + 12]] + Ee[t[e + 13]] + Ee[t[e + 14]] + Ee[t[e + 15]]).toLowerCase();
}
var Hn, If = new Uint8Array(16);
function Mf() {
  if (!Hn && (Hn = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !Hn))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return Hn(If);
}
var Of = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const nc = {
  randomUUID: Of
};
function fn(t, e, n) {
  if (nc.randomUUID && !e && !t)
    return nc.randomUUID();
  t = t || {};
  var r = t.random || (t.rng || Mf)();
  return r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, Nf(r);
}
async function qf() {
  return "";
}
async function Js(...t) {
  var o, c;
  const e = await qf(), n = (o = t[1]) == null ? void 0 : o.body, r = {
    ...e ? { authorization: `Bearer ${e}` } : {},
    ...(c = t[1]) == null ? void 0 : c.headers
  };
  return n instanceof FormData ? delete r["Content-Type"] : r["Content-Type"] = "application/json", await (await fetch(t[0], {
    ...t[1],
    mode: "cors",
    cache: "no-cache",
    headers: r
  })).json();
}
async function Xi(t, e = {}, n = {}) {
  let r = t;
  return Object.keys(e).length > 0 && (r = `${r}?${new URLSearchParams(
    e
  ).toString()}`), await Js(r, { ...n, method: "GET" });
}
async function Qi(t, e = {}, n = {}) {
  return await Js(t, {
    ...n,
    method: "POST",
    body: JSON.stringify(e)
  });
}
async function Ff(t, e = {}, n = [], r = {}) {
  const s = new FormData();
  for (const o in e)
    s.append(o, e[o]);
  for (const o of n)
    s.append("files", o);
  return await Js(t, {
    ...r,
    method: "POST",
    body: s
  });
}
async function Bf(t, e) {
  var r, s;
  return await (((r = e.webhookConfig) == null ? void 0 : r.method) === "POST" ? Qi : Xi)(
    `${e.webhookUrl}`,
    {
      action: "loadPreviousSession",
      [e.chatSessionKey]: t,
      ...e.metadata ? { metadata: e.metadata } : {}
    },
    {
      headers: (s = e.webhookConfig) == null ? void 0 : s.headers
    }
  );
}
var globalSessionId;
async function Pf(t, e, n, r) {
  console.log("t", t, "e", e, "n", n, "r", r);
  const button = document.querySelector('.chat-attachment-button');
  button.disabled = false;
  globalSessionId = n;
  var o, c, i;
  return e.length > 0 ? await Ff(
    `${r.webhookUrl}`,
    {
      action: "sendMessage",
      [r.chatSessionKey]: n,
      [r.chatInputKey]: t,
      ...r.metadata ? { metadata: r.metadata } : {}
    },
    e,
    {
      headers: (o = r.webhookConfig) == null ? void 0 : o.headers
    }
  ) : await (((c = r.webhookConfig) == null ? void 0 : c.method) === "POST" ? Qi : Xi)(
    `${r.webhookUrl}`,
    {
      action: "sendMessage",
      [r.chatSessionKey]: n,
      [r.chatInputKey]: t,
      ...r.metadata ? { metadata: r.metadata } : {}
    },
    {
      headers: (i = r.webhookConfig) == null ? void 0 : i.headers
    }
  );
}
function $f() {
  const t = /* @__PURE__ */ new Map();
  function e(s, o) {
    const c = t.get(s);
    c && c.splice(c.indexOf(o) >>> 0, 1);
  }
  function n(s, o) {
    let c = t.get(s);
    return c ? c.push(o) : c = [o], t.set(s, c), () => e(s, o);
  }
  function r(s, o) {
    const c = t.get(s);
    c && c.slice().forEach(async (i) => {
      await i(o);
    });
  }
  return {
    on: n,
    off: e,
    emit: r
  };
}
function Uf(t) {
  if (!document.querySelector(t)) {
    const n = document.createElement("div");
    t.startsWith("#") && (n.id = t.replace("#", "")), t.startsWith(".") && n.classList.add(t.replace(".", "")), document.body.appendChild(n);
  }
}
function isJSON(str) {
  try {
      JSON.parse(str);
      return true;
  } catch (e) {
      return false;
  }
}
var te;
const Ie = $f(), zf = {
  install(t, e) {
    te = t;
    t.provide(Yi, e);
    const n = Le([]), r = Le(null), s = Le(!1), o = Re(
      () => (e.initialMessages ?? []).map((u) => ({
        id: fn(),
        text: u,
        sender: "bot",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }))
    );
    async function c(u, f = []) {
      const h = {
        id: fn(),
        text: u,
        sender: "user",
        files: f,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      n.value.push(h), s.value = !0, Qt(() => {
        Ie.emit("scrollToBottom");
      });
      const d = await Pf(
        u,
        f,
        r.value,
        e
      );
      let m = d.output ?? d.text ?? "";
      if (m === "" && Object.keys(d).length > 0)
        try {
          m = JSON.stringify(d, null, 2);
        } catch {
        }
      if (isJSON(m)) {
        const arrayM = JSON.parse(m)[0].messages
        for (let item in arrayM) {
          const _array = {
            id: fn(),
            text: arrayM[item],
            sender: "bot",
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          n.value.push(_array), s.value = !1, Qt(() => {
            Ie.emit("scrollToBottom");
          });
        }
      } else {
        const _ = {
          id: fn(),
          text: m,
          sender: "bot",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        n.value.push(_), s.value = !1, Qt(() => {
          Ie.emit("scrollToBottom");
        });
      }
    }
    async function i() {
      if (!e.loadPreviousSession)
        return;
      const u = localStorage.getItem(tc) ?? fn(), f = await Bf(u, e), h = (/* @__PURE__ */ new Date()).toISOString();
      return n.value = ((f == null ? void 0 : f.data) || []).map((d, m) => ({
        id: `${m}`,
        text: d.kwargs.content,
        sender: d.id.includes("HumanMessage") ? "user" : "bot",
        createdAt: h
      })), n.value.length && (r.value = u), u;
    }
    async function a() {
      r.value = fn(), localStorage.setItem(tc, r.value);
    }
    const l = {
      initialMessages: o,
      messages: n,
      currentSessionId: r,
      waitingForResponse: s,
      loadPreviousSession: i,
      startNewSession: a,
      sendMessage: c
    };
    t.provide(Ji, l), t.config.globalProperties.$chat = l;
  }
};
function Ys(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Hf(t) {
  if (t.__esModule)
    return t;
  var e = t.default;
  if (typeof e == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    n.prototype = e.prototype;
  } else
    n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(t).forEach(function(r) {
    var s = Object.getOwnPropertyDescriptor(t, r);
    Object.defineProperty(n, r, s.get ? s : {
      enumerable: !0,
      get: function() {
        return t[r];
      }
    });
  }), n;
}
function ea(t) {
  return t instanceof Map ? t.clear = t.delete = t.set = function() {
    throw new Error("map is read-only");
  } : t instanceof Set && (t.add = t.clear = t.delete = function() {
    throw new Error("set is read-only");
  }), Object.freeze(t), Object.getOwnPropertyNames(t).forEach((e) => {
    const n = t[e], r = typeof n;
    (r === "object" || r === "function") && !Object.isFrozen(n) && ea(n);
  }), t;
}
class rc {
  /**
   * @param {CompiledMode} mode
   */
  constructor(e) {
    e.data === void 0 && (e.data = {}), this.data = e.data, this.isMatchIgnored = !1;
  }
  ignoreMatch() {
    this.isMatchIgnored = !0;
  }
}
function ta(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
function dt(t, ...e) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const r in t)
    n[r] = t[r];
  return e.forEach(function(r) {
    for (const s in r)
      n[s] = r[s];
  }), /** @type {T} */
  n;
}
const Vf = "</span>", sc = (t) => !!t.scope, Gf = (t, { prefix: e }) => {
  if (t.startsWith("language:"))
    return t.replace("language:", "language-");
  if (t.includes(".")) {
    const n = t.split(".");
    return [
      `${e}${n.shift()}`,
      ...n.map((r, s) => `${r}${"_".repeat(s + 1)}`)
    ].join(" ");
  }
  return `${e}${t}`;
};
class jf {
  /**
   * Creates a new HTMLRenderer
   *
   * @param {Tree} parseTree - the parse tree (must support `walk` API)
   * @param {{classPrefix: string}} options
   */
  constructor(e, n) {
    this.buffer = "", this.classPrefix = n.classPrefix, e.walk(this);
  }
  /**
   * Adds texts to the output stream
   *
   * @param {string} text */
  addText(e) {
    this.buffer += ta(e);
  }
  /**
   * Adds a node open to the output stream (if needed)
   *
   * @param {Node} node */
  openNode(e) {
    if (!sc(e))
      return;
    const n = Gf(
      e.scope,
      { prefix: this.classPrefix }
    );
    this.span(n);
  }
  /**
   * Adds a node close to the output stream (if needed)
   *
   * @param {Node} node */
  closeNode(e) {
    sc(e) && (this.buffer += Vf);
  }
  /**
   * returns the accumulated buffer
  */
  value() {
    return this.buffer;
  }
  // helpers
  /**
   * Builds a span element
   *
   * @param {string} className */
  span(e) {
    this.buffer += `<span class="${e}">`;
  }
}
const oc = (t = {}) => {
  const e = { children: [] };
  return Object.assign(e, t), e;
};
class Xs {
  constructor() {
    this.rootNode = oc(), this.stack = [this.rootNode];
  }
  get top() {
    return this.stack[this.stack.length - 1];
  }
  get root() {
    return this.rootNode;
  }
  /** @param {Node} node */
  add(e) {
    this.top.children.push(e);
  }
  /** @param {string} scope */
  openNode(e) {
    const n = oc({ scope: e });
    this.add(n), this.stack.push(n);
  }
  closeNode() {
    if (this.stack.length > 1)
      return this.stack.pop();
  }
  closeAllNodes() {
    for (; this.closeNode(); )
      ;
  }
  toJSON() {
    return JSON.stringify(this.rootNode, null, 4);
  }
  /**
   * @typedef { import("./html_renderer").Renderer } Renderer
   * @param {Renderer} builder
   */
  walk(e) {
    return this.constructor._walk(e, this.rootNode);
  }
  /**
   * @param {Renderer} builder
   * @param {Node} node
   */
  static _walk(e, n) {
    return typeof n == "string" ? e.addText(n) : n.children && (e.openNode(n), n.children.forEach((r) => this._walk(e, r)), e.closeNode(n)), e;
  }
  /**
   * @param {Node} node
   */
  static _collapse(e) {
    typeof e != "string" && e.children && (e.children.every((n) => typeof n == "string") ? e.children = [e.children.join("")] : e.children.forEach((n) => {
      Xs._collapse(n);
    }));
  }
}
class Kf extends Xs {
  /**
   * @param {*} options
   */
  constructor(e) {
    super(), this.options = e;
  }
  /**
   * @param {string} text
   */
  addText(e) {
    e !== "" && this.add(e);
  }
  /** @param {string} scope */
  startScope(e) {
    this.openNode(e);
  }
  endScope() {
    this.closeNode();
  }
  /**
   * @param {Emitter & {root: DataNode}} emitter
   * @param {string} name
   */
  __addSublanguage(e, n) {
    const r = e.root;
    n && (r.scope = `language:${n}`), this.add(r);
  }
  toHTML() {
    return new jf(this, this.options).value();
  }
  finalize() {
    return this.closeAllNodes(), !0;
  }
}
function An(t) {
  return t ? typeof t == "string" ? t : t.source : null;
}
function na(t) {
  return $t("(?=", t, ")");
}
function Zf(t) {
  return $t("(?:", t, ")*");
}
function Wf(t) {
  return $t("(?:", t, ")?");
}
function $t(...t) {
  return t.map((n) => An(n)).join("");
}
function Jf(t) {
  const e = t[t.length - 1];
  return typeof e == "object" && e.constructor === Object ? (t.splice(t.length - 1, 1), e) : {};
}
function Qs(...t) {
  return "(" + (Jf(t).capture ? "" : "?:") + t.map((r) => An(r)).join("|") + ")";
}
function ra(t) {
  return new RegExp(t.toString() + "|").exec("").length - 1;
}
function Yf(t, e) {
  const n = t && t.exec(e);
  return n && n.index === 0;
}
const Xf = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function eo(t, { joinWith: e }) {
  let n = 0;
  return t.map((r) => {
    n += 1;
    const s = n;
    let o = An(r), c = "";
    for (; o.length > 0; ) {
      const i = Xf.exec(o);
      if (!i) {
        c += o;
        break;
      }
      c += o.substring(0, i.index), o = o.substring(i.index + i[0].length), i[0][0] === "\\" && i[1] ? c += "\\" + String(Number(i[1]) + s) : (c += i[0], i[0] === "(" && n++);
    }
    return c;
  }).map((r) => `(${r})`).join(e);
}
const Qf = /\b\B/, sa = "[a-zA-Z]\\w*", to = "[a-zA-Z_]\\w*", oa = "\\b\\d+(\\.\\d+)?", ca = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", ia = "\\b(0b[01]+)", eh = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", th = (t = {}) => {
  const e = /^#![ ]*\//;
  return t.binary && (t.begin = $t(
    e,
    /.*\b/,
    t.binary,
    /\b.*/
  )), dt({
    scope: "meta",
    begin: e,
    end: /$/,
    relevance: 0,
    /** @type {ModeCallback} */
    "on:begin": (n, r) => {
      n.index !== 0 && r.ignoreMatch();
    }
  }, t);
}, Cn = {
  begin: "\\\\[\\s\\S]",
  relevance: 0
}, nh = {
  scope: "string",
  begin: "'",
  end: "'",
  illegal: "\\n",
  contains: [Cn]
}, rh = {
  scope: "string",
  begin: '"',
  end: '"',
  illegal: "\\n",
  contains: [Cn]
}, sh = {
  begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
}, Cr = function(t, e, n = {}) {
  const r = dt(
    {
      scope: "comment",
      begin: t,
      end: e,
      contains: []
    },
    n
  );
  r.contains.push({
    scope: "doctag",
    // hack to avoid the space from being included. the space is necessary to
    // match here to prevent the plain text rule below from gobbling up doctags
    begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
    end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
    excludeBegin: !0,
    relevance: 0
  });
  const s = Qs(
    // list of common 1 and 2 letter words in English
    "I",
    "a",
    "is",
    "so",
    "us",
    "to",
    "at",
    "if",
    "in",
    "it",
    "on",
    // note: this is not an exhaustive list of contractions, just popular ones
    /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
    // contractions - can't we'd they're let's, etc
    /[A-Za-z]+[-][a-z]+/,
    // `no-way`, etc.
    /[A-Za-z][a-z]{2,}/
    // allow capitalized words at beginning of sentences
  );
  return r.contains.push(
    {
      // TODO: how to include ", (, ) without breaking grammars that use these for
      // comment delimiters?
      // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
      // ---
      // this tries to find sequences of 3 english words in a row (without any
      // "programming" type syntax) this gives us a strong signal that we've
      // TRULY found a comment - vs perhaps scanning with the wrong language.
      // It's possible to find something that LOOKS like the start of the
      // comment - but then if there is no readable text - good chance it is a
      // false match and not a comment.
      //
      // for a visual example please see:
      // https://github.com/highlightjs/highlight.js/issues/2827
      begin: $t(
        /[ ]+/,
        // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
        "(",
        s,
        /[.]?[:]?([.][ ]|[ ])/,
        "){3}"
      )
      // look for 3 words in a row
    }
  ), r;
}, oh = Cr("//", "$"), ch = Cr("/\\*", "\\*/"), ih = Cr("#", "$"), ah = {
  scope: "number",
  begin: oa,
  relevance: 0
}, lh = {
  scope: "number",
  begin: ca,
  relevance: 0
}, uh = {
  scope: "number",
  begin: ia,
  relevance: 0
}, fh = {
  scope: "regexp",
  begin: /\/(?=[^/\n]*\/)/,
  end: /\/[gimuy]*/,
  contains: [
    Cn,
    {
      begin: /\[/,
      end: /\]/,
      relevance: 0,
      contains: [Cn]
    }
  ]
}, hh = {
  scope: "title",
  begin: sa,
  relevance: 0
}, ph = {
  scope: "title",
  begin: to,
  relevance: 0
}, dh = {
  // excludes method names from keyword processing
  begin: "\\.\\s*" + to,
  relevance: 0
}, gh = function(t) {
  return Object.assign(
    t,
    {
      /** @type {ModeCallback} */
      "on:begin": (e, n) => {
        n.data._beginMatch = e[1];
      },
      /** @type {ModeCallback} */
      "on:end": (e, n) => {
        n.data._beginMatch !== e[1] && n.ignoreMatch();
      }
    }
  );
};
var Vn = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  APOS_STRING_MODE: nh,
  BACKSLASH_ESCAPE: Cn,
  BINARY_NUMBER_MODE: uh,
  BINARY_NUMBER_RE: ia,
  COMMENT: Cr,
  C_BLOCK_COMMENT_MODE: ch,
  C_LINE_COMMENT_MODE: oh,
  C_NUMBER_MODE: lh,
  C_NUMBER_RE: ca,
  END_SAME_AS_BEGIN: gh,
  HASH_COMMENT_MODE: ih,
  IDENT_RE: sa,
  MATCH_NOTHING_RE: Qf,
  METHOD_GUARD: dh,
  NUMBER_MODE: ah,
  NUMBER_RE: oa,
  PHRASAL_WORDS_MODE: sh,
  QUOTE_STRING_MODE: rh,
  REGEXP_MODE: fh,
  RE_STARTERS_RE: eh,
  SHEBANG: th,
  TITLE_MODE: hh,
  UNDERSCORE_IDENT_RE: to,
  UNDERSCORE_TITLE_MODE: ph
});
function mh(t, e) {
  t.input[t.index - 1] === "." && e.ignoreMatch();
}
function _h(t, e) {
  t.className !== void 0 && (t.scope = t.className, delete t.className);
}
function bh(t, e) {
  e && t.beginKeywords && (t.begin = "\\b(" + t.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", t.__beforeBegin = mh, t.keywords = t.keywords || t.beginKeywords, delete t.beginKeywords, t.relevance === void 0 && (t.relevance = 0));
}
function vh(t, e) {
  Array.isArray(t.illegal) && (t.illegal = Qs(...t.illegal));
}
function yh(t, e) {
  if (t.match) {
    if (t.begin || t.end)
      throw new Error("begin & end are not supported with match");
    t.begin = t.match, delete t.match;
  }
}
function xh(t, e) {
  t.relevance === void 0 && (t.relevance = 1);
}
const Eh = (t, e) => {
  if (!t.beforeMatch)
    return;
  if (t.starts)
    throw new Error("beforeMatch cannot be used with starts");
  const n = Object.assign({}, t);
  Object.keys(t).forEach((r) => {
    delete t[r];
  }), t.keywords = n.keywords, t.begin = $t(n.beforeMatch, na(n.begin)), t.starts = {
    relevance: 0,
    contains: [
      Object.assign(n, { endsParent: !0 })
    ]
  }, t.relevance = 0, delete n.beforeMatch;
}, kh = [
  "of",
  "and",
  "for",
  "in",
  "not",
  "or",
  "if",
  "then",
  "parent",
  // common variable name
  "list",
  // common variable name
  "value"
  // common variable name
], wh = "keyword";
function aa(t, e, n = wh) {
  const r = /* @__PURE__ */ Object.create(null);
  return typeof t == "string" ? s(n, t.split(" ")) : Array.isArray(t) ? s(n, t) : Object.keys(t).forEach(function(o) {
    Object.assign(
      r,
      aa(t[o], e, o)
    );
  }), r;
  function s(o, c) {
    e && (c = c.map((i) => i.toLowerCase())), c.forEach(function(i) {
      const a = i.split("|");
      r[a[0]] = [o, Ah(a[0], a[1])];
    });
  }
}
function Ah(t, e) {
  return e ? Number(e) : Ch(t) ? 0 : 1;
}
function Ch(t) {
  return kh.includes(t.toLowerCase());
}
const cc = {}, Ot = (t) => {
  console.error(t);
}, ic = (t, ...e) => {
  console.log(`WARN: ${t}`, ...e);
}, Ht = (t, e) => {
  cc[`${t}/${e}`] || (console.log(`Deprecated as of ${t}. ${e}`), cc[`${t}/${e}`] = !0);
}, lr = new Error();
function la(t, e, { key: n }) {
  let r = 0;
  const s = t[n], o = {}, c = {};
  for (let i = 1; i <= e.length; i++)
    c[i + r] = s[i], o[i + r] = !0, r += ra(e[i - 1]);
  t[n] = c, t[n]._emit = o, t[n]._multi = !0;
}
function Sh(t) {
  if (Array.isArray(t.begin)) {
    if (t.skip || t.excludeBegin || t.returnBegin)
      throw Ot("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), lr;
    if (typeof t.beginScope != "object" || t.beginScope === null)
      throw Ot("beginScope must be object"), lr;
    la(t, t.begin, { key: "beginScope" }), t.begin = eo(t.begin, { joinWith: "" });
  }
}
function Th(t) {
  if (Array.isArray(t.end)) {
    if (t.skip || t.excludeEnd || t.returnEnd)
      throw Ot("skip, excludeEnd, returnEnd not compatible with endScope: {}"), lr;
    if (typeof t.endScope != "object" || t.endScope === null)
      throw Ot("endScope must be object"), lr;
    la(t, t.end, { key: "endScope" }), t.end = eo(t.end, { joinWith: "" });
  }
}
function Dh(t) {
  t.scope && typeof t.scope == "object" && t.scope !== null && (t.beginScope = t.scope, delete t.scope);
}
function Rh(t) {
  Dh(t), typeof t.beginScope == "string" && (t.beginScope = { _wrap: t.beginScope }), typeof t.endScope == "string" && (t.endScope = { _wrap: t.endScope }), Sh(t), Th(t);
}
function Lh(t) {
  function e(c, i) {
    return new RegExp(
      An(c),
      "m" + (t.case_insensitive ? "i" : "") + (t.unicodeRegex ? "u" : "") + (i ? "g" : "")
    );
  }
  class n {
    constructor() {
      this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
    }
    // @ts-ignore
    addRule(i, a) {
      a.position = this.position++, this.matchIndexes[this.matchAt] = a, this.regexes.push([a, i]), this.matchAt += ra(i) + 1;
    }
    compile() {
      this.regexes.length === 0 && (this.exec = () => null);
      const i = this.regexes.map((a) => a[1]);
      this.matcherRe = e(eo(i, { joinWith: "|" }), !0), this.lastIndex = 0;
    }
    /** @param {string} s */
    exec(i) {
      this.matcherRe.lastIndex = this.lastIndex;
      const a = this.matcherRe.exec(i);
      if (!a)
        return null;
      const l = a.findIndex((f, h) => h > 0 && f !== void 0), u = this.matchIndexes[l];
      return a.splice(0, l), Object.assign(a, u);
    }
  }
  class r {
    constructor() {
      this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
    }
    // @ts-ignore
    getMatcher(i) {
      if (this.multiRegexes[i])
        return this.multiRegexes[i];
      const a = new n();
      return this.rules.slice(i).forEach(([l, u]) => a.addRule(l, u)), a.compile(), this.multiRegexes[i] = a, a;
    }
    resumingScanAtSamePosition() {
      return this.regexIndex !== 0;
    }
    considerAll() {
      this.regexIndex = 0;
    }
    // @ts-ignore
    addRule(i, a) {
      this.rules.push([i, a]), a.type === "begin" && this.count++;
    }
    /** @param {string} s */
    exec(i) {
      const a = this.getMatcher(this.regexIndex);
      a.lastIndex = this.lastIndex;
      let l = a.exec(i);
      if (this.resumingScanAtSamePosition() && !(l && l.index === this.lastIndex)) {
        const u = this.getMatcher(0);
        u.lastIndex = this.lastIndex + 1, l = u.exec(i);
      }
      return l && (this.regexIndex += l.position + 1, this.regexIndex === this.count && this.considerAll()), l;
    }
  }
  function s(c) {
    const i = new r();
    return c.contains.forEach((a) => i.addRule(a.begin, { rule: a, type: "begin" })), c.terminatorEnd && i.addRule(c.terminatorEnd, { type: "end" }), c.illegal && i.addRule(c.illegal, { type: "illegal" }), i;
  }
  function o(c, i) {
    const a = (
      /** @type CompiledMode */
      c
    );
    if (c.isCompiled)
      return a;
    [
      _h,
      // do this early so compiler extensions generally don't have to worry about
      // the distinction between match/begin
      yh,
      Rh,
      Eh
    ].forEach((u) => u(c, i)), t.compilerExtensions.forEach((u) => u(c, i)), c.__beforeBegin = null, [
      bh,
      // do this later so compiler extensions that come earlier have access to the
      // raw array if they wanted to perhaps manipulate it, etc.
      vh,
      // default to 1 relevance if not specified
      xh
    ].forEach((u) => u(c, i)), c.isCompiled = !0;
    let l = null;
    return typeof c.keywords == "object" && c.keywords.$pattern && (c.keywords = Object.assign({}, c.keywords), l = c.keywords.$pattern, delete c.keywords.$pattern), l = l || /\w+/, c.keywords && (c.keywords = aa(c.keywords, t.case_insensitive)), a.keywordPatternRe = e(l, !0), i && (c.begin || (c.begin = /\B|\b/), a.beginRe = e(a.begin), !c.end && !c.endsWithParent && (c.end = /\B|\b/), c.end && (a.endRe = e(a.end)), a.terminatorEnd = An(a.end) || "", c.endsWithParent && i.terminatorEnd && (a.terminatorEnd += (c.end ? "|" : "") + i.terminatorEnd)), c.illegal && (a.illegalRe = e(
      /** @type {RegExp | string} */
      c.illegal
    )), c.contains || (c.contains = []), c.contains = [].concat(...c.contains.map(function(u) {
      return Nh(u === "self" ? c : u);
    })), c.contains.forEach(function(u) {
      o(
        /** @type Mode */
        u,
        a
      );
    }), c.starts && o(c.starts, i), a.matcher = s(a), a;
  }
  if (t.compilerExtensions || (t.compilerExtensions = []), t.contains && t.contains.includes("self"))
    throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
  return t.classNameAliases = dt(t.classNameAliases || {}), o(
    /** @type Mode */
    t
  );
}
function ua(t) {
  return t ? t.endsWithParent || ua(t.starts) : !1;
}
function Nh(t) {
  return t.variants && !t.cachedVariants && (t.cachedVariants = t.variants.map(function(e) {
    return dt(t, { variants: null }, e);
  })), t.cachedVariants ? t.cachedVariants : ua(t) ? dt(t, { starts: t.starts ? dt(t.starts) : null }) : Object.isFrozen(t) ? dt(t) : t;
}
var Ih = "11.9.0";
class Mh extends Error {
  constructor(e, n) {
    super(e), this.name = "HTMLInjectionError", this.html = n;
  }
}
const Jr = ta, ac = dt, lc = Symbol("nomatch"), Oh = 7, fa = function(t) {
  const e = /* @__PURE__ */ Object.create(null), n = /* @__PURE__ */ Object.create(null), r = [];
  let s = !0;
  const o = "Could not find the language '{}', did you forget to load/include a language module?", c = { disableAutodetect: !0, name: "Plain text", contains: [] };
  let i = {
    ignoreUnescapedHTML: !1,
    throwUnescapedHTML: !1,
    noHighlightRe: /^(no-?highlight)$/i,
    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
    classPrefix: "hljs-",
    cssSelector: "pre code",
    languages: null,
    // beta configuration options, subject to change, welcome to discuss
    // https://github.com/highlightjs/highlight.js/issues/1086
    __emitter: Kf
  };
  function a(v) {
    return i.noHighlightRe.test(v);
  }
  function l(v) {
    let C = v.className + " ";
    C += v.parentNode ? v.parentNode.className : "";
    const j = i.languageDetectRe.exec(C);
    if (j) {
      const te = Q(j[1]);
      return te || (ic(o.replace("{}", j[1])), ic("Falling back to no-highlight mode for this block.", v)), te ? j[1] : "no-highlight";
    }
    return C.split(/\s+/).find((te) => a(te) || Q(te));
  }
  function u(v, C, j) {
    let te = "", re = "";
    typeof C == "object" ? (te = v, j = C.ignoreIllegals, re = C.language) : (Ht("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Ht("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), re = v, te = C), j === void 0 && (j = !0);
    const ue = {
      code: te,
      language: re
    };
    K("before:highlight", ue);
    const xe = ue.result ? ue.result : f(ue.language, ue.code, j);
    return xe.code = ue.code, K("after:highlight", xe), xe;
  }
  function f(v, C, j, te) {
    const re = /* @__PURE__ */ Object.create(null);
    function ue(w, q) {
      return w.keywords[q];
    }
    function xe() {
      if (!E.keywords) {
        N.addText(x);
        return;
      }
      let w = 0;
      E.keywordPatternRe.lastIndex = 0;
      let q = E.keywordPatternRe.exec(x), H = "";
      for (; q; ) {
        H += x.substring(w, q.index);
        const X = k.case_insensitive ? q[0].toLowerCase() : q[0], fe = ue(E, X);
        if (fe) {
          const [we, On] = fe;
          if (N.addText(H), H = "", re[X] = (re[X] || 0) + 1, re[X] <= Oh && (U += On), we.startsWith("_"))
            H += q[0];
          else {
            const Et = k.classNameAliases[we] || we;
            _e(q[0], Et);
          }
        } else
          H += q[0];
        w = E.keywordPatternRe.lastIndex, q = E.keywordPatternRe.exec(x);
      }
      H += x.substring(w), N.addText(H);
    }
    function Ut() {
      if (x === "")
        return;
      let w = null;
      if (typeof E.subLanguage == "string") {
        if (!e[E.subLanguage]) {
          N.addText(x);
          return;
        }
        w = f(E.subLanguage, x, !0, M[E.subLanguage]), M[E.subLanguage] = /** @type {CompiledMode} */
        w._top;
      } else
        w = d(x, E.subLanguage.length ? E.subLanguage : null);
      E.relevance > 0 && (U += w.relevance), N.__addSublanguage(w._emitter, w.language);
    }
    function Te() {
      E.subLanguage != null ? Ut() : xe(), x = "";
    }
    function _e(w, q) {
      w !== "" && (N.startScope(q), N.addText(w), N.endScope());
    }
    function yt(w, q) {
      let H = 1;
      const X = q.length - 1;
      for (; H <= X; ) {
        if (!w._emit[H]) {
          H++;
          continue;
        }
        const fe = k.classNameAliases[w[H]] || w[H], we = q[H];
        fe ? _e(we, fe) : (x = we, xe(), x = ""), H++;
      }
    }
    function zt(w, q) {
      return w.scope && typeof w.scope == "string" && N.openNode(k.classNameAliases[w.scope] || w.scope), w.beginScope && (w.beginScope._wrap ? (_e(x, k.classNameAliases[w.beginScope._wrap] || w.beginScope._wrap), x = "") : w.beginScope._multi && (yt(w.beginScope, q), x = "")), E = Object.create(w, { parent: { value: E } }), E;
    }
    function cn(w, q, H) {
      let X = Yf(w.endRe, H);
      if (X) {
        if (w["on:end"]) {
          const fe = new rc(w);
          w["on:end"](q, fe), fe.isMatchIgnored && (X = !1);
        }
        if (X) {
          for (; w.endsParent && w.parent; )
            w = w.parent;
          return w;
        }
      }
      if (w.endsWithParent)
        return cn(w.parent, q, H);
    }
    function xt(w) {
      return E.matcher.regexIndex === 0 ? (x += w[0], 1) : (Y = !0, 0);
    }
    function In(w) {
      const q = w[0], H = w.rule, X = new rc(H), fe = [H.__beforeBegin, H["on:begin"]];
      for (const we of fe)
        if (we && (we(w, X), X.isMatchIgnored))
          return xt(q);
      return H.skip ? x += q : (H.excludeBegin && (x += q), Te(), !H.returnBegin && !H.excludeBegin && (x = q)), zt(H, w), H.returnBegin ? 0 : q.length;
    }
    function Mn(w) {
      const q = w[0], H = C.substring(w.index), X = cn(E, w, H);
      if (!X)
        return lc;
      const fe = E;
      E.endScope && E.endScope._wrap ? (Te(), _e(q, E.endScope._wrap)) : E.endScope && E.endScope._multi ? (Te(), yt(E.endScope, w)) : fe.skip ? x += q : (fe.returnEnd || fe.excludeEnd || (x += q), Te(), fe.excludeEnd && (x = q));
      do
        E.scope && N.closeNode(), !E.skip && !E.subLanguage && (U += E.relevance), E = E.parent;
      while (E !== X.parent);
      return X.starts && zt(X.starts, w), fe.returnEnd ? 0 : q.length;
    }
    function p() {
      const w = [];
      for (let q = E; q !== k; q = q.parent)
        q.scope && w.unshift(q.scope);
      w.forEach((q) => N.openNode(q));
    }
    let g = {};
    function b(w, q) {
      const H = q && q[0];
      if (x += w, H == null)
        return Te(), 0;
      if (g.type === "begin" && q.type === "end" && g.index === q.index && H === "") {
        if (x += C.slice(q.index, q.index + 1), !s) {
          const X = new Error(`0 width match regex (${v})`);
          throw X.languageName = v, X.badRule = g.rule, X;
        }
        return 1;
      }
      if (g = q, q.type === "begin")
        return In(q);
      if (q.type === "illegal" && !j) {
        const X = new Error('Illegal lexeme "' + H + '" for mode "' + (E.scope || "<unnamed>") + '"');
        throw X.mode = E, X;
      } else if (q.type === "end") {
        const X = Mn(q);
        if (X !== lc)
          return X;
      }
      if (q.type === "illegal" && H === "")
        return 1;
      if (G > 1e5 && G > q.index * 3)
        throw new Error("potential infinite loop, way more iterations than matches");
      return x += H, H.length;
    }
    const k = Q(v);
    if (!k)
      throw Ot(o.replace("{}", v)), new Error('Unknown language: "' + v + '"');
    const S = Lh(k);
    let O = "", E = te || S;
    const M = {}, N = new i.__emitter(i);
    p();
    let x = "", U = 0, V = 0, G = 0, Y = !1;
    try {
      if (k.__emitTokens)
        k.__emitTokens(C, N);
      else {
        for (E.matcher.considerAll(); ; ) {
          G++, Y ? Y = !1 : E.matcher.considerAll(), E.matcher.lastIndex = V;
          const w = E.matcher.exec(C);
          if (!w)
            break;
          const q = C.substring(V, w.index), H = b(q, w);
          V = w.index + H;
        }
        b(C.substring(V));
      }
      return N.finalize(), O = N.toHTML(), {
        language: v,
        value: O,
        relevance: U,
        illegal: !1,
        _emitter: N,
        _top: E
      };
    } catch (w) {
      if (w.message && w.message.includes("Illegal"))
        return {
          language: v,
          value: Jr(C),
          illegal: !0,
          relevance: 0,
          _illegalBy: {
            message: w.message,
            index: V,
            context: C.slice(V - 100, V + 100),
            mode: w.mode,
            resultSoFar: O
          },
          _emitter: N
        };
      if (s)
        return {
          language: v,
          value: Jr(C),
          illegal: !1,
          relevance: 0,
          errorRaised: w,
          _emitter: N,
          _top: E
        };
      throw w;
    }
  }
  function h(v) {
    const C = {
      value: Jr(v),
      illegal: !1,
      relevance: 0,
      _top: c,
      _emitter: new i.__emitter(i)
    };
    return C._emitter.addText(v), C;
  }
  function d(v, C) {
    C = C || i.languages || Object.keys(e);
    const j = h(v), te = C.filter(Q).filter(oe).map(
      (Te) => f(Te, v, !1)
    );
    te.unshift(j);
    const re = te.sort((Te, _e) => {
      if (Te.relevance !== _e.relevance)
        return _e.relevance - Te.relevance;
      if (Te.language && _e.language) {
        if (Q(Te.language).supersetOf === _e.language)
          return 1;
        if (Q(_e.language).supersetOf === Te.language)
          return -1;
      }
      return 0;
    }), [ue, xe] = re, Ut = ue;
    return Ut.secondBest = xe, Ut;
  }
  function m(v, C, j) {
    const te = C && n[C] || j;
    v.classList.add("hljs"), v.classList.add(`language-${te}`);
  }
  function _(v) {
    let C = null;
    const j = l(v);
    if (a(j))
      return;
    if (K(
      "before:highlightElement",
      { el: v, language: j }
    ), v.dataset.highlighted) {
      console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", v);
      return;
    }
    if (v.children.length > 0 && (i.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(v)), i.throwUnescapedHTML))
      throw new Mh(
        "One of your code blocks includes unescaped HTML.",
        v.innerHTML
      );
    C = v;
    const te = C.textContent, re = j ? u(te, { language: j, ignoreIllegals: !0 }) : d(te);
    v.innerHTML = re.value, v.dataset.highlighted = "yes", m(v, j, re.language), v.result = {
      language: re.language,
      // TODO: remove with version 11.0
      re: re.relevance,
      relevance: re.relevance
    }, re.secondBest && (v.secondBest = {
      language: re.secondBest.language,
      relevance: re.secondBest.relevance
    }), K("after:highlightElement", { el: v, result: re, text: te });
  }
  function R(v) {
    i = ac(i, v);
  }
  const T = () => {
    B(), Ht("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
  };
  function D() {
    B(), Ht("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
  }
  let I = !1;
  function B() {
    if (document.readyState === "loading") {
      I = !0;
      return;
    }
    document.querySelectorAll(i.cssSelector).forEach(_);
  }
  function P() {
    I && B();
  }
  typeof window < "u" && window.addEventListener && window.addEventListener("DOMContentLoaded", P, !1);
  function y(v, C) {
    let j = null;
    try {
      j = C(t);
    } catch (te) {
      if (Ot("Language definition for '{}' could not be registered.".replace("{}", v)), s)
        Ot(te);
      else
        throw te;
      j = c;
    }
    j.name || (j.name = v), e[v] = j, j.rawDefinition = C.bind(null, t), j.aliases && z(j.aliases, { languageName: v });
  }
  function W(v) {
    delete e[v];
    for (const C of Object.keys(n))
      n[C] === v && delete n[C];
  }
  function $() {
    return Object.keys(e);
  }
  function Q(v) {
    return v = (v || "").toLowerCase(), e[v] || e[n[v]];
  }
  function z(v, { languageName: C }) {
    typeof v == "string" && (v = [v]), v.forEach((j) => {
      n[j.toLowerCase()] = C;
    });
  }
  function oe(v) {
    const C = Q(v);
    return C && !C.disableAutodetect;
  }
  function L(v) {
    v["before:highlightBlock"] && !v["before:highlightElement"] && (v["before:highlightElement"] = (C) => {
      v["before:highlightBlock"](
        Object.assign({ block: C.el }, C)
      );
    }), v["after:highlightBlock"] && !v["after:highlightElement"] && (v["after:highlightElement"] = (C) => {
      v["after:highlightBlock"](
        Object.assign({ block: C.el }, C)
      );
    });
  }
  function ee(v) {
    L(v), r.push(v);
  }
  function A(v) {
    const C = r.indexOf(v);
    C !== -1 && r.splice(C, 1);
  }
  function K(v, C) {
    const j = v;
    r.forEach(function(te) {
      te[j] && te[j](C);
    });
  }
  function F(v) {
    return Ht("10.7.0", "highlightBlock will be removed entirely in v12.0"), Ht("10.7.0", "Please use highlightElement now."), _(v);
  }
  Object.assign(t, {
    highlight: u,
    highlightAuto: d,
    highlightAll: B,
    highlightElement: _,
    // TODO: Remove with v12 API
    highlightBlock: F,
    configure: R,
    initHighlighting: T,
    initHighlightingOnLoad: D,
    registerLanguage: y,
    unregisterLanguage: W,
    listLanguages: $,
    getLanguage: Q,
    registerAliases: z,
    autoDetection: oe,
    inherit: ac,
    addPlugin: ee,
    removePlugin: A
  }), t.debugMode = function() {
    s = !1;
  }, t.safeMode = function() {
    s = !0;
  }, t.versionString = Ih, t.regex = {
    concat: $t,
    lookahead: na,
    either: Qs,
    optional: Wf,
    anyNumberOfTimes: Zf
  };
  for (const v in Vn)
    typeof Vn[v] == "object" && ea(Vn[v]);
  return Object.assign(t, Vn), t;
}, en = fa({});
en.newInstance = () => fa({});
var qh = en;
en.HighlightJS = en;
en.default = en;
const nt = /* @__PURE__ */ Ys(qh), uc = "[A-Za-z$_][0-9A-Za-z$_]*", Fh = [
  "as",
  // for exports
  "in",
  "of",
  "if",
  "for",
  "while",
  "finally",
  "var",
  "new",
  "function",
  "do",
  "return",
  "void",
  "else",
  "break",
  "catch",
  "instanceof",
  "with",
  "throw",
  "case",
  "default",
  "try",
  "switch",
  "continue",
  "typeof",
  "delete",
  "let",
  "yield",
  "const",
  "class",
  // JS handles these with a special rule
  // "get",
  // "set",
  "debugger",
  "async",
  "await",
  "static",
  "import",
  "from",
  "export",
  "extends"
], Bh = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
], ha = [
  // Fundamental objects
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  // numbers and dates
  "Math",
  "Date",
  "Number",
  "BigInt",
  // text
  "String",
  "RegExp",
  // Indexed collections
  "Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Int32Array",
  "Uint16Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  // Keyed collections
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  // Structured data
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  // Control abstraction objects
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  // Reflection
  "Reflect",
  "Proxy",
  // Internationalization
  "Intl",
  // WebAssembly
  "WebAssembly"
], pa = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
], da = [
  "setInterval",
  "setTimeout",
  "clearInterval",
  "clearTimeout",
  "require",
  "exports",
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape"
], Ph = [
  "arguments",
  "this",
  "super",
  "console",
  "window",
  "document",
  "localStorage",
  "sessionStorage",
  "module",
  "global"
  // Node.js
], $h = [].concat(
  da,
  ha,
  pa
);
function ga(t) {
  const e = t.regex, n = (C, { after: j }) => {
    const te = "</" + C[0].slice(1);
    return C.input.indexOf(te, j) !== -1;
  }, r = uc, s = {
    begin: "<>",
    end: "</>"
  }, o = /<[A-Za-z0-9\\._:-]+\s*\/>/, c = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (C, j) => {
      const te = C[0].length + C.index, re = C.input[te];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        re === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        re === ","
      ) {
        j.ignoreMatch();
        return;
      }
      re === ">" && (n(C, { after: te }) || j.ignoreMatch());
      let ue;
      const xe = C.input.substring(te);
      if (ue = xe.match(/^\s*=/)) {
        j.ignoreMatch();
        return;
      }
      if ((ue = xe.match(/^\s+extends\s+/)) && ue.index === 0) {
        j.ignoreMatch();
        return;
      }
    }
  }, i = {
    $pattern: uc,
    keyword: Fh,
    literal: Bh,
    built_in: $h,
    "variable.language": Ph
  }, a = "[0-9](_?[0-9])*", l = `\\.(${a})`, u = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", f = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${u})((${l})|\\.)?|(${l}))[eE][+-]?(${a})\\b` },
      { begin: `\\b(${u})\\b((${l})\\b|\\.)?|(${l})\\b` },
      // DecimalBigIntegerLiteral
      { begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
      // NonDecimalIntegerLiteral
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
      // LegacyOctalIntegerLiteral (does not include underscore separators)
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      { begin: "\\b0[0-7]+n?\\b" }
    ],
    relevance: 0
  }, h = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: i,
    contains: []
    // defined later
  }, d = {
    begin: "html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        t.BACKSLASH_ESCAPE,
        h
      ],
      subLanguage: "xml"
    }
  }, m = {
    begin: "css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        t.BACKSLASH_ESCAPE,
        h
      ],
      subLanguage: "css"
    }
  }, _ = {
    begin: "gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        t.BACKSLASH_ESCAPE,
        h
      ],
      subLanguage: "graphql"
    }
  }, R = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      t.BACKSLASH_ESCAPE,
      h
    ]
  }, D = {
    className: "comment",
    variants: [
      t.COMMENT(
        /\/\*\*(?!\/)/,
        "\\*/",
        {
          relevance: 0,
          contains: [
            {
              begin: "(?=@[A-Za-z]+)",
              relevance: 0,
              contains: [
                {
                  className: "doctag",
                  begin: "@[A-Za-z]+"
                },
                {
                  className: "type",
                  begin: "\\{",
                  end: "\\}",
                  excludeEnd: !0,
                  excludeBegin: !0,
                  relevance: 0
                },
                {
                  className: "variable",
                  begin: r + "(?=\\s*(-)|$)",
                  endsParent: !0,
                  relevance: 0
                },
                // eat spaces (not newlines) so we can find
                // types or variables
                {
                  begin: /(?=[^\n])\s/,
                  relevance: 0
                }
              ]
            }
          ]
        }
      ),
      t.C_BLOCK_COMMENT_MODE,
      t.C_LINE_COMMENT_MODE
    ]
  }, I = [
    t.APOS_STRING_MODE,
    t.QUOTE_STRING_MODE,
    d,
    m,
    _,
    R,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    f
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  h.contains = I.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: i,
    contains: [
      "self"
    ].concat(I)
  });
  const B = [].concat(D, h.contains), P = B.concat([
    // eat recursive parens in sub expressions
    {
      begin: /\(/,
      end: /\)/,
      keywords: i,
      contains: ["self"].concat(B)
    }
  ]), y = {
    className: "params",
    begin: /\(/,
    end: /\)/,
    excludeBegin: !0,
    excludeEnd: !0,
    keywords: i,
    contains: P
  }, W = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          r,
          /\s+/,
          /extends/,
          /\s+/,
          e.concat(r, "(", e.concat(/\./, r), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      // class Car
      {
        match: [
          /class/,
          /\s+/,
          r
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  }, $ = {
    relevance: 0,
    match: e.either(
      // Hard coded exceptions
      /\bJSON/,
      // Float32Array, OutT
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      // CSSFactory, CSSFactoryT
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      // FPs, FPsT
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
      // P
      // single letters are not highlighted
      // BLAH
      // this will be flagged as a UPPER_CASE_CONSTANT instead
    ),
    className: "title.class",
    keywords: {
      _: [
        // se we still get relevance credit for JS library classes
        ...ha,
        ...pa
      ]
    }
  }, Q = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, z = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          r,
          /(?=\s*\()/
        ]
      },
      // anonymous function
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [y],
    illegal: /%/
  }, oe = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function L(C) {
    return e.concat("(?!", C.join("|"), ")");
  }
  const ee = {
    match: e.concat(
      /\b/,
      L([
        ...da,
        "super",
        "import"
      ]),
      r,
      e.lookahead(/\(/)
    ),
    className: "title.function",
    relevance: 0
  }, A = {
    begin: e.concat(/\./, e.lookahead(
      e.concat(r, /(?![0-9A-Za-z$_(])/)
    )),
    end: r,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, K = {
    match: [
      /get|set/,
      /\s+/,
      r,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      {
        // eat to avoid empty params
        begin: /\(\)/
      },
      y
    ]
  }, F = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + t.UNDERSCORE_IDENT_RE + ")\\s*=>", v = {
    match: [
      /const|var|let/,
      /\s+/,
      r,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      e.lookahead(F)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      y
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: i,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS: P, CLASS_REFERENCE: $ },
    illegal: /#(?![$_A-z])/,
    contains: [
      t.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      Q,
      t.APOS_STRING_MODE,
      t.QUOTE_STRING_MODE,
      d,
      m,
      _,
      R,
      D,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      f,
      $,
      {
        className: "attr",
        begin: r + e.lookahead(":"),
        relevance: 0
      },
      v,
      {
        // "value" container
        begin: "(" + t.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          D,
          t.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: F,
            returnBegin: !0,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: t.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: !0
                  },
                  {
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: i,
                    contains: P
                  }
                ]
              }
            ]
          },
          {
            // could be a comma delimited list of params to a function call
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            // JSX
            variants: [
              { begin: s.begin, end: s.end },
              { match: o },
              {
                begin: c.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": c.isTrulyOpeningTag,
                end: c.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: c.begin,
                end: c.end,
                skip: !0,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      z,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + t.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: !0,
        label: "func.def",
        contains: [
          y,
          t.inherit(t.TITLE_MODE, { begin: r, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      A,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + r,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [y]
      },
      ee,
      oe,
      W,
      K,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
function ma(t) {
  const e = t.regex, n = e.concat(/[\p{L}_]/u, e.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u), r = /[\p{L}0-9._:-]+/u, s = {
    className: "symbol",
    begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
  }, o = {
    begin: /\s/,
    contains: [
      {
        className: "keyword",
        begin: /#?[a-z_][a-z1-9_-]+/,
        illegal: /\n/
      }
    ]
  }, c = t.inherit(o, {
    begin: /\(/,
    end: /\)/
  }), i = t.inherit(t.APOS_STRING_MODE, { className: "string" }), a = t.inherit(t.QUOTE_STRING_MODE, { className: "string" }), l = {
    endsWithParent: !0,
    illegal: /</,
    relevance: 0,
    contains: [
      {
        className: "attr",
        begin: r,
        relevance: 0
      },
      {
        begin: /=\s*/,
        relevance: 0,
        contains: [
          {
            className: "string",
            endsParent: !0,
            variants: [
              {
                begin: /"/,
                end: /"/,
                contains: [s]
              },
              {
                begin: /'/,
                end: /'/,
                contains: [s]
              },
              { begin: /[^\s"'=<>`]+/ }
            ]
          }
        ]
      }
    ]
  };
  return {
    name: "HTML, XML",
    aliases: [
      "html",
      "xhtml",
      "rss",
      "atom",
      "xjb",
      "xsd",
      "xsl",
      "plist",
      "wsf",
      "svg"
    ],
    case_insensitive: !0,
    unicodeRegex: !0,
    contains: [
      {
        className: "meta",
        begin: /<![a-z]/,
        end: />/,
        relevance: 10,
        contains: [
          o,
          a,
          i,
          c,
          {
            begin: /\[/,
            end: /\]/,
            contains: [
              {
                className: "meta",
                begin: /<![a-z]/,
                end: />/,
                contains: [
                  o,
                  c,
                  a,
                  i
                ]
              }
            ]
          }
        ]
      },
      t.COMMENT(
        /<!--/,
        /-->/,
        { relevance: 10 }
      ),
      {
        begin: /<!\[CDATA\[/,
        end: /\]\]>/,
        relevance: 10
      },
      s,
      // xml processing instructions
      {
        className: "meta",
        end: /\?>/,
        variants: [
          {
            begin: /<\?xml/,
            relevance: 10,
            contains: [
              a
            ]
          },
          {
            begin: /<\?[a-z][a-z0-9]+/
          }
        ]
      },
      {
        className: "tag",
        /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending bracket.
        */
        begin: /<style(?=\s|>)/,
        end: />/,
        keywords: { name: "style" },
        contains: [l],
        starts: {
          end: /<\/style>/,
          returnEnd: !0,
          subLanguage: [
            "css",
            "xml"
          ]
        }
      },
      {
        className: "tag",
        // See the comment in the <style tag about the lookahead pattern
        begin: /<script(?=\s|>)/,
        end: />/,
        keywords: { name: "script" },
        contains: [l],
        starts: {
          end: /<\/script>/,
          returnEnd: !0,
          subLanguage: [
            "javascript",
            "handlebars",
            "xml"
          ]
        }
      },
      // we need this for now for jSX
      {
        className: "tag",
        begin: /<>|<\/>/
      },
      // open tag
      {
        className: "tag",
        begin: e.concat(
          /</,
          e.lookahead(e.concat(
            n,
            // <tag/>
            // <tag>
            // <tag ...
            e.either(/\/>/, />/, /\s/)
          ))
        ),
        end: /\/?>/,
        contains: [
          {
            className: "name",
            begin: n,
            relevance: 0,
            starts: l
          }
        ]
      },
      // close tag
      {
        className: "tag",
        begin: e.concat(
          /<\//,
          e.lookahead(e.concat(
            n,
            />/
          ))
        ),
        contains: [
          {
            className: "name",
            begin: n,
            relevance: 0
          },
          {
            begin: />/,
            relevance: 0,
            endsParent: !0
          }
        ]
      }
    ]
  };
}
const Sr = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [r, s] of e)
    n[r] = s;
  return n;
}, Uh = {}, zh = { class: "chat-button" };
function Hh(t, e) {
  return Z(), ce("button", zh, [
    Mt(t.$slots, "default")
  ]);
}
const Vh = /* @__PURE__ */ Sr(Uh, [["render", Hh]]), Gh = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
}, jh = /* @__PURE__ */ he("path", {
  fill: "currentColor",
  d: "M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
}, null, -1), Kh = [
  jh
];
function Zh(t, e) {
  return Z(), ce("svg", Gh, [...Kh]);
}
const Wh = { name: "mdi-close", render: Zh };
function no() {
  return Jt(Ji);
}
function Rn() {
  return {
    options: Jt(Yi)
  };
}
function Tr() {
  const { options: t } = Rn(), e = (t == null ? void 0 : t.defaultLanguage) ?? "en";
  function n(s) {
    var c, i;
    const o = (i = (c = t == null ? void 0 : t.i18n) == null ? void 0 : c[e]) == null ? void 0 : i[s];
    return Se(o) ? o.value : o ?? s;
  }
  function r(s) {
    var o, c;
    return !!((c = (o = t == null ? void 0 : t.i18n) == null ? void 0 : o[e]) != null && c[s]);
  }
  return { t: n, te: r };
}
const Jh = { class: "chat-get-started" }, Yh = /* @__PURE__ */ Ve({
  __name: "GetStarted",
  setup(t) {
    const { t: e } = Tr();
    return (n, r) => (Z(), ce("div", Jh, [
      ge(Vh, {
        onClick: r[0] || (r[0] = (s) => n.$emit("click:button"))
      }, {
        default: st(() => [
          Zs(vn(se(e)("getStarted")), 1)
        ]),
        _: 1
      })
    ]));
  }
}), Xh = {}, Qh = { class: "chat-powered-by" }, ep = /* @__PURE__ */ he("a", { href: "https://n8n.io?utm_source=n8n-external&utm_medium=widget-powered-by" }, "n8n", -1);
function tp(t, e) {
  return Z(), ce("div", Qh, [
    Zs(" Powered by "),
    ep
  ]);
}
const np = /* @__PURE__ */ Sr(Xh, [["render", tp]]), rp = { class: "chat-get-started-footer" }, sp = { key: 0 }, op = /* @__PURE__ */ Ve({
  __name: "GetStartedFooter",
  setup(t) {
    const { t: e, te: n } = Tr();
    return (r, s) => (Z(), ce("div", rp, [
      se(n)("footer") ? (Z(), ce("div", sp, vn(se(e)("footer")), 1)) : Fe("", !0),
      ge(np)
    ]));
  }
});
function cp(t) {
  return ti() ? (al(t), !0) : !1;
}
function ip() {
  const t = /* @__PURE__ */ new Set(), e = (s) => {
    t.delete(s);
  };
  return {
    on: (s) => {
      t.add(s);
      const o = () => e(s);
      return cp(o), {
        off: o
      };
    },
    off: e,
    trigger: (...s) => Promise.all(Array.from(t).map((o) => o(...s)))
  };
}
const ap = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const lp = (t, e) => Object.prototype.hasOwnProperty.call(t, e), up = ap ? window.document : void 0, fp = {
  multiple: !0,
  accept: "*",
  reset: !1,
  directory: !1
};
function hp(t = {}) {
  const {
    document: e = up
  } = t, n = Le(null), { on: r, trigger: s } = ip();
  let o;
  e && (o = e.createElement("input"), o.type = "file", o.onchange = (a) => {
    const l = a.target;
    n.value = l.files, s(n.value);
  });
  const c = () => {
    n.value = null, o && o.value && (o.value = "", s(null));
  }, i = (a) => {
    if (!o)
      return;
    const l = {
      ...fp,
      ...t,
      ...a
    };
    o.multiple = l.multiple, o.accept = l.accept, o.webkitdirectory = l.directory, lp(l, "capture") && (o.capture = l.capture), l.reset && c(), o.click();
  };
  return {
    files: Bs(n),
    open: i,
    reset: c,
    onChange: r
  };
}
const pp = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
}, dp = /* @__PURE__ */ he("path", {
  fill: "currentColor",
  d: "M14 2H6c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h7.81c-.53-.91-.81-1.95-.81-3c0-3.31 2.69-6 6-6c.34 0 .67.03 1 .08V8zm-1 7V3.5L18.5 9zm10 11h-3v3h-2v-3h-3v-2h3v-3h2v3h3z"
}, null, -1), gp = [
  dp
];
function mp(t, e) {
  return Z(), ce("svg", pp, [...gp]);
}
const _p = { name: "mdi-filePlus", render: mp }, bp = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
}, vp = /* @__PURE__ */ he("path", {
  fill: "currentColor",
  d: "m2 21l21-9L2 3v7l15 2l-15 2z"
}, null, -1), yp = [
  vp
];
function xp(t, e) {
  return Z(), ce("svg", bp, [...yp]);
}
const Ep = { name: "mdi-send", render: xp }, kp = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
}, wp = /* @__PURE__ */ he("path", {
  fill: "currentColor",
  d: "M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12z"
}, null, -1), Ap = [
  wp
];
function Cp(t, e) {
  return Z(), ce("svg", kp, [...Ap]);
}
const Sp = { name: "mdi-closeThick", render: Cp }, Tp = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
}, Dp = /* @__PURE__ */ he("path", {
  fill: "currentColor",
  d: "M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m0 18h12v-8l-4 4l-2-2zM8 9a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2"
}, null, -1), Rp = [
  Dp
];
function Lp(t, e) {
  return Z(), ce("svg", Tp, [...Rp]);
}
const Np = { name: "mdi-fileImage", render: Lp }, Ip = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
}, Mp = /* @__PURE__ */ he("path", {
  fill: "currentColor",
  d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 11h-2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2c.4 0 .7.1 1 .3V11h3zm0-4V3.5L18.5 9z"
}, null, -1), Op = [
  Mp
];
function qp(t, e) {
  return Z(), ce("svg", Ip, [...Op]);
}
const Fp = { name: "mdi-fileMusic", render: qp }, Bp = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
}, Pp = /* @__PURE__ */ he("path", {
  fill: "currentColor",
  d: "M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m9 16v-2H6v2zm3-4v-2H6v2z"
}, null, -1), $p = [
  Pp
];
function Up(t, e) {
  return Z(), ce("svg", Bp, [...$p]);
}
const fc = { name: "mdi-fileText", render: Up }, zp = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
}, Hp = /* @__PURE__ */ he("path", {
  fill: "currentColor",
  d: "M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m11 17v-6l-3 2.2V13H7v6h7v-2.2z"
}, null, -1), Vp = [
  Hp
];
function Gp(t, e) {
  return Z(), ce("svg", zp, [...Vp]);
}
const jp = { name: "mdi-fileVideo", render: Gp }, Kp = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
}, Zp = /* @__PURE__ */ he("path", {
  fill: "currentColor",
  d: "M14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2z"
}, null, -1), Wp = [
  Zp
];
function Jp(t, e) {
  return Z(), ce("svg", Kp, [...Wp]);
}
const Yp = { name: "mdi-openInNew", render: Jp }, Xp = { class: "chat-file-name" }, Qp = /* @__PURE__ */ Ve({
  __name: "ChatFile",
  props: {
    file: {},
    isRemovable: { type: Boolean },
    isPreviewable: { type: Boolean }
  },
  emits: ["remove"],
  setup(t, { emit: e }) {
    const n = t, r = e, s = {
      document: fc,
      audio: Fp,
      image: Np,
      video: jp
    }, o = Re(() => {
      var a;
      const i = (a = n.file) == null ? void 0 : a.type.split("/")[0];
      return s[i] || fc;
    });
    function c() {
      n.isRemovable && r("remove", n.file), n.isPreviewable && window.open(URL.createObjectURL(n.file));
    }
    return (i, a) => (Z(), ce("div", {
      class: "chat-file",
      onClick: c
    }, [
      ge(se(o)),
      he("p", Xp, vn(i.file.name), 1),
      i.isRemovable ? (Z(), be(se(Sp), {
        key: 0,
        class: "chat-file-delete"
      })) : Fe("", !0),
      i.isPreviewable ? (Z(), be(se(Yp), {
        key: 1,
        class: "chat-file-preview"
      })) : Fe("", !0)
    ]));
  }
}), _a = /* @__PURE__ */ Sr(Qp, [["__scopeId", "data-v-c15a8ecf"]]), ed = { class: "chat-inputs" }, td = ["disabled", "placeholder"], nd = { class: "chat-inputs-controls" }, rd = ["disabled"], sd = ["disabled"], od = {
  key: 0,
  class: "chat-files"
}, cd = /* @__PURE__ */ Ve({
  __name: "Input",
  emits: ["arrowKeyDown"],
  setup(t, { emit: e }) {
    const n = e, { options: r } = Rn(), s = no(), { waitingForResponse: o } = s, { t: c } = Tr(), i = Le(null), a = Le(null), l = Le(""), u = Le(!1), f = Re(() => {
      var L;
      return l.value === "" || o.value || ((L = r.disabled) == null ? void 0 : L.value) === !0;
    }), h = Re(() => {
      var L;
      return ((L = r.disabled) == null ? void 0 : L.value) === !0;
    }), d = Re(
      () => {
        var L;
        return m.value && o.value && !((L = r.disabled) != null && L.value);
      }
    ), m = Re(() => se(r.allowFileUploads) === !0), _ = Re(() => se(r.allowedFilesMimeTypes)), R = Re(() => ({
      "--controls-count": m.value ? 2 : 1
    })), {
      open: T,
      reset: D,
      onChange: I
    } = hp({
      multiple: !0,
      reset: !1
    });
    I((L) => {
      if (!L)
        return;
      const ee = new DataTransfer();
      if (i.value)
        for (let A = 0; A < i.value.length; A++)
          ee.items.add(i.value[A]);
      for (let A = 0; A < L.length; A++)
        ee.items.add(L[A]);
      i.value = ee.files;
    }), vt(() => {
      Ie.on("focusInput", P), Ie.on("blurInput", B), Ie.on("setInputValue", y);
    }), Vs(() => {
      Ie.off("focusInput", P), Ie.off("blurInput", B), Ie.off("setInputValue", y);
    });
    function B() {
      a.value && a.value.blur();
    }
    function P() {
      a.value && a.value.focus();
    }
    function y(L) {
      l.value = L, P();
    }
    async function W(L) {
      if (L.preventDefault(), f.value)
        return;
      const ee = l.value;
      l.value = "", u.value = !0, await s.sendMessage(ee, Array.from(i.value ?? [])), u.value = !1, D(), i.value = null;
    }
    async function $(L) {
      L.shiftKey || await W(L);
    }
    function Q(L) {
      if (!i.value)
        return;
      const ee = new DataTransfer();
      for (let A = 0; A < i.value.length; A++) {
        const K = i.value[A];
        L.name !== K.name && ee.items.add(K);
      }
      D(), i.value = ee.files;
    }
    function z(L) {
      (L.key === "ArrowUp" || L.key === "ArrowDown") && (L.preventDefault(), n("arrowKeyDown", {
        key: L.key,
        currentInputValue: l.value
      }));
    }
    function oe() {
      d.value || T({ accept: se(_) });
    }
    function uploadFile() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '*/*';
      fileInput.multiple = true;
      fileInput.click();

      fileInput.onchange = async () => {
        const files = fileInput.files;
        const formData = new FormData();
        const maxFileSize = 5 * 1024 * 1024; // 5 MB em bytes
        if (!files.length) return;

        for (let i = 0; i < files.length; i++) {
          if (files[i].size > maxFileSize) {
            console.warn(`O arquivo ${files[i].name} excede o limite de 5 MB e foi ignorado.`);
            continue;
          }
          formData.append('files', files[i], files[i].name);
        }

        try {
          const body = formData;
          const caller = await fetch('https://api.dev.muhbianco.com.br/latest/minio/put_object/typebot/evoUploads', {
            method: 'PUT',
            headers: {
                'accept': "application/json",
            },
            body,
          });

          if (caller.ok) {
              const response = await caller.json()
              // console.log(globalWebHook, globalSessionId)
              const unc = un;
              unc.webhookUrl = globalWebHook.webhookUrl;
              console.log("enviando", `https://${response["details"][0]}`);
              const rp = await Pf(`https://${response["details"][0]}`, [], globalSessionId, unc);
              console.log(await rp);

              // TODO Preciso fazer o resultado de RP ir para a janela de chat como sender: bot

              const n = Le([]);
              const s = Le(!1);
              const message = {
                id: fn(),
                text: "teste",
                sender: 'bot',
                createdAt: (/* @__PURE__ */ new Date()).toISOString()
              };
              n.value.push(message), s.value = !0, Qt(() => {
                Ie.emit("scrollToBottom");
              });
              const l = {
                initialMessages: o,
                messages: n,
                currentSessionId: r,
                waitingForResponse: s,
                loadPreviousSession: i,
                startNewSession: a,
                sendMessage: c
              };
              te.provide(Ji, l), te.config.globalProperties.$chat = l;

              
              
              
          } else {
              console.error('Erro no upload:', response.status, response.statusText);
          }
        } catch (error) {
            console.error('General error', error);
        }
      }
    }
    return (L, ee) => {
      var A;
      return Z(), ce("div", {
        class: "chat-input",
        style: Tn(R.value),
        onKeydown: Ef(z, ["stop"])
      }, [
        he("div", ed, [
          Si(he("textarea", {
            ref_key: "chatTextArea",
            ref: a,
            "onUpdate:modelValue": ee[0] || (ee[0] = (K) => l.value = K),
            disabled: h.value,
            placeholder: se(c)("inputPlaceholder"),
            onKeydown: wf($, ["enter"])
          }, null, 40, td), [
            [vf, l.value]
          ]),
          he("div", nd, [
            m.value ? (Z(), ce("button", {
              key: 0,
              disabled: d.value,
              class: "chat-input-send-button",
              onClick: oe
            }, [
              ge(se(_p), {
                height: "24",
                width: "24"
              })
            ], 8, rd)) : Fe("", !0),
            he("button", {
              disabled: f.value,
              class: "chat-input-send-button",
              onClick: W
            }, [
              ge(se(Ep), {
                height: "24",
                width: "24"
              })
            ], 8, sd),
            he("button", {
              key: 2,
              class: "chat-attachment-button",
              onClick: uploadFile,
              style: "display: inline-flex; align-items: center; justify-content: center;",
              disabled: true
            }, [
              he("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, [
                he("path", {
                  d: "M21.44 11.05l-9-9a5 5 0 00-7.08 7.08l9 9a5 5 0 007.08-7.08l-9-9a3 3 0 00-4.24 4.24l9 9"
                })
              ])
            ])
          ])
        ]),
        (A = i.value) != null && A.length && !u.value ? (Z(), ce("div", od, [
          (Z(!0), ce(Ae, null, rr(i.value, (K) => (Z(), be(_a, {
            key: K.name,
            file: K,
            "is-removable": !0,
            onRemove: Q
          }, null, 8, ["file"]))), 128))
        ])) : Fe("", !0)
      ], 36);
    };
  }
}), id = /* @__PURE__ */ Sr(cd, [["__scopeId", "data-v-2a7fb1c3"]]), ad = { class: "chat-layout" }, ld = {
  key: 0,
  class: "chat-header"
}, ud = {
  key: 2,
  class: "chat-footer"
}, fd = /* @__PURE__ */ Ve({
  __name: "Layout",
  setup(t) {
    const e = Le(null);
    function n() {
      const r = e.value;
      r && (r.scrollTop = r.scrollHeight);
    }
    return vt(() => {
      Ie.on("scrollToBottom", n), window.addEventListener("resize", n);
    }), Hs(() => {
      Ie.off("scrollToBottom", n), window.removeEventListener("resize", n);
    }), (r, s) => (Z(), ce("main", ad, [
      r.$slots.header ? (Z(), ce("div", ld, [
        Mt(r.$slots, "header")
      ])) : Fe("", !0),
      r.$slots.default ? (Z(), ce("div", {
        key: 1,
        ref_key: "chatBodyRef",
        ref: e,
        class: "chat-body"
      }, [
        Mt(r.$slots, "default")
      ], 512)) : Fe("", !0),
      r.$slots.footer ? (Z(), ce("div", ud, [
        Mt(r.$slots, "footer")
      ])) : Fe("", !0)
    ]));
  }
});
function hd(t) {
  const e = t.regex, n = {}, r = {
    begin: /\$\{/,
    end: /\}/,
    contains: [
      "self",
      {
        begin: /:-/,
        contains: [n]
      }
      // default values
    ]
  };
  Object.assign(n, {
    className: "variable",
    variants: [
      { begin: e.concat(
        /\$[\w\d#@][\w\d_]*/,
        // negative look-ahead tries to avoid matching patterns that are not
        // Perl at all like $ident$, @ident@, etc.
        "(?![\\w\\d])(?![$])"
      ) },
      r
    ]
  });
  const s = {
    className: "subst",
    begin: /\$\(/,
    end: /\)/,
    contains: [t.BACKSLASH_ESCAPE]
  }, o = {
    begin: /<<-?\s*(?=\w+)/,
    starts: { contains: [
      t.END_SAME_AS_BEGIN({
        begin: /(\w+)/,
        end: /(\w+)/,
        className: "string"
      })
    ] }
  }, c = {
    className: "string",
    begin: /"/,
    end: /"/,
    contains: [
      t.BACKSLASH_ESCAPE,
      n,
      s
    ]
  };
  s.contains.push(c);
  const i = {
    match: /\\"/
  }, a = {
    className: "string",
    begin: /'/,
    end: /'/
  }, l = {
    match: /\\'/
  }, u = {
    begin: /\$?\(\(/,
    end: /\)\)/,
    contains: [
      {
        begin: /\d+#[0-9a-f]+/,
        className: "number"
      },
      t.NUMBER_MODE,
      n
    ]
  }, f = [
    "fish",
    "bash",
    "zsh",
    "sh",
    "csh",
    "ksh",
    "tcsh",
    "dash",
    "scsh"
  ], h = t.SHEBANG({
    binary: `(${f.join("|")})`,
    relevance: 10
  }), d = {
    className: "function",
    begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
    returnBegin: !0,
    contains: [t.inherit(t.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
    relevance: 0
  }, m = [
    "if",
    "then",
    "else",
    "elif",
    "fi",
    "for",
    "while",
    "until",
    "in",
    "do",
    "done",
    "case",
    "esac",
    "function",
    "select"
  ], _ = [
    "true",
    "false"
  ], R = { match: /(\/[a-z._-]+)+/ }, T = [
    "break",
    "cd",
    "continue",
    "eval",
    "exec",
    "exit",
    "export",
    "getopts",
    "hash",
    "pwd",
    "readonly",
    "return",
    "shift",
    "test",
    "times",
    "trap",
    "umask",
    "unset"
  ], D = [
    "alias",
    "bind",
    "builtin",
    "caller",
    "command",
    "declare",
    "echo",
    "enable",
    "help",
    "let",
    "local",
    "logout",
    "mapfile",
    "printf",
    "read",
    "readarray",
    "source",
    "type",
    "typeset",
    "ulimit",
    "unalias"
  ], I = [
    "autoload",
    "bg",
    "bindkey",
    "bye",
    "cap",
    "chdir",
    "clone",
    "comparguments",
    "compcall",
    "compctl",
    "compdescribe",
    "compfiles",
    "compgroups",
    "compquote",
    "comptags",
    "comptry",
    "compvalues",
    "dirs",
    "disable",
    "disown",
    "echotc",
    "echoti",
    "emulate",
    "fc",
    "fg",
    "float",
    "functions",
    "getcap",
    "getln",
    "history",
    "integer",
    "jobs",
    "kill",
    "limit",
    "log",
    "noglob",
    "popd",
    "print",
    "pushd",
    "pushln",
    "rehash",
    "sched",
    "setcap",
    "setopt",
    "stat",
    "suspend",
    "ttyctl",
    "unfunction",
    "unhash",
    "unlimit",
    "unsetopt",
    "vared",
    "wait",
    "whence",
    "where",
    "which",
    "zcompile",
    "zformat",
    "zftp",
    "zle",
    "zmodload",
    "zparseopts",
    "zprof",
    "zpty",
    "zregexparse",
    "zsocket",
    "zstyle",
    "ztcp"
  ], B = [
    "chcon",
    "chgrp",
    "chown",
    "chmod",
    "cp",
    "dd",
    "df",
    "dir",
    "dircolors",
    "ln",
    "ls",
    "mkdir",
    "mkfifo",
    "mknod",
    "mktemp",
    "mv",
    "realpath",
    "rm",
    "rmdir",
    "shred",
    "sync",
    "touch",
    "truncate",
    "vdir",
    "b2sum",
    "base32",
    "base64",
    "cat",
    "cksum",
    "comm",
    "csplit",
    "cut",
    "expand",
    "fmt",
    "fold",
    "head",
    "join",
    "md5sum",
    "nl",
    "numfmt",
    "od",
    "paste",
    "ptx",
    "pr",
    "sha1sum",
    "sha224sum",
    "sha256sum",
    "sha384sum",
    "sha512sum",
    "shuf",
    "sort",
    "split",
    "sum",
    "tac",
    "tail",
    "tr",
    "tsort",
    "unexpand",
    "uniq",
    "wc",
    "arch",
    "basename",
    "chroot",
    "date",
    "dirname",
    "du",
    "echo",
    "env",
    "expr",
    "factor",
    // "false", // keyword literal already
    "groups",
    "hostid",
    "id",
    "link",
    "logname",
    "nice",
    "nohup",
    "nproc",
    "pathchk",
    "pinky",
    "printenv",
    "printf",
    "pwd",
    "readlink",
    "runcon",
    "seq",
    "sleep",
    "stat",
    "stdbuf",
    "stty",
    "tee",
    "test",
    "timeout",
    // "true", // keyword literal already
    "tty",
    "uname",
    "unlink",
    "uptime",
    "users",
    "who",
    "whoami",
    "yes"
  ];
  return {
    name: "Bash",
    aliases: ["sh"],
    keywords: {
      $pattern: /\b[a-z][a-z0-9._-]+\b/,
      keyword: m,
      literal: _,
      built_in: [
        ...T,
        ...D,
        // Shell modifiers
        "set",
        "shopt",
        ...I,
        ...B
      ]
    },
    contains: [
      h,
      // to catch known shells and boost relevancy
      t.SHEBANG(),
      // to catch unknown shells but still highlight the shebang
      d,
      u,
      t.HASH_COMMENT_MODE,
      o,
      R,
      c,
      i,
      a,
      l,
      n
    ]
  };
}
function pd(t) {
  const e = t.regex, n = new RegExp("[\\p{XID_Start}_]\\p{XID_Continue}*", "u"), r = [
    "and",
    "as",
    "assert",
    "async",
    "await",
    "break",
    "case",
    "class",
    "continue",
    "def",
    "del",
    "elif",
    "else",
    "except",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "match",
    "nonlocal|10",
    "not",
    "or",
    "pass",
    "raise",
    "return",
    "try",
    "while",
    "with",
    "yield"
  ], i = {
    $pattern: /[A-Za-z]\w+|__\w+__/,
    keyword: r,
    built_in: [
      "__import__",
      "abs",
      "all",
      "any",
      "ascii",
      "bin",
      "bool",
      "breakpoint",
      "bytearray",
      "bytes",
      "callable",
      "chr",
      "classmethod",
      "compile",
      "complex",
      "delattr",
      "dict",
      "dir",
      "divmod",
      "enumerate",
      "eval",
      "exec",
      "filter",
      "float",
      "format",
      "frozenset",
      "getattr",
      "globals",
      "hasattr",
      "hash",
      "help",
      "hex",
      "id",
      "input",
      "int",
      "isinstance",
      "issubclass",
      "iter",
      "len",
      "list",
      "locals",
      "map",
      "max",
      "memoryview",
      "min",
      "next",
      "object",
      "oct",
      "open",
      "ord",
      "pow",
      "print",
      "property",
      "range",
      "repr",
      "reversed",
      "round",
      "set",
      "setattr",
      "slice",
      "sorted",
      "staticmethod",
      "str",
      "sum",
      "super",
      "tuple",
      "type",
      "vars",
      "zip"
    ],
    literal: [
      "__debug__",
      "Ellipsis",
      "False",
      "None",
      "NotImplemented",
      "True"
    ],
    type: [
      "Any",
      "Callable",
      "Coroutine",
      "Dict",
      "List",
      "Literal",
      "Generic",
      "Optional",
      "Sequence",
      "Set",
      "Tuple",
      "Type",
      "Union"
    ]
  }, a = {
    className: "meta",
    begin: /^(>>>|\.\.\.) /
  }, l = {
    className: "subst",
    begin: /\{/,
    end: /\}/,
    keywords: i,
    illegal: /#/
  }, u = {
    begin: /\{\{/,
    relevance: 0
  }, f = {
    className: "string",
    contains: [t.BACKSLASH_ESCAPE],
    variants: [
      {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
        end: /'''/,
        contains: [
          t.BACKSLASH_ESCAPE,
          a
        ],
        relevance: 10
      },
      {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
        end: /"""/,
        contains: [
          t.BACKSLASH_ESCAPE,
          a
        ],
        relevance: 10
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])'''/,
        end: /'''/,
        contains: [
          t.BACKSLASH_ESCAPE,
          a,
          u,
          l
        ]
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])"""/,
        end: /"""/,
        contains: [
          t.BACKSLASH_ESCAPE,
          a,
          u,
          l
        ]
      },
      {
        begin: /([uU]|[rR])'/,
        end: /'/,
        relevance: 10
      },
      {
        begin: /([uU]|[rR])"/,
        end: /"/,
        relevance: 10
      },
      {
        begin: /([bB]|[bB][rR]|[rR][bB])'/,
        end: /'/
      },
      {
        begin: /([bB]|[bB][rR]|[rR][bB])"/,
        end: /"/
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])'/,
        end: /'/,
        contains: [
          t.BACKSLASH_ESCAPE,
          u,
          l
        ]
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])"/,
        end: /"/,
        contains: [
          t.BACKSLASH_ESCAPE,
          u,
          l
        ]
      },
      t.APOS_STRING_MODE,
      t.QUOTE_STRING_MODE
    ]
  }, h = "[0-9](_?[0-9])*", d = `(\\b(${h}))?\\.(${h})|\\b(${h})\\.`, m = `\\b|${r.join("|")}`, _ = {
    className: "number",
    relevance: 0,
    variants: [
      // exponentfloat, pointfloat
      // https://docs.python.org/3.9/reference/lexical_analysis.html#floating-point-literals
      // optionally imaginary
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      // Note: no leading \b because floats can start with a decimal point
      // and we don't want to mishandle e.g. `fn(.5)`,
      // no trailing \b for pointfloat because it can end with a decimal point
      // and we don't want to mishandle e.g. `0..hex()`; this should be safe
      // because both MUST contain a decimal point and so cannot be confused with
      // the interior part of an identifier
      {
        begin: `(\\b(${h})|(${d}))[eE][+-]?(${h})[jJ]?(?=${m})`
      },
      {
        begin: `(${d})[jJ]?`
      },
      // decinteger, bininteger, octinteger, hexinteger
      // https://docs.python.org/3.9/reference/lexical_analysis.html#integer-literals
      // optionally "long" in Python 2
      // https://docs.python.org/2.7/reference/lexical_analysis.html#integer-and-long-integer-literals
      // decinteger is optionally imaginary
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      {
        begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${m})`
      },
      {
        begin: `\\b0[bB](_?[01])+[lL]?(?=${m})`
      },
      {
        begin: `\\b0[oO](_?[0-7])+[lL]?(?=${m})`
      },
      {
        begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${m})`
      },
      // imagnumber (digitpart-based)
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      {
        begin: `\\b(${h})[jJ](?=${m})`
      }
    ]
  }, R = {
    className: "comment",
    begin: e.lookahead(/# type:/),
    end: /$/,
    keywords: i,
    contains: [
      {
        // prevent keywords from coloring `type`
        begin: /# type:/
      },
      // comment within a datatype comment includes no keywords
      {
        begin: /#/,
        end: /\b\B/,
        endsWithParent: !0
      }
    ]
  }, T = {
    className: "params",
    variants: [
      // Exclude params in functions without params
      {
        className: "",
        begin: /\(\s*\)/,
        skip: !0
      },
      {
        begin: /\(/,
        end: /\)/,
        excludeBegin: !0,
        excludeEnd: !0,
        keywords: i,
        contains: [
          "self",
          a,
          _,
          f,
          t.HASH_COMMENT_MODE
        ]
      }
    ]
  };
  return l.contains = [
    f,
    _,
    a
  ], {
    name: "Python",
    aliases: [
      "py",
      "gyp",
      "ipython"
    ],
    unicodeRegex: !0,
    keywords: i,
    illegal: /(<\/|\?)|=>/,
    contains: [
      a,
      _,
      {
        // very common convention
        begin: /\bself\b/
      },
      {
        // eat "if" prior to string so that it won't accidentally be
        // labeled as an f-string
        beginKeywords: "if",
        relevance: 0
      },
      f,
      R,
      t.HASH_COMMENT_MODE,
      {
        match: [
          /\bdef/,
          /\s+/,
          n
        ],
        scope: {
          1: "keyword",
          3: "title.function"
        },
        contains: [T]
      },
      {
        variants: [
          {
            match: [
              /\bclass/,
              /\s+/,
              n,
              /\s*/,
              /\(\s*/,
              n,
              /\s*\)/
            ]
          },
          {
            match: [
              /\bclass/,
              /\s+/,
              n
            ]
          }
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          6: "title.class.inherited"
        }
      },
      {
        className: "meta",
        begin: /^[\t ]*@/,
        end: /(?=#)|$/,
        contains: [
          _,
          T,
          f
        ]
      }
    ]
  };
}
const ur = "[A-Za-z$_][0-9A-Za-z$_]*", ba = [
  "as",
  // for exports
  "in",
  "of",
  "if",
  "for",
  "while",
  "finally",
  "var",
  "new",
  "function",
  "do",
  "return",
  "void",
  "else",
  "break",
  "catch",
  "instanceof",
  "with",
  "throw",
  "case",
  "default",
  "try",
  "switch",
  "continue",
  "typeof",
  "delete",
  "let",
  "yield",
  "const",
  "class",
  // JS handles these with a special rule
  // "get",
  // "set",
  "debugger",
  "async",
  "await",
  "static",
  "import",
  "from",
  "export",
  "extends"
], va = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
], ya = [
  // Fundamental objects
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  // numbers and dates
  "Math",
  "Date",
  "Number",
  "BigInt",
  // text
  "String",
  "RegExp",
  // Indexed collections
  "Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Int32Array",
  "Uint16Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  // Keyed collections
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  // Structured data
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  // Control abstraction objects
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  // Reflection
  "Reflect",
  "Proxy",
  // Internationalization
  "Intl",
  // WebAssembly
  "WebAssembly"
], xa = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
], Ea = [
  "setInterval",
  "setTimeout",
  "clearInterval",
  "clearTimeout",
  "require",
  "exports",
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape"
], ka = [
  "arguments",
  "this",
  "super",
  "console",
  "window",
  "document",
  "localStorage",
  "sessionStorage",
  "module",
  "global"
  // Node.js
], wa = [].concat(
  Ea,
  ya,
  xa
);
function dd(t) {
  const e = t.regex, n = (C, { after: j }) => {
    const te = "</" + C[0].slice(1);
    return C.input.indexOf(te, j) !== -1;
  }, r = ur, s = {
    begin: "<>",
    end: "</>"
  }, o = /<[A-Za-z0-9\\._:-]+\s*\/>/, c = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (C, j) => {
      const te = C[0].length + C.index, re = C.input[te];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        re === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        re === ","
      ) {
        j.ignoreMatch();
        return;
      }
      re === ">" && (n(C, { after: te }) || j.ignoreMatch());
      let ue;
      const xe = C.input.substring(te);
      if (ue = xe.match(/^\s*=/)) {
        j.ignoreMatch();
        return;
      }
      if ((ue = xe.match(/^\s+extends\s+/)) && ue.index === 0) {
        j.ignoreMatch();
        return;
      }
    }
  }, i = {
    $pattern: ur,
    keyword: ba,
    literal: va,
    built_in: wa,
    "variable.language": ka
  }, a = "[0-9](_?[0-9])*", l = `\\.(${a})`, u = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", f = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${u})((${l})|\\.)?|(${l}))[eE][+-]?(${a})\\b` },
      { begin: `\\b(${u})\\b((${l})\\b|\\.)?|(${l})\\b` },
      // DecimalBigIntegerLiteral
      { begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
      // NonDecimalIntegerLiteral
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
      // LegacyOctalIntegerLiteral (does not include underscore separators)
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      { begin: "\\b0[0-7]+n?\\b" }
    ],
    relevance: 0
  }, h = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: i,
    contains: []
    // defined later
  }, d = {
    begin: "html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        t.BACKSLASH_ESCAPE,
        h
      ],
      subLanguage: "xml"
    }
  }, m = {
    begin: "css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        t.BACKSLASH_ESCAPE,
        h
      ],
      subLanguage: "css"
    }
  }, _ = {
    begin: "gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        t.BACKSLASH_ESCAPE,
        h
      ],
      subLanguage: "graphql"
    }
  }, R = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      t.BACKSLASH_ESCAPE,
      h
    ]
  }, D = {
    className: "comment",
    variants: [
      t.COMMENT(
        /\/\*\*(?!\/)/,
        "\\*/",
        {
          relevance: 0,
          contains: [
            {
              begin: "(?=@[A-Za-z]+)",
              relevance: 0,
              contains: [
                {
                  className: "doctag",
                  begin: "@[A-Za-z]+"
                },
                {
                  className: "type",
                  begin: "\\{",
                  end: "\\}",
                  excludeEnd: !0,
                  excludeBegin: !0,
                  relevance: 0
                },
                {
                  className: "variable",
                  begin: r + "(?=\\s*(-)|$)",
                  endsParent: !0,
                  relevance: 0
                },
                // eat spaces (not newlines) so we can find
                // types or variables
                {
                  begin: /(?=[^\n])\s/,
                  relevance: 0
                }
              ]
            }
          ]
        }
      ),
      t.C_BLOCK_COMMENT_MODE,
      t.C_LINE_COMMENT_MODE
    ]
  }, I = [
    t.APOS_STRING_MODE,
    t.QUOTE_STRING_MODE,
    d,
    m,
    _,
    R,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    f
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  h.contains = I.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: i,
    contains: [
      "self"
    ].concat(I)
  });
  const B = [].concat(D, h.contains), P = B.concat([
    // eat recursive parens in sub expressions
    {
      begin: /\(/,
      end: /\)/,
      keywords: i,
      contains: ["self"].concat(B)
    }
  ]), y = {
    className: "params",
    begin: /\(/,
    end: /\)/,
    excludeBegin: !0,
    excludeEnd: !0,
    keywords: i,
    contains: P
  }, W = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          r,
          /\s+/,
          /extends/,
          /\s+/,
          e.concat(r, "(", e.concat(/\./, r), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      // class Car
      {
        match: [
          /class/,
          /\s+/,
          r
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  }, $ = {
    relevance: 0,
    match: e.either(
      // Hard coded exceptions
      /\bJSON/,
      // Float32Array, OutT
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      // CSSFactory, CSSFactoryT
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      // FPs, FPsT
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
      // P
      // single letters are not highlighted
      // BLAH
      // this will be flagged as a UPPER_CASE_CONSTANT instead
    ),
    className: "title.class",
    keywords: {
      _: [
        // se we still get relevance credit for JS library classes
        ...ya,
        ...xa
      ]
    }
  }, Q = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, z = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          r,
          /(?=\s*\()/
        ]
      },
      // anonymous function
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [y],
    illegal: /%/
  }, oe = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function L(C) {
    return e.concat("(?!", C.join("|"), ")");
  }
  const ee = {
    match: e.concat(
      /\b/,
      L([
        ...Ea,
        "super",
        "import"
      ]),
      r,
      e.lookahead(/\(/)
    ),
    className: "title.function",
    relevance: 0
  }, A = {
    begin: e.concat(/\./, e.lookahead(
      e.concat(r, /(?![0-9A-Za-z$_(])/)
    )),
    end: r,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, K = {
    match: [
      /get|set/,
      /\s+/,
      r,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      {
        // eat to avoid empty params
        begin: /\(\)/
      },
      y
    ]
  }, F = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + t.UNDERSCORE_IDENT_RE + ")\\s*=>", v = {
    match: [
      /const|var|let/,
      /\s+/,
      r,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      e.lookahead(F)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      y
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: i,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS: P, CLASS_REFERENCE: $ },
    illegal: /#(?![$_A-z])/,
    contains: [
      t.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      Q,
      t.APOS_STRING_MODE,
      t.QUOTE_STRING_MODE,
      d,
      m,
      _,
      R,
      D,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      f,
      $,
      {
        className: "attr",
        begin: r + e.lookahead(":"),
        relevance: 0
      },
      v,
      {
        // "value" container
        begin: "(" + t.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          D,
          t.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: F,
            returnBegin: !0,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: t.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: !0
                  },
                  {
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: i,
                    contains: P
                  }
                ]
              }
            ]
          },
          {
            // could be a comma delimited list of params to a function call
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            // JSX
            variants: [
              { begin: s.begin, end: s.end },
              { match: o },
              {
                begin: c.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": c.isTrulyOpeningTag,
                end: c.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: c.begin,
                end: c.end,
                skip: !0,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      z,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + t.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: !0,
        label: "func.def",
        contains: [
          y,
          t.inherit(t.TITLE_MODE, { begin: r, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      A,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + r,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [y]
      },
      ee,
      oe,
      W,
      K,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
function gd(t) {
  const e = dd(t), n = ur, r = [
    "any",
    "void",
    "number",
    "boolean",
    "string",
    "object",
    "never",
    "symbol",
    "bigint",
    "unknown"
  ], s = {
    beginKeywords: "namespace",
    end: /\{/,
    excludeEnd: !0,
    contains: [e.exports.CLASS_REFERENCE]
  }, o = {
    beginKeywords: "interface",
    end: /\{/,
    excludeEnd: !0,
    keywords: {
      keyword: "interface extends",
      built_in: r
    },
    contains: [e.exports.CLASS_REFERENCE]
  }, c = {
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use strict['"]/
  }, i = [
    "type",
    "namespace",
    "interface",
    "public",
    "private",
    "protected",
    "implements",
    "declare",
    "abstract",
    "readonly",
    "enum",
    "override"
  ], a = {
    $pattern: ur,
    keyword: ba.concat(i),
    literal: va,
    built_in: wa.concat(r),
    "variable.language": ka
  }, l = {
    className: "meta",
    begin: "@" + n
  }, u = (h, d, m) => {
    const _ = h.contains.findIndex((R) => R.label === d);
    if (_ === -1)
      throw new Error("can not find mode to replace");
    h.contains.splice(_, 1, m);
  };
  Object.assign(e.keywords, a), e.exports.PARAMS_CONTAINS.push(l), e.contains = e.contains.concat([
    l,
    s,
    o
  ]), u(e, "shebang", t.SHEBANG()), u(e, "use_strict", c);
  const f = e.contains.find((h) => h.label === "func.def");
  return f.relevance = 0, Object.assign(e, {
    name: "TypeScript",
    aliases: [
      "ts",
      "tsx",
      "mts",
      "cts"
    ]
  }), e;
}
function md(t, e) {
  var n, r, s = t.attrs[t.attrIndex("href")][1];
  for (n = 0; n < e.length; ++n) {
    if (r = e[n], typeof r.matcher == "function") {
      if (r.matcher(s, r))
        return r;
      continue;
    }
    return r;
  }
}
function _d(t, e, n) {
  Object.keys(n).forEach(function(r) {
    var s, o = n[r];
    r === "className" && (r = "class"), s = e[t].attrIndex(r), s < 0 ? e[t].attrPush([r, o]) : e[t].attrs[s][1] = o;
  });
}
function Aa(t, e) {
  e ? e = Array.isArray(e) ? e : [e] : e = [], Object.freeze(e);
  var n = t.renderer.rules.link_open || this.defaultRender;
  t.renderer.rules.link_open = function(r, s, o, c, i) {
    var a = md(r[s], e), l = a && a.attrs;
    return l && _d(s, r, l), n(r, s, o, c, i);
  };
}
Aa.defaultRender = function(t, e, n, r, s) {
  return s.renderToken(t, e, n);
};
var bd = Aa;
const vd = /* @__PURE__ */ Ys(bd);
var le = {};
const yd = "Á", xd = "á", Ed = "Ă", kd = "ă", wd = "∾", Ad = "∿", Cd = "∾̳", Sd = "Â", Td = "â", Dd = "´", Rd = "А", Ld = "а", Nd = "Æ", Id = "æ", Md = "⁡", Od = "𝔄", qd = "𝔞", Fd = "À", Bd = "à", Pd = "ℵ", $d = "ℵ", Ud = "Α", zd = "α", Hd = "Ā", Vd = "ā", Gd = "⨿", jd = "&", Kd = "&", Zd = "⩕", Wd = "⩓", Jd = "∧", Yd = "⩜", Xd = "⩘", Qd = "⩚", eg = "∠", tg = "⦤", ng = "∠", rg = "⦨", sg = "⦩", og = "⦪", cg = "⦫", ig = "⦬", ag = "⦭", lg = "⦮", ug = "⦯", fg = "∡", hg = "∟", pg = "⊾", dg = "⦝", gg = "∢", mg = "Å", _g = "⍼", bg = "Ą", vg = "ą", yg = "𝔸", xg = "𝕒", Eg = "⩯", kg = "≈", wg = "⩰", Ag = "≊", Cg = "≋", Sg = "'", Tg = "⁡", Dg = "≈", Rg = "≊", Lg = "Å", Ng = "å", Ig = "𝒜", Mg = "𝒶", Og = "≔", qg = "*", Fg = "≈", Bg = "≍", Pg = "Ã", $g = "ã", Ug = "Ä", zg = "ä", Hg = "∳", Vg = "⨑", Gg = "≌", jg = "϶", Kg = "‵", Zg = "∽", Wg = "⋍", Jg = "∖", Yg = "⫧", Xg = "⊽", Qg = "⌅", em = "⌆", tm = "⌅", nm = "⎵", rm = "⎶", sm = "≌", om = "Б", cm = "б", im = "„", am = "∵", lm = "∵", um = "∵", fm = "⦰", hm = "϶", pm = "ℬ", dm = "ℬ", gm = "Β", mm = "β", _m = "ℶ", bm = "≬", vm = "𝔅", ym = "𝔟", xm = "⋂", Em = "◯", km = "⋃", wm = "⨀", Am = "⨁", Cm = "⨂", Sm = "⨆", Tm = "★", Dm = "▽", Rm = "△", Lm = "⨄", Nm = "⋁", Im = "⋀", Mm = "⤍", Om = "⧫", qm = "▪", Fm = "▴", Bm = "▾", Pm = "◂", $m = "▸", Um = "␣", zm = "▒", Hm = "░", Vm = "▓", Gm = "█", jm = "=⃥", Km = "≡⃥", Zm = "⫭", Wm = "⌐", Jm = "𝔹", Ym = "𝕓", Xm = "⊥", Qm = "⊥", e_ = "⋈", t_ = "⧉", n_ = "┐", r_ = "╕", s_ = "╖", o_ = "╗", c_ = "┌", i_ = "╒", a_ = "╓", l_ = "╔", u_ = "─", f_ = "═", h_ = "┬", p_ = "╤", d_ = "╥", g_ = "╦", m_ = "┴", __ = "╧", b_ = "╨", v_ = "╩", y_ = "⊟", x_ = "⊞", E_ = "⊠", k_ = "┘", w_ = "╛", A_ = "╜", C_ = "╝", S_ = "└", T_ = "╘", D_ = "╙", R_ = "╚", L_ = "│", N_ = "║", I_ = "┼", M_ = "╪", O_ = "╫", q_ = "╬", F_ = "┤", B_ = "╡", P_ = "╢", $_ = "╣", U_ = "├", z_ = "╞", H_ = "╟", V_ = "╠", G_ = "‵", j_ = "˘", K_ = "˘", Z_ = "¦", W_ = "𝒷", J_ = "ℬ", Y_ = "⁏", X_ = "∽", Q_ = "⋍", eb = "⧅", tb = "\\", nb = "⟈", rb = "•", sb = "•", ob = "≎", cb = "⪮", ib = "≏", ab = "≎", lb = "≏", ub = "Ć", fb = "ć", hb = "⩄", pb = "⩉", db = "⩋", gb = "∩", mb = "⋒", _b = "⩇", bb = "⩀", vb = "ⅅ", yb = "∩︀", xb = "⁁", Eb = "ˇ", kb = "ℭ", wb = "⩍", Ab = "Č", Cb = "č", Sb = "Ç", Tb = "ç", Db = "Ĉ", Rb = "ĉ", Lb = "∰", Nb = "⩌", Ib = "⩐", Mb = "Ċ", Ob = "ċ", qb = "¸", Fb = "¸", Bb = "⦲", Pb = "¢", $b = "·", Ub = "·", zb = "𝔠", Hb = "ℭ", Vb = "Ч", Gb = "ч", jb = "✓", Kb = "✓", Zb = "Χ", Wb = "χ", Jb = "ˆ", Yb = "≗", Xb = "↺", Qb = "↻", e0 = "⊛", t0 = "⊚", n0 = "⊝", r0 = "⊙", s0 = "®", o0 = "Ⓢ", c0 = "⊖", i0 = "⊕", a0 = "⊗", l0 = "○", u0 = "⧃", f0 = "≗", h0 = "⨐", p0 = "⫯", d0 = "⧂", g0 = "∲", m0 = "”", _0 = "’", b0 = "♣", v0 = "♣", y0 = ":", x0 = "∷", E0 = "⩴", k0 = "≔", w0 = "≔", A0 = ",", C0 = "@", S0 = "∁", T0 = "∘", D0 = "∁", R0 = "ℂ", L0 = "≅", N0 = "⩭", I0 = "≡", M0 = "∮", O0 = "∯", q0 = "∮", F0 = "𝕔", B0 = "ℂ", P0 = "∐", $0 = "∐", U0 = "©", z0 = "©", H0 = "℗", V0 = "∳", G0 = "↵", j0 = "✗", K0 = "⨯", Z0 = "𝒞", W0 = "𝒸", J0 = "⫏", Y0 = "⫑", X0 = "⫐", Q0 = "⫒", ev = "⋯", tv = "⤸", nv = "⤵", rv = "⋞", sv = "⋟", ov = "↶", cv = "⤽", iv = "⩈", av = "⩆", lv = "≍", uv = "∪", fv = "⋓", hv = "⩊", pv = "⊍", dv = "⩅", gv = "∪︀", mv = "↷", _v = "⤼", bv = "⋞", vv = "⋟", yv = "⋎", xv = "⋏", Ev = "¤", kv = "↶", wv = "↷", Av = "⋎", Cv = "⋏", Sv = "∲", Tv = "∱", Dv = "⌭", Rv = "†", Lv = "‡", Nv = "ℸ", Iv = "↓", Mv = "↡", Ov = "⇓", qv = "‐", Fv = "⫤", Bv = "⊣", Pv = "⤏", $v = "˝", Uv = "Ď", zv = "ď", Hv = "Д", Vv = "д", Gv = "‡", jv = "⇊", Kv = "ⅅ", Zv = "ⅆ", Wv = "⤑", Jv = "⩷", Yv = "°", Xv = "∇", Qv = "Δ", ey = "δ", ty = "⦱", ny = "⥿", ry = "𝔇", sy = "𝔡", oy = "⥥", cy = "⇃", iy = "⇂", ay = "´", ly = "˙", uy = "˝", fy = "`", hy = "˜", py = "⋄", dy = "⋄", gy = "⋄", my = "♦", _y = "♦", by = "¨", vy = "ⅆ", yy = "ϝ", xy = "⋲", Ey = "÷", ky = "÷", wy = "⋇", Ay = "⋇", Cy = "Ђ", Sy = "ђ", Ty = "⌞", Dy = "⌍", Ry = "$", Ly = "𝔻", Ny = "𝕕", Iy = "¨", My = "˙", Oy = "⃜", qy = "≐", Fy = "≑", By = "≐", Py = "∸", $y = "∔", Uy = "⊡", zy = "⌆", Hy = "∯", Vy = "¨", Gy = "⇓", jy = "⇐", Ky = "⇔", Zy = "⫤", Wy = "⟸", Jy = "⟺", Yy = "⟹", Xy = "⇒", Qy = "⊨", ex = "⇑", tx = "⇕", nx = "∥", rx = "⤓", sx = "↓", ox = "↓", cx = "⇓", ix = "⇵", ax = "̑", lx = "⇊", ux = "⇃", fx = "⇂", hx = "⥐", px = "⥞", dx = "⥖", gx = "↽", mx = "⥟", _x = "⥗", bx = "⇁", vx = "↧", yx = "⊤", xx = "⤐", Ex = "⌟", kx = "⌌", wx = "𝒟", Ax = "𝒹", Cx = "Ѕ", Sx = "ѕ", Tx = "⧶", Dx = "Đ", Rx = "đ", Lx = "⋱", Nx = "▿", Ix = "▾", Mx = "⇵", Ox = "⥯", qx = "⦦", Fx = "Џ", Bx = "џ", Px = "⟿", $x = "É", Ux = "é", zx = "⩮", Hx = "Ě", Vx = "ě", Gx = "Ê", jx = "ê", Kx = "≖", Zx = "≕", Wx = "Э", Jx = "э", Yx = "⩷", Xx = "Ė", Qx = "ė", eE = "≑", tE = "ⅇ", nE = "≒", rE = "𝔈", sE = "𝔢", oE = "⪚", cE = "È", iE = "è", aE = "⪖", lE = "⪘", uE = "⪙", fE = "∈", hE = "⏧", pE = "ℓ", dE = "⪕", gE = "⪗", mE = "Ē", _E = "ē", bE = "∅", vE = "∅", yE = "◻", xE = "∅", EE = "▫", kE = " ", wE = " ", AE = " ", CE = "Ŋ", SE = "ŋ", TE = " ", DE = "Ę", RE = "ę", LE = "𝔼", NE = "𝕖", IE = "⋕", ME = "⧣", OE = "⩱", qE = "ε", FE = "Ε", BE = "ε", PE = "ϵ", $E = "≖", UE = "≕", zE = "≂", HE = "⪖", VE = "⪕", GE = "⩵", jE = "=", KE = "≂", ZE = "≟", WE = "⇌", JE = "≡", YE = "⩸", XE = "⧥", QE = "⥱", ek = "≓", tk = "ℯ", nk = "ℰ", rk = "≐", sk = "⩳", ok = "≂", ck = "Η", ik = "η", ak = "Ð", lk = "ð", uk = "Ë", fk = "ë", hk = "€", pk = "!", dk = "∃", gk = "∃", mk = "ℰ", _k = "ⅇ", bk = "ⅇ", vk = "≒", yk = "Ф", xk = "ф", Ek = "♀", kk = "ﬃ", wk = "ﬀ", Ak = "ﬄ", Ck = "𝔉", Sk = "𝔣", Tk = "ﬁ", Dk = "◼", Rk = "▪", Lk = "fj", Nk = "♭", Ik = "ﬂ", Mk = "▱", Ok = "ƒ", qk = "𝔽", Fk = "𝕗", Bk = "∀", Pk = "∀", $k = "⋔", Uk = "⫙", zk = "ℱ", Hk = "⨍", Vk = "½", Gk = "⅓", jk = "¼", Kk = "⅕", Zk = "⅙", Wk = "⅛", Jk = "⅔", Yk = "⅖", Xk = "¾", Qk = "⅗", ew = "⅜", tw = "⅘", nw = "⅚", rw = "⅝", sw = "⅞", ow = "⁄", cw = "⌢", iw = "𝒻", aw = "ℱ", lw = "ǵ", uw = "Γ", fw = "γ", hw = "Ϝ", pw = "ϝ", dw = "⪆", gw = "Ğ", mw = "ğ", _w = "Ģ", bw = "Ĝ", vw = "ĝ", yw = "Г", xw = "г", Ew = "Ġ", kw = "ġ", ww = "≥", Aw = "≧", Cw = "⪌", Sw = "⋛", Tw = "≥", Dw = "≧", Rw = "⩾", Lw = "⪩", Nw = "⩾", Iw = "⪀", Mw = "⪂", Ow = "⪄", qw = "⋛︀", Fw = "⪔", Bw = "𝔊", Pw = "𝔤", $w = "≫", Uw = "⋙", zw = "⋙", Hw = "ℷ", Vw = "Ѓ", Gw = "ѓ", jw = "⪥", Kw = "≷", Zw = "⪒", Ww = "⪤", Jw = "⪊", Yw = "⪊", Xw = "⪈", Qw = "≩", e1 = "⪈", t1 = "≩", n1 = "⋧", r1 = "𝔾", s1 = "𝕘", o1 = "`", c1 = "≥", i1 = "⋛", a1 = "≧", l1 = "⪢", u1 = "≷", f1 = "⩾", h1 = "≳", p1 = "𝒢", d1 = "ℊ", g1 = "≳", m1 = "⪎", _1 = "⪐", b1 = "⪧", v1 = "⩺", y1 = ">", x1 = ">", E1 = "≫", k1 = "⋗", w1 = "⦕", A1 = "⩼", C1 = "⪆", S1 = "⥸", T1 = "⋗", D1 = "⋛", R1 = "⪌", L1 = "≷", N1 = "≳", I1 = "≩︀", M1 = "≩︀", O1 = "ˇ", q1 = " ", F1 = "½", B1 = "ℋ", P1 = "Ъ", $1 = "ъ", U1 = "⥈", z1 = "↔", H1 = "⇔", V1 = "↭", G1 = "^", j1 = "ℏ", K1 = "Ĥ", Z1 = "ĥ", W1 = "♥", J1 = "♥", Y1 = "…", X1 = "⊹", Q1 = "𝔥", eA = "ℌ", tA = "ℋ", nA = "⤥", rA = "⤦", sA = "⇿", oA = "∻", cA = "↩", iA = "↪", aA = "𝕙", lA = "ℍ", uA = "―", fA = "─", hA = "𝒽", pA = "ℋ", dA = "ℏ", gA = "Ħ", mA = "ħ", _A = "≎", bA = "≏", vA = "⁃", yA = "‐", xA = "Í", EA = "í", kA = "⁣", wA = "Î", AA = "î", CA = "И", SA = "и", TA = "İ", DA = "Е", RA = "е", LA = "¡", NA = "⇔", IA = "𝔦", MA = "ℑ", OA = "Ì", qA = "ì", FA = "ⅈ", BA = "⨌", PA = "∭", $A = "⧜", UA = "℩", zA = "Ĳ", HA = "ĳ", VA = "Ī", GA = "ī", jA = "ℑ", KA = "ⅈ", ZA = "ℐ", WA = "ℑ", JA = "ı", YA = "ℑ", XA = "⊷", QA = "Ƶ", eC = "⇒", tC = "℅", nC = "∞", rC = "⧝", sC = "ı", oC = "⊺", cC = "∫", iC = "∬", aC = "ℤ", lC = "∫", uC = "⊺", fC = "⋂", hC = "⨗", pC = "⨼", dC = "⁣", gC = "⁢", mC = "Ё", _C = "ё", bC = "Į", vC = "į", yC = "𝕀", xC = "𝕚", EC = "Ι", kC = "ι", wC = "⨼", AC = "¿", CC = "𝒾", SC = "ℐ", TC = "∈", DC = "⋵", RC = "⋹", LC = "⋴", NC = "⋳", IC = "∈", MC = "⁢", OC = "Ĩ", qC = "ĩ", FC = "І", BC = "і", PC = "Ï", $C = "ï", UC = "Ĵ", zC = "ĵ", HC = "Й", VC = "й", GC = "𝔍", jC = "𝔧", KC = "ȷ", ZC = "𝕁", WC = "𝕛", JC = "𝒥", YC = "𝒿", XC = "Ј", QC = "ј", eS = "Є", tS = "є", nS = "Κ", rS = "κ", sS = "ϰ", oS = "Ķ", cS = "ķ", iS = "К", aS = "к", lS = "𝔎", uS = "𝔨", fS = "ĸ", hS = "Х", pS = "х", dS = "Ќ", gS = "ќ", mS = "𝕂", _S = "𝕜", bS = "𝒦", vS = "𝓀", yS = "⇚", xS = "Ĺ", ES = "ĺ", kS = "⦴", wS = "ℒ", AS = "Λ", CS = "λ", SS = "⟨", TS = "⟪", DS = "⦑", RS = "⟨", LS = "⪅", NS = "ℒ", IS = "«", MS = "⇤", OS = "⤟", qS = "←", FS = "↞", BS = "⇐", PS = "⤝", $S = "↩", US = "↫", zS = "⤹", HS = "⥳", VS = "↢", GS = "⤙", jS = "⤛", KS = "⪫", ZS = "⪭", WS = "⪭︀", JS = "⤌", YS = "⤎", XS = "❲", QS = "{", eT = "[", tT = "⦋", nT = "⦏", rT = "⦍", sT = "Ľ", oT = "ľ", cT = "Ļ", iT = "ļ", aT = "⌈", lT = "{", uT = "Л", fT = "л", hT = "⤶", pT = "“", dT = "„", gT = "⥧", mT = "⥋", _T = "↲", bT = "≤", vT = "≦", yT = "⟨", xT = "⇤", ET = "←", kT = "←", wT = "⇐", AT = "⇆", CT = "↢", ST = "⌈", TT = "⟦", DT = "⥡", RT = "⥙", LT = "⇃", NT = "⌊", IT = "↽", MT = "↼", OT = "⇇", qT = "↔", FT = "↔", BT = "⇔", PT = "⇆", $T = "⇋", UT = "↭", zT = "⥎", HT = "↤", VT = "⊣", GT = "⥚", jT = "⋋", KT = "⧏", ZT = "⊲", WT = "⊴", JT = "⥑", YT = "⥠", XT = "⥘", QT = "↿", eD = "⥒", tD = "↼", nD = "⪋", rD = "⋚", sD = "≤", oD = "≦", cD = "⩽", iD = "⪨", aD = "⩽", lD = "⩿", uD = "⪁", fD = "⪃", hD = "⋚︀", pD = "⪓", dD = "⪅", gD = "⋖", mD = "⋚", _D = "⪋", bD = "⋚", vD = "≦", yD = "≶", xD = "≶", ED = "⪡", kD = "≲", wD = "⩽", AD = "≲", CD = "⥼", SD = "⌊", TD = "𝔏", DD = "𝔩", RD = "≶", LD = "⪑", ND = "⥢", ID = "↽", MD = "↼", OD = "⥪", qD = "▄", FD = "Љ", BD = "љ", PD = "⇇", $D = "≪", UD = "⋘", zD = "⌞", HD = "⇚", VD = "⥫", GD = "◺", jD = "Ŀ", KD = "ŀ", ZD = "⎰", WD = "⎰", JD = "⪉", YD = "⪉", XD = "⪇", QD = "≨", eR = "⪇", tR = "≨", nR = "⋦", rR = "⟬", sR = "⇽", oR = "⟦", cR = "⟵", iR = "⟵", aR = "⟸", lR = "⟷", uR = "⟷", fR = "⟺", hR = "⟼", pR = "⟶", dR = "⟶", gR = "⟹", mR = "↫", _R = "↬", bR = "⦅", vR = "𝕃", yR = "𝕝", xR = "⨭", ER = "⨴", kR = "∗", wR = "_", AR = "↙", CR = "↘", SR = "◊", TR = "◊", DR = "⧫", RR = "(", LR = "⦓", NR = "⇆", IR = "⌟", MR = "⇋", OR = "⥭", qR = "‎", FR = "⊿", BR = "‹", PR = "𝓁", $R = "ℒ", UR = "↰", zR = "↰", HR = "≲", VR = "⪍", GR = "⪏", jR = "[", KR = "‘", ZR = "‚", WR = "Ł", JR = "ł", YR = "⪦", XR = "⩹", QR = "<", eL = "<", tL = "≪", nL = "⋖", rL = "⋋", sL = "⋉", oL = "⥶", cL = "⩻", iL = "◃", aL = "⊴", lL = "◂", uL = "⦖", fL = "⥊", hL = "⥦", pL = "≨︀", dL = "≨︀", gL = "¯", mL = "♂", _L = "✠", bL = "✠", vL = "↦", yL = "↦", xL = "↧", EL = "↤", kL = "↥", wL = "▮", AL = "⨩", CL = "М", SL = "м", TL = "—", DL = "∺", RL = "∡", LL = " ", NL = "ℳ", IL = "𝔐", ML = "𝔪", OL = "℧", qL = "µ", FL = "*", BL = "⫰", PL = "∣", $L = "·", UL = "⊟", zL = "−", HL = "∸", VL = "⨪", GL = "∓", jL = "⫛", KL = "…", ZL = "∓", WL = "⊧", JL = "𝕄", YL = "𝕞", XL = "∓", QL = "𝓂", eN = "ℳ", tN = "∾", nN = "Μ", rN = "μ", sN = "⊸", oN = "⊸", cN = "∇", iN = "Ń", aN = "ń", lN = "∠⃒", uN = "≉", fN = "⩰̸", hN = "≋̸", pN = "ŉ", dN = "≉", gN = "♮", mN = "ℕ", _N = "♮", bN = " ", vN = "≎̸", yN = "≏̸", xN = "⩃", EN = "Ň", kN = "ň", wN = "Ņ", AN = "ņ", CN = "≇", SN = "⩭̸", TN = "⩂", DN = "Н", RN = "н", LN = "–", NN = "⤤", IN = "↗", MN = "⇗", ON = "↗", qN = "≠", FN = "≐̸", BN = "​", PN = "​", $N = "​", UN = "​", zN = "≢", HN = "⤨", VN = "≂̸", GN = "≫", jN = "≪", KN = `
`, ZN = "∄", WN = "∄", JN = "𝔑", YN = "𝔫", XN = "≧̸", QN = "≱", eI = "≱", tI = "≧̸", nI = "⩾̸", rI = "⩾̸", sI = "⋙̸", oI = "≵", cI = "≫⃒", iI = "≯", aI = "≯", lI = "≫̸", uI = "↮", fI = "⇎", hI = "⫲", pI = "∋", dI = "⋼", gI = "⋺", mI = "∋", _I = "Њ", bI = "њ", vI = "↚", yI = "⇍", xI = "‥", EI = "≦̸", kI = "≰", wI = "↚", AI = "⇍", CI = "↮", SI = "⇎", TI = "≰", DI = "≦̸", RI = "⩽̸", LI = "⩽̸", NI = "≮", II = "⋘̸", MI = "≴", OI = "≪⃒", qI = "≮", FI = "⋪", BI = "⋬", PI = "≪̸", $I = "∤", UI = "⁠", zI = " ", HI = "𝕟", VI = "ℕ", GI = "⫬", jI = "¬", KI = "≢", ZI = "≭", WI = "∦", JI = "∉", YI = "≠", XI = "≂̸", QI = "∄", eM = "≯", tM = "≱", nM = "≧̸", rM = "≫̸", sM = "≹", oM = "⩾̸", cM = "≵", iM = "≎̸", aM = "≏̸", lM = "∉", uM = "⋵̸", fM = "⋹̸", hM = "∉", pM = "⋷", dM = "⋶", gM = "⧏̸", mM = "⋪", _M = "⋬", bM = "≮", vM = "≰", yM = "≸", xM = "≪̸", EM = "⩽̸", kM = "≴", wM = "⪢̸", AM = "⪡̸", CM = "∌", SM = "∌", TM = "⋾", DM = "⋽", RM = "⊀", LM = "⪯̸", NM = "⋠", IM = "∌", MM = "⧐̸", OM = "⋫", qM = "⋭", FM = "⊏̸", BM = "⋢", PM = "⊐̸", $M = "⋣", UM = "⊂⃒", zM = "⊈", HM = "⊁", VM = "⪰̸", GM = "⋡", jM = "≿̸", KM = "⊃⃒", ZM = "⊉", WM = "≁", JM = "≄", YM = "≇", XM = "≉", QM = "∤", eO = "∦", tO = "∦", nO = "⫽⃥", rO = "∂̸", sO = "⨔", oO = "⊀", cO = "⋠", iO = "⊀", aO = "⪯̸", lO = "⪯̸", uO = "⤳̸", fO = "↛", hO = "⇏", pO = "↝̸", dO = "↛", gO = "⇏", mO = "⋫", _O = "⋭", bO = "⊁", vO = "⋡", yO = "⪰̸", xO = "𝒩", EO = "𝓃", kO = "∤", wO = "∦", AO = "≁", CO = "≄", SO = "≄", TO = "∤", DO = "∦", RO = "⋢", LO = "⋣", NO = "⊄", IO = "⫅̸", MO = "⊈", OO = "⊂⃒", qO = "⊈", FO = "⫅̸", BO = "⊁", PO = "⪰̸", $O = "⊅", UO = "⫆̸", zO = "⊉", HO = "⊃⃒", VO = "⊉", GO = "⫆̸", jO = "≹", KO = "Ñ", ZO = "ñ", WO = "≸", JO = "⋪", YO = "⋬", XO = "⋫", QO = "⋭", e2 = "Ν", t2 = "ν", n2 = "#", r2 = "№", s2 = " ", o2 = "≍⃒", c2 = "⊬", i2 = "⊭", a2 = "⊮", l2 = "⊯", u2 = "≥⃒", f2 = ">⃒", h2 = "⤄", p2 = "⧞", d2 = "⤂", g2 = "≤⃒", m2 = "<⃒", _2 = "⊴⃒", b2 = "⤃", v2 = "⊵⃒", y2 = "∼⃒", x2 = "⤣", E2 = "↖", k2 = "⇖", w2 = "↖", A2 = "⤧", C2 = "Ó", S2 = "ó", T2 = "⊛", D2 = "Ô", R2 = "ô", L2 = "⊚", N2 = "О", I2 = "о", M2 = "⊝", O2 = "Ő", q2 = "ő", F2 = "⨸", B2 = "⊙", P2 = "⦼", $2 = "Œ", U2 = "œ", z2 = "⦿", H2 = "𝔒", V2 = "𝔬", G2 = "˛", j2 = "Ò", K2 = "ò", Z2 = "⧁", W2 = "⦵", J2 = "Ω", Y2 = "∮", X2 = "↺", Q2 = "⦾", eq = "⦻", tq = "‾", nq = "⧀", rq = "Ō", sq = "ō", oq = "Ω", cq = "ω", iq = "Ο", aq = "ο", lq = "⦶", uq = "⊖", fq = "𝕆", hq = "𝕠", pq = "⦷", dq = "“", gq = "‘", mq = "⦹", _q = "⊕", bq = "↻", vq = "⩔", yq = "∨", xq = "⩝", Eq = "ℴ", kq = "ℴ", wq = "ª", Aq = "º", Cq = "⊶", Sq = "⩖", Tq = "⩗", Dq = "⩛", Rq = "Ⓢ", Lq = "𝒪", Nq = "ℴ", Iq = "Ø", Mq = "ø", Oq = "⊘", qq = "Õ", Fq = "õ", Bq = "⨶", Pq = "⨷", $q = "⊗", Uq = "Ö", zq = "ö", Hq = "⌽", Vq = "‾", Gq = "⏞", jq = "⎴", Kq = "⏜", Zq = "¶", Wq = "∥", Jq = "∥", Yq = "⫳", Xq = "⫽", Qq = "∂", eF = "∂", tF = "П", nF = "п", rF = "%", sF = ".", oF = "‰", cF = "⊥", iF = "‱", aF = "𝔓", lF = "𝔭", uF = "Φ", fF = "φ", hF = "ϕ", pF = "ℳ", dF = "☎", gF = "Π", mF = "π", _F = "⋔", bF = "ϖ", vF = "ℏ", yF = "ℎ", xF = "ℏ", EF = "⨣", kF = "⊞", wF = "⨢", AF = "+", CF = "∔", SF = "⨥", TF = "⩲", DF = "±", RF = "±", LF = "⨦", NF = "⨧", IF = "±", MF = "ℌ", OF = "⨕", qF = "𝕡", FF = "ℙ", BF = "£", PF = "⪷", $F = "⪻", UF = "≺", zF = "≼", HF = "⪷", VF = "≺", GF = "≼", jF = "≺", KF = "⪯", ZF = "≼", WF = "≾", JF = "⪯", YF = "⪹", XF = "⪵", QF = "⋨", eB = "⪯", tB = "⪳", nB = "≾", rB = "′", sB = "″", oB = "ℙ", cB = "⪹", iB = "⪵", aB = "⋨", lB = "∏", uB = "∏", fB = "⌮", hB = "⌒", pB = "⌓", dB = "∝", gB = "∝", mB = "∷", _B = "∝", bB = "≾", vB = "⊰", yB = "𝒫", xB = "𝓅", EB = "Ψ", kB = "ψ", wB = " ", AB = "𝔔", CB = "𝔮", SB = "⨌", TB = "𝕢", DB = "ℚ", RB = "⁗", LB = "𝒬", NB = "𝓆", IB = "ℍ", MB = "⨖", OB = "?", qB = "≟", FB = '"', BB = '"', PB = "⇛", $B = "∽̱", UB = "Ŕ", zB = "ŕ", HB = "√", VB = "⦳", GB = "⟩", jB = "⟫", KB = "⦒", ZB = "⦥", WB = "⟩", JB = "»", YB = "⥵", XB = "⇥", QB = "⤠", eP = "⤳", tP = "→", nP = "↠", rP = "⇒", sP = "⤞", oP = "↪", cP = "↬", iP = "⥅", aP = "⥴", lP = "⤖", uP = "↣", fP = "↝", hP = "⤚", pP = "⤜", dP = "∶", gP = "ℚ", mP = "⤍", _P = "⤏", bP = "⤐", vP = "❳", yP = "}", xP = "]", EP = "⦌", kP = "⦎", wP = "⦐", AP = "Ř", CP = "ř", SP = "Ŗ", TP = "ŗ", DP = "⌉", RP = "}", LP = "Р", NP = "р", IP = "⤷", MP = "⥩", OP = "”", qP = "”", FP = "↳", BP = "ℜ", PP = "ℛ", $P = "ℜ", UP = "ℝ", zP = "ℜ", HP = "▭", VP = "®", GP = "®", jP = "∋", KP = "⇋", ZP = "⥯", WP = "⥽", JP = "⌋", YP = "𝔯", XP = "ℜ", QP = "⥤", e$ = "⇁", t$ = "⇀", n$ = "⥬", r$ = "Ρ", s$ = "ρ", o$ = "ϱ", c$ = "⟩", i$ = "⇥", a$ = "→", l$ = "→", u$ = "⇒", f$ = "⇄", h$ = "↣", p$ = "⌉", d$ = "⟧", g$ = "⥝", m$ = "⥕", _$ = "⇂", b$ = "⌋", v$ = "⇁", y$ = "⇀", x$ = "⇄", E$ = "⇌", k$ = "⇉", w$ = "↝", A$ = "↦", C$ = "⊢", S$ = "⥛", T$ = "⋌", D$ = "⧐", R$ = "⊳", L$ = "⊵", N$ = "⥏", I$ = "⥜", M$ = "⥔", O$ = "↾", q$ = "⥓", F$ = "⇀", B$ = "˚", P$ = "≓", $$ = "⇄", U$ = "⇌", z$ = "‏", H$ = "⎱", V$ = "⎱", G$ = "⫮", j$ = "⟭", K$ = "⇾", Z$ = "⟧", W$ = "⦆", J$ = "𝕣", Y$ = "ℝ", X$ = "⨮", Q$ = "⨵", eU = "⥰", tU = ")", nU = "⦔", rU = "⨒", sU = "⇉", oU = "⇛", cU = "›", iU = "𝓇", aU = "ℛ", lU = "↱", uU = "↱", fU = "]", hU = "’", pU = "’", dU = "⋌", gU = "⋊", mU = "▹", _U = "⊵", bU = "▸", vU = "⧎", yU = "⧴", xU = "⥨", EU = "℞", kU = "Ś", wU = "ś", AU = "‚", CU = "⪸", SU = "Š", TU = "š", DU = "⪼", RU = "≻", LU = "≽", NU = "⪰", IU = "⪴", MU = "Ş", OU = "ş", qU = "Ŝ", FU = "ŝ", BU = "⪺", PU = "⪶", $U = "⋩", UU = "⨓", zU = "≿", HU = "С", VU = "с", GU = "⊡", jU = "⋅", KU = "⩦", ZU = "⤥", WU = "↘", JU = "⇘", YU = "↘", XU = "§", QU = ";", ez = "⤩", tz = "∖", nz = "∖", rz = "✶", sz = "𝔖", oz = "𝔰", cz = "⌢", iz = "♯", az = "Щ", lz = "щ", uz = "Ш", fz = "ш", hz = "↓", pz = "←", dz = "∣", gz = "∥", mz = "→", _z = "↑", bz = "­", vz = "Σ", yz = "σ", xz = "ς", Ez = "ς", kz = "∼", wz = "⩪", Az = "≃", Cz = "≃", Sz = "⪞", Tz = "⪠", Dz = "⪝", Rz = "⪟", Lz = "≆", Nz = "⨤", Iz = "⥲", Mz = "←", Oz = "∘", qz = "∖", Fz = "⨳", Bz = "⧤", Pz = "∣", $z = "⌣", Uz = "⪪", zz = "⪬", Hz = "⪬︀", Vz = "Ь", Gz = "ь", jz = "⌿", Kz = "⧄", Zz = "/", Wz = "𝕊", Jz = "𝕤", Yz = "♠", Xz = "♠", Qz = "∥", e3 = "⊓", t3 = "⊓︀", n3 = "⊔", r3 = "⊔︀", s3 = "√", o3 = "⊏", c3 = "⊑", i3 = "⊏", a3 = "⊑", l3 = "⊐", u3 = "⊒", f3 = "⊐", h3 = "⊒", p3 = "□", d3 = "□", g3 = "⊓", m3 = "⊏", _3 = "⊑", b3 = "⊐", v3 = "⊒", y3 = "⊔", x3 = "▪", E3 = "□", k3 = "▪", w3 = "→", A3 = "𝒮", C3 = "𝓈", S3 = "∖", T3 = "⌣", D3 = "⋆", R3 = "⋆", L3 = "☆", N3 = "★", I3 = "ϵ", M3 = "ϕ", O3 = "¯", q3 = "⊂", F3 = "⋐", B3 = "⪽", P3 = "⫅", $3 = "⊆", U3 = "⫃", z3 = "⫁", H3 = "⫋", V3 = "⊊", G3 = "⪿", j3 = "⥹", K3 = "⊂", Z3 = "⋐", W3 = "⊆", J3 = "⫅", Y3 = "⊆", X3 = "⊊", Q3 = "⫋", eH = "⫇", tH = "⫕", nH = "⫓", rH = "⪸", sH = "≻", oH = "≽", cH = "≻", iH = "⪰", aH = "≽", lH = "≿", uH = "⪰", fH = "⪺", hH = "⪶", pH = "⋩", dH = "≿", gH = "∋", mH = "∑", _H = "∑", bH = "♪", vH = "¹", yH = "²", xH = "³", EH = "⊃", kH = "⋑", wH = "⪾", AH = "⫘", CH = "⫆", SH = "⊇", TH = "⫄", DH = "⊃", RH = "⊇", LH = "⟉", NH = "⫗", IH = "⥻", MH = "⫂", OH = "⫌", qH = "⊋", FH = "⫀", BH = "⊃", PH = "⋑", $H = "⊇", UH = "⫆", zH = "⊋", HH = "⫌", VH = "⫈", GH = "⫔", jH = "⫖", KH = "⤦", ZH = "↙", WH = "⇙", JH = "↙", YH = "⤪", XH = "ß", QH = "	", e6 = "⌖", t6 = "Τ", n6 = "τ", r6 = "⎴", s6 = "Ť", o6 = "ť", c6 = "Ţ", i6 = "ţ", a6 = "Т", l6 = "т", u6 = "⃛", f6 = "⌕", h6 = "𝔗", p6 = "𝔱", d6 = "∴", g6 = "∴", m6 = "∴", _6 = "Θ", b6 = "θ", v6 = "ϑ", y6 = "ϑ", x6 = "≈", E6 = "∼", k6 = "  ", w6 = " ", A6 = " ", C6 = "≈", S6 = "∼", T6 = "Þ", D6 = "þ", R6 = "˜", L6 = "∼", N6 = "≃", I6 = "≅", M6 = "≈", O6 = "⨱", q6 = "⊠", F6 = "×", B6 = "⨰", P6 = "∭", $6 = "⤨", U6 = "⌶", z6 = "⫱", H6 = "⊤", V6 = "𝕋", G6 = "𝕥", j6 = "⫚", K6 = "⤩", Z6 = "‴", W6 = "™", J6 = "™", Y6 = "▵", X6 = "▿", Q6 = "◃", eV = "⊴", tV = "≜", nV = "▹", rV = "⊵", sV = "◬", oV = "≜", cV = "⨺", iV = "⃛", aV = "⨹", lV = "⧍", uV = "⨻", fV = "⏢", hV = "𝒯", pV = "𝓉", dV = "Ц", gV = "ц", mV = "Ћ", _V = "ћ", bV = "Ŧ", vV = "ŧ", yV = "≬", xV = "↞", EV = "↠", kV = "Ú", wV = "ú", AV = "↑", CV = "↟", SV = "⇑", TV = "⥉", DV = "Ў", RV = "ў", LV = "Ŭ", NV = "ŭ", IV = "Û", MV = "û", OV = "У", qV = "у", FV = "⇅", BV = "Ű", PV = "ű", $V = "⥮", UV = "⥾", zV = "𝔘", HV = "𝔲", VV = "Ù", GV = "ù", jV = "⥣", KV = "↿", ZV = "↾", WV = "▀", JV = "⌜", YV = "⌜", XV = "⌏", QV = "◸", e4 = "Ū", t4 = "ū", n4 = "¨", r4 = "_", s4 = "⏟", o4 = "⎵", c4 = "⏝", i4 = "⋃", a4 = "⊎", l4 = "Ų", u4 = "ų", f4 = "𝕌", h4 = "𝕦", p4 = "⤒", d4 = "↑", g4 = "↑", m4 = "⇑", _4 = "⇅", b4 = "↕", v4 = "↕", y4 = "⇕", x4 = "⥮", E4 = "↿", k4 = "↾", w4 = "⊎", A4 = "↖", C4 = "↗", S4 = "υ", T4 = "ϒ", D4 = "ϒ", R4 = "Υ", L4 = "υ", N4 = "↥", I4 = "⊥", M4 = "⇈", O4 = "⌝", q4 = "⌝", F4 = "⌎", B4 = "Ů", P4 = "ů", $4 = "◹", U4 = "𝒰", z4 = "𝓊", H4 = "⋰", V4 = "Ũ", G4 = "ũ", j4 = "▵", K4 = "▴", Z4 = "⇈", W4 = "Ü", J4 = "ü", Y4 = "⦧", X4 = "⦜", Q4 = "ϵ", e9 = "ϰ", t9 = "∅", n9 = "ϕ", r9 = "ϖ", s9 = "∝", o9 = "↕", c9 = "⇕", i9 = "ϱ", a9 = "ς", l9 = "⊊︀", u9 = "⫋︀", f9 = "⊋︀", h9 = "⫌︀", p9 = "ϑ", d9 = "⊲", g9 = "⊳", m9 = "⫨", _9 = "⫫", b9 = "⫩", v9 = "В", y9 = "в", x9 = "⊢", E9 = "⊨", k9 = "⊩", w9 = "⊫", A9 = "⫦", C9 = "⊻", S9 = "∨", T9 = "⋁", D9 = "≚", R9 = "⋮", L9 = "|", N9 = "‖", I9 = "|", M9 = "‖", O9 = "∣", q9 = "|", F9 = "❘", B9 = "≀", P9 = " ", $9 = "𝔙", U9 = "𝔳", z9 = "⊲", H9 = "⊂⃒", V9 = "⊃⃒", G9 = "𝕍", j9 = "𝕧", K9 = "∝", Z9 = "⊳", W9 = "𝒱", J9 = "𝓋", Y9 = "⫋︀", X9 = "⊊︀", Q9 = "⫌︀", e8 = "⊋︀", t8 = "⊪", n8 = "⦚", r8 = "Ŵ", s8 = "ŵ", o8 = "⩟", c8 = "∧", i8 = "⋀", a8 = "≙", l8 = "℘", u8 = "𝔚", f8 = "𝔴", h8 = "𝕎", p8 = "𝕨", d8 = "℘", g8 = "≀", m8 = "≀", _8 = "𝒲", b8 = "𝓌", v8 = "⋂", y8 = "◯", x8 = "⋃", E8 = "▽", k8 = "𝔛", w8 = "𝔵", A8 = "⟷", C8 = "⟺", S8 = "Ξ", T8 = "ξ", D8 = "⟵", R8 = "⟸", L8 = "⟼", N8 = "⋻", I8 = "⨀", M8 = "𝕏", O8 = "𝕩", q8 = "⨁", F8 = "⨂", B8 = "⟶", P8 = "⟹", $8 = "𝒳", U8 = "𝓍", z8 = "⨆", H8 = "⨄", V8 = "△", G8 = "⋁", j8 = "⋀", K8 = "Ý", Z8 = "ý", W8 = "Я", J8 = "я", Y8 = "Ŷ", X8 = "ŷ", Q8 = "Ы", e5 = "ы", t5 = "¥", n5 = "𝔜", r5 = "𝔶", s5 = "Ї", o5 = "ї", c5 = "𝕐", i5 = "𝕪", a5 = "𝒴", l5 = "𝓎", u5 = "Ю", f5 = "ю", h5 = "ÿ", p5 = "Ÿ", d5 = "Ź", g5 = "ź", m5 = "Ž", _5 = "ž", b5 = "З", v5 = "з", y5 = "Ż", x5 = "ż", E5 = "ℨ", k5 = "​", w5 = "Ζ", A5 = "ζ", C5 = "𝔷", S5 = "ℨ", T5 = "Ж", D5 = "ж", R5 = "⇝", L5 = "𝕫", N5 = "ℤ", I5 = "𝒵", M5 = "𝓏", O5 = "‍", q5 = "‌", F5 = {
  Aacute: yd,
  aacute: xd,
  Abreve: Ed,
  abreve: kd,
  ac: wd,
  acd: Ad,
  acE: Cd,
  Acirc: Sd,
  acirc: Td,
  acute: Dd,
  Acy: Rd,
  acy: Ld,
  AElig: Nd,
  aelig: Id,
  af: Md,
  Afr: Od,
  afr: qd,
  Agrave: Fd,
  agrave: Bd,
  alefsym: Pd,
  aleph: $d,
  Alpha: Ud,
  alpha: zd,
  Amacr: Hd,
  amacr: Vd,
  amalg: Gd,
  amp: jd,
  AMP: Kd,
  andand: Zd,
  And: Wd,
  and: Jd,
  andd: Yd,
  andslope: Xd,
  andv: Qd,
  ang: eg,
  ange: tg,
  angle: ng,
  angmsdaa: rg,
  angmsdab: sg,
  angmsdac: og,
  angmsdad: cg,
  angmsdae: ig,
  angmsdaf: ag,
  angmsdag: lg,
  angmsdah: ug,
  angmsd: fg,
  angrt: hg,
  angrtvb: pg,
  angrtvbd: dg,
  angsph: gg,
  angst: mg,
  angzarr: _g,
  Aogon: bg,
  aogon: vg,
  Aopf: yg,
  aopf: xg,
  apacir: Eg,
  ap: kg,
  apE: wg,
  ape: Ag,
  apid: Cg,
  apos: Sg,
  ApplyFunction: Tg,
  approx: Dg,
  approxeq: Rg,
  Aring: Lg,
  aring: Ng,
  Ascr: Ig,
  ascr: Mg,
  Assign: Og,
  ast: qg,
  asymp: Fg,
  asympeq: Bg,
  Atilde: Pg,
  atilde: $g,
  Auml: Ug,
  auml: zg,
  awconint: Hg,
  awint: Vg,
  backcong: Gg,
  backepsilon: jg,
  backprime: Kg,
  backsim: Zg,
  backsimeq: Wg,
  Backslash: Jg,
  Barv: Yg,
  barvee: Xg,
  barwed: Qg,
  Barwed: em,
  barwedge: tm,
  bbrk: nm,
  bbrktbrk: rm,
  bcong: sm,
  Bcy: om,
  bcy: cm,
  bdquo: im,
  becaus: am,
  because: lm,
  Because: um,
  bemptyv: fm,
  bepsi: hm,
  bernou: pm,
  Bernoullis: dm,
  Beta: gm,
  beta: mm,
  beth: _m,
  between: bm,
  Bfr: vm,
  bfr: ym,
  bigcap: xm,
  bigcirc: Em,
  bigcup: km,
  bigodot: wm,
  bigoplus: Am,
  bigotimes: Cm,
  bigsqcup: Sm,
  bigstar: Tm,
  bigtriangledown: Dm,
  bigtriangleup: Rm,
  biguplus: Lm,
  bigvee: Nm,
  bigwedge: Im,
  bkarow: Mm,
  blacklozenge: Om,
  blacksquare: qm,
  blacktriangle: Fm,
  blacktriangledown: Bm,
  blacktriangleleft: Pm,
  blacktriangleright: $m,
  blank: Um,
  blk12: zm,
  blk14: Hm,
  blk34: Vm,
  block: Gm,
  bne: jm,
  bnequiv: Km,
  bNot: Zm,
  bnot: Wm,
  Bopf: Jm,
  bopf: Ym,
  bot: Xm,
  bottom: Qm,
  bowtie: e_,
  boxbox: t_,
  boxdl: n_,
  boxdL: r_,
  boxDl: s_,
  boxDL: o_,
  boxdr: c_,
  boxdR: i_,
  boxDr: a_,
  boxDR: l_,
  boxh: u_,
  boxH: f_,
  boxhd: h_,
  boxHd: p_,
  boxhD: d_,
  boxHD: g_,
  boxhu: m_,
  boxHu: __,
  boxhU: b_,
  boxHU: v_,
  boxminus: y_,
  boxplus: x_,
  boxtimes: E_,
  boxul: k_,
  boxuL: w_,
  boxUl: A_,
  boxUL: C_,
  boxur: S_,
  boxuR: T_,
  boxUr: D_,
  boxUR: R_,
  boxv: L_,
  boxV: N_,
  boxvh: I_,
  boxvH: M_,
  boxVh: O_,
  boxVH: q_,
  boxvl: F_,
  boxvL: B_,
  boxVl: P_,
  boxVL: $_,
  boxvr: U_,
  boxvR: z_,
  boxVr: H_,
  boxVR: V_,
  bprime: G_,
  breve: j_,
  Breve: K_,
  brvbar: Z_,
  bscr: W_,
  Bscr: J_,
  bsemi: Y_,
  bsim: X_,
  bsime: Q_,
  bsolb: eb,
  bsol: tb,
  bsolhsub: nb,
  bull: rb,
  bullet: sb,
  bump: ob,
  bumpE: cb,
  bumpe: ib,
  Bumpeq: ab,
  bumpeq: lb,
  Cacute: ub,
  cacute: fb,
  capand: hb,
  capbrcup: pb,
  capcap: db,
  cap: gb,
  Cap: mb,
  capcup: _b,
  capdot: bb,
  CapitalDifferentialD: vb,
  caps: yb,
  caret: xb,
  caron: Eb,
  Cayleys: kb,
  ccaps: wb,
  Ccaron: Ab,
  ccaron: Cb,
  Ccedil: Sb,
  ccedil: Tb,
  Ccirc: Db,
  ccirc: Rb,
  Cconint: Lb,
  ccups: Nb,
  ccupssm: Ib,
  Cdot: Mb,
  cdot: Ob,
  cedil: qb,
  Cedilla: Fb,
  cemptyv: Bb,
  cent: Pb,
  centerdot: $b,
  CenterDot: Ub,
  cfr: zb,
  Cfr: Hb,
  CHcy: Vb,
  chcy: Gb,
  check: jb,
  checkmark: Kb,
  Chi: Zb,
  chi: Wb,
  circ: Jb,
  circeq: Yb,
  circlearrowleft: Xb,
  circlearrowright: Qb,
  circledast: e0,
  circledcirc: t0,
  circleddash: n0,
  CircleDot: r0,
  circledR: s0,
  circledS: o0,
  CircleMinus: c0,
  CirclePlus: i0,
  CircleTimes: a0,
  cir: l0,
  cirE: u0,
  cire: f0,
  cirfnint: h0,
  cirmid: p0,
  cirscir: d0,
  ClockwiseContourIntegral: g0,
  CloseCurlyDoubleQuote: m0,
  CloseCurlyQuote: _0,
  clubs: b0,
  clubsuit: v0,
  colon: y0,
  Colon: x0,
  Colone: E0,
  colone: k0,
  coloneq: w0,
  comma: A0,
  commat: C0,
  comp: S0,
  compfn: T0,
  complement: D0,
  complexes: R0,
  cong: L0,
  congdot: N0,
  Congruent: I0,
  conint: M0,
  Conint: O0,
  ContourIntegral: q0,
  copf: F0,
  Copf: B0,
  coprod: P0,
  Coproduct: $0,
  copy: U0,
  COPY: z0,
  copysr: H0,
  CounterClockwiseContourIntegral: V0,
  crarr: G0,
  cross: j0,
  Cross: K0,
  Cscr: Z0,
  cscr: W0,
  csub: J0,
  csube: Y0,
  csup: X0,
  csupe: Q0,
  ctdot: ev,
  cudarrl: tv,
  cudarrr: nv,
  cuepr: rv,
  cuesc: sv,
  cularr: ov,
  cularrp: cv,
  cupbrcap: iv,
  cupcap: av,
  CupCap: lv,
  cup: uv,
  Cup: fv,
  cupcup: hv,
  cupdot: pv,
  cupor: dv,
  cups: gv,
  curarr: mv,
  curarrm: _v,
  curlyeqprec: bv,
  curlyeqsucc: vv,
  curlyvee: yv,
  curlywedge: xv,
  curren: Ev,
  curvearrowleft: kv,
  curvearrowright: wv,
  cuvee: Av,
  cuwed: Cv,
  cwconint: Sv,
  cwint: Tv,
  cylcty: Dv,
  dagger: Rv,
  Dagger: Lv,
  daleth: Nv,
  darr: Iv,
  Darr: Mv,
  dArr: Ov,
  dash: qv,
  Dashv: Fv,
  dashv: Bv,
  dbkarow: Pv,
  dblac: $v,
  Dcaron: Uv,
  dcaron: zv,
  Dcy: Hv,
  dcy: Vv,
  ddagger: Gv,
  ddarr: jv,
  DD: Kv,
  dd: Zv,
  DDotrahd: Wv,
  ddotseq: Jv,
  deg: Yv,
  Del: Xv,
  Delta: Qv,
  delta: ey,
  demptyv: ty,
  dfisht: ny,
  Dfr: ry,
  dfr: sy,
  dHar: oy,
  dharl: cy,
  dharr: iy,
  DiacriticalAcute: ay,
  DiacriticalDot: ly,
  DiacriticalDoubleAcute: uy,
  DiacriticalGrave: fy,
  DiacriticalTilde: hy,
  diam: py,
  diamond: dy,
  Diamond: gy,
  diamondsuit: my,
  diams: _y,
  die: by,
  DifferentialD: vy,
  digamma: yy,
  disin: xy,
  div: Ey,
  divide: ky,
  divideontimes: wy,
  divonx: Ay,
  DJcy: Cy,
  djcy: Sy,
  dlcorn: Ty,
  dlcrop: Dy,
  dollar: Ry,
  Dopf: Ly,
  dopf: Ny,
  Dot: Iy,
  dot: My,
  DotDot: Oy,
  doteq: qy,
  doteqdot: Fy,
  DotEqual: By,
  dotminus: Py,
  dotplus: $y,
  dotsquare: Uy,
  doublebarwedge: zy,
  DoubleContourIntegral: Hy,
  DoubleDot: Vy,
  DoubleDownArrow: Gy,
  DoubleLeftArrow: jy,
  DoubleLeftRightArrow: Ky,
  DoubleLeftTee: Zy,
  DoubleLongLeftArrow: Wy,
  DoubleLongLeftRightArrow: Jy,
  DoubleLongRightArrow: Yy,
  DoubleRightArrow: Xy,
  DoubleRightTee: Qy,
  DoubleUpArrow: ex,
  DoubleUpDownArrow: tx,
  DoubleVerticalBar: nx,
  DownArrowBar: rx,
  downarrow: sx,
  DownArrow: ox,
  Downarrow: cx,
  DownArrowUpArrow: ix,
  DownBreve: ax,
  downdownarrows: lx,
  downharpoonleft: ux,
  downharpoonright: fx,
  DownLeftRightVector: hx,
  DownLeftTeeVector: px,
  DownLeftVectorBar: dx,
  DownLeftVector: gx,
  DownRightTeeVector: mx,
  DownRightVectorBar: _x,
  DownRightVector: bx,
  DownTeeArrow: vx,
  DownTee: yx,
  drbkarow: xx,
  drcorn: Ex,
  drcrop: kx,
  Dscr: wx,
  dscr: Ax,
  DScy: Cx,
  dscy: Sx,
  dsol: Tx,
  Dstrok: Dx,
  dstrok: Rx,
  dtdot: Lx,
  dtri: Nx,
  dtrif: Ix,
  duarr: Mx,
  duhar: Ox,
  dwangle: qx,
  DZcy: Fx,
  dzcy: Bx,
  dzigrarr: Px,
  Eacute: $x,
  eacute: Ux,
  easter: zx,
  Ecaron: Hx,
  ecaron: Vx,
  Ecirc: Gx,
  ecirc: jx,
  ecir: Kx,
  ecolon: Zx,
  Ecy: Wx,
  ecy: Jx,
  eDDot: Yx,
  Edot: Xx,
  edot: Qx,
  eDot: eE,
  ee: tE,
  efDot: nE,
  Efr: rE,
  efr: sE,
  eg: oE,
  Egrave: cE,
  egrave: iE,
  egs: aE,
  egsdot: lE,
  el: uE,
  Element: fE,
  elinters: hE,
  ell: pE,
  els: dE,
  elsdot: gE,
  Emacr: mE,
  emacr: _E,
  empty: bE,
  emptyset: vE,
  EmptySmallSquare: yE,
  emptyv: xE,
  EmptyVerySmallSquare: EE,
  emsp13: kE,
  emsp14: wE,
  emsp: AE,
  ENG: CE,
  eng: SE,
  ensp: TE,
  Eogon: DE,
  eogon: RE,
  Eopf: LE,
  eopf: NE,
  epar: IE,
  eparsl: ME,
  eplus: OE,
  epsi: qE,
  Epsilon: FE,
  epsilon: BE,
  epsiv: PE,
  eqcirc: $E,
  eqcolon: UE,
  eqsim: zE,
  eqslantgtr: HE,
  eqslantless: VE,
  Equal: GE,
  equals: jE,
  EqualTilde: KE,
  equest: ZE,
  Equilibrium: WE,
  equiv: JE,
  equivDD: YE,
  eqvparsl: XE,
  erarr: QE,
  erDot: ek,
  escr: tk,
  Escr: nk,
  esdot: rk,
  Esim: sk,
  esim: ok,
  Eta: ck,
  eta: ik,
  ETH: ak,
  eth: lk,
  Euml: uk,
  euml: fk,
  euro: hk,
  excl: pk,
  exist: dk,
  Exists: gk,
  expectation: mk,
  exponentiale: _k,
  ExponentialE: bk,
  fallingdotseq: vk,
  Fcy: yk,
  fcy: xk,
  female: Ek,
  ffilig: kk,
  fflig: wk,
  ffllig: Ak,
  Ffr: Ck,
  ffr: Sk,
  filig: Tk,
  FilledSmallSquare: Dk,
  FilledVerySmallSquare: Rk,
  fjlig: Lk,
  flat: Nk,
  fllig: Ik,
  fltns: Mk,
  fnof: Ok,
  Fopf: qk,
  fopf: Fk,
  forall: Bk,
  ForAll: Pk,
  fork: $k,
  forkv: Uk,
  Fouriertrf: zk,
  fpartint: Hk,
  frac12: Vk,
  frac13: Gk,
  frac14: jk,
  frac15: Kk,
  frac16: Zk,
  frac18: Wk,
  frac23: Jk,
  frac25: Yk,
  frac34: Xk,
  frac35: Qk,
  frac38: ew,
  frac45: tw,
  frac56: nw,
  frac58: rw,
  frac78: sw,
  frasl: ow,
  frown: cw,
  fscr: iw,
  Fscr: aw,
  gacute: lw,
  Gamma: uw,
  gamma: fw,
  Gammad: hw,
  gammad: pw,
  gap: dw,
  Gbreve: gw,
  gbreve: mw,
  Gcedil: _w,
  Gcirc: bw,
  gcirc: vw,
  Gcy: yw,
  gcy: xw,
  Gdot: Ew,
  gdot: kw,
  ge: ww,
  gE: Aw,
  gEl: Cw,
  gel: Sw,
  geq: Tw,
  geqq: Dw,
  geqslant: Rw,
  gescc: Lw,
  ges: Nw,
  gesdot: Iw,
  gesdoto: Mw,
  gesdotol: Ow,
  gesl: qw,
  gesles: Fw,
  Gfr: Bw,
  gfr: Pw,
  gg: $w,
  Gg: Uw,
  ggg: zw,
  gimel: Hw,
  GJcy: Vw,
  gjcy: Gw,
  gla: jw,
  gl: Kw,
  glE: Zw,
  glj: Ww,
  gnap: Jw,
  gnapprox: Yw,
  gne: Xw,
  gnE: Qw,
  gneq: e1,
  gneqq: t1,
  gnsim: n1,
  Gopf: r1,
  gopf: s1,
  grave: o1,
  GreaterEqual: c1,
  GreaterEqualLess: i1,
  GreaterFullEqual: a1,
  GreaterGreater: l1,
  GreaterLess: u1,
  GreaterSlantEqual: f1,
  GreaterTilde: h1,
  Gscr: p1,
  gscr: d1,
  gsim: g1,
  gsime: m1,
  gsiml: _1,
  gtcc: b1,
  gtcir: v1,
  gt: y1,
  GT: x1,
  Gt: E1,
  gtdot: k1,
  gtlPar: w1,
  gtquest: A1,
  gtrapprox: C1,
  gtrarr: S1,
  gtrdot: T1,
  gtreqless: D1,
  gtreqqless: R1,
  gtrless: L1,
  gtrsim: N1,
  gvertneqq: I1,
  gvnE: M1,
  Hacek: O1,
  hairsp: q1,
  half: F1,
  hamilt: B1,
  HARDcy: P1,
  hardcy: $1,
  harrcir: U1,
  harr: z1,
  hArr: H1,
  harrw: V1,
  Hat: G1,
  hbar: j1,
  Hcirc: K1,
  hcirc: Z1,
  hearts: W1,
  heartsuit: J1,
  hellip: Y1,
  hercon: X1,
  hfr: Q1,
  Hfr: eA,
  HilbertSpace: tA,
  hksearow: nA,
  hkswarow: rA,
  hoarr: sA,
  homtht: oA,
  hookleftarrow: cA,
  hookrightarrow: iA,
  hopf: aA,
  Hopf: lA,
  horbar: uA,
  HorizontalLine: fA,
  hscr: hA,
  Hscr: pA,
  hslash: dA,
  Hstrok: gA,
  hstrok: mA,
  HumpDownHump: _A,
  HumpEqual: bA,
  hybull: vA,
  hyphen: yA,
  Iacute: xA,
  iacute: EA,
  ic: kA,
  Icirc: wA,
  icirc: AA,
  Icy: CA,
  icy: SA,
  Idot: TA,
  IEcy: DA,
  iecy: RA,
  iexcl: LA,
  iff: NA,
  ifr: IA,
  Ifr: MA,
  Igrave: OA,
  igrave: qA,
  ii: FA,
  iiiint: BA,
  iiint: PA,
  iinfin: $A,
  iiota: UA,
  IJlig: zA,
  ijlig: HA,
  Imacr: VA,
  imacr: GA,
  image: jA,
  ImaginaryI: KA,
  imagline: ZA,
  imagpart: WA,
  imath: JA,
  Im: YA,
  imof: XA,
  imped: QA,
  Implies: eC,
  incare: tC,
  in: "∈",
  infin: nC,
  infintie: rC,
  inodot: sC,
  intcal: oC,
  int: cC,
  Int: iC,
  integers: aC,
  Integral: lC,
  intercal: uC,
  Intersection: fC,
  intlarhk: hC,
  intprod: pC,
  InvisibleComma: dC,
  InvisibleTimes: gC,
  IOcy: mC,
  iocy: _C,
  Iogon: bC,
  iogon: vC,
  Iopf: yC,
  iopf: xC,
  Iota: EC,
  iota: kC,
  iprod: wC,
  iquest: AC,
  iscr: CC,
  Iscr: SC,
  isin: TC,
  isindot: DC,
  isinE: RC,
  isins: LC,
  isinsv: NC,
  isinv: IC,
  it: MC,
  Itilde: OC,
  itilde: qC,
  Iukcy: FC,
  iukcy: BC,
  Iuml: PC,
  iuml: $C,
  Jcirc: UC,
  jcirc: zC,
  Jcy: HC,
  jcy: VC,
  Jfr: GC,
  jfr: jC,
  jmath: KC,
  Jopf: ZC,
  jopf: WC,
  Jscr: JC,
  jscr: YC,
  Jsercy: XC,
  jsercy: QC,
  Jukcy: eS,
  jukcy: tS,
  Kappa: nS,
  kappa: rS,
  kappav: sS,
  Kcedil: oS,
  kcedil: cS,
  Kcy: iS,
  kcy: aS,
  Kfr: lS,
  kfr: uS,
  kgreen: fS,
  KHcy: hS,
  khcy: pS,
  KJcy: dS,
  kjcy: gS,
  Kopf: mS,
  kopf: _S,
  Kscr: bS,
  kscr: vS,
  lAarr: yS,
  Lacute: xS,
  lacute: ES,
  laemptyv: kS,
  lagran: wS,
  Lambda: AS,
  lambda: CS,
  lang: SS,
  Lang: TS,
  langd: DS,
  langle: RS,
  lap: LS,
  Laplacetrf: NS,
  laquo: IS,
  larrb: MS,
  larrbfs: OS,
  larr: qS,
  Larr: FS,
  lArr: BS,
  larrfs: PS,
  larrhk: $S,
  larrlp: US,
  larrpl: zS,
  larrsim: HS,
  larrtl: VS,
  latail: GS,
  lAtail: jS,
  lat: KS,
  late: ZS,
  lates: WS,
  lbarr: JS,
  lBarr: YS,
  lbbrk: XS,
  lbrace: QS,
  lbrack: eT,
  lbrke: tT,
  lbrksld: nT,
  lbrkslu: rT,
  Lcaron: sT,
  lcaron: oT,
  Lcedil: cT,
  lcedil: iT,
  lceil: aT,
  lcub: lT,
  Lcy: uT,
  lcy: fT,
  ldca: hT,
  ldquo: pT,
  ldquor: dT,
  ldrdhar: gT,
  ldrushar: mT,
  ldsh: _T,
  le: bT,
  lE: vT,
  LeftAngleBracket: yT,
  LeftArrowBar: xT,
  leftarrow: ET,
  LeftArrow: kT,
  Leftarrow: wT,
  LeftArrowRightArrow: AT,
  leftarrowtail: CT,
  LeftCeiling: ST,
  LeftDoubleBracket: TT,
  LeftDownTeeVector: DT,
  LeftDownVectorBar: RT,
  LeftDownVector: LT,
  LeftFloor: NT,
  leftharpoondown: IT,
  leftharpoonup: MT,
  leftleftarrows: OT,
  leftrightarrow: qT,
  LeftRightArrow: FT,
  Leftrightarrow: BT,
  leftrightarrows: PT,
  leftrightharpoons: $T,
  leftrightsquigarrow: UT,
  LeftRightVector: zT,
  LeftTeeArrow: HT,
  LeftTee: VT,
  LeftTeeVector: GT,
  leftthreetimes: jT,
  LeftTriangleBar: KT,
  LeftTriangle: ZT,
  LeftTriangleEqual: WT,
  LeftUpDownVector: JT,
  LeftUpTeeVector: YT,
  LeftUpVectorBar: XT,
  LeftUpVector: QT,
  LeftVectorBar: eD,
  LeftVector: tD,
  lEg: nD,
  leg: rD,
  leq: sD,
  leqq: oD,
  leqslant: cD,
  lescc: iD,
  les: aD,
  lesdot: lD,
  lesdoto: uD,
  lesdotor: fD,
  lesg: hD,
  lesges: pD,
  lessapprox: dD,
  lessdot: gD,
  lesseqgtr: mD,
  lesseqqgtr: _D,
  LessEqualGreater: bD,
  LessFullEqual: vD,
  LessGreater: yD,
  lessgtr: xD,
  LessLess: ED,
  lesssim: kD,
  LessSlantEqual: wD,
  LessTilde: AD,
  lfisht: CD,
  lfloor: SD,
  Lfr: TD,
  lfr: DD,
  lg: RD,
  lgE: LD,
  lHar: ND,
  lhard: ID,
  lharu: MD,
  lharul: OD,
  lhblk: qD,
  LJcy: FD,
  ljcy: BD,
  llarr: PD,
  ll: $D,
  Ll: UD,
  llcorner: zD,
  Lleftarrow: HD,
  llhard: VD,
  lltri: GD,
  Lmidot: jD,
  lmidot: KD,
  lmoustache: ZD,
  lmoust: WD,
  lnap: JD,
  lnapprox: YD,
  lne: XD,
  lnE: QD,
  lneq: eR,
  lneqq: tR,
  lnsim: nR,
  loang: rR,
  loarr: sR,
  lobrk: oR,
  longleftarrow: cR,
  LongLeftArrow: iR,
  Longleftarrow: aR,
  longleftrightarrow: lR,
  LongLeftRightArrow: uR,
  Longleftrightarrow: fR,
  longmapsto: hR,
  longrightarrow: pR,
  LongRightArrow: dR,
  Longrightarrow: gR,
  looparrowleft: mR,
  looparrowright: _R,
  lopar: bR,
  Lopf: vR,
  lopf: yR,
  loplus: xR,
  lotimes: ER,
  lowast: kR,
  lowbar: wR,
  LowerLeftArrow: AR,
  LowerRightArrow: CR,
  loz: SR,
  lozenge: TR,
  lozf: DR,
  lpar: RR,
  lparlt: LR,
  lrarr: NR,
  lrcorner: IR,
  lrhar: MR,
  lrhard: OR,
  lrm: qR,
  lrtri: FR,
  lsaquo: BR,
  lscr: PR,
  Lscr: $R,
  lsh: UR,
  Lsh: zR,
  lsim: HR,
  lsime: VR,
  lsimg: GR,
  lsqb: jR,
  lsquo: KR,
  lsquor: ZR,
  Lstrok: WR,
  lstrok: JR,
  ltcc: YR,
  ltcir: XR,
  lt: QR,
  LT: eL,
  Lt: tL,
  ltdot: nL,
  lthree: rL,
  ltimes: sL,
  ltlarr: oL,
  ltquest: cL,
  ltri: iL,
  ltrie: aL,
  ltrif: lL,
  ltrPar: uL,
  lurdshar: fL,
  luruhar: hL,
  lvertneqq: pL,
  lvnE: dL,
  macr: gL,
  male: mL,
  malt: _L,
  maltese: bL,
  Map: "⤅",
  map: vL,
  mapsto: yL,
  mapstodown: xL,
  mapstoleft: EL,
  mapstoup: kL,
  marker: wL,
  mcomma: AL,
  Mcy: CL,
  mcy: SL,
  mdash: TL,
  mDDot: DL,
  measuredangle: RL,
  MediumSpace: LL,
  Mellintrf: NL,
  Mfr: IL,
  mfr: ML,
  mho: OL,
  micro: qL,
  midast: FL,
  midcir: BL,
  mid: PL,
  middot: $L,
  minusb: UL,
  minus: zL,
  minusd: HL,
  minusdu: VL,
  MinusPlus: GL,
  mlcp: jL,
  mldr: KL,
  mnplus: ZL,
  models: WL,
  Mopf: JL,
  mopf: YL,
  mp: XL,
  mscr: QL,
  Mscr: eN,
  mstpos: tN,
  Mu: nN,
  mu: rN,
  multimap: sN,
  mumap: oN,
  nabla: cN,
  Nacute: iN,
  nacute: aN,
  nang: lN,
  nap: uN,
  napE: fN,
  napid: hN,
  napos: pN,
  napprox: dN,
  natural: gN,
  naturals: mN,
  natur: _N,
  nbsp: bN,
  nbump: vN,
  nbumpe: yN,
  ncap: xN,
  Ncaron: EN,
  ncaron: kN,
  Ncedil: wN,
  ncedil: AN,
  ncong: CN,
  ncongdot: SN,
  ncup: TN,
  Ncy: DN,
  ncy: RN,
  ndash: LN,
  nearhk: NN,
  nearr: IN,
  neArr: MN,
  nearrow: ON,
  ne: qN,
  nedot: FN,
  NegativeMediumSpace: BN,
  NegativeThickSpace: PN,
  NegativeThinSpace: $N,
  NegativeVeryThinSpace: UN,
  nequiv: zN,
  nesear: HN,
  nesim: VN,
  NestedGreaterGreater: GN,
  NestedLessLess: jN,
  NewLine: KN,
  nexist: ZN,
  nexists: WN,
  Nfr: JN,
  nfr: YN,
  ngE: XN,
  nge: QN,
  ngeq: eI,
  ngeqq: tI,
  ngeqslant: nI,
  nges: rI,
  nGg: sI,
  ngsim: oI,
  nGt: cI,
  ngt: iI,
  ngtr: aI,
  nGtv: lI,
  nharr: uI,
  nhArr: fI,
  nhpar: hI,
  ni: pI,
  nis: dI,
  nisd: gI,
  niv: mI,
  NJcy: _I,
  njcy: bI,
  nlarr: vI,
  nlArr: yI,
  nldr: xI,
  nlE: EI,
  nle: kI,
  nleftarrow: wI,
  nLeftarrow: AI,
  nleftrightarrow: CI,
  nLeftrightarrow: SI,
  nleq: TI,
  nleqq: DI,
  nleqslant: RI,
  nles: LI,
  nless: NI,
  nLl: II,
  nlsim: MI,
  nLt: OI,
  nlt: qI,
  nltri: FI,
  nltrie: BI,
  nLtv: PI,
  nmid: $I,
  NoBreak: UI,
  NonBreakingSpace: zI,
  nopf: HI,
  Nopf: VI,
  Not: GI,
  not: jI,
  NotCongruent: KI,
  NotCupCap: ZI,
  NotDoubleVerticalBar: WI,
  NotElement: JI,
  NotEqual: YI,
  NotEqualTilde: XI,
  NotExists: QI,
  NotGreater: eM,
  NotGreaterEqual: tM,
  NotGreaterFullEqual: nM,
  NotGreaterGreater: rM,
  NotGreaterLess: sM,
  NotGreaterSlantEqual: oM,
  NotGreaterTilde: cM,
  NotHumpDownHump: iM,
  NotHumpEqual: aM,
  notin: lM,
  notindot: uM,
  notinE: fM,
  notinva: hM,
  notinvb: pM,
  notinvc: dM,
  NotLeftTriangleBar: gM,
  NotLeftTriangle: mM,
  NotLeftTriangleEqual: _M,
  NotLess: bM,
  NotLessEqual: vM,
  NotLessGreater: yM,
  NotLessLess: xM,
  NotLessSlantEqual: EM,
  NotLessTilde: kM,
  NotNestedGreaterGreater: wM,
  NotNestedLessLess: AM,
  notni: CM,
  notniva: SM,
  notnivb: TM,
  notnivc: DM,
  NotPrecedes: RM,
  NotPrecedesEqual: LM,
  NotPrecedesSlantEqual: NM,
  NotReverseElement: IM,
  NotRightTriangleBar: MM,
  NotRightTriangle: OM,
  NotRightTriangleEqual: qM,
  NotSquareSubset: FM,
  NotSquareSubsetEqual: BM,
  NotSquareSuperset: PM,
  NotSquareSupersetEqual: $M,
  NotSubset: UM,
  NotSubsetEqual: zM,
  NotSucceeds: HM,
  NotSucceedsEqual: VM,
  NotSucceedsSlantEqual: GM,
  NotSucceedsTilde: jM,
  NotSuperset: KM,
  NotSupersetEqual: ZM,
  NotTilde: WM,
  NotTildeEqual: JM,
  NotTildeFullEqual: YM,
  NotTildeTilde: XM,
  NotVerticalBar: QM,
  nparallel: eO,
  npar: tO,
  nparsl: nO,
  npart: rO,
  npolint: sO,
  npr: oO,
  nprcue: cO,
  nprec: iO,
  npreceq: aO,
  npre: lO,
  nrarrc: uO,
  nrarr: fO,
  nrArr: hO,
  nrarrw: pO,
  nrightarrow: dO,
  nRightarrow: gO,
  nrtri: mO,
  nrtrie: _O,
  nsc: bO,
  nsccue: vO,
  nsce: yO,
  Nscr: xO,
  nscr: EO,
  nshortmid: kO,
  nshortparallel: wO,
  nsim: AO,
  nsime: CO,
  nsimeq: SO,
  nsmid: TO,
  nspar: DO,
  nsqsube: RO,
  nsqsupe: LO,
  nsub: NO,
  nsubE: IO,
  nsube: MO,
  nsubset: OO,
  nsubseteq: qO,
  nsubseteqq: FO,
  nsucc: BO,
  nsucceq: PO,
  nsup: $O,
  nsupE: UO,
  nsupe: zO,
  nsupset: HO,
  nsupseteq: VO,
  nsupseteqq: GO,
  ntgl: jO,
  Ntilde: KO,
  ntilde: ZO,
  ntlg: WO,
  ntriangleleft: JO,
  ntrianglelefteq: YO,
  ntriangleright: XO,
  ntrianglerighteq: QO,
  Nu: e2,
  nu: t2,
  num: n2,
  numero: r2,
  numsp: s2,
  nvap: o2,
  nvdash: c2,
  nvDash: i2,
  nVdash: a2,
  nVDash: l2,
  nvge: u2,
  nvgt: f2,
  nvHarr: h2,
  nvinfin: p2,
  nvlArr: d2,
  nvle: g2,
  nvlt: m2,
  nvltrie: _2,
  nvrArr: b2,
  nvrtrie: v2,
  nvsim: y2,
  nwarhk: x2,
  nwarr: E2,
  nwArr: k2,
  nwarrow: w2,
  nwnear: A2,
  Oacute: C2,
  oacute: S2,
  oast: T2,
  Ocirc: D2,
  ocirc: R2,
  ocir: L2,
  Ocy: N2,
  ocy: I2,
  odash: M2,
  Odblac: O2,
  odblac: q2,
  odiv: F2,
  odot: B2,
  odsold: P2,
  OElig: $2,
  oelig: U2,
  ofcir: z2,
  Ofr: H2,
  ofr: V2,
  ogon: G2,
  Ograve: j2,
  ograve: K2,
  ogt: Z2,
  ohbar: W2,
  ohm: J2,
  oint: Y2,
  olarr: X2,
  olcir: Q2,
  olcross: eq,
  oline: tq,
  olt: nq,
  Omacr: rq,
  omacr: sq,
  Omega: oq,
  omega: cq,
  Omicron: iq,
  omicron: aq,
  omid: lq,
  ominus: uq,
  Oopf: fq,
  oopf: hq,
  opar: pq,
  OpenCurlyDoubleQuote: dq,
  OpenCurlyQuote: gq,
  operp: mq,
  oplus: _q,
  orarr: bq,
  Or: vq,
  or: yq,
  ord: xq,
  order: Eq,
  orderof: kq,
  ordf: wq,
  ordm: Aq,
  origof: Cq,
  oror: Sq,
  orslope: Tq,
  orv: Dq,
  oS: Rq,
  Oscr: Lq,
  oscr: Nq,
  Oslash: Iq,
  oslash: Mq,
  osol: Oq,
  Otilde: qq,
  otilde: Fq,
  otimesas: Bq,
  Otimes: Pq,
  otimes: $q,
  Ouml: Uq,
  ouml: zq,
  ovbar: Hq,
  OverBar: Vq,
  OverBrace: Gq,
  OverBracket: jq,
  OverParenthesis: Kq,
  para: Zq,
  parallel: Wq,
  par: Jq,
  parsim: Yq,
  parsl: Xq,
  part: Qq,
  PartialD: eF,
  Pcy: tF,
  pcy: nF,
  percnt: rF,
  period: sF,
  permil: oF,
  perp: cF,
  pertenk: iF,
  Pfr: aF,
  pfr: lF,
  Phi: uF,
  phi: fF,
  phiv: hF,
  phmmat: pF,
  phone: dF,
  Pi: gF,
  pi: mF,
  pitchfork: _F,
  piv: bF,
  planck: vF,
  planckh: yF,
  plankv: xF,
  plusacir: EF,
  plusb: kF,
  pluscir: wF,
  plus: AF,
  plusdo: CF,
  plusdu: SF,
  pluse: TF,
  PlusMinus: DF,
  plusmn: RF,
  plussim: LF,
  plustwo: NF,
  pm: IF,
  Poincareplane: MF,
  pointint: OF,
  popf: qF,
  Popf: FF,
  pound: BF,
  prap: PF,
  Pr: $F,
  pr: UF,
  prcue: zF,
  precapprox: HF,
  prec: VF,
  preccurlyeq: GF,
  Precedes: jF,
  PrecedesEqual: KF,
  PrecedesSlantEqual: ZF,
  PrecedesTilde: WF,
  preceq: JF,
  precnapprox: YF,
  precneqq: XF,
  precnsim: QF,
  pre: eB,
  prE: tB,
  precsim: nB,
  prime: rB,
  Prime: sB,
  primes: oB,
  prnap: cB,
  prnE: iB,
  prnsim: aB,
  prod: lB,
  Product: uB,
  profalar: fB,
  profline: hB,
  profsurf: pB,
  prop: dB,
  Proportional: gB,
  Proportion: mB,
  propto: _B,
  prsim: bB,
  prurel: vB,
  Pscr: yB,
  pscr: xB,
  Psi: EB,
  psi: kB,
  puncsp: wB,
  Qfr: AB,
  qfr: CB,
  qint: SB,
  qopf: TB,
  Qopf: DB,
  qprime: RB,
  Qscr: LB,
  qscr: NB,
  quaternions: IB,
  quatint: MB,
  quest: OB,
  questeq: qB,
  quot: FB,
  QUOT: BB,
  rAarr: PB,
  race: $B,
  Racute: UB,
  racute: zB,
  radic: HB,
  raemptyv: VB,
  rang: GB,
  Rang: jB,
  rangd: KB,
  range: ZB,
  rangle: WB,
  raquo: JB,
  rarrap: YB,
  rarrb: XB,
  rarrbfs: QB,
  rarrc: eP,
  rarr: tP,
  Rarr: nP,
  rArr: rP,
  rarrfs: sP,
  rarrhk: oP,
  rarrlp: cP,
  rarrpl: iP,
  rarrsim: aP,
  Rarrtl: lP,
  rarrtl: uP,
  rarrw: fP,
  ratail: hP,
  rAtail: pP,
  ratio: dP,
  rationals: gP,
  rbarr: mP,
  rBarr: _P,
  RBarr: bP,
  rbbrk: vP,
  rbrace: yP,
  rbrack: xP,
  rbrke: EP,
  rbrksld: kP,
  rbrkslu: wP,
  Rcaron: AP,
  rcaron: CP,
  Rcedil: SP,
  rcedil: TP,
  rceil: DP,
  rcub: RP,
  Rcy: LP,
  rcy: NP,
  rdca: IP,
  rdldhar: MP,
  rdquo: OP,
  rdquor: qP,
  rdsh: FP,
  real: BP,
  realine: PP,
  realpart: $P,
  reals: UP,
  Re: zP,
  rect: HP,
  reg: VP,
  REG: GP,
  ReverseElement: jP,
  ReverseEquilibrium: KP,
  ReverseUpEquilibrium: ZP,
  rfisht: WP,
  rfloor: JP,
  rfr: YP,
  Rfr: XP,
  rHar: QP,
  rhard: e$,
  rharu: t$,
  rharul: n$,
  Rho: r$,
  rho: s$,
  rhov: o$,
  RightAngleBracket: c$,
  RightArrowBar: i$,
  rightarrow: a$,
  RightArrow: l$,
  Rightarrow: u$,
  RightArrowLeftArrow: f$,
  rightarrowtail: h$,
  RightCeiling: p$,
  RightDoubleBracket: d$,
  RightDownTeeVector: g$,
  RightDownVectorBar: m$,
  RightDownVector: _$,
  RightFloor: b$,
  rightharpoondown: v$,
  rightharpoonup: y$,
  rightleftarrows: x$,
  rightleftharpoons: E$,
  rightrightarrows: k$,
  rightsquigarrow: w$,
  RightTeeArrow: A$,
  RightTee: C$,
  RightTeeVector: S$,
  rightthreetimes: T$,
  RightTriangleBar: D$,
  RightTriangle: R$,
  RightTriangleEqual: L$,
  RightUpDownVector: N$,
  RightUpTeeVector: I$,
  RightUpVectorBar: M$,
  RightUpVector: O$,
  RightVectorBar: q$,
  RightVector: F$,
  ring: B$,
  risingdotseq: P$,
  rlarr: $$,
  rlhar: U$,
  rlm: z$,
  rmoustache: H$,
  rmoust: V$,
  rnmid: G$,
  roang: j$,
  roarr: K$,
  robrk: Z$,
  ropar: W$,
  ropf: J$,
  Ropf: Y$,
  roplus: X$,
  rotimes: Q$,
  RoundImplies: eU,
  rpar: tU,
  rpargt: nU,
  rppolint: rU,
  rrarr: sU,
  Rrightarrow: oU,
  rsaquo: cU,
  rscr: iU,
  Rscr: aU,
  rsh: lU,
  Rsh: uU,
  rsqb: fU,
  rsquo: hU,
  rsquor: pU,
  rthree: dU,
  rtimes: gU,
  rtri: mU,
  rtrie: _U,
  rtrif: bU,
  rtriltri: vU,
  RuleDelayed: yU,
  ruluhar: xU,
  rx: EU,
  Sacute: kU,
  sacute: wU,
  sbquo: AU,
  scap: CU,
  Scaron: SU,
  scaron: TU,
  Sc: DU,
  sc: RU,
  sccue: LU,
  sce: NU,
  scE: IU,
  Scedil: MU,
  scedil: OU,
  Scirc: qU,
  scirc: FU,
  scnap: BU,
  scnE: PU,
  scnsim: $U,
  scpolint: UU,
  scsim: zU,
  Scy: HU,
  scy: VU,
  sdotb: GU,
  sdot: jU,
  sdote: KU,
  searhk: ZU,
  searr: WU,
  seArr: JU,
  searrow: YU,
  sect: XU,
  semi: QU,
  seswar: ez,
  setminus: tz,
  setmn: nz,
  sext: rz,
  Sfr: sz,
  sfr: oz,
  sfrown: cz,
  sharp: iz,
  SHCHcy: az,
  shchcy: lz,
  SHcy: uz,
  shcy: fz,
  ShortDownArrow: hz,
  ShortLeftArrow: pz,
  shortmid: dz,
  shortparallel: gz,
  ShortRightArrow: mz,
  ShortUpArrow: _z,
  shy: bz,
  Sigma: vz,
  sigma: yz,
  sigmaf: xz,
  sigmav: Ez,
  sim: kz,
  simdot: wz,
  sime: Az,
  simeq: Cz,
  simg: Sz,
  simgE: Tz,
  siml: Dz,
  simlE: Rz,
  simne: Lz,
  simplus: Nz,
  simrarr: Iz,
  slarr: Mz,
  SmallCircle: Oz,
  smallsetminus: qz,
  smashp: Fz,
  smeparsl: Bz,
  smid: Pz,
  smile: $z,
  smt: Uz,
  smte: zz,
  smtes: Hz,
  SOFTcy: Vz,
  softcy: Gz,
  solbar: jz,
  solb: Kz,
  sol: Zz,
  Sopf: Wz,
  sopf: Jz,
  spades: Yz,
  spadesuit: Xz,
  spar: Qz,
  sqcap: e3,
  sqcaps: t3,
  sqcup: n3,
  sqcups: r3,
  Sqrt: s3,
  sqsub: o3,
  sqsube: c3,
  sqsubset: i3,
  sqsubseteq: a3,
  sqsup: l3,
  sqsupe: u3,
  sqsupset: f3,
  sqsupseteq: h3,
  square: p3,
  Square: d3,
  SquareIntersection: g3,
  SquareSubset: m3,
  SquareSubsetEqual: _3,
  SquareSuperset: b3,
  SquareSupersetEqual: v3,
  SquareUnion: y3,
  squarf: x3,
  squ: E3,
  squf: k3,
  srarr: w3,
  Sscr: A3,
  sscr: C3,
  ssetmn: S3,
  ssmile: T3,
  sstarf: D3,
  Star: R3,
  star: L3,
  starf: N3,
  straightepsilon: I3,
  straightphi: M3,
  strns: O3,
  sub: q3,
  Sub: F3,
  subdot: B3,
  subE: P3,
  sube: $3,
  subedot: U3,
  submult: z3,
  subnE: H3,
  subne: V3,
  subplus: G3,
  subrarr: j3,
  subset: K3,
  Subset: Z3,
  subseteq: W3,
  subseteqq: J3,
  SubsetEqual: Y3,
  subsetneq: X3,
  subsetneqq: Q3,
  subsim: eH,
  subsub: tH,
  subsup: nH,
  succapprox: rH,
  succ: sH,
  succcurlyeq: oH,
  Succeeds: cH,
  SucceedsEqual: iH,
  SucceedsSlantEqual: aH,
  SucceedsTilde: lH,
  succeq: uH,
  succnapprox: fH,
  succneqq: hH,
  succnsim: pH,
  succsim: dH,
  SuchThat: gH,
  sum: mH,
  Sum: _H,
  sung: bH,
  sup1: vH,
  sup2: yH,
  sup3: xH,
  sup: EH,
  Sup: kH,
  supdot: wH,
  supdsub: AH,
  supE: CH,
  supe: SH,
  supedot: TH,
  Superset: DH,
  SupersetEqual: RH,
  suphsol: LH,
  suphsub: NH,
  suplarr: IH,
  supmult: MH,
  supnE: OH,
  supne: qH,
  supplus: FH,
  supset: BH,
  Supset: PH,
  supseteq: $H,
  supseteqq: UH,
  supsetneq: zH,
  supsetneqq: HH,
  supsim: VH,
  supsub: GH,
  supsup: jH,
  swarhk: KH,
  swarr: ZH,
  swArr: WH,
  swarrow: JH,
  swnwar: YH,
  szlig: XH,
  Tab: QH,
  target: e6,
  Tau: t6,
  tau: n6,
  tbrk: r6,
  Tcaron: s6,
  tcaron: o6,
  Tcedil: c6,
  tcedil: i6,
  Tcy: a6,
  tcy: l6,
  tdot: u6,
  telrec: f6,
  Tfr: h6,
  tfr: p6,
  there4: d6,
  therefore: g6,
  Therefore: m6,
  Theta: _6,
  theta: b6,
  thetasym: v6,
  thetav: y6,
  thickapprox: x6,
  thicksim: E6,
  ThickSpace: k6,
  ThinSpace: w6,
  thinsp: A6,
  thkap: C6,
  thksim: S6,
  THORN: T6,
  thorn: D6,
  tilde: R6,
  Tilde: L6,
  TildeEqual: N6,
  TildeFullEqual: I6,
  TildeTilde: M6,
  timesbar: O6,
  timesb: q6,
  times: F6,
  timesd: B6,
  tint: P6,
  toea: $6,
  topbot: U6,
  topcir: z6,
  top: H6,
  Topf: V6,
  topf: G6,
  topfork: j6,
  tosa: K6,
  tprime: Z6,
  trade: W6,
  TRADE: J6,
  triangle: Y6,
  triangledown: X6,
  triangleleft: Q6,
  trianglelefteq: eV,
  triangleq: tV,
  triangleright: nV,
  trianglerighteq: rV,
  tridot: sV,
  trie: oV,
  triminus: cV,
  TripleDot: iV,
  triplus: aV,
  trisb: lV,
  tritime: uV,
  trpezium: fV,
  Tscr: hV,
  tscr: pV,
  TScy: dV,
  tscy: gV,
  TSHcy: mV,
  tshcy: _V,
  Tstrok: bV,
  tstrok: vV,
  twixt: yV,
  twoheadleftarrow: xV,
  twoheadrightarrow: EV,
  Uacute: kV,
  uacute: wV,
  uarr: AV,
  Uarr: CV,
  uArr: SV,
  Uarrocir: TV,
  Ubrcy: DV,
  ubrcy: RV,
  Ubreve: LV,
  ubreve: NV,
  Ucirc: IV,
  ucirc: MV,
  Ucy: OV,
  ucy: qV,
  udarr: FV,
  Udblac: BV,
  udblac: PV,
  udhar: $V,
  ufisht: UV,
  Ufr: zV,
  ufr: HV,
  Ugrave: VV,
  ugrave: GV,
  uHar: jV,
  uharl: KV,
  uharr: ZV,
  uhblk: WV,
  ulcorn: JV,
  ulcorner: YV,
  ulcrop: XV,
  ultri: QV,
  Umacr: e4,
  umacr: t4,
  uml: n4,
  UnderBar: r4,
  UnderBrace: s4,
  UnderBracket: o4,
  UnderParenthesis: c4,
  Union: i4,
  UnionPlus: a4,
  Uogon: l4,
  uogon: u4,
  Uopf: f4,
  uopf: h4,
  UpArrowBar: p4,
  uparrow: d4,
  UpArrow: g4,
  Uparrow: m4,
  UpArrowDownArrow: _4,
  updownarrow: b4,
  UpDownArrow: v4,
  Updownarrow: y4,
  UpEquilibrium: x4,
  upharpoonleft: E4,
  upharpoonright: k4,
  uplus: w4,
  UpperLeftArrow: A4,
  UpperRightArrow: C4,
  upsi: S4,
  Upsi: T4,
  upsih: D4,
  Upsilon: R4,
  upsilon: L4,
  UpTeeArrow: N4,
  UpTee: I4,
  upuparrows: M4,
  urcorn: O4,
  urcorner: q4,
  urcrop: F4,
  Uring: B4,
  uring: P4,
  urtri: $4,
  Uscr: U4,
  uscr: z4,
  utdot: H4,
  Utilde: V4,
  utilde: G4,
  utri: j4,
  utrif: K4,
  uuarr: Z4,
  Uuml: W4,
  uuml: J4,
  uwangle: Y4,
  vangrt: X4,
  varepsilon: Q4,
  varkappa: e9,
  varnothing: t9,
  varphi: n9,
  varpi: r9,
  varpropto: s9,
  varr: o9,
  vArr: c9,
  varrho: i9,
  varsigma: a9,
  varsubsetneq: l9,
  varsubsetneqq: u9,
  varsupsetneq: f9,
  varsupsetneqq: h9,
  vartheta: p9,
  vartriangleleft: d9,
  vartriangleright: g9,
  vBar: m9,
  Vbar: _9,
  vBarv: b9,
  Vcy: v9,
  vcy: y9,
  vdash: x9,
  vDash: E9,
  Vdash: k9,
  VDash: w9,
  Vdashl: A9,
  veebar: C9,
  vee: S9,
  Vee: T9,
  veeeq: D9,
  vellip: R9,
  verbar: L9,
  Verbar: N9,
  vert: I9,
  Vert: M9,
  VerticalBar: O9,
  VerticalLine: q9,
  VerticalSeparator: F9,
  VerticalTilde: B9,
  VeryThinSpace: P9,
  Vfr: $9,
  vfr: U9,
  vltri: z9,
  vnsub: H9,
  vnsup: V9,
  Vopf: G9,
  vopf: j9,
  vprop: K9,
  vrtri: Z9,
  Vscr: W9,
  vscr: J9,
  vsubnE: Y9,
  vsubne: X9,
  vsupnE: Q9,
  vsupne: e8,
  Vvdash: t8,
  vzigzag: n8,
  Wcirc: r8,
  wcirc: s8,
  wedbar: o8,
  wedge: c8,
  Wedge: i8,
  wedgeq: a8,
  weierp: l8,
  Wfr: u8,
  wfr: f8,
  Wopf: h8,
  wopf: p8,
  wp: d8,
  wr: g8,
  wreath: m8,
  Wscr: _8,
  wscr: b8,
  xcap: v8,
  xcirc: y8,
  xcup: x8,
  xdtri: E8,
  Xfr: k8,
  xfr: w8,
  xharr: A8,
  xhArr: C8,
  Xi: S8,
  xi: T8,
  xlarr: D8,
  xlArr: R8,
  xmap: L8,
  xnis: N8,
  xodot: I8,
  Xopf: M8,
  xopf: O8,
  xoplus: q8,
  xotime: F8,
  xrarr: B8,
  xrArr: P8,
  Xscr: $8,
  xscr: U8,
  xsqcup: z8,
  xuplus: H8,
  xutri: V8,
  xvee: G8,
  xwedge: j8,
  Yacute: K8,
  yacute: Z8,
  YAcy: W8,
  yacy: J8,
  Ycirc: Y8,
  ycirc: X8,
  Ycy: Q8,
  ycy: e5,
  yen: t5,
  Yfr: n5,
  yfr: r5,
  YIcy: s5,
  yicy: o5,
  Yopf: c5,
  yopf: i5,
  Yscr: a5,
  yscr: l5,
  YUcy: u5,
  yucy: f5,
  yuml: h5,
  Yuml: p5,
  Zacute: d5,
  zacute: g5,
  Zcaron: m5,
  zcaron: _5,
  Zcy: b5,
  zcy: v5,
  Zdot: y5,
  zdot: x5,
  zeetrf: E5,
  ZeroWidthSpace: k5,
  Zeta: w5,
  zeta: A5,
  zfr: C5,
  Zfr: S5,
  ZHcy: T5,
  zhcy: D5,
  zigrarr: R5,
  zopf: L5,
  Zopf: N5,
  Zscr: I5,
  zscr: M5,
  zwj: O5,
  zwnj: q5
};
var Ca = F5, ro = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, rn = {}, hc = {};
function B5(t) {
  var e, n, r = hc[t];
  if (r)
    return r;
  for (r = hc[t] = [], e = 0; e < 128; e++)
    n = String.fromCharCode(e), /^[0-9a-z]$/i.test(n) ? r.push(n) : r.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
  for (e = 0; e < t.length; e++)
    r[t.charCodeAt(e)] = t[e];
  return r;
}
function Dr(t, e, n) {
  var r, s, o, c, i, a = "";
  for (typeof e != "string" && (n = e, e = Dr.defaultChars), typeof n > "u" && (n = !0), i = B5(e), r = 0, s = t.length; r < s; r++) {
    if (o = t.charCodeAt(r), n && o === 37 && r + 2 < s && /^[0-9a-f]{2}$/i.test(t.slice(r + 1, r + 3))) {
      a += t.slice(r, r + 3), r += 2;
      continue;
    }
    if (o < 128) {
      a += i[o];
      continue;
    }
    if (o >= 55296 && o <= 57343) {
      if (o >= 55296 && o <= 56319 && r + 1 < s && (c = t.charCodeAt(r + 1), c >= 56320 && c <= 57343)) {
        a += encodeURIComponent(t[r] + t[r + 1]), r++;
        continue;
      }
      a += "%EF%BF%BD";
      continue;
    }
    a += encodeURIComponent(t[r]);
  }
  return a;
}
Dr.defaultChars = ";/?:@&=+$,-_.!~*'()#";
Dr.componentChars = "-_.!~*'()";
var P5 = Dr, pc = {};
function $5(t) {
  var e, n, r = pc[t];
  if (r)
    return r;
  for (r = pc[t] = [], e = 0; e < 128; e++)
    n = String.fromCharCode(e), r.push(n);
  for (e = 0; e < t.length; e++)
    n = t.charCodeAt(e), r[n] = "%" + ("0" + n.toString(16).toUpperCase()).slice(-2);
  return r;
}
function Rr(t, e) {
  var n;
  return typeof e != "string" && (e = Rr.defaultChars), n = $5(e), t.replace(/(%[a-f0-9]{2})+/gi, function(r) {
    var s, o, c, i, a, l, u, f = "";
    for (s = 0, o = r.length; s < o; s += 3) {
      if (c = parseInt(r.slice(s + 1, s + 3), 16), c < 128) {
        f += n[c];
        continue;
      }
      if ((c & 224) === 192 && s + 3 < o && (i = parseInt(r.slice(s + 4, s + 6), 16), (i & 192) === 128)) {
        u = c << 6 & 1984 | i & 63, u < 128 ? f += "��" : f += String.fromCharCode(u), s += 3;
        continue;
      }
      if ((c & 240) === 224 && s + 6 < o && (i = parseInt(r.slice(s + 4, s + 6), 16), a = parseInt(r.slice(s + 7, s + 9), 16), (i & 192) === 128 && (a & 192) === 128)) {
        u = c << 12 & 61440 | i << 6 & 4032 | a & 63, u < 2048 || u >= 55296 && u <= 57343 ? f += "���" : f += String.fromCharCode(u), s += 6;
        continue;
      }
      if ((c & 248) === 240 && s + 9 < o && (i = parseInt(r.slice(s + 4, s + 6), 16), a = parseInt(r.slice(s + 7, s + 9), 16), l = parseInt(r.slice(s + 10, s + 12), 16), (i & 192) === 128 && (a & 192) === 128 && (l & 192) === 128)) {
        u = c << 18 & 1835008 | i << 12 & 258048 | a << 6 & 4032 | l & 63, u < 65536 || u > 1114111 ? f += "����" : (u -= 65536, f += String.fromCharCode(55296 + (u >> 10), 56320 + (u & 1023))), s += 9;
        continue;
      }
      f += "�";
    }
    return f;
  });
}
Rr.defaultChars = ";/?:@&=+$,#";
Rr.componentChars = "";
var U5 = Rr, z5 = function(e) {
  var n = "";
  return n += e.protocol || "", n += e.slashes ? "//" : "", n += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? n += "[" + e.hostname + "]" : n += e.hostname || "", n += e.port ? ":" + e.port : "", n += e.pathname || "", n += e.search || "", n += e.hash || "", n;
};
function fr() {
  this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
var H5 = /^([a-z0-9.+-]+:)/i, V5 = /:[0-9]*$/, G5 = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, j5 = ["<", ">", '"', "`", " ", "\r", `
`, "	"], K5 = ["{", "}", "|", "\\", "^", "`"].concat(j5), Z5 = ["'"].concat(K5), dc = ["%", "/", "?", ";", "#"].concat(Z5), gc = ["/", "?", "#"], W5 = 255, mc = /^[+a-z0-9A-Z_-]{0,63}$/, J5 = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, _c = {
  javascript: !0,
  "javascript:": !0
}, bc = {
  http: !0,
  https: !0,
  ftp: !0,
  gopher: !0,
  file: !0,
  "http:": !0,
  "https:": !0,
  "ftp:": !0,
  "gopher:": !0,
  "file:": !0
};
function Y5(t, e) {
  if (t && t instanceof fr)
    return t;
  var n = new fr();
  return n.parse(t, e), n;
}
fr.prototype.parse = function(t, e) {
  var n, r, s, o, c, i = t;
  if (i = i.trim(), !e && t.split("#").length === 1) {
    var a = G5.exec(i);
    if (a)
      return this.pathname = a[1], a[2] && (this.search = a[2]), this;
  }
  var l = H5.exec(i);
  if (l && (l = l[0], s = l.toLowerCase(), this.protocol = l, i = i.substr(l.length)), (e || l || i.match(/^\/\/[^@\/]+@[^@\/]+/)) && (c = i.substr(0, 2) === "//", c && !(l && _c[l]) && (i = i.substr(2), this.slashes = !0)), !_c[l] && (c || l && !bc[l])) {
    var u = -1;
    for (n = 0; n < gc.length; n++)
      o = i.indexOf(gc[n]), o !== -1 && (u === -1 || o < u) && (u = o);
    var f, h;
    for (u === -1 ? h = i.lastIndexOf("@") : h = i.lastIndexOf("@", u), h !== -1 && (f = i.slice(0, h), i = i.slice(h + 1), this.auth = f), u = -1, n = 0; n < dc.length; n++)
      o = i.indexOf(dc[n]), o !== -1 && (u === -1 || o < u) && (u = o);
    u === -1 && (u = i.length), i[u - 1] === ":" && u--;
    var d = i.slice(0, u);
    i = i.slice(u), this.parseHost(d), this.hostname = this.hostname || "";
    var m = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!m) {
      var _ = this.hostname.split(/\./);
      for (n = 0, r = _.length; n < r; n++) {
        var R = _[n];
        if (R && !R.match(mc)) {
          for (var T = "", D = 0, I = R.length; D < I; D++)
            R.charCodeAt(D) > 127 ? T += "x" : T += R[D];
          if (!T.match(mc)) {
            var B = _.slice(0, n), P = _.slice(n + 1), y = R.match(J5);
            y && (B.push(y[1]), P.unshift(y[2])), P.length && (i = P.join(".") + i), this.hostname = B.join(".");
            break;
          }
        }
      }
    }
    this.hostname.length > W5 && (this.hostname = ""), m && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
  }
  var W = i.indexOf("#");
  W !== -1 && (this.hash = i.substr(W), i = i.slice(0, W));
  var $ = i.indexOf("?");
  return $ !== -1 && (this.search = i.substr($), i = i.slice(0, $)), i && (this.pathname = i), bc[s] && this.hostname && !this.pathname && (this.pathname = ""), this;
};
fr.prototype.parseHost = function(t) {
  var e = V5.exec(t);
  e && (e = e[0], e !== ":" && (this.port = e.substr(1)), t = t.substr(0, t.length - e.length)), t && (this.hostname = t);
};
var X5 = Y5;
rn.encode = P5;
rn.decode = U5;
rn.format = z5;
rn.parse = X5;
var St = {}, Yr, vc;
function Sa() {
  return vc || (vc = 1, Yr = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/), Yr;
}
var Xr, yc;
function Ta() {
  return yc || (yc = 1, Xr = /[\0-\x1F\x7F-\x9F]/), Xr;
}
var Qr, xc;
function Q5() {
  return xc || (xc = 1, Qr = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/), Qr;
}
var es, Ec;
function Da() {
  return Ec || (Ec = 1, es = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/), es;
}
var kc;
function eG() {
  return kc || (kc = 1, St.Any = Sa(), St.Cc = Ta(), St.Cf = Q5(), St.P = ro, St.Z = Da()), St;
}
(function(t) {
  function e(A) {
    return Object.prototype.toString.call(A);
  }
  function n(A) {
    return e(A) === "[object String]";
  }
  var r = Object.prototype.hasOwnProperty;
  function s(A, K) {
    return r.call(A, K);
  }
  function o(A) {
    var K = Array.prototype.slice.call(arguments, 1);
    return K.forEach(function(F) {
      if (F) {
        if (typeof F != "object")
          throw new TypeError(F + "must be object");
        Object.keys(F).forEach(function(v) {
          A[v] = F[v];
        });
      }
    }), A;
  }
  function c(A, K, F) {
    return [].concat(A.slice(0, K), F, A.slice(K + 1));
  }
  function i(A) {
    return !(A >= 55296 && A <= 57343 || A >= 64976 && A <= 65007 || (A & 65535) === 65535 || (A & 65535) === 65534 || A >= 0 && A <= 8 || A === 11 || A >= 14 && A <= 31 || A >= 127 && A <= 159 || A > 1114111);
  }
  function a(A) {
    if (A > 65535) {
      A -= 65536;
      var K = 55296 + (A >> 10), F = 56320 + (A & 1023);
      return String.fromCharCode(K, F);
    }
    return String.fromCharCode(A);
  }
  var l = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g, u = /&([a-z#][a-z0-9]{1,31});/gi, f = new RegExp(l.source + "|" + u.source, "gi"), h = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i, d = Ca;
  function m(A, K) {
    var F;
    return s(d, K) ? d[K] : K.charCodeAt(0) === 35 && h.test(K) && (F = K[1].toLowerCase() === "x" ? parseInt(K.slice(2), 16) : parseInt(K.slice(1), 10), i(F)) ? a(F) : A;
  }
  function _(A) {
    return A.indexOf("\\") < 0 ? A : A.replace(l, "$1");
  }
  function R(A) {
    return A.indexOf("\\") < 0 && A.indexOf("&") < 0 ? A : A.replace(f, function(K, F, v) {
      return F || m(K, v);
    });
  }
  var T = /[&<>"]/, D = /[&<>"]/g, I = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  };
  function B(A) {
    return I[A];
  }
  function P(A) {
    return T.test(A) ? A.replace(D, B) : A;
  }
  var y = /[.?*+^$[\]\\(){}|-]/g;
  function W(A) {
    return A.replace(y, "\\$&");
  }
  function $(A) {
    switch (A) {
      case 9:
      case 32:
        return !0;
    }
    return !1;
  }
  function Q(A) {
    if (A >= 8192 && A <= 8202)
      return !0;
    switch (A) {
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 32:
      case 160:
      case 5760:
      case 8239:
      case 8287:
      case 12288:
        return !0;
    }
    return !1;
  }
  var z = ro;
  function oe(A) {
    return z.test(A);
  }
  function L(A) {
    switch (A) {
      case 33:
      case 34:
      case 35:
      case 36:
      case 37:
      case 38:
      case 39:
      case 40:
      case 41:
      case 42:
      case 43:
      case 44:
      case 45:
      case 46:
      case 47:
      case 58:
      case 59:
      case 60:
      case 61:
      case 62:
      case 63:
      case 64:
      case 91:
      case 92:
      case 93:
      case 94:
      case 95:
      case 96:
      case 123:
      case 124:
      case 125:
      case 126:
        return !0;
      default:
        return !1;
    }
  }
  function ee(A) {
    return A = A.trim().replace(/\s+/g, " "), "ẞ".toLowerCase() === "Ṿ" && (A = A.replace(/ẞ/g, "ß")), A.toLowerCase().toUpperCase();
  }
  t.lib = {}, t.lib.mdurl = rn, t.lib.ucmicro = eG(), t.assign = o, t.isString = n, t.has = s, t.unescapeMd = _, t.unescapeAll = R, t.isValidEntityCode = i, t.fromCodePoint = a, t.escapeHtml = P, t.arrayReplaceAt = c, t.isSpace = $, t.isWhiteSpace = Q, t.isMdAsciiPunct = L, t.isPunctChar = oe, t.escapeRE = W, t.normalizeReference = ee;
})(le);
var Lr = {}, tG = function(e, n, r) {
  var s, o, c, i, a = -1, l = e.posMax, u = e.pos;
  for (e.pos = n + 1, s = 1; e.pos < l; ) {
    if (c = e.src.charCodeAt(e.pos), c === 93 && (s--, s === 0)) {
      o = !0;
      break;
    }
    if (i = e.pos, e.md.inline.skipToken(e), c === 91) {
      if (i === e.pos - 1)
        s++;
      else if (r)
        return e.pos = u, -1;
    }
  }
  return o && (a = e.pos), e.pos = u, a;
}, wc = le.unescapeAll, nG = function(e, n, r) {
  var s, o, c = n, i = {
    ok: !1,
    pos: 0,
    lines: 0,
    str: ""
  };
  if (e.charCodeAt(c) === 60) {
    for (c++; c < r; ) {
      if (s = e.charCodeAt(c), s === 10 || s === 60)
        return i;
      if (s === 62)
        return i.pos = c + 1, i.str = wc(e.slice(n + 1, c)), i.ok = !0, i;
      if (s === 92 && c + 1 < r) {
        c += 2;
        continue;
      }
      c++;
    }
    return i;
  }
  for (o = 0; c < r && (s = e.charCodeAt(c), !(s === 32 || s < 32 || s === 127)); ) {
    if (s === 92 && c + 1 < r) {
      if (e.charCodeAt(c + 1) === 32)
        break;
      c += 2;
      continue;
    }
    if (s === 40 && (o++, o > 32))
      return i;
    if (s === 41) {
      if (o === 0)
        break;
      o--;
    }
    c++;
  }
  return n === c || o !== 0 || (i.str = wc(e.slice(n, c)), i.pos = c, i.ok = !0), i;
}, rG = le.unescapeAll, sG = function(e, n, r) {
  var s, o, c = 0, i = n, a = {
    ok: !1,
    pos: 0,
    lines: 0,
    str: ""
  };
  if (i >= r || (o = e.charCodeAt(i), o !== 34 && o !== 39 && o !== 40))
    return a;
  for (i++, o === 40 && (o = 41); i < r; ) {
    if (s = e.charCodeAt(i), s === o)
      return a.pos = i + 1, a.lines = c, a.str = rG(e.slice(n + 1, i)), a.ok = !0, a;
    if (s === 40 && o === 41)
      return a;
    s === 10 ? c++ : s === 92 && i + 1 < r && (i++, e.charCodeAt(i) === 10 && c++), i++;
  }
  return a;
};
Lr.parseLinkLabel = tG;
Lr.parseLinkDestination = nG;
Lr.parseLinkTitle = sG;
var oG = le.assign, cG = le.unescapeAll, qt = le.escapeHtml, et = {};
et.code_inline = function(t, e, n, r, s) {
  var o = t[e];
  return "<code" + s.renderAttrs(o) + ">" + qt(o.content) + "</code>";
};
et.code_block = function(t, e, n, r, s) {
  var o = t[e];
  return "<pre" + s.renderAttrs(o) + "><code>" + qt(t[e].content) + `</code></pre>
`;
};
et.fence = function(t, e, n, r, s) {
  var o = t[e], c = o.info ? cG(o.info).trim() : "", i = "", a = "", l, u, f, h, d;
  return c && (f = c.split(/(\s+)/g), i = f[0], a = f.slice(2).join("")), n.highlight ? l = n.highlight(o.content, i, a) || qt(o.content) : l = qt(o.content), l.indexOf("<pre") === 0 ? l + `
` : c ? (u = o.attrIndex("class"), h = o.attrs ? o.attrs.slice() : [], u < 0 ? h.push(["class", n.langPrefix + i]) : (h[u] = h[u].slice(), h[u][1] += " " + n.langPrefix + i), d = {
    attrs: h
  }, "<pre><code" + s.renderAttrs(d) + ">" + l + `</code></pre>
`) : "<pre><code" + s.renderAttrs(o) + ">" + l + `</code></pre>
`;
};
et.image = function(t, e, n, r, s) {
  var o = t[e];
  return o.attrs[o.attrIndex("alt")][1] = s.renderInlineAsText(o.children, n, r), s.renderToken(t, e, n);
};
et.hardbreak = function(t, e, n) {
  return n.xhtmlOut ? `<br />
` : `<br>
`;
};
et.softbreak = function(t, e, n) {
  return n.breaks ? n.xhtmlOut ? `<br />
` : `<br>
` : `
`;
};
et.text = function(t, e) {
  return qt(t[e].content);
};
et.html_block = function(t, e) {
  return t[e].content;
};
et.html_inline = function(t, e) {
  return t[e].content;
};
function sn() {
  this.rules = oG({}, et);
}
sn.prototype.renderAttrs = function(e) {
  var n, r, s;
  if (!e.attrs)
    return "";
  for (s = "", n = 0, r = e.attrs.length; n < r; n++)
    s += " " + qt(e.attrs[n][0]) + '="' + qt(e.attrs[n][1]) + '"';
  return s;
};
sn.prototype.renderToken = function(e, n, r) {
  var s, o = "", c = !1, i = e[n];
  return i.hidden ? "" : (i.block && i.nesting !== -1 && n && e[n - 1].hidden && (o += `
`), o += (i.nesting === -1 ? "</" : "<") + i.tag, o += this.renderAttrs(i), i.nesting === 0 && r.xhtmlOut && (o += " /"), i.block && (c = !0, i.nesting === 1 && n + 1 < e.length && (s = e[n + 1], (s.type === "inline" || s.hidden || s.nesting === -1 && s.tag === i.tag) && (c = !1))), o += c ? `>
` : ">", o);
};
sn.prototype.renderInline = function(t, e, n) {
  for (var r, s = "", o = this.rules, c = 0, i = t.length; c < i; c++)
    r = t[c].type, typeof o[r] < "u" ? s += o[r](t, c, e, n, this) : s += this.renderToken(t, c, e);
  return s;
};
sn.prototype.renderInlineAsText = function(t, e, n) {
  for (var r = "", s = 0, o = t.length; s < o; s++)
    t[s].type === "text" ? r += t[s].content : t[s].type === "image" ? r += this.renderInlineAsText(t[s].children, e, n) : t[s].type === "softbreak" && (r += `
`);
  return r;
};
sn.prototype.render = function(t, e, n) {
  var r, s, o, c = "", i = this.rules;
  for (r = 0, s = t.length; r < s; r++)
    o = t[r].type, o === "inline" ? c += this.renderInline(t[r].children, e, n) : typeof i[o] < "u" ? c += i[o](t, r, e, n, this) : c += this.renderToken(t, r, e, n);
  return c;
};
var iG = sn;
function je() {
  this.__rules__ = [], this.__cache__ = null;
}
je.prototype.__find__ = function(t) {
  for (var e = 0; e < this.__rules__.length; e++)
    if (this.__rules__[e].name === t)
      return e;
  return -1;
};
je.prototype.__compile__ = function() {
  var t = this, e = [""];
  t.__rules__.forEach(function(n) {
    n.enabled && n.alt.forEach(function(r) {
      e.indexOf(r) < 0 && e.push(r);
    });
  }), t.__cache__ = {}, e.forEach(function(n) {
    t.__cache__[n] = [], t.__rules__.forEach(function(r) {
      r.enabled && (n && r.alt.indexOf(n) < 0 || t.__cache__[n].push(r.fn));
    });
  });
};
je.prototype.at = function(t, e, n) {
  var r = this.__find__(t), s = n || {};
  if (r === -1)
    throw new Error("Parser rule not found: " + t);
  this.__rules__[r].fn = e, this.__rules__[r].alt = s.alt || [], this.__cache__ = null;
};
je.prototype.before = function(t, e, n, r) {
  var s = this.__find__(t), o = r || {};
  if (s === -1)
    throw new Error("Parser rule not found: " + t);
  this.__rules__.splice(s, 0, {
    name: e,
    enabled: !0,
    fn: n,
    alt: o.alt || []
  }), this.__cache__ = null;
};
je.prototype.after = function(t, e, n, r) {
  var s = this.__find__(t), o = r || {};
  if (s === -1)
    throw new Error("Parser rule not found: " + t);
  this.__rules__.splice(s + 1, 0, {
    name: e,
    enabled: !0,
    fn: n,
    alt: o.alt || []
  }), this.__cache__ = null;
};
je.prototype.push = function(t, e, n) {
  var r = n || {};
  this.__rules__.push({
    name: t,
    enabled: !0,
    fn: e,
    alt: r.alt || []
  }), this.__cache__ = null;
};
je.prototype.enable = function(t, e) {
  Array.isArray(t) || (t = [t]);
  var n = [];
  return t.forEach(function(r) {
    var s = this.__find__(r);
    if (s < 0) {
      if (e)
        return;
      throw new Error("Rules manager: invalid rule name " + r);
    }
    this.__rules__[s].enabled = !0, n.push(r);
  }, this), this.__cache__ = null, n;
};
je.prototype.enableOnly = function(t, e) {
  Array.isArray(t) || (t = [t]), this.__rules__.forEach(function(n) {
    n.enabled = !1;
  }), this.enable(t, e);
};
je.prototype.disable = function(t, e) {
  Array.isArray(t) || (t = [t]);
  var n = [];
  return t.forEach(function(r) {
    var s = this.__find__(r);
    if (s < 0) {
      if (e)
        return;
      throw new Error("Rules manager: invalid rule name " + r);
    }
    this.__rules__[s].enabled = !1, n.push(r);
  }, this), this.__cache__ = null, n;
};
je.prototype.getRules = function(t) {
  return this.__cache__ === null && this.__compile__(), this.__cache__[t] || [];
};
var so = je, aG = /\r\n?|\n/g, lG = /\0/g, uG = function(e) {
  var n;
  n = e.src.replace(aG, `
`), n = n.replace(lG, "�"), e.src = n;
}, fG = function(e) {
  var n;
  e.inlineMode ? (n = new e.Token("inline", "", 0), n.content = e.src, n.map = [0, 1], n.children = [], e.tokens.push(n)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}, hG = function(e) {
  var n = e.tokens, r, s, o;
  for (s = 0, o = n.length; s < o; s++)
    r = n[s], r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
}, pG = le.arrayReplaceAt;
function dG(t) {
  return /^<a[>\s]/i.test(t);
}
function gG(t) {
  return /^<\/a\s*>/i.test(t);
}
var mG = function(e) {
  var n, r, s, o, c, i, a, l, u, f, h, d, m, _, R, T, D = e.tokens, I;
  if (e.md.options.linkify) {
    for (r = 0, s = D.length; r < s; r++)
      if (!(D[r].type !== "inline" || !e.md.linkify.pretest(D[r].content)))
        for (o = D[r].children, m = 0, n = o.length - 1; n >= 0; n--) {
          if (i = o[n], i.type === "link_close") {
            for (n--; o[n].level !== i.level && o[n].type !== "link_open"; )
              n--;
            continue;
          }
          if (i.type === "html_inline" && (dG(i.content) && m > 0 && m--, gG(i.content) && m++), !(m > 0) && i.type === "text" && e.md.linkify.test(i.content)) {
            for (u = i.content, I = e.md.linkify.match(u), a = [], d = i.level, h = 0, I.length > 0 && I[0].index === 0 && n > 0 && o[n - 1].type === "text_special" && (I = I.slice(1)), l = 0; l < I.length; l++)
              _ = I[l].url, R = e.md.normalizeLink(_), e.md.validateLink(R) && (T = I[l].text, I[l].schema ? I[l].schema === "mailto:" && !/^mailto:/i.test(T) ? T = e.md.normalizeLinkText("mailto:" + T).replace(/^mailto:/, "") : T = e.md.normalizeLinkText(T) : T = e.md.normalizeLinkText("http://" + T).replace(/^http:\/\//, ""), f = I[l].index, f > h && (c = new e.Token("text", "", 0), c.content = u.slice(h, f), c.level = d, a.push(c)), c = new e.Token("link_open", "a", 1), c.attrs = [["href", R]], c.level = d++, c.markup = "linkify", c.info = "auto", a.push(c), c = new e.Token("text", "", 0), c.content = T, c.level = d, a.push(c), c = new e.Token("link_close", "a", -1), c.level = --d, c.markup = "linkify", c.info = "auto", a.push(c), h = I[l].lastIndex);
            h < u.length && (c = new e.Token("text", "", 0), c.content = u.slice(h), c.level = d, a.push(c)), D[r].children = o = pG(o, n, a);
          }
        }
  }
}, Ra = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, _G = /\((c|tm|r)\)/i, bG = /\((c|tm|r)\)/ig, vG = {
  c: "©",
  r: "®",
  tm: "™"
};
function yG(t, e) {
  return vG[e.toLowerCase()];
}
function xG(t) {
  var e, n, r = 0;
  for (e = t.length - 1; e >= 0; e--)
    n = t[e], n.type === "text" && !r && (n.content = n.content.replace(bG, yG)), n.type === "link_open" && n.info === "auto" && r--, n.type === "link_close" && n.info === "auto" && r++;
}
function EG(t) {
  var e, n, r = 0;
  for (e = t.length - 1; e >= 0; e--)
    n = t[e], n.type === "text" && !r && Ra.test(n.content) && (n.content = n.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1—").replace(/(^|\s)--(?=\s|$)/mg, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1–")), n.type === "link_open" && n.info === "auto" && r--, n.type === "link_close" && n.info === "auto" && r++;
}
var kG = function(e) {
  var n;
  if (e.md.options.typographer)
    for (n = e.tokens.length - 1; n >= 0; n--)
      e.tokens[n].type === "inline" && (_G.test(e.tokens[n].content) && xG(e.tokens[n].children), Ra.test(e.tokens[n].content) && EG(e.tokens[n].children));
}, Ac = le.isWhiteSpace, Cc = le.isPunctChar, Sc = le.isMdAsciiPunct, wG = /['"]/, Tc = /['"]/g, Dc = "’";
function Gn(t, e, n) {
  return t.slice(0, e) + n + t.slice(e + 1);
}
function AG(t, e) {
  var n, r, s, o, c, i, a, l, u, f, h, d, m, _, R, T, D, I, B, P, y;
  for (B = [], n = 0; n < t.length; n++) {
    for (r = t[n], a = t[n].level, D = B.length - 1; D >= 0 && !(B[D].level <= a); D--)
      ;
    if (B.length = D + 1, r.type === "text") {
      s = r.content, c = 0, i = s.length;
      e:
        for (; c < i && (Tc.lastIndex = c, o = Tc.exec(s), !!o); ) {
          if (R = T = !0, c = o.index + 1, I = o[0] === "'", u = 32, o.index - 1 >= 0)
            u = s.charCodeAt(o.index - 1);
          else
            for (D = n - 1; D >= 0 && !(t[D].type === "softbreak" || t[D].type === "hardbreak"); D--)
              if (t[D].content) {
                u = t[D].content.charCodeAt(t[D].content.length - 1);
                break;
              }
          if (f = 32, c < i)
            f = s.charCodeAt(c);
          else
            for (D = n + 1; D < t.length && !(t[D].type === "softbreak" || t[D].type === "hardbreak"); D++)
              if (t[D].content) {
                f = t[D].content.charCodeAt(0);
                break;
              }
          if (h = Sc(u) || Cc(String.fromCharCode(u)), d = Sc(f) || Cc(String.fromCharCode(f)), m = Ac(u), _ = Ac(f), _ ? R = !1 : d && (m || h || (R = !1)), m ? T = !1 : h && (_ || d || (T = !1)), f === 34 && o[0] === '"' && u >= 48 && u <= 57 && (T = R = !1), R && T && (R = h, T = d), !R && !T) {
            I && (r.content = Gn(r.content, o.index, Dc));
            continue;
          }
          if (T) {
            for (D = B.length - 1; D >= 0 && (l = B[D], !(B[D].level < a)); D--)
              if (l.single === I && B[D].level === a) {
                l = B[D], I ? (P = e.md.options.quotes[2], y = e.md.options.quotes[3]) : (P = e.md.options.quotes[0], y = e.md.options.quotes[1]), r.content = Gn(r.content, o.index, y), t[l.token].content = Gn(
                  t[l.token].content,
                  l.pos,
                  P
                ), c += y.length - 1, l.token === n && (c += P.length - 1), s = r.content, i = s.length, B.length = D;
                continue e;
              }
          }
          R ? B.push({
            token: n,
            pos: o.index,
            single: I,
            level: a
          }) : T && I && (r.content = Gn(r.content, o.index, Dc));
        }
    }
  }
}
var CG = function(e) {
  var n;
  if (e.md.options.typographer)
    for (n = e.tokens.length - 1; n >= 0; n--)
      e.tokens[n].type !== "inline" || !wG.test(e.tokens[n].content) || AG(e.tokens[n].children, e);
}, SG = function(e) {
  var n, r, s, o, c, i, a = e.tokens;
  for (n = 0, r = a.length; n < r; n++)
    if (a[n].type === "inline") {
      for (s = a[n].children, c = s.length, o = 0; o < c; o++)
        s[o].type === "text_special" && (s[o].type = "text");
      for (o = i = 0; o < c; o++)
        s[o].type === "text" && o + 1 < c && s[o + 1].type === "text" ? s[o + 1].content = s[o].content + s[o + 1].content : (o !== i && (s[i] = s[o]), i++);
      o !== i && (s.length = i);
    }
};
function on(t, e, n) {
  this.type = t, this.tag = e, this.attrs = null, this.map = null, this.nesting = n, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
}
on.prototype.attrIndex = function(e) {
  var n, r, s;
  if (!this.attrs)
    return -1;
  for (n = this.attrs, r = 0, s = n.length; r < s; r++)
    if (n[r][0] === e)
      return r;
  return -1;
};
on.prototype.attrPush = function(e) {
  this.attrs ? this.attrs.push(e) : this.attrs = [e];
};
on.prototype.attrSet = function(e, n) {
  var r = this.attrIndex(e), s = [e, n];
  r < 0 ? this.attrPush(s) : this.attrs[r] = s;
};
on.prototype.attrGet = function(e) {
  var n = this.attrIndex(e), r = null;
  return n >= 0 && (r = this.attrs[n][1]), r;
};
on.prototype.attrJoin = function(e, n) {
  var r = this.attrIndex(e);
  r < 0 ? this.attrPush([e, n]) : this.attrs[r][1] = this.attrs[r][1] + " " + n;
};
var oo = on, TG = oo;
function La(t, e, n) {
  this.src = t, this.env = n, this.tokens = [], this.inlineMode = !1, this.md = e;
}
La.prototype.Token = TG;
var DG = La, RG = so, ts = [
  ["normalize", uG],
  ["block", fG],
  ["inline", hG],
  ["linkify", mG],
  ["replacements", kG],
  ["smartquotes", CG],
  // `text_join` finds `text_special` tokens (for escape sequences)
  // and joins them with the rest of the text
  ["text_join", SG]
];
function co() {
  this.ruler = new RG();
  for (var t = 0; t < ts.length; t++)
    this.ruler.push(ts[t][0], ts[t][1]);
}
co.prototype.process = function(t) {
  var e, n, r;
  for (r = this.ruler.getRules(""), e = 0, n = r.length; e < n; e++)
    r[e](t);
};
co.prototype.State = DG;
var LG = co, ns = le.isSpace;
function rs(t, e) {
  var n = t.bMarks[e] + t.tShift[e], r = t.eMarks[e];
  return t.src.slice(n, r);
}
function Rc(t) {
  var e = [], n = 0, r = t.length, s, o = !1, c = 0, i = "";
  for (s = t.charCodeAt(n); n < r; )
    s === 124 && (o ? (i += t.substring(c, n - 1), c = n) : (e.push(i + t.substring(c, n)), i = "", c = n + 1)), o = s === 92, n++, s = t.charCodeAt(n);
  return e.push(i + t.substring(c)), e;
}
var NG = function(e, n, r, s) {
  var o, c, i, a, l, u, f, h, d, m, _, R, T, D, I, B, P, y;
  if (n + 2 > r || (u = n + 1, e.sCount[u] < e.blkIndent) || e.sCount[u] - e.blkIndent >= 4 || (i = e.bMarks[u] + e.tShift[u], i >= e.eMarks[u]) || (P = e.src.charCodeAt(i++), P !== 124 && P !== 45 && P !== 58) || i >= e.eMarks[u] || (y = e.src.charCodeAt(i++), y !== 124 && y !== 45 && y !== 58 && !ns(y)) || P === 45 && ns(y))
    return !1;
  for (; i < e.eMarks[u]; ) {
    if (o = e.src.charCodeAt(i), o !== 124 && o !== 45 && o !== 58 && !ns(o))
      return !1;
    i++;
  }
  for (c = rs(e, n + 1), f = c.split("|"), m = [], a = 0; a < f.length; a++) {
    if (_ = f[a].trim(), !_) {
      if (a === 0 || a === f.length - 1)
        continue;
      return !1;
    }
    if (!/^:?-+:?$/.test(_))
      return !1;
    _.charCodeAt(_.length - 1) === 58 ? m.push(_.charCodeAt(0) === 58 ? "center" : "right") : _.charCodeAt(0) === 58 ? m.push("left") : m.push("");
  }
  if (c = rs(e, n).trim(), c.indexOf("|") === -1 || e.sCount[n] - e.blkIndent >= 4 || (f = Rc(c), f.length && f[0] === "" && f.shift(), f.length && f[f.length - 1] === "" && f.pop(), h = f.length, h === 0 || h !== m.length))
    return !1;
  if (s)
    return !0;
  for (D = e.parentType, e.parentType = "table", B = e.md.block.ruler.getRules("blockquote"), d = e.push("table_open", "table", 1), d.map = R = [n, 0], d = e.push("thead_open", "thead", 1), d.map = [n, n + 1], d = e.push("tr_open", "tr", 1), d.map = [n, n + 1], a = 0; a < f.length; a++)
    d = e.push("th_open", "th", 1), m[a] && (d.attrs = [["style", "text-align:" + m[a]]]), d = e.push("inline", "", 0), d.content = f[a].trim(), d.children = [], d = e.push("th_close", "th", -1);
  for (d = e.push("tr_close", "tr", -1), d = e.push("thead_close", "thead", -1), u = n + 2; u < r && !(e.sCount[u] < e.blkIndent); u++) {
    for (I = !1, a = 0, l = B.length; a < l; a++)
      if (B[a](e, u, r, !0)) {
        I = !0;
        break;
      }
    if (I || (c = rs(e, u).trim(), !c) || e.sCount[u] - e.blkIndent >= 4)
      break;
    for (f = Rc(c), f.length && f[0] === "" && f.shift(), f.length && f[f.length - 1] === "" && f.pop(), u === n + 2 && (d = e.push("tbody_open", "tbody", 1), d.map = T = [n + 2, 0]), d = e.push("tr_open", "tr", 1), d.map = [u, u + 1], a = 0; a < h; a++)
      d = e.push("td_open", "td", 1), m[a] && (d.attrs = [["style", "text-align:" + m[a]]]), d = e.push("inline", "", 0), d.content = f[a] ? f[a].trim() : "", d.children = [], d = e.push("td_close", "td", -1);
    d = e.push("tr_close", "tr", -1);
  }
  return T && (d = e.push("tbody_close", "tbody", -1), T[1] = u), d = e.push("table_close", "table", -1), R[1] = u, e.parentType = D, e.line = u, !0;
}, IG = function(e, n, r) {
  var s, o, c;
  if (e.sCount[n] - e.blkIndent < 4)
    return !1;
  for (o = s = n + 1; s < r; ) {
    if (e.isEmpty(s)) {
      s++;
      continue;
    }
    if (e.sCount[s] - e.blkIndent >= 4) {
      s++, o = s;
      continue;
    }
    break;
  }
  return e.line = o, c = e.push("code_block", "code", 0), c.content = e.getLines(n, o, 4 + e.blkIndent, !1) + `
`, c.map = [n, e.line], !0;
}, MG = function(e, n, r, s) {
  var o, c, i, a, l, u, f, h = !1, d = e.bMarks[n] + e.tShift[n], m = e.eMarks[n];
  if (e.sCount[n] - e.blkIndent >= 4 || d + 3 > m || (o = e.src.charCodeAt(d), o !== 126 && o !== 96) || (l = d, d = e.skipChars(d, o), c = d - l, c < 3) || (f = e.src.slice(l, d), i = e.src.slice(d, m), o === 96 && i.indexOf(String.fromCharCode(o)) >= 0))
    return !1;
  if (s)
    return !0;
  for (a = n; a++, !(a >= r || (d = l = e.bMarks[a] + e.tShift[a], m = e.eMarks[a], d < m && e.sCount[a] < e.blkIndent)); )
    if (e.src.charCodeAt(d) === o && !(e.sCount[a] - e.blkIndent >= 4) && (d = e.skipChars(d, o), !(d - l < c) && (d = e.skipSpaces(d), !(d < m)))) {
      h = !0;
      break;
    }
  return c = e.sCount[n], e.line = a + (h ? 1 : 0), u = e.push("fence", "code", 0), u.info = i, u.content = e.getLines(n + 1, a, c, !0), u.markup = f, u.map = [n, e.line], !0;
}, OG = le.isSpace, qG = function(e, n, r, s) {
  var o, c, i, a, l, u, f, h, d, m, _, R, T, D, I, B, P, y, W, $, Q = e.lineMax, z = e.bMarks[n] + e.tShift[n], oe = e.eMarks[n];
  if (e.sCount[n] - e.blkIndent >= 4 || e.src.charCodeAt(z) !== 62)
    return !1;
  if (s)
    return !0;
  for (m = [], _ = [], D = [], I = [], y = e.md.block.ruler.getRules("blockquote"), T = e.parentType, e.parentType = "blockquote", h = n; h < r && ($ = e.sCount[h] < e.blkIndent, z = e.bMarks[h] + e.tShift[h], oe = e.eMarks[h], !(z >= oe)); h++) {
    if (e.src.charCodeAt(z++) === 62 && !$) {
      for (a = e.sCount[h] + 1, e.src.charCodeAt(z) === 32 ? (z++, a++, o = !1, B = !0) : e.src.charCodeAt(z) === 9 ? (B = !0, (e.bsCount[h] + a) % 4 === 3 ? (z++, a++, o = !1) : o = !0) : B = !1, d = a, m.push(e.bMarks[h]), e.bMarks[h] = z; z < oe && (c = e.src.charCodeAt(z), OG(c)); ) {
        c === 9 ? d += 4 - (d + e.bsCount[h] + (o ? 1 : 0)) % 4 : d++;
        z++;
      }
      u = z >= oe, _.push(e.bsCount[h]), e.bsCount[h] = e.sCount[h] + 1 + (B ? 1 : 0), D.push(e.sCount[h]), e.sCount[h] = d - a, I.push(e.tShift[h]), e.tShift[h] = z - e.bMarks[h];
      continue;
    }
    if (u)
      break;
    for (P = !1, i = 0, l = y.length; i < l; i++)
      if (y[i](e, h, r, !0)) {
        P = !0;
        break;
      }
    if (P) {
      e.lineMax = h, e.blkIndent !== 0 && (m.push(e.bMarks[h]), _.push(e.bsCount[h]), I.push(e.tShift[h]), D.push(e.sCount[h]), e.sCount[h] -= e.blkIndent);
      break;
    }
    m.push(e.bMarks[h]), _.push(e.bsCount[h]), I.push(e.tShift[h]), D.push(e.sCount[h]), e.sCount[h] = -1;
  }
  for (R = e.blkIndent, e.blkIndent = 0, W = e.push("blockquote_open", "blockquote", 1), W.markup = ">", W.map = f = [n, 0], e.md.block.tokenize(e, n, h), W = e.push("blockquote_close", "blockquote", -1), W.markup = ">", e.lineMax = Q, e.parentType = T, f[1] = e.line, i = 0; i < I.length; i++)
    e.bMarks[i + n] = m[i], e.tShift[i + n] = I[i], e.sCount[i + n] = D[i], e.bsCount[i + n] = _[i];
  return e.blkIndent = R, !0;
}, FG = le.isSpace, BG = function(e, n, r, s) {
  var o, c, i, a, l = e.bMarks[n] + e.tShift[n], u = e.eMarks[n];
  if (e.sCount[n] - e.blkIndent >= 4 || (o = e.src.charCodeAt(l++), o !== 42 && o !== 45 && o !== 95))
    return !1;
  for (c = 1; l < u; ) {
    if (i = e.src.charCodeAt(l++), i !== o && !FG(i))
      return !1;
    i === o && c++;
  }
  return c < 3 ? !1 : (s || (e.line = n + 1, a = e.push("hr", "hr", 0), a.map = [n, e.line], a.markup = Array(c + 1).join(String.fromCharCode(o))), !0);
}, Na = le.isSpace;
function Lc(t, e) {
  var n, r, s, o;
  return r = t.bMarks[e] + t.tShift[e], s = t.eMarks[e], n = t.src.charCodeAt(r++), n !== 42 && n !== 45 && n !== 43 || r < s && (o = t.src.charCodeAt(r), !Na(o)) ? -1 : r;
}
function Nc(t, e) {
  var n, r = t.bMarks[e] + t.tShift[e], s = r, o = t.eMarks[e];
  if (s + 1 >= o || (n = t.src.charCodeAt(s++), n < 48 || n > 57))
    return -1;
  for (; ; ) {
    if (s >= o)
      return -1;
    if (n = t.src.charCodeAt(s++), n >= 48 && n <= 57) {
      if (s - r >= 10)
        return -1;
      continue;
    }
    if (n === 41 || n === 46)
      break;
    return -1;
  }
  return s < o && (n = t.src.charCodeAt(s), !Na(n)) ? -1 : s;
}
function PG(t, e) {
  var n, r, s = t.level + 2;
  for (n = e + 2, r = t.tokens.length - 2; n < r; n++)
    t.tokens[n].level === s && t.tokens[n].type === "paragraph_open" && (t.tokens[n + 2].hidden = !0, t.tokens[n].hidden = !0, n += 2);
}
var $G = function(e, n, r, s) {
  var o, c, i, a, l, u, f, h, d, m, _, R, T, D, I, B, P, y, W, $, Q, z, oe, L, ee, A, K, F = n, v = !1, C = !0;
  if (e.sCount[F] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[F] - e.listIndent >= 4 && e.sCount[F] < e.blkIndent)
    return !1;
  if (s && e.parentType === "paragraph" && e.sCount[F] >= e.blkIndent && (v = !0), (z = Nc(e, F)) >= 0) {
    if (f = !0, L = e.bMarks[F] + e.tShift[F], T = Number(e.src.slice(L, z - 1)), v && T !== 1)
      return !1;
  } else if ((z = Lc(e, F)) >= 0)
    f = !1;
  else
    return !1;
  if (v && e.skipSpaces(z) >= e.eMarks[F])
    return !1;
  if (s)
    return !0;
  for (R = e.src.charCodeAt(z - 1), _ = e.tokens.length, f ? (K = e.push("ordered_list_open", "ol", 1), T !== 1 && (K.attrs = [["start", T]])) : K = e.push("bullet_list_open", "ul", 1), K.map = m = [F, 0], K.markup = String.fromCharCode(R), oe = !1, A = e.md.block.ruler.getRules("list"), P = e.parentType, e.parentType = "list"; F < r; ) {
    for (Q = z, D = e.eMarks[F], u = I = e.sCount[F] + z - (e.bMarks[F] + e.tShift[F]); Q < D; ) {
      if (o = e.src.charCodeAt(Q), o === 9)
        I += 4 - (I + e.bsCount[F]) % 4;
      else if (o === 32)
        I++;
      else
        break;
      Q++;
    }
    if (c = Q, c >= D ? l = 1 : l = I - u, l > 4 && (l = 1), a = u + l, K = e.push("list_item_open", "li", 1), K.markup = String.fromCharCode(R), K.map = h = [F, 0], f && (K.info = e.src.slice(L, z - 1)), $ = e.tight, W = e.tShift[F], y = e.sCount[F], B = e.listIndent, e.listIndent = e.blkIndent, e.blkIndent = a, e.tight = !0, e.tShift[F] = c - e.bMarks[F], e.sCount[F] = I, c >= D && e.isEmpty(F + 1) ? e.line = Math.min(e.line + 2, r) : e.md.block.tokenize(e, F, r, !0), (!e.tight || oe) && (C = !1), oe = e.line - F > 1 && e.isEmpty(e.line - 1), e.blkIndent = e.listIndent, e.listIndent = B, e.tShift[F] = W, e.sCount[F] = y, e.tight = $, K = e.push("list_item_close", "li", -1), K.markup = String.fromCharCode(R), F = e.line, h[1] = F, F >= r || e.sCount[F] < e.blkIndent || e.sCount[F] - e.blkIndent >= 4)
      break;
    for (ee = !1, i = 0, d = A.length; i < d; i++)
      if (A[i](e, F, r, !0)) {
        ee = !0;
        break;
      }
    if (ee)
      break;
    if (f) {
      if (z = Nc(e, F), z < 0)
        break;
      L = e.bMarks[F] + e.tShift[F];
    } else if (z = Lc(e, F), z < 0)
      break;
    if (R !== e.src.charCodeAt(z - 1))
      break;
  }
  return f ? K = e.push("ordered_list_close", "ol", -1) : K = e.push("bullet_list_close", "ul", -1), K.markup = String.fromCharCode(R), m[1] = F, e.line = F, e.parentType = P, C && PG(e, _), !0;
}, UG = le.normalizeReference, jn = le.isSpace, zG = function(e, n, r, s) {
  var o, c, i, a, l, u, f, h, d, m, _, R, T, D, I, B, P = 0, y = e.bMarks[n] + e.tShift[n], W = e.eMarks[n], $ = n + 1;
  if (e.sCount[n] - e.blkIndent >= 4 || e.src.charCodeAt(y) !== 91)
    return !1;
  for (; ++y < W; )
    if (e.src.charCodeAt(y) === 93 && e.src.charCodeAt(y - 1) !== 92) {
      if (y + 1 === W || e.src.charCodeAt(y + 1) !== 58)
        return !1;
      break;
    }
  for (a = e.lineMax, I = e.md.block.ruler.getRules("reference"), m = e.parentType, e.parentType = "reference"; $ < a && !e.isEmpty($); $++)
    if (!(e.sCount[$] - e.blkIndent > 3) && !(e.sCount[$] < 0)) {
      for (D = !1, u = 0, f = I.length; u < f; u++)
        if (I[u](e, $, a, !0)) {
          D = !0;
          break;
        }
      if (D)
        break;
    }
  for (T = e.getLines(n, $, e.blkIndent, !1).trim(), W = T.length, y = 1; y < W; y++) {
    if (o = T.charCodeAt(y), o === 91)
      return !1;
    if (o === 93) {
      d = y;
      break;
    } else
      o === 10 ? P++ : o === 92 && (y++, y < W && T.charCodeAt(y) === 10 && P++);
  }
  if (d < 0 || T.charCodeAt(d + 1) !== 58)
    return !1;
  for (y = d + 2; y < W; y++)
    if (o = T.charCodeAt(y), o === 10)
      P++;
    else if (!jn(o))
      break;
  if (_ = e.md.helpers.parseLinkDestination(T, y, W), !_.ok || (l = e.md.normalizeLink(_.str), !e.md.validateLink(l)))
    return !1;
  for (y = _.pos, P += _.lines, c = y, i = P, R = y; y < W; y++)
    if (o = T.charCodeAt(y), o === 10)
      P++;
    else if (!jn(o))
      break;
  for (_ = e.md.helpers.parseLinkTitle(T, y, W), y < W && R !== y && _.ok ? (B = _.str, y = _.pos, P += _.lines) : (B = "", y = c, P = i); y < W && (o = T.charCodeAt(y), !!jn(o)); )
    y++;
  if (y < W && T.charCodeAt(y) !== 10 && B)
    for (B = "", y = c, P = i; y < W && (o = T.charCodeAt(y), !!jn(o)); )
      y++;
  return y < W && T.charCodeAt(y) !== 10 || (h = UG(T.slice(1, d)), !h) ? !1 : (s || (typeof e.env.references > "u" && (e.env.references = {}), typeof e.env.references[h] > "u" && (e.env.references[h] = { title: B, href: l }), e.parentType = m, e.line = n + P + 1), !0);
}, HG = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "section",
  "source",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
], Nr = {}, VG = "[a-zA-Z_:][a-zA-Z0-9:._-]*", GG = "[^\"'=<>`\\x00-\\x20]+", jG = "'[^']*'", KG = '"[^"]*"', ZG = "(?:" + GG + "|" + jG + "|" + KG + ")", WG = "(?:\\s+" + VG + "(?:\\s*=\\s*" + ZG + ")?)", Ia = "<[A-Za-z][A-Za-z0-9\\-]*" + WG + "*\\s*\\/?>", Ma = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", JG = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->", YG = "<[?][\\s\\S]*?[?]>", XG = "<![A-Z]+\\s+[^>]*>", QG = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>", ej = new RegExp("^(?:" + Ia + "|" + Ma + "|" + JG + "|" + YG + "|" + XG + "|" + QG + ")"), tj = new RegExp("^(?:" + Ia + "|" + Ma + ")");
Nr.HTML_TAG_RE = ej;
Nr.HTML_OPEN_CLOSE_TAG_RE = tj;
var nj = HG, rj = Nr.HTML_OPEN_CLOSE_TAG_RE, Vt = [
  [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, !0],
  [/^<!--/, /-->/, !0],
  [/^<\?/, /\?>/, !0],
  [/^<![A-Z]/, />/, !0],
  [/^<!\[CDATA\[/, /\]\]>/, !0],
  [new RegExp("^</?(" + nj.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, !0],
  [new RegExp(rj.source + "\\s*$"), /^$/, !1]
], sj = function(e, n, r, s) {
  var o, c, i, a, l = e.bMarks[n] + e.tShift[n], u = e.eMarks[n];
  if (e.sCount[n] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(l) !== 60)
    return !1;
  for (a = e.src.slice(l, u), o = 0; o < Vt.length && !Vt[o][0].test(a); o++)
    ;
  if (o === Vt.length)
    return !1;
  if (s)
    return Vt[o][2];
  if (c = n + 1, !Vt[o][1].test(a)) {
    for (; c < r && !(e.sCount[c] < e.blkIndent); c++)
      if (l = e.bMarks[c] + e.tShift[c], u = e.eMarks[c], a = e.src.slice(l, u), Vt[o][1].test(a)) {
        a.length !== 0 && c++;
        break;
      }
  }
  return e.line = c, i = e.push("html_block", "", 0), i.map = [n, c], i.content = e.getLines(n, c, e.blkIndent, !0), !0;
}, Ic = le.isSpace, oj = function(e, n, r, s) {
  var o, c, i, a, l = e.bMarks[n] + e.tShift[n], u = e.eMarks[n];
  if (e.sCount[n] - e.blkIndent >= 4 || (o = e.src.charCodeAt(l), o !== 35 || l >= u))
    return !1;
  for (c = 1, o = e.src.charCodeAt(++l); o === 35 && l < u && c <= 6; )
    c++, o = e.src.charCodeAt(++l);
  return c > 6 || l < u && !Ic(o) ? !1 : (s || (u = e.skipSpacesBack(u, l), i = e.skipCharsBack(u, 35, l), i > l && Ic(e.src.charCodeAt(i - 1)) && (u = i), e.line = n + 1, a = e.push("heading_open", "h" + String(c), 1), a.markup = "########".slice(0, c), a.map = [n, e.line], a = e.push("inline", "", 0), a.content = e.src.slice(l, u).trim(), a.map = [n, e.line], a.children = [], a = e.push("heading_close", "h" + String(c), -1), a.markup = "########".slice(0, c)), !0);
}, cj = function(e, n, r) {
  var s, o, c, i, a, l, u, f, h, d = n + 1, m, _ = e.md.block.ruler.getRules("paragraph");
  if (e.sCount[n] - e.blkIndent >= 4)
    return !1;
  for (m = e.parentType, e.parentType = "paragraph"; d < r && !e.isEmpty(d); d++)
    if (!(e.sCount[d] - e.blkIndent > 3)) {
      if (e.sCount[d] >= e.blkIndent && (l = e.bMarks[d] + e.tShift[d], u = e.eMarks[d], l < u && (h = e.src.charCodeAt(l), (h === 45 || h === 61) && (l = e.skipChars(l, h), l = e.skipSpaces(l), l >= u)))) {
        f = h === 61 ? 1 : 2;
        break;
      }
      if (!(e.sCount[d] < 0)) {
        for (o = !1, c = 0, i = _.length; c < i; c++)
          if (_[c](e, d, r, !0)) {
            o = !0;
            break;
          }
        if (o)
          break;
      }
    }
  return f ? (s = e.getLines(n, d, e.blkIndent, !1).trim(), e.line = d + 1, a = e.push("heading_open", "h" + String(f), 1), a.markup = String.fromCharCode(h), a.map = [n, e.line], a = e.push("inline", "", 0), a.content = s, a.map = [n, e.line - 1], a.children = [], a = e.push("heading_close", "h" + String(f), -1), a.markup = String.fromCharCode(h), e.parentType = m, !0) : !1;
}, ij = function(e, n, r) {
  var s, o, c, i, a, l, u = n + 1, f = e.md.block.ruler.getRules("paragraph");
  for (l = e.parentType, e.parentType = "paragraph"; u < r && !e.isEmpty(u); u++)
    if (!(e.sCount[u] - e.blkIndent > 3) && !(e.sCount[u] < 0)) {
      for (o = !1, c = 0, i = f.length; c < i; c++)
        if (f[c](e, u, r, !0)) {
          o = !0;
          break;
        }
      if (o)
        break;
    }
  return s = e.getLines(n, u, e.blkIndent, !1).trim(), e.line = u, a = e.push("paragraph_open", "p", 1), a.map = [n, e.line], a = e.push("inline", "", 0), a.content = s, a.map = [n, e.line], a.children = [], a = e.push("paragraph_close", "p", -1), e.parentType = l, !0;
}, Oa = oo, Ir = le.isSpace;
function tt(t, e, n, r) {
  var s, o, c, i, a, l, u, f;
  for (this.src = t, this.md = e, this.env = n, this.tokens = r, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0, this.result = "", o = this.src, f = !1, c = i = l = u = 0, a = o.length; i < a; i++) {
    if (s = o.charCodeAt(i), !f)
      if (Ir(s)) {
        l++, s === 9 ? u += 4 - u % 4 : u++;
        continue;
      } else
        f = !0;
    (s === 10 || i === a - 1) && (s !== 10 && i++, this.bMarks.push(c), this.eMarks.push(i), this.tShift.push(l), this.sCount.push(u), this.bsCount.push(0), f = !1, l = 0, u = 0, c = i + 1);
  }
  this.bMarks.push(o.length), this.eMarks.push(o.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
}
tt.prototype.push = function(t, e, n) {
  var r = new Oa(t, e, n);
  return r.block = !0, n < 0 && this.level--, r.level = this.level, n > 0 && this.level++, this.tokens.push(r), r;
};
tt.prototype.isEmpty = function(e) {
  return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
};
tt.prototype.skipEmptyLines = function(e) {
  for (var n = this.lineMax; e < n && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++)
    ;
  return e;
};
tt.prototype.skipSpaces = function(e) {
  for (var n, r = this.src.length; e < r && (n = this.src.charCodeAt(e), !!Ir(n)); e++)
    ;
  return e;
};
tt.prototype.skipSpacesBack = function(e, n) {
  if (e <= n)
    return e;
  for (; e > n; )
    if (!Ir(this.src.charCodeAt(--e)))
      return e + 1;
  return e;
};
tt.prototype.skipChars = function(e, n) {
  for (var r = this.src.length; e < r && this.src.charCodeAt(e) === n; e++)
    ;
  return e;
};
tt.prototype.skipCharsBack = function(e, n, r) {
  if (e <= r)
    return e;
  for (; e > r; )
    if (n !== this.src.charCodeAt(--e))
      return e + 1;
  return e;
};
tt.prototype.getLines = function(e, n, r, s) {
  var o, c, i, a, l, u, f, h = e;
  if (e >= n)
    return "";
  for (u = new Array(n - e), o = 0; h < n; h++, o++) {
    for (c = 0, f = a = this.bMarks[h], h + 1 < n || s ? l = this.eMarks[h] + 1 : l = this.eMarks[h]; a < l && c < r; ) {
      if (i = this.src.charCodeAt(a), Ir(i))
        i === 9 ? c += 4 - (c + this.bsCount[h]) % 4 : c++;
      else if (a - f < this.tShift[h])
        c++;
      else
        break;
      a++;
    }
    c > r ? u[o] = new Array(c - r + 1).join(" ") + this.src.slice(a, l) : u[o] = this.src.slice(a, l);
  }
  return u.join("");
};
tt.prototype.Token = Oa;
var aj = tt, lj = so, Kn = [
  // First 2 params - rule name & source. Secondary array - list of rules,
  // which can be terminated by this one.
  ["table", NG, ["paragraph", "reference"]],
  ["code", IG],
  ["fence", MG, ["paragraph", "reference", "blockquote", "list"]],
  ["blockquote", qG, ["paragraph", "reference", "blockquote", "list"]],
  ["hr", BG, ["paragraph", "reference", "blockquote", "list"]],
  ["list", $G, ["paragraph", "reference", "blockquote"]],
  ["reference", zG],
  ["html_block", sj, ["paragraph", "reference", "blockquote"]],
  ["heading", oj, ["paragraph", "reference", "blockquote"]],
  ["lheading", cj],
  ["paragraph", ij]
];
function Mr() {
  this.ruler = new lj();
  for (var t = 0; t < Kn.length; t++)
    this.ruler.push(Kn[t][0], Kn[t][1], { alt: (Kn[t][2] || []).slice() });
}
Mr.prototype.tokenize = function(t, e, n) {
  for (var r, s, o, c = this.ruler.getRules(""), i = c.length, a = e, l = !1, u = t.md.options.maxNesting; a < n && (t.line = a = t.skipEmptyLines(a), !(a >= n || t.sCount[a] < t.blkIndent)); ) {
    if (t.level >= u) {
      t.line = n;
      break;
    }
    for (o = t.line, s = 0; s < i; s++)
      if (r = c[s](t, a, n, !1), r) {
        if (o >= t.line)
          throw new Error("block rule didn't increment state.line");
        break;
      }
    if (!r)
      throw new Error("none of the block rules matched");
    t.tight = !l, t.isEmpty(t.line - 1) && (l = !0), a = t.line, a < n && t.isEmpty(a) && (l = !0, a++, t.line = a);
  }
};
Mr.prototype.parse = function(t, e, n, r) {
  var s;
  t && (s = new this.State(t, e, n, r), this.tokenize(s, s.line, s.lineMax));
};
Mr.prototype.State = aj;
var uj = Mr;
function fj(t) {
  switch (t) {
    case 10:
    case 33:
    case 35:
    case 36:
    case 37:
    case 38:
    case 42:
    case 43:
    case 45:
    case 58:
    case 60:
    case 61:
    case 62:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 125:
    case 126:
      return !0;
    default:
      return !1;
  }
}
var hj = function(e, n) {
  for (var r = e.pos; r < e.posMax && !fj(e.src.charCodeAt(r)); )
    r++;
  return r === e.pos ? !1 : (n || (e.pending += e.src.slice(e.pos, r)), e.pos = r, !0);
}, pj = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i, dj = function(e, n) {
  var r, s, o, c, i, a, l, u;
  return !e.md.options.linkify || e.linkLevel > 0 || (r = e.pos, s = e.posMax, r + 3 > s) || e.src.charCodeAt(r) !== 58 || e.src.charCodeAt(r + 1) !== 47 || e.src.charCodeAt(r + 2) !== 47 || (o = e.pending.match(pj), !o) || (c = o[1], i = e.md.linkify.matchAtStart(e.src.slice(r - c.length)), !i) || (a = i.url, a.length <= c.length) || (a = a.replace(/\*+$/, ""), l = e.md.normalizeLink(a), !e.md.validateLink(l)) ? !1 : (n || (e.pending = e.pending.slice(0, -c.length), u = e.push("link_open", "a", 1), u.attrs = [["href", l]], u.markup = "linkify", u.info = "auto", u = e.push("text", "", 0), u.content = e.md.normalizeLinkText(a), u = e.push("link_close", "a", -1), u.markup = "linkify", u.info = "auto"), e.pos += a.length - c.length, !0);
}, gj = le.isSpace, mj = function(e, n) {
  var r, s, o, c = e.pos;
  if (e.src.charCodeAt(c) !== 10)
    return !1;
  if (r = e.pending.length - 1, s = e.posMax, !n)
    if (r >= 0 && e.pending.charCodeAt(r) === 32)
      if (r >= 1 && e.pending.charCodeAt(r - 1) === 32) {
        for (o = r - 1; o >= 1 && e.pending.charCodeAt(o - 1) === 32; )
          o--;
        e.pending = e.pending.slice(0, o), e.push("hardbreak", "br", 0);
      } else
        e.pending = e.pending.slice(0, -1), e.push("softbreak", "br", 0);
    else
      e.push("softbreak", "br", 0);
  for (c++; c < s && gj(e.src.charCodeAt(c)); )
    c++;
  return e.pos = c, !0;
}, _j = le.isSpace, io = [];
for (var Mc = 0; Mc < 256; Mc++)
  io.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(t) {
  io[t.charCodeAt(0)] = 1;
});
var bj = function(e, n) {
  var r, s, o, c, i, a = e.pos, l = e.posMax;
  if (e.src.charCodeAt(a) !== 92 || (a++, a >= l))
    return !1;
  if (r = e.src.charCodeAt(a), r === 10) {
    for (n || e.push("hardbreak", "br", 0), a++; a < l && (r = e.src.charCodeAt(a), !!_j(r)); )
      a++;
    return e.pos = a, !0;
  }
  return c = e.src[a], r >= 55296 && r <= 56319 && a + 1 < l && (s = e.src.charCodeAt(a + 1), s >= 56320 && s <= 57343 && (c += e.src[a + 1], a++)), o = "\\" + c, n || (i = e.push("text_special", "", 0), r < 256 && io[r] !== 0 ? i.content = c : i.content = o, i.markup = o, i.info = "escape"), e.pos = a + 1, !0;
}, vj = function(e, n) {
  var r, s, o, c, i, a, l, u, f = e.pos, h = e.src.charCodeAt(f);
  if (h !== 96)
    return !1;
  for (r = f, f++, s = e.posMax; f < s && e.src.charCodeAt(f) === 96; )
    f++;
  if (o = e.src.slice(r, f), l = o.length, e.backticksScanned && (e.backticks[l] || 0) <= r)
    return n || (e.pending += o), e.pos += l, !0;
  for (a = f; (i = e.src.indexOf("`", a)) !== -1; ) {
    for (a = i + 1; a < s && e.src.charCodeAt(a) === 96; )
      a++;
    if (u = a - i, u === l)
      return n || (c = e.push("code_inline", "code", 0), c.markup = o, c.content = e.src.slice(f, i).replace(/\n/g, " ").replace(/^ (.+) $/, "$1")), e.pos = a, !0;
    e.backticks[u] = i;
  }
  return e.backticksScanned = !0, n || (e.pending += o), e.pos += l, !0;
}, Or = {};
Or.tokenize = function(e, n) {
  var r, s, o, c, i, a = e.pos, l = e.src.charCodeAt(a);
  if (n || l !== 126 || (s = e.scanDelims(e.pos, !0), c = s.length, i = String.fromCharCode(l), c < 2))
    return !1;
  for (c % 2 && (o = e.push("text", "", 0), o.content = i, c--), r = 0; r < c; r += 2)
    o = e.push("text", "", 0), o.content = i + i, e.delimiters.push({
      marker: l,
      length: 0,
      // disable "rule of 3" length checks meant for emphasis
      token: e.tokens.length - 1,
      end: -1,
      open: s.can_open,
      close: s.can_close
    });
  return e.pos += s.length, !0;
};
function Oc(t, e) {
  var n, r, s, o, c, i = [], a = e.length;
  for (n = 0; n < a; n++)
    s = e[n], s.marker === 126 && s.end !== -1 && (o = e[s.end], c = t.tokens[s.token], c.type = "s_open", c.tag = "s", c.nesting = 1, c.markup = "~~", c.content = "", c = t.tokens[o.token], c.type = "s_close", c.tag = "s", c.nesting = -1, c.markup = "~~", c.content = "", t.tokens[o.token - 1].type === "text" && t.tokens[o.token - 1].content === "~" && i.push(o.token - 1));
  for (; i.length; ) {
    for (n = i.pop(), r = n + 1; r < t.tokens.length && t.tokens[r].type === "s_close"; )
      r++;
    r--, n !== r && (c = t.tokens[r], t.tokens[r] = t.tokens[n], t.tokens[n] = c);
  }
}
Or.postProcess = function(e) {
  var n, r = e.tokens_meta, s = e.tokens_meta.length;
  for (Oc(e, e.delimiters), n = 0; n < s; n++)
    r[n] && r[n].delimiters && Oc(e, r[n].delimiters);
};
var qr = {};
qr.tokenize = function(e, n) {
  var r, s, o, c = e.pos, i = e.src.charCodeAt(c);
  if (n || i !== 95 && i !== 42)
    return !1;
  for (s = e.scanDelims(e.pos, i === 42), r = 0; r < s.length; r++)
    o = e.push("text", "", 0), o.content = String.fromCharCode(i), e.delimiters.push({
      // Char code of the starting marker (number).
      //
      marker: i,
      // Total length of these series of delimiters.
      //
      length: s.length,
      // A position of the token this delimiter corresponds to.
      //
      token: e.tokens.length - 1,
      // If this delimiter is matched as a valid opener, `end` will be
      // equal to its position, otherwise it's `-1`.
      //
      end: -1,
      // Boolean flags that determine if this delimiter could open or close
      // an emphasis.
      //
      open: s.can_open,
      close: s.can_close
    });
  return e.pos += s.length, !0;
};
function qc(t, e) {
  var n, r, s, o, c, i, a = e.length;
  for (n = a - 1; n >= 0; n--)
    r = e[n], !(r.marker !== 95 && r.marker !== 42) && r.end !== -1 && (s = e[r.end], i = n > 0 && e[n - 1].end === r.end + 1 && // check that first two markers match and adjacent
    e[n - 1].marker === r.marker && e[n - 1].token === r.token - 1 && // check that last two markers are adjacent (we can safely assume they match)
    e[r.end + 1].token === s.token + 1, c = String.fromCharCode(r.marker), o = t.tokens[r.token], o.type = i ? "strong_open" : "em_open", o.tag = i ? "strong" : "em", o.nesting = 1, o.markup = i ? c + c : c, o.content = "", o = t.tokens[s.token], o.type = i ? "strong_close" : "em_close", o.tag = i ? "strong" : "em", o.nesting = -1, o.markup = i ? c + c : c, o.content = "", i && (t.tokens[e[n - 1].token].content = "", t.tokens[e[r.end + 1].token].content = "", n--));
}
qr.postProcess = function(e) {
  var n, r = e.tokens_meta, s = e.tokens_meta.length;
  for (qc(e, e.delimiters), n = 0; n < s; n++)
    r[n] && r[n].delimiters && qc(e, r[n].delimiters);
};
var yj = le.normalizeReference, ss = le.isSpace, xj = function(e, n) {
  var r, s, o, c, i, a, l, u, f, h = "", d = "", m = e.pos, _ = e.posMax, R = e.pos, T = !0;
  if (e.src.charCodeAt(e.pos) !== 91 || (i = e.pos + 1, c = e.md.helpers.parseLinkLabel(e, e.pos, !0), c < 0))
    return !1;
  if (a = c + 1, a < _ && e.src.charCodeAt(a) === 40) {
    for (T = !1, a++; a < _ && (s = e.src.charCodeAt(a), !(!ss(s) && s !== 10)); a++)
      ;
    if (a >= _)
      return !1;
    if (R = a, l = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), l.ok) {
      for (h = e.md.normalizeLink(l.str), e.md.validateLink(h) ? a = l.pos : h = "", R = a; a < _ && (s = e.src.charCodeAt(a), !(!ss(s) && s !== 10)); a++)
        ;
      if (l = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < _ && R !== a && l.ok)
        for (d = l.str, a = l.pos; a < _ && (s = e.src.charCodeAt(a), !(!ss(s) && s !== 10)); a++)
          ;
    }
    (a >= _ || e.src.charCodeAt(a) !== 41) && (T = !0), a++;
  }
  if (T) {
    if (typeof e.env.references > "u")
      return !1;
    if (a < _ && e.src.charCodeAt(a) === 91 ? (R = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? o = e.src.slice(R, a++) : a = c + 1) : a = c + 1, o || (o = e.src.slice(i, c)), u = e.env.references[yj(o)], !u)
      return e.pos = m, !1;
    h = u.href, d = u.title;
  }
  return n || (e.pos = i, e.posMax = c, f = e.push("link_open", "a", 1), f.attrs = r = [["href", h]], d && r.push(["title", d]), e.linkLevel++, e.md.inline.tokenize(e), e.linkLevel--, f = e.push("link_close", "a", -1)), e.pos = a, e.posMax = _, !0;
}, Ej = le.normalizeReference, os = le.isSpace, kj = function(e, n) {
  var r, s, o, c, i, a, l, u, f, h, d, m, _, R = "", T = e.pos, D = e.posMax;
  if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91 || (a = e.pos + 2, i = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1), i < 0))
    return !1;
  if (l = i + 1, l < D && e.src.charCodeAt(l) === 40) {
    for (l++; l < D && (s = e.src.charCodeAt(l), !(!os(s) && s !== 10)); l++)
      ;
    if (l >= D)
      return !1;
    for (_ = l, f = e.md.helpers.parseLinkDestination(e.src, l, e.posMax), f.ok && (R = e.md.normalizeLink(f.str), e.md.validateLink(R) ? l = f.pos : R = ""), _ = l; l < D && (s = e.src.charCodeAt(l), !(!os(s) && s !== 10)); l++)
      ;
    if (f = e.md.helpers.parseLinkTitle(e.src, l, e.posMax), l < D && _ !== l && f.ok)
      for (h = f.str, l = f.pos; l < D && (s = e.src.charCodeAt(l), !(!os(s) && s !== 10)); l++)
        ;
    else
      h = "";
    if (l >= D || e.src.charCodeAt(l) !== 41)
      return e.pos = T, !1;
    l++;
  } else {
    if (typeof e.env.references > "u")
      return !1;
    if (l < D && e.src.charCodeAt(l) === 91 ? (_ = l + 1, l = e.md.helpers.parseLinkLabel(e, l), l >= 0 ? c = e.src.slice(_, l++) : l = i + 1) : l = i + 1, c || (c = e.src.slice(a, i)), u = e.env.references[Ej(c)], !u)
      return e.pos = T, !1;
    R = u.href, h = u.title;
  }
  return n || (o = e.src.slice(a, i), e.md.inline.parse(
    o,
    e.md,
    e.env,
    m = []
  ), d = e.push("image", "img", 0), d.attrs = r = [["src", R], ["alt", ""]], d.children = m, d.content = o, h && r.push(["title", h])), e.pos = l, e.posMax = D, !0;
}, wj = /^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, Aj = /^([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)$/, Cj = function(e, n) {
  var r, s, o, c, i, a, l = e.pos;
  if (e.src.charCodeAt(l) !== 60)
    return !1;
  for (i = e.pos, a = e.posMax; ; ) {
    if (++l >= a || (c = e.src.charCodeAt(l), c === 60))
      return !1;
    if (c === 62)
      break;
  }
  return r = e.src.slice(i + 1, l), Aj.test(r) ? (s = e.md.normalizeLink(r), e.md.validateLink(s) ? (n || (o = e.push("link_open", "a", 1), o.attrs = [["href", s]], o.markup = "autolink", o.info = "auto", o = e.push("text", "", 0), o.content = e.md.normalizeLinkText(r), o = e.push("link_close", "a", -1), o.markup = "autolink", o.info = "auto"), e.pos += r.length + 2, !0) : !1) : wj.test(r) ? (s = e.md.normalizeLink("mailto:" + r), e.md.validateLink(s) ? (n || (o = e.push("link_open", "a", 1), o.attrs = [["href", s]], o.markup = "autolink", o.info = "auto", o = e.push("text", "", 0), o.content = e.md.normalizeLinkText(r), o = e.push("link_close", "a", -1), o.markup = "autolink", o.info = "auto"), e.pos += r.length + 2, !0) : !1) : !1;
}, Sj = Nr.HTML_TAG_RE;
function Tj(t) {
  return /^<a[>\s]/i.test(t);
}
function Dj(t) {
  return /^<\/a\s*>/i.test(t);
}
function Rj(t) {
  var e = t | 32;
  return e >= 97 && e <= 122;
}
var Lj = function(e, n) {
  var r, s, o, c, i = e.pos;
  return !e.md.options.html || (o = e.posMax, e.src.charCodeAt(i) !== 60 || i + 2 >= o) || (r = e.src.charCodeAt(i + 1), r !== 33 && r !== 63 && r !== 47 && !Rj(r)) || (s = e.src.slice(i).match(Sj), !s) ? !1 : (n || (c = e.push("html_inline", "", 0), c.content = s[0], Tj(c.content) && e.linkLevel++, Dj(c.content) && e.linkLevel--), e.pos += s[0].length, !0);
}, Fc = Ca, Nj = le.has, Ij = le.isValidEntityCode, Bc = le.fromCodePoint, Mj = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, Oj = /^&([a-z][a-z0-9]{1,31});/i, qj = function(e, n) {
  var r, s, o, c, i = e.pos, a = e.posMax;
  if (e.src.charCodeAt(i) !== 38 || i + 1 >= a)
    return !1;
  if (r = e.src.charCodeAt(i + 1), r === 35) {
    if (o = e.src.slice(i).match(Mj), o)
      return n || (s = o[1][0].toLowerCase() === "x" ? parseInt(o[1].slice(1), 16) : parseInt(o[1], 10), c = e.push("text_special", "", 0), c.content = Ij(s) ? Bc(s) : Bc(65533), c.markup = o[0], c.info = "entity"), e.pos += o[0].length, !0;
  } else if (o = e.src.slice(i).match(Oj), o && Nj(Fc, o[1]))
    return n || (c = e.push("text_special", "", 0), c.content = Fc[o[1]], c.markup = o[0], c.info = "entity"), e.pos += o[0].length, !0;
  return !1;
};
function Pc(t) {
  var e, n, r, s, o, c, i, a, l = {}, u = t.length;
  if (u) {
    var f = 0, h = -2, d = [];
    for (e = 0; e < u; e++)
      if (r = t[e], d.push(0), (t[f].marker !== r.marker || h !== r.token - 1) && (f = e), h = r.token, r.length = r.length || 0, !!r.close) {
        for (l.hasOwnProperty(r.marker) || (l[r.marker] = [-1, -1, -1, -1, -1, -1]), o = l[r.marker][(r.open ? 3 : 0) + r.length % 3], n = f - d[f] - 1, c = n; n > o; n -= d[n] + 1)
          if (s = t[n], s.marker === r.marker && s.open && s.end < 0 && (i = !1, (s.close || r.open) && (s.length + r.length) % 3 === 0 && (s.length % 3 !== 0 || r.length % 3 !== 0) && (i = !0), !i)) {
            a = n > 0 && !t[n - 1].open ? d[n - 1] + 1 : 0, d[e] = e - n + a, d[n] = a, r.open = !1, s.end = e, s.close = !1, c = -1, h = -2;
            break;
          }
        c !== -1 && (l[r.marker][(r.open ? 3 : 0) + (r.length || 0) % 3] = c);
      }
  }
}
var Fj = function(e) {
  var n, r = e.tokens_meta, s = e.tokens_meta.length;
  for (Pc(e.delimiters), n = 0; n < s; n++)
    r[n] && r[n].delimiters && Pc(r[n].delimiters);
}, Bj = function(e) {
  var n, r, s = 0, o = e.tokens, c = e.tokens.length;
  for (n = r = 0; n < c; n++)
    o[n].nesting < 0 && s--, o[n].level = s, o[n].nesting > 0 && s++, o[n].type === "text" && n + 1 < c && o[n + 1].type === "text" ? o[n + 1].content = o[n].content + o[n + 1].content : (n !== r && (o[r] = o[n]), r++);
  n !== r && (o.length = r);
}, ao = oo, $c = le.isWhiteSpace, Uc = le.isPunctChar, zc = le.isMdAsciiPunct;
function Ln(t, e, n, r) {
  this.src = t, this.env = n, this.md = e, this.tokens = r, this.tokens_meta = Array(r.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
}
Ln.prototype.pushPending = function() {
  var t = new ao("text", "", 0);
  return t.content = this.pending, t.level = this.pendingLevel, this.tokens.push(t), this.pending = "", t;
};
Ln.prototype.push = function(t, e, n) {
  this.pending && this.pushPending();
  var r = new ao(t, e, n), s = null;
  return n < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, n > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], s = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(s), r;
};
Ln.prototype.scanDelims = function(t, e) {
  var n = t, r, s, o, c, i, a, l, u, f, h = !0, d = !0, m = this.posMax, _ = this.src.charCodeAt(t);
  for (r = t > 0 ? this.src.charCodeAt(t - 1) : 32; n < m && this.src.charCodeAt(n) === _; )
    n++;
  return o = n - t, s = n < m ? this.src.charCodeAt(n) : 32, l = zc(r) || Uc(String.fromCharCode(r)), f = zc(s) || Uc(String.fromCharCode(s)), a = $c(r), u = $c(s), u ? h = !1 : f && (a || l || (h = !1)), a ? d = !1 : l && (u || f || (d = !1)), e ? (c = h, i = d) : (c = h && (!d || l), i = d && (!h || f)), {
    can_open: c,
    can_close: i,
    length: o
  };
};
Ln.prototype.Token = ao;
var Pj = Ln, Hc = so, cs = [
  ["text", hj],
  ["linkify", dj],
  ["newline", mj],
  ["escape", bj],
  ["backticks", vj],
  ["strikethrough", Or.tokenize],
  ["emphasis", qr.tokenize],
  ["link", xj],
  ["image", kj],
  ["autolink", Cj],
  ["html_inline", Lj],
  ["entity", qj]
], is = [
  ["balance_pairs", Fj],
  ["strikethrough", Or.postProcess],
  ["emphasis", qr.postProcess],
  // rules for pairs separate '**' into its own text tokens, which may be left unused,
  // rule below merges unused segments back with the rest of the text
  ["fragments_join", Bj]
];
function Nn() {
  var t;
  for (this.ruler = new Hc(), t = 0; t < cs.length; t++)
    this.ruler.push(cs[t][0], cs[t][1]);
  for (this.ruler2 = new Hc(), t = 0; t < is.length; t++)
    this.ruler2.push(is[t][0], is[t][1]);
}
Nn.prototype.skipToken = function(t) {
  var e, n, r = t.pos, s = this.ruler.getRules(""), o = s.length, c = t.md.options.maxNesting, i = t.cache;
  if (typeof i[r] < "u") {
    t.pos = i[r];
    return;
  }
  if (t.level < c) {
    for (n = 0; n < o; n++)
      if (t.level++, e = s[n](t, !0), t.level--, e) {
        if (r >= t.pos)
          throw new Error("inline rule didn't increment state.pos");
        break;
      }
  } else
    t.pos = t.posMax;
  e || t.pos++, i[r] = t.pos;
};
Nn.prototype.tokenize = function(t) {
  for (var e, n, r, s = this.ruler.getRules(""), o = s.length, c = t.posMax, i = t.md.options.maxNesting; t.pos < c; ) {
    if (r = t.pos, t.level < i) {
      for (n = 0; n < o; n++)
        if (e = s[n](t, !1), e) {
          if (r >= t.pos)
            throw new Error("inline rule didn't increment state.pos");
          break;
        }
    }
    if (e) {
      if (t.pos >= c)
        break;
      continue;
    }
    t.pending += t.src[t.pos++];
  }
  t.pending && t.pushPending();
};
Nn.prototype.parse = function(t, e, n, r) {
  var s, o, c, i = new this.State(t, e, n, r);
  for (this.tokenize(i), o = this.ruler2.getRules(""), c = o.length, s = 0; s < c; s++)
    o[s](i);
};
Nn.prototype.State = Pj;
var $j = Nn, as, Vc;
function Uj() {
  return Vc || (Vc = 1, as = function(t) {
    var e = {};
    t = t || {}, e.src_Any = Sa().source, e.src_Cc = Ta().source, e.src_Z = Da().source, e.src_P = ro.source, e.src_ZPCc = [e.src_Z, e.src_P, e.src_Cc].join("|"), e.src_ZCc = [e.src_Z, e.src_Cc].join("|");
    var n = "[><｜]";
    return e.src_pseudo_letter = "(?:(?!" + n + "|" + e.src_ZPCc + ")" + e.src_Any + ")", e.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", e.src_auth = "(?:(?:(?!" + e.src_ZCc + "|[@/\\[\\]()]).)+@)?", e.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", e.src_host_terminator = "(?=$|" + n + "|" + e.src_ZPCc + ")(?!" + (t["---"] ? "-(?!--)|" : "-|") + "_|:\\d|\\.-|\\.(?!$|" + e.src_ZPCc + "))", e.src_path = "(?:[/?#](?:(?!" + e.src_ZCc + "|" + n + `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` + e.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + e.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + e.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + e.src_ZCc + `|["]).)+\\"|\\'(?:(?!` + e.src_ZCc + "|[']).)+\\'|\\'(?=" + e.src_pseudo_letter + "|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + e.src_ZCc + "|[.]|$)|" + (t["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + ",(?!" + e.src_ZCc + "|$)|;(?!" + e.src_ZCc + "|$)|\\!+(?!" + e.src_ZCc + "|[!]|$)|\\?(?!" + e.src_ZCc + "|[?]|$))+|\\/)?", e.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*', e.src_xn = "xn--[a-z0-9\\-]{1,59}", e.src_domain_root = // Allow letters & digits (http://test1)
    "(?:" + e.src_xn + "|" + e.src_pseudo_letter + "{1,63})", e.src_domain = "(?:" + e.src_xn + "|(?:" + e.src_pseudo_letter + ")|(?:" + e.src_pseudo_letter + "(?:-|" + e.src_pseudo_letter + "){0,61}" + e.src_pseudo_letter + "))", e.src_host = "(?:(?:(?:(?:" + e.src_domain + ")\\.)*" + e.src_domain + "))", e.tpl_host_fuzzy = "(?:" + e.src_ip4 + "|(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%)))", e.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%))", e.src_host_strict = e.src_host + e.src_host_terminator, e.tpl_host_fuzzy_strict = e.tpl_host_fuzzy + e.src_host_terminator, e.src_host_port_strict = e.src_host + e.src_port + e.src_host_terminator, e.tpl_host_port_fuzzy_strict = e.tpl_host_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_port_no_ip_fuzzy_strict = e.tpl_host_no_ip_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + e.src_ZPCc + "|>|$))", e.tpl_email_fuzzy = "(^|" + n + '|"|\\(|' + e.src_ZCc + ")(" + e.src_email_name + "@" + e.tpl_host_fuzzy_strict + ")", e.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
    // but can start with > (markdown blockquote)
    "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + e.src_ZPCc + "))((?![$+<=>^`|｜])" + e.tpl_host_port_fuzzy_strict + e.src_path + ")", e.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
    // but can start with > (markdown blockquote)
    "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + e.src_ZPCc + "))((?![$+<=>^`|｜])" + e.tpl_host_port_no_ip_fuzzy_strict + e.src_path + ")", e;
  }), as;
}
function As(t) {
  var e = Array.prototype.slice.call(arguments, 1);
  return e.forEach(function(n) {
    n && Object.keys(n).forEach(function(r) {
      t[r] = n[r];
    });
  }), t;
}
function Fr(t) {
  return Object.prototype.toString.call(t);
}
function zj(t) {
  return Fr(t) === "[object String]";
}
function Hj(t) {
  return Fr(t) === "[object Object]";
}
function Vj(t) {
  return Fr(t) === "[object RegExp]";
}
function Gc(t) {
  return Fr(t) === "[object Function]";
}
function Gj(t) {
  return t.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
var qa = {
  fuzzyLink: !0,
  fuzzyEmail: !0,
  fuzzyIP: !1
};
function jj(t) {
  return Object.keys(t || {}).reduce(function(e, n) {
    return e || qa.hasOwnProperty(n);
  }, !1);
}
var Kj = {
  "http:": {
    validate: function(t, e, n) {
      var r = t.slice(e);
      return n.re.http || (n.re.http = new RegExp(
        "^\\/\\/" + n.re.src_auth + n.re.src_host_port_strict + n.re.src_path,
        "i"
      )), n.re.http.test(r) ? r.match(n.re.http)[0].length : 0;
    }
  },
  "https:": "http:",
  "ftp:": "http:",
  "//": {
    validate: function(t, e, n) {
      var r = t.slice(e);
      return n.re.no_http || (n.re.no_http = new RegExp(
        "^" + n.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
        // with code comments
        "(?:localhost|(?:(?:" + n.re.src_domain + ")\\.)+" + n.re.src_domain_root + ")" + n.re.src_port + n.re.src_host_terminator + n.re.src_path,
        "i"
      )), n.re.no_http.test(r) ? e >= 3 && t[e - 3] === ":" || e >= 3 && t[e - 3] === "/" ? 0 : r.match(n.re.no_http)[0].length : 0;
    }
  },
  "mailto:": {
    validate: function(t, e, n) {
      var r = t.slice(e);
      return n.re.mailto || (n.re.mailto = new RegExp(
        "^" + n.re.src_email_name + "@" + n.re.src_host_strict,
        "i"
      )), n.re.mailto.test(r) ? r.match(n.re.mailto)[0].length : 0;
    }
  }
}, Zj = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", Wj = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function Jj(t) {
  t.__index__ = -1, t.__text_cache__ = "";
}
function Yj(t) {
  return function(e, n) {
    var r = e.slice(n);
    return t.test(r) ? r.match(t)[0].length : 0;
  };
}
function jc() {
  return function(t, e) {
    e.normalize(t);
  };
}
function hr(t) {
  var e = t.re = Uj()(t.__opts__), n = t.__tlds__.slice();
  t.onCompile(), t.__tlds_replaced__ || n.push(Zj), n.push(e.src_xn), e.src_tlds = n.join("|");
  function r(i) {
    return i.replace("%TLDS%", e.src_tlds);
  }
  e.email_fuzzy = RegExp(r(e.tpl_email_fuzzy), "i"), e.link_fuzzy = RegExp(r(e.tpl_link_fuzzy), "i"), e.link_no_ip_fuzzy = RegExp(r(e.tpl_link_no_ip_fuzzy), "i"), e.host_fuzzy_test = RegExp(r(e.tpl_host_fuzzy_test), "i");
  var s = [];
  t.__compiled__ = {};
  function o(i, a) {
    throw new Error('(LinkifyIt) Invalid schema "' + i + '": ' + a);
  }
  Object.keys(t.__schemas__).forEach(function(i) {
    var a = t.__schemas__[i];
    if (a !== null) {
      var l = { validate: null, link: null };
      if (t.__compiled__[i] = l, Hj(a)) {
        Vj(a.validate) ? l.validate = Yj(a.validate) : Gc(a.validate) ? l.validate = a.validate : o(i, a), Gc(a.normalize) ? l.normalize = a.normalize : a.normalize ? o(i, a) : l.normalize = jc();
        return;
      }
      if (zj(a)) {
        s.push(i);
        return;
      }
      o(i, a);
    }
  }), s.forEach(function(i) {
    t.__compiled__[t.__schemas__[i]] && (t.__compiled__[i].validate = t.__compiled__[t.__schemas__[i]].validate, t.__compiled__[i].normalize = t.__compiled__[t.__schemas__[i]].normalize);
  }), t.__compiled__[""] = { validate: null, normalize: jc() };
  var c = Object.keys(t.__compiled__).filter(function(i) {
    return i.length > 0 && t.__compiled__[i];
  }).map(Gj).join("|");
  t.re.schema_test = RegExp("(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + c + ")", "i"), t.re.schema_search = RegExp("(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + c + ")", "ig"), t.re.schema_at_start = RegExp("^" + t.re.schema_search.source, "i"), t.re.pretest = RegExp(
    "(" + t.re.schema_test.source + ")|(" + t.re.host_fuzzy_test.source + ")|@",
    "i"
  ), Jj(t);
}
function Xj(t, e) {
  var n = t.__index__, r = t.__last_index__, s = t.__text_cache__.slice(n, r);
  this.schema = t.__schema__.toLowerCase(), this.index = n + e, this.lastIndex = r + e, this.raw = s, this.text = s, this.url = s;
}
function Cs(t, e) {
  var n = new Xj(t, e);
  return t.__compiled__[n.schema].normalize(n, t), n;
}
function Be(t, e) {
  if (!(this instanceof Be))
    return new Be(t, e);
  e || jj(t) && (e = t, t = {}), this.__opts__ = As({}, qa, e), this.__index__ = -1, this.__last_index__ = -1, this.__schema__ = "", this.__text_cache__ = "", this.__schemas__ = As({}, Kj, t), this.__compiled__ = {}, this.__tlds__ = Wj, this.__tlds_replaced__ = !1, this.re = {}, hr(this);
}
Be.prototype.add = function(e, n) {
  return this.__schemas__[e] = n, hr(this), this;
};
Be.prototype.set = function(e) {
  return this.__opts__ = As(this.__opts__, e), this;
};
Be.prototype.test = function(e) {
  if (this.__text_cache__ = e, this.__index__ = -1, !e.length)
    return !1;
  var n, r, s, o, c, i, a, l, u;
  if (this.re.schema_test.test(e)) {
    for (a = this.re.schema_search, a.lastIndex = 0; (n = a.exec(e)) !== null; )
      if (o = this.testSchemaAt(e, n[2], a.lastIndex), o) {
        this.__schema__ = n[2], this.__index__ = n.index + n[1].length, this.__last_index__ = n.index + n[0].length + o;
        break;
      }
  }
  return this.__opts__.fuzzyLink && this.__compiled__["http:"] && (l = e.search(this.re.host_fuzzy_test), l >= 0 && (this.__index__ < 0 || l < this.__index__) && (r = e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null && (c = r.index + r[1].length, (this.__index__ < 0 || c < this.__index__) && (this.__schema__ = "", this.__index__ = c, this.__last_index__ = r.index + r[0].length))), this.__opts__.fuzzyEmail && this.__compiled__["mailto:"] && (u = e.indexOf("@"), u >= 0 && (s = e.match(this.re.email_fuzzy)) !== null && (c = s.index + s[1].length, i = s.index + s[0].length, (this.__index__ < 0 || c < this.__index__ || c === this.__index__ && i > this.__last_index__) && (this.__schema__ = "mailto:", this.__index__ = c, this.__last_index__ = i))), this.__index__ >= 0;
};
Be.prototype.pretest = function(e) {
  return this.re.pretest.test(e);
};
Be.prototype.testSchemaAt = function(e, n, r) {
  return this.__compiled__[n.toLowerCase()] ? this.__compiled__[n.toLowerCase()].validate(e, r, this) : 0;
};
Be.prototype.match = function(e) {
  var n = 0, r = [];
  this.__index__ >= 0 && this.__text_cache__ === e && (r.push(Cs(this, n)), n = this.__last_index__);
  for (var s = n ? e.slice(n) : e; this.test(s); )
    r.push(Cs(this, n)), s = s.slice(this.__last_index__), n += this.__last_index__;
  return r.length ? r : null;
};
Be.prototype.matchAtStart = function(e) {
  if (this.__text_cache__ = e, this.__index__ = -1, !e.length)
    return null;
  var n = this.re.schema_at_start.exec(e);
  if (!n)
    return null;
  var r = this.testSchemaAt(e, n[2], n[0].length);
  return r ? (this.__schema__ = n[2], this.__index__ = n.index + n[1].length, this.__last_index__ = n.index + n[0].length + r, Cs(this, 0)) : null;
};
Be.prototype.tlds = function(e, n) {
  return e = Array.isArray(e) ? e : [e], n ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function(r, s, o) {
    return r !== o[s - 1];
  }).reverse(), hr(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, hr(this), this);
};
Be.prototype.normalize = function(e) {
  e.schema || (e.url = "http://" + e.url), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = "mailto:" + e.url);
};
Be.prototype.onCompile = function() {
};
var Qj = Be;
const Yt = 2147483647, Ye = 36, lo = 1, Sn = 26, e7 = 38, t7 = 700, Fa = 72, Ba = 128, Pa = "-", n7 = /^xn--/, r7 = /[^\0-\x7F]/, s7 = /[\x2E\u3002\uFF0E\uFF61]/g, o7 = {
  overflow: "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
}, ls = Ye - lo, Xe = Math.floor, us = String.fromCharCode;
function pt(t) {
  throw new RangeError(o7[t]);
}
function c7(t, e) {
  const n = [];
  let r = t.length;
  for (; r--; )
    n[r] = e(t[r]);
  return n;
}
function $a(t, e) {
  const n = t.split("@");
  let r = "";
  n.length > 1 && (r = n[0] + "@", t = n[1]), t = t.replace(s7, ".");
  const s = t.split("."), o = c7(s, e).join(".");
  return r + o;
}
function uo(t) {
  const e = [];
  let n = 0;
  const r = t.length;
  for (; n < r; ) {
    const s = t.charCodeAt(n++);
    if (s >= 55296 && s <= 56319 && n < r) {
      const o = t.charCodeAt(n++);
      (o & 64512) == 56320 ? e.push(((s & 1023) << 10) + (o & 1023) + 65536) : (e.push(s), n--);
    } else
      e.push(s);
  }
  return e;
}
const Ua = (t) => String.fromCodePoint(...t), i7 = function(t) {
  return t >= 48 && t < 58 ? 26 + (t - 48) : t >= 65 && t < 91 ? t - 65 : t >= 97 && t < 123 ? t - 97 : Ye;
}, Kc = function(t, e) {
  return t + 22 + 75 * (t < 26) - ((e != 0) << 5);
}, za = function(t, e, n) {
  let r = 0;
  for (t = n ? Xe(t / t7) : t >> 1, t += Xe(t / e); t > ls * Sn >> 1; r += Ye)
    t = Xe(t / ls);
  return Xe(r + (ls + 1) * t / (t + e7));
}, fo = function(t) {
  const e = [], n = t.length;
  let r = 0, s = Ba, o = Fa, c = t.lastIndexOf(Pa);
  c < 0 && (c = 0);
  for (let i = 0; i < c; ++i)
    t.charCodeAt(i) >= 128 && pt("not-basic"), e.push(t.charCodeAt(i));
  for (let i = c > 0 ? c + 1 : 0; i < n; ) {
    const a = r;
    for (let u = 1, f = Ye; ; f += Ye) {
      i >= n && pt("invalid-input");
      const h = i7(t.charCodeAt(i++));
      h >= Ye && pt("invalid-input"), h > Xe((Yt - r) / u) && pt("overflow"), r += h * u;
      const d = f <= o ? lo : f >= o + Sn ? Sn : f - o;
      if (h < d)
        break;
      const m = Ye - d;
      u > Xe(Yt / m) && pt("overflow"), u *= m;
    }
    const l = e.length + 1;
    o = za(r - a, l, a == 0), Xe(r / l) > Yt - s && pt("overflow"), s += Xe(r / l), r %= l, e.splice(r++, 0, s);
  }
  return String.fromCodePoint(...e);
}, ho = function(t) {
  const e = [];
  t = uo(t);
  const n = t.length;
  let r = Ba, s = 0, o = Fa;
  for (const a of t)
    a < 128 && e.push(us(a));
  const c = e.length;
  let i = c;
  for (c && e.push(Pa); i < n; ) {
    let a = Yt;
    for (const u of t)
      u >= r && u < a && (a = u);
    const l = i + 1;
    a - r > Xe((Yt - s) / l) && pt("overflow"), s += (a - r) * l, r = a;
    for (const u of t)
      if (u < r && ++s > Yt && pt("overflow"), u === r) {
        let f = s;
        for (let h = Ye; ; h += Ye) {
          const d = h <= o ? lo : h >= o + Sn ? Sn : h - o;
          if (f < d)
            break;
          const m = f - d, _ = Ye - d;
          e.push(
            us(Kc(d + m % _, 0))
          ), f = Xe(m / _);
        }
        e.push(us(Kc(f, 0))), o = za(s, l, i === c), s = 0, ++i;
      }
    ++s, ++r;
  }
  return e.join("");
}, Ha = function(t) {
  return $a(t, function(e) {
    return n7.test(e) ? fo(e.slice(4).toLowerCase()) : e;
  });
}, Va = function(t) {
  return $a(t, function(e) {
    return r7.test(e) ? "xn--" + ho(e) : e;
  });
}, a7 = {
  /**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
  version: "2.3.1",
  /**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
  ucs2: {
    decode: uo,
    encode: Ua
  },
  decode: fo,
  encode: ho,
  toASCII: Va,
  toUnicode: Ha
}, l7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: fo,
  default: a7,
  encode: ho,
  toASCII: Va,
  toUnicode: Ha,
  ucs2decode: uo,
  ucs2encode: Ua
}, Symbol.toStringTag, { value: "Module" })), u7 = /* @__PURE__ */ Hf(l7);
var f7 = {
  options: {
    html: !1,
    // Enable HTML tags in source
    xhtmlOut: !1,
    // Use '/' to close single tags (<br />)
    breaks: !1,
    // Convert '\n' in paragraphs into <br>
    langPrefix: "language-",
    // CSS language prefix for fenced blocks
    linkify: !1,
    // autoconvert URL-like texts to links
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    maxNesting: 100
    // Internal protection, recursion limit
  },
  components: {
    core: {},
    block: {},
    inline: {}
  }
}, h7 = {
  options: {
    html: !1,
    // Enable HTML tags in source
    xhtmlOut: !1,
    // Use '/' to close single tags (<br />)
    breaks: !1,
    // Convert '\n' in paragraphs into <br>
    langPrefix: "language-",
    // CSS language prefix for fenced blocks
    linkify: !1,
    // autoconvert URL-like texts to links
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    maxNesting: 20
    // Internal protection, recursion limit
  },
  components: {
    core: {
      rules: [
        "normalize",
        "block",
        "inline",
        "text_join"
      ]
    },
    block: {
      rules: [
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "text"
      ],
      rules2: [
        "balance_pairs",
        "fragments_join"
      ]
    }
  }
}, p7 = {
  options: {
    html: !0,
    // Enable HTML tags in source
    xhtmlOut: !0,
    // Use '/' to close single tags (<br />)
    breaks: !1,
    // Convert '\n' in paragraphs into <br>
    langPrefix: "language-",
    // CSS language prefix for fenced blocks
    linkify: !1,
    // autoconvert URL-like texts to links
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    maxNesting: 20
    // Internal protection, recursion limit
  },
  components: {
    core: {
      rules: [
        "normalize",
        "block",
        "inline",
        "text_join"
      ]
    },
    block: {
      rules: [
        "blockquote",
        "code",
        "fence",
        "heading",
        "hr",
        "html_block",
        "lheading",
        "list",
        "reference",
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "autolink",
        "backticks",
        "emphasis",
        "entity",
        "escape",
        "html_inline",
        "image",
        "link",
        "newline",
        "text"
      ],
      rules2: [
        "balance_pairs",
        "emphasis",
        "fragments_join"
      ]
    }
  }
}, bn = le, d7 = Lr, g7 = iG, m7 = LG, _7 = uj, b7 = $j, v7 = Qj, Lt = rn, Ga = u7, y7 = {
  default: f7,
  zero: h7,
  commonmark: p7
}, x7 = /^(vbscript|javascript|file|data):/, E7 = /^data:image\/(gif|png|jpeg|webp);/;
function k7(t) {
  var e = t.trim().toLowerCase();
  return x7.test(e) ? !!E7.test(e) : !0;
}
var ja = ["http:", "https:", "mailto:"];
function w7(t) {
  var e = Lt.parse(t, !0);
  if (e.hostname && (!e.protocol || ja.indexOf(e.protocol) >= 0))
    try {
      e.hostname = Ga.toASCII(e.hostname);
    } catch {
    }
  return Lt.encode(Lt.format(e));
}
function A7(t) {
  var e = Lt.parse(t, !0);
  if (e.hostname && (!e.protocol || ja.indexOf(e.protocol) >= 0))
    try {
      e.hostname = Ga.toUnicode(e.hostname);
    } catch {
    }
  return Lt.decode(Lt.format(e), Lt.decode.defaultChars + "%");
}
function He(t, e) {
  if (!(this instanceof He))
    return new He(t, e);
  e || bn.isString(t) || (e = t || {}, t = "default"), this.inline = new b7(), this.block = new _7(), this.core = new m7(), this.renderer = new g7(), this.linkify = new v7(), this.validateLink = k7, this.normalizeLink = w7, this.normalizeLinkText = A7, this.utils = bn, this.helpers = bn.assign({}, d7), this.options = {}, this.configure(t), e && this.set(e);
}
He.prototype.set = function(t) {
  return bn.assign(this.options, t), this;
};
He.prototype.configure = function(t) {
  var e = this, n;
  if (bn.isString(t) && (n = t, t = y7[n], !t))
    throw new Error('Wrong `markdown-it` preset "' + n + '", check name');
  if (!t)
    throw new Error("Wrong `markdown-it` preset, can't be empty");
  return t.options && e.set(t.options), t.components && Object.keys(t.components).forEach(function(r) {
    t.components[r].rules && e[r].ruler.enableOnly(t.components[r].rules), t.components[r].rules2 && e[r].ruler2.enableOnly(t.components[r].rules2);
  }), this;
};
He.prototype.enable = function(t, e) {
  var n = [];
  Array.isArray(t) || (t = [t]), ["core", "block", "inline"].forEach(function(s) {
    n = n.concat(this[s].ruler.enable(t, !0));
  }, this), n = n.concat(this.inline.ruler2.enable(t, !0));
  var r = t.filter(function(s) {
    return n.indexOf(s) < 0;
  });
  if (r.length && !e)
    throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + r);
  return this;
};
He.prototype.disable = function(t, e) {
  var n = [];
  Array.isArray(t) || (t = [t]), ["core", "block", "inline"].forEach(function(s) {
    n = n.concat(this[s].ruler.disable(t, !0));
  }, this), n = n.concat(this.inline.ruler2.disable(t, !0));
  var r = t.filter(function(s) {
    return n.indexOf(s) < 0;
  });
  if (r.length && !e)
    throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + r);
  return this;
};
He.prototype.use = function(t) {
  var e = [this].concat(Array.prototype.slice.call(arguments, 1));
  return t.apply(t, e), this;
};
He.prototype.parse = function(t, e) {
  if (typeof t != "string")
    throw new Error("Input data should be a String");
  var n = new this.core.State(t, this, e);
  return this.core.process(n), n.tokens;
};
He.prototype.render = function(t, e) {
  return e = e || {}, this.renderer.render(this.parse(t, e), this.options, e);
};
He.prototype.parseInline = function(t, e) {
  var n = new this.core.State(t, this, e);
  return n.inlineMode = !0, this.core.process(n), n.tokens;
};
He.prototype.renderInline = function(t, e) {
  return e = e || {}, this.renderer.render(this.parseInline(t, e), this.options, e);
};
var C7 = He, S7 = C7;
const T7 = /* @__PURE__ */ Ys(S7), D7 = /* @__PURE__ */ Ve({
  name: "VueMarkdown",
  props: {
    source: {
      type: String,
      required: !0
    },
    options: {
      type: Object,
      required: !1
    },
    plugins: {
      type: Array,
      required: !1
    }
  },
  setup(t) {
    const e = Le(new T7(t.options ?? {}));
    for (const r of t.plugins ?? [])
      e.value.use(r);
    const n = Re(() => e.value.render(t.source));
    return () => Ki("div", { innerHTML: n.value });
  }
}), R7 = {
  key: 0,
  class: "chat-message-actions"
}, L7 = {
  key: 2,
  class: "chat-message-files"
}, Ss = /* @__PURE__ */ Ve({
  __name: "Message",
  props: {
    message: {}
  },
  setup(t, { expose: e }) {
    const n = t;
    nt.registerLanguage("javascript", ga), nt.registerLanguage("typescript", gd), nt.registerLanguage("python", pd), nt.registerLanguage("xml", ma), nt.registerLanguage("bash", hd);
    const { message: r } = Ml(n), { options: s } = Rn(), o = Le(null), c = Le({}), i = Re(() => r.value.text || "&lt;Empty response&gt;"), a = Re(() => ({
      "chat-message-from-user": r.value.sender === "user",
      "chat-message-from-bot": r.value.sender === "bot",
      "chat-message-transparent": r.value.transparent === !0
    })), l = (m) => {
      m.use(vd, {
        attrs: {
          target: "_blank",
          rel: "noopener"
        }
      });
    }, u = () => {
      var m;
      (m = o.value) != null && m.scrollIntoView && o.value.scrollIntoView({
        block: "center"
      });
    }, f = {
      highlight(m, _) {
        if (_ && nt.getLanguage(_))
          try {
            return nt.highlight(m, { language: _ }).value;
          } catch {
          }
        return "";
      }
    }, h = { ...(s == null ? void 0 : s.messageComponents) ?? {} };
    e({ scrollToView: u });
    const d = async (m) => await new Promise((_, R) => {
      const T = new FileReader();
      T.onload = () => _(T.result), T.onerror = R, T.readAsDataURL(m);
    });
    return vt(async () => {
      if (r.value.files)
        for (const m of r.value.files)
          try {
            const _ = await d(m);
            c.value[m.name] = _;
          } catch (_) {
            console.error("Error reading file:", _);
          }
    }), (m, _) => (Z(), ce("div", {
      ref_key: "messageContainer",
      ref: o,
      class: nn(["chat-message", a.value])
    }, [
      m.$slots.beforeMessage ? (Z(), ce("div", R7, [
        Mt(m.$slots, "beforeMessage", hs(Ks({ message: se(r) })))
      ])) : Fe("", !0),
      Mt(m.$slots, "default", {}, () => [
        se(r).type === "component" && h[se(r).key] ? (Z(), be(Zl(h[se(r).key]), hs(Vi({ key: 0 }, se(r).arguments)), null, 16)) : (Z(), be(se(D7), {
          key: 1,
          class: "chat-message-markdown",
          source: i.value,
          options: f,
          plugins: [l]
        }, null, 8, ["source", "plugins"])),
        (se(r).files ?? []).length > 0 ? (Z(), ce("div", L7, [
          (Z(!0), ce(Ae, null, rr(se(r).files ?? [], (R) => (Z(), ce("div", {
            key: R.name,
            class: "chat-message-file"
          }, [
            ge(_a, {
              file: R,
              "is-removable": !1,
              "is-previewable": !0
            }, null, 8, ["file"])
          ]))), 128))
        ])) : Fe("", !0)
      ])
    ], 2));
  }
}), N7 = /* @__PURE__ */ he("div", { class: "chat-message-typing-body" }, [
  /* @__PURE__ */ he("span", { class: "chat-message-typing-circle" }),
  /* @__PURE__ */ he("span", { class: "chat-message-typing-circle" }),
  /* @__PURE__ */ he("span", { class: "chat-message-typing-circle" })
], -1), I7 = /* @__PURE__ */ Ve({
  __name: "MessageTyping",
  props: {
    animation: { default: "bouncing" }
  },
  setup(t) {
    const e = t, n = {
      id: "typing",
      text: "",
      sender: "bot",
      createdAt: ""
    }, r = Le(), s = Re(() => ({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "chat-message-typing": !0,
      [`chat-message-typing-animation-${e.animation}`]: !0
    }));
    return vt(() => {
      var o;
      (o = r.value) == null || o.scrollToView();
    }), (o, c) => (Z(), be(se(Ss), {
      ref_key: "messageContainer",
      ref: r,
      class: nn(s.value),
      message: n
    }, {
      default: st(() => [
        N7
      ]),
      _: 1
    }, 8, ["class"]));
  }
}), M7 = { class: "chat-messages-list" }, O7 = /* @__PURE__ */ Ve({
  __name: "MessagesList",
  props: {
    messages: {}
  },
  setup(t) {
    const e = no(), n = Le([]), { initialMessages: r, waitingForResponse: s } = e;
    return Jn(
      () => n.value.length,
      () => {
        const o = n.value[n.value.length - 1];
        o && o.scrollToView();
      }
    ), (o, c) => (Z(), ce("div", M7, [
      (Z(!0), ce(Ae, null, rr(se(r), (i) => (Z(), be(Ss, {
        key: i.id,
        message: i
      }, null, 8, ["message"]))), 128)),
      (Z(!0), ce(Ae, null, rr(o.messages, (i) => (Z(), be(Ss, {
        key: i.id,
        ref_for: !0,
        ref_key: "messageComponents",
        ref: n,
        message: i
      }, {
        beforeMessage: st(({ message: a }) => [
          Mt(o.$slots, "beforeMessage", hs(Ks({ message: a })))
        ]),
        _: 2
      }, 1032, ["message"]))), 128)),
      se(s) ? (Z(), be(I7, { key: 0 })) : Fe("", !0)
    ]));
  }
}), q7 = { class: "chat-heading" }, F7 = ["title"], B7 = { key: 0 }, Ka = /* @__PURE__ */ Ve({
  __name: "Chat",
  setup(t) {
    const { t: e } = Tr(), n = no(), { messages: r, currentSessionId: s } = n, { options: o } = Rn(), c = Re(() => o.mode === "window" && o.showWindowCloseButton);
    async function i() {
      n.startNewSession && (n.startNewSession(), Qt(() => {
        Ie.emit("scrollToBottom");
      }));
    }
    async function a() {
      n.loadPreviousSession && (await n.loadPreviousSession(), Qt(() => {
        Ie.emit("scrollToBottom");
      }));
    }
    function l() {
      Ie.emit("close");
    }
    return vt(async () => {
      await a(), !o.showWelcomeScreen && !s.value && await i();
    }), (u, f) => (Z(), be(fd, { class: "chat-wrapper" }, {
      header: st(() => [
        he("div", q7, [
          he("h1", null, vn(se(e)("title")), 1),
          c.value ? (Z(), ce("button", {
            key: 0,
            class: "chat-close-button",
            title: se(e)("closeButtonTooltip"),
            onClick: l
          }, [
            ge(se(Wh), {
              height: "18",
              width: "18"
            })
          ], 8, F7)) : Fe("", !0)
        ]),
        se(e)("subtitle") ? (Z(), ce("p", B7, vn(se(e)("subtitle")), 1)) : Fe("", !0)
      ]),
      footer: st(() => [
        se(s) ? (Z(), be(id, { key: 0 })) : (Z(), be(op, { key: 1 }))
      ]),
      default: st(() => [
        !se(s) && se(o).showWelcomeScreen ? (Z(), be(Yh, {
          key: 0,
          "onClick:button": i
        })) : (Z(), be(O7, {
          key: 1,
          messages: se(r)
        }, null, 8, ["messages"]))
      ]),
      _: 1
    }));
  }
}), P7 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
}, $7 = /* @__PURE__ */ he("path", {
  fill: "currentColor",
  d: "M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8"
}, null, -1), U7 = [
  $7
];
function z7(t, e) {
  return Z(), ce("svg", P7, [...U7]);
}
const H7 = { name: "mdi-chat", render: z7 }, V7 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
}, G7 = /* @__PURE__ */ he("path", {
  fill: "currentColor",
  d: "M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"
}, null, -1), j7 = [
  G7
];
function K7(t, e) {
  return Z(), ce("svg", V7, [...j7]);
}
const Z7 = { name: "mdi-chevron-down", render: K7 }, W7 = { class: "chat-window-wrapper" }, J7 = { class: "chat-window" }, Y7 = /* @__PURE__ */ Ve({
  __name: "ChatWindow",
  setup(t) {
    const e = Le(!1);
    function n() {
      e.value = !e.value, e.value && Qt(() => {
        Ie.emit("scrollToBottom");
      });
    }
    return (r, s) => (Z(), ce("div", W7, [
      ge(ir, { name: "chat-window-transition" }, {
        default: st(() => [
          Si(he("div", J7, [
            ge(Ka)
          ], 512), [
            [tf, e.value]
          ])
        ]),
        _: 1
      }),
      he("div", {
        class: "chat-window-toggle",
        onClick: n
      }, [
        ge(ir, {
          name: "chat-window-toggle-transition",
          mode: "out-in"
        }, {
          default: st(() => [
            e.value ? (Z(), be(se(Z7), {
              key: 1,
              height: "32",
              width: "32"
            })) : (Z(), be(se(H7), {
              key: 0,
              height: "32",
              width: "32"
            }))
          ]),
          _: 1
        })
      ])
    ]));
  }
}), X7 = /* @__PURE__ */ Ve({
  __name: "App",
  props: {},
  setup(t) {
    const { options: e } = Rn(), n = Re(() => e.mode === "fullscreen");
    return vt(() => {
      nt.registerLanguage("xml", ma), nt.registerLanguage("javascript", ga);
    }), (r, s) => n.value ? (Z(), be(se(Ka), {
      key: 0,
      class: "n8n-chat"
    })) : (Z(), be(se(Y7), {
      key: 1,
      class: "n8n-chat"
    }));
  }
});
var globalWebHook;
function Q7(t) {
  globalWebHook = t;
  var s, o;
  const e = {
    ...un,
    ...t,
    webhookConfig: {
      ...un.webhookConfig,
      ...t == null ? void 0 : t.webhookConfig
    },
    i18n: {
      ...un.i18n,
      ...t == null ? void 0 : t.i18n,
      en: {
        ...(s = un.i18n) == null ? void 0 : s.en,
        ...(o = t == null ? void 0 : t.i18n) == null ? void 0 : o.en
      }
    },
    theme: {
      ...un.theme,
      ...t == null ? void 0 : t.theme
    }
  }, n = e.target ?? Rf;
  typeof n == "string" && Uf(n);
  const r = Sf(X7);
  return r.use(zf, e), r.mount(n), r;
}
export {
  Q7 as createChat
};