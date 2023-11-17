'use strict';
const { Cart, Product, Order } = require('../models');


class CartController {
    static async addProductToCart(req, res, next) {
        try {
            const { id } = req.user;
            const { OrderId } = req.params
            // console.log(OrderId);
            const { ProductId } = req.body;
            const itemToAdd = await Cart.findOne({
                where: { ProductId, OrderId }
            })
            console.log(itemToAdd);
            if (itemToAdd) throw { name: 'DuplicatedInput' };
            const cart = await Cart.create({
                UserId: id,
                ProductId, OrderId
            });
            // console.log(cart);
            const carts = await Cart.findAll({
                where: {
                    OrderId
                }, include: Product
            })
            let totalPrice = 0;
            carts.forEach((el) => {
                // console.log(el);
                const { quantity } = el
                totalPrice += quantity * el.Product.price
            })
            await Order.update({ totalPrice }, {
                where: { id: OrderId }
            })
            // console.log(totalPrice);
            res.status(201).json({ totalPrice, carts });
        } catch (error) {
            next(error);
        }
    }

    static async getCarts(req, res, next) {
        try {
            const {OrderId} = req.params
            const carts = await Cart.findAll({
                where: {
                    OrderId
                }
            })
        } catch (error) {
            next(error)
        }
    }

    static async getCartDetail(req, res, next) {
        try {
            const { CartId } = req.params;
            if (isNaN(+CartId)) throw { name: "InvalidParams" };
            const cart = await Cart.findByPk(CartId);
            if (!cart) throw { name: 'NotFound' };
            // console.log(cart);
            res.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    }

    static async editQuantity(req, res, next) {
        try {
            const { OrderId, CartId } = req.params;
            const { quantity } = req.body;
            await Cart.update({ quantity }, {
                where: {
                    id: CartId
                },
                returning: true
            });
            const carts = await Cart.findAll({
                where: {
                    OrderId
                }, include: Product
            })
            let totalPrice = 0;
            carts.forEach((el) => {
                // console.log(el);
                const { quantity } = el
                totalPrice += quantity * el.Product.price
            })
            await Order.update({ totalPrice }, {
                where: { id: OrderId }
            })
            res.status(200).json({ totalPrice, carts });
        } catch (error) {
            next(error);
        }
    }

    static async deleteProductFromCart(req, res, next) {
        try {
            const { CartId, OrderId } = req.params
            await Cart.destroy({
                where: { id: CartId }
            });
            const carts = await Cart.findAll({
                where: {
                    OrderId
                }, include: Product
            })
            let totalPrice = 0;
            carts.forEach((el) => {
                // console.log(el);
                const { quantity } = el
                totalPrice += quantity * el.Product.price
            })
            await Order.update({ totalPrice }, {
                where: { id: OrderId }
            })
            res.status(200).json({ totalPrice, carts })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CartController;