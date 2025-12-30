import PropTypes from 'prop-types';

const PageHeader = ({ icon: Icon, title, description, actions }) => {
  return (
    <div className="page-header">
      <h1>
        {Icon && <Icon />}
        {title}
      </h1>
      {description && <p>{description}</p>}
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
};

PageHeader.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node,
};

export default PageHeader;
