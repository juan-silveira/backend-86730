require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

const productModel = require('../src/models/product.model.js');

async function migrateData() {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
        await mongoose.connect(MONGO_URI);
        console.log('Conectado ao MongoDB');

        await productModel.deleteMany({});
        console.log('Produtos existentes removidos');

        const productsPath = path.join(__dirname, '../src/data/products.json');
        const productsData = await fs.readFile(productsPath, 'utf-8');
        const products = JSON.parse(productsData);

        const categoryMapping = {
            'smartphones': 'Eletrônicos',
            'notebooks': 'Informática',
            'audio': 'Eletrônicos',
            'televisores': 'Eletrodomésticos',
            'perifericos': 'Informática',
            'tablets': 'Informática',
            'cameras': 'Eletrônicos',
            'wearables': 'Acessórios',
            'videogames': 'Games'
        };

        for (const product of products) {
            const { id, ...productData } = product;
            
            productData.category = categoryMapping[productData.category] || productData.category;
            
            const newProduct = new productModel(productData);
            await newProduct.save();
            console.log(`Produto migrado: ${product.title} (${productData.category})`);
        }

        const additionalProducts = [
            {
                title: "Mesa de Escritório",
                description: "Mesa de escritório em MDF com gavetas",
                code: "MESA001",
                price: 350.00,
                status: true,
                stock: 15,
                category: "Móveis",
                thumbnails: []
            },
            {
                title: "Livro JavaScript Avançado",
                description: "Livro completo sobre JavaScript moderno",
                code: "LIVRO001",
                price: 89.90,
                status: true,
                stock: 30,
                category: "Livros",
                thumbnails: []
            },
            {
                title: "Furadeira Elétrica",
                description: "Furadeira elétrica de impacto 500W",
                code: "FERR001",
                price: 199.99,
                status: true,
                stock: 20,
                category: "Ferramentas",
                thumbnails: []
            },
            {
                title: "Bola de Futebol",
                description: "Bola oficial de futebol society",
                code: "SPORT001",
                price: 45.90,
                status: true,
                stock: 50,
                category: "Esportes",
                thumbnails: []
            }
        ];

        for (const product of additionalProducts) {
            const newProduct = new productModel(product);
            await newProduct.save();
            console.log(`Produto adicional migrado: ${product.title} (${product.category})`);
        }

        console.log(`${products.length + additionalProducts.length} produtos migrados com sucesso!`);
        
    } catch (error) {
        console.error('Erro na migração:', error);
    } finally {
        await mongoose.connection.close();
    }
}

migrateData(); 