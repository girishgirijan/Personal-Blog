import { db } from "../db.js";
import jwt from "jsonwebtoken";

//Get all posts
export const getMyposts = (req, res) => {
  const q = req.query.count
    ? "SELECT p.id, `username`, `name`, `title`, `des`, p.img, u.img AS userImg, `cat`, `date` from users u JOIN posts p ON u.id = p.uid where p.uid = ? and p.id != ? ORDER BY p.id DESC LIMIT 5"
    : "SELECT p.id, `username`, `name`, `title`, `des`, p.img, u.img AS userImg, `cat`, `date` FROM users u JOIN posts p ON u.id = p.uid where p.uid = ? ORDER BY p.id DESC";

  db.query(q, [req.query.uid, req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

//Get all posts
export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT p.id, `username`, `name`, `title`, `des`, p.img, u.img AS userImg, `cat`, `date` from users u JOIN posts p ON u.id = p.uid where cat = ?"
    : "SELECT p.id, `username`, `name`, `title`, `des`, p.img, u.img AS userImg, `cat`, `date` FROM users u JOIN posts p ON u.id = p.uid ORDER BY p.id DESC";

  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

//Get recent posts (5)
export const getRecentPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT p.id, `username`, `name`, `title`, `des`, p.img, u.img AS userImg, `cat`, `date` FROM users u JOIN posts p ON u.id = p.uid where cat = ? ORDER BY p.id desc LIMIT 5"
    : "SELECT p.id, `username`, `name`, `title`, `des`, p.img, u.img AS userImg, `cat`, `date` FROM users u JOIN posts p ON u.id = p.uid ORDER BY p.id LIMIT 5";

  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

//Get category count by category 
export const getCatCount = (req, res) => {
  const q = "SELECT cat, count(*) as number FROM posts GROUP BY cat";  

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

//Get specific post

export const getPost = (req, res) => {
  const q =
    "SELECT p.id, `username`, `title`, `des`, p.img, u.img AS userImg, `cat`, `date` from users u JOIN posts p ON u.id = p.uid WHERE p.id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "insert into posts (`title`, `des`, `img`, `cat`, `uid`) values (?)";
    const values = [
      req.body.title,
      req.body.des,
      req.body.img,
      req.body.cat,
      userInfo.id,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Post has been created!");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";
    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your posts!");

      return res.json("Post has been deleted!");
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q =
      "update posts set `title` = ?, `des` = ?, `img` = ?, `cat` = ? where `id` = ? and `uid` = ?";
    const values = [req.body.title, req.body.des, req.body.img, req.body.cat];
    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.json("Post has been updated!");
    });
  });
};
