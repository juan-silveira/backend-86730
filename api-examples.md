# API Examples - MongoDB Edition

## Produtos

### 1. Listar todos os produtos (com paginação)
```http
GET /api/products
```
**Resposta:**
```json
{
  "status": "success",
  "payload": [
    {
      "_id": "65f4b1234567890abcdef123",
      "title": "Smartphone Samsung Galaxy S24",
      "description": "Smartphone Android com 128GB de armazenamento",
      "code": "SMART001",
      "price": 2999.99,
      "status": true,
      "stock": 25,
      "category": "smartphones",
      "thumbnails": ["samsung_s24_front.jpg"],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalPages": 5,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "/api/products?page=2&limit=10"
}
```

### 2. Listar produtos com filtros e paginação
```http
GET /api/products?limit=5&page=1&sort=asc&query=smartphones
```
**Resposta:**
```json
{
  "status": "success",
  "payload": [
    {
      "_id": "65f4b1234567890abcdef123",
      "title": "Smartphone Samsung Galaxy S24",
      "price": 2999.99,
      "category": "smartphones"
    }
  ],
  "totalPages": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "/api/products?page=2&limit=5&sort=asc&query=smartphones"
}
```

### 3. Buscar produto por ID
```http
GET /api/products/65f4b1234567890abcdef123
```
**Resposta:**
```json
{
  "_id": "65f4b1234567890abcdef123",
  "title": "Smartphone Samsung Galaxy S24",
  "description": "Smartphone Android com 128GB de armazenamento",
  "code": "SMART001",
  "price": 2999.99,
  "status": true,
  "stock": 25,
  "category": "smartphones",
  "thumbnails": ["samsung_s24_front.jpg"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. Criar novo produto
```http
POST /api/products
Content-Type: application/json

