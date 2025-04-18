import styles from "./Loader.module.css";

function Loader() {
    return (
        <div className={styles.loader}>
            <img src="/images/loader.gif" />
        </div>
    );
}

export default Loader;
