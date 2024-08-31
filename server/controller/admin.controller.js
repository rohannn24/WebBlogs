import adminModel from '../models/admin.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import blogModel from '../models/blog.model.js'
import commentModel from '../models/comment.model.js'
import userModel from '../models/user.model.js'
import formModel from '../models/form.model.js'
import nodemailer from 'nodemailer'
import categoryModel from '../models/category.model.js'

export const check = async (req, res) => {
    try {
        const id = req.user.id;
        const isAdmin = await adminModel.findOne({ _id: id });
        if (isAdmin) {
            res.status(200).json({
                success: true,
                message: "Welcome to "
            })
        } else {
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
        if (admin.verified) {
            if (!admin) {
                res.status(403).json({
                    success: false,
                    message: 'invalid credentials'
                })
            } else {
                const password = admin.password;
                if (bcrypt.compareSync(req.body.password, password)) {
                    const token = jwt.sign({ id: admin._id }, process.env.KEY);
                    const { password, ...others } = admin._doc;
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
        } else {
            res.status(403).json({
                verified: false,
                message: "Please verify your Email"
            })
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
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let otp = '';

            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    success: false,
                    message: "Password is not strong"
                });
            }
            for (let i = 0; i < 6; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                otp += characters[randomIndex];
            }

            //SENDING OTP TO THE MAIL
            const transporter = nodemailer.createTransport({
                host: 'smtp.hostinger.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'noreply@codesofrohan.com',
                    pass: "B^@LR287@e",
                },
            });

            const mailOptions = {
                from: `"Rohan Kumar" <noreply@codesofrohan.com>`,
                to: req.body.email,
                cc: '',
                subject: "OTP For Registaration on TechBlog",
                html: `<div style="border-radius: 20px; padding: 20px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: rgb(230, 230, 230);">
                            <h1>Thanks for Registering with us.</h1>
                            <p><strong>Note</strong>: Please don't share this otp with anyone</p>
                            <h2 style="width: fit-content; background-color: white; padding: 20px 50px; margin: 100px auto; border-radius: 10px;">OTP:${otp}</h2>
                            <h4>Best Regards</h4>
                            <h5>Rohan Kumar</h5>
                            <a href="mailto:connect@codesofrohan.com">connect@codesofrohan.com</a>
                        </div>`,
            };

            const info = await transporter.sendMail(mailOptions);


            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const newAdmin = new adminModel({ ...req.body, password: hash, otp });
            await newAdmin.save();
            const token = jwt.sign({ id: newAdmin._id }, process.env.KEY);
            const { password: hashedPassword, ...others } = newAdmin._doc;

            res.cookie('token', token, {
                httpOnly: true
            }).status(200).json({
                success: true,
                message: 'OTP sent on email',
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
        const newBlog = new blogModel({ ...req.body, adminId: req.user.id });
        const cat = await categoryModel.findOne({ _id: req.body.cat });
        cat.blogs.push(newBlog._id);
        await cat.save();
        newBlog.save();
        const admin = await adminModel.findOne({ _id: req.user.id })
        admin.blogs.push(newBlog._id);
        const allBlog = await blogModel.find();
        await admin.save();
        const { password, ...others } = admin._doc;
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
        const blogToDelete = await blogModel.findOne({ _id: blogId }).populate('commentId');
        const cat = await categoryModel.findOne({ _id: blogToDelete.cat });
        cat.blogs.pop(blogId);
        await cat.save();
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
        res.json({ ...blog._doc })
    } catch (error) {
        console.log(error);
    }
}
export const deleteComment = (req, res) => {
    try {

        res.send('ok');
    } catch (error) {
        console.log(error);
    }
}

export const getComment = async (req, res) => {
    try {
        const forms = await formModel.find();
        res.status(200).json({
            success: true,
            message: 'Comment Fetched Successfully',
            forms
        })
    } catch (error) {

    }
}
export const deleteForm = async (req, res) => {
    try {
        const form = await formModel.findByIdAndDelete(req.params.fId);
        const allForms = await formModel.find();
        res.status(200).json({
            success: true,
            message: "Form Deleted Successfully",
            forms: allForms
        })
    } catch (error) {
        console.log(error)
    }
}


export const sendMail = async (req, res) => {
    const { receiver, cc, subject, content } = req.body;

    if (!receiver || !subject || !content) {
        return res.status(400).json({ message: 'Receiver, subject, and content are required fields.' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth: {
                user: 'noreply@codesofrohan.com',
                pass: "B^@LR287@e",
            },
        });

        const mailOptions = {
            from: `"Rohan Kumar" <noreply@codesofrohan.com>`,
            to: receiver,
            cc: cc || '',
            subject: subject,
            html: content,
        };

        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email sent successfully' });

    } catch (error) {
        console.error('Error sending email: ', error);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
};
export const verifyOtp = async (req, res) => {
    try {
        const admin = await adminModel.findOne({ _id: req.params.id });
        if (req.params.otp === admin.otp) {
            admin.verified = true;
            await admin.save();
            const token = jwt.sign({ id: admin._id }, process.env.KEY);
            const { password, verified, otp, ...others } = admin._doc;

            res.cookie('token', token, {
                httpOnly: true
            }).status(200).status(200).json({
                success: true,
                message: 'OTP verified successfully',
                user: others,
                token: token
            })
        } else {
            res.status(403).json({
                success: false,
                message: 'Wroung OTP Try again'
            })
        }
    } catch (error) {

    }
}

export const getBlogById = async (req, res) => {
    const blog = await blogModel.findOne({_id: req.params.id})
    res.json({
        success: true,
        message: 'Data fetched',
        blog
    })
}