(() => {
  const feedback = document.getElementById('feedback');
  const startBtn = document.getElementById('startBtn');
  const demoAction = document.getElementById('demoAction');

  if (!feedback || !startBtn || !demoAction) {
    return;
  }

  const activateFlow = () => {
    feedback.textContent = 'Sukces: pierwszy rekord usterki został zasymulowany. Kolejny krok: dodaj status i przekaż ekipie.';
    feedback.classList.add('success');
  };

  startBtn.addEventListener('click', activateFlow);
  demoAction.addEventListener('click', activateFlow);
})();
