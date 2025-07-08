// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏛️ Gabinete Digital - Emicleiton');
    console.log('💙 Sistema desenvolvido com foco em acessibilidade e performance');
    console.log('📱 Totalmente responsivo e otimizado para todos os dispositivos');
    
    loadSiteConfig();
    initializeApp();
});

// Carregar configurações personalizadas do site
function loadSiteConfig() {
    try {
        const savedConfig = localStorage.getItem('siteConfig');
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            console.log('⚙️ Aplicando configurações personalizadas');
            applySiteConfig(config);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar configurações:', error);
    }
}

// Aplicar configurações ao site
function applySiteConfig(config) {
    try {
        // Header
        if (config.header) {
            updateElement('.brand-text', config.header.siteTitle);
            updateElement('.vereador-nome', config.header.vereadorName);
        }

        // Hero Section
        if (config.hero) {
            updateElement('.hero h1', config.hero.title);
            updateElement('.hero .subtitle', config.hero.subtitle);
            updateElement('.hero p', config.hero.description);
        }

        // About Section
        if (config.about) {
            updateElement('#sobre h2', config.about.title);
            updateElement('.biography p', config.about.biography);
        }

        // Contact
        if (config.contact) {
            updateElement('.contact-email', config.contact.email);
            updateElement('.contact-phone', config.contact.phone);
            updateElement('.contact-address', config.contact.address);
        }

        console.log('✅ Configurações aplicadas com sucesso');
    } catch (error) {
        console.error('❌ Erro ao aplicar configurações:', error);
    }
}

// Função auxiliar para atualizar elementos
function updateElement(selector, value) {
    if (value) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    }
}

// Função para testar o salvamento de interações
function testarSalvamentoInteracao() {
    const interacaoTeste = {
        tipo: 'SUGESTAO',
        titulo: 'Teste de Sugestão',
        descricao: 'Esta é uma sugestão de teste',
        protocolo: 'SGT2025' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
        data: new Date().toISOString(),
        nome: 'Teste Nome',
        bairro: 'Teste Bairro',
        status: 'nova'
    };
    
    const interacoes = JSON.parse(localStorage.getItem('interacoesRecebidas') || '[]');
    interacoes.push(interacaoTeste);
    localStorage.setItem('interacoesRecebidas', JSON.stringify(interacoes));
    
    console.log('🧪 Teste - Interação salva:', interacaoTeste);
    console.log('🧪 Teste - Total no localStorage:', interacoes.length);
    
    return interacaoTeste;
}

// Initialize Application
function initializeApp() {
    try {
        setupNavigation();
        setupMobileMenu();
        setupModernMobileMenu(); // Nova função do menu lateral
        setupCalendar();
        setupAnimations();
        
        // Show default section (mandato) instead of contact
        showSection('mandato');
        
        console.log('🏛️ Gabinete Digital - Emicleiton');
        console.log('💙 Sistema desenvolvido com foco em acessibilidade e performance');
        console.log('📱 Totalmente responsivo e otimizado para todos os dispositivos');
    } catch (error) {
        console.error('Erro na inicialização:', error);
    }
}

// Navigation Setup
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            showSection(sectionId);
            
            // Close mobile menu automatically when selecting an option
            const navigation = document.getElementById('navigation');
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    const icon = mobileToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
}

// Mobile Menu Setup
function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navigation = document.getElementById('navigation');
    const navMenu = document.getElementById('navMenu');
    
    console.log('Setup Mobile Menu:', {
        mobileToggle: !!mobileToggle,
        navigation: !!navigation,
        navMenu: !!navMenu
    });
    
    if (!mobileToggle || !navMenu) {
        console.error('Elementos não encontrados para menu mobile');
        return;
    }
    
    mobileToggle.addEventListener('click', function() {
        console.log('Botão mobile clicado!');
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Toggle menu visibility
        navMenu.classList.toggle('active');
        console.log('Menu active?', navMenu.classList.contains('active'));
        
        // Update aria-expanded attribute
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Change icon
        const icon = this.querySelector('i');
        if (icon) {
            if (!isExpanded) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navigation.contains(event.target) && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu on window resize if it's open
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    if (mobileToggle && navigation) {
        mobileToggle.addEventListener('click', function() {
            navigation.classList.toggle('open');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (navigation.classList.contains('open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navigation.contains(e.target) && !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const sidebar = document.getElementById('mobileMenuSidebar');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    console.log('Toggle menu clicado!');
    
    if (sidebar && overlay) {
        const isOpen = sidebar.classList.contains('active');
        console.log('Menu está aberto?', isOpen);
        
        if (isOpen) {
            // Fechar menu
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Menu fechado');
        } else {
            // Abrir menu
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Menu aberto');
        }
    } else {
        console.log('Elementos do menu não encontrados:', {sidebar, overlay});
    }
}

// Close Mobile Menu
function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    
    if (navMenu && mobileToggle) {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}

// Show Section Function
function showSection(sectionId) {
    console.log('🔄 Mostrando seção:', sectionId);
    
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        console.log('✅ Seção encontrada:', sectionId);
        targetSection.classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update URL hash
        history.pushState(null, null, `#${sectionId}`);
        
        // Initialize section-specific features
        if (sectionId === 'agenda') {
            
    const agendaSection = document.getElementById('agenda');
    if (agendaSection && agendaSection.classList.contains('active')) {
        updateCalendar();
    }
    
        } else if (sectionId === 'cursos') {
            console.log('📚 Inicializando seção de cursos');
            initializeCursos();
        }
    } else {
        console.error('❌ Seção não encontrada:', sectionId);
    }
}

// Calendar Setup and Management
let currentDate = new Date();
const eventDates = {
    '2025-07-02': 'Sessão Ordinária da Câmara',
    '2025-07-05': 'Audiência Pública - Saúde',
    '2025-07-08': 'Reunião com Comerciantes',
    '2025-07-15': 'Visita às Obras da UBS',
    '2025-07-22': 'Reunião de Comissão',
    '2025-07-29': 'Prestação de Contas'
};

function setupCalendar() {
    try {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function() {
                currentDate.setMonth(currentDate.getMonth() - 1);
                updateCalendar();
            });
            
            nextBtn.addEventListener('click', function() {
                currentDate.setMonth(currentDate.getMonth() + 1);
                updateCalendar();
            });
        }
        
        updateCalendar();
    } catch (error) {
        console.log('Calendário não disponível nesta página');
    }
}

function updateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!calendarGrid || !currentMonthElement) return;
    
    // Update month display
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Clear calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    dayHeaders.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day header';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Add empty cells for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Check if this date has an event
        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (eventDates[dateString]) {
            dayElement.classList.add('has-event');
            dayElement.title = eventDates[dateString];
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

// Setup Animations and Interactions
function setupAnimations() {
    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target && entry.target.style) {
                entry.target.style.animationDelay = '0.1s';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all cards
    const cards = document.querySelectorAll('.contact-card, .news-card, .project-card, .photo-item, .video-item, .intro-card, .form-container');
    cards.forEach(card => observer.observe(card));
    
    // Add hover effects to buttons
    addButtonEffects();
}

// Add Button Effects
function addButtonEffects() {
    const buttons = document.querySelectorAll('.whatsapp-button, .contact-button, .nav-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (this.style) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (this.style) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// Utility Functions
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    return date.toLocaleDateString('pt-BR', options);
}

function formatTime(date) {
    return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Handle URL hash navigation
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
        
        // Update active nav button
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === hash) {
                btn.classList.add('active');
            }
        });
    }
});

// Handle initial URL hash
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
        
        // Update active nav button
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === hash) {
                btn.classList.add('active');
            }
        });
    }
});

// Performance optimizations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Add any scroll-based functionality here if needed
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// Add CSS animation classes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    .calendar-day.has-event {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;

document.head.appendChild(style);

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Arrow key navigation for calendar
    if (e.key === 'ArrowLeft' && e.target.classList.contains('calendar-nav')) {
        e.preventDefault();
        document.getElementById('prevMonth').click();
    }
    
    if (e.key === 'ArrowRight' && e.target.classList.contains('calendar-nav')) {
        e.preventDefault();
        document.getElementById('nextMonth').click();
    }
});

// Focus management for accessibility
function manageFocus() {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextButton = navButtons[index + 1] || navButtons[0];
                nextButton.focus();
            }
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevButton = navButtons[index - 1] || navButtons[navButtons.length - 1];
                prevButton.focus();
            }
        });
    });
}

// Initialize focus management
manageFocus();

// Handle support link in participate section
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('support-link')) {
        e.preventDefault();
        showSection('contact');
        
        // Update active nav button
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === 'contact') {
                btn.classList.add('active');
            }
        });
    }
});

// AI Assistant Functions
function toggleAIAssistant() {
    console.log('🚀 Abrindo assistente digital...');
    
    const modal = document.getElementById('aiAssistantModal');
    if (!modal) {
        console.error('❌ Modal não encontrado!');
        return;
    }
    
    modal.classList.toggle('active');
    console.log('📱 Modal classe active:', modal.classList.contains('active'));
    
    // Forçar visibilidade do modal
    if (modal.classList.contains('active')) {
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        console.log('🔧 Forçada visibilidade do modal');
    } else {
        modal.style.display = 'none';
    }
    
    if (modal.classList.contains('active')) {
        console.log('✅ Modal está ativo, carregando conteúdo...');
        
        // Limpar mensagens anteriores e adicionar botões
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            console.log('📝 Limpando chat e adicionando botões...');
            chatMessages.innerHTML = '';
            
            // Força o carregamento dos botões com delay
            setTimeout(() => {
                addQuickActionButtons();
            }, 100);
        } else {
            console.error('❌ chatMessages não encontrado!');
        }
        
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.focus();
        }
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addUserMessage(message);
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            generateBotResponse(message);
        }, 1000);
    }
}

