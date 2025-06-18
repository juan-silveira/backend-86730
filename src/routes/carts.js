const express = require('express');
const CartManager = require('../managers/CartManager.js');
const ProductManager = require('../managers/ProductManager.js');

const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

// GET / - Listar todos os carrinhos
router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST / - Criar novo carrinho
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

// GET /:cid - Listar produtos do carrinho
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

// POST /:cid/product/:pid - Adicionar produto ao carrinho
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;
        
        // Verifica se o carrinho existe
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrinho não encontrado' });
        }
        
        // Verifica se o produto existe
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        
        // Verifica se há estoque suficiente
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

// DELETE /:cid/product/:pid - Remover produto do carrinho
router.delete('/:cid/product/:pid', async (req, res) => {
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

// PUT /:cid/product/:pid - Atualizar quantidade do produto no carrinho
router.put('/:cid/product/:pid', async (req, res) => {
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

// DELETE /:cid - Deletar carrinho vazio
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        
        const deletedCart = await cartManager.deleteCart(cid);
        
        res.json({
            message: 'Carrinho deletado com sucesso',
            cart: deletedCart
        });
    } catch (error) {
        if (error.message.includes('Carrinho')) {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('Não')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
});

module.exports = router; 