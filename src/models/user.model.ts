import mongoose, { Schema, Document, model } from "mongoose";
import validator from "validator";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    avatarUrl: string;
    avatarFileId?: string;
  };
  bussinessName: string;
  currency: string;
  refreshToken: string;
  isVerified: boolean;
  verificationToken?: string;
  ExpiresAt?: Date;
  pendingEmail?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      minlength: [5, "Name must be at least 5 characters long"],
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Invalid email format",
      },
    },
    pendingEmail: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: (value: string) => !value || validator.isEmail(value),
        message: "Invalid email format",
      },
      optional: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    avatar: {
      avatarUrl: {
        type: String,
        default:
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
      },
      avatarFileId: {
        type: String,
      },
    },
    bussinessName: {
      type: String,
      minlength: [3, "Business name must be at least 3 characters long"],
    },
    currency: {
      type: String,
      default: "INR" ,
      required:false, 
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    ExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // Default to 10 minutes from now
    },
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export default UserModel;
