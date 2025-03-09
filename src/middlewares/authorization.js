export const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new Error("Unauthorized access",{cause:403}));
        }
        next();
    };
};