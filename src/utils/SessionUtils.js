// Utility for setting session storage
export const setSessionData = (data) => {
  sessionStorage.setItem('full_name', data.message.full_name);
  sessionStorage.setItem('sid', data.message.sid);
  sessionStorage.setItem('user_id', data.message.email);
  sessionStorage.setItem('system_user', data.message.email === 'admin@example.com' ? 'yes' : 'no');
};

// Utility for clearing session storage
export const clearSessionData = () => {
  sessionStorage.removeItem('full_name');
  sessionStorage.removeItem('sid');
  sessionStorage.removeItem('user_id');
  sessionStorage.removeItem('system_user');
};

// utils/sessionUtils.js
export const getSessionData = () => {
  return {
    sid: sessionStorage.getItem('sid'),
    user_id: sessionStorage.getItem('user_id'),
    full_name: sessionStorage.getItem('full_name'),
    system_user: sessionStorage.getItem('system_user'),
  };
};
