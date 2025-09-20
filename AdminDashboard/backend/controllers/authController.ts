import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { loggingEvent } from '../services/loggingService';
import { v4 as uuidv4 } from 'uuid';
import { validatePassword } from '../services/passwordService';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const registerUser = async(req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        const existingUser = await User.findOne({ email: email });
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
        const user = await User.findOne({ email: email });
        if(!user){
            await loggingEvent('UNKNOWN', 'LOGIN_FAILED', req.ip!, {email});
            return res.status(401).json({message: 'Invalid credentials.'});
        }

        //check if the entered password matches
        const isMatch = await bcrypt.compare(password, user?.passwordHash!);
        if(!isMatch){
            await loggingEvent('UNKNOWN', 'LOGIN_FAILED', req.ip!, {email});
            return res.status(401).json({message: 'Invalid credentials.'});
        }

         if(!user?.mfaSecret){
            const payload = {
                id: user?.id,
                role: user?.role,
            };

            const tempToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '5m' }); //should expire quicklysince its temporary
            return res.status(202).json({ message: 'MFA setup required', id: user?.id, tempToken: tempToken });
        }

        await loggingEvent(user?.id, 'LOGIN_SUCCESSFUL', req.ip!, {email});

        res.status(200).json({message: 'Login successful.'});
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.status(500).json({ message: 'Server error' });
    }
}

export const setupMFA = async(req: Request, res: Response) => {
    try {
        const user = await User.findOne( { id: req.user!.id });
        if(!user){
            return res.status(404).json({ message: 'User was not found'});
        }

        const secret = speakeasy.generateSecret({length: 20});
        user.mfaSecret = secret.base32;
        await user.save();

        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);
        res.status(200).json({
            message: 'MFA secret generated. Scan QR code to setup',
            qrCodeUrl,
        });

    } catch (error) {
         if (error instanceof Error) {
            console.error(error.message);
        }

        res.status(500).json({ message: 'Server error' });
    }
}

export const verifyMFA = async (req: Request, res: Response) => {
    try {
        const { id, token } = req.body;
        const user = await User.findOne( { id: id } );
        console.log(id)
        if(!user || !user.mfaSecret){
            return res.status(400).json({message: 'Invalid request'});
        }

        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token: token
        })

        if (verified){
            const payload = { id: user.id, role: user.role };
            const jwtToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h'});
            await loggingEvent(user.id, 'MFA_VERIFIED_SUCCESS', req.ip!, user.id);
            return res.status(200).json({message: 'MFA was verified successfully', token: jwtToken});
        } else {
            await loggingEvent(user.id, 'MFA_VERIFIED_FAILED', req.ip!, user.id);
            return res.status(401).json({message: '2FA token was invalid'});
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.status(500).json({ message: 'Server error' });
    }
}