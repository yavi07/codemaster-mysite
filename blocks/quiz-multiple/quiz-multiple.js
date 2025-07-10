export default async function decorate(block) {
    const rows = [...block.querySelectorAll('div')];
    const data = [];
  
    // Parse rows into structured data
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
  
    const question = data.find(d => d.Type === 'plaintext');
    const options = data.filter(d => d.Type === 'radio');
    const confirmation = data.find(d => d.Type === 'confirmation');
    const failure = data.find(d => d.Type === 'failure-redirect');
  
    const wrapper = document.createElement('div');
    wrapper.className = 'quiz-wrapper';
  
    const questionEl = document.createElement('p');
    questionEl.className = 'quiz-question';
    questionEl.textContent = question?.Label || 'Question';
    wrapper.appendChild(questionEl);
  
    const optionsWrapper = document.createElement('div');
    optionsWrapper.className = 'quiz-options';
  
    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.textContent = opt.Label;
  
      btn.addEventListener('click', () => {
        const isCorrect = opt.Value?.toLowerCase() === 'true';
  
        // Reset button states
        optionsWrapper.querySelectorAll('button').forEach(b => {
          b.classList.remove('correct', 'wrong');
        });
  
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
  
        const quizId = block.classList[1]; // e.g., quiz-react-q1
        sessionStorage.setItem(`${quizId}-status`, isCorrect ? 'pass' : 'fail');
  
        // Redirect based on correctness
        const redirectUrl = isCorrect ? confirmation?.Value : failure?.Value;
        if (redirectUrl) {
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1000);
        }
      });
  
      optionsWrapper.appendChild(btn);
    });
  
    wrapper.appendChild(optionsWrapper);
    block.innerHTML = '';
    block.appendChild(wrapper);
  }
  