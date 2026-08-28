// Sustainable fix for the greedy-nav "stuck buttons on resize" bug.
// Overrides the buggy updateNav() defined in vendor.js — must load AFTER it.
(function () {
  if (typeof $nav === "undefined" || typeof $btn === "undefined") return;

  var $allNavLinks = $vlinks.children().add($hlinks.children());

  window.updateNav = function () {
    // Reset: put every link back into the visible list, original order
    $allNavLinks.appendTo($vlinks);
    $hlinks.addClass("hidden");
    $btn.removeClass("close");

    // Recompute from scratch — no stale history to get stuck on
    var available = $nav.width() - $btn.outerWidth(true) - 30;
    while ($vlinks.width() > available && $vlinks.children().length > 0) {
      $vlinks.children().last().prependTo($hlinks);
    }

    $btn.toggleClass("hidden", $hlinks.children().length === 0);
  };

  // Debounce so drag-resizing doesn't spam recalculation
  var resizeTimer;
  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(window.updateNav, 100);
  });

  // Run again after full page load — web fonts (FontAwesome/Academicons)
  // can shift link widths after the first paint
  $(window).on("load", window.updateNav);

  // Run once now to fix current state
  window.updateNav();
})();