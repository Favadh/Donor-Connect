import Donor from "../model/donor.js";

export const createDonor = async (req, res) => {
  try {
    const {fullName, email, bloodType, phoneNo, city, age} = req.body;

    // Basic validation
    if (!fullName || !bloodType || !phoneNo || !city || !age || !email) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const donor = new Donor({
      fullName,
      email,
      bloodType,
      phoneNo,
      city,
      age
    }); 

    await donor.save();

    res.status(201).json({msg: "Donor Registered successfully", donor});
  } catch (err) {
    console.error("Server error:",err);
    res.status(500).json({ error: err});
  }
}
