import express from 'express'
import { addBlog, check, deleteBlog, deleteComment, getComment, login, register, updateBlog } from '../controller/admin.controller.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router(); 

router.get('/validate',verifyToken, check);
router.post('/login', login);
router.post('/register', register);
router.post('/add-blog',verifyToken, addBlog); 
router.delete('/delete-blog/:bId',verifyToken, deleteBlog);
router.put('/update-blog/:bId',verifyToken , updateBlog);
router.post('/delete-comment', verifyToken, deleteComment);
router.get('/get-comment/:bId', verifyToken, getComment);


export default router;  