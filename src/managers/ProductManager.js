const productModel = require('../models/product.model.js');

class ProductManager {
    async getCategories() {
        try {
            const categories = await productModel.distinct('category');
            return categories.sort();
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            return [];
        }
    }

    async getProducts(options = {}) {
        try {
            const {
                limit = 10,
                page = 1,
                sort,
                query
            } = options;

            const filter = {};
            
            if (query) {
                if (query === 'available') {
                    filter.status = true;
                    filter.stock = { $gt: 0 };
                } else if (query === 'unavailable') {
                    filter.$or = [
                        { status: false },
                        { stock: { $lte: 0 } }
                    ];
                } else {
                    filter.category = { $regex: query, $options: 'i' };
                }
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc') {
                    sortOptions.price = 1;
                } else if (sort === 'desc') {
                    sortOptions.price = -1;
                }
            }

            const result = await productModel.paginate(filter, {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sortOptions,
                lean: true
            });

            const baseUrl = '/api/products';
            const buildLink = (pageNum) => {
                if (!pageNum) return null;
                const params = new URLSearchParams();
                params.append('page', pageNum);
                params.append('limit', limit);
                if (sort) params.append('sort', sort);
                if (query) params.append('query', query);
                return `${baseUrl}?${params.toString()}`;
            };

            return {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: buildLink(result.prevPage),
                nextLink: buildLink(result.nextPage)
            };
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return {
                status: 'error',
                payload: [],
                totalPages: 0,
                prevPage: null,
                nextPage: null,
                page: 1,
                hasPrevPage: false,
                hasNextPage: false,
                prevLink: null,
                nextLink: null
            };
        }
    }

    async addProduct(product) {
        try {
            const { title, description, code, price, status = true, stock, category, thumbnails = [] } = product;
            
            if (!title || !description || !code || price === undefined || stock === undefined || !category) {
                throw new Error('Todos os campos obrigatórios devem ser preenchidos');
            }

            const existingProduct = await productModel.findOne({ code });
            if (existingProduct) {
                throw new Error('Produto com este código já existe');
            }

            const newProduct = new productModel({
                title,
                description,
                code,
                price: Number(price),
                status: Boolean(status),
                stock: Number(stock),
                category,
                thumbnails: Array.isArray(thumbnails) ? thumbnails : []
            });

            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await productModel.findById(id);
        } catch (error) {
            console.error('Erro ao buscar produto por ID:', error);
            return null;
        }
    }

    async updateProduct(id, updates) {
        try {
            const { id: _, ...validUpdates } = updates;
            
            const updatedProduct = await productModel.findByIdAndUpdate(
                id,
                validUpdates,
                { new: true, runValidators: true }
            );
            
            if (!updatedProduct) {
                throw new Error('Produto não encontrado');
            }
            
            return updatedProduct;
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(id);
            
            if (!deletedProduct) {
                throw new Error('Produto não encontrado');
            }
            
            return deletedProduct;
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            throw error;
        }
    }
}

module.exports = ProductManager; 