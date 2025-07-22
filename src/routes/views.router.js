const express = require('express');
const ProductManager = require('../managers/ProductManager.js');
const CartManager = require('../managers/CartManager.js');

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/', async (req, res) => {
    try {
        const result = await productManager.getProducts({ limit: 10, page: 1 });
        res.render('home', {
            title: 'Home | E-commerce',
            pageId: '1',
            products: result.payload
        });
    } catch (error) {
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query
        };

        const [result, categories] = await Promise.all([
            productManager.getProducts(options),
            productManager.getCategories()
        ]);
        
        res.render('products', {
            title: 'Produtos | E-commerce',
            pageId: '3',
            products: result.payload,
            categories,
            pagination: {
                currentPage: result.page,
                totalPages: result.totalPages,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                prevLink: result.prevLink,
                nextLink: result.nextLink
            },
            filters: {
                limit,
                sort,
                query
            }
        });
    } catch (error) {
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        
        if (!product) {
            return res.status(404).send('Produto não encontrado');
        }
        
        res.render('productDetail', {
            title: `${product.title} | E-commerce`,
            pageId: '4',
            product
        });
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        
        if (!cart) {
            return res.status(404).send('Carrinho não encontrado');
        }
        
        res.render('cart', {
            title: 'Carrinho | E-commerce',
            pageId: '5',
            cart,
            cartId: cid
        });
    } catch (error) {
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const result = await productManager.getProducts({ limit: 1000 });
        res.render('realTimeProducts', {
            title: 'Produtos em Tempo Real',
            pageId: '2',
            products: result.payload
        });
    } catch (error) {
        res.status(500).send('Erro interno do servidor');
    }
});

module.exports = router;