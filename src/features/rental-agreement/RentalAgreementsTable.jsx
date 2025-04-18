import PageNotFound from "../../pages/PageNotFound";
import Spinner from "../../ui/Spinner";
import EditRentalAgreeMent from "./EditRentalAgreeMent";
import styles from "./RentalAgreements.module.css";
import { useNavigate } from "react-router-dom";

function RentalAgreementsTable({ isLoading, error, data, isFetchingNextPage }) {
    const navigate = useNavigate();

    if (isLoading) return <Spinner type="fullPage" />;
    if (error) return <PageNotFound error={error} />;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'AED'
        }).format(amount);
    };

    const handleDetailsClick = (agreementId) => {
        navigate(`/rental-agreement/list/${agreementId}`);
    };

    const handleEditClick = (agreementId) => {
        navigate(`/rental-agreement/edit/${agreementId}`);
    };

    const handlePropertyClick = (propertyId) => {
        window.open(`/for-rent/new-list/${propertyId}`, '_blank');
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Property</th>
                        <th>Tenant</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Rent</th>
                        <th>Payment</th>
                        <th>Deposit</th>
                        <th>Status</th>
                        <th>Details</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((agreement) => (
                        <tr
                            key={agreement?.id}
                            className={styles.tableRow}
                        >
                            <td>
                                <div className={styles.tableCell}>
                                    #{agreement?.id}
                                </div>
                            </td>
                            <td>
                                <div 
                                    className={`${styles.tableCell} ${styles.clickableCell}`}
                                    onClick={() => handlePropertyClick(agreement?.property?.id)}
                                >
                                    {agreement?.property?.title || agreement?.property_id}
                                    {agreement?.property?.buildingName && ` - ${agreement.property.buildingName}`}
                                    {agreement?.property?.location && ` (${agreement.property.location})`}
                                    {agreement?.property?.property_type && ` [${agreement.property.property_type}]`}
                                </div>
                            </td>
                            <td>
                                <div className={styles.tableCell}>
                                    {agreement?.tenant?.name || agreement?.tenant_id}
                                </div>
                            </td>
                            <td>
                                <div className={styles.tableCell}>
                                    {formatDate(agreement?.start_date)}
                                </div>
                            </td>
                            <td>
                                <div className={styles.tableCell}>
                                    {formatDate(agreement?.end_date)}
                                </div>
                            </td>
                            <td>
                                <div className={styles.tableCell}>
                                    {formatCurrency(agreement?.rent_amount)}
                                </div>
                            </td>
                            <td>
                                <div className={styles.tableCell}>
                                    {agreement?.payment_frequency}
                                </div>
                            </td>
                            <td>
                                <div className={styles.tableCell}>
                                    {formatCurrency(agreement?.security_deposit)}
                                </div>
                            </td>
                            <td>
                                <div className={`${styles.tableCell} ${styles.statusCell}`}>
                                    {agreement?.status}
                                </div>
                            </td>
                            <td>
                                <div className={styles.tableCell}>
                                    <button 
                                        className={styles.actionButton}
                                        onClick={() => handleDetailsClick(agreement?.id)}
                                    >
                                        Details
                                    </button>
                                </div>
                            </td>
                            <td>
                                <div className={styles.tableCell}>
                                    <EditRentalAgreeMent defaultValues={agreement}>
                                    <button 
                                        className={styles.actionButton}
                                        onClick={() => handleEditClick(agreement?.id)}
                                    >
                                        Edit
                                    </button>
                                    </EditRentalAgreeMent>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isFetchingNextPage && (
                <div className={styles.loadingMore}>
                    <Spinner type="small" />
                    <span>Loading more agreements...</span>
                </div>
            )}
        </div>
    );
}

export default RentalAgreementsTable; 