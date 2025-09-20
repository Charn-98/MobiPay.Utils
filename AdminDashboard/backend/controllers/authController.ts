import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { loggingEvent } from '../services/loggingService';
import { v4 as uuidv4 } from 'uuid';
import { validatePassword } from '../services/passwordService';

export const registerUser = async(req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        const validationResult = validatePassword(password);
        if(!validationResult){
            return res.status(400).json({
                message: 'Password does not meet complexity requirements.',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            id: uuidv4().toString(),
            email: email,
            passwordHash: passwordHash,
            role: role
        });

        await loggingEvent(newUser.id, "REGISTRATION_SUCCESS", req.ip!, {email});

        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.status(500).json({ message: 'Server error' });
    }
}

export const loginUser = async(req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        //lookup user/exists check
        const user = await User.findOne({email});
        if(!user){
            await loggingEvent('UNKNOWN', 'LOGIN_FAILED', req.ip!, {email});
            res.status(401).json({message: 'Invalid credentials.'});
        }

        //check if the entered password matches
        const isMatch = await bcrypt.compare(password, user?.passwordHash!);
        if(!isMatch){
            await loggingEvent('UNKNOWN', 'LOGIN_FAILED', req.ip!, {email});
            res.status(401).json({message: 'Invalid credentials.'});
        }

        const payload = {
            id: user?.id,
            role: user?.role,
        };

        //generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

        await loggingEvent(user?.id, 'LOGIN_SUCCESSFUL', req.ip!, {email});

        res.status(200).json({message: 'Login successful.', token});
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.status(500).json({ message: 'Server error' });
    }
}