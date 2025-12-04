const BASE_URL = process.env.NODE_ENV === 'production' 
    ? "https://chello-backend-xora.onrender.com" 
    : "http://localhost:6060";

module.exports = { BASE_URL };