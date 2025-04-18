import styles from "../../styles/MultiStepForm.module.css";
import DisplayImages from "../../ui/DisplayImages";
import DisplayImagesOnAdd from "../../ui/DisplayImagesOnAdd";
import MultiStepForm from "../../ui/MultiStepForm";
// import { useDeleteImage } from "../Extra/useDeleteImage";
import useDeletePropertyImage from "./useDeletePropertyImage";

function StepMedia({ isEditSession = false, propertyData }) {
    const { removePropertyImage, isPending: isDeletingImage } =
        useDeletePropertyImage();
    // const { deleteImage, isDeleting } = useDeleteImage();

    function handleRemoveImage(imageUrl) {
        return () =>
            removePropertyImage({
                propertyId: propertyData?.id,
                imageUrl: [imageUrl],
            });
    }
    // function handleRemoveImageWhileAdding(imageUrl) {
    //     return () => deleteImage(imageUrl);
    // }


    return (
        <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
            <div
                style={{ gridTemplateColumns: "1fr" }}
                className={styles.formContainer}
            >
                <div>
                    <MultiStepForm.InputFile
                        registerName="photos"
                        label="Images"
                        accept="image/*"
                        multiple={true}
                    />
                    <DisplayImagesOnAdd
                        imagesData={[]}
                        // onAction={handleRemoveImageWhileAdding}
                        // isDoingAction={isDeleting}
                        iconAction="/icons/delete.svg"

                    />

                    {/* {isEditSession && (
                        <DisplayImages
                            imagesData={propertyData?.photos}
                            onAction={handleRemoveImage}
                            isDoingAction={isDeletingImage}
                            iconAction="/icons/delete.svg"
                        />
                    )} */}
                </div>
                <MultiStepForm.Input
                    registerName="videoLink"
                    placeholder="Enter Link for video"
                    label="Video Link"
                />
                <MultiStepForm.Input
                    registerName="view360"
                    placeholder="Enter Link for View 360"
                    label="View 360"
                />
                <div>
                    <MultiStepForm.InputFileLocal
                        registerName="ownerDocs"
                        label="Owner Docs"
                        multiple={true}
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                    />
                    {isEditSession && (
                        <DisplayImages
                            imagesData={propertyData?.ownerDocs}
                            onAction={handleRemoveImage}
                            isDoingAction={isDeletingImage}
                            iconAction="/icons/delete.svg"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default StepMedia;
