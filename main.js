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
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          animation: appear 0.5s ease-out forwards;
        }

        @keyframes appear {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      </style>
      <div class="ball">${number}</div>
    `;
  }

  getColorForNumber(number) {
    const num = parseInt(number);
    if (num <= 10) return '#fbc400'; // 노란색
    if (num <= 20) return '#69c8f2'; // 파란색
    if (num <= 30) return '#ff7272'; // 빨간색
    if (num <= 40) return '#aaa';     // 회색
    return '#b0d840';      // 녹색
  }
}

customElements.define('lotto-ball', LottoBall);

document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generate-btn');
  const lottoBallsContainer = document.getElementById('lotto-balls');

  generateButton.addEventListener('click', () => {
    lottoBallsContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 45) + 1;
      numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach((number, index) => {
      setTimeout(() => {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoBallsContainer.appendChild(lottoBall);
      }, index * 200); // 딜레이를 주어 하나씩 나타나도록 함
    });
  });
});
