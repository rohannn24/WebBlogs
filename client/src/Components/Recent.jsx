import React, { useEffect, useState } from 'react';
import './Style/Recent.css';
import { Link } from 'react-router-dom';

const Recent = ({ user }) => {
    

    return (
        <>
            <div className="full-recent">
                <div className="recent-main">
                    <Link to='/'>
                        <div className="m-card">
                            <div className="img-ctrl">
                                <img
                                    src="https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg"
                                    alt=""
                                    loading="lazy"
                                />
                            </div>
                            <div className="meta-data">
                                <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h4>
                                <p className='md-desc'>
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut minus aspernatur deserunt sequi unde, consequatur delectus aperiam non molestiae provident voluptatem reiciendis laborum ipsam sit repudiandae dolores pariatur. Aut, consequuntur.
                                </p>
                                <div className="extra-data">
                                    <p className="author">Rohan Kumar</p>
                                </div>
                            </div>
                            <div className="category">Photography</div>
                        </div>
                    </Link>
                </div>
                <div className="recent-four">
                    <div className="rf-card">
                        <Link to='/'>
                            <div className="m-card">
                                <div className="img-ctrl">
                                    <img
                                        src="https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                </div>
                                <div className="meta-data">
                                    <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h4>
                                    <div className="extra-data">
                                        <p className="author">Rohan Kumar</p>
                                    </div>
                                </div>
                                <div className="category">Photography</div>
                            </div>
                        </Link>
                    </div>
                    <div className="rf-card">
                        <Link to='/'>
                            <div className="m-card">
                                <div className="img-ctrl">
                                    <img
                                        src="https://h5p.org/sites/default/files/h5p/content/1209180/images/file-6113d5f8845dc.jpeg"
                                        alt=""
                                        loading="lazy"
                                    />
                                </div>
                                <div className="meta-data">
                                    <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h4>
                                    <div className="extra-data">
                                        <p className="author">Rohan Kumar</p>
                                    </div>
                                </div>
                                <div className="category">Photography</div>
                            </div>
                        </Link>
                    </div>
                    <div className="rf-card">
                        <Link to='/'>
                            <div className="m-card">
                                <div className="img-ctrl">
                                    <img
                                        src="https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                </div>
                                <div className="meta-data">
                                    <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h4>
                                    <div className="extra-data">
                                        <p className="author">Rohan Kumar</p>
                                    </div>
                                </div>
                                <div className="category">Photography</div>
                            </div>
                        </Link>
                    </div>
                    <div className="rf-card">
                        <Link to='/'>
                            <div className="m-card">
                                <div className="img-ctrl">
                                    <img
                                        src="https://imgv3.fotor.com/images/slider-image/A-clear-close-up-photo-of-a-woman.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                </div>
                                <div className="meta-data">
                                    <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h4>
                                    <div className="extra-data">
                                        <p className="author">Rohan Kumar</p>
                                    </div>
                                </div>
                                <div className="category">Photography</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Recent;
