export const asyncHandler = (requestHandler) => {
    return Promise.resolve(requestHandler).catch((error) => next(error));
}