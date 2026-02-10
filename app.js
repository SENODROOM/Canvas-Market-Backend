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
// Called by ProfileSection's Save Changes button
// Body: { name, email, phone, address, password, photo, emoji }
app.put('/update/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }           // returns the updated document
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


app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});