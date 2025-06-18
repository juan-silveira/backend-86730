# E-commerce Backend API

API REST desenvolvida em Node.js com Express para gerenciamento de produtos e carrinhos de compras.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **File System** - Persistência em arquivos JSON
- **IDs Incrementais** - Sistema de geração automática de IDs

## 📁 Estrutura do Projeto

```
src/
├── app.js              # Arquivo principal da aplicação
├── managers/           # Classes para gerenciamento de dados
│   ├── ProductManager.js
│   └── CartManager.js
├── routes/             # Definição das rotas
│   ├── products.js
│   └── carts.js
└── data/               # Arquivos de persistência (criados automaticamente)
    ├── products.json
    └── carts.json
```


## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos para executar

1.  **Clone o repositório**
    ```bash
    git clone <url-do-repositorio>
    cd ecommerce-backend
    ```
2.  **Instale as dependências**
    ```bash
    npm install
    ```
3.  **Execute o servidor**
    ```bash
    # Desenvolvimento (com nodemon)
    npm run dev

    # Produção
    npm start
    ```
4.  **Acesse a aplicação**
    O servidor estará rodando em: `http://localhost:8080`

## 📚 Documentação da API

### Produtos

#### Listar todos os produtos
- **GET** `/api/products/`
- **Resposta**: Array com todos os produtos

#### Buscar produto por ID
- **GET** `/api/products/:pid`
- **Parâmetros**: `pid` - ID do produto
- **Resposta**: Objeto do produto ou erro 404

#### Criar novo produto
- **POST** `/api/products/`
- **Body**:
  ```json
  {
    "title": "Nome do produto",
    "description": "Descrição do produto",
    "code": "CODIGO_UNICO",
    "price": 99.99,
    "status": true,
    "stock": 10,
    "category": "categoria",
    "thumbnails": ["imagem1.jpg", "imagem2.jpg"]
  }
  ```

#### Atualizar produto
- **PUT** `/api/products/:pid`
- **Parâmetros**: `pid` - ID do produto
- **Body**: Campos que deseja atualizar

#### Deletar produto
- **DELETE** `/api/products/:pid`
- **Parâmetros**: `pid` - ID do produto

### Carrinhos

#### Criar novo carrinho
- **POST** `/api/carts/`
- **Resposta**: Novo carrinho criado

#### Listar produtos do carrinho
- **GET** `/api/carts/:cid`
- **Parâmetros**: `cid` - ID do carrinho

#### Adicionar produto ao carrinho
- **POST** `/api/carts/:cid/product/:pid`
- **Parâmetros**:
    - `cid` - ID do carrinho
    - `pid` - ID do produto
- **Body** (opcional):
  ```json
  {
    "quantity": 2
  }
  ```

#### Remover produto do carrinho
- **DELETE** `/api/carts/:cid/product/:pid`
- **Parâmetros**:
    - `cid` - ID do carrinho
    - `pid` - ID do produto

#### Atualizar quantidade do produto no carrinho
- **PUT** `/api/carts/:cid/product/:pid`
- **Parâmetros**:
    - `cid` - ID do carrinho
    - `pid` - ID do produto
- **Body**:
  ```json
  {
    "quantity": 5
  }
  ```

## 🧪 Testando a API com Postman/Insomnia

Você pode testar a API usando ferramentas como Postman, Insomnia ou a extensão Thunder Client do VS Code. Veja como fazer as requisições básicas:

### Criar um novo produto
- **Método:** `POST`
- **URL:** `http://localhost:8080/api/products/`
- **Headers:** Defina o `Content-Type` como `application/json`.
- **Body:** Selecione a opção `raw` e formato `JSON`, e insira o conteúdo:
  ```json
  {
    "title": "Smartphone",
    "description": "Smartphone Android",
    "code": "SMART001",
    "price": 899.99,
    "stock": 50,
    "category": "electronics"
  }
  ```

### Criar um novo carrinho
- **Método:** `POST`
- **URL:** `http://localhost:8080/api/carts/`
- A resposta conterá o novo carrinho com seu ID.

### Adicionar produto ao carrinho
- **Método:** `POST`
- **URL:** `http://localhost:8080/api/carts/{cart-id}/product/{product-id}`
  - **Atenção:** Substitua `{cart-id}` pelo ID do carrinho criado no passo anterior e `{product-id}` pelo ID de um produto existente (veja a lista de produtos pré-carregados).
- **Headers:** Defina o `Content-Type` como `application/json`.
- **Body:** (Opcional, para adicionar mais de uma unidade) Selecione `raw` e `JSON`:
  ```json
  {
    "quantity": 2
  }
  ```

## 💾 Persistência

Os dados são armazenados em arquivos JSON na pasta `src/data/`:
- `products.json` - Armazena todos os produtos
- `carts.json` - Armazena todos os carrinhos

### Produtos Pré-carregados

O sistema já vem com 10 produtos de exemplo:
1.  **Smartphone Samsung Galaxy S24** (ID: 1) - R$ 2.999,99
2.  **Notebook Dell Inspiron 15** (ID: 2) - R$ 3.599,90
3.  **Fone de Ouvido Sony WH-1000XM5** (ID: 3) - R$ 1.299,99
4.  **Smart TV LG 55 4K UHD** (ID: 4) - R$ 2.499,00
5.  **Mouse Gamer Logitech G Pro X** (ID: 5) - R$ 299,90
6.  **Tablet iPad Air 5ª geração** (ID: 6) - R$ 4.199,00
7.  **Teclado Mecânico Keychron K2** (ID: 7) - R$ 459,99
8.  **Câmera DSLR Canon EOS Rebel T7** (ID: 8) - R$ 2.199,00
9.  **Smartwatch Apple Watch Series 9** (ID: 9) - R$ 1.999,00
10. **Console PlayStation 5** (ID: 10) - R$ 3.999,99 (Sem estoque)

## ⚠️ Validações

### Produtos
- Todos os campos obrigatórios devem ser preenchidos
- Código do produto deve ser único
- O ID é gerado automaticamente de forma incremental e não pode ser alterado
- O próximo ID é sempre o último ID + 1

### Carrinhos
- Verificação de existência do carrinho e produto
- Controle de estoque ao adicionar produtos
- Incremento automático da quantidade para produtos existentes

## 🐛 Tratamento de Erros

A API possui tratamento de erros abrangente:
- **400** - Dados inválidos ou campos obrigatórios faltando
- **404** - Recurso não encontrado
- **500** - Erro interno do servidor

## 🚀 Próximos Passos

Para expandir a aplicação, considere implementar:
- Autenticação e autorização
- Validação com middlewares
- Logs estruturados
- Testes automatizados
- Banco de dados (MongoDB, PostgreSQL)
- Documentação com Swagger

## 📝 Licença

Este projeto está sob a licença ISC.