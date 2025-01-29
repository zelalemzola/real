import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  images: [{
    url: String,
    key: String
  }],
  propertyType: {
    type: String,
    enum: ['Apartment', 'Villa', 'Office', 'Land', 'Commercial'],
    required: true
  },
  finishingProgress: {
    type: String,
    enum: ['Semi-Finished', 'Fully Finished', 'Started']
  },
  bedrooms: Number,
  bathrooms: Number,
  location: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Property || mongoose.model('Property', propertySchema);