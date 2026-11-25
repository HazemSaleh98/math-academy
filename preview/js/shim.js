'use strict';
/* standalone storage + tiny audio shims for the Math Academy */
var KEY = 'mathacademy.preview1';
var state = (function () { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } })() || { name: 'Malek', stars: 0, math: {}, muted: false, auto: true };
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
function kidName() { var n = (state.name || 'Malek'); return String(n).toLowerCase().replace(/[^a-z0-9]/g, '') === 'malik' ? 'Malek' : n; }
var VO = { stop: function () {}, say: function () {}, oops: function () {}, hasClip: function () { return false; } };
var SFX = (function () {
    var ctx = null;
    return { play: function () {
        if (state.muted) return;
        try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); var t = ctx.currentTime;
            [660, 880, 1100].forEach(function (f, i) { var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(.0001, t + i * .09); g.gain.exponentialRampToValueAtTime(.18, t + i * .09 + .02); g.gain.exponentialRampToValueAtTime(.0001, t + i * .09 + .25); o.connect(g); g.connect(ctx.destination); o.start(t + i * .09); o.stop(t + i * .09 + .3); });
        } catch (e) {}
    } };
})();
