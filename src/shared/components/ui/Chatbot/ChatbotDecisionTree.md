# Árvore de Decisão do Chatbot

Este documento descreve o fluxo atual do chatbot da aplicação, com todas as opções acessíveis, redirecionamentos e validações de autenticação.

## Entrada Inicial

```text
Olá, meu nome é Penélope, sou sua assistente virtual! Como posso te ajudar?

Opções iniciais:
- Falar sobre imóveis
- Falar sobre agendamento
- Falar sobre financiamento
```

## Fluxo Completo

```text
INICIO
├─ Falar sobre imóveis
│  └─ IMOVEIS
│     ├─ Imóveis disponíveis
│     │  └─ IMOVEIS_DISPONIVEIS
│     │     ├─ Ver Imóveis
│     │     │  └─ Redireciona para a tela de imóveis (/imoveis)
│     │     ├─ Localização
│     │     │  └─ LOCALIZACAO
│     │     │     ├─ Imóveis disponíveis
│     │     │     │  └─ IMOVEIS_DISPONIVEIS
│     │     │     └─ Voltar para o inicio
│     │     │        └─ INICIO
│     │     └─ Voltar para o inicio
│     │        └─ INICIO
│     ├─ Localização
│     │  └─ LOCALIZACAO
│     │     ├─ Imóveis disponíveis
│     │     │  └─ IMOVEIS_DISPONIVEIS
│     │     └─ Voltar para o inicio
│     │        └─ INICIO
│     └─ Voltar para o inicio
│        └─ INICIO
│
├─ Falar sobre agendamento
│  └─ AGENDAMENTO
│     ├─ Agendar agora!
│     │  ├─ Se o usuário estiver logado
│     │  │  └─ Redireciona para a tela de agendamento (/agenda)
│     │  └─ Se o usuário não estiver logado
│     │     └─ AGENDAMENTO_LOGIN_NECESSARIO
│     │        ├─ Ir para a tela de login
│     │        │  └─ Redireciona para a tela de login (/login)
│     │        └─ Voltar para o inicio
│     │           └─ INICIO
│     └─ Voltar para o inicio
│        └─ INICIO
│
├─ Falar sobre financiamento
│  └─ FINANCIAMENTO
│     ├─ Simulação
│     │  └─ SIMULACAO
│     │     ├─ Falar com corretor
│     │     │  └─ Abre o formulário de triagem para WhatsApp
│     │     └─ Voltar para o inicio
│     │        └─ INICIO
│     ├─ Taxas
│     │  └─ TAXAS
│     │     ├─ Falar com corretor
│     │     │  └─ Abre o formulário de triagem para WhatsApp
│     │     └─ Voltar para o inicio
│     │        └─ INICIO
│     ├─ Documentos necessários
│     │  └─ DOCUMENTOS
│     │     ├─ Falar com corretor
│     │     │  └─ Abre o formulário de triagem para WhatsApp
│     │     └─ Voltar para o inicio
│     │        └─ INICIO
│     └─ Voltar para o inicio
│        └─ INICIO
│
└─ Voltar para o inicio
   └─ INICIO
```

## Ações Especiais

### 1. Redirecionamento para imóveis
- Opção: Ver Imóveis
- Ação: fecha o chatbot e navega para /imoveis

### 2. Validação de agendamento
- Opção: Agendar agora!
- Regra: o chatbot verifica se existem jwtToken e userId no sessionStorage
- Se autenticado: redireciona para /agenda
- Se não autenticado: exibe a mensagem de login necessário e mostra a opção Ir para a tela de login

### 3. Formulário de triagem para WhatsApp
- Opção: Falar com corretor
- Ação: fecha o chatbot e abre o modal de triagem
- O formulário coleta dados básicos e envia a mensagem para o WhatsApp
