import authService from "../services/authService.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { token, user } = await authService.login(email, password);
    return res.json({ token, user });
  } catch (error) {
    console.error("LOGIN ERROR:", error); // ✅ add this

    if (error.message === "Invalid credentials") {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ optional: expose message in dev only
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (error) {
    console.error("GETME ERROR:", error); // ✅ add this
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
