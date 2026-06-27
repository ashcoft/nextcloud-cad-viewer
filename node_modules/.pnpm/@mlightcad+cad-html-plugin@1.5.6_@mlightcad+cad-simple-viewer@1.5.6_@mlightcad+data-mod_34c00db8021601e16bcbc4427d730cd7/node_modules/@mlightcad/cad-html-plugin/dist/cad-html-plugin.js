import { isHighlightOverlayDescendant as tn, isHighlightCloneDrawable as nn, AcTrBatchedLine as vt, AcTrBatchedLine2 as rn, AcTrBatchedMesh as wt, AcTrBatchedPoint as on, isObjectHierarchyVisible as an, getMaterialMetadata as sn, isBatchGeometryActive as ln, isBatchGeometryVisible as cn } from "@mlightcad/three-renderer";
import * as F from "three";
import { LineMaterial as dn } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 as un } from "three/examples/jsm/lines/LineSegments2.js";
import { AcDbTable as fn, AcDbDimension as gn, AcDbCircle as hn, AcDbArc as mn, AcDbEllipse as lt, AcDbSpline as pn, AcDbPolyline as vn, AcDb2dPolyline as wn, AcDb3dPolyline as bn, AcDbHatch as xn, AcDbRay as yn, AcDbXline as An, AcDbTrace as Mn, AcDbFace as kn, AcDbLeader as Cn, AcDbMLine as Sn, AcDbMLeader as Ln, AcDbText as En, AcDbMText as In, AcDbRasterImage as Bn, AcDbPoint as Fn, AcDbLine as zn, AcGeTol as Ie, FLOAT_TOL as Ht, TAU as xe, AcGeCircArc2d as he, AcGePolyline2d as Tn, AcGeLoop2d as _n, AcGeLine2d as Dt, AcGeEllipseArc2d as Rt, AcGePoint2d as Ot, AcGeNurbsCurve as Pn } from "@mlightcad/data-model";
import { yieldToMain as X, AcApI18n as B, AcTrView2d as Un, AcApDocManager as Ce, getDrawingExportBaseName as Hn, resolveExportDownloadName as Dn, AcEdCommand as Rn, AcEdPromptKeywordOptions as bt, AcEdPromptStatus as ne, AcEdCommandStack as On } from "@mlightcad/cad-simple-viewer";
import { HTML_PLUGIN_NAME as xa, HTML_PLUGIN_TRIGGERS as ya } from "./cad-html-plugin-register.js";
const ie = 2;
var k = Uint8Array, $ = Uint16Array, ct = Int32Array, Be = new k([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]), Fe = new k([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]), Ve = new k([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Nt = function(e, t) {
  for (var n = new $(31), r = 0; r < 31; ++r)
    n[r] = t += 1 << e[r - 1];
  for (var o = new ct(n[30]), r = 1; r < 30; ++r)
    for (var a = n[r]; a < n[r + 1]; ++a)
      o[a] = a - n[r] << 5 | r;
  return { b: n, r: o };
}, Vt = Nt(Be, 2), jt = Vt.b, je = Vt.r;
jt[28] = 258, je[258] = 28;
var $t = Nt(Fe, 0), Nn = $t.b, xt = $t.r, $e = new $(32768);
for (var b = 0; b < 32768; ++b) {
  var re = (b & 43690) >> 1 | (b & 21845) << 1;
  re = (re & 52428) >> 2 | (re & 13107) << 2, re = (re & 61680) >> 4 | (re & 3855) << 4, $e[b] = ((re & 65280) >> 8 | (re & 255) << 8) >> 1;
}
var K = function(e, t, n) {
  for (var r = e.length, o = 0, a = new $(t); o < r; ++o)
    e[o] && ++a[e[o] - 1];
  var i = new $(t);
  for (o = 1; o < t; ++o)
    i[o] = i[o - 1] + a[o - 1] << 1;
  var s;
  if (n) {
    s = new $(1 << t);
    var l = 15 - t;
    for (o = 0; o < r; ++o)
      if (e[o])
        for (var c = o << 4 | e[o], d = t - e[o], u = i[e[o] - 1]++ << d, f = u | (1 << d) - 1; u <= f; ++u)
          s[$e[u] >> l] = c;
  } else
    for (s = new $(r), o = 0; o < r; ++o)
      e[o] && (s[o] = $e[i[e[o] - 1]++] >> 15 - e[o]);
  return s;
}, oe = new k(288);
for (var b = 0; b < 144; ++b)
  oe[b] = 8;
for (var b = 144; b < 256; ++b)
  oe[b] = 9;
for (var b = 256; b < 280; ++b)
  oe[b] = 7;
for (var b = 280; b < 288; ++b)
  oe[b] = 8;
var Ae = new k(32);
for (var b = 0; b < 32; ++b)
  Ae[b] = 5;
var Vn = /* @__PURE__ */ K(oe, 9, 0), jn = /* @__PURE__ */ K(oe, 9, 1), $n = /* @__PURE__ */ K(Ae, 5, 0), Gn = /* @__PURE__ */ K(Ae, 5, 1), Pe = function(e) {
  for (var t = e[0], n = 1; n < e.length; ++n)
    e[n] > t && (t = e[n]);
  return t;
}, W = function(e, t, n) {
  var r = t / 8 | 0;
  return (e[r] | e[r + 1] << 8) >> (t & 7) & n;
}, Ue = function(e, t) {
  var n = t / 8 | 0;
  return (e[n] | e[n + 1] << 8 | e[n + 2] << 16) >> (t & 7);
}, dt = function(e) {
  return (e + 7) / 8 | 0;
}, ze = function(e, t, n) {
  return (t == null || t < 0) && (t = 0), (n == null || n > e.length) && (n = e.length), new k(e.subarray(t, n));
}, Zn = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
], Y = function(e, t, n) {
  var r = new Error(t || Zn[e]);
  if (r.code = e, Error.captureStackTrace && Error.captureStackTrace(r, Y), !n)
    throw r;
  return r;
}, Yn = function(e, t, n, r) {
  var o = e.length, a = 0;
  if (!o || t.f && !t.l)
    return n || new k(0);
  var i = !n, s = i || t.i != 2, l = t.i;
  i && (n = new k(o * 3));
  var c = function(pe) {
    var ve = n.length;
    if (pe > ve) {
      var ce = new k(Math.max(ve * 2, pe));
      ce.set(n), n = ce;
    }
  }, d = t.f || 0, u = t.p || 0, f = t.b || 0, g = t.l, p = t.d, h = t.m, w = t.n, H = o * 8;
  do {
    if (!g) {
      d = W(e, u, 1);
      var O = W(e, u + 1, 3);
      if (u += 3, O)
        if (O == 1)
          g = jn, p = Gn, h = 9, w = 5;
        else if (O == 2) {
          var U = W(e, u, 31) + 257, S = W(e, u + 10, 15) + 4, v = U + W(e, u + 5, 31) + 1;
          u += 14;
          for (var m = new k(v), L = new k(19), M = 0; M < S; ++M)
            L[Ve[M]] = W(e, u + M * 3, 7);
          u += S * 3;
          for (var T = Pe(L), te = (1 << T) - 1, N = K(L, T, 1), M = 0; M < v; ) {
            var D = N[W(e, u, te)];
            u += D & 15;
            var C = D >> 4;
            if (C < 16)
              m[M++] = C;
            else {
              var E = 0, x = 0;
              for (C == 16 ? (x = 3 + W(e, u, 3), u += 2, E = m[M - 1]) : C == 17 ? (x = 3 + W(e, u, 7), u += 3) : C == 18 && (x = 11 + W(e, u, 127), u += 7); x--; )
                m[M++] = E;
            }
          }
          var R = m.subarray(0, U), I = m.subarray(U);
          h = Pe(R), w = Pe(I), g = K(R, h, 1), p = K(I, w, 1);
        } else
          Y(1);
      else {
        var C = dt(u) + 4, P = e[C - 4] | e[C - 3] << 8, z = C + P;
        if (z > o) {
          l && Y(0);
          break;
        }
        s && c(f + P), n.set(e.subarray(C, z), f), t.b = f += P, t.p = u = z * 8, t.f = d;
        continue;
      }
      if (u > H) {
        l && Y(0);
        break;
      }
    }
    s && c(f + 131072);
    for (var me = (1 << h) - 1, G = (1 << w) - 1, q = u; ; q = u) {
      var E = g[Ue(e, u) & me], V = E >> 4;
      if (u += E & 15, u > H) {
        l && Y(0);
        break;
      }
      if (E || Y(2), V < 256)
        n[f++] = V;
      else if (V == 256) {
        q = u, g = null;
        break;
      } else {
        var j = V - 254;
        if (V > 264) {
          var M = V - 257, y = Be[M];
          j = W(e, u, (1 << y) - 1) + jt[M], u += y;
        }
        var J = p[Ue(e, u) & G], se = J >> 4;
        J || Y(3), u += J & 15;
        var I = Nn[se];
        if (se > 3) {
          var y = Fe[se];
          I += Ue(e, u) & (1 << y) - 1, u += y;
        }
        if (u > H) {
          l && Y(0);
          break;
        }
        s && c(f + 131072);
        var le = f + j;
        if (f < I) {
          var Me = a - I, ke = Math.min(I, le);
          for (Me + f < 0 && Y(3); f < ke; ++f)
            n[f] = r[Me + f];
        }
        for (; f < le; ++f)
          n[f] = n[f - I];
      }
    }
    t.l = g, t.p = q, t.b = f, t.f = d, g && (d = 1, t.m = h, t.d = p, t.n = w);
  } while (!d);
  return f != n.length && i ? ze(n, 0, f) : n.subarray(0, f);
}, Q = function(e, t, n) {
  n <<= t & 7;
  var r = t / 8 | 0;
  e[r] |= n, e[r + 1] |= n >> 8;
}, we = function(e, t, n) {
  n <<= t & 7;
  var r = t / 8 | 0;
  e[r] |= n, e[r + 1] |= n >> 8, e[r + 2] |= n >> 16;
}, He = function(e, t) {
  for (var n = [], r = 0; r < e.length; ++r)
    e[r] && n.push({ s: r, f: e[r] });
  var o = n.length, a = n.slice();
  if (!o)
    return { t: Zt, l: 0 };
  if (o == 1) {
    var i = new k(n[0].s + 1);
    return i[n[0].s] = 1, { t: i, l: 1 };
  }
  n.sort(function(z, U) {
    return z.f - U.f;
  }), n.push({ s: -1, f: 25001 });
  var s = n[0], l = n[1], c = 0, d = 1, u = 2;
  for (n[0] = { s: -1, f: s.f + l.f, l: s, r: l }; d != o - 1; )
    s = n[n[c].f < n[u].f ? c++ : u++], l = n[c != d && n[c].f < n[u].f ? c++ : u++], n[d++] = { s: -1, f: s.f + l.f, l: s, r: l };
  for (var f = a[0].s, r = 1; r < o; ++r)
    a[r].s > f && (f = a[r].s);
  var g = new $(f + 1), p = Ge(n[d - 1], g, 0);
  if (p > t) {
    var r = 0, h = 0, w = p - t, H = 1 << w;
    for (a.sort(function(U, S) {
      return g[S.s] - g[U.s] || U.f - S.f;
    }); r < o; ++r) {
      var O = a[r].s;
      if (g[O] > t)
        h += H - (1 << p - g[O]), g[O] = t;
      else
        break;
    }
    for (h >>= w; h > 0; ) {
      var C = a[r].s;
      g[C] < t ? h -= 1 << t - g[C]++ - 1 : ++r;
    }
    for (; r >= 0 && h; --r) {
      var P = a[r].s;
      g[P] == t && (--g[P], ++h);
    }
    p = t;
  }
  return { t: new k(g), l: p };
}, Ge = function(e, t, n) {
  return e.s == -1 ? Math.max(Ge(e.l, t, n + 1), Ge(e.r, t, n + 1)) : t[e.s] = n;
}, yt = function(e) {
  for (var t = e.length; t && !e[--t]; )
    ;
  for (var n = new $(++t), r = 0, o = e[0], a = 1, i = function(l) {
    n[r++] = l;
  }, s = 1; s <= t; ++s)
    if (e[s] == o && s != t)
      ++a;
    else {
      if (!o && a > 2) {
        for (; a > 138; a -= 138)
          i(32754);
        a > 2 && (i(a > 10 ? a - 11 << 5 | 28690 : a - 3 << 5 | 12305), a = 0);
      } else if (a > 3) {
        for (i(o), --a; a > 6; a -= 6)
          i(8304);
        a > 2 && (i(a - 3 << 5 | 8208), a = 0);
      }
      for (; a--; )
        i(o);
      a = 1, o = e[s];
    }
  return { c: n.subarray(0, r), n: t };
}, be = function(e, t) {
  for (var n = 0, r = 0; r < t.length; ++r)
    n += e[r] * t[r];
  return n;
}, Gt = function(e, t, n) {
  var r = n.length, o = dt(t + 2);
  e[o] = r & 255, e[o + 1] = r >> 8, e[o + 2] = e[o] ^ 255, e[o + 3] = e[o + 1] ^ 255;
  for (var a = 0; a < r; ++a)
    e[o + a + 4] = n[a];
  return (o + 4 + r) * 8;
}, At = function(e, t, n, r, o, a, i, s, l, c, d) {
  Q(t, d++, n), ++o[256];
  for (var u = He(o, 15), f = u.t, g = u.l, p = He(a, 15), h = p.t, w = p.l, H = yt(f), O = H.c, C = H.n, P = yt(h), z = P.c, U = P.n, S = new $(19), v = 0; v < O.length; ++v)
    ++S[O[v] & 31];
  for (var v = 0; v < z.length; ++v)
    ++S[z[v] & 31];
  for (var m = He(S, 7), L = m.t, M = m.l, T = 19; T > 4 && !L[Ve[T - 1]]; --T)
    ;
  var te = c + 5 << 3, N = be(o, oe) + be(a, Ae) + i, D = be(o, f) + be(a, h) + i + 14 + 3 * T + be(S, L) + 2 * S[16] + 3 * S[17] + 7 * S[18];
  if (l >= 0 && te <= N && te <= D)
    return Gt(t, d, e.subarray(l, l + c));
  var E, x, R, I;
  if (Q(t, d, 1 + (D < N)), d += 2, D < N) {
    E = K(f, g, 0), x = f, R = K(h, w, 0), I = h;
    var me = K(L, M, 0);
    Q(t, d, C - 257), Q(t, d + 5, U - 1), Q(t, d + 10, T - 4), d += 14;
    for (var v = 0; v < T; ++v)
      Q(t, d + 3 * v, L[Ve[v]]);
    d += 3 * T;
    for (var G = [O, z], q = 0; q < 2; ++q)
      for (var V = G[q], v = 0; v < V.length; ++v) {
        var j = V[v] & 31;
        Q(t, d, me[j]), d += L[j], j > 15 && (Q(t, d, V[v] >> 5 & 127), d += V[v] >> 12);
      }
  } else
    E = Vn, x = oe, R = $n, I = Ae;
  for (var v = 0; v < s; ++v) {
    var y = r[v];
    if (y > 255) {
      var j = y >> 18 & 31;
      we(t, d, E[j + 257]), d += x[j + 257], j > 7 && (Q(t, d, y >> 23 & 31), d += Be[j]);
      var J = y & 31;
      we(t, d, R[J]), d += I[J], J > 3 && (we(t, d, y >> 5 & 8191), d += Fe[J]);
    } else
      we(t, d, E[y]), d += x[y];
  }
  return we(t, d, E[256]), d + x[256];
}, Wn = /* @__PURE__ */ new ct([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), Zt = /* @__PURE__ */ new k(0), Xn = function(e, t, n, r, o, a) {
  var i = a.z || e.length, s = new k(r + i + 5 * (1 + Math.ceil(i / 7e3)) + o), l = s.subarray(r, s.length - o), c = a.l, d = (a.r || 0) & 7;
  if (t) {
    d && (l[0] = a.r >> 3);
    for (var u = Wn[t - 1], f = u >> 13, g = u & 8191, p = (1 << n) - 1, h = a.p || new $(32768), w = a.h || new $(p + 1), H = Math.ceil(n / 3), O = 2 * H, C = function(_e) {
      return (e[_e] ^ e[_e + 1] << H ^ e[_e + 2] << O) & p;
    }, P = new ct(25e3), z = new $(288), U = new $(32), S = 0, v = 0, m = a.i || 0, L = 0, M = a.w || 0, T = 0; m + 2 < i; ++m) {
      var te = C(m), N = m & 32767, D = w[te];
      if (h[N] = D, w[te] = N, M <= m) {
        var E = i - m;
        if ((S > 7e3 || L > 24576) && (E > 423 || !c)) {
          d = At(e, l, 0, P, z, U, v, L, T, m - T, d), L = S = v = 0, T = m;
          for (var x = 0; x < 286; ++x)
            z[x] = 0;
          for (var x = 0; x < 30; ++x)
            U[x] = 0;
        }
        var R = 2, I = 0, me = g, G = N - D & 32767;
        if (E > 2 && te == C(m - G))
          for (var q = Math.min(f, E) - 1, V = Math.min(32767, m), j = Math.min(258, E); G <= V && --me && N != D; ) {
            if (e[m + R] == e[m + R - G]) {
              for (var y = 0; y < j && e[m + y] == e[m + y - G]; ++y)
                ;
              if (y > R) {
                if (R = y, I = G, y > q)
                  break;
                for (var J = Math.min(G, y - 2), se = 0, x = 0; x < J; ++x) {
                  var le = m - G + x & 32767, Me = h[le], ke = le - Me & 32767;
                  ke > se && (se = ke, D = le);
                }
              }
            }
            N = D, D = h[N], G += N - D & 32767;
          }
        if (I) {
          P[L++] = 268435456 | je[R] << 18 | xt[I];
          var pe = je[R] & 31, ve = xt[I] & 31;
          v += Be[pe] + Fe[ve], ++z[257 + pe], ++U[ve], M = m + R, ++S;
        } else
          P[L++] = e[m], ++z[e[m]];
      }
    }
    for (m = Math.max(m, M); m < i; ++m)
      P[L++] = e[m], ++z[e[m]];
    d = At(e, l, c, P, z, U, v, L, T, m - T, d), c || (a.r = d & 7 | l[d / 8 | 0] << 3, d -= 7, a.h = w, a.p = h, a.i = m, a.w = M);
  } else {
    for (var m = a.w || 0; m < i + c; m += 65535) {
      var ce = m + 65535;
      ce >= i && (l[d / 8 | 0] = c, ce = i), d = Gt(l, d + 1, e.subarray(m, ce));
    }
    a.i = i;
  }
  return ze(s, 0, r + dt(d) + o);
}, Jn = /* @__PURE__ */ function() {
  for (var e = new Int32Array(256), t = 0; t < 256; ++t) {
    for (var n = t, r = 9; --r; )
      n = (n & 1 && -306674912) ^ n >>> 1;
    e[t] = n;
  }
  return e;
}(), Kn = function() {
  var e = -1;
  return {
    p: function(t) {
      for (var n = e, r = 0; r < t.length; ++r)
        n = Jn[n & 255 ^ t[r]] ^ n >>> 8;
      e = n;
    },
    d: function() {
      return ~e;
    }
  };
}, qn = function(e, t, n, r, o) {
  if (!o && (o = { l: 1 }, t.dictionary)) {
    var a = t.dictionary.subarray(-32768), i = new k(a.length + e.length);
    i.set(a), i.set(e, a.length), e = i, o.w = a.length;
  }
  return Xn(e, t.level == null ? 6 : t.level, t.mem == null ? o.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(e.length))) * 1.5) : 20 : 12 + t.mem, n, r, o);
}, Ze = function(e, t, n) {
  for (; n; ++t)
    e[t] = n, n >>>= 8;
}, Qn = function(e, t) {
  var n = t.filename;
  if (e[0] = 31, e[1] = 139, e[2] = 8, e[8] = t.level < 2 ? 4 : t.level == 9 ? 2 : 0, e[9] = 3, t.mtime != 0 && Ze(e, 4, Math.floor(new Date(t.mtime || Date.now()) / 1e3)), n) {
    e[3] = 8;
    for (var r = 0; r <= n.length; ++r)
      e[r + 10] = n.charCodeAt(r);
  }
}, er = function(e) {
  (e[0] != 31 || e[1] != 139 || e[2] != 8) && Y(6, "invalid gzip data");
  var t = e[3], n = 10;
  t & 4 && (n += (e[10] | e[11] << 8) + 2);
  for (var r = (t >> 3 & 1) + (t >> 4 & 1); r > 0; r -= !e[n++])
    ;
  return n + (t & 2);
}, tr = function(e) {
  var t = e.length;
  return (e[t - 4] | e[t - 3] << 8 | e[t - 2] << 16 | e[t - 1] << 24) >>> 0;
}, nr = function(e) {
  return 10 + (e.filename ? e.filename.length + 1 : 0);
};
function rr(e, t) {
  t || (t = {});
  var n = Kn(), r = e.length;
  n.p(e);
  var o = qn(e, t, nr(t), 8), a = o.length;
  return Qn(o, t), Ze(o, a - 8, n.d()), Ze(o, a - 4, r), o;
}
function or(e, t) {
  var n = er(e);
  return n + 8 > e.length && Y(6, "invalid gzip data"), Yn(e.subarray(n, -8), { i: 2 }, new k(tr(e)), t);
}
var Mt = typeof TextEncoder < "u" && /* @__PURE__ */ new TextEncoder(), Ye = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), ar = 0;
try {
  Ye.decode(Zt, { stream: !0 }), ar = 1;
} catch {
}
var ir = function(e) {
  for (var t = "", n = 0; ; ) {
    var r = e[n++], o = (r > 127) + (r > 223) + (r > 239);
    if (n + o > e.length)
      return { s: t, r: ze(e, n - 1) };
    o ? o == 3 ? (r = ((r & 15) << 18 | (e[n++] & 63) << 12 | (e[n++] & 63) << 6 | e[n++] & 63) - 65536, t += String.fromCharCode(55296 | r >> 10, 56320 | r & 1023)) : o & 1 ? t += String.fromCharCode((r & 31) << 6 | e[n++] & 63) : t += String.fromCharCode((r & 15) << 12 | (e[n++] & 63) << 6 | e[n++] & 63) : t += String.fromCharCode(r);
  }
};
function sr(e, t) {
  var n;
  if (Mt)
    return Mt.encode(e);
  for (var r = e.length, o = new k(e.length + (e.length >> 1)), a = 0, i = function(c) {
    o[a++] = c;
  }, n = 0; n < r; ++n) {
    if (a + 5 > o.length) {
      var s = new k(a + 8 + (r - n << 1));
      s.set(o), o = s;
    }
    var l = e.charCodeAt(n);
    l < 128 || t ? i(l) : l < 2048 ? (i(192 | l >> 6), i(128 | l & 63)) : l > 55295 && l < 57344 ? (l = 65536 + (l & 1047552) | e.charCodeAt(++n) & 1023, i(240 | l >> 18), i(128 | l >> 12 & 63), i(128 | l >> 6 & 63), i(128 | l & 63)) : (i(224 | l >> 12), i(128 | l >> 6 & 63), i(128 | l & 63));
  }
  return ze(o, 0, a);
}
function lr(e, t) {
  var n;
  if (Ye)
    return Ye.decode(e);
  var r = ir(e), o = r.s, n = r.r;
  return n.length && Y(8), o;
}
const Yt = 1480934209, We = 1, Xe = 2, Je = 4, Ke = 8, qe = 1, Qe = 2, et = 4, tt = 8, nt = 16, Wt = 32;
function cr(e) {
  if (e.version !== ie)
    throw new Error(`Unsupported snapshot version: ${e.version}`);
  const t = new vr();
  t.writeU32(Yt), t.writeU8(ie), t.writeU8(0), t.writeU8(0), t.writeU8(0), t.writeJson(e.meta), t.writeJson(e.layers), t.writeString(e.activeLayoutBtrId), t.writeU32(e.layouts.length);
  for (const n of e.layouts)
    ur(t, n);
  return t.toUint8Array();
}
function dr(e) {
  const t = new wr(e);
  if (t.readU32() !== Yt)
    throw new Error("Invalid snapshot magic");
  const r = t.readU8();
  if (t.readU8(), t.readU8(), t.readU8(), r !== ie)
    throw new Error(`Unsupported snapshot version: ${r}`);
  const o = t.readJson(), a = t.readJson(), i = t.readString(), s = t.readU32(), l = [];
  for (let c = 0; c < s; c++)
    l.push(fr(t));
  return {
    version: ie,
    meta: o,
    layers: a,
    layouts: l,
    activeLayoutBtrId: i
  };
}
function ur(e, t) {
  e.writeString(t.btrId), e.writeString(t.name), e.writeU8(t.isModelSpace ? 1 : 0), e.writeJson(t.osnap ?? null), e.writeU32(t.lineBatches.length);
  for (const n of t.lineBatches)
    gr(e, n);
  e.writeU32(t.meshBatches.length);
  for (const n of t.meshBatches)
    mr(e, n);
}
function fr(e) {
  const t = e.readString(), n = e.readString(), r = e.readU8() !== 0, a = e.readJson() ?? void 0, i = e.readU32(), s = [];
  for (let d = 0; d < i; d++)
    s.push(hr(e));
  const l = e.readU32(), c = [];
  for (let d = 0; d < l; d++)
    c.push(pr(e));
  return { btrId: t, name: n, isModelSpace: r, lineBatches: s, meshBatches: c, osnap: a };
}
function gr(e, t) {
  e.writeString(t.layer), e.writeU32(t.color >>> 0), e.writeF64(t.offset[0]), e.writeF64(t.offset[1]), e.writeF64(t.offset[2]), e.writeFloat32Array(t.positions);
  let n = 0;
  t.indices && t.indices.length > 0 && (n |= We), t.linePattern && (n |= Xe), t.lineDistances && t.lineDistances.length > 0 && (n |= Je), t.lineWidth != null && t.lineWidth > 0 && (n |= Ke), e.writeU8(n), n & We && e.writeUint32Array(t.indices), n & Xe && e.writeJson(t.linePattern), n & Je && e.writeFloat32Array(t.lineDistances), n & Ke && e.writeF32(t.lineWidth);
}
function hr(e) {
  const t = e.readString(), n = e.readU32(), r = [
    e.readF64(),
    e.readF64(),
    e.readF64()
  ], o = e.readFloat32Array(), a = e.readU8(), i = { layer: t, color: n, offset: r, positions: o };
  return a & We && (i.indices = e.readUint32Array()), a & Xe && (i.linePattern = e.readJson()), a & Je && (i.lineDistances = e.readFloat32Array()), a & Ke && (i.lineWidth = e.readF32()), i;
}
function mr(e, t) {
  e.writeString(t.layer), e.writeU32(t.color >>> 0), e.writeF64(t.offset[0]), e.writeF64(t.offset[1]), e.writeF64(t.offset[2]), e.writeFloat32Array(t.positions);
  let n = 0;
  t.indices && t.indices.length > 0 && (n |= qe), t.hatchPattern && (n |= Qe), t.gradientFill && (n |= et), t.gradientPositions && t.gradientPositions.length > 0 && (n |= tt), t.side != null && (n |= nt), t.points && (n |= Wt), e.writeU8(n), n & qe && e.writeUint32Array(t.indices), n & Qe && e.writeJson(t.hatchPattern), n & et && e.writeJson(t.gradientFill), n & tt && e.writeFloat32Array(t.gradientPositions), n & nt && e.writeU8(t.side);
}
function pr(e) {
  const t = e.readString(), n = e.readU32(), r = [
    e.readF64(),
    e.readF64(),
    e.readF64()
  ], o = e.readFloat32Array(), a = e.readU8(), i = { layer: t, color: n, offset: r, positions: o };
  return a & qe && (i.indices = e.readUint32Array()), a & Qe && (i.hatchPattern = e.readJson()), a & et && (i.gradientFill = e.readJson()), a & tt && (i.gradientPositions = e.readFloat32Array()), a & nt && (i.side = e.readU8()), a & Wt && (i.points = !0), i;
}
class vr {
  constructor() {
    this.chunks = [], this.length = 0;
  }
  writeU8(t) {
    const n = new Uint8Array(1);
    n[0] = t & 255, this.chunks.push(n), this.length += 1;
  }
  writeU32(t) {
    const n = new Uint8Array(4);
    new DataView(n.buffer).setUint32(0, t >>> 0, !0), this.chunks.push(n), this.length += 4;
  }
  writeF32(t) {
    const n = new Uint8Array(4);
    new DataView(n.buffer).setFloat32(0, t, !0), this.chunks.push(n), this.length += 4;
  }
  writeF64(t) {
    const n = new Uint8Array(8);
    new DataView(n.buffer).setFloat64(0, t, !0), this.chunks.push(n), this.length += 8;
  }
  writeBytes(t) {
    this.chunks.push(t), this.length += t.length;
  }
  writeString(t) {
    const n = sr(t);
    this.writeU32(n.length), this.writeBytes(n);
  }
  writeJson(t) {
    this.writeString(JSON.stringify(t));
  }
  writeFloat32Array(t) {
    const n = new Uint8Array(
      t.buffer,
      t.byteOffset,
      t.byteLength
    );
    this.writeU32(n.length), this.writeBytes(n);
  }
  writeUint32Array(t) {
    const n = new Uint8Array(
      t.buffer,
      t.byteOffset,
      t.byteLength
    );
    this.writeU32(n.length), this.writeBytes(n);
  }
  toUint8Array() {
    const t = new Uint8Array(this.length);
    let n = 0;
    for (const r of this.chunks)
      t.set(r, n), n += r.length;
    return t;
  }
}
class wr {
  constructor(t) {
    this.bytes = t, this.offset = 0;
  }
  readU8() {
    return this.bytes[this.offset++];
  }
  readU32() {
    const n = new DataView(
      this.bytes.buffer,
      this.bytes.byteOffset + this.offset,
      4
    ).getUint32(0, !0);
    return this.offset += 4, n;
  }
  readF32() {
    const n = new DataView(
      this.bytes.buffer,
      this.bytes.byteOffset + this.offset,
      4
    ).getFloat32(0, !0);
    return this.offset += 4, n;
  }
  readF64() {
    const n = new DataView(
      this.bytes.buffer,
      this.bytes.byteOffset + this.offset,
      8
    ).getFloat64(0, !0);
    return this.offset += 8, n;
  }
  readBytes(t) {
    const n = this.bytes.subarray(this.offset, this.offset + t);
    return this.offset += t, n;
  }
  readString() {
    const t = this.readU32();
    return t === 0 ? "" : lr(this.readBytes(t));
  }
  readJson() {
    const t = this.readString();
    if (t.length === 0)
      throw new Error("Expected JSON payload");
    return JSON.parse(t);
  }
  readFloat32Array() {
    const t = this.readU32();
    if (t === 0)
      return new Float32Array(0);
    const n = this.readBytes(t), r = new ArrayBuffer(t);
    return new Uint8Array(r).set(n), new Float32Array(r);
  }
  readUint32Array() {
    const t = this.readU32();
    if (t === 0)
      return new Uint32Array(0);
    const n = this.readBytes(t), r = new ArrayBuffer(t);
    return new Uint8Array(r).set(n), new Uint32Array(r);
  }
}
const br = "application/vnd.mlightcad.acex-snapshot+binary";
function xr(e) {
  if (e.version !== ie)
    throw new Error(`Unsupported snapshot version: ${e.version}`);
  const t = cr(e), n = rr(t);
  return Ar(n);
}
function fa(e) {
  const t = Mr(e.trim()), n = or(t);
  return dr(n);
}
function yr() {
  return br;
}
function Ar(e) {
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += String.fromCharCode(e[n]);
  return btoa(t);
}
function Mr(e) {
  const t = atob(e), n = new Uint8Array(t.length);
  for (let r = 0; r < t.length; r++)
    n[r] = t.charCodeAt(r);
  return n;
}
function ge(e, t, n) {
  if (n <= 0)
    return new Float32Array(0);
  const r = new Float32Array(n);
  for (let o = 0; o < n; o++)
    r[o] = e[t + o];
  return r;
}
function kr(e, t, n) {
  if (n <= 0)
    return new Uint32Array(0);
  const r = new Uint32Array(n);
  for (let o = 0; o < n; o++)
    r[o] = e[t + o];
  return r;
}
function Xt(e, t) {
  if (t.length === 0)
    return { positions: e, indices: t };
  let n = 0;
  for (let o = 0; o < t.length; o++) {
    const a = t[o];
    a > n && (n = a);
  }
  const r = (n + 1) * 3;
  return r >= e.length ? { positions: e, indices: t } : {
    positions: ge(e, 0, r),
    indices: t
  };
}
function kt(e, t) {
  return e + t;
}
const de = { x: 0, y: 0, z: 0 };
function Cr(e) {
  e.updateMatrixWorld(!0);
  const t = e.matrixWorld.elements;
  return de.x = t[12], de.y = t[13], de.z = t[14], [de.x, de.y, de.z];
}
function Sr(e, t) {
  const n = t.elements, r = e.positions;
  if (r.length === 0)
    return { positions: new Float32Array(0), indices: e.indices };
  const o = new Float32Array(r.length);
  for (let a = 0; a < r.length; a += 3) {
    const i = r[a], s = r[a + 1], l = r[a + 2];
    o[a] = n[0] * i + n[4] * s + n[8] * l + n[12], o[a + 1] = n[1] * i + n[5] * s + n[9] * l + n[13], o[a + 2] = n[2] * i + n[6] * s + n[10] * l + n[14];
  }
  return {
    positions: o,
    indices: e.indices ? new Uint32Array(e.indices) : void 0
  };
}
function Lr(e) {
  const t = e.positions;
  if (t.length < 3)
    return { slice: e, offset: [0, 0, 0] };
  let n = 1 / 0, r = 1 / 0, o = 1 / 0, a = -1 / 0, i = -1 / 0, s = -1 / 0;
  for (let d = 0; d < t.length; d += 3) {
    const u = t[d], f = t[d + 1], g = t[d + 2];
    n = Math.min(n, u), r = Math.min(r, f), o = Math.min(o, g), a = Math.max(a, u), i = Math.max(i, f), s = Math.max(s, g);
  }
  const l = [
    (n + a) / 2,
    (r + i) / 2,
    (o + s) / 2
  ], c = new Float32Array(t.length);
  for (let d = 0; d < t.length; d += 3)
    c[d] = t[d] - l[0], c[d + 1] = t[d + 1] - l[1], c[d + 2] = t[d + 2] - l[2];
  return {
    slice: {
      positions: c,
      indices: e.indices ? new Uint32Array(e.indices) : void 0
    },
    offset: l
  };
}
function Er(e, t, n = {}) {
  e.updateMatrixWorld(!0);
  const r = Sr(t, e.matrixWorld);
  return n.preserveWorldSpaceForPatternFill ? { slice: r, offset: [0, 0, 0] } : Lr(r);
}
function ut(e) {
  const t = e;
  if (t.isShaderMaterial === !0 || e.type === "ShaderMaterial")
    return t;
}
function Ir(e) {
  var a;
  const t = ut(e);
  if (!t)
    return;
  const n = t.uniforms.pattern, r = t.uniforms.patternLength;
  if (!n || !r)
    return;
  const o = n.value;
  if (!(!Array.isArray(o) || o.length === 0))
    return {
      pattern: [...o],
      patternLength: Number(r.value),
      viewportScale: Number(((a = t.uniforms.u_viewportScale) == null ? void 0 : a.value) ?? 1)
    };
}
function Br(e) {
  var o;
  const t = ut(e);
  if (!t)
    return;
  const n = t.uniforms.u_patternLines;
  if (!n)
    return;
  const r = n.value;
  if (!(!Array.isArray(r) || r.length === 0))
    return {
      patternAngle: Number(((o = t.uniforms.u_patternAngle) == null ? void 0 : o.value) ?? 0),
      patternLines: r.map(zr)
    };
}
function Fr(e) {
  var a, i, s, l, c;
  const t = ut(e);
  if (!t || t.uniforms.u_patternLines)
    return;
  const n = (a = t.uniforms.u_startColor) == null ? void 0 : a.value, r = (i = t.uniforms.u_endColor) == null ? void 0 : i.value, o = t.uniforms.u_gradientType;
  if (!(!(n != null && n.getHex) || o == null))
    return {
      startColor: n.getHex(),
      endColor: ((s = r == null ? void 0 : r.getHex) == null ? void 0 : s.call(r)) ?? n.getHex(),
      angle: Number(((l = t.uniforms.u_angle) == null ? void 0 : l.value) ?? 0),
      shift: Number(((c = t.uniforms.u_shift) == null ? void 0 : c.value) ?? 0),
      gradientType: Number(o.value)
    };
}
function zr(e) {
  return {
    angle: e.angle,
    base: [e.base.x, e.base.y],
    offset: [e.offset.x, e.offset.y],
    dashLengths: [...e.dashLengths],
    patternLength: e.patternLength
  };
}
function Jt(e) {
  const t = e.length / 3;
  if (t < 2)
    return new Float32Array(0);
  const n = new Float32Array(t);
  for (let r = 0; r < t; r += 2) {
    r === 0 ? n[r] = 0 : n[r] = n[r - 1];
    const o = e[r * 3], a = e[r * 3 + 1], i = e[r * 3 + 2] ?? 0, s = e[(r + 1) * 3], l = e[(r + 1) * 3 + 1], c = e[(r + 1) * 3 + 2] ?? 0, d = s - o, u = l - a, f = c - i;
    n[r + 1] = n[r] + Math.sqrt(d * d + u * u + f * f);
  }
  return n;
}
function Tr(e, t) {
  const n = e.getAttribute(t);
  if (!n || n.count === 0)
    return;
  const r = n.itemSize;
  if (e.getIndex()) {
    const u = n.array;
    return ge(u, 0, n.count * r);
  }
  const a = e.drawRange, i = n.count, s = Math.max(0, Math.min(Math.floor(a.start), i)), l = Math.max(0, i - s), c = !Number.isFinite(a.count) || a.count <= 0 ? l : Math.min(Math.floor(a.count), l);
  if (c <= 0)
    return;
  const d = n.array;
  return ge(d, s * r, c * r);
}
function _r(e, t) {
  const n = Math.atan2(t[1], t[0]), r = (a, i) => [
    t[0] * a + t[4] * i + t[12],
    t[1] * a + t[5] * i + t[13]
  ], o = (a, i) => [
    t[0] * a + t[4] * i,
    t[1] * a + t[5] * i
  ];
  return {
    patternAngle: e.patternAngle + n,
    patternLines: e.patternLines.map((a) => ({
      angle: a.angle + n,
      base: r(a.base[0], a.base[1]),
      offset: o(a.offset[0], a.offset[1]),
      dashLengths: [...a.dashLengths],
      patternLength: a.patternLength
    }))
  };
}
function rt(e, t) {
  return !Number.isFinite(e) || e < 0 ? 0 : Math.min(Math.floor(e), t);
}
function ot(e, t, n) {
  const r = Math.max(0, t - n);
  return !Number.isFinite(e) || e <= 0 ? r : Math.min(Math.floor(e), r);
}
function Ct(e) {
  const t = e.getAttribute("position");
  if (!t)
    return { positions: new Float32Array(0) };
  const n = e.drawRange, r = t.array, o = t.itemSize, a = e.getIndex();
  if (a) {
    const c = ge(r, 0, t.count * o), d = a.array, u = rt(n.start, a.count), f = ot(
      n.count,
      a.count,
      u
    ), g = kr(d, u, f);
    return Xt(c, g);
  }
  const i = rt(n.start, t.count), s = ot(
    n.count,
    t.count,
    i
  );
  return { positions: ge(
    r,
    i * o,
    s * o
  ) };
}
function at(e) {
  return ln(e.flags) && cn(e.flags);
}
function ft(e, t) {
  const n = t.getAttribute("position");
  if (!n)
    return { positions: new Float32Array(0) };
  const r = n.itemSize, o = n.array, a = t.getIndex(), { count: i } = e.mappingStats;
  if (a) {
    const l = ge(
      o,
      0,
      n.count * r
    ), c = a.array, d = [];
    for (let u = 0; u < i; u++) {
      let f;
      try {
        f = e.getGeometryRangeAt(u);
      } catch {
        continue;
      }
      const g = f.indexStart ?? 0, p = f.indexCount ?? 0;
      if (!(!at(f) || p <= 0))
        for (let h = 0; h < p; h++)
          d.push(c[g + h]);
    }
    return d.length === 0 ? { positions: new Float32Array(0) } : Xt(l, new Uint32Array(d));
  }
  const s = [];
  for (let l = 0; l < i; l++) {
    let c;
    try {
      c = e.getGeometryRangeAt(l);
    } catch {
      continue;
    }
    if (!at(c) || c.vertexCount <= 0)
      continue;
    const d = c.vertexStart * r, u = c.vertexCount * r;
    for (let f = 0; f < u; f++)
      s.push(o[d + f]);
  }
  return { positions: new Float32Array(s) };
}
function Se(e, t, n) {
  e.push(
    t.getX(n),
    t.getY(n),
    t.getZ(n)
  );
}
function Pr(e, t) {
  const n = t.getAttribute("instanceStart"), r = t.getAttribute("instanceEnd");
  if (!n || !r)
    return { positions: new Float32Array(0) };
  const { count: o } = e.mappingStats, a = [];
  for (let i = 0; i < o; i++) {
    let s;
    try {
      s = e.getGeometryRangeAt(i);
    } catch {
      continue;
    }
    if (!at(s) || s.vertexCount <= 0)
      continue;
    const l = s.vertexStart, c = l + s.vertexCount;
    for (let d = l; d < c; d++)
      Se(a, n, d), Se(a, r, d);
  }
  return { positions: new Float32Array(a) };
}
function Ur(e, t) {
  const r = e.instanceCount;
  if (Number.isFinite(r) && r >= 0)
    return Math.min(Math.floor(r), t);
  const o = e.drawRange, a = rt(o.start, t);
  return ot(o.count, t, a);
}
function Hr(e) {
  const t = e.getAttribute("instanceStart"), n = e.getAttribute("instanceEnd");
  if (!t || !n || t.count === 0)
    return { positions: new Float32Array(0) };
  const r = Ur(
    e,
    t.count
  );
  if (r <= 0)
    return { positions: new Float32Array(0) };
  const o = [];
  for (let a = 0; a < r; a++)
    Se(o, t, a), Se(o, n, a);
  return { positions: new Float32Array(o) };
}
function De(e) {
  return an(e);
}
function Kt(e) {
  if (e instanceof dn)
    return e.linewidth;
}
function fe(e) {
  var c;
  const t = sn(e), n = t.layer ?? "0", r = e;
  let o = r.color != null ? r.color.getHex() : t.color ?? 16777215;
  const a = Ir(e), i = Br(e), s = Fr(e);
  if (e instanceof F.ShaderMaterial || e.type === "ShaderMaterial") {
    const u = (c = e.uniforms.u_color) == null ? void 0 : c.value;
    u != null && u.getHex ? o = u.getHex() : s && (o = s.startColor);
  }
  return {
    color: o,
    layer: n,
    linePattern: a,
    hatchPattern: i,
    gradientFill: s,
    side: !!i || !!s ? e.side : void 0
  };
}
function Dr(e, t) {
  if (!t)
    return;
  const n = e.userData.bakedWorldMatrix;
  return !n || n.length < 16 ? t : _r(t, n);
}
function Te(e) {
  return Cr(e);
}
function Re(e, t, n = {}) {
  const r = Er(e, t, n);
  return {
    ...r.slice,
    offset: r.offset
  };
}
function gt(e, t, n, r, o) {
  const a = fe(t), i = Dr(n, a.hatchPattern), s = a.gradientFill ? Tr(e, "gradientPosition") : void 0;
  return {
    layer: a.layer,
    color: a.color,
    offset: o,
    hatchPattern: i,
    gradientFill: a.gradientFill,
    gradientPositions: s,
    side: a.side,
    ...r
  };
}
function Rr(e) {
  const t = Pr(e, e.geometry);
  if (t.positions.length === 0)
    return;
  const { color: n, layer: r } = fe(e.material), o = Kt(e.material);
  return {
    layer: r,
    color: n,
    offset: Te(e),
    lineWidth: o,
    ...t
  };
}
function Or(e) {
  const t = ft(e, e.geometry);
  if (t.positions.length === 0)
    return;
  const { color: n, layer: r, linePattern: o } = fe(
    e.material
  ), a = o ? Jt(t.positions) : void 0;
  return {
    layer: r,
    color: n,
    offset: Te(e),
    linePattern: o,
    lineDistances: a,
    ...t
  };
}
function Nr(e) {
  const t = ft(e, e.geometry);
  if (t.positions.length !== 0)
    return gt(
      e.geometry,
      e.material,
      e,
      t,
      Te(e)
    );
}
function Vr(e) {
  const t = ft(e, e.geometry);
  if (t.positions.length !== 0)
    return {
      points: !0,
      ...gt(
        e.geometry,
        e.material,
        e,
        t,
        Te(e)
      )
    };
}
function St(e) {
  const t = [], n = [];
  return e.traverse((r) => {
    if (!(tn(r) || nn(r))) {
      if (r instanceof vt) {
        const o = Or(r);
        o && t.push(o);
        return;
      }
      if (r instanceof rn) {
        const o = Rr(r);
        o && t.push(o);
        return;
      }
      if (r instanceof wt) {
        const o = Nr(r);
        o && n.push(o);
        return;
      }
      if (r instanceof on) {
        const o = Vr(r);
        o && n.push(o);
        return;
      }
      if (r instanceof un) {
        if (!De(r)) return;
        const o = Hr(r.geometry);
        if (o.positions.length === 0) return;
        const a = r.material, { color: i, layer: s } = fe(a), { offset: l, ...c } = Re(r, o);
        t.push({
          layer: s,
          color: i,
          offset: l,
          lineWidth: Kt(a),
          ...c
        });
      } else if (r instanceof F.LineSegments && !(r instanceof vt)) {
        if (!De(r)) return;
        const o = Ct(r.geometry);
        if (o.positions.length === 0) return;
        const a = r.material, { color: i, layer: s, linePattern: l } = fe(a), { offset: c, ...d } = Re(r, o), u = l ? Jt(d.positions) : void 0;
        t.push({
          layer: s,
          color: i,
          offset: c,
          linePattern: l,
          lineDistances: u,
          ...d
        });
      } else if (r instanceof F.Mesh && !(r instanceof wt)) {
        if (!De(r)) return;
        const o = Ct(r.geometry);
        if (o.positions.length === 0) return;
        const a = r.material, i = fe(a), { offset: s, ...l } = Re(r, o, {
          preserveWorldSpaceForPatternFill: !!i.hatchPattern
        });
        n.push(
          gt(r.geometry, a, r, l, s)
        );
      }
    }
  }), { lineBatches: t, meshBatches: n };
}
function Lt(e, t) {
  const n = e.extmin, r = e.extmax;
  return {
    title: t == null ? void 0 : t.title,
    extents: {
      minX: n.x,
      minY: n.y,
      maxX: r.x,
      maxY: r.y
    },
    units: {
      insunits: e.insunits,
      lunits: e.lunits,
      luprec: e.luprec,
      aunits: e.aunits,
      auprec: e.auprec,
      measurement: e.measurement,
      ltscale: e.ltscale,
      angbase: e.angbase,
      angdir: e.angdir
    },
    background: (t == null ? void 0 : t.background) ?? 0
  };
}
const ga = [
  "endpoint",
  "midpoint",
  "center",
  "quadrant",
  "intersection",
  "nearest"
];
function ht(e) {
  return e.z >= 0 ? 1 : -1;
}
const jr = 1e6;
function A(e, t) {
  const n = new F.Vector3(t.x, t.y, t.z ?? 0).applyMatrix4(e);
  return { x: n.x, y: n.y };
}
function $r(e) {
  const t = e.elements;
  return new F.Matrix4(
    t[0],
    t[4],
    t[8],
    t[12],
    t[1],
    t[5],
    t[9],
    t[13],
    t[2],
    t[6],
    t[10],
    t[14],
    t[3],
    t[7],
    t[11],
    t[15]
  );
}
function Le(e, t) {
  return new F.Matrix4().multiplyMatrices(
    e,
    $r(t)
  );
}
function mt(e, t) {
  const n = new F.Vector3(t.x, t.y, t.z ?? 0).transformDirection(e).normalize();
  return { x: n.x, y: n.y };
}
function it(e) {
  const t = new F.Vector3(
    e.elements[0],
    e.elements[1],
    e.elements[2]
  ).length(), n = new F.Vector3(
    e.elements[4],
    e.elements[5],
    e.elements[6]
  ).length();
  return Ie.equal(t, n, Ht * Math.max(t, n, 1));
}
function Gr(e, t) {
  const n = e.tables.blockTable.getIdAt(t);
  if (n)
    return n;
  for (const o of e.tables.blockTable.newIterator())
    if (o.objectId === t)
      return o;
  const r = e.tables.blockTable.modelSpace;
  if (r.objectId === t)
    return r;
}
function Zr(e) {
  if (e instanceof zn)
    return !0;
  const t = e;
  return (t.type === "LINE" || t.type === "Line") && t.startPoint != null && t.endPoint != null;
}
function Yr(e, t, n, r) {
  ee(e, t, n, r.startPoint, r.endPoint);
}
function qt(e, t) {
  return e.blockTableRecord ?? (e.blockName ? t.tables.blockTable.getAt(e.blockName) : void 0);
}
function Wr(e, t) {
  const n = e.dimBlockId;
  return n ? t.tables.blockTable.getAt(n) : void 0;
}
function Xr(e, t) {
  const r = qt(e, t);
  if (r)
    return r;
  const o = e.owningBlockRecordId;
  return o ? t.tables.blockTable.getAt(o) : void 0;
}
function Qt(e) {
  return e.getFullInsertionTransform();
}
function Jr(e) {
  for (const t of e.newIterator())
    return !0;
  return !1;
}
function Kr(e) {
  return typeof e.getFullInsertionTransform == "function" && "blockTableRecord" in e;
}
function ee(e, t, n, r, o) {
  const a = A(n, r), i = A(n, o), s = {
    kind: "line",
    layer: t,
    x0: a.x,
    y0: a.y,
    x1: i.x,
    y1: i.y
  };
  e.push(s);
}
function Et(e, t, n, r, o, a) {
  const i = A(n, r), s = mt(n, o), l = Math.hypot(s.x, s.y) || 1, c = s.x / l, d = s.y / l, u = jr, f = a ? i.x - c * u : i.x, g = a ? i.y - d * u : i.y, p = i.x + c * u, h = i.y + d * u;
  e.push({ kind: "line", layer: t, x0: f, y0: g, x1: p, y1: h });
}
function ae(e, t, n, r, o) {
  if (r.length < 2) return;
  const a = o ? r.length : r.length - 1;
  for (let i = 0; i < a; i++)
    ee(
      e,
      t,
      n,
      r[i],
      r[(i + 1) % r.length]
    );
}
function qr(e, t, n, r) {
  const o = [r.startPosition];
  for (const a of r.segments)
    o.push(a.position);
  ae(e, t, n, o, r.closed);
}
function Qr(e, t, n) {
  if (n.vertices.length >= 2)
    return n.vertices;
  if (n.vertices.length === 0)
    return [];
  const r = n.vertices[0], o = t.lastLeaderLinePoint ?? t.landingPoint ?? e.landingPoint ?? e.contentBasePosition;
  if (!o)
    return n.vertices;
  const a = r.x - o.x, i = r.y - o.y, s = (r.z ?? 0) - (o.z ?? 0);
  return Math.hypot(a, i, s) <= Ht ? n.vertices : [r, o];
}
function eo(e, t, n, r) {
  var a, i;
  for (const s of r.leaders)
    for (const l of s.leaderLines) {
      const c = Qr(r, s, l);
      ae(e, t, n, c, !1);
    }
  const o = (s) => {
    if (!s) return;
    const l = A(n, s);
    e.push({ kind: "point", layer: t, x: l.x, y: l.y });
  };
  o(r.contentBasePosition), o((a = r.mtextContent) == null ? void 0 : a.anchorPoint), o((i = r.blockContent) == null ? void 0 : i.position);
}
function to(e, t, n, r) {
  const o = r.numberOfVertices;
  if (o < 2) return;
  const a = r.elevation, i = r.closed ? o : o - 1;
  for (let s = 0; s < i; s++) {
    const l = r.getPointAt(s), c = r.getPointAt((s + 1) % o), d = r.getBulgeAt(s), u = { x: l.x, y: l.y, z: a }, f = { x: c.x, y: c.y, z: a };
    if (Ie.isPositive(Math.abs(d))) {
      const g = A(n, u), p = A(n, f), h = new he(g, p, d), w = h.center;
      e.push({
        kind: "arc",
        layer: t,
        cx: w.x,
        cy: w.y,
        r: h.radius,
        startAngle: h.startAngle,
        endAngle: h.endAngle,
        normalSign: h.clockwise ? -1 : 1
      });
    } else
      ee(e, t, n, u, f);
  }
}
function no(e, t, n, r, o, a) {
  const i = A(n, r), s = new F.Vector3(
    n.elements[0],
    n.elements[1],
    n.elements[2]
  ).length(), l = {
    kind: "circle",
    layer: t,
    cx: i.x,
    cy: i.y,
    r: o * s,
    normalSign: ht(a)
  };
  e.push(l);
}
function ro(e, t, n, r) {
  const o = A(n, r.center), a = new F.Vector3(
    n.elements[0],
    n.elements[1],
    n.elements[2]
  ).length(), i = {
    kind: "arc",
    layer: t,
    cx: o.x,
    cy: o.y,
    r: r.radius * a,
    startAngle: r.startAngle,
    endAngle: r.endAngle,
    normalSign: ht(r.normal)
  };
  e.push(i);
}
function Oe(e, t, n, r) {
  const o = A(n, r.center), a = r._geo, i = (a == null ? void 0 : a.majorAxis) ?? { x: 1, y: 0, z: 0 }, s = mt(n, i), l = Math.hypot(s.x, s.y) || 1, c = new F.Vector3(
    n.elements[0],
    n.elements[1],
    n.elements[2]
  ).length(), d = new F.Vector3(
    n.elements[4],
    n.elements[5],
    n.elements[6]
  ).length(), u = {
    kind: "ellipse",
    layer: t,
    cx: o.x,
    cy: o.y,
    majorX: s.x / l,
    majorY: s.y / l,
    majorR: r.majorAxisRadius * c,
    minorR: r.minorAxisRadius * d,
    startAngle: r.startAngle,
    endAngle: r.endAngle,
    closed: r.closed,
    normalSign: ht(r.normal)
  };
  e.push(u);
}
function oo(e, t, n, r) {
  var s, l;
  const o = r._geo;
  if (!((s = o == null ? void 0 : o.controlPoints) != null && s.length)) return;
  const a = [];
  for (const c of o.controlPoints) {
    const d = A(n, c);
    a.push(d.x, d.y);
  }
  const i = {
    kind: "spline",
    layer: t,
    controlPoints: a,
    degree: o.degree ?? 3,
    knots: [...o.knots ?? []],
    weights: [...o.weights ?? []],
    closed: o.closed ?? !1
  };
  if ((l = o.fitPoints) != null && l.length) {
    i.fitPoints = [];
    for (const c of o.fitPoints) {
      const d = A(n, c);
      i.fitPoints.push(d.x, d.y);
    }
  }
  e.push(i);
}
function ao(e, t, n, r) {
  var l;
  const o = (l = r._geo) == null ? void 0 : l.vertices, a = o && o.length > 1 ? o.map((c) => ({ x: c.x, y: c.y, bulge: c.bulge })) : Array.from({ length: r.numberOfVertices }, (c, d) => {
    const u = r.getPoint2dAt(d);
    return { x: u.x, y: u.y, bulge: 0 };
  }), i = a.length;
  if (i < 2) return;
  const s = r.closed ? i : i - 1;
  for (let c = 0; c < s; c++) {
    const d = a[c], u = a[(c + 1) % i], f = d.bulge ?? 0;
    if (Ie.isPositive(Math.abs(f))) {
      const g = A(n, { x: d.x, y: d.y, z: 0 }), p = A(n, { x: u.x, y: u.y, z: 0 }), h = new he(g, p, f), w = h.center;
      e.push({
        kind: "arc",
        layer: t,
        cx: w.x,
        cy: w.y,
        r: h.radius,
        startAngle: h.startAngle,
        endAngle: h.endAngle,
        normalSign: h.clockwise ? -1 : 1
      });
    } else
      ee(
        e,
        t,
        n,
        { x: d.x, y: d.y, z: 0 },
        { x: u.x, y: u.y, z: 0 }
      );
  }
}
function io(e, t, n, r, o) {
  if (it(n)) {
    const a = A(n, {
      x: r.center.x,
      y: r.center.y,
      z: o
    }), i = new F.Vector3(
      n.elements[0],
      n.elements[1],
      n.elements[2]
    ).length();
    e.push({
      kind: "arc",
      layer: t,
      cx: a.x,
      cy: a.y,
      r: r.radius * i,
      startAngle: r.startAngle,
      endAngle: r.endAngle,
      normalSign: r.clockwise ? -1 : 1
    });
    return;
  }
  ee(
    e,
    t,
    n,
    { x: r.startPoint.x, y: r.startPoint.y, z: o },
    { x: r.endPoint.x, y: r.endPoint.y, z: o }
  );
}
function so(e, t, n, r, o) {
  const a = A(n, {
    x: r.center.x,
    y: r.center.y,
    z: o
  }), i = mt(n, {
    x: Math.cos(r.rotation),
    y: Math.sin(r.rotation),
    z: 0
  }), s = Math.hypot(i.x, i.y) || 1, l = new F.Vector3(
    n.elements[0],
    n.elements[1],
    n.elements[2]
  ).length(), c = new F.Vector3(
    n.elements[4],
    n.elements[5],
    n.elements[6]
  ).length();
  e.push({
    kind: "ellipse",
    layer: t,
    cx: a.x,
    cy: a.y,
    majorX: i.x / s,
    majorY: i.y / s,
    majorR: r.majorAxisRadius * l,
    minorR: r.minorAxisRadius * c,
    startAngle: r.startAngle,
    endAngle: r.endAngle,
    closed: !1,
    normalSign: r.clockwise ? -1 : 1
  });
}
function lo(e, t, n, r, o) {
  var s;
  const a = r.numberOfVertices;
  if (a < 2) return;
  const i = r.closed ? a : a - 1;
  for (let l = 0; l < i; l++) {
    const c = r.getPointAt(l), d = r.getPointAt((l + 1) % a), u = ((s = r.vertices[l]) == null ? void 0 : s.bulge) ?? 0, f = { x: c.x, y: c.y, z: o }, g = { x: d.x, y: d.y, z: o };
    if (Ie.isPositive(Math.abs(u))) {
      const p = A(n, f), h = A(n, g), w = new he(p, h, u), H = w.center;
      e.push({
        kind: "arc",
        layer: t,
        cx: H.x,
        cy: H.y,
        r: w.radius,
        startAngle: w.startAngle,
        endAngle: w.endAngle,
        normalSign: w.clockwise ? -1 : 1
      });
    } else
      ee(e, t, n, f, g);
  }
}
function co(e, t, n, r, o) {
  if (r instanceof Tn) {
    lo(e, t, n, r, o);
    return;
  }
  if (r instanceof _n)
    for (const a of r.curves)
      a instanceof Dt ? ee(
        e,
        t,
        n,
        {
          x: a.startPoint.x,
          y: a.startPoint.y,
          z: o
        },
        {
          x: a.endPoint.x,
          y: a.endPoint.y,
          z: o
        }
      ) : a instanceof he ? io(e, t, n, a, o) : a instanceof Rt && so(e, t, n, a, o);
}
function uo(e, t, n, r) {
  var i;
  const o = (i = r._geo) == null ? void 0 : i.loops;
  if (!(o != null && o.length)) return;
  const a = r.elevation;
  for (const s of o)
    co(e, t, n, s, a);
}
function fo(e, t, n, r) {
  const o = Le(n, Qt(r)), a = [0];
  for (let c = 0; c < r.numColumns; c++)
    a.push(a[c] + r.columnWidth(c));
  const i = [0];
  for (let c = 0; c < r.numRows; c++)
    i.push(i[c] - r.rowHeight(c));
  const s = a[a.length - 1], l = i[i.length - 1];
  for (const c of i)
    ee(
      e,
      t,
      o,
      { x: 0, y: c, z: 0 },
      { x: s, y: c, z: 0 }
    );
  for (const c of a)
    ee(
      e,
      t,
      o,
      { x: c, y: 0, z: 0 },
      { x: c, y: l, z: 0 }
    );
}
function go(e, t, n, r, o, a, i) {
  const s = st(e.layer, n);
  if (i && !i(s))
    return;
  const l = Xr(e, a);
  if (l && !o.has(l.objectId) && Jr(l)) {
    o.add(l.objectId);
    const d = Le(t, Qt(e));
    Ee(l, d, s, r, o, a, i), o.delete(l.objectId);
    return;
  }
  fo(r, s, t, e);
  const c = A(t, e.position);
  r.push({ kind: "point", layer: s, x: c.x, y: c.y });
}
function ho(e, t, n, r) {
  let o = r.boundaryPath();
  if (o.length > 1) {
    const i = o[0], s = o[o.length - 1];
    i.x === s.x && i.y === s.y && (i.z ?? 0) === (s.z ?? 0) && (o = o.slice(0, -1));
  }
  o.length >= 2 && ae(e, t, n, o, !0);
  const a = A(n, r.position);
  e.push({ kind: "point", layer: t, x: a.x, y: a.y });
}
function st(e, t) {
  return e === "0" ? t : e;
}
function mo(e, t, n, r, o, a, i) {
  if (!e.visibility) return;
  const s = st(e.layer, n);
  if (!(i && !i(s))) {
    if (e instanceof fn) {
      go(
        e,
        t,
        n,
        r,
        o,
        a,
        i
      );
      return;
    }
    if (Kr(e)) {
      const l = qt(e, a);
      if (!l || o.has(l.objectId)) return;
      o.add(l.objectId);
      const c = Le(t, e.getFullInsertionTransform()), d = st(e.layer, n);
      Ee(
        l,
        c,
        d,
        r,
        o,
        a,
        i
      ), o.delete(l.objectId);
      return;
    }
    if (e instanceof gn) {
      const l = e, c = Wr(l, a);
      if (!c || o.has(c.objectId)) return;
      o.add(c.objectId);
      const d = Le(
        t,
        l.getFullDimBlockTransform()
      );
      Ee(c, d, s, r, o, a, i), o.delete(c.objectId);
      return;
    }
    if (Zr(e)) {
      Yr(r, s, t, e);
      return;
    }
    if (e instanceof hn) {
      it(t) ? no(
        r,
        s,
        t,
        e.center,
        e.radius,
        e.normal
      ) : Oe(r, s, t, po(e));
      return;
    }
    if (e instanceof mn) {
      it(t) ? ro(r, s, t, e) : Oe(r, s, t, vo(e));
      return;
    }
    if (e instanceof lt) {
      Oe(r, s, t, e);
      return;
    }
    if (e instanceof pn) {
      oo(r, s, t, e);
      return;
    }
    if (e instanceof vn) {
      ao(r, s, t, e);
      return;
    }
    if (e instanceof wn) {
      to(r, s, t, e);
      return;
    }
    if (e instanceof bn) {
      const l = [];
      for (let c = 0; c < e.numberOfVertices; c++)
        l.push(e.getPointAt(c));
      ae(r, s, t, l, e.closed);
      return;
    }
    if (e instanceof xn) {
      uo(r, s, t, e);
      return;
    }
    if (e instanceof yn) {
      Et(
        r,
        s,
        t,
        e.basePoint,
        e.unitDir,
        !1
      );
      return;
    }
    if (e instanceof An) {
      Et(r, s, t, e.basePoint, e.unitDir, !0);
      return;
    }
    if (e instanceof Mn) {
      const l = [
        e.getPointAt(0),
        e.getPointAt(1),
        e.getPointAt(2),
        e.getPointAt(3)
      ];
      ae(r, s, t, l, !0);
      return;
    }
    if (e instanceof kn) {
      const l = e.subGetGripPoints();
      l.length >= 2 && ae(r, s, t, l, l.length >= 3);
      return;
    }
    if (e instanceof Cn) {
      const l = e.vertices;
      l.length >= 2 && ae(r, s, t, l, !1);
      return;
    }
    if (e instanceof Sn) {
      qr(r, s, t, e);
      return;
    }
    if (e instanceof Ln) {
      eo(r, s, t, e);
      return;
    }
    if (e instanceof En) {
      const l = A(t, e.position);
      r.push({ kind: "point", layer: s, x: l.x, y: l.y });
      return;
    }
    if (e instanceof In) {
      const l = A(t, e.location);
      r.push({ kind: "point", layer: s, x: l.x, y: l.y });
      return;
    }
    if (e instanceof Bn) {
      ho(r, s, t, e);
      return;
    }
    if (e instanceof Fn) {
      const l = A(t, e.position);
      r.push({ kind: "point", layer: s, x: l.x, y: l.y });
    }
  }
}
function Ee(e, t, n, r, o, a, i) {
  for (const s of e.newIterator())
    mo(
      s,
      t,
      n,
      r,
      o,
      a,
      i
    );
}
function po(e) {
  return new lt(
    e.center,
    e.normal,
    { x: 1, y: 0, z: 0 },
    e.radius,
    e.radius,
    0,
    xe
  );
}
function vo(e) {
  return new lt(
    e.center,
    e.normal,
    { x: 1, y: 0, z: 0 },
    e.radius,
    e.radius,
    e.startAngle,
    e.endAngle
  );
}
function It(e, t, n = {}) {
  const r = Gr(e, t);
  if (!r)
    return { primitives: [] };
  const o = [], a = new F.Matrix4();
  return Ee(
    r,
    a,
    "0",
    o,
    /* @__PURE__ */ new Set(),
    e,
    n.includeLayer
  ), { primitives: o };
}
function wo(e, t) {
  let n = t - e;
  for (; n <= 0; ) n += xe;
  for (; n > xe; ) n -= xe;
  return n;
}
function Bt(e, t, n, r, o) {
  const a = o === -1 ? -1 : 1;
  return new Ot(
    e + a * n * Math.cos(r),
    t + n * Math.sin(r)
  );
}
function bo(e) {
  const t = Bt(
    e.cx,
    e.cy,
    e.r,
    e.startAngle,
    e.normalSign
  ), n = Bt(
    e.cx,
    e.cy,
    e.r,
    e.endAngle,
    e.normalSign
  ), r = wo(e.startAngle, e.endAngle), o = e.normalSign * Math.tan(r / 4);
  return new he(t, n, o);
}
function xo(e) {
  return e.kind === "circle" ? new he(
    { x: e.cx, y: e.cy },
    e.r,
    0,
    xe,
    e.normalSign === -1
  ) : bo(e);
}
function yo(e) {
  const t = Math.atan2(e.majorY, e.majorX);
  return new Rt(
    { x: e.cx, y: e.cy, z: 0 },
    e.majorR,
    e.minorR,
    e.startAngle,
    e.endAngle,
    e.closed,
    t
  );
}
function Ao(e) {
  const t = [];
  for (let n = 0; n + 1 < e.controlPoints.length; n += 2)
    t.push({
      x: e.controlPoints[n],
      y: e.controlPoints[n + 1],
      z: 0
    });
  return new Pn(
    e.degree,
    e.knots,
    t,
    e.weights.length > 0 ? e.weights : void 0
  );
}
function ha(e) {
  switch (e.kind) {
    case "line":
      return {
        kind: "line",
        curve: new Dt(
          { x: e.x0, y: e.y0 },
          { x: e.x1, y: e.y1 }
        )
      };
    case "circle":
    case "arc":
      return { kind: "circArc", curve: xo(e) };
    case "ellipse":
      return { kind: "ellipse", curve: yo(e) };
    case "spline":
      return { kind: "spline", curve: Ao(e) };
    case "point":
      return { kind: "point", point: new Ot(e.x, e.y) };
  }
}
const en = "mlcad-html-locale", Ft = {
  en: {
    toolbar: {
      viewerTools: "Viewer tools",
      zoomExtents: "Zoom extents",
      measureDistance: "Measure distance",
      measureAngle: "Measure angle",
      measureArc: "Measure arc length",
      measureArea: "Measure area",
      measureCoordinate: "Measure coordinates",
      clearMeasurements: "Clear measurements",
      settings: "Measure settings",
      layers: "Layers",
      language: "Language",
      languageSwitch: "Switch to Chinese",
      collapse: "Collapse toolbar",
      expand: "Expand toolbar"
    },
    settings: {
      toolbar: "Measure settings",
      measureColor: "Measure color",
      ortho: "Toggle orthogonal mode",
      polar: "Polar tracking angles",
      polarAngles: "Polar tracking angles"
    },
    layers: {
      title: "Layers",
      close: "Close layers",
      showAll: "Show all",
      hideAll: "Hide all",
      zoomTo: "Zoom to {name}"
    },
    status: {
      ready: "Ready",
      measureDistanceHint: "Click two points to measure distance (object snap enabled).",
      measureAngleHint: "Click vertex, then two points on each arm (object snap enabled).",
      measureArcHint: "Click arc start, a point on the arc, then arc end (object snap enabled).",
      measureAreaHint: "Click polygon vertices; click near the first point or press Enter to finish.",
      measureCoordinateHint: "Click a point to read its X/Y coordinates (object snap enabled).",
      distance: "Distance: {value}",
      coordinates: "X: {x}  Y: {y}",
      angle: "Angle: {value}",
      arcLength: "Arc length: {value}",
      area: "Area: {value}",
      lengthTotal: "Length total: {value}",
      areaTotal: "Area total: {value}",
      zoomLayer: "Zoom: {name}",
      loadFailed: "Failed to load drawing: {error}",
      noLayout: "No layout data in snapshot."
    }
  },
  zh: {
    toolbar: {
      viewerTools: "查看器工具",
      zoomExtents: "范围缩放",
      measureDistance: "测量距离",
      measureAngle: "测量角度",
      measureArc: "测量弧长",
      measureArea: "测量面积",
      measureCoordinate: "测量坐标",
      clearMeasurements: "清除测量",
      settings: "测量设置",
      layers: "图层",
      language: "语言",
      languageSwitch: "切换到 English",
      collapse: "收起工具栏",
      expand: "展开工具栏"
    },
    settings: {
      toolbar: "测量设置",
      measureColor: "测量颜色",
      ortho: "切换正交模式",
      polar: "极轴追踪角度",
      polarAngles: "极轴追踪角度"
    },
    layers: {
      title: "图层",
      close: "关闭图层",
      showAll: "全部显示",
      hideAll: "全部隐藏",
      zoomTo: "缩放到 {name}"
    },
    status: {
      ready: "就绪",
      measureDistanceHint: "点击两点以测量距离（已启用对象捕捉）。",
      measureAngleHint: "依次点击顶点与两条边上的点（已启用对象捕捉）。",
      measureArcHint: "依次点击弧起点、弧上一点与弧端点（已启用对象捕捉）。",
      measureAreaHint: "依次点击多边形顶点；靠近首点或按 Enter 完成。",
      measureCoordinateHint: "点击一点以读取其 X/Y 坐标（已启用对象捕捉）。",
      distance: "距离：{value}",
      coordinates: "X：{x}  Y：{y}",
      angle: "角度：{value}",
      arcLength: "弧长：{value}",
      area: "面积：{value}",
      lengthTotal: "长度合计：{value}",
      areaTotal: "面积合计：{value}",
      zoomLayer: "缩放：{name}",
      loadFailed: "无法加载图纸：{error}",
      noLayout: "快照中没有布局数据。"
    }
  }
};
function pt(e) {
  if (e == null || e === "") return null;
  const t = e.toLowerCase().replace("_", "-");
  return t === "en" || t.startsWith("en-") ? "en" : t === "zh" || t.startsWith("zh") ? "zh" : null;
}
function Mo() {
  if (typeof navigator > "u") return "en";
  const e = [
    ...navigator.languages ?? [],
    navigator.language
  ].filter(Boolean);
  for (const t of e) {
    const n = pt(t);
    if (n === "zh") return "zh";
    if (n === "en") return "en";
  }
  return "en";
}
function ko() {
  if (typeof localStorage < "u")
    try {
      const e = localStorage.getItem(en), t = pt(e);
      if (t) return t;
    } catch {
    }
  return Mo();
}
function zt(e, t) {
  const n = t.split(".");
  let r = e;
  for (const o of n) {
    if (r == null || typeof r == "string") return;
    r = r[o];
  }
  return typeof r == "string" ? r : void 0;
}
function Co(e, t) {
  return t ? e.replace(/\{(\w+)\}/g, (n, r) => {
    const o = t[r];
    return o != null ? String(o) : `{${r}}`;
  }) : e;
}
class ma {
  /**
   * @param initialLocale - Starting locale; defaults to {@link detectAcExHtmlLocale} when omitted.
   */
  constructor(t) {
    this._onChange = null, this._locale = t ?? ko();
  }
  /** Active locale used for {@link AcExHtmlI18n.t}. */
  get locale() {
    return this._locale;
  }
  /** Short badge text shown on the language toolbar button (`EN` or `中`). */
  get localeBadge() {
    return this._locale === "zh" ? "中" : "EN";
  }
  /**
   * Registers a callback invoked after {@link AcExHtmlI18n.setLocale} or
   * {@link AcExHtmlI18n.toggleLocale} updates the UI.
   *
   * @param handler - Listener, or `null` to clear.
   */
  setOnChange(t) {
    this._onChange = t;
  }
  /**
   * Resolves and formats a message for the active locale, falling back to English.
   *
   * @param key - Dot-separated message key.
   * @param params - Optional placeholder values for `{name}` tokens.
   */
  t(t, n) {
    const r = zt(Ft[this._locale], t) ?? zt(Ft.en, t) ?? t;
    return Co(r, n);
  }
  /**
   * Switches between English and Chinese, persists the choice, and refreshes the DOM.
   *
   * @returns The locale after toggling.
   */
  toggleLocale() {
    const t = this._locale === "en" ? "zh" : "en";
    return this.setLocale(t), t;
  }
  /**
   * Sets the active locale, updates `<html lang>`, storage, and bound DOM nodes.
   *
   * @param locale - Target locale.
   */
  setLocale(t) {
    var n;
    if (this._locale !== t) {
      this._locale = t, typeof document < "u" && (document.documentElement.lang = t);
      try {
        typeof localStorage < "u" && localStorage.setItem(en, t);
      } catch {
      }
      this.applyToDocument(), (n = this._onChange) == null || n.call(this);
    }
  }
  /**
   * Applies translated text to elements under `root` (or the full document).
   * Only updates leaf nodes with `data-i18n-text` to avoid clobbering icon markup.
   *
   * @param root - Subtree to scan; defaults to `document` when omitted.
   */
  applyToDocument(t) {
    if (typeof document > "u") return;
    const n = t ?? document;
    document.documentElement.lang = this._locale, n.querySelectorAll("[data-i18n-text]").forEach((a) => {
      const i = a.dataset.i18nKey;
      i && (a.textContent = this.t(i));
    }), n.querySelectorAll("[data-i18n-attr]").forEach((a) => {
      var c;
      const i = a.dataset.i18nKey, s = ((c = a.dataset.i18nAttr) == null ? void 0 : c.split(/\s+/)) ?? [];
      if (!i || s.length === 0) return;
      const l = this.t(i);
      for (const d of s)
        a.setAttribute(d, l);
    });
    const r = document.getElementById("mlcad-lang-badge");
    r && (r.textContent = this.localeBadge);
    const o = document.getElementById("mlcad-lang-btn");
    o && (o.setAttribute("title", this.t("toolbar.languageSwitch")), o.setAttribute("aria-label", this.t("toolbar.languageSwitch")));
  }
}
const So = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M9.3333 14.125 5.875 10.6667V14.125H9.3333Zm4.7917-3.4583-3.4583 3.4583H14.125V10.6667ZM10.6667 5.875 14.125 9.3333V5.875H10.6667ZM5.875 9.3333 9.3333 5.875H5.875V9.3333Zm9.2083 5.475c1.2333-1.3 1.9083-3.0333 1.9083-4.825-.0083-3.325-2.35-6.1833-5.6083-6.8417C8.125 2.4833 4.85 4.2 3.55 7.2583c-1.3 3.0583-.275 6.6083 2.4583 8.5 2.725 1.8917 6.4167 1.6 8.8167-.6917.0917-.0833.175-.175.2583-.2583Zm1.2583.5917 2.575 2.575c-.3167.3167-.625.625-.9417.9417-.8583-.8583-1.7167-1.7167-2.575-2.575-3.4083 2.9-8.4917 2.5917-11.525-.6917S.9417 7.275 4.1083 4.1083C7.2667.9417 12.3667.8417 15.65 3.875s3.5917 8.1167.6917 11.525Z"/></svg>', Lo = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M3.75 9.25h12.5v1.5H3.75v-1.5ZM2.25 6.5h1.5v7h-1.5v-7ZM16.25 6.5h1.5v7h-1.5v-7Z"/></svg>', Eo = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><polygon fill="currentColor" points="5.74 7.13 7 9.5 4.15 7.72 3.2 7.12 3 7 7 4.5 6.17 6.05 5.67 7 5.74 7.13"/><polygon fill="currentColor" points="16 12.5 13.5 16.5 12.66 15.15 11.92 13.97 11 12.5 12 13.03 12.98 13.55 13.5 13.83 16 12.5"/><rect fill="currentColor" x="2" y="2.5" width="1" height="15"/><rect fill="currentColor" x="3" y="16.5" width="15" height="1"/><path fill="currentColor" d="M14,13c0,.18,0,.37,0,.55v0a6.82,6.82,0,0,1-.32,1.57l-.74-1.18L13,13.5c0-.14,0-.31,0-.47v0a6,6,0,0,0-6-6,6.74,6.74,0,0,0-1.26.13l-.29.07a5.61,5.61,0,0,0-1.3.52l-1-.6a7.07,7.07,0,0,1,2-.88,6.78,6.78,0,0,1,1-.19A7.7,7.7,0,0,1,7,6a7,7,0,0,1,7,7Z"/></svg>', Io = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><rect fill="currentColor" x="2" y="16" width="2" height="2"/><rect fill="currentColor" x="16" y="2" width="2" height="2"/><rect fill="currentColor" x="6.1" y="6.11" width="2" height="2"/><path fill="currentColor" d="M4.99,9.11c-1.15,1.74-1.94,3.74-2.24,5.89h.81c.32-2.18,1.16-4.18,2.39-5.89h-.96Z"/><path fill="currentColor" d="M9.1,5v.96c1.71-1.23,3.72-2.07,5.9-2.4v-.81c-2.16,.3-4.16,1.09-5.9,2.24Z"/></svg>', Bo = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M4 4h12v12H4V4Zm1.5 1.5v9h9v-9h-9Z"/><circle fill="currentColor" cx="4" cy="4" r="1.5"/><circle fill="currentColor" cx="16" cy="4" r="1.5"/><circle fill="currentColor" cx="4" cy="16" r="1.5"/><circle fill="currentColor" cx="16" cy="16" r="1.5"/></svg>', Fo = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M9.25 2h1.5v5.25H16v1.5h-5.25V16h-1.5v-7.25H4v-1.5h5.25V2Z"/><circle fill="currentColor" cx="10" cy="10" r="1.75"/></svg>', zo = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>', To = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m434.8 137.65-149.36-68.1c-16.19-7.4-42.69-7.4-58.88 0L77.3 137.65c-17.6 8-17.6 21.09 0 29.09l148 67.5c16.89 7.7 44.69 7.7 61.58 0l148-67.5c17.52-8 17.52-21.1-.08-29.09M160 308.52l-82.7 37.11c-17.6 8-17.6 21.1 0 29.1l148 67.5c16.89 7.69 44.69 7.69 61.58 0l148-67.5c17.6-8 17.6-21.1 0-29.1l-79.94-38.47"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m160 204.48-82.8 37.16c-17.6 8-17.6 21.1 0 29.1l148 67.49c16.89 7.7 44.69 7.7 61.58 0l148-67.49c17.7-8 17.7-21.1.1-29.1L352 204.48"/></svg>', _o = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10.09 3.53 16.09 6.97 10.09 10.29 4.18 7 10.09 3.56M10.09 2.4 2.17 7 3.31 7.65 10.09 11.45 17 7.62 18.17 7 10.08 2.37 10.09 2.4Z"/><path fill="currentColor" d="M10.25 14.83 18.17 10.22 17 9.57 10.22 13.57 3.32 9.59 2.17 10.22 10.25 14.83Z"/><path fill="currentColor" d="M10.25 17.63 18.17 13 17 12.37 10.22 16.37 3.32 12.38 2.17 13 10.25 17.63Z"/></svg>', Po = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10.09 5.15 16.09 8.59 10.09 11.91 4.18 8.59 10.09 5.15ZM10.09 4 2.17 8.61 3.31 9.25 10.09 13.06 17 9.24 18.16 8.61 10.08 4 10.09 4Z"/><path fill="currentColor" d="M10.25 16.46 18.17 11.85 17 11.2 10.22 15.2 3.32 11.21 2.17 11.85 10.25 16.46Z"/><path fill="currentColor" d="M3.5 3.5 16.5 16.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>', Uo = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m18.5 10 4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301 14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725 16.676 16.676 0 0 1 3.524 17.273l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877 16.165 16.165 0 0 0 11.91 6.001L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z"/></svg>', Ho = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" aria-hidden="true"><path fill="currentColor" d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357 357 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a352 352 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357 357 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088l-24.512 11.968a294 294 0 0 0-34.816 20.096l-22.656 15.36l-116.224-25.088l-65.28 113.152l79.68 88.192l-1.92 27.136a293 293 0 0 0 0 40.192l1.92 27.136l-79.808 88.192l65.344 113.152l116.224-25.024l22.656 15.296a294 294 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152l24.448-11.904a288 288 0 0 0 34.752-20.096l22.592-15.296l116.288 25.024l65.28-113.152l-79.744-88.192l1.92-27.136a293 293 0 0 0 0-40.256l-1.92-27.136l79.808-88.128l-65.344-113.152l-116.288 24.96l-22.592-15.232a288 288 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384a192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256a128 128 0 0 0 0-256"/></svg>', Do = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M3 2H2v16h16v-1H8v-5H3V2zm0 11v4h4v-4H3z"/></svg>', Ro = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M16.98 11L18.5 11L18.5 10L16.98 10C16.86 8.13 16.05 6.44 14.8 5.2L16.88 2.83L16.12 2.17L14.05 4.54C12.79 3.57 11.21 3 9.5 3C5.36 3 2 6.36 2 10.5C2 14.64 5.36 18 9.5 18C13.47 18 16.73 14.91 16.98 11ZM15.98 10C15.86 8.43 15.18 7.01 14.14 5.95L10.6 10L15.98 10ZM13.39 5.29L8.4 11L15.98 11C15.73 14.36 12.92 17 9.5 17C5.91 17 3 14.09 3 10.5C3 6.91 5.91 4 9.5 4C10.96 4 12.31 4.48 13.39 5.29Z"/></svg>', Oo = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="#e75958" d="M22 12H12l5 8.66A10 10 0 0 0 22 12Z"/><path fill="#814dff" d="M17 20.66 12 12 7 20.66A10 10 0 0 0 17 20.66Z"/><path fill="#13b0ce" d="M7 20.66 12 12H2A10 10 0 0 0 7 20.66Z"/><path fill="#4ecd83" d="M2 12H12L7 3.34A10 10 0 0 0 2 12Z"/><path fill="#ffc33f" d="M7 3.34 12 12l5-8.66A10 10 0 0 0 7 3.34Z"/><path fill="#ff9543" d="M17 3.34 12 12H22A10 10 0 0 0 17 3.34Z"/></svg>', No = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 6.5 5.5 11h9L10 6.5Z"/></svg>', _ = {
  /** Zoom-to-extents toolbar icon. */
  zoomExtent: So,
  /** Measure-distance toolbar icon. */
  measureDistance: Lo,
  /** Measure-angle toolbar icon. */
  measureAngle: Eo,
  /** Measure-arc-length toolbar icon. */
  measureArc: Io,
  /** Measure-area toolbar icon. */
  measureArea: Bo,
  /** Measure-coordinate toolbar icon. */
  measureCoordinate: Fo,
  /** Clear-measurements toolbar icon. */
  clearMeasurements: zo,
  /** Open layer drawer toolbar icon. */
  layer: To,
  /** “Show all layers” action icon. */
  layerOn: _o,
  /** “Hide all layers” action icon. */
  layerOff: Po,
  /** Language switch toolbar icon. */
  language: Uo,
  /** Measure settings toolbar icon. */
  setting: Ho,
  /** Orthogonal mode toggle icon. */
  orthoMode: Do,
  /** Polar tracking toggle icon. */
  polarTracking: Ro,
  /** Measure color picker icon. */
  color: Oo,
  /** Collapse toolbar (chevron up). */
  chevronUp: No
};
function Z(e, t, n) {
  const r = Object.entries(n).map(([o, a]) => `${o}="${Ne(a)}"`).join(" ");
  return `<button type="button" class="mlcad-tool-btn" title="${Ne(t)}" aria-label="${Ne(t)}" ${r}>${e}</button>`;
}
function Ne(e) {
  return e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
const Vo = 583902, jo = [90, 45, 30, 23, 18, 10, 5];
function $o(e) {
  return `#${e.toString(16).padStart(6, "0")}`;
}
function Go() {
  const e = jo.map(
    (t) => `<button type="button" class="mlcad-tool-btn mlcad-settings-option-btn mlcad-polar-angle-btn" data-polar-ang="${t}" title="${t}°" aria-label="${t}°"><span class="mlcad-settings-option-indicator" aria-hidden="true"></span><span class="mlcad-settings-option-text">${t}°</span></button>`
  ).join("");
  return `
      <div id="mlcad-settings-wrap" hidden>
        <div id="mlcad-settings-strip" role="toolbar" data-i18n-attr="aria-label" data-i18n-key="settings.toolbar" aria-label="Measure settings">
          <button type="button" class="mlcad-tool-btn mlcad-color-btn" id="mlcad-measure-color-btn" data-i18n-key="settings.measureColor" data-i18n-attr="title aria-label" title="Measure color" aria-label="Measure color">
            ${_.color}
          </button>
          <input type="color" id="mlcad-measure-color-input" class="mlcad-color-input" value="${$o(Vo)}" tabindex="-1" aria-hidden="true" />
          ${Z(_.orthoMode, "Orthogonal mode", {
    id: "mlcad-ortho-btn",
    "data-toggle": "ortho",
    "data-i18n-key": "settings.ortho",
    "data-i18n-attr": "title aria-label"
  })}
          ${Z(_.polarTracking, "Polar tracking", {
    id: "mlcad-polar-btn",
    "data-toggle": "polar",
    "data-i18n-key": "settings.polar",
    "data-i18n-attr": "title aria-label"
  })}
          <button type="button" class="mlcad-tool-btn mlcad-lang-btn" id="mlcad-lang-btn" data-i18n-key="toolbar.languageSwitch" data-i18n-attr="title aria-label" title="Switch language" aria-label="Switch language">
            ${_.language}
            <span class="mlcad-lang-badge" id="mlcad-lang-badge">EN</span>
          </button>
        </div>
        <div id="mlcad-polar-angles" role="group" data-i18n-attr="aria-label" data-i18n-key="settings.polarAngles" aria-label="Polar tracking angles" hidden>
          ${e}
        </div>
      </div>`;
}
const Zo = `
  :root {
    --mlcad-ui-bg: rgba(24, 26, 30, 0.94);
    --mlcad-ui-bg-elevated: rgba(32, 35, 40, 0.98);
    --mlcad-ui-border: rgba(255, 255, 255, 0.1);
    --mlcad-ui-text: #e8eaed;
    --mlcad-ui-muted: #9aa0a6;
    --mlcad-accent: #08e8de;
    --mlcad-accent-active: #1a8cff;
    --mlcad-measure-accent: #08e8de;
    --mlcad-measure-accent-border: rgba(8, 232, 222, 0.45);
    --mlcad-measure-accent-fill: rgba(8, 232, 222, 0.2);
    --mlcad-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
    --mlcad-toolbar-width: 44px;
    --mlcad-drawer-width: 220px;
    --mlcad-drawer-gap: 8px;
    --mlcad-ui-inset: 12px;
    --mlcad-z-chrome: 7;
    --mlcad-z-measure: 5;
  }
  html, body {
    margin: 0; height: 100%; overflow: hidden;
    background: #121418;
    font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
    color: var(--mlcad-ui-text);
  }
  #mlcad-root { position: relative; width: 100%; height: 100%; }
  #mlcad-root canvas {
    display: block;
    width: 100%;
    height: 100%;
    touch-action: none;
  }

  #mlcad-sidebar {
    position: absolute;
    left: var(--mlcad-ui-inset);
    top: 50%;
    z-index: var(--mlcad-z-chrome);
    transform: translateY(-50%);
    display: flex;
    align-items: flex-start;
    gap: var(--mlcad-drawer-gap);
    max-width: calc(100% - 2 * var(--mlcad-ui-inset));
    box-sizing: border-box;
    pointer-events: none;
  }
  #mlcad-sidebar > * { pointer-events: auto; }

  #mlcad-toolbar {
    flex-shrink: 0;
    display: flex; flex-direction: column; gap: 4px;
    padding: 6px;
    background: var(--mlcad-ui-bg);
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 8px;
    box-shadow: var(--mlcad-shadow);
    backdrop-filter: blur(12px);
  }
  .mlcad-tool-btn {
    display: flex; align-items: center; justify-content: center;
    width: var(--mlcad-toolbar-width); height: var(--mlcad-toolbar-width);
    margin: 0; padding: 0;
    border: 1px solid transparent;
    border-radius: 6px;
    background: transparent;
    color: var(--mlcad-ui-text);
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }
  .mlcad-tool-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--mlcad-ui-border);
  }
  .mlcad-tool-btn.active {
    background: rgba(26, 140, 255, 0.22);
    border-color: rgba(26, 140, 255, 0.55);
    color: #fff;
  }
  .mlcad-tool-btn svg {
    width: 20px; height: 20px; display: block; flex-shrink: 0;
  }
  #mlcad-toolbar-toggle {
    height: calc(var(--mlcad-toolbar-width) / 2);
    margin-top: -4px;
    margin-bottom: -4px;
    border-radius: 4px;
  }
  #mlcad-toolbar-toggle svg {
    width: calc(var(--mlcad-toolbar-width) / 2);
    height: calc(var(--mlcad-toolbar-width) / 2);
  }
  #mlcad-toolbar > .mlcad-tool-separator:last-of-type {
    margin-top: 0;
    margin-bottom: 0;
  }
  .mlcad-lang-btn { position: relative; }
  .mlcad-lang-badge {
    position: absolute; right: 3px; bottom: 3px;
    min-width: 14px; height: 14px; padding: 0 3px;
    border-radius: 3px;
    background: rgba(8, 232, 222, 0.2);
    border: 1px solid rgba(8, 232, 222, 0.45);
    color: var(--mlcad-accent);
    font-size: 9px; font-weight: 700; line-height: 12px;
    letter-spacing: -0.02em;
    pointer-events: none;
  }

  #mlcad-layer-drawer {
    flex-shrink: 1;
    min-width: 0;
    width: var(--mlcad-drawer-width);
    max-height: min(420px, calc(100vh - 48px));
    display: flex; flex-direction: column;
    background: var(--mlcad-ui-bg-elevated);
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 8px;
    box-shadow: var(--mlcad-shadow);
    backdrop-filter: blur(12px);
    overflow: hidden;
  }
  #mlcad-layer-drawer[hidden] { display: none; }

  .mlcad-drawer-header {
    display: flex; align-items: center; justify-content: space-between;
    gap: 6px; padding: 8px 10px;
    border-bottom: 1px solid var(--mlcad-ui-border);
    font-size: 13px; font-weight: 600;
  }
  .mlcad-drawer-close {
    width: 28px; height: 28px; padding: 0;
    border: none; border-radius: 4px;
    background: transparent; color: var(--mlcad-ui-muted);
    cursor: pointer; font-size: 18px; line-height: 1;
  }
  .mlcad-drawer-close:hover {
    background: rgba(255, 255, 255, 0.08); color: var(--mlcad-ui-text);
  }

  .mlcad-layer-actions {
    display: flex; gap: 4px; padding: 6px 8px;
    border-bottom: 1px solid var(--mlcad-ui-border);
  }
  .mlcad-layer-action-btn {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    min-height: 30px; padding: 4px 8px;
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.04);
    color: var(--mlcad-ui-text);
    font-size: 12px; cursor: pointer;
  }
  .mlcad-layer-action-btn:hover { background: rgba(255, 255, 255, 0.1); }
  .mlcad-layer-action-btn svg { width: 14px; height: 14px; flex-shrink: 0; }

  #mlcad-layer-list {
    flex: 1; overflow: auto; padding: 4px 0;
  }
  .mlcad-layer-item {
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    align-items: center; gap: 6px;
    padding: 5px 8px;
    font-size: 12px; cursor: pointer;
  }
  .mlcad-layer-item:hover { background: rgba(255, 255, 255, 0.05); }
  .mlcad-layer-item input { margin: 0; cursor: pointer; }
  .mlcad-layer-swatch {
    width: 12px; height: 12px; border-radius: 2px;
    border: 1px solid rgba(255, 255, 255, 0.28);
  }
  .mlcad-layer-name {
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .mlcad-layer-zoom {
    display: flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; padding: 0;
    border: 1px solid transparent; border-radius: 4px;
    background: transparent; color: var(--mlcad-ui-muted);
    cursor: pointer;
  }
  .mlcad-layer-zoom svg {
    width: 14px; height: 14px; display: block;
  }
  .mlcad-layer-zoom:hover:not(:disabled) {
    color: var(--mlcad-accent);
    border-color: var(--mlcad-ui-border);
    background: rgba(255, 255, 255, 0.06);
  }
  .mlcad-layer-zoom:disabled { opacity: 0.35; cursor: not-allowed; }

  #mlcad-status-bar {
    position: absolute; left: 12px; right: 12px; bottom: 10px; z-index: var(--mlcad-z-chrome);
    display: flex; align-items: center; min-height: 28px; padding: 0 12px;
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 6px;
    background: var(--mlcad-ui-bg);
    color: var(--mlcad-ui-muted);
    font-size: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(10px);
    pointer-events: none;
  }
  .mlcad-tool-separator {
    height: 1px;
    margin: 4px 8px;
    background: var(--mlcad-ui-border);
  }

  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-settings-wrap,
  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-layer-drawer {
    display: none !important;
  }
  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-toolbar .mlcad-tool-btn:not(#mlcad-toolbar-toggle),
  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-toolbar .mlcad-tool-separator {
    display: none;
  }

  #mlcad-settings-wrap {
    flex-shrink: 0;
    min-width: 0;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: var(--mlcad-drawer-gap);
  }
  #mlcad-settings-wrap[hidden] { display: none; }

  #mlcad-settings-strip {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 6px;
    background: var(--mlcad-ui-bg);
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 8px;
    box-shadow: var(--mlcad-shadow);
    backdrop-filter: blur(12px);
  }

  #mlcad-polar-angles {
    flex-shrink: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 6px;
    max-width: min(280px, calc(100vw - 2 * var(--mlcad-ui-inset) - 3 * var(--mlcad-toolbar-width) - 3 * var(--mlcad-drawer-gap)));
    background: var(--mlcad-ui-bg);
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 8px;
    box-shadow: var(--mlcad-shadow);
    backdrop-filter: blur(12px);
  }
  #mlcad-polar-angles[hidden] { display: none; }

  .mlcad-color-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
  .mlcad-settings-option-btn {
    width: 100%;
    box-sizing: border-box;
    height: var(--mlcad-toolbar-width);
    justify-content: flex-start;
    gap: 8px;
    padding: 0 10px;
    font-size: 11px;
    font-weight: 500;
  }
  .mlcad-settings-option-indicator {
    flex-shrink: 0;
    width: 10px;
    height: 10px;
    border: 1px solid var(--mlcad-ui-muted);
    border-radius: 2px;
    box-sizing: border-box;
    transition: background 0.15s ease, border-color 0.15s ease;
  }
  .mlcad-settings-option-btn.active .mlcad-settings-option-indicator {
    background: var(--mlcad-accent);
    border-color: var(--mlcad-accent);
  }
  .mlcad-settings-option-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
    line-height: 1.2;
  }

  #mlcad-measure-overlays {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: var(--mlcad-z-measure);
    overflow: hidden;
  }
  .mlcad-measure-canvas {
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
  }
  .mlcad-measure-dot {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--mlcad-measure-accent);
    border: 2px solid rgba(255, 255, 255, 0.9);
    box-sizing: border-box;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .mlcad-measure-badge {
    position: absolute;
    padding: 3px 10px;
    border-radius: 14px;
    background: var(--mlcad-ui-bg-elevated);
    border: 1px solid var(--mlcad-measure-accent-border);
    color: var(--mlcad-measure-accent);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    pointer-events: none;
  }
  .mlcad-measure-badge--coordinate {
    transform: translate(-50%, calc(-50% - 16px));
  }
  .mlcad-measure-dot.mlcad-measure-selected {
    border-color: #ffd54f;
    box-shadow: 0 0 0 2px rgba(255, 213, 79, 0.55);
  }
  .mlcad-measure-badge.mlcad-measure-selected {
    border-color: rgba(255, 213, 79, 0.75);
    color: #ffd54f;
  }
  .mlcad-measure-canvas.mlcad-measure-selected {
    filter: drop-shadow(0 0 3px #ffd54f);
  }
  .mlcad-measure-live-label {
    position: absolute;
    pointer-events: none;
    color: var(--mlcad-measure-accent);
    font-size: 12px;
    font-weight: 600;
    text-shadow: 0 0 4px #000, 0 1px 3px #000;
    transform: translate(-50%, -120%);
    display: none;
  }
  #mlcad-loading {
    position: fixed; inset: 0; z-index: 100;
    display: flex; align-items: center; justify-content: center;
    background: #121418;
    transition: opacity 0.35s ease, visibility 0.35s ease;
  }
  #mlcad-loading.mlcad-loading--done {
    opacity: 0; visibility: hidden; pointer-events: none;
  }
  .mlcad-loading-spinner {
    width: 48px; height: 48px; box-sizing: border-box;
    border: 3px solid rgba(255, 255, 255, 0.12);
    border-top-color: var(--mlcad-accent);
    border-radius: 50%;
    animation: mlcad-spin 0.85s linear infinite;
  }
  @keyframes mlcad-spin { to { transform: rotate(360deg); } }

  @media (max-width: 600px) {
    :root {
      --mlcad-drawer-width: min(200px, calc(100vw - 2 * var(--mlcad-ui-inset) - var(--mlcad-toolbar-width) - var(--mlcad-drawer-gap)));
      --mlcad-ui-inset: 8px;
    }
    #mlcad-sidebar {
      left: var(--mlcad-ui-inset);
      right: var(--mlcad-ui-inset);
      width: auto;
    }
    #mlcad-layer-drawer {
      margin-left: auto;
      max-width: calc(100vw - 2 * var(--mlcad-ui-inset) - var(--mlcad-toolbar-width) - var(--mlcad-drawer-gap));
    }
    .mlcad-layer-action-btn {
      min-height: 28px;
      padding: 3px 6px;
      font-size: 11px;
      gap: 4px;
    }
    .mlcad-layer-action-btn svg { width: 12px; height: 12px; }
    .mlcad-layer-zoom {
      width: 20px;
      height: 20px;
    }
    .mlcad-layer-zoom svg {
      width: 12px;
      height: 12px;
    }
  }
`;
function Yo(e) {
  return `
  <div id="mlcad-loading" aria-hidden="true" style="background:${e}">
    <div class="mlcad-loading-spinner"></div>
  </div>
  <div id="mlcad-root">
    <aside id="mlcad-sidebar">
      <nav id="mlcad-toolbar" data-i18n-attr="aria-label" data-i18n-key="toolbar.viewerTools" aria-label="Viewer tools">
        ${Z(_.zoomExtent, "Zoom extents", {
    "data-action": "fit",
    "data-i18n-key": "toolbar.zoomExtents",
    "data-i18n-attr": "title aria-label"
  })}
        ${Z(_.measureDistance, "Measure distance", {
    "data-action": "measure",
    "data-measure-mode": "distance",
    "data-i18n-key": "toolbar.measureDistance",
    "data-i18n-attr": "title aria-label"
  })}
        ${Z(_.measureAngle, "Measure angle", {
    "data-action": "measure",
    "data-measure-mode": "angle",
    "data-i18n-key": "toolbar.measureAngle",
    "data-i18n-attr": "title aria-label"
  })}
        ${Z(_.measureArc, "Measure arc length", {
    "data-action": "measure",
    "data-measure-mode": "arc",
    "data-i18n-key": "toolbar.measureArc",
    "data-i18n-attr": "title aria-label"
  })}
        ${Z(_.measureArea, "Measure area", {
    "data-action": "measure",
    "data-measure-mode": "area",
    "data-i18n-key": "toolbar.measureArea",
    "data-i18n-attr": "title aria-label"
  })}
        ${Z(
    _.measureCoordinate,
    "Measure coordinates",
    {
      "data-action": "measure",
      "data-measure-mode": "coordinate",
      "data-i18n-key": "toolbar.measureCoordinate",
      "data-i18n-attr": "title aria-label"
    }
  )}
        ${Z(
    _.clearMeasurements,
    "Clear measurements",
    {
      "data-action": "clear-measurements",
      "data-i18n-key": "toolbar.clearMeasurements",
      "data-i18n-attr": "title aria-label"
    }
  )}
        <div class="mlcad-tool-separator" aria-hidden="true"></div>
        ${Z(_.layer, "Layers", {
    id: "mlcad-layers-btn",
    "aria-haspopup": "dialog",
    "aria-expanded": "false",
    "data-i18n-key": "toolbar.layers",
    "data-i18n-attr": "title aria-label"
  })}
        ${Z(_.setting, "Measure settings", {
    id: "mlcad-settings-btn",
    "aria-haspopup": "true",
    "aria-expanded": "false",
    "data-i18n-key": "toolbar.settings",
    "data-i18n-attr": "title aria-label"
  })}
        <div class="mlcad-tool-separator" aria-hidden="true"></div>
        ${Z(_.chevronUp, "Collapse toolbar", {
    id: "mlcad-toolbar-toggle",
    "aria-expanded": "true",
    "data-i18n-key": "toolbar.collapse",
    "data-i18n-attr": "title aria-label"
  })}
      </nav>
      ${Go()}
      <div id="mlcad-layer-drawer" role="dialog" data-i18n-attr="aria-label" data-i18n-key="layers.title" aria-label="Layers" hidden>
        <div class="mlcad-drawer-header">
          <span data-i18n-key="layers.title" data-i18n-text>Layers</span>
          <button type="button" class="mlcad-drawer-close" id="mlcad-layer-close" data-i18n-key="layers.close" data-i18n-attr="aria-label" aria-label="Close layers">×</button>
        </div>
        <div class="mlcad-layer-actions">
          <button type="button" class="mlcad-layer-action-btn" id="mlcad-layer-show-all">
            ${_.layerOn}<span data-i18n-key="layers.showAll" data-i18n-text>Show all</span>
          </button>
          <button type="button" class="mlcad-layer-action-btn" id="mlcad-layer-hide-all">
            ${_.layerOff}<span data-i18n-key="layers.hideAll" data-i18n-text>Hide all</span>
          </button>
        </div>
        <div id="mlcad-layer-list"></div>
      </div>
    </aside>
    <footer id="mlcad-status-bar" aria-live="polite"></footer>
  </div>`;
}
function Tt(e, t) {
  const n = t.title ?? e.meta.title ?? "CAD Drawing", r = xr(e), o = t.viewerRuntime, a = yr(), i = `#${e.meta.background.toString(16).padStart(6, "0")}`;
  return `<!DOCTYPE html>
<html lang="${pt(e.meta.locale) ?? "en"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="generator" content="mlightcad-cad-html-plugin" />
  <title>${Wo(n)}</title>
  <style>${Zo}</style>
</head>
<body>
${Yo(i)}
  <script id="mlcad-snapshot" type="${a}+gzip;base64">${r}<\/script>
  <script>${Xo(o)}<\/script>
</body>
</html>`;
}
function Wo(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Xo(e) {
  return e.replace(/<\/script/gi, "<\\/script");
}
const Jo = 400;
function ye(e = {}) {
  return {
    exportInvisibleLayers: e.exportInvisibleLayers !== !1,
    initialView: e.initialView ?? "fit"
  };
}
function Ko(e) {
  const t = e.activeLayoutView, n = t.center, r = t.trCamera.zoom, o = Math.max(t.height, 1), a = r * (2 * Jo) / o;
  return {
    centerX: n.x,
    centerY: n.y,
    zoom: a
  };
}
function qo() {
  return {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
    valid: !1
  };
}
function Qo(e, t, n) {
  if (t.length < 3) return;
  const r = n[0], o = n[1];
  for (let a = 0; a + 2 < t.length; a += 3) {
    const i = kt(t[a], r), s = kt(t[a + 1], o);
    e.valid ? (i < e.minX && (e.minX = i), i > e.maxX && (e.maxX = i), s < e.minY && (e.minY = s), s > e.maxY && (e.maxY = s)) : (e.minX = e.maxX = i, e.minY = e.maxY = s, e.valid = !0);
  }
}
function _t(e, t) {
  Qo(e, t.positions, t.offset);
}
function ea(e) {
  return e.valid ? {
    minX: e.minX,
    minY: e.minY,
    maxX: e.maxX,
    maxY: e.maxY
  } : null;
}
function ta(e, t) {
  const n = qo();
  for (const r of e)
    _t(n, r);
  for (const r of t)
    _t(n, r);
  return ea(n);
}
class na {
  /**
   * Builds a snapshot synchronously in one pass.
   *
   * Prefer {@link buildAsync} for interactive export so the UI can stay responsive.
   *
   * @param scene - Current renderer scene (layouts, layers, active layout).
   * @param database - Open drawing database used for layout names and metadata.
   * @param options - Optional title, background, and locale overrides.
   * @returns A complete v1 snapshot ready for `packHtml`.
   */
  build(t, n, r = {}) {
    return this.buildSync(t, n, r);
  }
  /**
   * Builds a snapshot incrementally, yielding to the main thread between layouts.
   *
   * Geometry is collected per layout layer so a busy indicator can repaint
   * during large drawings.
   *
   * @param scene - Current renderer scene (layouts, layers, active layout).
   * @param database - Open drawing database used for layout names and metadata.
   * @param options - Optional title, background, and locale overrides.
   * @returns A complete v1 snapshot ready for `packHtml`.
   */
  async buildAsync(t, n, r = {}) {
    await X();
    const o = r.exportInvisibleLayers !== !1, a = o ? void 0 : (c) => ue(t, c, o), i = Lt(n, {
      title: r.title,
      background: r.background
    }), s = [];
    t.layers.forEach((c) => {
      ue(t, c.name, o) && s.push({
        name: c.name,
        color: c.color.RGB ?? 16777215,
        visible: !c.isOff && !c.isFrozen
      });
    });
    const l = [];
    for (const [c, d] of t.layouts) {
      const u = [], f = [];
      for (const [, g] of d.layers) {
        if (!ue(t, g.name, o))
          continue;
        const p = St(g.internalObject);
        u.push(...p.lineBatches), f.push(...p.meshBatches), await X();
      }
      l.push({
        btrId: c,
        name: Ut(n, c),
        isModelSpace: c === t.modelSpaceBtrId,
        lineBatches: u,
        meshBatches: f,
        osnap: It(n, c, { includeLayer: a })
      }), await X();
    }
    return {
      version: ie,
      meta: Pt(
        i,
        r,
        l,
        t.activeLayoutBtrId || t.modelSpaceBtrId
      ),
      layers: s,
      layouts: l,
      activeLayoutBtrId: t.activeLayoutBtrId || t.modelSpaceBtrId
    };
  }
  /**
   * Synchronous implementation shared by {@link build} and {@link buildAsync}.
   *
   * @param scene - Current renderer scene.
   * @param database - Open drawing database.
   * @param options - Snapshot overrides.
   * @returns A complete v1 snapshot.
   */
  buildSync(t, n, r) {
    const o = r.exportInvisibleLayers !== !1, a = o ? void 0 : (c) => ue(t, c, o), i = Lt(n, {
      title: r.title,
      background: r.background
    }), s = [];
    t.layers.forEach((c) => {
      ue(t, c.name, o) && s.push({
        name: c.name,
        color: c.color.RGB ?? 16777215,
        visible: !c.isOff && !c.isFrozen
      });
    });
    const l = [];
    return t.layouts.forEach((c, d) => {
      const u = [], f = [];
      for (const [, g] of c.layers) {
        if (!ue(t, g.name, o))
          continue;
        const p = St(g.internalObject);
        u.push(...p.lineBatches), f.push(...p.meshBatches);
      }
      l.push({
        btrId: d,
        name: Ut(n, d),
        isModelSpace: d === t.modelSpaceBtrId,
        lineBatches: u,
        meshBatches: f,
        osnap: It(n, d, { includeLayer: a })
      });
    }), {
      version: ie,
      meta: Pt(
        i,
        r,
        l,
        t.activeLayoutBtrId || t.modelSpaceBtrId
      ),
      layers: s,
      layouts: l,
      activeLayoutBtrId: t.activeLayoutBtrId || t.modelSpaceBtrId
    };
  }
}
function Pt(e, t, n, r) {
  const o = n.find((s) => s.btrId === r) ?? n[0], a = o ? ta(o.lineBatches, o.meshBatches) : null, i = t.initialView ?? "fit";
  return {
    title: e.title,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    extents: e.extents,
    viewExtents: a ?? void 0,
    units: e.units,
    background: e.background,
    locale: t.locale ?? B.currentLocale,
    initialView: i,
    viewState: i === "current" ? t.viewState : void 0
  };
}
function ue(e, t, n) {
  if (n)
    return !0;
  const r = e.layers.get(t);
  return r ? !r.isOff && !r.isFrozen : !0;
}
function Ut(e, t) {
  for (const n of e.tables.blockTable.newIterator())
    if (n.objectId === t)
      return n.name;
  return t;
}
const ra = "./viewer-runtime.iife.js";
class oa {
  constructor() {
    this._snapshotBuilder = new na();
  }
  /**
   * Prepares the active 2D view for HTML snapshot export.
   *
   * Ensures drawable entities skipped during interactive viewing (for example on
   * off layers) are converted into the scene. Converted geometry remains in the
   * live scene after export completes.
   */
  async prepareAcTrView2dForHtmlExport(t, n = {}) {
    if (!t || !("cadScene" in t) || !t.cadScene)
      throw new Error(
        "CAD scene is not available. Open a drawing before exporting to HTML."
      );
    if (!(t instanceof Un))
      throw new Error(
        "HTML export requires a 2D CAD view. Open a drawing before exporting."
      );
    const r = ye(n);
    return await t.ensureEntitiesConvertedForExport({
      includeInvisibleLayers: r.exportInvisibleLayers
    }), await X(), t;
  }
  /**
   * Exports the document currently open in {@link AcApDocManager}.
   *
   * @param fileName - Optional base name for the download (without extension).
   *   When omitted, the active document's `fileName` is used. A `.html` suffix
   *   is always applied; `.dwg` / `.dxf` suffixes on the input are stripped.
   * @param options - Export options such as invisible-layer inclusion and initial view.
   * @param view - Optional view to export from. Defaults to the active view.
   * @returns Resolves when packaging and download complete.
   */
  async convert(t, n = {}, r) {
    const o = Ce.instance, a = ye(n);
    o.showBusyIndicator();
    try {
      await X();
      const i = o.curDocument, s = await this.prepareAcTrView2dForHtmlExport(
        r ?? o.curView,
        a
      ), l = t || i.fileName || i.docTitle, c = await this._snapshotBuilder.buildAsync(
        s.cadScene,
        i.database,
        {
          title: Hn(l),
          background: s.backgroundColor,
          exportInvisibleLayers: a.exportInvisibleLayers,
          initialView: a.initialView,
          viewState: a.initialView === "current" ? Ko(s) : void 0
        }
      );
      await X();
      const d = await this.loadViewerRuntime(
        o.htmlViewerRuntimeUrl
      );
      await X();
      const u = Tt(c, {
        title: c.meta.title,
        viewerRuntime: d
      });
      await X(), this.downloadHtml(u, Dn(l, "html"));
    } finally {
      o.hideBusyIndicator();
    }
  }
  /**
   * Packages a pre-built snapshot into HTML and downloads it.
   *
   * Skips scene collection; useful for tests, CLI tooling, or re-exporting a
   * snapshot produced elsewhere.
   *
   * @param snapshot - Complete v1 snapshot to embed in the HTML.
   * @param downloadName - File name passed to the browser download API (should
   *   include the `.html` extension).
   * @returns Resolves when packaging and download complete.
   */
  async packSnapshot(t, n) {
    const r = Ce.instance;
    r.showBusyIndicator();
    try {
      await X();
      const o = await this.loadViewerRuntime(
        r.htmlViewerRuntimeUrl
      );
      await X();
      const a = Tt(t, {
        title: t.meta.title,
        viewerRuntime: o
      });
      await X(), this.downloadHtml(a, n);
    } finally {
      r.hideBusyIndicator();
    }
  }
  /**
   * Fetches the offline viewer runtime as source text for inlining.
   *
   * @param url - Absolute or relative URL of `viewer-runtime.iife.js`. When
   *   omitted, {@link DEFAULT_RUNTIME_URL} is used.
   * @returns The runtime script body as a string.
   * @throws If the HTTP response is not OK (missing build artifact, CORS, etc.).
   */
  async loadViewerRuntime(t) {
    const n = t != null ? String(t) : ra, r = await fetch(n);
    if (!r.ok)
      throw new Error(
        `Failed to load HTML viewer runtime from "${n}" (${r.status}). Build @mlightcad/cad-html-plugin and copy viewer-runtime.iife.js to your app assets.`
      );
    return r.text();
  }
  /**
   * Triggers a client-side download of the generated HTML string.
   *
   * @param content - Full HTML document text.
   * @param downloadName - Value for the anchor `download` attribute.
   */
  downloadHtml(t, n) {
    const r = new Blob([t], { type: "text/html;charset=utf-8" }), o = URL.createObjectURL(r), a = document.createElement("a");
    a.href = o, a.download = n, document.body.appendChild(a), a.click(), document.body.removeChild(a), window.setTimeout(() => URL.revokeObjectURL(o), 6e4);
  }
}
class aa extends Rn {
  /**
   * Runs the HTML export workflow for the drawing in `context`.
   *
   * @param context - Active application context used for prompts and export.
   * @returns Resolves when the HTML file has been generated and the download
   *   has been initiated, or rejects if runtime loading or packaging fails.
   */
  async execute(t) {
    const n = await this.promptOptions();
    if (!n)
      return;
    await new oa().convert(
      t.doc.fileName || t.doc.docTitle,
      n,
      t.view
    );
  }
  async promptOptions() {
    const t = await this.promptExportInvisibleLayers();
    if (t === void 0)
      return;
    const n = await this.promptInitialView();
    if (n !== void 0)
      return ye({
        exportInvisibleLayers: t,
        initialView: n
      });
  }
  async promptExportInvisibleLayers() {
    const t = ye(), n = t.exportInvisibleLayers ? "Yes" : "No", r = new bt(
      `${B.t("jig.chtml.exportInvisibleLayers")} <${n}>`
    );
    r.allowNone = !0;
    const o = r.keywords.add(
      B.t("jig.chtml.keywords.yes.display"),
      B.t("jig.chtml.keywords.yes.global"),
      B.t("jig.chtml.keywords.yes.local")
    ), a = r.keywords.add(
      B.t("jig.chtml.keywords.no.display"),
      B.t("jig.chtml.keywords.no.global"),
      B.t("jig.chtml.keywords.no.local")
    );
    r.keywords.default = t.exportInvisibleLayers ? o : a;
    const i = await Ce.instance.editor.getKeywords(r);
    if (i.status !== ne.Cancel) {
      if (i.status === ne.None)
        return t.exportInvisibleLayers;
      if (i.status === ne.OK || i.status === ne.Keyword)
        return i.stringResult ? i.stringResult === "Yes" : t.exportInvisibleLayers;
    }
  }
  async promptInitialView() {
    const t = ye(), n = t.initialView === "current" ? B.t("jig.chtml.keywords.current.global") : B.t("jig.chtml.keywords.extents.global"), r = new bt(
      `${B.t("jig.chtml.initialView")} <${n}>`
    );
    r.allowNone = !0;
    const o = r.keywords.add(
      B.t("jig.chtml.keywords.extents.display"),
      B.t("jig.chtml.keywords.extents.global"),
      B.t("jig.chtml.keywords.extents.local")
    ), a = r.keywords.add(
      B.t("jig.chtml.keywords.current.display"),
      B.t("jig.chtml.keywords.current.global"),
      B.t("jig.chtml.keywords.current.local")
    );
    r.keywords.default = t.initialView === "current" ? a : o;
    const i = await Ce.instance.editor.getKeywords(r);
    if (i.status !== ne.Cancel) {
      if (i.status === ne.None)
        return t.initialView;
      if (i.status === ne.OK || i.status === ne.Keyword)
        return i.stringResult ? i.stringResult === "Current" ? "current" : "fit" : t.initialView;
    }
  }
}
class ia {
  constructor() {
    this.name = "HtmlPlugin", this.version = "1.0.0", this.description = "HTML export (chtml) command", this.registeredCommands = [];
  }
  /**
   * Registers the `chtml` system command.
   *
   * @param _context - Application context (unused)
   * @param commandManager - Command stack used to register the HTML export command
   */
  onLoad(t, n) {
    const r = On.SYSTEMT_COMMAND_GROUP_NAME;
    n.addCommand(r, "chtml", "chtml", new aa()), this.registeredCommands.push({ group: r, name: "chtml" });
  }
  /**
   * Removes commands registered in {@link onLoad}.
   *
   * @param _context - Application context (unused)
   * @param commandManager - Command stack used to unregister the HTML export command
   */
  onUnload(t, n) {
    for (const r of this.registeredCommands)
      n.removeCmd(r.group, r.name);
    this.registeredCommands = [];
  }
}
async function pa() {
  return new ia();
}
const va = "viewer-runtime.iife.js";
export {
  ga as ACEX_DEFAULT_OSNAP_MODES,
  ie as ACEX_SNAPSHOT_VERSION,
  aa as AcApExportHtmlCmd,
  oa as AcApHtmlConvertor,
  na as AcApHtmlSnapshotBuilder,
  ma as AcExHtmlI18n,
  xa as HTML_PLUGIN_NAME,
  ya as HTML_PLUGIN_TRIGGERS,
  va as HTML_VIEWER_RUNTIME_FILE,
  It as buildOsnapCatalog,
  Lt as buildViewerMetadata,
  Ko as captureAcApHtmlViewState,
  xo as circleOrArcToAcGe,
  St as collectBatchesFromObject3D,
  pa as createHtmlPlugin,
  fa as decodeSnapshot,
  dr as decodeSnapshotBinary,
  ko as detectAcExHtmlLocale,
  Mo as detectBrowserAcExHtmlLocale,
  yo as ellipseToAcGe,
  xr as encodeSnapshot,
  cr as encodeSnapshotBinary,
  Pr as exportActiveBatchedLine2Slice,
  ft as exportActiveBatchedSlice,
  Ct as exportBufferGeometrySlice,
  Tt as packHtml,
  ha as primitiveToAcGeCurve,
  ye as resolveAcApHtmlExportOptions,
  pt as resolveAcExHtmlLocale,
  yr as snapshotMimeType,
  Ao as splineToAcGe
};
