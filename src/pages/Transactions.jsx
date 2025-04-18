import { useState, useEffect } from "react";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getTransactionById } from "../api/TransactionsApi";
import { Modal, Button, Form, Table, Pagination, Dropdown, Card, Spinner } from "react-bootstrap";
import { FaPlus, FaEllipsisV, FaEdit, FaTrash, FaEye, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import styles from "../styles/Transactions.module.css";

function Transactions() {
    // State for transactions data
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    
    // Transaction detail modal state
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    
    // Update modal state
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    
    // Delete confirmation modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        purpose: "",
        lead_id: "",
        property_id: "",
        deal_price: 0,
        unit_number: "",
        commission_type: "",
        external_commission_reciver_name: "",
        buyer_commission_amount: 0,
        buyer_vat: 0,
        sellers_commission: 0,
        sellers_vat: 0,
        tenant_commission: 0,
        tenant_vat: 0,
        landlord_commission: 0,
        landlord_vat: 0,
        other_commission: 0,
        other_vat: 0,
        company_total_commission: 0,
        received_commission: 0,
        agent_total_commission: 0,
        agent_received_commission: 0,
        payment_method: "",
        contract_start_date: "",
        contract_end_date: "",
        deposit_amount: 0,
        buyer_documents: [],
        seller_documents: [],
        tenant_documents: [],
        landlord_documents: [],
        property_documents: [],
        contract_documents: []
    });
    
    // Fetch transactions data
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const filters = {
                    page: currentPage,
                    size: pageSize
                };
                
                const response = await getTransactions(filters, signal);
                
                if (Array.isArray(response)) {
                    setTransactions(response);
                    setTotalItems(response.length);
                    setTotalPages(Math.ceil(response.length / pageSize));
                } else if (response && response.items) {
                    setTransactions(response.items);
                    setTotalItems(response.total || response.items.length);
                    setTotalPages(Math.ceil((response.total || response.items.length) / pageSize));
                }
                
                setError(null);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Error fetching transactions:", err);
                    setError(err.message || "Failed to fetch transactions");
                    toast.error(err.message || "Failed to fetch transactions");
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchTransactions();
        
        return () => {
            controller.abort();
        };
    }, [currentPage, pageSize]);
    
    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        
        // Convert numeric values
        if (type === 'number') {
            setFormData({ ...formData, [name]: Number(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createTransaction(formData);
            
            // Refresh transactions list
            const filters = {
                page: currentPage,
                size: pageSize
            };
            const response = await getTransactions(filters);
            
            if (Array.isArray(response)) {
                setTransactions(response);
            } else if (response && response.items) {
                setTransactions(response.items);
            }
            
            setShowModal(false);
            toast.success("Transaction created successfully!");
            
            // Reset form data
            setFormData({
                purpose: "",
                lead_id: "",
                property_id: "",
                deal_price: 0,
                unit_number: "",
                commission_type: "",
                external_commission_reciver_name: "",
                buyer_commission_amount: 0,
                buyer_vat: 0,
                sellers_commission: 0,
                sellers_vat: 0,
                tenant_commission: 0,
                tenant_vat: 0,
                landlord_commission: 0,
                landlord_vat: 0,
                other_commission: 0,
                other_vat: 0,
                company_total_commission: 0,
                received_commission: 0,
                agent_total_commission: 0,
                agent_received_commission: 0,
                payment_method: "",
                contract_start_date: "",
                contract_end_date: "",
                deposit_amount: 0,
                buyer_documents: [],
                seller_documents: [],
                tenant_documents: [],
                landlord_documents: [],
                property_documents: [],
                contract_documents: []
            });
        } catch (err) {
            console.error("Error creating transaction:", err);
            toast.error(err.message || "Failed to create transaction");
        } finally {
            setLoading(false);
        }
    };
    
    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    
    // Handle page size change
    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
        setCurrentPage(1); // Reset to first page when changing page size
    };
    
    // Handle view transaction details
    const handleViewDetails = async (transaction) => {
        setDetailLoading(true);
        setSelectedTransaction(null);
        setShowDetailModal(true);
        
        try {
            const transactionDetails = await getTransactionById(transaction.id);
            console.log("this is the transaction details", transactionDetails);
            setSelectedTransaction(transactionDetails[0]);
        } catch (err) {
            console.error("Error fetching transaction details:", err);
            toast.error(err.message || "Failed to fetch transaction details");
        } finally {
            setDetailLoading(false);
        }
    };
    
    // Handle update transaction
    const handleUpdateTransaction = (transaction) => {
        setSelectedTransaction(transaction);
        setFormData({
            purpose: transaction.purpose || "",
            lead_id: transaction.lead_id || "",
            property_id: transaction.property_id || "",
            deal_price: transaction.deal_price || 0,
            unit_number: transaction.unit_number || "",
            commission_type: transaction.commission_type || "",
            external_commission_reciver_name: transaction.external_commission_reciver_name || "",
            buyer_commission_amount: transaction.buyer_commission_amount || 0,
            buyer_vat: transaction.buyer_vat || 0,
            sellers_commission: transaction.sellers_commission || 0,
            sellers_vat: transaction.sellers_vat || 0,
            tenant_commission: transaction.tenant_commission || 0,
            tenant_vat: transaction.tenant_vat || 0,
            landlord_commission: transaction.landlord_commission || 0,
            landlord_vat: transaction.landlord_vat || 0,
            other_commission: transaction.other_commission || 0,
            other_vat: transaction.other_vat || 0,
            company_total_commission: transaction.company_total_commission || 0,
            received_commission: transaction.received_commission || 0,
            agent_total_commission: transaction.agent_total_commission || 0,
            agent_received_commission: transaction.agent_received_commission || 0,
            payment_method: transaction.payment_method || "",
            contract_start_date: transaction.contract_start_date || "",
            contract_end_date: transaction.contract_end_date || "",
            deposit_amount: transaction.deposit_amount || 0,
            buyer_documents: transaction.buyer_documents || [],
            seller_documents: transaction.seller_documents || [],
            tenant_documents: transaction.tenant_documents || [],
            landlord_documents: transaction.landlord_documents || [],
            property_documents: transaction.property_documents || [],
            contract_documents: transaction.contract_documents || []
        });
        setShowUpdateModal(true);
    };
    
    // Handle submit update
    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        
        if (!selectedTransaction || !selectedTransaction.id) {
            toast.error("No transaction selected for update");
            return;
        }
        
        try {
            setUpdateLoading(true);
            await updateTransaction(selectedTransaction.id, formData);
            
            // Refresh transactions list
            const filters = {
                page: currentPage,
                size: pageSize
            };
            const response = await getTransactions(filters);
            
            if (Array.isArray(response)) {
                setTransactions(response);
            } else if (response && response.items) {
                setTransactions(response.items);
            }
            
            setShowUpdateModal(false);
            toast.success("Transaction updated successfully!");
        } catch (err) {
            console.error("Error updating transaction:", err);
            toast.error(err.message || "Failed to update transaction");
        } finally {
            setUpdateLoading(false);
        }
    };
    
    // Handle delete confirmation
    const handleDeleteConfirmation = (transaction) => {
        setTransactionToDelete(transaction);
        setShowDeleteModal(true);
    };
    
    // Handle delete transaction
    const handleDeleteTransaction = async () => {

        console.log("this is the transaction to delete", transactionToDelete);

        if (!transactionToDelete || !transactionToDelete.id) {
            toast.error("No transaction selected for deletion");
            return;
        }
        
        try {
            setDeleteLoading(true);
            await deleteTransaction(transactionToDelete.id);
            
            // Refresh transactions list
            const filters = {
                page: currentPage,
                size: pageSize
            };
            const response = await getTransactions(filters);
            
            if (Array.isArray(response)) {
                setTransactions(response);
            } else if (response && response.items) {
                setTransactions(response.items);
            }
            
            setShowDeleteModal(false);
            toast.success("Transaction deleted successfully!");
        } catch (err) {
            console.error("Error deleting transaction:", err);
            toast.error(err.message || "Failed to delete transaction");
        } finally {
            setDeleteLoading(false);
        }
    };
    
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString();
    };
    
    // Render action buttons for each row
    const renderActionButtons = (transaction) => {
        return (
            <div className="d-flex gap-2 justify-content-center">
                <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className={`${styles.transactions_actionButton}`}
                    onClick={() => handleViewDetails(transaction)}
                    title="View Details"
                >
                    <FaEye />
                </Button>
                <Button 
                    variant="outline-success" 
                    size="sm" 
                    className={`${styles.transactions_actionButton}`}
                    onClick={() => handleUpdateTransaction(transaction)}
                    title="Edit"
                >
                    <FaEdit />
                </Button>
                <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className={`${styles.transactions_actionButton}`}
                    onClick={() => handleDeleteConfirmation(transaction)}
                    title="Delete"
                >
                    <FaTrash />
                </Button>
            </div>
        );
    };
    
    return (
        <div className="sectionContainer">
            <div className="d-flex flex-column mb-4">
                <h1 className="mb-1">Transactions</h1>
                <p className="text-muted">Manage all your property transactions in one place</p>
            </div>
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    {/* Additional filters could go here */}
                </div>
                <Button 
                    variant="primary" 
                    onClick={() => setShowModal(true)}
                    className={`d-flex align-items-center shadow-sm ${styles.transactions_createButton}`}
                >
                    <FaPlus className="me-2" /> Create Transaction
                </Button>
            </div>
            
            {error && (
                <div className={`alert alert-danger ${styles.transactions_alert}`} role="alert">
                    {error}
                </div>
            )}
            
            {/* Transactions Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.transactions_tableWrapper}
            >
                <Card className={styles.transactions_tableCard}>
                    <Card.Body className="p-0">
                        <Table hover className={`${styles.transactions_table}`}>
                            <thead className={styles.transactions_tableHeader}>
                                <tr>
                                    <th className="text-center" style={{ width: '10%' }}>ID</th>
                                    <th style={{ width: '25%' }}>Purpose</th>
                                    <th style={{ width: '15%' }}>Property ID</th>
                                    <th style={{ width: '15%' }}>Deal Price</th>
                                    <th style={{ width: '15%' }}>Created At</th>
                                    <th className="text-center" style={{ width: '20%' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <Spinner animation="border" variant="primary" role="status" className={styles.transactions_spinner}>
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                        </td>
                                    </tr>
                                )}
                                
                                {!loading && transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                                
                                {!loading && transactions.map((transaction, index) => (
                                    <motion.tr 
                                        key={transaction.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`transaction-row ${styles.transactions_row}`}
                                        whileHover={{ backgroundColor: "#f8f9fa" }}
                                    >
                                        <td className="text-center">{transaction.id}</td>
                                        <td>
                                            <div className={styles.transactions_purposeContainer}>
                                                <span 
                                                    className={`${styles.transactions_purposeBadge} ${
                                                        transaction.purpose?.toLowerCase().includes('sale') ? styles.transactions_saleBadge :
                                                        transaction.purpose?.toLowerCase().includes('rent') ? styles.transactions_rentBadge :
                                                        transaction.purpose?.toLowerCase().includes('lease') ? styles.transactions_leaseBadge :
                                                        styles.transactions_defaultBadge
                                                    }`}
                                                >
                                                    {transaction.purpose || "Unknown"}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{transaction.property_id || "-"}</td>
                                        <td>
                                            {transaction.deal_price ? (
                                                <span className={styles.transactions_priceValue}>
                                                    ${transaction.deal_price.toLocaleString()}
                                                </span>
                                            ) : "-"}
                                        </td>
                                        <td>{formatDate(transaction.created_at)}</td>
                                        <td>{renderActionButtons(transaction)}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </motion.div>
            
            {/* Pagination */}
            {!loading && transactions.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`d-flex justify-content-between align-items-center mt-4 ${styles.transactions_paginationContainer}`}
                >
                    <div className={`d-flex align-items-center ${styles.transactions_pageInfo}`}>
                        <span className="me-2">Show</span>
                        <Form.Select 
                            size="sm" 
                            value={pageSize} 
                            onChange={handlePageSizeChange}
                            className={`shadow-sm ${styles.transactions_formControl}`}
                            style={{ width: '70px' }}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </Form.Select>
                        <span className="ms-2">
                            Showing <span className="fw-bold">{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</span> to <span className="fw-bold">{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="fw-bold">{totalItems}</span> transactions
                        </span>
                    </div>
                    <Pagination className={`mb-0 ${styles.transactions_pagination}`}>
                        <Pagination.First 
                            onClick={() => handlePageChange(1)} 
                            disabled={currentPage === 1}
                            className={`shadow-sm ${styles.transactions_paginationItem}`}
                        />
                        <Pagination.Prev 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`shadow-sm ${styles.transactions_paginationItem}`}
                        />
                        
                        {/* Page numbers */}
                        {[...Array(totalPages).keys()].map(number => (
                            <Pagination.Item
                                key={number + 1}
                                active={number + 1 === currentPage}
                                onClick={() => handlePageChange(number + 1)}
                                className={`shadow-sm ${styles.transactions_paginationItem}`}
                            >
                                {number + 1}
                            </Pagination.Item>
                        ))}
                        
                        <Pagination.Next 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`shadow-sm ${styles.transactions_paginationItem}`}
                        />
                        <Pagination.Last 
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className={`shadow-sm ${styles.transactions_paginationItem}`}
                        />
                    </Pagination>
                </motion.div>
            )}
            
            {/* Create Transaction Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create New Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Basic Information */}
                            <div className="col-12 mb-3">
                                <h5>Basic Information</h5>
                                <hr />
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="purpose">
                                    <Form.Label>Purpose</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleInputChange}
                                        placeholder="Enter purpose"
                                        required
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="lead_id">
                                    <Form.Label>Lead ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lead_id"
                                        value={formData.lead_id}
                                        onChange={handleInputChange}
                                        placeholder="Enter lead ID"
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="property_id">
                                    <Form.Label>Property ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="property_id"
                                        value={formData.property_id}
                                        onChange={handleInputChange}
                                        placeholder="Enter property ID"
                                        required
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="deal_price">
                                    <Form.Label>Deal Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="deal_price"
                                        value={formData.deal_price}
                                        onChange={handleInputChange}
                                        placeholder="Enter deal price"
                                        required
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="unit_number">
                                    <Form.Label>Unit Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="unit_number"
                                        value={formData.unit_number}
                                        onChange={handleInputChange}
                                        placeholder="Enter unit number"
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="payment_method">
                                    <Form.Label>Payment Method</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="payment_method"
                                        value={formData.payment_method}
                                        onChange={handleInputChange}
                                        placeholder="Enter payment method"
                                    />
                                </Form.Group>
                            </div>
                            
                            {/* Commission Information */}
                            <div className="col-12 mt-3 mb-3">
                                <h5>Commission Information</h5>
                                <hr />
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="commission_type">
                                    <Form.Label>Commission Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="commission_type"
                                        value={formData.commission_type}
                                        onChange={handleInputChange}
                                        placeholder="Enter commission type"
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="external_commission_reciver_name">
                                    <Form.Label>External Commission Receiver</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="external_commission_reciver_name"
                                        value={formData.external_commission_reciver_name}
                                        onChange={handleInputChange}
                                        placeholder="Enter receiver name"
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="buyer_commission_amount">
                                    <Form.Label>Buyer Commission Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="buyer_commission_amount"
                                        value={formData.buyer_commission_amount}
                                        onChange={handleInputChange}
                                        placeholder="Enter buyer commission"
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="buyer_vat">
                                    <Form.Label>Buyer VAT</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="buyer_vat"
                                        value={formData.buyer_vat}
                                        onChange={handleInputChange}
                                        placeholder="Enter buyer VAT"
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="sellers_commission">
                                    <Form.Label>Seller&apos;s Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="sellers_commission"
                                        value={formData.sellers_commission}
                                        onChange={handleInputChange}
                                        placeholder="Enter seller's commission"
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="sellers_vat">
                                    <Form.Label>Seller&apos;s VAT</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="sellers_vat"
                                        value={formData.sellers_vat}
                                        onChange={handleInputChange}
                                        placeholder="Enter seller's VAT"
                                    />
                                </Form.Group>
                            </div>
                            
                            {/* Contract Information */}
                            <div className="col-12 mt-3 mb-3">
                                <h5>Contract Information</h5>
                                <hr />
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="contract_start_date">
                                    <Form.Label>Contract Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="contract_start_date"
                                        value={formData.contract_start_date}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="contract_end_date">
                                    <Form.Label>Contract End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="contract_end_date"
                                        value={formData.contract_end_date}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="deposit_amount">
                                    <Form.Label>Deposit Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="deposit_amount"
                                        value={formData.deposit_amount}
                                        onChange={handleInputChange}
                                        placeholder="Enter deposit amount"
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creating...
                            </>
                        ) : "Create Transaction"}
                    </Button>
                </Modal.Footer>
            </Modal>
            
            {/* Transaction Details Modal */}
            <Modal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                size="lg"
                centered
                className={`transaction-detail-modal ${styles.transactions_modalTransition}`}
            >
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title>Transaction Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {detailLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" className={styles.transactions_spinner} />
                            <p className="mt-3">Loading transaction details...</p>
                        </div>
                    ) : selectedTransaction ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className={`shadow-sm mb-4 ${styles.transactions_detailsCard}`}>
                                <Card.Header className={`bg-primary text-white ${styles.transactions_detailsCardHeader}`}>
                                    <h5 className="mb-0">Basic Information</h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Transaction ID</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>{selectedTransaction.id}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Purpose</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>{selectedTransaction.purpose || "-"}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Property ID</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>{selectedTransaction.property_id || "-"}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Deal Price</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>
                                                {selectedTransaction.deal_price
                                                    ? `$${selectedTransaction.deal_price.toLocaleString()}`
                                                    : "-"
                                                }
                                            </p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Unit Number</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>{selectedTransaction.unit_number || "-"}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Lead ID</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>{selectedTransaction.lead_id || "-"}</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                            
                            <Card className={`shadow-sm mb-4 ${styles.transactions_detailsCard}`}>
                                <Card.Header className={`bg-success text-white ${styles.transactions_detailsCardHeader}`}>
                                    <h5 className="mb-0">Commission Information</h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Commission Type</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>{selectedTransaction.commission_type || "-"}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>External Commission Receiver</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>{selectedTransaction.external_commission_reciver_name || "-"}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Buyer Commission</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>
                                                {selectedTransaction.buyer_commission_amount
                                                    ? `$${selectedTransaction.buyer_commission_amount.toLocaleString()}`
                                                    : "-"
                                                }
                                            </p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Buyer VAT</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>
                                                {selectedTransaction.buyer_vat
                                                    ? `$${selectedTransaction.buyer_vat.toLocaleString()}`
                                                    : "-"
                                                }
                                            </p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Seller Commission</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>
                                                {selectedTransaction.sellers_commission
                                                    ? `$${selectedTransaction.sellers_commission.toLocaleString()}`
                                                    : "-"
                                                }
                                            </p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Seller VAT</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>
                                                {selectedTransaction.sellers_vat
                                                    ? `$${selectedTransaction.sellers_vat.toLocaleString()}`
                                                    : "-"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                            
                            <Card className={`shadow-sm ${styles.transactions_detailsCard}`}>
                                <Card.Header className={`bg-info text-white ${styles.transactions_detailsCardHeader}`}>
                                    <h5 className="mb-0">Contract Information</h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Contract Start Date</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>{formatDate(selectedTransaction.contract_start_date)}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Contract End Date</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>{formatDate(selectedTransaction.contract_end_date)}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Payment Method</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>{selectedTransaction.payment_method || "-"}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className={`mb-1 text-muted small ${styles.transactions_detailLabel}`}>Deposit Amount</p>
                                            <p className={`mb-0 fw-bold ${styles.transactions_detailValue}`}>
                                                {selectedTransaction.deposit_amount
                                                    ? `$${selectedTransaction.deposit_amount.toLocaleString()}`
                                                    : "-"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    ) : (
                        <div className={`alert alert-warning ${styles.transactions_alert}`}>
                            No transaction data available
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Close
                    </Button>
                    {selectedTransaction && (
                        <Button 
                            variant="primary" 
                            onClick={() => {
                                setShowDetailModal(false);
                                handleUpdateTransaction(selectedTransaction);
                            }}
                            className={styles.transactions_createButton}
                        >
                            <FaEdit className="me-2" /> Edit Transaction
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
            
            {/* Update Transaction Modal */}
            <Modal
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title>Update Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitUpdate}>
                        <div className="row">
                            {/* Basic Information */}
                            <div className="col-12 mb-3">
                                <h5>Basic Information</h5>
                                <hr />
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="update-purpose">
                                    <Form.Label>Purpose</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleInputChange}
                                        placeholder="Enter purpose"
                                        required
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="update-lead_id">
                                    <Form.Label>Lead ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lead_id"
                                        value={formData.lead_id}
                                        onChange={handleInputChange}
                                        placeholder="Enter lead ID"
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="update-property_id">
                                    <Form.Label>Property ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="property_id"
                                        value={formData.property_id}
                                        onChange={handleInputChange}
                                        placeholder="Enter property ID"
                                        required
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="update-deal_price">
                                    <Form.Label>Deal Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="deal_price"
                                        value={formData.deal_price}
                                        onChange={handleInputChange}
                                        placeholder="Enter deal price"
                                        required
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="update-unit_number">
                                    <Form.Label>Unit Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="unit_number"
                                        value={formData.unit_number}
                                        onChange={handleInputChange}
                                        placeholder="Enter unit number"
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="update-payment_method">
                                    <Form.Label>Payment Method</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="payment_method"
                                        value={formData.payment_method}
                                        onChange={handleInputChange}
                                        placeholder="Enter payment method"
                                    />
                                </Form.Group>
                            </div>
                            
                            {/* Commission Information */}
                            <div className="col-12 mt-3 mb-3">
                                <h5>Commission Information</h5>
                                <hr />
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="update-commission_type">
                                    <Form.Label>Commission Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="commission_type"
                                        value={formData.commission_type}
                                        onChange={handleInputChange}
                                        placeholder="Enter commission type"
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="update-external_commission_reciver_name">
                                    <Form.Label>External Commission Receiver</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="external_commission_reciver_name"
                                        value={formData.external_commission_reciver_name}
                                        onChange={handleInputChange}
                                        placeholder="Enter receiver name"
                                    />
                                </Form.Group>
                            </div>
                            
                            {/* Contract Information */}
                            <div className="col-12 mt-3 mb-3">
                                <h5>Contract Information</h5>
                                <hr />
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="update-contract_start_date">
                                    <Form.Label>Contract Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="contract_start_date"
                                        value={formData.contract_start_date}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="update-contract_end_date">
                                    <Form.Label>Contract End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="contract_end_date"
                                        value={formData.contract_end_date}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="success" 
                        onClick={handleSubmitUpdate}
                        disabled={updateLoading}
                        className={styles.transactions_createButton}
                    >
                        {updateLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Updating...
                            </>
                        ) : (
                            <>
                                <FaEdit className="me-2" /> Update Transaction
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
            
            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
                size="sm"
                className={styles.transactions_modalTransition}
            >
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center mb-3">
                        <FaExclamationTriangle size={48} className="text-danger mb-3" />
                        <h5>Are you sure?</h5>
                        <p className="text-muted">
                            This will permanently delete this transaction. This action cannot be undone.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDeleteTransaction}
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Deleting...
                            </>
                        ) : (
                            <>
                                <FaTrash className="me-2" /> Delete
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Transactions;
