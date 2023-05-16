(() => {
  const app = {
    init() {
      this.language = null;
      this.cacheElements();
      this.getLanguage();
      this.buildUI();
      this.listenForChangeLanguage();
      this.listenForSubmitForm();
      this.listenForResetForm();
    },
    cacheElements() {
      this.$chooseLanguage = document.getElementById('choose-language');
      this.$form = document.getElementById('form');
      this.$checklist = document.getElementById('checklist');
      this.$btnReset = document.getElementById('btn-reset');
      this.$result = document.getElementById('result');
    },
    /**
     * GET LANGUAGE
     */
    getLanguage() {
      this.language = localStorage.getItem('language');
      if (this.language) this.$chooseLanguage.value = this.language;
      else {
        this.language = this.$chooseLanguage.value;
        localStorage.setItem('language', this.language);
      }
    },
    listenForChangeLanguage() {
      this.$chooseLanguage.addEventListener('change', (e) => {
        e.preventDefault();
        const newLang = e.currentTarget.value;
        localStorage.setItem('language', newLang);
        this.language = newLang;
        this.buildUI();
      });
    },
    /**
     * BUILD UI
     */
    buildUI() {
      const categories = [
        ...new Set(data.map((item) => item.category[this.language])),
      ];
      this.$checklist.innerHTML = this.renderChecklist(categories);
    },
    renderChecklist(categories) {
      return categories
        .map((category) => {
          const filteredData = data.filter(
            (item) => item.category[this.language] === category
          );
          return `
            <h5 class="border rounded bg-light shadow-sm p-2 mt-3">${category}</h5>
            ${filteredData
              .map((item, index) => {
                return `
                <div class="form-check">
                  <input  type="checkbox"
                      class="form-check-input"
                      name="${this.getSlug(item.text[this.language])}" 
                      id="check-${index}"
                      value="${item.score}" />
                  <label for="check-${index}" class="form-check-label">
                    ${item.text[this.language]}
                  </label>
              </div>`;
              })
              .join('')}

          `;
        })
        .join('');
    },
    listenForSubmitForm() {
      this.$form.addEventListener('submit', (e) => {
        e.preventDefault();
        let totalScore = 0;
        const checkboxes = document.querySelectorAll('input[type=checkbox]');
        for (const box of checkboxes) {
          if (box.checked) totalScore += parseInt(box.value);
        }
        const percent = totalScore * 4;
        this.$result.innerHTML = `
        <span class="text-${this.getResultColor(percent)}">
          Score: ${percent}%</span>`;
        this.$result.classList.remove('d-none');
        window.scrollTo(0, 0);
      });
    },
    listenForResetForm() {
      this.$btnReset.addEventListener('click', (e) => {
        e.preventDefault();
        const checkboxes = document.querySelectorAll('input[type=checkbox]');
        for (const box of checkboxes) {
          box.checked = false;
        }
        window.scrollTo(0, 0);
        this.$result.innerHTML = '';
        this.$result.classList.add('d-none');
      });
    },
    getSlug(str) {
      // Source: https://www.linkedin.com/learning/javascript-code-challenges/urlify
      return str
        .trim()
        .toLowerCase()
        .replace(/[?,.;:!/\\+=´`'"]/g, '')
        .replace(/\s/g, '-');
    },
    getResultColor(percent) {
      if (percent >= 75) return 'success';
      if (percent >= 60) return 'warning';
      if (percent < 60) return 'danger';
    },
  };
  app.init();
})();
