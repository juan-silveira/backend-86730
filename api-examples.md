# Exemplos de Uso da API com Postman/Insomnia

Este guia demonstra como testar todas as funcionalidades da API usando uma ferramenta de cliente de API visual como Postman ou Insomnia.

## Produtos

### 1. Listar todos os produtos
- **Método:** `GET`
- **URL:** `http://localhost:8080/api/products`

### 2. Buscar produto por ID
- **Método:** `GET`
- **URL:** `http://localhost:8080/api/products/1`

### 3. Criar novo produto
- **Método:** `POST`
- **URL:** `http://localhost:8080/api/products`
- **Headers:**
  - `Content-Type`: `application/json`
- **Body** (selecione `raw` e `JSON`):
  ```json
  {
    "title": "Smartphone iPhone 15",
    "description": "iPhone 15 com 128GB de armazenamento",
    "code": "IPHONE001",
    "price": 4999.99,
    "stock": 30,
    "category": "smartphones",
    "thumbnails": ["iphone15_front.jpg", "iphone15_back.jpg"]
  }
  ```

### 4. Atualizar produto
- **Método:** `PUT`
- **URL:** `http://localhost:8080/api/products/1`
- **Headers:**
  - `Content-Type`: `application/json`
- **Body** (selecione `raw` e `JSON`):
  ```json
  {
    "price": 2799.99,
    "stock": 20
  }
  ```

### 5. Deletar produto
- **Método:** `DELETE`
- **URL:** `http://localhost:8080/api/products/10`

## Carrinhos

### 1. Listar todos os carrinhos
- **Método:** `GET`
- **URL:** `http://localhost:8080/api/carts`

### 2. Criar novo carrinho
- **Método:** `POST`
- **URL:** `http://localhost:8080/api/carts`

### 3. Listar produtos do carrinho
- **Método:** `GET`
- **URL:** `http://localhost:8080/api/carts/1`

### 4. Adicionar produto ao carrinho
- **Método:** `POST`
- **URL:** `http://localhost:8080/api/carts/1/product/1`
- **Headers:**
  - `Content-Type`: `application/json`
- **Body** (selecione `raw` e `JSON`):
  ```json
  {
    "quantity": 3
  }
  ```

### 5. Adicionar outro produto ao carrinho
- **Método:** `POST`
- **URL:** `http://localhost:8080/api/carts/1/product/3`
- **Headers:**
  - `Content-Type`: `application/json`
- **Body** (selecione `raw` e `JSON`):
  ```json
  {
    "quantity": 1
  }
  ```

### 6. Incrementar quantidade de produto no carrinho (+1)
- **Método:** `PUT`
- **URL:** `http://localhost:8080/api/carts/1/product/1`
- **Observação:** Incrementa automaticamente +1 na quantidade do produto

### 7. Remover produto do carrinho
- **Método:** `DELETE`
- **URL:** `http://localhost:8080/api/carts/1/product/3`

### 8. Deletar carrinho vazio
- **Método:** `DELETE`
- **URL:** `http://localhost:8080/api/carts/1`
- **Observação:** Só funciona se o carrinho estiver vazio (sem produtos)

## Fluxo Completo de Teste

Para executar um fluxo contínuo, você pode usar variáveis de ambiente no Postman/Insomnia.

### 0. Visualizar carrinhos existentes (opcional)
- Execute a requisição para listar todos os carrinhos:
  - **Método:** `GET`
  - **URL:** `http://localhost:8080/api/carts`

### 1. Criar um carrinho
- Execute a requisição para criar um novo carrinho:
  - **Método:** `POST`
  - **URL:** `http://localhost:8080/api/carts`
- Na resposta, copie o valor do `id` do carrinho.
- Crie uma variável de ambiente (ex: `CART_ID`) e cole o ID copiado.

### 2. Adicionar produtos ao carrinho
- Agora, use a variável `CART_ID` nas URLs das próximas requisições. A sintaxe pode variar (ex: `{{CART_ID}}` no Postman ou `_.CART_ID` no Insomnia).

- **Adicionar Samsung Galaxy S24:**
  - **Método:** `POST`
  - **URL:** `http://localhost:8080/api/carts/{{CART_ID}}/product/1`
  - **Headers:** `Content-Type`: `application/json`
  - **Body** (raw/JSON):
    ```json
    { "quantity": 2 }
    ```

