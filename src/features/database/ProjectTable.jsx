import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import ProjectRow from "./ProjectRow";

function ProjectTable({ data, isLoading }) {
    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <Table
            columns="1.20fr 1fr 1.20fr 1fr "
            rowWidth="110rem"
            transparent={true}
            hasShadow={true}
            hasBorder={true}
        >
            <Table.Header>
                <div>Project Name</div>
                <div>Area Name</div>
                <div>Agent Name</div>
                <div>Actions</div>
            </Table.Header>
            <Table.Body
                data={data}
                render={(projectObj) => (
                    <ProjectRow
                        projectData={projectObj}
                        key={projectObj?._id}
                    />
                )}
            />
        </Table>
    );
}

export default ProjectTable;
