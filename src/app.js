const express = require('express');
const productsRouter = require('./routes/products.js');
const cartsRouter = require('./routes/carts.js');

const app = express();
const PORT = 8080;

// Middleware para parsing de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rota raiz
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de E-commerce funcionando!',
        endpoints: {
            products: '/api/products',
            carts: '/api/carts'
        }
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado!' });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
}); 