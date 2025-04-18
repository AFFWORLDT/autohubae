import { useEffect } from "react";
import { Container, Row, Col, Spinner, ToastContainer } from "react-bootstrap";
import CustomCard from "../../../ui/CustomCard";
import useStaff from "./useStaff";
import toast from "react-hot-toast";
import useRoles from "../teams/useRoles";

const CardGrid = () => {
    useRoles();

    const { isLoading, data, error } = useStaff();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    if (isLoading) {
        return <Spinner type="fullPage" />;
    }

    return (
        <>
            <Container>
                <Row>
                    {data.map((data, index) => (
                        <Col
                            key={index}
                            sm={12}
                            md={6}
                            lg={4}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {<CustomCard staffData={data} />}
                        </Col>
                    ))}
                </Row>
            </Container>
            <ToastContainer />
        </>
    );
};

export default CardGrid;
