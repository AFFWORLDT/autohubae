import { useState } from "react";
import styles from "../../styles/AuthForm.module.css";
import useLogin from "./useLogin";
import Loader from "../../ui/Loader";

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { handleLogin, isPending } = useLogin();

    function handleSubmit(e) {
        e.preventDefault();
        if (!username || !password) return;
        handleLogin({ username: username.toLowerCase(), password });
    } 

    return !isPending ? (
        <form className={styles.authForm} onSubmit={handleSubmit}>
            <h1>Sign in to PropFusion </h1>
            <span className={styles.underline}></span>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                type="text"
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
            />
            <button
                className={styles.btnAuth}
                type="submit"
                disabled={isPending}
            >
                Login
            </button>
        </form>
    ) : (
        <Loader />
    );
}

export default LoginForm;
