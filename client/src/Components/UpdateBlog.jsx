import React, { useRef, useEffect, useState } from 'react';
import './Style/BlogEditor.css';
import { Editor } from '@tinymce/tinymce-react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateBlog = ({ showAlert, user }) => {
    const { id } = useParams(); // Get the blog ID from the URL
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const keywordRef = useRef(null);
    const slugRef = useRef(null);
    const editorRef = useRef(null);
    const categoryRef = useRef(null);
    const imageRef = useRef(null);
    const [bImg, setImageUrl] = useState("");
    const [imagePerc, setImgPerc] = useState("");
    const [uploading, setUploading] = useState(false);
    const nav = useNavigate();
    const [cat, setCat] = useState(null);
    useEffect(() => {
        const keywordInput = keywordRef.current;
        const handleKeyDown = (e) => {
            if (e.key === ',' && keywordInput.value.slice(-1) === ',') {
                e.preventDefault(); // Prevent multiple commas
            }
        };

        keywordInput.addEventListener("keydown", handleKeyDown);

        return () => {
            keywordInput.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (imagePerc === 100) {
            setUploading(false);
        } else if (imagePerc > 0) {
            setUploading(true);
        }
    }, [imagePerc]);

    useEffect(() => {
        getCategory(); // Fetch categories
        fetchBlogData(); // Fetch blog data based on ID
    }, [id]);

    const handleImageUpload = () => {
        const file = imageRef.current.files[0];
        if (!file) {
            showAlert('Please select an image file.');
            return;
        }

        const storage = getStorage(app);
        const fileName = `${new Date().getTime()}_${file.name}`;
        const storageRef = ref(storage, `blogImage/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImgPerc(Math.round(progress));
            },
            (error) => {
                console.error('Upload failed:', error);
                showAlert('Image upload failed. Please try again.');
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUrl(downloadURL);
                });
            }
        );
    };

    const getCategory = async () => {
        const res = await fetch('/api/category/all-category', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token')
            }
        });
        const resData = await res.json();
        if (res.ok) {
            setCat(resData);
        } else {
            showAlert('Something went wrong');
        }
    };

    const fetchBlogData = async () => {
        try {
            const res = await fetch(`/api/admin/blog/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('token'),
                },
            });

            if (!res.ok) {
                throw new Error('Failed to fetch blog data');
            }
            const blogData = await res.json();
            titleRef.current.value = blogData.blog.title;
            descriptionRef.current.value = blogData.blog.description;
            keywordRef.current.value = blogData.blog.keyword;
            slugRef.current.value = blogData.blog.slug;
            categoryRef.current.value = blogData.blog.cat;
            setImageUrl(blogData.blog.bImg);
            editorRef.current.setContent(blogData.blog.content);
            document.title = `Update | ${blogData.blog.title}`
        } catch (error) {
            console.error(error);
            showAlert('Failed to load blog data');
        }
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace spaces and special characters with hyphens
            .replace(/^-+|-+$/g, ''); // Trim hyphens from the start and end
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!bImg) {
            console.log('Image not uploaded yet.');
            return;
        }

        const title = titleRef.current.value;
        const slug = slugRef.current.value || generateSlug(title);

        const blogData = {
            title,
            description: descriptionRef.current.value,
            keyword: keywordRef.current.value,
            slug, // Use the generated or provided slug
            content: editorRef.current.getContent(),
            bImg,
            cat: categoryRef.current.value,
            adminId: user._id
        };

        console.log('Blog Data:', JSON.stringify(blogData, null, 2));

        const res = await fetch(`/api/admin/update-blog/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token'),
            },
            body: JSON.stringify(blogData)
        });

        const resData = await res.json();
        if (res.ok) {
            console.log(resData);
            showAlert(resData.message);
            nav(`/admin/${user.username}/profile`);

            // Clear the form fields
            titleRef.current.value = '';
            descriptionRef.current.value = '';
            keywordRef.current.value = '';
            slugRef.current.value = '';
            editorRef.current.setContent('');
            setImageUrl('');
            setImgPerc('');
            setCat(null);
        }
    };

    return (
        <div className="full-editor">
            <h1>Update Blog</h1>
            <form onSubmit={handleSubmit}>
                <div className="inpt-pair">
                    <label htmlFor="title">Title:</label>
                    <input type="text" placeholder="Add Title of the Blog" ref={titleRef} required />
                </div>
                <div className="inpt-pair">
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" rows={6} placeholder="Add a description" ref={descriptionRef} required></textarea>
                </div>
                <div className="inpt-pair">
                    <label htmlFor="keyword">Keyword:</label>
                    <input type="text" placeholder="Add keywords for the Blog" ref={keywordRef} id="keyword" required />
                </div>
                <div className="inpt-pair">
                    <label htmlFor="slug">Slug:</label>
                    <input type="text" placeholder="Add slug for this blog" ref={slugRef} id="slug" required />
                </div>
                <div className="inpt-pair">
                    <label htmlFor="category">Category:</label>
                    <select name="category" id="category" ref={categoryRef} required>
                        <option value="">Select Category</option>
                        {cat && cat.categories && cat.categories.length > 0 ? (
                            cat.categories.map((e) => (
                                <option key={e._id} value={e._id}>{e.catName}</option>
                            ))
                        ) : (
                            <option value="none">No Category Available</option>
                        )}
                    </select>
                </div>
                <div className="inpt-pair">
                    <label htmlFor="image">Add Image:</label>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif"
                        placeholder="Add One Image"
                        ref={imageRef}
                        id="image"
                        onChange={handleImageUpload}
                    />
                    <div className="preview">
                        <img src={bImg} alt="" />
                    </div>
                    <p className='showUploading' style={{ display: uploading ? 'block' : 'none' }}>Uploading: {imagePerc}%</p>
                    <p className='showUploaded' style={{ display: imagePerc === 100 ? 'block' : 'none' }}>Uploaded: {imagePerc}%</p>
                </div>
                <Editor
                    apiKey="zoi7anvfgjfg5r44pqjlvj1c4yblqglmz2pas2i65pah5c6u"
                    onInit={(evt, editor) => editorRef.current = editor}
                    init={{
                        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                    }}
                />
                <input type="submit" value="Update Blog" />
            </form>
        </div>
    );
};

export default UpdateBlog;