function sendQuickMessage(message) {
    addUserMessage(message);
    setTimeout(() => {
        generateBotResponse(message);
    }, 1000);
}

function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(userMessage) {
    const responses = {
        'como entrar em contato?': 'Você pode entrar em contato através do WhatsApp (74) 99999-9999, e-mail gabinete.emicleiton@montesanto.ba.gov.br ou presencialmente na Câmara Municipal no horário de 8h às 17h.',
        'próximos eventos': 'Os próximos eventos são: Sessão Ordinária da Câmara (02/07), Audiência Pública sobre Saúde (05/07) e Reunião com Comerciantes (08/07).',
        'projetos em andamento': 'Temos 3 projetos principais: Centro de Referência em Saúde Mental (em tramitação), Complexo Esportivo Municipal (aprovado) e Programa Futuro Digital (em estudo).',
        'horário de atendimento': 'O gabinete funciona de segunda a sexta-feira, das 8h às 17h. Estamos localizados na Câmara Municipal de Monte Santo.',
        'agenda': 'Para consultar a agenda completa, clique na seção "Agenda Pública" no menu principal.',
        'contato': 'Você pode me encontrar pelo WhatsApp, e-mail ou presencialmente no gabinete. Também pode preencher o formulário na seção "Participe".'
    };
    
    const lowerMessage = userMessage.toLowerCase();
    let response = null;
    
    // Buscar resposta baseada nas palavras-chave
    for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key) || key.includes(lowerMessage)) {
            response = value;
            break;
        }
    }
    
    // Respostas para palavras-chave específicas
    if (!response) {
        if (lowerMessage.includes('whatsapp') || lowerMessage.includes('telefone')) {
            response = responses['como entrar em contato?'];
        } else if (lowerMessage.includes('evento') || lowerMessage.includes('agenda')) {
            response = responses['próximos eventos'];
        } else if (lowerMessage.includes('projeto') || lowerMessage.includes('obra')) {
            response = responses['projetos em andamento'];
        } else if (lowerMessage.includes('horário') || lowerMessage.includes('atendimento')) {
            response = responses['horário de atendimento'];
        } else {
            response = 'Obrigado pela sua mensagem! Para informações mais detalhadas, recomendo entrar em contato diretamente pelo WhatsApp ou visitar as seções específicas do site. Como posso ajudá-lo mais?';
        }
    }
    
    addBotMessage(response);
}

// Chat input enter key support
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// Calendar functionality for agenda
let calendarCurrentDate = new Date();
let calendarEvents = [
    { date: '2025-07-02', title: 'Sessão Ordinária da Câmara', time: '10:00' },
    { date: '2025-07-05', title: 'Audiência Pública - Saúde', time: '19:00' },
    { date: '2025-07-08', title: 'Reunião com Comerciantes', time: '14:00' },
    { date: '2025-07-15', title: 'Visita às Comunidades Rurais', time: '08:00' },
    { date: '2025-07-22', title: 'Sessão Extraordinária', time: '14:00' }
];

function setupCalendar() {
    updateCalendar();
    
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
        updateCalendar();
    });
    
    document.getElementById('nextMonth')?.addEventListener('click', () => {
        calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
        updateCalendar();
    });
}

function updateCalendar() {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const currentMonthElement = document.getElementById('currentMonth');
    if (currentMonthElement) {
        currentMonthElement.textContent = `${monthNames[calendarCurrentDate.getMonth()]} ${calendarCurrentDate.getFullYear()}`;
    }
    
    const calendarDays = document.getElementById('calendarDays');
    if (!calendarDays) return;
    
    calendarDays.innerHTML = '';
    
    const firstDay = new Date(calendarCurrentDate.getFullYear(), calendarCurrentDate.getMonth(), 1);
    const lastDay = new Date(calendarCurrentDate.getFullYear(), calendarCurrentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day.getDate();
        
        if (day.getMonth() !== calendarCurrentDate.getMonth()) {
            dayElement.classList.add('other-month');
        }
        
        if (day.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Check for events
        const dateString = day.toISOString().split('T')[0];
        if (calendarEvents.some(event => event.date === dateString)) {
            dayElement.classList.add('has-event');
        }
        
        calendarDays.appendChild(dayElement);
    }
}

// Project filter functionality
function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            projectCards.forEach(card => {
                if (card && card.style) {
                    if (filter === 'all' || card.dataset.status === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.3s ease-in-out';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Gallery tab functionality
function setupGalleryTabs() {
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const photosGallery = document.getElementById('photosGallery');
    const videosGallery = document.getElementById('videosGallery');
    
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            galleryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            const tabType = tab.dataset.tab;
            
            if (tabType === 'photos') {
                photosGallery?.classList.add('active');
                videosGallery?.classList.remove('active');
            } else if (tabType === 'videos') {
                videosGallery?.classList.add('active');
                photosGallery?.classList.remove('active');
            }
        });
    });
}

// Contact form functionality
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Simulate form submission
            console.log('Mensagem enviada:', data);
            
            // Show success message
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            
            // Reset form
            contactForm.reset();
            
            // In a real application, you would send this data to a server
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
        });
    }
}

// Update footer year
function updateFooterYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Enhanced initialization
function initializeApp() {
    setupNavigation();
    setupMobileMenu();
    setupAnimations();
    addButtonEffects();
    manageFocus();
    setupCalendar();
    setupProjectFilters();
    setupGalleryTabs();
    setupContactForm();
    updateFooterYear();
    
    // Assistente digital removido - novo sistema implementado
    
    // Smooth scrolling for hero buttons
    const heroButtons = document.querySelectorAll('.hero-button');
    heroButtons.forEach(button => {
        if (button.getAttribute('onclick')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = button.getAttribute('onclick').match(/showSection\('(.+)'\)/)?.[1];
                if (sectionId) {
                    showSection(sectionId);
                }
            });
        }
    });
}

// ====== NOVO ASSISTENTE DIGITAL SIMPLES ======

// Abrir assistente
function abrirAssistente() {
    const modal = document.getElementById('assistenteModal');
    if (modal) {
        modal.classList.add('active');
        console.log('🚀 Assistente digital aberto com sucesso!');
    }
}

// Fechar assistente
function fecharAssistente() {
    const modal = document.getElementById('assistenteModal');
    if (modal) {
        modal.classList.remove('active');
        console.log('❌ Assistente digital fechado');
    }
}

// Formulário de Sugestão
function abrirFormSugestao() {
    console.log('🚀 FUNÇÃO abrirFormSugestao CHAMADA!');
    fecharAssistente();
    const nome = prompt('Qual é o seu nome?');
    if (!nome) return;
    
    const bairro = prompt('Qual o seu bairro?');
    if (!bairro) return;
    
    const sugestao = prompt('Qual sua sugestão para melhorar nossa cidade?');
    if (!sugestao) return;
    
    const protocolo = generateProtocol();
    
    console.log('📝 Dados da sugestão:', { nome, bairro, sugestao, protocolo });
    
    // CORRIGIDO: Usar o mesmo formato e local que o painel espera
    const interacao = {
        tipo: 'SUGESTAO',
        titulo: `Sugestão de ${nome} - ${bairro}`,
        descricao: sugestao,
        protocolo: protocolo,
        data: new Date().toISOString(),
        nome: nome,
        bairro: bairro,
        status: 'nova'
    };
    
    console.log('💾 Salvando sugestão no localStorage...');
    const interacoes = JSON.parse(localStorage.getItem('interacoesRecebidas') || '[]');
    console.log('📦 Interações existentes:', interacoes.length);
    interacoes.push(interacao);
    localStorage.setItem('interacoesRecebidas', JSON.stringify(interacoes));
    console.log('✅ Sugestão salva! Total agora:', interacoes.length);
    console.log('📋 Protocolo:', protocolo);
    
    alert(`✅ Sugestão enviada com sucesso!\n\nProtocolo: ${protocolo}\n\nObrigado pela sua participação, ${nome}!`);
}

// Formulário de Reclamação
function abrirFormReclamacao() {
    console.log('🚀 FUNÇÃO abrirFormReclamacao CHAMADA!');
    fecharAssistente();
    const nome = prompt('Qual é o seu nome?');
    if (!nome) return;
    
    const bairro = prompt('Qual o seu bairro?');
    if (!bairro) return;
    
    const reclamacao = prompt('Descreva o problema que você gostaria de reportar:');
    if (!reclamacao) return;
    
    const protocolo = generateProtocol();
    
    console.log('📝 Dados da reclamação:', { nome, bairro, reclamacao, protocolo });
    
    // CORRIGIDO: Usar o mesmo formato e local que o painel espera
    const interacao = {
        tipo: 'RECLAMACAO',
        titulo: `Reclamação de ${nome} - ${bairro}`,
        descricao: reclamacao,
        protocolo: protocolo,
        data: new Date().toISOString(),
        nome: nome,
        bairro: bairro,
        status: 'nova'
    };
    
    console.log('💾 Salvando reclamação no localStorage...');
    const interacoes = JSON.parse(localStorage.getItem('interacoesRecebidas') || '[]');
    console.log('📦 Interações existentes:', interacoes.length);
    interacoes.push(interacao);
    localStorage.setItem('interacoesRecebidas', JSON.stringify(interacoes));
    console.log('✅ Reclamação salva! Total agora:', interacoes.length);
    console.log('📋 Protocolo:', protocolo);
    
    alert(`⚠️ Reclamação registrada com sucesso!\n\nProtocolo: ${protocolo}\n\nAcompanharemos seu caso, ${nome}!`);
}

