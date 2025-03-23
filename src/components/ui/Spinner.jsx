const Spinner = ({ size = 'md', color = 'primary', centered = false }) => {
  // Size classes
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };
  
  // Color classes
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    danger: 'text-danger',
    warning: 'text-warning',
    info: 'text-info',
    light: 'text-light',
    dark: 'text-dark'
  };
  
  // Apply classes
  const spinnerClasses = [
    'spinner-border',
    sizeClasses[size] || '',
    colorClasses[color] || 'text-primary'
  ].filter(Boolean).join(' ');
  
  const containerClasses = centered ? 'd-flex justify-content-center my-3' : '';
  
  return (
    <div className={containerClasses}>
      <div className={spinnerClasses} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner; 