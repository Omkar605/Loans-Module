import { useState, useMemo } from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const TransactionsTable = ({ transactions }) => {
  // Default sorting by date, newest first
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="transactions-table">
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{formatDate(transaction.date)}</td>
                <td>
                  <span className="transaction-id">{transaction.id}</span>
                </td>
                <td>
                  <span className={`badge bg-${getTypeStyle(transaction.type)}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className={transaction.type === 'Payment' ? 'text-success' : ''}>
                  {formatCurrency(transaction.amount)}
                </td>
                <td>
                  <span className={`badge bg-${getStatusStyle(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedTransactions.length === 0 && (
        <div className="alert alert-info">
          No transactions found.
        </div>
      )}
    </div>
  );
};

// Helper functions for styling
const getTypeStyle = (type) => {
  switch (type) {
    case 'Payment':
      return 'success';
    case 'Withdrawal':
      return 'danger';
    case 'Disbursement':
      return 'primary';
    case 'Fee':
      return 'warning';
    case 'Interest':
      return 'info';
    default:
      return 'secondary';
  }
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Failed':
      return 'danger';
    case 'Refunded':
      return 'info';
    default:
      return 'secondary';
  }
};

export default TransactionsTable; 