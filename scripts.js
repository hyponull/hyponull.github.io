// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todas as funções
    initScrollAnimation();
    initScrollSmoothLinks();
    initCounterAnimation();
    initTypingEffect();
    initTestimonialCarousel();
    initHoverEffects();
    initPricingHighlight();
    initCookieConsent();
    initWhatsappTracker();
    initCountdownTimer();
});

// Animação de elementos ao rolar a página
function initScrollAnimation() {
    const elements = document.querySelectorAll('.fadein');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3 });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.7s ease';
        observer.observe(element);
    });
}

// Rolagem suave para links internos
function initScrollSmoothLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 50,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Animação de contadores para números
function initCounterAnimation() {
    // Adicionar elementos com contadores à página
    const statsSection = document.createElement('section');
    statsSection.className = 'fadein stats-section';
    statsSection.innerHTML = `
        <h2>Resultados</h2>
        <div class="stats">
            <div class="stat-item">
                <div class="counter" data-target="24">0</div>
                <p>Clientes satisfeitos</p>
            </div>
            <div class="stat-item">
                <div class="counter" data-target="32">0</div>
                <p>% média de aumento em vendas</p>
            </div>
            <div class="stat-item">
                <div class="counter" data-target="47">0</div>
                <p>Relatórios entregues mensalmente</p>
            </div>
        </div>
    `;
    
    // Inserir antes do footer
    document.querySelector('footer').before(statsSection);
    
    // Adicionar estilos para a nova seção
    const style = document.createElement('style');
    style.textContent = `
        .stats-section {
            background: #1a0033;
            padding: 3rem 2rem;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            max-width: 1000px;
            margin: 0 auto;
        }
        .stat-item {
            text-align: center;
            margin: 1rem;
        }
        .counter {
            font-size: 3rem;
            font-weight: bold;
            color: #8e44ff;
            margin-bottom: 0.5rem;
        }
    `;
    document.head.appendChild(style);
    
    // Animar os contadores quando ficarem visíveis
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    let count = 0;
                    const updateCounter = () => {
                        const increment = target / 50;
                        if (count < target) {
                            count += increment;
                            counter.innerText = Math.ceil(count);
                            setTimeout(updateCounter, 30);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
}

// Efeito de digitação para o título
function initTypingEffect() {
    const h1 = document.querySelector('h1');
    const originalText = h1.textContent;
    
    h1.textContent = '';
    h1.style.minHeight = '120px'; // Evita saltos de layout
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < originalText.length) {
            h1.textContent += originalText.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 50);
}

// Carrossel para os depoimentos
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialsSection = document.querySelector('.testimonials-section');
    
    // Se houver depoimentos, criar navegação
    if (testimonials.length > 0) {
        // Criar container para o carrossel
        const carouselContainer = document.createElement('div');
        carouselContainer.className = 'carousel-container';
        
        // Copiar depoimentos para o novo container (em vez de movê-los)
        const testimonialsCopy = Array.from(testimonials).map(testimonial => testimonial.cloneNode(true));
        
        testimonialsCopy.forEach((testimonial, index) => {
            testimonial.style.display = index === 0 ? 'block' : 'none';
            carouselContainer.appendChild(testimonial);
        });
        
        // Criar botões de navegação apenas se houver mais de um depoimento
        if (testimonials.length > 1) {
            const navButtons = document.createElement('div');
            navButtons.className = 'carousel-nav';
            navButtons.innerHTML = `
                <button class="carousel-prev"><i class="fas fa-chevron-left"></i></button>
                <div class="carousel-dots"></div>
                <button class="carousel-next"><i class="fas fa-chevron-right"></i></button>
            `;
            
            // Criar indicadores de slide
            const dotsContainer = navButtons.querySelector('.carousel-dots');
            testimonialsCopy.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = 'dot' + (index === 0 ? ' active' : '');
                dot.addEventListener('click', () => showTestimonial(index));
                dotsContainer.appendChild(dot);
            });
            
            // Adicionar elementos ao DOM
            carouselContainer.appendChild(navButtons);
            
            // Configurar o carrossel
            let currentSlide = 0;
            
            function showTestimonial(index) {
                testimonialsCopy.forEach((testimonial, i) => {
                    testimonial.style.display = i === index ? 'block' : 'none';
                });
                
                document.querySelectorAll('.dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
                
                currentSlide = index;
            }
            
            // Evento para botões de navegação
            navButtons.querySelector('.carousel-prev').addEventListener('click', () => {
                let newIndex = currentSlide - 1;
                if (newIndex < 0) newIndex = testimonialsCopy.length - 1;
                showTestimonial(newIndex);
            });
            
            navButtons.querySelector('.carousel-next').addEventListener('click', () => {
                let newIndex = currentSlide + 1;
                if (newIndex >= testimonialsCopy.length) newIndex = 0;
                showTestimonial(newIndex);
            });
            
            // Auto-rotação
            setInterval(() => {
                let newIndex = currentSlide + 1;
                if (newIndex >= testimonialsCopy.length) newIndex = 0;
                showTestimonial(newIndex);
            }, 5000);
        }
        
        // Adicionar elementos ao DOM - inserir após o título
        const title = testimonialsSection.querySelector('h2');
        if (title) {
            title.after(carouselContainer);
        } else {
            testimonialsSection.prepend(carouselContainer);
        }
    }
    
    // Adicionar estilos para o carrossel
    const style = document.createElement('style');
    style.textContent = `
        .carousel-container {
            position: relative;
            max-width: 800px;
            margin: 0 auto;
        }
        .carousel-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 2rem;
        }
        .carousel-prev, .carousel-next {
            background: none;
            border: none;
            color: #8e44ff;
            font-size: 1.5rem;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .carousel-prev:hover, .carousel-next:hover {
            transform: scale(1.2);
        }
        .carousel-dots {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
        }
        .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #444;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        .dot.active {
            background: #8e44ff;
        }
    `;
    document.head.appendChild(style);
}

