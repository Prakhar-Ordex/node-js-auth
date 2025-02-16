import { decryptData } from "./encryptData";

export const isLogin =  () =>{
    try {
        const loginUser = localStorage.getItem('auth');
        if(!loginUser) return false;
        const decryptedData = decryptData(loginUser);
        return Boolean(decryptedData); 
    } catch (error) {
        console.log(error)
        return false;
    }
};

export const clearAuth = () => {
    localStorage.clear();
    sessionStorage.clear();
};

// export const getCookie = () => {
//     const allCookies =  document.cookie.split(';');
//     console.log(allCookies);
//   };