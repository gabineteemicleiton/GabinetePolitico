import { pgTable, serial, varchar, text, timestamp, decimal, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tabela de sugestões e reclamações
export const sugestoes = pgTable('sugestoes', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 100 }).notNull(),
  bairro: varchar('bairro', { length: 100 }).notNull(),
  tipo: varchar('tipo', { length: 20 }).notNull(), // 'sugestao' ou 'reclamacao'
  mensagem: text('mensagem').notNull(),
  email: varchar('email', { length: 100 }),
  telefone: varchar('telefone', { length: 20 }),
  status: varchar('status', { length: 20 }).notNull().default('pendente'), // 'pendente', 'em_andamento', 'resolvido'
  protocolo: varchar('protocolo', { length: 20 }).notNull(),
  latitude: varchar('latitude', { length: 20 }),
  longitude: varchar('longitude', { length: 20 }),
  endereco: varchar('endereco', { length: 255 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Tabela de fotos/anexos
export const anexos = pgTable('anexos', {
  id: serial('id').primaryKey(),
  sugestao_id: integer('sugestao_id').notNull().references(() => sugestoes.id),
  nome_arquivo: varchar('nome_arquivo', { length: 255 }).notNull(),
  caminho_arquivo: varchar('caminho_arquivo', { length: 500 }).notNull(),
  tipo_arquivo: varchar('tipo_arquivo', { length: 50 }).notNull(),
  tamanho: integer('tamanho').notNull(),
  descricao: text('descricao'),
  created_at: timestamp('created_at').notNull().defaultNow()
});

// Relações
export const sugestoesRelations = relations(sugestoes, ({ many }) => ({
  anexos: many(anexos)
}));

export const anexosRelations = relations(anexos, ({ one }) => ({
  sugestao: one(sugestoes, {
    fields: [anexos.sugestao_id],
    references: [sugestoes.id]
  })
}));

// Tipos TypeScript
export type Sugestao = typeof sugestoes.$inferSelect;
export type InsertSugestao = typeof sugestoes.$inferInsert;
export type Anexo = typeof anexos.$inferSelect;
export type InsertAnexo = typeof anexos.$inferInsert;