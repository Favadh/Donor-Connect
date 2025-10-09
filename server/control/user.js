import bcrypt from 'bcrypt';
import User from '../model/user.js ';


export const signUp = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Basic validation
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // validate role
    if (!['donor', 'hospital'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either donor or hospital.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully.' });

  } catch (err) {

    // Handle validation error or any other specific error here
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid user data', err: err.message });
    }
    console.error("server error:",err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    // Successful login
    res.status(200).json({ 
      message: 'Login successful.', 
      user: { 
        email: user.email, 
        role: user.role 
      } 
    });

  } catch (err) {
    console.error("server error:",err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}