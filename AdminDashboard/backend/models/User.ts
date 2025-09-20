import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid'

export interface IUser extends Document {
    id: string;
    email: string;
    passwordHash: string;
    role: 'super_admin' | 'analyst' | 'super_user';
}

const UserSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4 //this should automatically generate a guid
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['super_admin', 'analyst', 'super_user'],
        default: 'analyst'
    }
}, {
    timestamps: true
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;