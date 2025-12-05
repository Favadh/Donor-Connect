import Hospital from "../model/hospital.js";
import Donor from "../model/donor.js";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';




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
      hospitalName: "Temp Name", // Temporary placeholder
      phoneNo: "0000000000",      // Temporary placeholder
      address: {                  // Temporary placeholder  
        street: "Temp Street",
        city: "Temp City",
        state: "Temp State",
        zipCode: "000000"
      },
      gMapLink: null,              // Temporary placeholder

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
      message: 'Hospital register Success.',
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

    let loc='/dashboard';
    if(hospital.hospitalName==="Temp Name"){
      loc='/formdata';
    }

    // Successful login
    res.status(200).json({ 
      message: 'Login successful.',
      token,
      loc,
    });

  } catch (err) {
    console.error("server error:",err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export const createHospital = async (req, res) => {
  try {
    const { hospitalName, phoneNo, address, gMapLink} = req.body;
    const id=req.user.id;
    console.log(req.body);

    // Basic validation
    if (!hospitalName || !phoneNo || !address || !address.street || !address.city || !address.state || !address.zipCode || !gMapLink) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Update existing hospital document for the authenticated user
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    hospital.hospitalName = hospitalName;
    hospital.phoneNo = phoneNo;
    hospital.address = {
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    };
    hospital.gMapLink = gMapLink || null;

    await hospital.save();

    res.status(201).json({ msg: "Hospital profile created successfully"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export const viewDonors = async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json({msg:"Fetched donors data successfully", donors });
  } catch (err) {
    console.error("Server error:",err);
    res.status(500).json({ error: err.message });
  }
}

export const appointDonor = async (req, res) => {
 try {
  const donorId = req.params.donorId;
  const hospitalId = req.user.id;

  if (!donorId || !hospitalId) return res.status(400).json({ error: "Missing donorId or hospitalId in URL" });

  const donor = await Donor.findById(donorId);
  if (!donor) return res.status(404).json({ error: "Donor not found" });

  console.log(donor);

  const donorEmail = await Donor.findById(donorId).select('email');
  if (!donorEmail) return res.status(404).json({ error: "Donor email not found" });

  console.log(donorEmail);

  const hospitalData = await Hospital.findById(hospitalId).select('-password').lean();
  if (!hospitalData) return res.status(404).json({ error: "Hospital not found" });


  const message = [
    `Dear Donor,`,
    ``,
    `Thank you for volunteering to donate blood. ${hospitalData.hospitalName || 'The hospital'} would like to schedule you for a donation—please check in within 3 days.`,
    `
    `,
    `Hospital Details:`,
    `Name: ${hospitalData.hospitalName || 'N/A'}`,
    `Phone: ${hospitalData.phoneNo || 'N/A'}`,
    `Address: ${
      (hospitalData.address?.street ? hospitalData.address.street + ', ' : '') +
      (hospitalData.address?.city ? hospitalData.address.city + ', ' : '') +
      (hospitalData.address?.state ? hospitalData.address.state + ' ' : '') +
      (hospitalData.address?.zipCode || '')
    }`,
    hospitalData.gMapLink ? `Google Maps: ${hospitalData.gMapLink}` : '',
    ``,
    `If you need to reschedule or have questions, please contact the hospital at the phone number above.`,
    ``,
    `Thank you,\nDonor Connect Team`
  ].filter(Boolean).join('\n');

  // Set up nodemailer transporter (example with Gmail, replace with your SMTP config)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // your email password or app password
    },
  });

  // Send email
  console.log("before sending email");
  
  const emailVerification = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: donorEmail.email,
    subject: 'Blood donation appointment',
    text: message,
  });
  console.log('Email sent:', emailVerification.response);

  res.status(200).json({ msg: "Sented appointment email to donor successfully." });

 } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
 }
}