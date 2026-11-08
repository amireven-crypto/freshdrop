/* FreshDrop – future layer: adds decorative hero grid + horizon line (aria-hidden). Visual only. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var hero = document.querySelector('.hero');
    if (hero && !hero.querySelector('.fx-grid')) hero.insertAdjacentHTML('afterbegin', '<div class="fx-grid" aria-hidden="true"></div><div class="fx-horizon" aria-hidden="true"></div>');
  });
})();
