require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');

const connectDB = require('./config/database.js');
const productsRouter = require('./routes/products.js');
const cartsRouter = require('./routes/carts.js');
const viewsRouter = require('./routes/views.router.js');
const ProductManager = require('./managers/ProductManager.js');

connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 8080;

const hbs = handlebars.create({
    helpers: {
        eq: function(a, b) {
            return a === b;
        },
        gt: function(a, b) {
            return a > b;
        },
        multiply: function(a, b) {
            return (a * b).toFixed(2);
        },
        calculateTotal: function(products) {
            if (!products || !Array.isArray(products)) return '0.00';
            const total = products.reduce((sum, item) => {
                return sum + (item.product.price * item.quantity);
            }, 0);
            return total.toFixed(2);
        },
        range: function(from, to) {
            const result = [];
            for (let i = from; i <= to; i++) {
                result.push(i);
            }
            return result;
        },
        formatDate: function(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('pt-BR');
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'js')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use('/', viewsRouter);

const productManager = new ProductManager();

io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);

    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const updatedProducts = await productManager.getProducts({ limit: 1000 });
            io.emit('updateProducts', updatedProducts.payload);
        } catch (error) {
            console.error('Erro ao deletar produto:', error.message);
            socket.emit('error', { message: 'Erro ao deletar produto: ' + error.message });
        }
    });

    socket.on('createProduct', async (productData) => {
        try {
            await productManager.addProduct(productData);
            const updatedProducts = await productManager.getProducts({ limit: 1000 });
            io.emit('updateProducts', updatedProducts.payload);
        } catch (error) {
            console.error('Erro ao criar produto:', error.message);
            socket.emit('error', { message: 'Erro ao criar produto: ' + error.message });
        }
    });
});

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});