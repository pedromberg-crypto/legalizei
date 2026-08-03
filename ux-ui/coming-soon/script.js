/* ============================================================
   LEGALIZAI · Coming Soon — 100% client-side, zero backend
   Captura fake (mesmo padrão do wait-form da LP principal):
   sem persistência real, só confirma visualmente pro usuário.
   ============================================================ */
(function () {
  'use strict';

  var form = document.getElementById('soon-form');
  var email = document.getElementById('soon-email');
  var done = document.getElementById('soon-done');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!email.value || (email.validity && !email.validity.valid)) return;
    email.value = '';
    done.classList.remove('hidden');
  });
})();
