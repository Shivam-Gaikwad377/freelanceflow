import mongoose, {Schema, Document, model} from 'mongoose';
import validator from "validator";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatarUrl: string;
    bussinessName: string;
    currency: string;
    refreshToken: string;
    isVerified: boolean;
    verificationToken?: string;
        ExpiresAt?: Date;
}

const userSchema = new Schema<IUser>({
    name :{
        type: String,
        required: true,
        minlength: [5, 'Name must be at least 5 characters long'],
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: 'Invalid email format',
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    avatarUrl: {
        type: String,
        default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    },
    bussinessName: {
        type: String,
        required: true,
        minlength: [3, 'Business name must be at least 3 characters long'],
    },
    currency: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
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
        default: () => new Date(Date.now() + 10 * 60 * 1000), // Expires in 24 hours
    },

}, {timestamps: true});

const UserModel = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', userSchema);

export default UserModel;

