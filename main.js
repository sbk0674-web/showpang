class LottoBall extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const number = this.getAttribute('number');
    const color = this.getColorForNumber(number);
    this.shadowRoot.innerHTML = `
      <style>
        .ball {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: ${color};
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          animation: appear 0.4s ease-out forwards;
          font-family: 'Noto Sans KR', sans-serif;
        }
        @keyframes appear {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 768px) {
          .ball { width: 48px; height: 48px; font-size: 1.2rem; }
        }
      </style>
      <div class="ball">${number}</div>
    `;
  }

  getColorForNumber(number) {
    const num = parseInt(number);
    if (num <= 10) return '#fbc400';
    if (num <= 20) return '#69c8f2';
    if (num <= 30) return '#ff7272';
    if (num <= 40) return '#aaa';
    return '#b0d840';
  }
}

customElements.define('lotto-ball', LottoBall);

document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'light' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      themeToggle.textContent = next === 'light' ? '☀️' : '🌙';
    });
  }

  // Contact form
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formStatus.textContent = '전송 중...';
      formStatus.className = 'form-status';

      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          formStatus.textContent = '문의가 전송되었습니다!';
          formStatus.className = 'form-status success';
          contactForm.reset();
        } else {
          formStatus.textContent = '전송에 실패했습니다. 다시 시도해주세요.';
          formStatus.className = 'form-status error';
        }
      } catch {
        formStatus.textContent = '네트워크 오류가 발생했습니다.';
        formStatus.className = 'form-status error';
      }
    });
  }

  // Lotto generator
  const generateButton = document.getElementById('generate-btn');
  const lottoBallsContainer = document.getElementById('lotto-balls');
  if (generateButton && lottoBallsContainer) {
    generateButton.addEventListener('click', () => {
      lottoBallsContainer.innerHTML = '';
      const numbers = new Set();
      while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
      }

      const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

      sortedNumbers.forEach((number, index) => {
        setTimeout(() => {
          const lottoBall = document.createElement('lotto-ball');
          lottoBall.setAttribute('number', number);
          lottoBallsContainer.appendChild(lottoBall);
        }, index * 150);
      });
    });
  }
});
