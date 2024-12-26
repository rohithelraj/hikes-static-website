const React = require('react');
const Toolbar = () => React.createElement('div', { className: 'toolbar' },
    React.createElement('nav', null,
      React.createElement('a', { href: '/', className: 'nav-item' }, 'Home'),
      React.createElement('a', { href: '/trips', className: 'nav-item' }, 'Trips'),
      React.createElement('a', { href: '/events', className: 'nav-item' }, 'Events'),
      React.createElement('a', { href: '/reports', className: 'nav-item' }, 'Reports')
    )
  );

  const ReportPage = ({ content }) => React.createElement('div', { className: 'page-layout' },
    React.createElement(Toolbar),
    React.createElement('div', { className: 'main-content' },
      React.createElement('div', { className: 'image-section' },
        React.createElement('img', { 
          src: content.MainImagePath, 
          alt: content.ReportName,
          className: 'main-image'
        })
  ),
  // Right side - Content
  React.createElement('div', { className: 'content-section' },
    React.createElement('h1', { className: 'report-title' }, content.ReportName),
    
    React.createElement('div', { className: 'info-item' },
      React.createElement('h3', null, 'Date'),
      React.createElement('p', null, content.ReportDate)
    ),
    
    React.createElement('div', { className: 'info-item' },
      React.createElement('h3', null, 'Description'),
      React.createElement('p', null, content.Description)
    ),
    
    React.createElement('div', { className: 'info-item' },
      React.createElement('h3', null, 'Type'),
      React.createElement('p', null, content.ReportType)
    ),
    
    content.SubImages?.length > 0 && React.createElement('div', { className: 'sub-images-grid' },
        content.SubImages?.map((img, index) => 
            React.createElement('div', { key: index, className: 'sub-image-card' },
              React.createElement('img', { src: img.URL, alt: img.Name }),
              React.createElement('h4', null, img.Name),
              React.createElement('p', null, img.Description)
            )
        )
    ),
    
    React.createElement('div', { className: 'related-links' },
      React.createElement('h3', null, 'Related Links'),
      React.createElement('div', { className: 'links' },
        content.GoogleMapURL && React.createElement('a', { href: content.GoogleMapURL }, 'Google Maps'),
        content.RelatedEventURL && React.createElement('a', { href: content.RelatedEventURL }, 'Event'),
        content.RelatedTripURL && React.createElement('a', { href: content.RelatedTripURL }, 'Trip')
      )
    )
  )
));

exports.ReportPage = ReportPage;