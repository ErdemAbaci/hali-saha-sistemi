const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    field: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Field", 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    paymentMethodId: { 
      type: String, 
      required: true 
    },
    paymentIntentId: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "succeeded", "failed"],
      default: "pending"
    },
    reservation: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Reservation" 
    },
    fieldNumber: { 
      type: Number, 
      required: true 
    },
    date: { 
      type: String, 
      required: true 
    },
    hour: { 
      type: String, 
      required: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema); 