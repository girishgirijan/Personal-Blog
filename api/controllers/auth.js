import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //CHECK EXISTING USER
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("Email or Username already exists!");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(String(req.body.password), salt);

    const q = "INSERT INTO users(`name`, `username`,`email`,`password`, `img`) VALUES (?)";
    const values = [req.body.name, req.body.username, req.body.email, hash, req.body.image];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  //Checking user exist or not
  const q = "select * from users where username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    //Checking password
    const isPasswordCorrect = bcrypt.compareSync(
      String(req.body.password),
      data[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("Incorrect username or password!");

    const token = jwt.sign({id: data[0].id}, "jwtkey"); // UserInfo = {id: data[0].id}
    const {password, ...other} = data[0]; // Exclude password
    res.cookie("access_token", token, {
        httpOnly:true
    }).status(200).json(other)
  });
};

export const logout = (req, res) => {
  res.clearCookie("access_token", {
    sameSite: "none",
    secure: true
  }).status(200).json("User has been logged out!")
};

//upload image of user
export const uploadImg = (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
};


