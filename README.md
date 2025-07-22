# E-commerce Backend - MongoDB Edition

Sistema de e-commerce desenvolvido com Node.js, Express, MongoDB e Socket.IO, incluindo funcionalidades avançadas de paginação, filtros e gerenciamento de carrinho.

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Socket.IO** - Comunicação em tempo real
- **Handlebars** - Engine de templates
- **Bootstrap 5** - Framework CSS
- **Hyperscript** - Biblioteca para interatividade

## Funcionalidades

### Produtos
- ✅ CRUD completo de produtos
- ✅ Paginação avançada com mongoose-paginate-v2
- ✅ Filtros por categoria e disponibilidade  
- ✅ Ordenação por preço (crescente/decrescente)
- ✅ Busca com query parameters
- ✅ Interface em tempo real com Socket.IO
- ✅ Validação de dados com Mongoose schemas

### Carrinhos
- ✅ CRUD completo de carrinhos
- ✅ Sistema de referências com populate
- ✅ Gerenciamento individual de produtos
- ✅ Atualização de quantidades
- ✅ Remoção de produtos específicos
- ✅ Limpeza completa do carrinho
- ✅ Atualização em lote de produtos

### Interface Web
- ✅ Páginas responsivas com Bootstrap
- ✅ Sistema de navegação intuitivo
- ✅ Catálogo de produtos com paginação
- ✅ Detalhes de produtos individuais
- ✅ Visualização do carrinho
- ✅ Interatividade com Hyperscript

## Estrutura do Projeto

```
src/
├── config/
│   └── database.js          # Configuração do MongoDB
├── models/
│   ├── product.model.js     # Schema de produtos
│   └── cart.model.js        # Schema de carrinhos
├── managers/
│   ├── ProductManager.js    # Lógica de negócio - produtos
│   └── CartManager.js       # Lógica de negócio - carrinhos  
├── routes/
│   ├── products.js          # Rotas da API de produtos
│   ├── carts.js            # Rotas da API de carrinhos
│   └── views.router.js     # Rotas das views
├── views/
│   ├── layouts/
│   │   └── main.handlebars  # Layout principal
│   ├── home.handlebars      # Página inicial
│   ├── products.handlebars  # Catálogo com paginação
│   ├── productDetail.handlebars # Detalhes do produto
│   ├── cart.handlebars      # Visualização do carrinho
│   └── realTimeProducts.handlebars # Gestão em tempo real
└── app.js                   # Aplicação principal
```

## Instalação e Configuração

### 1. Clonar o repositório
```bash
git clone <url-do-repositorio>
cd turma-86730
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Renomeie o arquivo `env.example` para `.env` e configure as variáveis:
```bash
cp env.example .env
```

Ou crie um arquivo `.env` na raiz do projeto:
```env
MONGO_URI=mongodb://localhost:27017/ecommerce
PORT=8080
NODE_ENV=development
```

**Para MongoDB Atlas**, substitua a MONGO_URI pela sua string de conexão:
```env
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

### 4. Migrar dados (opcional)
Se você tiver dados em JSON para migrar:
```bash
npm run migrate
```

### 5. Executar a aplicação
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## Endpoints da API

### Produtos

#### GET /api/products
Retorna produtos com paginação, filtros e ordenação.

**Query Parameters:**
- `limit` (number, opcional): Quantidade de produtos por página (padrão: 10)
- `page` (number, opcional): Página atual (padrão: 1)  
- `sort` (string, opcional): Ordenação por preço (`asc`/`desc`)
- `query` (string, opcional): Filtro por categoria ou disponibilidade

**Filtros disponíveis:**
- `available`: Produtos disponíveis
- `unavailable`: Produtos indisponíveis
- Nome da categoria (ex: `smartphones`, `notebooks`)

**Resposta:**
```json
{
  "status": "success",
  "payload": [...produtos...],
  "totalPages": 10,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "/api/products?page=1&limit=10",
  "nextLink": "/api/products?page=3&limit=10"
}
```

#### GET /api/products/:pid
Retorna um produto específico por ID.

#### POST /api/products
Cria um novo produto.

**Body:**
```json
{
  "title": "Nome do Produto",
  "description": "Descrição do produto",
  "code": "PROD-001",
  "price": 299.99,
  "status": true,
  "stock": 50,
  "category": "eletrônicos",
  "thumbnails": ["img1.jpg", "img2.jpg"]
}
```

#### PUT /api/products/:pid
Atualiza um produto existente.

#### DELETE /api/products/:pid
Remove um produto.

### Carrinhos

#### GET /api/carts
Retorna todos os carrinhos.

#### POST /api/carts
Cria um novo carrinho vazio.

#### GET /api/carts/:cid
Retorna um carrinho específico com produtos populados.

#### POST /api/carts/:cid/product/:pid
Adiciona um produto ao carrinho.

**Body:**
```json
{
  "quantity": 2
}
```

#### PUT /api/carts/:cid
Atualiza todos os produtos do carrinho.

**Body:**
```json
{
  "products": [
    {
      "product": "ObjectId_do_produto",
      "quantity": 3
    }
  ]
}
```

#### PUT /api/carts/:cid/products/:pid
Atualiza apenas a quantidade de um produto específico.

**Body:**
```json
{
  "quantity": 5
}
```

#### DELETE /api/carts/:cid/products/:pid
Remove um produto específico do carrinho.

#### DELETE /api/carts/:cid
Remove todos os produtos do carrinho (limpa o carrinho).

## Rotas das Views

- `GET /` - Página inicial com produtos em destaque
- `GET /products` - Catálogo de produtos com paginação e filtros
- `GET /products/:pid` - Detalhes de um produto específico
- `GET /carts/:cid` - Visualização do carrinho
- `GET /realtimeproducts` - Interface de gestão em tempo real

## Funcionalidades do Socket.IO

### Eventos do Cliente
- `createProduct`: Criar novo produto em tempo real
- `deleteProduct`: Remover produto em tempo real

### Eventos do Servidor
- `updateProducts`: Atualização da lista de produtos
- `error`: Notificação de erros

## Testando com Postman

O projeto inclui duas coleções do Postman:
- `Products.postman_collection.json` - Testes da API de produtos
- `Carts.postman_collection.json` - Testes da API de carrinhos

### Variáveis do Postman
- `baseUrl`: http://localhost:8080
- `cartId`: ID do carrinho para testes
- `productId`: ID do produto para testes

## Estrutura do Banco de Dados

### Collection: Products
```javascript
{
  _id: ObjectId,
  title: String,
  description: String, 
  code: String (unique),
  price: Number,
  status: Boolean,
  stock: Number,
  category: String (indexed),
  thumbnails: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: Carts
```javascript
{
  _id: ObjectId,
  products: [
    {
      product: ObjectId (ref: 'products'),
      quantity: Number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run migrate` - Migra dados do JSON para MongoDB

## Recursos Adicionais

### Populate Automático
Os carrinhos automaticamente fazem populate dos produtos referenciados, retornando informações completas.

### Paginação Inteligente
Sistema de paginação com links automáticos para navegação entre páginas.

### Validação de Dados
Mongoose schemas com validação automática de tipos e campos obrigatórios.

### Interface Responsiva
Bootstrap 5 com design responsivo para dispositivos móveis.

## Próximos Passos

- [ ] Sistema de autenticação de usuários
- [ ] Integração com gateway de pagamento
- [ ] Sistema de avaliações de produtos
- [ ] Notificações em tempo real
- [ ] Dashboard administrativo
- [ ] Relatórios de vendas

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença ISC.