// Formulário de Foto
function abrirFormFoto() {
    fecharAssistente();
    const nome = prompt('Qual é o seu nome?');
    if (!nome) return;
    
    const local = prompt('Em qual local foi tirada a foto?');
    if (!local) return;
    
    const descricao = prompt('Descreva o problema mostrado na foto:');
    if (!descricao) return;
    
    const protocolo = gerarProtocolo();
    
    // Salvar no localStorage
    const sugestoes = JSON.parse(localStorage.getItem('sugestoesCidadaos') || '[]');
    sugestoes.push({
        id: Date.now(),
        tipo: 'Foto Problema',
        nome: nome,
        bairro: local,
        mensagem: `Foto enviada: ${descricao}`,
        protocolo: protocolo,
        data: new Date().toLocaleString('pt-BR'),
        status: 'Pendente'
    });
    localStorage.setItem('sugestoesCidadaos', JSON.stringify(sugestoes));
    
    alert(`📸 Foto registrada com sucesso!\n\nProtocolo: ${protocolo}\n\nAnalisaremos o problema reportado, ${nome}!`);
}

// Formulário de Local
function abrirFormLocal() {
    fecharAssistente();
    const nome = prompt('Qual é o seu nome?');
    if (!nome) return;
    
    const endereco = prompt('Qual o endereço ou ponto de referência do problema?');
    if (!endereco) return;
    
    const problema = prompt('Que tipo de problema existe neste local?');
    if (!problema) return;
    
    const protocolo = gerarProtocolo();
    
    // Salvar no localStorage
    const sugestoes = JSON.parse(localStorage.getItem('sugestoesCidadaos') || '[]');
    sugestoes.push({
        id: Date.now(),
        tipo: 'Local Problema',
        nome: nome,
        bairro: endereco,
        mensagem: `Problema no local: ${problema}`,
        protocolo: protocolo,
        data: new Date().toLocaleString('pt-BR'),
        status: 'Pendente'
    });
    localStorage.setItem('sugestoesCidadaos', JSON.stringify(sugestoes));
    
    alert(`🗺️ Local marcado com sucesso!\n\nProtocolo: ${protocolo}\n\nVerificaremos o local reportado, ${nome}!`);
}

// Gerar protocolo único
function gerarProtocolo() {
    const ano = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `SGT${ano}${numero}`;
}

// Adicionar botões de ação rápida ao assistente
function addQuickActionButtons() {
    console.log('🔧 Tentando adicionar botões de ação rápida...');
    
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) {
        console.error('❌ Elemento chatMessages não encontrado!');
        return;
    }
    
    console.log('✅ Elemento chatMessages encontrado');
    
    // Verificar se já foram adicionados
    if (chatMessages.querySelector('.quick-actions-container')) {
        console.log('⚠️ Botões já existem, removendo...');
        chatMessages.innerHTML = '';
    }
    
    const quickActionsDiv = document.createElement('div');
    quickActionsDiv.className = 'quick-actions-container';
    quickActionsDiv.style.cssText = `
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
        border-radius: 16px !important;
        padding: 1.5rem !important;
        margin: 1rem 0 !important;
        border: 2px solid #cbd5e1 !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        z-index: 9999 !important;
        position: relative !important;
        width: 100% !important;
        min-height: 200px !important;
    `;
    
    quickActionsDiv.innerHTML = `
        <div class="welcome-message" style="text-align: center; margin-bottom: 1.5rem;">
            <h4 style="color: #1e40af; margin: 0 0 0.5rem 0; font-size: 1.1rem; font-weight: 600;">👋 Olá! Como posso ajudar você hoje?</h4>
            <p style="color: #64748b; margin: 0; font-size: 0.9rem;">Escolha uma das opções abaixo ou digite sua mensagem:</p>
        </div>
        <div class="quick-actions-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
            <button class="quick-action-btn" onclick="alert('Botão Sugestão funcionando!')" title="Enviar uma sugestão" 
                style="background: #ffffff; border: 2px solid #10b981; border-radius: 12px; padding: 1rem 0.75rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 500; color: #374151;">
                <i class="fas fa-lightbulb" style="font-size: 1.2rem; color: #10b981;"></i>
                <span style="font-size: 0.8rem;">📤 Enviar Sugestão</span>
            </button>
            <button class="quick-action-btn" onclick="alert('Botão Problema funcionando!')" title="Reportar um problema"
                style="background: #ffffff; border: 2px solid #f59e0b; border-radius: 12px; padding: 1rem 0.75rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 500; color: #374151;">
                <i class="fas fa-exclamation-triangle" style="font-size: 1.2rem; color: #f59e0b;"></i>
                <span style="font-size: 0.8rem;">⚠️ Reportar Problema</span>
            </button>
            <button class="quick-action-btn" onclick="openPhotoReportForm()" title="Enviar foto de problema"
                style="background: #ffffff; border: 2px solid #8b5cf6; border-radius: 12px; padding: 1rem 0.75rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 500; color: #374151;">
                <i class="fas fa-camera" style="font-size: 1.2rem; color: #8b5cf6;"></i>
                <span style="font-size: 0.8rem;">📸 Enviar Foto</span>
            </button>
            <button class="quick-action-btn" onclick="openLocationForm()" title="Marcar local com problemas"
                style="background: #ffffff; border: 2px solid #ef4444; border-radius: 12px; padding: 1rem 0.75rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 500; color: #374151;">
                <i class="fas fa-map-marker-alt" style="font-size: 1.2rem; color: #ef4444;"></i>
                <span style="font-size: 0.8rem;">🗺️ Marcar Local</span>
            </button>
            <button class="quick-action-btn" onclick="showSection('agenda')" title="Ver agenda pública"
                style="background: #ffffff; border: 2px solid #06b6d4; border-radius: 12px; padding: 1rem 0.75rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 500; color: #374151;">
                <i class="fas fa-calendar-alt" style="font-size: 1.2rem; color: #06b6d4;"></i>
                <span style="font-size: 0.8rem;">📅 Agenda Pública</span>
            </button>
            <button class="quick-action-btn" onclick="showSection('contato')" title="Falar com a equipe"
                style="background: #ffffff; border: 2px solid #84cc16; border-radius: 12px; padding: 1rem 0.75rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 500; color: #374151;">
                <i class="fas fa-users" style="font-size: 1.2rem; color: #84cc16;"></i>
                <span style="font-size: 0.8rem;">👨‍💻 Falar com Equipe</span>
            </button>
        </div>
    `;
    
    chatMessages.appendChild(quickActionsDiv);
    console.log('✅ Botões adicionados com sucesso!');
    
    // Verificar se foi realmente adicionado
    const addedButtons = chatMessages.querySelectorAll('.quick-action-btn');
    console.log(`🎯 ${addedButtons.length} botões encontrados no DOM`);
    
    // Debug visual: verificar se os elementos estão visíveis
    const container = chatMessages.querySelector('.quick-actions-container');
    if (container) {
        console.log('📦 Container styles:', {
            display: getComputedStyle(container).display,
            visibility: getComputedStyle(container).visibility,
            height: getComputedStyle(container).height,
            opacity: getComputedStyle(container).opacity
        });
        
        // Forçar visibilidade
        container.style.display = 'block';
        container.style.visibility = 'visible';
        container.style.opacity = '1';
        container.style.zIndex = '1000';
        
        console.log('🔧 Forçada visibilidade do container');
        
        // Debug adicional: verificar dimensões do modal e chatMessages
        const modal = document.getElementById('aiAssistantModal');
        const chatMessagesElement = document.getElementById('chatMessages');
        
        console.log('🔍 Debug modal:', {
            modalDisplay: modal ? getComputedStyle(modal).display : 'não encontrado',
            modalHeight: modal ? getComputedStyle(modal).height : 'não encontrado',
            modalWidth: modal ? getComputedStyle(modal).width : 'não encontrado',
            chatHeight: chatMessagesElement ? getComputedStyle(chatMessagesElement).height : 'não encontrado',
            chatWidth: chatMessagesElement ? getComputedStyle(chatMessagesElement).width : 'não encontrado',
            chatOverflow: chatMessagesElement ? getComputedStyle(chatMessagesElement).overflow : 'não encontrado'
        });
        
        // Forçar dimensões do chat
        if (chatMessagesElement) {
            chatMessagesElement.style.cssText += `
                min-height: 400px !important;
                max-height: none !important;
                overflow: visible !important;
                display: flex !important;
                flex-direction: column !important;
            `;
            console.log('📐 Forçadas dimensões do chatMessages');
        }
    }
}

function autoResizeTextarea() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput && chatInput.style !== undefined) {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const nomeUsuario = document.getElementById('nomeUsuario');
    const message = chatInput.value.trim();
    
    if (!message) return;

    const userName = nomeUsuario.value.trim() || 'Visitante';
    
    // Adicionar mensagem do usuário
    addUserMessage(message, userName);
    
    // Limpar input
    chatInput.value = '';
    if (chatInput && chatInput.style) {
        chatInput.style.height = 'auto';
    }
    
    // Desabilitar botão temporariamente
    const sendButton = document.getElementById('sendButton');
    sendButton.disabled = true;
    
    // Mostrar indicador de digitação
    showTypingIndicator();
    
    // Salvar mensagem no banco de dados local
    saveUserMessage(userName, message);
    
    // Processar resposta do bot
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateBotResponse(message);
        addBotMessage(response);
        sendButton.disabled = false;
    }, 1500 + Math.random() * 1000); // Delay realista
}

