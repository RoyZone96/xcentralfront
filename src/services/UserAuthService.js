import jwt_decode from "jwt-decode";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const fetchUserById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/id/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user data: ${error}`);
    return null;
  }
};

const UserAuthService = {
  async getUserIdFromToken() {
    try {
      const token = localStorage.getItem('token');
      console.log(`Token: ${token}`);
      if (!token) {
        console.error('No token found. Please log in.');
        return null;
      }

      const decodedToken = jwt_decode(token);
      console.log(`Decoded Token:`, decodedToken); // Log the decoded token to inspect its contents

      // Assuming the user ID is stored under `sub` in the token payload
      const userId = decodedToken.sub; // sub is typically the username/identifier
      const userName = decodedToken.sub; // Use sub as the username
      if (!userId) {
        console.error('User ID not found in token. Please log in again.');
        return null;
      }
      return { userId, userName };
    } catch (error) {
      console.error(`Error decoding token: ${error}`);
      return null;
    }
  },

  async getUserData() {
    const {userId, userName}= await this.getUserIdFromToken();

    // Log the obtained user ID
    console.log(`Obtained User ID: ${userId}, User Name: ${userName}`);

    if (userId) {
      const userData = await fetchUserById(userId);
      console.log(`User data for ID ${userId}:`, userData); // Log the user data obtained with the user ID
      return userData;
    } else {
      console.error('Unable to retrieve user ID from token.');
      return null;
    }
  }
}

  

export default UserAuthService;