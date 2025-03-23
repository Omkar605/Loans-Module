import { useMemo } from 'react';
import { formatCurrency } from '../../utils/formatters';

const LoanSummary = ({ loans }) => {
  const summaryStats = useMemo(() => {
    if (!loans || loans.length === 0) {
      return {
        totalLoanAmount: 0,
        totalOutstanding: 0,
        totalMonthlyPayment: 0,
        activeLoans: 0
      };
    }
    
    return {
      totalLoanAmount: loans.reduce((sum, loan) => sum + loan.totalAmount, 0),
      totalOutstanding: loans.reduce((sum, loan) => 
        sum + (loan.totalAmount - loan.amountPaid), 0),
      totalMonthlyPayment: loans.reduce((sum, loan) => 
        sum + (loan.status === 'Active' ? loan.monthlyPayment : 0), 0),
      activeLoans: loans.filter(loan => loan.status === 'Active').length
    };
  }, [loans]);
  
  const stats = [
    {
      title: 'Total Loan Amount',
      value: formatCurrency(summaryStats.totalLoanAmount),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      ),
      color: 'primary'
    },
    {
      title: 'Outstanding Balance',
      value: formatCurrency(summaryStats.totalOutstanding),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      ),
      color: 'warning'
    },
    {
      title: 'Monthly Payment',
      value: formatCurrency(summaryStats.totalMonthlyPayment),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      color: 'info'
    },
    {
      title: 'Active Loans',
      value: summaryStats.activeLoans,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
      color: 'success'
    }
  ];
  
  return (
    <div className="row">
      {stats.map((stat, index) => (
        <div key={index} className="col-12 col-sm-6 col-lg-3 mb-4">
          <div className="stats-card">
            <div className={`stats-card-icon bg-${stat.color}`}>
              {stat.icon}
            </div>
            <div className="stats-card-content">
              <div className="stats-card-title">{stat.title}</div>
              <div className="stats-card-value">{stat.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoanSummary; 