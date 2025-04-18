import { useEffect, useState } from "react";
import styles from "../../styles/Listings.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import {
    bedroomString,
    dateToYMD,
    formatNum,
    getDaysFromCurrentDate,
} from "../../utils/utils";
import useCreateProject from "./useCreateProject";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Share2, Edit, Trash2, Download, Calendar, CreditCard } from "lucide-react";
import NewProjectMenus from "./NewProjectMenus";
import useDeleteProject from "./useDeleteProject";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";

function NewProjectsInteractive({ 
    isLoading, 
    data, 
    error,
    isFetchingNextPage 
}) {
    const navigate = useNavigate();
    const { addProject, isPending } = useCreateProject();
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();
    const projectStatus = searchParams.get("status");
    const { removeProject, isPending: isDeletingProject } = useDeleteProject();
    const [hoveredProject, setHoveredProject] = useState(null);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    function handleNavigate(id) {
        projectStatus === "POOL"
            ? navigate(`/new-projects/list/${id}?status=POOL`)
            : navigate(`/new-projects/list/${id}`);
    }

    function handleClaim(data) {
        data.projectStatus = "ACTIVE";
        addProject({ newProject: { ...data, agent_Id: currentUser.id } });
    }

    function handleShare(project) {
        window.open(
            `/share-project/${project.id}?userId=${currentUser?.id}`,
            "_blank",
            "noopener,noreferrer"
        );
    }

    function handleEdit(project) {
        navigate(`/new-projects/edit/${project.id}`);
    }

    function handleDelete(project) {
        removeProject(project.id, {
            onSettled: () => navigate(-1),
        });
    }

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            {isLoading ? (
                <div>
                    <Spinner type="fullPage" />
                </div>
            ) : (
                <>
                    <div className={styles.interactiveGrid}>
                        {data.map((item) => (
                            <motion.div
                                key={item.id}
                                className={styles.interactiveCard}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                onHoverStart={() => setHoveredProject(item.id)}
                                onHoverEnd={() => setHoveredProject(null)}
                            >
                                <div className={styles.interactiveImage}>
                                    <img src={item?.photos?.[0]} alt={item?.name} />
                                    <div className={styles.interactiveOverlay}>
                                        <span className={styles.status}>
                                            {projectStatus === "POOL" ? "POOL" : item.projectStatus}
                                        </span>
                                        {projectStatus === "POOL" && (
                                            <button
                                                className="btnNormalSmall"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleClaim(item);
                                                }}
                                                disabled={isPending}
                                            >
                                                Claim
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.interactiveContent}>
                                    <div className={styles.interactiveHeader}>
                                        <h3>{item?.name}</h3>
                                        <div className={styles.interactiveActions}>
                                            <button
                                                className={styles.actionButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleNavigate(item.id);
                                                }}
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                className={styles.actionButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShare(item);
                                                }}
                                                title="Share"
                                            >
                                                <Share2 size={18} />
                                            </button>
                                            {projectStatus !== "POOL" && (
                                                <>
                                                    <button
                                                        className={styles.actionButton}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(item);
                                                        }}
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <Modal>
                                                        <Modal.Open openWindowName={`delete-${item.id}`}>
                                                            <button
                                                                className={styles.actionButton}
                                                                onClick={(e) => e.stopPropagation()}
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </Modal.Open>
                                                        <Modal.Window name={`delete-${item.id}`}>
                                                            <ConfirmDelete
                                                                resourceName={`Project ${item.name}`}
                                                                onConfirm={() => handleDelete(item)}
                                                                isDeleting={isDeletingProject}
                                                            />
                                                        </Modal.Window>
                                                    </Modal>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <p className={styles.price}>
                                        {formatNum(item?.newParam?.price)} AED
                                    </p>
                                    <div className={styles.interactiveDetails}>
                                        <span>{item?.area?.name || "N/A"}</span>
                                        <span>{item?.developer?.name || "N/A"}</span>
                                        <span>
                                            {`${bedroomString(item.newParam?.bedroomMin)} - ${bedroomString(item.newParam?.bedroomMax)}`}
                                        </span>
                                    </div>
                                    <div className={styles.paymentPlan}>
                                        <div className={styles.paymentPlanHeader}>
                                            <CreditCard size={16} />
                                            <span>Payment Plan</span>
                                            <span className={styles.handoverDate}>
                                                <Calendar size={16} />
                                                {dateToYMD(item?.newParam?.handoverTime) || "N/A"}
                                            </span>
                                        </div>
                                        <div className={styles.paymentPlanDetails}>
                                            <div className={styles.paymentPlanItem}>
                                                <span>First</span>
                                                <span>{item?.payment_planParam?.first_installment || 0}%</span>
                                            </div>
                                            <div className={styles.paymentPlanItem}>
                                                <span>Under Constr.</span>
                                                <span>{item?.payment_planParam?.under_construction || 0}%</span>
                                            </div>
                                            <div className={styles.paymentPlanItem}>
                                                <span>Handover</span>
                                                <span>{item?.payment_planParam?.on_handover || 0}%</span>
                                            </div>
                                            <div className={styles.paymentPlanItem}>
                                                <span>Post</span>
                                                <span>{item?.payment_planParam?.post_handover || 0}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.interactiveFooter}>
                                        <span className={styles.date}>
                                            {`${getDaysFromCurrentDate(item?.createTime)} days ago`}
                                        </span>
                                        <button
                                            className={styles.downloadButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(
                                                    `/share-project/${item.id}?pdf=1&userId=${currentUser?.id}`,
                                                    "_blank",
                                                    "noopener,noreferrer"
                                                );
                                            }}
                                        >
                                            <Download size={16} />
                                            PDF
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {isFetchingNextPage && (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            padding: '1rem',
                            backgroundColor: 'transparent' 
                        }}>
                            <Spinner />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default NewProjectsInteractive; 