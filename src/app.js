const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');

const productsRouter = require('./routes/products.js');
const cartsRouter = require('./routes/carts.js');
const viewsRouter = require('./routes/views.router.js'); // Criaremos este arquivo
const ProductManager = require('./managers/ProductManager.js');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 8080;

// Configuração do Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Middleware para servir arquivos estáticos (para o script do lado do cliente)
app.use(express.static(path.join(__dirname, 'js')));

// Middleware para parsing de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para disponibilizar o 'io' para as rotas
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rotas da API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rota para as Views
app.use('/', viewsRouter);

// Lógica de Sockets
const productManager = new ProductManager();

io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);

    // Listener para deletar produto via websocket
    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            // Após deletar, emitimos a lista atualizada para todos os clientes
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Erro ao deletar produto:', error.message);
            socket.emit('error', { message: 'Erro ao deletar produto: ' + error.message });
        }
    });

    // Listener para criar produto via websocket
    socket.on('createProduct', async (productData) => {
        try {
            await productManager.addProduct(productData);
            // Após criar, emitimos a lista atualizada para todos os clientes
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Erro ao criar produto:', error.message);
            socket.emit('error', { message: 'Erro ao criar produto: ' + error.message });
        }
    });
});


// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Usamos httpServer.listen em vez de app.listen
httpServer.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});