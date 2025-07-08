import {FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi';

export const ListView = ({ inventory, loading, handleIncreaseStock, handleDecreaseStock, handleRemove, getStockStatus, formatDate }) => {


  return (
    <div className="table-responsive">
      <table className="table table-centered table-hover mb-0 text-nowrap table-borderless">
        <thead className="bg-light">
          <tr>
            <th>Product</th>
            <th>Specifications</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td>
                <div className="d-flex align-items-center">
                  <div className="me-3" style={{ width: '60px', height: '60px' }}>
                    <img 
                      src={item.main_image || '/images/default-laptop.jpg'} 
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{ height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <h6 className="mb-0">{item.name}</h6>
                  </div>
                </div>
              </td>
              <td>{item.description}</td>
              <td>₦ {Number(item.price).toLocaleString()}</td>
              <td>
                <div className="d-flex align-items-center">
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
              </td>
              <td>
                <span className={`badge bg-${getStockStatus(item.quantity)}`}>
                  {item.quantity > 15 ? 'High' : item.quantity > 5 ? 'Medium' : 'Low'}
                </span>
              </td>
              <td>{formatDate(item.updated_at)}</td>
              <td>
                <button
                  className="btn btn-link text-danger"
                  onClick={() => handleRemove(item.id)}
                  disabled={loading.action}
                >
                  <FiTrash2 className="me-1" /> Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};