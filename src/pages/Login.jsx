import styles from "./../styles/AuthPage.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginForm from "../features/auth/LoginForm";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) return navigate("/");  
    }, [currentUser, navigate]);

    return (
        <div className={styles.authPage}>
            <div className="imgContainer">
                <img src="/images/login.webp" alt="" />
            </div>

            <div className={styles.authPageContainer}>
                <LoginForm />
            </div>
        </div>
    );
}

export default Login;
