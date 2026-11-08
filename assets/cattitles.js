/* FreshDrop – category titles, style C "neon glass outline" (picked by Amir). Visual only.
   Outline = outer half of a stroke, masked by the glyph fill, so overlapping font contours never show. */
(function () {
  var D = {"Home": {"i": "<path d=\"M4 11.5 12 4.5l8 7\"/><path d=\"M6.5 10v9.5h11V10\"/><path d=\"M10 19.5v-5h4v5\"/>", "c": ["#0FB5C9", "#7C4DFF"]}, "Kitchen": {"i": "<path d=\"M4.5 10.5h15v4a5.5 5.5 0 0 1-5.5 5.5h-4a5.5 5.5 0 0 1-5.5-5.5z\"/><path d=\"M19.5 12.5h2\"/><path d=\"M9 3.5v3.5M12 3v4M15 3.5v3.5\"/>", "c": ["#FF4D8D", "#FFC83D"]}, "Office": {"i": "<rect x=\"3.5\" y=\"7.5\" width=\"17\" height=\"12\" rx=\"2.2\"/><path d=\"M9 7.5V5.6c0-.9.7-1.6 1.6-1.6h2.8c.9 0 1.6.7 1.6 1.6v1.9\"/><path d=\"M3.5 12.5h17\"/>", "c": ["#7C4DFF", "#0FB5C9"]}, "Pets": {"i": "<circle cx=\"6.5\" cy=\"10\" r=\"1.7\"/><circle cx=\"10\" cy=\"6.3\" r=\"1.7\"/><circle cx=\"14.5\" cy=\"6.3\" r=\"1.7\"/><circle cx=\"18\" cy=\"10\" r=\"1.7\"/><path d=\"M8 17.2c0-2.8 2-5.2 4.2-5.2s4.3 2.4 4.3 5.2c0 1.8-1.6 2.8-4.3 2.8S8 19 8 17.2z\"/>", "c": ["#7C4DFF", "#FF4D8D"]}, "Cleaning": {"i": "<path d=\"M11 3.5l1.6 4.4 4.4 1.6-4.4 1.6L11 15.5l-1.6-4.4L5 9.5l4.4-1.6z\"/><path d=\"M18 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z\"/>", "c": ["#3FD0E0", "#0FB5C9", "#7C4DFF"]}, "Bathroom": {"i": "<path d=\"M12 3.5s6 6.4 6 10.8a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5z\"/><path d=\"M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5\"/>", "c": ["#0FB5C9", "#B9A3FF"]}, "Tools": {"i": "<path d=\"M14.7 4.2a4.2 4.2 0 0 0-4.4 5.6L4 16.1V20h3.9l6.3-6.3a4.2 4.2 0 0 0 5.6-4.4l-2.7 2.7-2.8-.6-.6-2.8z\"/>", "c": ["#FFC83D", "#7C4DFF"]}, "Travel": {"i": "<rect x=\"5\" y=\"7.5\" width=\"14\" height=\"12\" rx=\"2.2\"/><path d=\"M9.5 7.5V4.5h5v3\"/><path d=\"M9 19.5v1.5M15 19.5v1.5M9 11v5M15 11v5\"/>", "c": ["#0FB5C9", "#FFC83D"]}, "Car": {"i": "<path d=\"M4 15.5v-3.3L6.3 7h11.4l2.3 5.2v3.3\"/><path d=\"M4 12.2h16\"/><circle cx=\"8\" cy=\"16\" r=\"2\"/><circle cx=\"16\" cy=\"16\" r=\"2\"/><path d=\"M10 16h4M4 15.5c0 .3.2.5.5.5H6M20 15.5c0 .3-.2.5-.5.5H18\"/>", "c": ["#7C4DFF", "#FF4D8D", "#FFC83D"]}, "SG": {"i": "<path d=\"M6.5 8v8M9.5 6v12M14.5 6v12M17.5 8v8M9.5 12h5M3.5 10.5v3M20.5 10.5v3\"/>", "c": ["#0FB5C9", "#7C4DFF", "#FF4D8D", "#FFC83D"]}};
  var n = 0;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (m) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }
  window.fdCatTitle = function (key, name) {
    var d = D[key]; if (!d || !name) return null;
    var id = 'fdct' + (++n), t = esc(name), c = d.c;
    var stops = c.map(function (x, i) { return '<stop offset="' + (c.length > 1 ? i / (c.length - 1) : 0) + '" stop-color="' + x + '"/>'; }).join('');
    var g = 'linear-gradient(90deg,' + c.join(',') + ')';
    var w = Math.round(name.length * 58);
    return '<span class="ct-sr">' + t + '</span>' +
      '<span class="ct-pill" aria-hidden="true" style="--c1:' + c[0] + ';--c2:' + c[c.length - 1] + ';--g:' + g + '">' +
      '<span class="ct-icb"><svg class="ct-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">' + d.i + '</svg></span>' +
      '<svg class="ct-word" viewBox="-7 -81 ' + (w + 14) + ' 112" data-fit="1">' +
        '<defs><linearGradient id="' + id + 'g" gradientUnits="objectBoundingBox" x1="0" x2="1" y1="0" y2="0">' + stops + '</linearGradient>' +
        '<linearGradient id="' + id + 'h" gradientUnits="objectBoundingBox" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".38" stop-color="#fff" stop-opacity=".14"/><stop offset=".56" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
        /* outline: outer half of a thick round stroke, inner part + overlapping contours hidden by the glyph fill */
        '<mask id="' + id + 'm" maskUnits="userSpaceOnUse" x="-50" y="-150" width="5000" height="300">' +
          '<text class="ct-t" x="0" y="0" fill="#000" stroke="#fff" stroke-width="9" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke">' + t + '</text></mask>' +
        '<mask id="' + id + 'f" maskUnits="userSpaceOnUse" x="-50" y="-150" width="5000" height="300">' +
          '<text class="ct-t" x="0" y="0" fill="#fff">' + t + '</text></mask></defs>' +
        '<text class="ct-t ct-fill" x="0" y="0" fill="url(#' + id + 'g)" fill-opacity=".2">' + t + '</text>' +
        '<rect class="ct-r ct-gloss" x="-50" y="-150" width="5000" height="300" fill="url(#' + id + 'h)" mask="url(#' + id + 'f)"/>' +
        '<rect class="ct-r ct-paint" x="-50" y="-150" width="5000" height="300" fill="url(#' + id + 'g)" mask="url(#' + id + 'm)"/>' +
      '</svg></span>';
  };
  function fit(root) {
    (root || document).querySelectorAll('svg.ct-word[data-fit]').forEach(function (s) {
      var t = s.querySelector('.ct-fill'); if (!t) return;
      var b; try { b = t.getBBox(); } catch (e) { return; }
      if (!b || !b.width) return;
      var p = 7;
      s.setAttribute('viewBox', [b.x - p, b.y - p, b.width + 2 * p, b.height + 2 * p].map(function (v) { return v.toFixed(1); }).join(' '));
      /* gradient across the word only */
      s.querySelectorAll('.ct-r').forEach(function (r) { r.setAttribute('x', (b.x - p).toFixed(1)); r.setAttribute('width', (b.width + 2 * p).toFixed(1)); var gl = r.classList.contains('ct-gloss'); r.setAttribute('y', (gl ? b.y + b.height * 0.17 : b.y - p).toFixed(1)); r.setAttribute('height', (gl ? b.height * 0.62 : b.height + 2 * p).toFixed(1)); });
      if (document.fonts && document.fonts.status === 'loaded') s.removeAttribute('data-fit');
    });
  }
  window.fdCatTitleFit = fit;
  document.addEventListener('DOMContentLoaded', function () {
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fit(); });
    var main = document.getElementById('main');
    if (main && window.MutationObserver) new MutationObserver(function () { if (document.querySelector('svg.ct-word[data-fit]')) requestAnimationFrame(function () { fit(); }); }).observe(main, {childList: true, subtree: true});
  });
})();
