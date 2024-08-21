import express from 'express'
import { allBlog, catBlog } from '../controller/com.controller.js';

const router = express.Router();

router.get('/all-blogs', allBlog);
router.get('/all-blogs/:cat', catBlog);


export default router;