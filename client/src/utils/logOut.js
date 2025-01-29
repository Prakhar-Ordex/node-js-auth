

export const handleLogout = async () => {
    const navigate = useNavigate();
    try {
        const response = await fetch('http://localhost:3000/auth/logout', {
            method: 'POST',
            credentials: 'include', 
        });
        if (response.status === 200) { 
            localStorage.clear();
            toast.success("Logout successful");
            navigate('/');
        } else {
            console.error("Logout failed:", response.statusText);
        }
    } catch (error) {
        console.error("Error during logout:", error);
        toast.error("Failed to logout");
    }
};
