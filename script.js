// Inicializa as funções quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const header = document.getElementById('header');
    const menuMobile = document.querySelector('.menu-mobile');
    const menu = document.querySelector('.menu');
    const backToTop = document.querySelector('.back-to-top');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');

    // Menu Mobile Toggle
    menuMobile.addEventListener('click', function() {
        menu.classList.toggle('active');
        this.classList.toggle('active');

        // Alterna o ícone do menu
        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Fecha o menu ao clicar em um link
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            menuMobile.classList.remove('active');
            const icon = menuMobile.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            backToTop.classList.add('active');
        } else {
            header.classList.remove('scrolled');
            backToTop.classList.remove('active');
        }

        // Animação de elementos ao scroll
        animateOnScroll();
    });

    // Filtro de portfólio
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove a classe active de todos os botões
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Adiciona a classe active ao botão clicado
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Validação do formulário de contato
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !subject || !message) {
                showAlert('Por favor, preencha todos os campos.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showAlert('Por favor, insira um e-mail válido.', 'error');
                return;
            }
            
            // Mostra mensagem de carregamento
            const loadingAlert = showAlert('Enviando mensagem...', 'info');
            
            // Prepara os dados para enviar ao servidor
            const formData = {
                name: name,
                email: email,
                subject: subject,
                message: message
            };
            
            // Envia os dados para o servidor Node.js
            fetch('http://localhost:3000/enviar-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                // Remove o alerta de carregamento
                const existingAlert = document.querySelector('.alert.info');
                if (existingAlert) {
                    existingAlert.classList.remove('show');
                    setTimeout(() => {
                        existingAlert.remove();
                    }, 300);
                }
                
                // Mostra o resultado
                if (data.success) {
                    showAlert(data.message, 'success');
                    contactForm.reset();
                } else {
                    showAlert(data.message, 'error');
                }
            })
            .catch(error => {
                // Remove o alerta de carregamento em caso de erro
                const existingAlert = document.querySelector('.alert.info');
                if (existingAlert) {
                    existingAlert.classList.remove('show');
                    setTimeout(() => {
                        existingAlert.remove();
                    }, 300);
                }
                
                showAlert('Erro ao enviar mensagem. Tente novamente mais tarde.', 'error');
                console.error('Erro:', error);
            });
        });
    }

    // Validação do formulário de newsletter
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (!email || !isValidEmail(email)) {
                showAlert('Por favor, insira um e-mail válido.', 'error');
                return;
            }
            
            showAlert('Inscrição realizada com sucesso!', 'success');
            this.reset();
        });
    }

    // Animação de números (estatísticas)
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateNumbers() {
        if (animated) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            let count = 0;
            const duration = 2000; // 2 segundos
            const increment = target / (duration / 20); // Incremento a cada 20ms
            
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    stat.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(count) + '+';
                }
            }, 20);
        });
        
        animated = true;
    }

    // Animação de elementos ao scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .portfolio-item, .about-content, .contact-content');
        const aboutSection = document.querySelector('.about');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate-fade-in');
            }
        });
        
        // Anima os números quando a seção 'sobre' estiver visível
        if (aboutSection) {
            const aboutPosition = aboutSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (aboutPosition < screenPosition) {
                animateNumbers();
            }
        }
    }

    // Adiciona a classe de animação ao carregar a página
    setTimeout(animateOnScroll, 500);

    // Função para validar e-mail
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Função para mostrar alertas
    function showAlert(message, type) {
        // Verifica se já existe um alerta do mesmo tipo e remove
        const existingAlert = document.querySelector(`.alert.${type}`);
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Cria o elemento de alerta
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        
        // Adiciona o texto da mensagem (separado do ícone)
        const messageText = document.createTextNode(message);
        alert.appendChild(messageText);
        
        // Adiciona ao body
        document.body.appendChild(alert);
        
        // Adiciona a classe para mostrar com animação
        setTimeout(() => {
            alert.classList.add('show');
        }, 10);
        
        // Para alertas de info (enviando...), não remover automaticamente
        if (type !== 'info') {
            // Remove após 3 segundos para success e error
            setTimeout(() => {
                alert.classList.remove('show');
                setTimeout(() => {
                    alert.remove();
                }, 300);
            }, 3000);
        }
        
        // Retorna o elemento de alerta para manipulação externa
        return alert;
    }

    // Adiciona animação de código na seção hero com efeito de digitação
