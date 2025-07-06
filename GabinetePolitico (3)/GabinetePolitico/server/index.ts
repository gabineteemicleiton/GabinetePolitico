import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from './db';
import { sugestoes, anexos, type InsertSugestao, type InsertAnexo } from '../shared/schema';
import { eq, desc } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use apenas imagens.'));
    }
  }
});

// Função para gerar protocolo único
function gerarProtocolo(): string {
  const ano = new Date().getFullYear().toString().slice(-2);
  const numero = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `SGT${ano}${numero}`;
}

// Rota para criar sugestão/reclamação
app.post('/api/sugestoes', upload.array('fotos', 5), async (req, res) => {
  try {
    const {
      nome,
      bairro,
      tipo,
      mensagem,
      email,
      telefone,
      latitude,
      longitude,
      endereco
    } = req.body;

    // Validação básica
    if (!nome || !bairro || !tipo || !mensagem) {
      return res.status(400).json({
        success: false,
        message: 'Nome, bairro, tipo e mensagem são obrigatórios'
      });
    }

    const protocolo = gerarProtocolo();

    // Inserir sugestão
    const novaSugestao: InsertSugestao = {
      nome,
      bairro,
      tipo,
      mensagem,
      email: email || null,
      telefone: telefone || null,
      protocolo,
      latitude: latitude || null,
      longitude: longitude || null,
      endereco: endereco || null
    };

    const [sugestaoInserida] = await db.insert(sugestoes).values(novaSugestao).returning();

    // Processar anexos se houver
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      const anexosData: InsertAnexo[] = files.map(file => ({
        sugestao_id: sugestaoInserida.id,
        nome_arquivo: file.originalname,
        caminho_arquivo: file.path,
        tipo_arquivo: file.mimetype,
        tamanho: file.size,
        descricao: req.body.descricao_foto || null
      }));

      await db.insert(anexos).values(anexosData);
    }

    res.json({
      success: true,
      message: 'Sugestão enviada com sucesso!',
      protocolo: protocolo,
      id: sugestaoInserida.id
    });

  } catch (error) {
    console.error('Erro ao criar sugestão:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para listar sugestões (para o painel administrativo)
app.get('/api/sugestoes', async (req, res) => {
  try {
    const todasSugestoes = await db
      .select()
      .from(sugestoes)
      .orderBy(desc(sugestoes.created_at));

    res.json({
      success: true,
      data: todasSugestoes
    });
  } catch (error) {
    console.error('Erro ao buscar sugestões:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para buscar sugestão por protocolo
app.get('/api/sugestoes/protocolo/:protocolo', async (req, res) => {
  try {
    const { protocolo } = req.params;
    
    const sugestao = await db
      .select()
      .from(sugestoes)
      .where(eq(sugestoes.protocolo, protocolo))
      .limit(1);

    if (sugestao.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sugestão não encontrada'
      });
    }

    res.json({
      success: true,
      data: sugestao[0]
    });
  } catch (error) {
    console.error('Erro ao buscar sugestão:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para atualizar status da sugestão
app.patch('/api/sugestoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pendente', 'em_andamento', 'resolvido'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }

    await db
      .update(sugestoes)
      .set({ status, updated_at: new Date() })
      .where(eq(sugestoes.id, parseInt(id)));

    res.json({
      success: true,
      message: 'Status atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Servir arquivos de upload
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});