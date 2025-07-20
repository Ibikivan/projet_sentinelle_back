
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(error => {
        console.error('An error occured :-------->', error);
        next(error);
    });
};
