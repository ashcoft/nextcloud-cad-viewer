"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const W=require("@mlightcad/three-renderer"),on=require("three"),an=require("three/examples/jsm/lines/LineMaterial.js"),sn=require("three/examples/jsm/lines/LineSegments2.js"),g=require("@mlightcad/data-model"),h=require("@mlightcad/cad-simple-viewer"),It=require("./cad-html-plugin-register.umd.cjs");function ln(e){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const n in e)if(n!=="default"){const r=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,r.get?r:{enumerable:!0,get:()=>e[n]})}}return t.default=e,Object.freeze(t)}const _=ln(on),oe=2;var C=Uint8Array,$=Uint16Array,ut=Int32Array,Ce=new C([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Le=new C([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Re=new C([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Tt=function(e,t){for(var n=new $(31),r=0;r<31;++r)n[r]=t+=1<<e[r-1];for(var o=new ut(n[30]),r=1;r<30;++r)for(var a=n[r];a<n[r+1];++a)o[a]=a-n[r]<<5|r;return{b:n,r:o}},Bt=Tt(Ce,2),_t=Bt.b,Ne=Bt.r;_t[28]=258,Ne[258]=28;var Pt=Tt(Le,0),cn=Pt.b,vt=Pt.r,Ve=new $(32768);for(var y=0;y<32768;++y){var re=(y&43690)>>1|(y&21845)<<1;re=(re&52428)>>2|(re&13107)<<2,re=(re&61680)>>4|(re&3855)<<4,Ve[y]=((re&65280)>>8|(re&255)<<8)>>1}var K=function(e,t,n){for(var r=e.length,o=0,a=new $(t);o<r;++o)e[o]&&++a[e[o]-1];var i=new $(t);for(o=1;o<t;++o)i[o]=i[o-1]+a[o-1]<<1;var s;if(n){s=new $(1<<t);var l=15-t;for(o=0;o<r;++o)if(e[o])for(var c=o<<4|e[o],d=t-e[o],u=i[e[o]-1]++<<d,f=u|(1<<d)-1;u<=f;++u)s[Ve[u]>>l]=c}else for(s=new $(r),o=0;o<r;++o)e[o]&&(s[o]=Ve[i[e[o]-1]++]>>15-e[o]);return s},ae=new C(288);for(var y=0;y<144;++y)ae[y]=8;for(var y=144;y<256;++y)ae[y]=9;for(var y=256;y<280;++y)ae[y]=7;for(var y=280;y<288;++y)ae[y]=8;var xe=new C(32);for(var y=0;y<32;++y)xe[y]=5;var dn=K(ae,9,0),un=K(ae,9,1),fn=K(xe,5,0),gn=K(xe,5,1),Pe=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},J=function(e,t,n){var r=t/8|0;return(e[r]|e[r+1]<<8)>>(t&7)&n},Fe=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},ft=function(e){return(e+7)/8|0},Ee=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new C(e.subarray(t,n))},hn=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Y=function(e,t,n){var r=new Error(t||hn[e]);if(r.code=e,Error.captureStackTrace&&Error.captureStackTrace(r,Y),!n)throw r;return r},mn=function(e,t,n,r){var o=e.length,a=0;if(!o||t.f&&!t.l)return n||new C(0);var i=!n,s=i||t.i!=2,l=t.i;i&&(n=new C(o*3));var c=function(pe){var ve=n.length;if(pe>ve){var ce=new C(Math.max(ve*2,pe));ce.set(n),n=ce}},d=t.f||0,u=t.p||0,f=t.b||0,m=t.l,w=t.d,p=t.m,x=t.n,O=o*8;do{if(!m){d=J(e,u,1);var N=J(e,u+1,3);if(u+=3,N)if(N==1)m=un,w=gn,p=9,x=5;else if(N==2){var U=J(e,u,31)+257,E=J(e,u+10,15)+4,b=U+J(e,u+5,31)+1;u+=14;for(var v=new C(b),I=new C(19),k=0;k<E;++k)I[Re[k]]=J(e,u+k*3,7);u+=E*3;for(var F=Pe(I),ne=(1<<F)-1,V=K(I,F,1),k=0;k<b;){var D=V[J(e,u,ne)];u+=D&15;var L=D>>4;if(L<16)v[k++]=L;else{var T=0,A=0;for(L==16?(A=3+J(e,u,3),u+=2,T=v[k-1]):L==17?(A=3+J(e,u,7),u+=3):L==18&&(A=11+J(e,u,127),u+=7);A--;)v[k++]=T}}var R=v.subarray(0,U),B=v.subarray(U);p=Pe(R),x=Pe(B),m=K(R,p,1),w=K(B,x,1)}else Y(1);else{var L=ft(u)+4,H=e[L-4]|e[L-3]<<8,P=L+H;if(P>o){l&&Y(0);break}s&&c(f+H),n.set(e.subarray(L,P),f),t.b=f+=H,t.p=u=P*8,t.f=d;continue}if(u>O){l&&Y(0);break}}s&&c(f+131072);for(var me=(1<<p)-1,Z=(1<<x)-1,Q=u;;Q=u){var T=m[Fe(e,u)&me],j=T>>4;if(u+=T&15,u>O){l&&Y(0);break}if(T||Y(2),j<256)n[f++]=j;else if(j==256){Q=u,m=null;break}else{var G=j-254;if(j>264){var k=j-257,M=Ce[k];G=J(e,u,(1<<M)-1)+_t[k],u+=M}var q=w[Fe(e,u)&Z],se=q>>4;q||Y(3),u+=q&15;var B=cn[se];if(se>3){var M=Le[se];B+=Fe(e,u)&(1<<M)-1,u+=M}if(u>O){l&&Y(0);break}s&&c(f+131072);var le=f+G;if(f<B){var ye=a-B,Ae=Math.min(B,le);for(ye+f<0&&Y(3);f<Ae;++f)n[f]=r[ye+f]}for(;f<le;++f)n[f]=n[f-B]}}t.l=m,t.p=Q,t.b=f,t.f=d,m&&(d=1,t.m=p,t.d=w,t.n=x)}while(!d);return f!=n.length&&i?Ee(n,0,f):n.subarray(0,f)},ee=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8},we=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8,e[r+2]|=n>>16},ze=function(e,t){for(var n=[],r=0;r<e.length;++r)e[r]&&n.push({s:r,f:e[r]});var o=n.length,a=n.slice();if(!o)return{t:zt,l:0};if(o==1){var i=new C(n[0].s+1);return i[n[0].s]=1,{t:i,l:1}}n.sort(function(P,U){return P.f-U.f}),n.push({s:-1,f:25001});var s=n[0],l=n[1],c=0,d=1,u=2;for(n[0]={s:-1,f:s.f+l.f,l:s,r:l};d!=o-1;)s=n[n[c].f<n[u].f?c++:u++],l=n[c!=d&&n[c].f<n[u].f?c++:u++],n[d++]={s:-1,f:s.f+l.f,l:s,r:l};for(var f=a[0].s,r=1;r<o;++r)a[r].s>f&&(f=a[r].s);var m=new $(f+1),w=je(n[d-1],m,0);if(w>t){var r=0,p=0,x=w-t,O=1<<x;for(a.sort(function(U,E){return m[E.s]-m[U.s]||U.f-E.f});r<o;++r){var N=a[r].s;if(m[N]>t)p+=O-(1<<w-m[N]),m[N]=t;else break}for(p>>=x;p>0;){var L=a[r].s;m[L]<t?p-=1<<t-m[L]++-1:++r}for(;r>=0&&p;--r){var H=a[r].s;m[H]==t&&(--m[H],++p)}w=t}return{t:new C(m),l:w}},je=function(e,t,n){return e.s==-1?Math.max(je(e.l,t,n+1),je(e.r,t,n+1)):t[e.s]=n},wt=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new $(++t),r=0,o=e[0],a=1,i=function(l){n[r++]=l},s=1;s<=t;++s)if(e[s]==o&&s!=t)++a;else{if(!o&&a>2){for(;a>138;a-=138)i(32754);a>2&&(i(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(i(o),--a;a>6;a-=6)i(8304);a>2&&(i(a-3<<5|8208),a=0)}for(;a--;)i(o);a=1,o=e[s]}return{c:n.subarray(0,r),n:t}},be=function(e,t){for(var n=0,r=0;r<t.length;++r)n+=e[r]*t[r];return n},Ft=function(e,t,n){var r=n.length,o=ft(t+2);e[o]=r&255,e[o+1]=r>>8,e[o+2]=e[o]^255,e[o+3]=e[o+1]^255;for(var a=0;a<r;++a)e[o+a+4]=n[a];return(o+4+r)*8},bt=function(e,t,n,r,o,a,i,s,l,c,d){ee(t,d++,n),++o[256];for(var u=ze(o,15),f=u.t,m=u.l,w=ze(a,15),p=w.t,x=w.l,O=wt(f),N=O.c,L=O.n,H=wt(p),P=H.c,U=H.n,E=new $(19),b=0;b<N.length;++b)++E[N[b]&31];for(var b=0;b<P.length;++b)++E[P[b]&31];for(var v=ze(E,7),I=v.t,k=v.l,F=19;F>4&&!I[Re[F-1]];--F);var ne=c+5<<3,V=be(o,ae)+be(a,xe)+i,D=be(o,f)+be(a,p)+i+14+3*F+be(E,I)+2*E[16]+3*E[17]+7*E[18];if(l>=0&&ne<=V&&ne<=D)return Ft(t,d,e.subarray(l,l+c));var T,A,R,B;if(ee(t,d,1+(D<V)),d+=2,D<V){T=K(f,m,0),A=f,R=K(p,x,0),B=p;var me=K(I,k,0);ee(t,d,L-257),ee(t,d+5,U-1),ee(t,d+10,F-4),d+=14;for(var b=0;b<F;++b)ee(t,d+3*b,I[Re[b]]);d+=3*F;for(var Z=[N,P],Q=0;Q<2;++Q)for(var j=Z[Q],b=0;b<j.length;++b){var G=j[b]&31;ee(t,d,me[G]),d+=I[G],G>15&&(ee(t,d,j[b]>>5&127),d+=j[b]>>12)}}else T=dn,A=ae,R=fn,B=xe;for(var b=0;b<s;++b){var M=r[b];if(M>255){var G=M>>18&31;we(t,d,T[G+257]),d+=A[G+257],G>7&&(ee(t,d,M>>23&31),d+=Ce[G]);var q=M&31;we(t,d,R[q]),d+=B[q],q>3&&(we(t,d,M>>5&8191),d+=Le[q])}else we(t,d,T[M]),d+=A[M]}return we(t,d,T[256]),d+A[256]},pn=new ut([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),zt=new C(0),vn=function(e,t,n,r,o,a){var i=a.z||e.length,s=new C(r+i+5*(1+Math.ceil(i/7e3))+o),l=s.subarray(r,s.length-o),c=a.l,d=(a.r||0)&7;if(t){d&&(l[0]=a.r>>3);for(var u=pn[t-1],f=u>>13,m=u&8191,w=(1<<n)-1,p=a.p||new $(32768),x=a.h||new $(w+1),O=Math.ceil(n/3),N=2*O,L=function(_e){return(e[_e]^e[_e+1]<<O^e[_e+2]<<N)&w},H=new ut(25e3),P=new $(288),U=new $(32),E=0,b=0,v=a.i||0,I=0,k=a.w||0,F=0;v+2<i;++v){var ne=L(v),V=v&32767,D=x[ne];if(p[V]=D,x[ne]=V,k<=v){var T=i-v;if((E>7e3||I>24576)&&(T>423||!c)){d=bt(e,l,0,H,P,U,b,I,F,v-F,d),I=E=b=0,F=v;for(var A=0;A<286;++A)P[A]=0;for(var A=0;A<30;++A)U[A]=0}var R=2,B=0,me=m,Z=V-D&32767;if(T>2&&ne==L(v-Z))for(var Q=Math.min(f,T)-1,j=Math.min(32767,v),G=Math.min(258,T);Z<=j&&--me&&V!=D;){if(e[v+R]==e[v+R-Z]){for(var M=0;M<G&&e[v+M]==e[v+M-Z];++M);if(M>R){if(R=M,B=Z,M>Q)break;for(var q=Math.min(Z,M-2),se=0,A=0;A<q;++A){var le=v-Z+A&32767,ye=p[le],Ae=le-ye&32767;Ae>se&&(se=Ae,D=le)}}}V=D,D=p[V],Z+=V-D&32767}if(B){H[I++]=268435456|Ne[R]<<18|vt[B];var pe=Ne[R]&31,ve=vt[B]&31;b+=Ce[pe]+Le[ve],++P[257+pe],++U[ve],k=v+R,++E}else H[I++]=e[v],++P[e[v]]}}for(v=Math.max(v,k);v<i;++v)H[I++]=e[v],++P[e[v]];d=bt(e,l,c,H,P,U,b,I,F,v-F,d),c||(a.r=d&7|l[d/8|0]<<3,d-=7,a.h=x,a.p=p,a.i=v,a.w=k)}else{for(var v=a.w||0;v<i+c;v+=65535){var ce=v+65535;ce>=i&&(l[d/8|0]=c,ce=i),d=Ft(l,d+1,e.subarray(v,ce))}a.i=i}return Ee(s,0,r+ft(d)+o)},wn=function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,r=9;--r;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e}(),bn=function(){var e=-1;return{p:function(t){for(var n=e,r=0;r<t.length;++r)n=wn[n&255^t[r]]^n>>>8;e=n},d:function(){return~e}}},xn=function(e,t,n,r,o){if(!o&&(o={l:1},t.dictionary)){var a=t.dictionary.subarray(-32768),i=new C(a.length+e.length);i.set(a),i.set(e,a.length),e=i,o.w=a.length}return vn(e,t.level==null?6:t.level,t.mem==null?o.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,r,o)},Ge=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8},yn=function(e,t){var n=t.filename;if(e[0]=31,e[1]=139,e[2]=8,e[8]=t.level<2?4:t.level==9?2:0,e[9]=3,t.mtime!=0&&Ge(e,4,Math.floor(new Date(t.mtime||Date.now())/1e3)),n){e[3]=8;for(var r=0;r<=n.length;++r)e[r+10]=n.charCodeAt(r)}},An=function(e){(e[0]!=31||e[1]!=139||e[2]!=8)&&Y(6,"invalid gzip data");var t=e[3],n=10;t&4&&(n+=(e[10]|e[11]<<8)+2);for(var r=(t>>3&1)+(t>>4&1);r>0;r-=!e[n++]);return n+(t&2)},Mn=function(e){var t=e.length;return(e[t-4]|e[t-3]<<8|e[t-2]<<16|e[t-1]<<24)>>>0},Sn=function(e){return 10+(e.filename?e.filename.length+1:0)};function kn(e,t){t||(t={});var n=bn(),r=e.length;n.p(e);var o=xn(e,t,Sn(t),8),a=o.length;return yn(o,t),Ge(o,a-8,n.d()),Ge(o,a-4,r),o}function Cn(e,t){var n=An(e);return n+8>e.length&&Y(6,"invalid gzip data"),mn(e.subarray(n,-8),{i:2},new C(Mn(e)),t)}var xt=typeof TextEncoder<"u"&&new TextEncoder,$e=typeof TextDecoder<"u"&&new TextDecoder,Ln=0;try{$e.decode(zt,{stream:!0}),Ln=1}catch{}var En=function(e){for(var t="",n=0;;){var r=e[n++],o=(r>127)+(r>223)+(r>239);if(n+o>e.length)return{s:t,r:Ee(e,n-1)};o?o==3?(r=((r&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|r>>10,56320|r&1023)):o&1?t+=String.fromCharCode((r&31)<<6|e[n++]&63):t+=String.fromCharCode((r&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(r)}};function In(e,t){var n;if(xt)return xt.encode(e);for(var r=e.length,o=new C(e.length+(e.length>>1)),a=0,i=function(c){o[a++]=c},n=0;n<r;++n){if(a+5>o.length){var s=new C(a+8+(r-n<<1));s.set(o),o=s}var l=e.charCodeAt(n);l<128||t?i(l):l<2048?(i(192|l>>6),i(128|l&63)):l>55295&&l<57344?(l=65536+(l&1047552)|e.charCodeAt(++n)&1023,i(240|l>>18),i(128|l>>12&63),i(128|l>>6&63),i(128|l&63)):(i(224|l>>12),i(128|l>>6&63),i(128|l&63))}return Ee(o,0,a)}function Tn(e,t){var n;if($e)return $e.decode(e);var r=En(e),o=r.s,n=r.r;return n.length&&Y(8),o}const Ht=1480934209,Ze=1,Xe=2,We=4,Ye=8,Je=1,qe=2,Ke=4,Qe=8,et=16,Ut=32;function Ot(e){if(e.version!==oe)throw new Error(`Unsupported snapshot version: ${e.version}`);const t=new Un;t.writeU32(Ht),t.writeU8(oe),t.writeU8(0),t.writeU8(0),t.writeU8(0),t.writeJson(e.meta),t.writeJson(e.layers),t.writeString(e.activeLayoutBtrId),t.writeU32(e.layouts.length);for(const n of e.layouts)Bn(t,n);return t.toUint8Array()}function Dt(e){const t=new On(e);if(t.readU32()!==Ht)throw new Error("Invalid snapshot magic");const r=t.readU8();if(t.readU8(),t.readU8(),t.readU8(),r!==oe)throw new Error(`Unsupported snapshot version: ${r}`);const o=t.readJson(),a=t.readJson(),i=t.readString(),s=t.readU32(),l=[];for(let c=0;c<s;c++)l.push(_n(t));return{version:oe,meta:o,layers:a,layouts:l,activeLayoutBtrId:i}}function Bn(e,t){e.writeString(t.btrId),e.writeString(t.name),e.writeU8(t.isModelSpace?1:0),e.writeJson(t.osnap??null),e.writeU32(t.lineBatches.length);for(const n of t.lineBatches)Pn(e,n);e.writeU32(t.meshBatches.length);for(const n of t.meshBatches)zn(e,n)}function _n(e){const t=e.readString(),n=e.readString(),r=e.readU8()!==0,a=e.readJson()??void 0,i=e.readU32(),s=[];for(let d=0;d<i;d++)s.push(Fn(e));const l=e.readU32(),c=[];for(let d=0;d<l;d++)c.push(Hn(e));return{btrId:t,name:n,isModelSpace:r,lineBatches:s,meshBatches:c,osnap:a}}function Pn(e,t){e.writeString(t.layer),e.writeU32(t.color>>>0),e.writeF64(t.offset[0]),e.writeF64(t.offset[1]),e.writeF64(t.offset[2]),e.writeFloat32Array(t.positions);let n=0;t.indices&&t.indices.length>0&&(n|=Ze),t.linePattern&&(n|=Xe),t.lineDistances&&t.lineDistances.length>0&&(n|=We),t.lineWidth!=null&&t.lineWidth>0&&(n|=Ye),e.writeU8(n),n&Ze&&e.writeUint32Array(t.indices),n&Xe&&e.writeJson(t.linePattern),n&We&&e.writeFloat32Array(t.lineDistances),n&Ye&&e.writeF32(t.lineWidth)}function Fn(e){const t=e.readString(),n=e.readU32(),r=[e.readF64(),e.readF64(),e.readF64()],o=e.readFloat32Array(),a=e.readU8(),i={layer:t,color:n,offset:r,positions:o};return a&Ze&&(i.indices=e.readUint32Array()),a&Xe&&(i.linePattern=e.readJson()),a&We&&(i.lineDistances=e.readFloat32Array()),a&Ye&&(i.lineWidth=e.readF32()),i}function zn(e,t){e.writeString(t.layer),e.writeU32(t.color>>>0),e.writeF64(t.offset[0]),e.writeF64(t.offset[1]),e.writeF64(t.offset[2]),e.writeFloat32Array(t.positions);let n=0;t.indices&&t.indices.length>0&&(n|=Je),t.hatchPattern&&(n|=qe),t.gradientFill&&(n|=Ke),t.gradientPositions&&t.gradientPositions.length>0&&(n|=Qe),t.side!=null&&(n|=et),t.points&&(n|=Ut),e.writeU8(n),n&Je&&e.writeUint32Array(t.indices),n&qe&&e.writeJson(t.hatchPattern),n&Ke&&e.writeJson(t.gradientFill),n&Qe&&e.writeFloat32Array(t.gradientPositions),n&et&&e.writeU8(t.side)}function Hn(e){const t=e.readString(),n=e.readU32(),r=[e.readF64(),e.readF64(),e.readF64()],o=e.readFloat32Array(),a=e.readU8(),i={layer:t,color:n,offset:r,positions:o};return a&Je&&(i.indices=e.readUint32Array()),a&qe&&(i.hatchPattern=e.readJson()),a&Ke&&(i.gradientFill=e.readJson()),a&Qe&&(i.gradientPositions=e.readFloat32Array()),a&et&&(i.side=e.readU8()),a&Ut&&(i.points=!0),i}class Un{constructor(){this.chunks=[],this.length=0}writeU8(t){const n=new Uint8Array(1);n[0]=t&255,this.chunks.push(n),this.length+=1}writeU32(t){const n=new Uint8Array(4);new DataView(n.buffer).setUint32(0,t>>>0,!0),this.chunks.push(n),this.length+=4}writeF32(t){const n=new Uint8Array(4);new DataView(n.buffer).setFloat32(0,t,!0),this.chunks.push(n),this.length+=4}writeF64(t){const n=new Uint8Array(8);new DataView(n.buffer).setFloat64(0,t,!0),this.chunks.push(n),this.length+=8}writeBytes(t){this.chunks.push(t),this.length+=t.length}writeString(t){const n=In(t);this.writeU32(n.length),this.writeBytes(n)}writeJson(t){this.writeString(JSON.stringify(t))}writeFloat32Array(t){const n=new Uint8Array(t.buffer,t.byteOffset,t.byteLength);this.writeU32(n.length),this.writeBytes(n)}writeUint32Array(t){const n=new Uint8Array(t.buffer,t.byteOffset,t.byteLength);this.writeU32(n.length),this.writeBytes(n)}toUint8Array(){const t=new Uint8Array(this.length);let n=0;for(const r of this.chunks)t.set(r,n),n+=r.length;return t}}class On{constructor(t){this.bytes=t,this.offset=0}readU8(){return this.bytes[this.offset++]}readU32(){const n=new DataView(this.bytes.buffer,this.bytes.byteOffset+this.offset,4).getUint32(0,!0);return this.offset+=4,n}readF32(){const n=new DataView(this.bytes.buffer,this.bytes.byteOffset+this.offset,4).getFloat32(0,!0);return this.offset+=4,n}readF64(){const n=new DataView(this.bytes.buffer,this.bytes.byteOffset+this.offset,8).getFloat64(0,!0);return this.offset+=8,n}readBytes(t){const n=this.bytes.subarray(this.offset,this.offset+t);return this.offset+=t,n}readString(){const t=this.readU32();return t===0?"":Tn(this.readBytes(t))}readJson(){const t=this.readString();if(t.length===0)throw new Error("Expected JSON payload");return JSON.parse(t)}readFloat32Array(){const t=this.readU32();if(t===0)return new Float32Array(0);const n=this.readBytes(t),r=new ArrayBuffer(t);return new Uint8Array(r).set(n),new Float32Array(r)}readUint32Array(){const t=this.readU32();if(t===0)return new Uint32Array(0);const n=this.readBytes(t),r=new ArrayBuffer(t);return new Uint8Array(r).set(n),new Uint32Array(r)}}const Dn="application/vnd.mlightcad.acex-snapshot+binary";function Rt(e){if(e.version!==oe)throw new Error(`Unsupported snapshot version: ${e.version}`);const t=Ot(e),n=kn(t);return Nn(n)}function Rn(e){const t=Vn(e.trim()),n=Cn(t);return Dt(n)}function Nt(){return Dn}function Nn(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t)}function Vn(e){const t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);return n}function he(e,t,n){if(n<=0)return new Float32Array(0);const r=new Float32Array(n);for(let o=0;o<n;o++)r[o]=e[t+o];return r}function jn(e,t,n){if(n<=0)return new Uint32Array(0);const r=new Uint32Array(n);for(let o=0;o<n;o++)r[o]=e[t+o];return r}function Vt(e,t){if(t.length===0)return{positions:e,indices:t};let n=0;for(let o=0;o<t.length;o++){const a=t[o];a>n&&(n=a)}const r=(n+1)*3;return r>=e.length?{positions:e,indices:t}:{positions:he(e,0,r),indices:t}}function yt(e,t){return e+t}const de={x:0,y:0,z:0};function Gn(e){e.updateMatrixWorld(!0);const t=e.matrixWorld.elements;return de.x=t[12],de.y=t[13],de.z=t[14],[de.x,de.y,de.z]}function $n(e,t){const n=t.elements,r=e.positions;if(r.length===0)return{positions:new Float32Array(0),indices:e.indices};const o=new Float32Array(r.length);for(let a=0;a<r.length;a+=3){const i=r[a],s=r[a+1],l=r[a+2];o[a]=n[0]*i+n[4]*s+n[8]*l+n[12],o[a+1]=n[1]*i+n[5]*s+n[9]*l+n[13],o[a+2]=n[2]*i+n[6]*s+n[10]*l+n[14]}return{positions:o,indices:e.indices?new Uint32Array(e.indices):void 0}}function Zn(e){const t=e.positions;if(t.length<3)return{slice:e,offset:[0,0,0]};let n=1/0,r=1/0,o=1/0,a=-1/0,i=-1/0,s=-1/0;for(let d=0;d<t.length;d+=3){const u=t[d],f=t[d+1],m=t[d+2];n=Math.min(n,u),r=Math.min(r,f),o=Math.min(o,m),a=Math.max(a,u),i=Math.max(i,f),s=Math.max(s,m)}const l=[(n+a)/2,(r+i)/2,(o+s)/2],c=new Float32Array(t.length);for(let d=0;d<t.length;d+=3)c[d]=t[d]-l[0],c[d+1]=t[d+1]-l[1],c[d+2]=t[d+2]-l[2];return{slice:{positions:c,indices:e.indices?new Uint32Array(e.indices):void 0},offset:l}}function Xn(e,t,n={}){e.updateMatrixWorld(!0);const r=$n(t,e.matrixWorld);return n.preserveWorldSpaceForPatternFill?{slice:r,offset:[0,0,0]}:Zn(r)}function gt(e){const t=e;if(t.isShaderMaterial===!0||e.type==="ShaderMaterial")return t}function Wn(e){var a;const t=gt(e);if(!t)return;const n=t.uniforms.pattern,r=t.uniforms.patternLength;if(!n||!r)return;const o=n.value;if(!(!Array.isArray(o)||o.length===0))return{pattern:[...o],patternLength:Number(r.value),viewportScale:Number(((a=t.uniforms.u_viewportScale)==null?void 0:a.value)??1)}}function Yn(e){var o;const t=gt(e);if(!t)return;const n=t.uniforms.u_patternLines;if(!n)return;const r=n.value;if(!(!Array.isArray(r)||r.length===0))return{patternAngle:Number(((o=t.uniforms.u_patternAngle)==null?void 0:o.value)??0),patternLines:r.map(qn)}}function Jn(e){var a,i,s,l,c;const t=gt(e);if(!t||t.uniforms.u_patternLines)return;const n=(a=t.uniforms.u_startColor)==null?void 0:a.value,r=(i=t.uniforms.u_endColor)==null?void 0:i.value,o=t.uniforms.u_gradientType;if(!(!(n!=null&&n.getHex)||o==null))return{startColor:n.getHex(),endColor:((s=r==null?void 0:r.getHex)==null?void 0:s.call(r))??n.getHex(),angle:Number(((l=t.uniforms.u_angle)==null?void 0:l.value)??0),shift:Number(((c=t.uniforms.u_shift)==null?void 0:c.value)??0),gradientType:Number(o.value)}}function qn(e){return{angle:e.angle,base:[e.base.x,e.base.y],offset:[e.offset.x,e.offset.y],dashLengths:[...e.dashLengths],patternLength:e.patternLength}}function jt(e){const t=e.length/3;if(t<2)return new Float32Array(0);const n=new Float32Array(t);for(let r=0;r<t;r+=2){r===0?n[r]=0:n[r]=n[r-1];const o=e[r*3],a=e[r*3+1],i=e[r*3+2]??0,s=e[(r+1)*3],l=e[(r+1)*3+1],c=e[(r+1)*3+2]??0,d=s-o,u=l-a,f=c-i;n[r+1]=n[r]+Math.sqrt(d*d+u*u+f*f)}return n}function Kn(e,t){const n=e.getAttribute(t);if(!n||n.count===0)return;const r=n.itemSize;if(e.getIndex()){const u=n.array;return he(u,0,n.count*r)}const a=e.drawRange,i=n.count,s=Math.max(0,Math.min(Math.floor(a.start),i)),l=Math.max(0,i-s),c=!Number.isFinite(a.count)||a.count<=0?l:Math.min(Math.floor(a.count),l);if(c<=0)return;const d=n.array;return he(d,s*r,c*r)}function Qn(e,t){const n=Math.atan2(t[1],t[0]),r=(a,i)=>[t[0]*a+t[4]*i+t[12],t[1]*a+t[5]*i+t[13]],o=(a,i)=>[t[0]*a+t[4]*i,t[1]*a+t[5]*i];return{patternAngle:e.patternAngle+n,patternLines:e.patternLines.map(a=>({angle:a.angle+n,base:r(a.base[0],a.base[1]),offset:o(a.offset[0],a.offset[1]),dashLengths:[...a.dashLengths],patternLength:a.patternLength}))}}function tt(e,t){return!Number.isFinite(e)||e<0?0:Math.min(Math.floor(e),t)}function nt(e,t,n){const r=Math.max(0,t-n);return!Number.isFinite(e)||e<=0?r:Math.min(Math.floor(e),r)}function rt(e){const t=e.getAttribute("position");if(!t)return{positions:new Float32Array(0)};const n=e.drawRange,r=t.array,o=t.itemSize,a=e.getIndex();if(a){const c=he(r,0,t.count*o),d=a.array,u=tt(n.start,a.count),f=nt(n.count,a.count,u),m=jn(d,u,f);return Vt(c,m)}const i=tt(n.start,t.count),s=nt(n.count,t.count,i);return{positions:he(r,i*o,s*o)}}function ot(e){return W.isBatchGeometryActive(e.flags)&&W.isBatchGeometryVisible(e.flags)}function Ie(e,t){const n=t.getAttribute("position");if(!n)return{positions:new Float32Array(0)};const r=n.itemSize,o=n.array,a=t.getIndex(),{count:i}=e.mappingStats;if(a){const l=he(o,0,n.count*r),c=a.array,d=[];for(let u=0;u<i;u++){let f;try{f=e.getGeometryRangeAt(u)}catch{continue}const m=f.indexStart??0,w=f.indexCount??0;if(!(!ot(f)||w<=0))for(let p=0;p<w;p++)d.push(c[m+p])}return d.length===0?{positions:new Float32Array(0)}:Vt(l,new Uint32Array(d))}const s=[];for(let l=0;l<i;l++){let c;try{c=e.getGeometryRangeAt(l)}catch{continue}if(!ot(c)||c.vertexCount<=0)continue;const d=c.vertexStart*r,u=c.vertexCount*r;for(let f=0;f<u;f++)s.push(o[d+f])}return{positions:new Float32Array(s)}}function Me(e,t,n){e.push(t.getX(n),t.getY(n),t.getZ(n))}function Gt(e,t){const n=t.getAttribute("instanceStart"),r=t.getAttribute("instanceEnd");if(!n||!r)return{positions:new Float32Array(0)};const{count:o}=e.mappingStats,a=[];for(let i=0;i<o;i++){let s;try{s=e.getGeometryRangeAt(i)}catch{continue}if(!ot(s)||s.vertexCount<=0)continue;const l=s.vertexStart,c=l+s.vertexCount;for(let d=l;d<c;d++)Me(a,n,d),Me(a,r,d)}return{positions:new Float32Array(a)}}function er(e,t){const r=e.instanceCount;if(Number.isFinite(r)&&r>=0)return Math.min(Math.floor(r),t);const o=e.drawRange,a=tt(o.start,t);return nt(o.count,t,a)}function tr(e){const t=e.getAttribute("instanceStart"),n=e.getAttribute("instanceEnd");if(!t||!n||t.count===0)return{positions:new Float32Array(0)};const r=er(e,t.count);if(r<=0)return{positions:new Float32Array(0)};const o=[];for(let a=0;a<r;a++)Me(o,t,a),Me(o,n,a);return{positions:new Float32Array(o)}}function He(e){return W.isObjectHierarchyVisible(e)}function $t(e){if(e instanceof an.LineMaterial)return e.linewidth}function fe(e){var c;const t=W.getMaterialMetadata(e),n=t.layer??"0",r=e;let o=r.color!=null?r.color.getHex():t.color??16777215;const a=Wn(e),i=Yn(e),s=Jn(e);if(e instanceof _.ShaderMaterial||e.type==="ShaderMaterial"){const u=(c=e.uniforms.u_color)==null?void 0:c.value;u!=null&&u.getHex?o=u.getHex():s&&(o=s.startColor)}return{color:o,layer:n,linePattern:a,hatchPattern:i,gradientFill:s,side:!!i||!!s?e.side:void 0}}function nr(e,t){if(!t)return;const n=e.userData.bakedWorldMatrix;return!n||n.length<16?t:Qn(t,n)}function Te(e){return Gn(e)}function Ue(e,t,n={}){const r=Xn(e,t,n);return{...r.slice,offset:r.offset}}function ht(e,t,n,r,o){const a=fe(t),i=nr(n,a.hatchPattern),s=a.gradientFill?Kn(e,"gradientPosition"):void 0;return{layer:a.layer,color:a.color,offset:o,hatchPattern:i,gradientFill:a.gradientFill,gradientPositions:s,side:a.side,...r}}function rr(e){const t=Gt(e,e.geometry);if(t.positions.length===0)return;const{color:n,layer:r}=fe(e.material),o=$t(e.material);return{layer:r,color:n,offset:Te(e),lineWidth:o,...t}}function or(e){const t=Ie(e,e.geometry);if(t.positions.length===0)return;const{color:n,layer:r,linePattern:o}=fe(e.material),a=o?jt(t.positions):void 0;return{layer:r,color:n,offset:Te(e),linePattern:o,lineDistances:a,...t}}function ar(e){const t=Ie(e,e.geometry);if(t.positions.length!==0)return ht(e.geometry,e.material,e,t,Te(e))}function ir(e){const t=Ie(e,e.geometry);if(t.positions.length!==0)return{points:!0,...ht(e.geometry,e.material,e,t,Te(e))}}function at(e){const t=[],n=[];return e.traverse(r=>{if(!(W.isHighlightOverlayDescendant(r)||W.isHighlightCloneDrawable(r))){if(r instanceof W.AcTrBatchedLine){const o=or(r);o&&t.push(o);return}if(r instanceof W.AcTrBatchedLine2){const o=rr(r);o&&t.push(o);return}if(r instanceof W.AcTrBatchedMesh){const o=ar(r);o&&n.push(o);return}if(r instanceof W.AcTrBatchedPoint){const o=ir(r);o&&n.push(o);return}if(r instanceof sn.LineSegments2){if(!He(r))return;const o=tr(r.geometry);if(o.positions.length===0)return;const a=r.material,{color:i,layer:s}=fe(a),{offset:l,...c}=Ue(r,o);t.push({layer:s,color:i,offset:l,lineWidth:$t(a),...c})}else if(r instanceof _.LineSegments&&!(r instanceof W.AcTrBatchedLine)){if(!He(r))return;const o=rt(r.geometry);if(o.positions.length===0)return;const a=r.material,{color:i,layer:s,linePattern:l}=fe(a),{offset:c,...d}=Ue(r,o),u=l?jt(d.positions):void 0;t.push({layer:s,color:i,offset:c,linePattern:l,lineDistances:u,...d})}else if(r instanceof _.Mesh&&!(r instanceof W.AcTrBatchedMesh)){if(!He(r))return;const o=rt(r.geometry);if(o.positions.length===0)return;const a=r.material,i=fe(a),{offset:s,...l}=Ue(r,o,{preserveWorldSpaceForPatternFill:!!i.hatchPattern});n.push(ht(r.geometry,a,r,l,s))}}}),{lineBatches:t,meshBatches:n}}function it(e,t){const n=e.extmin,r=e.extmax;return{title:t==null?void 0:t.title,extents:{minX:n.x,minY:n.y,maxX:r.x,maxY:r.y},units:{insunits:e.insunits,lunits:e.lunits,luprec:e.luprec,aunits:e.aunits,auprec:e.auprec,measurement:e.measurement,ltscale:e.ltscale,angbase:e.angbase,angdir:e.angdir},background:(t==null?void 0:t.background)??0}}const sr=["endpoint","midpoint","center","quadrant","intersection","nearest"];function mt(e){return e.z>=0?1:-1}const lr=1e6;function S(e,t){const n=new _.Vector3(t.x,t.y,t.z??0).applyMatrix4(e);return{x:n.x,y:n.y}}function cr(e){const t=e.elements;return new _.Matrix4(t[0],t[4],t[8],t[12],t[1],t[5],t[9],t[13],t[2],t[6],t[10],t[14],t[3],t[7],t[11],t[15])}function Se(e,t){return new _.Matrix4().multiplyMatrices(e,cr(t))}function pt(e,t){const n=new _.Vector3(t.x,t.y,t.z??0).transformDirection(e).normalize();return{x:n.x,y:n.y}}function st(e){const t=new _.Vector3(e.elements[0],e.elements[1],e.elements[2]).length(),n=new _.Vector3(e.elements[4],e.elements[5],e.elements[6]).length();return g.AcGeTol.equal(t,n,g.FLOAT_TOL*Math.max(t,n,1))}function dr(e,t){const n=e.tables.blockTable.getIdAt(t);if(n)return n;for(const o of e.tables.blockTable.newIterator())if(o.objectId===t)return o;const r=e.tables.blockTable.modelSpace;if(r.objectId===t)return r}function ur(e){if(e instanceof g.AcDbLine)return!0;const t=e;return(t.type==="LINE"||t.type==="Line")&&t.startPoint!=null&&t.endPoint!=null}function fr(e,t,n,r){te(e,t,n,r.startPoint,r.endPoint)}function Zt(e,t){return e.blockTableRecord??(e.blockName?t.tables.blockTable.getAt(e.blockName):void 0)}function gr(e,t){const n=e.dimBlockId;return n?t.tables.blockTable.getAt(n):void 0}function hr(e,t){const r=Zt(e,t);if(r)return r;const o=e.owningBlockRecordId;return o?t.tables.blockTable.getAt(o):void 0}function Xt(e){return e.getFullInsertionTransform()}function mr(e){for(const t of e.newIterator())return!0;return!1}function pr(e){return typeof e.getFullInsertionTransform=="function"&&"blockTableRecord"in e}function te(e,t,n,r,o){const a=S(n,r),i=S(n,o),s={kind:"line",layer:t,x0:a.x,y0:a.y,x1:i.x,y1:i.y};e.push(s)}function At(e,t,n,r,o,a){const i=S(n,r),s=pt(n,o),l=Math.hypot(s.x,s.y)||1,c=s.x/l,d=s.y/l,u=lr,f=a?i.x-c*u:i.x,m=a?i.y-d*u:i.y,w=i.x+c*u,p=i.y+d*u;e.push({kind:"line",layer:t,x0:f,y0:m,x1:w,y1:p})}function ie(e,t,n,r,o){if(r.length<2)return;const a=o?r.length:r.length-1;for(let i=0;i<a;i++)te(e,t,n,r[i],r[(i+1)%r.length])}function vr(e,t,n,r){const o=[r.startPosition];for(const a of r.segments)o.push(a.position);ie(e,t,n,o,r.closed)}function wr(e,t,n){if(n.vertices.length>=2)return n.vertices;if(n.vertices.length===0)return[];const r=n.vertices[0],o=t.lastLeaderLinePoint??t.landingPoint??e.landingPoint??e.contentBasePosition;if(!o)return n.vertices;const a=r.x-o.x,i=r.y-o.y,s=(r.z??0)-(o.z??0);return Math.hypot(a,i,s)<=g.FLOAT_TOL?n.vertices:[r,o]}function br(e,t,n,r){var a,i;for(const s of r.leaders)for(const l of s.leaderLines){const c=wr(r,s,l);ie(e,t,n,c,!1)}const o=s=>{if(!s)return;const l=S(n,s);e.push({kind:"point",layer:t,x:l.x,y:l.y})};o(r.contentBasePosition),o((a=r.mtextContent)==null?void 0:a.anchorPoint),o((i=r.blockContent)==null?void 0:i.position)}function xr(e,t,n,r){const o=r.numberOfVertices;if(o<2)return;const a=r.elevation,i=r.closed?o:o-1;for(let s=0;s<i;s++){const l=r.getPointAt(s),c=r.getPointAt((s+1)%o),d=r.getBulgeAt(s),u={x:l.x,y:l.y,z:a},f={x:c.x,y:c.y,z:a};if(g.AcGeTol.isPositive(Math.abs(d))){const m=S(n,u),w=S(n,f),p=new g.AcGeCircArc2d(m,w,d),x=p.center;e.push({kind:"arc",layer:t,cx:x.x,cy:x.y,r:p.radius,startAngle:p.startAngle,endAngle:p.endAngle,normalSign:p.clockwise?-1:1})}else te(e,t,n,u,f)}}function yr(e,t,n,r,o,a){const i=S(n,r),s=new _.Vector3(n.elements[0],n.elements[1],n.elements[2]).length(),l={kind:"circle",layer:t,cx:i.x,cy:i.y,r:o*s,normalSign:mt(a)};e.push(l)}function Ar(e,t,n,r){const o=S(n,r.center),a=new _.Vector3(n.elements[0],n.elements[1],n.elements[2]).length(),i={kind:"arc",layer:t,cx:o.x,cy:o.y,r:r.radius*a,startAngle:r.startAngle,endAngle:r.endAngle,normalSign:mt(r.normal)};e.push(i)}function Oe(e,t,n,r){const o=S(n,r.center),a=r._geo,i=(a==null?void 0:a.majorAxis)??{x:1,y:0,z:0},s=pt(n,i),l=Math.hypot(s.x,s.y)||1,c=new _.Vector3(n.elements[0],n.elements[1],n.elements[2]).length(),d=new _.Vector3(n.elements[4],n.elements[5],n.elements[6]).length(),u={kind:"ellipse",layer:t,cx:o.x,cy:o.y,majorX:s.x/l,majorY:s.y/l,majorR:r.majorAxisRadius*c,minorR:r.minorAxisRadius*d,startAngle:r.startAngle,endAngle:r.endAngle,closed:r.closed,normalSign:mt(r.normal)};e.push(u)}function Mr(e,t,n,r){var s,l;const o=r._geo;if(!((s=o==null?void 0:o.controlPoints)!=null&&s.length))return;const a=[];for(const c of o.controlPoints){const d=S(n,c);a.push(d.x,d.y)}const i={kind:"spline",layer:t,controlPoints:a,degree:o.degree??3,knots:[...o.knots??[]],weights:[...o.weights??[]],closed:o.closed??!1};if((l=o.fitPoints)!=null&&l.length){i.fitPoints=[];for(const c of o.fitPoints){const d=S(n,c);i.fitPoints.push(d.x,d.y)}}e.push(i)}function Sr(e,t,n,r){var l;const o=(l=r._geo)==null?void 0:l.vertices,a=o&&o.length>1?o.map(c=>({x:c.x,y:c.y,bulge:c.bulge})):Array.from({length:r.numberOfVertices},(c,d)=>{const u=r.getPoint2dAt(d);return{x:u.x,y:u.y,bulge:0}}),i=a.length;if(i<2)return;const s=r.closed?i:i-1;for(let c=0;c<s;c++){const d=a[c],u=a[(c+1)%i],f=d.bulge??0;if(g.AcGeTol.isPositive(Math.abs(f))){const m=S(n,{x:d.x,y:d.y,z:0}),w=S(n,{x:u.x,y:u.y,z:0}),p=new g.AcGeCircArc2d(m,w,f),x=p.center;e.push({kind:"arc",layer:t,cx:x.x,cy:x.y,r:p.radius,startAngle:p.startAngle,endAngle:p.endAngle,normalSign:p.clockwise?-1:1})}else te(e,t,n,{x:d.x,y:d.y,z:0},{x:u.x,y:u.y,z:0})}}function kr(e,t,n,r,o){if(st(n)){const a=S(n,{x:r.center.x,y:r.center.y,z:o}),i=new _.Vector3(n.elements[0],n.elements[1],n.elements[2]).length();e.push({kind:"arc",layer:t,cx:a.x,cy:a.y,r:r.radius*i,startAngle:r.startAngle,endAngle:r.endAngle,normalSign:r.clockwise?-1:1});return}te(e,t,n,{x:r.startPoint.x,y:r.startPoint.y,z:o},{x:r.endPoint.x,y:r.endPoint.y,z:o})}function Cr(e,t,n,r,o){const a=S(n,{x:r.center.x,y:r.center.y,z:o}),i=pt(n,{x:Math.cos(r.rotation),y:Math.sin(r.rotation),z:0}),s=Math.hypot(i.x,i.y)||1,l=new _.Vector3(n.elements[0],n.elements[1],n.elements[2]).length(),c=new _.Vector3(n.elements[4],n.elements[5],n.elements[6]).length();e.push({kind:"ellipse",layer:t,cx:a.x,cy:a.y,majorX:i.x/s,majorY:i.y/s,majorR:r.majorAxisRadius*l,minorR:r.minorAxisRadius*c,startAngle:r.startAngle,endAngle:r.endAngle,closed:!1,normalSign:r.clockwise?-1:1})}function Lr(e,t,n,r,o){var s;const a=r.numberOfVertices;if(a<2)return;const i=r.closed?a:a-1;for(let l=0;l<i;l++){const c=r.getPointAt(l),d=r.getPointAt((l+1)%a),u=((s=r.vertices[l])==null?void 0:s.bulge)??0,f={x:c.x,y:c.y,z:o},m={x:d.x,y:d.y,z:o};if(g.AcGeTol.isPositive(Math.abs(u))){const w=S(n,f),p=S(n,m),x=new g.AcGeCircArc2d(w,p,u),O=x.center;e.push({kind:"arc",layer:t,cx:O.x,cy:O.y,r:x.radius,startAngle:x.startAngle,endAngle:x.endAngle,normalSign:x.clockwise?-1:1})}else te(e,t,n,f,m)}}function Er(e,t,n,r,o){if(r instanceof g.AcGePolyline2d){Lr(e,t,n,r,o);return}if(r instanceof g.AcGeLoop2d)for(const a of r.curves)a instanceof g.AcGeLine2d?te(e,t,n,{x:a.startPoint.x,y:a.startPoint.y,z:o},{x:a.endPoint.x,y:a.endPoint.y,z:o}):a instanceof g.AcGeCircArc2d?kr(e,t,n,a,o):a instanceof g.AcGeEllipseArc2d&&Cr(e,t,n,a,o)}function Ir(e,t,n,r){var i;const o=(i=r._geo)==null?void 0:i.loops;if(!(o!=null&&o.length))return;const a=r.elevation;for(const s of o)Er(e,t,n,s,a)}function Tr(e,t,n,r){const o=Se(n,Xt(r)),a=[0];for(let c=0;c<r.numColumns;c++)a.push(a[c]+r.columnWidth(c));const i=[0];for(let c=0;c<r.numRows;c++)i.push(i[c]-r.rowHeight(c));const s=a[a.length-1],l=i[i.length-1];for(const c of i)te(e,t,o,{x:0,y:c,z:0},{x:s,y:c,z:0});for(const c of a)te(e,t,o,{x:c,y:0,z:0},{x:c,y:l,z:0})}function Br(e,t,n,r,o,a,i){const s=lt(e.layer,n);if(i&&!i(s))return;const l=hr(e,a);if(l&&!o.has(l.objectId)&&mr(l)){o.add(l.objectId);const d=Se(t,Xt(e));ke(l,d,s,r,o,a,i),o.delete(l.objectId);return}Tr(r,s,t,e);const c=S(t,e.position);r.push({kind:"point",layer:s,x:c.x,y:c.y})}function _r(e,t,n,r){let o=r.boundaryPath();if(o.length>1){const i=o[0],s=o[o.length-1];i.x===s.x&&i.y===s.y&&(i.z??0)===(s.z??0)&&(o=o.slice(0,-1))}o.length>=2&&ie(e,t,n,o,!0);const a=S(n,r.position);e.push({kind:"point",layer:t,x:a.x,y:a.y})}function lt(e,t){return e==="0"?t:e}function Pr(e,t,n,r,o,a,i){if(!e.visibility)return;const s=lt(e.layer,n);if(!(i&&!i(s))){if(e instanceof g.AcDbTable){Br(e,t,n,r,o,a,i);return}if(pr(e)){const l=Zt(e,a);if(!l||o.has(l.objectId))return;o.add(l.objectId);const c=Se(t,e.getFullInsertionTransform()),d=lt(e.layer,n);ke(l,c,d,r,o,a,i),o.delete(l.objectId);return}if(e instanceof g.AcDbDimension){const l=e,c=gr(l,a);if(!c||o.has(c.objectId))return;o.add(c.objectId);const d=Se(t,l.getFullDimBlockTransform());ke(c,d,s,r,o,a,i),o.delete(c.objectId);return}if(ur(e)){fr(r,s,t,e);return}if(e instanceof g.AcDbCircle){st(t)?yr(r,s,t,e.center,e.radius,e.normal):Oe(r,s,t,Fr(e));return}if(e instanceof g.AcDbArc){st(t)?Ar(r,s,t,e):Oe(r,s,t,zr(e));return}if(e instanceof g.AcDbEllipse){Oe(r,s,t,e);return}if(e instanceof g.AcDbSpline){Mr(r,s,t,e);return}if(e instanceof g.AcDbPolyline){Sr(r,s,t,e);return}if(e instanceof g.AcDb2dPolyline){xr(r,s,t,e);return}if(e instanceof g.AcDb3dPolyline){const l=[];for(let c=0;c<e.numberOfVertices;c++)l.push(e.getPointAt(c));ie(r,s,t,l,e.closed);return}if(e instanceof g.AcDbHatch){Ir(r,s,t,e);return}if(e instanceof g.AcDbRay){At(r,s,t,e.basePoint,e.unitDir,!1);return}if(e instanceof g.AcDbXline){At(r,s,t,e.basePoint,e.unitDir,!0);return}if(e instanceof g.AcDbTrace){const l=[e.getPointAt(0),e.getPointAt(1),e.getPointAt(2),e.getPointAt(3)];ie(r,s,t,l,!0);return}if(e instanceof g.AcDbFace){const l=e.subGetGripPoints();l.length>=2&&ie(r,s,t,l,l.length>=3);return}if(e instanceof g.AcDbLeader){const l=e.vertices;l.length>=2&&ie(r,s,t,l,!1);return}if(e instanceof g.AcDbMLine){vr(r,s,t,e);return}if(e instanceof g.AcDbMLeader){br(r,s,t,e);return}if(e instanceof g.AcDbText){const l=S(t,e.position);r.push({kind:"point",layer:s,x:l.x,y:l.y});return}if(e instanceof g.AcDbMText){const l=S(t,e.location);r.push({kind:"point",layer:s,x:l.x,y:l.y});return}if(e instanceof g.AcDbRasterImage){_r(r,s,t,e);return}if(e instanceof g.AcDbPoint){const l=S(t,e.position);r.push({kind:"point",layer:s,x:l.x,y:l.y})}}}function ke(e,t,n,r,o,a,i){for(const s of e.newIterator())Pr(s,t,n,r,o,a,i)}function Fr(e){return new g.AcDbEllipse(e.center,e.normal,{x:1,y:0,z:0},e.radius,e.radius,0,g.TAU)}function zr(e){return new g.AcDbEllipse(e.center,e.normal,{x:1,y:0,z:0},e.radius,e.radius,e.startAngle,e.endAngle)}function ct(e,t,n={}){const r=dr(e,t);if(!r)return{primitives:[]};const o=[],a=new _.Matrix4;return ke(r,a,"0",o,new Set,e,n.includeLayer),{primitives:o}}function Hr(e,t){let n=t-e;for(;n<=0;)n+=g.TAU;for(;n>g.TAU;)n-=g.TAU;return n}function Mt(e,t,n,r,o){const a=o===-1?-1:1;return new g.AcGePoint2d(e+a*n*Math.cos(r),t+n*Math.sin(r))}function Ur(e){const t=Mt(e.cx,e.cy,e.r,e.startAngle,e.normalSign),n=Mt(e.cx,e.cy,e.r,e.endAngle,e.normalSign),r=Hr(e.startAngle,e.endAngle),o=e.normalSign*Math.tan(r/4);return new g.AcGeCircArc2d(t,n,o)}function Wt(e){return e.kind==="circle"?new g.AcGeCircArc2d({x:e.cx,y:e.cy},e.r,0,g.TAU,e.normalSign===-1):Ur(e)}function Yt(e){const t=Math.atan2(e.majorY,e.majorX);return new g.AcGeEllipseArc2d({x:e.cx,y:e.cy,z:0},e.majorR,e.minorR,e.startAngle,e.endAngle,e.closed,t)}function Jt(e){const t=[];for(let n=0;n+1<e.controlPoints.length;n+=2)t.push({x:e.controlPoints[n],y:e.controlPoints[n+1],z:0});return new g.AcGeNurbsCurve(e.degree,e.knots,t,e.weights.length>0?e.weights:void 0)}function Or(e){switch(e.kind){case"line":return{kind:"line",curve:new g.AcGeLine2d({x:e.x0,y:e.y0},{x:e.x1,y:e.y1})};case"circle":case"arc":return{kind:"circArc",curve:Wt(e)};case"ellipse":return{kind:"ellipse",curve:Yt(e)};case"spline":return{kind:"spline",curve:Jt(e)};case"point":return{kind:"point",point:new g.AcGePoint2d(e.x,e.y)}}}const qt="mlcad-html-locale",St={en:{toolbar:{viewerTools:"Viewer tools",zoomExtents:"Zoom extents",measureDistance:"Measure distance",measureAngle:"Measure angle",measureArc:"Measure arc length",measureArea:"Measure area",measureCoordinate:"Measure coordinates",clearMeasurements:"Clear measurements",settings:"Measure settings",layers:"Layers",language:"Language",languageSwitch:"Switch to Chinese",collapse:"Collapse toolbar",expand:"Expand toolbar"},settings:{toolbar:"Measure settings",measureColor:"Measure color",ortho:"Toggle orthogonal mode",polar:"Polar tracking angles",polarAngles:"Polar tracking angles"},layers:{title:"Layers",close:"Close layers",showAll:"Show all",hideAll:"Hide all",zoomTo:"Zoom to {name}"},status:{ready:"Ready",measureDistanceHint:"Click two points to measure distance (object snap enabled).",measureAngleHint:"Click vertex, then two points on each arm (object snap enabled).",measureArcHint:"Click arc start, a point on the arc, then arc end (object snap enabled).",measureAreaHint:"Click polygon vertices; click near the first point or press Enter to finish.",measureCoordinateHint:"Click a point to read its X/Y coordinates (object snap enabled).",distance:"Distance: {value}",coordinates:"X: {x}  Y: {y}",angle:"Angle: {value}",arcLength:"Arc length: {value}",area:"Area: {value}",lengthTotal:"Length total: {value}",areaTotal:"Area total: {value}",zoomLayer:"Zoom: {name}",loadFailed:"Failed to load drawing: {error}",noLayout:"No layout data in snapshot."}},zh:{toolbar:{viewerTools:"查看器工具",zoomExtents:"范围缩放",measureDistance:"测量距离",measureAngle:"测量角度",measureArc:"测量弧长",measureArea:"测量面积",measureCoordinate:"测量坐标",clearMeasurements:"清除测量",settings:"测量设置",layers:"图层",language:"语言",languageSwitch:"切换到 English",collapse:"收起工具栏",expand:"展开工具栏"},settings:{toolbar:"测量设置",measureColor:"测量颜色",ortho:"切换正交模式",polar:"极轴追踪角度",polarAngles:"极轴追踪角度"},layers:{title:"图层",close:"关闭图层",showAll:"全部显示",hideAll:"全部隐藏",zoomTo:"缩放到 {name}"},status:{ready:"就绪",measureDistanceHint:"点击两点以测量距离（已启用对象捕捉）。",measureAngleHint:"依次点击顶点与两条边上的点（已启用对象捕捉）。",measureArcHint:"依次点击弧起点、弧上一点与弧端点（已启用对象捕捉）。",measureAreaHint:"依次点击多边形顶点；靠近首点或按 Enter 完成。",measureCoordinateHint:"点击一点以读取其 X/Y 坐标（已启用对象捕捉）。",distance:"距离：{value}",coordinates:"X：{x}  Y：{y}",angle:"角度：{value}",arcLength:"弧长：{value}",area:"面积：{value}",lengthTotal:"长度合计：{value}",areaTotal:"面积合计：{value}",zoomLayer:"缩放：{name}",loadFailed:"无法加载图纸：{error}",noLayout:"快照中没有布局数据。"}}};function Be(e){if(e==null||e==="")return null;const t=e.toLowerCase().replace("_","-");return t==="en"||t.startsWith("en-")?"en":t==="zh"||t.startsWith("zh")?"zh":null}function Kt(){if(typeof navigator>"u")return"en";const e=[...navigator.languages??[],navigator.language].filter(Boolean);for(const t of e){const n=Be(t);if(n==="zh")return"zh";if(n==="en")return"en"}return"en"}function Qt(){if(typeof localStorage<"u")try{const e=localStorage.getItem(qt),t=Be(e);if(t)return t}catch{}return Kt()}function kt(e,t){const n=t.split(".");let r=e;for(const o of n){if(r==null||typeof r=="string")return;r=r[o]}return typeof r=="string"?r:void 0}function Dr(e,t){return t?e.replace(/\{(\w+)\}/g,(n,r)=>{const o=t[r];return o!=null?String(o):`{${r}}`}):e}class Rr{constructor(t){this._onChange=null,this._locale=t??Qt()}get locale(){return this._locale}get localeBadge(){return this._locale==="zh"?"中":"EN"}setOnChange(t){this._onChange=t}t(t,n){const r=kt(St[this._locale],t)??kt(St.en,t)??t;return Dr(r,n)}toggleLocale(){const t=this._locale==="en"?"zh":"en";return this.setLocale(t),t}setLocale(t){var n;if(this._locale!==t){this._locale=t,typeof document<"u"&&(document.documentElement.lang=t);try{typeof localStorage<"u"&&localStorage.setItem(qt,t)}catch{}this.applyToDocument(),(n=this._onChange)==null||n.call(this)}}applyToDocument(t){if(typeof document>"u")return;const n=t??document;document.documentElement.lang=this._locale,n.querySelectorAll("[data-i18n-text]").forEach(a=>{const i=a.dataset.i18nKey;i&&(a.textContent=this.t(i))}),n.querySelectorAll("[data-i18n-attr]").forEach(a=>{var c;const i=a.dataset.i18nKey,s=((c=a.dataset.i18nAttr)==null?void 0:c.split(/\s+/))??[];if(!i||s.length===0)return;const l=this.t(i);for(const d of s)a.setAttribute(d,l)});const r=document.getElementById("mlcad-lang-badge");r&&(r.textContent=this.localeBadge);const o=document.getElementById("mlcad-lang-btn");o&&(o.setAttribute("title",this.t("toolbar.languageSwitch")),o.setAttribute("aria-label",this.t("toolbar.languageSwitch")))}}const Nr='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M9.3333 14.125 5.875 10.6667V14.125H9.3333Zm4.7917-3.4583-3.4583 3.4583H14.125V10.6667ZM10.6667 5.875 14.125 9.3333V5.875H10.6667ZM5.875 9.3333 9.3333 5.875H5.875V9.3333Zm9.2083 5.475c1.2333-1.3 1.9083-3.0333 1.9083-4.825-.0083-3.325-2.35-6.1833-5.6083-6.8417C8.125 2.4833 4.85 4.2 3.55 7.2583c-1.3 3.0583-.275 6.6083 2.4583 8.5 2.725 1.8917 6.4167 1.6 8.8167-.6917.0917-.0833.175-.175.2583-.2583Zm1.2583.5917 2.575 2.575c-.3167.3167-.625.625-.9417.9417-.8583-.8583-1.7167-1.7167-2.575-2.575-3.4083 2.9-8.4917 2.5917-11.525-.6917S.9417 7.275 4.1083 4.1083C7.2667.9417 12.3667.8417 15.65 3.875s3.5917 8.1167.6917 11.525Z"/></svg>',Vr='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M3.75 9.25h12.5v1.5H3.75v-1.5ZM2.25 6.5h1.5v7h-1.5v-7ZM16.25 6.5h1.5v7h-1.5v-7Z"/></svg>',jr='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><polygon fill="currentColor" points="5.74 7.13 7 9.5 4.15 7.72 3.2 7.12 3 7 7 4.5 6.17 6.05 5.67 7 5.74 7.13"/><polygon fill="currentColor" points="16 12.5 13.5 16.5 12.66 15.15 11.92 13.97 11 12.5 12 13.03 12.98 13.55 13.5 13.83 16 12.5"/><rect fill="currentColor" x="2" y="2.5" width="1" height="15"/><rect fill="currentColor" x="3" y="16.5" width="15" height="1"/><path fill="currentColor" d="M14,13c0,.18,0,.37,0,.55v0a6.82,6.82,0,0,1-.32,1.57l-.74-1.18L13,13.5c0-.14,0-.31,0-.47v0a6,6,0,0,0-6-6,6.74,6.74,0,0,0-1.26.13l-.29.07a5.61,5.61,0,0,0-1.3.52l-1-.6a7.07,7.07,0,0,1,2-.88,6.78,6.78,0,0,1,1-.19A7.7,7.7,0,0,1,7,6a7,7,0,0,1,7,7Z"/></svg>',Gr='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><rect fill="currentColor" x="2" y="16" width="2" height="2"/><rect fill="currentColor" x="16" y="2" width="2" height="2"/><rect fill="currentColor" x="6.1" y="6.11" width="2" height="2"/><path fill="currentColor" d="M4.99,9.11c-1.15,1.74-1.94,3.74-2.24,5.89h.81c.32-2.18,1.16-4.18,2.39-5.89h-.96Z"/><path fill="currentColor" d="M9.1,5v.96c1.71-1.23,3.72-2.07,5.9-2.4v-.81c-2.16,.3-4.16,1.09-5.9,2.24Z"/></svg>',$r='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M4 4h12v12H4V4Zm1.5 1.5v9h9v-9h-9Z"/><circle fill="currentColor" cx="4" cy="4" r="1.5"/><circle fill="currentColor" cx="16" cy="4" r="1.5"/><circle fill="currentColor" cx="4" cy="16" r="1.5"/><circle fill="currentColor" cx="16" cy="16" r="1.5"/></svg>',Zr='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M9.25 2h1.5v5.25H16v1.5h-5.25V16h-1.5v-7.25H4v-1.5h5.25V2Z"/><circle fill="currentColor" cx="10" cy="10" r="1.75"/></svg>',Xr='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>',Wr='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m434.8 137.65-149.36-68.1c-16.19-7.4-42.69-7.4-58.88 0L77.3 137.65c-17.6 8-17.6 21.09 0 29.09l148 67.5c16.89 7.7 44.69 7.7 61.58 0l148-67.5c17.52-8 17.52-21.1-.08-29.09M160 308.52l-82.7 37.11c-17.6 8-17.6 21.1 0 29.1l148 67.5c16.89 7.69 44.69 7.69 61.58 0l148-67.5c17.6-8 17.6-21.1 0-29.1l-79.94-38.47"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m160 204.48-82.8 37.16c-17.6 8-17.6 21.1 0 29.1l148 67.49c16.89 7.7 44.69 7.7 61.58 0l148-67.49c17.7-8 17.7-21.1.1-29.1L352 204.48"/></svg>',Yr='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10.09 3.53 16.09 6.97 10.09 10.29 4.18 7 10.09 3.56M10.09 2.4 2.17 7 3.31 7.65 10.09 11.45 17 7.62 18.17 7 10.08 2.37 10.09 2.4Z"/><path fill="currentColor" d="M10.25 14.83 18.17 10.22 17 9.57 10.22 13.57 3.32 9.59 2.17 10.22 10.25 14.83Z"/><path fill="currentColor" d="M10.25 17.63 18.17 13 17 12.37 10.22 16.37 3.32 12.38 2.17 13 10.25 17.63Z"/></svg>',Jr='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10.09 5.15 16.09 8.59 10.09 11.91 4.18 8.59 10.09 5.15ZM10.09 4 2.17 8.61 3.31 9.25 10.09 13.06 17 9.24 18.16 8.61 10.08 4 10.09 4Z"/><path fill="currentColor" d="M10.25 16.46 18.17 11.85 17 11.2 10.22 15.2 3.32 11.21 2.17 11.85 10.25 16.46Z"/><path fill="currentColor" d="M3.5 3.5 16.5 16.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',qr='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m18.5 10 4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301 14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725 16.676 16.676 0 0 1 3.524 17.273l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877 16.165 16.165 0 0 0 11.91 6.001L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z"/></svg>',Kr='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" aria-hidden="true"><path fill="currentColor" d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357 357 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a352 352 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357 357 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088l-24.512 11.968a294 294 0 0 0-34.816 20.096l-22.656 15.36l-116.224-25.088l-65.28 113.152l79.68 88.192l-1.92 27.136a293 293 0 0 0 0 40.192l1.92 27.136l-79.808 88.192l65.344 113.152l116.224-25.024l22.656 15.296a294 294 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152l24.448-11.904a288 288 0 0 0 34.752-20.096l22.592-15.296l116.288 25.024l65.28-113.152l-79.744-88.192l1.92-27.136a293 293 0 0 0 0-40.256l-1.92-27.136l79.808-88.128l-65.344-113.152l-116.288 24.96l-22.592-15.232a288 288 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384a192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256a128 128 0 0 0 0-256"/></svg>',Qr='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M3 2H2v16h16v-1H8v-5H3V2zm0 11v4h4v-4H3z"/></svg>',eo='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M16.98 11L18.5 11L18.5 10L16.98 10C16.86 8.13 16.05 6.44 14.8 5.2L16.88 2.83L16.12 2.17L14.05 4.54C12.79 3.57 11.21 3 9.5 3C5.36 3 2 6.36 2 10.5C2 14.64 5.36 18 9.5 18C13.47 18 16.73 14.91 16.98 11ZM15.98 10C15.86 8.43 15.18 7.01 14.14 5.95L10.6 10L15.98 10ZM13.39 5.29L8.4 11L15.98 11C15.73 14.36 12.92 17 9.5 17C5.91 17 3 14.09 3 10.5C3 6.91 5.91 4 9.5 4C10.96 4 12.31 4.48 13.39 5.29Z"/></svg>',to='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="#e75958" d="M22 12H12l5 8.66A10 10 0 0 0 22 12Z"/><path fill="#814dff" d="M17 20.66 12 12 7 20.66A10 10 0 0 0 17 20.66Z"/><path fill="#13b0ce" d="M7 20.66 12 12H2A10 10 0 0 0 7 20.66Z"/><path fill="#4ecd83" d="M2 12H12L7 3.34A10 10 0 0 0 2 12Z"/><path fill="#ffc33f" d="M7 3.34 12 12l5-8.66A10 10 0 0 0 7 3.34Z"/><path fill="#ff9543" d="M17 3.34 12 12H22A10 10 0 0 0 17 3.34Z"/></svg>',no='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 6.5 5.5 11h9L10 6.5Z"/></svg>',z={zoomExtent:Nr,measureDistance:Vr,measureAngle:jr,measureArc:Gr,measureArea:$r,measureCoordinate:Zr,clearMeasurements:Xr,layer:Wr,layerOn:Yr,layerOff:Jr,language:qr,setting:Kr,orthoMode:Qr,polarTracking:eo,color:to,chevronUp:no};function X(e,t,n){const r=Object.entries(n).map(([o,a])=>`${o}="${De(a)}"`).join(" ");return`<button type="button" class="mlcad-tool-btn" title="${De(t)}" aria-label="${De(t)}" ${r}>${e}</button>`}function De(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;")}const ro=583902,oo=[90,45,30,23,18,10,5];function ao(e){return`#${e.toString(16).padStart(6,"0")}`}function io(){const e=oo.map(t=>`<button type="button" class="mlcad-tool-btn mlcad-settings-option-btn mlcad-polar-angle-btn" data-polar-ang="${t}" title="${t}°" aria-label="${t}°"><span class="mlcad-settings-option-indicator" aria-hidden="true"></span><span class="mlcad-settings-option-text">${t}°</span></button>`).join("");return`
      <div id="mlcad-settings-wrap" hidden>
        <div id="mlcad-settings-strip" role="toolbar" data-i18n-attr="aria-label" data-i18n-key="settings.toolbar" aria-label="Measure settings">
          <button type="button" class="mlcad-tool-btn mlcad-color-btn" id="mlcad-measure-color-btn" data-i18n-key="settings.measureColor" data-i18n-attr="title aria-label" title="Measure color" aria-label="Measure color">
            ${z.color}
          </button>
          <input type="color" id="mlcad-measure-color-input" class="mlcad-color-input" value="${ao(ro)}" tabindex="-1" aria-hidden="true" />
          ${X(z.orthoMode,"Orthogonal mode",{id:"mlcad-ortho-btn","data-toggle":"ortho","data-i18n-key":"settings.ortho","data-i18n-attr":"title aria-label"})}
          ${X(z.polarTracking,"Polar tracking",{id:"mlcad-polar-btn","data-toggle":"polar","data-i18n-key":"settings.polar","data-i18n-attr":"title aria-label"})}
          <button type="button" class="mlcad-tool-btn mlcad-lang-btn" id="mlcad-lang-btn" data-i18n-key="toolbar.languageSwitch" data-i18n-attr="title aria-label" title="Switch language" aria-label="Switch language">
            ${z.language}
            <span class="mlcad-lang-badge" id="mlcad-lang-badge">EN</span>
          </button>
        </div>
        <div id="mlcad-polar-angles" role="group" data-i18n-attr="aria-label" data-i18n-key="settings.polarAngles" aria-label="Polar tracking angles" hidden>
          ${e}
        </div>
      </div>`}const so=`
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
`;function lo(e){return`
  <div id="mlcad-loading" aria-hidden="true" style="background:${e}">
    <div class="mlcad-loading-spinner"></div>
  </div>
  <div id="mlcad-root">
    <aside id="mlcad-sidebar">
      <nav id="mlcad-toolbar" data-i18n-attr="aria-label" data-i18n-key="toolbar.viewerTools" aria-label="Viewer tools">
        ${X(z.zoomExtent,"Zoom extents",{"data-action":"fit","data-i18n-key":"toolbar.zoomExtents","data-i18n-attr":"title aria-label"})}
        ${X(z.measureDistance,"Measure distance",{"data-action":"measure","data-measure-mode":"distance","data-i18n-key":"toolbar.measureDistance","data-i18n-attr":"title aria-label"})}
        ${X(z.measureAngle,"Measure angle",{"data-action":"measure","data-measure-mode":"angle","data-i18n-key":"toolbar.measureAngle","data-i18n-attr":"title aria-label"})}
        ${X(z.measureArc,"Measure arc length",{"data-action":"measure","data-measure-mode":"arc","data-i18n-key":"toolbar.measureArc","data-i18n-attr":"title aria-label"})}
        ${X(z.measureArea,"Measure area",{"data-action":"measure","data-measure-mode":"area","data-i18n-key":"toolbar.measureArea","data-i18n-attr":"title aria-label"})}
        ${X(z.measureCoordinate,"Measure coordinates",{"data-action":"measure","data-measure-mode":"coordinate","data-i18n-key":"toolbar.measureCoordinate","data-i18n-attr":"title aria-label"})}
        ${X(z.clearMeasurements,"Clear measurements",{"data-action":"clear-measurements","data-i18n-key":"toolbar.clearMeasurements","data-i18n-attr":"title aria-label"})}
        <div class="mlcad-tool-separator" aria-hidden="true"></div>
        ${X(z.layer,"Layers",{id:"mlcad-layers-btn","aria-haspopup":"dialog","aria-expanded":"false","data-i18n-key":"toolbar.layers","data-i18n-attr":"title aria-label"})}
        ${X(z.setting,"Measure settings",{id:"mlcad-settings-btn","aria-haspopup":"true","aria-expanded":"false","data-i18n-key":"toolbar.settings","data-i18n-attr":"title aria-label"})}
        <div class="mlcad-tool-separator" aria-hidden="true"></div>
        ${X(z.chevronUp,"Collapse toolbar",{id:"mlcad-toolbar-toggle","aria-expanded":"true","data-i18n-key":"toolbar.collapse","data-i18n-attr":"title aria-label"})}
      </nav>
      ${io()}
      <div id="mlcad-layer-drawer" role="dialog" data-i18n-attr="aria-label" data-i18n-key="layers.title" aria-label="Layers" hidden>
        <div class="mlcad-drawer-header">
          <span data-i18n-key="layers.title" data-i18n-text>Layers</span>
          <button type="button" class="mlcad-drawer-close" id="mlcad-layer-close" data-i18n-key="layers.close" data-i18n-attr="aria-label" aria-label="Close layers">×</button>
        </div>
        <div class="mlcad-layer-actions">
          <button type="button" class="mlcad-layer-action-btn" id="mlcad-layer-show-all">
            ${z.layerOn}<span data-i18n-key="layers.showAll" data-i18n-text>Show all</span>
          </button>
          <button type="button" class="mlcad-layer-action-btn" id="mlcad-layer-hide-all">
            ${z.layerOff}<span data-i18n-key="layers.hideAll" data-i18n-text>Hide all</span>
          </button>
        </div>
        <div id="mlcad-layer-list"></div>
      </div>
    </aside>
    <footer id="mlcad-status-bar" aria-live="polite"></footer>
  </div>`}function dt(e,t){const n=t.title??e.meta.title??"CAD Drawing",r=Rt(e),o=t.viewerRuntime,a=Nt(),i=`#${e.meta.background.toString(16).padStart(6,"0")}`;return`<!DOCTYPE html>
