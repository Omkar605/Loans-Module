import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { makePayment, clearPaymentStatus } from '../../store/slices/loanSlice';
import { formatCurrency } from '../../utils/formatters';

const PaymentForm = ({ loan }) => {
  const [paymentType, setPaymentType] = useState('minimum');
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [amountValue, setAmountValue] = useState(loan?.monthlyPayment || 0);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payment = createSelector(
    state => state.loans.paymentSuccess,
    state => state.loans.loading.payment,
    state => state.loans.error.payment,
    (paymentSuccess, loading, error) => ({ paymentSuccess, loading, error })
  );

  const { loading, error, paymentSuccess } = useSelector(payment);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      amount: loan?.monthlyPayment || 0,
      paymentMethod: 'card',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    }
  });
  
  // Update amount value when payment type changes
  useEffect(() => {
    if (paymentType === 'minimum') {
      const minimumAmount = loan?.monthlyPayment || 0;
      setValue('amount', minimumAmount);
      setAmountValue(minimumAmount);
    } else if (paymentType === 'full') {
      // Calculate the remaining balance explicitly to avoid undefined values
      const remainingBalance = loan?.remainingBalance || 
                               (loan?.totalAmount && loan?.amountPaid ? 
                                loan.totalAmount - loan.amountPaid : 0);
      
      setValue('amount', remainingBalance);
      setAmountValue(remainingBalance);
    }
  }, [paymentType, loan, setValue]);
  
  // Watch for changes in the payment method
  const paymentMethod = watch('paymentMethod');
  
  // Show card details when card payment method is selected
  useEffect(() => {
    setShowCardDetails(paymentMethod === 'card');
  }, [paymentMethod]);
  
  // Reset payment status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearPaymentStatus());
    };
  }, [dispatch]);
  
  // Handle form submission
  const onSubmit = (data) => {
    dispatch(makePayment({
      loanId: loan.id,
      paymentData: {
        amount: Number(data.amount),
        paymentMethod: data.paymentMethod,
        paymentDetails: data.paymentMethod === 'card' ? {
          cardNumber: data.cardNumber,
          cardName: data.cardName,
          expiryDate: data.expiryDate,
          cvv: data.cvv
        } : {}
      }
    }));
  };
  
  // Handle amount change
  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setAmountValue(value);
    setValue('amount', value);
    setPaymentType('custom');
  };
  
  // Calculate current balance and balance after payment
  const paymentSummary = useMemo(() => {
    const currentBalance = loan?.remainingBalance || 
                          (loan?.totalAmount && loan?.amountPaid ? 
                           loan.totalAmount - loan.amountPaid : 0);
    
    const balanceAfterPayment = Math.max(0, currentBalance - amountValue);
    
    return { currentBalance, balanceAfterPayment };
  }, [loan, amountValue]);
  
  // If payment was successful, show success message and navigation options
  if (paymentSuccess) {
    return (
      <div className="payment-form">
        <div className="alert alert-success mb-4">
          <h4 className="alert-heading">Payment Successful!</h4>
          <p>You have successfully made a payment of {formatCurrency(paymentSuccess.amount)} on {new Date(paymentSuccess.date).toLocaleDateString()}.</p>
        </div>
        
        <div className="d-flex gap-2 justify-content-end">
          <button 
            className="btn btn-secondary" 
            onClick={() => dispatch(clearPaymentStatus())}
          >
            Make Another Payment
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/loans')}
          >
            View All Loans
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="payment-form">
      <h2 className="mb-4">Make a Payment</h2>
      
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="form-label fw-bold">Payment Amount</label>
          <div className="btn-group w-100 mb-3">
            <button 
              type="button" 
              className={`btn ${paymentType === 'minimum' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setPaymentType('minimum')}
            >
              Minimum Payment
            </button>
            <button 
              type="button" 
              className={`btn ${paymentType === 'full' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setPaymentType('full')}
            >
              Pay in Full
            </button>
            <button 
              type="button" 
              className={`btn ${paymentType === 'custom' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setPaymentType('custom')}
            >
              Custom Amount
            </button>
          </div>
          
          <div className="input-group mb-3">
            <span className="input-group-text">$</span>
            <input
              type="number"
              className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
              placeholder="Enter amount"
              {...register('amount', { 
                required: 'Amount is required',
                min: {
                  value: 5,
                  message: 'Minimum payment amount is $5'
                },
                max: {
                  value: loan?.remainingBalance || 
                         (loan?.totalAmount && loan?.amountPaid ? 
                          loan.totalAmount - loan.amountPaid : 
                          Number.MAX_SAFE_INTEGER),
                  message: `Maximum payment amount is ${formatCurrency(
                    loan?.remainingBalance || 
                    (loan?.totalAmount && loan?.amountPaid ? 
                     loan.totalAmount - loan.amountPaid : 0)
                  )}`
                },
                validate: {
                  notZero: value => value > 0 || 'Payment amount must be greater than zero'
                }
              })}
              value={amountValue}
              onChange={handleAmountChange}
            />
            {errors.amount && (
              <div className="invalid-feedback">
                {errors.amount.message}
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="form-label fw-bold">Payment Method</label>
          <div className="mb-3">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                id="methodCard"
                value="card"
                {...register('paymentMethod')}
              />
              <label className="form-check-label" htmlFor="methodCard">
                Credit/Debit Card
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                id="methodBank"
                value="bank"
                {...register('paymentMethod')}
              />
              <label className="form-check-label" htmlFor="methodBank">
                Bank Transfer
              </label>
            </div>
          </div>
          
          {showCardDetails && (
            <div className="card-details">
              <div className="mb-3">
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                  placeholder="XXXX XXXX XXXX XXXX"
                  {...register('cardNumber', { 
                    required: 'Card number is required',
                    pattern: {
                      value: /^[0-9]{16}$/,
                      message: 'Please enter a valid 16-digit card number'
                    }
                  })}
                />
                {errors.cardNumber && (
                  <div className="invalid-feedback">
                    {errors.cardNumber.message}
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <label className="form-label">Cardholder Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.cardName ? 'is-invalid' : ''}`}
                  placeholder="Name on card"
                  {...register('cardName', { required: 'Cardholder name is required' })}
                />
                {errors.cardName && (
                  <div className="invalid-feedback">
                    {errors.cardName.message}
                  </div>
                )}
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="text"
                    className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                    placeholder="MM/YY"
                    {...register('expiryDate', { 
                      required: 'Expiry date is required',
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                        message: 'Please use MM/YY format'
                      }
                    })}
                  />
                  {errors.expiryDate && (
                    <div className="invalid-feedback">
                      {errors.expiryDate.message}
                    </div>
                  )}
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">CVV</label>
                  <input
                    type="text"
                    className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                    placeholder="XXX"
                    {...register('cvv', { 
                      required: 'CVV is required',
                      pattern: {
                        value: /^[0-9]{3,4}$/,
                        message: 'CVV must be 3 or 4 digits'
                      }
                    })}
                  />
                  {errors.cvv && (
                    <div className="invalid-feedback">
                      {errors.cvv.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === 'bank' && (
            <div className="alert alert-info">
              <p className="mb-1">Bank Transfer Information:</p>
              <p className="mb-1">Account Name: Loan Company Inc.</p>
              <p className="mb-1">Account Number: 123456789</p>
              <p className="mb-1">Routing Number: 987654321</p>
              <p className="mb-0">Reference: Loan #{loan.id}</p>
            </div>
          )}
        </div>
        
        <div className="payment-form__summary">
          <h4 className="mb-3">Payment Summary</h4>
          <div className="d-flex justify-content-between mb-2">
            <span>Current Balance:</span>
            <span className="fw-bold">{formatCurrency(paymentSummary.currentBalance)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Payment Amount:</span>
            <span className="fw-bold text-success">{formatCurrency(amountValue)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Balance After Payment:</span>
            <span className="fw-bold">{formatCurrency(paymentSummary.balanceAfterPayment)}</span>
          </div>
        </div>
        
        <div className="d-flex justify-content-end mt-4">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </span>
            ) : 'Make Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;