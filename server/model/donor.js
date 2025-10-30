import mongoose from "mongoose";

const DonorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },                                                                                                                                                                                                                 
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: null,
  },
  appoinmentNotification: {
    appoinment: {
      type: Boolean,
      default: false,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null,
    },
  },
});

const Donor = mongoose.model('Donor', DonorSchema);
export default Donor;