const React = require('react');

const Toolbar = () => React.createElement('div', { className: 'toolbar' },
  React.createElement('nav', null,
    React.createElement('a', { href: '/', className: 'nav-item' }, 'Home'),
    React.createElement('a', { href: '/trips', className: 'nav-item' }, 'Trips'),
    React.createElement('a', { href: '/events', className: 'nav-item' }, 'Events'),
    React.createElement('a', { href: '/reports', className: 'nav-item' }, 'Reports')
  )
);

const TripPage = ({ content }) => {
  return React.createElement('div', { className: 'page-layout' },
    React.createElement('script', { 
      dangerouslySetInnerHTML: { 
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            function showImage(index) {
              document.querySelectorAll('.sub-image-item').forEach(item => {
                item.style.display = 'none';
              });
              document.querySelectorAll('.image-dot').forEach(dot => {
                dot.classList.remove('active');
              });
              document.querySelector('.sub-image-item[data-index="' + index + '"]').style.display = 'block';
              document.querySelector('.image-dot[data-index="' + index + '"]').classList.add('active');
            }

            document.querySelectorAll('.image-dot').forEach(dot => {
              dot.addEventListener('click', function() {
                showImage(this.getAttribute('data-index'));
              });
            });
          });
        `
      }
    }),
    React.createElement(Toolbar),
    React.createElement('div', { className: 'main-content' },
      React.createElement('div', { className: 'image-section' },
        React.createElement('img', { 
          src: content.MainImagePath, 
          alt: content.ReportName,
          className: 'main-image'
        })
      ),
      React.createElement('div', { className: 'content-section' },
        React.createElement('h1', { className: 'report-title' }, content.ReportName),
        
        content.GoogleMapURL && React.createElement('div', { className: 'info-item' },
          React.createElement('h3', null, 'Location'),
          React.createElement('a', {
            href: content.GoogleMapURL,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'map-link'
          }, '📍 View on Google Maps')
        ),
        
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
        
        content.SubImages?.length > 0 && React.createElement('div', { className: 'sub-images-container' },
          React.createElement('div', { className: 'sub-images-wrapper' },
            ...content.SubImages.map((img, index) => 
              React.createElement('div', { 
                key: index,
                className: 'sub-image-item',
                'data-index': index,
                style: { display: index === 0 ? 'block' : 'none' }
              },
                React.createElement('div', { className: 'sub-image-card' },
                  React.createElement('img', { src: img.URL, alt: img.Name }),
                  React.createElement('h4', null, img.Name),
                  React.createElement('p', null, img.Description)
                )
              )
            )
          ),
          React.createElement('div', { className: 'pagination-dots' },
            ...content.SubImages.map((_, index) =>
              React.createElement('button', {
                key: index,
                className: `pagination-dot image-dot ${index === 0 ? 'active' : ''}`,
                'data-index': index
              })
            )
          )
        ),
        
        content.GoogleMapURL && React.createElement('div', { className: 'info-item' },
          React.createElement('h3', null, 'Location Map'),
          React.createElement('iframe', {
            src: content.GoogleMapURL,
            width: '100%',
            height: '700',
            frameBorder: '0',
            scrolling: 'no',
            className: 'map-frame'
          })
        ),
        
        React.createElement('div', { className: 'related-links' },
          React.createElement('h3', null, 'Related Links'),
          React.createElement('div', { className: 'links' },
            content.RelatedEventURL && React.createElement('a', { 
              href: content.RelatedEventURL,
              className: 'link-item'
            }, 'View Event'),
            content.RelatedTripURL && React.createElement('a', { 
              href: content.RelatedTripURL,
              className: 'link-item'
            }, 'View Trip')
          )
        )
      )
    )
  );
};

exports.ReportPage = TripPage;