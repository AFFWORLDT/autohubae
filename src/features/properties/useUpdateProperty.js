import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProperty } from "../../services/apiProperties";
import useImagesStore from "../../store/imagesStore";

function useUpdateProperty() {
    const queryClient = useQueryClient();
    const { clearAllImages } = useImagesStore();

    const { mutate: changeProperty, isPending } = useMutation({
        mutationFn: ({ id, updatedProperty, ownerDocs, photos }) =>
            updateProperty(id, updatedProperty, ownerDocs, photos),
        onSuccess: () => {
            toast.success("Property updated!");
            queryClient.invalidateQueries({ queryKey: ["newProperty"] });
            queryClient.invalidateQueries({ queryKey: ["newProperties"] });
            queryClient.invalidateQueries({ queryKey: ["building"] });
            localStorage.removeItem("bayut");
            localStorage.removeItem("customPortal");
            localStorage.removeItem("dubizzle");
            localStorage.removeItem("ownPortal");
            localStorage.removeItem("propertyFinder");
            localStorage.removeItem("propfusionPortal");
            localStorage.removeItem("price_on_application");
            clearAllImages();
        },
        onError: (err) => {
            toast.error(err.message);
            clearAllImages();
        },
        onSettled: () => {
            clearAllImages();
        },
    });

    return { changeProperty, isPending };
}

export default useUpdateProperty;