// Efeitos ao passar o mouse nos botões
function initHoverEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 7px 20px rgba(142, 68, 255, 0.6)';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 0 10px #8e44ff';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px)';
        });
    });
}

// Destaque nos planos de preço
function initPricingHighlight() {
    // Destacar o plano Pro como recomendado
    const plans = document.querySelectorAll('.plan');
    
    if (plans.length >= 3) {
        // Plano Pro é o do meio (índice 1)
        const proPlan = plans[1];
        proPlan.style.transform = 'scale(1.05)';
        proPlan.style.boxShadow = '0 0 25px #8e44ff';
        
        // Adicionar tag de "Mais Popular"
        const popularTag = document.createElement('div');
        popularTag.className = 'popular-tag';
        popularTag.textContent = 'Mais Popular';
        popularTag.style.position = 'absolute';
        popularTag.style.top = '-12px';
        popularTag.style.right = '-12px';
        popularTag.style.background = 'linear-gradient(135deg, #8e44ff, #1abc9c)';
        popularTag.style.padding = '5px 10px';
        popularTag.style.borderRadius = '8px';
        popularTag.style.fontSize = '0.8rem';
        popularTag.style.fontWeight = 'bold';
        
        // Garantir que o plano tenha posição relativa para o posicionamento absoluto da tag
        proPlan.style.position = 'relative';
        proPlan.appendChild(popularTag);
    }
}

// Banner de consentimento de cookies
function initCookieConsent() {
    // Verificar se o usuário já aceitou os cookies
    if (!localStorage.getItem('cookieConsent')) {
        const cookieBanner = document.createElement('div');
        cookieBanner.className = 'cookie-banner';
        cookieBanner.innerHTML = `
            <p>Usamos cookies para melhorar sua experiência. 🍪</p>
            <button id="accept-cookies">Aceitar</button>
        `;
        
        // Estilos para o banner
        cookieBanner.style.position = 'fixed';
        cookieBanner.style.bottom = '20px';
        cookieBanner.style.left = '20px';
        cookieBanner.style.padding = '15px 20px';
        cookieBanner.style.background = '#1a0033';
        cookieBanner.style.borderRadius = '10px';
        cookieBanner.style.boxShadow = '0 0 15px rgba(142, 68, 255, 0.6)';
        cookieBanner.style.zIndex = '1000';
        cookieBanner.style.display = 'flex';
        cookieBanner.style.alignItems = 'center';
        cookieBanner.style.gap = '15px';
        
        document.body.appendChild(cookieBanner);
        
        // Estilizar o botão de aceitar
        const acceptButton = document.getElementById('accept-cookies');
        acceptButton.style.background = 'linear-gradient(135deg, #8e44ff, #1abc9c)';
        acceptButton.style.color = '#fff';
        acceptButton.style.border = 'none';
        acceptButton.style.padding = '8px 15px';
        acceptButton.style.borderRadius = '5px';
        acceptButton.style.cursor = 'pointer';
        
        // Evento para aceitar cookies
        acceptButton.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.opacity = '0';
            setTimeout(() => {
                cookieBanner.remove();
            }, 300);
        });
        
        // Animação de entrada do banner
        setTimeout(() => {
            cookieBanner.style.transition = 'opacity 0.3s ease';
        }, 100);
    }
}

