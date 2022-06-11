import mongoose from "mongoose";
const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      maxlength: [100, "Name can not be more than 100 characters"],
    },

    title: {
      type: String,
      trim: true,
      maxlength: [100, "Name can not be more than 100 characters"],
      default: "Nuit à partir de",
    },

    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
      default: " hotel description",
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: ["Populaires", "Hebergements", "Activities"],
      default: "Hebergements",
    },
    tags: {
      type: String,
      required: [true, "Please provide hotel tags"],
      enum: ["Economique", "Romantique", "Animaux autrisér"],
      default: "Economique",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },
    rooms: {
      type: Number,
      default: 1,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      default: "my city",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// HotelSchema.virtual("reviews", {
//   ref: "Review",
//   localField: "_id",
//   foreignField: "product",
//   justOne: false,
// });

// HotelSchema.pre("remove", async function (next) {
//   await this.model("Review").deleteMany({ hotel: this._id });
// });

export default mongoose.model("Hotel", HotelSchema);
