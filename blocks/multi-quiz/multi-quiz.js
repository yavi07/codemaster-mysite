export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 4) {
    block.innerHTML = '<p class="multi-quiz-error">Invalid quiz block structure.</p>';
    return;
  }

  // 1. Extract quiz ID and sub-question number
  const quizIdText = rows[0]?.children[0]?.textContent || '';
  const quizIdMatch = quizIdText.match(/\((.*?)\)/);
  const fullQuizId = quizIdMatch ? quizIdMatch[1].trim() : 'unknown'; // e.g., quiz-react-q1
  const isFinalQuestion = fullQuizId.endsWith('q3'); // Customize if more/fewer

  const quizPrefix = fullQuizId.split('-q')[0]; // e.g., 'quiz-react'

  // 2. Extract question
  const questionRow = rows[1];
  const question = [...questionRow.children].map(c => c.textContent.trim()).filter(Boolean).join(' ') || 'Question missing';

  // 3. Extract redirect URLs
  const redirectRow = rows[rows.length - 1];
  const isRedirectRow = redirectRow.children[0]?.textContent?.toLowerCase()?.includes('redirect');
  const successURL = isRedirectRow ? redirectRow.children[1]?.textContent.trim() : '#';
  const failureURL = isRedirectRow ? redirectRow.children[2]?.textContent.trim() : '#';

  // 4. Extract options
  const optionRows = rows.slice(2, isRedirectRow ? -1 : rows.length);
  const options = optionRows.map((row) => {
    const text = row.children[0]?.textContent.trim() || '';
    const isCorrect = row.children[1]?.textContent.trim().toLowerCase() === 'true';
    return { text, isCorrect };
  });

  // 5. Render block UI
  const container = document.createElement('div');
  container.className = 'multi-quiz-wrapper';

  const questionEl = document.createElement('div');
  questionEl.className = 'multi-quiz-question';
  questionEl.textContent = question;
  container.appendChild(questionEl);

  const form = document.createElement('form');
  form.className = 'multi-quiz-form';

  options.forEach((opt) => {
    const label = document.createElement('label');
    label.className = 'multi-quiz-option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'answer';
    input.value = opt.isCorrect;
    input.required = true;

    label.appendChild(input);
    label.append(` ${opt.text}`);
    form.appendChild(label);
  });

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'multi-quiz-submit';
  submitBtn.textContent = 'Submit';
  form.appendChild(submitBtn);

  container.appendChild(form);
  block.innerHTML = '';
  block.appendChild(container);

  // 6. Submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const selected = form.querySelector('input[name="answer"]:checked');
    const isCorrect = selected?.value === 'true';

    if (!isCorrect) {
      // Clear all session data on failure
      sessionStorage.removeItem(`${quizPrefix}-q1`);
      sessionStorage.removeItem(`${quizPrefix}-q2`);
      sessionStorage.removeItem(`${quizPrefix}-q3`);
      sessionStorage.setItem(`${quizPrefix}-status`, 'incorrect');
      window.location.href = failureURL;
      return;
    }

    sessionStorage.setItem(`${fullQuizId}`, 'correct');

    if (isFinalQuestion) {
      const passedAll = ['q1', 'q2', 'q3'].every(q => sessionStorage.getItem(`${quizPrefix}-${q}`) === 'correct');
      if (passedAll) {
        sessionStorage.setItem(`${quizPrefix}-status`, 'correct');
        localStorage.setItem(`badge-${quizPrefix}`, 'earned');
      }
    }

    window.location.href = successURL;
  });
}
