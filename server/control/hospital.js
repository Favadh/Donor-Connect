import Hospital from "../model/hospital.js";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



export const createHospital = async (req, res) => {
  try {
    const { hospitalName, phoneNo, address, gMapLink} = req.body;

    console.log(req.body);

    // Basic validation
    if (!hospitalName || !phoneNo || !address || !address.street || !address.city || !address.state || !address.zipCode || !gMapLink) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const hospital = new Hospital({
      hospitalName,
      phoneNo,
      address,
      gMapLink: gMapLink || null,
    });

    await hospital.save();

    res.status(201).json({ msg: "Hospital profile created successfully", hospital });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user already exists
    const existingUser = await Hospital.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new Hospital({
      email,
      password: hashedPassword,
    });

    //Creating payload for token
    const payLoad = {
      id: newUser.id,
    };

    // Creating the actual token:
    const token = jwt.sign(
      payLoad,
      process.env.JWT_SECRET,
      {expiresIn: '1h'}
    );

    await newUser.save();
    res.status(201).json({ 
      message: 'Hospital registered successfully.',
      token,
     });

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
    console.log(email);
    

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if user exists
    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    //Creating payload for token
    const payLoad = {
      id: hospital.id,
    };

    // Creating the actual token:
    const token = jwt.sign(
      payLoad,
      process.env.JWT_SECRET,
      {expiresIn: '1h'}
    );

    // Successful login
    res.status(200).json({ 
      message: 'Login successful.',
      token,
      hospital: {
        id: hospital._id,
        email: hospital.email, 
      } 
    });

  } catch (err) {
    console.error("server error:",err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export const appointDonor = async (req, res) => {
 try {
  const donorId = req.params.donorId;
  const hospitalId = req.params.hospitalId;

  if (!donorId || !hospitalId) return res.status(400).json({ error: "Missing donorId or hospitalId in URL" });

  const donor = await Donor.findById(donorId);
  if (!donor) return res.status(404).json({ error: "Donor not found" });

  console.log(donor);

  const donorEmail = await User.findById(donor.userId).select('email');
  if (!donorEmail) return res.status(404).json({ error: "Donor email not found" });

  console.log(donorEmail);

  donor.appoinmentNotification = { 
    hospitalId, 
    default: true 
  };

  await donor.save();

  const hospitalName = await Hospital.findById(hospitalId).select('hospitalName');

  const credentials = `${hospitalName} want you to donate blood\n, please check in within 3 days:`;

  // Set up nodemailer transporter (example with Gmail, replace with your SMTP config)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // your email password or app password
    },
  });

  // Send email
  const emailVerification = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: donorEmail.email,
    subject: 'Blood donation appointment',
    text: `Thank you for your being ready for a donation!\n\nit's a great social service:\n\n`,
  });
  console.log('Email sent:', emailVerification.response);

  res.status(200).json({ msg: "Donor appointed successfully", donor });

 } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
 }
}