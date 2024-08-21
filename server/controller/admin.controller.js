import adminModel from '../models/admin.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import blogModel from '../models/blog.model.js'
import commentModel from '../models/comment.model.js'
import userModel from '../models/user.model.js'

export const check = async (req, res) => {
    try {
        const id = req.user.id;
        const isAdmin = await adminModel.findOne({_id: id});
        if(isAdmin){
            res.status(200).json({
                success: true,
                message: "Welcome to "
            })
        }else{
            res.status(403).json({
                success: false,
                message: "You are not Authorized"
            })
        }
    } catch (error) {
        console.log('error');
    }
}

export const login = async (req, res) => {
    try {
        const admin = await adminModel.findOne({
            $or: [
                { username: req.body.id },
                { email: req.body.id },
                { phone: req.body.id }
            ]
        })
        if(!admin){
            res.status(403).json({
                success: false,
                message: 'invalid credentials'
            })
        } else{
            const password = admin.password;
            if(bcrypt.compareSync(req.body.password, password)){
                const token = jwt.sign({id: admin._id}, process.env.KEY);
                const {password, ...others} = admin._doc;
                res.cookie('token', token, {
                    httpOnly: true
                }).status(200).json({
                    success: true,
                    message: 'Logged in Successfully',
                    user: others,
                    token: token
                })
            } else {
                res.status(403).json({
                    success: false,
                    message: 'invalid credentials'
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}
export const register = async (req, res) => {
    try {
        const admin = await adminModel.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email },
                { phone: req.body.phone }
            ]
        });

        if (!admin) {
            // Validate password criteria
            const password = req.body.password;
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    success: false,
                    message: "Password is not strong"
                });
            }

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const newAdmin = new adminModel({ ...req.body, password: hash });
            await newAdmin.save();
            const token = jwt.sign({ id: newAdmin._id }, process.env.KEY);
            const { password: hashedPassword, ...others } = newAdmin._doc;

            res.cookie('token', token, {
                httpOnly: true
            }).status(200).json({
                success: true,
                message: 'Admin Registered Successfully',
                user: others,
                token: token
            });
        } else {
            res.status(301).json({
                success: false,
                message: 'Phone, Email, or Username already exists'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
export const addBlog = async (req, res) => {
    try {
        const newBlog = new blogModel({...req.body, adminId: req.user.id});
        newBlog.save();
        const admin = await adminModel.findOne({_id: req.user.id})
        admin.blogs.push(newBlog._id);
        const allBlog = await blogModel.find(); 
        await admin.save();
        const {password, ...others} = admin._doc;
        res.status(200).json({
            success: true,
            message: 'blog added successfully',
            blogs: allBlog,
            user: others
        })
    } catch (error) {
        console.log(error);
    }
}
export const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.bId;
        const blogToDelete = await blogModel.findOne({_id: blogId}).populate('commentId');
        if (!blogToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }
        const commentIds = blogToDelete.commentId.map(comment => comment._id);
        await commentModel.deleteMany({ _id: { $in: commentIds } });
        await userModel.updateMany(
            { commentId: { $in: commentIds } },
            { $pull: { commentId: { $in: commentIds } } }
        );
        await userModel.updateMany(
            { savedBlog: blogId },
            { $pull: { savedBlog: blogId } }
        );

        await adminModel.updateOne(
            { _id: blogToDelete.adminId },
            { $pull: { blogs: blogId } }
        );

        await blogModel.findByIdAndDelete(blogId);

        res.status(200).json({
            success: true,
            message: 'Blog Deleted Successfully',
            deletedBlog: blogToDelete
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the blog'
        });
    }
};
export const updateBlog = async (req, res) => {
    try {
        const blog = await blogModel.findByIdAndUpdate(req.params.bId, {
            ...req.body
        }, {
            new: true
        });
        res.json({...blog._doc})
    } catch (error) {
        console.log(error);
    }
}
export const deleteComment = (req, res) => {
    try {
        //write your code here
        res.send('ok');
    } catch (error) {
        console.log(error);
    }
}
export const getComment = (req, res) => {
    try {
        //write your code here
        res.send('ok');
    } catch (error) {
        console.log(error);
    }
}