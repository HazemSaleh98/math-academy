'use strict';
/* ================= Math Academy (DOM overlay) =================
   5 levels: Numbers & Place Value, Add & Subtract, Multiply, Divide, Fractions & Real Life.
   Two languages (ar / en) with separate progress. Concept pages, practice (hints), quiz (stars). */
var MathAcademy = (function () {
    var root = null, css = false, LG = 'ar';
    function tx(a, e) { return LG === 'en' ? e : a; }
    function r(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
    function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = r(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function PN(i) { return tx(['آحاد', 'عشرات', 'مئات'], ['ones', 'tens', 'hundreds'])[i] || tx('آلاف', 'thousands'); }
    var COL = ['#22C55E', '#2DA8FF', '#FF9F43'];
    function dig(n, i) { return Math.floor(n / Math.pow(10, i)) % 10; }
    function len(n) { return String(n).length; }
    function B(n) { return '<span class="big" dir="ltr">' + n + '</span>'; }

    /* ---------- visuals ---------- */
    function blocks(n) {
        var h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, o = n % 10, s = '<div class="mb">', i;
        if (h) { s += '<div class="mbg"><div class="mbl" style="color:' + COL[2] + '">' + h + ' ' + PN(2) + '</div><div class="mbr">'; for (i = 0; i < h; i++) s += '<i class="bh"></i>'; s += '</div></div>'; }
        if (t) { s += '<div class="mbg"><div class="mbl" style="color:' + COL[1] + '">' + t + ' ' + PN(1) + '</div><div class="mbr">'; for (i = 0; i < t; i++) s += '<i class="bt"></i>'; s += '</div></div>'; }
        if (o) { s += '<div class="mbg"><div class="mbl" style="color:' + COL[0] + '">' + o + ' ' + PN(0) + '</div><div class="mbr">'; for (i = 0; i < o; i++) s += '<i class="bo"></i>'; s += '</div></div>'; }
        return s + '</div>';
    }
    function placeTable(n) {
        var L = len(n), s = '<div class="pt" dir="ltr">';
        for (var i = Math.max(L, 2) - 1; i >= 0; i--) s += '<div class="ptc"><div class="pth" style="background:' + COL[i] + '">' + PN(i) + '</div><div class="ptd" style="color:' + COL[i] + '">' + (i < L ? dig(n, i) : 0) + '</div></div>';
        return s + '</div>';
    }
    function work(a, b, op) {
        var L = Math.max(len(a), len(b)) + (op === '+' ? 1 : 0), res = [], car = [], steps = [], c = 0, i;
        if (op === '+') {
            for (i = 0; i < L; i++) {
                var da = dig(a, i), db = dig(b, i), sum = da + db + c;
                if (i >= L - 1 && !sum && !c) { break; }
                var wr = sum % 10, nc = sum >= 10 ? 1 : 0;
                steps.push('<b style="color:' + COL[Math.min(i, 2)] + '">' + PN(i) + ':</b> ' + da + ' + ' + db + (c ? ' + ' + c + tx(' (المحمول)', ' (carried)') : '') + ' = ' + sum + (nc ? tx(' ← نكتب <b>' + wr + '</b> ونحمل <b>1</b> للعمود اللي جنبه', ' → write <b>' + wr + '</b> and carry <b>1</b> to the next column') : tx(' ← نكتب <b>' + wr + '</b>', ' → write <b>' + wr + '</b>')));
                res.push(wr); car.push(nc); c = nc;
            }
        } else {
            var bor = 0;
            for (i = 0; i < L; i++) {
                var xa = dig(a, i) - bor, xb = dig(b, i), nb = 0;
                if (i >= len(a)) break;
                var txt = '<b style="color:' + COL[Math.min(i, 2)] + '">' + PN(i) + ':</b> ';
                if (xa < xb) { nb = 1; txt += tx(xa + ' أقل من ' + xb + '، فنستلف 1 من العمود اللي جنبه ← ' + (xa + 10) + ' − ' + xb + ' = <b>' + (xa + 10 - xb) + '</b>', xa + ' is smaller than ' + xb + ', so borrow 1 from the next column → ' + (xa + 10) + ' − ' + xb + ' = <b>' + (xa + 10 - xb) + '</b>'); xa += 10; }
                else txt += xa + ' − ' + xb + ' = <b>' + (xa - xb) + '</b>' + (bor ? tx(' (بعد ما استلفنا منه 1)', ' (after lending 1)') : '');
                steps.push(txt); res.push(xa - xb); car.push(nb); bor = nb;
            }
        }
        return { res: res, car: car, steps: steps, L: res.length };
    }
    function col(a, b, op, upto, w) {
        w = w || work(a, b, op);
        var L = Math.max(w.L, len(a), len(b)), s = '<div class="col" dir="ltr">', i;
        s += '<div class="cr cc">'; for (i = L - 1; i >= 0; i--) { var m = (op === '+') ? (i > 0 && i - 1 < upto && w.car[i - 1]) : (i < upto && w.car[i]); s += '<span>' + (m ? (op === '+' ? '1' : '−1') : '') + '</span>'; } s += '</div>';
        s += '<div class="cr"><span class="op"></span>'; for (i = L - 1; i >= 0; i--) s += '<span>' + (i < len(a) ? dig(a, i) : '') + '</span>'; s += '</div>';
        s += '<div class="cr"><span class="op">' + op + '</span>'; for (i = L - 1; i >= 0; i--) s += '<span>' + (i < len(b) ? dig(b, i) : '') + '</span>'; s += '</div><div class="cl"></div>';
        s += '<div class="cr ans"><span class="op"></span>'; for (i = L - 1; i >= 0; i--) s += '<span style="color:' + COL[Math.min(i, 2)] + '">' + (i < upto && i < w.L ? w.res[i] : '') + '</span>'; s += '</div></div>';
        return s;
    }
    function arr(n, m) { var s = '<div class="ar" style="grid-template-columns:repeat(' + m + ',16px)" dir="ltr">'; for (var i = 0; i < n * m; i++) s += '<i></i>'; return s + '</div>'; }
    function tbl(n) { var s = '<div class="tb" dir="ltr">'; for (var m = 1; m <= 12; m++) s += '<div><span>' + n + ' × ' + m + '</span><b>' + (n * m) + '</b></div>'; return s + '</div>'; }
    function skip(n, k) { var a = []; for (var i = 1; i <= k; i++) a.push(n * i); return '<div class="sk" dir="ltr">' + a.map(function (x) { return '<span>' + x + '</span>'; }).join('<em>›</em>') + '</div>'; }
    function dots(n, c) { var s = '<div class="mb" dir="ltr">'; for (var i = 0; i < n; i++) s += '<i class="bo" style="' + (c ? 'background:' + c : '') + '"></i>'; return s + '</div>'; }
    function say(a, e, g) { return '<div class="say">' + (LG === 'en' ? e + ((g == null ? a : g) === e ? '' : '<span class="gl">' + (g == null ? a : g) + '</span>') : a) + '</div>'; }
    function stp(h) { return '<div class="stp" dir="ltr">' + h + '</div>'; }

    /* ---------- number line (animated) ---------- */
    var NLID = 0;
    function nline(lo, hi, o) {
        o = o || {}; var id = 'nl' + (++NLID), W = 340, pad = 18, n = hi - lo, st = (W - 2 * pad) / n, s = '<div class="nlw" id="' + id + '" data-lo="' + lo + '" data-hi="' + hi + '" data-s="' + (o.start != null ? o.start : '') + '" data-e="' + (o.end != null ? o.end : '') + '" data-auto="' + (o.auto ? 1 : 0) + '"><svg viewBox="0 0 ' + W + ' 96" width="100%" style="direction:ltr;overflow:visible">';
        function X(v) { return pad + (v - lo) * st; }
        s += '<rect x="' + (pad - 8) + '" y="66" width="' + (W - 2 * pad + 16) + '" height="10" rx="5" fill="url(#nlg)"/><defs><linearGradient id="nlg" x1="0" x2="1"><stop offset="0" stop-color="#6C4DF6"/><stop offset="1" stop-color="#2DA8FF"/></linearGradient></defs>';
        for (var v = lo; v <= hi; v++) { s += '<rect x="' + (X(v) - 1.5) + '" y="62" width="3" height="18" rx="1.5" fill="#fff"/>'; if (n <= 14 || v % 5 === 0) s += '<text x="' + X(v) + '" y="94" font-size="' + (n > 14 ? 11 : 14) + '" text-anchor="middle" font-weight="900" fill="#2B2350" class="nlt" data-v="' + v + '">' + v + '</text>'; }
        s += '<g class="nla"></g><g class="nlp"></g>';
        if (o.start != null) s += '<g class="nlf"><rect x="' + (X(o.start) - 2) + '" y="30" width="3" height="36" fill="#22C55E"/><path d="M' + (X(o.start) + 1) + ' 30 l16 6 l-16 6z" fill="#22C55E"/></g>';
        if (o.mark != null) s += '<circle cx="' + X(o.mark) + '" cy="71" r="10" fill="#FFC83D" stroke="#fff" stroke-width="3"/>';
        s += '</svg>';
        if (o.start != null) s += '<img class="nlm" src="mike/green_stand.png" alt="" style="left:' + ((X(o.start) / W) * 100) + '%"><div class="nlc"></div>';
        return s + '</div>';
    }
    /* run hops on every .nlw with data-s/data-e inside container; returns when done */
    function nlRun(box, done, fast) {
        var w = box.querySelector('.nlw'); if (!w || w.getAttribute('data-s') === '') { if (done) done(); return; }
        if (w._run) return; w._run = 1;
        var lo = +w.dataset.lo, hi = +w.dataset.hi, s = +w.dataset.s, e = +w.dataset.e, W = 340, pad = 18, st = (W - 2 * pad) / (hi - lo), m = w.querySelector('.nlm'), c = w.querySelector('.nlc'), arcs = w.querySelector('.nla'), pts = w.querySelector('.nlp'), d = e > s ? 1 : -1, k = 0, cur = s, gone = scr;
        function X(v) { return pad + (v - lo) * st; }
        function step() {
            if (gone !== scr || !w.isConnected) return;
            if (cur === e) { pts.insertAdjacentHTML('beforeend', '<circle cx="' + X(e) + '" cy="71" r="13" fill="#FFC83D" stroke="#fff" stroke-width="4"/>'); m.className = 'nlm win'; c.innerHTML = tx('وصلنا عند ', 'We land on ') + '<b>' + e + '</b> ⭐'; emojify(c); try { SFX.play('chime'); } catch (x) {} if (done) done(); return; }
            var nx = cur + d; k++; m.className = 'nlm hop'; m.style.left = (((X(cur) + X(nx)) / 2) / W * 100) + '%';
            arcs.insertAdjacentHTML('beforeend', '<path d="M' + X(cur) + ' 64 Q' + ((X(cur) + X(nx)) / 2) + ' 26 ' + X(nx) + ' 64" stroke="' + (d > 0 ? '#2DA8FF' : '#FF5C7A') + '" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="3 6"/>');
            setTimeout(function () { m.style.left = (X(nx) / W * 100) + '%'; pts.insertAdjacentHTML('beforeend', '<circle cx="' + X(nx) + '" cy="71" r="8" fill="#fff" stroke="' + (d > 0 ? '#2DA8FF' : '#FF5C7A') + '" stroke-width="4"/>'); c.textContent = k; cur = nx; var tt = w.querySelector('.nlt[data-v="' + nx + '"]'); if (tt) tt.style.fill = '#6C4DF6'; setTimeout(step, fast ? 180 : 330); }, fast ? 200 : 330);
        }
        setTimeout(step, 500);
    }
    function hopsTxt(plus) { return plus ? tx('لليمين ➡️', 'to the right ➡️') : tx('لليسار ⬅️', 'to the left ⬅️'); }
    function genNL() {
        var plus = r(0, 1), n = r(2, 6), s = plus ? r(0, 20 - n) : r(n, 20), e = plus ? s + n : s - n, lo = Math.max(0, Math.min(s, e) - 2), hi = Math.min(20, Math.max(s, e) + 2);
        return { html: tx('على خط الأعداد: ابدأ من ' + B(s) + ' واقفز <b>' + n + '</b> خطوات ' + hopsTxt(plus) + '. هتوصل لإيه؟', 'On the number line: start at ' + B(s) + ' and hop <b>' + n + '</b> steps ' + hopsTxt(plus) + '. Where do you land?'), vis: nline(lo, hi, { mark: s }), ans: e,
            exp: nline(lo, hi, { start: s, end: e, auto: 1 }) + say(s + (plus ? ' + ' : ' − ') + n + ' = ' + e, s + (plus ? ' + ' : ' − ') + n + ' = ' + e), nlSeg: { s: s, n: n, plus: plus } };
    }

    /* ---------- generators ---------- */
    function genAdd(o) {
        for (var k = 0; k < 400; k++) {
            var a = r(o.a[0], o.a[1]), b = r(o.b[0], o.b[1]), s = a + b;
            if (s > (o.max || 900)) continue;
            var cr = false; for (var i = 0; i < 3; i++) if (dig(a, i) + dig(b, i) >= 10) cr = true;
            if (o.carry === 'no' && cr) continue; if (o.carry === 'yes' && !cr) continue;
            if (o.min && s < o.min) continue;
            return { a: a, b: b, op: '+', ans: s };
        }
        return { a: 12, b: 13, op: '+', ans: 25 };
    }
    function genSub(o) {
        for (var k = 0; k < 400; k++) {
            var a = r(o.a[0], o.a[1]), b = r(o.b[0], o.b[1]);
            if (b > a) continue; if (a > (o.max || 900)) continue;
            var bw = false; for (var i = 0; i < 3; i++) if (dig(a, i) < dig(b, i)) bw = true;
            if (o.carry === 'no' && bw) continue; if (o.carry === 'yes' && !bw) continue;
            return { a: a, b: b, op: '−', ans: a - b };
        }
        return { a: 25, b: 12, op: '−', ans: 13 };
    }
    function genMul(o) {
        var a, b;
        if (o.tbl) { a = o.tbl; b = r(o.tbl === 1 ? 0 : 1, 12); if (r(0, 1)) { var t = a; a = b; b = t; } }
        else if (o.mix) { a = r(2, 12); b = r(2, 12); }
        else if (o.big) { for (var k = 0; k < 300; k++) { a = r(12, 99); b = r(2, 9); if (a * b <= 900) break; } }
        else { a = r(2, 90); b = pk([10, 100]); if (b === 100) a = r(1, 9); if (a * b > 900) a = r(1, 9); if (r(0, 1)) { var u = a; a = b; b = u; } }
        return { a: a, b: b, op: '×', ans: a * b };
    }
    function genDiv(o) {
        var b = o.tbl || r(2, 12), q = r(o.q0 == null ? 1 : o.q0, o.q1 || 12), a = b * q;
        if (o.mix) { b = r(2, 12); q = r(1, 12); a = b * q; }
        return { a: a, b: b, op: '÷', ans: q };
    }
    function genPV(kind) {
        var n, t;
        if (kind === 1) {
            n = r(11, 99); t = r(0, 3);
            if (t === 0) return { html: tx('كام <b>عشرة</b> في العدد ' + B(n) + '؟', 'How many <b>tens</b> are in ' + B(n) + '?'), vis: blocks(n), ans: dig(n, 1), exp: blocks(n) + placeTable(n) + say('رقم العشرات هو ' + dig(n, 1), 'The tens digit is ' + dig(n, 1)) };
            if (t === 1) return { html: tx('إيه رقم <b>الآحاد</b> في ' + B(n) + '؟', 'What is the <b>ones</b> digit in ' + B(n) + '?'), vis: placeTable(n), ans: dig(n, 0), exp: say('الآحاد هي الرقم اللي على اليمين: ' + dig(n, 0), 'The ones digit is the digit on the right: ' + dig(n, 0)) };
            if (t === 2) return { html: tx(B(dig(n, 1)) + ' عشرات و ' + B(dig(n, 0)) + ' آحاد = ؟', B(dig(n, 1)) + ' tens and ' + B(dig(n, 0)) + ' ones = ?'), vis: blocks(n), ans: n, exp: blocks(n) + placeTable(n) };
            return { html: tx('قيمة الرقم ' + '<span class="big" style="color:' + COL[1] + '">' + dig(n, 1) + '</span> في العدد ' + B(n) + ' هي؟', 'What is the value of the digit <span class="big" style="color:' + COL[1] + '">' + dig(n, 1) + '</span> in ' + B(n) + '?'), vis: placeTable(n), ans: dig(n, 1) * 10, exp: say(dig(n, 1) + ' عشرات = ' + dig(n, 1) * 10, dig(n, 1) + ' tens = ' + dig(n, 1) * 10) };
        }
        n = r(101, 900); var h = dig(n, 2), te = dig(n, 1), o = dig(n, 0), t2 = r(0, 3);
        if (t2 === 0) return { html: tx('كام <b>مية</b> في العدد ' + B(n) + '؟', 'How many <b>hundreds</b> are in ' + B(n) + '?'), vis: placeTable(n), ans: h, exp: placeTable(n) + say('رقم المئات هو ' + h, 'The hundreds digit is ' + h) };
        if (t2 === 1) return { html: tx(h + ' مئات + ' + te + ' عشرات + ' + o + ' آحاد = ؟', h + ' hundreds + ' + te + ' tens + ' + o + ' ones = ?'), vis: blocks(n), ans: n, exp: blocks(n) + say(h * 100 + ' + ' + te * 10 + ' + ' + o + ' = ' + n, h * 100 + ' + ' + te * 10 + ' + ' + o + ' = ' + n) };
        if (t2 === 2) { var p = pk([0, 1, 2]); return { html: tx('قيمة الرقم ' + '<span class="big" style="color:' + COL[p] + '">' + dig(n, p) + '</span> في العدد ' + B(n) + ' هي؟', 'What is the value of the digit <span class="big" style="color:' + COL[p] + '">' + dig(n, p) + '</span> in ' + B(n) + '?'), vis: placeTable(n), ans: dig(n, p) * Math.pow(10, p), exp: say(PN(p) + ': ' + dig(n, p) + ' × ' + Math.pow(10, p) + ' = ' + dig(n, p) * Math.pow(10, p), PN(p) + ': ' + dig(n, p) + ' × ' + Math.pow(10, p) + ' = ' + dig(n, p) * Math.pow(10, p)) }; }
        return { html: B(h * 100 + ' + ' + te * 10 + ' + ' + o) + ' = ?', vis: '', ans: n, exp: placeTable(n) + say('ندمج: ' + n, 'Put it together: ' + n) };
    }
    function qFrom(op, a, b, ans) {
        var exp, ex2 = '';
        if (op === '×') {
            if (a === 0 || b === 0) exp = say('صفر مرات من أي حاجة = <b>0</b>', 'Zero times anything = <b>0</b>');
            else if (a === 1 || b === 1) exp = say('مرة واحدة بس! العدد بيفضل زي ما هو: ' + a + ' × ' + b + ' = ' + ans, 'Only one group! The number stays the same: ' + a + ' × ' + b + ' = ' + ans);
            else if (a <= 12 && b <= 12) exp = say(a + ' × ' + b + ' = ' + ans, a + ' × ' + b + ' = ' + ans) + arr(Math.min(a, b), Math.max(a, b)) + skip(Math.min(a, b), Math.max(a, b));
            else if (a % 10 === 0 || b % 10 === 0 || a === 100 || b === 100) exp = say('الضرب في ' + (a > b ? b : a) + ': نضيف أصفار. ' + a + ' × ' + b + ' = ' + ans, 'Times ' + (a > b ? b : a) + ': add zeros. ' + a + ' × ' + b + ' = ' + ans);
            else { var big = Math.max(a, b), sm = Math.min(a, b), tn = Math.floor(big / 10) * 10, on = big % 10; exp = say('نفصّل: ' + big + ' = ' + tn + ' + ' + on, 'Split: ' + big + ' = ' + tn + ' + ' + on) + stp(tn + ' × ' + sm + ' = ' + tn * sm + ' , ' + on + ' × ' + sm + ' = ' + on * sm) + stp(tn * sm + ' + ' + on * sm + ' = <b>' + ans + '</b>'); }
        } else if (op === '÷') {
            exp = say(b + ' × ؟ = ' + a + ' ← ' + b + ' × ' + ans + ' = ' + a, b + ' × ? = ' + a + ' → ' + b + ' × ' + ans + ' = ' + a) + arr(b, ans) + say('القسمة هي عكس الضرب', 'Division is the opposite of multiplication');
        } else {
            var w = work(a, b, op); exp = col(a, b, op, w.L, w) + '<div class="stp">' + w.steps.join('<br>') + '</div>';
        }
        return { html: '<span class="big" dir="ltr">' + a + ' ' + op + ' ' + b + ' = ?</span>', vis: '', ans: ans, exp: exp, ops: { a: a, b: b, op: op } };
    }
    function mk(gen, o) { return function () { if (gen === 'pv') return genPV(o); var q = gen === 'add' ? genAdd(o) : gen === 'sub' ? genSub(o) : gen === 'div' ? genDiv(o) : genMul(o); return qFrom(q.op, q.a, q.b, q.ans); }; }


    /* ---------- new skills: generators ---------- */
    function cmpSym(a, b) { return a > b ? '>' : a < b ? '<' : '='; }
    var SYM = ['<', '>', '='];
    function genCmp(maxv, eq) {
        var a = r(1, maxv), b = r(1, maxv); if (eq && r(0, 4) === 0) b = a; else while (b === a) b = r(1, maxv);
        var s = cmpSym(a, b);
        return { html: tx('حط العلامة الصح: ' + B(a + ' ؟ ' + b), 'Choose the right sign: ' + B(a + ' ? ' + b)), vis: (maxv <= 20 ? '<div class="cmp" dir="ltr"><div>' + dots(a) + '</div><div>' + dots(b, '#FF9F43') + '</div></div>' : '') + '<div class="cmpn" dir="ltr"><b>&gt;</b> ' + tx('أكبر من', 'greater than') + ' &nbsp; <b>&lt;</b> ' + tx('أصغر من', 'less than') + ' &nbsp; <b>=</b> ' + tx('يساوي', 'equal') + '</div>', opts: ['<', '>', '='], ans: s,
            exp: say(a + ' ' + tx('و', 'and') + ' ' + b + ': ' + (s === '=' ? tx('نفس العدد', 'the same number') : (s === '>' ? a : b) + tx(' أكبر', ' is bigger')), a + ' vs ' + b + ': ' + (s === '=' ? 'the same number' : (s === '>' ? a : b) + ' is bigger')) + say(tx('نقارن المئات الأول، وبعدين العشرات، وبعدين الآحاد', 'Compare hundreds first, then tens, then ones'), 'Compare hundreds first, then tens, then ones'), cmp: [a, b] };
    }
    function genCmp3() { var a = r(101, 900), b = a, t = pk([0, 1, 2]); if (t === 0) b = a + r(1, 9); else if (t === 1) b = a + 10 * r(1, 8); else b = a + 100 * r(1, 3); if (b > 999) b = a - 10; if (r(0, 1)) { var x = a; a = b; b = x; } var s = cmpSym(a, b);
        return { html: tx('حط العلامة الصح: ' + B(a + ' ؟ ' + b), 'Choose the right sign: ' + B(a + ' ? ' + b)), vis: '<div class="cmp3" dir="ltr">' + placeTable(a) + placeTable(b) + '</div>', opts: ['<', '>', '='], ans: s, exp: say('نبدأ بالمئات: ' + dig(a, 2) + ' و ' + dig(b, 2) + (dig(a, 2) === dig(b, 2) ? '، نفس الرقم، نكمل للعشرات' : ''), 'Start with hundreds: ' + dig(a, 2) + ' and ' + dig(b, 2) + (dig(a, 2) === dig(b, 2) ? ', the same, so check the tens' : '')) + say(a + ' ' + s + ' ' + b, a + ' ' + s + ' ' + b), cmp: [a, b] }; }
    function genOrder() {
        var big = r(0, 1), set = {}, v = []; while (v.length < 3) { var x = r(11, 99) + (r(0, 1) ? 100 * r(0, 8) : 0); if (!set[x]) { set[x] = 1; v.push(x); } }
        var ans = big ? Math.max.apply(null, v) : Math.min.apply(null, v), srt = v.slice().sort(function (a, b) { return a - b; });
        return { html: tx('أنهي عدد هو الأ' + (big ? 'كبر' : 'صغر') + '؟', 'Which number is the <b>' + (big ? 'biggest' : 'smallest') + '</b>?') + '<div class="sk" dir="ltr" style="margin-top:8px">' + v.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>', vis: '', ans: ans, opts: v.map(String).concat([]), exp: say('نرتبهم من الأصغر للأكبر: ' + srt.join(' ‹ '), 'Order them from smallest to biggest: ' + srt.join(' < ')) + say(tx('الأصغر على الشمال والأكبر على اليمين', 'Smallest first, biggest last'), 'Smallest first, biggest last') };
    }
    function genEO() { var n = r(2, 99), ev = n % 2 === 0;
        return { html: tx('العدد ' + B(n) + ' زوجي ولا فردي؟', 'Is ' + B(n) + ' <b>even</b> or <b>odd</b>?'), vis: '', opts: ['even', 'odd'], optLbl: { even: tx('زوجي', 'Even'), odd: tx('فردي', 'Odd') }, ans: ev ? 'even' : 'odd',
            exp: say('بنبص على رقم الآحاد (' + dig(n, 0) + '). لو 0 أو 2 أو 4 أو 6 أو 8 يبقى زوجي، غير كده فردي.', 'Look at the ones digit (' + dig(n, 0) + '). 0, 2, 4, 6, 8 means even; anything else is odd.') }; }
    function genSkip() { var st = pk([2, 5, 10, 3, 4, 100]), k = r(2, 4), a = st === 100 ? r(1, 4) * 100 : st * r(1, 6), seq = []; for (var i = 0; i < 4; i++) seq.push(a + st * i);
        var hole = r(1, 3), ans = seq[hole], sh = seq.map(function (x, i) { return i === hole ? '؟' : x; });
        return { html: tx('كمّل العدّ بالـ' + st + ': ', 'Skip count by ' + st + ': ') + '<div class="sk" dir="ltr" style="margin-top:8px">' + sh.map(function (x) { return '<span>' + x + '</span>'; }).join('<em>›</em>') + '</div>', vis: '', ans: ans, exp: say('كل مرة بنزود ' + st, 'Each step adds ' + st) + skip2(seq) }; }
    function skip2(a) { return '<div class="sk" dir="ltr">' + a.map(function (x) { return '<span>' + x + '</span>'; }).join('<em>›</em>') + '</div>'; }
    function genRound() { var n = r(11, 98); while (n % 10 === 0) n = r(11, 98); var ans = Math.round(n / 10) * 10, up = n % 10 >= 5;
        return { html: tx('قرّب ' + B(n) + ' لأقرب عشرة', 'Round ' + B(n) + ' to the nearest ten'), vis: nline(Math.floor(n / 10) * 10, Math.floor(n / 10) * 10 + 10, { mark: n }), ans: ans, exp: say(tx('رقم الآحاد ' + dig(n, 0) + (up ? ' (5 أو أكتر) يبقى نطلع لفوق' : ' (أقل من 5) يبقى ننزل لتحت'), 'The ones digit is ' + dig(n, 0) + (up ? ' (5 or more) so round up' : ' (less than 5) so round down')), 'The ones digit is ' + dig(n, 0) + (up ? ' (5 or more) so round up' : ' (less than 5) so round down')) + say(n + ' ≈ ' + ans, n + ' ≈ ' + ans) }; }
    function genCount20() { var n = r(3, 20);
        return { html: tx('عدّ النقط. كام نقطة؟', 'Count the dots. How many?'), vis: dots(n), ans: n, exp: say('نعد واحدة واحدة: ' + Array.apply(null, Array(n)).map(function (_, i) { return i + 1; }).join('، '), 'Count one by one: ' + Array.apply(null, Array(n)).map(function (_, i) { return i + 1; }).join(', ')) }; }
    function genBond(m) { m = m || 10; var a = r(0, m), ans = m - a;
        return { html: B(a + ' + ? = ' + m), vis: '<div class="mb" dir="ltr">' + (function () { var s = ''; for (var i = 0; i < m; i++) s += '<i class="bo" style="' + (i < a ? '' : 'background:#FF9F43') + '"></i>'; return s; })() + '</div>', ans: ans, exp: say(a + ' + ' + ans + ' = ' + m, a + ' + ' + ans + ' = ' + m) + say(tx('الأخضر ' + a + ' والبرتقالي ' + ans, 'Green ' + a + ' and orange ' + ans), 'Green ' + a + ' and orange ' + ans) }; }
    function genExp2() { var n = r(11, 99), t = r(0, 1), te = dig(n, 1) * 10, o = dig(n, 0);
        if (t) return { html: B(n + ' = ' + te + ' + ?'), vis: blocks(n), ans: o, exp: placeTable(n) + say(n + ' = ' + te + ' + ' + o, n + ' = ' + te + ' + ' + o) };
        return { html: B(n + ' = ? + ' + o), vis: blocks(n), ans: te, exp: placeTable(n) + say(n + ' = ' + te + ' + ' + o, n + ' = ' + te + ' + ' + o) }; }
    function genExp3() { var n = r(101, 999), h = dig(n, 2) * 100, te = dig(n, 1) * 10, o = dig(n, 0), t = r(0, 2), arr3 = [h, te, o], parts = ['', '', ''];
        var q = arr3.map(function (v, i) { return i === t ? '?' : v; });
        return { html: B(n + ' = ' + q[0] + ' + ' + q[1] + ' + ' + q[2]), vis: placeTable(n), ans: arr3[t], exp: placeTable(n) + say(n + ' = ' + h + ' + ' + te + ' + ' + o, n + ' = ' + h + ' + ' + te + ' + ' + o) }; }
    function genDouble() { var a = r(2, 10), near = r(0, 1);
        if (near) { return { html: B(a + ' + ' + (a + 1) + ' = ?'), vis: '', ans: 2 * a + 1, exp: say('ضعف ' + a + ' = ' + 2 * a + '، وزود 1 = ' + (2 * a + 1), 'Double ' + a + ' = ' + 2 * a + ', plus 1 = ' + (2 * a + 1)) }; }
        return { html: B(a + ' + ' + a + ' = ?'), vis: dots(a) + dots(a, '#FF9F43'), ans: 2 * a, exp: say('ضعف ' + a + ' = ' + 2 * a, 'Double ' + a + ' = ' + 2 * a) }; }
    function genFamily() { var a = r(2, 12), b = r(2, 12), s = a + b, t = r(0, 1);
        if (t) return { html: B(s + ' − ' + a + ' = ?'), vis: stp(a + ' + ' + b + ' = ' + s + ' ← ' + s + ' − ' + a + ' = ؟'), ans: b, exp: say(a + ' + ' + b + ' = ' + s + tx(' يعني ' + s + ' − ' + a + ' = ' + b, ' so ' + s + ' − ' + a + ' = ' + b), a + ' + ' + b + ' = ' + s + ' so ' + s + ' − ' + a + ' = ' + b) };
        return { html: B(a + ' + ? = ' + s), vis: '', ans: b, exp: say(s + ' − ' + a + ' = ' + b, s + ' − ' + a + ' = ' + b) + say(tx('الجمع والطرح عكس بعض', 'Addition and subtraction are opposites'), 'Addition and subtraction are opposites') }; }

    /* word problems: a template yields both languages */
    var NAMES = [['سلمى', 'Salma'], ['عمر', 'Omar'], ['ياسمين', 'Yasmin'], ['كريم', 'Karim'], ['ليلى', 'Laila'], ['آدم', 'Adam']];
    var ITEMS = [['كتب', 'books'], ['أقلام', 'pens'], ['كور', 'balls'], ['تفاح', 'apples'], ['بسكوت', 'biscuits'], ['ملصقات', 'stickers']];
    function FM(i) { return i === 0 || i === 2 || i === 4; }
    function nm(i) { return NAMES[i][LG === 'en' ? 1 : 0]; }
    function it(i) { return ITEMS[i][LG === 'en' ? 1 : 0]; }
    function wpExp(op, a, b, ans, wAr, wEn) { return say('نحدد العملية: ' + wAr, 'Pick the operation: ' + wEn) + stp(a + ' ' + op + ' ' + b + ' = <b>' + ans + '</b>'); }
    function genWP(kind, maxv) {
        maxv = maxv || 20; var n1 = r(0, NAMES.length - 1), n2 = (n1 + 1 + r(0, 3)) % NAMES.length, i = r(0, ITEMS.length - 1), a, b, ans, q, op, wA, wE, seg;
        if (kind === 'mix') kind = pk(['add', 'sub', 'cmp']);
        if (kind === 'add') { a = r(2, maxv - 2); b = r(2, maxv - a); ans = a + b; op = '+'; wA = 'جمع'; wE = 'add';
            q = tx(nm(n1) + (FM(n1) ? ' عندها ' : ' عنده ') + a + ' ' + it(i) + (FM(n1) ? ' واشترت ' : ' واشترى ') + b + ' كمان. دلوقتي عنده كام؟', nm(n1) + ' has ' + a + ' ' + it(i) + ' and gets ' + b + ' more. How many now?'); seg = { k: 'wp_add', n: [a, b], p: n1, p2: n2, i: i }; }
        else if (kind === 'sub') { a = r(5, maxv); b = r(1, a - 1); ans = a - b; op = '−'; wA = 'طرح'; wE = 'subtract';
            q = tx(nm(n1) + (FM(n1) ? ' كانت معاها ' : ' كان معاه ') + a + ' ' + it(i) + (FM(n1) ? ' وادّت صاحبتها ' : ' وادّى صاحبه ') + b + '. فضل معاه كام؟', nm(n1) + ' had ' + a + ' ' + it(i) + ' and gave ' + b + ' to a friend. How many are left?'); seg = { k: 'wp_sub', n: [a, b], p: n1, p2: n2, i: i }; }
        else if (kind === 'cmp') { a = r(6, maxv); b = r(1, a - 1); ans = a - b; op = '−'; wA = 'طرح (الفرق)'; wE = 'subtract (the difference)';
            q = tx(nm(n1) + (FM(n1) ? ' معاها ' : ' معاه ') + a + ' ' + it(i) + ' و' + nm(n2) + (FM(n2) ? ' معاها ' : ' معاه ') + b + '. كام زيادة مع ' + nm(n1) + '؟', nm(n1) + ' has ' + a + ' ' + it(i) + ' and ' + nm(n2) + ' has ' + b + '. How many more does ' + nm(n1) + ' have?'); seg = { k: 'wp_cmp', n: [a, b], p: n1, p2: n2, i: i }; }
        else if (kind === 'mul') { a = r(2, 9); b = r(2, 9); ans = a * b; op = '×'; wA = 'ضرب (مجموعات متساوية)'; wE = 'multiply (equal groups)';
            q = tx(nm(n1) + (FM(n1) ? ' عندها ' : ' عنده ') + a + ' أكياس، في كل كيس ' + b + ' ' + it(i) + '. كام ' + it(i) + ' كلهم؟', nm(n1) + ' has ' + a + ' bags with ' + b + ' ' + it(i) + ' in each bag. How many ' + it(i) + ' in all?'); seg = { k: 'wp_mul', n: [a, b], p: n1, p2: n2, i: i }; }
        else if (kind === 'share') { b = r(2, 9); ans = r(2, 9); a = b * ans; op = '÷'; wA = 'قسمة (توزيع بالتساوي)'; wE = 'divide (share equally)';
            q = tx(a + ' ' + it(i) + ' اتوزعوا بالتساوي على ' + b + ' أصحاب. كل واحد ياخد كام؟', a + ' ' + it(i) + ' are shared equally between ' + b + ' friends. How many does each friend get?'); seg = { k: 'wp_share', n: [a, b], p: n1, p2: n2, i: i }; }
        else { b = r(2, 9); ans = r(2, 9); a = b * ans; op = '÷'; wA = 'قسمة (كام مجموعة)'; wE = 'divide (how many groups)';
            q = tx(a + ' ' + it(i) + ' بنحطهم في أكياس، كل كيس ' + b + '. هنحتاج كام كيس؟', a + ' ' + it(i) + ' are put in bags of ' + b + '. How many bags are needed?'); seg = { k: 'wp_group', n: [a, b], p: n1, p2: n2, i: i }; }
        var vis = (kind === 'mul' || kind === 'share' || kind === 'group') ? '' : '<div class="bm" dir="ltr"><div class="bmr"><span style="flex:' + a + ';background:#6C4DF6">' + a + '</span>' + (kind === 'add' ? '<span style="flex:' + b + ';background:#FF9F43">' + b + '</span>' : '') + '</div>' + (kind !== 'add' ? '<div class="bmr"><span style="flex:' + b + ';background:#FF9F43">' + b + '</span><span style="flex:' + (a - b) + ';background:#22C55E">?</span></div>' : '<div class="bmq">?</div>') + '</div>';
        return { html: '<div class="wp">' + q + '</div>', vis: vis, ans: ans, exp: wpExp(op, a, b, ans, wA, wE), seg: seg };
    }

    /* fractions: pies and bars */
    function pie(n, d, c) {
        var R = 46, s = '<svg viewBox="0 0 110 110" width="110" height="110" style="margin:4px">';
        for (var i = 0; i < d; i++) { var a0 = i / d * 2 * Math.PI - Math.PI / 2, a1 = (i + 1) / d * 2 * Math.PI - Math.PI / 2, x0 = 55 + R * Math.cos(a0), y0 = 55 + R * Math.sin(a0), x1 = 55 + R * Math.cos(a1), y1 = 55 + R * Math.sin(a1), big = (a1 - a0) > Math.PI ? 1 : 0;
            s += d === 1 ? '<circle cx="55" cy="55" r="46" fill="' + (n ? c || '#FF5C7A' : '#fff') + '" stroke="#2B2350" stroke-width="3"/>' : '<path d="M55 55 L' + x0 + ' ' + y0 + ' A' + R + ' ' + R + ' 0 ' + big + ' 1 ' + x1 + ' ' + y1 + ' Z" fill="' + (i < n ? c || '#FF5C7A' : '#fff') + '" stroke="#2B2350" stroke-width="3" stroke-linejoin="round"/>'; }
        return s + '</svg>';
    }
    function fstr(n, d) { return n + '/' + d; }
    function fracWord(n, d) { var AR = { 2: 'نص', 3: 'تلت', 4: 'ربع' }, EN = { 2: 'half', 3: 'third', 4: 'fourth (quarter)' }; return LG === 'en' ? (n === 1 ? 'one ' : n + ' ') + EN[d] + (n > 1 ? 's' : '') : AR[d]; }
    function genFrac(maxd) {
        var d = pk(maxd === 2 ? [2] : [2, 3, 4]), n = r(1, d - 1), t = r(0, 1);
        if (maxd === 2) n = 1;
        if (t === 0 || maxd === 2) { var o = [fstr(n, d)], x = 0; while (o.length < 4 && x++ < 30) { var dd = pk([2, 3, 4, 6]), nn = r(1, dd - 1), f = fstr(nn, dd); if (o.indexOf(f) < 0) o.push(f); } o = shuf(o);
            return { html: tx('إيه الكسر اللي متلوّن؟', 'What fraction is colored?'), vis: '<div class="pie">' + pie(n, d) + '</div>', opts: o, ans: fstr(n, d), exp: say('الشكل مقسوم ' + d + ' أجزاء متساوية، و' + n + ' منهم ملوّن: ' + fstr(n, d), 'The shape has ' + d + ' equal parts and ' + n + ' are colored: ' + fstr(n, d)) + '<div class="pie">' + pie(n, d) + '</div>' }; }
        return { html: tx('لوّن ' + B(fstr(n, d)) + ': كام جزء نلوّن من ' + d + '؟', 'Show ' + B(fstr(n, d)) + ': how many of the ' + d + ' parts are colored?'), vis: '<div class="pie">' + pie(0, d) + '</div>', ans: n, exp: say('الرقم اللي فوق هو عدد الأجزاء الملوّنة: ' + n, 'The top number is how many parts are colored: ' + n) + '<div class="pie">' + pie(n, d) + '</div>' };
    }
    function genFracCmp() { var d = pk([4, 6, 8]), a = r(1, d - 1), b = r(1, d - 1); while (b === a) b = r(1, d - 1); var s = cmpSym(a, b);
        return { html: tx('أنهي كسر أكبر؟', 'Which fraction is bigger?'), vis: '<div class="pie">' + pie(a, d, '#2DA8FF') + pie(b, d, '#FF9F43') + '</div>', opts: [fstr(a, d), fstr(b, d)], ans: s === '>' ? fstr(a, d) : fstr(b, d), exp: say('نفس عدد الأجزاء (' + d + ')، يبقى الأكتر أجزاء ملوّنة هو الأكبر.', 'Same number of parts (' + d + '), so the one with more colored parts is bigger.') }; }
    function clock(h, m) {
        var s = '<svg viewBox="0 0 120 120" width="150" height="150" style="margin:4px"><circle cx="60" cy="60" r="55" fill="#fff" stroke="#6C4DF6" stroke-width="6"/>';
        for (var i = 1; i <= 12; i++) { var a = i / 12 * 2 * Math.PI - Math.PI / 2; s += '<text x="' + (60 + 42 * Math.cos(a)) + '" y="' + (65 + 42 * Math.sin(a)) + '" font-size="13" font-weight="900" text-anchor="middle" fill="#2B2350">' + i + '</text>'; }
        var ha = ((h % 12) + m / 60) / 12 * 2 * Math.PI - Math.PI / 2, ma = m / 60 * 2 * Math.PI - Math.PI / 2;
        s += '<line x1="60" y1="60" x2="' + (60 + 26 * Math.cos(ha)) + '" y2="' + (60 + 26 * Math.sin(ha)) + '" stroke="#2B2350" stroke-width="6" stroke-linecap="round"/><line x1="60" y1="60" x2="' + (60 + 38 * Math.cos(ma)) + '" y2="' + (60 + 38 * Math.sin(ma)) + '" stroke="#FF5C7A" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="60" r="5" fill="#2B2350"/></svg>';
        return s;
    }
    function tstr(h, m) { return h + ':' + (m < 10 ? '0' : '') + m; }
    function genTime(five) { var h = r(1, 12), m = five ? pk([0, 15, 30, 45, 5, 10, 20, 25, 35, 40, 50, 55]) : pk([0, 30]), ans = tstr(h, m), o = [ans], x = 0; while (o.length < 4 && x++ < 40) { var t = tstr(r(1, 12), five ? pk([0, 15, 30, 45]) : pk([0, 30])); if (o.indexOf(t) < 0) o.push(t); }
        return { html: tx('الساعة كام؟', 'What time is it?'), vis: '<div class="pie">' + clock(h, m) + '</div>', opts: shuf(o), ans: ans, exp: say('العقرب القصير للساعات: ' + h + '، والعقرب الطويل للدقايق: ' + m, 'The short hand shows hours: ' + h + ', the long hand shows minutes: ' + m) + '<div class="pie">' + clock(h, m) + '</div>' }; }
    function genMoney() { var coins = [1, 5, 10, 20, 50], n = r(2, 4), v = [], tot = 0; for (var i = 0; i < n; i++) { var c = pk(coins.slice(0, 4)); v.push(c); tot += c; } if (tot > 90) { v = [10, 20, 5]; tot = 35; }
        return { html: tx('معاك الفلوس دي. كام جنيه كلهم؟', 'You have this money. How many pounds in all?'), vis: '<div class="mny" dir="ltr">' + v.map(function (c) { return '<span class="cn c' + c + '">' + c + '</span>'; }).join('') + '</div>', ans: tot, exp: say('نجمع: ' + v.join(' + ') + ' = ' + tot, 'Add them: ' + v.join(' + ') + ' = ' + tot) + say(tx('الجنيه عملة مصر (EGP)', 'The pound is the money of Egypt (EGP)'), 'The pound is the money of Egypt (EGP)') }; }
    function genChange() { var p = r(2, 9) * 5, pay = p <= 10 ? 10 : p <= 20 ? 20 : 50, ans = pay - p;
        return { html: tx('اشتريت حاجة بـ ' + p + ' جنيه ودفعت ' + pay + ' جنيه. الباقي كام؟', 'You buy something for ' + p + ' pounds and pay ' + pay + ' pounds. How much change?'), vis: '', ans: ans, exp: say('الباقي = ' + pay + ' − ' + p + ' = ' + ans, 'Change = ' + pay + ' − ' + p + ' = ' + ans) }; }
    function genShare() { var b = r(2, 5), ans = r(2, 6), a = b * ans, items = '';
        for (var g = 0; g < b; g++) { items += '<div class="grp">' + (function () { var s = ''; for (var i = 0; i < ans; i++) s += '<i class="bo"></i>'; return s; })() + '</div>'; }
        return { html: tx(a + ' نقطة بنوزعها بالتساوي على ' + b + ' مجموعات. في كل مجموعة كام؟', a + ' dots are shared equally into ' + b + ' groups. How many in each group?'), vis: dots(a), ans: ans, exp: '<div class="grps" dir="ltr">' + items + '</div>' + say(a + ' ÷ ' + b + ' = ' + ans, a + ' ÷ ' + b + ' = ' + ans) }; }
    function genGroupDiv() { var b = r(2, 5), ans = r(2, 6), a = b * ans;
        return { html: tx(a + ' نقطة، كل مجموعة فيها ' + b + '. كام مجموعة؟', a + ' dots in groups of ' + b + '. How many groups?'), vis: dots(a), ans: ans, exp: say(a + ' ÷ ' + b + ' = ' + ans, a + ' ÷ ' + b + ' = ' + ans) + say(tx('نعد كام مرة ' + b + ' داخلة في ' + a, 'Count how many ' + b + 's fit into ' + a), 'Count how many ' + b + 's fit into ' + a) }; }
    function genMissing() { var b = r(2, 12), c = r(2, 12), a = b * c, t = r(0, 1);
        return { html: B(t ? b + ' × ? = ' + a : '? × ' + c + ' = ' + a), vis: '', ans: t ? c : b, exp: say(a + ' ÷ ' + (t ? b : c) + ' = ' + (t ? c : b), a + ' ÷ ' + (t ? b : c) + ' = ' + (t ? c : b)) + say('القسمة بتدّينا الرقم الناقص', 'Division gives us the missing number') }; }
    function genChallenge() { var t = r(0, 5); return [function () { return qFrom('+', r(20, 90), r(10, 80), 0); }, null][0] && [function () { var q = genAdd({ a: [20, 90], b: [10, 80], max: 99 }); return qFrom(q.op, q.a, q.b, q.ans); }, function () { var q = genSub({ a: [30, 99], b: [11, 80] }); return qFrom(q.op, q.a, q.b, q.ans); }, function () { var q = genMul({ mix: true }); return qFrom(q.op, q.a, q.b, q.ans); }, function () { var q = genDiv({ mix: true }); return qFrom(q.op, q.a, q.b, q.ans); }, function () { return genWP('mix', 50); }, function () { return genWP(pk(['mul', 'share', 'group'])); }][t](); }


    /* ---------- curriculum ---------- */
    function exStepPages(a, b, op) {
        var w = work(a, b, op), pgs = [];
        pgs.push('<div class="ex" dir="ltr">' + col(a, b, op, 0, w) + '</div>' + say('هنحلها خطوة بخطوة، <b>من اليمين</b> (الآحاد الأول)', 'We solve it step by step, <b>from the right</b> (ones first)'));
        for (var i = 0; i < w.L; i++) pgs.push('<div class="ex" dir="ltr">' + col(a, b, op, i + 1, w) + '</div><div class="stp">' + w.steps[i] + '</div>');
        return pgs;
    }
    function lvl(id, ico, en, ar, learn, gen, mc) { return { id: id, ico: ico, en: en, ar: ar, learn: learn, gen: gen, mc: mc }; }
    function nm2(l) { return tx(l.ar, l.en); }
    var TIPS = {
        1: ['أي عدد × 1 = نفس العدد (مرة واحدة بس!). وأي عدد × 0 = صفر (صفر مرات = مفيش حاجة).', 'Any number × 1 stays the same (just one group!). Any number × 0 = zero (no groups = nothing).'],
        2: ['الضرب في 2 معناه نضاعف العدد (نجمعه مع نفسه). 6 × 2 = 6 + 6.', 'Times 2 means double the number (add it to itself). 6 × 2 = 6 + 6.'],
        3: ['عدّ بالتلاتات: 3 ، 6 ، 9 ، 12 ... وكل مرة نزود 3.', 'Count by threes: 3, 6, 9, 12 ... add 3 each time.'],
        4: ['الضرب في 4 = نضاعف مرتين. 7 × 4 = (7 × 2) × 2 = 14 × 2 = 28.', 'Times 4 = double twice. 7 × 4 = (7 × 2) × 2 = 14 × 2 = 28.'],
        5: ['الضرب في 5: الناتج دايماً بينتهي بـ 0 أو 5. وممكن نحسب نص الضرب في 10.', 'Times 5: the answer always ends in 0 or 5. Or take half of times 10.'],
        6: ['6 × 7 = (5 × 7) + 7 = 35 + 7 = 42. اضرب في 5 وزوّد مرة.', '6 × 7 = (5 × 7) + 7 = 35 + 7 = 42. Multiply by 5 then add one more group.'],
        7: ['جدول 7: 7 ، 14 ، 21 ، 28 ، 35 ، 42 ، 49 ، 56 ، 63 ، 70 ... اتعلمه بالعدّ والغناء!', 'Table of 7: 7, 14, 21, 28, 35, 42, 49, 56, 63, 70 ... learn it by counting and singing!'],
        8: ['الضرب في 8 = نضاعف 3 مرات. 6 × 8 = 6 → 12 → 24 → 48.', 'Times 8 = double three times. 6 × 8 = 6 → 12 → 24 → 48.'],
        9: ['خدعة التسعة: 9 × 4 = 36 (3 + 6 = 9). وكمان الناتج = (ضرب في 10) ناقص العدد. 9 × 6 = 60 − 6 = 54.', 'Nine trick: 9 × 4 = 36 (3 + 6 = 9). Also times 9 = times 10 minus the number. 9 × 6 = 60 − 6 = 54.'],
        10: ['الضرب في 10: بنضيف صفر على اليمين. 7 × 10 = 70.', 'Times 10: add a zero on the right. 7 × 10 = 70.'],
        11: ['الضرب في 11 لحد 9: بنكرر الرقم. 11 × 4 = 44. و 11 × 12 = 132.', 'Times 11 up to 9: repeat the digit. 11 × 4 = 44. And 11 × 12 = 132.'],
        12: ['12 × 7 = (10 × 7) + (2 × 7) = 70 + 14 = 84. فرّق 12 لـ 10 و 2.', '12 × 7 = (10 × 7) + (2 × 7) = 70 + 14 = 84. Split 12 into 10 and 2.']
    };
    function tip(n) { return say('💡 ' + TIPS[n][0], '💡 ' + TIPS[n][1]); }
    function tableLevel(n) {
        if (n === 1) return lvl('m1', '1️⃣', 'Table of 1 and 0', 'جدول 1 (وكمان الصفر)', [
            say('جدول <b>1</b> أسهل جدول: مرة واحدة بس من كل عدد!', 'The table of <b>1</b> is the easiest: just one of each number!') + '<div class="ex">' + arr(1, 5) + '</div>' + say('1 × 5 = 5 &nbsp; (صف واحد فيه 5 نقط)', '1 × 5 = 5 &nbsp; (one row with 5 dots)'),
            say('أي عدد × 1 يفضل <b>زي ما هو</b>.', 'Any number × 1 <b>stays the same</b>.') + skip(1, 12),
            tbl(1),
            say('والصفر؟ <b>0 مرات</b> من أي حاجة = مفيش حاجة!', 'And zero? <b>0 groups</b> of anything = nothing!') + stp('0 × 7 = 0 &nbsp; | &nbsp; 7 × 0 = 0 &nbsp; | &nbsp; 1 × 0 = 0'),
            tip(1)
        ], mk('mul', { tbl: 1 }), true);
        return lvl('m' + n, '✖️', 'Table of ' + n, 'جدول ' + n, [
            say('جدول الضرب في <b>' + n + '</b>: العدد ده بيتكرر كذا مرة؟', 'The table of <b>' + n + '</b>: how many times is it repeated?') + '<div class="ex">' + arr(n, 5) + '</div>' + say(n + ' × 5 = ' + (n * 5) + ' &nbsp; (' + n + ' في ٥ صفوف)', n + ' × 5 = ' + (n * 5) + ' &nbsp; (' + n + ' in 5 rows)'),
            say('العدّ القفزي (كل مرة نزود ' + n + '):', 'Skip counting (add ' + n + ' each time):') + skip(n, 12),
            tbl(n),
            tip(n)
        ], mk('mul', { tbl: n }), true);
    }
    function divLevel(n) {
        return lvl('d' + n, '➗', 'Divide by ' + n, 'القسمة على ' + n, [
            say('القسمة على <b>' + n + '</b> هي عكس الضرب في ' + n + '.', 'Dividing by <b>' + n + '</b> is the opposite of times ' + n + '.') + stp(n + ' × 6 = ' + n * 6 + ' &nbsp;→&nbsp; ' + n * 6 + ' ÷ ' + n + ' = <b>6</b>'),
            say('نفكر: ' + n + ' × كام = ' + n * 4 + '؟', 'Think: ' + n + ' × what = ' + n * 4 + '?') + arr(n, 4) + stp(n * 4 + ' ÷ ' + n + ' = <b>4</b>'),
            skip(n, 12) + say('كل رقم هنا ينفع نقسمه على ' + n, 'Every number here can be divided by ' + n)
        ], mk('div', { tbl: n }), true);
    }
    function buildCur() {
        var P = {}; PP = P;
        P.pv1 = lvl('pv1', '🧱', 'Ones & Tens', 'الآحاد والعشرات', [
            say('كل رقم له <b>مكان</b>، والمكان بيحدد قيمته!', 'Every digit has a <b>place</b>, and the place decides its value!') + blocks(34) + say('34 = 3 عشرات + 4 آحاد', '34 = 3 tens + 4 ones'),
            placeTable(34) + say('اليمين: <b>آحاد</b> (واحد واحد). والشمال: <b>عشرات</b> (كل عشرة = 10).', 'Right side: <b>ones</b> (one each). Left side: <b>tens</b> (each ten = 10).'),
            say('عشرة آحاد بتبقى <b>عشرة واحدة</b>!', 'Ten ones make <b>one ten</b>!') + '<div class="ex"><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i> <b>＝</b> <i class="bt"></i></div>',
            blocks(57) + placeTable(57) + say('57 = 50 + 7', '57 = 50 + 7')
        ], function () { return genPV(1); }, true);
        P.n20 = lvl('n20', '🔢', 'Count to 20', 'العدّ لحد 20', [
            say('هنتعلم نعد الحاجات واحدة واحدة.', 'Let\'s count things one by one.') + dots(7) + say('1 ، 2 ، 3 ، 4 ، 5 ، 6 ، 7 ← سبعة', '1, 2, 3, 4, 5, 6, 7 → seven'),
            say('بعد التسعة بييجي <b>عشرة</b>، وبعدها 11 و 12 ... لحد 20.', 'After nine comes <b>ten</b>, then 11, 12 ... up to 20.') + skip2([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]),
            say('نعد بـ<b>ترتيب</b> وما نفوّتش حاجة!', 'Count in <b>order</b> and do not skip any!') + dots(14)
        ], genCount20, true);
        P.nb10 = lvl('nb10', '🤝', 'Number Bonds to 10', 'أزواج العشرة', [
            say('عددين بيكوّنوا <b>عشرة</b> مع بعض! اسمهم أزواج العشرة.', 'Two numbers that make <b>ten</b> together are called number bonds.') + '<div class="ex">' + (function () { var s = ''; for (var i = 0; i < 10; i++) s += '<i class="bo" style="' + (i < 6 ? '' : 'background:#FF9F43') + '"></i>'; return s; })() + '</div>' + say('6 + 4 = 10', '6 + 4 = 10'),
            stp('1 + 9 &nbsp; 2 + 8 &nbsp; 3 + 7 &nbsp; 4 + 6 &nbsp; 5 + 5') + say('احفظهم، هيساعدوك في كل الجمع!', 'Learn them, they help with all adding!')
        ], function () { return genBond(10); }, true);
        P.exp2 = lvl('exp2', '🧩', 'Expanded Form (2 digits)', 'تفكيك العدد (رقمين)', [
            say('نفكّك العدد لعشرات وآحاد.', 'We break a number into tens and ones.') + blocks(47) + stp('47 = 40 + 7'),
            placeTable(63) + stp('63 = 60 + 3') + say('العشرات في الأول، والآحاد في الآخر.', 'Tens first, ones last.')
        ], genExp2, false);
        P.pv2 = lvl('pv2', '🟧', 'Hundreds', 'المئات', [
            say('عشر عشرات بتبقى <b>مية</b>!', 'Ten tens make <b>one hundred</b>!') + '<div class="ex"><i class="bt"></i><i class="bt"></i><i class="bt"></i><i class="bt"></i><i class="bt"></i><i class="bt"></i><i class="bt"></i><i class="bt"></i><i class="bt"></i><i class="bt"></i> <b>＝</b> <i class="bh"></i></div>',
            blocks(243) + placeTable(243) + say('243 = 200 + 40 + 3', '243 = 200 + 40 + 3'),
            blocks(406) + placeTable(406) + say('406: مفيش عشرات! الصفر بيحجز المكان (4 مئات و 0 عشرات و 6 آحاد).', '406: no tens! Zero holds the place (4 hundreds, 0 tens, 6 ones).'),
            say('قيمة الرقم تتغير حسب مكانه:', 'The value of a digit depends on its place:') + '<div class="ex big2" dir="ltr"><b style="color:' + COL[0] + '">5</b> = 5 &nbsp; <b style="color:' + COL[1] + '">5</b>0 = 50 &nbsp; <b style="color:' + COL[2] + '">5</b>00 = 500</div>'
        ], function () { return genPV(2); }, false);
        P.exp3 = lvl('exp3', '🧩', 'Expanded Form (3 digits)', 'تفكيك العدد (3 أرقام)', [
            say('نفكّك العدد لمئات وعشرات وآحاد.', 'We break a number into hundreds, tens and ones.') + blocks(345) + stp('345 = 300 + 40 + 5'),
            stp('708 = 700 + 0 + 8') + say('الصفر ما بيضيفش حاجة، بس بيحجز مكان.', 'Zero adds nothing, but it holds a place.') + placeTable(708)
        ], genExp3, false);
        P.nl = lvl('nl', '📏', 'Number Line', 'خط الأعداد', [
            say('خط الأعداد زي <b>شارع</b> فيه الأرقام بالترتيب. كل رقم أكبر من اللي قبله بواحد.', 'The number line is like a <b>street</b> with numbers in order. Each number is one more than the one before.') + nline(0, 10, {}),
            say('نبدأ من <b>3</b> ونقفز 4 خطوات <b>لليمين</b> (ده الجمع!):', 'Start at <b>3</b> and hop 4 steps to the <b>right</b> (that is adding!):') + nline(0, 10, { start: 3, end: 7, auto: 1 }) + say('3 + 4 = 7', '3 + 4 = 7'),
            say('وده الطرح: نبدأ من <b>8</b> ونقفز 3 خطوات <b>لليسار</b>:', 'And this is subtracting: start at <b>8</b> and hop 3 steps to the <b>left</b>:') + nline(0, 10, { start: 8, end: 5, auto: 1 }) + say('8 − 3 = 5', '8 − 3 = 5'),
            say('يمين = أكبر ➕ &nbsp; | &nbsp; شمال = أصغر ➖', 'Right = bigger ➕ &nbsp; | &nbsp; Left = smaller ➖') + nline(10, 20, { start: 12, end: 16, auto: 1 }) + say('12 + 4 = 16', '12 + 4 = 16')
        ], genNL, true);
        P.cmp = lvl('cmp', '⚖️', 'Compare Numbers', 'نقارن الأعداد', [
            say('العلامة بتفتح فمها ناحية العدد <b>الأكبر</b>، زي تمساح جعان! 🐊', 'The sign opens its mouth toward the <b>bigger</b> number, like a hungry crocodile! 🐊') + stp('8 &gt; 5 &nbsp; | &nbsp; 3 &lt; 9 &nbsp; | &nbsp; 6 = 6'),
            '<div class="cmp" dir="ltr"><div>' + dots(7) + '</div><div>' + dots(4, '#FF9F43') + '</div></div>' + say('7 أكبر من 4: 7 &gt; 4', '7 is greater than 4: 7 &gt; 4'),
            placeTable(354) + placeTable(362) + say('المئات زي بعض، العشرات 5 و 6 ← 354 &lt; 362', 'Hundreds are the same; tens 5 and 6 → 354 &lt; 362')
        ], function () { return r(0, 2) ? genCmp(99, true) : genCmp3(); }, true);
        P.ord = lvl('ord', '📶', 'Order Numbers', 'ترتيب الأعداد', [
            say('نرتب من <b>الأصغر</b> للأكبر.', 'Order from <b>smallest</b> to biggest.') + skip2([12, 27, 45, 63]),
            say('الأكبر هو اللي مئاته أكتر، ولو زي بعض نبص على العشرات.', 'The biggest has the most hundreds; if equal, check the tens.') + stp('214 &lt; 241 &lt; 412')
        ], genOrder, true);
        P.eo = lvl('eo', '👯', 'Even and Odd', 'زوجي وفردي', [
            say('<b>زوجي</b> يعني نقدر نقسمه أزواج من غير ما يفضل حاجة.', '<b>Even</b> means we can make pairs with none left over.') + dots(6) + say('6 زوجي: 3 أزواج', '6 is even: 3 pairs'),
            say('<b>فردي</b>: لازم يفضل واحد من غير زوج.', '<b>Odd</b>: one is always left without a pair.') + dots(7) + say('7 فردي', '7 is odd'),
            say('بنبص على رقم الآحاد: 0 2 4 6 8 = زوجي.', 'Look at the ones digit: 0 2 4 6 8 = even.') + skip2([2, 4, 6, 8, 10])
        ], genEO, true);
        P.sk = lvl('sk', '🦘', 'Skip Counting', 'العدّ القفزي', [
            say('نعد بالقفز: كل مرة نزود نفس العدد.', 'Skip counting: add the same number every time.') + skip2([2, 4, 6, 8, 10]),
            skip2([5, 10, 15, 20, 25]) + say('بالخمسات', 'By fives'), skip2([100, 200, 300, 400]) + say('بالميّات', 'By hundreds')
        ], genSkip, false);
        P.rnd = lvl('rnd', '🎯', 'Round to 10', 'التقريب لأقرب عشرة', [
            say('نقرّب العدد لأقرب <b>عشرة</b>: هو أقرب لأنهي عشرة؟', 'Round a number to the nearest <b>ten</b>: which ten is it closest to?') + nline(30, 40, { mark: 34 }),
            say('34 أقرب لـ 30. رقم الآحاد 4 (أقل من 5) ننزل لتحت.', '34 is closer to 30. The ones digit is 4 (less than 5) so round down.'),
            say('37: الآحاد 7 (5 أو أكتر) نطلع لفوق ← 40.', '37: the ones digit is 7 (5 or more) so round up → 40.') + nline(30, 40, { mark: 37 })
        ], genRound, false);
        P.a1 = lvl('a1', '➕', 'Add to 10', 'جمع لحد 10', [say('الجمع معناه <b>نضم</b> حاجتين مع بعض.', 'Adding means <b>putting</b> two groups together.') + '<div class="ex"><i class="bo"></i><i class="bo"></i><i class="bo"></i><b> + </b><i class="bo"></i><i class="bo"></i><b> = </b><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i></div>' + say('3 + 2 = 5', '3 + 2 = 5')],
            mk('add', { a: [1, 9], b: [1, 9], max: 10 }), true);
        P.s1 = lvl('s1', '➖', 'Take away to 10', 'طرح لحد 10', [say('الطرح معناه <b>ناخد بعيد</b>.', 'Subtracting means <b>taking away</b>.') + '<div class="ex"><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><b> − </b><i class="bo"></i><i class="bo"></i><b> = </b><i class="bo"></i><i class="bo"></i><i class="bo"></i></div>' + say('5 − 2 = 3', '5 − 2 = 3')],
            mk('sub', { a: [2, 10], b: [1, 9], max: 10 }), true);
        P.a2 = lvl('a2', '🔟', 'Make 10', 'تكوين العشرة', [
            say('خدعة جامدة: كمّل لـ <b>10</b> الأول!', 'A great trick: make <b>10</b> first!') + stp('8 + 5 → 8 + <b>2</b> + 3 → 10 + 3 = <b>13</b>'),
            say('جرب كمان: 9 + 6', 'Try another: 9 + 6') + stp('9 + <b>1</b> + 5 = 10 + 5 = <b>15</b>')
        ], mk('add', { a: [2, 10], b: [2, 10], max: 20, min: 11 }), true);
        P.s2 = lvl('s2', '🔟', 'Subtract to 20', 'طرح لحد 20', [say('نرجع لـ <b>10</b> الأول!', 'Go back to <b>10</b> first!') + stp('15 − 8 → 15 − <b>5</b> = 10 → 10 − <b>3</b> = <b>7</b>')],
            mk('sub', { a: [11, 20], b: [2, 9], max: 20 }), true);
        P.dbl = lvl('dbl', '👯', 'Doubles', 'الضعف (عدد + نفسه)', [
            say('<b>الضعف</b> يعني نجمع العدد مع نفسه.', '<b>Doubles</b> means adding a number to itself.') + dots(4) + dots(4, '#FF9F43') + stp('4 + 4 = 8'),
            say('ولو العددين قريبين: 6 + 7 = ضعف 6 وزود 1 = 13.', 'Near doubles: 6 + 7 = double 6 plus 1 = 13.')
        ], genDouble, true);
        P.fam = lvl('fam', '🏠', 'Fact Families', 'عيلة الأرقام', [
            say('الجمع والطرح <b>عيلة واحدة</b>!', 'Addition and subtraction are <b>one family</b>!') + stp('3 + 4 = 7 &nbsp; 4 + 3 = 7<br>7 − 3 = 4 &nbsp; 7 − 4 = 3'),
            say('لو عرفت جمع، تعرف طرح!', 'If you know the adding, you know the subtracting!')
        ], genFamily, false);
        P.a3 = lvl('a3', '🧮', 'Tens + Ones', 'عشرات + آحاد', [say('الآحاد بتتجمع مع الآحاد!', 'Ones add to ones!') + blocks(34) + say('34 + 5: الآحاد 4 + 5 = 9 ← الناتج <b>39</b>', '34 + 5: ones 4 + 5 = 9 → the answer is <b>39</b>'), say('العشرات ما بتتغيرش.', 'The tens do not change.') + placeTable(52) + say('52 + 6 = 58', '52 + 6 = 58')],
            mk('add', { a: [11, 90], b: [1, 9], carry: 'no', max: 99 }), true);
        P.s3 = lvl('s3', '🧮', 'Tens − Ones', 'طرح الآحاد', [say('بنطرح الآحاد من الآحاد.', 'We subtract ones from ones.') + blocks(47) + say('47 − 5: الآحاد 7 − 5 = 2 ← <b>42</b>', '47 − 5: ones 7 − 5 = 2 → <b>42</b>')],
            mk('sub', { a: [20, 99], b: [1, 9], carry: 'no', max: 99 }), true);
        P.a4 = lvl('a4', '🏗️', 'Column Add', 'جمع بالأعمدة', [say('نكتب الأرقام <b>تحت بعض</b>: آحاد تحت آحاد، وعشرات تحت عشرات.', 'Write the numbers <b>one under the other</b>: ones under ones, tens under tens.')].concat(exStepPages(34, 25, '+')), mk('add', { a: [11, 80], b: [11, 80], carry: 'no', max: 99 }), false);
        P.s4 = lvl('s4', '🏗️', 'Column Subtract', 'طرح بالأعمدة', [say('نكتب العدد الكبير فوق، ونطرح عمود عمود.', 'Write the bigger number on top and subtract column by column.')].concat(exStepPages(76, 23, '−')), mk('sub', { a: [30, 99], b: [11, 80], carry: 'no', max: 99 }), false);
        P.a5 = lvl('a5', '🎒', 'Carrying', 'الجمع بالحمل', [say('لو الآحاد زادت عن <b>9</b>؟ بنكتب الآحاد و<b>نحمل</b> العشرة للعمود الجنب!', 'If the ones go over <b>9</b>? Write the ones and <b>carry</b> the ten to the next column!')].concat(exStepPages(38, 27, '+'), exStepPages(65, 49, '+')), mk('add', { a: [15, 90], b: [9, 90], carry: 'yes', max: 190 }), false);
        P.s5 = lvl('s5', '🏦', 'Borrowing', 'الطرح بالاستلاف', [say('لو الرقم اللي فوق <b>أصغر</b>؟ نستلف عشرة من العمود الجنب!', 'If the top digit is <b>smaller</b>? Borrow a ten from the next column!')].concat(exStepPages(52, 27, '−'), exStepPages(83, 48, '−')), mk('sub', { a: [30, 99], b: [11, 90], carry: 'yes', max: 99 }), false);
        P.a6 = lvl('a6', '🏰', 'Hundreds Add', 'جمع المئات', [say('نفس الفكرة بالظبط، بس فيه عمود تالت: <b>المئات</b>.', 'Exactly the same idea, with a third column: <b>hundreds</b>.')].concat(exStepPages(342, 215, '+')), mk('add', { a: [101, 600], b: [101, 400], carry: 'no', max: 900 }), false);
        P.s6 = lvl('s6', '🏰', 'Hundreds Subtract', 'طرح المئات', [say('نفس الفكرة بثلاث أعمدة.', 'The same idea with three columns.')].concat(exStepPages(785, 342, '−')), mk('sub', { a: [200, 900], b: [101, 600], carry: 'no', max: 900 }), false);
        P.a7 = lvl('a7', '🚀', 'Big Carrying', 'جمع كبير بالحمل', [say('ممكن نحمل أكتر من مرة!', 'We may carry more than once!')].concat(exStepPages(478, 356, '+')), mk('add', { a: [150, 700], b: [120, 600], carry: 'yes', max: 900 }), false);
        P.s7 = lvl('s7', '🚀', 'Big Borrowing', 'طرح كبير بالاستلاف', [say('ممكن نستلف أكتر من مرة!', 'We may borrow more than once!')].concat(exStepPages(532, 278, '−')), mk('sub', { a: [200, 900], b: [101, 700], carry: 'yes', max: 900 }), false);
        function wpLvl(id, en, ar, kind, maxv, intro, introEn, ex) { return lvl(id, '📖', en, ar, [say(intro, introEn) + (ex || ''), say('خطوات الحل: (1) نقرا السؤال (2) نحدد العملية (3) نحسب (4) نراجع.', 'Steps: (1) read (2) choose the operation (3) calculate (4) check.')], function () { return genWP(kind, maxv); }, false); }
        P.wpa = wpLvl('wpa', 'Word Problems: Add', 'مسائل الجمع', 'add', 20, 'المسألة الكلامية قصة صغيرة. "كمان" و"كلهم" معناها <b>جمع</b>.', 'A word problem is a small story. "more" and "in all" mean <b>add</b>.', '<div class="bm" dir="ltr"><div class="bmr"><span style="flex:5;background:#6C4DF6">5</span><span style="flex:3;background:#FF9F43">3</span></div><div class="bmq">?</div></div>');
        P.wps = wpLvl('wps', 'Word Problems: Subtract', 'مسائل الطرح', 'sub', 30, '"فضل" و"اداه" و"راح" معناها <b>طرح</b>.', '"left", "gave away" and "lost" mean <b>subtract</b>.');
        P.wpc = wpLvl('wpc', 'Word Problems: How many more', 'مسائل: كام زيادة', 'cmp', 50, 'لما نسأل "كام زيادة؟" بنقارن العددين وبنطرح.', 'When we ask "how many more?" we compare the two numbers and subtract.');
        P.mx = lvl('mx', '🧩', 'What is ×?', 'يعني إيه ضرب؟', [
            say('الضرب هو <b>جمع متكرر</b> بسرعة!', 'Multiplying is <b>fast repeated adding</b>!') + stp('3 + 3 + 3 + 3 = 12 &nbsp;→&nbsp; <b>4 × 3 = 12</b>'),
            say('4 صفوف، في كل صف 3 نقط:', '4 rows, 3 dots in each row:') + '<div class="ex">' + arr(4, 3) + '</div>' + say('4 × 3 = 12', '4 × 3 = 12')
        ], mk('mul', { tbl: 2 }), true);
        P.mm = lvl('mm', '🎯', 'Mixed tables', 'كل الجداول مع بعض', [say('دلوقتي كل الجداول من 2 لـ 12 مخلوطة. جاهز؟ 💪', 'Now all the tables from 2 to 12, mixed up. Ready? 💪')], mk('mul', { mix: true }), true);
        P.mt = lvl('mt', '🔟', '× 10 and × 100', 'الضرب في 10 و 100', [say('الضرب في 10 = نضيف <b>صفر</b>. والضرب في 100 = نضيف <b>صفرين</b>.', 'Times 10 = add <b>one zero</b>. Times 100 = add <b>two zeros</b>.') + stp('34 × 10 = 340 &nbsp; | &nbsp; 7 × 100 = 700')], mk('mul', {}), false);
        P.mb = lvl('mb', '🏆', '2-digit × 1-digit', 'ضرب عددين في رقم', [say('نفصّل العدد الكبير لعشرات وآحاد:', 'Split the big number into tens and ones:') + stp('23 × 4 = (20 × 4) + (3 × 4) = 80 + 12 = <b>92</b>'), say('جرب: 45 × 6', 'Try: 45 × 6') + stp('(40 × 6) + (5 × 6) = 240 + 30 = <b>270</b>')], mk('mul', { big: true }), false);
        P.wpm = wpLvl('wpm', 'Word Problems: Multiply', 'مسائل الضرب', 'mul', 9, '"في كل" و"كلهم" مع مجموعات متساوية معناها <b>ضرب</b>.', '"in each" and "in all" with equal groups mean <b>multiply</b>.');
        P.dv1 = lvl('dv1', '🍰', 'Sharing Equally', 'التوزيع بالتساوي', [
            say('القسمة معناها <b>نوزّع بالتساوي</b>.', 'Division means <b>sharing equally</b>.') + '<div class="grps" dir="ltr"><div class="grp"><i class="bo"></i><i class="bo"></i><i class="bo"></i></div><div class="grp"><i class="bo"></i><i class="bo"></i><i class="bo"></i></div></div>' + say('6 ÷ 2 = 3: كل واحد ياخد 3', '6 ÷ 2 = 3: each one gets 3'),
            say('الرمز ÷ بنقراه "مقسوم على".', 'The sign ÷ is read "divided by".')
        ], genShare, true);
        P.dv2 = lvl('dv2', '👜', 'Making Groups', 'نكوّن مجموعات', [
            say('بنسأل: <b>كام مجموعة</b> نقدر نعمل؟', 'We ask: <b>how many groups</b> can we make?') + dots(12) + say('12 ÷ 4 = 3 مجموعات', '12 ÷ 4 = 3 groups'),
            say('نطرح 4 كذا مرة لحد ما نخلص: 12 ← 8 ← 4 ← 0 (3 مرات).', 'Take away 4 again and again: 12 → 8 → 4 → 0 (3 times).')
        ], genGroupDiv, true);
        P.dv3 = lvl('dv3', '🔄', 'Division and Times', 'القسمة عكس الضرب', [
            say('لو عرفت جدول الضرب، تعرف القسمة!', 'If you know the times table, you know division!') + stp('3 × 4 = 12<br>12 ÷ 3 = 4 &nbsp; 12 ÷ 4 = 3'),
            say('بنسأل: "كام × ' + 4 + ' = ' + 20 + '؟"', 'We ask: "what × 4 = 20?"') + stp('20 ÷ 4 = <b>5</b>')
        ], genMissing, false);
        P.d2 = divLevel(2); P.d5 = divLevel(5); P.d10 = divLevel(10); P.d3 = divLevel(3); P.d4 = divLevel(4); P.d6 = divLevel(6); P.d7 = divLevel(7); P.d8 = divLevel(8); P.d9 = divLevel(9);
        P.dm = lvl('dm', '🎯', 'Mixed × and ÷', 'ضرب وقسمة مع بعض', [say('دلوقتي ضرب وقسمة مخلوطين. فكر في العيلة!', 'Now times and divide mixed up. Think of the family!')], function () { return r(0, 1) ? mk('div', { mix: true })() : mk('mul', { mix: true })(); }, false);
        P.wpd = wpLvl('wpd', 'Word Problems: Divide', 'مسائل القسمة', 'share', 9, '"بالتساوي" و"كل واحد ياخد" معناها <b>قسمة</b>.', '"equally" and "each gets" mean <b>divide</b>.');
        P.f1 = lvl('f1', '🍕', 'Halves', 'النص', [
            say('<b>النص</b>: نقسم الحاجة لجزئين متساويين.', 'A <b>half</b>: split something into two equal parts.') + '<div class="pie">' + pie(1, 2) + '</div>' + say('جزء من اتنين = 1/2', 'One of two parts = 1/2'),
            say('الأجزاء لازم تكون <b>متساوية</b>!', 'The parts must be <b>equal</b>!') + '<div class="pie">' + pie(1, 2) + pie(2, 2, '#22C55E') + '</div>'
        ], function () { return genFrac(2); }, true);
        P.f2 = lvl('f2', '🍰', 'Thirds and Fourths', 'التلت والربع', [
            say('<b>التلت</b>: 3 أجزاء متساوية. <b>الربع</b>: 4 أجزاء متساوية.', 'A <b>third</b>: 3 equal parts. A <b>fourth</b> (quarter): 4 equal parts.') + '<div class="pie">' + pie(1, 3) + pie(1, 4) + '</div>',
            say('الرقم اللي تحت = كل الأجزاء، واللي فوق = الأجزاء الملوّنة.', 'The bottom number = all the parts, the top = the colored parts.') + '<div class="pie">' + pie(3, 4) + '</div>' + say('3/4', '3/4')
        ], function () { return genFrac(4); }, true);
        P.f3 = lvl('f3', '⚖️', 'Compare Fractions', 'نقارن الكسور', [
            say('لو الأجزاء نفس الحجم، الأكتر أجزاء ملوّنة أكبر.', 'When the parts are the same size, more colored parts is bigger.') + '<div class="pie">' + pie(3, 8, '#2DA8FF') + pie(5, 8, '#FF9F43') + '</div>' + say('5/8 أكبر من 3/8', '5/8 is bigger than 3/8')
        ], genFracCmp, true);
        P.tm = lvl('tm', '⏰', 'Telling Time', 'قراية الساعة', [
            say('العقرب <b>القصير</b> بيقول الساعة، والعقرب <b>الطويل</b> بيقول الدقايق.', 'The <b>short</b> hand tells the hour, the <b>long</b> hand tells the minutes.') + '<div class="pie">' + clock(3, 0) + '</div>' + say('3:00', '3:00'),
            '<div class="pie">' + clock(7, 30) + '</div>' + say('الطويل على 6 يعني 30 دقيقة: 7:30', 'Long hand on 6 means 30 minutes: 7:30')
        ], function () { return genTime(false); }, true);
        P.mo = lvl('mo', '💰', 'Money', 'الفلوس (الجنيه)', [
            say('العملة في مصر هي <b>الجنيه</b>.', 'The money in Egypt is the <b>pound</b>.') + '<div class="mny" dir="ltr"><span class="cn c10">10</span><span class="cn c5">5</span><span class="cn c1">1</span></div>' + say('10 + 5 + 1 = 16 جنيه', '10 + 5 + 1 = 16 pounds'),
            say('الباقي = اللي دفعته − السعر.', 'Change = what you paid − the price.')
        ], function () { return r(0, 1) ? genMoney() : genChange(); }, false);
        P.wpx = lvl('wpx', '🏆', 'Challenge Mode', 'تحدي كل حاجة', [say('كل اللي اتعلمناه في اختبار واحد! 💪', 'Everything we learned in one test! 💪')], genChallenge, false);
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(function (n) { P['m' + n] = tableLevel(n); });
        function T(id, ico, ar, en, ids) { return { id: id, ico: ico, ar: ar, en: en, levels: ids.map(function (i) { return P[i]; }) }; }
        TRACKS = [
            T('l1', '🧱', 'المستوى ١: الأعداد والقيمة المكانية', 'Level 1: Numbers & Place Value', ['n20', 'nb10', 'pv1', 'exp2', 'pv2', 'exp3', 'nl', 'cmp', 'ord', 'eo', 'sk', 'rnd']),
            T('l2', '➕', 'المستوى ٢: الجمع والطرح', 'Level 2: Add & Subtract', ['a1', 's1', 'a2', 's2', 'dbl', 'fam', 'a3', 's3', 'a4', 's4', 'a5', 's5', 'a6', 's6', 'a7', 's7', 'wpa', 'wps', 'wpc']),
            T('l3', '✖️', 'المستوى ٣: الضرب', 'Level 3: Multiplication', ['mx', 'm1', 'm2', 'm5', 'm10', 'm3', 'm4', 'm6', 'm7', 'm8', 'm9', 'm11', 'm12', 'mm', 'mt', 'mb', 'wpm']),
            T('l4', '➗', 'المستوى ٤: القسمة', 'Level 4: Division', ['dv1', 'dv2', 'dv3', 'd2', 'd5', 'd10', 'd3', 'd4', 'd6', 'd7', 'd8', 'd9', 'dm', 'wpd']),
            T('l5', '🍕', 'المستوى ٥: الكسور والحياة', 'Level 5: Fractions & Real Life', ['f1', 'f2', 'f3', 'tm', 'mo', 'wpx'])
        ];
        ALL = []; TRACKS.forEach(function (t) { t.levels.forEach(function (l, i) { l.track = t; l.idx = i; ALL.push(l); }); });
        tmBuild();
    }
    [1, 2, 5, 10, 3, 4, 6, 7, 8, 9, 11, 12].forEach(function (n) { });
    var TRACKS = [], ALL = [];


    /* ---------- progress (separate per language) ---------- */
    function PS() {
        if (!state.p) state.p = { ar: { math: state.math || {}, games: state.games || {} }, en: { math: {}, games: {} } };
        if (!state.p[LG]) state.p[LG] = { math: {}, games: {} };
        return state.p[LG];
    }
    function prog() { return PS().math; }
    function starsOf(l) { return prog()[l.id] || 0; }
    function unlocked(l) { return true; }
    function today() { return new Date().toISOString().slice(0, 10); }
    function bumpStreak() {
        var t = today(), s = state.streak || { d: '', n: 0 }; if (s.d === t) return;
        var y = new Date(Date.now() - 864e5).toISOString().slice(0, 10); s = { d: t, n: s.d === y ? s.n + 1 : 1 }; state.streak = s; save();
    }

    /* ---------- Mike, the math teacher ---------- */
    var MIKE_T = { ok_1: 'برافو عليك يا مالك يا بطل! عين واحدة وشايفاك شاطر!', ok_2: 'الله! إجابة جامدة!', ok_3: 'كده يا مالك يا بطل! كمل!', ok_4: 'صح! أنا فرحان بيك أوي!', streak_1: 'ولا غلطة! انت نجم يا مالك!', streak_2: 'ده انت مولع! كمل كده!', retry_1: 'ولا يهمك يا مالك يا بطل! جرب تاني، انت تقدر!', retry_2: 'قربت! فكر تاني شوية.', retry_3: 'الغلط بيعلمنا! يلا تاني!', done_1: 'خلصنا الدرس! انت أحسن واحد في الدنيا يا مالك!', done_2: 'برافو يا مالك يا بطل! شلبي وأنا فخورين بيك أوي!', done_3: 'تعالى نلعب درس تاني؟ أنا جاهز!' };
    var mAud = null;
    function isMalek() { try { return kidName() === 'Malek'; } catch (e) { return false; } }
    function mikePlay(file, onend) {
        try { if (mAud) mAud.pause(); } catch (e) {}
        try { NumAudio.stop(); } catch (e) {}
        if (state && state.muted) return;
        try { mAud = new Audio('audio/mike/' + (/^(mk_|en_)/.test(file) ? '' : 'mike_') + file + '.m4a'); if (onend) { var au = mAud; au.onended = function () { if (au === mAud) onend(); }; } var p = mAud.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
    }
    function mikeId(kind) {
        var pool = { ok: ['ok_2', 'ok_4'], streak: ['streak_2'], retry: ['retry_2', 'retry_3'], done: ['done_3'] };
        if (isMalek()) { pool.ok.push('ok_1', 'ok_3'); pool.streak.push('streak_1'); pool.retry.push('retry_1'); pool.done = ['done_1', 'done_2']; }
        return pk(pool[kind]);
    }
    var MIKE_E = { ok_1: 'Great job, Malek! You are a star!', ok_2: 'Yes! Super answer!', ok_3: 'That is it, Malek! Keep going!', ok_4: 'Correct! I am so happy with you!', streak_1: 'No mistakes! You are a star, Malek!', streak_2: 'You are on fire! Keep going!', retry_1: 'No worries, Malek! Try again, you can do it!', retry_2: 'So close! Think one more time.', retry_3: 'Mistakes help us learn! Try again!', done_1: 'Lesson done! You are the best, Malek!', done_2: 'Well done, Malek! I am so proud of you!', done_3: 'Shall we play another lesson? I am ready!' };
    function mikeLine(kind) { var id = mikeId(kind); return { id: LG === 'en' ? 'en_' + id : id, t: (LG === 'en' ? MIKE_E[id] : MIKE_T[id]) }; }
    function mikeBox(text, pose, sz) { return '<div class="mkr' + (sz ? ' ' + sz : '') + '"><img src="mike/green_' + (pose || 'stand') + '.png" alt=""><div class="mkb">' + text + '</div></div>'; }
    function mikeSet(text, pose, clip) { var n = root && root.querySelector('#mkx'); if (n) { n.innerHTML = mikeBox(text, pose); emojify(n); } if (clip) mikePlay(clip); }
    var MK_AVAIL = (typeof MIKE_MATH_AVAIL !== 'undefined') ? MIKE_MATH_AVAIL : {};
    function clipId(l, p) { return (LG === 'en' ? 'en_mk_' : 'mk_') + (l.clip || l.id) + '_' + p; }

    /* ---------- spoken questions + explanations (compositional clips) ---------- */
    var NA = (typeof NumAudio !== 'undefined') ? NumAudio : { play: function (a, f) { if (f) f(false); }, stop: function () {}, qIds: function () { return null; }, numIds: function () { return []; } };
    function enIds(n) {
        n = Math.round(n); var o = [];
        if (n < 0) return o; if (n === 1000) return ['en_num_thousand'];
        if (n >= 100) { o.push('en_num_' + Math.floor(n / 100), 'en_num_hundred'); n %= 100; if (!n) return o; }
        if (n < 20) { o.push('en_num_' + n); return o; }
        o.push('en_num_t' + Math.floor(n / 10) * 10); if (n % 10) o.push('en_num_' + (n % 10)); return o;
    }
    function N(n) { return LG === 'en' ? enIds(n) : NA.numIds(n); }
    function px(ids) { return LG === 'en' ? ids.map(function (i) { return /^(ex_|op_|q_|wp_|nm_|it_)/.test(i) ? 'en_' + i : i; }) : ids; }
    function digitsOf(s) { return s.replace(/[\u0660-\u0669]/g, function (d) { return d.charCodeAt(0) - 0x660; }); }
    function wpSeq(g) {
        var k = g.k, a = g.n[0], b = g.n[1], p = g.p, p2 = g.p2, i = g.i, f1 = FM(p) ? 'f' : 'm', f2 = FM(p2) ? 'f' : 'm', o = [];
        if (LG === 'ar') {
            if (k === 'wp_add') o = ['nm_' + p, 'wp_add_' + f1].concat(N(a), 'it_' + i, 'wp_add_b_' + f1, N(b), 'wp_add_c');
            else if (k === 'wp_sub') o = ['nm_' + p, 'wp_sub_' + f1].concat(N(a), 'it_' + i, 'wp_sub_b_' + f1, N(b), 'wp_sub_c');
            else if (k === 'wp_cmp') o = ['nm_' + p, 'wp_has_' + f1].concat(N(a), 'it_' + i, 'wp_and', 'nm_' + p2, 'wp_has_' + f2, N(b), 'wp_cmp_c', 'nm_' + p);
            else if (k === 'wp_mul') o = ['nm_' + p, 'wp_add_' + f1].concat(N(a), 'wp_mul_a', N(b), 'it_' + i, 'wp_mul_b', 'it_' + i, 'wp_mul_c');
            else if (k === 'wp_share') o = [].concat(N(a), 'it_' + i, 'wp_share_a', N(b), 'wp_share_b');
            else if (k === 'wp_group') o = [].concat(N(a), 'it_' + i, 'wp_grp_a', N(b), 'wp_grp_b');
        } else {
            if (k === 'wp_add') o = ['nm_' + p, 'wp_has'].concat(N(a), 'it_' + i, 'wp_buys', N(b), 'wp_more');
            else if (k === 'wp_sub') o = ['nm_' + p, 'wp_had'].concat(N(a), 'it_' + i, 'wp_gave', N(b), 'wp_gave_b');
            else if (k === 'wp_cmp') o = ['nm_' + p, 'wp_has'].concat(N(a), 'it_' + i, 'wp_and', 'nm_' + p2, 'wp_has', N(b), 'wp_cmp_c', 'nm_' + p, 'wp_cmp_d');
            else if (k === 'wp_mul') o = ['nm_' + p, 'wp_has'].concat(N(a), 'wp_bags', N(b), 'it_' + i, 'wp_each', 'it_' + i, 'wp_inall');
            else if (k === 'wp_share') o = [].concat(N(a), 'it_' + i, 'wp_share_a', N(b), 'wp_share_b');
            else if (k === 'wp_group') o = [].concat(N(a), 'it_' + i, 'wp_grp_a', N(b), 'wp_grp_b');
        }
        return px(o);
    }
    function qSeq(q) {
        if (q.seq) return q.seq;
        try {
            if (q.seg) return wpSeq(q.seg);
            var t = digitsOf(String(q.html).replace(/<[^>]*>/g, ' ').replace(/[\u2B05\u27A1\uFE0F]/g, ' ').replace(/\s+/g, ' ').trim()), m, o;
            if (LG === 'ar') { var r = NA.qIds(q.html); if (r) return r; }
            if (/^[\d\s?\u061f+\u2212\u00D7\u00F7=\-]+$/.test(t)) {
                var tk = t.match(/\d+|[?\u061f+\u2212\u00D7\u00F7=\-]/g); o = [];
                tk.forEach(function (x, ix) { if (/\d/.test(x)) o = o.concat(N(+x)); else if (x === '+') o.push('op_plus'); else if (x === '\u2212' || x === '-') o.push('op_minus'); else if (x === '\u00D7') o.push('op_times'); else if (x === '\u00F7') o.push('op_div'); else if (x === '=') o.push('op_equals'); else o.push(ix === tk.length - 1 ? 'op_q' : 'q_unk'); });
                return px(o);
            }
            var X = function (id) { return id; };
            function skSeq(step, rest) { var o = ['q_sk'].concat(N(+step)); rest.split(/\s*\u203A\s*/).forEach(function (x) { if (/\d/.test(x)) o = o.concat(N(+x.trim())); else o.push('q_unk'); }); return px(o); }
            if (LG === 'ar') {
                if (/^\u0639\u062F\u0651 \u0627\u0644\u0646\u0642\u0637/.test(t)) return ['q_n20'];
                if ((m = t.match(/^\u062D\u0637 \u0627\u0644\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u0635\u062D: (\d+) \u061F (\d+)/))) return ['q_cmp'].concat(N(+m[1]), 'q_and', N(+m[2]));
                if ((m = t.match(/^\u0623\u0646\u0647\u064A \u0639\u062F\u062F \u0647\u0648 (\S+)/))) return [m[1].indexOf('\u0635\u063A') > -1 ? 'q_ord_min' : 'q_ord_max'];
                if ((m = t.match(/^\u0627\u0644\u0639\u062F\u062F (\d+) \u0632\u0648\u062C\u064A/))) return ['q_eo_a'].concat(N(+m[1]), 'q_eo_b');
                if ((m = t.match(/\u0628\u0627\u0644\u0640(\d+): (.*)$/)) && /^\u0643\u0645\u0651\u0644/.test(t)) return skSeq(m[1], m[2]);
                if ((m = t.match(/^\u0642\u0631\u0651\u0628 (\d+)/))) return ['q_rnd_a'].concat(N(+m[1]), 'q_rnd_b');
                if ((m = t.match(/^(\d+) \u0646\u0642\u0637\u0629 \u0628\u0646\u0648\u0632\u0639\u0647\u0627 \u0628\u0627\u0644\u062A\u0633\u0627\u0648\u064A \u0639\u0644\u0649 (\d+)/))) return [].concat(N(+m[1]), 'q_dv1_a', N(+m[2]), 'q_dv1_b');
                if ((m = t.match(/^(\d+) \u0646\u0642\u0637\u0629\u060C \u0643\u0644 \u0645\u062C\u0645\u0648\u0639\u0629 \u0641\u064A\u0647\u0627 (\d+)/))) return [].concat(N(+m[1]), 'q_dv2_a', N(+m[2]), 'q_dv2_b');
                if (/^\u0625\u064A\u0647 \u0627\u0644\u0643\u0633\u0631 \u0627\u0644\u0644\u064A \u0645\u062A\u0644\u0648\u0651\u0646/.test(t)) return ['q_f_color'];
                if (/^\u0623\u0646\u0647\u064A \u0643\u0633\u0631 \u0623\u0643\u0628\u0631/.test(t)) return ['q_f_big'];
                if ((m = t.match(/^\u0644\u0648\u0651\u0646 (\d+)\/(\d+)/))) return ['q_paint_a'].concat(N(+m[1]), 'q_of', N(+m[2]), 'q_paint_b');
                if (/^\u0627\u0644\u0633\u0627\u0639\u0629 \u0643\u0627\u0645/.test(t)) return ['q_time'];
                if (/^\u0645\u0639\u0627\u0643 \u0627\u0644\u0641\u0644\u0648\u0633/.test(t)) return ['q_money'];
                if ((m = t.match(/^\u0627\u0634\u062A\u0631\u064A\u062A \u062D\u0627\u062C\u0629 \u0628\u0640 (\d+) \u062C\u0646\u064A\u0647 \u0648\u062F\u0641\u0639\u062A (\d+)/))) return ['q_chg_a'].concat(N(+m[1]), 'q_chg_b', N(+m[2]), 'q_chg_c');
            } else {
                if (/^Count the dots/.test(t)) return ['en_q_n20'];
                if ((m = t.match(/^Choose the right sign: (\d+) \? (\d+)/))) return ['en_q_cmp'].concat(N(+m[1]), 'en_q_and', N(+m[2]));
                if ((m = t.match(/^Which number is the (biggest|smallest)/))) return [m[1] === 'smallest' ? 'en_q_ord_min' : 'en_q_ord_max'];
                if ((m = t.match(/^Is (\d+) even or odd/))) return ['en_q_eo_a'].concat(N(+m[1]), 'en_q_eo_b');
                if ((m = t.match(/^Skip count by (\d+): (.*)$/))) return skSeq(m[1], m[2]);
                if ((m = t.match(/^Round (\d+) to/))) return ['en_q_rnd_a'].concat(N(+m[1]), 'en_q_rnd_b');
                if ((m = t.match(/^(\d+) dots are shared equally into (\d+)/))) return [].concat(N(+m[1]), 'en_q_dv1_a', N(+m[2]), 'en_q_dv1_b');
                if ((m = t.match(/^(\d+) dots in groups of (\d+)/))) return [].concat(N(+m[1]), 'en_q_dv2_a', N(+m[2]), 'en_q_dv2_b');
                if (/^What fraction is colored/.test(t)) return ['en_q_f_color'];
                if (/^Which fraction is bigger/.test(t)) return ['en_q_f_big'];
                if ((m = t.match(/^Show (\d+)\/(\d+)/))) return ['en_q_paint_a'].concat(N(+m[1]), 'en_q_of', N(+m[2]), 'en_q_paint_b');
                if (/^What time is it/.test(t)) return ['en_q_time'];
                if (/^You have this money/.test(t)) return ['en_q_money'];
                if ((m = t.match(/^You buy something for (\d+) pounds and pay (\d+)/))) return ['en_q_chg_a'].concat(N(+m[1]), 'en_q_chg_b', N(+m[2]), 'en_q_chg_c');
                if ((m = t.match(/^How many tens are in (\d+)/))) return ['en_q_howmany_t'].concat(N(+m[1]));
                if ((m = t.match(/^How many hundreds are in (\d+)/))) return ['en_q_howmany_h'].concat(N(+m[1]));
                if ((m = t.match(/^What is the value of the digit (\d+) in (\d+)/))) return ['en_q_value_a'].concat(N(+m[1]), 'en_q_value_b', N(+m[2]));
                if ((m = t.match(/^What is the ones digit in (\d+)/))) return ['en_q_ones_a'].concat(N(+m[1]));
                if ((m = t.match(/^(\d+) tens and (\d+) ones/))) return [].concat(N(+m[1]), 'en_q_tens_and', N(+m[2]), 'en_q_ones_w', 'en_op_equals', 'en_op_q');
                if ((m = t.match(/^(\d+) hundreds \+ (\d+) tens \+ (\d+) ones/))) return [].concat(N(+m[1]), 'en_q_hundreds', N(+m[2]), 'en_q_tens', N(+m[3]), 'en_q_ones_w', 'en_op_equals', 'en_op_q');
                if ((m = t.match(/^On the number line: start at (\d+) and hop (\d+) steps to the (right|left)/))) return ['en_q_nl_start'].concat(N(+m[1]), 'en_q_jump', N(+m[2]), 'en_q_steps', 'en_q_' + m[3], 'en_q_arrive');
                if ((m = t.match(/^How many more to get from (\d+) to/))) return ['en_q_ten_a'].concat(N(+m[1]), 'en_q_ten_b');
            }
        } catch (e) { return null; }
        return null;
    }
    function explSeq(q, ans) { var r = explSeq0(q, ans); return r ? px(r) : r; }
    function explSeq0(q, ans) {
        var out = [], o = q.ops;
        try {
            if (o && (o.op === '+' || o.op === '−')) {
                var a = o.a, b = o.b, c = 0, bor = 0, i, L = Math.max(len(a), len(b)), nm = ['ex_ones_first', 'ex_tens_next', 'ex_hund_next'];
                out.push('ex_try');
                for (i = 0; i < L; i++) {
                    var da = dig(a, i), db = dig(b, i);
                    if (o.op === '+') { var sm = da + db + c; out.push(nm[i] || 'ex_tens_next'); out = out.concat(N(da), 'op_plus', N(db)); if (c) out = out.concat('op_plus', N(1)); out = out.concat('op_equals', N(sm)); if (sm >= 10) { out = out.concat('ex_carry_w', N(sm % 10), 'ex_carry_1'); c = 1; } else c = 0; }
                    else { var x = da - bor; out.push(i === 0 ? 'ex_sub_ones' : 'ex_sub_tens'); if (x < db) { out = out.concat('ex_cant', 'ex_borrow', N(x + 10), 'op_minus', N(db), 'op_equals', N(x + 10 - db)); bor = 1; } else { out = out.concat(N(x), 'op_minus', N(db), 'op_equals', N(x - db)); bor = 0; } }
                }
                return out.concat('ex_so', N(ans));
            }
            if (o && o.op === '×') { var sm2 = Math.min(o.a, o.b), bg = Math.max(o.a, o.b); out = ['ex_mul_def'].concat(N(sm2), 'ex_mul_groups', N(bg)); if (sm2 > 1 && sm2 <= 8) { out.push('ex_mul_skip'); for (var k = 1; k <= sm2; k++) out = out.concat(N(bg * k)); } return out.concat('ex_so', N(ans)); }
            if (o && o.op === '÷') return ['ex_try', 'ex_div_think'].concat(N(o.b), 'ex_div_gives', N(o.a), 'ex_div_so', N(ans));
            if (q.nlSeg) { var s = q.nlSeg; out = ['ex_nl_intro', s.plus ? 'ex_nl_right' : 'ex_nl_left', 'ex_nl_count']; for (var j = 1; j <= s.n; j++) out = out.concat(N(j)); return out.concat('ex_nl_land', N(ans)); }
        } catch (e) { return null; }
        return ['ex_try', 'ex_ans_is'].concat(typeof ans === 'number' ? N(ans) : []);
    }
    function speak(ids) { if (!ids || !ids.length || (state && state.muted)) return; if (ids.ar && ids.ar.length && LG === 'en') { var ar = ids.ar; NA.play(ids, function (ok) { if (ok) setTimeout(function () { NA.play(ar); }, 250); }); return; } NA.play(ids); }
    var curQ = null;
    function qBox(q) { return '<div class="qs"><button class="spk" aria-label="replay">🔊</button></div>'; }
    function wireSpeaker(q) { var b = root && root.querySelector('.spk'); if (b) b.onclick = function () { try { if (mAud) mAud.pause(); } catch (e) {} speak(qSeq(q)); }; }

    /* ---------- UI ---------- */
    var css2 = false;
    function injectCss() {
        injectCss0(); if (css2) return; css2 = true; var s = document.createElement('style');
        s.textContent = [
            '#ma[dir=ltr] .mkb{text-align:left}#ma[dir=ltr] .mkb:before{right:auto;left:-9px;border-left-color:transparent;border-right-color:#fff;border-right-width:10px;border-left-width:0}#ma[dir=ltr] .say,#ma[dir=ltr] .stp{text-align:left}#ma[dir=ltr] .mkr{flex-direction:row}',
            '.gl{display:block;font-size:.82em;opacity:.8;margin-top:2px;font-weight:700;direction:rtl;unicode-bidi:plaintext}',
            '.nlw{position:relative;margin:10px 0 4px;padding-top:34px}.nlm{position:absolute;top:0;width:60px;height:60px;margin-left:-30px;transition:left .32s cubic-bezier(.3,.7,.4,1),top .16s;z-index:3;pointer-events:none}.nlm.hop{top:-26px}.nlm.win{animation:mpop .6s}.nlc{text-align:center;font-weight:900;color:#6C4DF6;font-size:22px;min-height:30px;margin-top:6px}',
            '.cmp{display:flex;gap:10px;justify-content:center}.cmp>div{flex:1;background:#F7F4FF;border-radius:16px;padding:6px}.cmpn{font-size:15px;font-weight:800;margin-top:6px}.cmp3{display:flex;flex-direction:column;gap:6px;align-items:center}.pie{display:flex;justify-content:center;flex-wrap:wrap;gap:4px}',
            '.grps{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.grp{background:#F4F0FF;border:3px dashed #8F6BFF;border-radius:18px;padding:6px;max-width:110px;display:flex;flex-wrap:wrap;justify-content:center}',
            '.bm{margin:8px 0}.bmr{display:flex;gap:3px;margin:3px 0}.bmr span{color:#fff;font-weight:900;text-align:center;border-radius:8px;padding:6px 0;min-width:28px}.bmq{text-align:center;font-size:24px;font-weight:900;color:#6C4DF6}.wp{font-size:20px;font-weight:800;line-height:1.7;text-align:start;unicode-bidi:plaintext}',
            '.mny{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:8px 0}.cn{width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:20px;color:#fff;box-shadow:inset 0 -4px 0 rgba(0,0,0,.2),0 3px 0 rgba(0,0,0,.12)}.c1{background:#B0803A}.c5{background:#8E8E93}.c10{background:#2DA8FF}.c20{background:#22C55E}.c50{background:#FF5C7A}',
            '.qs{display:flex;justify-content:center;margin:-4px 0 6px}.spk{border:none;background:#6C4DF6;color:#fff;border-radius:999px;font-size:20px;padding:4px 16px;box-shadow:0 4px 0 #4B3BB5;cursor:pointer}.spk:active{transform:translateY(3px);box-shadow:none}',
            '.opt.t{font-size:26px}.lgs button{position:relative}.hh .stk{background:rgba(255,255,255,.2);border-radius:999px;padding:7px 12px;font-weight:900;font-size:15px}',
            '.wu{display:block;width:calc(100% - 32px);margin:14px 16px 0;border:none;border-radius:24px;padding:14px;font:inherit;font-size:18px;font-weight:900;color:#fff;background:linear-gradient(135deg,#FF5C7A,#FF9F43);box-shadow:0 6px 0 rgba(0,0,0,.2);cursor:pointer}.wu:active{transform:translateY(4px);box-shadow:0 2px 0 rgba(0,0,0,.2)}',
            '.sp{direction:ltr}'
        ].join(''); document.head.appendChild(s);
    }
    var scr = 0;
    function el(h, cls) { scr++; root.innerHTML = '<div class="mw' + (cls ? ' ' + cls : '') + '">' + h + '</div>'; root.scrollTop = 0; emojify(root); }
    function emojify(rt) {
        var w = document.createTreeWalker(rt, NodeFilter.SHOW_TEXT), list = [];
        while (w.nextNode()) if (/\p{Extended_Pictographic}/u.test(w.currentNode.nodeValue)) list.push(w.currentNode);
        var SEQ = /(\p{Extended_Pictographic}\uFE0F?(?:\u200d\p{Extended_Pictographic}\uFE0F?)*)/u;
        list.forEach(function (n) {
            var f = document.createDocumentFragment();
            n.nodeValue.split(SEQ).forEach(function (part) {
                if (/^\p{Extended_Pictographic}/u.test(part)) { var cp = Array.from(part).map(function (c) { return c.codePointAt(0).toString(16); }).filter(function (x) { return x !== 'fe0f'; }).join('-'); var im = document.createElement('img'); im.className = 'em'; im.alt = part; im.src = 'img/e/' + cp + '.svg'; im.onerror = function () { im.replaceWith(document.createTextNode(part)); }; f.appendChild(im); }
                else if (part) f.appendChild(document.createTextNode(part));
            });
            n.parentNode.replaceChild(f, n);
        });
    }
    function starStr(n) { return '⭐'.repeat(n) + '☆'.repeat(3 - n); }
    function starImgs(n) { var s = ''; for (var i = 0; i < 3; i++) s += '<span>' + (i < n ? '⭐' : '<span class="g">⭐</span>') + '</span>'; return s; }
    function close() { try { VO.stop(); if (mAud) mAud.pause(); NA.stop(); } catch (e) {} var bg = document.getElementById('mathbg'); if (bg) bg.remove(); if (root) { root.remove(); root = null; } }
    function topbar(left, mid, right) { return '<div class="mh">' + left + '<h1>' + mid + '</h1>' + right + '</div>'; }
    function setLang(l) { LG = l; state.lang = l; save(); buildCur(); if (root) root.setAttribute('dir', LG === 'en' ? 'ltr' : 'rtl'); }

    function settings() {
        var x = r(3, 8), y = r(4, 8), m = document.createElement('div'); m.className = 'mo'; m.setAttribute('dir', 'rtl');
        m.innerHTML = '<div class="mp"><h2>🔒 للكبار بس / Grown-ups</h2><div class="say">' + x + ' + ' + y + ' = ?</div><div class="dsp" id="ga" style="font-size:32px;min-height:56px">&nbsp;</div><div class="kp">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (d) { return '<button data-d="' + d + '">' + d + '</button>'; }).join('') + '<button data-d="b">⌫</button><button data-d="0">0</button><button class="go" data-d="go">✓</button></div><button class="btn o" id="gx">✕</button></div>';
        root.appendChild(m); emojify(m); var v = '';
        m.querySelector('#gx').onclick = function () { m.remove(); };
        m.querySelectorAll('.kp button').forEach(function (b) { b.onclick = function () { var d = b.getAttribute('data-d'); if (d === 'b') v = v.slice(0, -1); else if (d === 'go') { if (Number(v) === x + y) { m.remove(); panel(); } else { v = ''; } } else if (v.length < 2) v += d; m.querySelector('#ga').textContent = v || '\u00a0'; }; });
    }
    function panel() {
        var m = document.createElement('div'); m.className = 'mo'; m.setAttribute('dir', LG === 'en' ? 'ltr' : 'rtl'); var tot = ALL.reduce(function (s, l) { return s + starsOf(l); }, 0);
        m.innerHTML = '<div class="mp"><h2>⚙️ ' + tx('الإعدادات', 'Settings') + '</h2><label class="sr">' + tx('اسم الطفل', 'Child name') + '<input id="nm" value="' + (state.name || 'Malek').replace(/"/g, '') + '"></label><small>' + tx('أصوات مارد المخصوصة للاسم Malek بس. أي اسم تاني بيظهر على الشاشة.', 'Mike\'s personal lines are for the name Malek only. Any other name just shows on screen.') + '</small>'
            + '<label class="sr">' + tx('أصوات مارد', 'Mike\'s voice') + '<input type="checkbox" id="so" ' + (state.muted ? '' : 'checked') + '></label>'
            + '<label class="sr">' + tx('تقدم تلقائي', 'Auto-advance') + '<input type="checkbox" id="au" ' + (state.auto !== false ? 'checked' : '') + '></label><small>' + tx('ينتقل للتالي لوحده بعد ما مارد يخلص كلامه أو بعد الإجابة الصح. زرار التالي شغال دايماً.', 'Moves on by itself after Mike finishes or after a right answer. The Next button always works.') + '</small>'
            + '<label class="sr">' + tx('النجوم', 'Stars') + '<b>⭐ ' + tot + '</b></label><div class="credit" dir="ltr" style="color:#8A82B5">© Hazem Saleh</div><button class="btn" id="ok">' + tx('تم', 'Done') + '</button><button class="btn o" id="rs">' + tx('مسح التقدم', 'Reset progress') + '</button></div>';
        root.appendChild(m); emojify(m);
        m.querySelector('#ok').onclick = function () { state.name = m.querySelector('#nm').value.trim() || 'Malek'; state.muted = !m.querySelector('#so').checked; state.auto = m.querySelector('#au').checked; save(); m.remove(); map(); };
        m.querySelector('#rs').onclick = function () { if (confirm(tx('مسح كل النجوم؟', 'Reset all stars in this version?'))) { PS().math = {}; PS().games = {}; save(); m.remove(); map(); } };
    }

    /* ----- home ----- */
    var OFF = [0, 48, 72, 48, 0, -48, -72, -48];
    function map() {
        if (state.tab === 'tm') { if (LG !== 'en') { LG = 'en'; state.lang = 'en'; buildCur(); } return tmMap(); }
        var done = ALL.filter(function (l) { return starsOf(l) >= 1; }).length, tot = ALL.reduce(function (s, l) { return s + starsOf(l); }, 0);
        var nxt = ALL.filter(function (l) { return !starsOf(l); })[0] || ALL.filter(function (l) { return starsOf(l) < 3; })[0], nm = kidName(), str = state.streak && state.streak.n || 0;
        var h = '<div class="hh"><div class="tbr"><div class="chip">⭐ ' + tot + '</div>' + (str ? '<div class="stk">🔥 ' + str + '</div>' : '') + '<div class="logo"><b>Math Academy</b><small>أكاديمية الماث</small></div><button class="gear" id="mc" aria-label="settings">⚙️</button></div>'
            + '<div class="hero"><img src="mike/green_cheer.png" alt=""><div class="mkb">' + (LG === 'en' ? (done ? 'Hi ' + nm + '! Let\'s keep going 💪<span class="gl">أهلاً يا ' + nm + '! كمّل معايا من حيث وقفنا</span>' : 'Hi ' + nm + '! I\'m Mared Washwishny, your math teacher. Let\'s learn math in English! 🌟<span class="gl">أنا مارد وشوشني، هعلّمك الماث بالإنجليزي وأشرحلك بالعربي</span>') : (done ? 'أهلاً يا ' + nm + '! كمّل معايا من حيث وقفنا 💪' : 'أهلاً يا ' + nm + '! أنا مارد وشوشني، مدرس الماث بتاعك. هنتعلم كل حاجة خطوة بخطوة 🌟')) + '</div></div>'
            + '<div class="lgs"><button data-lg="ar" class="' + (LG === 'ar' ? 'on' : '') + '">رياضيات بالعربي<small>Arabic Math</small></button><button data-lg="en" class="' + (LG === 'en' ? 'on' : '') + '">Math in English<small>رياضيات بالإنجليزي</small></button><button data-tab="tm" id="tmb">Top Math 📘<small>الكتاب المدرسي</small></button></div>'
            + '<div class="ov"><i style="width:' + Math.round(done / ALL.length * 100) + '%"></i></div><div class="ovt">' + tx(done + ' / ' + ALL.length + ' درس خلصناه', done + ' / ' + ALL.length + ' lessons done') + '</div>'
            + (nxt ? '<button class="btn y" id="go" style="margin-top:6px">' + (done ? tx('كمّل: ', 'Continue: ') : tx('ابدأ: ', 'Start: ')) + nm2(nxt) + ' ▶</button>' : '') + '</div>'
            + (done >= 2 ? '<button class="wu" id="wu">🔥 ' + tx('تسخين اليوم (6 أسئلة)', 'Daily Warm-up (6 questions)') + '</button>' : '');
        TRACKS.forEach(function (t, ti) {
            var c = [['#FF9F43', '#F97316'], ['#22C55E', '#15A34A'], ['#8F6BFF', '#6C4DF6'], ['#FF5C7A', '#E5365A'], ['#2DA8FF', '#1D7FE0']][ti], td = t.levels.filter(function (l) { return starsOf(l) >= 1; }).length;
            h += '<div class="un" style="background:linear-gradient(135deg,' + c[0] + ',' + c[1] + ')"><div class="ui">' + t.ico + '</div><div class="ut"><b>' + tx(t.ar, t.en) + '</b><small>' + tx(t.en, t.ar) + '</small></div><div class="uc">' + td + '/' + t.levels.length + '</div></div><div class="path" style="--c:' + c[0] + '">';
            t.levels.forEach(function (l, i) {
                var st = starsOf(l), cur = nxt && nxt.id === l.id, cls = 'n' + (st >= 3 ? ' dn' : cur ? ' cur' : '');
                h += '<div class="nd" style="transform:translateX(' + (LG === 'en' ? -1 : 1) * OFF[i % 8] + 'px)">' + (cur ? '<div class="go-b">' + tx('ابدأ!', 'Go!') + '</div>' : '') + '<button class="' + cls + '" data-l="' + l.id + '">' + l.ico + '</button><div class="nl">' + nm2(l) + '</div>' + (st ? '<div class="nst">' + starImgs(st) + '</div>' : '') + '</div>';
            });
            h += '</div>';
        });
        h += '<div class="sec">🎮 ' + tx('ألعاب مع مارد', 'Games with Mike') + '</div><div class="gms">' + GAMES.map(function (g) { return '<button class="gc" data-g="' + g.id + '" style="background:linear-gradient(150deg,' + g.col + ',' + g.col2 + ')"><span class="i">' + g.ico + '</span>' + tx(g.ar, g.en) + '<small>' + tx(g.sub, g.subEn) + '</small><span class="gs">' + (gstars(g.id) ? starImgs(gstars(g.id)) : '') + '</span></button>'; }).join('') + '</div><div class="credit" dir="ltr">© Hazem Saleh</div>';
        el(h, 'home'); root.setAttribute('dir', LG === 'en' ? 'ltr' : 'rtl');
        var cb = root.querySelector('.n.cur'); if (cb) { var nd = cb.parentNode, offv = (LG === 'en' ? -1 : 1) * OFF[nxt.idx % 8]; nd.insertAdjacentHTML('afterbegin', '<img class="mm" src="mike/green_stand.png" alt="" style="' + (offv > 10 ? 'right:calc(50% + 62px)' : 'left:calc(50% + 62px)') + '">'); }
        root.querySelector('#mc').onclick = settings;
        root.querySelectorAll('[data-lg]').forEach(function (b) { b.onclick = function () { if (b.getAttribute('data-lg') !== LG) { state.tab = ''; setLang(b.getAttribute('data-lg')); window.__scrolled = 0; map(); } }; });
        root.querySelectorAll('.n').forEach(function (b) { b.onclick = function () { learn(ALL.filter(function (x) { return x.id === b.getAttribute('data-l'); })[0], 0); }; });
        root.querySelectorAll('[data-g]').forEach(function (b) { b.onclick = function () { startGame(GAMES.filter(function (g) { return g.id === b.getAttribute('data-g'); })[0]); }; });
        var tb = root.querySelector('#tmb'); if (tb) tb.onclick = tmOpen;
        var gb = root.querySelector('#go'); if (gb) gb.onclick = function () { learn(nxt, 0); };
        var wu = root.querySelector('#wu'); if (wu) wu.onclick = warmup;
        if (nxt && !window.__scrolled) { window.__scrolled = 1; var cn = root.querySelector('.n.cur'); if (cn) setTimeout(function () { try { cn.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {} }, 700); }
    }
    function warmup() {
        var pool = ALL.filter(function (l) { return starsOf(l) >= 1 && l.id.indexOf('wp') !== 0; }); if (!pool.length) pool = ALL.slice(0, 4);
        pool = pool.concat(pool.filter(function (l) { return starsOf(l) < 3; }));
        var w = { id: 'warmup', ico: '🔥', ar: 'تسخين اليوم', en: 'Daily Warm-up', learn: [], mc: false, gen: function () { var l = pk(pool), q = l.gen(); q._mc = l.mc; return q; }, track: { levels: [] }, idx: 0 };
        session(w, 'practice', null, 6);
    }

    /* ----- lesson ----- */
    function learn(l, p) {
        var pages = l.learn.concat('__check__'), isCheck = p >= pages.length - 1, pg = pages[p], first = '', rest = '', q = null;
        if (p === 0) l._ck = null;
        if (isCheck) {
            if (!l._ck) l._ck = l.gen();
            q = l._ck; curQ = q; first = tx('نتأكد إنك فاهم قبل ما نكمل! اختار الإجابة الصح 👇', 'Let\'s check you got it before we go on! Pick the right answer 👇'); rest = '<div class="q">' + q.html + '</div>' + (q.vis || '') + qBox() + '<div id="ex"></div><div class="opts">' + optsOf(q).map(function (o) { return optBtn(q, o); }).join('') + '</div>';
        } else {
            var mm = pg.match(/<div class="say">([\s\S]*?)<\/div>/); rest = pg;
            if (mm) { first = mm[1]; rest = pg.replace(mm[0], ''); } else first = pk(tx(['يلا نشوف مع بعض!', 'بص كده معايا!'], ['Let\'s look together!', 'Look with me!']));
        }
        var cid = clipId(l, p), g0 = scr + 1; if (MK_AVAIL[cid] && !isCheck) { var adv = function () { if (state.auto !== false && !isCheck && g0 === scr && root) setTimeout(function () { if (g0 === scr && root) learn(l, p + 1); }, 1200); }, arId = l.tm ? 'mk_' + (l.clip || l.id) + '_' + p : null; mikePlay(cid, function () { if (arId && MK_AVAIL[arId] && g0 === scr && root) setTimeout(function () { if (g0 === scr && root) mikePlay(arId, adv); }, 350); else adv(); }); } else { try { if (mAud) mAud.pause(); NA.stop(); } catch (e) {} }
        var hasCard = rest.replace(/<[^>]*>/g, '').trim() || /<(svg|i |div class="(ex|mb|pt|col|ar|tb|sk|pie|nlw|grps|bm|mny|cmp))/.test(rest);
        el(topbar('<button class="mx" id="mc">✕</button>', l.ico + ' ' + nm2(l), '<div class="mst">' + (p + 1) + '/' + pages.length + '</div>') + '<div class="pg"><i style="width:' + Math.round((p + 1) / pages.length * 100) + '%"></i></div><div id="mkx">' + mikeBox(first, 'stand') + '</div>'
            + (hasCard ? '<div class="card">' + rest + '</div>' : '')
            + '<div class="bar">' + (p ? '<button class="btn o" id="pv">' + (LG === 'en' ? '◀' : '▶') + '</button>' : '') + '<button class="btn" id="nx"' + (isCheck ? ' style="display:none"' : '') + '>' + (isCheck ? tx('يلا نتدرب! 🚀', 'Let\'s practice! 🚀') : tx('التالي', 'Next')) + '</button></div>');
        var cardEl = root.querySelector('.card'); if (cardEl && cardEl.querySelector('.nlw[data-auto="1"]')) nlRun(cardEl);
        root.querySelector('#mc').onclick = map;
        root.querySelector('#nx').onclick = function () { isCheck ? session(l, 'practice') : learn(l, p + 1); };
        var pv = root.querySelector('#pv'); if (pv) pv.onclick = function () { learn(l, p - 1); };
        if (isCheck) {
            wireSpeaker(q); setTimeout(function () { if (root && g0 === scr) speak(qSeq(q)); }, 300);
            var wrong = 0;
            root.querySelectorAll('.opt').forEach(function (b) {
                b.onclick = function () {
                    if (b.getAttribute('data-v') === String(q.ans)) {
                        b.classList.add('ok'); var ml = mikeLine('ok'); mikeSet(tx('صح! كده انت فاهم الفكرة 👏', 'Right! You understand the idea 👏'), 'cheer', ml.id); try { SFX.play('chime'); } catch (e) {}
                        root.querySelectorAll('.opt').forEach(function (o) { o.onclick = null; }); root.querySelector('#nx').style.display = 'block';
                    } else { wrong++; b.classList.add('no'); b.onclick = null; var rl = mikeLine('retry'); mikeSet(rl.t, 'stand', rl.id); if (wrong >= 2) { root.querySelector('#ex').innerHTML = '<div class="hint">' + q.exp + '</div>'; emojify(root.querySelector('#ex')); var ec = root.querySelector('#ex'); nlRun(ec, null, true); } }
                };
            });
        }
    }
    function optsOf(q) { if (q.opts) return q.opts; return distract(q); }
    function optBtn(q, o) { var lbl = q.optLbl ? q.optLbl[o] : o; return '<button class="opt' + (String(lbl).length > 4 ? ' t' : '') + '" data-v="' + o + '" dir="ltr">' + (o === '<' ? '&lt;' : o === '>' ? '&gt;' : lbl) + '</button>'; }
    function distract(q) {
        var a = q.ans, set = {}, out = [a]; set[a] = 1;
        var cs = a < 20 ? [a + 1, a - 1, a + 2, a - 2, a + 3, a - 3, a + 5, a - 5, a + 10] : a < 300 ? [a + 1, a - 1, a + 2, a - 2, a + 10, a - 10, a + 5, a - 5, Number(String(a).split('').reverse().join(''))] : [a + 1, a - 1, a + 10, a - 10, a + 100, a - 100, a + 5, a - 5, Number(String(a).split('').reverse().join(''))];
        var c = shuf(cs);
        for (var i = 0; i < c.length && out.length < 4; i++) { if (c[i] >= 0 && !set[c[i]]) { set[c[i]] = 1; out.push(c[i]); } }
        var k = 3; while (out.length < 4) { if (!set[a + k]) { set[a + k] = 1; out.push(a + k); } k++; }
        return shuf(out);
    }

    /* ----- feedback sheet ----- */
    function sheet(kind, title, line, mid, btnText, onBtn, autoMs, noClip) {
        var old = root.querySelector('.fb'); if (old) old.remove();
        var d = document.createElement('div'); d.className = 'fb ' + kind;
        d.innerHTML = '<img class="mi" src="mike/green_' + (kind === 'ok' ? 'cheer' : 'stand') + '.png" alt=""><div class="ft"><div class="t">' + title + '</div><div class="l">' + line + '</div></div>' + (btnText ? '<button class="btn">' + btnText + '</button>' : '');
        root.appendChild(d); emojify(d); var g = scr;
        if (btnText) d.querySelector('.btn').onclick = function () { d.remove(); onBtn(); };
        if (autoMs) setTimeout(function () { if (g === scr && root && d.parentNode) { d.remove(); onBtn(); } }, autoMs);
        if (mid && !noClip) mikePlay(mid);
    }

    /* ----- practice / quiz ----- */
    function session(l, mode, st, nOverride) {
        var N = nOverride || (mode === 'practice' ? 6 : 8);
        st = st || { i: 0, right: 0, mode: mode, seen: {}, N: N };
        if (st.i >= N) { if (mode === 'practice' && l.id !== 'warmup') { quizIntro(l); return; } return finish(l, st); }
        var q; for (var t = 0; t < 30; t++) { q = l.gen(); if (!st.seen[q.html]) break; } st.seen[q.html] = 1; curQ = q;
        var useMc = q.opts ? true : (q._mc != null ? q._mc : l.mc), tries = 0, done = false, val = '';
        var tag = l.id === 'warmup' ? '<span class="tag" style="background:#FF9F43">🔥 ' + tx('تسخين', 'Warm-up') + '</span>' : mode === 'practice' ? '<span class="tag" style="background:#2DA8FF">' + tx('تدريب', 'Practice') + '</span>' : '<span class="tag" style="background:#FF5C7A">' + tx('اختبار ⭐', 'Quiz ⭐') + '</span>';
        var h = topbar('<button class="mx" id="mc">✕</button>', tag, '<div class="mst">' + (st.i + 1) + '/' + N + '</div>') + '<div class="pg"><i style="width:' + Math.round(st.i / N * 100) + '%"></i></div>'
            + '<div id="mkx">' + mikeBox(mode === 'practice' ? tx('خد وقتك، وممكن تضغط على التلميح 💡', 'Take your time, and tap the hint if you need it 💡') : tx('ركز وفكر، انت تقدر!', 'Focus and think, you can do it!'), 'stand', 'sm') + '</div><div class="card"><div class="q">' + q.html + '</div>' + (q.vis || '') + qBox() + '<div id="ex"></div>';
        if (useMc) h += '<div class="opts">' + optsOf(q).map(function (o) { return optBtn(q, o); }).join('') + '</div>';
        else h += '<div class="dsp" id="dsp">&nbsp;</div><div class="kp">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (d) { return '<button data-d="' + d + '">' + d + '</button>'; }).join('') + '<button data-d="b">⌫</button><button data-d="0">0</button><button class="go" data-d="go">✓</button></div>';
        h += '</div>' + (mode === 'practice' ? '<button class="btn o" id="hn">💡 ' + tx('تلميح', 'Hint') + '</button>' : '');
        el(h); var gq = scr; wireSpeaker(q); setTimeout(function () { if (root && gq === scr) speak(qSeq(q)); }, 250);
        function exp(sp) { var e = root.querySelector('#ex'); if (e) { e.innerHTML = '<div class="hint">' + q.exp + '</div>'; emojify(e); nlRun(e, null, true); } if (sp) { try { if (mAud) mAud.pause(); } catch (x) {} speak(explSeq(q, q.ans)); } }
        function nextQ() { st.i++; session(l, mode, st, nOverride); }
        function good(node) {
            done = true; if (tries === 0) st.right++; if (node) node.classList.add('ok'); try { SFX.play('chime'); } catch (e) {}
            st.streak = tries === 0 ? (st.streak || 0) + 1 : 0; var ml = mikeLine(st.streak === 3 ? 'streak' : 'ok');
            sheet('ok', st.streak === 3 ? tx('🔥 ولا غلطة!', '🔥 No mistakes!') : pk(tx(['برافو!', 'ممتاز!', 'جامد!', 'شاطر!'], ['Bravo!', 'Excellent!', 'Awesome!', 'Great job!'])), ml.t, ml.id, state.auto === false ? tx('التالي', 'Next') : '', nextQ, state.auto === false ? 0 : 2200);
        }
        function bad(node) {
            tries++; if (node) { node.classList.add('no'); setTimeout(function () { node.classList.remove('no'); }, 400); }
            st.streak = 0; var rl = mikeLine('retry');
            if (tries >= 2) { done = true; exp(false); var ans = q.optLbl ? q.optLbl[q.ans] : q.ans; sheet('no', tx('الإجابة الصح: ', 'Right answer: ') + ans, rl.t, null, tx('التالي', 'Next'), nextQ, 0, true); try { if (mAud) mAud.pause(); } catch (x) {} speak(explSeq(q, q.ans)); }
            else { if (mode === 'practice') exp(false); sheet('no', tx('قربت!', 'Almost!'), rl.t, rl.id, tx('حاول تاني', 'Try again'), function () { speak(qSeq(q)); }, 0); }
        }
        root.querySelector('#mc').onclick = map;
        var hn = root.querySelector('#hn'); if (hn) hn.onclick = function () { exp(true); };
        if (useMc) root.querySelectorAll('.opt').forEach(function (b) { b.onclick = function () { if (done) return; b.getAttribute('data-v') === String(q.ans) ? good(b) : bad(b); }; });
        else {
            var dsp = root.querySelector('#dsp');
            root.querySelectorAll('.kp button').forEach(function (b) {
                b.onclick = function () {
                    if (done) return; var d = b.getAttribute('data-d');
                    if (d === 'b') val = val.slice(0, -1); else if (d === 'go') { if (!val) return; if (Number(val) === q.ans) good(dsp); else { bad(dsp); val = ''; } }
                    else if (val.length < 4) val += d;
                    dsp.textContent = val || '\u00a0';
                };
            });
        }
    }
    function quizIntro(l) {
        el(mikeBox(tx('كده خلصنا التدريب! دلوقتي الاختبار، من غير تلميحات. هتجيب نجوم على قد إجاباتك ⭐', 'Practice is done! Now the quiz, no hints. You earn stars for your right answers ⭐'), 'cheer') + '<div class="card"><div class="stars">🎯</div><div class="q">' + tx('جاهز للاختبار؟', 'Ready for the quiz?') + '</div></div><div class="bar"><button class="btn" id="go">' + tx('ابدأ الاختبار ⭐', 'Start the quiz ⭐') + '</button></div>');
        root.querySelector('#go').onclick = function () { session(l, 'quiz'); };
    }
    function confetti() {
        var e = ['⭐', '🌟', '🎉', '✨', '🎈'];
        for (var i = 0; i < 30; i++) { var c = document.createElement('div'); c.className = 'cf'; c.textContent = e[i % e.length]; c.style.left = r(2, 94) + 'vw'; c.style.animationDelay = (r(0, 12) / 10) + 's'; c.style.animationDuration = (1.8 + r(0, 12) / 10) + 's'; root.appendChild(c); emojify(c); (function (n) { setTimeout(function () { n.remove(); }, 3800); })(c); }
    }
    function resultView(stars, title, sub, retryTxt, nxtFn, retryFn, nxtTxt) {
        var dl = mikeLine('done'); mikePlay(dl.id); setTimeout(function () { if (stars >= 2 && root) confetti(); }, 200); bumpStreak();
        el('<div class="rs"><div class="glow"><img src="mike/green_cheer.png" alt=""></div><div class="rst">' + starImgs(stars) + '</div><h2>' + title + '</h2><p>' + sub + '</p>' + mikeBox(dl.t, 'stand', 'sm') + '</div><div class="bar" style="flex-wrap:wrap">' + (nxtFn ? '<button class="btn" id="nx" style="flex-basis:100%">' + nxtTxt + '</button>' : '') + '<button class="btn o" id="rt" style="flex:1">' + retryTxt + '</button><button class="btn o" id="mp" style="flex:1">🗺️ ' + tx('الخريطة', 'Map') + '</button></div>');
        var n = root.querySelector('#nx'); if (n) n.onclick = nxtFn; root.querySelector('#rt').onclick = retryFn; root.querySelector('#mp').onclick = map;
    }
    function finish(l, st) {
        var N = st.N || 8, pct = st.right / N, stars = pct >= .9 ? 3 : pct >= .7 ? 2 : pct >= .5 ? 1 : 0;
        if (l.id === 'warmup') { resultView(stars, tx('تسخين جامد! 🔥', 'Great warm-up! 🔥'), st.right + ' / ' + N + tx(' إجابة صح', ' right'), tx('🔁 تاني', '🔁 Again'), null, warmup, ''); return; }
        var old = starsOf(l); if (stars > old) { prog()[l.id] = stars; save(); }
        var nxt = l.track.levels[l.idx + 1] || (l.track.nextTrack && l.track.nextTrack.levels[0]);
        if (!nxt && !l.tm) { var ti = TRACKS.indexOf(l.track); nxt = TRACKS[ti + 1] && TRACKS[ti + 1].levels[0]; }
        resultView(stars, stars === 3 ? tx('ممتاز يا بطل! 🏆', 'Excellent, champion! 🏆') : stars >= 1 ? tx('شاطر! 💪', 'Well done! 💪') : tx('جرب تاني، هتعدّيها!', 'Try again, you will get it!'), st.right + ' / ' + N + tx(' إجابة صح', ' right answers'), tx('🔁 جرب تاني', '🔁 Try again'), nxt && stars >= 1 ? function () { learn(nxt, 0); } : null, function () { session(l, 'practice'); }, tx('الدرس اللي بعده ▶', 'Next lesson ▶'));
    }


    function injectCss0() {
        if (css) return; css = true;
        var s = document.createElement('style'); s.textContent = [
            '#ma{position:fixed;inset:0;z-index:9999;background:transparent;font-family:"Baloo 2","Baloo Bhaijaan 2",ui-rounded,system-ui,sans-serif;overflow-y:auto;-webkit-overflow-scrolling:touch;color:#2B2350;direction:rtl;-webkit-tap-highlight-color:transparent}#ma *{box-sizing:border-box}',
            '.mathbg{position:fixed;inset:0;z-index:9998;overflow:hidden;background:radial-gradient(circle at 15% 8%,#7B4DFF 0,transparent 45%),radial-gradient(circle at 90% 35%,#1FA3FF 0,transparent 40%),radial-gradient(circle at 20% 90%,#FF4F9A 0,transparent 42%),linear-gradient(165deg,#3A1FB0,#4B2FD6 45%,#2B1B94)}.mathbg:before{content:"";position:absolute;inset:0;background:linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px) 0 0/34px 34px,linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px) 0 0/34px 34px}.mathbg span{position:absolute;font-weight:900;color:rgba(255,255,255,.2);font-family:ui-rounded,system-ui,sans-serif;animation:mdr linear infinite;will-change:transform}.mathbg span.o{border:4px solid rgba(255,255,255,.2);background:none;color:transparent}.mathbg span.sq{border:4px solid rgba(255,255,255,.18);color:transparent;border-radius:10px}@keyframes mdr{0%{transform:translateY(0) rotate(0)}50%{transform:translateY(-34px) rotate(14deg)}100%{transform:translateY(0) rotate(0)}}.mh h1,.sec,.nl{color:#fff!important}.nl{text-shadow:0 2px 0 rgba(0,0,0,.25)}.path:before{border-left-color:rgba(255,255,255,.35)}.credit{color:rgba(255,255,255,.6)}.bar{background:linear-gradient(180deg,rgba(43,27,148,0),#2B1B94 45%)}.mh .mx{color:#5B3DF0}',
            '.mw{max-width:520px;margin:0 auto;min-height:100%;padding:max(12px,env(safe-area-inset-top)) 16px 120px;position:relative}.mw.home{padding:0 0 40px}',
            '.mw>*{animation:mup .4s both}.mw>*:nth-child(2){animation-delay:.05s}.mw>*:nth-child(3){animation-delay:.1s}.mw>*:nth-child(4){animation-delay:.15s}.mw>*:nth-child(n+5){animation-delay:.2s}@keyframes mup{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}',
            /* header / progress */
            '.mh{display:flex;align-items:center;gap:10px;margin:6px 0 12px}.mh h1{flex:1;font-size:19px;margin:0;text-align:center;font-weight:900;color:#4B3BB5}.mx{border:none;background:#fff;border-radius:50%;width:46px;height:46px;font-size:20px;box-shadow:0 4px 0 #DCD3FF;cursor:pointer;color:#6C4DF6;font-weight:900;flex:none;display:flex;align-items:center;justify-content:center}.mx:active{transform:translateY(3px);box-shadow:none}',
            '.mst{background:#fff;color:#8A5A00;border-radius:999px;padding:6px 14px;font-weight:900;box-shadow:0 4px 0 #FFE3A0;flex:none;font-size:15px}',
            '.pg{height:16px;border-radius:10px;background:#E1D9FF;overflow:hidden;margin:0 0 14px;box-shadow:inset 0 2px 0 rgba(0,0,0,.06)}.pg i{display:block;height:100%;border-radius:10px;background:linear-gradient(90deg,#22C55E,#7EE787);transition:width .5s;position:relative}.pg i:after{content:"";position:absolute;left:8px;right:8px;top:3px;height:4px;border-radius:4px;background:rgba(255,255,255,.45)}',
            /* Mike + bubble */
            '.mkr{display:flex;align-items:center;gap:6px;margin:2px 0 12px}.mkr>img{width:96px;height:96px;flex:none;filter:drop-shadow(0 6px 0 rgba(75,59,181,.14));animation:mfl 3.4s ease-in-out infinite}@keyframes mfl{50%{transform:translateY(-6px) rotate(-2.5deg)}}',
            '.mkb{position:relative;background:#fff;border-radius:24px;padding:12px 16px;font-size:17px;font-weight:800;line-height:1.6;text-align:right;flex:1;box-shadow:0 5px 0 #DCD3FF;unicode-bidi:plaintext}.mkb:before{content:"";position:absolute;right:-9px;top:50%;margin-top:-10px;border:10px solid transparent;border-left-color:#fff;border-right:0}',
            '.mkr.sm>img{width:68px;height:68px}.mkr.sm .mkb{font-size:15px;padding:8px 12px}',
            /* cards, buttons */
            '.card{background:#fff;border-radius:30px;padding:18px 16px;box-shadow:0 8px 0 #DCD3FF;text-align:center;margin-bottom:14px}',
            '.btn{display:block;width:100%;border:none;border-radius:22px;padding:15px;margin-top:12px;font:inherit;font-size:20px;font-weight:900;color:#fff;background:#22C55E;box-shadow:0 6px 0 #15803D;cursor:pointer;letter-spacing:.2px}.btn:active{transform:translateY(4px);box-shadow:0 2px 0 #15803D}.btn.o{background:#fff;color:#6C4DF6;box-shadow:0 5px 0 #DCD3FF}.btn.y{background:#FFC83D;color:#5A3A00;box-shadow:0 6px 0 #D99A00}',
            '.bar{position:fixed;left:0;right:0;bottom:0;z-index:20;padding:12px 16px max(14px,env(safe-area-inset-bottom));background:linear-gradient(180deg,rgba(243,239,255,0),#F3EFFF 38%);display:flex;gap:10px;max-width:520px;margin:0 auto}.bar .btn{margin:0}.bar .btn.o{width:auto;padding:15px 20px;flex:none}',
            '.say{font-size:17px;font-weight:700;margin:10px 0;line-height:1.7;unicode-bidi:plaintext}.stp{background:#F4F0FF;border-radius:18px;padding:12px 14px;font-size:16px;font-weight:700;margin:10px 0;line-height:1.9;text-align:right;unicode-bidi:plaintext}.ex{margin:10px 0;font-size:20px}.big2{font-size:26px;font-weight:900}',
            '.q{font-size:21px;font-weight:900;margin:4px 0 8px;line-height:1.5}.big{font-size:38px;font-weight:900;color:#6C4DF6}',
            /* visuals */
            '.mb{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:8px 0}.mbg{background:#F7F4FF;border-radius:16px;padding:7px 9px}.mbl{font-size:13px;font-weight:900}.mbr{display:flex;flex-wrap:wrap;gap:3px;justify-content:center;max-width:210px;margin-top:3px}',
            'i.bo{display:inline-block;width:15px;height:15px;background:#22C55E;border-radius:5px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.2);margin:1px}i.bt{display:inline-block;width:15px;height:46px;border-radius:5px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.2);margin:1px;background:repeating-linear-gradient(#2DA8FF 0 4px,#1D7FE0 4px 5px)}i.bh{display:inline-block;width:48px;height:48px;border-radius:7px;box-shadow:inset 0 -4px 0 rgba(0,0,0,.2);margin:1px;background:linear-gradient(90deg,transparent 4px,rgba(0,0,0,.13) 4px 5px) 0 0/5px 5px,linear-gradient(transparent 4px,rgba(0,0,0,.13) 4px 5px) 0 0/5px 5px,#FF9F43}',
            '.pt{display:flex;gap:8px;justify-content:center;margin:8px 0}.ptc{width:88px;border-radius:16px;overflow:hidden;background:#fff;border:3px solid #E6DFFF}.pth{color:#fff;font-weight:900;padding:3px;font-size:15px}.ptd{font-size:42px;font-weight:900}',
            '.col{display:inline-block;direction:ltr;font-size:36px;font-weight:900;font-family:ui-monospace,Menlo,monospace}.cr{display:flex;justify-content:flex-end}.cr span{width:38px;text-align:center}.cr .op{width:32px;color:#8F6BFF}.cc span{font-size:16px;height:22px;color:#E5365A}.cl{border-top:4px solid #2B2350;margin:2px 0}.ans span{min-height:48px}',
            '.ar{display:grid;gap:4px;justify-content:center;margin:8px auto}.ar i{width:16px;height:16px;border-radius:50%;background:#8F6BFF}.tb{display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:17px;font-weight:800}.tb div{background:#F4F0FF;border-radius:14px;padding:7px 11px;display:flex;justify-content:space-between}.tb b{color:#6C4DF6}',
            '.sk{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:4px;font-size:20px;font-weight:900}.sk span{background:#FFC83D;color:#5A3A00;border-radius:12px;padding:2px 9px;box-shadow:0 3px 0 #D99A00}.sk em{color:#aaa;font-style:normal}',
            /* answers */
            '.opts{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}.opt{border:3px solid #E1D9FF;border-radius:22px;padding:16px 6px;font:inherit;font-size:32px;font-weight:900;background:#fff;color:#2B2350;box-shadow:0 6px 0 #DCD3FF;cursor:pointer;transition:transform .1s}.opt:active{transform:translateY(4px);box-shadow:0 2px 0 #DCD3FF}.opt.ok{background:#D9F8E3;border-color:#22C55E;color:#137A3A;box-shadow:0 6px 0 #22C55E;animation:mpop .45s}.opt.no{background:#FFE1E7;border-color:#FF5C7A;color:#B3243F;box-shadow:0 6px 0 #FF5C7A;animation:mshk .35s}@keyframes mpop{40%{transform:scale(1.1)}}@keyframes mshk{25%{transform:translateX(-9px)}75%{transform:translateX(9px)}}',
            '.dsp{font-size:44px;font-weight:900;background:#F4F0FF;border:3px solid #E1D9FF;border-radius:22px;padding:6px;min-height:68px;direction:ltr;margin-top:10px;color:#6C4DF6}.dsp.no{animation:mshk .35s;background:#FFE1E7}.dsp.ok{background:#D9F8E3}',
            '.kp{direction:ltr;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.kp button{border:3px solid #E1D9FF;border-radius:18px;padding:12px;font:inherit;font-size:27px;font-weight:900;background:#fff;box-shadow:0 5px 0 #DCD3FF;color:#2B2350;cursor:pointer}.kp button:active{transform:translateY(3px);box-shadow:0 2px 0 #DCD3FF}.kp .go{background:#22C55E;border-color:#22C55E;color:#fff;box-shadow:0 5px 0 #15803D}',
            '.hint{background:#FFF7E0;border-radius:18px;padding:10px;margin-top:12px;text-align:center}.tag{display:inline-block;border-radius:999px;padding:3px 14px;font-size:14px;font-weight:900;color:#fff}.stars{font-size:54px;margin:6px 0}',
            /* feedback sheet */
            '.fb{position:fixed;left:0;right:0;bottom:0;z-index:30;padding:16px 18px max(18px,env(safe-area-inset-bottom));border-radius:30px 30px 0 0;animation:msl .28s both;max-width:520px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:10px;box-shadow:0 -10px 30px rgba(43,35,80,.18)}@keyframes msl{from{transform:translateY(100%)}to{transform:none}}',
            '.fb.ok{background:#D9F8E3;color:#137A3A}.fb.no{background:#FFE1E7;color:#B3243F}.fb img.mi{width:70px;height:70px;flex:none}.fb .ft{flex:1}.fb .t{font-size:24px;font-weight:900}.fb .l{font-size:15px;font-weight:800;opacity:.9}.fb .btn{margin:6px 0 0;flex-basis:100%}.fb.ok .btn{background:#16A34A;box-shadow:0 6px 0 #166534}.fb.no .btn{background:#FF5C7A;box-shadow:0 6px 0 #C93A57}',
            /* home */
            '.hh{background:linear-gradient(165deg,#5B3DF0,#8F6BFF 62%,#B08CFF);border-radius:0 0 42px 42px;padding:max(12px,env(safe-area-inset-top)) 16px 20px;position:relative;overflow:hidden;box-shadow:0 10px 0 #DCD3FF;color:#fff}.hh:before,.hh:after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.1)}.hh:before{width:210px;height:210px;left:-70px;top:30px}.hh:after{width:130px;height:130px;right:-30px;bottom:-40px}.hh>*{position:relative;z-index:1}',
            '.tbr{display:flex;align-items:center;gap:10px}.tbr .logo{flex:1;text-align:center;line-height:1.05}.logo b{display:block;font-size:22px;font-weight:900;letter-spacing:.3px}.logo small{font-size:12px;font-weight:800;opacity:.85}.chip{background:rgba(255,255,255,.2);border-radius:999px;padding:7px 14px;font-weight:900;font-size:15px;flex:none;backdrop-filter:blur(4px)}.gear{border:none;background:rgba(255,255,255,.2);width:44px;height:44px;border-radius:50%;font-size:20px;cursor:pointer;flex:none;display:flex;align-items:center;justify-content:center}',
            '.hero{display:flex;align-items:center;gap:6px;margin:10px 0 6px}.hero>img{width:128px;height:128px;flex:none;filter:drop-shadow(0 8px 0 rgba(0,0,0,.18));animation:mfl 3.4s ease-in-out infinite}.hero .mkb{color:#2B2350;font-size:16px;box-shadow:0 5px 0 rgba(0,0,0,.14)}',
            '.lgs{display:flex;gap:6px;background:rgba(0,0,0,.2);border-radius:20px;padding:5px;margin:10px 0 6px}.lgs button{flex:1;border:none;border-radius:16px;padding:8px 4px;font:inherit;font-weight:900;font-size:15px;background:transparent;color:#fff;line-height:1.15;cursor:pointer}.lgs button small{display:block;font-size:11px;opacity:.85;font-weight:700}.lgs button.on{background:#fff;color:#5B3DF0;box-shadow:0 4px 0 rgba(0,0,0,.15)}',
            '.ov{height:12px;background:rgba(255,255,255,.28);border-radius:8px;overflow:hidden;margin:6px 2px 4px}.ov i{display:block;height:100%;background:linear-gradient(90deg,#FFC83D,#FFE27A);border-radius:8px;transition:width .6s}.ovt{font-size:13px;font-weight:800;opacity:.95;text-align:center;margin-bottom:6px}',
            '.un{margin:26px 16px 4px;border-radius:24px;padding:12px 14px;display:flex;align-items:center;gap:10px;color:#fff;box-shadow:0 6px 0 rgba(0,0,0,.16)}.un .ui{width:46px;height:46px;border-radius:15px;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-size:26px;flex:none}.un .ut{flex:1;line-height:1.2}.un .ut b{display:block;font-size:18px;font-weight:900}.un .ut small{font-size:12px;opacity:.9;font-weight:700}.un .uc{background:rgba(0,0,0,.18);border-radius:999px;padding:4px 12px;font-weight:900;font-size:14px}',
            '.path{position:relative;padding:14px 0 4px}.path:before{content:"";position:absolute;top:0;bottom:0;left:50%;border-left:6px dotted #D6CBFF;transform:translateX(-3px)}.nd{position:relative;display:flex;flex-direction:column;align-items:center;margin:0 0 14px}',
            '.n{width:80px;height:80px;border-radius:50%;border:none;font:inherit;position:relative;background:#fff;box-shadow:0 7px 0 #D6CBFF,inset 0 0 0 6px var(--c);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:34px;transition:transform .12s}.n:active{transform:translateY(5px);box-shadow:0 2px 0 #D6CBFF,inset 0 0 0 6px var(--c)}.n .em{height:38px;width:38px}',
            '.n.dn{background:linear-gradient(160deg,#FFE27A,#FFB800);box-shadow:0 7px 0 #D48A00,inset 0 0 0 5px #FFF3B8}.n.cur{background:var(--c);box-shadow:0 7px 0 rgba(0,0,0,.25),0 0 0 8px rgba(255,255,255,.9),0 0 0 11px var(--c);animation:mpl 1.8s infinite}@keyframes mpl{50%{transform:scale(1.07)}}.n.lk{background:#E8E4F5;box-shadow:0 7px 0 #CFC8E6;filter:grayscale(1);opacity:.75}',
            '.nl{font-size:13px;font-weight:900;margin-top:10px;max-width:130px;text-align:center;line-height:1.2;color:#4B3BB5}.nst{display:flex;gap:1px;margin-top:3px}.nst .em{height:15px;width:15px}.nst .g{filter:grayscale(1);opacity:.3}',
            '.go-b{position:absolute;top:-30px;background:#fff;color:var(--c);font-weight:900;border-radius:14px;padding:3px 12px;font-size:14px;box-shadow:0 4px 0 #DCD3FF;animation:mbn 1.2s infinite;z-index:2}.go-b:after{content:"";position:absolute;left:50%;bottom:-7px;margin-left:-7px;border:7px solid transparent;border-top-color:#fff;border-bottom:0}@keyframes mbn{50%{transform:translateY(-5px)}}',
            '.mm{position:absolute;width:62px;height:62px;filter:drop-shadow(0 4px 0 rgba(75,59,181,.15));animation:mfl 3s ease-in-out infinite;top:6px}',
            '.sec{margin:28px 18px 10px;font-size:20px;font-weight:900;color:#4B3BB5}.gms{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 16px}.gc{border:none;border-radius:26px;padding:16px 8px 12px;font:inherit;font-weight:900;color:#fff;box-shadow:0 7px 0 rgba(0,0,0,.2);cursor:pointer;font-size:17px;line-height:1.25;position:relative;overflow:hidden}.gc:after{content:"";position:absolute;width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,.16);right:-26px;top:-30px}.gc .i{display:block;margin-bottom:4px}.gc .i .em{height:50px;width:50px}.gc small{display:block;font-weight:700;opacity:.92;font-size:12px;margin-top:2px}.gc .gs{display:block;height:20px;margin-top:6px}.gc .gs .em{height:17px;width:17px}.gc:active{transform:translateY(4px);box-shadow:0 3px 0 rgba(0,0,0,.2)}',
            '.credit{text-align:center;font-size:12px;color:#8A82B5;opacity:.9;padding:22px 0 10px;font-weight:700}',
            /* results */
            '.rs{text-align:center;padding-top:10px}.rs .glow{width:210px;height:210px;margin:0 auto;border-radius:50%;background:radial-gradient(#fff,rgba(255,255,255,0) 70%),radial-gradient(#FFE27A,#FFC83D 60%,rgba(255,200,61,0) 72%);display:flex;align-items:center;justify-content:center}.rs .glow img{width:170px;height:170px;animation:mfl 3s ease-in-out infinite}.rs .rst{margin:6px 0 2px}.rs .rst .em{height:60px;width:60px;margin:0 3px;animation:mst .6s both}.rs .rst .g{filter:grayscale(1);opacity:.3}.rs .rst span:nth-child(2) .em{animation-delay:.25s}.rs .rst span:nth-child(3) .em{animation-delay:.5s}@keyframes mst{0%{transform:scale(0) rotate(-60deg)}70%{transform:scale(1.25) rotate(8deg)}100%{transform:none}}.rs h2{margin:4px 0;font-size:26px;font-weight:900;color:#4B3BB5}.rs p{margin:2px 0 8px;font-weight:800;font-size:17px}',
            '.cf{position:fixed;top:-20px;z-index:10001;font-size:24px;pointer-events:none;animation:mfall 2.4s linear forwards}@keyframes mfall{to{transform:translateY(110vh) rotate(540deg);opacity:.9}}',
            /* splash */
            '.sp{position:fixed;inset:0;z-index:10002;background:linear-gradient(165deg,#5B3DF0,#8F6BFF 62%,#B08CFF);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;transition:opacity .5s;font-family:"Baloo 2",ui-rounded,system-ui,sans-serif}.sp img{width:170px;height:170px;animation:mbn 1s ease-in-out infinite;filter:drop-shadow(0 10px 0 rgba(0,0,0,.2))}.sp b{font-size:40px;font-weight:900;margin-top:6px}.sp small{font-size:18px;font-weight:800;opacity:.9}',
            /* modal */
            '.em{height:1.15em;width:1.15em;vertical-align:-.2em;display:inline-block}.mo{position:fixed;inset:0;background:rgba(43,35,80,.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:14px;direction:rtl;overflow:auto}.mp{background:#fff;border-radius:30px;padding:18px;width:100%;max-width:390px;text-align:center;box-shadow:0 10px 0 #DCD3FF;animation:mup .3s both}.mp h2{margin:0 0 6px;font-size:22px;color:#4B3BB5}.sr{display:flex;justify-content:space-between;align-items:center;font-weight:800;margin:12px 0 2px;gap:10px}.sr input[type=text],.sr input:not([type]){border:3px solid #E1D9FF;border-radius:14px;padding:8px 10px;font:inherit;font-weight:800;width:150px;text-align:center}.sr input[type=checkbox]{appearance:none;-webkit-appearance:none;width:54px;height:32px;border-radius:20px;background:#D6CFEA;position:relative;transition:background .2s;flex:none}.sr input[type=checkbox]:after{content:"";position:absolute;top:4px;right:4px;width:24px;height:24px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 2px 0 rgba(0,0,0,.18)}.sr input[type=checkbox]:checked{background:#22C55E}.sr input[type=checkbox]:checked:after{transform:translateX(-22px)}.mp small{display:block;color:#8A82B5;font-size:12px;text-align:right;font-weight:700}',
            '.bld{display:flex;gap:10px;justify-content:center;margin:14px 0 0;flex-wrap:wrap}.bld button{border:0;border-radius:18px;padding:14px 18px;min-width:84px;font:inherit;font-size:22px;font-weight:900;color:#fff;box-shadow:0 5px 0 rgba(0,0,0,.22);cursor:pointer}.bld button:active{transform:translateY(3px);box-shadow:0 2px 0 rgba(0,0,0,.22)}#bv{margin-top:8px;text-align:center}#bv .big{font-size:34px!important;color:#6C4DF6;font-weight:900}#ma[dir=ltr] .ovt{direction:ltr;text-align:center}#ma[dir=ltr],.mo[dir=ltr]{direction:ltr}.nlk{direction:ltr;display:grid;grid-template-columns:repeat(7,1fr);gap:7px;margin-top:12px}.nlk button{border:3px solid #E1D9FF;border-radius:14px;padding:10px 0;font:inherit;font-size:20px;font-weight:900;background:#fff;color:#2B2350;box-shadow:0 4px 0 #DCD3FF;cursor:pointer}.nlk button.me{background:#FFD34D;border-color:#FFB800;box-shadow:0 4px 0 #D99A00}.nlk button.ok{background:#22C55E;border-color:#15803D;color:#fff}.nlk button.no{background:#FFE1E7;border-color:#E5365A}'
        ].join(''); document.head.appendChild(s);
    }


    /* ---------- Top Math generators (book curriculum) ---------- */
    var TM_UNITS = ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
    var TM_TENS = { 30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety', 100: 'one hundred' };
    var TM_ORD = ['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth'];
    var TM_DAYS = [['Saturday','السبت'],['Sunday','الأحد'],['Monday','الإثنين'],['Tuesday','الثلاثاء'],['Wednesday','الأربعاء'],['Thursday','الخميس'],['Friday','الجمعة']];
    var TM_MONTHS = [['January','يناير'],['February','فبراير'],['March','مارس'],['April','أبريل'],['May','مايو'],['June','يونيو'],['July','يوليو'],['August','أغسطس'],['September','سبتمبر'],['October','أكتوبر'],['November','نوفمبر'],['December','ديسمبر']];
    var TM_SHAPES = [['circle','دايرة','⚪'],['square','مربع','🟦'],['triangle','مثلث','🔺'],['rectangle','مستطيل','▭']];
    function NN(n) { var a = N(n); a.n = n; return a; }
    function NE(n) { var a = N(n); a.en = 1; return a; }
    function tmSeq() { if (LG !== 'en') return null; var en = [], ar = [];
        for (var i = 0; i < arguments.length; i++) { var a = arguments[i];
            if (a.n != null) { en = en.concat(a); ar = ar.concat(NA.numIds(a.n)); }
            else if (a.en) { en = en.concat(a); }
            else a.forEach(function (id) { en.push(id); ar.push(id.replace(/^en_/, '')); }); }
        en.ar = ar; return en; }
    function tmWord(n) { if (n === 0) return 'zero'; if (n <= 20) return TM_UNITS[n - 1]; if (TM_TENS[n]) return TM_TENS[n]; return TM_TENS[Math.floor(n / 10) * 10] + '-' + TM_UNITS[n % 10 - 1]; }
    function tmOpts(ans, lo, hi, k) { var s = {}, o = [ans]; s[ans] = 1; var g = 0; while (o.length < (k || 4) && g++ < 50) { var x = r(Math.max(lo, ans - 4), Math.min(hi, ans + 4)); if (!s[x]) { s[x] = 1; o.push(x); } } return shuf(o).map(String); }
    function tmPick(list, ans, k) { var o = [ans], g = 0; while (o.length < (k || 4) && g++ < 60) { var x = pk(list); if (o.indexOf(x) < 0) o.push(x); } return shuf(o); }

    function genNumWord(lo, hi) { var n = r(lo, hi), w = tmWord(n), ws = [w], g = 0;
        while (ws.length < 4 && g++ < 60) { var m = Math.max(1, Math.min(hi + 5, n + r(-5, 5))), x = tmWord(m); if (ws.indexOf(x) < 0) ws.push(x); }
        return { seq: tmSeq(['en_tm_q_word'], NE(n)), html: tx('أنهي كلمة تكتب العدد ' + B(n) + '؟', 'Which word is the number ' + B(n) + '?'), vis: n <= 20 ? dots(n) : '', opts: shuf(ws), ans: w, exp: say(n + ' = ' + w, n + ' is spelled ' + w) }; }
    function genWordNum(lo, hi) { var n = r(lo, hi);
        return { seq: tmSeq(['en_tm_q_wordnum'], NE(n)), html: tx('الكلمة دي معناها كام؟ ', 'What number is this word? ') + '<span class="big" dir="ltr">' + tmWord(n) + '</span>', vis: '', opts: tmOpts(n, Math.max(1, lo - 5), hi + 5), ans: String(n), exp: say(tmWord(n) + ' = ' + n, tmWord(n) + ' is ' + n) }; }
    function genBefore(tt, hi) { hi = hi || 20; var n = r(2, hi - 1), t = tt ? pk(tt) : r(0, 2), ans = t === 0 ? n - 1 : t === 1 ? n + 1 : n, q, sq;
        var ex = say((n - 1) + '، ' + n + '، ' + (n + 1), (n - 1) + ', ' + n + ', ' + (n + 1));
        if (t === 2) return { seq: tmSeq(['en_tm_q_between'], NN(n - 1), ['en_q_and'], NN(n + 1)), html: tx('إيه العدد <b>اللي في النص</b> بين ' + B((n - 1) + ' و ' + (n + 1)) + '؟', 'What number is <b>between</b> ' + B((n - 1) + ' and ' + (n + 1)) + '?'), vis: '', opts: tmOpts(n, 0, hi), ans: String(n), exp: ex };
        if (t === 0) q = ['إيه العدد اللي <b>قبل</b> ' + B(n) + '؟', 'What number comes <b>before</b> ' + B(n) + '?']; else q = ['إيه العدد اللي <b>بعد</b> ' + B(n) + '؟', 'What number comes <b>after</b> ' + B(n) + '?'];
        return { seq: tmSeq([t === 0 ? 'en_tm_q_before' : 'en_tm_q_after'], NN(n)), html: tx(q[0], q[1]), vis: '', opts: tmOpts(ans, 0, hi), ans: String(ans), exp: ex }; }
    function genOrdinal() { var k = r(1, 10), items = ['🍎','🍌','🍇','🍓','🍊','🍐','🍒','🥕','🍋','🍉'], row = items.slice(0, 10);
        return { seq: tmSeq(['en_tm_q_ord_a', 'en_tm_ord_' + k, 'en_tm_q_ord_b']), html: tx('أنهي واحدة ' + B(TM_ORD[k - 1]) + '؟ (من الشمال)', 'Which one is the ' + B(TM_ORD[k - 1]) + '? (from the left)'), vis: '<div class="sk" dir="ltr">' + row.map(function (e, i) { return '<span>' + e + '</span>'; }).join('') + '</div>', opts: tmPick(row, row[k - 1]), ans: row[k - 1], exp: say('بنعد من الشمال: ' + TM_ORD.slice(0, k).join('، '), 'Count from the left: ' + TM_ORD.slice(0, k).join(', ')) }; }
    function genDay() { var i = r(0, 6), t = r(0, 1), d = TM_DAYS[i], a = TM_DAYS[(i + (t ? 1 : 6)) % 7];
        return { seq: tmSeq([t ? 'en_tm_q_day_after' : 'en_tm_q_day_before', 'en_tm_day_' + i]), html: tx('اليوم ' + (t ? 'اللي بعد ' : 'اللي قبل ') + B(d[1]) + ' إيه؟', 'Which day comes ' + (t ? 'after ' : 'before ') + B(d[0]) + '?'), vis: '', opts: tmPick(TM_DAYS.map(function (x) { return x[0]; }), a[0]), optLbl: (function () { var o = {}; TM_DAYS.forEach(function (x) { o[x[0]] = tx(x[1], x[0]); }); return o; })(), ans: a[0], exp: say(TM_DAYS.map(function (x) { return x[1]; }).join('، '), TM_DAYS.map(function (x) { return x[0]; }).join(', ')) }; }
    function genMonth() { var i = r(0, 11), t = r(0, 1), m = TM_MONTHS[i], a = TM_MONTHS[(i + (t ? 1 : 11)) % 12];
        return { seq: tmSeq([t ? 'en_tm_q_month_after' : 'en_tm_q_month_before', 'en_tm_month_' + i]), html: tx('الشهر ' + (t ? 'اللي بعد ' : 'اللي قبل ') + B(m[1]) + ' إيه؟', 'Which month comes ' + (t ? 'after ' : 'before ') + B(m[0]) + '?'), vis: '', opts: tmPick(TM_MONTHS.map(function (x) { return x[0]; }), a[0]), optLbl: (function () { var o = {}; TM_MONTHS.forEach(function (x) { o[x[0]] = tx(x[1], x[0]); }); return o; })(), ans: a[0], exp: say(TM_MONTHS.map(function (x) { return x[1]; }).join('، '), TM_MONTHS.map(function (x) { return x[0]; }).join(', ')) }; }
    function genShape() { var s = pk(TM_SHAPES);
        return { seq: tmSeq(['en_tm_q_shape']), html: tx('اسم الشكل ده إيه؟', 'What shape is this?'), vis: tmShape(s[0]), opts: TM_SHAPES.map(function (x) { return x[0]; }), optLbl: (function () { var o = {}; TM_SHAPES.forEach(function (x) { o[x[0]] = tx(x[1], x[0]); }); return o; })(), ans: s[0], exp: say(s[1], 'This is a ' + s[0]) }; }
    function genTallest() { var big = r(0, 1), h = shuf([1, 2, 3, 4, 5]).slice(0, 3), em = pk(['🌴', '🧍', '🗼']), i;
        var ans = big ? h.indexOf(Math.max.apply(null, h)) : h.indexOf(Math.min.apply(null, h));
        return { seq: tmSeq([big ? 'en_tm_q_tallest' : 'en_tm_q_shortest']), html: tx('أنهي واحد ' + (big ? 'الأطول' : 'الأقصر') + '؟', 'Which one is the <b>' + (big ? 'tallest' : 'shortest') + '</b>?'), vis: '<div class="sk" dir="ltr" style="align-items:flex-end">' + h.map(function (x) { return '<span style="display:inline-block;width:46px;height:' + (x * 22) + 'px;background:#6C4DF6;border-radius:8px;color:#fff;font-size:14px">' + (['A', 'B', 'C'][h.indexOf(x)]) + '</span>'; }).join('') + '</div>', opts: ['A', 'B', 'C'], ans: ['A', 'B', 'C'][ans], exp: say(big ? 'الأطول هو الأعلى' : 'الأقصر هو الأقل ارتفاع', big ? 'The tallest is the highest one' : 'The shortest is the lowest one') }; }
    function genOnUnder() { var on = r(0, 1), e = pk(['🐱', '🐶', '⚽', '🍎']);
        return { seq: tmSeq(['en_tm_q_onunder']), html: tx('الـ ' + B(e) + ' ' + (on ? 'فوق' : 'تحت') + ' الترابيزة ولا ' + (on ? 'تحتها' : 'فوقها') + '؟', 'Is the ' + B(e) + ' <b>on</b> or <b>under</b> the table?'), vis: '<div class="big" dir="ltr" style="line-height:1.1">' + (on ? e + '<br>🟫🟫🟫' : '🟫🟫🟫<br>' + e) + '</div>', opts: ['on', 'under'], optLbl: { on: tx('فوق', 'on'), under: tx('تحت', 'under') }, ans: on ? 'on' : 'under', exp: say(on ? 'فوق الترابيزة' : 'تحت الترابيزة', on ? 'It is on the table' : 'It is under the table') }; }
    function genDigital() { var h = r(1, 12), m = pk([0, 15, 30, 45]), t = h + ':' + (m < 10 ? '0' : '') + m, ws = [t], g = 0;
        while (ws.length < 4 && g++ < 60) { var x = r(1, 12) + ':' + pk(['00', '15', '30', '45']); if (ws.indexOf(x) < 0) ws.push(x); }
        var say_ = m === 0 ? h + " o'clock" : m === 30 ? 'half past ' + h : m === 15 ? 'quarter past ' + h : 'quarter to ' + (h % 12 + 1);
        return { seq: tmSeq(['en_tm_q_digital'], NN(h), m === 0 ? ['en_tm_t_oclock'] : NN(m)), html: tx('الساعة الرقمية بتقول إيه؟ ' + B(t), 'Read the digital clock: ' + B(t)), vis: '', opts: shuf(ws), ans: t, exp: say('الساعة ' + t, 'It is ' + say_) }; }
    function genTens(op) { var a = r(1, 9) * 10, b = r(1, 9) * 10; if (op === '-') { if (b > a) { var x = a; a = b; b = x; } } else { while (a + b > 100) { a = r(1, 9) * 10; b = r(1, 9) * 10; } }
        var ans = op === '-' ? a - b : a + b; return { html: B(a + ' ' + (op === '-' ? '−' : '+') + ' ' + b + ' = ?'), vis: blocks(a), ans: ans, exp: say((a / 10) + ' عشرات ' + (op === '-' ? 'ناقص ' : 'زائد ') + (b / 10) + ' = ' + (ans / 10) + ' عشرات = ' + ans, (a / 10) + ' tens ' + (op === '-' ? 'minus ' : 'plus ') + (b / 10) + ' tens = ' + (ans / 10) + ' tens = ' + ans) }; }
    function genMakeNum(big) { var a = r(1, 9), b = r(1, 9); while (b === a) b = r(1, 9);
        var hi = Math.max(a, b), lo = Math.min(a, b), ans = big ? hi * 10 + lo : lo * 10 + hi, other = big ? lo * 10 + hi : hi * 10 + lo, o = [String(ans), String(other)], g = 0;
        while (o.length < 4 && g++ < 40) { var x = String(r(1, 9) * 10 + pk([a, b])); if (o.indexOf(x) < 0) o.push(x); }
        return { seq: tmSeq([big ? 'en_tm_q_make_big' : 'en_tm_q_make_small'], NN(a), NN(b)), html: tx('كوّن ' + (big ? 'أكبر' : 'أصغر') + ' عدد من الرقمين: ' + B(a + ' ' + b), 'Make the <b>' + (big ? 'greatest' : 'smallest') + '</b> number from the two digits: ' + B(a + ' ' + b)), vis: '', opts: shuf(o), ans: String(ans), exp: say(big ? 'الرقم الأكبر في خانة العشرات' : 'الرقم الأصغر في خانة العشرات', big ? 'Put the biggest digit in the tens place' : 'Put the smallest digit in the tens place') }; }
    function tmShape(n) { return '<div class="tshw"><i class="tsh_' + n + '"></i></div>'; }
    function genArr(asc, hi) { hi = hi || 50; var v = []; while (v.length < 3) { var x = r(1, hi); if (v.indexOf(x) < 0) v.push(x); }
        var s = v.slice().sort(function (a, b) { return asc ? a - b : b - a; }), ans = s.join(' , '), o = [ans], g = 0; while (o.length < 4 && g++ < 40) { var y = shuf(v).join(' , '); if (o.indexOf(y) < 0) o.push(y); }
        return { seq: tmSeq.apply(null, [[asc ? 'en_tm_q_arr_up' : 'en_tm_q_arr_down']].concat(v.map(NN))), html: tx(asc ? 'رتّب من الأصغر للأكبر: ' : 'رتّب من الأكبر للأصغر: ', asc ? 'Arrange from the smallest to the biggest: ' : 'Arrange from the biggest to the smallest: ') + B(v.join(' , ')), vis: '', opts: shuf(o), ans: ans, exp: say(asc ? 'الأصغر الأول: ' + s.join('، ') : 'الأكبر الأول: ' + s.join('، '), (asc ? 'Smallest first: ' : 'Biggest first: ') + s.join(', ')) }; }
    function genHowMany(lo, hi) { var n = r(lo, hi);
        return { seq: tmSeq([n <= 20 ? 'en_q_n20' : 'en_tm_q_howmany']), html: tx(n <= 20 ? 'عدّ النقط. كام نقطة؟' : 'كام الكل؟', n <= 20 ? 'Count the dots. How many?' : 'How many in all?'), vis: n <= 20 ? dots(n) : blocks(n), ans: n, exp: say(n + ' = ' + (n >= 20 ? Math.floor(n / 10) + ' عشرات و ' + (n % 10) + ' آحاد' : 'عدّ واحدة واحدة'), n + ' = ' + (n >= 20 ? Math.floor(n / 10) + ' tens and ' + (n % 10) + ' ones' : 'count one by one')) }; }
    function genMissing(lo, hi, tensOnly) { var n = tensOnly ? r(Math.floor(lo / 10), Math.floor(hi / 10)) * 10 : r(lo, hi), w = tmWord(n).replace('-', ''), k = r(0, w.length - 1), ch = w.charAt(k), o = [ch], g = 0, A = 'abcdefghijklmnopqrstuvwxyz';
        while (o.length < 4 && g++ < 60) { var x = A.charAt(r(0, 25)); if (o.indexOf(x) < 0) o.push(x); }
        return { seq: tmSeq(['en_tm_q_missing'], NE(n)), html: tx('الحرف الناقص في كلمة ' + B(n) + ': ', 'Which letter is missing in ' + B(n) + '? ') + '<span class="big" dir="ltr">' + w.substr(0, k) + '_' + w.substr(k + 1) + '</span>', vis: '', opts: shuf(o), ans: ch, exp: say(n + ' = ' + w.split('').join(' '), n + ' is spelled ' + w.split('').join(' ')) }; }
    function genTensCount() { var n = r(1, 10) * 10;
        return { seq: tmSeq(['en_tm_q_howmany']), html: tx('كام الكل؟', 'How many in all?'), vis: blocks(n), opts: tmPick([10,20,30,40,50,60,70,80,90,100].filter(function (x) { return Math.abs(x - n) <= 40; }), n).map(String), ans: String(n), exp: say((n / 10) + ' عشرات = ' + n, (n / 10) + ' tens = ' + n) }; }
    var TM_GEN = { numword: genNumWord, wordnum: genWordNum, ba: genBefore, ord: genOrdinal, day: genDay, month: genMonth, shape: genShape, tall: genTallest, onunder: genOnUnder, digital: genDigital, tens: genTens, make: genMakeNum };


    /* ---------- Top Math data ---------- */
    var TMU = {"t1":[["Numbers (1 - 10)","num","1f522","الأعداد من ١ لـ ١٠"],["Numbers (11 - 20)","num","1f522","الأعداد من ١١ لـ ٢٠"],["More - Less - Equal","cmp","2696","أكتر - أقل - يساوي"],["Test","test","1f3c6","اختبار"],["Numbers (21 - 30)","num","1f522","٢١ لـ ٣٠"],["Test","test","1f3c6","اختبار"],["Between and After","ord","1f517","بين وبعد"],["Before","ord","2b05","قبل"],["The number line strategies","nl","1f4cf","خط الأعداد"],["Test","test","1f3c6","اختبار"],["Arrange ascending","ord","1f4c8","رتّب تصاعدي"],["Test","test","1f3c6","اختبار"],["Test","test","1f3c6","اختبار"],["Numbers (31 - 35)","num","1f522","٣١ لـ ٣٥"],["Numbers (36 - 40)","num","1f522","٣٦ لـ ٤٠"],["More than - less than","cmp","2696","أكبر من - أصغر من"],["Numbers (40 - 45)","num","1f522","٤٠ لـ ٤٥"],["Numbers (45 - 50)","num","1f522","٤٥ لـ ٥٠"],["Revision (1 - 50)","rev","1f501","مراجعة"],["Test","test","1f3c6","اختبار"],["Test","test","1f3c6","اختبار"],["Number letters (1 - 4)","let","1f524","كتابة الأرقام بالحروف"],["Test","test","1f3c6","اختبار"],["Addition","op","2795","الجمع"],["Test","test","1f3c6","اختبار"],["Number letters (5 - 7)","let","1f524","حروف الأرقام"],["Number letters (8 - 10)","let","1f524","حروف الأرقام"],["Number letters (11)","let","1f524","حروف الأرقام"],["Number letters (12)","let","1f524","حروف الأرقام"],["Test","test","1f3c6","اختبار"],["Numbers (50 - 59)","num","1f522","٥٠ لـ ٥٩"],["Numbers (60 - 69)","num","1f522","٦٠ لـ ٦٩"],["Numbers (70 - 79)","num","1f522","٧٠ لـ ٧٩"],["Numbers (80 - 89)","num","1f522","٨٠ لـ ٨٩"],["Test","test","1f3c6","اختبار"],["Minus","op","2796","الطرح"],["Test","test","1f3c6","اختبار"],["Numbers (90 - 100)","num","1f4af","٩٠ لـ ١٠٠"],["Final exams","exam","1f393","الامتحان النهائي"],["Model (1)","model","1f4dd","نموذج ١"],["Model (2)","model","1f4dd","نموذج ٢"],["Model (3)","model","1f4dd","نموذج ٣"],["Model (4)","model","1f4dd","نموذج ٤"],["Model (5)","model","1f4dd","نموذج ٥"],["Model (6)","model","1f4dd","نموذج ٦"]],"t2":[["Revision","rev","1f501","مراجعة"],["Tallest and shortest","vis","1f4cf","الأطول والأقصر"],["Test","test","1f3c6","اختبار"],["Arrange descending","ord","1f4c9","رتّب تنازلي"],["Number letters (11 - 13)","let","1f524","حروف الأرقام"],["Number letters (14 - 16)","let","1f524","حروف الأرقام"],["Test","test","1f3c6","اختبار"],["Number letters (17 - 19)","let","1f524","حروف الأرقام"],["Number letters (20 - 40)","let","1f524","حروف الأرقام"],["Number letters (50 - 70)","let","1f524","حروف الأرقام"],["Shapes","vis","1f536","الأشكال"],["Number letters (70 - 90)","let","1f524","حروف الأرقام"],["Tens","num","1f51f","العشرات"],["Add tens","op","2795","جمع العشرات"],["Subtract tens","op","2796","طرح العشرات"],["Tens - ones","num","1f9f1","عشرات وآحاد"],["Test","test","1f3c6","اختبار"],["Compare 2 digits numbers","cmp","2696","قارن عددين"],["Making greatest / smallest 2 digits","cmp","1f522","أكبر وأصغر عدد"],["Test","test","1f3c6","اختبار"],["Add 2-digit number","op","2795","جمع عددين"],["Subtract 2-digit number","op","2796","طرح عددين"],["Revision","rev","1f501","مراجعة"],["Test","test","1f3c6","اختبار"],["Money","life","1f4b0","الفلوس"],["Count money","life","1fa99","عدّ الفلوس"],["On - under","vis","2195","فوق - تحت"],["What's the time","life","23f0","الساعة كام؟"],["Digital clock","life","1f552","الساعة الرقمية"],["Fractions","life","1f355","الكسور"],["Ordinal numbers","ord","1f947","الترتيب: الأول والتاني"],["Day of the week","life","1f4c5","أيام الأسبوع"],["Months of the year","life","1f5d3","شهور السنة"],["Final exams","exam","1f393","الامتحان النهائي"],["Model (1)","model","1f4dd","نموذج ١"],["Model (2)","model","1f4dd","نموذج ٢"],["Model (3)","model","1f4dd","نموذج ٣"],["Model (4)","model","1f4dd","نموذج ٤"],["Model (5)","model","1f4dd","نموذج ٥"],["Model (6)","model","1f4dd","نموذج ٦"],["Model (7)","model","1f4dd","نموذج ٧"],["Model (8)","model","1f4dd","نموذج ٨"],["Model (9)","model","1f4dd","نموذج ٩"],["Model (10)","model","1f4dd","نموذج ١٠"]]};
    var TM_CSS = ".tabs3{display:flex;gap:4px;background:rgba(0,0,0,.22);border-radius:20px;padding:4px;margin:10px 0 6px}.tabs3 button{flex:1;border:none;border-radius:16px;padding:7px 2px;font:inherit;font-weight:900;font-size:13px;background:transparent;color:#fff;line-height:1.1}.tabs3 button small{display:block;font-size:10px;opacity:.85;font-weight:700}.tabs3 button.on{background:#fff;color:#0F766E;box-shadow:0 4px 0 rgba(0,0,0,.15)} .tmh{background:linear-gradient(165deg,#0F766E,#14B8A6 60%,#5EEAD4)!important;box-shadow:0 10px 0 #BDF0E8!important} .terms{display:flex;gap:8px;margin:12px 16px 0}.terms button{flex:1;border:3px solid #BDF0E8;background:#fff;border-radius:18px;padding:9px;font:inherit;font-weight:900;color:#0F766E;font-size:15px}.terms button.on{background:#0F766E;color:#fff;border-color:#0F766E;box-shadow:0 5px 0 #0A524C} .bookline{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.18);border-radius:16px;padding:7px 12px;font-weight:800;font-size:13px;margin-top:8px}.bookline b{font-size:15px} .tcl{margin:26px 16px 2px;display:flex;align-items:center;gap:8px;font-weight:900;color:#0F766E;font-size:15px}.tcl:after{content:\"\";flex:1;height:4px;border-radius:2px;background:#BDF0E8}.tcl i{font-style:normal;background:#0F766E;color:#fff;border-radius:12px;padding:3px 9px;font-size:12px} .tmn .n{width:70px;height:70px;font-size:30px}.ub{position:absolute;top:-6px;right:-10px;background:#fff;color:#0F766E;border-radius:10px;font-size:11px;font-weight:900;padding:2px 6px;box-shadow:0 2px 0 rgba(0,0,0,.2)} .tmn .n.test{background:linear-gradient(160deg,#FFE27A,#FBBF24);box-shadow:0 7px 0 #B7791F,inset 0 0 0 4px #fff} .tmn .n.exam{background:linear-gradient(160deg,#FF8A8A,#EF4444);box-shadow:0 7px 0 #991B1B,inset 0 0 0 4px #fff} .tmn .n.model{background:linear-gradient(160deg,#C4B5FD,#8B5CF6);box-shadow:0 7px 0 #5B21B6,inset 0 0 0 4px #fff} .tmn .n.rev{background:linear-gradient(160deg,#93C5FD,#3B82F6);box-shadow:0 7px 0 #1E3A8A,inset 0 0 0 4px #fff} .tmn .nl small{display:block;font-size:11px;opacity:.85;font-weight:800;color:#0F766E}.tmn .nl{color:#134E4A!important;text-shadow:none!important} .legend{display:flex;flex-wrap:wrap;gap:6px;margin:12px 16px 0}.legend span{font-size:11px;font-weight:900;color:#fff;border-radius:10px;padding:3px 8px} .sheetb{position:fixed;left:0;right:0;bottom:0;background:#fff;border-radius:30px 30px 0 0;padding:18px 18px 22px;box-shadow:0 -10px 0 rgba(0,0,0,.12);z-index:20000;color:#2B2350} .tsteps{display:flex;gap:6px;margin:12px 0}.tsteps div{flex:1;text-align:center;background:#F0FDFA;border-radius:14px;padding:8px 2px;font-weight:900;font-size:11px;color:#0F766E}.tsteps b{display:block;font-size:20px} .lt{display:flex;gap:8px;justify-content:center;margin:12px 0}.lt span{width:56px;height:64px;border-radius:16px;background:#FDF2F8;border:3px solid #F9A8D4;font-size:34px;font-weight:900;color:#BE185D;display:flex;align-items:center;justify-content:center;box-shadow:0 5px 0 #F9A8D4;text-transform:lowercase}.lt span.e{background:#fff;border:3px dashed #F9A8D4;box-shadow:none;color:transparent} .big1{font-size:90px;font-weight:900;color:#6C4DF6;text-align:center;line-height:1}.dots{display:flex;gap:6px;justify-content:center;margin:6px 0}.dots i{width:22px;height:22px;border-radius:50%;background:#FF9F43} .cpt .hero,.cpt .bookline{display:none}.hh.cpt{padding-bottom:12px}.tsc b,.tsc small,.tsc .cnt{color:#134E4A!important;text-shadow:none!important}.tsc small{color:#0F766E!important}.tsc .cnt{color:#64748B!important}.hero.mini{display:flex} .tscs{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 16px 24px} .tsc{background:#fff;border-radius:24px;padding:14px 12px 12px;box-shadow:0 7px 0 #BDF0E8;border:3px solid #E6FAF6;position:relative;text-align:center;color:#134E4A} .tsc .si{width:58px;height:58px;border-radius:20px;margin:0 auto 6px;display:flex;align-items:center;justify-content:center}.tsc .si img{width:34px;height:34px} .tsc b{display:block;font-size:15px;line-height:1.2}.tsc small{display:block;font-weight:800;color:#0F766E;font-size:12px;margin-top:2px} .tsc .pb{height:8px;border-radius:5px;background:#E6FAF6;margin:8px 4px 4px;overflow:hidden}.tsc .pb i{display:block;height:100%;background:#14B8A6} .tsc .cnt{font-size:11px;font-weight:900;color:#64748B} .tsc .dts{display:flex;gap:3px;justify-content:center;margin-top:5px}.tsc .dts i{width:9px;height:9px;border-radius:50%} .tsc.rec{border-color:#FBBF24}.tsc.rec:before{content:\"Start here \u25b6\";position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:#FBBF24;color:#5B3A00;font-size:11px;font-weight:900;border-radius:10px;padding:2px 9px;white-space:nowrap} .tsc.wide{grid-column:span 2;display:flex;align-items:center;gap:12px;text-align:left}.tsc.wide .si{margin:0;flex:none}.tsc.wide>div{flex:1} .tsh{display:flex;align-items:center;gap:10px;margin:14px 16px 0;color:#fff}.tsh .bk{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.25);border:none;color:#fff;font-size:22px;font-weight:900} .tsh div b{font-size:19px;display:block}.tsh div small{font-weight:800;opacity:.9} .chips{display:flex;gap:6px;overflow:hidden;margin:10px 16px 0}.chips span{flex:none;background:#fff;border:3px solid #BDF0E8;color:#0F766E;border-radius:14px;padding:5px 10px;font-weight:900;font-size:12px}.chips span.on{background:#0F766E;color:#fff;border-color:#0F766E} .hlab{margin:16px 16px 0;font-weight:900;color:#0F766E;font-size:16px}";


    /* ---------- Top Math: levels (book order), sections, UI ---------- */
    var PP = null, TMLV = [], TMSEC = { 1: [], 2: [] };
    var TM_SECDEF = {
        1: [['Numbers 1 - 20', 'أعداد ١ لـ ٢٠', '1f522', '#6C4DF6', 0, 4, '1-20'], ['Numbers 21 - 50', 'أعداد ٢١ لـ ٥٠ وخط الأعداد', '1f4cf', '#14B8A6', 4, 21, '21-50'], ['Number letters & Add', 'حروف الأرقام والجمع', '1f524', '#EC4899', 21, 30, 'Letters'], ['Numbers 50 - 100 & Minus', '٥٠ لـ ١٠٠ والطرح', '2796', '#FF9F43', 30, 38, '50-100'], ['Final Exam & Models', 'الامتحان والنماذج', '1f3c6', '#EF4444', 38, 45, 'Exams']],
        2: [['Order & letters 11-19', 'ترتيب وحروف الأرقام', '1f524', '#EC4899', 0, 9, 'Letters'], ['Shapes & Tens', 'الأشكال والعشرات', '1f4d0', '#F43F5E', 9, 17, 'Shapes'], ['Compare & 2-digit math', 'مقارنة وجمع وطرح', '2696', '#22C55E', 17, 24, 'Compare'], ['Money, Time & Words', 'فلوس وساعة وأيام وشهور', '23f0', '#84CC16', 24, 33, 'Time'], ['Final Exam & Models', 'الامتحان والنماذج', '1f3c6', '#EF4444', 33, 44, 'Exams']]
    };
    var TM_COL = { num: '#6C4DF6', cmp: '#22C55E', ord: '#0EA5E9', nl: '#14B8A6', op: '#FF9F43', let: '#EC4899', vis: '#F43F5E', life: '#84CC16', test: '#FBBF24', rev: '#3B82F6', exam: '#EF4444', model: '#8B5CF6' };
    TM_CSS += '.tmn{padding-top:34px}.tshw,.tbars{margin-bottom:48px}.tsc{font:inherit;cursor:pointer;color:#134E4A}.lgs button[data-tab]{font-size:13px}.tshw{display:flex;justify-content:center;margin:6px 0}.tshw i{display:block;background:#6C4DF6}.tsh_circle{width:84px;height:84px;border-radius:50%;background:#FF9F43!important}.tsh_square{width:80px;height:80px;border-radius:8px;background:#22C55E!important}.tsh_rectangle{width:130px;height:70px;border-radius:8px;background:#0EA5E9!important}.tsh_triangle{width:0;height:0;background:transparent!important;border-left:48px solid transparent;border-right:48px solid transparent;border-bottom:84px solid #F43F5E}'
        + '.tw{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0;direction:ltr}.twr{display:flex;align-items:center;gap:8px;background:#F5F1FF;border-radius:14px;padding:6px 10px;font-weight:900;font-size:18px}.twr b{font-size:24px;color:#6C4DF6;min-width:34px}.twr span{color:#BE185D}'
        + '.lt{display:flex;gap:6px;justify-content:center;margin:10px 0;direction:ltr;flex-wrap:wrap}.lt span{width:46px;height:54px;border-radius:14px;background:#FDF2F8;border:3px solid #F9A8D4;font-size:30px;font-weight:900;color:#BE185D;display:flex;align-items:center;justify-content:center}'
        + '.tbig{font-size:64px;font-weight:900;color:#6C4DF6;text-align:center;line-height:1.1;direction:ltr}.tbars{display:flex;gap:14px;justify-content:center;align-items:flex-end;direction:ltr;margin:8px 0}.tbars i{display:block;width:44px;border-radius:10px;background:#6C4DF6}'
        + '.tmn .nl small{display:block;font-size:11px;opacity:.85;font-weight:800;color:#0F766E}.tmn .nl{color:#134E4A!important;text-shadow:none!important}.tmn .nd .nst{margin-top:2px}';
    var tmCss = false;
    function injectTm() { if (tmCss) return; tmCss = true; var s = document.createElement('style'); s.textContent = TM_CSS; document.head.appendChild(s); }
    function tmChips(a) { return skip2(a); }
    function tmRange(lo, hi) { var a = []; for (var i = lo; i <= hi; i++) a.push(i); return a; }
    function letterTiles(w) { return '<div class="lt">' + w.replace('-', '').split('').map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>'; }
    function spell(w) { return w.replace('-', '').split('').join(', '); }
    function twRows(ns) { return '<div class="tw">' + ns.map(function (n) { return '<div class="twr"><b>' + n + '</b><span>' + tmWord(n) + '</span></div>'; }).join('') + '</div>'; }

    function numPages(lo, hi) {
        var s = lo + Math.floor((hi - lo) / 2), a = Math.max(0, lo - 1), b = hi + 1, p = [];
        p.push(say('النهاردة هنتعلم الأعداد من ' + lo + ' لـ ' + hi + '. تعالى نشوفهم!', 'Today we learn the numbers from ' + lo + ' to ' + hi + '. Let us look at them!') + tmChips(tmRange(lo, Math.min(hi, lo + 10))));
        if (s <= 20) p.push(say('بص! ده الرقم ' + s + '. عدّ النقط معايا.', 'Look! This is the number ' + s + '. Count the dots with me.') + dots(s) + stp(tmRange(1, s).join(' , ') + ' → <b>' + s + '</b>'));
        else p.push(say('العدد ' + s + ' هو ' + Math.floor(s / 10) + ' عشرات و ' + (s % 10) + ' آحاد.', 'The number ' + s + ' is ' + Math.floor(s / 10) + ' tens and ' + (s % 10) + ' ones.') + blocks(s) + stp(s + ' = ' + Math.floor(s / 10) * 10 + ' + ' + (s % 10)));
        p.push(say('على خط الأعداد، كل رقم أكبر من اللي قبله بواحد. بعد ' + s + ' بييجي ' + (s + 1) + '.', 'On the number line, each number is one more than the one before. After ' + s + ' comes ' + (s + 1) + '.') + nline(a, b, { start: s, end: Math.min(s + 1, b), auto: 1 }));
        p.push(say('يلا نقولهم مع بعض بالترتيب!', 'Let us say them together, in order!') + tmChips(tmRange(lo, Math.min(hi, lo + 10))) + (hi - lo > 10 ? tmChips(tmRange(lo + 11, hi)) : ''));
        return p;
    }
    function letPages(ns, tens) {
        var n0 = ns[0], w0 = tmWord(n0), nl = ns[ns.length - 1], wl = tmWord(nl), p = [];
        p.push(say('نقدر نكتب الأرقام بالحروف. الرقم ' + n0 + ' بيتكتب <bdi>' + w0 + '</bdi> بالحروف.', 'We can write numbers with letters. The number ' + n0 + ' is written ' + w0 + '.') + '<div class="tbig">' + n0 + '</div>' + letterTiles(w0));
        p.push(say('بص على كل رقم وكلمته. قولهم معايا!', 'Look at each number and its word. Say them with me!') + twRows(ns.slice(0, 8)));
        p.push(say('نتهجّى <bdi>' + wl + '</bdi> مع بعض: <bdi>' + spell(wl) + '</bdi> حرف حرف.', 'Let us spell ' + wl + ' together: ' + spell(wl) + '.') + '<div class="tbig">' + nl + '</div>' + letterTiles(wl) + stp(wl));
        return p;
    }
    function baPages(kind) {
        if (kind === 'ba') return [
            say('"بين" معناها في النص. بين 4 و 6 بييجي 5.', 'Between means in the middle. Between 4 and 6 comes 5.') + tmChips([4, '<b>5</b>', 6]),
            say('"بعد" معناها الرقم اللي بييجي ورا. بعد 7 بييجي 8.', 'After means the next number. After 7 comes 8.') + tmChips([7, '<b>8</b>']) + nline(5, 10, { start: 7, end: 8, auto: 1 }),
            say('جرب بنفسك: إيه الرقم اللي بعد 12؟ بص على خط الأعداد.', 'Try it yourself: what comes after 12? Look at the number line.') + nline(10, 15, {})];
        return [
            say('"قبل" معناها الرقم اللي قبله على طول. قبل 9 بييجي 8.', 'Before means the number just behind. Before 9 comes 8.') + tmChips([8, '<b>9</b>']) + nline(6, 11, { start: 9, end: 8, auto: 1 }),
            say('قبل 15 بييجي 14. بنرجع خطوة لورا.', 'Before 15 comes 14. We step one back.') + tmChips([14, '<b>15</b>']),
            say('الرقم اللي في النص بين رقمين هو اللي قبل الكبير وبعد الصغير.', 'The middle number is after the small one and before the big one.') + tmChips([11, '<b>12</b>', 13])];
    }
    function arrPages(asc) {
        return asc ? [
            say('تصاعدي معناها من الأصغر للأكبر. زي السلم وانت طالع!', 'Ascending means from the smallest to the biggest, like climbing stairs!') + tmChips([2, 5, 8, 11]),
            say('رتّب 9 و 3 و 6 تصاعدي: أصغر رقم أول واحد، وهو 3.', 'Arrange 9, 3 and 6 in ascending order: the smallest comes first, that is 3.') + stp('3 , 6 , 9')] : [
            say('تنازلي معناها من الأكبر للأصغر. زي السلم وانت نازل!', 'Descending means from the biggest to the smallest, like going down stairs!') + tmChips([11, 8, 5, 2]),
            say('رتّب 9 و 3 و 6 تنازلي: أكبر رقم أول واحد، وهو 9.', 'Arrange 9, 3 and 6 in descending order: the biggest comes first, that is 9.') + stp('9 , 6 , 3')];
    }
    function tmPages(k) {
        var T = {
            tall: [say('الطويل معناه عالي، والقصير معناه واطي. الزرافة طويلة والفار قصير.', 'Tall means high, and short means low. The giraffe is tall and the mouse is short.') + '<div class="tbig">🦒 🐭</div>',
                say('الأطول هو الأعلى من الكل، والأقصر هو الأوطى من الكل.', 'The tallest is the highest of all, and the shortest is the lowest of all.') + '<div class="tbars"><i style="height:50px"></i><i style="height:110px"></i><i style="height:80px"></i></div>'],
            shapes: [say('الأشكال حوالينا في كل مكان. هنقابل أربع أشكال: دايرة ومربع ومثلث ومستطيل.', 'Shapes are all around us. Let us meet four shapes: circle, square, triangle and rectangle.') + tmShape('circle') + tmShape('square'),
                say('الدايرة مدورة ومفيهاش زوايا. المربع له أربع أضلاع متساوية.', 'A circle is round and has no corners. A square has four equal sides.') + tmShape('circle') + tmShape('square'),
                say('المثلث له ثلاث أضلاع. المستطيل له أربع أضلاع، اتنين طويلين واتنين قصيرين.', 'A triangle has three sides. A rectangle has four sides, two long and two short.') + tmShape('triangle') + tmShape('rectangle')],
            onunder: [say('"فوق" معناها على الحاجة. القطة فوق الترابيزة.', 'On means above, touching. The cat is on the table.') + '<div class="tbig" style="font-size:44px;line-height:1.1">🐱<br>🟫🟫🟫</div>',
                say('"تحت" معناها أسفل الحاجة. الكورة تحت الترابيزة.', 'Under means below. The ball is under the table.') + '<div class="tbig" style="font-size:44px;line-height:1.1">🟫🟫🟫<br>⚽</div>'],
            digital: [say('الساعة الرقمية بتكتب الساعات وبعدين الدقايق. 3:00 يعني الساعة تلاتة بالظبط.', 'A digital clock shows the hour, then the minutes. 3:00 means three o\'clock.') + '<div class="tbig">3:00</div>',
                say('4:30 يعني أربعة ونص. الدقايق 30 هي النص.', '4:30 means half past four. Thirty minutes is a half.') + '<div class="tbig">4:30</div>',
                say('7:15 يعني سبعة وربع. الدقايق 15 هي الربع.', '7:15 means quarter past seven. Fifteen minutes is a quarter.') + '<div class="tbig">7:15</div>'],
            tens: [say('عشر آحاد بيكوّنوا عشرة واحدة. العشرة شكلها عصاية.', 'Ten ones make one ten. A ten looks like a rod.') + blocks(10),
                say('نعد بالعشرات: 10 و 20 و 30 لحد 100.', 'Count by tens: 10, 20, 30, up to 100.') + tmChips([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]),
                say('تلات عشرات يساووا 30.', 'Three tens make 30.') + blocks(30) + stp('3 tens = 30')],
            addtens: [say('نجمع العشرات زي ما نجمع الآحاد! 2 عشرات و 3 عشرات = 5 عشرات.', 'We add tens just like ones! 2 tens plus 3 tens is 5 tens.') + blocks(50) + stp('20 + 30 = 50'),
                say('40 + 10: أربع عشرات وعشرة واحدة = خمس عشرات = 50.', '40 + 10: four tens and one ten is five tens, that is 50.') + stp('40 + 10 = 50')],
            subtens: [say('نطرح العشرات زي ما نطرح الآحاد! 5 عشرات ناقص 2 عشرات = 3 عشرات.', 'We subtract tens just like ones! 5 tens minus 2 tens is 3 tens.') + blocks(50) + stp('50 − 20 = 30'),
                say('80 − 30: تمان عشرات ناقص تلات عشرات = خمس عشرات = 50.', '80 − 30: eight tens minus three tens is five tens, that is 50.') + stp('80 − 30 = 50')],
            make: [say('عشان نكوّن أكبر عدد، نحط الرقم الأكبر في خانة العشرات. الرقمين 3 و 7: الأكبر 73.', 'To make the greatest number, put the biggest digit in the tens place. With 3 and 7, the greatest is 73.') + stp('3 , 7 → <b>73</b>'),
                say('وعشان نكوّن أصغر عدد، نحط الرقم الأصغر في خانة العشرات. الأصغر 37.', 'To make the smallest number, put the smallest digit in the tens place. The smallest is 37.') + stp('3 , 7 → <b>37</b>')],
            ord: [say('الأرقام الترتيبية بتقول مكان الحاجة: الأول والتاني والتالت.', 'Ordinal numbers tell the place of something: first, second, third.') + tmChips(['1st', '2nd', '3rd', '4th', '5th']),
                say('وكمان: السادس والسابع والتامن والتاسع والعاشر.', 'And also: sixth, seventh, eighth, ninth and tenth.') + tmChips(['6th', '7th', '8th', '9th', '10th'])],
            day: [say('الأسبوع فيه سبع أيام.', 'A week has seven days.') + tmChips(TM_DAYS.map(function (d) { return d[0].slice(0, 3); })),
                say('الأيام بتيجي دايماً بنفس الترتيب، وبعد الجمعة بنبدأ من السبت تاني.', 'The days always come in the same order, and after Friday we start again with Saturday.') + tmChips(TM_DAYS.map(function (d) { return d[0].slice(0, 3); }))],
            month: [say('السنة فيها اتناشر شهر.', 'A year has twelve months.') + tmChips(TM_MONTHS.slice(0, 6).map(function (d) { return d[0].slice(0, 3); })) + tmChips(TM_MONTHS.slice(6).map(function (d) { return d[0].slice(0, 3); })),
                say('بعد يناير بييجي فبراير، وبعد ديسمبر بنبدأ سنة جديدة.', 'After January comes February, and after December a new year starts.') + tmChips(['Jan', 'Feb', 'Mar'])]
        };
        return T[k];
    }
    function tmPoolPage(kind) {
        var m = { test: ['وقت الاختبار! نشوف إنت فاكر إيه من الدروس اللي فاتت. خد وقتك.', 'Test time! Let us see what you remember from the last few units. Take your time.'], rev: ['وقت المراجعة! هنرجع على اللي اتعلمناه.', 'Revision time! Let us go back over what we learned.'], exam: ['ده الامتحان النهائي! كل الترم مخلوط. أنا واثق فيك!', 'This is the final exam! The whole term is mixed together. I believe in you!'], model: ['ده نموذج امتحان للتدريب. عامله زي الامتحان بالظبط!', 'This is a practice exam model. Treat it like the real exam!'] }[kind];
        return [say(m[0], m[1])];
    }

    function tmUnit(t, i, u, id, ico) {
        var ttl = u[0], ty = u[1], m, L = function (pages, gen, base, mc) { var l = lvl(id, ico, ttl, u[3], pages, gen, mc !== false); l.tm = 1; l.clip = base || null; return l; }, reuse = function (p, gen) { return L(p.learn, gen || p.gen, p.id); };
        if ((m = ttl.match(/^Numbers \((\d+) ?- ?(\d+)\)/))) { var lo = +m[1], hi = +m[2]; return L(numPages(lo, hi), function () { return r(0, 3) === 0 ? genBefore([0, 1, 2], hi) : genHowMany(lo, hi); }); }
        if ((m = ttl.match(/^Number letters \((\d+)(?: ?- ?(\d+))?\)/))) { var a = +m[1], b = m[2] ? +m[2] : a, tens = a >= 20, ns = []; if (tens) for (var x = a; x <= b; x += 10) ns.push(x); else ns = tmRange(a, b);
            return L(letPages(ns, tens), function () { var q = r(0, 2); return q === 0 ? genNumWord(a, b) : q === 1 ? genWordNum(a, b) : genMissing(a, b, tens); }); }
        if (ttl === 'More - Less - Equal') return reuse(PP.cmp, function () { return genCmp(20, true); });
        if (ttl === 'More than - less than') return reuse(PP.cmp, function () { return genCmp(50, true); });
        if (ttl === 'Compare 2 digits numbers') return reuse(PP.cmp, function () { return genCmp(99, true); });
        if (ttl === 'Between and After') return L(baPages('ba'), function () { return genBefore([1, 2], 30); });
        if (ttl === 'Before') return L(baPages('before'), function () { return genBefore([0, 2], 30); });
        if (ttl === 'The number line strategies') return reuse(PP.nl);
        if (ttl === 'Arrange ascending') return L(arrPages(1), function () { return genArr(1, 50); });
        if (ttl === 'Arrange descending') return L(arrPages(0), function () { return genArr(0, 99); });
        if (ttl === 'Addition') return reuse(PP.a1);
        if (ttl === 'Minus') return reuse(PP.s1);
        if (ttl === 'Tallest and shortest') return L(tmPages('tall'), genTallest);
        if (ttl === 'Shapes') return L(tmPages('shapes'), genShape);
        if (ttl === "On - under") return L(tmPages('onunder'), genOnUnder);
        if (ttl === 'Tens') return L(tmPages('tens'), genTensCount);
        if (ttl === 'Add tens') return L(tmPages('addtens'), function () { return genTens('+'); });
        if (ttl === 'Subtract tens') return L(tmPages('subtens'), function () { return genTens('-'); });
        if (ttl === 'Tens - ones') return reuse(PP.exp2);
        if (ttl.indexOf('Making greatest') === 0) return L(tmPages('make'), function () { return genMakeNum(r(0, 1)); });
        if (ttl === 'Add 2-digit number') return reuse(PP.a4);
        if (ttl === 'Subtract 2-digit number') return reuse(PP.s4);
        if (ttl === 'Money' || ttl === 'Count money') return reuse(PP.mo);
        if (ttl === "What's the time") return reuse(PP.tm);
        if (ttl === 'Digital clock') return L(tmPages('digital'), genDigital);
        if (ttl === 'Fractions') return reuse(PP.f1);
        if (ttl === 'Ordinal numbers') return L(tmPages('ord'), genOrdinal);
        if (ttl === 'Day of the week') return L(tmPages('day'), genDay);
        if (ttl === 'Months of the year') return L(tmPages('month'), genMonth);
        var kind = ty === 'exam' ? 'exam' : ty === 'model' ? 'model' : ty === 'rev' ? 'rev' : 'test';
        var l = L(tmPoolPage(kind), function () { return genHowMany(1, 10); }, 'tm' + kind); l.pool = kind; return l;
    }
    function tmBuild() {
        TMLV = []; TMSEC = { 1: [], 2: [] };
        [1, 2].forEach(function (t) {
            var lv = TMU['t' + t].map(function (u, i) { var l = tmUnit(t, i, u, 'tm' + t + '_' + (i + 1), String.fromCodePoint(parseInt(u[2], 16))); l.tmType = u[1]; l.tmTerm = t; l.tmIdx = i; l.tmTitle = u[0]; return l; });
            var content = lv.filter(function (l) { return !l.pool; }), mi = 0;
            lv.forEach(function (l, i) {
                if (!l.pool) return;
                var before = content.filter(function (c) { return c.tmIdx < i; }), pool;
                if (l.pool === 'test') pool = before.slice(-5); else if (l.pool === 'rev') pool = before; else if (l.pool === 'exam') pool = content; else { var st = (mi++ * 5) % content.length; pool = []; for (var k = 0; k < 12; k++) pool.push(content[(st + k) % content.length]); }
                if (!pool.length) pool = content.slice(0, 3);
                l.gen = function () { var q = pk(pool).gen(); return q; };
                l.pools = pool.length;
            });
            TM_SECDEF[t].forEach(function (s, k) {
                var sec = { id: 'tms' + t + k, en: s[0], ar: s[1], ico: '', levels: lv.slice(s[4], s[5]), tmSec: k }; TMSEC[t].push(sec);
                sec.levels.forEach(function (l, j) { l.track = sec; l.idx = j; l.tmSecIdx = k; });
            });
            TMSEC[t].forEach(function (sec, k) { var nx = TMSEC[t][k + 1]; if (nx) sec.nextTrack = nx; });
            TMLV = TMLV.concat(lv);
        });
    }
    function tmEmoji(hex) { return '<img class="em" alt="" src="img/e/' + hex + '.svg" onerror="this.style.display=\'none\'">'; }
    function tmHead(t, compactSecHead) {
        var L = TMLV.filter(function (l) { return l.tmTerm === t; }), done = L.filter(function (l) { return starsOf(l) >= 1; }).length, tot = TMLV.reduce(function (s, l) { return s + starsOf(l); }, 0);
        return '<div class="hh tmh cpt"><div class="tbr"><div class="chip">⭐ ' + tot + '</div><div class="logo"><b>Top Math</b><small>منهج الكتاب المدرسي</small></div><button class="gear" id="mc" aria-label="settings">⚙️</button></div>'
            + '<div class="tabs3"><button data-tab="ar">رياضيات بالعربي<small>Arabic Math</small></button><button data-tab="en">Math in English<small>رياضيات بالإنجليزي</small></button><button class="on">Top Math 📘<small>الكتاب المدرسي</small></button></div>'
            + '<div class="ov"><i style="width:' + Math.round(done / L.length * 100) + '%"></i></div><div class="ovt">' + done + ' / ' + L.length + ' units done · Foundation / KG</div></div>';
    }
    function tmMap() {
        injectTm(); var t = state.tmTerm || 1, sk = state.tmSec, nm = kidName(), secs = TMSEC[t], L = TMLV.filter(function (l) { return l.tmTerm === t; });
        var nxt = L.filter(function (l) { return !starsOf(l); })[0] || L.filter(function (l) { return starsOf(l) < 3; })[0], h;
        if (sk == null || !secs[sk]) {
            h = tmHead(t) + '<div class="terms"><button data-term="1" class="' + (t === 1 ? 'on' : '') + '">First term<br><small>45 units</small></button><button data-term="2" class="' + (t === 2 ? 'on' : '') + '">Second term<br><small>44 units</small></button></div>'
                + '<div class="hlab">Choose a section ' + tmEmoji('1f447') + '</div><div class="tscs">';
            secs.forEach(function (sec, k) {
                var s = TM_SECDEF[t][k], n = sec.levels.length, dn = sec.levels.filter(function (l) { return starsOf(l) >= 1; }).length, types = [], rec = nxt && nxt.tmSecIdx === k;
                sec.levels.forEach(function (l) { if (types.indexOf(l.tmType) < 0) types.push(l.tmType); });
                h += '<button class="tsc ' + (rec ? 'rec' : '') + (k === secs.length - 1 && secs.length % 2 ? ' wide' : '') + '" data-sec="' + k + '"><div class="si" style="background:' + s[3] + '22">' + tmEmoji(s[2]) + '</div><div><b>' + s[0] + '</b><small>' + s[1] + '</small><div class="pb"><i style="width:' + Math.round(dn / n * 100) + '%"></i></div><div class="cnt">' + dn + ' / ' + n + ' units</div><div class="dts">' + types.slice(0, 6).map(function (x) { return '<i style="background:' + TM_COL[x] + '"></i>'; }).join('') + '</div></div></button>';
            });
            h += '</div>';
        } else {
            var sec = secs[sk], s = TM_SECDEF[t][sk], n = sec.levels.length, dn = sec.levels.filter(function (l) { return starsOf(l) >= 1; }).length;
            h = '<div class="hh tmh cpt" style="padding-bottom:16px"><div class="tsh"><button class="bk" id="bk" aria-label="back">‹</button><div><b>' + s[0] + '</b><small>' + s[1] + ' · Term ' + t + ' · ' + n + ' units</small></div></div><div class="chips">' + secs.map(function (x, k) { return '<span data-sec="' + k + '" class="' + (k === sk ? 'on' : '') + '">' + TM_SECDEF[t][k][6] + '</span>'; }).join('') + '</div><div class="ov" style="margin-top:12px"><i style="width:' + Math.round(dn / n * 100) + '%"></i></div><div class="ovt">' + dn + ' / ' + n + ' units done</div></div>';
            h += '<div class="path tmn" style="--c:#14B8A6">';
            sec.levels.forEach(function (l, i) {
                var st = starsOf(l), cur = nxt && nxt.id === l.id, dx = [0, -48, -72, -48, 0, 48, 72, 48][i % 8], sp = ['test', 'exam', 'model', 'rev'].indexOf(l.tmType) >= 0 ? l.tmType : '';
                h += '<div class="nd" style="transform:translateX(' + dx + 'px)">' + (cur ? '<div class="go-b">Go!</div>' : '') + '<button class="n ' + sp + (st >= 3 ? ' dn' : cur ? ' cur' : '') + '" data-l="' + l.id + '" style="' + (sp ? '' : 'background:linear-gradient(160deg,' + TM_COL[l.tmType] + 'cc,' + TM_COL[l.tmType] + ');') + '">' + l.ico + '<span class="ub">' + (l.tmIdx + 1) + '</span></button><div class="nl">' + l.tmTitle + '<small>' + l.ar + '</small></div>' + (st ? '<div class="nst">' + starImgs(st) + '</div>' : '') + '</div>';
            });
            h += '</div>';
        }
        el(h, 'home'); root.setAttribute('dir', 'ltr'); emojify(root);
        var cb = root.querySelector('.n.cur'); if (cb) cb.parentNode.insertAdjacentHTML('afterbegin', '<img class="mm" src="mike/green_stand.png" alt="" style="left:calc(50% + 56px)">');
        var g = function (q, f) { root.querySelectorAll(q).forEach(f); };
        g('#mc', function (b) { b.onclick = settings; });
        g('[data-tab]', function (b) { b.onclick = function () { state.tab = ''; save(); setLang(b.getAttribute('data-tab')); window.__scrolled = 0; map(); }; });
        g('[data-term]', function (b) { b.onclick = function () { state.tmTerm = +b.getAttribute('data-term'); state.tmSec = null; save(); tmMap(); }; });
        g('[data-sec]', function (b) { b.onclick = function () { state.tmSec = +b.getAttribute('data-sec'); save(); tmMap(); var m = root; try { m.scrollTop = 0; } catch (e) {} }; });
        g('#bk', function (b) { b.onclick = function () { state.tmSec = null; save(); tmMap(); }; });
        g('.n', function (b) { b.onclick = function () { learn(TMLV.filter(function (x) { return x.id === b.getAttribute('data-l'); })[0], 0); }; });
    }
    function tmOpen() { state.tab = 'tm'; if (LG !== 'en') setLang('en'); save(); window.__scrolled = 0; tmMap(); }


    /* ---------- mini-games (Mike hosts) ---------- */
    var GAMES = [
        { id: 'g_build', ico: '🧱', ar: 'بنّاء الأرقام', en: 'Number Builder', sub: 'ابني العدد بالمكعبات', subEn: 'Build the number with blocks', col: '#FF9F43', col2: '#F97316' },
        { id: 'g_hop', ico: '🐸', ar: 'الضفدع القافز', en: 'Hopping Frog', sub: 'اقفز على خط الأعداد', subEn: 'Hop on the number line', col: '#22C55E', col2: '#15A34A' },
        { id: 'g_ten', ico: '🔟', ar: 'كوّن العشرة', en: 'Make Ten', sub: 'كمّل لـ 10 بسرعة', subEn: 'Complete to 10 fast', col: '#2DA8FF', col2: '#1D7FE0' },
        { id: 'g_race', ico: '🏁', ar: 'سباق الجداول', en: 'Tables Race', sub: 'جاوب بسرعة في 45 ثانية', subEn: 'Answer fast in 45 seconds', col: '#8F6BFF', col2: '#6C4DF6' },
        { id: 'g_div', ico: '➗', ar: 'سباق القسمة', en: 'Division Race', sub: 'اقسم بسرعة في 45 ثانية', subEn: 'Divide fast in 45 seconds', col: '#FF5C7A', col2: '#E5365A', kind: 'div' }
    ];
    function gstars(id) { return (PS().games && PS().games[id]) || 0; }
    function gsave(id, s) { var g = PS().games = PS().games || {}; if (s > (g[id] || 0)) { g[id] = s; save(); } }
    function gshell(g, rounds, build, scoreFn) {
        var S = { i: 0, pts: 0 };
        function round() {
            if (S.i >= rounds) { var st = scoreFn(S); gsave(g.id, st); var dl = mikeLine('done'); mikePlay(dl.id); setTimeout(function () { if (st >= 2 && root) confetti(); }, 150); bumpStreak();
                el(mikeBox(dl.t, 'cheer') + '<div class="card"><div class="stars">' + starStr(st) + '</div><div class="q">' + tx(g.ar, g.en) + '</div><div class="say">' + S.pts + tx(' نقطة', ' points') + '</div></div><button class="btn" id="ag">🔁 ' + tx('العب تاني', 'Play again') + '</button><button class="btn o" id="mp">🗺️ ' + tx('الخريطة', 'Map') + '</button>');
                root.querySelector('#ag').onclick = function () { startGame(g); }; root.querySelector('#mp').onclick = map; return; }
            var done = false;
            var api = { good: function (pt) { if (done) return; done = true; S.pts += (pt == null ? 10 : pt); try { SFX.play('chime'); } catch (e) {} var ml = mikeLine('ok'); mikeSet(ml.t, 'cheer', ml.id); var gg = scr; setTimeout(function () { if (gg === scr && root) { S.i++; round(); } }, 1300); },
                bad: function () { var rl = mikeLine('retry'); mikeSet(rl.t, 'stand', rl.id); }, S: S, N: S.i };
            el(topbar('<button class="mx" id="mc">✕</button>', g.ico + ' ' + tx(g.ar, g.en), '<div class="mst">' + (S.i + 1) + '/' + rounds + '</div>') + '<div class="pg"><i style="width:' + Math.round(S.i / rounds * 100) + '%"></i></div><div id="mkx">' + mikeBox(tx(g.sub, g.subEn), 'stand', 'sm') + '</div><div class="card" id="gb"></div>');
            root.querySelector('#mc').onclick = map; build(root.querySelector('#gb'), api);
        }
        round();
    }
    function startGame(g) {
        try { if (mAud) mAud.pause(); NA.stop(); } catch (e) {}
        if (g.id === 'g_build') gshell(g, 6, function (box, api) {
            var n = pk([r(11, 99), r(101, 900)]), h = 0, t = 0, o = 0;
            box.innerHTML = '<div class="q">' + tx('ابني العدد ', 'Build the number ') + B(n) + '</div>' + qBox() + '<div id="bv"></div><div class="bld" dir="ltr"><button style="background:' + COL[2] + '" data-p="2">+100</button><button style="background:' + COL[1] + '" data-p="1">+10</button><button style="background:' + COL[0] + '" data-p="0">+1</button></div><div class="bld"><button style="background:#888" id="bu">↩️ ' + tx('امسح', 'Clear') + '</button><button style="background:#22C55E" id="bk">✓ ' + tx('تمام', 'Done') + '</button></div>';
            var sq = (LG === 'ar') ? ['q_build'].concat(N(n)) : null; var sp = box.querySelector('.spk'); if (sp) sp.onclick = function () { speak(sq); }; setTimeout(function () { speak(sq); }, 250);
            function draw() { var v = h * 100 + t * 10 + o; box.querySelector('#bv').innerHTML = '<div class="big" style="font-size:26px">' + v + '</div>' + blocks(v); emojify(box); }
            draw();
            box.querySelectorAll('[data-p]').forEach(function (b) { b.onclick = function () { var p = Number(b.getAttribute('data-p')); if (p === 2) h = Math.min(9, h + 1); else if (p === 1) { t++; if (t > 9) { t = 0; h++; } } else { o++; if (o > 9) { o = 0; t++; if (t > 9) { t = 0; h++; } } } draw(); }; });
            box.querySelector('#bu').onclick = function () { h = t = o = 0; draw(); };
            box.querySelector('#bk').onclick = function () { if (h * 100 + t * 10 + o === n) api.good(); else { api.bad(); } };
        }, function (S) { return S.pts >= 55 ? 3 : S.pts >= 40 ? 2 : S.pts >= 20 ? 1 : 0; });
        else if (g.id === 'g_hop') gshell(g, 7, function (box, api) {
            var plus = r(0, 1), n = r(2, 6), s = plus ? r(0, 20 - n) : r(n, 20), e = plus ? s + n : s - n, h = '';
            for (var v = 0; v <= 20; v++) h += '<button data-v="' + v + '" class="' + (v === s ? 'me' : '') + '">' + v + '</button>';
            box.innerHTML = '<div class="q">🐸 ' + tx('الضفدع واقف على ', 'The frog is on ') + B(s) + tx('. اقفز ', '. Hop ') + '<b>' + n + '</b> ' + hopsTxt(plus) + tx('. اضغط مكان الوصول!', '. Tap where it lands!') + '</div>' + qBox() + '<div class="nlk">' + h + '</div>';
            emojify(box); var sq = LG === 'ar' ? ['q_nl_start'].concat(N(s), 'q_jump', N(n), 'q_steps', plus ? 'q_right' : 'q_left', 'q_arrive') : null; var sp = box.querySelector('.spk'); if (sp) sp.onclick = function () { speak(sq); }; setTimeout(function () { speak(sq); }, 250);
            box.querySelectorAll('[data-v]').forEach(function (b) { b.onclick = function () { if (Number(b.getAttribute('data-v')) === e) { b.classList.add('ok'); api.good(); } else { b.classList.add('no'); api.bad(); } }; });
        }, function (S) { return S.pts >= 60 ? 3 : S.pts >= 40 ? 2 : S.pts >= 20 ? 1 : 0; });
        else if (g.id === 'g_ten') gshell(g, 8, function (box, api) {
            var a = r(1, 9), q = { ans: 10 - a };
            box.innerHTML = '<div class="q">' + tx('كام نزود على ', 'How many more to get from ') + B(a) + tx(' عشان نوصل ', ' to ') + B(10) + '?</div>' + qBox() + '<div class="mb" style="margin:6px 0">' + (function () { var s = ''; for (var i = 0; i < 10; i++) s += '<i class="bo" style="' + (i < a ? '' : 'background:#e6dfff;box-shadow:none') + '"></i>'; return s; })() + '</div><div class="opts">' + optsOf({ ans: q.ans }).filter(function () { return true; }).map(function (o) { return '<button class="opt" data-v="' + o + '">' + o + '</button>'; }).join('') + '</div>';
            var sq = LG === 'ar' ? ['q_ten_a'].concat(N(a), 'q_ten_b') : null; var sp = box.querySelector('.spk'); if (sp) sp.onclick = function () { speak(sq); }; setTimeout(function () { speak(sq); }, 250);
            box.querySelectorAll('.opt').forEach(function (b) { b.onclick = function () { if (Number(b.getAttribute('data-v')) === q.ans) { b.classList.add('ok'); api.good(); } else { b.classList.add('no'); api.bad(); } }; });
        }, function (S) { return S.pts >= 70 ? 3 : S.pts >= 50 ? 2 : S.pts >= 30 ? 1 : 0; });
        else raceStart(g);
    }
    function raceStart(g) {
        var div = g.kind === 'div';
        el(topbar('<button class="mx" id="mc">✕</button>', g.ico + ' ' + tx(g.ar, g.en), '<div class="mst">45s</div>') + mikeBox(tx('اختار الجدول اللي عايز تتسابق فيه!', 'Pick the table you want to race!'), 'stand') + '<div class="card"><div class="opts" id="tp"></div></div>');
        var h = ''; [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].concat(['all']).forEach(function (t) { h += '<button class="opt" data-t="' + t + '" style="font-size:24px" dir="ltr">' + (t === 'all' ? tx('كل الجداول', 'All') : (div ? '÷ ' : '× ') + t) + '</button>'; });
        root.querySelector('#tp').innerHTML = h; root.querySelector('#mc').onclick = map;
        root.querySelectorAll('[data-t]').forEach(function (b) { b.onclick = function () { raceRun(g, b.getAttribute('data-t')); }; });
    }
    function raceRun(g, t) {
        var left = 45, pts = 0, ok = 0, tk = null, run = scr + 1, div = g.kind === 'div';
        function q() {
            var a = t === 'all' ? r(2, 12) : Number(t), b = r(2, 12), prod = a * b, qq = { ans: div ? b : prod }, opts = distract(qq), expr = div ? prod + ' ÷ ' + a : a + ' × ' + b;
            el(topbar('<button class="mx" id="mc">✕</button>', g.ico + ' ' + tx(g.ar, g.en), '<div class="mst tm" id="tm">⏱ ' + left + '</div>') + '<div id="mkx">' + mikeBox(tx('أسرع ما تقدر! ', 'As fast as you can! ') + (ok ? ok + ' ✔ 🔥' : ''), 'stand', 'sm') + '</div><div class="card"><div class="q"><span class="big" dir="ltr">' + expr + ' = ?</span></div>' + qBox() + '<div class="opts">' + opts.map(function (o) { return '<button class="opt" data-v="' + o + '">' + o + '</button>'; }).join('') + '</div></div>');
            run = scr; root.querySelector('#mc').onclick = function () { clearInterval(tk); map(); };
            var sq = LG === 'ar' ? (div ? N(prod).concat('op_div', N(a), 'op_equals', 'op_q') : N(a).concat('op_times', N(b), 'op_equals', 'op_q')) : null; if (div) sq = null; var sp = root.querySelector('.spk'); if (sp) sp.onclick = function () { speak(sq); }; speak(sq);
            root.querySelectorAll('.opt').forEach(function (bt) { bt.onclick = function () { if (Number(bt.getAttribute('data-v')) === qq.ans) { ok++; pts += 10; try { SFX.play('chime'); } catch (e) {} q(); } else { bt.classList.add('no'); left = Math.max(0, left - 2); var tm = root.querySelector('#tm'); if (tm) tm.textContent = '⏱ ' + left; } }; });
        }
        q();
        tk = setInterval(function () {
            if (!root || scr !== run) { clearInterval(tk); return; }
            left--; var tm = root.querySelector('#tm'); if (tm) tm.textContent = '⏱ ' + left;
            if (left <= 0) { clearInterval(tk); var st = ok >= 18 ? 3 : ok >= 12 ? 2 : ok >= 6 ? 1 : 0; gsave(g.id, st); var dl = mikeLine('done'); mikePlay(dl.id); setTimeout(function () { if (st >= 2 && root) confetti(); }, 150); bumpStreak();
                el(mikeBox(dl.t, 'cheer') + '<div class="card"><div class="stars">' + starStr(st) + '</div><div class="q">' + ok + tx(' إجابة صح في 45 ثانية!', ' right answers in 45 seconds!') + '</div></div><button class="btn" id="ag">🔁 ' + tx('العب تاني', 'Play again') + '</button><button class="btn o" id="mp">🗺️ ' + tx('الخريطة', 'Map') + '</button>');
                root.querySelector('#ag').onclick = function () { raceStart(g); }; root.querySelector('#mp').onclick = map; }
        }, 1000);
    }

    /* ---------- open ---------- */
    function splash(done) {
        var d = document.createElement('div'); d.className = 'sp'; d.innerHTML = '<img src="mike/green_cheer.png" alt=""><b>Math Academy</b><small>أكاديمية الماث</small>'; document.body.appendChild(d);
        setTimeout(function () { d.style.opacity = 0; setTimeout(function () { d.remove(); if (done) done(); }, 450); }, 1300);
    }
    function open() {
        if (!state) return; injectCss(); close();
        try { VO.stop(); } catch (e) {}
        LG = state.lang === 'en' ? 'en' : 'ar'; buildCur();
        var bgd = document.createElement('div'); bgd.className = 'mathbg'; bgd.id = 'mathbg'; var SY = ['1', '2', '3', '+', '−', '×', '÷', '=', '5', '7', '9', 'π', '∑', '△', '◯', '▢', '%', '8', '4', '6'];
        bgd.innerHTML = SY.map(function (c, i) { var o = c === '◯', q = c === '▢'; return '<span class="' + (o ? 'o' : q ? 'sq' : '') + '" style="left:' + ((i * 37 + 7) % 92) + '%;top:' + ((i * 53 + 11) % 90) + '%;font-size:' + (o || q ? 40 : 34 + (i * 11) % 44) + 'px;' + ((o || q) ? 'width:' + (34 + (i * 7) % 30) + 'px;height:' + (34 + (i * 7) % 30) + 'px;' : '') + 'animation-duration:' + (7 + (i * 3) % 8) + 's;animation-delay:-' + (i % 7) + 's">' + ((o || q) ? '' : c) + '</span>'; }).join('');
        document.body.appendChild(bgd);
        root = document.createElement('div'); root.id = 'ma'; document.body.appendChild(root); map(); splash();
        var hid = (LG === 'ar') ? ((isMalek() && MK_AVAIL.mk_hello_malek) ? 'mk_hello_malek' : (MK_AVAIL.mk_hello ? 'mk_hello' : null)) : (MK_AVAIL.en_mk_hello ? 'en_mk_hello' : null);
        if (hid && !window.__mkHello) { window.__mkHello = true; var played = false, go = function () { if (played) return; played = true; mikePlay(hid); document.removeEventListener('pointerdown', go, true); };
            try { var t = new Audio('audio/mike/' + hid + '.m4a'); var pr = t.play(); if (pr && pr.then) pr.then(function () { played = true; document.removeEventListener('pointerdown', go, true); if (state && state.muted) t.pause(); }).catch(function () {}); } catch (e) {}
            document.addEventListener('pointerdown', go, true); }
    }
    return { _seq: function (q) { var qs = qSeq(q); return { q: qs, ar: qs.ar || [], e: explSeq(q, q.ans) }; }, _cur: function () { return curQ; }, open: open, close: close, _tmids: function () { return TMLV.map(function (l) { return l.id; }); }, _tmlearn: function (id) { var l = TMLV.filter(function (x) { return x.id === id; })[0]; learn(l, 0); }, _tmlv: function () { return TMLV; }, _tmlvAr: function () { var o = LG; LG = 'ar'; buildCur(); var r = TMLV.map(function (l) { return { id: l.id, clip: l.clip, pages: l.learn.map(function (p) { var m = p.match(/<div class="say">([\s\S]*?)<\/div>/); return m ? m[1] : null; }) }; }); LG = o; buildCur(); return r; }, _all: function () { return ALL; }, _gen: function (id) { return ALL.filter(function (l) { return l.id === id; })[0].gen(); }, _lang: function (l) { setLang(l); }, _levels: function () { return ALL.map(function (l) { return l.id; }); }, _lvl: function (id) { return ALL.filter(function (l) { return l.id === id; })[0]; } };
})();