<html lang="${Be(e.meta.locale)??"en"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="generator" content="mlightcad-cad-html-plugin" />
  <title>${co(n)}</title>
  <style>${so}</style>
</head>
<body>
${lo(i)}
  <script id="mlcad-snapshot" type="${a}+gzip;base64">${r}<\/script>
  <script>${uo(o)}<\/script>
</body>
</html>`}function co(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function uo(e){return e.replace(/<\/script/gi,"<\\/script")}const fo=400;function ge(e={}){return{exportInvisibleLayers:e.exportInvisibleLayers!==!1,initialView:e.initialView??"fit"}}function en(e){const t=e.activeLayoutView,n=t.center,r=t.trCamera.zoom,o=Math.max(t.height,1),a=r*(2*fo)/o;return{centerX:n.x,centerY:n.y,zoom:a}}function go(){return{minX:0,minY:0,maxX:0,maxY:0,valid:!1}}function ho(e,t,n){if(t.length<3)return;const r=n[0],o=n[1];for(let a=0;a+2<t.length;a+=3){const i=yt(t[a],r),s=yt(t[a+1],o);e.valid?(i<e.minX&&(e.minX=i),i>e.maxX&&(e.maxX=i),s<e.minY&&(e.minY=s),s>e.maxY&&(e.maxY=s)):(e.minX=e.maxX=i,e.minY=e.maxY=s,e.valid=!0)}}function Ct(e,t){ho(e,t.positions,t.offset)}function mo(e){return e.valid?{minX:e.minX,minY:e.minY,maxX:e.maxX,maxY:e.maxY}:null}function po(e,t){const n=go();for(const r of e)Ct(n,r);for(const r of t)Ct(n,r);return mo(n)}class tn{build(t,n,r={}){return this.buildSync(t,n,r)}async buildAsync(t,n,r={}){await h.yieldToMain();const o=r.exportInvisibleLayers!==!1,a=o?void 0:c=>ue(t,c,o),i=it(n,{title:r.title,background:r.background}),s=[];t.layers.forEach(c=>{ue(t,c.name,o)&&s.push({name:c.name,color:c.color.RGB??16777215,visible:!c.isOff&&!c.isFrozen})});const l=[];for(const[c,d]of t.layouts){const u=[],f=[];for(const[,m]of d.layers){if(!ue(t,m.name,o))continue;const w=at(m.internalObject);u.push(...w.lineBatches),f.push(...w.meshBatches),await h.yieldToMain()}l.push({btrId:c,name:Et(n,c),isModelSpace:c===t.modelSpaceBtrId,lineBatches:u,meshBatches:f,osnap:ct(n,c,{includeLayer:a})}),await h.yieldToMain()}return{version:oe,meta:Lt(i,r,l,t.activeLayoutBtrId||t.modelSpaceBtrId),layers:s,layouts:l,activeLayoutBtrId:t.activeLayoutBtrId||t.modelSpaceBtrId}}buildSync(t,n,r){const o=r.exportInvisibleLayers!==!1,a=o?void 0:c=>ue(t,c,o),i=it(n,{title:r.title,background:r.background}),s=[];t.layers.forEach(c=>{ue(t,c.name,o)&&s.push({name:c.name,color:c.color.RGB??16777215,visible:!c.isOff&&!c.isFrozen})});const l=[];return t.layouts.forEach((c,d)=>{const u=[],f=[];for(const[,m]of c.layers){if(!ue(t,m.name,o))continue;const w=at(m.internalObject);u.push(...w.lineBatches),f.push(...w.meshBatches)}l.push({btrId:d,name:Et(n,d),isModelSpace:d===t.modelSpaceBtrId,lineBatches:u,meshBatches:f,osnap:ct(n,d,{includeLayer:a})})}),{version:oe,meta:Lt(i,r,l,t.activeLayoutBtrId||t.modelSpaceBtrId),layers:s,layouts:l,activeLayoutBtrId:t.activeLayoutBtrId||t.modelSpaceBtrId}}}function Lt(e,t,n,r){const o=n.find(s=>s.btrId===r)??n[0],a=o?po(o.lineBatches,o.meshBatches):null,i=t.initialView??"fit";return{title:e.title,createdAt:new Date().toISOString(),extents:e.extents,viewExtents:a??void 0,units:e.units,background:e.background,locale:t.locale??h.AcApI18n.currentLocale,initialView:i,viewState:i==="current"?t.viewState:void 0}}function ue(e,t,n){if(n)return!0;const r=e.layers.get(t);return r?!r.isOff&&!r.isFrozen:!0}function Et(e,t){for(const n of e.tables.blockTable.newIterator())if(n.objectId===t)return n.name;return t}const vo="./viewer-runtime.iife.js";class nn{constructor(){this._snapshotBuilder=new tn}async prepareAcTrView2dForHtmlExport(t,n={}){if(!t||!("cadScene"in t)||!t.cadScene)throw new Error("CAD scene is not available. Open a drawing before exporting to HTML.");if(!(t instanceof h.AcTrView2d))throw new Error("HTML export requires a 2D CAD view. Open a drawing before exporting.");const r=ge(n);return await t.ensureEntitiesConvertedForExport({includeInvisibleLayers:r.exportInvisibleLayers}),await h.yieldToMain(),t}async convert(t,n={},r){const o=h.AcApDocManager.instance,a=ge(n);o.showBusyIndicator();try{await h.yieldToMain();const i=o.curDocument,s=await this.prepareAcTrView2dForHtmlExport(r??o.curView,a),l=t||i.fileName||i.docTitle,c=await this._snapshotBuilder.buildAsync(s.cadScene,i.database,{title:h.getDrawingExportBaseName(l),background:s.backgroundColor,exportInvisibleLayers:a.exportInvisibleLayers,initialView:a.initialView,viewState:a.initialView==="current"?en(s):void 0});await h.yieldToMain();const d=await this.loadViewerRuntime(o.htmlViewerRuntimeUrl);await h.yieldToMain();const u=dt(c,{title:c.meta.title,viewerRuntime:d});await h.yieldToMain(),this.downloadHtml(u,h.resolveExportDownloadName(l,"html"))}finally{o.hideBusyIndicator()}}async packSnapshot(t,n){const r=h.AcApDocManager.instance;r.showBusyIndicator();try{await h.yieldToMain();const o=await this.loadViewerRuntime(r.htmlViewerRuntimeUrl);await h.yieldToMain();const a=dt(t,{title:t.meta.title,viewerRuntime:o});await h.yieldToMain(),this.downloadHtml(a,n)}finally{r.hideBusyIndicator()}}async loadViewerRuntime(t){const n=t!=null?String(t):vo,r=await fetch(n);if(!r.ok)throw new Error(`Failed to load HTML viewer runtime from "${n}" (${r.status}). Build @mlightcad/cad-html-plugin and copy viewer-runtime.iife.js to your app assets.`);return r.text()}downloadHtml(t,n){const r=new Blob([t],{type:"text/html;charset=utf-8"}),o=URL.createObjectURL(r),a=document.createElement("a");a.href=o,a.download=n,document.body.appendChild(a),a.click(),document.body.removeChild(a),window.setTimeout(()=>URL.revokeObjectURL(o),6e4)}}class rn extends h.AcEdCommand{async execute(t){const n=await this.promptOptions();if(!n)return;await new nn().convert(t.doc.fileName||t.doc.docTitle,n,t.view)}async promptOptions(){const t=await this.promptExportInvisibleLayers();if(t===void 0)return;const n=await this.promptInitialView();if(n!==void 0)return ge({exportInvisibleLayers:t,initialView:n})}async promptExportInvisibleLayers(){const t=ge(),n=t.exportInvisibleLayers?"Yes":"No",r=new h.AcEdPromptKeywordOptions(`${h.AcApI18n.t("jig.chtml.exportInvisibleLayers")} <${n}>`);r.allowNone=!0;const o=r.keywords.add(h.AcApI18n.t("jig.chtml.keywords.yes.display"),h.AcApI18n.t("jig.chtml.keywords.yes.global"),h.AcApI18n.t("jig.chtml.keywords.yes.local")),a=r.keywords.add(h.AcApI18n.t("jig.chtml.keywords.no.display"),h.AcApI18n.t("jig.chtml.keywords.no.global"),h.AcApI18n.t("jig.chtml.keywords.no.local"));r.keywords.default=t.exportInvisibleLayers?o:a;const i=await h.AcApDocManager.instance.editor.getKeywords(r);if(i.status!==h.AcEdPromptStatus.Cancel){if(i.status===h.AcEdPromptStatus.None)return t.exportInvisibleLayers;if(i.status===h.AcEdPromptStatus.OK||i.status===h.AcEdPromptStatus.Keyword)return i.stringResult?i.stringResult==="Yes":t.exportInvisibleLayers}}async promptInitialView(){const t=ge(),n=t.initialView==="current"?h.AcApI18n.t("jig.chtml.keywords.current.global"):h.AcApI18n.t("jig.chtml.keywords.extents.global"),r=new h.AcEdPromptKeywordOptions(`${h.AcApI18n.t("jig.chtml.initialView")} <${n}>`);r.allowNone=!0;const o=r.keywords.add(h.AcApI18n.t("jig.chtml.keywords.extents.display"),h.AcApI18n.t("jig.chtml.keywords.extents.global"),h.AcApI18n.t("jig.chtml.keywords.extents.local")),a=r.keywords.add(h.AcApI18n.t("jig.chtml.keywords.current.display"),h.AcApI18n.t("jig.chtml.keywords.current.global"),h.AcApI18n.t("jig.chtml.keywords.current.local"));r.keywords.default=t.initialView==="current"?a:o;const i=await h.AcApDocManager.instance.editor.getKeywords(r);if(i.status!==h.AcEdPromptStatus.Cancel){if(i.status===h.AcEdPromptStatus.None)return t.initialView;if(i.status===h.AcEdPromptStatus.OK||i.status===h.AcEdPromptStatus.Keyword)return i.stringResult?i.stringResult==="Current"?"current":"fit":t.initialView}}}class wo{constructor(){this.name="HtmlPlugin",this.version="1.0.0",this.description="HTML export (chtml) command",this.registeredCommands=[]}onLoad(t,n){const r=h.AcEdCommandStack.SYSTEMT_COMMAND_GROUP_NAME;n.addCommand(r,"chtml","chtml",new rn),this.registeredCommands.push({group:r,name:"chtml"})}onUnload(t,n){for(const r of this.registeredCommands)n.removeCmd(r.group,r.name);this.registeredCommands=[]}}async function bo(){return new wo}const xo="viewer-runtime.iife.js";exports.HTML_PLUGIN_NAME=It.HTML_PLUGIN_NAME;exports.HTML_PLUGIN_TRIGGERS=It.HTML_PLUGIN_TRIGGERS;exports.ACEX_DEFAULT_OSNAP_MODES=sr;exports.ACEX_SNAPSHOT_VERSION=oe;exports.AcApExportHtmlCmd=rn;exports.AcApHtmlConvertor=nn;exports.AcApHtmlSnapshotBuilder=tn;exports.AcExHtmlI18n=Rr;exports.HTML_VIEWER_RUNTIME_FILE=xo;exports.buildOsnapCatalog=ct;exports.buildViewerMetadata=it;exports.captureAcApHtmlViewState=en;exports.circleOrArcToAcGe=Wt;exports.collectBatchesFromObject3D=at;exports.createHtmlPlugin=bo;exports.decodeSnapshot=Rn;exports.decodeSnapshotBinary=Dt;exports.detectAcExHtmlLocale=Qt;exports.detectBrowserAcExHtmlLocale=Kt;exports.ellipseToAcGe=Yt;exports.encodeSnapshot=Rt;exports.encodeSnapshotBinary=Ot;exports.exportActiveBatchedLine2Slice=Gt;exports.exportActiveBatchedSlice=Ie;exports.exportBufferGeometrySlice=rt;exports.packHtml=dt;exports.primitiveToAcGeCurve=Or;exports.resolveAcApHtmlExportOptions=ge;exports.resolveAcExHtmlLocale=Be;exports.snapshotMimeType=Nt;exports.splineToAcGe=Jt;