{
  "title": "Notebook Gamer Alienware",
  "description": "Notebook para jogos com RTX 4060",
  "code": "ALIEN001",
  "price": 8999.99,
  "status": true,
  "stock": 10,
  "category": "notebooks",
  "thumbnails": ["alienware_1.jpg", "alienware_2.jpg"]
}
```
**Resposta:**
```json
{
  "message": "Produto criado com sucesso",
  "product": {
    "_id": "65f4b9876543210abcdef456",
    "title": "Notebook Gamer Alienware",
    "description": "Notebook para jogos com RTX 4060",
    "code": "ALIEN001",
    "price": 8999.99,
    "status": true,
    "stock": 10,
    "category": "notebooks",
    "thumbnails": ["alienware_1.jpg", "alienware_2.jpg"],
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 5. Atualizar produto
```http
PUT /api/products/65f4b9876543210abcdef456
Content-Type: application/json

{
  "price": 7999.99,
  "stock": 15
}
```
**Resposta:**
```json
{
  "message": "Produto atualizado com sucesso",
  "product": {
    "_id": "65f4b9876543210abcdef456",
    "title": "Notebook Gamer Alienware",
    "price": 7999.99,
    "stock": 15
  }
}
```

### 6. Deletar produto
```http
DELETE /api/products/65f4b9876543210abcdef456
```
**Resposta:**
```json
{
  "message": "Produto deletado com sucesso",
  "product": {
    "_id": "65f4b9876543210abcdef456",
    "title": "Notebook Gamer Alienware"
  }
}
```

## Carrinhos

### 1. Listar todos os carrinhos
```http
GET /api/carts
```
**Resposta:**
```json
[
  {
    "_id": "65f4c1234567890abcdef789",
    "products": [
      {
        "product": {
          "_id": "65f4b1234567890abcdef123",
          "title": "Smartphone Samsung Galaxy S24",
          "price": 2999.99,
          "category": "smartphones"
        },
        "quantity": 2
      }
    ],
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:30:00.000Z"
  }
]
```

### 2. Criar novo carrinho
```http
POST /api/carts
```
**Resposta:**
```json
{
  "message": "Carrinho criado com sucesso",
  "cart": {
    "_id": "65f4c9876543210abcdef012",
    "products": [],
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  }
}
```

### 3. Buscar carrinho por ID (com populate)
```http
GET /api/carts/65f4c1234567890abcdef789
```
**Resposta:**
```json
{
  "_id": "65f4c1234567890abcdef789",
  "products": [
    {
      "product": {
        "_id": "65f4b1234567890abcdef123",
        "title": "Smartphone Samsung Galaxy S24",
        "description": "Smartphone Android com 128GB de armazenamento",
        "code": "SMART001",
        "price": 2999.99,
        "status": true,
        "stock": 25,
        "category": "smartphones",
        "thumbnails": ["samsung_s24_front.jpg"]
      },
      "quantity": 2
    }
  ],
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-15T12:30:00.000Z"
}
```

### 4. Adicionar produto ao carrinho
```http
POST /api/carts/65f4c9876543210abcdef012/product/65f4b1234567890abcdef123
Content-Type: application/json

{
  "quantity": 3
}
```
**Resposta:**
```json
{
  "message": "Produto adicionado ao carrinho com sucesso",
  "cart": {
    "_id": "65f4c9876543210abcdef012",
    "products": [
      {
        "product": {
          "_id": "65f4b1234567890abcdef123",
          "title": "Smartphone Samsung Galaxy S24",
          "price": 2999.99
        },
        "quantity": 3
      }
    ]
  }
}
```

### 5. Atualizar quantidade de produto no carrinho
```http
PUT /api/carts/65f4c9876543210abcdef012/products/65f4b1234567890abcdef123
Content-Type: application/json

{
  "quantity": 5
}
```
**Resposta:**
```json
{
  "message": "Quantidade atualizada com sucesso",
  "cart": {
    "_id": "65f4c9876543210abcdef012",
    "products": [
      {
        "product": {
          "_id": "65f4b1234567890abcdef123",
          "title": "Smartphone Samsung Galaxy S24"
        },
        "quantity": 5
      }
    ]
  }
}
```

### 6. Atualizar carrinho completo
```http
PUT /api/carts/65f4c9876543210abcdef012
Content-Type: application/json

{
  "products": [
    {
      "product": "65f4b1234567890abcdef123",
      "quantity": 2
    },
    {
      "product": "65f4b1234567890abcdef124",
      "quantity": 1
    }
  ]
}
```
**Resposta:**
```json
{
  "message": "Carrinho atualizado com sucesso",
  "cart": {
    "_id": "65f4c9876543210abcdef012",
    "products": [
      {
        "product": {
          "_id": "65f4b1234567890abcdef123",
          "title": "Smartphone Samsung Galaxy S24",
          "price": 2999.99
        },
        "quantity": 2
      },
      {
        "product": {
          "_id": "65f4b1234567890abcdef124",
          "title": "Notebook Dell Inspiron 15",
          "price": 3599.90
        },
        "quantity": 1
      }
    ]
  }
}
```

### 7. Remover produto específico do carrinho
```http
DELETE /api/carts/65f4c9876543210abcdef012/products/65f4b1234567890abcdef123
```
**Resposta:**
```json
{
  "message": "Produto removido do carrinho com sucesso",
  "cart": {
    "_id": "65f4c9876543210abcdef012",
    "products": [
      {
        "product": {
          "_id": "65f4b1234567890abcdef124",
          "title": "Notebook Dell Inspiron 15"
        },
        "quantity": 1
      }
    ]
  }
}
```

### 8. Limpar carrinho (remover todos os produtos)
```http
DELETE /api/carts/65f4c9876543210abcdef012
```
**Resposta:**
```json
{
  "message": "Todos os produtos foram removidos do carrinho",
  "cart": {
    "_id": "65f4c9876543210abcdef012",
    "products": []
  }
}
```

## Filtros Avançados de Produtos

### Produtos disponíveis
```http
GET /api/products?query=available
```

### Produtos indisponíveis
```http
GET /api/products?query=unavailable
```

### Produtos por categoria
```http
GET /api/products?query=smartphones
```

### Produtos ordenados por preço (crescente)
```http
GET /api/products?sort=asc
```

### Produtos ordenados por preço (decrescente)
```http
GET /api/products?sort=desc
```

### Combinação de filtros
```http
GET /api/products?limit=5&page=2&sort=desc&query=available
```

## Views (Interface Web)

### Página inicial
```http
GET /
```

### Catálogo de produtos com paginação
```http
GET /products?limit=10&page=1&sort=asc&query=smartphones
```

### Detalhes de um produto
```http
GET /products/65f4b1234567890abcdef123
```

### Visualizar carrinho
```http
GET /carts/65f4c1234567890abcdef789
```

### Interface de administração em tempo real
```http
GET /realtimeproducts
```

## Códigos de Status HTTP

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Dados inválidos
- **404** - Recurso não encontrado
- **500** - Erro interno do servidor

## Estrutura de Erro Padrão

```json
{
  "error": "Mensagem de erro descritiva"
}
```