const book = document.getElementById('book');
const papers = [
    document.getElementById('p1'),
    document.getElementById('p2'),
    document.getElementById('p3')
];

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const resetBtn = document.getElementById('reset-btn');
const pageIndicator = document.getElementById('page-indicator');
const bookCover = document.getElementById('book-cover');
const coverSheen = document.getElementById('cover-sheen');
const dustContainer = document.getElementById('ambient-dust');

let currentLocation = 1;
const numOfPapers = papers.length;
const maxLocation = numOfPapers + 1;

// Cria partículas de poeira dourada sutis no fundo
function createAmbientDust() {
    for (let i = 0; i < 24; i++) {
        const speck = document.createElement('div');
        speck.classList.add('dust-speck');
        const size = Math.random() * 3 + 1.5;
        speck.style.width = `${size}px`;
        speck.style.height = `${size}px`;
        speck.style.left = `${Math.random() * 100}%`;
        speck.style.top = `${Math.random() * 100}%`;
        speck.style.animationDuration = `${Math.random() * 10 + 8}s`;
        speck.style.animationDelay = `${Math.random() * 5}s`;
        dustContainer.appendChild(speck);
    }
}
createAmbientDust();

// Efeito de reflexo de luz no couro conforme o mouse passa pela capa
bookCover.addEventListener('mousemove', (e) => {
    const rect = bookCover.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    coverSheen.style.background = `radial-gradient(circle 240px at ${x}px ${y}px, rgba(255, 225, 165, 0.13), transparent 80%)`;
});

// Verifica se está em tela menor (celular/tablet)
function isMobileView() {
    return window.innerWidth <= 980;
}

// Configura a ordem inicial das folhas
function initZIndex() {
    papers.forEach((paper, index) => {
        paper.style.zIndex = numOfPapers - index;
    });
}
initZIndex();

// Atualiza posição do livro, borda de folhas e estado dos botões
function updateBookState() {
    // Controla a pilha de páginas lateral (visível apenas quando fechado na capa)
    if (currentLocation === 1) {
        book.classList.remove('is-open');
    } else {
        book.classList.add('is-open');
    }

    // Posicionamento responsivo
    if (isMobileView()) {
        if (currentLocation === 1) {
            book.style.transform = "translateX(0%)";
        } else {
            book.style.transform = "translateX(100%)";
        }
    } else {
        if (currentLocation === 1) {
            book.style.transform = "translateX(0%)";
        } else if (currentLocation === maxLocation) {
            book.style.transform = "translateX(100%)";
        } else {
            book.style.transform = "translateX(50%)";
        }
    }

    // Atualiza indicador e visibilidade dos botões
    if (currentLocation === 1) {
        pageIndicator.textContent = "Capa";
        prevBtn.classList.add('hidden-btn');
        nextBtn.classList.remove('hidden-btn');
        nextBtn.textContent = "Abrir Livro →";
    } else if (currentLocation === maxLocation) {
        pageIndicator.textContent = "Contracapa";
        prevBtn.classList.remove('hidden-btn');
        nextBtn.classList.add('hidden-btn');
    } else {
        pageIndicator.textContent = `Folha ${currentLocation - 1} de ${numOfPapers}`;
        prevBtn.classList.remove('hidden-btn');
        nextBtn.classList.remove('hidden-btn');
        nextBtn.textContent = "Próxima →";
    }
}

function goNextPage() {
    if (currentLocation < maxLocation) {
        const currentPaper = papers[currentLocation - 1];
        currentPaper.classList.add('flipped');
        currentPaper.style.zIndex = currentLocation;

        currentLocation++;
        updateBookState();
    }
}

function goPrevPage() {
    if (currentLocation > 1) {
        currentLocation--;
        const currentPaper = papers[currentLocation - 1];
        currentPaper.classList.remove('flipped');
        
        setTimeout(() => {
            currentPaper.style.zIndex = numOfPapers - (currentLocation - 1);
        }, 300);

        updateBookState();
    }
}

// Eventos dos botões
nextBtn.addEventListener('click', goNextPage);
prevBtn.addEventListener('click', goPrevPage);

// Botão de fechar o livro na contracapa
resetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    while (currentLocation > 1) {
        goPrevPage();
    }
});

// Clicar ou tocar na folha para virar
papers.forEach((paper, index) => {
    paper.addEventListener('click', () => {
        if (index + 1 === currentLocation) {
            goNextPage();
        } else if (index + 1 === currentLocation - 1) {
            goPrevPage();
        }
    });
});

// Suporte a deslizar o dedo (swipe) no celular
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
        goNextPage();
    } else if (touchEndX - touchStartX > 50) {
        goPrevPage();
    }
}, { passive: true });

// Navegação pelas setas do teclado no PC
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goNextPage();
    if (e.key === 'ArrowLeft') goPrevPage();
});

// Ajusta caso o usuário redimensione a janela
window.addEventListener('resize', updateBookState);