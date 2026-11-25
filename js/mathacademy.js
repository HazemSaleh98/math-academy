'use strict';
/* ================= Math Academy (DOM overlay) =================
   Place value -> add -> subtract -> multiply + tables 1-12. Concept pages, practice (hints), quiz (stars). */
var MathAcademy = (function () {
    var root = null, css = false;
    function r(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
    function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = r(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    var PN = ['آحاد', 'عشرات', 'مئات'];
    var COL = ['#2ecc71', '#4f8ef7', '#ff9f43'];
    function dig(n, i) { return Math.floor(n / Math.pow(10, i)) % 10; }
    function len(n) { return String(n).length; }

    /* ---------- visuals ---------- */
    function blocks(n) {
        var h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, o = n % 10, s = '<div class="mb">';
        if (h) { s += '<div class="mbg"><div class="mbl" style="color:' + COL[2] + '">' + h + ' مئات</div><div class="mbr">'; for (var i = 0; i < h; i++) s += '<i class="bh"></i>'; s += '</div></div>'; }
        if (t) { s += '<div class="mbg"><div class="mbl" style="color:' + COL[1] + '">' + t + ' عشرات</div><div class="mbr">'; for (i = 0; i < t; i++) s += '<i class="bt"></i>'; s += '</div></div>'; }
        if (o) { s += '<div class="mbg"><div class="mbl" style="color:' + COL[0] + '">' + o + ' آحاد</div><div class="mbr">'; for (i = 0; i < o; i++) s += '<i class="bo"></i>'; s += '</div></div>'; }
        return s + '</div>';
    }
    function placeTable(n) {
        var L = len(n), s = '<div class="pt">';
        for (var i = Math.max(L, 2) - 1; i >= 0; i--) s += '<div class="ptc"><div class="pth" style="background:' + COL[i] + '">' + PN[i] + '</div><div class="ptd" style="color:' + COL[i] + '">' + (i < L ? dig(n, i) : 0) + '</div></div>';
        return s + '</div>';
    }
    /* column arithmetic, showing the first `upto` places already worked */
    function work(a, b, op) {
        var L = Math.max(len(a), len(b)) + (op === '+' ? 1 : 0), res = [], car = [], steps = [], c = 0, i;
        var A = a, B = b;
        if (op === '+') {
            for (i = 0; i < L; i++) {
                var da = dig(a, i), db = dig(b, i), sum = da + db + c;
                if (i >= L - 1 && !sum && !c) { break; }
                var wr = sum % 10, nc = sum >= 10 ? 1 : 0;
                steps.push('<b style="color:' + COL[Math.min(i, 2)] + '">' + (PN[i] || 'آلاف') + ':</b> ' + da + ' + ' + db + (c ? ' + ' + c + ' (المحمول)' : '') + ' = ' + sum + (nc ? ' ← نكتب <b>' + wr + '</b> ونحمل <b>1</b> للعمود اللي جنبه' : ' ← نكتب <b>' + wr + '</b>'));
                res.push(wr); car.push(nc); c = nc;
            }
        } else {
            var bor = 0;
            for (i = 0; i < L; i++) {
                var xa = dig(a, i) - bor, xb = dig(b, i), nb = 0;
                if (i >= len(a)) break;
                var txt = '<b style="color:' + COL[Math.min(i, 2)] + '">' + PN[i] + ':</b> ';
                if (xa < xb) { nb = 1; txt += xa + ' أقل من ' + xb + '، فنستلف 1 من العمود اللي جنبه ← ' + (xa + 10) + ' − ' + xb + ' = <b>' + (xa + 10 - xb) + '</b>'; xa += 10; }
                else txt += xa + ' − ' + xb + ' = <b>' + (xa - xb) + '</b>' + (bor ? ' (بعد ما استلفنا منه 1)' : '');
                steps.push(txt); res.push(xa - xb); car.push(nb); bor = nb;
            }
        }
        return { res: res, car: car, steps: steps, L: res.length };
    }
    function col(a, b, op, upto, w) {
        w = w || work(a, b, op);
        var L = Math.max(w.L, len(a), len(b)), s = '<div class="col" dir="ltr">';
        s += '<div class="cr cc">'; for (var i = L - 1; i >= 0; i--) { var m = (op === '+') ? (i > 0 && i - 1 < upto && w.car[i - 1]) : (i < upto && w.car[i]); s += '<span>' + (m ? (op === '+' ? '1' : '−1') : '') + '</span>'; } s += '</div>';
        s += '<div class="cr"><span class="op"></span>'; for (i = L - 1; i >= 0; i--) s += '<span>' + (i < len(a) ? dig(a, i) : '') + '</span>'; s += '</div>';
        s += '<div class="cr"><span class="op">' + op + '</span>'; for (i = L - 1; i >= 0; i--) s += '<span>' + (i < len(b) ? dig(b, i) : '') + '</span>'; s += '</div><div class="cl"></div>';
        s += '<div class="cr ans"><span class="op"></span>'; for (i = L - 1; i >= 0; i--) s += '<span style="color:' + COL[Math.min(i, 2)] + '">' + (i < upto && i < w.L ? w.res[i] : '') + '</span>'; s += '</div></div>';
        return s;
    }
    function arr(n, m) {
        var s = '<div class="ar" style="grid-template-columns:repeat(' + m + ',16px)" dir="ltr">';
        for (var i = 0; i < n * m; i++) s += '<i></i>';
        return s + '</div>';
    }
    function tbl(n) {
        var s = '<div class="tb" dir="ltr">';
        for (var m = 1; m <= 12; m++) s += '<div><span>' + n + ' × ' + m + '</span><b>' + (n * m) + '</b></div>';
        return s + '</div>';
    }
    function skip(n, k) { var a = []; for (var i = 1; i <= k; i++) a.push(n * i); return '<div class="sk" dir="ltr">' + a.map(function (x) { return '<span>' + x + '</span>'; }).join('<em>›</em>') + '</div>'; }
    function nline(lo, hi, o) {
        o = o || {}; var W = 340, pad = 14, n = hi - lo, st = (W - 2 * pad) / n, H = 84, s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="max-width:380px;direction:ltr"><line x1="' + pad + '" y1="52" x2="' + (W - pad) + '" y2="52" stroke="#2d2a4a" stroke-width="4" stroke-linecap="round"/>';
        function X(v) { return pad + (v - lo) * st; }
        for (var v = lo; v <= hi; v++) { var big = (v % 5 === 0) || n <= 12; s += '<line x1="' + X(v) + '" y1="46" x2="' + X(v) + '" y2="58" stroke="#2d2a4a" stroke-width="2.5"/>'; if (big || n <= 12) s += '<text x="' + X(v) + '" y="75" font-size="' + (n > 12 ? 11 : 14) + '" text-anchor="middle" font-weight="800" fill="' + (o.hi === v ? '#e04a82' : '#2d2a4a') + '">' + v + '</text>'; }
        (o.hops || []).forEach(function (h) { var x1 = X(h[0]), x2 = X(h[1]), m = (x1 + x2) / 2, up = 12 + Math.abs(x2 - x1) / 4; s += '<path d="M' + x1 + ' 48 Q' + m + ' ' + (48 - up * 1.6) + ' ' + x2 + ' 48" fill="none" stroke="' + (h[1] > h[0] ? '#2ecc71' : '#ff6b6b') + '" stroke-width="3.5" stroke-linecap="round"/><circle cx="' + x2 + '" cy="48" r="3" fill="' + (h[1] > h[0] ? '#2ecc71' : '#ff6b6b') + '"/>'; });
        if (o.hi != null) s += '<circle cx="' + X(o.hi) + '" cy="52" r="8" fill="#ffd93d" stroke="#e04a82" stroke-width="3"/>';
        return s + '</svg>';
    }
    function hops(a, b) { var h = [], d = b > a ? 1 : -1; for (var v = a; v !== b; v += d) h.push([v, v + d]); return h; }
    function genNL() {
        var plus = r(0, 1), n = r(1, 5), s = plus ? r(0, 20 - n) : r(n, 20), e = plus ? s + n : s - n;
        return { html: 'على خط الأعداد: ابدأ من <span class="big">' + s + '</span> واقفز <b>' + n + '</b> خطوات ' + (plus ? 'لليمين ➡️' : 'لليسار ⬅️') + '. هتوصل لإيه؟', vis: nline(Math.max(0, Math.min(s, e) - 2), Math.min(20, Math.max(s, e) + 2), { hi: s }), ans: e, exp: nline(Math.max(0, Math.min(s, e) - 2), Math.min(20, Math.max(s, e) + 2), { hops: hops(s, e), hi: e }) + say(plus ? 'لليمين = <b>جمع</b>: ' + s + ' + ' + n + ' = ' + e : 'لليسار = <b>طرح</b>: ' + s + ' − ' + n + ' = ' + e) };
    }
    function say(t) { return '<div class="say">' + t + '</div>'; }

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
    function genPV(kind) {
        var n, q;
        if (kind === 1) {
            n = r(11, 99); var t = r(0, 3);
            if (t === 0) return { html: 'كام <b>عشرة</b> في العدد <span class="big">' + n + '</span>؟', vis: blocks(n), ans: dig(n, 1), exp: placeTable(n) + say('رقم العشرات هو ' + dig(n, 1)) };
            if (t === 1) return { html: 'إيه رقم <b>الآحاد</b> في <span class="big">' + n + '</span>؟', vis: placeTable(n), ans: dig(n, 0), exp: say('الآحاد هي الرقم اللي على اليمين: ' + dig(n, 0)) };
            if (t === 2) return { html: '<span class="big">' + dig(n, 1) + '</span> عشرات و <span class="big">' + dig(n, 0) + '</span> آحاد = ؟', vis: blocks(n), ans: n, exp: blocks(n) + placeTable(n) };
            return { html: 'قيمة الرقم <span class="big" style="color:' + COL[1] + '">' + dig(n, 1) + '</span> في العدد <span class="big">' + n + '</span> هي؟', vis: placeTable(n), ans: dig(n, 1) * 10, exp: say(dig(n, 1) + ' عشرات = ' + dig(n, 1) * 10) };
        }
        n = r(101, 900); var h = dig(n, 2), te = dig(n, 1), o = dig(n, 0), t2 = r(0, 3);
        if (t2 === 0) return { html: 'كام <b>مية</b> في العدد <span class="big">' + n + '</span>؟', vis: placeTable(n), ans: h, exp: placeTable(n) + say('رقم المئات هو ' + h) };
        if (t2 === 1) return { html: h + ' مئات + ' + te + ' عشرات + ' + o + ' آحاد = ؟', vis: blocks(n), ans: n, exp: blocks(n) + say(h * 100 + ' + ' + te * 10 + ' + ' + o + ' = ' + n) };
        if (t2 === 2) { var p = pk([0, 1, 2]); return { html: 'قيمة الرقم <span class="big" style="color:' + COL[p] + '">' + dig(n, p) + '</span> في العدد <span class="big">' + n + '</span> هي؟', vis: placeTable(n), ans: dig(n, p) * Math.pow(10, p), exp: say(PN[p] + ': ' + dig(n, p) + ' × ' + Math.pow(10, p) + ' = ' + dig(n, p) * Math.pow(10, p)) }; }
        return { html: '<span class="big">' + h * 100 + ' + ' + te * 10 + ' + ' + o + '</span> = ؟', vis: '', ans: n, exp: placeTable(n) + say('ندمج: ' + n) };
    }
    function qFrom(op, a, b, ans) {
        var exp;
        if (op === '×') {
            if (a === 0 || b === 0) exp = say('صفر مرات من أي حاجة = <b>0</b>: ' + a + ' × ' + b + ' = 0');
            else if (a === 1 || b === 1) exp = say('مرة واحدة بس! العدد بيفضل زي ما هو: ' + a + ' × ' + b + ' = ' + ans);
            else if (a <= 12 && b <= 12) exp = say(a + ' × ' + b + ' = ' + ans) + arr(Math.min(a, b), Math.max(a, b)) + skip(Math.min(a, b), Math.max(a, b)).replace(/<div class="sk"/, '<div class="sk"');
            else if (a % 10 === 0 || b % 10 === 0 || a === 100 || b === 100) exp = say('الضرب في ' + (a > b ? b : a) + ': نضيف أصفار. ' + a + ' × ' + b + ' = ' + ans);
            else { var big = Math.max(a, b), sm = Math.min(a, b); exp = say('نفصّل: ' + big + ' = ' + Math.floor(big / 10) * 10 + ' + ' + big % 10) + say(Math.floor(big / 10) * 10 + ' × ' + sm + ' = ' + Math.floor(big / 10) * 10 * sm + ' ، و ' + big % 10 + ' × ' + sm + ' = ' + big % 10 * sm) + say(Math.floor(big / 10) * 10 * sm + ' + ' + big % 10 * sm + ' = <b>' + ans + '</b>'); }
        } else {
            var w = work(a, b, op); exp = col(a, b, op, w.L, w) + '<div class="stp">' + w.steps.join('<br>') + '</div>';
        }
        return { html: '<span class="big" dir="ltr">' + a + ' ' + op + ' ' + b + ' = ?</span>', vis: '', ans: ans, exp: exp };
    }
    function mk(gen, o) { return function () { if (gen === 'pv') return genPV(o); var q = gen === 'add' ? genAdd(o) : gen === 'sub' ? genSub(o) : genMul(o); return qFrom(q.op, q.a, q.b, q.ans); }; }

    /* ---------- curriculum ---------- */
    function exStepPages(a, b, op) {
        var w = work(a, b, op), pgs = [];
        pgs.push('<div class="ex" dir="ltr">' + col(a, b, op, 0, w) + '</div>' + say('هنحلها خطوة بخطوة، <b>من اليمين</b> (الآحاد الأول)'));
        for (var i = 0; i < w.L; i++) pgs.push('<div class="ex" dir="ltr">' + col(a, b, op, i + 1, w) + '</div><div class="stp">' + w.steps[i] + '</div>');
        return pgs;
    }
    function lvl(id, ico, en, ar, learn, gen, mc) { return { id: id, ico: ico, en: en, ar: ar, learn: learn, gen: gen, mc: mc }; }
    var TIPS = {
        1: 'أي عدد × 1 = نفس العدد (مرة واحدة بس!). وأي عدد × 0 = صفر (صفر مرات = مفيش حاجة).',
        2: 'الضرب في 2 معناه نضاعف العدد (نجمعه مع نفسه). 6 × 2 = 6 + 6.',
        3: 'عدّ بالتلاتات: 3 ، 6 ، 9 ، 12 ... وكل مرة نزود 3.',
        4: 'الضرب في 4 = نضاعف مرتين. 7 × 4 = (7 × 2) × 2 = 14 × 2 = 28.',
        5: 'الضرب في 5: الناتج دايماً بينتهي بـ 0 أو 5. وممكن نحسب نص الضرب في 10.',
        6: '6 × 7 = (5 × 7) + 7 = 35 + 7 = 42. اضرب في 5 وزوّد مرة.',
        7: 'جدول 7: 7 ، 14 ، 21 ، 28 ، 35 ، 42 ، 49 ، 56 ، 63 ، 70 ... اتعلمه بالعدّ والغناء!',
        8: 'الضرب في 8 = نضاعف 3 مرات. 6 × 8 = 6 → 12 → 24 → 48.',
        9: 'خدعة التسعة: 9 × 4 = 36 (3 + 6 = 9). وكمان الناتج = (ضرب في 10) ناقص العدد. 9 × 6 = 60 − 6 = 54.',
        10: 'الضرب في 10: بنضيف صفر على اليمين. 7 × 10 = 70.',
        11: 'الضرب في 11 لحد 9: بنكرر الرقم. 11 × 4 = 44. و 11 × 12 = 132.',
        12: '12 × 7 = (10 × 7) + (2 × 7) = 70 + 14 = 84. فرّق 12 لـ 10 و 2.'
    };
    function tableLevel(n) {
        if (n === 1) return lvl('m1', '1️⃣', 'Table of 1 and 0', 'جدول 1 (وكمان الصفر)', [
            say('جدول <b>1</b> أسهل جدول: مرة واحدة بس من كل عدد!') + '<div class="ex">' + arr(1, 5) + '</div>' + say('1 × 5 = 5 &nbsp; (صف واحد فيه 5 نقط)'),
            say('أي عدد × 1 يفضل <b>زي ما هو</b>.') + skip(1, 12),
            tbl(1),
            say('والصفر؟ <b>0 مرات</b> من أي حاجة = مفيش حاجة!') + '<div class="stp" dir="ltr">0 × 7 = 0 &nbsp; | &nbsp; 7 × 0 = 0 &nbsp; | &nbsp; 1 × 0 = 0</div>',
            say('💡 ' + TIPS[1])
        ], mk('mul', { tbl: 1 }), true);
        return lvl('m' + n, '✖️', 'Table of ' + n, 'جدول ' + n, [
            say('جدول الضرب في <b>' + n + '</b>: العدد ده بيتكرر كذا مرة؟') + '<div class="ex">' + arr(n, 5) + '</div>' + say(n + ' × 5 = ' + (n * 5) + ' &nbsp; (' + n + ' في ٥ صفوف)'),
            say('العدّ القفزي (كل مرة نزود ' + n + '):') + skip(n, 12),
            tbl(n),
            say('💡 ' + TIPS[n])
        ], mk('mul', { tbl: n }), true);
    }
    var TRACKS = [
        {
            id: 'pv', ico: '🧱', ar: 'آحاد وعشرات ومئات', en: 'Place Value', color: '#ff9f43', levels: [
                lvl('pv1', '🧱', 'Ones & Tens', 'الآحاد والعشرات', [
                    say('كل رقم له <b>مكان</b>، والمكان بيحدد قيمته!') + blocks(34) + say('34 = 3 عشرات + 4 آحاد'),
                    placeTable(34) + say('اليمين: <b>آحاد</b> (واحد واحد). والشمال: <b>عشرات</b> (كل عشرة = 10).'),
                    say('عشرة آحاد بتبقى <b>عشرة واحدة</b>!') + '<div class="ex"><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i> <b>＝</b> <i class="bt"></i></div>',
                    blocks(57) + placeTable(57) + say('57 = 50 + 7')
                ], function () { return genPV(1); }, true),
                lvl('nl', '📏', 'Number line', 'خط الأعداد', [
                    say('خط الأعداد زي <b>شارع</b> فيه الأرقام بالترتيب. كل رقم أكبر من اللي قبله بواحد.') + nline(0, 10),
                    say('نبدأ من <b>3</b> ونقفز 4 خطوات <b>لليمين</b> (ده الجمع!):') + nline(0, 10, { hops: hops(3, 7), hi: 7 }) + say('3 + 4 = 7'),
                    say('وده الطرح: نبدأ من <b>8</b> ونقفز 3 خطوات <b>لليسار</b>:') + nline(0, 10, { hops: hops(8, 5), hi: 5 }) + say('8 − 3 = 5'),
                    say('يمين = أكبر ➕ &nbsp; | &nbsp; شمال = أصغر ➖') + nline(10, 20, { hops: hops(12, 16), hi: 16 }) + say('12 + 4 = 16')
                ], genNL, true),
                lvl('pv2', '🟧', 'Hundreds', 'المئات', [
                    say('عشر عشرات بتبقى <b>مية</b>!') + '<div class="ex"><i class="bt"></i><i class="bt"></i><i class="bt"></i><i class="bt"></i><i class="bt"></i><i class="bt"></i><i class="bt"></i><i class="bt"></i><i class="bt"></i><i class="bt"></i> <b>＝</b> <i class="bh"></i></div>',
                    blocks(243) + placeTable(243) + say('243 = 200 + 40 + 3'),
                    blocks(406) + placeTable(406) + say('406: مفيش عشرات! الصفر بيحجز المكان (4 مئات و 0 عشرات و 6 آحاد).'),
                    say('قيمة الرقم تتغير حسب مكانه:') + '<div class="ex big2" dir="ltr"><b style="color:' + COL[0] + '">5</b> = 5 &nbsp; <b style="color:' + COL[1] + '">5</b>0 = 50 &nbsp; <b style="color:' + COL[2] + '">5</b>00 = 500</div>'
                ], function () { return genPV(2); }, false)
            ]
        },
        {
            id: 'add', ico: '➕', ar: 'الجمع', en: 'Addition', color: '#2ecc71', levels: [
                lvl('a1', '➕', 'Add to 10', 'جمع لحد 10', [say('الجمع معناه <b>نضم</b> حاجتين مع بعض.') + '<div class="ex"><i class="bo"></i><i class="bo"></i><i class="bo"></i><b> + </b><i class="bo"></i><i class="bo"></i><b> = </b><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i></div>' + say('3 + 2 = 5')],
                    mk('add', { a: [1, 9], b: [1, 9], max: 10 }), true),
                lvl('a2', '🔟', 'Make 10', 'تكوين العشرة', [
                    say('خدعة جامدة: كمّل لـ <b>10</b> الأول!') + '<div class="stp" dir="ltr">8 + 5 → 8 + <b>2</b> + 3 → 10 + 3 = <b>13</b></div>',
                    say('جرب كمان: 9 + 6') + '<div class="stp" dir="ltr">9 + <b>1</b> + 5 = 10 + 5 = <b>15</b></div>'
                ], mk('add', { a: [2, 10], b: [2, 10], max: 20, min: 11 }), true),
                lvl('a3', '🧮', 'Tens + Ones', 'عشرات + آحاد', [
                    say('الآحاد بتتجمع مع الآحاد!') + blocks(34) + say('34 + 5: الآحاد 4 + 5 = 9 ← الناتج <b>39</b>'),
                    say('العشرات ما بتتغيرش.') + placeTable(52) + say('52 + 6 = 58')
                ], mk('add', { a: [11, 90], b: [1, 9], carry: 'no', max: 99 }), true),
                lvl('a4', '🏗️', 'Column Add', 'جمع بالأعمدة', [say('نكتب الأرقام <b>تحت بعض</b>: آحاد تحت آحاد، وعشرات تحت عشرات.')].concat(exStepPages(34, 25, '+')),
                    mk('add', { a: [11, 80], b: [11, 80], carry: 'no', max: 99 }), false),
                lvl('a5', '🎒', 'Carrying', 'الجمع بالحمل', [say('لو الآحاد زادت عن <b>9</b>؟ بنكتب الآحاد و<b>نحمل</b> العشرة للعمود الجنب!')].concat(exStepPages(38, 27, '+'), exStepPages(65, 49, '+')),
                    mk('add', { a: [15, 90], b: [9, 90], carry: 'yes', max: 190 }), false),
                lvl('a6', '🏰', 'Hundreds Add', 'جمع المئات', [say('نفس الفكرة بالظبط، بس فيه عمود تالت: <b>المئات</b>.')].concat(exStepPages(342, 215, '+')),
                    mk('add', { a: [101, 600], b: [101, 400], carry: 'no', max: 900 }), false),
                lvl('a7', '🚀', 'Big Carrying', 'جمع كبير بالحمل', [say('ممكن نحمل أكتر من مرة!')].concat(exStepPages(478, 356, '+')),
                    mk('add', { a: [150, 700], b: [120, 600], carry: 'yes', max: 900 }), false)
            ]
        },
        {
            id: 'sub', ico: '➖', ar: 'الطرح', en: 'Subtraction', color: '#4f8ef7', levels: [
                lvl('s1', '➖', 'Take away to 10', 'طرح لحد 10', [say('الطرح معناه <b>ناخد بعيد</b>.') + '<div class="ex"><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><i class="bo"></i><b> − </b><i class="bo"></i><i class="bo"></i><b> = </b><i class="bo"></i><i class="bo"></i><i class="bo"></i></div>' + say('5 − 2 = 3')],
                    mk('sub', { a: [2, 10], b: [1, 9], max: 10 }), true),
                lvl('s2', '🔟', 'Subtract to 20', 'طرح لحد 20', [say('نرجع لـ <b>10</b> الأول!') + '<div class="stp" dir="ltr">15 − 8 → 15 − <b>5</b> = 10 → 10 − <b>3</b> = <b>7</b></div>'],
                    mk('sub', { a: [11, 20], b: [2, 9], max: 20 }), true),
                lvl('s3', '🧮', 'Tens − Ones', 'طرح الآحاد', [say('بنطرح الآحاد من الآحاد.') + blocks(47) + say('47 − 5: الآحاد 7 − 5 = 2 ← <b>42</b>')],
                    mk('sub', { a: [20, 99], b: [1, 9], carry: 'no', max: 99 }), true),
                lvl('s4', '🏗️', 'Column Subtract', 'طرح بالأعمدة', [say('نكتب العدد الكبير فوق، ونطرح عمود عمود.')].concat(exStepPages(76, 23, '−')),
                    mk('sub', { a: [30, 99], b: [11, 80], carry: 'no', max: 99 }), false),
                lvl('s5', '🏦', 'Borrowing', 'الطرح بالاستلاف', [say('لو الرقم اللي فوق <b>أصغر</b>؟ نستلف عشرة من العمود الجنب!')].concat(exStepPages(52, 27, '−'), exStepPages(83, 48, '−')),
                    mk('sub', { a: [30, 99], b: [11, 90], carry: 'yes', max: 99 }), false),
                lvl('s6', '🏰', 'Hundreds Subtract', 'طرح المئات', [say('نفس الفكرة بثلاث أعمدة.')].concat(exStepPages(785, 342, '−')),
                    mk('sub', { a: [200, 900], b: [101, 600], carry: 'no', max: 900 }), false),
                lvl('s7', '🚀', 'Big Borrowing', 'طرح كبير بالاستلاف', [say('ممكن نستلف أكتر من مرة!')].concat(exStepPages(532, 278, '−')),
                    mk('sub', { a: [200, 900], b: [101, 700], carry: 'yes', max: 900 }), false)
            ]
        },
        {
            id: 'mul', ico: '✖️', ar: 'الضرب وجداول الضرب', en: 'Multiplication', color: '#9b59f5', levels: [
                lvl('mx', '🧩', 'What is ×?', 'يعني إيه ضرب؟', [
                    say('الضرب هو <b>جمع متكرر</b> بسرعة!') + '<div class="stp" dir="ltr">3 + 3 + 3 + 3 = 12 &nbsp;→&nbsp; <b>4 × 3 = 12</b></div>',
                    say('4 صفوف، في كل صف 3 نقط:') + '<div class="ex">' + arr(4, 3) + '</div>' + say('4 × 3 = 12')
                ], mk('mul', { tbl: 2 }), true)
            ].concat([1, 2, 10, 5, 3, 4, 6, 7, 8, 9, 11, 12].map(tableLevel), [
                lvl('mm', '🎯', 'Mixed tables', 'كل الجداول مع بعض', [say('دلوقتي كل الجداول من 2 لـ 12 مخلوطة. جاهز؟ 💪')], mk('mul', { mix: true }), true),
                lvl('mt', '🔟', '× 10 and × 100', 'الضرب في 10 و 100', [say('الضرب في 10 = نضيف <b>صفر</b>. والضرب في 100 = نضيف <b>صفرين</b>.') + '<div class="stp" dir="ltr">34 × 10 = 340 &nbsp; | &nbsp; 7 × 100 = 700</div>'], mk('mul', {}), false),
                lvl('mb', '🏆', '2-digit × 1-digit', 'ضرب عددين في رقم', [say('نفصّل العدد الكبير لعشرات وآحاد:') + '<div class="stp" dir="ltr">23 × 4 = (20 × 4) + (3 × 4) = 80 + 12 = <b>92</b></div>', say('جرب: 45 × 6') + '<div class="stp" dir="ltr">(40 × 6) + (5 × 6) = 240 + 30 = <b>270</b></div>'], mk('mul', { big: true }), false)
            ])
        }
    ];
    (function () {
        var by = {}; TRACKS.forEach(function (t) { t.levels.forEach(function (l) { by[l.id] = l; }); });
        function L(ids) { return ids.map(function (i) { return by[i]; }); }
        var mulT = TRACKS[3]; var tb = {}; mulT.levels.forEach(function (l) { tb[l.id] = l; });
        var mulOrder = ['mx', 'm1', 'm2', 'm5', 'm10', 'm3', 'm4', 'm6', 'm7', 'm8', 'm9', 'm11', 'm12', 'mm', 'mt', 'mb'];
        TRACKS = [
            { id: 'pv', ico: '🧱', ar: 'الأعداد وخط الأعداد', en: 'Numbers & Place Value', color: '#ff9f43', levels: L(['pv1', 'nl']) },
            { id: 'a20', ico: '🌱', ar: 'جمع وطرح لحد 20', en: 'Add & Subtract to 20', color: '#2ecc71', levels: L(['a1', 's1', 'a2', 's2']) },
            { id: 'a100', ico: '🏗️', ar: 'جمع وطرح لحد 100', en: 'Add & Subtract to 100', color: '#4f8ef7', levels: L(['a3', 's3', 'a4', 's4', 'a5', 's5']) },
            { id: 'a900', ico: '🏰', ar: 'المئات: لحد 900', en: 'Hundreds to 900', color: '#e04a82', levels: L(['pv2', 'a6', 's6', 'a7', 's7']) },
            { id: 'mul', ico: '✖️', ar: 'الضرب وجداول الضرب', en: 'Multiplication & Tables', color: '#9b59f5', levels: mulOrder.map(function (i) { return tb[i]; }) }
        ];
    })();
    var ALL = []; TRACKS.forEach(function (t) { t.levels.forEach(function (l, i) { l.track = t; l.idx = i; ALL.push(l); }); });

    /* ---------- progress ---------- */
    function prog() { if (!state.math) state.math = {}; return state.math; }
    function starsOf(l) { return prog()[l.id] || 0; }
    function unlocked(l) { return true; }

    /* ---------- Mike, the math teacher ---------- */
    var MIKE_T = { ok_1: 'برافو عليك يا مالك يا بطل! عين واحدة وشايفاك شاطر!', ok_2: 'الله! إجابة جامدة!', ok_3: 'كده يا مالك يا بطل! كمل!', ok_4: 'صح! أنا فرحان بيك أوي!', streak_1: 'ولا غلطة! انت نجم يا مالك!', streak_2: 'ده انت مولع! كمل كده!', retry_1: 'ولا يهمك يا مالك يا بطل! جرب تاني، انت تقدر!', retry_2: 'قربت! فكر تاني شوية.', retry_3: 'الغلط بيعلمنا! يلا تاني!', done_1: 'خلصنا الدرس! انت أحسن واحد في الدنيا يا مالك!', done_2: 'برافو يا مالك يا بطل! شلبي وأنا فخورين بيك أوي!', done_3: 'تعالى نلعب درس تاني؟ أنا جاهز!' };
    var PERSONAL = { ok_1: 1, ok_3: 1, streak_1: 1, retry_1: 1, done_1: 1, done_2: 1 };
    var mAud = null;
    function isMalek() { try { return kidName() === 'Malek'; } catch (e) { return false; } }
    function mikePlay(file, onend) {
        try { if (mAud) mAud.pause(); } catch (e) {}
        if (state && state.muted) return;
        try { mAud = new Audio('audio/mike/' + (/^mk_/.test(file) ? '' : 'mike_') + file + '.m4a'); if (onend) { var au = mAud; au.onended = function () { if (au === mAud) onend(); }; } var p = mAud.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
    }
    function mikeId(kind) {
        var pool = { ok: ['ok_2', 'ok_4'], streak: ['streak_2'], retry: ['retry_2', 'retry_3'], done: ['done_3'] };
        if (isMalek()) { pool.ok.push('ok_1', 'ok_3'); pool.streak.push('streak_1'); pool.retry.push('retry_1'); pool.done = ['done_1', 'done_2']; }
        return pk(pool[kind]);
    }
    function mikeLine(kind) { var id = mikeId(kind); return { id: id, t: MIKE_T[id] }; }
    function mikeBox(text, pose) { return '<div class="mkr"><img src="mike/green_' + (pose || 'stand') + '.png" alt=""><div class="mkb">' + text + '</div></div>'; }
    function mikeSet(text, pose, clip) { var n = root && root.querySelector('#mkx'); if (n) n.innerHTML = mikeBox(text, pose); if (clip) mikePlay(clip); }
    var MK_AVAIL = (typeof MIKE_MATH_AVAIL !== 'undefined') ? MIKE_MATH_AVAIL : {};

    /* ---------- UI ---------- */
    function injectCss() {
        if (css) return; css = true;
        var s = document.createElement('style'); s.textContent = [
            '#ma{position:fixed;inset:0;z-index:9999;background:linear-gradient(180deg,#fff7e6,#eaf4ff);font-family:"Baloo 2","Baloo Bhaijaan 2",ui-rounded,system-ui,sans-serif;overflow-y:auto;-webkit-overflow-scrolling:touch;color:#2d2a4a;direction:rtl}',
            '#ma *{box-sizing:border-box}.mw{max-width:480px;margin:0 auto;padding:max(12px,env(safe-area-inset-top)) 14px 40px}',
            '.mh{display:flex;align-items:center;gap:10px;margin-bottom:12px}.mh h1{flex:1;font-size:22px;margin:0;text-align:center}.mx{border:none;background:#fff;border-radius:50%;width:44px;height:44px;font-size:20px;box-shadow:0 3px 0 rgba(0,0,0,.12);cursor:pointer}',
            '.mst{background:#ffd93d;color:#4a2c00;border-radius:999px;padding:6px 12px;font-weight:900}',
            '.tk{background:#fff;border-radius:26px;padding:12px;margin-bottom:14px;box-shadow:0 6px 0 rgba(60,40,120,.1);border:3px solid #eee}.tk h2{margin:0 0 8px;font-size:19px}',
            '.lv{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.lb{border:none;border-radius:18px;padding:8px 2px;background:#f3f0ff;font:inherit;font-weight:800;color:#2d2a4a;box-shadow:0 4px 0 rgba(60,40,120,.14);cursor:pointer;min-height:84px}',
            '.lb .i{font-size:26px;display:block}.lb .n{font-size:12px;display:block;line-height:1.15;margin-top:2px}.lb .s{font-size:12px;letter-spacing:1px;display:block;margin-top:2px}.lb.lk{opacity:.45;filter:grayscale(.8)}',
            '.mkr{display:flex;align-items:center;gap:8px;margin:4px 0 10px}.mkr>img{width:84px;height:84px;flex:none;filter:drop-shadow(0 4px 0 rgba(0,0,0,.12))}.mkb{position:relative;background:#fff;border:3px solid #cdeccf;border-radius:20px;padding:10px 12px;font-size:16px;font-weight:800;line-height:1.55;text-align:right;flex:1}.mkb:before{content:"";position:absolute;right:-11px;top:50%;margin-top:-8px;border:8px solid transparent;border-left-color:#cdeccf;border-right:0}',
            '.mw>*{animation:mup .38s both}.mw>*:nth-child(2){animation-delay:.04s}.mw>*:nth-child(3){animation-delay:.08s}.mw>*:nth-child(4){animation-delay:.12s}.mw>*:nth-child(5){animation-delay:.16s}.mw>*:nth-child(n+6){animation-delay:.2s}@keyframes mup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}',
            '.mkr>img{animation:mfl 3.2s ease-in-out infinite}@keyframes mfl{50%{transform:translateY(-5px) rotate(-2deg)}}.mkr.big>img{width:112px;height:112px}',
            '.btn:active,.opt:active,.lb:active,.kp button:active{transform:translateY(3px);box-shadow:none!important}.opt.ok{animation:mpop .45s}@keyframes mpop{40%{transform:scale(1.12)}}',
            '.hero{background:linear-gradient(135deg,#fff,#f3ffe9);border:3px solid #cdeccf;border-radius:28px;padding:10px 12px;margin-bottom:14px;box-shadow:0 6px 0 rgba(60,140,60,.12)}.hero .mkr{margin:0}.hero .mkb{border:none;background:transparent;padding:4px;font-size:17px}.hero .mkb:before{display:none}',
            '.ov{height:14px;background:#e6dfff;border-radius:8px;overflow:hidden;margin:8px 4px 6px}.ov i{display:block;height:100%;background:linear-gradient(90deg,#2ecc71,#ffd93d);border-radius:8px;transition:width .6s}.ovt{font-size:13px;font-weight:800;color:#6b6480;text-align:center}',
            '.lb{position:relative;transition:transform .12s}.lb.dn{background:linear-gradient(160deg,#fff4c2,#ffe27a)}.lb.nx{background:#fff;outline:3px solid #2ecc71;animation:mpul 1.6s infinite}@keyframes mpul{50%{box-shadow:0 0 0 7px rgba(46,204,113,.25),0 4px 0 rgba(60,40,120,.14)}}',
            '.cf{position:fixed;top:-20px;z-index:10001;font-size:24px;pointer-events:none;animation:mfall 2.2s linear forwards}@keyframes mfall{to{transform:translateY(110vh) rotate(540deg);opacity:.9}}',
            
            '.say,.mkb,.stp{unicode-bidi:plaintext}.gm{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}.gc{border:none;border-radius:22px;padding:12px 6px;font:inherit;font-weight:900;color:#fff;box-shadow:0 5px 0 rgba(0,0,0,.18);cursor:pointer;font-size:15px;line-height:1.3}.gc .i{display:block;font-size:30px}.gc small{display:block;font-weight:700;opacity:.9;font-size:11px}.gc:active{transform:translateY(3px);box-shadow:none}.tm{font-weight:900;background:#fff;border-radius:999px;padding:4px 12px}.bld{display:flex;gap:8px;justify-content:center;margin:10px 0}.bld button{border:none;border-radius:16px;padding:10px 12px;font:inherit;font-weight:900;color:#fff;font-size:18px;box-shadow:0 4px 0 rgba(0,0,0,.2)}.nlk{display:flex;gap:2px;direction:ltr;justify-content:center;flex-wrap:wrap}.nlk button{width:26px;height:44px;border:none;border-radius:8px;background:#f3f0ff;font:inherit;font-weight:800;font-size:12px;box-shadow:0 3px 0 rgba(60,40,120,.18);padding:0}.nlk button.me{background:#ffd93d}.nlk button.ok{background:#2ecc71;color:#fff}.nlk button.no{background:#ff6b6b;color:#fff}.em{height:1.15em;width:1.15em;vertical-align:-.2em;display:inline-block}.lb .i .em{height:30px;width:30px}.stars .em{height:50px;width:50px}.mx .em{height:22px;width:22px}.mo{position:fixed;inset:0;background:rgba(40,30,80,.55);z-index:10000;display:flex;align-items:center;justify-content:center;padding:14px;direction:rtl;overflow:auto}.mp{background:#fff;border-radius:26px;padding:16px;width:100%;max-width:380px;text-align:center}.sr{display:flex;justify-content:space-between;align-items:center;font-weight:800;margin:10px 0 2px}.sr input[type=text],.sr input:not([type]){border:3px solid #d9d2f0;border-radius:12px;padding:6px 10px;font:inherit;width:140px}.sr input[type=checkbox]{width:26px;height:26px}.mp small{display:block;color:#888;font-size:12px;text-align:right}.credit{text-align:center;font-size:12px;color:#8a8fa8;opacity:.8;padding:14px 0 6px}',
            '.card{background:#fff;border-radius:28px;padding:16px;box-shadow:0 8px 0 rgba(60,40,120,.12);border:3px solid #e6dfff;text-align:center}',
            '.btn{display:block;width:100%;border:none;border-radius:22px;padding:14px;margin-top:12px;font:inherit;font-size:20px;font-weight:900;color:#fff;background:#2ecc71;box-shadow:0 6px 0 #1f9d55;cursor:pointer}.btn.o{background:#fff;color:#2d2a4a;box-shadow:0 5px 0 rgba(0,0,0,.14)}',
            '.say{font-size:17px;font-weight:700;margin:10px 0;line-height:1.6}.stp{background:#f5f3ff;border-radius:16px;padding:10px 12px;font-size:16px;font-weight:700;margin:10px 0;line-height:1.8;text-align:right}.ex{margin:10px 0;font-size:20px}.big2{font-size:24px;font-weight:900}',
            '.big{font-size:34px;font-weight:900;color:#5b3df5}.q{font-size:19px;font-weight:800;margin:6px 0}',
            '.mb{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:8px 0}.mbg{background:#f8f6ff;border-radius:14px;padding:6px 8px}.mbl{font-size:13px;font-weight:900}.mbr{display:flex;flex-wrap:wrap;gap:3px;justify-content:center;max-width:210px;margin-top:3px}',
            'i.bo{display:inline-block;width:14px;height:14px;background:#2ecc71;border-radius:4px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.18);margin:1px}i.bt{display:inline-block;width:14px;height:44px;background:#4f8ef7;border-radius:4px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.18);margin:1px;background-image:repeating-linear-gradient(#4f8ef7 0 3px,#3a6fd8 3px 4px)}i.bh{display:inline-block;width:46px;height:46px;background:#ff9f43;border-radius:6px;box-shadow:inset 0 -4px 0 rgba(0,0,0,.18);margin:1px;background-image:linear-gradient(90deg,transparent 4px,rgba(0,0,0,.12) 4px 5px),linear-gradient(transparent 4px,rgba(0,0,0,.12) 4px 5px);background-size:5px 5px}',
            '.pt{display:flex;gap:8px;justify-content:center;margin:8px 0}.ptc{width:84px;border-radius:14px;overflow:hidden;background:#fff;border:2px solid #e6dfff}.pth{color:#fff;font-weight:900;padding:3px;font-size:15px}.ptd{font-size:40px;font-weight:900}',
            '.col{display:inline-block;direction:ltr;font-size:34px;font-weight:900;font-family:ui-monospace,Menlo,monospace}.cr{display:flex;justify-content:flex-end}.cr span{width:36px;text-align:center}.cr .op{width:30px;color:#9b59f5}.cc span{font-size:16px;height:20px;color:#e04a82}.cl{border-top:4px solid #2d2a4a;margin:2px 0}.ans span{min-height:46px}',
            '.ar{display:grid;gap:4px;justify-content:center;margin:8px auto}.ar i{width:16px;height:16px;border-radius:50%;background:#9b59f5}.tb{display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:17px;font-weight:800}.tb div{background:#f5f3ff;border-radius:12px;padding:6px 10px;display:flex;justify-content:space-between}.tb b{color:#9b59f5}',
            '.sk{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:4px;font-size:20px;font-weight:900}.sk span{background:#ffd93d;color:#4a2c00;border-radius:12px;padding:2px 8px}.sk em{color:#aaa;font-style:normal}',
            '.opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.opt{border:none;border-radius:20px;padding:14px;font:inherit;font-size:30px;font-weight:900;background:#f3f0ff;color:#2d2a4a;box-shadow:0 5px 0 rgba(60,40,120,.18);cursor:pointer}.opt.ok{background:#2ecc71;color:#fff}.opt.no{background:#ff6b6b;color:#fff;animation:mshk .3s}',
            '@keyframes mshk{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}',
            '.dsp{font-size:40px;font-weight:900;background:#f3f0ff;border-radius:18px;padding:6px;min-height:62px;direction:ltr;margin-top:10px}.dsp.no{animation:mshk .3s;background:#ffd6d6}.dsp.ok{background:#c8f7d8}',
            '.kp{direction:ltr;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.kp button{border:none;border-radius:16px;padding:12px;font:inherit;font-size:26px;font-weight:900;background:#f3f0ff;box-shadow:0 4px 0 rgba(60,40,120,.18);color:#2d2a4a;cursor:pointer}.kp .go{background:#2ecc71;color:#fff}',
            '.pg{height:10px;border-radius:6px;background:#e6dfff;overflow:hidden;margin-bottom:10px}.pg i{display:block;height:100%;background:#2ecc71;transition:width .3s}',
            '.hint{background:#fff7e6;border-radius:16px;padding:8px;margin-top:10px;text-align:center}.tag{display:inline-block;border-radius:999px;padding:2px 10px;font-size:13px;font-weight:900;color:#fff}.stars{font-size:54px;margin:6px 0}'
        ].join(''); document.head.appendChild(s);
    }
    var scr = 0;
    function el(h) { scr++; root.innerHTML = '<div class="mw">' + h + '</div>'; root.scrollTop = 0; emojify(root); }
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
    function say2() { try { if (!(state && state.muted)) VO.say.apply(VO, arguments); } catch (e) {} }
    function starStr(n) { return '⭐'.repeat(n) + '☆'.repeat(3 - n); }
    function close() { try { VO.stop(); if (mAud) mAud.pause(); } catch (e) {} if (root) { root.remove(); root = null; } }

    function settings() {
        var x = r(3, 8), y = r(4, 8), m = document.createElement('div'); m.className = 'mo';
        m.innerHTML = '<div class="mp"><div class="say">للكبار بس 👨‍👩‍👧 ما هو ' + x + ' + ' + y + ' ؟</div><div class="dsp" id="ga" style="font-size:30px;min-height:50px">&nbsp;</div><div class="kp">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (d) { return '<button data-d="' + d + '">' + d + '</button>'; }).join('') + '<button data-d="b">⌫</button><button data-d="0">0</button><button class="go" data-d="go">✓</button></div><button class="btn o" id="gx">إلغاء</button></div>';
        root.appendChild(m); emojify(m); var v = '';
        m.querySelector('#gx').onclick = function () { m.remove(); };
        m.querySelectorAll('.kp button').forEach(function (b) { b.onclick = function () { var d = b.getAttribute('data-d'); if (d === 'b') v = v.slice(0, -1); else if (d === 'go') { if (Number(v) === x + y) { m.remove(); panel(); } else { v = ''; } } else if (v.length < 2) v += d; m.querySelector('#ga').textContent = v || '\u00a0'; }; });
    }
    function panel() {
        var m = document.createElement('div'); m.className = 'mo'; var tot = ALL.reduce(function (s, l) { return s + starsOf(l); }, 0);
        m.innerHTML = '<div class="mp"><h2 style="margin:0 0 8px">⚙️ الإعدادات</h2><label class="sr">اسم الطفل<input id="nm" value="' + (state.name || 'Malek').replace(/"/g, '') + '"></label><small>أصوات مالك المخصوصة للاسم Malek بس. أي اسم تاني بيظهر على الشاشة.</small>'
            + '<label class="sr">أصوات مارد (Mike)<input type="checkbox" id="so" ' + (state.muted ? '' : 'checked') + '></label>'
            + '<label class="sr">تقدم تلقائي (Auto-advance)<input type="checkbox" id="au" ' + (state.auto !== false ? 'checked' : '') + '></label><small>ينتقل للسؤال التالي لوحده بعد الإجابة الصح. زرار التالي شغال دايماً.</small>'
            + '<label class="sr">النجوم<b>⭐ ' + tot + '</b></label><div class="credit" dir="ltr">© Hazem Saleh</div><button class="btn" id="ok">تم</button><button class="btn o" id="rs">مسح التقدم</button></div>';
        root.appendChild(m); emojify(m);
        m.querySelector('#ok').onclick = function () { state.name = m.querySelector('#nm').value.trim() || 'Malek'; state.muted = !m.querySelector('#so').checked; state.auto = m.querySelector('#au').checked; save(); m.remove(); map(); };
        m.querySelector('#rs').onclick = function () { if (confirm('مسح كل النجوم؟')) { state.math = {}; state.stars = 0; save(); m.remove(); map(); } };
    }
    function map() {
        var total = 0, h = '<div class="mh"><button class="mx" id="mc">⚙️</button><h1>🧮 أكاديمية الماث</h1><div class="mst">⭐ ' + ALL.reduce(function (s, l) { return s + starsOf(l); }, 0) + '</div></div>';
        TRACKS.forEach(function (t) {
            h += '<div class="tk" style="border-color:' + t.color + '55"><h2 style="color:' + t.color + '">' + t.ico + ' ' + t.ar + ' <small style="color:#999;font-size:12px">' + t.en + '</small></h2><div class="lv">';
            t.levels.forEach(function (l) {
                var ok = unlocked(l), st = starsOf(l);
                h += '<button class="lb' + (ok ? '' : ' lk') + (st >= 3 ? ' dn' : '') + '" data-l="' + l.id + '"><span class="i">' + (ok ? l.ico : '🔒') + '</span><span class="n">' + l.ar + '</span><span class="s">' + (st ? starStr(st) : '') + '</span></button>';
            });
            h += '</div></div>';
        });
        var done = ALL.filter(function (l) { return starsOf(l) >= 1; }).length, nxt = ALL.filter(function (l) { return starsOf(l) < 3 && unlocked(l) && !starsOf(l); })[0] || ALL.filter(function (l) { return starsOf(l) < 3 && unlocked(l); })[0];
        var nm = kidName(), hero = '<div class="hero"><div class="mkr big"><img src="mike/green_cheer.png" alt=""><div class="mkb">' + (done ? 'أهلاً يا ' + nm + '! كمّل معايا من حيث وقفنا 💪' : 'أهلاً يا ' + nm + '! أنا مارد وشوشني، مدرس الماث بتاعك. هنتعلم كل حاجة خطوة بخطوة، وانت هتبقى بطل! 🌟') + '</div></div><div class="ov"><i style="width:' + Math.round(done / ALL.length * 100) + '%"></i></div><div class="ovt">' + done + ' / ' + ALL.length + ' درس خلصناه</div>' + (nxt ? '<button class="btn" id="go" style="margin-top:8px">' + (done ? 'كمّل: ' : 'ابدأ: ') + nxt.ar + ' ▶</button>' : '') + '</div>';
        var ix = h.indexOf('<div class="tk"'); var gh = '<div class="tk" style="border-color:#ff6b9d55"><h2 style="color:#e04a82">🎮 ألعاب مع مارد</h2><div class="gm">' + GAMES.map(function (g) { return '<button class="gc" data-g="' + g.id + '" style="background:' + g.col + '"><span class="i">' + g.ico + '</span>' + g.ar + '<small>' + g.sub + '</small><span style="letter-spacing:1px">' + (gstars(g.id) ? starStr(gstars(g.id)) : '') + '</span></button>'; }).join('') + '</div></div>';
        el(h.slice(0, ix) + hero + gh + h.slice(ix) + '<div class="credit" dir="ltr">© Hazem Saleh</div>');
        if (nxt) { var nb = root.querySelector('[data-l="' + nxt.id + '"]'); if (nb) nb.classList.add('nx'); }
        root.querySelectorAll('[data-g]').forEach(function (b) { b.onclick = function () { startGame(GAMES.filter(function (g) { return g.id === b.getAttribute('data-g'); })[0]); }; });
        var gb = root.querySelector('#go'); if (gb) gb.onclick = function () { learn(nxt, 0); };
        root.querySelector('#mc').onclick = settings;
        root.querySelectorAll('.lb').forEach(function (b) { b.onclick = function () { var l = ALL.filter(function (x) { return x.id === b.getAttribute('data-l'); })[0]; if (unlocked(l)) learn(l, 0); else { b.style.animation = 'mshk .3s'; setTimeout(function () { b.style.animation = ''; }, 350); } }; });
    }
    function learn(l, p) {
        var pages = l.learn.concat('__check__'), isCheck = p >= pages.length - 1, pg = pages[p], first = '', rest = '', q = null;
        if (p === 0) l._ck = null;
        if (isCheck) {
            if (!l._ck) l._ck = l.gen();
            q = l._ck; first = 'نتأكد إنك فاهم قبل ما نكمل! اختار الإجابة الصح 👇'; rest = '<div class="q">' + q.html + '</div>' + (q.vis || '') + '<div id="ex"></div><div class="opts">' + distract(q).map(function (o) { return '<button class="opt" data-v="' + o + '">' + o + '</button>'; }).join('') + '</div>';
        } else {
            var mm = pg.match(/<div class="say">([\s\S]*?)<\/div>/); rest = pg;
            if (mm) { first = mm[1]; rest = pg.replace(mm[0], ''); } else first = pk(['يلا نشوف مع بعض!', 'بص كده معايا!']);
        }
        var cid = 'mk_' + l.id + '_' + p; if (MK_AVAIL[cid]) { var g0 = scr + 1; mikePlay(cid, function () { if (state.auto !== false && !isCheck && g0 === scr && root) setTimeout(function () { if (g0 === scr && root) learn(l, p + 1); }, 1200); }); } else try { if (mAud) mAud.pause(); } catch (e) {}
        el('<div class="mh"><button class="mx" id="mc">←</button><h1>' + l.ico + ' ' + l.ar + '</h1><div class="mst">' + (p + 1) + '/' + pages.length + '</div></div><div class="pg"><i style="width:' + Math.round((p + 1) / pages.length * 100) + '%"></i></div><div id="mkx">' + mikeBox(first, 'stand') + '</div>'
            + (rest.replace(/<[^>]*>/g, '').trim() || /<(svg|i |div class="(ex|mb|pt|col|ar|tb|sk))/.test(rest) ? '<div class="card">' + rest + '</div>' : '')
            + '<button class="btn" id="nx"' + (isCheck ? ' style="display:none"' : '') + '>' + (isCheck ? 'يلا نتدرب! 🚀' : 'التالي ▶') + '</button>' + (p ? '<button class="btn o" id="pv">◀ السابق</button>' : ''));
        root.querySelector('#mc').onclick = map;
        root.querySelector('#nx').onclick = function () { isCheck ? session(l, 'practice') : learn(l, p + 1); };
        var pv = root.querySelector('#pv'); if (pv) pv.onclick = function () { learn(l, p - 1); };
        if (isCheck) {
            var wrong = 0;
            root.querySelectorAll('.opt').forEach(function (b) {
                b.onclick = function () {
                    if (Number(b.getAttribute('data-v')) === q.ans) {
                        b.classList.add('ok'); var ml = mikeLine('ok'); mikeSet('صح! كده انت فاهم الفكرة 👏', 'cheer', ml.id); try { SFX.play('chime'); } catch (e) {}
                        root.querySelectorAll('.opt').forEach(function (o) { o.onclick = null; }); root.querySelector('#nx').style.display = 'block';
                    } else { wrong++; b.classList.add('no'); b.onclick = null; var rl = mikeLine('retry'); mikeSet(rl.t, 'stand', rl.id); if (wrong >= 2) root.querySelector('#ex').innerHTML = '<div class="hint">' + q.exp + '</div>'; }
                };
            });
        }
    }
    function distract(q) {
        var a = q.ans, set = {}, out = [a]; set[a] = 1;
        var c = shuf([a + 1, a - 1, a + 2, a - 2, a + 10, a - 10, a + 5, a - 5, a + 100, a - 100, Number(String(a).split('').reverse().join(''))]);
        for (var i = 0; i < c.length && out.length < 4; i++) { if (c[i] >= 0 && !set[c[i]]) { set[c[i]] = 1; out.push(c[i]); } }
        var k = 3; while (out.length < 4) { if (!set[a + k]) { set[a + k] = 1; out.push(a + k); } k++; }
        return shuf(out);
    }
    function session(l, mode, st) {
        var N = mode === 'practice' ? 6 : 8;
        st = st || { i: 0, right: 0, mode: mode, seen: {} };
        if (st.i >= N) { if (mode === 'practice') { quizIntro(l); return; } return finish(l, st); }
        var q; for (var t = 0; t < 30; t++) { q = l.gen(); var key = q.html; if (!st.seen[key]) break; } st.seen[q.html] = 1;
        var tries = 0, done = false, val = '';
        var tag = mode === 'practice' ? '<span class="tag" style="background:#4f8ef7">تدريب</span>' : '<span class="tag" style="background:#ff6b6b">اختبار ⭐</span>';
        var h = '<div class="mh"><button class="mx" id="mc">←</button><h1>' + tag + '</h1><div class="mst">' + (st.i + 1) + '/' + N + '</div></div><div class="pg"><i style="width:' + Math.round(st.i / N * 100) + '%"></i></div>'
            + '<div id="mkx">' + mikeBox(mode === 'practice' ? 'خد وقتك، وممكن تضغط على التلميح 💡' : 'ركز وفكر، انت تقدر!', 'stand') + '</div><div class="card"><div class="q">' + q.html + '</div>' + (q.vis || '') + '<div id="ex"></div>';
        if (l.mc) { h += '<div class="opts">' + distract(q).map(function (o) { return '<button class="opt" data-v="' + o + '">' + o + '</button>'; }).join('') + '</div>'; }
        else { h += '<div class="dsp" id="dsp">&nbsp;</div><div class="kp">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (d) { return '<button data-d="' + d + '">' + d + '</button>'; }).join('') + '<button data-d="b">⌫</button><button data-d="0">0</button><button class="go" data-d="go">✓</button></div>'; }
        h += '</div>' + (mode === 'practice' ? '<button class="btn o" id="hn">💡 تلميح</button>' : '');
        el(h);
        function exp() { root.querySelector('#ex').innerHTML = '<div class="hint">' + q.exp + '</div>'; }
        function nextBtn() { var b = document.createElement('button'); b.className = 'btn'; b.textContent = 'التالي ▶'; b.onclick = function () { st.i++; session(l, mode, st); }; root.querySelector('.card').appendChild(b); }
        function good(node) {
            done = true; if (tries === 0) st.right++; if (node) node.classList.add('ok');
            try { SFX.play('chime'); } catch (e) {}
            st.streak = tries === 0 ? (st.streak || 0) + 1 : 0; var ml = mikeLine(st.streak === 3 ? 'streak' : 'ok'); mikeSet(ml.t, 'cheer', ml.id);
            if (state.auto === false) { nextBtn(); } else { var g = scr; setTimeout(function () { if (g === scr && root) { st.i++; session(l, mode, st); } }, 1700); }
        }
        function bad(node) {
            tries++; if (node) { node.classList.add('no'); setTimeout(function () { node.classList.remove('no'); }, 400); }
            st.streak = 0; var rl = mikeLine('retry'); mikeSet(rl.t, 'stand', rl.id);
            if (tries >= 2) { done = true; exp(); root.querySelector('#ex').insertAdjacentHTML('afterbegin', '<div class="say" style="color:#e04a82">الإجابة الصح: <b>' + q.ans + '</b></div>'); nextBtn(); }
            else if (mode === 'practice') exp();
        }
        root.querySelector('#mc').onclick = function () { map(); };
        var hn = root.querySelector('#hn'); if (hn) hn.onclick = exp;
        if (l.mc) root.querySelectorAll('.opt').forEach(function (b) { b.onclick = function () { if (done) return; Number(b.getAttribute('data-v')) === q.ans ? good(b) : bad(b); }; });
        else {
            var dsp = root.querySelector('#dsp');
            root.querySelectorAll('.kp button').forEach(function (b) {
                b.onclick = function () {
                    if (done) return; var d = b.getAttribute('data-d');
                    if (d === 'b') val = val.slice(0, -1); else if (d === 'go') { if (!val) return; Number(val) === q.ans ? good(dsp) : (bad(dsp), val = ''); }
                    else if (val.length < 4) val += d;
                    if (d !== 'go') dsp.textContent = val || '\u00a0'; else if (val === '' ) dsp.innerHTML = '&nbsp;';
                };
            });
        }
    }
    function quizIntro(l) {
        el('<div class="card"><div class="stars">🎯</div><div class="say">كده خلصنا التدريب! دلوقتي <b>الاختبار</b> — من غير تلميحات. هاتجيب نجوم على قد إجاباتك.</div></div><button class="btn" id="go">ابدأ الاختبار ⭐</button>');
        root.querySelector('#go').onclick = function () { session(l, 'quiz'); };
    }
    function confetti() {
        var e = ['⭐', '🌟', '🎉', '✨', '🎈'];
        for (var i = 0; i < 26; i++) { var c = document.createElement('div'); c.className = 'cf'; c.textContent = e[i % e.length]; c.style.left = r(2, 94) + 'vw'; c.style.animationDelay = (r(0, 12) / 10) + 's'; c.style.animationDuration = (1.8 + r(0, 12) / 10) + 's'; root.appendChild(c); emojify(c); (function (n) { setTimeout(function () { n.remove(); }, 3600); })(c); }
    }
    function finish(l, st) {
        var pct = st.right / 8, stars = pct >= .9 ? 3 : pct >= .7 ? 2 : pct >= .5 ? 1 : 0, old = starsOf(l);
        if (stars > old) { state.stars = (state.stars || 0) + (stars - old); prog()[l.id] = stars; save(); }
        var nxt = l.track.levels[l.idx + 1];
        var dl = mikeLine('done'); mikePlay(dl.id); setTimeout(function () { if (stars >= 2) confetti(); }, 150);
        try { SFX.play('chime'); } catch (e) {}
        el(mikeBox(dl.t, 'cheer') + '<div class="card"><div class="stars">' + starStr(stars) + '</div><div class="q">' + st.right + ' / 8 صح</div><div class="say">' + (stars === 3 ? 'ممتاز يا بطل! 🏆' : stars >= 1 ? 'شاطر! تقدر تجيب أحسن 💪' : 'ولا يهمك، جرب تاني وهتعدّيها!') + '</div></div>'
            + (stars >= 1 && nxt ? '<button class="btn" id="nx">الدرس اللي بعده ▶</button>' : '') + '<button class="btn o" id="rt">🔁 جرب تاني</button><button class="btn o" id="mp">🗺️ الخريطة</button>');
        var n = root.querySelector('#nx'); if (n) n.onclick = function () { learn(nxt, 0); };
        root.querySelector('#rt').onclick = function () { session(l, 'practice'); };
        root.querySelector('#mp').onclick = map;
    }

    /* ---------- mini-games (Mike hosts) ---------- */
    var GAMES = [
        { id: 'g_build', ico: '🧱', ar: 'بنّاء الأرقام', sub: 'ابني العدد بالمكعبات', col: '#ff9f43' },
        { id: 'g_hop', ico: '🐸', ar: 'الضفدع القافز', sub: 'اقفز على خط الأعداد', col: '#2ecc71' },
        { id: 'g_ten', ico: '🔟', ar: 'كوّن العشرة', sub: 'كمّل لـ 10 بسرعة', col: '#4f8ef7' },
        { id: 'g_race', ico: '🏁', ar: 'سباق الجداول', sub: 'جاوب بسرعة في 45 ثانية', col: '#9b59f5' }
    ];
    function gstars(id) { return (state.games && state.games[id]) || 0; }
    function gsave(id, s) { state.games = state.games || {}; if (s > (state.games[id] || 0)) { state.games[id] = s; save(); } }
    function gshell(g, rounds, build, scoreFn) {
        var S = { i: 0, pts: 0 };
        function round() {
            if (S.i >= rounds) { var st = scoreFn(S); gsave(g.id, st); var dl = mikeLine('done'); mikePlay(dl.id); setTimeout(function () { if (st >= 2) confetti(); }, 150);
                el(mikeBox(dl.t, 'cheer') + '<div class="card"><div class="stars">' + starStr(st) + '</div><div class="q">' + g.ar + '</div><div class="say">' + S.pts + ' نقطة</div></div><button class="btn" id="ag">🔁 العب تاني</button><button class="btn o" id="mp">🗺️ الخريطة</button>');
                root.querySelector('#ag').onclick = function () { startGame(g); }; root.querySelector('#mp').onclick = map; return; }
            var done = false;
            var api = { good: function (pt) { if (done) return; done = true; S.pts += (pt == null ? 10 : pt); try { SFX.play('chime'); } catch (e) {} var ml = mikeLine('ok'); mikeSet(ml.t, 'cheer', ml.id); var gg = scr; setTimeout(function () { if (gg === scr && root) { S.i++; round(); } }, 1300); },
                bad: function () { var rl = mikeLine('retry'); mikeSet(rl.t, 'stand', rl.id); }, S: S, N: S.i };
            el('<div class="mh"><button class="mx" id="mc">←</button><h1>' + g.ico + ' ' + g.ar + '</h1><div class="mst">' + (S.i + 1) + '/' + rounds + '</div></div><div class="pg"><i style="width:' + Math.round(S.i / rounds * 100) + '%"></i></div><div id="mkx">' + mikeBox(g.sub, 'stand') + '</div><div class="card" id="gb"></div>');
            root.querySelector('#mc').onclick = map; build(root.querySelector('#gb'), api);
        }
        round();
    }
    function startGame(g) {
        if (g.id === 'g_build') gshell(g, 6, function (box, api) {
            var n = pk([r(11, 99), r(101, 900)]), h = 0, t = 0, o = 0;
            box.innerHTML = '<div class="q">ابني العدد <span class="big">' + n + '</span></div><div id="bv"></div><div class="bld" dir="ltr"><button style="background:' + COL[2] + '" data-p="2">+100</button><button style="background:' + COL[1] + '" data-p="1">+10</button><button style="background:' + COL[0] + '" data-p="0">+1</button></div><div class="bld"><button style="background:#888" id="bu">↩️ امسح</button><button style="background:#2ecc71" id="bk">✓ تمام</button></div>';
            function draw() { var v = h * 100 + t * 10 + o; box.querySelector('#bv').innerHTML = '<div class="big" style="font-size:26px">' + v + '</div>' + blocks(v); emojify(box); }
            draw();
            box.querySelectorAll('[data-p]').forEach(function (b) { b.onclick = function () { var p = Number(b.getAttribute('data-p')); if (p === 2) h = Math.min(9, h + 1); else if (p === 1) { t++; if (t > 9) { t = 0; h++; } } else { o++; if (o > 9) { o = 0; t++; if (t > 9) { t = 0; h++; } } } draw(); }; });
            box.querySelector('#bu').onclick = function () { h = t = o = 0; draw(); };
            box.querySelector('#bk').onclick = function () { if (h * 100 + t * 10 + o === n) api.good(); else { api.bad(); } };
        }, function (S) { return S.pts >= 55 ? 3 : S.pts >= 40 ? 2 : S.pts >= 20 ? 1 : 0; });
        else if (g.id === 'g_hop') gshell(g, 7, function (box, api) {
            var plus = r(0, 1), n = r(1, 6), s = plus ? r(0, 20 - n) : r(n, 20), e = plus ? s + n : s - n, h = '';
            for (var v = 0; v <= 20; v++) h += '<button data-v="' + v + '" class="' + (v === s ? 'me' : '') + '">' + v + '</button>';
            box.innerHTML = '<div class="q">🐸 الضفدع واقف على <span class="big">' + s + '</span>. اقفز <b>' + n + '</b> ' + (plus ? 'لليمين ➡️' : 'لليسار ⬅️') + '. اضغط مكان الوصول!</div><div class="nlk">' + h + '</div>';
            emojify(box);
            box.querySelectorAll('[data-v]').forEach(function (b) { b.onclick = function () { if (Number(b.getAttribute('data-v')) === e) { b.classList.add('ok'); api.good(); } else { b.classList.add('no'); api.bad(); } }; });
        }, function (S) { return S.pts >= 60 ? 3 : S.pts >= 40 ? 2 : S.pts >= 20 ? 1 : 0; });
        else if (g.id === 'g_ten') gshell(g, 8, function (box, api) {
            var a = r(1, 9), q = { ans: 10 - a };
            box.innerHTML = '<div class="q">كام نزود على <span class="big">' + a + '</span> عشان نوصل <span class="big">10</span>؟</div><div class="mb" style="margin:6px 0">' + (function () { var s = ''; for (var i = 0; i < 10; i++) s += '<i class="' + (i < a ? 'bo' : 'bo') + '" style="' + (i < a ? '' : 'background:#e6dfff;box-shadow:none') + '"></i>'; return s; })() + '</div><div class="opts">' + (function () { var s = {}, out = [q.ans]; s[q.ans] = 1; while (out.length < 4) { var x = r(0, 10); if (!s[x] && x !== a) { s[x] = 1; out.push(x); } } return shuf(out); })().map(function (o) { return '<button class="opt" data-v="' + o + '">' + o + '</button>'; }).join('') + '</div>';
            box.querySelectorAll('.opt').forEach(function (b) { b.onclick = function () { if (Number(b.getAttribute('data-v')) === q.ans) { b.classList.add('ok'); api.good(); } else { b.classList.add('no'); api.bad(); } }; });
        }, function (S) { return S.pts >= 70 ? 3 : S.pts >= 50 ? 2 : S.pts >= 30 ? 1 : 0; });
        else raceStart(g);
    }
    function raceStart(g) {
        el('<div class="mh"><button class="mx" id="mc">←</button><h1>' + g.ico + ' ' + g.ar + '</h1><div class="mst">45s</div></div>' + mikeBox('اختار الجدول اللي عايز تتسابق فيه!', 'stand') + '<div class="card"><div class="opts" id="tp"></div></div>');
        var h = ''; [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].concat(['كلهم']).forEach(function (t) { h += '<button class="opt" data-t="' + t + '" style="font-size:24px">' + (t === 'كلهم' ? 'كل الجداول' : '× ' + t) + '</button>'; });
        root.querySelector('#tp').innerHTML = h; root.querySelector('#mc').onclick = map;
        root.querySelectorAll('[data-t]').forEach(function (b) { b.onclick = function () { raceRun(g, b.getAttribute('data-t')); }; });
    }
    function raceRun(g, t) {
        var left = 45, pts = 0, ok = 0, tk = null, run = scr + 1;
        function q() {
            var a = t === 'كلهم' ? r(2, 12) : Number(t), b = r(2, 12), qq = { ans: a * b }, opts = distract(qq);
            el('<div class="mh"><button class="mx" id="mc">←</button><h1>' + g.ico + ' ' + g.ar + '</h1><div class="mst tm" id="tm">⏱ ' + left + '</div></div><div id="mkx">' + mikeBox('أسرع ما تقدر! ' + (ok ? ok + ' صح 🔥' : ''), 'stand') + '</div><div class="card"><div class="q"><span class="big" dir="ltr">' + a + ' × ' + b + ' = ?</span></div><div class="opts">' + opts.map(function (o) { return '<button class="opt" data-v="' + o + '">' + o + '</button>'; }).join('') + '</div></div>');
            run = scr; root.querySelector('#mc').onclick = function () { clearInterval(tk); map(); };
            root.querySelectorAll('.opt').forEach(function (bt) { bt.onclick = function () { if (Number(bt.getAttribute('data-v')) === qq.ans) { ok++; pts += 10; try { SFX.play('chime'); } catch (e) {} q(); } else { bt.classList.add('no'); left = Math.max(0, left - 2); var tm = root.querySelector('#tm'); if (tm) tm.textContent = '⏱ ' + left; } }; });
        }
        q();
        tk = setInterval(function () {
            if (!root || scr !== run) { clearInterval(tk); return; }
            left--; var tm = root.querySelector('#tm'); if (tm) tm.textContent = '⏱ ' + left;
            if (left <= 0) { clearInterval(tk); var st = ok >= 18 ? 3 : ok >= 12 ? 2 : ok >= 6 ? 1 : 0; gsave(g.id, st); var dl = mikeLine('done'); mikePlay(dl.id); setTimeout(function () { if (st >= 2) confetti(); }, 150);
                el(mikeBox(dl.t, 'cheer') + '<div class="card"><div class="stars">' + starStr(st) + '</div><div class="q">' + ok + ' إجابة صح في 45 ثانية!</div></div><button class="btn" id="ag">🔁 العب تاني</button><button class="btn o" id="mp">🗺️ الخريطة</button>');
                root.querySelector('#ag').onclick = function () { raceStart(g); }; root.querySelector('#mp').onclick = map; }
        }, 1000);
    }
    function open() {
        if (!state) return; injectCss(); close();
        try { VO.stop(); } catch (e) {}
        root = document.createElement('div'); root.id = 'ma'; document.body.appendChild(root); map();
        var hid = (isMalek() && MK_AVAIL.mk_hello_malek) ? 'mk_hello_malek' : (MK_AVAIL.mk_hello ? 'mk_hello' : null);
        if (hid && !window.__mkHello) { window.__mkHello = true; var played = false, go = function () { if (played) return; played = true; mikePlay(hid); document.removeEventListener('pointerdown', go, true); };
            try { var t = new Audio('audio/mike/' + hid + '.m4a'); var pr = t.play(); if (pr && pr.then) pr.then(function () { played = true; document.removeEventListener('pointerdown', go, true); if (state && state.muted) t.pause(); }).catch(function () {}); } catch (e) {}
            document.addEventListener('pointerdown', go, true); }
    }
    return { open: open, close: close, _all: ALL, _gen: function (id) { return ALL.filter(function (l) { return l.id === id; })[0].gen(); } };
})();