function addUserMessage(message, userName) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = createMessageElement('user', message, userName);
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

function addBotMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = createMessageElement('bot', message, 'Atendente');
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

function createMessageElement(type, message, senderName) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    
    if (type === 'bot') {
        avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
    } else {
        avatarDiv.textContent = senderName.charAt(0).toUpperCase();
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Processar mensagem para HTML
    const processedMessage = processMessageText(message);
    contentDiv.innerHTML = processedMessage;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    contentDiv.appendChild(timeDiv);
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    return messageDiv;
}

function processMessageText(text) {
    // Converter quebras de linha para <br>
    text = text.replace(/\n/g, '<br>');
    
    // Processar emojis básicos
    text = text.replace(/:\)/g, '😊');
    text = text.replace(/:\(/g, '😢');
    text = text.replace(/<3/g, '❤️');
    
    return `<p>${text}</p>`;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
    
    const dotsDiv = document.createElement('div');
    dotsDiv.className = 'typing-dots';
    dotsDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    typingDiv.appendChild(avatarDiv);
    typingDiv.appendChild(dotsDiv);
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Análise de intenções baseada em palavras-chave
    if (message.includes('falar') && (message.includes('vereador') || message.includes('emicleiton'))) {
        return "Você pode falar diretamente com o vereador Emicleiton via WhatsApp no (74) 99999-9999 ou pelo e-mail institucional. Clique no menu 'Contato' para ver todas as opções de comunicação! 📞";
    }
    
    if (message.includes('sugestão') || message.includes('sugestao') || message.includes('ideia') || message.includes('proposta')) {
        return "Que ótimo que você quer contribuir! 💡 Sua sugestão foi registrada e será encaminhada diretamente para análise do gabinete. Continuaremos trabalhando juntos para melhorar nossa cidade!";
    }
    
    if (message.includes('telefone') || message.includes('contato') || message.includes('gabinete')) {
        return "📞 O telefone do gabinete é (74) 3275-0000\n\n💬 WhatsApp: (74) 99999-9999\n\n📧 E-mail: gabinete.emicleiton@montesanto.ba.gov.br\n\n🏢 Estamos na Câmara Municipal de Monte Santo, de segunda a sexta, das 8h às 17h.";
    }
    
    if (message.includes('reunião') || message.includes('reuniao') || message.includes('agend') || message.includes('encontro')) {
        return "Para agendar uma reunião com o vereador Emicleiton, entre em contato pelo WhatsApp (74) 99999-9999 e fale diretamente com nossa equipe. Teremos prazer em atendê-lo! 🤝";
    }
    
    if (message.includes('horário') || message.includes('horario') || message.includes('funciona') || message.includes('atendimento')) {
        return "🕐 Nosso horário de atendimento é:\n\nSegunda a Sexta: 8h às 17h\n\nEstamos sempre disponíveis pelo WhatsApp para emergências!";
    }
    
    if (message.includes('projeto') || message.includes('lei') || message.includes('proposta')) {
        return "Você pode acompanhar todos os projetos e propostas do vereador Emicleiton na seção 'Projetos' do site. Trabalhamos constantemente em prol do desenvolvimento de Monte Santo! 🏛️";
    }
    
    if (message.includes('obrigad') || message.includes('valeu') || message.includes('parabén')) {
        return "Fico muito feliz em ajudar! 😊 O reconhecimento dos cidadãos é nossa maior motivação. Continue acompanhando nosso trabalho e não hesite em entrar em contato sempre que precisar!";
    }
    
    if (message.includes('reclamação') || message.includes('reclamacao') || message.includes('problema') || message.includes('denuncia')) {
        return "Sua reclamação é muito importante para melhorarmos nossa cidade. 📝 Por favor, entre em contato diretamente com o gabinete pelo telefone (74) 3275-0000 ou WhatsApp para que possamos dar o devido encaminhamento.";
    }
    
    // Resposta padrão
    return "Obrigado pela sua mensagem! 😊 Sua opinião é muito importante para o mandato do vereador Emicleiton. Nossa equipe analisará sua mensagem e, se necessário, entraremos em contato. Continue acompanhando nosso trabalho!";
}

// ====== FORMULÁRIOS INTERATIVOS DO ASSISTENTE ======

// Abrir formulário de sugestão/reclamação
function openSuggestionForm(tipo) {
    const chatMessages = document.getElementById('chatMessages');
    const titulo = tipo === 'sugestao' ? 'Enviar Sugestão' : 'Reportar Problema';
    const icone = tipo === 'sugestao' ? '💡' : '⚠️';
    
    const formDiv = document.createElement('div');
    formDiv.className = 'assistant-form-container';
    formDiv.innerHTML = `
        <div class="assistant-form">
            <div class="form-header">
                <h4>${icone} ${titulo}</h4>
                <button class="close-form-btn" onclick="closeAssistantForm(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="suggestionForm" onsubmit="submitSuggestion(event, '${tipo}')">
                <div class="form-group">
                    <label for="suggestionName">Nome Completo *</label>
                    <input type="text" id="suggestionName" required placeholder="Seu nome completo">
                </div>
                <div class="form-group">
                    <label for="suggestionBairro">Bairro *</label>
                    <input type="text" id="suggestionBairro" required placeholder="Em qual bairro você mora?">
                </div>
                <div class="form-group">
                    <label for="suggestionEmail">E-mail (opcional)</label>
                    <input type="email" id="suggestionEmail" placeholder="seu@email.com">
                </div>
                <div class="form-group">
                    <label for="suggestionPhone">Telefone/WhatsApp (opcional)</label>
                    <input type="tel" id="suggestionPhone" placeholder="(75) 99999-9999">
                </div>
                <div class="form-group">
                    <label for="suggestionMessage">${tipo === 'sugestao' ? 'Sua Sugestão' : 'Descreva o Problema'} *</label>
                    <textarea id="suggestionMessage" required rows="4" 
                        placeholder="${tipo === 'sugestao' ? 'Conte sua ideia para melhorar nossa cidade...' : 'Descreva detalhadamente o problema encontrado...'}"></textarea>
                </div>
                <div class="form-group">
                    <label for="suggestionLocation">Endereço/Local (opcional)</label>
                    <input type="text" id="suggestionLocation" placeholder="Rua, número, referência...">
                    <button type="button" class="location-btn" onclick="getCurrentLocation('suggestionLocation')">
                        <i class="fas fa-map-marker-alt"></i> Usar minha localização
                    </button>
                </div>
                <div class="form-actions">
                    <button type="submit" class="submit-btn">
                        <i class="fas fa-paper-plane"></i> Enviar ${tipo === 'sugestao' ? 'Sugestão' : 'Reclamação'}
                    </button>
                </div>
            </form>
        </div>
    `;
    
    chatMessages.appendChild(formDiv);
    scrollToBottom();
}

// Abrir formulário de envio de foto
function openPhotoReportForm() {
    // Formulário direto no assistente digital
    
    const chatMessages = document.getElementById('chatMessages');
    
    const formDiv = document.createElement('div');
    formDiv.className = 'assistant-form-container';
    formDiv.innerHTML = `
        <div class="assistant-form">
            <div class="form-header">
                <h4>📸 Enviar Foto de Problema</h4>
                <button class="close-form-btn" onclick="closeAssistantForm(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="photoReportForm" onsubmit="submitPhotoReport(event)">
                <div class="form-group">
                    <label for="photoName">Nome Completo *</label>
                    <input type="text" id="photoName" required placeholder="Seu nome completo">
                </div>
                <div class="form-group">
                    <label for="photoBairro">Bairro *</label>
                    <input type="text" id="photoBairro" required placeholder="Bairro onde está o problema">
                </div>
                <div class="form-group">
                    <label for="photoUpload">Foto do Problema *</label>
                    <div class="file-upload-container">
                        <input type="file" id="photoUpload" accept="image/*" required onchange="previewPhoto(this)" style="display: none;">
                        <button type="button" class="file-upload-button" onclick="document.getElementById('photoUpload').click()">
                            <i class="fas fa-camera"></i>
                            <span>Clique para selecionar uma foto</span>
                        </button>
                        <div id="photoPreview" class="photo-preview"></div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="photoDescription">Descrição do Problema *</label>
                    <textarea id="photoDescription" required rows="3" 
                        placeholder="Explique o que está acontecendo no local (ex: buraco na rua, mato alto, lixo acumulado...)"></textarea>
                </div>
                <div class="form-group">
                    <label for="photoLocation">Local Exato</label>
                    <input type="text" id="photoLocation" placeholder="Rua, número, referência...">
                    <button type="button" class="location-btn" onclick="getCurrentLocation('photoLocation')">
                        <i class="fas fa-map-marker-alt"></i> Usar minha localização
                    </button>
                </div>
                <div class="form-actions">
                    <button type="submit" class="submit-btn">
                        <i class="fas fa-upload"></i> Enviar Relatório com Foto
                    </button>
                </div>
            </form>
        </div>
    `;
    
    chatMessages.appendChild(formDiv);
    scrollToBottom();
}

