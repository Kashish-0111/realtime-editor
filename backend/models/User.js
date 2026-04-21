import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true })

// Password hash karo save se pehle
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Password compare karo
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

export default mongoose.model('User', userSchema)