import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check karo already exist karta hai kya
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered!" })
    }

    const user = new User({ username, email, password })
    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    res.status(201).json({ token, username: user.username })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password!" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password!" })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    res.status(200).json({ token, username: user.username })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router