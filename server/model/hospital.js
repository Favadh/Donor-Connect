import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Hospital = mongoose.model('Hospital', HospitalSchema);
export default Hospital;