import {registerUser, loginUser} from "../services/authService.js";


export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error logging in user" });
  }
};