// Abrir formulário de localização
function openLocationForm() {
    const chatMessages = document.getElementById('chatMessages');
    
    const formDiv = document.createElement('div');
    formDiv.className = 'assistant-form-container';
    formDiv.innerHTML = `
        <div class="assistant-form">
            <div class="form-header">
                <h4>🗺️ Marcar Local com Problemas</h4>
                <button class="close-form-btn" onclick="closeAssistantForm(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="locationForm" onsubmit="submitLocationReport(event)">
                <div class="form-group">
                    <label for="locationName">Nome Completo *</label>
                    <input type="text" id="locationName" required placeholder="Seu nome completo">
                </div>
                <div class="form-group">
                    <label for="locationBairro">Bairro *</label>
                    <input type="text" id="locationBairro" required placeholder="Bairro do problema">
                </div>
                <div class="form-group">
                    <label for="locationAddress">Endereço Completo *</label>
                    <input type="text" id="locationAddress" required placeholder="Rua, número, referência...">
                    <button type="button" class="location-btn" onclick="getCurrentLocation('locationAddress')">
                        <i class="fas fa-crosshairs"></i> Detectar localização
                    </button>
                </div>
                <div class="form-group">
                    <label for="locationProblem">Tipo de Problema *</label>
                    <select id="locationProblem" required>
                        <option value="">Selecione o tipo de problema</option>
                        <option value="buraco_rua">Buraco na rua</option>
                        <option value="iluminacao">Problema de iluminação</option>
                        <option value="saneamento">Saneamento/esgoto</option>
                        <option value="lixo">Acúmulo de lixo</option>
                        <option value="mato">Mato alto/limpeza</option>
                        <option value="calcamento">Calçamento danificado</option>
                        <option value="sinalizacao">Falta de sinalização</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="locationDetails">Detalhes do Problema *</label>
                    <textarea id="locationDetails" required rows="3" 
                        placeholder="Descreva detalhadamente o problema e sua urgência..."></textarea>
                </div>
                <div id="locationCoords" class="coordinates-display" style="display: none;">
                    <strong>📍 Coordenadas:</strong> <span id="coordsText"></span>
                </div>
                <div class="form-actions">
                    <button type="submit" class="submit-btn">
                        <i class="fas fa-map-marker-alt"></i> Marcar Local
                    </button>
                </div>
            </form>
        </div>
    `;
    
    chatMessages.appendChild(formDiv);
    scrollToBottom();
}

async function saveUserMessage(nome, mensagem) {
    try {
        // Determinar tipo da mensagem baseado em palavras-chave
        const tipo = determineMessageType(mensagem);
        
        // Criar nova interação
        const novaInteracao = {
            tipo: tipo.toUpperCase(),
            titulo: `${tipo} de ${nome}`,
            descricao: mensagem,
            protocolo: `SGT${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
            data: new Date().toISOString(),
            nome: nome,
            status: 'nova'
        };
        
        // Salvar via API (porta 3000)
        const response = await fetch('http://localhost:3003/api/interacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaInteracao)
        });
        
        if (response.ok) {
            console.log('Interação salva via API:', novaInteracao);
            
            // Também salvar no localStorage como backup
            let interacoes = JSON.parse(localStorage.getItem('interacoesRecebidas') || '[]');
            interacoes.push(novaInteracao);
            localStorage.setItem('interacoesRecebidas', JSON.stringify(interacoes));
        } else {
            console.error('Erro ao salvar via API, salvando apenas no localStorage');
            // Fallback para localStorage se API falhar
            let interacoes = JSON.parse(localStorage.getItem('interacoesRecebidas') || '[]');
            interacoes.push(novaInteracao);
            localStorage.setItem('interacoesRecebidas', JSON.stringify(interacoes));
        }
        
    } catch (error) {
        console.error('Erro ao salvar interação:', error);
        // Fallback para localStorage em caso de erro
        try {
            const novaInteracao = {
                tipo: determineMessageType(mensagem).toUpperCase(),
                titulo: `${determineMessageType(mensagem)} de ${nome}`,
                descricao: mensagem,
                protocolo: `SGT${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
                data: new Date().toISOString(),
                nome: nome,
                status: 'nova'
            };
            
            let interacoes = JSON.parse(localStorage.getItem('interacoesRecebidas') || '[]');
            interacoes.push(novaInteracao);
            localStorage.setItem('interacoesRecebidas', JSON.stringify(interacoes));
        } catch (fallbackError) {
            console.error('Erro no fallback localStorage:', fallbackError);
        }
    }
}

function determineMessageType(mensagem) {
    const texto = mensagem.toLowerCase();
    
    if (texto.includes('sugestão') || texto.includes('sugestao') || texto.includes('ideia') || texto.includes('proposta') || texto.includes('melhorar')) {
        return 'sugestão';
    }
    
    if (texto.includes('dúvida') || texto.includes('duvida') || texto.includes('pergunta') || texto.includes('como') || texto.includes('quando') || texto.includes('onde')) {
        return 'dúvida';
    }
    
    if (texto.includes('reclamação') || texto.includes('reclamacao') || texto.includes('problema') || texto.includes('denuncia')) {
        return 'reclamação';
    }
    
    if (texto.includes('elogio') || texto.includes('parabén') || texto.includes('obrigad') || texto.includes('excelente') || texto.includes('ótimo')) {
        return 'elogio';
    }
    
    return 'outro';
}

// ====== FUNÇÕES DOS FORMULÁRIOS ======

// Fechar formulário do assistente
function closeAssistantForm(button) {
    const formContainer = button.closest('.assistant-form-container');
    if (formContainer) {
        formContainer.remove();
    }
}

// Gerar protocolo único
function generateProtocol() {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `SGT${year}${random}`;
}

// Enviar sugestão/reclamação
async function submitSuggestion(event, tipo) {
    console.log('🚀 FUNÇÃO submitSuggestion CHAMADA! Tipo:', tipo);
    event.preventDefault();
    
    const nome = document.getElementById('suggestionName').value;
    const bairro = document.getElementById('suggestionBairro').value;
    const mensagem = document.getElementById('suggestionMessage').value;
    const endereco = document.getElementById('suggestionLocation').value;
    
    console.log('📝 Dados coletados:', { nome, bairro, mensagem, endereco });
    
    const interacao = {
        tipo: tipo.toUpperCase(),
        titulo: `${tipo} de ${nome} - ${bairro}`,
        descricao: `${mensagem}${endereco ? ' - Endereço: ' + endereco : ''}`,
        protocolo: generateProtocol(),
        data: new Date().toISOString(),
        nome: nome,
        bairro: bairro,
        endereco: endereco,
        status: 'nova'
    };
    
    console.log('🔄 Processando interação:', interacao);

    try {
        // Salvar via API
        const response = await fetch('http://localhost:3003/api/interacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(interacao)
        });

        if (response.ok) {
            console.log('✅ Interação salva via API:', interacao);
        }
    } catch (error) {
        console.error('❌ Erro ao salvar via API:', error);
    }

    // SALVAMENTO CRÍTICO: localStorage como backup
    console.log('💾 INICIANDO SALVAMENTO NO LOCALSTORAGE...');
    const interacoes = JSON.parse(localStorage.getItem('interacoesRecebidas') || '[]');
    console.log('📦 Interações existentes no localStorage:', interacoes.length);
    interacoes.push(interacao);
    localStorage.setItem('interacoesRecebidas', JSON.stringify(interacoes));
    console.log('✅ SALVAMENTO CONCLUÍDO! Total agora:', interacoes.length);
    console.log('📋 Protocolo salvo:', interacao.protocolo);
    console.log('🔍 Verificação dos dados salvos:', JSON.parse(localStorage.getItem('interacoesRecebidas')));

    // Mostrar confirmação
    const chatMessages = document.getElementById('chatMessages');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✅</div>
            <h4>${tipo === 'sugestao' ? 'Sugestão enviada com sucesso!' : 'Reclamação registrada com sucesso!'}</h4>
            <p><strong>Protocolo:</strong> ${interacao.protocolo}</p>
            <p>Sua ${tipo === 'sugestao' ? 'sugestão' : 'reclamação'} foi registrada e será analisada pela equipe. 
               Guarde o número do protocolo para acompanhar o andamento.</p>
            <div class="protocol-actions">
                <button class="copy-protocol-btn" onclick="copyProtocol('${interacao.protocolo}')">
                    <i class="fas fa-copy"></i> Copiar Protocolo
                </button>
            </div>
        </div>
    `;

    // Remover formulário e adicionar mensagem de sucesso
    closeAssistantForm(event.target);
    chatMessages.appendChild(successDiv);
    scrollToBottom();
}

// Enviar relatório com foto
async function submitPhotoReport(event) {
    event.preventDefault();
    
    const nome = document.getElementById('photoName').value;
    const bairro = document.getElementById('photoBairro').value;
    const descricao = document.getElementById('photoDescription').value;
    const endereco = document.getElementById('photoLocation').value;
    const photoFile = document.getElementById('photoUpload').files[0];
    
    const interacao = {
        tipo: 'foto',
        titulo: `Foto enviada por ${nome} - ${bairro}`,
        mensagem: descricao,
        imagem: photoFile ? photoFile.name : 'foto_uploaded.jpg',
        protocolo: generateProtocol(),
        data: new Date().toISOString(),
        nome: nome,
        bairro: bairro,
        endereco: endereco,
        descricao: descricao,
        nomeArquivo: photoFile ? photoFile.name : null,
        tamanhoArquivo: photoFile ? photoFile.size : null,
        status: 'nova'
    };

    try {
        // Enviar via FormData para upload de arquivo
        const formData = new FormData();
        formData.append('foto', photoFile);
        formData.append('nome', nome);
        formData.append('bairro', bairro);
        formData.append('descricao', descricao);
        formData.append('endereco', endereco);

        const response = await fetch('http://localhost:3003/api/upload-foto', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Foto enviada via API:', result);
            interacao.imagem = result.imageUrl;
        }
    } catch (error) {
        console.error('Erro ao enviar via API:', error);
    }

    // Sempre salvar no localStorage como backup
    const interacoes = JSON.parse(localStorage.getItem('interacoesRecebidas') || '[]');
    interacoes.push(interacao);
    localStorage.setItem('interacoesRecebidas', JSON.stringify(interacoes));

    // Mostrar confirmação
    const chatMessages = document.getElementById('chatMessages');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <div class="success-icon">📸</div>
            <h4>Relatório com foto enviado com sucesso!</h4>
            <p><strong>Protocolo:</strong> ${interacao.protocolo}</p>
            <p>Sua foto e descrição do problema foram registradas. A equipe analisará o local reportado.</p>
            <div class="protocol-actions">
                <button class="copy-protocol-btn" onclick="copyProtocol('${interacao.protocolo}')">
                    <i class="fas fa-copy"></i> Copiar Protocolo
                </button>
            </div>
        </div>
    `;

    closeAssistantForm(event.target);
    chatMessages.appendChild(successDiv);
    scrollToBottom();
}

