import { PasswordValidator } from 'password-validator-pro';

const validator = new PasswordValidator({
    minLength: 8,
    maxLength: 100,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
});

export const validatePassword = (password: string): boolean => {
    return validator.validate(password).valid;
};