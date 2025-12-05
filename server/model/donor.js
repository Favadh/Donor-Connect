import mongoose from "mongoose";

const DonorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  phoneNo: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  age:{
    type: Number,
    required: true,
  },
  profileImage: {
    type: String,
    default: null,
  },
});

const Donor = mongoose.model('Donor', DonorSchema);
export default Donor;