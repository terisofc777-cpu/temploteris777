# 🧪 Teste de Configurações em Tempo Real

## Como Testar as Configurações

### 1. Preparação
1. Abra duas abas do navegador
2. Na primeira aba, abra `http://localhost:8000/templo-interno.html`
3. Na segunda aba, abra `http://localhost:8000/admin-panel.html`
4. Faça login no painel admin com a senha: `MariaIsabel112233445566`

### 2. Teste de Pedidos Gratuitos
1. No painel admin, vá para a aba "Configurações"
2. Desmarque a caixa "Pedidos Gratuitos Ativos"
3. Clique em "💾 Salvar Configurações"
4. **Resultado esperado**: Na aba do templo interior, a seção de pedidos gratuitos deve ser desabilitada imediatamente (mostrando mensagem de manutenção)

### 3. Teste de Encomendas
1. No painel admin, desmarque a caixa "Encomendas Ativas"
2. Clique em "💾 Salvar Configurações"
3. **Resultado esperado**: Na aba do templo interior, a seção de encomendas deve ser desabilitada imediatamente

### 4. Teste de Reativação
1. No painel admin, marque novamente as caixas "Pedidos Gratuitos Ativos" e "Encomendas Ativas"
2. Clique em "💾 Salvar Configurações"
3. **Resultado esperado**: As seções devem ser reativadas imediatamente com os formulários funcionais

### 5. Teste de Modo Manutenção
1. No painel admin, marque a caixa "Modo de Manutenção"
2. Clique em "💾 Salvar Configurações"
3. **Resultado esperado**: A página do templo interior deve mostrar a tela de manutenção

### 6. Verificação de Layout
- ✅ As seções devem estar organizadas verticalmente (uma por linha)
- ✅ Não deve haver seções lado a lado
- ✅ O layout deve ser responsivo

### 7. Teste da Seção "Em Breve"
1. Na aba do templo interior, procure pela seção "📘 Em Breve - Manual Teris Completo"
2. **Resultado esperado**: Deve mostrar apenas "Para mais informações entre em contato comigo pelo email" em verde

### 8. Teste de Detalhes de Pedidos/Encomendas
1. No painel admin, vá para a aba "Pedidos Gratuitos"
2. Clique no botão "👁️ Ver" em qualquer pedido
3. **Resultado esperado**: Deve abrir um modal com todos os detalhes do pedido (nome, email, pedido, visibilidade YouTube, mensagem adicional, etc.)

4. No painel admin, vá para a aba "Encomendas"
5. Clique no botão "👁️ Ver" em qualquer encomenda
6. **Resultado esperado**: Deve abrir um modal com todos os detalhes da encomenda (nome, email, pedido, método de entrega, pacote, valor, mensagem adicional, etc.)

## Problemas Comuns e Soluções

### Se as configurações não estão sendo salvas:
1. Verifique se o servidor Flask está rodando (`py app.py`)
2. Abra o console do navegador (F12) e verifique se há erros
3. Verifique se a API está respondendo em `http://localhost:5000/api/configuracoes`

### Se as mudanças não aparecem em tempo real:
1. Verifique se ambas as abas estão abertas
2. Recarregue a página do templo interior
3. Verifique o console para mensagens de debug

### Se o layout não está vertical:
1. Limpe o cache do navegador (Ctrl+F5)
2. Verifique se o CSS foi atualizado corretamente

### Se os detalhes de pedidos/encomendas não aparecem:
1. Verifique se o servidor Flask está rodando
2. Verifique se há erros no console do navegador
3. Teste se a API está respondendo em `http://localhost:5000/api/pedido/gratuito/1` (substitua 1 por um ID válido)

## Logs de Debug

No console do navegador, você deve ver mensagens como:
- `🔔 Recebidas configurações alteradas:`
- `🔧 Aplicando configurações:`
- `✅ Configurações aplicadas com sucesso`
- `💾 Configurações salvas no localStorage`
- `📋 Carregando detalhes do pedido #X`
- `📦 Carregando detalhes da encomenda #X`

## Status Esperado

✅ **Layout Vertical**: Todas as seções em uma coluna
✅ **Configurações Persistem**: Mudanças ficam salvas após recarregar
✅ **Tempo Real**: Mudanças aparecem instantaneamente
✅ **Notificações**: Mensagens de confirmação aparecem
✅ **Formulários Restaurados**: Seções reativadas mostram formulários funcionais
✅ **Seção Em Breve Simplificada**: Mostra apenas a mensagem de contato
✅ **Detalhes de Pedidos**: Modal com informações completas
✅ **Detalhes de Encomendas**: Modal com informações completas

