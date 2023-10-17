import  Express  from "express";
import { getPosts,addPost,deletePost } from "../controllers/post.js";

const router = Express.Router();

router.get('/',getPosts);
router.post('/',addPost);
router.delete('/:postId',deletePost);

export default router;