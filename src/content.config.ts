import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const veiculos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/veiculos' }),
  schema: z.object({
    nome: z.string(),
    marca: z.string(),
    modelo: z.string(),
    tipo: z.enum(['carro', 'moto']),
    categoria: z.string(),
    ano: z.number(),
    anoModelo: z.number(),
    preco: z.number(),
    km: z.number(),
    cambio: z.enum(['Automático', 'Manual']),
    combustivel: z.enum(['Flex', 'Gasolina', 'Diesel', 'Elétrico']),
    cor: z.string(),
    cidade: z.string(),
    uf: z.string(),
    destaque: z.boolean().default(false),
    lancamento: z.boolean().default(false),
    fotos: z.array(z.string()).default([]),
    descricao: z.string(),
    opcionais: z.array(z.string()).default([]),
    motor: z.string().optional(),
    potencia: z.string().optional(),
    portas: z.number().optional(),
    cilindrada: z.string().optional(),
  }),
});

const depoimentos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/depoimentos' }),
  schema: z.object({
    nome: z.string(),
    local: z.string(),
    texto: z.string(),
    nota: z.number().min(1).max(5).default(5),
  }),
});

const loja = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/loja' }),
  schema: z.object({
    whatsapp: z.string(),
    instagram: z.string().optional(),
    telefoneFixo: z.string().optional(),
    endereco: z.string(),
    cidade: z.string(),
    uf: z.string(),
    horarios: z.string(),
    avaliacaoMedia: z.number(),
    numAvaliacoes: z.number(),
    anoFundacao: z.number(),
    sobre: z.string(),
    cnpj: z.string(),
  }),
});

const site = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/site' }),
  schema: z.object({
    logo: z.string().optional(),
    nomeSite: z.string().default('JF Veículos'),
    tagline: z.string().default('seu seminovo de confiança'),
    heroTituloInicio: z.string(),
    heroTituloDestaque: z.string(),
    heroSubtitulo: z.string(),
    vantagem1Titulo: z.string(),
    vantagem1Desc: z.string(),
    vantagem2Titulo: z.string(),
    vantagem2Desc: z.string(),
    vantagem3Titulo: z.string(),
    vantagem3Desc: z.string(),
    ctaFinalTitulo: z.string(),
    ctaFinalTexto: z.string(),
    ctaFinalBotao: z.string(),
    footerDescricao: z.string(),
  }),
});

const aparencia = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/aparencia' }),
  schema: z.object({
    corTema: z.enum(['ambar', 'azul', 'verde', 'vermelho', 'roxo']).default('ambar'),
    fonteTema: z.enum(['moderno', 'amigavel', 'classico']).default('moderno'),
  }),
});

export const collections = { veiculos, depoimentos, loja, site, aparencia };
