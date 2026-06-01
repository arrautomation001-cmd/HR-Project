import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (userData) => {
  console.log("Registering user with data:", userData);

const {
  fullName,
  profession,
  email,
  password,
} = userData;

  if (!fullName || !email || !password || !profession) {
    return {
      success: false,
      message: "All fields are required",
    };
  }

  const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return {
    success: false,
    message: "Please enter a valid email address",
  };
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if (!passwordRegex.test(password)) {
  return {
    success: false,
    message:
      "Password must contain minimum 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
  };
}



  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

    console.log(existingUser.rows);
    console.log("Rows Found:", existingUser.rows.length);

    if(existingUser.rows.length > 0) {
        return {
            success: false,
            message: "User already exists",
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Hashed Password:", hashedPassword);

  const newUser = await pool.query(
  `
  INSERT INTO users (full_name, profession, email, password_hash)
  VALUES ($1, $2, $3, $4)
  RETURNING id, full_name, profession, email, created_at
  `,
  [fullName, profession, email, hashedPassword]
    );

console.log("New User:", newUser.rows[0]);


  return {
    success: true,
    message: "Account created successfully",
    data: newUser.rows[0],
  };
};

export const loginUser = async (userData) => {

  const { email, password } = userData;

  if(!email || !password) {
    return {
      success: false,
      message: "Email and password are required",
    };
  }

  const user = await pool.query(
  "SELECT * FROM users WHERE email = $1",
  [email]
);

console.log("User Found:", user.rows);


  if (user.rows.length === 0) {
  return {
    success: false,
    message: "Invalid email or password",
  };
}

const isPasswordValid = await bcrypt.compare(
  password,
  user.rows[0].password_hash
);

console.log("Password Valid:", isPasswordValid);

if (!isPasswordValid) {
  return {
    success: false,
    message: "Invalid email or password",
  };
}

const token = jwt.sign(
  {
    userId: user.rows[0].id,
    email: user.rows[0].email,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1d",
  }
);

console.log("JWT Token:", token);

  return {
  success: true,
  message: "Login successful",
  token,
  user: {
    id: user.rows[0].id,
    fullName: user.rows[0].full_name,
    email: user.rows[0].email,
    profession: user.rows[0].profession,
  },
};
};