// Enviar relatório de localização
async function submitLocationReport(event) {
    event.preventDefault();
    
    const nome = document.getElementById('locationName').value;
    const bairro = document.getElementById('locationBairro').value;
    const endereco = document.getElementById('locationAddress').value;
    const tipoProblema = document.getElementById('locationProblem').value;
    const detalhes = document.getElementById('locationDetails').value;
    
    const interacao = {
        tipo: 'localizacao',
        titulo: `Local marcado por ${nome} - ${bairro}`,
        mensagem: `${tipoProblema}: ${detalhes}`,
        protocolo: generateProtocol(),
        data: new Date().toISOString(),
        nome: nome,
        bairro: bairro,
        endereco: endereco,
        tipoProblema: tipoProblema,
        detalhes: detalhes,
        latitude: window.currentLatitude || null,
        longitude: window.currentLongitude || null,
        status: 'nova'
    };

    try {
        // Enviar via API
        const response = await fetch('http://localhost:3003/api/marcar-local', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                bairro: bairro,
                endereco: endereco,
                problema: tipoProblema,
                descricao: detalhes
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Local marcado via API:', result);
        }
    } catch (error) {
        console.error('Erro ao marcar local via API:', error);
    }

    // Sempre salvar no localStorage como backup
    const interacoes = JSON.parse(localStorage.getItem('interacoesRecebidas') || '[]');
    interacoes.push(interacao);
    localStorage.setItem('interacoesRecebidas', JSON.stringify(interacoes));

    // Salvar no localStorage
    const locais = JSON.parse(localStorage.getItem('locaisProblemas') || '[]');
    locais.push(interacao);
    localStorage.setItem('locaisProblemas', JSON.stringify(locais));

    // Mostrar confirmação
    const chatMessages = document.getElementById('chatMessages');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <div class="success-icon">🗺️</div>
            <h4>Local marcado com sucesso!</h4>
            <p><strong>Protocolo:</strong> ${interacao.protocolo}</p>
            <p>O local com problema foi registrado e será encaminhado para a equipe responsável.</p>
            ${interacao.latitude ? `<p><strong>📍 Coordenadas:</strong> ${interacao.latitude}, ${interacao.longitude}</p>` : ''}
            <div class="protocol-actions">
                <button class="copy-protocol-btn" onclick="copyProtocol('${interacao.protocolo}')">
                    <i class="fas fa-copy"></i> Copiar Protocolo
                </button>
            </div>
        </div>
    `;

    closeAssistantForm(event.target);
    chatMessages.appendChild(successDiv);
    scrollToBottom();
}

// Copiar protocolo para área de transferência
function copyProtocol(protocolo) {
    navigator.clipboard.writeText(protocolo).then(() => {
        // Mostrar feedback visual
        const button = event.target.closest('.copy-protocol-btn');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        button.style.background = '#22c55e';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    });
}

// Preview da foto selecionada
function previewPhoto(input) {
    console.log('📸 Função previewPhoto chamada', input);
    const preview = document.getElementById('photoPreview');
    const file = input.files[0];
    
    console.log('📁 Arquivo selecionado:', file);
    
    if (file) {
        // Validar tipo de arquivo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('❌ Tipo de arquivo não permitido. Selecione uma imagem (JPG, PNG, GIF ou WebP).');
            input.value = '';
            return;
        }
        
        // Validar tamanho (2MB máximo)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            alert('❌ Arquivo muito grande. O tamanho máximo é 2MB.');
            input.value = '';
            return;
        }
        
        console.log('✅ Arquivo válido, gerando preview...');
        
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <div class="photo-preview-container">
                    <img src="${e.target.result}" alt="Preview da foto">
                    <div class="photo-info">
                        <span class="photo-name">${file.name}</span>
                        <span class="photo-size">${(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                </div>
            `;
            console.log('✅ Preview gerado com sucesso');
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
        console.log('❌ Nenhum arquivo selecionado');
    }
}

// Obter localização atual
function getCurrentLocation(inputId) {
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Localizando...';
    button.disabled = true;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Armazenar coordenadas globalmente
                window.currentLatitude = lat;
                window.currentLongitude = lng;
                
                // Usar API de geocoding reverso (Nominatim - gratuita)
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`)
                    .then(response => response.json())
                    .then(data => {
                        const address = data.display_name || `${lat}, ${lng}`;
                        document.getElementById(inputId).value = address;
                        
                        // Mostrar coordenadas se for o formulário de localização
                        if (inputId === 'locationAddress') {
                            const coordsDisplay = document.getElementById('locationCoords');
                            const coordsText = document.getElementById('coordsText');
                            coordsText.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                            coordsDisplay.style.display = 'block';
                        }
                        
                        button.innerHTML = '<i class="fas fa-check"></i> Localização obtida!';
                        button.style.background = '#22c55e';
                        
                        setTimeout(() => {
                            button.innerHTML = originalText;
                            button.style.background = '';
                            button.disabled = false;
                        }, 3000);
                    })
                    .catch(error => {
                        console.error('Erro ao obter endereço:', error);
                        document.getElementById(inputId).value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                        
                        button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Coordenadas obtidas';
                        button.style.background = '#f59e0b';
                        
                        setTimeout(() => {
                            button.innerHTML = originalText;
                            button.style.background = '';
                            button.disabled = false;
                        }, 3000);
                    });
            },
            function(error) {
                console.error('Erro ao obter localização:', error);
                button.innerHTML = '<i class="fas fa-times"></i> Erro na localização';
                button.style.background = '#ef4444';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                    button.disabled = false;
                }, 3000);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    } else {
        alert('Geolocalização não é suportada neste navegador.');
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// Função para carregar mensagens no painel administrativo
function loadSugestoes() {
    try {
        const mensagens = JSON.parse(localStorage.getItem('mensagensAssistente') || '[]');
        const tbody = document.getElementById('sugestoesTableBody');
        
        if (!tbody) return;
        
        if (mensagens.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem;">
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <h4>Nenhuma mensagem recebida</h4>
                            <p>As mensagens dos cidadãos aparecerão aqui</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = mensagens
            .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
            .map(mensagem => {
                const data = new Date(mensagem.dataHora);
                const dataFormatada = data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                
                const tipoClass = {
                    'sugestão': 'success',
                    'dúvida': 'warning', 
                    'reclamação': 'danger',
                    'elogio': 'primary',
                    'outro': 'secondary'
                }[mensagem.tipo] || 'secondary';
                
                return `
                    <tr>
                        <td>${dataFormatada}</td>
                        <td><strong>${mensagem.nome}</strong></td>
                        <td><span class="badge bg-${tipoClass}">${mensagem.tipo}</span></td>
                        <td style="max-width: 300px;">
                            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${mensagem.mensagem}">
                                ${mensagem.mensagem}
                            </div>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="viewMessage(${mensagem.id})">
                                <i class="fas fa-eye"></i> Ver
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
            
    } catch (error) {
        console.error('Erro ao carregar sugestões:', error);
    }
}

function viewMessage(id) {
    try {
        const mensagens = JSON.parse(localStorage.getItem('mensagensAssistente') || '[]');
        const mensagem = mensagens.find(m => m.id === id);
        
        if (mensagem) {
            const data = new Date(mensagem.dataHora);
            const dataFormatada = data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR');
            
            alert(`Mensagem Completa:\n\nRemetente: ${mensagem.nome}\nTipo: ${mensagem.tipo}\nData: ${dataFormatada}\n\nMensagem:\n${mensagem.mensagem}`);
        }
    } catch (error) {
        console.error('Erro ao visualizar mensagem:', error);
    }
}

// Atualizar função de inicialização
function initializeApp() {
    setupNavigation();
    setupMobileMenu();
    setupAnimations();
    addButtonEffects();
    manageFocus();
    setupCalendar();
    setupProjectFilters();
    setupGalleryTabs();
    setupContactForm();
    updateFooterYear();
    // Assistente digital simples implementado
    
    // Smooth scrolling for hero buttons
    const heroButtons = document.querySelectorAll('.hero-button');
    heroButtons.forEach(button => {
        if (button.getAttribute('onclick')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = button.getAttribute('onclick').match(/showSection\('(.+)'\)/)?.[1];
                if (sectionId) {
                    showSection(sectionId);
                }
            });
        }
    });
}

