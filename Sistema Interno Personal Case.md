# Sistema Interno Personal Case

## Visão Geral

O Sistema Interno Personal Case é uma aplicação web completa desenvolvida especificamente para gerenciar as operações da empresa Personal Case, especializada em personalização de copos. O sistema oferece uma interface moderna e intuitiva para gerenciar todos os aspectos do negócio.

## Módulos Implementados

### 1. Próximos Eventos
- **Funcionalidades**: Gerenciamento de eventos futuros com artistas
- **Campos**: Nome do evento, artista, quantidade de copos, status, data do evento
- **Visualizações**: Lista detalhada e calendário
- **Status disponíveis**: Feito, Em Execução, Cancelado

### 2. Pedidos de Clientes
- **Funcionalidades**: Controle completo do fluxo de pedidos
- **Campos**: Nome do cliente, data do pedido, tipo de copo, quantidade, arte enviada, prazo de entrega, status, observações
- **Visualizações**: Kanban por status e tabela detalhada
- **Status disponíveis**: Pendente, Em produção, Pronto, Entregue

### 3. Ideias de Produtos
- **Funcionalidades**: Banco de ideias para novos produtos
- **Campos**: Título da ideia, categoria, descrição, potencial, imagem de referência
- **Visualizações**: Galeria visual e lista
- **Categorias**: Sertanejo, Urbano, Infantil, Outros
- **Potencial**: Alto, Médio, Baixo

### 4. Influenciadores
- **Funcionalidades**: Gestão de parcerias com influenciadores
- **Campos**: Nome, Instagram, nicho, alcance estimado, status de recebimento, resultado, observações
- **Visualizações**: Lista com filtros e estatísticas
- **Filtros**: Por nicho e status de recebimento

## Características Técnicas

### Frontend
- **Tecnologia**: React com Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Ícones**: Lucide React
- **Responsivo**: Compatível com desktop e mobile

### Backend
- **Tecnologia**: Flask (Python)
- **Banco de Dados**: SQLite
- **API**: RESTful com CORS habilitado
- **Autenticação**: Preparado para implementação futura

### Design
- **Identidade Visual**: Baseada no logo da Personal Case
- **Cores**: Paleta laranja/vermelho do logo
- **Layout**: Interface moderna com navegação por abas

## Estrutura do Projeto

```
personal-case-system/
├── backend/
│   ├── src/
│   │   ├── models/          # Modelos de dados
│   │   ├── routes/          # Rotas da API
│   │   ├── database/        # Banco de dados SQLite
│   │   └── main.py         # Arquivo principal
│   ├── venv/               # Ambiente virtual Python
│   └── requirements.txt    # Dependências Python
└── frontend/
    ├── src/
    │   ├── components/     # Componentes React
    │   ├── assets/         # Imagens e recursos
    │   └── App.jsx        # Componente principal
    ├── public/            # Arquivos públicos
    └── package.json       # Dependências Node.js
```

## Como Executar

### Backend
1. Navegue até a pasta backend
2. Ative o ambiente virtual: `source venv/bin/activate`
3. Execute: `python src/main.py`
4. O servidor estará disponível em: http://localhost:5001

### Frontend
1. Navegue até a pasta frontend
2. Execute: `pnpm run dev --host`
3. A aplicação estará disponível em: http://localhost:5173

## Funcionalidades Principais

### Operações CRUD Completas
- Criar, ler, atualizar e excluir registros em todos os módulos
- Formulários validados com campos obrigatórios
- Confirmação antes de exclusões

### Visualizações Especializadas
- **Kanban**: Para acompanhar o fluxo de pedidos
- **Galeria**: Para visualizar ideias de produtos
- **Filtros**: Para encontrar informações específicas
- **Estatísticas**: Dashboard com métricas dos influenciadores

### Interface Responsiva
- Design adaptável para diferentes tamanhos de tela
- Navegação intuitiva por abas
- Modais para formulários
- Feedback visual para ações do usuário

## Próximos Passos Sugeridos

1. **Autenticação**: Implementar sistema de login
2. **Relatórios**: Adicionar geração de relatórios em PDF
3. **Notificações**: Sistema de alertas para prazos
4. **Backup**: Implementar backup automático do banco
5. **Deploy**: Configurar para produção em servidor

## Suporte

O sistema foi desenvolvido com tecnologias modernas e bem documentadas. Para manutenção e expansão, recomenda-se:

- Conhecimento em React/JavaScript para frontend
- Conhecimento em Python/Flask para backend
- Familiaridade com SQLite para banco de dados

## Conclusão

O Sistema Interno Personal Case oferece uma solução completa e moderna para gerenciar todas as operações da empresa, desde o planejamento de eventos até o controle de pedidos e relacionamento com influenciadores. A interface intuitiva e as funcionalidades abrangentes proporcionam uma ferramenta poderosa para otimizar os processos internos da empresa.

