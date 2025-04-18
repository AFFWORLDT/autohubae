import { cloneElement, createContext, useContext, useState } from "react";
import useOutsideClick from "../hooks/useOutsideClick";
import styles from "./Modal.module.css";
import { createPortal } from "react-dom";

const ModalContext = createContext();

function Modal({ children }) {
    const [openName, setOpenName] = useState(null);

    function close() {
        setOpenName(null);
    }
    const open = setOpenName;

    return (
        <ModalContext.Provider value={{ openName, open, close }}>
            {children}
        </ModalContext.Provider>
    );
}

function Open({ children, openWindowName }) {
    const { open } = useContext(ModalContext);

    return cloneElement(children, { onClick: () => open(openWindowName) });
}

function Window({ children, name, overflow = false }) {
    const { openName, close } = useContext(ModalContext);
    const ref = useOutsideClick(close);

    if (!openName || openName !== name) return null;

    return createPortal(
        <div className={styles.overlay}>
            <div
                style={{ overflowY: overflow ? "auto" : "hidden" }}
                ref={ref}
                className={styles.modalContainer}
            >
                <button className={styles.btnClose} onClick={close}>
                    <img src="/icons/close.svg" />
                </button>
                {cloneElement(children, { onCloseModal: close })}
            </div>
        </div>,
        document.body
    );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
