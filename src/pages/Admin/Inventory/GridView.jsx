import {FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi';

export const GridView = ({ inventory, loading, handleIncreaseStock, handleDecreaseStock, handleRemove, getStockStatus, formatDate }) => {
  return (
    <div className="row g-4">
      {inventory.map(item => (
        <div key={item.id} className="col-md-6 col-lg-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
              <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                <img 
                  src={"https://ware.link.syntechticsolutions.com.ng/"+item.main_image} 
                  alt={item.name}
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  className="p-2"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '/images/default-laptop.jpg';
                  }}
                />
              </div>
              <span className={`badge bg-${getStockStatus(item.quantity)} position-absolute top-0 end-0 m-2`}>
                {item.quantity} in stock
              </span>
            </div>
            
            <div className="card-body">
              <h5 className="card-title mb-1">{item.name}</h5>
              <p className="text-muted small mb-2">{item.description}</p>
              <h5 className="text-success mb-3">₦ {Number(item.price).toLocaleString()}</h5>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small className="text-muted">Stock Level</small>
                  <small className="fw-bold">
                    {item.quantity > 15 ? 'High' : item.quantity > 5 ? 'Medium' : 'Low'}
                  </small>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div 
                    className={`progress-bar bg-${getStockStatus(item.quantity)}`} 
                    style={{ width: `${(item.quantity / 30) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center" style={{ width: '120px' }}>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleDecreaseStock(item.id, item.quantity)}
                    disabled={loading.action}
                  >
                    <FiChevronDown />
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleIncreaseStock(item.id, item.quantity)}
                    disabled={loading.action}
                  >
                    <FiChevronUp />
                  </button>
                </div>
                
                <button 
                  className="btn btn-sm btn-outline-danger d-flex align-items-center"
                  onClick={() => handleRemove(item.id)}
                  disabled={loading.action}
                >
                  <FiTrash2 className="me-1" size={14} />
                  Remove
                </button>
              </div>
            </div>
            
            <div className="card-footer bg-transparent">
              <small className="text-muted">
                Last updated: {formatDate(item.updated_at)}
              </small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};