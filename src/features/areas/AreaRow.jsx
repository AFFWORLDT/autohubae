import Table from "../../ui/Table";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react"; // Example action icon

// Basic styling, can be moved to CSS modules
const countStyle = {
    textAlign: 'center',
    fontSize: '1.4rem',
    cursor: 'pointer',
    color: '#2563eb', // Blue color like links
    fontWeight: '500',
    padding: '0.5rem 0', // Add padding for easier clicking
    borderRadius: '4px',
    transition: 'background-color 0.2s ease'
};

const countHoverStyle = {
     backgroundColor: '#eff6ff' // Light blue background on hover
};

const actionCellStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-start',
    alignItems: 'center',
};

function AreaRow({ areaData }) {
    const navigate = useNavigate();

    const { id, name, agent_name, property_counts } = areaData;

    const handleNavigate = (listingType) => {
        let path = '';
        if (listingType === 'sell') {
            path = `/for-sell/new-list?area_id=${id}`;
        } else if (listingType === 'rent') {
            path = `/for-rent/new-list?area_id=${id}`;
        } else if (listingType === 'project') {
            path = `/new-projects/list?area_id=${id}`;
        }
        if(path) navigate(path);
    };

    return (
        <Table.Row>
            <div style={{ textAlign: 'left' }}>{name || "N/A"}</div>
            <div style={{ textAlign: 'left' }}>{agent_name || "N/A"}</div>
            <div 
                style={countStyle} 
                onClick={() => handleNavigate('sell')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = countHoverStyle.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title={`View Sell listings in ${name}`}
            >
                {property_counts?.sell || 0}
            </div>
            <div 
                style={countStyle} 
                onClick={() => handleNavigate('rent')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = countHoverStyle.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title={`View Rent listings in ${name}`}
            >
                {property_counts?.rent || 0}
            </div>
            <div 
                style={countStyle} 
                onClick={() => handleNavigate('project')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = countHoverStyle.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title={`View Projects in ${name}`}
            >
                {property_counts?.project ?? 0}
            </div>
            <div style={actionCellStyle}>
                <button 
                    onClick={() => handleNavigate('sell')}
                    className="btnIcon"
                    title={`View Sell listings in ${name}`}
                    style={{ padding: '0.5rem'}}
                >
                    <Eye size={18} />
                </button>
            </div>
        </Table.Row>
    );
}

export default AreaRow; 