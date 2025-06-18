const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor() {
        this.path = path.join(__dirname, '../data/carts.json');
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.access(this.path);
        } catch (error) {
            // Se o arquivo não existe, cria a pasta data e o arquivo
            const dataDir = path.dirname(this.path);
            await fs.mkdir(dataDir, { recursive: true });
            await fs.writeFile(this.path, JSON.stringify([]));
        }
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Erro ao ler carrinhos:', error);
            return [];
        }
    }

    async saveCarts(carts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.error('Erro ao salvar carrinhos:', error);
            throw error;
        }
    }

    async createCart() {
        const carts = await this.getCarts();
        
        // Lógica para criar ID incremental
        const nextId = carts.length === 0 ? 1 : carts.at(-1).id + 1;
        
        const newCart = {
            id: nextId,
            products: []
        };

        carts.push(newCart);
        await this.saveCarts(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id == id); // Comparação flexível para aceitar string e number
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id == cartId); // Comparação flexível
        
        if (cartIndex === -1) {
            throw new Error('Carrinho não encontrado');
        }

        const cart = carts[cartIndex];
        const existingProductIndex = cart.products.findIndex(item => item.product == productId); // Comparação flexível
        
        if (existingProductIndex !== -1) {
            // Se o produto já existe no carrinho, incrementa a quantidade
            cart.products[existingProductIndex].quantity += Number(quantity);
        } else {
            // Se o produto não existe, adiciona novo item
            cart.products.push({
                product: productId,
                quantity: Number(quantity)
            });
        }

        await this.saveCarts(carts);
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id == cartId); // Comparação flexível
        
        if (cartIndex === -1) {
            throw new Error('Carrinho não encontrado');
        }

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(item => item.product == productId); // Comparação flexível
        
        if (productIndex === -1) {
            throw new Error('Produto não encontrado no carrinho');
        }

        // Remove o produto específico do carrinho
        cart.products.splice(productIndex, 1);
        
        await this.saveCarts(carts);
        return cart;
    }

    async updateProductQuantity(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id == cartId); // Comparação flexível
        
        if (cartIndex === -1) {
            throw new Error('Carrinho não encontrado');
        }

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(item => item.product == productId); // Comparação flexível
        
        if (productIndex === -1) {
            throw new Error('Produto não encontrado no carrinho');
        }

        cart.products[productIndex].quantity = Number(cart.products[productIndex].quantity + 1);
        
        await this.saveCarts(carts);
        return cart;
    }

    async deleteCart(cartId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id == cartId); // Comparação flexível
        
        if (cartIndex === -1) {
            throw new Error('Carrinho não encontrado');
        }

        const cart = carts[cartIndex];
        
        // Verifica se o carrinho está vazio
        if (cart.products.length > 0) {
            throw new Error('Não é possível deletar carrinho com produtos. Remova todos os produtos primeiro.');
        }

        // Remove o carrinho do array
        const deletedCart = carts.splice(cartIndex, 1)[0];
        
        await this.saveCarts(carts);
        return deletedCart;
    }
}

module.exports = CartManager; 