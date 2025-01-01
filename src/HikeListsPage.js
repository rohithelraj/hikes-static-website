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

const HikeListsPage = ({ hikes, currentPage, totalPages }) => {
  const ITEMS_PER_PAGE = 6;
  const sortedHikes = hikes.sort((a, b) => new Date(b.EventDate) - new Date(a.EventDate));

  return React.createElement('div', { className: 'page-layout' },
    React.createElement('div', { className: 'toolbar' },
      React.createElement('nav', null,
        React.createElement('a', { href: '../../index.html', className: 'nav-item' }, 'Home'),
        React.createElement('a', { href: '../../trip/tripLists/tripsList.html', className: 'nav-item' }, 'Trips'),
        React.createElement('a', { href: '../../hike/hikeLists/hikesList.html', className: 'nav-item' }, 'Hikes'),
        React.createElement('a', { href: '../../report/reportLists/reportsList.html', className: 'nav-item' }, 'Reports')
      )
    ),
    React.createElement('div', { className: 'trips-content' },
      React.createElement('div', { className: 'trips-grid' },
        sortedHikes
          .slice(0, ITEMS_PER_PAGE)
          .map(hike => 
            React.createElement('article', { className: 'report-card', key: hike.UniqueEventID },
              React.createElement('div', { className: 'card-image' },
                React.createElement('img', { src: hike.MainImagePath, alt: hike.EventName })
              ),
              React.createElement('div', { className: 'card-content' },
                React.createElement('h2', null, hike.EventName),
                React.createElement('p', { className: 'date' }, hike.EventDate),
                React.createElement('p', { className: 'description' }, 
                  hike.Description ? `${hike.Description.substring(0, 150)}...` : ''
                ),
                React.createElement('a', { 
                  href: `../hikes/${hike.EventName.replace(/[^a-zA-Z0-9]/g, '-')}-${hike.UniqueEventID}.html`,
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

exports.HikeListsPage = HikeListsPage;