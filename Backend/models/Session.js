import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    day_of_week: { type: Number, required: true, min: 1, max: 7 },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["active", "cancelled"], default: "active" },
    notes: { type: String, default: null },
  },
  { timestamps: true }
);

sessionSchema.index({ day_of_week: 1 });
sessionSchema.index({ instructor_id: 1 });
sessionSchema.index({ group_id: 1 });
sessionSchema.index({ room_id: 1 });

sessionSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model("Session", sessionSchema);
