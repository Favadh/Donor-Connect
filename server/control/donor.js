import Donor from "../model/donor.js";

export const createDonor = async (req, res) => {
  try {
    const {fullName, bloodType, immediateScreening, phoneNo, city} = req.body;

    const userId = req.params.userId;

    if (!userId) return res.status(400).json({ error: "Missing userId in URL" });

    // Basic validation
    if (!fullName || !bloodType || !immediateScreening || !phoneNo || !city) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const donor = new Donor({
      userId,
      fullName,
      bloodType,
      immediateScreening,
      phoneNo,
      city,
      isAvailable: true, // default to true
    }); 

    await donor.save();

    res.status(201).json({msg: "Donor profile created successfully", donor});
  } catch (err) {
    console.error("Server error:",err);
    res.status(500).json({ error: err});
  }
}