import WatermarkForm from "../../features/admin/watermark/WatermarkForm";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";

function Watermark() {
    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    activeTab="WATERMARK"
                    tabs={[
                        {
                            id: "WATERMARK",
                            label: "Watermark",
                            bgColor: "#faf5ff",
                            fontColor: "#7e22ce",
                            path: "/admin/watermark",
                        },
                    ]}
                />
            </SectionTop>

            <section 
                className="sectionStyles"
                style={{
                    paddingLeft: "3rem",
                    backgroundColor: "#faf5ff",
                    height: "100vh"
                }}
            >
                <div style={{backgroundColor: "#faf5ff", boxShadow: "none"}}>
                    <WatermarkForm />
                </div>
            </section>
        </div>
    );
}

export default Watermark;
