import SectionTop from "../../ui/SectionTop";
import MultiStepForm from "../../ui/MultiStepForm";
import SvgMap from "../../assets/map.svg?react";
import SvgInfo from "../../assets/info.svg?react";
import SvgDescription from "../../assets/description.svg?react";
import SvgMedia from "../../assets/media.svg?react";
import SvgHome from "../../assets/home.svg?react";
import SvgCard from "../../assets/card.svg?react";
import SvgPortals from "../../assets/portals.svg?react";
import StepFloorPlans from "../../features/newProjects/StepFloorPlans";
import StepLocation from "../../features/newProjects/StepLocation";
import StepPayment from "../../features/newProjects/StepPayment";
import StepPhotos from "../../features/newProjects/StepPhotos";
import StepDescription from "../../features/newProjects/StepDescription";
import StepInfo from "../../features/newProjects/StepInfo";
import StepPortals from "../../features/newProjects/StepPortals";
import useUpdateProject from "../../features/newProjects/useUpdateProject";
import useProject from "../../features/newProjects/useProject";
import { buildProjectData } from "../../utils/buildFormData";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import { AMENITIES_OPTIONS, PROPERTY_TYPES } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import PageNotFound from "../PageNotFound";
import useImagesStore from "../../store/imagesStore";
import useDeleteImageStore from "../../store/deleteImageStore";
import { useDeleteImage } from "../../features/Extra/useDeleteImage";

function EditNewProject() {
    const { images, setImages } = useImagesStore();
    const { images: deleteImages } = useDeleteImageStore();
    const { deleteImage } = useDeleteImage();
    const {
        data: projectData,
        isLoading: isLoadingProject,
        error: errorProject,
    } = useProject();
    const { changeProject, isPending: isUpdatingProject } = useUpdateProject();


    const navigate = useNavigate();
    const [floorPlanList, setFloorPlanList] = useState([]);

    // Floor plans added by user
    const newFloorPlans = floorPlanList.filter(
        (floorPlan) => !Object.keys(floorPlan).includes("id")
    );

    useEffect(() => {
        if (errorProject) toast.error(errorProject.message);
    }, [errorProject]);

    useEffect(() => {
        if (projectData?.[0]?.photos) {
            setImages(projectData[0].photos);
        }
    }, [projectData, setImages]);



    useEffect(() => {
        setFloorPlanList([
            ...(projectData?.[0]?.floor_plans ?? []),
            ...newFloorPlans,
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectData]);

    function handleFormSubmit(data) {
        const updatedProject = buildProjectData(data);

        changeProject(
            {
                projectId: data.id,
                photos: data.photos,
                updatedProject: {
                    ...updatedProject,
                    photos: images,
                },
                newFloorPlans,

            },
            {
                onSettled: () => {
                    if (deleteImages.length > 0) {
                        console.log(deleteImages);
                        deleteImage(deleteImages);
                    }
                    navigate(`/new-projects/list/${data.id}`)

                },
            },
            {
                onSuccess: () => {
                    if (deleteImages.length > 0) {
                        console.log(deleteImages);
                        deleteImage(deleteImages);
                    }
                },
            }
        );

        setFloorPlanList([]);
    }

    function renderStep(step) {
        switch (step) {
            case 1:
                return <StepLocation />;
            case 2:
                return <StepInfo />;
            case 3:
                return <StepDescription />;
            case 4:
                return (
                    <StepPhotos
                        isEditSession={true}
                        projectData={projectData[0]}
                    />
                );
            case 5:
                return (
                    <StepFloorPlans
                        floorPlanList={floorPlanList}
                        setFloorPlanList={setFloorPlanList}
                        isEditSession={true}
                        projectId={projectData[0].id}
                    />
                );
            case 6:
                return <StepPayment />;
            case 7:
                return <StepPortals />;
            default:
                return null;
        }
    }

    if (isLoadingProject)
        return <Spinner type="fullPage" />;
    if (projectData.length === 0) return <PageNotFound />;

    const paramObj = projectData[0].newParam;

    const defaultValues = {
        ...projectData[0],
        ...projectData[0].payment_planParam,
        ...paramObj,
        handoverTime: paramObj.handoverTime
            ? new Date(paramObj.handoverTime)
            : "",
        agent_Id: projectData[0].agent_Id
            ? {
                label: projectData[0]?.agent?.name,
                value: projectData[0]?.agent_Id,
            }
            : {},
        area_id: projectData[0].area_id
            ? {
                label: projectData[0]?.area?.name,
                value: projectData[0]?.area_id,
            }
            : {},
        developerId: projectData[0]?.developerId
            ? {
                label: projectData[0]?.developer?.name,
                value: projectData[0]?.developerId,
            }
            : {},
        propertyTypes: PROPERTY_TYPES.filter((obj) =>
            projectData[0].propertyTypes?.includes(obj.value)
        ).map((obj) => {
            return {
                label: obj.label,
                value: obj.value,
            };
        }),
        amenities: AMENITIES_OPTIONS
            .filter((obj) => paramObj.amenities?.includes(obj.code))
            .map((obj) => {
                return {
                    label: obj.label,
                    value: obj.code,
                };
            }),
    };

    delete defaultValues.photos;
    delete defaultValues.newParam;
    delete defaultValues.payment_planParam;
    delete defaultValues.floor_plans;

    return (
        <div className="sectionContainer">
            <SectionTop heading={`Edit New Project`} />
            <section className="sectionStyles">
                <MultiStepForm
                    totalSteps={7}
                    renderStep={renderStep}
                    onFormSubmit={handleFormSubmit}
                    isSubmitting={isUpdatingProject}
                    defaultValues={defaultValues}
                >
                    <div className="sectionDiv">
                        <MultiStepForm.ProgressBar
                            content={[
                                { title: "Location", svg: <SvgMap /> },
                                { title: "Information", svg: <SvgInfo /> },
                                {
                                    title: "Description",
                                    svg: <SvgDescription />,
                                },
                                { title: "Photos", svg: <SvgMedia /> },
                                { title: "Floor Plans", svg: <SvgHome /> },
                                { title: "Payment Plan", svg: <SvgCard /> },
                                { title: "Portals", svg: <SvgPortals /> },
                            ]}
                        />
                    </div>
                </MultiStepForm>
            </section>
        </div>
    );
}

export default EditNewProject;
