
// A Redux Thunk for handling the login process
export const loginUser = (email, password) => async (dispatch) => {
    try {
        const response = await api.post(
            'https://3gxqzdsp-2000.inc1.devtunnels.ms/api/v1/auth/token',
            { email, password }
        );
…        } else {
            return { success: false, message: response.data.message || 'Failed to send OTP' };
        }
    } catch (error) {
        console.error('OTP Error:', error);
        return { success: false, message: 'Something went wrong' };
    }
};
