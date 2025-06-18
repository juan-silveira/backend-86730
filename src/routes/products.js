const express = require('express');
const ProductManager = require('../managers/ProductManager.js');

const router = express.Router();
const productManager = new ProductManager();

// GET / - Listar todos os produtos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /:pid - Buscar produto por ID
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST / - Adicionar novo produto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        
        const newProduct = await productManager.addProduct({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        });
        
        res.status(201).json({
            message: 'Produto criado com sucesso',
            product: newProduct
        });
    } catch (error) {
        if (error.message.includes('campos obrigatórios') || error.message.includes('código já existe')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
});

// PUT /:pid - Atualizar produto
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updates = req.body;
        
        const updatedProduct = await productManager.updateProduct(pid, updates);
        
        res.json({
            message: 'Produto atualizado com sucesso',
            product: updatedProduct
        });
    } catch (error) {
        if (error.message === 'Produto não encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
});

// DELETE /:pid - Deletar produto
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        
        const deletedProduct = await productManager.deleteProduct(pid);
        
        res.json({
            message: 'Produto deletado com sucesso',
            product: deletedProduct
        });
    } catch (error) {
        if (error.message === 'Produto não encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
});

module.exports = router; 