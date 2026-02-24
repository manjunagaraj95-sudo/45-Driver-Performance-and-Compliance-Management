
import React, { useState, useEffect } from 'react';

// --- Global Configuration ---
const ROLES = {
    ADMIN: 'Admin',
    FLEET_MANAGER: 'Fleet Manager',
    COMPLIANCE_OFFICER: 'Compliance Officer',
    DRIVER: 'Driver',
    OPERATIONS_MANAGER: 'Operations Manager',
};

const STATUS_MAPPING = {
    APPROVED: { label: 'Approved', color: 'var(--color-status-approved)' },
    PENDING: { label: 'Pending', color: 'var(--color-status-pending)' },
    REJECTED: { label: 'Rejected', color: 'var(--color-status-rejected)' },
    OVERDUE: { label: 'Overdue', color: 'var(--color-status-overdue)' },
    EXPIRED: { label: 'Expired', color: 'var(--color-status-expired)' },
    ACTIVE: { label: 'Active', color: 'var(--color-status-active)' },
    INACTIVE: { label: 'Inactive', color: 'var(--color-status-inactive)' },
    NEW: { label: 'New', color: 'var(--color-status-new)' },
    IN_REVIEW: { label: 'In Review', color: 'var(--color-status-in-review)' },
    COMPLETED: { label: 'Completed', color: 'var(--color-status-completed)' },
    VIOLATION: { label: 'Violation', color: 'var(--color-danger)' },
    COMPLIANT: { label: 'Compliant', color: 'var(--color-success)' },
    NON_COMPLIANT: { label: 'Non-Compliant', color: 'var(--color-danger)' },
};

const generateUUID = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// --- Dummy Data ---
const initialDrivers = [
    {
        id: generateUUID(),
        name: 'John Doe',
        driverId: 'DRV001',
        status: 'ACTIVE',
        licenseStatus: 'APPROVED',
        insuranceStatus: 'APPROVED',
        score: 92,
        violations: 2,
        lastTrip: '2023-10-26',
        employmentDate: '2020-01-15',
        phone: '555-111-2222',
        email: 'john.doe@example.com',
        address: '123 Main St, Anytown, USA',
        dob: '1985-04-20',
        licenseExpiry: '2025-06-30',
        insuranceExpiry: '2024-12-15',
        workflowStage: 'Active', // For workflow tracking demo
        slaStatus: 'On Track'
    },
    {
        id: generateUUID(),
        name: 'Jane Smith',
        driverId: 'DRV002',
        status: 'ACTIVE',
        licenseStatus: 'PENDING',
        insuranceStatus: 'APPROVED',
        score: 88,
        violations: 0,
        lastTrip: '2023-10-25',
        employmentDate: '2019-03-10',
        phone: '555-333-4444',
        email: 'jane.smith@example.com',
        address: '456 Oak Ave, Anycity, USA',
        dob: '1990-11-12',
        licenseExpiry: '2024-01-20',
        insuranceExpiry: '2025-08-01',
        workflowStage: 'Compliance Review',
        slaStatus: 'Approaching SLA'
    },
    {
        id: generateUUID(),
        name: 'Peter Jones',
        driverId: 'DRV003',
        status: 'ACTIVE',
        licenseStatus: 'EXPIRED',
        insuranceStatus: 'PENDING',
        score: 75,
        violations: 5,
        lastTrip: '2023-10-24',
        employmentDate: '2021-07-01',
        phone: '555-555-6666',
        email: 'peter.jones@example.com',
        address: '789 Pine Ln, Anytown, USA',
        dob: '1978-01-05',
        licenseExpiry: '2023-09-15',
        insuranceExpiry: '2024-03-01',
        workflowStage: 'Document Update Required',
        slaStatus: 'Breached SLA'
    },
    {
        id: generateUUID(),
        name: 'Alice Brown',
        driverId: 'DRV004',
        status: 'INACTIVE',
        licenseStatus: 'REJECTED',
        insuranceStatus: 'REJECTED',
        score: 60,
        violations: 1,
        lastTrip: '2023-09-01',
        employmentDate: '2022-02-20',
        phone: '555-777-8888',
        email: 'alice.brown@example.com',
        address: '101 Elm Rd, Otherville, USA',
        dob: '1995-07-30',
        licenseExpiry: '2026-02-10',
        insuranceExpiry: '2025-05-20',
        workflowStage: 'Terminated',
        slaStatus: 'Not Applicable'
    },
    {
        id: generateUUID(),
        name: 'Michael Green',
        driverId: 'DRV005',
        status: 'ACTIVE',
        licenseStatus: 'APPROVED',
        insuranceStatus: 'PENDING',
        score: 95,
        violations: 0,
        lastTrip: '2023-10-26',
        employmentDate: '2022-11-01',
        phone: '555-999-0000',
        email: 'michael.green@example.com',
        address: '222 Cedar St, Metroville, USA',
        dob: '1982-03-18',
        licenseExpiry: '2027-01-01',
        insuranceExpiry: '2023-11-30',
        workflowStage: 'Compliance Review',
        slaStatus: 'On Track'
    },
];

const initialTrips = [
    {
        id: generateUUID(),
        driverId: 'DRV001',
        driverName: 'John Doe',
        date: '2023-10-26',
        origin: 'New York',
        destination: 'Boston',
        distance: 215,
        duration: '3h 45m',
        status: 'COMPLETED',
        fuelEfficiency: '10.5 MPG',
        averageSpeed: '57 MPH',
        hardBrakes: 2,
        rapidAccels: 3,
        score: 90,
    },
    {
        id: generateUUID(),
        driverId: 'DRV002',
        driverName: 'Jane Smith',
        date: '2023-10-25',
        origin: 'Los Angeles',
        destination: 'San Francisco',
        distance: 380,
        duration: '6h 30m',
        status: 'COMPLETED',
        fuelEfficiency: '12.0 MPG',
        averageSpeed: '62 MPH',
        hardBrakes: 0,
        rapidAccels: 1,
        score: 95,
    },
    {
        id: generateUUID(),
        driverId: 'DRV003',
        driverName: 'Peter Jones',
        date: '2023-10-24',
        origin: 'Chicago',
        destination: 'Indianapolis',
        distance: 180,
        duration: '3h 15m',
        status: 'COMPLETED',
        fuelEfficiency: '8.9 MPG',
        averageSpeed: '50 MPH',
        hardBrakes: 5,
        rapidAccels: 7,
        score: 70,
    },
    {
        id: generateUUID(),
        driverId: 'DRV001',
        driverName: 'John Doe',
        date: '2023-10-23',
        origin: 'Boston',
        destination: 'New York',
        distance: 210,
        duration: '3h 30m',
        status: 'COMPLETED',
        fuelEfficiency: '11.0 MPG',
        averageSpeed: '59 MPH',
        hardBrakes: 1,
        rapidAccels: 2,
        score: 92,
    },
    {
        id: generateUUID(),
        driverId: 'DRV005',
        driverName: 'Michael Green',
        date: '2023-10-26',
        origin: 'Miami',
        destination: 'Orlando',
        distance: 230,
        duration: '3h 50m',
        status: 'IN_PROGRESS',
        fuelEfficiency: 'N/A',
        averageSpeed: 'N/A',
        hardBrakes: 0,
        rapidAccels: 0,
        score: 'N/A',
    },
];

