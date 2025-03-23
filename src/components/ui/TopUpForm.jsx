import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { topUpLoan, selectTopUpSuccess } from '../../store/slices/loanSlice';
import { formatCurrency } from '../../utils/formatters';
import Spinner from './Spinner';

const TopUpForm = ({ loan, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const topUpSuccess = useSelector(selectTopUpSuccess);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  
  // Form validation using react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch,
    setValue
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      topUpAmount: '',
      purpose: '',
      agreeToTerms: false
    }
  });
  
  // Watch amount for calculations
  const watchedAmount = watch('topUpAmount');
  
  // Calculate new monthly payment (simplified calculation)
  const calculateNewMonthlyPayment = (amount) => {
    if (!amount || isNaN(amount) || amount <= 0) return loan?.monthlyPayment || 0;
    
    const topUpValue = parseFloat(amount);
    const currentMonthly = loan?.monthlyPayment || 0;
    const interestRate = loan?.interestRate || 5;
    const remainingMonths = loan?.term || 12;
    
    // Simple calculation - can be replaced with more accurate amortization formula
    const newMonthly = currentMonthly + (topUpValue * (1 + (interestRate / 100)) / remainingMonths);
    return newMonthly;
  };
  
  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      await dispatch(topUpLoan({
        loanId: loan.id,
        topUpAmount: data.topUpAmount,
        purpose: data.purpose
      })).unwrap();
      
      // Clear form and show success message
      setTopUpAmount('');
      setValue('topUpAmount', '');
      setValue('purpose', '');
      setValue('agreeToTerms', false);
      
      // Notify parent component of success
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to process top-up:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle amount change to update calculations
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setTopUpAmount(value);
  };
  
  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Top Up Your Loan</h5>
        <button 
          type="button" 
          className="btn-close" 
          aria-label="Close"
          onClick={onCancel}
        ></button>
      </div>
      
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="topUpAmount" className="form-label">Top Up Amount</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className={`form-control ${errors.topUpAmount ? 'is-invalid' : ''}`}
                id="topUpAmount"
                placeholder="Enter amount"
                step="0.01"
                min="100"
                max="50000"
                {...register('topUpAmount', {
                  required: 'Top up amount is required',
                  min: {
                    value: 100,
                    message: 'Minimum top up amount is $100'
                  },
                  max: {
                    value: 50000,
                    message: 'Maximum top up amount is $50,000'
                  },
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Enter a valid amount'
                  },
                  onChange: handleAmountChange
                })}
              />
              {errors.topUpAmount && (
                <div className="invalid-feedback">
                  {errors.topUpAmount.message}
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="purpose" className="form-label">Purpose of Top Up</label>
            <select
              className={`form-select ${errors.purpose ? 'is-invalid' : ''}`}
              id="purpose"
              {...register('purpose', {
                required: 'Please select a purpose for the top up'
              })}
            >
              <option value="">Select purpose...</option>
              <option value="Home Improvement">Home Improvement</option>
              <option value="Business Expansion">Business Expansion</option>
              <option value="Education">Education</option>
              <option value="Medical Expenses">Medical Expenses</option>
              <option value="Debt Consolidation">Debt Consolidation</option>
              <option value="Other">Other</option>
            </select>
            {errors.purpose && (
              <div className="invalid-feedback">
                {errors.purpose.message}
              </div>
            )}
          </div>
          
          {watchedAmount && parseFloat(watchedAmount) > 0 && (
            <div className="alert alert-info mb-3">
              <h6 className="alert-heading">Top Up Summary</h6>
              <p className="mb-1">
                Current loan amount: <strong>{formatCurrency(loan?.totalAmount || 0)}</strong>
              </p>
              <p className="mb-1">
                Top up amount: <strong>{formatCurrency(parseFloat(watchedAmount) || 0)}</strong>
              </p>
              <p className="mb-1">
                New total amount: <strong>{formatCurrency((loan?.totalAmount || 0) + (parseFloat(watchedAmount) || 0))}</strong>
              </p>
              <p className="mb-0">
                New est. monthly payment: <strong>{formatCurrency(calculateNewMonthlyPayment(watchedAmount))}</strong>
              </p>
            </div>
          )}
          
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className={`form-check-input ${errors.agreeToTerms ? 'is-invalid' : ''}`}
              id="agreeToTerms"
              {...register('agreeToTerms', {
                required: 'You must agree to terms and conditions'
              })}
            />
            <label className="form-check-label" htmlFor="agreeToTerms">
              I agree to the terms and conditions for loan top up
            </label>
            {errors.agreeToTerms && (
              <div className="invalid-feedback">
                {errors.agreeToTerms.message}
              </div>
            )}
          </div>
          
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner color="light" size="sm" /> Processing...
                </>
              ) : (
                'Confirm Top Up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopUpForm; 