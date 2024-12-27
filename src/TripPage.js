const React = require('react');

const Toolbar = () => React.createElement('div', { className: 'toolbar' },
  React.createElement('nav', null,
    React.createElement('a', { href: '/', className: 'nav-item' }, 'Home'),
    React.createElement('a', { href: '/trips', className: 'nav-item' }, 'Trips'),
    React.createElement('a', { href: '/events', className: 'nav-item' }, 'Events'),
    React.createElement('a', { href: '/reports', className: 'nav-item' }, 'Reports')
  )
);

const TripPage = ({ content }) => React.createElement('div', { className: 'page-layout' },
  React.createElement(Toolbar),
  React.createElement('div', { className: 'main-content' },
    React.createElement('div', { className: 'image-section' },
      React.createElement('img', { 
        src: content.MainImagePath, 
        alt: content.Description,
        className: 'main-image'
      })
    ),
    React.createElement('div', { className: 'content-section' },
      React.createElement('h1', { className: 'trip-title' }, content.TripName),
      
      React.createElement('div', { className: 'info-item' },
        React.createElement('h3', null, 'Dates'),
        React.createElement('p', null, `${content.TripStartDate} - ${content.TripEndDate}`)
      ),
      
      React.createElement('div', { className: 'info-item' },
        React.createElement('h3', null, 'Description'),
        React.createElement('p', null, content.Description)
      ),
      
      React.createElement('div', { className: 'info-item' },
        React.createElement('h3', null, 'Accommodation'),
        React.createElement('p', null, content.Accommodation)
      ),
      
      React.createElement('div', { className: 'info-item' },
        React.createElement('h3', null, 'Transportation'),
        React.createElement('p', null, content.Transportation)
      ),
      
      React.createElement('div', { className: 'info-item' },
        React.createElement('h3', null, 'Equipment'),
        React.createElement('p', null, content.Equipment)
      ),
      
      React.createElement('div', { className: 'info-item' },
        React.createElement('h3', null, 'Costs'),
        React.createElement('p', null, content.Costs)
      ),
      
      content.SubImages?.length > 0 && React.createElement('div', { className: 'sub-images-grid' },
        content.SubImages.map((img, index) => 
          React.createElement('div', { key: index, className: 'sub-image-card' },
            React.createElement('img', { src: img.URL, alt: img.Name }),
            React.createElement('h4', null, img.Name),
            React.createElement('p', null, img.Description)
          )
        )
      ),
      
      content.RelatedEvents?.length > 0 && React.createElement('div', { className: 'related-events' },
        React.createElement('h3', null, 'Related Events'),
        React.createElement('div', { className: 'events-list' },
          content.RelatedEvents.map((event, index) =>
            React.createElement('div', { key: index, className: 'event-card' },
              React.createElement('h4', null, event.Name),
              React.createElement('p', null, event.Description),
              React.createElement('a', { href: event.URL }, 'View Event')
            )
          )
        )
      ),
      
      React.createElement('div', { className: 'related-links' },
        React.createElement('h3', null, 'Related Links'),
        React.createElement('div', { className: 'links' },
          content.UniqueGoogleMapURL && React.createElement('a', { href: content.UniqueGoogleMapURL }, 'Google Maps'),
          content.UniqueReportURL && React.createElement('a', { href: content.UniqueReportURL }, 'Report')
        )
      )
    )
  )
);

exports.TripPage = TripPage;