import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createProject } from "../../services/apiNewProjects";
import { useSearchParams } from "react-router-dom";
import useImagesStore from "../../store/imagesStore";

function useCreateProject() {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const { clearAllImages } = useImagesStore();

    const projectStatus = searchParams.get("status");

    const { mutate: addProject, isPending } = useMutation({
        mutationFn: ({ newProject, photos, floorPlanList }) =>
            createProject(newProject, photos, floorPlanList),
        onSuccess: () => {
            toast.success(
                projectStatus === "POOL"
                    ? "Project claimed!"
                    : "New project created!"
            );
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            localStorage.removeItem("bayut");
            localStorage.removeItem("customPortal");
            localStorage.removeItem("dubizzle");
            localStorage.removeItem("ownPortal");
            localStorage.removeItem("propertyFinder");
            localStorage.removeItem("propfusionPortal");
            localStorage.removeItem("price_on_application"); 
        },
        onError: (err) => {
            toast.error(err.message);
            clearAllImages();
        },
        onSettled: () => {
            clearAllImages();
        },
    });


    return { addProject, isPending };
}

export default useCreateProject;