const initialDocuments = [
    {
        id: generateUUID(),
        driverId: 'DRV001',
        driverName: 'John Doe',
        type: 'Driver License',
        status: 'APPROVED',
        expiryDate: '2025-06-30',
        uploadedBy: 'Fleet Manager',
        uploadDate: '2023-01-01',
        fileName: 'john_doe_license.pdf',
        workflowStage: 'Approved',
        slaStatus: 'On Track'
    },
    {
        id: generateUUID(),
        driverId: 'DRV001',
        driverName: 'John Doe',
        type: 'Vehicle Insurance',
        status: 'APPROVED',
        expiryDate: '2024-12-15',
        uploadedBy: 'Compliance Officer',
        uploadDate: '2023-01-05',
        fileName: 'john_doe_insurance.pdf',
        workflowStage: 'Approved',
        slaStatus: 'On Track'
    },
    {
        id: generateUUID(),
        driverId: 'DRV003',
        driverName: 'Peter Jones',
        type: 'Driver License',
        status: 'EXPIRED',
        expiryDate: '2023-09-15',
        uploadedBy: 'Fleet Manager',
        uploadDate: '2022-09-10',
        fileName: 'peter_jones_license.pdf',
        workflowStage: 'Document Update Required',
        slaStatus: 'Breached SLA'
    },
    {
        id: generateUUID(),
        driverId: 'DRV002',
        driverName: 'Jane Smith',
        type: 'Medical Certificate',
        status: 'PENDING',
        expiryDate: '2024-01-20',
        uploadedBy: 'Driver',
        uploadDate: '2023-10-20',
        fileName: 'jane_smith_medical.pdf',
        workflowStage: 'In Review',
        slaStatus: 'Approaching SLA'
    },
    {
        id: generateUUID(),
        driverId: 'DRV005',
        driverName: 'Michael Green',
        type: 'Vehicle Insurance',
        status: 'EXPIRED',
        expiryDate: '2023-11-30', // Soon to be expired
        uploadedBy: 'Compliance Officer',
        uploadDate: '2022-12-01',
        fileName: 'michael_green_insurance.pdf',
        workflowStage: 'Document Update Required',
        slaStatus: 'Approaching SLA'
    },
    {
        id: generateUUID(),
        driverId: 'DRV004',
        driverName: 'Alice Brown',
        type: 'Driver License',
        status: 'REJECTED',
        expiryDate: '2026-02-10',
        uploadedBy: 'Fleet Manager',
        uploadDate: '2022-02-25',
        fileName: 'alice_brown_license_rejected.pdf',
        workflowStage: 'Rejected',
        slaStatus: 'Not Applicable'
    },
];

const initialViolations = [
    {
        id: generateUUID(),
        driverId: 'DRV003',
        driverName: 'Peter Jones',
        type: 'Speeding',
        date: '2023-10-10',
        severity: 'High',
        status: 'VIOLATION',
        description: 'Exceeded speed limit by 15 MPH on I-5.',
        reportedBy: 'System',
        actionRequired: 'Driver Counseling',
    },
    {
        id: generateUUID(),
        driverId: 'DRV001',
        driverName: 'John Doe',
        type: 'Hard Braking',
        date: '2023-10-05',
        severity: 'Medium',
        status: 'PENDING',
        description: 'Multiple hard braking events detected during trip from NY to Boston.',
        reportedBy: 'Telematics',
        actionRequired: 'Review Driving Patterns',
    },
    {
        id: generateUUID(),
        driverId: 'DRV003',
        driverName: 'Peter Jones',
        type: 'Lane Departure',
        date: '2023-09-28',
        severity: 'Medium',
        status: 'VIOLATION',
        description: 'Frequent unintentional lane departures.',
        reportedBy: 'Telematics',
        actionRequired: 'Driver Retraining',
    },
    {
        id: generateUUID(),
        driverId: 'DRV001',
        driverName: 'John Doe',
        type: 'Expired Document',
        date: '2023-09-16',
        severity: 'High',
        status: 'VIOLATION',
        description: 'Driver License for John Doe expired on 2023-09-15.',
        reportedBy: 'System',
        actionRequired: 'Document Update',
    },
    {
        id: generateUUID(),
        driverId: 'DRV004',
        driverName: 'Alice Brown',
        type: 'Unapproved Route',
        date: '2023-08-20',
        severity: 'Low',
        status: 'COMPLETED',
        description: 'Diverted from assigned route without authorization.',
        reportedBy: 'GPS Tracker',
        actionRequired: 'Verbal Warning',
    },
];

const initialAlerts = [
    {
        id: generateUUID(),
        type: 'Document Expiry',
        subject: 'Driver License for Peter Jones expired.',
        driverId: 'DRV003',
        driverName: 'Peter Jones',
        status: 'OVERDUE',
        date: '2023-09-15',
        priority: 'High',
        action: 'Renew Driver License',
    },
    {
        id: generateUUID(),
        type: 'Compliance Warning',
        subject: 'Vehicle Insurance for Michael Green expires in 30 days.',
        driverId: 'DRV005',
        driverName: 'Michael Green',
        status: 'PENDING',
        date: '2023-10-30',
        priority: 'Medium',
        action: 'Request updated insurance document',
    },
    {
        id: generateUUID(),
        type: 'Performance Alert',
        subject: 'Peter Jones driving score dropped below 80.',
        driverId: 'DRV003',
        driverName: 'Peter Jones',
        status: 'PENDING',
        date: '2023-10-24',
        priority: 'Medium',
        action: 'Initiate driver coaching',
    },
    {
        id: generateUUID(),
        type: 'System Notification',
        subject: 'New software update available.',
        driverId: null,
        driverName: null,
        status: 'NEW',
        date: '2023-10-26',
        priority: 'Low',
        action: 'Review update details',
    },
    {
        id: generateUUID(),
        type: 'Compliance Warning',
        subject: 'Medical Certificate for Jane Smith is pending review.',
        driverId: 'DRV002',
        driverName: 'Jane Smith',
        status: 'PENDING',
        date: '2023-10-21',
        priority: 'Medium',
        action: 'Review document',
    },
];

// --- Workflow Stages for Documents ---
const DOCUMENT_WORKFLOW = [
    { stage: 'Uploaded', label: 'Uploaded', roles: [ROLES.DRIVER, ROLES.FLEET_MANAGER], sla: '1 day' },
    { stage: 'In Review', label: 'In Review', roles: [ROLES.COMPLIANCE_OFFICER], sla: '2 days' },
    { stage: 'Approved', label: 'Approved', roles: [ROLES.COMPLIANCE_OFFICER], sla: 'N/A' },
    { stage: 'Rejected', label: 'Rejected', roles: [ROLES.COMPLIANCE_OFFICER], sla: 'N/A' },
    { stage: 'Document Update Required', label: 'Update Required', roles: [ROLES.FLEET_MANAGER, ROLES.DRIVER], sla: '3 days' },
];

