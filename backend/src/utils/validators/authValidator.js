const validateRegistration = (email, password) => {
    const errors = [];

    // Email validation
    if (!email) {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
    }

    // Password validation
    if (!password) {
        errors.push('Password is required');
    } else if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

const validateLogin = (email, password) => {
    const errors = [];

    if (!email) {
        errors.push('Email is required');
    }

    if (!password) {
        errors.push('Password is required');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

module.exports = {
    validateRegistration,
    validateLogin,
};
