/* Kleines Schachdiagramm aus FEN. Nutzung: <div class="eb-board" data-fen="..." data-caption="..."></div> */
(function () {
  var cs = document.currentScript, BASE = (cs && cs.src) ? cs.src.replace(/eb-board\.js.*$/, 'pieces/') : '/assets/pieces/';
  var NAME = { k: 'König', q: 'Dame', r: 'Turm', b: 'Läufer', n: 'Springer', p: 'Bauer' };
  var G = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙', k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
  function draw(el) {
    var fen = (el.getAttribute('data-fen') || '').split(' ')[0];
    var rows = fen.split('/');
    if (rows.length !== 8) return;
    var t = document.createElement('table');
    t.className = 'eb-board-grid';
    t.setAttribute('role', 'img');
    t.setAttribute('aria-label', el.getAttribute('data-label') || 'Schachdiagramm');
    for (var r = 0; r < 8; r++) {
      var tr = document.createElement('tr');
      var c = 0;
      var row = rows[r];
      for (var i = 0; i < row.length; i++) {
        var ch = row[i];
        var n = parseInt(ch, 10);
        var count = isNaN(n) ? 1 : n;
        for (var k = 0; k < count; k++) {
          var td = document.createElement('td');
          td.className = ((r + c) % 2 === 0) ? 'l' : 'd';
          if (isNaN(n)) {
            var white = (ch === ch.toUpperCase());
            if (G[ch]) {
              var img = document.createElement('img');
              img.src = BASE + (white ? 'w' : 'b') + ch.toUpperCase() + '.svg';
              img.alt = (white ? 'weißer ' : 'schwarzer ') + NAME[ch.toLowerCase()];
              img.width = 42; img.height = 42; img.decoding = 'async';
              td.appendChild(img);
            }
            td.className += white ? ' w' : ' b';
          }
          if (c === 0) td.setAttribute('data-rank', 8 - r);
          if (r === 7) td.setAttribute('data-file', 'abcdefgh'[c]);
          tr.appendChild(td);
          c++;
        }
      }
      t.appendChild(tr);
    }
    el.appendChild(t);
    var cap = el.getAttribute('data-caption');
    if (cap) { var p = document.createElement('p'); p.className = 'eb-board-cap'; p.textContent = cap; el.appendChild(p); }
    var src = document.createElement('p'); src.className = 'eb-board-src';
    src.innerHTML = 'Figuren: <a href="https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces" target="_blank" rel="noopener">Colin M. L. Burnett, Wikimedia Commons</a>, GPL';
    el.appendChild(src);
  }
  function init() { document.querySelectorAll('.eb-board').forEach(draw); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  /* Mini-Quiz: <div class="eb-quiz" data-answer="1"> mit Buttons darin */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.eb-quiz button');
    if (!b) return;
    var q = b.closest('.eb-quiz');
    var ok = String([].indexOf.call(q.querySelectorAll('button'), b)) === q.getAttribute('data-answer');
    q.querySelectorAll('button').forEach(function (x) { x.classList.remove('ok', 'no'); });
    b.classList.add(ok ? 'ok' : 'no');
    var fb = q.querySelector('.eb-quiz-fb');
    if (fb) fb.textContent = ok ? 'Richtig! ' + (q.getAttribute('data-why') || '') : 'Noch nicht. Lies den Abschnitt noch einmal.';
  });
})();
