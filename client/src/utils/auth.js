
export const isLogin =  () =>{
    const loginUser = localStorage.getItem('loginUser');
    if(loginUser){
        return true;
    }else{
        return false;
    }
}

// export const getCookie = () => {
//     const allCookies =  document.cookie.split(';');
//     console.log(allCookies);
//   };