var Ar = [
  { name: "AC1.2", value: 1 },
  { name: "AC1.40", value: 2 },
  { name: "AC1.50", value: 3 },
  { name: "AC2.20", value: 4 },
  { name: "AC2.10", value: 5 },
  { name: "AC2.21", value: 6 },
  { name: "AC2.22", value: 7 },
  { name: "AC1001", value: 8 },
  { name: "AC1002", value: 9 },
  { name: "AC1003", value: 10 },
  { name: "AC1004", value: 11 },
  { name: "AC1005", value: 12 },
  { name: "AC1006", value: 13 },
  { name: "AC1007", value: 14 },
  { name: "AC1008", value: 15 },
  { name: "AC1009", value: 16 },
  { name: "AC1010", value: 17 },
  { name: "AC1011", value: 18 },
  { name: "AC1012", value: 19 },
  { name: "AC1013", value: 20 },
  { name: "AC1014", value: 21 },
  { name: "AC1500", value: 22 },
  { name: "AC1015", value: 23 },
  { name: "AC1800a", value: 24 },
  { name: "AC1018", value: 25 },
  { name: "AC2100a", value: 26 },
  { name: "AC1021", value: 27 },
  { name: "AC2400a", value: 28 },
  { name: "AC1024", value: 29 },
  { name: "AC1027", value: 31 },
  { name: "AC3200a", value: 32 },
  { name: "AC1032", value: 33 }
], $a = /* @__PURE__ */ function() {
  function e(n) {
    if (typeof n == "string") {
      var a = Ar.find(function(t) {
        return t.name === n;
      });
      if (!a)
        throw new Error("Unknown DWG version name: ".concat(n));
      this.name = a.name, this.value = a.value;
      return;
    }
    if (typeof n == "number") {
      var a = Ar.find(function(c) {
        return c.value === n;
      });
      if (!a)
        throw new Error("Unknown DWG version value: ".concat(n));
      this.name = a.name, this.value = a.value;
      return;
    }
    throw new Error("Invalid constructor argument for AcDbDwgVersion");
  }
  return e;
}(), qa = function(e, n, a, t) {
  function c(o) {
    return o instanceof a ? o : new a(function(i) {
      i(o);
    });
  }
  return new (a || (a = Promise))(function(o, i) {
    function m(f) {
      try {
        d(t.next(f));
      } catch (h) {
        i(h);
      }
    }
    function l(f) {
      try {
        d(t.throw(f));
      } catch (h) {
        i(h);
      }
    }
    function d(f) {
      f.done ? o(f.value) : c(f.value).then(m, l);
    }
    d((t = t.apply(e, n || [])).next());
  });
}, Qa = function(e, n) {
  var a = { label: 0, sent: function() {
    if (o[0] & 1) throw o[1];
    return o[1];
  }, trys: [], ops: [] }, t, c, o, i;
  return i = { next: m(0), throw: m(1), return: m(2) }, typeof Symbol == "function" && (i[Symbol.iterator] = function() {
    return this;
  }), i;
  function m(d) {
    return function(f) {
      return l([d, f]);
    };
  }
  function l(d) {
    if (t) throw new TypeError("Generator is already executing.");
    for (; i && (i = 0, d[0] && (a = 0)), a; ) try {
      if (t = 1, c && (o = d[0] & 2 ? c.return : d[0] ? c.throw || ((o = c.return) && o.call(c), 0) : c.next) && !(o = o.call(c, d[1])).done) return o;
      switch (c = 0, o && (d = [d[0] & 2, o.value]), d[0]) {
        case 0:
        case 1:
          o = d;
          break;
        case 4:
          return a.label++, { value: d[1], done: !1 };
        case 5:
          a.label++, c = d[1], d = [0];
          continue;
        case 7:
          d = a.ops.pop(), a.trys.pop();
          continue;
        default:
          if (o = a.trys, !(o = o.length > 0 && o[o.length - 1]) && (d[0] === 6 || d[0] === 2)) {
            a = 0;
            continue;
          }
          if (d[0] === 3 && (!o || d[1] > o[0] && d[1] < o[3])) {
            a.label = d[1];
            break;
          }
          if (d[0] === 6 && a.label < o[1]) {
            a.label = o[1], o = d;
            break;
          }
          if (o && a.label < o[2]) {
            a.label = o[2], a.ops.push(d);
            break;
          }
          o[2] && a.ops.pop(), a.trys.pop();
          continue;
      }
      d = n.call(e, a);
    } catch (f) {
      d = [6, f], c = 0;
    } finally {
      t = o = 0;
    }
    if (d[0] & 5) throw d[1];
    return { value: d[0] ? d[1] : void 0, done: !0 };
  }
}, en = function() {
  function e() {
    this.setupMessageHandler();
  }
  return e.prototype.setupMessageHandler = function() {
    var n = this;
    self.onmessage = function(a) {
      return qa(n, void 0, void 0, function() {
        var t, c, o, i, m;
        return Qa(this, function(l) {
          switch (l.label) {
            case 0:
              t = a.data, c = t.id, o = t.input, l.label = 1;
            case 1:
              return l.trys.push([1, 3, , 4]), [4, this.executeTask(o)];
            case 2:
              return i = l.sent(), this.sendResponse(c, !0, i), [3, 4];
            case 3:
              return m = l.sent(), this.sendResponse(c, !1, void 0, m instanceof Error ? m.message : String(m)), [3, 4];
            case 4:
              return [2];
          }
        });
      });
    };
  }, e.prototype.sendResponse = function(n, a, t, c) {
    var o = {
      id: n,
      success: a,
      data: t,
      error: c
    };
    self.postMessage(o);
  }, e;
}(), xr;
(function(e) {
  e[e.UTF8 = 0] = "UTF8", e[e.US_ASCII = 1] = "US_ASCII", e[e.ISO_8859_1 = 2] = "ISO_8859_1", e[e.ISO_8859_2 = 3] = "ISO_8859_2", e[e.ISO_8859_3 = 4] = "ISO_8859_3", e[e.ISO_8859_4 = 5] = "ISO_8859_4", e[e.ISO_8859_5 = 6] = "ISO_8859_5", e[e.ISO_8859_6 = 7] = "ISO_8859_6", e[e.ISO_8859_7 = 8] = "ISO_8859_7", e[e.ISO_8859_8 = 9] = "ISO_8859_8", e[e.ISO_8859_9 = 10] = "ISO_8859_9", e[e.CP437 = 11] = "CP437", e[e.CP850 = 12] = "CP850", e[e.CP852 = 13] = "CP852", e[e.CP855 = 14] = "CP855", e[e.CP857 = 15] = "CP857", e[e.CP860 = 16] = "CP860", e[e.CP861 = 17] = "CP861", e[e.CP863 = 18] = "CP863", e[e.CP864 = 19] = "CP864", e[e.CP865 = 20] = "CP865", e[e.CP869 = 21] = "CP869", e[e.CP932 = 22] = "CP932", e[e.MACINTOSH = 23] = "MACINTOSH", e[e.BIG5 = 24] = "BIG5", e[e.CP949 = 25] = "CP949", e[e.JOHAB = 26] = "JOHAB", e[e.CP866 = 27] = "CP866", e[e.ANSI_1250 = 28] = "ANSI_1250", e[e.ANSI_1251 = 29] = "ANSI_1251", e[e.ANSI_1252 = 30] = "ANSI_1252", e[e.GB2312 = 31] = "GB2312", e[e.ANSI_1253 = 32] = "ANSI_1253", e[e.ANSI_1254 = 33] = "ANSI_1254", e[e.ANSI_1255 = 34] = "ANSI_1255", e[e.ANSI_1256 = 35] = "ANSI_1256", e[e.ANSI_1257 = 36] = "ANSI_1257", e[e.ANSI_874 = 37] = "ANSI_874", e[e.ANSI_932 = 38] = "ANSI_932", e[e.ANSI_936 = 39] = "ANSI_936", e[e.ANSI_949 = 40] = "ANSI_949", e[e.ANSI_950 = 41] = "ANSI_950", e[e.ANSI_1361 = 42] = "ANSI_1361", e[e.UTF16 = 43] = "UTF16", e[e.ANSI_1258 = 44] = "ANSI_1258", e[e.UNDEFINED = 255] = "UNDEFINED";
})(xr || (xr = {}));
var rn = [
  "utf-8",
  "utf-8",
  "iso-8859-1",
  "iso-8859-2",
  "iso-8859-3",
  "iso-8859-4",
  "iso-8859-5",
  "iso-8859-6",
  "iso-8859-7",
  "iso-8859-8",
  "iso-8859-9",
  "utf-8",
  "utf-8",
  "utf-8",
  "utf-8",
  "utf-8",
  "utf-8",
  "utf-8",
  "utf-8",
  "utf-8",
  "utf-8",
  "utf-8",
  "shift-jis",
  "macintosh",
  "big5",
  "utf-8",
  "utf-8",
  "ibm866",
  "windows-1250",
  "windows-1251",
  "windows-1252",
  "gbk",
  "windows-1253",
  "windows-1254",
  "windows-1255",
  "windows-1256",
  "windows-1257",
  "windows-874",
  "shift-jis",
  "gbk",
  "euc-kr",
  "big5",
  "utf-8",
  "utf-16le",
  "windows-1258"
], an = function(e) {
  return rn[e];
}, A, Me, T, N, Ce, j, fe, K, M, Z, Y, be, Ie, he, R, J, _e, we, Ee, ge, Re, Fe, Pe, F, $, v, xe, Ve, b, C, Be, _, Ue, q, g, He, dr, pr, Ge, Q, ve, ur, mr, X, We, ye, P, ee, re, ae, je, Ye, ne, Te, Se, fr, Xe, Oe, te, Ne, D, oe, V, br, k, Ir, se, B, Ae, ze, De, U, ce, H, ie, hr, ke, G;
(A = {})[A.None = 0] = "None", A[A.Anonymous = 1] = "Anonymous", A[A.NonConstant = 2] = "NonConstant", A[A.Xref = 4] = "Xref", A[A.XrefOverlay = 8] = "XrefOverlay", A[A.ExternallyDependent = 16] = "ExternallyDependent", A[A.ResolvedOrDependent = 32] = "ResolvedOrDependent", A[A.ReferencedXref = 64] = "ReferencedXref";
(Me = {})[Me.BYBLOCK = 0] = "BYBLOCK", Me[Me.BYLAYER = 256] = "BYLAYER";
(T = {})[T.Rotated = 0] = "Rotated", T[T.Aligned = 1] = "Aligned", T[T.Angular = 2] = "Angular", T[T.Diameter = 3] = "Diameter", T[T.Radius = 4] = "Radius", T[T.Angular3Point = 5] = "Angular3Point", T[T.Ordinate = 6] = "Ordinate", T[T.ReferenceIsExclusive = 32] = "ReferenceIsExclusive", T[T.IsOrdinateXTypeFlag = 64] = "IsOrdinateXTypeFlag", T[T.IsCustomTextPositionFlag = 128] = "IsCustomTextPositionFlag";
(N = {})[N.TopLeft = 1] = "TopLeft", N[N.TopCenter = 2] = "TopCenter", N[N.TopRight = 3] = "TopRight", N[N.MiddleLeft = 4] = "MiddleLeft", N[N.MiddleCenter = 5] = "MiddleCenter", N[N.MiddleRight = 6] = "MiddleRight", N[N.BottomLeft = 7] = "BottomLeft", N[N.BottomCenter = 8] = "BottomCenter", N[N.BottomRight = 9] = "BottomRight";
(Ce = {})[Ce.AtLeast = 1] = "AtLeast", Ce[Ce.Exact = 2] = "Exact";
var Dr = ((j = {})[j.Center = 0] = "Center", j[j.Above = 1] = "Above", j[j.Outside = 2] = "Outside", j[j.JIS = 3] = "JIS", j[j.Below = 4] = "Below", j);
(fe = {})[fe.WithDimension = 0] = "WithDimension", fe[fe.AddLeader = 1] = "AddLeader", fe[fe.Independent = 2] = "Independent";
(K = {})[K.BothOutside = 0] = "BothOutside", K[K.ArrowFirst = 1] = "ArrowFirst", K[K.TextFirst = 2] = "TextFirst", K[K.Auto = 3] = "Auto";
var Le = ((M = {})[M.Feet = 0] = "Feet", M[M.None = 1] = "None", M[M.Inch = 2] = "Inch", M[M.FeetAndInch = 3] = "FeetAndInch", M[M.Leading = 4] = "Leading", M[M.Trailing = 8] = "Trailing", M[M.LeadingAndTrailing = 12] = "LeadingAndTrailing", M), nn = ((Z = {})[Z.None = 0] = "None", Z[Z.Leading = 1] = "Leading", Z[Z.Trailing = 2] = "Trailing", Z[Z.LeadingAndTrailing = 3] = "LeadingAndTrailing", Z), tn = ((Y = {})[Y.Center = 0] = "Center", Y[Y.First = 1] = "First", Y[Y.Second = 2] = "Second", Y[Y.OverFirst = 3] = "OverFirst", Y[Y.OverSecond = 4] = "OverSecond", Y), on = ((be = {})[be.Bottom = 0] = "Bottom", be[be.Center = 1] = "Center", be[be.Top = 2] = "Top", be);
(Ie = {})[Ie.None = 0] = "None", Ie[Ie.UseDrawingBackground = 1] = "UseDrawingBackground", Ie[Ie.Custom = 2] = "Custom";
(he = {})[he.Horizontal = 0] = "Horizontal", he[he.Diagonal = 1] = "Diagonal", he[he.NotStacked = 2] = "NotStacked";
(R = {})[R.Scientific = 1] = "Scientific", R[R.Decimal = 2] = "Decimal", R[R.Engineering = 3] = "Engineering", R[R.Architectural = 4] = "Architectural", R[R.Fractional = 5] = "Fractional", R[R.WindowDesktop = 6] = "WindowDesktop";
(J = {})[J.Decimal = 0] = "Decimal", J[J.DegreesMinutesSecond = 1] = "DegreesMinutesSecond", J[J.Gradian = 2] = "Gradian", J[J.Radian = 3] = "Radian";
(_e = {})[_e.PatternFill = 0] = "PatternFill", _e[_e.SolidFill = 1] = "SolidFill";
(we = {})[we.NonAssociative = 0] = "NonAssociative", we[we.Associative = 1] = "Associative";
(Ee = {})[Ee.Normal = 0] = "Normal", Ee[Ee.Outer = 1] = "Outer", Ee[Ee.Ignore = 2] = "Ignore";
(ge = {})[ge.UserDefined = 0] = "UserDefined", ge[ge.Predefined = 1] = "Predefined", ge[ge.Custom = 2] = "Custom";
(Re = {})[Re.NotAnnotated = 0] = "NotAnnotated", Re[Re.Annotated = 1] = "Annotated";
(Fe = {})[Fe.Solid = 0] = "Solid", Fe[Fe.Gradient = 1] = "Gradient";
(Pe = {})[Pe.TwoColor = 0] = "TwoColor", Pe[Pe.OneColor = 1] = "OneColor";
var sn = ((F = {})[F.Default = 0] = "Default", F[F.External = 1] = "External", F[F.Polyline = 2] = "Polyline", F[F.Derived = 4] = "Derived", F[F.Textbox = 8] = "Textbox", F[F.Outermost = 16] = "Outermost", F), $e = (($ = {})[$.Line = 1] = "Line", $[$.Circular = 2] = "Circular", $[$.Elliptic = 3] = "Elliptic", $[$.Spline = 4] = "Spline", $), cn = ((v = {})[v.Off = 0] = "Off", v[v.Solid = 1] = "Solid", v[v.Dashed = 2] = "Dashed", v[v.Dotted = 3] = "Dotted", v[v.ShotDash = 4] = "ShotDash", v[v.MediumDash = 5] = "MediumDash", v[v.LongDash = 6] = "LongDash", v[v.DoubleShortDash = 7] = "DoubleShortDash", v[v.DoubleMediumDash = 8] = "DoubleMediumDash", v[v.DoubleLongDash = 9] = "DoubleLongDash", v[v.DoubleMediumLongDash = 10] = "DoubleMediumLongDash", v[v.SparseDot = 11] = "SparseDot", v);
cn.Off;
(xe = {})[xe.Standard = -3] = "Standard", xe[xe.ByLayer = -2] = "ByLayer", xe[xe.ByBlock = -1] = "ByBlock";
(Ve = {})[Ve.English = 0] = "English", Ve[Ve.Metric = 1] = "Metric";
(b = {})[b.PERSPECTIVE_MODE = 1] = "PERSPECTIVE_MODE", b[b.FRONT_CLIPPING = 2] = "FRONT_CLIPPING", b[b.BACK_CLIPPING = 4] = "BACK_CLIPPING", b[b.UCS_FOLLOW = 8] = "UCS_FOLLOW", b[b.FRONT_CLIP_NOT_AT_EYE = 16] = "FRONT_CLIP_NOT_AT_EYE", b[b.UCS_ICON_VISIBILITY = 32] = "UCS_ICON_VISIBILITY", b[b.UCS_ICON_AT_ORIGIN = 64] = "UCS_ICON_AT_ORIGIN", b[b.FAST_ZOOM = 128] = "FAST_ZOOM", b[b.SNAP_MODE = 256] = "SNAP_MODE", b[b.GRID_MODE = 512] = "GRID_MODE", b[b.ISOMETRIC_SNAP_STYLE = 1024] = "ISOMETRIC_SNAP_STYLE", b[b.HIDE_PLOT_MODE = 2048] = "HIDE_PLOT_MODE", b[b.K_ISO_PAIR_TOP = 4096] = "K_ISO_PAIR_TOP", b[b.K_ISO_PAIR_RIGHT = 8192] = "K_ISO_PAIR_RIGHT", b[b.VIEWPORT_ZOOM_LOCKING = 16384] = "VIEWPORT_ZOOM_LOCKING", b[b.UNUSED = 32768] = "UNUSED", b[b.NON_RECTANGULAR_CLIPPING = 65536] = "NON_RECTANGULAR_CLIPPING", b[b.VIEWPORT_OFF = 131072] = "VIEWPORT_OFF", b[b.GRID_BEYOND_DRAWING_LIMITS = 262144] = "GRID_BEYOND_DRAWING_LIMITS", b[b.ADAPTIVE_GRID_DISPLAY = 524288] = "ADAPTIVE_GRID_DISPLAY", b[b.SUBDIVISION_BELOW_SPACING = 1048576] = "SUBDIVISION_BELOW_SPACING", b[b.GRID_FOLLOWS_WORKPLANE = 2097152] = "GRID_FOLLOWS_WORKPLANE";
(C = {})[C.OPTIMIZED_2D = 0] = "OPTIMIZED_2D", C[C.WIREFRAME = 1] = "WIREFRAME", C[C.HIDDEN_LINE = 2] = "HIDDEN_LINE", C[C.FLAT_SHADED = 3] = "FLAT_SHADED", C[C.GOURAUD_SHADED = 4] = "GOURAUD_SHADED", C[C.FLAT_SHADED_WITH_WIREFRAME = 5] = "FLAT_SHADED_WITH_WIREFRAME", C[C.GOURAUD_SHADED_WITH_WIREFRAME = 6] = "GOURAUD_SHADED_WITH_WIREFRAME";
(Be = {})[Be.UCS_UNCHANGED = 0] = "UCS_UNCHANGED", Be[Be.HAS_OWN_UCS = 1] = "HAS_OWN_UCS";
(_ = {})[_.NON_ORTHOGRAPHIC = 0] = "NON_ORTHOGRAPHIC", _[_.TOP = 1] = "TOP", _[_.BOTTOM = 2] = "BOTTOM", _[_.FRONT = 3] = "FRONT", _[_.BACK = 4] = "BACK", _[_.LEFT = 5] = "LEFT", _[_.RIGHT = 6] = "RIGHT";
(Ue = {})[Ue.ONE_DISTANT_LIGHT = 0] = "ONE_DISTANT_LIGHT", Ue[Ue.TWO_DISTANT_LIGHTS = 1] = "TWO_DISTANT_LIGHTS";
(q = {})[q.ByLayer = 0] = "ByLayer", q[q.ByBlock = 1] = "ByBlock", q[q.ByDictionaryDefault = 2] = "ByDictionaryDefault", q[q.ByObject = 3] = "ByObject";
(g = {})[g.NotAllowed = 0] = "NotAllowed", g[g.AllowErase = 1] = "AllowErase", g[g.AllowTransform = 2] = "AllowTransform", g[g.AllowChangeColor = 4] = "AllowChangeColor", g[g.AllowChangeLayer = 8] = "AllowChangeLayer", g[g.AllowChangeLinetype = 16] = "AllowChangeLinetype", g[g.AllowChangeLinetypeScale = 32] = "AllowChangeLinetypeScale", g[g.AllowChangeVisibility = 64] = "AllowChangeVisibility", g[g.AllowClone = 128] = "AllowClone", g[g.AllowChangeLineweight = 256] = "AllowChangeLineweight", g[g.AllowChangePlotStyleName = 512] = "AllowChangePlotStyleName", g[g.AllowAllExceptClone = 895] = "AllowAllExceptClone", g[g.AllowAll = 1023] = "AllowAll", g[g.DisableProxyWarning = 1024] = "DisableProxyWarning", g[g.R13FormatProxy = 32768] = "R13FormatProxy";
function I(e, n, a) {
  return e.code === n && (a == null || e.value === a);
}
function ue(e) {
  let n = {};
  e.rewind();
  let a = e.next(), t = a.code;
  if (n.x = a.value, (a = e.next()).code !== t + 10) throw Error("Expected code for point value to be 20 but got " + a.code + ".");
  return n.y = a.value, (a = e.next()).code !== t + 20 ? e.rewind() : n.z = a.value, n;
}
let Je = Symbol();
function u(e, n) {
  return (a, t, c) => {
    let o = function(l, d = !1) {
      return l.reduce((f, h) => {
        h.pushContext && f.push({});
        let y = f[f.length - 1];
        for (let x of typeof h.code == "number" ? [h.code] : h.code) {
          let S = y[x] ?? (y[x] = []);
          h.isMultiple && S.length, S.push(h);
        }
        return f;
      }, [{}]);
    }(e, t.debug), i = !1, m = o.length - 1;
    for (; !I(a, 0, "EOF"); ) {
      let l = function(w, W, me) {
        return w.find((lr, Ja) => {
          var Nr;
          return Ja >= me && ((Nr = lr[W]) == null ? void 0 : Nr.length);
        });
      }(o, a.code, m), d = l == null ? void 0 : l[a.code], f = d == null ? void 0 : d[d.length - 1];
      if (!l || !f) {
        t.rewind();
        break;
      }
      f.isMultiple || l[a.code].pop();
      let { name: h, parser: y, isMultiple: x, isReducible: S } = f, O = y == null ? void 0 : y(a, t, c);
      if (O === Je) {
        t.rewind();
        break;
      }
      if (h) {
        let [w, W] = ln(c, h);
        x && !S ? (Object.prototype.hasOwnProperty.call(w, W) || (w[W] = []), w[W].push(O)) : w[W] = O;
      }
      f.pushContext && (m -= 1), i = !0, a = t.next();
    }
    return n && Object.setPrototypeOf(c, n), i;
  };
}
function ln(e, n) {
  let a = n.split(".");
  if (!a.length) throw Error("[parserGenerator::getObjectByPath] Invalid empty path");
  let t = e;
  for (let c = 0; c < a.length - 1; ++c) {
    let o = Er(a[c]), i = Er(a[c + 1]);
    Object.prototype.hasOwnProperty.call(t, o) || (typeof i == "number" ? t[o] = [] : t[o] = {}), t = t[o];
  }
  return [t, Er(a[a.length - 1])];
}
function Er(e) {
  let n = Number.parseInt(e);
  return Number.isNaN(n) ? e : n;
}
function r({ value: e }) {
  return e;
}
function s(e, n) {
  return ue(n);
}
function p({ value: e }) {
  return !!e;
}
function dn({ value: e }) {
  return e.trim();
}
let pn = [{ code: 281, name: "isEntity", parser: p }, { code: 280, name: "wasProxy", parser: p }, { code: 91, name: "instanceCount", parser: r }, { code: 90, name: "proxyFlag", parser: r }, { code: 3, name: "appName", parser: r }, { code: 2, name: "cppClassName", parser: r }, { code: 1, name: "name", parser: r }], un = u(pn), mn = [{ code: 0, name: "classes", isMultiple: !0, parser(e, n) {
  if (e.value !== "CLASS") return Je;
  e = n.next();
  let a = {};
  return un(e, n, a), a;
} }], fn = u(mn);
(He = {})[He.RayTrace = 0] = "RayTrace", He[He.ShadowMap = 1] = "ShadowMap";
function z(e, n, a) {
  for (; I(e, 102); ) {
    var t;
    let c = e.value;
    if (e = n.next(), !c.startsWith("{")) {
      n.debug, function(i, m) {
        for (; !I(i, 102) && !I(i, 0, "EOF"); ) i = m.next();
      }(e, n), e = n.next();
      continue;
    }
    let o = c.slice(1).trim();
    a.extensions ?? (a.extensions = {}), (t = a.extensions)[o] ?? (t[o] = []), function(i, m, l) {
      for (; !I(i, 102, "}") && !I(i, 0, "EOF"); ) l.push(i), i = m.next();
    }(e, n, a.extensions[o]), e = n.next();
  }
  n.rewind();
}
let bn = [{ code: 1001, name: "xdata", isMultiple: !0, parser: Tr }], In = /* @__PURE__ */ new Set([1010, 1011, 1012, 1013]);
function Tr(e, n) {
  var c;
  if (!I(e, 1001)) throw Error("XData must starts with code 1001");
  let a = { appName: e.value, value: [] };
  e = n.next();
  let t = [a.value];
  for (; !I(e, 0, "EOF") && !I(e, 1001) && e.code >= 1e3; ) {
    let o = t[t.length - 1];
    if (e.code === 1002) {
      e.value === "{" ? t.push([]) : (t.pop(), (c = t[t.length - 1]) == null || c.push(o)), e = n.next();
      continue;
    }
    In.has(e.code) ? o.push(ue(n)) : o.push(e.value), e = n.next();
  }
  return n.rewind(), a;
}
class er {
  parseEntity(n, a) {
    let t = {}, c = "none", o = !1;
    for (; !I(a, 0, "EOF"); ) {
      switch (a.code) {
        case 100:
          a.value === "AcDbProxyEntity" && (t.subclassMarker = "AcDbProxyEntity", o = !0);
          break;
        case 90:
          t.proxyEntityClassId = a.value, c = "none";
          break;
        case 91:
          t.applicationEntityClassId = a.value, c = "none";
          break;
        case 1:
          o && (t.originalDxfName = String(a.value));
          break;
        case 92:
        case 160:
          t.graphicsDataSize = a.value, c = "graphics";
          break;
        case 93:
        case 161:
          t.entityDataSize = a.value, c = "entity";
          break;
        case 96:
        case 162:
          t.unknownDataSize = a.value, c = "unknown";
          break;
        case 310:
          c === "graphics" ? t.graphicsData = (t.graphicsData ?? "") + a.value : c === "entity" && (t.entityData = (t.entityData ?? "") + a.value);
          break;
        case 311:
          c === "unknown" && (t.unknownData = (t.unknownData ?? "") + a.value);
          break;
        case 330:
        case 340:
        case 350:
        case 360:
          c = "none", o ? (t.linkedObjectIds ?? (t.linkedObjectIds = [])).push(String(a.value)) : a.code === 330 && (t.ownerBlockRecordSoftId = String(a.value));
          break;
        case 94:
          c = "none";
          break;
        case 95:
          t.objectDrawingFormat = a.value;
          break;
        case 70:
          t.originalDataFormat = a.value;
          break;
        case 5:
          t.handle = String(a.value);
          break;
        case 102:
          z(a, n, t);
          break;
        case 67:
          t.isInPaperSpace = !!a.value;
          break;
        case 8:
          t.layer = String(a.value);
          break;
        case 6:
          t.lineType = String(a.value);
          break;
        case 347:
          t.materialObjectHardId = String(a.value);
          break;
        case 62:
          t.colorIndex = a.value;
          break;
        case 370:
          t.lineweight = a.value;
          break;
        case 48:
          t.lineTypeScale = a.value;
          break;
        case 60:
          t.isVisible = !!a.value;
          break;
        case 420:
          t.color = a.value;
          break;
        case 430:
          t.colorName = String(a.value);
          break;
        case 440:
          t.transparency = a.value;
          break;
        case 380:
          t.plotStyleType = a.value;
          break;
        case 390:
          t.plotStyleHardId = String(a.value);
          break;
        case 284:
          t.shadowMode = a.value;
          break;
        case 410:
          t.layoutTabName = String(a.value);
          break;
        case 1001:
          (t.xdata ?? (t.xdata = [])).push(Tr(a, n));
          break;
        default:
          return n.rewind(), t;
      }
      a = n.next();
    }
    return n.rewind(), t;
  }
}
(dr = "ForEntityName") in er ? Object.defineProperty(er, dr, { value: "ACAD_PROXY_ENTITY", enumerable: !0, configurable: !0, writable: !0 }) : er[dr] = "ACAD_PROXY_ENTITY";
(pr = {})[pr.ProxyEntity = 498] = "ProxyEntity";
(Ge = {})[Ge.Dwg = 0] = "Dwg", Ge[Ge.Dxf = 1] = "Dxf";
(Q = {})[Q.CAST_AND_RECEIVE = 0] = "CAST_AND_RECEIVE", Q[Q.CAST = 1] = "CAST", Q[Q.RECEIVE = 2] = "RECEIVE", Q[Q.IGNORE = 3] = "IGNORE";
let E = [...bn, { code: 284, name: "shadowMode", parser: r }, { code: 390, name: "plotStyleHardId", parser: r }, { code: 380, name: "plotStyleType", parser: r }, { code: 440, name: "transparency", parser: r }, { code: 430, name: "colorName", parser: r }, { code: 420, name: "color", parser: r }, { code: 310, name: "proxyEntity", isMultiple: !0, isReducible: !0, parser: (e, n, a) => (a.proxyEntity ?? "") + e.value }, { code: [92, 160], name: "proxyByte", parser: r }, { code: 60, name: "isVisible", parser: p }, { code: 48, name: "lineTypeScale", parser: r }, { code: 370, name: "lineweight", parser: r }, { code: 62, name: "colorIndex", parser: r }, { code: 347, name: "materialObjectHardId", parser: r }, { code: 6, name: "lineType", parser: r }, { code: 8, name: "layer", parser: r }, { code: 410, name: "layoutTabName", parser: r }, { code: 67, name: "isInPaperSpace", parser: p }, { code: 100 }, { code: 330, name: "ownerBlockRecordSoftId", parser: r }, { code: 102, parser: z }, { code: 102, parser: z }, { code: 102, parser: z }, { code: 5, name: "handle", parser: r }];
function ir(e) {
  return [{ code: 3, name: e, parser: (n, a, t) => (t._code3text = (t._code3text ?? "") + n.value, t._code3text + (t._code1text ?? "")), isMultiple: !0, isReducible: !0 }, { code: 1, name: e, parser: (n, a, t) => (t._code1text = n.value, (t._code3text ?? "") + t._code1text) }];
}
function wr(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
let hn = { extrusionDirection: { x: 0, y: 0, z: 1 } }, En = [{ code: 210, name: "extrusionDirection", parser: s }, { code: 51, name: "endAngle", parser: r }, { code: 50, name: "startAngle", parser: r }, { code: 100, name: "subclassMarker", parser: r }, { code: 40, name: "radius", parser: r }, { code: 10, name: "center", parser: s }, { code: 39, name: "thickness", parser: r }, { code: 100 }, ...E];
class Rr {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    wr(this, "parser", u(En, hn));
  }
}
wr(Rr, "ForEntityName", "ARC");
(ve = {})[ve.BeforeText = 0] = "BeforeText", ve[ve.AboveText = 1] = "AboveText", ve[ve.None = 2] = "None";
let Sr = [{ name: "DIMPOST", code: 3 }, { name: "DIMAPOST", code: 4, defaultValue: "" }, { name: "DIMBLK_OBSOLETE", code: 5 }, { name: "DIMBLK1_OBSOLETE", code: 6 }, { name: "DIMBLK2_OBSOLETE", code: 7 }, { name: "DIMSCALE", code: 40, defaultValue: 1 }, { name: "DIMASZ", code: 41, defaultValue: 0.25 }, { name: "DIMEXO", code: 42, defaultValue: 0.625, defaultValueImperial: 0.0625 }, { name: "DIMDLI", code: 43, defaultValue: 3.75, defaultValueImperial: 0.38 }, { name: "DIMEXE", code: 44, defaultValue: 2.25, defaultValueImperial: 0.28 }, { name: "DIMRND", code: 45, defaultValue: 0 }, { name: "DIMDLE", code: 46, defaultValue: 0 }, { name: "DIMTP", code: 47, defaultValue: 0 }, { name: "DIMTM", code: 48, defaultValue: 0 }, { name: "DIMFXL", code: 49, defaultValue: 1 }, { name: "DIMJOGANG", code: 50, defaultValue: 45 }, { name: "DIMTFILL", code: 69, defaultValue: 0 }, { name: "DIMTFILLCLR", code: 70, defaultValue: 0 }, { name: "DIMTOL", code: 71, defaultValue: 0, defaultValueImperial: 1 }, { name: "DIMLIM", code: 72, defaultValue: 0 }, { name: "DIMTIH", code: 73, defaultValue: 0, defaultValueImperial: 1 }, { name: "DIMTOH", code: 74, defaultValue: 0, defaultValueImperial: 1 }, { name: "DIMSE1", code: 75, defaultValue: 0 }, { name: "DIMSE2", code: 76, defaultValue: 0 }, { name: "DIMTAD", code: 77, defaultValue: Dr.Above, defaultValueImperial: Dr.Center }, { name: "DIMZIN", code: 78, defaultValue: Le.Trailing, defaultValueImperial: Le.Feet }, { name: "DIMAZIN", code: 79, defaultValue: nn.None }, { name: "DIMARCSYM", code: 90, defaultValue: 0 }, { name: "DIMTXT", code: 140, defaultValue: 2.5, defaultValueImperial: 0.28 }, { name: "DIMCEN", code: 141, defaultValue: 2.5, defaultValueImperial: 0.09 }, { name: "DIMTSZ", code: 142, defaultValue: 0 }, { name: "DIMALTF", code: 143, defaultValue: 25.4 }, { name: "DIMLFAC", code: 144, defaultValue: 1 }, { name: "DIMTVP", code: 145, defaultValue: 0 }, { name: "DIMTFAC", code: 146, defaultValue: 1 }, { name: "DIMGAP", code: 147, defaultValue: 0.625, defaultValueImperial: 0.09 }, { name: "DIMALTRND", code: 148, defaultValue: 0 }, { name: "DIMALT", code: 170, defaultValue: 0 }, { name: "DIMALTD", code: 171, defaultValue: 3, defaultValueImperial: 2 }, { name: "DIMTOFL", code: 172, defaultValue: 1, defaultValueImperial: 0 }, { name: "DIMSAH", code: 173, defaultValue: 0 }, { name: "DIMTIX", code: 174, defaultValue: 0 }, { name: "DIMSOXD", code: 175, defaultValue: 0 }, { name: "DIMCLRD", code: 176, defaultValue: 0 }, { name: "DIMCLRE", code: 177, defaultValue: 0 }, { name: "DIMCLRT", code: 178, defaultValue: 0 }, { name: "DIMADEC", code: 179, defaultValue: 0 }, { name: "DIMUNIT", code: 270 }, { name: "DIMDEC", code: 271, defaultValue: 2, defaultValueImperial: 4 }, { name: "DIMTDEC", code: 272, defaultValue: 2, defaultValueImperial: 4 }, { name: "DIMALTU", code: 273, defaultValue: 2 }, { name: "DIMALTTD", code: 274, defaultValue: 3, defaultValueImperial: 2 }, { name: "DIMAUNIT", code: 275, defaultValue: 0 }, { name: "DIMFRAC", code: 276, defaultValue: 0 }, { name: "DIMLUNIT", code: 277, defaultValue: 2 }, { name: "DIMDSEP", code: 278, defaultValue: 44, defaultValueImperial: 46 }, { name: "DIMTMOVE", code: 279, defaultValue: 0 }, { name: "DIMJUST", code: 280, defaultValue: tn.Center }, { name: "DIMSD1", code: 281, defaultValue: 0 }, { name: "DIMSD2", code: 282, defaultValue: 0 }, { name: "DIMTOLJ", code: 283, defaultValue: on.Center }, { name: "DIMTZIN", code: 284, defaultValue: Le.Trailing, defaultValueImperial: Le.Feet }, { name: "DIMALTZ", code: 285, defaultValue: Le.Trailing }, { name: "DIMALTTZ", code: 286, defaultValue: Le.Trailing }, { name: "DIMFIT", code: 287 }, { name: "DIMUPT", code: 288, defaultValue: 0 }, { name: "DIMATFIT", code: 289, defaultValue: 3 }, { name: "DIMFXLON", code: 290, defaultValue: 0 }, { name: "DIMTXTDIRECTION", code: 294, defaultValue: 0 }, { name: "DIMTXSTY", code: 340, defaultValue: "Standard" }, { name: "DIMLDRBLK", code: 341, defaultValue: "" }, { name: "DIMBLK", code: 342, defaultValue: "" }, { name: "DIMBLK1", code: 343, defaultValue: "" }, { name: "DIMBLK2", code: 344, defaultValue: "" }, { name: "DIMLTYPE", code: 345, defaultValue: "" }, { name: "DIMLTEX1", code: 346, defaultValue: "" }, { name: "DIMLTEX2", code: 347, defaultValue: "" }, { name: "DIMLWD", code: 371, defaultValue: -2 }, { name: "DIMLWE", code: 372, defaultValue: -2 }], Fr = [{ code: 3, name: "styleName", parser: r }, { code: 210, name: "extrusionDirection", parser: s }, { code: 51, name: "ocsRotation", parser: r }, { code: 53, name: "textRotation", parser: r }, { code: 1, name: "text", parser: r }, { code: 42, name: "measurement", parser: r }, { code: 72, name: "textLineSpacingStyle", parser: r }, { code: 71, name: "attachmentPoint", parser: r }, { code: 70, name: "dimensionType", parser: r }, { code: 11, name: "textPoint", parser: s }, { code: 10, name: "definitionPoint", parser: s }, { code: 2, name: "name", parser: r }, { code: 280, name: "version", parser: r }, { code: 100 }], gn = [{ code: 100 }, { code: 52, name: "obliqueAngle", parser: r }, { code: 50, name: "rotationAngle", parser: r }, { code: 14, name: "subDefinitionPoint2", parser: s }, { code: 13, name: "subDefinitionPoint1", parser: s }, { code: 12, name: "insertionPoint", parser: s }, { code: 100, name: "subclassMarker", parser: r }], xn = [{ code: 16, name: "arcPoint", parser: s }, { code: 15, name: "centerPoint", parser: s }, { code: 14, name: "subDefinitionPoint2", parser: s }, { code: 13, name: "subDefinitionPoint1", parser: s }, { code: 100, name: "subclassMarker", parser: r }], vn = [{ code: 14, name: "subDefinitionPoint2", parser: s }, { code: 13, name: "subDefinitionPoint1", parser: s }, { code: 100, name: "subclassMarker", parser: r }], yn = [{ code: 40, name: "leaderLength", parser: r }, { code: 15, name: "subDefinitionPoint", parser: s }, { code: 100, name: "subclassMarker", parser: r }], Tn = [{ code: 100, parser(e, n, a) {
  let t = function(c) {
    switch (c) {
      case "AcDbAlignedDimension":
        return u(gn);
      case "AcDb3PointAngularDimension":
      case "AcDb2LineAngularDimension":
        return u(xn);
      case "AcDbOrdinateDimension":
        return u(vn);
      case "AcDbRadialDimension":
      case "AcDbDiametricDimension":
        return u(yn);
    }
    return null;
  }(e.value);
  if (!t) return Je;
  t(e, n, a);
}, pushContext: !0 }, ...Sr.map((e) => ({ ...e, parser: r })), ...Fr, ...E];
class rr {
  parseEntity(n, a) {
    let t = {};
    return u(Tn)(a, n, t), t;
  }
}
(ur = "ForEntityName") in rr ? Object.defineProperty(rr, ur, { value: "DIMENSION", enumerable: !0, configurable: !0, writable: !0 }) : rr[ur] = "DIMENSION";
let Sn = [{ code: 73 }, { code: 17, name: "leaderEnd", parser: s }, { code: 16, name: "leaderStart", parser: s }, { code: 71, name: "hasLeader", parser: p }, { code: 41, name: "endAngle", parser: r }, { code: 40, name: "startAngle", parser: r }, { code: 70, name: "isPartial", parser: p }, { code: 15, name: "centerPoint", parser: s }, { code: 14, name: "xline2Point", parser: s }, { code: 13, name: "xline1Point", parser: s }, { code: 100, name: "subclassMarker", parser: r, pushContext: !0 }, ...Sr.map((e) => ({ ...e, parser: r })), ...Fr, ...E];
class ar {
  parseEntity(n, a) {
    let t = {};
    return u(Sn)(a, n, t), t;
  }
}
(mr = "ForEntityName") in ar ? Object.defineProperty(ar, mr, { value: "ARC_DIMENSION", enumerable: !0, configurable: !0, writable: !0 }) : ar[mr] = "ARC_DIMENSION";
(X = {})[X.NONE = 0] = "NONE", X[X.INVISIBLE = 1] = "INVISIBLE", X[X.CONSTANT = 2] = "CONSTANT", X[X.VERIFICATION_REQUIRED = 4] = "VERIFICATION_REQUIRED", X[X.PRESET = 8] = "PRESET";
(We = {})[We.MULTILINE = 2] = "MULTILINE", We[We.CONSTANT_MULTILINE = 4] = "CONSTANT_MULTILINE";
(ye = {})[ye.NONE = 0] = "NONE", ye[ye.MIRRORED_X = 2] = "MIRRORED_X", ye[ye.MIRRORED_Y = 4] = "MIRRORED_Y";
var On = ((P = {})[P.LEFT = 0] = "LEFT", P[P.CENTER = 1] = "CENTER", P[P.RIGHT = 2] = "RIGHT", P[P.ALIGNED = 3] = "ALIGNED", P[P.MIDDLE = 4] = "MIDDLE", P[P.FIT = 5] = "FIT", P), Nn = ((ee = {})[ee.BASELINE = 0] = "BASELINE", ee[ee.BOTTOM = 1] = "BOTTOM", ee[ee.MIDDLE = 2] = "MIDDLE", ee[ee.TOP = 3] = "TOP", ee);
function Pr(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
let Vr = { thickness: 0, rotation: 0, xScale: 1, obliqueAngle: 0, styleName: "STANDARD", generationFlag: 0, halign: On.LEFT, valign: Nn.BASELINE, extrusionDirection: { x: 0, y: 0, z: 1 } }, Br = [{ code: 73, name: "valign", parser: r }, { code: 100 }, { code: 210, name: "extrusionDirection", parser: s }, { code: 11, name: "endPoint", parser: s }, { code: 72, name: "valign", parser: r }, { code: 72, name: "halign", parser: r }, { code: 71, name: "generationFlag", parser: r }, { code: 7, name: "styleName", parser: r }, { code: 51, name: "obliqueAngle", parser: r }, { code: 41, name: "xScale", parser: r }, { code: 50, name: "rotation", parser: r }, { code: 1, name: "text", parser: r }, { code: 40, name: "textHeight", parser: r }, { code: 10, name: "startPoint", parser: s }, { code: 39, name: "thickness", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class Ur {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Pr(this, "parser", u(Br, Vr));
  }
}
function Hr(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
Pr(Ur, "ForEntityName", "TEXT");
let An = { ...Vr }, Dn = [{ code: 2 }, { code: 40, name: "annotationScale", parser: r }, { code: 10, name: "alignmentPoint", parser: s }, { code: 340, name: "secondaryAttributesHardIds", isMultiple: !0, parser: r }, { code: 70, name: "numberOfSecondaryAttributes", parser: r }, { code: 70, name: "isReallyLocked", parser: p }, { code: 70, name: "mtextFlag", parser: r }, { code: 280, name: "isDuplicatedRecord", parser: p }, { code: 100 }, { code: 280, name: "isLocked", parser: p }, { code: 74, name: "valign", parser: r }, { code: 73 }, { code: 70, name: "attributeFlag", parser: r }, { code: 2, name: "tag", parser: r }, { code: 3, name: "prompt", parser: r }, { code: 280 }, { code: 100, name: "subclassMarker", parser: r }, ...Br.slice(2)];
class Gr {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Hr(this, "parser", u(Dn, An));
  }
}
function kn(e, n) {
  let a = {};
  for (let t of e) {
    let c = n(t);
    c != null && (a[c] ?? (a[c] = []), a[c].push(t));
  }
  return a;
}
function* cr(e, n = 1 / 0, a = 1) {
  for (let t = e; t !== n; t += a) yield t;
}
function vr(e) {
  return { x: e.x ?? 0, y: e.y ?? 0, z: e.z ?? 0 };
}
Hr(Gr, "ForEntityName", "ATTDEF");
var Ln = [0, 16711680, 16776960, 65280, 65535, 255, 16711935, 16777215, 8421504, 12632256, 16711680, 16744319, 13369344, 13395558, 10027008, 10046540, 8323072, 8339263, 4980736, 4990502, 16727808, 16752511, 13382400, 13401958, 10036736, 10051404, 8331008, 8343359, 4985600, 4992806, 16744192, 16760703, 13395456, 13408614, 10046464, 10056268, 8339200, 8347455, 4990464, 4995366, 16760576, 16768895, 13408512, 13415014, 10056192, 10061132, 8347392, 8351551, 4995328, 4997670, 16776960, 16777087, 13421568, 13421670, 10000384, 10000460, 8355584, 8355647, 5000192, 5000230, 12582656, 14679935, 10079232, 11717734, 7510016, 8755276, 6258432, 7307071, 3755008, 4344870, 8388352, 12582783, 6736896, 10079334, 5019648, 7510092, 4161280, 6258495, 2509824, 3755046, 4194048, 10485631, 3394560, 8375398, 2529280, 6264908, 2064128, 5209919, 1264640, 3099686, 65280, 8388479, 52224, 6736998, 38912, 5019724, 32512, 4161343, 19456, 2509862, 65343, 8388511, 52275, 6737023, 38950, 5019743, 32543, 4161359, 19475, 2509871, 65407, 8388543, 52326, 6737049, 38988, 5019762, 32575, 4161375, 19494, 2509881, 65471, 8388575, 52377, 6737074, 39026, 5019781, 32607, 4161391, 19513, 2509890, 65535, 8388607, 52428, 6737100, 39064, 5019800, 32639, 4161407, 19532, 2509900, 49151, 8380415, 39372, 6730444, 29336, 5014936, 24447, 4157311, 14668, 2507340, 32767, 8372223, 26316, 6724044, 19608, 5010072, 16255, 4153215, 9804, 2505036, 16383, 8364031, 13260, 6717388, 9880, 5005208, 8063, 4149119, 4940, 2502476, 255, 8355839, 204, 6710988, 152, 5000344, 127, 4145023, 76, 2500172, 4129023, 10452991, 3342540, 8349388, 2490520, 6245528, 2031743, 5193599, 1245260, 3089996, 8323327, 12550143, 6684876, 10053324, 4980888, 7490712, 4128895, 6242175, 2490444, 3745356, 12517631, 14647295, 10027212, 11691724, 7471256, 8735896, 6226047, 7290751, 3735628, 4335180, 16711935, 16744447, 13369548, 13395660, 9961624, 9981080, 8323199, 8339327, 4980812, 4990540, 16711871, 16744415, 13369497, 13395634, 9961586, 9981061, 8323167, 8339311, 4980793, 4990530, 16711807, 16744383, 13369446, 13395609, 9961548, 9981042, 8323135, 8339295, 4980774, 4990521, 16711743, 16744351, 13369395, 13395583, 9961510, 9981023, 8323103, 8339279, 4980755, 4990511, 3355443, 5987163, 8684676, 11382189, 14079702, 16777215];
function Mn(e) {
  return Ln[e];
}
function Cn(e) {
  e.rewind();
  let n = e.next();
  if (n.code !== 101) throw Error("Bad call for skipEmbeddedObject()");
  do
    n = e.next();
  while (n.code !== 0);
  e.rewind();
}
function _n(e, n, a) {
  if (I(n, 102)) return z(n, a, e), !0;
  switch (n.code) {
    case 0:
      e.type = n.value;
      break;
    case 5:
      e.handle = n.value;
      break;
    case 330:
      e.ownerBlockRecordSoftId = n.value;
      break;
    case 67:
      e.isInPaperSpace = !!n.value;
      break;
    case 8:
      e.layer = n.value;
      break;
    case 6:
      e.lineType = n.value;
      break;
    case 347:
      e.materialObjectHardId = n.value;
      break;
    case 62:
      e.colorIndex = n.value, e.color = Mn(Math.abs(n.value));
      break;
    case 370:
      e.lineweight = n.value;
      break;
    case 48:
      e.lineTypeScale = n.value;
      break;
    case 60:
      e.isVisible = !!n.value;
      break;
    case 92:
      e.proxyByte = n.value;
      break;
    case 310:
      e.proxyEntity = n.value;
      break;
    case 100:
      break;
    case 420:
      e.color = n.value;
      break;
    case 430:
      e.transparency = n.value;
      break;
    case 390:
      e.plotStyleHardId = n.value;
      break;
    case 284:
      e.shadowMode = n.value;
      break;
    case 1001:
      (e.xdata ?? (e.xdata = [])).push(Tr(n, a));
      break;
    default:
      return !1;
  }
  return !0;
}
function Wr(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
let wn = { textStyle: "STANDARD", extrusionDirection: { x: 0, y: 0, z: 1 }, rotation: 0 }, nr = [{ code: 46, name: "annotationHeight", parser: r }, { code: 101, parser(e, n) {
  Cn(n);
} }, { code: 50, name: "columnHeight", parser: r }, { code: 49, name: "columnGutter", parser: r }, { code: 48, name: "columnWidth", parser: r }, { code: 79, name: "columnAutoHeight", parser: r }, { code: 78, name: "columnFlowReversed", parser: r }, { code: 76, name: "columnCount", parser: r }, { code: 75, name: "columnType", parser: r }, { code: 441, name: "backgroundFillTransparency", parser: r }, { code: 63, name: "backgroundFillColor", parser: r }, { code: 45, name: "fillBoxScale", parser: r }, { code: [...cr(430, 440)], name: "backgroundColor", parser: r }, { code: [...cr(420, 430)], name: "backgroundColor", parser: r }, { code: 90, name: "backgroundFill", parser: r }, { code: 44, name: "lineSpacing", parser: r }, { code: 73, name: "lineSpacingStyle", parser: r }, { code: 50, name: "rotation", parser: r }, { code: 43 }, { code: 42 }, { code: 11, name: "direction", parser: s }, { code: 210, name: "extrusionDirection", parser: s }, { code: 7, name: "styleName", parser: r }, ...ir("text"), { code: 72, name: "drawingDirection", parser: r }, { code: 71, name: "attachmentPoint", parser: r }, { code: 41, name: "width", parser: r }, { code: 40, name: "height", parser: r }, { code: 10, name: "insertionPoint", parser: s }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class jr {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Wr(this, "parser", u(nr, wn));
  }
}
function Yr(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
Wr(jr, "ForEntityName", "MTEXT");
let Rn = { thickness: 0, rotation: 0, scale: 1, obliqueAngle: 0, textStyle: "STANDARD", textGenerationFlag: 0, horizontalJustification: 0, verticalJustification: 0, extrusionDirection: { x: 0, y: 0, z: 1 } }, Fn = [...nr.slice(nr.findIndex(({ name: e }) => e === "columnType"), nr.findIndex(({ name: e }) => e === "subclassMarker") + 1), { code: 100 }, { code: 0, parser(e) {
  if (!I(e, 0, "MTEXT")) return Je;
} }, { code: 2, name: "definitionTag", parser: r }, { code: 40, name: "annotationScale", parser: r }, { code: 10, name: "alignmentPoint", parser: s }, { code: 340, name: "secondaryAttributesHardId", parser: r }, { code: 70, name: "numberOfSecondaryAttributes", parser: r }, { code: 70, name: "isReallyLocked", parser: p }, { code: 70, name: "mtextFlag", parser: r }, { code: 280, name: "isDuplicatedEntriesKeep", parser: p }, { code: 100 }, { code: 280, name: "lockPositionFlag", parser: p }, { code: 210, name: "extrusionDirection", parser: s }, { code: 11, name: "alignmentPoint", parser: s }, { code: 74, name: "verticalJustification", parser: r }, { code: 72, name: "horizontalJustification", parser: r }, { code: 71, name: "textGenerationFlag", parser: r }, { code: 7, name: "textStyle", parser: r }, { code: 51, name: "obliqueAngle", parser: r }, { code: 41, name: "scale", parser: r }, { code: 50, name: "rotation", parser: r }, { code: 73 }, { code: 70, name: "attributeFlag", parser: r }, { code: 2, name: "tag", parser: r }, { code: 280 }, { code: 100, name: "subclassMarker", parser: r }, { code: 1, name: "text", parser: r }, { code: 40, name: "textHeight", parser: r }, { code: 10, name: "startPoint", parser: s }, { code: 39, name: "thickness", parser: r }, { code: 100 }, ...E];
class Xr {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Yr(this, "parser", u(Fn, Rn));
  }
}
function zr(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
Yr(Xr, "ForEntityName", "ATTRIB");
let Pn = [...ir("data"), { code: 70, name: "version", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class Kr {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    zr(this, "parser", u(Pn));
  }
}
function Zr(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
zr(Kr, "ForEntityName", "BODY");
let Vn = { thickness: 0, extrusionDirection: { x: 0, y: 0, z: 1 } }, Bn = [{ code: 210, name: "extrusionDirection", parser: s }, { code: 40, name: "radius", parser: r }, { code: 10, name: "center", parser: s }, { code: 39, name: "thickness", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class Jr {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Zr(this, "parser", u(Bn, Vn));
  }
}
function $r(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
Zr(Jr, "ForEntityName", "CIRCLE");
let Un = { extrusionDirection: { x: 0, y: 0, z: 1 } }, Hn = [{ code: 42, name: "endAngle", parser: r }, { code: 41, name: "startAngle", parser: r }, { code: 40, name: "axisRatio", parser: r }, { code: 210, name: "extrusionDirection", parser: s }, { code: 11, name: "majorAxisEndPoint", parser: s }, { code: 10, name: "center", parser: s }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class qr {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    $r(this, "parser", u(Hn, Un));
  }
}
function Qr(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
$r(qr, "ForEntityName", "ELLIPSE");
let Gn = [{ code: 70, name: "invisibleEdgeFlags", parser: r }, { code: 13, name: "vertices.3", parser: s }, { code: 12, name: "vertices.2", parser: s }, { code: 11, name: "vertices.1", parser: s }, { code: 10, name: "vertices.0", parser: s }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class ea {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Qr(this, "parser", u(Gn));
  }
}
Qr(ea, "ForEntityName", "3DFACE");
(re = {})[re.First = 1] = "First", re[re.Second = 2] = "Second", re[re.Third = 4] = "Third", re[re.Fourth = 8] = "Fourth";
function Ke(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
class kr {
  getReadIndex() {
    return this._pointer;
  }
  getLines() {
    return this._data;
  }
  next() {
    if (!this.hasNext()) return this._eof ? this.debug : this.debug, { code: 0, value: "EOF" };
    let n = this._data[this._pointer++], a = parseInt(n, 10);
    Number.isNaN(a) && Lr(n);
    let t = yr(a, this._data[this._pointer++], this.debug), c = { code: a, value: t };
    return I(c, 0, "EOF") && (this._eof = !0), this.lastReadGroup = c, c;
  }
  peek() {
    if (!this.hasNext()) throw this._eof ? Error("Cannot call 'next' after EOF group has been read") : Error("Unexpected end of input: EOF group not read before end of file. Ended on code " + this._data[this._pointer]);
    let n = this._data[this._pointer], a = parseInt(n, 10);
    Number.isNaN(a) && Lr(n);
    let t = { code: a, value: 0 };
    return t.value = yr(t.code, this._data[this._pointer + 1], this.debug), t;
  }
  rewind(n) {
    n = n || 1, this._pointer = this._pointer - 2 * n;
  }
  hasNext() {
    return !this._eof && !(this._pointer > this._data.length - 2);
  }
  isEOF() {
    return this._eof;
  }
  constructor(n, a = !1) {
    Ke(this, "_data", void 0), Ke(this, "debug", void 0), Ke(this, "_pointer", void 0), Ke(this, "_eof", void 0), Ke(this, "lastReadGroup", void 0), this._data = n, this.debug = a, this.lastReadGroup = { code: 0, value: 0 }, this._pointer = 0, this._eof = !1;
  }
}
function yr(e, n, a = !1) {
  var t;
  let c = (t = n).endsWith("\r") ? t.slice(0, -1) : t;
  return e <= 9 ? c : e >= 10 && e <= 59 ? parseFloat(n.trim()) : e >= 60 && e <= 99 ? parseInt(n.trim()) : e >= 100 && e <= 109 ? c : e >= 110 && e <= 149 ? parseFloat(n.trim()) : e >= 160 && e <= 179 ? parseInt(n.trim()) : e >= 210 && e <= 239 ? parseFloat(n.trim()) : e >= 270 && e <= 289 ? parseInt(n.trim()) : e >= 290 && e <= 299 ? function(o) {
    let i = o.trim().toLowerCase();
    if (i === "" || i === "0" || i === "false" || i === "f" || i === "no") return !1;
    if (i === "1" || i === "true" || i === "t" || i === "yes") return !0;
    let m = Number.parseFloat(i);
    if (!Number.isNaN(m)) return m !== 0;
    throw TypeError("String '" + o + "' cannot be cast to Boolean type");
  }(n.trim()) : e >= 300 && e <= 369 ? c : e >= 370 && e <= 389 ? parseInt(n.trim()) : e >= 390 && e <= 399 ? c : e >= 400 && e <= 409 ? parseInt(n.trim()) : e >= 410 && e <= 419 ? c : e >= 420 && e <= 429 ? parseInt(n.trim()) : e >= 430 && e <= 439 ? c : e >= 440 && e <= 459 ? parseInt(n.trim()) : e >= 460 && e <= 469 ? parseFloat(n.trim()) : e >= 470 && e <= 481 || e === 999 || e >= 1e3 && e <= 1009 ? c : e >= 1010 && e <= 1059 ? parseFloat(n.trim()) : e >= 1060 && e <= 1071 ? parseInt(n.trim()) : c;
}
function Lr(e) {
  let n = e.length > 120 ? `${e.slice(0, 120)}…` : e;
  throw Error(`Invalid DXF group code line: "${n}". Expected a numeric group code (often caused by binary DXF, UTF-16-encoded DXF, or stray blank lines). Use ASCII/text DXF or remove blank lines between code/value pairs.`);
}
let ra = [{ code: 330, name: "sourceBoundaryObjects", parser: r, isMultiple: !0 }, { code: 97, name: "numberOfSourceBoundaryObjects", parser: r }], Wn = [{ code: 11, name: "end", parser: s }, { code: 10, name: "start", parser: s }], jn = [{ code: 73, name: "isCCW", parser: p }, { code: 51, name: "endAngle", parser: r }, { code: 50, name: "startAngle", parser: r }, { code: 40, name: "radius", parser: r }, { code: 10, name: "center", parser: s }], Yn = [{ code: 73, name: "isCCW", parser: p }, { code: 51, name: "endAngle", parser: r }, { code: 50, name: "startAngle", parser: r }, { code: 40, name: "lengthOfMinorAxis", parser: r }, { code: 11, name: "end", parser: s }, { code: 10, name: "center", parser: s }], Xn = [{ code: 13, name: "endTangent", parser: s }, { code: 12, name: "startTangent", parser: s }, { code: 11, name: "fitDatum", isMultiple: !0, parser: s }, { code: 97, name: "numberOfFitData", parser: r }, { code: 10, name: "controlPoints", isMultiple: !0, parser(e, n) {
  let a = { ...ue(n), weight: 1 };
  return (e = n.next()).code === 42 ? a.weight = e.value : n.rewind(), a;
} }, { code: 40, name: "knots", isMultiple: !0, parser: r }, { code: 96, name: "numberOfControlPoints", parser: r }, { code: 95, name: "numberOfKnots", parser: r }, { code: 74, name: "isPeriodic", parser: p }, { code: 73, name: "splineFlag", parser: r }, { code: 94, name: "degree", parser: r }], zn = { [$e.Line]: Wn, [$e.Circular]: jn, [$e.Elliptic]: Yn, [$e.Spline]: Xn }, Kn = [...ra, { code: 72, name: "edges", parser(e, n) {
  let a = { type: e.value }, t = zn[a.type];
  if (t == null) throw Error(`Unsupported HATCH boundary edge type: ${a.type} (expected 1–4: line, arc, elliptic arc, spline). This often happens when a polyline hatch boundary is parsed as edge segments (e.g. group 92 boundary flag missing the polyline bit). Try re-saving as ASCII DXF or simplifying hatch boundaries in CAD.`);
  return u(t)(e = n.next(), n, a), a;
}, isMultiple: !0 }, { code: 93, name: "numberOfEdges", parser: r }], Zn = [...ra, { code: 10, name: "vertices", parser(e, n) {
  let a = { ...ue(n), bulge: 0 };
  return (e = n.next()).code === 42 ? a.bulge = e.value : n.rewind(), a;
}, isMultiple: !0 }, { code: 93, name: "numberOfVertices", parser: r }, { code: 73, name: "isClosed", parser: p }, { code: 72, name: "hasBulge", parser: p }];
function Jn(e, n) {
  let a = { boundaryPathTypeFlag: e.value }, t = !!(a.boundaryPathTypeFlag & sn.Polyline), c = n.getReadIndex();
  return e = n.next(), !t && function(o, i) {
    let m = Math.min(o.length, i + 120), l = i;
    for (; l < m - 1; ) {
      let d = parseInt(o[l], 10);
      if (Number.isNaN(d)) break;
      if (d === 93) {
        if (l + 3 >= o.length || parseInt(o[l + 2], 10) !== 72) return !1;
        let f = yr(72, o[l + 3]);
        if (f === 0) return !0;
        if (f === 1) {
          if (l + 5 < o.length && parseInt(o[l + 4], 10) === 73) return !0;
          if (l + 8 < o.length && parseInt(o[l + 4], 10) === 10) {
            let h = parseInt(o[l + 8], 10);
            if (h === 10 || h === 42) return !0;
          }
        }
        break;
      }
      if (d === 0) break;
      l += 2;
    }
    return !1;
  }(n.getLines(), c) && (t = !0), t ? u(Zn)(e, n, a) : u(Kn)(e, n, a), a;
}
let $n = [{ code: 49, name: "dashLengths", parser: r, isMultiple: !0 }, { code: 79, name: "numberOfDashLengths", parser: r }, { code: 45, name: "offset", parser: Mr }, { code: 43, name: "base", parser: Mr }, { code: 53, name: "angle", parser: r }];
function Mr(e, n) {
  let a = e.code + 1, t = { x: e.value, y: 1 };
  return (e = n.next()).code === a ? t.y = e.value : n.rewind(), t;
}
function qn(e, n) {
  let a = {};
  return u($n)(e, n, a), a;
}
function Qn(e, n) {
  let a = [];
  for (; e.code === 463; ) {
    let t = { reservedField: e.value };
    if ((e = n.next()).code === 63 && (t.colorIndex = e.value, e = n.next()), e.code === 421) t.rgb = e.value, a.push(t), e = n.next();
    else {
      n.rewind();
      break;
    }
  }
  return e.code !== 463 && a.length > 0 && n.rewind(), a;
}
function aa(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
let et = { extrusionDirection: { x: 0, y: 0, z: 1 }, gradientRotation: 0, colorTint: 0 }, rt = [{ code: 470, name: "gradientName", parser: r }, { code: 463, name: "gradientColors", parser: Qn }, { code: 462, name: "colorTint", parser: r }, { code: 461, name: "gradientDefinition", parser: r }, { code: 460, name: "gradientRotation", parser: r }, { code: 453, name: "numberOfColors", parser: r }, { code: 452, name: "gradientColorFlag", parser: r }, { code: 451 }, { code: 450, name: "gradientFlag", parser: r }, { code: 10, name: "seedPoints", parser: s, isMultiple: !0 }, { code: 99 }, { code: 11, name: "offsetVector", parser: s }, { code: 98, name: "numberOfSeedPoints", parser: r }, { code: 47, name: "pixelSize", parser: r }, { code: 53, name: "definitionLines", parser: qn, isMultiple: !0 }, { code: 78, name: "numberOfDefinitionLines", parser: r }, { code: 77, name: "isDouble", parser: p }, { code: 73, name: "isAnnotated", parser: p }, { code: 41, name: "patternScale", parser: r }, { code: 52, name: "patternAngle", parser: r }, { code: 76, name: "patternType", parser: r }, { code: 75, name: "hatchStyle", parser: r }, { code: 92, name: "boundaryPaths", parser: Jn, isMultiple: !0 }, { code: 91, name: "numberOfBoundaryPaths", parser: r }, { code: 71, name: "associativity", parser: r }, { code: 63, name: "patternFillColor", parser: r }, { code: 70, name: "solidFill", parser: r }, { code: 2, name: "patternName", parser: r }, { code: 210, name: "extrusionDirection", parser: s }, { code: 10, name: "elevationPoint", parser: s }, { code: 100, name: "subclassMarker", parser: r, pushContext: !0 }, ...E];
class na {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    aa(this, "parser", u(rt, et));
  }
}
function ta(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
aa(na, "ForEntityName", "HATCH");
let at = { brightness: 50, contrast: 50, fade: 0, clippingBoundaryPath: [] }, nt = [{ code: 290, name: "clipMode", parser: r }, { code: 14, name: "clippingBoundaryPath", isMultiple: !0, parser: s }, { code: 91, name: "countBoundaryPoints", parser: r }, { code: 71, name: "clippingBoundaryType", parser: r }, { code: 360, name: "imageDefReactorHandle", parser: r }, { code: 283, name: "fade", parser: r }, { code: 282, name: "contrast", parser: r }, { code: 281, name: "brightness", parser: r }, { code: 280, name: "isClipped", parser: p }, { code: 70, name: "flags", parser: r }, { code: 340, name: "imageDefHandle", parser: r }, { code: 13, name: "imageSize", parser: s }, { code: 12, name: "vPixel", parser: s }, { code: 11, name: "uPixel", parser: s }, { code: 10, name: "position", parser: s }, { code: 90, name: "version", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class oa {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    ta(this, "parser", u(nt, at));
  }
}
ta(oa, "ForEntityName", "IMAGE");
(ae = {})[ae.ShowImage = 1] = "ShowImage", ae[ae.ShowImageWhenNotAlignedWithScreen = 2] = "ShowImageWhenNotAlignedWithScreen", ae[ae.UseClippingBoundary = 4] = "UseClippingBoundary", ae[ae.TransparencyIsOn = 8] = "TransparencyIsOn";
(je = {})[je.Rectangular = 1] = "Rectangular", je[je.Polygonal = 2] = "Polygonal";
(Ye = {})[Ye.Outside = 0] = "Outside", Ye[Ye.Inside = 1] = "Inside";
function sa(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
let tt = { xScale: 1, yScale: 1, zScale: 1, rotation: 0, columnCount: 0, rowCount: 0, columnSpacing: 0, rowSpacing: 0, extrusionDirection: { x: 0, y: 0, z: 1 } }, ot = [{ code: 210, name: "extrusionDirection", parser: s }, { code: 45, name: "rowSpacing", parser: r }, { code: 44, name: "columnSpacing", parser: r }, { code: 71, name: "rowCount", parser: r }, { code: 70, name: "columnCount", parser: r }, { code: 50, name: "rotation", parser: r }, { code: 43, name: "zScale", parser: r }, { code: 42, name: "yScale", parser: r }, { code: 41, name: "xScale", parser: r }, { code: 10, name: "insertionPoint", parser: s }, { code: 2, name: "name", parser: r }, { code: 66, name: "isVariableAttributes", parser: p }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class ca {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    sa(this, "parser", u(ot, tt));
  }
}
function ia(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
sa(ca, "ForEntityName", "INSERT");
let st = { isArrowheadEnabled: !0 }, ct = [{ code: 213, name: "offsetFromAnnotation", parser: s }, { code: 212, name: "offsetFromBlock", parser: s }, { code: 211, name: "horizontalDirection", parser: s }, { code: 210, name: "normal", parser: s }, { code: 340, name: "associatedAnnotation", parser: r }, { code: 77, name: "byBlockColor", parser: r }, { code: 10, name: "vertices", parser: s, isMultiple: !0 }, { code: 76, name: "numberOfVertices", parser: r }, { code: 41, name: "textWidth", parser: r }, { code: 40, name: "textHeight", parser: r }, { code: 75, name: "isHooklineExists", parser: p }, { code: 74, name: "isHooklineSameDirection", parser: p }, { code: 73, name: "leaderCreationFlag", parser: r }, { code: 72, name: "isSpline", parser: p }, { code: 71, name: "isArrowheadEnabled", parser: p }, { code: 3, name: "styleName", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class la {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    ia(this, "parser", u(ct, st));
  }
}
ia(la, "ForEntityName", "LEADER");
(ne = {})[ne.TextAnnotation = 0] = "TextAnnotation", ne[ne.ToleranceAnnotation = 1] = "ToleranceAnnotation", ne[ne.BlockReferenceAnnotation = 2] = "BlockReferenceAnnotation", ne[ne.NoAnnotation = 3] = "NoAnnotation";
function da(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
let it = { thickness: 0, extrusionDirection: { x: 0, y: 0, z: 1 } }, lt = [{ code: 210, name: "extrusionDirection", parser: s }, { code: 11, name: "endPoint", parser: s }, { code: 10, name: "startPoint", parser: s }, { code: 39, name: "thickness", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class pa {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    da(this, "parser", u(lt, it));
  }
}
function ua(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
da(pa, "ForEntityName", "LINE");
let dt = [{ code: 280, name: "shadowMapSoftness", parser: r }, { code: 91, name: "shadowMapSize", parser: r }, { code: 73, name: "shadowType", parser: r }, { code: 293, name: "isShadowCast", parser: p }, { code: 51, name: "falloffAngle", parser: r }, { code: 50, name: "hotspotAngle", parser: r }, { code: 42, name: "limitEnd", parser: r }, { code: 41, name: "limitStart", parser: r }, { code: 292, name: "isAttenuationLimited", parser: p }, { code: 72, name: "attenuationType", parser: r }, { code: 11, name: "target", parser: s }, { code: 10, name: "position", parser: s }, { code: 40, name: "intensity", parser: r }, { code: 291, name: "isPlotGlyph", parser: p }, { code: 290, name: "isOn", parser: p }, { code: 421, name: "lightColorInstance", parser: r }, { code: 63, name: "lightColorIndex", parser: r }, { code: 70, name: "lightType", parser: r }, { code: 1, name: "name", parser: r }, { code: 90, name: "version", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class ma {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    ua(this, "parser", u(dt));
  }
}
ua(ma, "ForEntityName", "LIGHT");
(Te = {})[Te.Distant = 1] = "Distant", Te[Te.Point = 2] = "Point", Te[Te.Spot = 3] = "Spot";
(Se = {})[Se.None = 0] = "None", Se[Se.InverseLinear = 1] = "InverseLinear", Se[Se.InverseSquare = 2] = "InverseSquare";
let pt = { flag: 0, elevation: 0, thickness: 0, extrusionDirection: { x: 0, y: 0, z: 1 }, vertices: [] }, ut = { bulge: 0 }, mt = [{ code: 42, name: "bulge", parser: r }, { code: 41, name: "endWidth", parser: r }, { code: 40, name: "startWidth", parser: r }, { code: 91, name: "id", parser: r }, { code: 20, name: "y", parser: r }, { code: 10, name: "x", parser: r }], ft = [{ code: 210, name: "extrusionDirection", parser: s }, { code: 10, name: "vertices", isMultiple: !0, parser(e, n) {
  let a = {};
  return u(mt, ut)(e, n, a), a;
} }, { code: 39, name: "thickness", parser: r }, { code: 38, name: "elevation", parser: r }, { code: 43, name: "constantWidth", parser: r }, { code: 70, name: "flag", parser: r }, { code: 90, name: "numberOfVertices", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class tr {
  parseEntity(n, a) {
    let t = {};
    return u(ft, pt)(a, n, t), t;
  }
}
(fr = "ForEntityName") in tr ? Object.defineProperty(tr, fr, { value: "LWPOLYLINE", enumerable: !0, configurable: !0, writable: !0 }) : tr[fr] = "LWPOLYLINE";
(Xe = {})[Xe.IS_CLOSED = 1] = "IS_CLOSED", Xe[Xe.PLINE_GEN = 128] = "PLINE_GEN";
function fa(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
let bt = [{ code: 90, name: "overridenSubEntityCount", parser: r }, { code: 140, name: "edgeCreaseWeights", parser: r, isMultiple: !0 }, { code: 95, name: "edgeCreaseCount", parser: r }, { code: 94, parser(e, n, a) {
  a.edgeCount = e.value, a.edgeIndices = [];
  for (let t = 0; t < a.edgeCount; ++t) {
    let c = [];
    e = n.next(), c[0] = e.value, e = n.next(), c[1] = e.value, a.edgeIndices.push(c);
  }
} }, { code: 93, parser(e, n, a) {
  a.totalFaceIndices = e.value, a.faceIndices = [];
  let t = [];
  for (let o = 0; o < a.totalFaceIndices && !I(e, 0); ++o) e = n.next(), t.push(e.value);
  let c = 0;
  for (; c < t.length; ) {
    let o = t[c++], i = [];
    for (let m = 0; m < o; ++m) i.push(t[c++]);
    a.faceIndices.push(i);
  }
} }, { code: 10, name: "vertices", parser: s, isMultiple: !0 }, { code: 92, name: "verticesCount", parser: r }, { code: 91, name: "subdivisionLevel", parser: r }, { code: 40, name: "blendCrease", parser: r }, { code: 72, name: "isBlendCreased", parser: p }, { code: 71, name: "version", parser: r }, { code: 100, name: "subclassMarker", parser: dn, pushContext: !0 }, ...E];
class ba {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    fa(this, "parser", u(bt));
  }
}
function Ia(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
fa(ba, "ForEntityName", "MESH");
let It = [{ code: 42, name: "fillParameters", parser: r, isMultiple: !0 }, { code: 75, name: "fillCount", parser: r }, { code: 41, name: "parameters", parser: r, isMultiple: !0 }, { code: 74, name: "parameterCount", parser: r }], ht = [{ code: [74, 41, 75, 42], name: "elements", parser(e, n) {
  let a = u(It), t = {};
  return a(e, n, t), t;
}, isMultiple: !0 }, { code: 13, name: "miterDirection", parser: s }, { code: 12, name: "direction", parser: s }, { code: 11, name: "position", parser: s }], Et = [{ code: [11, 12, 13], name: "segments", parser(e, n) {
  let a = u(ht), t = {};
  return a(e, n, t), t;
}, isMultiple: !0 }, { code: 210, name: "extrusionDirection", parser: s }, { code: 10, name: "startPosition", parser: s }, { code: 73, name: "styleCount", parser: r }, { code: 72, name: "vertexCount", parser: r }, { code: 71, name: "flags", parser: r }, { code: 70, name: "justification", parser: r }, { code: 40, name: "scale", parser: r }, { code: 340, name: "styleObjectHandle", parser: r }, { code: 2, name: "name", parser: r }, { code: 100, name: "subclassMarker", parser: r, pushContext: !0 }, ...E];
class ha {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Ia(this, "parser", u(Et));
  }
}
Ia(ha, "ForEntityName", "MLINE");
(Oe = {})[Oe.Top = 0] = "Top", Oe[Oe.Zero = 1] = "Zero", Oe[Oe.Bottom = 2] = "Bottom";
(te = {})[te.HasVertex = 1] = "HasVertex", te[te.Closed = 2] = "Closed", te[te.SuppressStartCaps = 4] = "SuppressStartCaps", te[te.SuppressEndCaps = 8] = "SuppressEndCaps";
(Ne = {})[Ne.LEFT_TO_RIGHT = 1] = "LEFT_TO_RIGHT", Ne[Ne.TOP_TO_BOTTOM = 3] = "TOP_TO_BOTTOM", Ne[Ne.BY_STYLE = 5] = "BY_STYLE";
function Ea(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
let gt = {}, xt = [{ code: 300, parser: function(e, n, a) {
  var o;
  let t;
  if (e.value === "CONTEXT_DATA{") for (; n.hasNext(); ) {
    var c;
    if ((t = n.next()).code === 301) break;
    switch (t.code) {
      case 10:
        a.contentBasePosition = L(t, n);
        break;
      case 11:
        a.normal = L(t, n);
        break;
      case 12:
        a.textAnchor = L(t, n);
        break;
      case 13:
        a.textDirection = L(t, n);
        break;
      case 14:
        le(a).normal = L(t, n);
        break;
      case 15:
        le(a).position = L(t, n);
        break;
      case 16:
        le(a).scale = L(t, n);
        break;
      case 40:
        a.contentScale = t.value;
        break;
      case 41:
      case 44:
        a.textHeight = t.value;
        break;
      case 42:
        a.textRotation = t.value;
        break;
      case 43:
        a.textWidth = t.value;
        break;
      case 45:
        a.textLineSpacingFactor = t.value;
        break;
      case 46:
        le(a).rotation = t.value;
        break;
      case 47:
        (c = le(a)).transformationMatrix ?? (c.transformationMatrix = []), (o = le(a).transformationMatrix) == null || o.push(t.value);
        break;
      case 90:
        a.textColor = t.value;
        break;
      case 91:
        a.textBackgroundColor = t.value;
        break;
      case 92:
        a.textBackgroundTransparency = t.value;
        break;
      case 93:
        le(a).color = t.value;
        break;
      case 110:
        a.planeOrigin = L(t, n);
        break;
      case 111:
        a.planeXAxisDirection = L(t, n);
        break;
      case 112:
        a.planeYAxisDirection = L(t, n);
        break;
      case 140:
        a.arrowheadSize = t.value;
        break;
      case 141:
        a.textBackgroundScaleFactor = t.value;
        break;
      case 142:
        a.textColumnWidth = t.value;
        break;
      case 143:
        a.textColumnGutterWidth = t.value;
        break;
      case 144:
        a.textColumnHeight = t.value;
        break;
      case 145:
        a.landingGap = t.value;
        break;
      case 170:
        a.textLineSpacingStyle = t.value;
        break;
      case 171:
        a.textAttachment = t.value;
        break;
      case 172:
        a.textFlowDirection = t.value;
        break;
      case 173:
        a.textColumnType = t.value;
        break;
      case 290:
        a.hasMText = t.value;
        break;
      case 291:
        a.textBackgroundColorOn = t.value;
        break;
      case 292:
        a.textFillOn = t.value;
        break;
      case 293:
        a.textUseAutoHeight = t.value;
        break;
      case 294:
        a.textColumnFlowReversed = t.value;
        break;
      case 295:
        a.textUseWordBreak = t.value;
        break;
      case 296:
        a.hasBlock = t.value;
        break;
      case 297:
        a.planeNormalReversed = t.value;
        break;
      case 302:
        t.value === "LEADER{" && (a.leaderSections ?? (a.leaderSections = []), a.leaderSections.push(function(i, m) {
          let l, d;
          if (i.value !== "LEADER{") return { leaderLines: [] };
          let f = { leaderLines: [] };
          for (; m.hasNext(); ) {
            if ((d = m.next()).code === 303) {
              qe(f, l);
              break;
            }
            switch (d.code) {
              case 290:
                f.lastLeaderLinePointSet = d.value;
                break;
              case 291:
                f.doglegVectorSet = d.value;
                break;
              case 10:
                f.lastLeaderLinePoint = L(d, m);
                break;
              case 11:
                f.doglegVector = L(d, m);
                break;
              case 12:
                l ?? (l = {}), l.start = L(d, m);
                break;
              case 13:
                l ?? (l = {}), l.end = L(d, m), qe(f, l), l = void 0;
                break;
              case 90:
                f.leaderBranchIndex = d.value;
                break;
              case 40:
                f.doglegLength = d.value;
                break;
              case 304:
                d.value === "LEADER_LINE{" && f.leaderLines.push(function(h, y) {
                  let x, S;
                  if (h.value !== "LEADER_LINE{") return { vertices: [] };
                  let O = { vertices: [] };
                  for (; y.hasNext(); ) {
                    if ((S = y.next()).code === 305) {
                      qe(O, x);
                      break;
                    }
                    switch (S.code) {
                      case 10:
                        O.vertices.push(L(S, y));
                        break;
                      case 11:
                        x ?? (x = {}), x.start = L(S, y);
                        break;
                      case 12:
                        x ?? (x = {}), x.end = L(S, y), qe(O, x), x = void 0;
                        break;
                      case 90:
                        O.breakPointIndexes ?? (O.breakPointIndexes = []), O.breakPointIndexes.push(S.value), x ?? (x = {}), x.index = S.value;
                        break;
                      case 91:
                        O.leaderLineIndex = S.value;
                    }
                  }
                  return O;
                }(d, m));
            }
          }
          return f;
        }(t, n)));
        break;
      case 304:
        t.value !== "LEADER_LINE{" && (a.textContent = t.value, a.contentType ?? (a.contentType = 2));
        break;
      case 340:
        a.textStyleId = t.value;
        break;
      case 341:
        a.blockContentId = t.value, le(a).blockContentId = t.value;
    }
  }
} }, { code: 270, name: "version", parser: r }, { code: 340, name: "leaderStyleId", parser: r }, { code: 90, name: "propertyOverrideFlag", parser: r }, { code: 170, name: "leaderLineType", parser: r }, { code: 91, name: "leaderLineColor", parser: r }, { code: 341, name: "leaderLineTypeId", parser: r }, { code: 171, name: "leaderLineWeight", parser: r }, { code: 290, name: "landingEnabled", parser: p }, { code: 291, name: "doglegEnabled", parser: p }, { code: [40, 41], name: "doglegLength", parser: r }, { code: 342, name: "arrowheadId", parser: r }, { code: 42, name: "arrowheadSize", parser: r }, { code: 172, name: "contentType", parser: r }, { code: 343, name: "textStyleId", parser: r }, { code: 173, name: "textLeftAttachmentType", parser: r }, { code: 95, name: "textRightAttachmentType", parser: r }, { code: 174, name: "textAngleType", parser: r }, { code: 175, name: "textAlignmentType", parser: r }, { code: 92, name: "textColor", parser: r }, { code: 292, name: "textFrameEnabled", parser: p }, { code: 344, parser: function(e, n, a) {
  a.blockContentId = e.value, le(a).blockContentId = e.value;
} }, { code: 93, name: "blockContentColor", parser: r }, { code: 10, name: "blockContentScale", parser: s }, { code: 43, name: "blockContentRotation", parser: r }, { code: 176, name: "blockContentConnectionType", parser: r }, { code: 293, name: "annotativeScaleEnabled", parser: p }, { code: 94, parser: function(e, n, a) {
  a.arrowheadOverrides ?? (a.arrowheadOverrides = []), a.arrowheadOverrides.push({ index: e.value });
}, isMultiple: !0 }, { code: 345, parser: function(e, n, a) {
  var t;
  ((t = a).arrowheadOverrides ?? (t.arrowheadOverrides = []), t.arrowheadOverrides.length || t.arrowheadOverrides.push({}), t.arrowheadOverrides[t.arrowheadOverrides.length - 1]).handle = e.value;
}, isMultiple: !0 }, { code: 330, parser: function(e, n, a) {
  a.blockAttributes ?? (a.blockAttributes = []), a.blockAttributes.push({ id: e.value });
}, isMultiple: !0 }, { code: 177, parser: function(e, n, a) {
  gr(a).index = e.value;
}, isMultiple: !0 }, { code: 44, parser: function(e, n, a) {
  gr(a).width = e.value;
}, isMultiple: !0 }, { code: 302, parser: function(e, n, a) {
  gr(a).text = e.value;
}, isMultiple: !0 }, { code: 294, name: "textDirectionNegative", parser: p }, { code: 178, name: "textAlignInIPE", parser: r }, { code: 179, name: "textAttachmentPoint", parser: r }, { code: 271, name: "textAttachmentDirection", parser: r }, { code: 272, name: "bottomTextAttachmentDirection", parser: r }, { code: 273, name: "topTextAttachmentDirection", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...E];
function L(e, n) {
  return vr(s(e, n));
}
function qe(e, n) {
  (n != null && n.start || n != null && n.end) && (e.breaks ?? (e.breaks = []), e.breaks.push(n));
}
function le(e) {
  return e.blockContent ?? (e.blockContent = {});
}
function gr(e) {
  return e.blockAttributes ?? (e.blockAttributes = []), e.blockAttributes.length || e.blockAttributes.push({}), e.blockAttributes[e.blockAttributes.length - 1];
}
class ga {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Ea(this, "parser", u(xt, gt));
  }
}
function xa(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
Ea(ga, "ForEntityName", "MULTILEADER");
let vt = { thickness: 0, extrusionDirection: { x: 0, y: 0, z: 1 }, angle: 0 }, yt = [{ code: 50, name: "angle", parser: r }, { code: 210, name: "extrusionDirection", parser: s }, { code: 39, name: "thickness", parser: r }, { code: 10, name: "position", parser: s }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class va {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    xa(this, "parser", u(yt, vt));
  }
}
function ya(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
xa(va, "ForEntityName", "POINT");
let Tt = { startWidth: 0, endWidth: 0, bulge: 0 }, St = [{ code: 91, name: "id", parser: r }, { code: [...cr(71, 75)], name: "faces", isMultiple: !0, parser: r }, { code: 50, name: "tangentDirection", parser: r }, { code: 70, name: "flag", parser: r }, { code: 42, name: "bulge", parser: r }, { code: 41, name: "endWidth", parser: r }, { code: 40, name: "startWidth", parser: r }, { code: 30, name: "z", parser: r }, { code: 20, name: "y", parser: r }, { code: 10, name: "x", parser: r }, { code: 100, name: "subclassMarker", parser: r }, { code: 100 }, ...E];
class Or {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    ya(this, "parser", u(St, Tt));
  }
}
function Ta(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
ya(Or, "ForEntityName", "VERTEX");
let Ot = { thickness: 0, flag: 0, startWidth: 0, endWidth: 0, meshMVertexCount: 0, meshNVertexCount: 0, surfaceMDensity: 0, surfaceNDensity: 0, smoothType: 0, extrusionDirection: { x: 0, y: 0, z: 1 }, vertices: [] }, Nt = [{ code: 0, name: "vertices", isMultiple: !0, parser: (e, n) => I(e, 0, "VERTEX") ? (e = n.next(), new Or().parseEntity(n, e)) : Je }, { code: 210, name: "extrusionDirection", parser: s }, { code: 75, name: "smoothType", parser: r }, { code: 74, name: "surfaceNDensity", parser: r }, { code: 73, name: "surfaceMDensity", parser: r }, { code: 72, name: "meshNVertexCount", parser: r }, { code: 71, name: "meshMVertexCount", parser: r }, { code: 41, name: "endWidth", parser: r }, { code: 40, name: "startWidth", parser: r }, { code: 70, name: "flag", parser: r }, { code: 39, name: "thickness", parser: r }, { code: 30, name: "elevation", parser: r }, { code: 20 }, { code: 10 }, { code: 66 }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class Sa {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Ta(this, "parser", u(Nt, Ot));
  }
}
Ta(Sa, "ForEntityName", "POLYLINE");
(D = {})[D.CLOSED_POLYLINE = 1] = "CLOSED_POLYLINE", D[D.CURVE_FIT = 2] = "CURVE_FIT", D[D.SPLINE_FIT = 4] = "SPLINE_FIT", D[D.POLYLINE_3D = 8] = "POLYLINE_3D", D[D.POLYGON_3D = 16] = "POLYGON_3D", D[D.CLOSED_POLYGON = 32] = "CLOSED_POLYGON", D[D.POLYFACE = 64] = "POLYFACE", D[D.CONTINUOUS = 128] = "CONTINUOUS";
(oe = {})[oe.NONE = 0] = "NONE", oe[oe.QUADRATIC = 5] = "QUADRATIC", oe[oe.CUBIC = 6] = "CUBIC", oe[oe.BEZIER = 8] = "BEZIER";
function Oa(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
let At = [{ code: 11, name: "direction", parser: s }, { code: 10, name: "position", parser: s }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class Na {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Oa(this, "parser", u(At));
  }
}
function Aa(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
Oa(Na, "ForEntityName", "RAY");
let Dt = [...ir("data"), { code: 70, name: "version", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class Da {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Aa(this, "parser", u(Dt));
  }
}
function ka(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
Aa(Da, "ForEntityName", "REGION");
let kt = { vertices: [], backLineVertices: [] }, Lt = [{ code: 360, name: "geometrySettingHardId", parser: r }, { code: 12, name: "backLineVertices", isMultiple: !0, parser: s }, { code: 93, name: "numberOfBackLineVertices", parser: r }, { code: 11, name: "vertices", isMultiple: !0, parser: s }, { code: 92, name: "verticesCount", parser: r }, { code: [63, 411], name: "indicatorColor", parser: r }, { code: 70, name: "indicatorTransparency", parser: r }, { code: 41, name: "bottomHeight", parser: r }, { code: 40, name: "topHeight", parser: r }, { code: 10, name: "verticalDirection", parser: s }, { code: 1, name: "name", parser: r }, { code: 91, name: "flag", parser: r }, { code: 90, name: "state", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class La {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    ka(this, "parser", u(Lt, kt));
  }
}
function Ma(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
ka(La, "ForEntityName", "SECTION");
let Mt = { thickness: 0, rotation: 0, xScale: 1, obliqueAngle: 0, extrusionDirection: { x: 0, y: 0, z: 1 } }, Ct = [{ code: 210, name: "extrusionDirection", parser: s }, { code: 51, name: "obliqueAngle", parser: r }, { code: 41, name: "xScale", parser: r }, { code: 50, name: "rotation", parser: r }, { code: 2, name: "shapeName", parser: r }, { code: 40, name: "size", parser: r }, { code: 10, name: "insertionPoint", parser: s }, { code: 39, name: "thickness", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class Ca {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Ma(this, "parser", u(Ct, Mt));
  }
}
function _a(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
Ma(Ca, "ForEntityName", "SHAPE");
let _t = { points: [], thickness: 0, extrusionDirection: { x: 0, y: 0, z: 1 } }, wt = [{ code: 210, name: "extrusionDirection", parser: s }, { code: 39, name: "thickness", parser: r }, { code: [...cr(10, 14)], name: "points", isMultiple: !0, parser: s }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class wa {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    _a(this, "parser", u(wt, _t));
  }
}
function Ra(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
_a(wa, "ForEntityName", "SOLID");
let Rt = [{ code: 350, name: "historyObjectSoftId", parser: r }, { code: 100, name: "subclassMarker", parser: r }, { code: 2, name: "guid", parser: r }, { code: 290, name: "satCache", parser: r }, ...ir("data"), { code: 70, name: "version", parser: r }, { code: 100 }, ...E];
class Fa {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Ra(this, "parser", u(Rt));
  }
}
function Pa(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
Ra(Fa, "ForEntityName", "3DSOLID");
let Ft = { knotTolerance: 1e-6, controlTolerance: 1e-6, fitTolerance: 1e-9, knotValues: [], controlPoints: [], fitPoints: [] }, Pt = [{ code: 11, name: "fitPoints", isMultiple: !0, parser: s }, { code: 10, name: "controlPoints", isMultiple: !0, parser: s }, { code: 41, name: "weights", isMultiple: !0, parser: r }, { code: 40, name: "knots", isMultiple: !0, parser: r }, { code: 13, name: "endTangent", parser: s }, { code: 12, name: "startTangent", parser: s }, { code: 44, name: "fitTolerance", parser: r }, { code: 43, name: "controlTolerance", parser: r }, { code: 42, name: "knotTolerance", parser: r }, { code: 74, name: "numberOfFitPoints", parser: r }, { code: 73, name: "numberOfControlPoints", parser: r }, { code: 72, name: "numberOfKnots", parser: r }, { code: 71, name: "degree", parser: r }, { code: 70, name: "flag", parser: r }, { code: 210, name: "normal", parser: s }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class Va {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Pa(this, "parser", u(Pt, Ft));
  }
}
Pa(Va, "ForEntityName", "SPLINE");
(V = {})[V.NONE = 0] = "NONE", V[V.CLOSED = 1] = "CLOSED", V[V.PERIODIC = 2] = "PERIODIC", V[V.RATIONAL = 4] = "RATIONAL", V[V.PLANAR = 8] = "PLANAR", V[V.LINEAR = 16] = "LINEAR";
function Ba(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
let Vt = [{ code: 280, name: "shadowMapSoftness", parser: r }, { code: 71, name: "shadowMapSize", parser: r }, { code: 70, name: "shadowType", parser: r }, { code: 292, name: "isSummerTime", parser: p }, { code: 92, name: "time", parser: r }, { code: 91, name: "julianDay", parser: r }, { code: 291, name: "hasShadow", parser: p }, { code: 40, name: "intensity", parser: r }, { code: 421, name: "lightColorInstance", parser: r }, { code: 63, name: "lightColorIndex", parser: r }, { code: 290, name: "isOn", parser: p }, { code: 90, name: "version", parser: r }, { code: 100, name: "subclassMarker", parser: r, pushContext: !0 }, ...E.filter((e) => e.code !== 100)];
class Ua {
  parseEntity(n, a) {
    let t = { layer: "" };
    return this.parser(a, n, t), t;
  }
  constructor() {
    Ba(this, "parser", u(Vt));
  }
}
Ba(Ua, "ForEntityName", "SUN");
class or {
  parseEntity(n, a) {
    let t = {};
    for (; !n.isEOF(); ) {
      if (a.code === 0) {
        n.rewind();
        break;
      }
      switch (a.code) {
        case 100:
          t.subclassMarker = a.value, a = n.next();
          break;
        case 2:
          t.name = a.value, a = n.next();
          break;
        case 5:
          t.handle = a.value, a = n.next();
          break;
        case 10:
          t.startPoint = vr(ue(n)), a = n.lastReadGroup;
          break;
        case 11:
          t.directionVector = vr(ue(n)), a = n.lastReadGroup;
          break;
        case 90:
          t.tableValue = a.value, a = n.next();
          break;
        case 91:
          t.rowCount = a.value, a = n.next();
          break;
        case 92:
          t.columnCount = a.value, a = n.next();
          break;
        case 93:
          t.overrideFlag = a.value, a = n.next();
          break;
        case 94:
          t.borderColorOverrideFlag = a.value, a = n.next();
          break;
        case 95:
          t.borderLineWeightOverrideFlag = a.value, a = n.next();
          break;
        case 96:
          t.borderVisibilityOverrideFlag = a.value, a = n.next();
          break;
        case 141:
          t.rowHeightArr ?? (t.rowHeightArr = []), t.rowHeightArr.push(a.value), a = n.next();
          break;
        case 142:
          t.columnWidthArr ?? (t.columnWidthArr = []), t.columnWidthArr.push(a.value), a = n.next();
          break;
        case 280:
          t.version = a.value, a = n.next();
          break;
        case 310:
          t.bmpPreview ?? (t.bmpPreview = ""), t.bmpPreview += a.value, a = n.next();
          break;
        case 330:
          t.ownerBlockRecordSoftId = a.value, a = n.next();
          break;
        case 342:
          t.tableStyleId = a.value, a = n.next();
          break;
        case 343:
          t.blockRecordHandle = a.value, a = n.next();
          break;
        case 170:
          t.attachmentPoint = a.value, a = n.next();
          break;
        case 171:
          t.cells ?? (t.cells = []), t.cells.push(function(c, o) {
            let i = !1, m = !1, l = {};
            for (; !c.isEOF() && o.code !== 0 && !m; ) switch (o.code) {
              case 171:
                if (i) {
                  m = !0;
                  continue;
                }
                l.cellType = o.value, i = !0, o = c.next();
                break;
              case 172:
                l.flagValue = o.value, o = c.next();
                break;
              case 173:
                l.mergedValue = o.value, o = c.next();
                break;
              case 174:
                l.autoFit = o.value, o = c.next();
                break;
              case 175:
                l.borderWidth = o.value, o = c.next();
                break;
              case 176:
                l.borderHeight = o.value, o = c.next();
                break;
              case 91:
                l.overrideFlag = o.value, o = c.next();
                break;
              case 178:
                l.virtualEdgeFlag = o.value, o = c.next();
                break;
              case 145:
                l.rotation = o.value, o = c.next();
                break;
              case 345:
                l.fieldObjetId = o.value, o = c.next();
                break;
              case 340:
                l.blockTableRecordId = o.value, o = c.next();
                break;
              case 146:
                l.blockScale = o.value, o = c.next();
                break;
              case 177:
                l.blockAttrNum = o.value, o = c.next();
                break;
              case 7:
                l.textStyle = o.value, o = c.next();
                break;
              case 140:
                l.textHeight = o.value, o = c.next();
                break;
              case 170:
                l.attachmentPoint = o.value, o = c.next();
                break;
              case 92:
                l.extendedCellFlags = o.value, o = c.next();
                break;
              case 285:
                l.rightBorderVisibility = !!(o.value ?? !0), o = c.next();
                break;
              case 286:
                l.bottomBorderVisibility = !!(o.value ?? !0), o = c.next();
                break;
              case 288:
                l.leftBorderVisibility = !!(o.value ?? !0), o = c.next();
                break;
              case 289:
                l.topBorderVisibility = !!(o.value ?? !0), o = c.next();
                break;
              case 301:
                (function(d, f, h) {
                  for (; h.code !== 304; ) switch (h.code) {
                    case 301:
                    case 93:
                    case 90:
                    case 94:
                      h = f.next();
                      break;
                    case 1:
                      d.text = h.value, h = f.next();
                      break;
                    case 300:
                      d.attrText = h.value, h = f.next();
                      break;
                    case 302:
                      d.text = h.value ? h.value : d.text, h = f.next();
                      break;
                    default:
                      h = f.next();
                  }
                })(l, c, o), o = c.next();
                break;
              default:
                return l;
            }
            return i = !1, m = !1, l;
          }(n, a)), a = n.lastReadGroup;
          break;
        default:
          _n(t, a, n), a = n.next();
      }
    }
    return t;
  }
}
function Ha(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
(br = "ForEntityName") in or ? Object.defineProperty(or, br, { value: "ACAD_TABLE", enumerable: !0, configurable: !0, writable: !0 }) : or[br] = "ACAD_TABLE";
let Bt = [{ code: 11, name: "xAxisDirection", parser: s }, { code: 210, name: "extrusionDirection", parser: s }, { code: 1, name: "text", parser: r }, { code: 10, name: "position", parser: s }, { code: 3, name: "styleName", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class Ga {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Ha(this, "parser", u(Bt));
  }
}
Ha(Ga, "ForEntityName", "TOLERANCE");
(k = {})[k.CREATED_BY_CURVE_FIT = 1] = "CREATED_BY_CURVE_FIT", k[k.TANGENT_DEFINED = 2] = "TANGENT_DEFINED", k[k.NOT_USED = 4] = "NOT_USED", k[k.CREATED_BY_SPLINE_FIT = 8] = "CREATED_BY_SPLINE_FIT", k[k.SPLINE_CONTROL_POINT = 16] = "SPLINE_CONTROL_POINT", k[k.FOR_POLYLINE = 32] = "FOR_POLYLINE", k[k.FOR_POLYGON = 64] = "FOR_POLYGON", k[k.POLYFACE = 128] = "POLYFACE";
let Ut = [{ code: [335, 343, 344, 91], name: "softPointers", isMultiple: !0, parser: r }, { code: 361, name: "sunId", parser: r }, { code: 431, name: "ambientLightColorName", parser: r }, { code: 421, name: "ambientLightColorInstance", parser: r }, { code: 63, name: "ambientLightColorIndex", parser: r }, { code: 142, name: "contrast", parser: r }, { code: 141, name: "brightness", parser: r }, { code: 282, name: "defaultLightingType", parser: r }, { code: 292, name: "isDefaultLighting", parser: p }, { code: 348, name: "visualStyleId", parser: r }, { code: 333, name: "shadePlotId", parser: r }, { code: 332, name: "backgroundId", parser: r }, { code: 61, name: "majorGridFrequency", parser: r }, { code: 170, name: "shadePlotMode", parser: r }, { code: 146, name: "elevation", parser: r }, { code: 79, name: "orthographicType", parser: r }, { code: 346, name: "ucsBaseId", parser: r }, { code: 345, name: "ucsId", parser: r }, { code: 112, name: "ucsYAxis", parser: s }, { code: 111, name: "ucsXAxis", parser: s }, { code: 110, name: "ucsOrigin", parser: s }, { code: 74, name: "iconFlag", parser: r }, { code: 71, name: "ucsPerViewport", parser: r }, { code: 281, name: "renderMode", parser: r }, { code: 1, name: "sheetName", parser: r }, { code: 340, name: "clippingBoundaryId", parser: r }, { code: 90, name: "statusBitFlags", parser: r }, { code: 331, name: "frozenLayerIds", isMultiple: !0, parser: r }, { code: 72, name: "circleZoomPercent", parser: r }, { code: 51, name: "viewTwistAngle", parser: r }, { code: 50, name: "snapAngle", parser: r }, { code: 45, name: "viewHeight", parser: r }, { code: 44, name: "backClipZ", parser: r }, { code: 43, name: "frontClipZ", parser: r }, { code: 42, name: "perspectiveLensLength", parser: r }, { code: 17, name: "targetPoint", parser: s }, { code: 16, name: "viewDirection", parser: s }, { code: 15, name: "gridSpacing", parser: s }, { code: 14, name: "snapSpacing", parser: s }, { code: 13, name: "snapBase", parser: s }, { code: 12, name: "displayCenter", parser: s }, { code: 69, name: "viewportId", parser: r }, { code: 68, name: "status", parser: r }, { code: 41, name: "height", parser: r }, { code: 40, name: "width", parser: r }, { code: 10, name: "viewportCenter", parser: s }, { code: 100, name: "subclassMarker", parser: r, pushContext: !0 }, ...E];
class sr {
  parseEntity(n, a) {
    let t = {};
    return u(Ut)(a, n, t), t;
  }
}
function Wa(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
(Ir = "ForEntityName") in sr ? Object.defineProperty(sr, Ir, { value: "VIEWPORT", enumerable: !0, configurable: !0, writable: !0 }) : sr[Ir] = "VIEWPORT";
let Ht = { brightness: 50, constrast: 50, fade: 0 }, Gt = [{ code: 14, name: "boundary", isMultiple: !0, parser: s }, { code: 91, name: "numberOfVertices", parser: r }, { code: 71, name: "boundaryType", parser: r }, { code: 360, name: "imageDefReactorHardId", parser: r }, { code: 283, name: "fade", parser: r }, { code: 282, name: "contrast", parser: r }, { code: 281, name: "brightness", parser: r }, { code: 280, name: "isClipping", parser: p }, { code: 70, name: "displayFlag", parser: r }, { code: 340, name: "imageDefHardId", parser: r }, { code: 13, name: "imageSize", parser: s }, { code: 12, name: "vDirection", parser: s }, { code: 11, name: "uDirection", parser: s }, { code: 10, name: "position", parser: s }, { code: 90, name: "classVersion", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class ja {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Wa(this, "parser", u(Gt, Ht));
  }
}
Wa(ja, "ForEntityName", "WIPEOUT");
(se = {})[se.ShowImage = 1] = "ShowImage", se[se.ShowImageWhenNotAligned = 2] = "ShowImageWhenNotAligned", se[se.UseClippingBoundary = 4] = "UseClippingBoundary", se[se.Transparency = 8] = "Transparency";
function Ya(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
let Wt = [{ code: 11, name: "direction", parser: s }, { code: 10, name: "position", parser: s }, { code: 100, name: "subclassMarker", parser: r }, ...E];
class Xa {
  parseEntity(n, a) {
    let t = {};
    return this.parser(a, n, t), t;
  }
  constructor() {
    Ya(this, "parser", u(Wt));
  }
}
Ya(Xa, "ForEntityName", "XLINE");
let jt = 0;
function za(e) {
  if (!e) throw TypeError("entity cannot be undefined or null");
  e.handle || (e.handle = jt++);
}
let Yt = Object.fromEntries([er, Rr, ar, Gr, Xr, Kr, Jr, rr, qr, ea, oa, ca, la, pa, ma, tr, ba, ha, jr, ga, va, Sa, Na, Da, La, Ca, wa, Fa, Va, Ua, or, Ur, Ga, na, Or, sr, ja, Xa].map((e) => [e.ForEntityName, new e()]));
function Ka(e, n) {
  let a = [];
  for (; !I(e, 0, "EOF"); ) {
    if (e.code === 0) {
      if (e.value === "ENDBLK" || e.value === "ENDSEC") {
        n.rewind();
        break;
      }
      let t = Yt[e.value];
      if (t) {
        let c = e.value;
        e = n.next();
        let o = t.parseEntity(n, e);
        o.type = c, za(o), a.push(o);
      } else n.debug;
    }
    e = n.next();
  }
  return a;
}
function Xt(e, n) {
  let a = null, t = {};
  for (; !I(e, 0, "EOF") && !I(e, 0, "ENDSEC"); ) e.code === 9 ? a = typeof e.value == "string" ? e.value : null : a != null && (e.code === 10 ? t[a] = ue(n) : t[a] = e.value), e = n.next();
  return t;
}
let de = [{ code: 100, name: "subclassMarker", parser: r }, { code: 330, name: "ownerObjectId", parser: r }, { code: 102, isMultiple: !0, parser(e, n) {
  for (; !I(e, 0, "EOF") && !I(e, 102, "}"); ) e = n.next();
} }, { code: 5, name: "handle", parser: r }], zt = [{ code: 70, name: "flag", parser: r }, { code: 2, name: "appName", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...de], Kt = u(zt), Zt = u([{ code: 310, name: "bmpPreview", parser: r }, { code: 281, name: "scalability", parser: r }, { code: 280, name: "explodability", parser: r }, { code: 70, name: "insertionUnits", parser: r }, { code: 340, name: "layoutObjects", parser: r }, { code: 2, name: "name", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...de]), Jt = u([...Sr.map((e) => ({ ...e, parser: r })), { code: 70, name: "standardFlag", parser: r }, { code: 2, name: "name", parser: r }, { code: 100, name: "subclassMarker", parser: r }, { code: 105, name: "handle", parser: r }, ...de.filter((e) => e.code !== 5)]), $t = u([{ code: 347, name: "materialObjectId", parser: r }, { code: 390, name: "plotStyleNameObjectId", parser: r }, { code: 370, name: "lineweight", parser: r }, { code: 290, name: "isPlotting", parser: p }, { code: 6, name: "lineType", parser: r }, { code: 62, name: "colorIndex", parser: r }, { code: 70, name: "standardFlag", parser: r }, { code: 2, name: "name", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...de]), qt = u([{ code: 9, name: "text", parser: r }, { code: 45, name: "offsetY", parser: r }, { code: 44, name: "offsetX", parser: r }, { code: 50, name: "rotation", parser: r }, { code: 46, name: "scale", parser: r }, { code: 340, name: "styleObjectId", parser: r }, { code: 75, name: "shapeNumber", parser: r }, { code: 74, name: "elementTypeFlag", parser: r }, { code: 49, name: "elementLength", parser: r }], { elementTypeFlag: 0, elementLength: 0 }), Qt = u([{ code: 49, name: "pattern", parser(e, n) {
  let a = {};
  return qt(e, n, a), a;
}, isMultiple: !0 }, { code: 40, name: "totalPatternLength", parser: r }, { code: 73, name: "numberOfLineTypes", parser: r }, { code: 72, parser: r }, { code: 3, name: "description", parser: r }, { code: 70, name: "standardFlag", parser: r }, { code: 2, name: "name", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...de]), eo = u([{ code: 1e3, name: "extendedFont", parser: r }, { code: 1001 }, { code: 4, name: "bigFont", parser: r }, { code: 3, name: "font", parser: r }, { code: 42, name: "lastHeight", parser: r }, { code: 71, name: "textGenerationFlag", parser: r }, { code: 50, name: "obliqueAngle", parser: r }, { code: 41, name: "widthFactor", parser: r }, { code: 40, name: "fixedTextHeight", parser: r }, { code: 70, name: "standardFlag", parser: r }, { code: 2, name: "name", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...de]), ro = [{ code: 13, name: "orthographicOrigin", parser: s }, { code: 71, name: "orthographicType", parser: r }, { code: 346, name: "baseUcsHandle", parser: r }, { code: 146, name: "elevation", parser: r }, { code: 79, name: "isOrthographic", parser: p }, { code: 12, name: "yAxis", parser: s }, { code: 11, name: "xAxis", parser: s }, { code: 10, name: "origin", parser: s }, { code: 70, name: "flag", parser: r }, { code: 2, name: "name", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...de], ao = u(ro), no = [{ code: 346, name: "baseUcsId", parser: r }, { code: 345, name: "ucsId", parser: r }, { code: 146, name: "elevation", parser: r }, { code: 79, name: "orthographicType", parser: r }, { code: 112, name: "ucsYAxis", parser: s }, { code: 111, name: "ucsXAxis", parser: s }, { code: 110, name: "ucsOrigin", parser: s }, { code: 361, name: "sunHardId", parser: r }, { code: 348, name: "styleHardId", parser: r }, { code: 334, name: "liveSectionSoftId", parser: r }, { code: 332, name: "backgroundSoftId", parser: r }, { code: 73, name: "isPlottable", parser: p }, { code: 72, name: "isUcsAssociated", parser: p }, { code: 281, name: "renderMode", parser: r }, { code: 71, name: "viewMode", parser: r }, { code: 50, name: "twistAngle", parser: r }, { code: 44, name: "backClippingPlane", parser: r }, { code: 43, name: "frontClippingPlane", parser: r }, { code: 42, name: "lensLength", parser: r }, { code: 12, name: "target", parser: s }, { code: 11, name: "direction", parser: s }, { code: 10, name: "center", parser: s }, { code: 41, name: "width", parser: r }, { code: 40, name: "height", parser: r }, { code: 70, name: "flag", parser: r }, { code: 2, name: "name", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...de], to = u(no), oo = u([{ code: [63, 421, 431], name: "ambientColor", parser: r }, { code: 142, name: "contrast", parser: r }, { code: 141, name: "brightness", parser: r }, { code: 282, name: "defaultLightingType", parser: r }, { code: 292, name: "isDefaultLightingOn", parser: p }, { code: 348, name: "visualStyleObjectId", parser: r }, { code: 333, name: "shadePlotObjectId", parser: r }, { code: 332, name: "backgroundObjectId", parser: r }, { code: 61, name: "majorGridLines", parser: r }, { code: 170, name: "shadePlotSetting", parser: r }, { code: 146, name: "elevation", parser: r }, { code: 79, name: "orthographicType", parser: r }, { code: 112, name: "ucsYAxis", parser: s }, { code: 111, name: "ucsXAxis", parser: s }, { code: 110, name: "ucsOrigin", parser: s }, { code: 74, name: "ucsIconSetting", parser: r }, { code: 71, name: "viewMode", parser: r }, { code: 281, name: "renderMode", parser: r }, { code: 1, name: "styleSheet", parser: r }, { code: [331, 441], name: "frozenLayers", parser: r, isMultiple: !0 }, { code: 72, name: "circleSides", parser: r }, { code: 51, name: "viewTwistAngle", parser: r }, { code: 50, name: "snapRotationAngle", parser: r }, { code: 45, name: "viewHeight", parser: r }, { code: 44, name: "backClippingPlane", parser: r }, { code: 43, name: "frontClippingPlane", parser: r }, { code: 42, name: "lensLength", parser: r }, { code: 41, name: "aspectRatio", parser: r }, { code: 40, name: "viewHeight", parser: r }, { code: 17, name: "viewTarget", parser: s }, { code: 16, name: "viewDirectionFromTarget", parser: s }, { code: 15, name: "gridSpacing", parser: s }, { code: 14, name: "snapSpacing", parser: s }, { code: 13, name: "snapBasePoint", parser: s }, { code: 12, name: "center", parser: s }, { code: 11, name: "upperRightCorner", parser: s }, { code: 10, name: "lowerLeftCorner", parser: s }, { code: 70, name: "standardFlag", parser: r }, { code: 2, name: "name", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...de]), so = { APPID: Kt, BLOCK_RECORD: Zt, DIMSTYLE: Jt, LAYER: $t, LTYPE: Qt, STYLE: eo, UCS: ao, VIEW: to, VPORT: oo }, co = u([{ code: 70, name: "maxNumberOfEntries", parser: r }, { code: 100, name: "subclassMarker", parser: r }, { code: 330, name: "ownerObjectId", parser: r }, { code: 102, parser: z }, { code: 102, parser: z }, { code: 102, parser: z }, { code: 360, isMultiple: !0 }, { code: 5, name: "handle", parser: r }, { code: 2, name: "name", parser: r }]);
function io(e, n) {
  var t;
  let a = {};
  for (; !I(e, 0, "EOF") && !I(e, 0, "ENDSEC"); ) {
    if (I(e, 0, "TABLE")) {
      e = n.next();
      let c = { entries: [] };
      co(e, n, c), a[c.name] = c;
    }
    if (I(e, 0) && !I(e, 0, "ENDTAB")) {
      let c = e.value;
      e = n.next();
      let o = so[c];
      if (!o) {
        n.debug, e = n.next();
        continue;
      }
      let i = {};
      o(e, n, i), c === "VPORT" && (i.lowerLeftCorner == null && (i.lowerLeftCorner = { x: 0, y: 0 }), i.upperRightCorner == null && (i.upperRightCorner = { x: 1, y: 1 }), i.center == null && (i.center = { x: 0, y: 0 }), i.snapBasePoint == null && (i.snapBasePoint = { x: 0, y: 0 }), i.snapSpacing == null && (i.snapSpacing = { x: 0, y: 0 }), i.gridSpacing == null && (i.gridSpacing = { x: 0, y: 0 }), i.viewDirectionFromTarget == null && (i.viewDirectionFromTarget = { x: 0, y: 0, z: 1 }), i.viewTarget == null && (i.viewTarget = { x: 0, y: 0, z: 0 })), (t = a[c]) == null || t.entries.push(i);
    }
    e = n.next();
  }
  return a;
}
function lo(e, n) {
  let a = {};
  for (; !I(e, 0, "EOF") && !I(e, 0, "ENDSEC"); ) {
    if (I(e, 0, "BLOCK")) {
      let t = po(e = n.next(), n);
      za(t), t.name && (a[t.name] = t);
    }
    e = n.next();
  }
  return a;
}
function po(e, n) {
  let a = {};
  for (; !I(e, 0, "EOF"); ) {
    if (I(e, 0, "ENDBLK")) {
      for (e = n.next(); !I(e, 0, "EOF"); ) {
        if (I(e, 100, "AcDbBlockEnd")) return a;
        e = n.next();
      }
      break;
    }
    switch (e.code) {
      case 1:
        a.xrefPath = e.value;
        break;
      case 2:
        a.name = e.value;
        break;
      case 3:
        a.name2 = e.value;
        break;
      case 5:
        a.handle = e.value;
        break;
      case 8:
        a.layer = e.value;
        break;
      case 10:
        a.position = ue(n);
        break;
      case 67:
        a.paperSpace = !!e.value && e.value == 1;
        break;
      case 70:
        e.value !== 0 && (a.type = e.value);
        break;
      case 100:
        break;
      case 330:
        a.ownerHandle = e.value;
        break;
      case 0:
        a.entities = Ka(e, n);
    }
    e = n.next();
  }
  return a;
}
let pe = [{ code: 330, name: "ownerObjectId", parser: r }, { code: 102, parser: z }, { code: 102, parser: z }, { code: 102, parser: z }, { code: 5, name: "handle", parser: r }], Za = [{ code: 333, name: "shadePlotId", parser: r }, { code: 149, name: "imageOriginY", parser: r }, { code: 148, name: "imageOriginX", parser: r }, { code: 147, name: "scaleFactor", parser: r }, { code: 78, name: "shadePlotCustomDPI", parser: r }, { code: 77, name: "shadePlotResolution", parser: r }, { code: 76, name: "shadePlotMode", parser: r }, { code: 75, name: "standardScaleType", parser: r }, { code: 7, name: "currentStyleSheet", parser: r }, { code: 74, name: "plotType", parser: r }, { code: 73, name: "plotRotation", parser: r }, { code: 72, name: "plotPaperUnit", parser: r }, { code: 70, name: "layoutFlag", parser: r }, { code: 143, name: "printScaleDenominator", parser: r }, { code: 142, name: "printScaleNumerator", parser: r }, { code: 141, name: "windowAreaYMax", parser: r }, { code: 140, name: "windowAreaXMax", parser: r }, { code: 49, name: "windowAreaYMin", parser: r }, { code: 48, name: "windowAreaXMin", parser: r }, { code: 47, name: "plotOriginY", parser: r }, { code: 46, name: "plotOriginX", parser: r }, { code: 45, name: "paperHeight", parser: r }, { code: 44, name: "paperWidth", parser: r }, { code: 43, name: "marginTop", parser: r }, { code: 42, name: "marginRight", parser: r }, { code: 41, name: "marginBottom", parser: r }, { code: 40, name: "marginLeft", parser: r }, { code: 6, name: "plotViewName", parser: r }, { code: 4, name: "paperSize", parser: r }, { code: 2, name: "configName", parser: r }, { code: 1, name: "pageSetupName", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...pe], uo = [{ code: 346, name: "orthographicUcsId", parser: r }, { code: 345, name: "namedUcsId", parser: r }, { code: 331, name: "viewportId", parser: r }, { code: 330, name: "paperSpaceTableId", parser: r }, { code: 76, name: "orthographicType", parser: r }, { code: 17, name: "ucsYAxis", parser: s }, { code: 16, name: "ucsXAxis", parser: s }, { code: 13, name: "ucsOrigin", parser: s }, { code: 146, name: "elevation", parser: r }, { code: 15, name: "maxExtent", parser: s }, { code: 14, name: "minExtent", parser: s }, { code: 12, name: "insertionPoint", parser: s }, { code: 11, name: "maxLimit", parser: s }, { code: 10, name: "minLimit", parser: s }, { code: 71, name: "tabOrder", parser: r }, { code: 70, name: "controlFlag", parser: r }, { code: 1, name: "layoutName", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...Za], mo = [{ code: 3, name: "entries", parser: (e, n) => {
  let a = { name: e.value };
  return (e = n.next()).code === 350 ? a.objectSoftId = e.value : e.code === 360 ? a.objectHardId = e.value : n.rewind(), a;
}, isMultiple: !0 }, { code: 281, name: "recordCloneFlag", parser: r }, { code: 280, name: "isHardOwned", parser: p }, { code: 100, name: "subclassMarker", parser: r }, ...pe], fo = [{ code: 40, name: "wcsToOCSTransform", parser: Cr }, { code: 40, name: "ocsToWCSTransform", parser: Cr }, { code: 41, name: "backClippingDistance", parser: r }, { code: 73, name: "isBackClipping", parser: p, pushContext: !0 }, { code: 40, name: "frontClippingDistance", parser: r }, { code: 72, name: "isFrontClipping", parser: p, pushContext: !0 }, { code: 71, name: "isClipBoundaryDisplayed", parser: p }, { code: 11, name: "position", parser: s }, { code: 210, name: "normal", parser: s }, { code: 10, name: "boundaryVertices", parser: s, isMultiple: !0 }, { code: 70, name: "boundaryCount", parser: r }, { code: 100, name: "subclassMarker", parser: r }, { code: 100 }, ...pe];
function Cr(e, n) {
  let a = [];
  for (let t = 0; t < 3 && I(e, 40); ++t) {
    let c = [];
    for (let o = 0; o < 4 && I(e, 40); ++o) c.push(e.value), e = n.next();
    a.push(c);
  }
  return n.rewind(), a;
}
let bo = [{ code: 330, name: "imageDefReactorIdSoft", isMultiple: !0, parser: r }, { code: 90, name: "version", parser: r }, { code: 1, name: "fileName", parser: r }, { code: 10, name: "size", parser: s }, { code: 11, name: "sizeOfOnePixel", parser: s }, { code: 280, name: "isLoaded", parser: r }, { code: 281, name: "resolutionUnits", parser: r }, { code: 100, name: "subclassMarker", parser: r }], Io = [{ code: 179, name: "unknown1", parser: r }, { code: 170, name: "contentType", parser: r }, { code: 171, name: "drawMLeaderOrderType", parser: r }, { code: 172, name: "drawLeaderOrderType", parser: r }, { code: 90, name: "maxLeaderSegmentPoints", parser: r }, { code: 40, name: "firstSegmentAngleConstraint", parser: r }, { code: 41, name: "secondSegmentAngleConstraint", parser: r }, { code: 173, name: "leaderLineType", parser: r }, { code: 91, name: "leaderLineColor", parser: r }, { code: 340, name: "leaderLineTypeId", parser: r }, { code: 92, name: "leaderLineWeight", parser: r }, { code: 290, name: "landingEnabled", parser: p }, { code: 42, name: "landingGap", parser: r }, { code: 291, name: "doglegEnabled", parser: p }, { code: 43, name: "doglegLength", parser: r }, { code: 3, name: "description", parser: r }, { code: 341, name: "arrowheadId", parser: r }, { code: 44, name: "arrowheadSize", parser: r }, { code: 300, name: "defaultMTextContents", parser: r }, { code: 342, name: "textStyleId", parser: r }, { code: 174, name: "textLeftAttachmentType", parser: r }, { code: 175, name: "textAngleType", parser: r }, { code: 176, name: "textAlignmentType", parser: r }, { code: 178, name: "textRightAttachmentType", parser: r }, { code: 93, name: "textColor", parser: r }, { code: 45, name: "textHeight", parser: r }, { code: 292, name: "textFrameEnabled", parser: p }, { code: 297, name: "textAlignAlwaysLeft", parser: p }, { code: 46, name: "alignSpace", parser: r }, { code: 343, name: "blockContentId", parser: r }, { code: 94, name: "blockContentColor", parser: r }, { code: 47, name: "blockContentScale.x", parser: r }, { code: 49, name: "blockContentScale.y", parser: r }, { code: 140, name: "blockContentScale.z", parser: r }, { code: 293, name: "blockContentScaleEnabled", parser: p }, { code: 141, name: "blockContentRotation", parser: r }, { code: 294, name: "blockContentRotationEnabled", parser: p }, { code: 177, name: "blockContentConnectionType", parser: r }, { code: 142, name: "scale", parser: r }, { code: 295, name: "overwritePropertyValue", parser: p }, { code: 296, name: "annotative", parser: p }, { code: 143, name: "breakGapSize", parser: r }, { code: 271, name: "textAttachmentDirection", parser: r }, { code: 272, name: "bottomTextAttachmentDirection", parser: r }, { code: 273, name: "topTextAttachmentDirection", parser: r }, { code: 298, name: "unknown2", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...pe];
function Qe(e, n, a) {
  e.elements || (e.elements = []);
  let t = e.elements.find((c) => c[n] === void 0);
  if (t) {
    t[n] = a;
    return;
  }
  e.elements.push({ [n]: a });
}
let ho = [{ code: 6, parser: function({ value: e }, n, a) {
  Qe(a, "lineType", e);
}, isMultiple: !0 }, { code: 62, parser: function({ value: e }, n, a) {
  var t;
  if (a.fillColorIndex === void 0 && !((t = a.elements) != null && t.length)) {
    a.fillColorIndex = e;
    return;
  }
  Qe(a, "colorIndex", e);
}, isMultiple: !0 }, { code: 420, parser: function({ value: e }, n, a) {
  var t;
  if (a.fillColor === void 0 && !((t = a.elements) != null && t.length)) {
    a.fillColor = e;
    return;
  }
  Qe(a, "color", e);
}, isMultiple: !0 }, { code: 49, parser: function({ value: e }, n, a) {
  Qe(a, "offset", e);
}, isMultiple: !0 }, { code: 71, name: "elementCount", parser: r }, { code: 52, name: "endAngle", parser: r }, { code: 51, name: "startAngle", parser: r }, { code: 3, name: "description", parser: r }, { code: 70, name: "flags", parser: r }, { code: 2, name: "styleName", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...pe], Eo = [{ code: 340, name: "entityIds", parser: r, isMultiple: !0 }, { code: 71, name: "isSelectable", parser: p }, { code: 70, name: "isUnnamed", parser: p }, { code: 300, name: "description", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...pe], go = [{ code: 8, name: "layerNames", parser: r, isMultiple: !0 }, { code: 100, name: "subclassMarker", parser: r }, { code: 100, name: "filterSubclassMarker", parser: r }, ...pe], xo = [{ code: 90, name: "idBufferEntryCounts", parser: r, isMultiple: !0 }, { code: 360, name: "idBufferIds", parser: r, isMultiple: !0 }, { code: 8, name: "layerNames", parser: r, isMultiple: !0 }, { code: 100, name: "subclassMarker", parser: r }, { code: 40, name: "timeStamp", parser: r }, { code: 100, name: "indexSubclassMarker", parser: r }, ...pe], vo = [{ code: 75, name: "hasLastPointRef", parser: p }, { code: 1, name: "pointRefs", parser: function(e, n) {
  let a = { className: e.value };
  for (; ; ) switch ((e = n.next()).code) {
    case 72:
      a.objectOsnapType = e.value;
      continue;
    case 331:
      a.mainObjectId = e.value;
      continue;
    case 73:
      a.mainObjectSubentityType = e.value;
      continue;
    case 91:
      a.mainObjectGsMarker = e.value;
      continue;
    case 301:
      a.mainObjectXrefHandle = e.value;
      continue;
    case 40:
      a.nearOsnapGeometryParameter = e.value;
      continue;
    case 10:
      {
        let t = s(e, n);
        a.osnapPoint = "z" in t ? t : { ...t, z: 0 };
      }
      continue;
    case 332:
      a.intersectionObjectId = e.value;
      continue;
    case 74:
      a.intersectionObjectSubentityType = e.value;
      continue;
    case 92:
      a.intersectionObjectGsMarker = e.value;
      continue;
    case 302:
      a.intersectionObjectXrefHandle = e.value;
      continue;
    default:
      return n.rewind(), a;
  }
}, isMultiple: !0 }, { code: 71, name: "rotatedDimensionType", parser: r }, { code: 70, name: "transSpaceFlag", parser: p }, { code: 90, name: "associativityFlag", parser: r }, { code: 330, name: "dimensionObjectId", parser: r }, { code: 100, name: "subclassMarker", parser: r }, ...pe], yo = { LAYOUT: uo, PLOTSETTINGS: Za, DICTIONARY: mo, SPATIAL_FILTER: fo, IMAGEDEF: bo, MLEADERSTYLE: Io, MLINESTYLE: ho, GROUP: Eo, LAYER_FILTER: go, LAYER_INDEX: xo, DIMASSOC: vo };
function To(e, n) {
  let a = [];
  for (; e.code !== 0 || !["EOF", "ENDSEC"].includes(e.value); ) {
    let t = e.value, c = yo[t];
    if (e.code === 0 && (c != null && c.length)) {
      let o = u(c), i = { name: t };
      o(e = n.next(), n, i) ? (a.push(i), e = n.peek()) : e = n.next();
    } else e = n.next();
  }
  return { byName: kn(a, ({ name: t }) => t) };
}
function _r(e) {
  if ((e.charCodeAt(0) === 65279 ? e.slice(1) : e).startsWith("AutoCAD Binary DXF")) throw Error("Binary DXF is not supported. Re-save the drawing as ASCII (text) DXF from your CAD application.");
}
function Ze(e, n, a) {
  return n in e ? Object.defineProperty(e, n, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = a, e;
}
class So {
  constructor() {
    Ze(this, "encoding", "utf-8"), Ze(this, "encodingFailureFatal", !1), Ze(this, "thumbnailImageFormat", "base64");
  }
}
class Oo extends EventTarget {
  parseSync(n, a = !1) {
    _r(n);
    let t = new kr(n.split(/\r\n|\r|\n/g), a);
    if (!t.hasNext()) throw Error("Empty file");
    return this.parseAll(t);
  }
  parseStream(n) {
    let a = "", t = this;
    return new Promise((c, o) => {
      n.on("data", (i) => {
        a += i;
      }), n.on("end", () => {
        try {
          _r(a);
          let i = a.split(/\r\n|\r|\n/g), m = new kr(i);
          if (!m.hasNext()) throw Error("Empty file");
          c(t.parseAll(m));
        } catch (i) {
          o(i);
        }
      }), n.on("error", (i) => {
        o(i);
      });
    });
  }
  async parseFromUrl(n, a) {
    let t = await fetch(n, a);
    if (!t.body) return null;
    let c = t.body.getReader(), o = "";
    for (; ; ) {
      let { done: i, value: m } = await c.read();
      if (i) {
        o += this._decoder.decode(new ArrayBuffer(0), { stream: !1 });
        break;
      }
      o += this._decoder.decode(m, { stream: !0 });
    }
    return this.parseSync(o);
  }
  parseAll(n) {
    let a = { header: {}, blocks: {}, entities: [], tables: {}, objects: { byName: {}, byTree: void 0 } }, t = n.next();
    for (; !I(t, 0, "EOF"); ) I(t, 0, "SECTION") && (I(t = n.next(), 2, "HEADER") ? a.header = Xt(t = n.next(), n) : I(t, 2, "CLASSES") ? fn(t = n.next(), n, a) : I(t, 2, "BLOCKS") ? a.blocks = lo(t = n.next(), n) : I(t, 2, "ENTITIES") ? a.entities = Ka(t = n.next(), n) : I(t, 2, "TABLES") ? a.tables = io(t = n.next(), n) : I(t, 2, "OBJECTS") ? a.objects = To(t = n.next(), n) : I(t, 2, "THUMBNAILIMAGE") && (a.thumbnailImage = function(c, o, i = "base64") {
      let m, l = "", d = 0;
      for (; !I(c, 0, "EOF") && !I(c, 0, "ENDSEC"); ) c.code === 90 ? d = c.value : c.code === 310 && (l += c.value), c = o.next();
      if (i === "hex") m = l;
      else {
        let f = function(h) {
          let y = h.length / 2, x = new Uint8Array(y);
          for (let S = 0; S < y; S++) x[S] = parseInt(h.substr(2 * S, 2), 16);
          return x;
        }(l);
        m = i === "buffer" ? f : function(h) {
          let y = "";
          for (let x = 0; x < h.length; x++) y += String.fromCharCode(h[x]);
          return btoa(y);
        }(f);
      }
      return { size: d, data: m };
    }(t = n.next(), n, this._options.thumbnailImageFormat))), t = n.next();
    return a;
  }
  constructor(n = {}) {
    super(), Ze(this, "_decoder", void 0), Ze(this, "_options", void 0);
    let a = new So();
    this._options = Object.assign(a, n), this._decoder = new TextDecoder(this._options.encoding, { fatal: this._options.encodingFailureFatal });
  }
}
(B = {})[B.NOT_APPLICABLE = 0] = "NOT_APPLICABLE", B[B.KEEP_EXISTING = 1] = "KEEP_EXISTING", B[B.USE_CLONE = 2] = "USE_CLONE", B[B.XREF_VALUE_NAME = 3] = "XREF_VALUE_NAME", B[B.VALUE_NAME = 4] = "VALUE_NAME", B[B.UNMANGLE_NAME = 5] = "UNMANGLE_NAME";
(Ae = {})[Ae.NOUNIT = 0] = "NOUNIT", Ae[Ae.CENTIMETERS = 2] = "CENTIMETERS", Ae[Ae.INCH = 5] = "INCH";
(ze = {})[ze.PSLTSCALE = 1] = "PSLTSCALE", ze[ze.LIMCHECK = 2] = "LIMCHECK";
(De = {})[De.INCHES = 0] = "INCHES", De[De.MILLIMETERS = 1] = "MILLIMETERS", De[De.PIXELS = 2] = "PIXELS";
(U = {})[U.LAST_SCREEN_DISPLAY = 0] = "LAST_SCREEN_DISPLAY", U[U.DRAWING_EXTENTS = 1] = "DRAWING_EXTENTS", U[U.DRAWING_LIMITS = 2] = "DRAWING_LIMITS", U[U.VIEW_SPECIFIED = 3] = "VIEW_SPECIFIED", U[U.WINDOW_SPECIFIED = 4] = "WINDOW_SPECIFIED", U[U.LAYOUT_INFORMATION = 5] = "LAYOUT_INFORMATION";
(ce = {})[ce.AS_DISPLAYED = 0] = "AS_DISPLAYED", ce[ce.WIREFRAME = 1] = "WIREFRAME", ce[ce.HIDDEN = 2] = "HIDDEN", ce[ce.RENDERED = 3] = "RENDERED";
(H = {})[H.DRAFT = 0] = "DRAFT", H[H.PREVIEW = 1] = "PREVIEW", H[H.NORMAL = 2] = "NORMAL", H[H.PRESENTATION = 3] = "PRESENTATION", H[H.MAXIMUM = 4] = "MAXIMUM", H[H.CUSTOM = 5] = "CUSTOM";
(ie = {})[ie.NONE = 0] = "NONE", ie[ie.AbsoluteRotation = 1] = "AbsoluteRotation", ie[ie.TextEmbedded = 2] = "TextEmbedded", ie[ie.ShapeEmbedded = 4] = "ShapeEmbedded";
(hr = {})[hr.PaperSpace = 1] = "PaperSpace";
(ke = {})[ke.XrefDependent = 16] = "XrefDependent", ke[ke.XrefResolved = 32] = "XrefResolved", ke[ke.Referenced = 64] = "Referenced";
(G = {})[G.Off = 0] = "Off", G[G.Perspective = 1] = "Perspective", G[G.ClipFront = 2] = "ClipFront", G[G.ClipBack = 4] = "ClipBack", G[G.UcsFollow = 8] = "UcsFollow", G[G.ClipFrontByFrontZ = 16] = "ClipFrontByFrontZ";
class No {
  parse(n) {
    const a = new Oo(), t = this.getDxfInfoFromBuffer(n);
    let c = "";
    return t.version && t.version.value <= 23 && t.encoding ? c = new TextDecoder(t.encoding).decode(n) : c = new TextDecoder().decode(n), a.parseSync(c);
  }
  getDxfInfoFromBuffer(n) {
    var d, f, h;
    const t = new TextDecoder("utf-8");
    let c = 0, o = "", i = null, m = null, l = !1;
    for (; c < n.byteLength; ) {
      const y = Math.min(c + 65536, n.byteLength), x = n.slice(c, y);
      c = y;
      const O = (o + t.decode(x, { stream: !0 })).split(/\r?\n/);
      o = O.pop() ?? "";
      for (let w = 0; w < O.length; w++) {
        const W = O[w].trim();
        if (W === "SECTION" && ((d = O[w + 2]) == null ? void 0 : d.trim()) === "HEADER")
          l = !0;
        else if (W === "ENDSEC" && l)
          return { version: i, encoding: m };
        if (l && W === "$ACADVER") {
          const me = (f = O[w + 2]) == null ? void 0 : f.trim();
          me && (i = new $a(me));
        } else if (l && W === "$DWGCODEPAGE") {
          const me = (h = O[w + 2]) == null ? void 0 : h.trim();
          if (me) {
            const lr = xr[me];
            m = an(lr);
          }
        }
        if (i && m)
          return { version: i, encoding: m };
      }
    }
    return { version: i, encoding: m };
  }
}
class Ao extends en {
  async executeTask(n) {
    return new No().parse(n);
  }
}
new Ao();
