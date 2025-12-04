import Donor from "../model/donor.js";

export const createDonor = async (req, res) => {
  try {
    const {fullName, email, bloodType, phoneNo, city} = req.body;

    // Basic validation
    if (!fullName || !bloodType || !phoneNo || !city) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const donor = new Donor({
      fullName,
      email,
      bloodType,
      phoneNo,
      city,
    }); 

    await donor.save();

    res.status(201).json({msg: "Donor Registered successfully", donor});
  } catch (err) {
    console.error("Server error:",err);
    res.status(500).json({ error: err});
  }
}
