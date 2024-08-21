import React, { useRef, useEffect, useState } from 'react';
import './Style/BlogEditor.css';
import { Editor } from '@tinymce/tinymce-react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { useNavigate } from 'react-router-dom';

const BlogEditor = ({
    showAlert,
    user
}) => {
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const keywordRef = useRef(null);
    const editorRef = useRef(null);
    const imageRef = useRef(null);
    const [bImg, setImageUrl] = useState("");
    const [imagePerc, setImgPerc] = useState("");
    const nav = useNavigate();
    useEffect(() => {
        const keywordInput = keywordRef.current;
        const handleKeyDown = (e) => {
            const value = e.target.value;
            if (e.key === ',' && value.slice(-1) === ',') {
                console.log(value);
            }
        };

        keywordInput.addEventListener("keydown", handleKeyDown);

        return () => {
            keywordInput.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    useEffect(() => {
        if(imagePerc === 100){
            document.querySelector('.showUploading').style.display = 'none'
            document.querySelector('.showUploaded').style.display = 'block'
        }
    }, [imagePerc])
    const handleImageUpload = () => {
        const file = imageRef.current.files[0];
        if (file) {
            const storage = getStorage(app);
            const fileName = `${new Date().getTime()}_${file.name}`;
            const storageRef = ref(storage, `blogImage/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            setImgPerc(Math.round(progress));
                            document.querySelector('.showUploading').style.display = 'block'
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    console.error('Upload failed:', error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUrl(downloadURL);
                    });
                }
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!bImg) {
            console.log('Image not uploaded yet.');
            return;
        }

        const blogData = {
            title: titleRef.current.value,
            description: descriptionRef.current.value,
            keyword: keywordRef.current.value,
            content: editorRef.current.getContent(),
            bImg: bImg
        };

        console.log('Blog Data:', JSON.stringify(blogData, null, 2));
        const res = await fetch('/api/admin/add-blog', {
            method: 'post',
            headers:{
                'Content-Type':'application/json',
                token: localStorage.getItem('token'),
            },
            body: JSON.stringify(blogData) 
        });
        const resData = await res.json();
        if(res.ok){
            console.log(resData);
            showAlert(resData.message);
            nav(`/admin/${user.username}/profile`)
            blogData = {
                title: null,
                description: null,
                keyword: null,
                content: null,
                bImg: null
            };
        }
    };

    return (
        <div className="full-editor">
            <h1>Add Blog</h1>
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
                    <label htmlFor="image">Add Image:</label>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif"
                        placeholder="Add One Image"
                        ref={imageRef}
                        id="image"
                        onChange={handleImageUpload}
                        required
                    />
                    <p className='showUploading'>Uploading: {imagePerc}%</p>
                    <p className='showUploaded'>Uploaded: {imagePerc}%</p>
                </div>
                <Editor
                    apiKey="zoi7anvfgjfg5r44pqjlvj1c4yblqglmz2pas2i65pah5c6u"
                    onInit={(evt, editor) => editorRef.current = editor}
                    init={{
                        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                    }}
                    initialValue="Remove this and start Blogging"
                />
                <input type="submit" value="Add Blog" />
            </form>
        </div>
    );
};

export default BlogEditor;
