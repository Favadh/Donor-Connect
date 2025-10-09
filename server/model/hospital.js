import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hospitalName: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  gMapLink: {
    type: String,
    default: null,
  },
  hospitalImage: {
    type: String,
    default: null,
  },
});

const Hospital = mongoose.model('Hospital', HospitalSchema);
export default Hospital;