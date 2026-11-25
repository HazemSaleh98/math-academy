/* Compositional number audio: assembles any number 0-1000 and the question stems from short clips. */
var NumAudio = (function () {
    var CTX = null, BUF = {}, GAP = 0.07, cur = null, token = 0;
    function numIds(n, afterHundred) {
        n = Math.round(n); if (n < 0) return [];
        if (n === 1000) return ['num_k1000'];
        var out = [];
        if (n >= 100) { var h = Math.floor(n / 100) * 100; out.push('num_h' + h); n -= h; if (!n) return out; afterHundred = true; }
        if (n < 20) { out.push(afterHundred ? 'num_w' + n : 'num_' + n); return out; }
        var t = Math.floor(n / 10) * 10, u = n % 10;
        if (u === 0) { out.push(afterHundred ? 'num_tw' + t : 'num_t' + t); return out; }
        out.push(afterHundred ? 'num_w' + u : 'num_' + u); out.push('num_tw' + t); return out;
    }
    function cnt(n, kind) { /* kind h,t,o: count + unit word with singular/dual forms */
        var a = kind === 'o' ? '' : '_and';
        if (n === 1) return ['u_' + kind + '1' + a];
        if (n === 2) return ['u_' + kind + '2' + a];
        return numIds(n).concat(['u_' + kind + (kind === 'o' ? '' : '_and')]);
    }
    function digits(s) { return s.replace(/[\u0660-\u0669]/g, function (d) { return d.charCodeAt(0) - 0x660; }); }
    /* question html -> clip id list (null when unknown) */
    function qIds(html) {
        var t = digits(html.replace(/<[^>]*>/g, ' ').replace(/[\u2B05\u27A1\uFE0F]/g, ' ').replace(/\s+/g, ' ').trim()), m, N = function (x) { return numIds(+x); };
        if ((m = t.match(/^(\d+) \+ (\d+) \+ (\d+) = /))) return [].concat(N(m[1]), 'op_plus', N(m[2]), 'op_plus', N(m[3]), 'op_equals', 'op_q');
        if ((m = t.match(/^(\d+) ([+\u2212\-\u00D7]) (\d+) = /))) return [].concat(N(m[1]), m[2] === '+' ? 'op_plus' : m[2] === '\u00D7' ? 'op_times' : 'op_minus', N(m[3]), 'op_equals', 'op_q');
        if ((m = t.match(/^(\d+) \u0645\u0626\u0627\u062A \+ (\d+) \u0639\u0634\u0631\u0627\u062A \+ (\d+) \u0622\u062D\u0627\u062F/))) return [].concat(cnt(+m[1], 'h'), cnt(+m[2], 't'), cnt(+m[3], 'o'), 'op_equals', 'op_q');
        if ((m = t.match(/^(\d+) \u0639\u0634\u0631\u0627\u062A \u0648 (\d+) \u0622\u062D\u0627\u062F/))) return [].concat(cnt(+m[1], 't'), cnt(+m[2], 'o'), 'op_equals', 'op_q');
        if ((m = t.match(/^\u0625\u064A\u0647 \u0631\u0642\u0645 \u0627\u0644\u0622\u062D\u0627\u062F \u0641\u064A (\d+)/))) return ['q_ones'].concat(N(m[1]));
        if ((m = t.match(/^\u0642\u064A\u0645\u0629 \u0627\u0644\u0631\u0642\u0645 (\d+) \u0641\u064A \u0627\u0644\u0639\u062F\u062F (\d+)/))) return ['q_value'].concat(N(m[1]), 'q_inthe', N(m[2]), 'q_isq');
        if ((m = t.match(/^\u0643\u0627\u0645 \u0639\u0634\u0631\u0629 \u0641\u064A \u0627\u0644\u0639\u062F\u062F (\d+)/))) return ['q_howmany_t'].concat(N(m[1]));
        if ((m = t.match(/^\u0643\u0627\u0645 \u0645\u064A\u0629 \u0641\u064A \u0627\u0644\u0639\u062F\u062F (\d+)/))) return ['q_howmany_h'].concat(N(m[1]));
        if ((m = t.match(/\u0627\u0628\u062F\u0623 \u0645\u0646 (\d+) \u0648\u0627\u0642\u0641\u0632 (\d+) \u062E\u0637\u0648\u0627\u062A \u0644\u0644(\u064A\u0645\u064A\u0646|\u064A\u0633\u0627\u0631)/))) return ['q_nl_start'].concat(N(m[1]), 'q_jump', N(m[2]), 'q_steps', m[3] === '\u064A\u0645\u064A\u0646' ? 'q_right' : 'q_left', 'q_arrive');
        if ((m = t.match(/^\u0643\u0627\u0645 \u0646\u0632\u0648\u062F \u0639\u0644\u0649 (\d+)/))) return ['q_ten_a'].concat(N(m[1]), 'q_ten_b');
        if ((m = t.match(/^\u0627\u0628\u0646\u064A \u0627\u0644\u0639\u062F\u062F (\d+)/))) return ['q_build'].concat(N(m[1]));
        return null;
    }
    function ctx() { if (!CTX) { var A = window.AudioContext || window.webkitAudioContext; if (A) CTX = new A(); } if (CTX && CTX.state === 'suspended') CTX.resume(); return CTX; }
    function trim(b) { /* cut leading/trailing silence from a decoded clip */
        var d = b.getChannelData(0), th = 0.02, s = 0, e = d.length - 1; while (s < e && Math.abs(d[s]) < th) s++; while (e > s && Math.abs(d[e]) < th) e--;
        s = Math.max(0, s - Math.floor(b.sampleRate * .01)); e = Math.min(d.length - 1, e + Math.floor(b.sampleRate * .02)); return { b: b, s: s / b.sampleRate, d: (e - s) / b.sampleRate };
    }
    function load(id) {
        if (BUF[id]) return BUF[id]; var c = ctx(); if (!c) return Promise.reject();
        return BUF[id] = fetch('audio/num/' + id + '.m4a').then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); }).then(function (ab) { return new Promise(function (ok, no) { c.decodeAudioData(ab, ok, no); }); }).then(trim);
    }
    function stop() { token++; try { if (cur) cur.forEach(function (s) { s.stop(); }); } catch (e) {} cur = null; }
    /* plays ids back-to-back with short gaps; resolves when finished or on failure (never throws) */
    function play(ids, onend, muted) {
        stop(); var my = token, c = ctx(); if (!ids || !ids.length || !c || muted) { if (onend) onend(false); return; }
        Promise.all(ids.map(load)).then(function (cl) {
            if (my !== token) return; var t = c.currentTime + 0.05, nodes = [];
            cl.forEach(function (x) { var s = c.createBufferSource(); s.buffer = x.b; s.connect(c.destination); s.start(t, x.s, x.d); nodes.push(s); t += x.d + GAP; });
            cur = nodes; setTimeout(function () { if (my === token) { cur = null; if (onend) onend(true); } }, (t - c.currentTime) * 1000 + 50);
        }).catch(function () { if (my === token && onend) onend(false); });
    }
    function have(ids) { return !!ids; }
    return { numIds: numIds, qIds: qIds, play: play, stop: stop, preload: function (ids) { (ids || []).forEach(function (i) { load(i).catch(function () {}); }); } };
})();
if (typeof module !== 'undefined') module.exports = NumAudio;
