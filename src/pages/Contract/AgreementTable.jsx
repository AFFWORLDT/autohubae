import React from 'react';
import styles from './AgreementTable.module.css';
import SectionTop from '../../ui/SectionTop';
import useAllDetails from '../../features/all-details/useAllDetails';
import { useAgreements } from '../../features/Contract/useAgrement'; 
import { useInView } from 'react-intersection-observer';
import { AlertCircle, Briefcase, Building, Eye, FileText, Home, Loader2, Printer, Trash2, User } from 'lucide-react';
import { DeleteModal } from '../../features/SmtpSetting/DeleteModal';
import { useNavigate } from 'react-router-dom';
import useDeleteContract from '../../features/Contract/useDelete';

const AgreementTable = () => {
  const { data: companyData } = useAllDetails();
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const navigate=useNavigate()
  const handleView = (id) => {
    // Handle view action
    setActiveDropdown(null);
  };
  const { ref, inView } = useInView();
      const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
      const [Id, setId] = React.useState(null);
     const { deleteing, isPending }=useDeleteContract()
      const [activeTab, setActiveTab] = React.useState('all');

      const contracts = [
        {
          id: 'all',
          title: "All Contracts",
          icon: <FileText size={28} color="#3B82F6" />,
        },
        {
          id: 'tenancy',
          title: "Tenancy Contract",
          icon: <Home size={28} color="#3B82F6" />,
        },
        {
          id: 'lease',
          title: "Lease-contract",
          icon: <Briefcase size={28} color="#9CA3AF" />,
        },
        {
          id: 'propertyview',
          title: "Property View Contract",
          icon: <Building size={28} color="#9CA3AF" />,
        },
        {
          id: 'owner',
          title: "Owner-and-Broker",
          icon: <FileText size={28} color="#9CA3AF" />,
        },
        {
          id: 'A2A',
          title: "Agent 2 Agent",
          icon: <User size={28} color="#9CA3AF" />,
        }
      ];
      const downloadPdf = (agreement) => {
        if (!agreement?.id) {
          console.error('Agreement ID is missing');
          return;
        }
      
        switch (agreement.agreement_type) {
          case 'tenancy':
            navigate(`/contract/dubai-TenantForm?id=${agreement.id}`);
            break;
          case 'lease':
            navigate(`/contract/lease-contract?id=${agreement.id}`);
            break;
          case 'propertyview':
            navigate(`/contract/property-view-contract?id=${agreement.id}`);
            break;
          case 'owner':
            navigate(`/contract/owner-and-broker?id=${agreement.id}`);
            break;
          default:
            console.error('Unknown agreement type:', agreement.agreement_type);
        }
      };
      const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
      } = useAgreements({
        agreement_type: activeTab === 'all' 
          ? undefined
          : activeTab
      });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  const formatDate = (dateString) => {
    if (!dateString) return <span className={styles.placeholder}>-</span>;
    return (
      <span className={styles.dateValue}>
        {new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          // hour: '2-digit',
          // minute: '2-digit'
        })}
      </span>
    );
  };
  const handleDelete = (id) => {
    setId(id);
    setDeleteModalOpen(true);
};

