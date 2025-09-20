import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    id: string;
    email: string;
    passwordHash: string;
    role: 'super_admin' | 'analyst' | 'super_user';
    mfaSecret?: string;
    resetPasswordToken?: string;
    resetPasswordExpireDate?: Date
}

const UserSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
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
    },
    mfaSecret: {
        type: String,
        required: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpireDate: {
        type: Date,
        required: false
    },
}, {
    timestamps: true
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;