// Rastreador de cliques no WhatsApp
function initWhatsappTracker() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Rastrear o clique (poderia integrar com Google Analytics, mas aqui apenas salva no localStorage)
            const clickCount = parseInt(localStorage.getItem('whatsappClicks') || '0');
            localStorage.setItem('whatsappClicks', clickCount + 1);
            
            // Adicionar uma classe para feedback visual
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 1000);
            
            // Adicionar estilo para a classe clicked
            if (!document.querySelector('style#click-style')) {
                const style = document.createElement('style');
                style.id = 'click-style';
                style.textContent = `
                    .clicked {
                        animation: pulse 1s;
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }
        });
    });
}

// Temporizador de contagem regressiva
function initCountdownTimer() {
    // Criar o elemento do temporizador
    const countdownSection = document.createElement('div');
    countdownSection.className = 'countdown-container fadein';
    
    // Data final da oferta (7 dias a partir de agora)
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);
    
    // Formatar data para exibição
    const options = { day: 'numeric', month: 'long' };
    const formattedDate = endDate.toLocaleDateString('pt-BR', options);
    
    countdownSection.innerHTML = `
        <div class="countdown-header">
            <h3>Oferta por tempo limitado!</h3>
            <p>Preços especiais válidos até <strong>${formattedDate}</strong></p>
        </div>
        <div class="countdown">
            <div class="countdown-item">
                <span id="countdown-days">00</span>
                <span class="countdown-label">Dias</span>
            </div>
            <div class="countdown-item">
                <span id="countdown-hours">00</span>
                <span class="countdown-label">Horas</span>
            </div>
            <div class="countdown-item">
                <span id="countdown-minutes">00</span>
                <span class="countdown-label">Minutos</span>
            </div>
            <div class="countdown-item">
                <span id="countdown-seconds">00</span>
                <span class="countdown-label">Segundos</span>
            </div>
        </div>
    `;
    
    // Inserir antes da seção de planos
    const plansSection = document.querySelector('section:nth-of-type(2)');
    plansSection.before(countdownSection);
    
    // Adicionar estilos para o temporizador
    const style = document.createElement('style');
    style.textContent = `
        .countdown-container {
            background: linear-gradient(135deg, rgba(142, 68, 255, 0.2), rgba(26, 188, 156, 0.2));
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            margin: 2rem auto;
            max-width: 800px;
            border: 1px solid rgba(142, 68, 255, 0.3);
            box-shadow: 0 0 20px rgba(142, 68, 255, 0.2);
        }
        
        .countdown-header h3 {
            color: #d09eff;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
        }
        
        .countdown-header p {
            color: #f0e6ff;
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
        }
        
        .countdown {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 1rem;
        }
        
        .countdown-item {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .countdown-item span:first-child {
            font-size: 2.5rem;
            font-weight: bold;
            background: linear-gradient(135deg, #8e44ff, #1abc9c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            min-width: 60px;
            text-align: center;
            text-shadow: none;
        }
        
        .countdown-label {
            font-size: 0.9rem;
            color: #d09eff;
            margin-top: 0.2rem;
        }
    `;
    document.head.appendChild(style);
    
    // Função para atualizar o temporizador
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = endDate.getTime() - now;
        
        if (timeLeft <= 0) {
            document.getElementById('countdown-days').textContent = '00';
            document.getElementById('countdown-hours').textContent = '00';
            document.getElementById('countdown-minutes').textContent = '00';
            document.getElementById('countdown-seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        document.getElementById('countdown-days').textContent = days.toString().padStart(2, '0');
        document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Atualizar imediatamente e a cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Adicionar animação de pulso para criar urgência
    setInterval(() => {
        const secondsEl = document.getElementById('countdown-seconds');
        if (secondsEl) {
            secondsEl.style.transform = 'scale(1.1)';
            setTimeout(() => {
                secondsEl.style.transform = 'scale(1)';
            }, 500);
        }
    }, 2000);
}