const handleConfirmDelete = () => {
  deleteing(Id)
    setDeleteModalOpen(false);
    setId(null);
};

 

  const formatCurrency = (value) => {
    if (!value) return <span className={styles.placeholder}>-</span>;
    return (
      <span className={styles.currencyValue}>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'AED',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value)}
      </span>
    );
  };

  const handleEdit = (id) => {
    console.log(`Edit agreement with ID: ${id}`);
  };

  if (status === 'pending') {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.loadingState}>
          <Loader2 className={styles.loadingIcon} />
          <p className={styles.statusMessage}>Loading agreements...</p>
        </div>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.errorState}>
          <AlertCircle className={styles.errorIcon} />
          <p className={styles.statusMessage}>Unable to load agreements</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sectionContainer">
      <SectionTop heading="Contract Table" />
      
      <div className="sectionStyles">
      <div className={styles.tabContainer}>
        {contracts.map((contract) => (
          <button
            key={contract.id}
            className={`${styles.tabButton} ${activeTab === contract.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(contract.id)}
          >
            <span className={styles.tabIcon}>{contract.icon}</span>
            <span className={styles.tabTitle}>{contract.title}</span>
          </button>
        ))}
      </div>
        <div className={styles.container}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader} style={{
                background: companyData?.company_settings?.sidebar_color_code || "#020079",
              }}>
                <tr>
                  <th className={styles.tableHeaderCell}>Contract ID</th>
                  <th className={styles.tableHeaderCell}>Owner</th>
                  <th className={styles.tableHeaderCell}>Tenant</th>
                  <th className={styles.tableHeaderCell}>Property Details</th>
                  <th className={styles.tableHeaderCell}>Contract Value</th>
                  <th className={styles.tableHeaderCell}>End Dtae</th>
                  <th className={styles.tableHeaderCell}>Security Deposit</th>
                  <th className={styles.tableHeaderCell}>Annual Rent</th>
                  <th className={styles.tableHeaderCell}>Agreement Type</th>
                  <th className={styles.tableHeaderCell}>Created Info</th>
                  <th className={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.pages?.map((page) => (
                  page?.agreements?.map((agreement) => (
                    <tr key={agreement.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>{agreement.id}</td>
                      <td className={styles.tableCell}>{agreement.owner_name}</td>
                      <td className={styles.tableCell}>{agreement.tenant_name}</td>
                      <td className={styles.tableCell}>
                        {agreement.property_type || agreement.property_area ? (
                          <span className={styles.propertyTypeBadge}>
                            {agreement.property_type}
                            {agreement.property_area}

                          </span>
                        ) : (
                          <span className={styles.placeholder}>-</span>
                        )}
                      </td>
                      <td className={styles.tableCell}>
                        {formatCurrency(agreement.agreement_value)}
                      </td>
                      <td className={styles.tableCell}>
                        {formatDate(agreement.agreement_period_to)}
                      </td>
                     
                      <td className={styles.tableCell}>
                        {formatCurrency(agreement.security_deposit_amount)}
                      </td>
                      <td className={styles.tableCell}>
                        {formatCurrency(agreement.annual_rent)}
                      </td>
                      <td className={styles.tableCell}>
                        {agreement.agreement_type ? (
                          <span className={styles.agreementTypeBadge}>
                            {agreement.agreement_type==="tenancy" && ("Tenancy Contract")}
                            {agreement.agreement_type==="lease" && ("Lease Contract")}
                            {agreement.agreement_type==="propertyview" && ("Property  Contract")}
                            {agreement.agreement_type==="owner" && ("Owner Contract")}
                            {agreement.agreement_type==="A2A" && ("Agent 2 Agent")}
                          </span>
                        ) : (
                          <span className={styles.placeholder}>-</span>
                        )}
                      </td>
                      <td className={styles.tableCell}>{formatDate(agreement.created_at)}</td>
                      <td className={styles.tableCell}>
                      <div className={styles.actions}>
                    <button
                      className={styles.dropdownTrigger}
                      onClick={() => setActiveDropdown(activeDropdown === agreement.id ? null : agreement.id)}
                    >
                      •••
                    </button>
                    {activeDropdown === agreement.id && (
                      <div className={styles.dropdownMenu}>
                        <button className={styles.dropdownItem} onClick={() => handleView(agreement.id)}>
                          <Eye /> View Details
                        </button>
                        <button className={styles.dropdownItem}>
                          <FileText /> Supporting Docs
                        </button>
                        <button className={styles.dropdownItem} onClick={()=> downloadPdf(agreement)} >
                          <Printer /> Print Contract
                        </button>
                        <button 
                          className={`${styles.dropdownItem} ${styles.deleteButton}`}
                          onClick={() => handleDelete(agreement.id)}
                        >
                          <Trash2 /> Delete Contract
                        </button>
                      </div>
                    )}
                  </div>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
            <div ref={ref} className={styles.loaderContainer}>
  {isFetchingNextPage ? (
    <>
      <Loader2 className={styles.loadingIcon} />
      <span className={styles.loadMoreText}>Loading more agreements...</span>
    </>
  ) : hasNextPage ? (
   null
  ) : (
    <span className={styles.loadMoreText}>All agreements loaded</span>
  )}
</div>

          </div>
        </div>
      </div>
      <DeleteModal  isOpen={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleConfirmDelete}
                        title={"Agrement"}
                        isDeleting={isPending}
                        />
    </div>
  );
};

export default AgreementTable;
