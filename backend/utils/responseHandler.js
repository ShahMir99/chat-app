export const SuccessResponse = (res, status, message, payload) => {
    return res.status(status).json({
        success : true,
        message,
        payload
    })
}

export const ErrorResponse = (res, status, error) => {
    return res.status(status).json({
        success : false,
        error,
    })
}