import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';

const LoanCard = ({ loan }) => {
  // Calculate progress percentage
  const progressPercentage = (loan.amountPaid / loan.totalAmount) * 100;
  
  // Get status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-success';
      case 'Pending':
        return 'bg-warning';
      case 'Repaid':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };
  
  return (
    <div className="card loan-card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <span className="loan-type">{loan.type}</span>
          <span className="ms-2 loan-id text-muted">#{loan.id}</span>
        </div>
        <span className={`badge ${getStatusClass(loan.status)}`}>
          {loan.status}
        </span>
      </div>
      
      <div className="card-body">
        <div className="loan-amount mb-3">
          <div className="text-muted small">Total Amount</div>
          <div className="fw-bold fs-4">{formatCurrency(loan.totalAmount)}</div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div className="text-muted small">Paid</div>
            <div>{formatCurrency(loan.amountPaid)}</div>
          </div>
          <div className="text-end">
            <div className="text-muted small">Remaining</div>
            <div>{formatCurrency(loan.totalAmount - loan.amountPaid)}</div>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <div className="text-muted small">Progress</div>
            <div className="small">{Math.round(progressPercentage)}%</div>
          </div>
          <div className="progress" style={{ height: '8px' }}>
            <div 
              className="progress-bar bg-success" 
              role="progressbar" 
              style={{ width: `${progressPercentage}%` }} 
              aria-valuenow={progressPercentage} 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
        </div>
        
        <div className="loan-details mb-3">
          <div className="row g-2">
            <div className="col-6">
              <div className="text-muted small">Monthly Payment</div>
              <div>{formatCurrency(loan.monthlyPayment)}</div>
            </div>
            <div className="col-6">
              <div className="text-muted small">Interest Rate</div>
              <div>{loan.interestRate}%</div>
            </div>
            <div className="col-6">
              <div className="text-muted small">Start Date</div>
              <div>{formatDate(loan.startDate, { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</div>
            </div>
            <div className="col-6">
              <div className="text-muted small">Duration</div>
              <div>{loan.durationMonths} months</div>
            </div>
          </div>
        </div>
        
        <div className="loan-actions">
          <Link to={`/loans/${loan.id}`} className="btn btn-primary btn-sm w-100">
            View Details
          </Link>
          {loan.status === 'Active' && (
            <Link to={`/loans/${loan.id}`} className="btn btn-outline-primary btn-sm w-100 mt-2">
              Make Payment
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanCard; 