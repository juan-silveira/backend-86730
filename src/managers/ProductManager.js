const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, '../data/products.json');
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

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Erro ao ler produtos:', error);
            return [];
        }
    }

    async saveProducts(products) {
        try {
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error('Erro ao salvar produtos:', error);
            throw error;
        }
    }

    async addProduct(product) {
        // Validação dos campos obrigatórios
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = product;
        
        if (!title || !description || !code || price === undefined || stock === undefined || !category) {
            throw new Error('Todos os campos obrigatórios devem ser preenchidos');
        }

        const products = await this.getProducts();
        
        // Verifica se o código já existe
        const existingProduct = products.find(p => p.code === code);
        if (existingProduct) {
            throw new Error('Produto com este código já existe');
        }

        // Lógica para criar ID incremental
        const nextId = products.length === 0 ? 1 : products.at(-1).id + 1;
        
        const newProduct = {
            id: nextId,
            title,
            description,
            code,
            price: Number(price),
            status: Boolean(status),
            stock: Number(stock),
            category,
            thumbnails: Array.isArray(thumbnails) ? thumbnails : []
        };

        products.push(newProduct);
        await this.saveProducts(products);
        return newProduct;
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id == id); // Comparação flexível para aceitar string e number
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id == id); // Comparação flexível
        
        if (productIndex === -1) {
            throw new Error('Produto não encontrado');
        }

        // Remove o id dos updates para garantir que não seja alterado
        const { id: _, ...validUpdates } = updates;
        
        products[productIndex] = { ...products[productIndex], ...validUpdates };
        await this.saveProducts(products);
        return products[productIndex];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id == id); // Comparação flexível
        
        if (productIndex === -1) {
            throw new Error('Produto não encontrado');
        }

        const deletedProduct = products.splice(productIndex, 1)[0];
        await this.saveProducts(products);
        return deletedProduct;
    }
}

module.exports = ProductManager; 