const React = require('react');

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return React.createElement('div', { className: 'pagination' },
    React.createElement('button', { 
      className: 'page-btn',
      disabled: currentPage === 1,
      onClick: () => onPageChange(currentPage - 1)
    }, '←'),
    pages.map(page => 
      React.createElement('button', {
        key: page,
        className: `page-btn ${currentPage === page ? 'active' : ''}`,
        onClick: () => onPageChange(page)
      }, page)
    ),
    React.createElement('button', {
      className: 'page-btn',
      disabled: currentPage === totalPages,
      onClick: () => onPageChange(currentPage + 1)
    }, '→')
  );
};

const ReportsListPage = ({ reports, currentPage, totalPages }) => {
  const ITEMS_PER_PAGE = 6;
  const sortedReports = reports.sort((a, b) => new Date(b.ReportDate) - new Date(a.ReportDate));

  return React.createElement('div', { className: 'page-layout' },
    React.createElement('div', { className: 'toolbar' },
      React.createElement('nav', null,
        React.createElement('a', { href: '../../index.html', className: 'nav-item' }, 'Home'),
        React.createElement('a', { href: '../../trip/tripLists/tripsList.html', className: 'nav-item' }, 'Trips'),
        React.createElement('a', { href: '../../event/eventLists/eventsList.html', className: 'nav-item' }, 'Events'),
        React.createElement('a', { href: '../../report/reportLists/reportsList.html', className: 'nav-item' }, 'Reports')
      )
    ),
    React.createElement('div', { className: 'reports-content' },
      React.createElement('div', { className: 'reports-grid' },
        sortedReports
          .slice(0, ITEMS_PER_PAGE)
          .map(report => 
            React.createElement('article', { className: 'report-card', key: report.UniqueReportID },
              React.createElement('div', { className: 'card-image' },
                React.createElement('img', { src: report.MainImagePath, alt: report.ReportName })
              ),
              React.createElement('div', { className: 'card-content' },
                React.createElement('h2', null, report.ReportName),
                React.createElement('p', { className: 'date' }, report.ReportDate),
                React.createElement('p', { className: 'description' }, 
                  report.Description ? `${report.Description.substring(0, 150)}...` : ''
                ),
                React.createElement('a', { 
                  href: `../reports/${report.ReportName.replace(/[^a-zA-Z0-9]/g, '-')}-${report.UniqueReportID}.html`,
                  className: 'continue-reading'
                }, 'Continue Reading')
              )
            )
          )
      ),
      React.createElement(Pagination, {
        currentPage: currentPage,
        totalPages: totalPages,
        onPageChange: () => {}
      })
    )
  );
};

exports.ReportsListPage = ReportsListPage;