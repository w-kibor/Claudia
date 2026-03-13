import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
  {
    profileId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0,
    },
    unit: {
      type: String,
      default: 'item',
      trim: true,
    },
    location: {
      type: String,
      enum: ['Fridge', 'Pantry', 'Freezer'],
      default: 'Fridge',
    },
    status: {
      type: String,
      enum: ['available', 'running-low', 'needed'],
      default: 'available',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    imagePath: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const InventoryItem =
  mongoose.models.InventoryItem || mongoose.model('InventoryItem', inventoryItemSchema);