function App() {
    const [view, setView] = useState({ screen: 'LOGIN', params: {} });
    const [currentUser, setCurrentUser] = useState(null); // { id: 'user1', name: 'Admin User', role: ROLES.ADMIN }
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // --- State for data, mimicking a database ---
    const [drivers, setDrivers] = useState(initialDrivers);
    const [trips, setTrips] = useState(initialTrips);
    const [documents, setDocuments] = useState(initialDocuments);
    const [violations, setViolations] = useState(initialViolations);
    const [alerts, setAlerts] = useState(initialAlerts);

    // --- Handlers ---
    const navigate = (screen, params = {}) => {
        setView({ screen, params });
        setFilterPanelOpen(false); // Close filter panel on navigation
    };

    const login = (role) => {
        setCurrentUser({ id: generateUUID(), name: `${role.split(' ')[0]} User`, role });
        navigate('DASHBOARD');
    };

    const logout = () => {
        setCurrentUser(null);
        navigate('LOGIN');
    };

    const hasAccess = (requiredRoles) => {
        if (!currentUser) return false;
        return requiredRoles.includes(currentUser.role);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        // In a real app, this would trigger a data fetch or client-side filter
    };

    const toggleFilterPanel = () => {
        setFilterPanelOpen(prevState => !prevState);
    };

    const handleApplyFilters = (filters) => {
        console.log('Applying filters:', filters);
        setFilterPanelOpen(false);
        // Implement filter logic here
    };

    // --- Common UI Components ---
    const Header = () => (
        <header className="header">
            <div className="header-left">
                <a href="#" onClick={() => navigate('DASHBOARD')} className="header-logo">
                    DriverTrack
                </a>
            </div>
            <div className="header-search">
                <input
                    type="text"
                    placeholder="Global search..."
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{ paddingLeft: 'var(--spacing-md)' }} // Placeholder for icon
                />
                {/* Smart suggestions would appear here */}
            </div>
            <div className="header-right">
                {currentUser && (
                    <div className="user-menu">
                        <button className="user-menu-button">
                            <span className="avatar">{currentUser?.name?.charAt(0) || 'U'}</span>
                            {currentUser?.name} ({currentUser?.role})
                        </button>
                        <div className="dropdown-menu" style={{ display: 'none' /* Toggle visibility with state */ }}>
                            <button onClick={() => navigate('SETTINGS')}>Profile</button>
                            <button onClick={logout}>Logout</button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );

    const NavBar = () => {
        if (!currentUser) return null;
        return (
            <nav className="nav-bar">
                <ul className="nav-list">
                    {hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.OPERATIONS_MANAGER, ROLES.COMPLIANCE_OFFICER]) && (
                        <li className="nav-item">
                            <a href="#" onClick={() => navigate('DASHBOARD')} className={view.screen === 'DASHBOARD' ? 'active' : ''}>
                                <span className="icon home"></span> Dashboard
                            </a>
                        </li>
                    )}
                    {hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.OPERATIONS_MANAGER, ROLES.COMPLIANCE_OFFICER]) && (
                        <li className="nav-item">
                            <a href="#" onClick={() => navigate('DRIVERS')} className={view.screen.startsWith('DRIVER') ? 'active' : ''}>
                                <span className="icon driver"></span> Drivers
                            </a>
                        </li>
                    )}
                    {hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.OPERATIONS_MANAGER]) && (
                        <li className="nav-item">
                            <a href="#" onClick={() => navigate('TRIPS')} className={view.screen.startsWith('TRIP') ? 'active' : ''}>
                                <span className="icon trip"></span> Trips
                            </a>
                        </li>
                    )}
                    {hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.COMPLIANCE_OFFICER]) && (
                        <li className="nav-item">
                            <a href="#" onClick={() => navigate('DOCUMENTS')} className={view.screen.startsWith('DOCUMENT') ? 'active' : ''}>
                                <span className="icon document"></span> Documents
                            </a>
                        </li>
                    )}
                    {hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.COMPLIANCE_OFFICER, ROLES.OPERATIONS_MANAGER]) && (
                        <li className="nav-item">
                            <a href="#" onClick={() => navigate('VIOLATIONS')} className={view.screen.startsWith('VIOLATION') ? 'active' : ''}>
                                <span className="icon violation"></span> Violations
                            </a>
                        </li>
                    )}
                    {hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.COMPLIANCE_OFFICER, ROLES.OPERATIONS_MANAGER, ROLES.DRIVER]) && (
                        <li className="nav-item">
                            <a href="#" onClick={() => navigate('ALERTS')} className={view.screen.startsWith('ALERT') ? 'active' : ''}>
                                <span className="icon alert"></span> Alerts
                            </a>
                        </li>
                    )}
                    {hasAccess([ROLES.ADMIN]) && (
                        <li className="nav-item">
                            <a href="#" onClick={() => navigate('SETTINGS')} className={view.screen === 'SETTINGS' ? 'active' : ''}>
                                <span className="icon settings"></span> Settings
                            </a>
                        </li>
                    )}
                </ul>
            </nav>
        );
    };

    const Breadcrumbs = ({ path }) => (
        <div className="breadcrumbs">
            <a href="#" onClick={() => navigate('DASHBOARD')}>Dashboard</a>
            {path.map((item, index) => (
                <React.Fragment key={item.label}>
                    <span>/</span>
                    {index < path.length - 1 ? (
                        <a href="#" onClick={() => navigate(item.screen, item.params)}>{item.label}</a>
                    ) : (
                        <strong>{item.label}</strong>
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    const StatusBadge = ({ statusKey }) => {
        const statusInfo = STATUS_MAPPING[statusKey] || { label: statusKey, color: 'var(--color-grey-500)' };
        return (
            <span
                className={`status-badge status-${statusKey?.toLowerCase()?.replace(/_/g, '-')}`}
                style={{ backgroundColor: statusInfo.color }}
            >
                {statusInfo.label}
            </span>
        );
    };

    const EntityCard = ({ title, subtitle, details, status, onClick }) => (
        <div
            className={`card status-${status?.toLowerCase()?.replace(/_/g, '-')}`}
            onClick={onClick}
            role="button"
            tabIndex="0"
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
        >
            <h4 className="card-title">{title}</h4>
            <p className="card-subtitle">{subtitle}</p>
            <div className="card-details">
                {details?.map((detail, index) => (
                    <div className="card-detail-item" key={index}>
                        {detail.icon && <span className={`icon ${detail.icon}`}></span>}
                        {detail.label && <span>{detail.label}: </span>}
                        <strong>{detail.value}</strong>
                    </div>
                ))}
            </div>
            {status && <StatusBadge statusKey={status} />}
        </div>
    );

    const ListActionsBar = ({ onSearchChange, onFilterClick, onSortClick, selectedCount }) => (
        <div className="list-actions-bar">
            <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={onSearchChange}
                style={{ paddingLeft: 'var(--spacing-md)' }}
            />
            <div className="filter-sort-group">
                <button className="button button-secondary" onClick={onFilterClick}>
                    <span className="icon filter"></span> Filter
                </button>
                <button className="button button-secondary" onClick={onSortClick}>
                    <span className="icon sort"></span> Sort
                </button>
            </div>
            {selectedCount > 0 && (
                <div className="bulk-actions-group">
                    <span>{selectedCount} selected</span>
                    <button className="button button-primary">Bulk Action</button>
                </div>
            )}
            <button className="button button-primary" onClick={() => navigate(view.screen + '_NEW')}>
                <span className="icon add"></span> Add New
            </button>
        </div>
    );

    const FilterPanel = ({ isOpen, onClose, onApply }) => (
        <div className={`filter-panel ${isOpen ? 'open' : ''}`}>
            <div className="filter-panel-header">
                <h3>Filters</h3>
                <button className="button button-icon" onClick={onClose}><span className="icon close"></span></button>
            </div>
            <div className="filter-panel-content">
                <div className="form-group">
                    <label htmlFor="statusFilter">Status</label>
                    <select id="statusFilter">
                        <option value="">All</option>
                        {Object.keys(STATUS_MAPPING).map(key => (
                            <option key={key} value={key}>{STATUS_MAPPING[key].label}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="dateRange">Date Range</label>
                    <input type="date" id="dateRange" />
                </div>
                {/* More specific filters based on entity type would go here */}
            </div>
            <div className="filter-panel-actions">
                <button className="button button-secondary" onClick={onClose}>Cancel</button>
                <button className="button button-primary" onClick={() => onApply({})}>Apply Filters</button>
            </div>
        </div>
    );

    // --- Screen Renderers ---
    const renderLoginScreen = () => (
        <div className="login-container">
            <div className="login-form">
                <h2>Welcome to DriverTrack</h2>
                <p>Select your role to continue:</p>
                <div className="role-selection-grid">
                    {Object.values(ROLES).map(role => (
                        <button key={role} className="role-card" onClick={() => login(role)}>
                            <span className="icon user-circle" style={{ fontSize: '2em' }}></span>
                            {role}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderDashboard = () => {
        if (!hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.OPERATIONS_MANAGER, ROLES.COMPLIANCE_OFFICER])) return <div className="main-content">Access Denied</div>;

        const totalDrivers = drivers.length;
        const activeDrivers = drivers.filter(d => d.status === 'ACTIVE').length;
        const nonCompliantDrivers = drivers.filter(d => d.licenseStatus === 'EXPIRED' || d.insuranceStatus === 'EXPIRED').length;
        const pendingDocuments = documents.filter(d => d.status === 'PENDING' || d.status === 'EXPIRED').length;

        return (
            <div className="main-content">
                <Breadcrumbs path={[{ label: 'Dashboard', screen: 'DASHBOARD' }]} />
                <h1>Dashboard Overview</h1>

                <div className="dashboard-grid">
                    <div className="dashboard-card realtime-pulse">
                        <h3>Total Drivers</h3>
                        <p className="kpi-card-value">{totalDrivers}</p>
                        <p className="kpi-card-delta">
                            <span className="icon trending-up"></span> +5% last month
                        </p>
                    </div>
                    <div className="dashboard-card realtime-pulse">
                        <h3>Active Drivers</h3>
                        <p className="kpi-card-value">{activeDrivers}</p>
                        <p className="kpi-card-delta positive">
                            <span className="icon trending-up"></span> {Math.round((activeDrivers / totalDrivers) * 100) || 0}%
                        </p>
                    </div>
                    <div className="dashboard-card realtime-pulse">
                        <h3>Non-Compliant Drivers</h3>
                        <p className="kpi-card-value" style={{ color: 'var(--color-danger)' }}>{nonCompliantDrivers}</p>
                        <p className="kpi-card-delta negative">
                            <span className="icon trending-down"></span> +2 last week
                        </p>
                    </div>
                    <div className="dashboard-card realtime-pulse">
                        <h3>Pending Documents</h3>
                        <p className="kpi-card-value" style={{ color: 'var(--color-warning)' }}>{pendingDocuments}</p>
                        <p className="kpi-card-delta">
                            <span className="icon info"></span> Action required
                        </p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Driver Performance Score Distribution</h3>
                        <div className="chart-placeholder">Bar Chart Placeholder</div>
                    </div>
                    <div className="dashboard-card">
                        <h3>Compliance Status Overview</h3>
                        <div className="chart-placeholder">Donut Chart Placeholder</div>
                    </div>
                    <div className="dashboard-card">
                        <h3>Trip Distance Trends</h3>
                        <div className="chart-placeholder">Line Chart Placeholder</div>
                    </div>
                    <div className="dashboard-card">
                        <h3>Average Driving Score</h3>
                        <div className="chart-placeholder">Gauge Chart Placeholder</div>
                    </div>

                    <div className="recent-activities-panel">
                        <h3>Recent Activities</h3>
                        <ul className="activity-list">
                            {alerts?.slice(0, 5).map(activity => (
                                <li className="activity-item" key={activity.id}>
                                    <span className="activity-icon"><span className="icon activity"></span></span>
                                    <div className="activity-content">
                                        <p><strong>{activity.subject}</strong></p>
                                        <p>{activity.driverName ? `Driver: ${activity.driverName} | ` : ''}Type: {activity.type}</p>
                                        <span className="timestamp">{activity.date}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

    const renderDriverList = () => {
        if (!hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.OPERATIONS_MANAGER, ROLES.COMPLIANCE_OFFICER])) return <div className="main-content">Access Denied</div>;

        const filteredDrivers = drivers.filter(driver =>
            driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.driverId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.status.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="main-content">
                <Breadcrumbs path={[{ label: 'Drivers', screen: 'DRIVERS' }]} />
                <h1>Drivers</h1>
                <ListActionsBar
                    onSearchChange={handleSearch}
                    onFilterClick={toggleFilterPanel}
                    onSortClick={() => console.log('Sort drivers')}
                    selectedCount={0} // For demo, assuming no selections
                />
                <div className="card-grid">
                    {filteredDrivers.map(driver => (
                        <EntityCard
                            key={driver.id}
                            title={driver.name}
                            subtitle={`ID: ${driver.driverId}`}
                            details={[
                                { label: 'Score', value: driver.score, icon: 'star' },
                                { label: 'Violations', value: driver.violations, icon: 'violation' },
                                { label: 'License', value: STATUS_MAPPING[driver.licenseStatus]?.label, icon: 'document' },
                                { label: 'Insurance', value: STATUS_MAPPING[driver.insuranceStatus]?.label, icon: 'document' },
                            ]}
                            status={driver.status}
                            onClick={() => navigate('DRIVER_DETAIL', { driverId: driver.id })}
                        />
                    ))}
                </div>
                <FilterPanel isOpen={filterPanelOpen} onClose={toggleFilterPanel} onApply={handleApplyFilters} />
            </div>
        );
    };

    const renderDriverDetail = () => {
        if (!hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.OPERATIONS_MANAGER, ROLES.COMPLIANCE_OFFICER])) return <div className="main-content">Access Denied</div>;

        const driver = drivers.find(d => d.id === view.params.driverId);
        if (!driver) return <div className="main-content">Driver not found.</div>;

        const driverDocuments = documents.filter(doc => doc.driverId === driver.driverId);
        const driverViolations = violations.filter(vio => vio.driverId === driver.driverId);
        const driverTrips = trips.filter(trip => trip.driverId === driver.driverId);

        const currentWorkflowStageIndex = DOCUMENT_WORKFLOW.findIndex(s => s.stage === driver.workflowStage);

        return (
            <div className="main-content">
                <Breadcrumbs path={[
                    { label: 'Drivers', screen: 'DRIVERS' },
                    { label: driver.name, screen: 'DRIVER_DETAIL', params: { driverId: driver.id } }
                ]} />
                <div className="detail-view">
                    <div className="detail-header">
                        <div className="detail-header-left">
                            <h2>{driver.name} <StatusBadge statusKey={driver.status} /></h2>
                            <p className="subtitle">Driver ID: {driver.driverId}</p>
                        </div>
                        <div className="detail-header-actions">
                            {hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER]) && (
                                <button className="button button-secondary" onClick={() => navigate('DRIVER_EDIT', { driverId: driver.id })}>
                                    <span className="icon edit"></span> Edit Driver
                                </button>
                            )}
                            {hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER]) && (
                                <button className="button button-primary">
                                    <span className="icon add"></span> Add Violation
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="detail-sections">
                        <div className="detail-main-info">
                            <div className="detail-section">
                                <h3>Driver Profile</h3>
                                <div className="detail-item-grid">
                                    <div className="detail-item"><label>Employment Date</label><p>{driver.employmentDate}</p></div>
                                    <div className="detail-item"><label>Phone</label><p>{driver.phone}</p></div>
                                    <div className="detail-item"><label>Email</label><p>{driver.email}</p></div>
                                    <div className="detail-item"><label>Address</label><p>{driver.address}</p></div>
                                    <div className="detail-item"><label>Date of Birth</label><p>{driver.dob}</p></div>
                                    <div className="detail-item"><label>Overall Score</label><p>{driver.score}</p></div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Compliance Overview</h3>
                                <div className="workflow-tracker">
                                    {DOCUMENT_WORKFLOW.map((stage, index) => (
                                        <div
                                            key={stage.stage}
                                            className={`workflow-stage 
                                                ${index < currentWorkflowStageIndex ? 'completed' : ''} 
                                                ${stage.stage === driver.workflowStage ? 'active' : ''}
                                                ${stage.stage === driver.workflowStage && driver.slaStatus === 'Breached SLA' ? 'overdue' : ''}
                                            `}
                                        >
                                            <div className="workflow-stage-icon">
                                                {index < currentWorkflowStageIndex ? <span className="icon check"></span> : index + 1}
                                            </div>
                                            <div className="workflow-stage-label">
                                                {stage.label}
                                                {stage.stage === driver.workflowStage && driver.slaStatus === 'Breached SLA' && (
                                                    <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)' }}>SLA Breached!</p>
                                                )}
                                                {stage.stage === driver.workflowStage && driver.slaStatus === 'Approaching SLA' && (
                                                    <p style={{ color: 'var(--color-warning)', fontSize: 'var(--font-size-xs)' }}>Approaching SLA</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="detail-item-grid" style={{ marginTop: 'var(--spacing-md)' }}>
                                    <div className="detail-item"><label>License Expiry</label><p>{driver.licenseExpiry}</p></div>
                                    <div className="detail-item"><label>Insurance Expiry</label><p>{driver.insuranceExpiry}</p></div>
                                    <div className="detail-item"><label>License Status</label><StatusBadge statusKey={driver.licenseStatus} /></div>
                                    <div className="detail-item"><label>Insurance Status</label><StatusBadge statusKey={driver.insuranceStatus} /></div>
                                </div>
                            </div>
                        </div>

                        <div className="detail-related-info">
                            <div className="detail-section">
                                <h3>Related Documents</h3>
                                <ul>
                                    {driverDocuments.length > 0 ? (
                                        driverDocuments.map(doc => (
                                            <li key={doc.id}>
                                                <span>{doc.type} ({doc.fileName})</span>
                                                <StatusBadge statusKey={doc.status} />
                                                <button className="button button-icon" onClick={() => navigate('DOCUMENT_DETAIL', { documentId: doc.id })}>
                                                    <span className="icon chevron-right"></span>
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No documents found.</li>
                                    )}
                                </ul>
                                {hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.COMPLIANCE_OFFICER]) && (
                                    <button className="button button-secondary" style={{ marginTop: 'var(--spacing-md)' }} onClick={() => navigate('DOCUMENT_NEW', { driverId: driver.id })}>
                                        <span className="icon upload"></span> Upload New Document
                                    </button>
                                )}
                            </div>

                            <div className="detail-section">
                                <h3>Recent Violations</h3>
                                <ul>
                                    {driverViolations.length > 0 ? (
                                        driverViolations.slice(0, 3).map(vio => (
                                            <li key={vio.id}>
                                                <span>{vio.type} ({vio.date})</span>
                                                <StatusBadge statusKey={vio.status} />
                                                <button className="button button-icon" onClick={() => navigate('VIOLATION_DETAIL', { violationId: vio.id })}>
                                                    <span className="icon chevron-right"></span>
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No recent violations.</li>
                                    )}
                                </ul>
                                {driverViolations.length > 3 && (
                                    <button className="button button-secondary" style={{ marginTop: 'var(--spacing-md)' }} onClick={() => navigate('VIOLATIONS', { driverId: driver.id })}>
                                        View All Violations
                                    </button>
                                )}
                            </div>

                            <div className="detail-section">
                                <h3>Recent Trips</h3>
                                <ul>
                                    {driverTrips.length > 0 ? (
                                        driverTrips.slice(0, 3).map(trip => (
                                            <li key={trip.id}>
                                                <span>{trip.origin} to {trip.destination} ({trip.date})</span>
                                                <StatusBadge statusKey={trip.status} />
                                                <button className="button button-icon" onClick={() => navigate('TRIP_DETAIL', { tripId: trip.id })}>
                                                    <span className="icon chevron-right"></span>
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No recent trips.</li>
                                    )}
                                </ul>
                                {driverTrips.length > 3 && (
                                    <button className="button button-secondary" style={{ marginTop: 'var(--spacing-md)' }} onClick={() => navigate('TRIPS', { driverId: driver.id })}>
                                        View All Trips
                                    </button>
                                )}
                            </div>

                            <div className="detail-section">
                                <h3>Audit Log</h3>
                                <ul>
                                    <li><p><strong>2023-10-26 10:30 AM:</strong> Driver license status updated to 'EXPIRED' by System.</p></li>
                                    <li><p><strong>2023-09-10 09:15 AM:</strong> Peter Jones profile created by Admin User.</p></li>
                                    {/* More audit log entries would be loaded here */}
                                </ul>
                                {hasAccess([ROLES.ADMIN]) && ( // Role-based visibility for logs
                                    <button className="button button-secondary" style={{ marginTop: 'var(--spacing-md)' }}>
                                        View Full Audit Trail
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDriverForm = () => {
        if (!hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER])) return <div className="main-content">Access Denied</div>;

        const isNew = view.screen === 'DRIVER_NEW';
        const driverToEdit = !isNew ? drivers.find(d => d.id === view.params.driverId) : {};

        const [formData, setFormData] = useState({
            name: driverToEdit?.name || '',
            driverId: driverToEdit?.driverId || '',
            status: driverToEdit?.status || 'ACTIVE',
            licenseExpiry: driverToEdit?.licenseExpiry || '',
            insuranceExpiry: driverToEdit?.insuranceExpiry || '',
            phone: driverToEdit?.phone || '',
            email: driverToEdit?.email || '',
            address: driverToEdit?.address || '',
            dob: driverToEdit?.dob || '',
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log('Form data submitted:', formData);
            // In a real app, this would involve API calls and state updates
            if (isNew) {
                setDrivers(prev => [...prev, { ...formData, id: generateUUID(), score: 0, violations: 0, lastTrip: 'N/A', employmentDate: new Date().toISOString().slice(0, 10), licenseStatus: 'PENDING', insuranceStatus: 'PENDING', workflowStage: 'Uploaded', slaStatus: 'On Track' }]);
            } else {
                setDrivers(prev => prev.map(d => (d.id === driverToEdit.id ? { ...d, ...formData } : d)));
            }
            navigate('DRIVERS');
        };

        return (
            <div className="main-content">
                <Breadcrumbs path={[
                    { label: 'Drivers', screen: 'DRIVERS' },
                    { label: isNew ? 'Add New Driver' : `Edit ${driverToEdit?.name || 'Driver'}`, screen: view.screen, params: view.params }
                ]} />
                <h1>{isNew ? 'Add New Driver' : `Edit Driver: ${driverToEdit?.name}`}</h1>
                <div className="detail-view">
                    <form onSubmit={handleSubmit}>
                        <div className="detail-section">
                            <h3>Driver Information</h3>
                            <div className="detail-item-grid">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="driverId">Driver ID <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <input type="text" id="driverId" name="driverId" value={formData.driverId} onChange={handleChange} required disabled={!isNew} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dob">Date of Birth</label>
                                    <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows="3"></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="detail-section">
                            <h3>Compliance Details</h3>
                            <div className="detail-item-grid">
                                <div className="form-group">
                                    <label htmlFor="licenseExpiry">License Expiry Date <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <input type="date" id="licenseExpiry" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="insuranceExpiry">Insurance Expiry Date <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <input type="date" id="insuranceExpiry" name="insuranceExpiry" value={formData.insuranceExpiry} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Overall Status</label>
                                    <select id="status" name="status" value={formData.status} onChange={handleChange}>
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="button button-secondary" onClick={() => navigate('DRIVERS')}>Cancel</button>
                            <button type="submit" className="button button-primary">{isNew ? 'Create Driver' : 'Save Changes'}</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderTripList = () => {
        if (!hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.OPERATIONS_MANAGER])) return <div className="main-content">Access Denied</div>;

        const filteredTrips = trips.filter(trip =>
            trip.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.status.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="main-content">
                <Breadcrumbs path={[{ label: 'Trips', screen: 'TRIPS' }]} />
                <h1>Trips</h1>
                <ListActionsBar
                    onSearchChange={handleSearch}
                    onFilterClick={toggleFilterPanel}
                    onSortClick={() => console.log('Sort trips')}
                    selectedCount={0}
                />
                <div className="card-grid">
                    {filteredTrips.map(trip => (
                        <EntityCard
                            key={trip.id}
                            title={`${trip.origin} to ${trip.destination}`}
                            subtitle={`Driver: ${trip.driverName}`}
                            details={[
                                { label: 'Date', value: trip.date, icon: 'calendar' },
                                { label: 'Distance', value: `${trip.distance} miles` },
                                { label: 'Duration', value: trip.duration, icon: 'time' },
                                { label: 'Score', value: trip.score, icon: 'star' },
                            ]}
                            status={trip.status}
                            onClick={() => navigate('TRIP_DETAIL', { tripId: trip.id })}
                        />
                    ))}
                </div>
                <FilterPanel isOpen={filterPanelOpen} onClose={toggleFilterPanel} onApply={handleApplyFilters} />
            </div>
        );
    };

    const renderTripDetail = () => {
        if (!hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.OPERATIONS_MANAGER])) return <div className="main-content">Access Denied</div>;

        const trip = trips.find(t => t.id === view.params.tripId);
        if (!trip) return <div className="main-content">Trip not found.</div>;

        return (
            <div className="main-content">
                <Breadcrumbs path={[
                    { label: 'Trips', screen: 'TRIPS' },
                    { label: `${trip.origin} to ${trip.destination}`, screen: 'TRIP_DETAIL', params: { tripId: trip.id } }
                ]} />
                <div className="detail-view">
                    <div className="detail-header">
                        <div className="detail-header-left">
                            <h2>Trip: {trip.origin} to {trip.destination} <StatusBadge statusKey={trip.status} /></h2>
                            <p className="subtitle">Driver: <a href="#" onClick={() => navigate('DRIVER_DETAIL', { driverId: drivers.find(d => d.driverId === trip.driverId)?.id })}>{trip.driverName}</a></p>
                        </div>
                        <div className="detail-header-actions">
                            {hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER]) && (
                                <button className="button button-secondary">
                                    <span className="icon download"></span> Export Trip Data
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="detail-sections">
                        <div className="detail-main-info">
                            <div className="detail-section">
                                <h3>Trip Details</h3>
                                <div className="detail-item-grid">
                                    <div className="detail-item"><label>Date</label><p>{trip.date}</p></div>
                                    <div className="detail-item"><label>Origin</label><p>{trip.origin}</p></div>
                                    <div className="detail-item"><label>Destination</label><p>{trip.destination}</p></div>
                                    <div className="detail-item"><label>Distance</label><p>{trip.distance} miles</p></div>
                                    <div className="detail-item"><label>Duration</label><p>{trip.duration}</p></div>
                                    <div className="detail-item"><label>Average Speed</label><p>{trip.averageSpeed}</p></div>
                                    <div className="detail-item"><label>Fuel Efficiency</label><p>{trip.fuelEfficiency}</p></div>
                                </div>
                            </div>
                            <div className="detail-section">
                                <h3>Driving Performance</h3>
                                <div className="detail-item-grid">
                                    <div className="detail-item"><label>Trip Score</label><p>{trip.score}</p></div>
                                    <div className="detail-item"><label>Hard Braking Events</label><p>{trip.hardBrakes}</p></div>
                                    <div className="detail-item"><label>Rapid Acceleration Events</label><p>{trip.rapidAccels}</p></div>
                                </div>
                                <div className="chart-placeholder" style={{ marginTop: 'var(--spacing-md)' }}>Line Chart: Speed Profile / Events Timeline</div>
                            </div>
                        </div>
                        <div className="detail-related-info">
                            <div className="detail-section">
                                <h3>Related Violations</h3>
                                <ul>
                                    {violations.filter(v => v.driverId === trip.driverId && v.date === trip.date).length > 0 ? (
                                        violations.filter(v => v.driverId === trip.driverId && v.date === trip.date).map(vio => (
                                            <li key={vio.id}>
                                                <span>{vio.type} ({vio.severity})</span>
                                                <StatusBadge statusKey={vio.status} />
                                                <button className="button button-icon" onClick={() => navigate('VIOLATION_DETAIL', { violationId: vio.id })}>
                                                    <span className="icon chevron-right"></span>
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No violations recorded for this trip.</li>
                                    )}
                                </ul>
                            </div>
                            <div className="detail-section">
                                <h3>Route Map</h3>
                                <div className="document-preview" style={{ height: '300px' }}>
                                    Map with Route Path
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDocumentList = () => {
        if (!hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.COMPLIANCE_OFFICER])) return <div className="main-content">Access Denied</div>;

        const filteredDocuments = documents.filter(doc =>
            doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.status.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="main-content">
                <Breadcrumbs path={[{ label: 'Documents', screen: 'DOCUMENTS' }]} />
                <h1>Compliance Documents</h1>
                <ListActionsBar
                    onSearchChange={handleSearch}
                    onFilterClick={toggleFilterPanel}
                    onSortClick={() => console.log('Sort documents')}
                    selectedCount={0}
                />
                <div className="card-grid">
                    {filteredDocuments.map(doc => (
                        <EntityCard
                            key={doc.id}
                            title={`${doc.type} - ${doc.driverName}`}
                            subtitle={`File: ${doc.fileName}`}
                            details={[
                                { label: 'Expiry', value: doc.expiryDate, icon: 'calendar' },
                                { label: 'Uploaded By', value: doc.uploadedBy },
                            ]}
                            status={doc.status}
                            onClick={() => navigate('DOCUMENT_DETAIL', { documentId: doc.id })}
                        />
                    ))}
                </div>
                <FilterPanel isOpen={filterPanelOpen} onClose={toggleFilterPanel} onApply={handleApplyFilters} />
            </div>
        );
    };

    const renderDocumentDetail = () => {
        if (!hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.COMPLIANCE_OFFICER])) return <div className="main-content">Access Denied</div>;

        const document = documents.find(d => d.id === view.params.documentId);
        if (!document) return <div className="main-content">Document not found.</div>;

        const currentWorkflowStageIndex = DOCUMENT_WORKFLOW.findIndex(s => s.stage === document.workflowStage);
        const currentStageRoles = DOCUMENT_WORKFLOW[currentWorkflowStageIndex]?.roles;

        // Functional specification: Role-based approvals
        const canApprove = hasAccess([ROLES.ADMIN, ROLES.COMPLIANCE_OFFICER]) && document.status === 'PENDING';
        const canReject = hasAccess([ROLES.ADMIN, ROLES.COMPLIANCE_OFFICER]) && document.status === 'PENDING';
        const canRequestUpdate = hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER]) && (document.status === 'APPROVED' || document.status === 'PENDING');

        const handleDocumentApproval = (newStatus) => {
            setDocuments(prev => prev.map(d => (d.id === document.id ? { ...d, status: newStatus, workflowStage: newStatus } : d)));
            console.log(`Document ${document.id} status updated to ${newStatus}`);
            // In a real app, this would also update audit logs, trigger alerts, etc.
        };

        return (
            <div className="main-content">
                <Breadcrumbs path={[
                    { label: 'Documents', screen: 'DOCUMENTS' },
                    { label: `${document.type} - ${document.driverName}`, screen: 'DOCUMENT_DETAIL', params: { documentId: document.id } }
                ]} />
                <div className="detail-view">
                    <div className="detail-header">
                        <div className="detail-header-left">
                            <h2>{document.type} for {document.driverName} <StatusBadge statusKey={document.status} /></h2>
                            <p className="subtitle">File: {document.fileName}</p>
                        </div>
                        <div className="detail-header-actions">
                            <button className="button button-secondary">
                                <span className="icon download"></span> Download
                            </button>
                            {canApprove && (
                                <button className="button button-primary" onClick={() => handleDocumentApproval('APPROVED')}>
                                    <span className="icon check"></span> Approve
                                </button>
                            )}
                            {canReject && (
                                <button className="button button-danger" style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)', color: 'white' }} onClick={() => handleDocumentApproval('REJECTED')}>
                                    Reject
                                </button>
                            )}
                            {canRequestUpdate && document.status !== 'REJECTED' && document.status !== 'DOCUMENT_UPDATE_REQUIRED' && (
                                <button className="button button-warning" style={{ backgroundColor: 'var(--color-warning)', borderColor: 'var(--color-warning)', color: 'var(--color-grey-900)' }} onClick={() => handleDocumentApproval('DOCUMENT_UPDATE_REQUIRED')}>
                                    Request Update
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="detail-sections">
                        <div className="detail-main-info">
                            <div className="detail-section">
                                <h3>Document Information</h3>
                                <div className="detail-item-grid">
                                    <div className="detail-item"><label>Type</label><p>{document.type}</p></div>
                                    <div className="detail-item"><label>Driver</label><a href="#" onClick={() => navigate('DRIVER_DETAIL', { driverId: drivers.find(d => d.driverId === document.driverId)?.id })}>{document.driverName}</a></div>
                                    <div className="detail-item"><label>Expiry Date</label><p>{document.expiryDate}</p></div>
                                    <div className="detail-item"><label>Uploaded By</label><p>{document.uploadedBy}</p></div>
                                    <div className="detail-item"><label>Upload Date</label><p>{document.uploadDate}</p></div>
                                    <div className="detail-item"><label>File Name</label><p>{document.fileName}</p></div>
                                </div>
                            </div>
                            <div className="detail-section">
                                <h3>Document Workflow & SLA</h3>
                                <div className="workflow-tracker">
                                    {DOCUMENT_WORKFLOW.map((stage, index) => (
                                        <div
                                            key={stage.stage}
                                            className={`workflow-stage 
                                                ${index < currentWorkflowStageIndex ? 'completed' : ''} 
                                                ${stage.stage === document.workflowStage ? 'active' : ''}
                                                ${stage.stage === document.workflowStage && document.slaStatus === 'Breached SLA' ? 'overdue' : ''}
                                            `}
                                        >
                                            <div className="workflow-stage-icon">
                                                {index < currentWorkflowStageIndex ? <span className="icon check"></span> : index + 1}
                                            </div>
                                            <div className="workflow-stage-label">
                                                {stage.label}
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-grey-500)' }}>SLA: {stage.sla}</p>
                                                {stage.stage === document.workflowStage && document.slaStatus === 'Breached SLA' && (
                                                    <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)' }}>SLA Breached!</p>
                                                )}
                                                {stage.stage === document.workflowStage && document.slaStatus === 'Approaching SLA' && (
                                                    <p style={{ color: 'var(--color-warning)', fontSize: 'var(--font-size-xs)' }}>Approaching SLA</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: 'var(--spacing-md)' }}>
                                    <p><label>Current SLA Status:</label> <strong>{document.slaStatus}</strong></p>
                                    <p><label>Next Action By:</label> <strong>{currentStageRoles?.join(', ') || 'N/A'}</strong></p>
                                </div>
                            </div>
                        </div>
                        <div className="detail-related-info">
                            <div className="detail-section">
                                <h3>Document Preview</h3>
                                <div className="document-preview">
                                    {/* In a real app, this would be an iframe or image viewer */}
                                    PDF Viewer / Image Preview for {document.fileName}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDocumentForm = () => {
        if (!hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.COMPLIANCE_OFFICER, ROLES.DRIVER])) return <div className="main-content">Access Denied</div>;

        const isNew = view.screen === 'DOCUMENT_NEW';
        const docToEdit = !isNew ? documents.find(d => d.id === view.params.documentId) : {};

        const [formData, setFormData] = useState({
            driverId: view.params.driverId || docToEdit?.driverId || '',
            type: docToEdit?.type || '',
            expiryDate: docToEdit?.expiryDate || '',
            fileName: docToEdit?.fileName || '',
            file: null,
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleFileChange = (e) => {
            setFormData(prev => ({ ...prev, file: e.target.files[0], fileName: e.target.files[0]?.name || '' }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log('Document form submitted:', formData);
            if (isNew) {
                const driver = drivers.find(d => d.driverId === formData.driverId);
                setDocuments(prev => [...prev, {
                    id: generateUUID(),
                    driverId: formData.driverId,
                    driverName: driver?.name || 'Unknown Driver',
                    type: formData.type,
                    status: 'PENDING',
                    expiryDate: formData.expiryDate,
                    uploadedBy: currentUser?.name || 'System',
                    uploadDate: new Date().toISOString().slice(0, 10),
                    fileName: formData.fileName,
                    workflowStage: 'Uploaded',
                    slaStatus: 'On Track'
                }]);
            } else {
                setDocuments(prev => prev.map(d => (d.id === docToEdit.id ? { ...d, ...formData, status: 'PENDING', workflowStage: 'Uploaded' } : d)));
            }
            navigate('DOCUMENTS');
        };

        return (
            <div className="main-content">
                <Breadcrumbs path={[
                    { label: 'Documents', screen: 'DOCUMENTS' },
                    { label: isNew ? 'Upload Document' : `Edit Document: ${docToEdit?.fileName || 'N/A'}`, screen: view.screen, params: view.params }
                ]} />
                <h1>{isNew ? 'Upload New Compliance Document' : `Edit Document: ${docToEdit?.fileName}`}</h1>
                <div className="detail-view">
                    <form onSubmit={handleSubmit}>
                        <div className="detail-section">
                            <h3>Document Details</h3>
                            <div className="detail-item-grid">
                                <div className="form-group">
                                    <label htmlFor="driverId">Driver ID <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <select id="driverId" name="driverId" value={formData.driverId} onChange={handleChange} required>
                                        <option value="">Select Driver</option>
                                        {drivers.map(driver => (
                                            <option key={driver.id} value={driver.driverId}>{driver.name} ({driver.driverId})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="type">Document Type <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="expiryDate">Expiry Date <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <input type="date" id="expiryDate" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginTop: 'var(--spacing-md)' }}>
                                <label>File Upload <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                <div className="file-upload-area">
                                    <input type="file" id="fileUpload" name="file" onChange={handleFileChange} required={isNew} />
                                    <label htmlFor="fileUpload">
                                        <span className="icon upload" style={{ fontSize: '2em', marginBottom: 'var(--spacing-sm)' }}></span><br />
                                        Drag & Drop files here or <u>click to browse</u>
                                    </label>
                                    {formData.fileName && <p style={{ marginTop: 'var(--spacing-sm)' }}>Selected: <strong>{formData.fileName}</strong></p>}
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="button button-secondary" onClick={() => navigate('DOCUMENTS')}>Cancel</button>
                            <button type="submit" className="button button-primary">{isNew ? 'Upload Document' : 'Update Document'}</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderViolationList = () => {
        if (!hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.COMPLIANCE_OFFICER, ROLES.OPERATIONS_MANAGER])) return <div className="main-content">Access Denied</div>;

        const filteredViolations = violations.filter(violation =>
            violation.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            violation.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            violation.severity.toLowerCase().includes(searchQuery.toLowerCase()) ||
            violation.status.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="main-content">
                <Breadcrumbs path={[{ label: 'Violations', screen: 'VIOLATIONS' }]} />
                <h1>Violations & Incidents</h1>
                <ListActionsBar
                    onSearchChange={handleSearch}
                    onFilterClick={toggleFilterPanel}
                    onSortClick={() => console.log('Sort violations')}
                    selectedCount={0}
                />
                <div className="card-grid">
                    {filteredViolations.map(violation => (
                        <EntityCard
                            key={violation.id}
                            title={`${violation.type} - ${violation.driverName}`}
                            subtitle={`Severity: ${violation.severity}`}
                            details={[
                                { label: 'Date', value: violation.date, icon: 'calendar' },
                                { label: 'Action', value: violation.actionRequired },
                            ]}
                            status={violation.status}
                            onClick={() => navigate('VIOLATION_DETAIL', { violationId: violation.id })}
                        />
                    ))}
                </div>
                <FilterPanel isOpen={filterPanelOpen} onClose={toggleFilterPanel} onApply={handleApplyFilters} />
            </div>
        );
    };

    const renderViolationDetail = () => {
        if (!hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.COMPLIANCE_OFFICER, ROLES.OPERATIONS_MANAGER])) return <div className="main-content">Access Denied</div>;

        const violation = violations.find(v => v.id === view.params.violationId);
        if (!violation) return <div className="main-content">Violation not found.</div>;

        return (
            <div className="main-content">
                <Breadcrumbs path={[
                    { label: 'Violations', screen: 'VIOLATIONS' },
                    { label: `${violation.type} - ${violation.driverName}`, screen: 'VIOLATION_DETAIL', params: { violationId: violation.id } }
                ]} />
                <div className="detail-view">
                    <div className="detail-header">
                        <div className="detail-header-left">
                            <h2>{violation.type} <StatusBadge statusKey={violation.status} /></h2>
                            <p className="subtitle">Driver: <a href="#" onClick={() => navigate('DRIVER_DETAIL', { driverId: drivers.find(d => d.driverId === violation.driverId)?.id })}>{violation.driverName}</a></p>
                        </div>
                        <div className="detail-header-actions">
                            {hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER]) && (
                                <button className="button button-secondary" onClick={() => navigate('VIOLATION_EDIT', { violationId: violation.id })}>
                                    <span className="icon edit"></span> Edit Violation
                                </button>
                            )}
                            {hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.COMPLIANCE_OFFICER]) && (
                                <button className="button button-primary" style={{ backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' }}>
                                    Resolve Violation
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="detail-sections">
                        <div className="detail-main-info">
                            <div className="detail-section">
                                <h3>Violation Details</h3>
                                <div className="detail-item-grid">
                                    <div className="detail-item"><label>Type</label><p>{violation.type}</p></div>
                                    <div className="detail-item"><label>Date</label><p>{violation.date}</p></div>
                                    <div className="detail-item"><label>Severity</label><p>{violation.severity}</p></div>
                                    <div className="detail-item"><label>Reported By</label><p>{violation.reportedBy}</p></div>
                                    <div className="detail-item"><label>Description</label><p>{violation.description}</p></div>
                                </div>
                            </div>
                            <div className="detail-section">
                                <h3>Action & Status</h3>
                                <div className="detail-item-grid">
                                    <div className="detail-item"><label>Action Required</label><p>{violation.actionRequired}</p></div>
                                    <div className="detail-item"><label>Current Status</label><StatusBadge statusKey={violation.status} /></div>
                                </div>
                            </div>
                        </div>
                        <div className="detail-related-info">
                            <div className="detail-section">
                                <h3>Related Trip Data</h3>
                                <ul>
                                    {trips.filter(t => t.driverId === violation.driverId && t.date === violation.date).length > 0 ? (
                                        trips.filter(t => t.driverId === violation.driverId && t.date === violation.date).map(trip => (
                                            <li key={trip.id}>
                                                <span>Trip: {trip.origin} to {trip.destination}</span>
                                                <StatusBadge statusKey={trip.status} />
                                                <button className="button button-icon" onClick={() => navigate('TRIP_DETAIL', { tripId: trip.id })}>
                                                    <span className="icon chevron-right"></span>
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No related trip found for this date.</li>
                                    )}
                                </ul>
                            </div>
                            <div className="detail-section">
                                <h3>Audit Log</h3>
                                <ul>
                                    <li><p><strong>2023-10-10 14:15 PM:</strong> Violation 'Speeding' logged for DRV003 by System.</p></li>
                                    <li><p><strong>2023-10-12 09:00 AM:</strong> Action 'Driver Counseling' assigned by Fleet Manager.</p></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderAlertList = () => {
        if (!hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.COMPLIANCE_OFFICER, ROLES.OPERATIONS_MANAGER, ROLES.DRIVER])) return <div className="main-content">Access Denied</div>;

        const filteredAlerts = alerts.filter(alert =>
            alert.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.status.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="main-content">
                <Breadcrumbs path={[{ label: 'Alerts', screen: 'ALERTS' }]} />
                <h1>System Alerts & Notifications</h1>
                <ListActionsBar
                    onSearchChange={handleSearch}
                    onFilterClick={toggleFilterPanel}
                    onSortClick={() => console.log('Sort alerts')}
                    selectedCount={0}
                />
                <div className="card-grid">
                    {filteredAlerts.map(alert => (
                        <EntityCard
                            key={alert.id}
                            title={alert.subject}
                            subtitle={`Type: ${alert.type}`}
                            details={[
                                { label: 'Date', value: alert.date, icon: 'calendar' },
                                { label: 'Priority', value: alert.priority },
                                alert.driverName ? { label: 'Driver', value: alert.driverName, icon: 'driver' } : null,
                            ].filter(Boolean)}
                            status={alert.status}
                            onClick={() => navigate('ALERT_DETAIL', { alertId: alert.id })}
                        />
                    ))}
                </div>
                <FilterPanel isOpen={filterPanelOpen} onClose={toggleFilterPanel} onApply={handleApplyFilters} />
            </div>
        );
    };

    const renderAlertDetail = () => {
        if (!hasAccess([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.COMPLIANCE_OFFICER, ROLES.OPERATIONS_MANAGER, ROLES.DRIVER])) return <div className="main-content">Access Denied</div>;

        const alert = alerts.find(a => a.id === view.params.alertId);
        if (!alert) return <div className="main-content">Alert not found.</div>;

        const handleMarkAsRead = () => {
            setAlerts(prev => prev.map(a => (a.id === alert.id ? { ...a, status: 'COMPLETED' } : a)));
            console.log(`Alert ${alert.id} marked as read.`);
        };

        return (
            <div className="main-content">
                <Breadcrumbs path={[
                    { label: 'Alerts', screen: 'ALERTS' },
                    { label: alert.subject, screen: 'ALERT_DETAIL', params: { alertId: alert.id } }
                ]} />
                <div className="detail-view">
                    <div className="detail-header">
                        <div className="detail-header-left">
                            <h2>{alert.subject} <StatusBadge statusKey={alert.status} /></h2>
                            <p className="subtitle">Type: {alert.type}</p>
                        </div>
                        <div className="detail-header-actions">
                            {(alert.status === 'NEW' || alert.status === 'PENDING' || alert.status === 'OVERDUE') && (
                                <button className="button button-primary" onClick={handleMarkAsRead}>
                                    <span className="icon check"></span> Mark as Read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="detail-sections">
                        <div className="detail-main-info">
                            <div className="detail-section">
                                <h3>Alert Details</h3>
                                <div className="detail-item-grid">
                                    <div className="detail-item"><label>Date</label><p>{alert.date}</p></div>
                                    <div className="detail-item"><label>Priority</label><p>{alert.priority}</p></div>
                                    <div className="detail-item"><label>Action</label><p>{alert.action}</p></div>
                                    {alert.driverName && (
                                        <div className="detail-item">
                                            <label>Related Driver</label>
                                            <a href="#" onClick={() => navigate('DRIVER_DETAIL', { driverId: drivers.find(d => d.driverId === alert.driverId)?.id })}>{alert.driverName}</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="detail-related-info">
                            <div className="detail-section">
                                <h3>Resolution History</h3>
                                <ul>
                                    {alert.status === 'COMPLETED' && <li><p><strong>2023-10-27 11:00 AM:</strong> Alert marked as read by {currentUser?.name || 'User'}.</p></li>}
                                    <li><p><strong>{alert.date} 08:00 AM:</strong> Alert generated by System.</p></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSettings = () => {
        if (!hasAccess([ROLES.ADMIN])) return <div className="main-content">Access Denied</div>;
        return (
            <div className="main-content">
                <Breadcrumbs path={[{ label: 'Settings', screen: 'SETTINGS' }]} />
                <h1>Settings</h1>
                <div className="detail-view">
                    <div className="detail-section">
                        <h3>User Management (Admin Only)</h3>
                        <p>Configure user roles, permissions, and field-level security here.</p>
                        <button className="button button-primary" style={{ marginTop: 'var(--spacing-md)' }}>Manage Users</button>
                    </div>
                    <div className="detail-section">
                        <h3>System Configuration</h3>
                        <p>Adjust system-wide settings like session timeouts, data encryption, and integration details.</p>
                        <button className="button button-secondary" style={{ marginTop: 'var(--spacing-md)' }}>System Config</button>
                    </div>
                    <div className="detail-section">
                        <h3>Workflow Definitions</h3>
                        <p>Manage and customize workflow stages and SLA rules.</p>
                        <button className="button button-secondary" style={{ marginTop: 'var(--spacing-md)' }}>Edit Workflows</button>
                    </div>
                </div>
            </div>
        );
    };

    // --- Main Screen Router ---
    const renderScreen = () => {
        if (!currentUser && view.screen !== 'LOGIN') {
            return renderLoginScreen();
        }

        switch (view.screen) {
            case 'LOGIN':
                return renderLoginScreen();
            case 'DASHBOARD':
                return renderDashboard();
            case 'DRIVERS':
                return renderDriverList();
            case 'DRIVER_DETAIL':
                return renderDriverDetail();
            case 'DRIVER_NEW':
            case 'DRIVER_EDIT':
                return renderDriverForm();
            case 'TRIPS':
                return renderTripList();
            case 'TRIP_DETAIL':
                return renderTripDetail();
            case 'DOCUMENTS':
                return renderDocumentList();
            case 'DOCUMENT_DETAIL':
                return renderDocumentDetail();
            case 'DOCUMENT_NEW':
            case 'DOCUMENT_EDIT':
                return renderDocumentForm();
            case 'VIOLATIONS':
                return renderViolationList();
            case 'VIOLATION_DETAIL':
                return renderViolationDetail();
            case 'ALERTS':
                return renderAlertList();
            case 'ALERT_DETAIL':
                return renderAlertDetail();
            case 'SETTINGS':
                return renderSettings();
            default:
                return (
                    <div className="main-content">
                        <h1>404 - Page Not Found</h1>
                        <p>The screen {view.screen} does not exist.</p>
                        <button className="button button-primary" onClick={() => navigate('DASHBOARD')}>Go to Dashboard</button>
                    </div>
                );
        }
    };

    return (
        <div className="App">
            {currentUser && <Header />}
            {currentUser && <NavBar />}
            {renderScreen()}
        </div>
    );
}

export default App;