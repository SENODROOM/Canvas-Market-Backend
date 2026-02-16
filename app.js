const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const User = require('./model/user');
const Products = require('./model/Products');
const Contact = require('./model/Contact');
const Cart = require('./model/Cart');
const Order = require('./model/Order');

mongoose
  .connect('mongodb+srv://SaadAmin:Saad23457890()@canvasmarket.cxdgxjd.mongodb.net/')
  .then(() => console.log('✅ Database Connected'))
  .catch((e) => console.log('❌ Database Error:', e));


// ── POST /register ────────────────────────────
app.post('/register', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const userData = new User(req.body);
    await userData.save();
    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id:      userData._id,
        name:    userData.name,
        email:   userData.email,
        phone:   userData.phone,
        address: userData.address,
        photo:   userData.photo,
        emoji:   userData.emoji,
        createdAt: userData.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ── POST /login ───────────────────────────────
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({
      message: 'Login successful',
      user: {
        id:      user._id,
        name:    user.name,
        email:   user.email,
        phone:   user.phone,
        address: user.address,
        photo:   user.photo,
        emoji:   user.emoji,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ── PUT /update/:id ───────────────────────────
app.put('/update/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id:      updatedUser._id,
        name:    updatedUser.name,
        email:   updatedUser.email,
        phone:   updatedUser.phone,
        address: updatedUser.address,
        photo:   updatedUser.photo,
        emoji:   updatedUser.emoji,
        createdAt: updatedUser.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ── POST /Products ────────────────────────────
app.post('/Products', async (req, res) => {
  try {
    const ProductsData = new Products(req.body);
    await ProductsData.save();
    res.status(200).json({ message: 'Product saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ── POST /submit (Contact Form) ───────────────
app.post('/submit', async (req, res) => {
  try {
    const { fname, femail, fmsg } = req.body;
    
    if (!fname || !femail || !fmsg) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    const contactData = new Contact({
      fname,
      femail,
      fmsg
    });
    
    await contactData.save();
    
    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      data: {
        id: contactData._id,
        fname: contactData.fname,
        femail: contactData.femail,
        createdAt: contactData.createdAt
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});


// ══════════════════════════════════════════════
// CART ROUTES
// ══════════════════════════════════════════════

// ── GET /cart/:userId ─────────────────────────
// Get user's cart
app.get('/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    
    res.status(200).json({
      message: 'Cart retrieved successfully',
      cart: {
        items: cart.items,
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ── POST /cart/:userId ────────────────────────
// Add item to cart or update quantity
app.post('/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { id, title, price, image, quantity } = req.body;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    const existingItemIndex = cart.items.findIndex(item => item.id === id);
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity || 1;
    } else {
      // Add new item
      cart.items.push({ id, title, price, image, quantity: quantity || 1 });
    }
    
    cart.updatedAt = new Date();
    await cart.save();
    
    res.status(200).json({
      message: 'Item added to cart',
      cart: {
        items: cart.items,
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ── DELETE /cart/:userId/:itemId ──────────────
// Remove item from cart
app.delete('/cart/:userId/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item.id !== itemId);
    cart.updatedAt = new Date();
    await cart.save();
    
    res.status(200).json({
      message: 'Item removed from cart',
      cart: {
        items: cart.items,
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ── DELETE /cart/:userId ──────────────────────
// Clear entire cart
app.delete('/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();
    
    res.status(200).json({
      message: 'Cart cleared successfully',
      cart: {
        items: cart.items,
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ══════════════════════════════════════════════
// ORDER ROUTES
// ══════════════════════════════════════════════

// ── POST /order/:userId ───────────────────────
// Create order from cart
app.post('/order/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { items, paymentMethod, deliveryAddress, totalPrice } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    if (!deliveryAddress || !deliveryAddress.trim()) {
      return res.status(400).json({ message: 'Delivery address is required' });
    }
    
    const order = new Order({
      userId,
      items,
      paymentMethod,
      deliveryAddress,
      totalPrice,
      status: 'pending'
    });
    
    await order.save();
    
    // Clear cart after order
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      cart.updatedAt = new Date();
      await cart.save();
    }
    
    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        id: order._id,
        items: order.items,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ── GET /orders/:userId ───────────────────────
// Get user's order history
app.get('/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      message: 'Orders retrieved successfully',
      orders
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});