// Atualizar função de inicialização
function initializeApp() {
    setupNavigation();
    setupMobileMenu();
    setupAnimations();
    addButtonEffects();
    manageFocus();
    setupCalendar();
    setupProjectFilters();
    setupGalleryTabs();
    setupContactForm();
    updateFooterYear();
    // Novo assistente digital funcional
    
    // Smooth scrolling for hero buttons
    const heroButtons = document.querySelectorAll('.hero-button');
    heroButtons.forEach(button => {
        if (button.getAttribute('onclick')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = button.getAttribute('onclick').match(/showSection\('(.+)'\)/)?.[1];
                if (sectionId) {
                    showSection(sectionId);
                }
            });
        }
    });
}

// Console message for developers
console.log('🏛️ Gabinete Digital - Emicleiton');
console.log('💙 Sistema desenvolvido com foco em acessibilidade e performance');
console.log('📱 Totalmente responsivo e otimizado para todos os dispositivos');

// ====== FUNÇÕES DO MODAL "ESTE MANDATO É SEU" ======

function openMandatoModal() {
    const modal = document.getElementById('mandatoModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMandatoModal() {
    const modal = document.getElementById('mandatoModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function switchMandatoTab(tabName) {
    // Remover classe active de todas as tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Ativar tab específica
    const activeBtn = document.querySelector(`[onclick="switchMandatoTab('${tabName}')"]`);
    const activeContent = document.getElementById(tabName + 'Tab');
    
    if (activeBtn) activeBtn.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
}

// Inicializar formulário de sugestões quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    const sugestoesForm = document.getElementById('sugestoesForm');
    if (sugestoesForm) {
        sugestoesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = document.getElementById('enviarSugestaoBtn');
            const originalText = btn.innerHTML;
            
            // Desabilitar botão durante envio
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            // Coletar dados do formulário
            const templateParams = {
                nome: document.getElementById('nomeCompleto').value,
                email: document.getElementById('emailContato').value,
                telefone: document.getElementById('telefoneContato').value || 'Não informado',
                tipo: document.getElementById('tipoSugestao').value,
                assunto: document.getElementById('assuntoSugestao').value,
                mensagem: document.getElementById('mensagemSugestao').value,
                bairro: document.getElementById('bairroSugestao').value || 'Não informado',
                local: document.getElementById('localSugestao').value || 'Não informado',
                data: new Date().toLocaleDateString('pt-BR'),
                hora: new Date().toLocaleTimeString('pt-BR')
            };
            
            // Verificar se há foto
            const fotoInput = document.getElementById('fotoSugestao');
            const temFoto = fotoInput.files && fotoInput.files.length > 0;
            
            // Criar dados para o painel administrativo
            const protocolo = `SGT${new Date().getFullYear()}${Math.floor(Math.random() * 900000) + 100000}`;
            const interacao = {
                protocolo: protocolo,
                tipo: templateParams.tipo.toUpperCase(),
                titulo: templateParams.assunto,
                mensagem: templateParams.mensagem,
                nome: templateParams.nome,
                email: templateParams.email,
                telefone: templateParams.telefone,
                bairro: templateParams.bairro,
                endereco: templateParams.local,
                data: new Date().toISOString(),
                status: 'pendente'
            };
            
            // Função para processar os dados e salvar
            function processarESalvarDados() {
                
                // Salvar no localStorage para o painel administrativo
                const interacoes = JSON.parse(localStorage.getItem('interacoesRecebidas') || '[]');
                interacoes.push(interacao);
                localStorage.setItem('interacoesRecebidas', JSON.stringify(interacoes));
                
                // Salvar também no formato antigo para compatibilidade
                const sugestoes = JSON.parse(localStorage.getItem('sugestoes') || '[]');
                sugestoes.push({
                    id: Date.now(),
                    ...templateParams,
                    protocolo: protocolo,
                    status: 'enviada'
                });
                localStorage.setItem('sugestoes', JSON.stringify(sugestoes));
                
                console.log('✅ Dados salvos com protocolo:', protocolo);
                
                // Sucesso
                btn.innerHTML = `<i class="fas fa-check"></i> Enviado! Protocolo: ${protocolo}`;
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                // Limpar formulário
                sugestoesForm.reset();
                
                // Fechar modal após 3 segundos
                setTimeout(() => {
                    closeMandatoModal();
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 3000);
            }
            
            // Processar envio completo
            const formData = new FormData();
            
            // Adicionar todos os dados do formulário
            formData.append('nome', templateParams.nome);
            formData.append('email', templateParams.email);
            formData.append('telefone', templateParams.telefone);
            formData.append('tipo', templateParams.tipo);
            formData.append('assunto', templateParams.assunto);
            formData.append('mensagem', templateParams.mensagem);
            formData.append('bairro', templateParams.bairro);
            formData.append('localizacao', templateParams.local);
            
            // Adicionar foto se existir
            if (temFoto) {
                formData.append('foto', fotoInput.files[0]);
                console.log('📸 Incluindo foto no envio...');
            }
            
            // Enviar para o servidor
            fetch('http://localhost:3000/enviar', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('✅ Envio bem-sucedido:', data);
                    
                    // Atualizar interação com dados do servidor
                    interacao.protocolo = data.protocolo;
                    if (data.imagePath) {
                        interacao.imagemUrl = data.imagePath;
                        interacao.nomeArquivo = fotoInput.files[0].name;
                    }
                    
                    processarESalvarDados();
                } else {
                    throw new Error(data.error || 'Erro no envio');
                }
            })
            .catch(error => {
                console.error('❌ Erro no envio:', error);
                // Mesmo com erro, salvar localmente
                processarESalvarDados();
            });
            
            // Enviar via EmailJS (opcional)
            emailjs.send('service_m7vyqan', 'template_zn7ijqe', templateParams)
                .then(function(response) {
                    console.log('✅ Email enviado com sucesso');
                })
                .catch(function(error) {
                    console.error('❌ Erro no email:', error);
                });
        });
    }
    
    // Fechar modal clicando fora
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('mandatoModal');
        if (modal && e.target === modal) {
            closeMandatoModal();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMandatoModal();
        }
    });
});

// ====== CHAT DO ASSISTENTE ======

function sendMandatoMessage() {
    const input = document.getElementById('chatMandatoInput');
    const message = input.value.trim();
    
    if (message) {
        addMandatoUserMessage(message);
        input.value = '';
        
        // Simular resposta do bot
        setTimeout(() => {
            const response = generateMandatoResponse(message);
            addMandatoBotMessage(response);
        }, 1000);
    }
}

function sendQuickSuggestion(message) {
    addMandatoUserMessage(message);
    
    setTimeout(() => {
        const response = generateMandatoResponse(message);
        addMandatoBotMessage(response);
    }, 1000);
}

function addMandatoUserMessage(message) {
    const chatMessages = document.getElementById('chatMandatoMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMandatoBotMessage(message) {
    const chatMessages = document.getElementById('chatMandatoMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateMandatoResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Respostas baseadas em palavras-chave
    if (msg.includes('denunciar') || msg.includes('problema') || msg.includes('denuncia')) {
        return "Para denunciar problemas na cidade, você pode: 1) Preencher o formulário de sugestões neste mesmo modal, 2) Entrar em contato pelo WhatsApp, ou 3) Comparecer ao gabinete nos horários de atendimento.";
    }
    
    if (msg.includes('projeto') || msg.includes('andamento')) {
        return "Nossos principais projetos em andamento incluem: melhoria da infraestrutura urbana, programas sociais, e iniciativas de saúde pública. Visite a seção 'Projetos' no site para mais detalhes.";
    }
    
    if (msg.includes('acompanhar') || msg.includes('solicitação') || msg.includes('status')) {
        return "Você pode acompanhar suas solicitações entrando em contato conosco pelo WhatsApp ou visitando nosso gabinete. Em breve teremos um sistema online de acompanhamento.";
    }
    
    if (msg.includes('horário') || msg.includes('atendimento')) {
        return "Nosso gabinete funciona de segunda a sexta, das 8h às 17h. Para agendamentos específicos, entre em contato pelo WhatsApp.";
    }
    
    if (msg.includes('whatsapp') || msg.includes('contato')) {
        return "Você pode entrar em contato conosco pelo WhatsApp clicando no botão 'Fale Comigo' no site ou diretamente pelo nosso número oficial.";
    }
    
    // Resposta padrão
    return "Obrigado por entrar em contato! Para questões específicas, recomendo preencher o formulário de sugestões ou entrar em contato pelo WhatsApp. Estamos sempre prontos para ajudar Monte Santo!";
}

function handleMandatoChatEnter(event) {
    if (event.key === 'Enter') {
        sendMandatoMessage();
    }
}

// ========== MODERN MOBILE MENU SYSTEM ==========

// Modern Mobile Menu Setup
function setupModernMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mobileOverlay = document.getElementById('mobileMenuOverlay');
    const mobileSidebar = document.getElementById('mobileMenuSidebar');
    const mobileClose = document.getElementById('mobileMenuClose');
    const mobileNavButtons = document.querySelectorAll('.mobile-nav-button');
    
    console.log('Setup Modern Mobile Menu:', {
        mobileToggle: !!mobileToggle,
        mobileOverlay: !!mobileOverlay,
        mobileSidebar: !!mobileSidebar,
        mobileClose: !!mobileClose,
        buttons: mobileNavButtons.length
    });
    
    if (!mobileToggle) {
        console.log('Menu mobile toggle não encontrado, página pode não ter menu mobile');
        return;
    }
    
    if (!mobileOverlay || !mobileSidebar || !mobileClose) {
        console.error('Elementos do menu mobile não encontrados');
        return;
    }
    
    // Função para abrir o menu mobile
    function openMobileMenu() {
        console.log('Abrindo menu mobile...');
        mobileOverlay.classList.add('active');
        mobileSidebar.classList.add('active');
        document.body.classList.add('mobile-menu-open');
        
        // Change icon to X
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    }
    
    // Função para fechar o menu mobile
    function closeMobileMenu() {
        console.log('Fechando menu mobile...');
        mobileOverlay.classList.remove('active');
        mobileSidebar.classList.remove('active');
        document.body.classList.remove('mobile-menu-open');
        
        // Change icon back to bars
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    
    // Event listener para botão de toggle
    mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Botão mobile clicado!');
        
        if (mobileSidebar.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Event listener para botão de fechar
    if (mobileClose) {
        mobileClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
    }
    
    // Event listener para overlay (fechar ao clicar fora)
    mobileOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        closeMobileMenu();
    });
    
    // Event listeners para botões de navegação mobile
    mobileNavButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            console.log('Navegando para seção:', sectionId);
            
            // Remove active class from all mobile nav buttons
            mobileNavButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding section
            showSection(sectionId);
            
            // Close mobile menu
            closeMobileMenu();
        });
    });
    
    // Escape key to close menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileSidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// ==================== SISTEMA DE CURSOS COMUNITÁRIOS ====================

