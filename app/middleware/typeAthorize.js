export const getType = (type) => {
    return (req, res, next) => {
        try {
            const user = req.currentUser
            console.log('user', user.type)
            console.log('type', type)
            console.log('check', type.includes(user.type))

            if (!type.includes(user.type)) {
                // return res.status(403).json({ message: 'Forbidden' });
                return res.json({ message: 'Forbidden' });
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}
