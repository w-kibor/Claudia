import mongoose from 'mongoose';

const userRecipeSchema = new mongoose.Schema(
  {
    profileId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    cuisine: {
      type: String,
      default: 'Homestyle',
      trim: true,
    },
    prepTime: {
      type: String,
      default: '20 mins',
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    ingredients: {
      type: [String],
      default: [],
    },
    directions: {
      type: [String],
      default: [],
    },
    imagePath: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const UserRecipe =
  mongoose.models.UserRecipe || mongoose.model('UserRecipe', userRecipeSchema);