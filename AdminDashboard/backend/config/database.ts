import mongoose from 'mongoose';

export const connectDatabase = async () => {
    try {
        const mongoURI: string = process.env.MONGODB_URI!;
        if(!mongoURI){
            throw new Error("MONGODB_URI not found in environment variables.");
        }
        await mongoose.connect(mongoURI);
        console.log('Connected.');
    }
    catch (err){
        if (err instanceof Error){
            console.error(err.message);
        }

        process.exit(1);
    }
}