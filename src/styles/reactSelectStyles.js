const REACT_SELECT_STYLES = {
    container: (provided) => ({
        ...provided,
        flexGrow: 1,
        minWidth: "20rem",
        maxWidth: "100%",
    }),
    control: (provided) => ({
        ...provided,
        padding: ".3rem .8rem",
        borderRadius: ".8rem",
        border: "1px solid #e0e3e2",
        minHeight: "48px", // Increased to match common input height
        height: "48px",
        fontSize: "1.4rem",
    }),
    menu: (provided) => ({
        ...provided,
        width: "100%",
    }),
    valueContainer: (provided) => ({
        ...provided,
        maxHeight: "48px", // Increased to match control height
        overflow: "hidden",
    }),
    multiValue: (provided) => ({
        ...provided,
        maxWidth: "100px",
    }),
};

export default REACT_SELECT_STYLES;
