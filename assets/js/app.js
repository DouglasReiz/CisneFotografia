(() => {
    const carousel = document.getElementById('carousel');
    const track = carousel.querySelector('.carousel-track');
    const pages = [...track.children];
    const dotsBox = carousel.querySelector('.carousel-dots');
    const INTERVAL = 4000; // ms entre páginas

    let index = 0;
    let timer = null;

    // bolinhas
    const dots = pages.map((_, i) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', `Ir para a página ${i + 1}`);
        b.addEventListener('click', () => { goTo(i); restart(); });
        dotsBox.appendChild(b);
        return b;
    });

    function goTo(i) {
        index = (i + pages.length) % pages.length;
        track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' });
    }

    // mantém index e bolinhas certos mesmo quando o usuário arrasta
    track.addEventListener('scroll', () => {
        const i = Math.round(track.scrollLeft / track.clientWidth);
        if (i !== index) index = i;
        dots.forEach((d, n) => d.classList.toggle('active', n === i));
    }, { passive: true });

    carousel.querySelector('.next').addEventListener('click', () => { goTo(index + 1); restart(); });
    carousel.querySelector('.prev').addEventListener('click', () => { goTo(index - 1); restart(); });

    // autoplay
    const start = () => { timer = setInterval(() => goTo(index + 1), INTERVAL); };
    const stop = () => clearInterval(timer);
    const restart = () => { stop(); start(); };

    // pausa ao passar o mouse ou tocar
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('touchstart', stop, { passive: true });
    carousel.addEventListener('touchend', start, { passive: true });

    // pausa se a aba estiver em segundo plano
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : restart());

    // respeita quem desativou animações no sistema
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) start();

    dots[0].classList.add('active');
})();