import styles from './Breadcrumb.module.css';


const Breadcrumb = ({ items, filter = () => true, color = '#3d72a0', loading = false }) => {
    if (loading) {
        <h1>loading...</h1>
    }

    return (
        <nav aria-label="breadcrumb" style={{ '--breadcrumb-color': color }}>
            <ul className={styles.breadcrumb}>
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={styles.breadcrumbItem}
                    >
                        <div className={`${styles.numberBox} ${filter(item) ? styles.highlightBox : styles.grayBox}`}>
                            {index + 1}
                        </div>
                        <span className={filter(item) ? styles.highlight : styles.grayText}>
                            {item.label}
                        </span>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Breadcrumb;
