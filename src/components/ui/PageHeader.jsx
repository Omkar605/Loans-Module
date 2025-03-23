const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="page-header">
      {title && <h1 className="page-header-title">{title}</h1>}
      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      
      {children && (
        <div className="page-header-actions">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader; 