function animateCode() {
    console.log('Iniciando animação de código com efeito de digitação');
    const codeAnimation = document.querySelector('.code-animation');
    if (!codeAnimation) {
        console.error('Elemento .code-animation não encontrado');
        return;
    }
    
    console.log('Elemento .code-animation encontrado');
    
    // Limpa qualquer conteúdo anterior
    codeAnimation.innerHTML = '';
    
    // Força a visibilidade imediatamente
    codeAnimation.style.display = 'block';
    codeAnimation.style.opacity = '1';
    codeAnimation.style.visibility = 'visible';
    codeAnimation.classList.add('visible');
    
    // Cria um elemento para o código
    const codeElement = document.createElement('div');
    codeElement.className = 'code';
    codeAnimation.appendChild(codeElement);
    
    // Código em português com cores apresentando o sistema ZettaByte
    const codeLines = [
        '<span class="comment">// Apresentação da ZettaByte - Soluções Digitais</span>',
        '<span class="keyword">class</span> <span class="class">ZettaByte</span> {',
        '  <span class="comment">// Sobre a empresa</span>',
        '  <span class="keyword">constructor</span>() {',
        '    <span class="property">this.nome</span> = <span class="string">"ZettaByte"</span>;',
        '    <span class="property">this.publicoAlvo</span> = <span class="string">"Pequenas e médias empresas"</span>;',
        '    <span class="property">this.experiencia</span> = <span class="string">"Especialistas em soluções web e sistemas"</span>;',
        '    <span class="property">this.objetivo</span> = <span class="string">"Transformar ideias em soluções digitais eficientes"</span>;',
        '  }',
        '',
        '  <span class="comment">// O que fazemos</span>',
        '  <span class="function">servicosOferecidos</span>() {',
        '    <span class="keyword">return</span> {',
        '      <span class="property">sites</span>: <span class="string">"Sites modernos para pizzarias, barbearias, padarias e mais"</span>,',
        '      <span class="property">sistemas</span>: <span class="string">"Sistemas sob medida para o seu negócio"</span>,',
        '      <span class="property">vendas</span>: <span class="string">"Sistemas de vendas com controle de pedidos"</span>,',
        '      <span class="property">financeiro</span>: <span class="string">"Gestão financeira e controle de caixa"</span>,',
        '      <span class="property">estoque</span>: <span class="string">"Controle simples e eficiente de estoque"</span>',
        '    };',
        '  }',
        '',
        '  <span class="comment">// Benefícios</span>',
        '  <span class="function">beneficios</span>() {',
        '    <span class="keyword">return</span> [',
        '      <span class="string">"Design moderno e responsivo"</span>,',
        '      <span class="string">"Fácil de usar e adaptado ao seu negócio"</span>,',
        '      <span class="string">"Organização e controle completos"</span>,',
        '      <span class="string">"Mais presença digital e profissionalismo"</span>,',
        '      <span class="string">"Suporte técnico dedicado"</span>',
        '    ];',
        '  }',
        '',
        '  <span class="comment">// Como trabalhamos</span>',
        '  <span class="function">iniciarProjeto</span>(<span class="param">cliente</span>) {',
        '    <span class="keyword">const</span> etapas = [',
        '      <span class="string">"1. Levantamento de necessidades"</span>,',
        '      <span class="string">"2. Planejamento e design"</span>,',
        '      <span class="string">"3. Desenvolvimento"</span>,',
        '      <span class="string">"4. Testes e ajustes"</span>,',
        '      <span class="string">"5. Entrega e publicação"</span>,',
        '      <span class="string">"6. Suporte contínuo"</span>',
        '    ];',
        '    <span class="keyword">return</span> <span class="string">`Bem-vindo, ${cliente}! Vamos transformar sua ideia em realidade. `</span>;',
        '  }',
        '}',
        '',
        '<span class="comment">// Exemplo de uso</span>',
        '<span class="keyword">const</span> empresa = <span class="keyword">new</span> <span class="class">ZettaByte</span>();',
        '<span class="function">console.log</span>(empresa.<span class="function">iniciarProjeto</span>(<span class="string">"Seu Negócio"</span>));',
        '<span class="comment">// Output: Bem-vindo, Seu Negócio! Vamos transformar sua ideia em realidade. </span>'
      ];
      
    
    // Efeito de digitação
    let currentLine = 0;
    let currentChar = 0;
    let currentText = '';
    let isTyping = true;
    
    // Ajusta o tamanho da fonte para dispositivos móveis
    if (window.innerWidth <= 576) {
        codeElement.style.fontSize = '10px';
    } else if (window.innerWidth <= 768) {
        codeElement.style.fontSize = '11px';
    } else {
        codeElement.style.fontSize = '12px';
    }
    
    // Adiciona um efeito de brilho usando setInterval
    const shineInterval = setInterval(() => {
        codeAnimation.classList.toggle('shine');
    }, 1500); // Alterna a cada 1.5 segundos
    
    // Função para digitar o código linha por linha
    function typeCode() {
        if (currentLine < codeLines.length) {
            if (currentChar < codeLines[currentLine].length) {
                // Adiciona um caractere por vez
                currentText += codeLines[currentLine][currentChar];
                codeElement.innerHTML = currentText + '<span class="cursor">|</span>';
                currentChar++;
                setTimeout(typeCode, 10); // Velocidade de digitação
            } else {
                // Avança para a próxima linha
                currentText += '<br>';
                currentLine++;
                currentChar = 0;
                setTimeout(typeCode, 100); // Pausa entre linhas
            }
        } else {
            // Animação de digitação concluída
            codeElement.innerHTML = currentText;
            // Inicia o efeito de cursor piscando
            const cursorInterval = setInterval(() => {
                if (codeElement.innerHTML.includes('<span class="cursor">|</span>')) {
                    codeElement.innerHTML = currentText;
                } else {
                    codeElement.innerHTML = currentText + '<span class="cursor">|</span>';
                }
            }, 500);
            
            // Limpa o intervalo quando a página for fechada
            window.addEventListener('beforeunload', () => {
                clearInterval(cursorInterval);
            });
        }
    }
    
    // Inicia a animação de digitação após um pequeno atraso
    setTimeout(() => {
        typeCode();
    }, 500);
    
    // Garante que o intervalo seja limpo quando a página for fechada
    window.addEventListener('beforeunload', () => {
        clearInterval(shineInterval);
    });
}
    
    // Inicia a animação de código com um pequeno atraso para garantir que o DOM esteja pronto
    setTimeout(function() {
        const codeAnimation = document.querySelector('.code-animation');
        if (codeAnimation) {
            // Força a visibilidade do elemento antes de iniciar a animação
            codeAnimation.style.display = 'block';
            codeAnimation.style.visibility = 'visible';
            codeAnimation.style.opacity = '1';
            
            // Verifica a orientação da tela
            const isPortrait = window.innerHeight > window.innerWidth;
            if (isPortrait) {
                // Em modo retrato, ajusta o posicionamento
                codeAnimation.style.position = 'relative';
                codeAnimation.style.top = 'auto';
                codeAnimation.style.left = 'auto';
                codeAnimation.style.transform = 'none';
            }
            
            // Inicia a animação
            animateCode();
            console.log('Animação de código inicializada');
        } else {
            console.error('Elemento .code-animation não encontrado');
        }
    }, 800);

    // Garante que a animação seja visível em dispositivos móveis
    window.addEventListener('resize', function() {
        const codeElement = document.querySelector('.code-animation .code');
        const codeAnimation = document.querySelector('.code-animation');
        
        if (codeElement) {
            if (window.innerWidth <= 576) {
                codeElement.style.fontSize = '8px';
            } else if (window.innerWidth <= 768) {
                codeElement.style.fontSize = '10px';
            } else {
                codeElement.style.fontSize = '14px';
            }
        }
        
        // Ajusta o posicionamento baseado na orientação da tela
        if (codeAnimation) {
            const isPortrait = window.innerHeight > window.innerWidth;
            if (isPortrait) {
                // Em modo retrato, ajusta o posicionamento
                codeAnimation.style.position = 'relative';
                codeAnimation.style.top = 'auto';
                codeAnimation.style.left = 'auto';
                codeAnimation.style.transform = 'none';
            } else {
                // Em modo paisagem, restaura o posicionamento original
                codeAnimation.style.position = 'absolute';
                codeAnimation.style.top = '50%';
                codeAnimation.style.left = '50%';
                codeAnimation.style.transform = 'translate(-50%, -50%)';
            }
        }
    });
    
    // Função para ajustar a animação de código com base na orientação
    function adjustCodeAnimationForOrientation() {
        const codeAnimation = document.querySelector('.code-animation');
        if (codeAnimation) {
            const isPortrait = window.innerHeight > window.innerWidth;
            if (isPortrait) {
                // Em modo retrato, ajusta o posicionamento
                codeAnimation.style.position = 'relative';
                codeAnimation.style.top = 'auto';
                codeAnimation.style.left = 'auto';
                codeAnimation.style.transform = 'none';
            } else {
                // Em modo paisagem, restaura o posicionamento original
                codeAnimation.style.position = 'absolute';
                codeAnimation.style.top = '50%';
                codeAnimation.style.left = '50%';
                codeAnimation.style.transform = 'translate(-50%, -50%)';
            }
        }
    }
    
    // Adiciona um evento específico para mudança de orientação
    window.addEventListener('orientationchange', function() {
        setTimeout(adjustCodeAnimationForOrientation, 300); // Pequeno atraso para garantir que as dimensões da tela foram atualizadas
    });

    // Adiciona estilos CSS para as animações
    const style = document.createElement('style');
    style.textContent = `
        .animate-fade-in {
            animation: fadeIn 0.8s ease forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .alert {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }
        
        .alert.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .alert.success {
            background-color: #28a745;
        }
        
        .alert.error {
            background-color: #dc3545;
        }
        
        .code {
            font-family: monospace;
            font-size: 12px;
            color: #00b4d8;
            background-color: rgba(3, 4, 94, 0.8);
            padding: 20px;
            border-radius: 5px;
            height: 100%;
            overflow: hidden;
            margin: 0;
            white-space: pre-wrap;
        }
    `;
    document.head.appendChild(style);
});