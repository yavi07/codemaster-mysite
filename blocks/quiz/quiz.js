export default async function decorate(block) {
  const rows = [...block.querySelectorAll('div')];
  const data = [];

  // Parse table-like divs into row objects
  rows.forEach((row) => {
    const cells = [...row.children];
    const obj = {};
    [
      'Name', 'Type', 'Label', 'Placeholder',
      'Value', 'Options', 'Mandatory',
      'Style', 'ID', 'Fieldset',
    ].forEach((key, i) => {
      obj[key] = cells[i]?.textContent?.trim();
    });
    data.push(obj);
  });

  // Extract question and options
  const question = data.find(d => d.Type === 'plaintext');
  const options = data.filter(d => d.Type === 'radio');
  const confirmation = data.find(d => d.confirmation !== undefined || d.Label === 'confirmation');

  const wrapper = document.createElement('div');
  wrapper.className = 'quiz-wrapper';

  const questionEl = document.createElement('p');
  questionEl.className = 'quiz-question';
  questionEl.textContent = question?.Label || 'Question';
  wrapper.appendChild(questionEl);

  const optionsWrapper = document.createElement('div');
  optionsWrapper.className = 'quiz-options';

  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-option';
    btn.textContent = opt.Label;

    btn.addEventListener('click', () => {
      const isCorrect = opt.Value.toLowerCase() === 'true';

      // Clear all states
      optionsWrapper.querySelectorAll('button').forEach(b => {
        b.classList.remove('correct', 'wrong');
      });

      // Mark selected
      btn.classList.add(isCorrect ? 'correct' : 'wrong');

      // Redirect if correct
      if (isCorrect && confirmation?.Value) {
        setTimeout(() => {
          window.location.href = confirmation.Value;
        }, 1000);
      }
    });

    optionsWrapper.appendChild(btn);
  });

  wrapper.appendChild(optionsWrapper);
  block.innerHTML = '';
  block.appendChild(wrapper);
}
