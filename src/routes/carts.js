const express = require('express');
const CartManager = require('../managers/CartManager.js');
const ProductManager = require('../managers/ProductManager.js');

const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        
        res.status(201).json({
            message: 'Carrinho criado com sucesso',
            cart: newCart
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        
        if (!cart) {
            return res.status(404).json({ error: 'Carrinho não encontrado' });
        }
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;
        
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrinho não encontrado' });
        }
        
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Estoque insuficiente' });
        }
        
        const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
        
        res.json({
            message: 'Produto adicionado ao carrinho com sucesso',
            cart: updatedCart
        });
    } catch (error) {
        if (error.message === 'Carrinho não encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        
        const updatedCart = await cartManager.removeProductFromCart(cid, pid);
        
        res.json({
            message: 'Produto removido do carrinho com sucesso',
            cart: updatedCart
        });
    } catch (error) {
        if (error.message === 'Carrinho não encontrado') {
            res.status(404).json({ error: error.message });
        } else if (error.message === 'Produto não encontrado no carrinho') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        
        if (!Array.isArray(products)) {
            return res.status(400).json({ error: 'Products deve ser um array' });
        }
        
        for (const item of products) {
            if (!item.product || !item.quantity) {
                return res.status(400).json({ error: 'Cada item deve ter product e quantity' });
            }
        }
        
        const updatedCart = await cartManager.updateCart(cid, products);
        
        res.json({
            message: 'Carrinho atualizado com sucesso',
            cart: updatedCart
        });
    } catch (error) {
        if (error.message.includes('não encontrado')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Quantidade deve ser maior que 0' });
        }
        
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        
        res.json({
            message: 'Quantidade atualizada com sucesso',
            cart: updatedCart
        });
    } catch (error) {
        if (error.message.includes('não encontrado')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        
        const clearedCart = await cartManager.clearCart(cid);
        
        res.json({
            message: 'Todos os produtos foram removidos do carrinho',
            cart: clearedCart
        });
    } catch (error) {
        if (error.message.includes('Carrinho não encontrado')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
});

module.exports = router; 