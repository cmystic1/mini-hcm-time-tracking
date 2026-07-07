import { getUserProfileService, registerUser } from "../services/auth.service.js";

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.query;
    const profile = await getUserProfileService(userId);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};