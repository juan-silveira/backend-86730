const cartModel = require('../models/cart.model.js');
const productModel = require('../models/product.model.js');

class CartManager {
    async getCarts() {
        try {
            return await cartModel.find();
        } catch (error) {
            console.error('Erro ao buscar carrinhos:', error);
            return [];
        }
    }

    async createCart() {
        try {
            const newCart = new cartModel({
                products: []
            });
            await newCart.save();
            return await cartModel.findById(newCart._id);
        } catch (error) {
            console.error('Erro ao criar carrinho:', error);
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await cartModel.findById(id).populate('products.product');
            if (cart) {
                // Filtrar produtos nulos (produtos que foram deletados) e salvar se necessário
                const originalLength = cart.products.length;
                cart.products = cart.products.filter(item => item.product !== null);
                
                // Se removemos produtos nulos, salvar o carrinho atualizado
                if (cart.products.length < originalLength) {
                    await cart.save();
                }
            }
            return cart;
        } catch (error) {
            console.error('Erro ao buscar carrinho por ID:', error);
            return null;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await cartModel.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error('Carrinho não encontrado');
            }

            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error('Produto não encontrado');
            }

            if (product.stock < quantity) {
                throw new Error('Estoque insuficiente');
            }

            // Filtrar produtos nulos (produtos que foram deletados)
            cart.products = cart.products.filter(item => item.product !== null);

            const existingProductIndex = cart.products.findIndex(
                item => item.product && item.product._id.toString() === productId
            );

            if (existingProductIndex !== -1) {
                const currentQuantity = cart.products[existingProductIndex].quantity;
                const newQuantity = currentQuantity + Number(quantity);
                
                if (product.stock < newQuantity) {
                    throw new Error('Estoque insuficiente para a quantidade total desejada');
                }
                
                cart.products[existingProductIndex].quantity = newQuantity;
            } else {
                cart.products.push({
                    product: productId,
                    quantity: Number(quantity)
                });
            }

            await cart.save();
            return await cartModel.findById(cartId).populate('products.product');
        } catch (error) {
            console.error('Erro ao adicionar produto ao carrinho:', error);
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error('Carrinho não encontrado');
            }

            // Filtrar produtos nulos (produtos que foram deletados)
            cart.products = cart.products.filter(item => item.product !== null);

            const productIndex = cart.products.findIndex(
                item => item.product && item.product._id.toString() === productId
            );

            if (productIndex === -1) {
                throw new Error('Produto não encontrado no carrinho');
            }

            cart.products.splice(productIndex, 1);
            await cart.save();
            return await cartModel.findById(cartId).populate('products.product');
        } catch (error) {
            console.error('Erro ao remover produto do carrinho:', error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error('Carrinho não encontrado');
            }

            // Filtrar produtos nulos (produtos que foram deletados)
            cart.products = cart.products.filter(item => item.product !== null);

            const productIndex = cart.products.findIndex(
                item => item.product && item.product._id.toString() === productId
            );

            if (productIndex === -1) {
                throw new Error('Produto não encontrado no carrinho');
            }

            const product = await productModel.findById(productId);
            if (product && product.stock < quantity) {
                throw new Error('Estoque insuficiente');
            }

            cart.products[productIndex].quantity = Number(quantity);
            await cart.save();
            return await cartModel.findById(cartId).populate('products.product');
        } catch (error) {
            console.error('Erro ao atualizar quantidade do produto:', error);
            throw error;
        }
    }

    async updateCart(cartId, products) {
        try {
            const cart = await cartModel.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error('Carrinho não encontrado');
            }

            for (const item of products) {
                const product = await productModel.findById(item.product);
                if (!product) {
                    throw new Error(`Produto ${item.product} não encontrado`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Estoque insuficiente para o produto ${product.title}`);
                }
            }

            cart.products = products;
            await cart.save();
            return await cartModel.findById(cartId).populate('products.product');
        } catch (error) {
            console.error('Erro ao atualizar carrinho:', error);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await cartModel.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error('Carrinho não encontrado');
            }

            cart.products = [];
            await cart.save();
            return await cartModel.findById(cartId).populate('products.product');
        } catch (error) {
            console.error('Erro ao limpar carrinho:', error);
            throw error;
        }
    }

    async deleteCart(cartId) {
        try {
            const deletedCart = await cartModel.findByIdAndDelete(cartId);
            if (!deletedCart) {
                throw new Error('Carrinho não encontrado');
            }
            return deletedCart;
        } catch (error) {
            console.error('Erro ao deletar carrinho:', error);
            throw error;
        }
    }
}

module.exports = CartManager; 