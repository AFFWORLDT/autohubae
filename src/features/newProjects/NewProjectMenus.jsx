import { useNavigate } from "react-router-dom";
import Modal from "../../ui/Modal";
import Menus from "../../ui/Menus";
import ConfirmDelete from "../../ui/ConfirmDelete";
import useDeleteProject from "./useDeleteProject";
import useUpdateProject from "./useUpdateProject";
import styles from "./NewProjectMenus.module.css";
import { useAuth } from "../../context/AuthContext";

function NewProjectMenus({ data }) {
    const { currentUser } = useAuth();
    const { removeProject, isPending: isDeletingProject } = useDeleteProject();
    const { changeProject } = useUpdateProject();
    const navigate = useNavigate();

    function handleChangeStatus(projectStatus) {
        const updatedProject = {
            ...data,
            projectStatus,
        };

        delete updatedProject.id;

        changeProject({ projectId: data.id, updatedProject });
    }

    return (
        <div className={styles.projectMenus}>
            <Modal>
                <Menus>
                    <Menus.Toggle id={data.id} />

                    <Menus.List id={data.id}>
                        {data.projectStatus === "SOLD" && (
                            <Menus.Button
                                onClick={() => handleChangeStatus("ACTIVE")}
                                icon="/icons/eye.svg"
                            >
                                Activate
                            </Menus.Button>
                        )}

                        {data.projectStatus === "ACTIVE" && (
                            <Menus.Button
                                onClick={() => handleChangeStatus("SOLD")}
                                icon="/icons/eye-off.svg"
                            >
                                Sold Out
                            </Menus.Button>
                        )}

                        <Menus.Button
                            onClick={() =>
                                navigate(`/new-projects/edit/${data.id}`)
                            }
                            icon="/icons/edit.svg"
                        >
                            Edit
                        </Menus.Button>

                        <Modal.Open openWindowName="deleteProject">
                            <Menus.Button icon="/icons/delete.svg">
                                Delete
                            </Menus.Button>
                        </Modal.Open>

                        <Menus.Button
                            icon="/icons/share.svg"
                            onClick={() =>
                                window.open(
                                    `/share-project/${data.id}?pdf=1&userId=${currentUser?.id}`,
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                        >
                            Share PDF
                        </Menus.Button>

                        <Menus.Button
                            icon="/icons/share-social.svg"
                            onClick={() =>
                                window.open(
                                    `/share-project/${data.id}?userId=${currentUser?.id}`,
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                        >
                            Share Link
                        </Menus.Button>
                    </Menus.List>
                </Menus>

                <Modal.Window name="deleteProject">
                    <ConfirmDelete
                        resourceName="project"
                        onConfirm={() =>
                            removeProject(data.id, {
                                onSettled: () => navigate(-1),
                            })
                        }
                        isDeleting={isDeletingProject}
                    />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default NewProjectMenus;
