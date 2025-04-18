import RequestFilter from "../../features/admin/requests/RequestFilter";
import RequestList from "../../features/admin/requests/RequestList";
import { usePortalRequest } from "../../features/admin/requests/usePortalRequets";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";

function Request() {
    const { isPending, requestsData } = usePortalRequest();
    const data = requestsData?.requests ?? [];
    return (
        <div className="sectionContainer">
            <SectionTop heading="Requests">
                <TabBar
                    tabs={[
                        {
                            id: "REQUESTS",
                            label: "Requests",
                            bgColor: "#f0fff0",
                            fontColor: "#66b366",
                            path: "/admin/requests",
                        },
                    ]}
                    activeTab={"REQUESTS"}
                    navigateTo={() => `/admin/requests`}
                />
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: "#f0fff0" }}>
                <div className="sectionDiv">
                    <RequestFilter/>
                    <RequestList data={data} isPending={isPending} />
                </div>
            </section>
        </div>
    );
}

export default Request;
