export const config = {
    baseUrl: 'http://localhost:5000',
    user: {
        path: '/users',
        login: '/v1/login',
        register: '/v1/register',
        sendOtp: '/v1/send/otp',
        getUser: '/v1/me'
    },
    transaction: {
        path: '/transactions',
        countTransaction: '/v1/count',
        getTransaction: '/v1',
        updateTransaction: '/v1/update',
    },
}