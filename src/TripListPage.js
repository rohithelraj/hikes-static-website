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

const TripListPage = ({ trips, currentPage, totalPages }) => {
  return React.createElement('div', { className: 'page-layout' },
    React.createElement('div', { className: 'toolbar' },
      React.createElement('nav', null,
        React.createElement('a', { href: '../../index.html', className: 'nav-item' }, 'Home'),
        React.createElement('a', { href: '../tripLists/tripsList.html', className: 'nav-item' }, 'Trips'),
        React.createElement('a', { href: '../../hike/hikeLists/hikesList.html', className: 'nav-item' }, 'Hikes'),
        React.createElement('a', { href: '../../report/reportLists/reportsList.html', className: 'nav-item' }, 'Reports')
      )
    ),
    React.createElement('div', { className: 'trips-content' },
      React.createElement('div', { className: 'trips-grid' },
        trips.map(trip => 
          React.createElement('article', { className: 'report-card', key: trip.UniqueTripID },
            React.createElement('div', { className: 'card-image' },
              React.createElement('img', { src: trip.MainImagePath, alt: trip.TripName })
            ),
            React.createElement('div', { className: 'card-content' },
              React.createElement('h2', null, trip.TripName),
              React.createElement('p', { className: 'date' }, 
                `${trip.TripStartDate} - ${trip.TripEndDate}`
              ),
              React.createElement('div', {dangerouslySetInnerHTML: { __html: trip.Description ? `${trip.Description.substring(0, 150)}...` : '' }} 
              ),
              React.createElement('a', { 
                href: `../trips/${trip.TripName.replace(/[^a-zA-Z0-9]/g, '-')}-${trip.UniqueTripID}.html`,
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

exports.TripListPage = TripListPage;