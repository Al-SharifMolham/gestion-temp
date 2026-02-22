import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password_hash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "instructor", "student"], required: true },
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password_hash;
  },
});

export default mongoose.model("User", userSchema);
