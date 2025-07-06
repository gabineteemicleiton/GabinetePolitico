// Servidor completo para formulário de sugestões
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

// Configurações
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static('.'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Criar pasta uploads se não existir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do multer para upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${timestamp}-${sanitizedName}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limite
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não permitido. Use JPG, PNG ou GIF.'));
        }
    }
});

// Função para gerar protocolo
function generateProtocol() {
    const year = new Date().getFullYear();
    const number = Math.floor(Math.random() * 900000) + 100000;
    return `SGT${year}${number}`;
}

// Função para salvar interação no arquivo JSON
function saveInteraction(interaction) {
    const filePath = path.join(__dirname, 'interacoes.json');
    let interactions = [];
    
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            interactions = JSON.parse(data);
        }
    } catch (error) {
        console.error('Erro ao ler arquivo de interações:', error);
        interactions = [];
    }
    
    interactions.push(interaction);
    
    try {
        fs.writeFileSync(filePath, JSON.stringify(interactions, null, 2));
        return true;
    } catch (error) {
        console.error('Erro ao salvar interação:', error);
        return false;
    }
}

// Rota principal do formulário
app.post('/enviar', upload.single('foto'), async (req, res) => {
    try {
        console.log('📝 Nova submissão recebida');
        console.log('📋 Dados do formulário:', req.body);
        console.log('📸 Arquivo enviado:', req.file ? req.file.filename : 'Nenhum');
        
        const dados = req.body;
        const protocolo = generateProtocol();
        
        // Criar objeto de interação
        const interacao = {
            protocolo: protocolo,
            tipo: (dados.tipo || 'sugestao').toUpperCase(),
            titulo: dados.assunto || 'Sem assunto',
            mensagem: dados.mensagem || 'Sem mensagem',
            nome: dados.nome || 'Não informado',
            email: dados.email || 'Não informado',
            telefone: dados.telefone || 'Não informado',
            bairro: dados.bairro || 'Não informado',
            endereco: dados.localizacao || dados.local || 'Não informado',
            data: new Date().toISOString(),
            status: 'pendente'
        };
        
        // Se há imagem, adicionar informações
        if (req.file) {
            interacao.imagemUrl = `/uploads/${req.file.filename}`;
            interacao.nomeArquivo = req.file.originalname;
            interacao.tamanhoArquivo = req.file.size;
            console.log('📸 Imagem salva:', req.file.filename);
        }
        
        // Salvar no arquivo JSON
        const saved = saveInteraction(interacao);
        
        if (saved) {
            console.log('✅ Interação salva com protocolo:', protocolo);
            
            // Resposta de sucesso
            res.json({
                success: true,
                protocolo: protocolo,
                message: 'Sugestão enviada com sucesso!',
                imagePath: req.file ? `/uploads/${req.file.filename}` : null
            });
        } else {
            throw new Error('Erro ao salvar dados');
        }
        
    } catch (error) {
        console.error('❌ Erro no processamento:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
});

// Rota para buscar interações
app.get('/api/interacoes', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'interacoes.json');
        let interactions = [];
        
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            interactions = JSON.parse(data);
        }
        
        res.json({
            success: true,
            total: interactions.length,
            data: interactions
        });
    } catch (error) {
        console.error('❌ Erro ao buscar interações:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar dados'
        });
    }
});

// Rota para testar o servidor
app.get('/test', (req, res) => {
    res.json({
        message: 'Servidor funcionando!',
        timestamp: new Date().toISOString(),
        port: port
    });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'Arquivo muito grande. Máximo 2MB permitido.'
            });
        }
    }
    
    console.error('❌ Erro:', error);
    res.status(500).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
    });
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor funcionando em http://localhost:${port}`);
    console.log(`📁 Arquivos estáticos servidos da pasta atual`);
    console.log(`📸 Upload de imagens em: ${uploadsDir}`);
    console.log(`📝 Formulário disponível em: http://localhost:${port}/enviar`);
});