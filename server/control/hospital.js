import Hospital from "../model/hospital.js";
import Donor from "../model/donor.js";
import nodemailer from "nodemailer";
import User from "../model/user.js";

export const createHospital = async (req, res) => {
  try {
    const { hospitalName, phoneNo, address, gMapLink} = req.body;

    console.log(req.body);

    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: "Missing userId in URL" });

    console.log(userId);
    

    // Basic validation
    if (!hospitalName || !phoneNo || !address || !address.street || !address.city || !address.state || !address.zipCode) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const hospital = new Hospital({
      userId,
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

export const viewHospital = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: "Missing userId in URL" });

    const hospital = await Hospital.findOne({ userId });
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });

    res.status(200).json({ hospital });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export const updateHospital = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: "Missing userId in URL" });

    const updates = req.body;

    const hospital = await Hospital.findByIdAndUpdate({ userId, updates }, { new: true, runValidators: true });
    console.log(hospital);
    
    // If hospital is not found, return a 404 error
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }
    res.status(200).json({ msg: "Hospital profile updated successfully", hospital });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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