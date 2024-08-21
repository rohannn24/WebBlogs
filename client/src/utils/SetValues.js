export const setUser = (user, token) => {
    localStorage.setItem('user', JSON.stringify(user)); 
    localStorage.setItem('token', token); 
};

export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user): null;
}

export const userLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
}

export const checkAdmin = async () => {
    const res = await fetch(`/api/admin/validate`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('token')
        }
    })
    const resData = await res.json();
    return await resData;
}