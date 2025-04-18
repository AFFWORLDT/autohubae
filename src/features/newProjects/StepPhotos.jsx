import styles from "../../styles/MultiStepForm.module.css";
import DisplayImagesOnAdd from "../../ui/DisplayImagesOnAdd";
import MultiStepForm from "../../ui/MultiStepForm";
import useDeleteProjectImage from "./useDeleteProjectImage";

function StepPhotos({  projectData }) {
    const { removeProjectImage,  } =
        useDeleteProjectImage();

    function handleRemoveImage(imageUrl) {
        return () =>
            removeProjectImage({
                projectId: projectData.id,
                imageUrl,
            });
    }

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
                    {/* {isEditSession && (
                        <DisplayImages
                            imagesData={projectData?.photos}
                            onAction={handleRemoveImage}
                            isDoingAction={isDeletingImage}
                            iconAction="/icons/delete.svg"
                        />
                    )} */}
                     <DisplayImagesOnAdd
                        imagesData={[]}
                        // onAction={handleRemoveImageWhileAdding}
                        // isDoingAction={isDeleting}
                        iconAction="/icons/delete.svg"
                      
                    />
                </div>
            </div>
        </div>
    );
}

export default StepPhotos;
