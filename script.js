document.addEventListener('DOMContentLoaded', function () {
    // Elementos do menu de acessibilidade
    const botaoDeAcessibilidade = document.getElementById('botao-acessibilidade');
    const opcoesDeAcessibilidade = document.getElementById('opcoes-acessibilidade');
    const aumentaFonteBotao = document.getElementById('aumentar-fonte');
    const diminuiFonteBotao = document.getElementById('diminuir-fonte');
    const altoContrasteBotao = document.getElementById('alto-contraste');

    // Variáveis de controle
    let tamanhoAtualFonte = 1;
    let altoContrasteAtivo = false;

    // Toggle do menu de acessibilidade
    botaoDeAcessibilidade.addEventListener('click', function () {
        const isExpanded = botaoDeAcessibilidade.getAttribute('aria-expanded') === 'true';
        
        botaoDeAcessibilidade.classList.toggle('rotacao-botao');
        opcoesDeAcessibilidade.classList.toggle('apresenta-lista');
        
        // Atualizar aria-expanded para acessibilidade
        botaoDeAcessibilidade.setAttribute('aria-expanded', !isExpanded);
        
        // Focar no primeiro botão quando o menu abrir
        if (!isExpanded) {
            setTimeout(() => {
                aumentaFonteBotao.focus();
            }, 100);
        }
    });

    // Função para aumentar fonte
    aumentaFonteBotao.addEventListener('click', function () {
        if (tamanhoAtualFonte < 1.5) { // Limite máximo
            tamanhoAtualFonte += 0.1;
            document.body.style.fontSize = `${tamanhoAtualFonte}rem`;
            
            // Feedback para leitores de tela
            anunciarMudanca(`Fonte aumentada para ${Math.round(tamanhoAtualFonte * 100)}%`);
        }
    });

    // Função para diminuir fonte
    diminuiFonteBotao.addEventListener('click', function () {
        if (tamanhoAtualFonte > 0.8) { // Limite mínimo
            tamanhoAtualFonte -= 0.1;
            document.body.style.fontSize = `${tamanhoAtualFonte}rem`;
            
            // Feedback para leitores de tela
            anunciarMudanca(`Fonte diminuída para ${Math.round(tamanhoAtualFonte * 100)}%`);
        }
    });

    // Função para alto contraste
    altoContrasteBotao.addEventListener('click', function () {
        altoContrasteAtivo = !altoContrasteAtivo;
        document.body.classList.toggle('alto-contraste', altoContrasteAtivo);
        
        // Atualizar texto do botão e feedback
        if (altoContrasteAtivo) {
            altoContrasteBotao.textContent = 'Normal';
            altoContrasteBotao.setAttribute('aria-label', 'Desativar alto contraste');
            anunciarMudanca('Alto contraste ativado');
        } else {
            altoContrasteBotao.textContent = 'Contraste';
            altoContrasteBotao.setAttribute('aria-label', 'Ativar alto contraste');
            anunciarMudanca('Alto contraste desativado');
        }
    });

    // Função para anunciar mudanças para leitores de tela
    function anunciarMudanca(mensagem) {
        const anuncio = document.createElement('div');
        anuncio.setAttribute('aria-live', 'polite');
        anuncio.setAttribute('aria-atomic', 'true');
        anuncio.className = 'sr-only';
        anuncio.textContent = mensagem;
        document.body.appendChild(anuncio);
        
        // Remove o elemento após um tempo
        setTimeout(() => {
            document.body.removeChild(anuncio);
        }, 1000);
    }

    // Navegação por teclado no menu de acessibilidade
    opcoesDeAcessibilidade.addEventListener('keydown', function (e) {
        const botoes = opcoesDeAcessibilidade.querySelectorAll('button');
        const botaoAtual = document.activeElement;
        const indiceAtual = Array.from(botoes).indexOf(botaoAtual);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const proximoIndice = (indiceAtual + 1) % botoes.length;
                botoes[proximoIndice].focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const indiceAnterior = (indiceAtual - 1 + botoes.length) % botoes.length;
                botoes[indiceAnterior].focus();
                break;
            case 'Escape':
                e.preventDefault();
                botaoDeAcessibilidade.click();
                botaoDeAcessibilidade.focus();
                break;
        }
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function (e) {
        if (!e.target.closest('#acessibilidade')) {
            if (!opcoesDeAcessibilidade.classList.contains('apresenta-lista')) {
                return;
            }
            botaoDeAcessibilidade.classList.add('rotacao-botao');
            opcoesDeAcessibilidade.classList.add('apresenta-lista');
            botaoDeAcessibilidade.setAttribute('aria-expanded', 'false');
        }
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Focar no elemento de destino para acessibilidade
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });

    // Validação do formulário com feedback acessível
    const formulario = document.querySelector('form');
    if (formulario) {
        formulario.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome');
            const email = document.getElementById('email');
            const mensagem = document.getElementById('mensagem');
            
            let valido = true;
            
            // Limpar mensagens de erro anteriores
            document.querySelectorAll('.erro-validacao').forEach(erro => erro.remove());
            
            // Validar nome
            if (!nome.value.trim()) {
                mostrarErro(nome, 'Nome é obrigatório');
                valido = false;
            }
            
            // Validar email
            if (!email.value.trim()) {
                mostrarErro(email, 'Email é obrigatório');
                valido = false;
            } else if (!isEmailValido(email.value)) {
                mostrarErro(email, 'Email inválido');
                valido = false;
            }
            
            // Validar mensagem
            if (!mensagem.value.trim()) {
                mostrarErro(mensagem, 'Mensagem é obrigatória');
                valido = false;
            }
            
            if (valido) {
                // Simular envio
                const botaoEnviar = formulario.querySelector('button[type="submit"]');
                const textoOriginal = botaoEnviar.textContent;
                
                botaoEnviar.textContent = 'Enviando...';
                botaoEnviar.disabled = true;
                
                setTimeout(() => {
                    botaoEnviar.textContent = 'Enviado!';
                    anunciarMudanca('Mensagem enviada com sucesso!');
                    
                    setTimeout(() => {
                        botaoEnviar.textContent = textoOriginal;
                        botaoEnviar.disabled = false;
                        formulario.reset();
                    }, 2000);
                }, 1000);
            }
        });
    }

    // Função para mostrar erros de validação
    function mostrarErro(campo, mensagem) {
        const erro = document.createElement('div');
        erro.className = 'erro-validacao text-danger mt-1';
        erro.textContent = mensagem;
        erro.setAttribute('role', 'alert');
        campo.parentNode.appendChild(erro);
        
        // Adicionar classe de erro ao campo
        campo.classList.add('is-invalid');
        
        // Focar no primeiro campo com erro
        if (!document.querySelector('.is-invalid:focus')) {
            campo.focus();
        }
        
        // Remover erro quando o usuário começar a digitar
        campo.addEventListener('input', function () {
            campo.classList.remove('is-invalid');
            const erroExistente = campo.parentNode.querySelector('.erro-validacao');
            if (erroExistente) {
                erroExistente.remove();
            }
        }, { once: true });
    }

    // Função para validar email
    function isEmailValido(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Adicionar skip link para navegação por teclado
    const skipLink = document.createElement('a');
    skipLink.href = '#inicio';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Pular para o conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Detectar navegação por teclado para melhorar a visibilidade do foco
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            document.body.classList.add('navegacao-teclado');
        }
    });

    document.addEventListener('mousedown', function () {
        document.body.classList.remove('navegacao-teclado');
    });

    // Adicionar estilos para navegação por teclado
    const estiloNavegacao = document.createElement('style');
    estiloNavegacao.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        .navegacao-teclado *:focus {
            outline: 3px solid #3B82F6 !important;
            outline-offset: 2px !important;
        }
        
        .is-invalid {
            border-color: #dc3545 !important;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
        }
    `;
    document.head.appendChild(estiloNavegacao);

    console.log('Site de aviação carregado com recursos de acessibilidade!');
});

