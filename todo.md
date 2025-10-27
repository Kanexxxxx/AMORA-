# Amora Makeup E-commerce - TODO

## 🎨 Design e Estrutura Base
- [x] Configurar paleta de cores (rosa, branco, preto) e tipografia (Poppins/Montserrat) no index.css
- [x] Criar componentes de layout base (Header, Footer, Navigation)
- [x] Implementar design responsivo com Tailwind CSS

## 🏠 Página Inicial
- [x] Banner principal com imagens em alta resolução e chamadas para promoções
- [x] Sessão "Destaques da Semana" com produtos mais vendidos
- [x] Sessão de categorias (batons, sombras, pincéis, skincare, perfumes, etc)
- [x] Avaliações de clientes com estrelas e fotos
- [x] Rodapé completo com informações de contato, políticas e redes sociais
- [x] Newsletter para captar e-mails de clientes

## 🛍️ Página de Produtos
- [x] Grade de produtos com imagem, nome, preço e botão "Adicionar ao Carrinho"
- [x] Filtros por categoria, marca, preço e avaliação
- [x] Opção de ordenação (maior preço, menor preço, mais vendidos, novidades)
- [x] Página individual do produto com galeria de fotos, descrição completa, avaliações e botão de compra

## 🛒 Carrinho de Compras
- [x] Visual limpo com resumo de itens, quantidade, preço e total
- [x] Atualização automática do valor ao alterar quantidade
- [x] Botão de continuar comprando e botão de finalizar compra

## 💳 Checkout
- [x] Login/cadastro de cliente
- [x] Endereço de entrega com autocomplete (API do Google Maps)
- [ ] Cálculo automático de frete e prazo (Correios API)
- [x] Métodos de pagamento integrados (PIX, Cartão de Crédito, Boleto)
- [ ] Confirmação automática via e-mail e painel do cliente

## 👤 Login / Cadastro
- [x] Cadastro com nome, e-mail, senha e número de WhatsApp
- [x] Login com opção de "Esqueci minha senha"
- [x] Login social (Google e Facebook, se possível)

## 🧾 Área do Cliente
- [x] Histórico de pedidos com status
- [x] Dados pessoais e endereço de entrega
- [ ] Atualização de senha e informações

## 💬 Chat de Atendimento (WhatsApp)
- [x] Ícone fixo no canto inferior direito
- [x] Link direto do WhatsApp com mensagem automática

## 🧰 Painel Administrativo
- [x] Login exclusivo para administrador
- [x] Cadastro, edição e exclusão de produtos
- [ ] Upload de imagens de produtos
- [x] Controle de estoque e pedidos
- [ ] Gerenciamento de categorias
- [x] Visualização de pedidos e status

## 🔍 Funcionalidades Adicionais
- [x] Barra de pesquisa inteligente com sugestões automáticas
- [x] Sistema de avaliações de produtos
- [ ] Sistema de favoritos/wishlist

## 🆕 Novas Funcionalidades Solicitadas
- [x] Buscar e adicionar produtos reais do site https://amoramakeup.com/store
- [x] Remover todos os produtos de exemplo
- [x] Remover seção "O que nossas clientes dizem" da página inicial
- [x] Ajustar cores do site para corresponder à identidade visual original
- [x] Expandir painel administrativo com visualização completa de pedidos
- [x] Adicionar filtros de status no painel admin (pendente, pago, processando, enviado, entregue)
- [x] Implementar atualização de status de pedidos no admin
- [x] Adicionar campo para código de rastreamento no admin
- [ ] Implementar sistema de e-mails automáticos (pedido realizado, confirmado, enviado, entregue)
- [ ] Adicionar histórico de rastreamento na área do cliente

## 🗄️ Banco de Dados
- [x] Tabela de produtos (nome, descrição, preço, estoque, categoria, imagens)
- [x] Tabela de categorias
- [x] Tabela de pedidos (usuário, produtos, total, status, endereço)
- [x] Tabela de itens do pedido
- [x] Tabela de avaliações de produtos
- [x] Tabela de endereços de entrega
- [x] Tabela de carrinho de compras

## 🔌 Integrações
- [ ] Integração com S3 para upload de imagens de produtos
- [ ] Integração com API de pagamento (Mercado Pago ou similar)
- [ ] Integração com API de cálculo de frete (Correios)
- [ ] Integração com WhatsApp para atendimento

## ✅ Testes e Otimização
- [ ] Testes de responsividade (mobile, tablet, desktop)
- [ ] Otimização de performance e velocidade
- [ ] Testes de fluxo de compra completo
- [ ] Verificação de acessibilidade