- **Adicionar Fone Sony:**
  - **Método:** `POST`
  - **URL:** `http://localhost:8080/api/carts/{{CART_ID}}/product/3`
  - **Headers:** `Content-Type`: `application/json`
  - **Body** (raw/JSON):
    ```json
    { "quantity": 1 }
    ```

### 3. Incrementar quantidade de um produto
- **Método:** `PUT`
- **URL:** `http://localhost:8080/api/carts/{{CART_ID}}/product/1`
- **Observação:** Aumenta +1 na quantidade do Samsung Galaxy S24

### 4. Visualizar carrinho atualizado
- **Método:** `GET`
- **URL:** `http://localhost:8080/api/carts/{{CART_ID}}`

### 5. Remover todos os produtos e deletar carrinho
- **Remover Samsung Galaxy S24:**
  - **Método:** `DELETE`
  - **URL:** `http://localhost:8080/api/carts/{{CART_ID}}/product/1`

- **Remover Fone Sony:**
  - **Método:** `DELETE`
  - **URL:** `http://localhost:8080/api/carts/{{CART_ID}}/product/3`

- **Deletar carrinho vazio:**
  - **Método:** `DELETE`
  - **URL:** `http://localhost:8080/api/carts/{{CART_ID}}`

## Testes de Validação

### 1. Tentar criar produto com campos faltando
- **Método:** `POST`
- **URL:** `http://localhost:8080/api/products`
- **Headers:** `Content-Type`: `application/json`
- **Body** (raw/JSON):
  ```json
  {
    "title": "Produto Incompleto"
  }
  ```

### 2. Tentar buscar produto inexistente
- **Método:** `GET`
- **URL:** `http://localhost:8080/api/products/999`

### 3. Tentar adicionar produto a carrinho inexistente
- **Método:** `POST`
- **URL:** `http://localhost:8080/api/carts/999/product/1`
- **Headers:** `Content-Type`: `application/json`
- **Body** (raw/JSON):
  ```json
  { "quantity": 1 }
  ```

### 4. Tentar adicionar produto inexistente ao carrinho
- **Método:** `POST`
- **URL:** `http://localhost:8080/api/carts/1/product/999`
- **Headers:** `Content-Type`: `application/json`
- **Body** (raw/JSON):
  ```json
  { "quantity": 1 }
  ```

### 5. Tentar adicionar mais produtos do que o estoque (PlayStation 5 tem estoque 0)
- **Método:** `POST`
- **URL:** `http://localhost:8080/api/carts/1/product/10`
- **Headers:** `Content-Type`: `application/json`
- **Body** (raw/JSON):
  ```json
  { "quantity": 1 }
  ```

### 6. Tentar remover produto que não existe no carrinho
- **Método:** `DELETE`
- **URL:** `http://localhost:8080/api/carts/1/product/999`

### 7. Tentar deletar carrinho que ainda tem produtos
- **Método:** `DELETE`
- **URL:** `http://localhost:8080/api/carts/1`
- **Observação:** Deve retornar erro se o carrinho não estiver vazio

## Produtos Disponíveis para Teste

- ID 1: Smartphone Samsung Galaxy S24 (R$ 2.999,99) - Estoque: 25
- ID 2: Notebook Dell Inspiron 15 (R$ 3.599,90) - Estoque: 15
- ID 3: Fone de Ouvido Sony WH-1000XM5 (R$ 1.299,99) - Estoque: 40
- ID 4: Smart TV LG 55 4K UHD (R$ 2.499,00) - Estoque: 8
- ID 5: Mouse Gamer Logitech G Pro X (R$ 299,90) - Estoque: 60
- ID 6: Tablet iPad Air 5ª geração (R$ 4.199,00) - Estoque: 12
- ID 7: Teclado Mecânico Keychron K2 (R$ 459,99) - Estoque: 35
- ID 8: Câmera DSLR Canon EOS Rebel T7 (R$ 2.199,00) - Estoque: 6
- ID 9: Smartwatch Apple Watch Series 9 (R$ 1.999,00) - Estoque: 20
- ID 10: Console PlayStation 5 (R$ 3.999,99) - **SEM ESTOQUE** (status: false)