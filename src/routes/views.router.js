const express = require('express');
const ProductManager = require('../managers/ProductManager.js');

const router = express.Router();
const productManager = new ProductManager();

// Rota para a view home.handlebars
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', {
            title: 'Home | E-commerce',
            pageId: '1',
            products: products
        });
    } catch (error) {
        res.status(500).send('Erro interno do servidor');
    }
});

// Rota para a view realTimeProducts.handlebars
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', {
            title: 'Produtos em Tempo Real',
            pageId: '2',
            products: products
        });
    } catch (error) {
        res.status(500).send('Erro interno do servidor');
    }
});

module.exports = router;