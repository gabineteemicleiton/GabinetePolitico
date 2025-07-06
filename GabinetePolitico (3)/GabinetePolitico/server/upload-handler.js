const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configurar diretório de upload
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Endpoint para upload de foto
router.post('/upload-foto', upload.single('foto'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const { nome, bairro, descricao, endereco } = req.body;
        
        if (!nome || !bairro || !descricao) {
            return res.status(400).json({ error: 'Campos obrigatórios: nome, bairro, descricao' });
        }

        function generateProtocol() {
            const year = new Date().getFullYear();
            const randomNum = Math.floor(Math.random() * 900000) + 100000;
            return `SGT${year}${randomNum}`;
        }

        const interacao = {
            tipo: 'Fotos',
            mensagem: endereco || `Foto enviada por ${nome} - ${bairro}: ${descricao}`,
            imagem: `/uploads/${req.file.filename}`,
            protocolo: generateProtocol(),
            data: new Date().toISOString(),
            nome: nome,
            bairro: bairro,
            descricao: descricao,
            endereco: endereco,
            nomeArquivo: req.file.originalname,
            tamanhoArquivo: req.file.size,
            status: 'nova'
        };

        // Salvar no arquivo interacoes.json
        const interacoesPath = path.join(__dirname, '..', 'interacoes.json');
        let interacoes = [];
        
        if (fs.existsSync(interacoesPath)) {
            const data = fs.readFileSync(interacoesPath, 'utf8');
            interacoes = JSON.parse(data);
        }
        
        interacoes.push(interacao);
        fs.writeFileSync(interacoesPath, JSON.stringify(interacoes, null, 2));

        res.json({
            success: true,
            protocolo: interacao.protocolo,
            imageUrl: interacao.imagem,
            message: 'Foto enviada com sucesso!'
        });

    } catch (error) {
        console.error('Erro no upload:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Servir arquivos estáticos do diretório uploads
router.use('/uploads', express.static(uploadDir));

module.exports = router;