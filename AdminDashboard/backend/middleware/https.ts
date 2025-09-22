import { Request, Response, NextFunction } from 'express';

export const enforceHttps = (req: Request, res: Response, next: NextFunction) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;

    if(protocol !== 'https'){
        return res.redirect(`https://${req.hostname}${req.originalUrl}`);
    }

    next();
}