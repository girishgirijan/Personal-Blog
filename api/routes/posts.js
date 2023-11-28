import express from "express"
import {getPosts, getPost, addPost, deletePost, updatePost, getRecentPosts, getCatCount, getMyposts} from "../controllers/post.js"

const router = express.Router()

router.get("/myposts", getMyposts);
router.get("/catcount", getCatCount);
router.get("/recent", getRecentPosts);
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", addPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);



export default router