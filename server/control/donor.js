import Donor from "../model/donor.js";

export const createDonor = async (req, res) => {
  try {
    const {fullName, email, bloodType, phoneNo, city} = req.body;

    // Basic validation
    if (!fullName || !bloodType || !immediateScreening || !phoneNo || !city) {
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

export const viewDatas = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: "Missing userId in URL" });

    const donor = await Donor.findOne({ userId });
    if (!donor) return res.status(404).json({ error: "Donor not found" });

    res.status(200).json({ donor });
  } catch (err) {
    console.error("Server error:",err);
    res.status(500).json({ error: err.message });
  }
}

export const updateDatas = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: "Missing userId in URL" });

    const updates = req.body;

    const user = await Donor.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }); 

      // If user is not found, return a 404 error
      if (!user) {
          return res.status(404).send({ error: 'User not found' });
      }

      // Send the updated user details as a response
      res.status(200).send(user);

  } catch (err) {
    console.error("Server error:",err);
    res.status(500).json({ error: err.message });
  }
}

export const appointmentNotification = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: "Missing userId in URL" });

    const donor = Donor.findOne({ userId });
    if (!donor) return res.status(404).json({ error: "Donor not found" });
    res.status(200).json({ appoinmentNotification: donor.appoinmentNotification });
  } catch ( err ) {
    console.error("Server error:",err);
    res.status(500).json({ error: err.message });
  }
}