let cursosData = [];

// Carregar e inicializar cursos quando a seção for mostrada
function initializeCursos() {
    console.log('🎓 Inicializando sistema de cursos comunitários');
    loadCursosData();
    setupCursosFilters();
}

// Carregar dados dos cursos
async function loadCursosData() {
    try {
        const response = await fetch('cursos.json');
        cursosData = await response.json();
        
        console.log('📖 Cursos carregados:', cursosData.length);
        
        // Atualizar estatísticas
        updateCursosStats();
        
        // Renderizar cursos
        renderCursosInIndex(cursosData);
        
    } catch (error) {
        console.error('❌ Erro ao carregar cursos:', error);
        // Usar dados padrão se o arquivo não existir
        useDefaultCursosData();
    }
}

// Dados padrão caso o arquivo JSON não exista
function useDefaultCursosData() {
    cursosData = [
        {
            "id": 1,
            "titulo": "Informática Básica para Iniciantes",
            "descricao": "Aprenda o básico do computador, internet e ferramentas digitais essenciais para o dia a dia.",
            "categoria": "informatica",
            "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "apostila": "",
            "duracao": "4 horas",
            "nivel": "Iniciante",
            "instrutor": "Prof. Carlos Silva",
            "certificado": true
        },
        {
            "id": 2,
            "titulo": "Empreendedorismo Local",
            "descricao": "Descubra como começar seu negócio na sua cidade e desenvolver a economia local.",
            "categoria": "empreendedorismo", 
            "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "apostila": "",
            "duracao": "6 horas",
            "nivel": "Intermediário",
            "instrutor": "Prof. Maria Santos",
            "certificado": true
        },
        {
            "id": 3,
            "titulo": "Direitos do Cidadão",
            "descricao": "Conheça seus direitos e deveres como cidadão brasileiro.",
            "categoria": "cidadania",
            "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "apostila": "",
            "duracao": "3 horas",
            "nivel": "Básico",
            "instrutor": "Dr. Ana Oliveira",
            "certificado": true
        }
    ];
    
    updateCursosStats();
    renderCursosInIndex(cursosData);
}

// Atualizar estatísticas dos cursos
function updateCursosStats() {
    const totalCursosElement = document.getElementById('totalCursos');
    if (totalCursosElement) {
        totalCursosElement.textContent = cursosData.length;
    }
    
    // Atualizar contador de certificados
    const certificados = JSON.parse(localStorage.getItem('certificados') || '[]');
    const totalCertificadosElement = document.getElementById('totalCertificados');
    if (totalCertificadosElement) {
        totalCertificadosElement.textContent = certificados.length;
    }
}

// Renderizar cursos na página principal
function renderCursosInIndex(cursos) {
    const container = document.getElementById('cursos-container');
    if (!container) return;
    
    if (cursos.length === 0) {
        container.innerHTML = `
            <div class="no-courses">
                <i class="fas fa-book-open"></i>
                <h3>Nenhum curso encontrado</h3>
                <p>Não há cursos disponíveis no momento.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cursos.map(curso => `
        <div class="curso-card" data-categoria="${curso.categoria}">
            <div class="curso-video">
                <iframe src="${curso.videoUrl}" frameborder="0" allowfullscreen></iframe>
                <div class="curso-badge">
                    <span class="nivel-badge ${curso.nivel.toLowerCase()}">${curso.nivel}</span>
                </div>
            </div>
            
            <div class="curso-content">
                <h3>${curso.titulo}</h3>
                <p class="curso-descricao">${curso.descricao}</p>
                
                <div class="curso-info">
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>${curso.duracao}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-user"></i>
                        <span>${curso.instrutor}</span>
                    </div>
                    ${curso.certificado ? '<div class="info-item"><i class="fas fa-certificate"></i><span>Certificado</span></div>' : ''}
                </div>
                
                <div class="curso-actions">
                    ${curso.apostila ? `<a href="${curso.apostila}" target="_blank" class="btn-apostila"><i class="fas fa-book"></i> Baixar Apostila</a>` : ''}
                    <button onclick="gerarCertificadoIndex('${curso.titulo}', '${curso.instrutor}')" class="btn-certificado">
                        <i class="fas fa-certificate"></i> Gerar Certificado
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Configurar filtros dos cursos
function setupCursosFilters() {
    const filterButtons = document.querySelectorAll('#cursos .filter-btn');
    
    if (filterButtons.length === 0) {
        console.log('⚠️ Botões de filtro de cursos não encontrados');
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Aplicar filtro
            const filter = this.dataset.filter;
            filterCursosIndex(filter);
        });
    });
}

// Filtrar cursos por categoria na página principal
function filterCursosIndex(categoria) {
    if (categoria === 'all') {
        renderCursosInIndex(cursosData);
    } else {
        const cursosFiltrados = cursosData.filter(curso => curso.categoria === categoria);
        renderCursosInIndex(cursosFiltrados);
    }
}

// Gerar certificado na página principal
function gerarCertificadoIndex(curso, instrutor) {
    const nome = prompt("Digite seu nome completo para o certificado:");
    if (!nome) {
        alert("Nome obrigatório para gerar o certificado.");
        return;
    }
    
    console.log('📄 Gerando certificado para:', nome, curso);
    
    try {
        // Verificar se jsPDF está disponível
        if (typeof window.jspdf === 'undefined') {
            // Carregar jsPDF dinamicamente
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = function() {
                generatePDFCertificate(nome, curso, instrutor);
            };
            document.head.appendChild(script);
        } else {
            generatePDFCertificate(nome, curso, instrutor);
        }
        
    } catch (error) {
        console.error('❌ Erro ao gerar certificado:', error);
        alert('Erro ao gerar certificado. Tente novamente.');
    }
}

// Gerar PDF do certificado
function generatePDFCertificate(nome, curso, instrutor) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Configurar fonte
    doc.setFont('helvetica');
    
    // Fundo decorativo
    doc.setFillColor(30, 64, 175); // Azul institucional
    doc.rect(0, 0, 297, 210, 'F');
    
    // Área branca central
    doc.setFillColor(255, 255, 255);
    doc.rect(20, 20, 257, 170, 'F');
    
    // Borda decorativa
    doc.setDrawColor(251, 191, 36); // Amarelo institucional
    doc.setLineWidth(3);
    doc.rect(25, 25, 247, 160);
    
    // Título
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICADO DE CONCLUSÃO', 148.5, 60, { align: 'center' });
    
    // Linha decorativa
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(2);
    doc.line(80, 70, 217, 70);
    
    // Texto principal
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Certificamos que', 148.5, 90, { align: 'center' });
    
    // Nome do aluno
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text(nome.toUpperCase(), 148.5, 110, { align: 'center' });
    
    // Curso
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`concluiu com êxito o curso "${curso}"`, 148.5, 130, { align: 'center' });
    
    // Instrutor
    doc.setFontSize(14);
    doc.text(`ministrado por ${instrutor}`, 148.5, 145, { align: 'center' });
    
    // Data e local
    const hoje = new Date().toLocaleDateString('pt-BR');
    doc.setFontSize(12);
    doc.text(`Monte Santo - BA, ${hoje}`, 148.5, 165, { align: 'center' });
    
    // Assinatura
    doc.setTextColor(30, 64, 175);
    doc.setFont('helvetica', 'bold');
    doc.text('Gabinete Digital - Emicleiton Rubem da Conceição', 148.5, 180, { align: 'center' });
    
    // Salvar o PDF
    const nomeArquivo = `certificado-${nome.replace(/\s+/g, '-').toLowerCase()}-${curso.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    doc.save(nomeArquivo);
    
    // Salvar registro do certificado
    salvarCertificadoIndex(nome, curso, hoje);
    
    // Mostrar sucesso
    showNotificationIndex('Certificado gerado com sucesso!', 'success');
}

// Salvar registro do certificado
function salvarCertificadoIndex(nome, curso, data) {
    const certificados = JSON.parse(localStorage.getItem('certificados') || '[]');
    
    const certificado = {
        id: Date.now(),
        nome: nome,
        curso: curso,
        data: data,
        protocolo: `CERT${Date.now()}`
    };
    
    certificados.push(certificado);
    localStorage.setItem('certificados', JSON.stringify(certificados));
    
    // Atualizar contador
    updateCursosStats();
    
    console.log('📋 Certificado registrado:', certificado);
}

// Mostrar notificação na página principal
function showNotificationIndex(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
