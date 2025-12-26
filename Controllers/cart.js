import { Cart } from "../Models/Cart.js"

// add to cart
export const addToCart = async (req, res) => {
    try {
        const { productId, title, price, qty, imgSrc } = req.body

        const userId = req.user;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const quantity = Number(qty);
        const itemPrice = Number(price);

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] })
        }
        const itemIndex = cart.items.findIndex((item) => item.productId?.toString() === productId?.toString())

        if (itemIndex > -1) {
            cart.items[itemIndex].qty += quantity;
            cart.items[itemIndex].price += price * quantity
        } else {
            cart.items.push({ productId, title, price, qty: quantity, imgSrc });
        }

        await cart.save()
        res.json({ message: 'item added to cart', cart })
    } catch (error) {
        console.log("Add to Cart Error:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
// get user cart
export const userCart = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not logged in or token invalid" });
        }
        const userId = req.user._id;
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.json({ message: 'cart not found' })

        res.json({ message: "user cart", cart })
    } catch (error) {
        console.log("Error fetching cart:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// remove product from cart

export const removeProductFromCart = async (req, res) => {
    const productId = req.params.productId;
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ message: 'cart not found' })

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId.toString())

    await cart.save();

    res.json({ message: "product remove from cart" })
};


// clear cart

export const clearCart = async (req, res) => {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ items: [] })
    } else {
        cart.items = [];
    }

    await cart.save();

    res.json({ message: "cart cleared" })
};


// decrese quantity from cart

export const decreaseProductQty = async (req, res) => {
    const { productId, qty} = req.body

    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({ userId, items: [] })
    }
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId)

    if (itemIndex > -1) {
        const item = cart.items[itemIndex]

        if (item.qty > qty) {
            const pricePerUnit = item.price / item.qty

            item.qty -= qty
            item.price -= pricePerUnit * qty
        } else {
            cart.items.splice(itemIndex, 1)
        }
    } else {
        return res.json({ message: 'invalid product id' })
    }

    await cart.save()
    res.json({ message: 'item qty to decrease', cart })
};