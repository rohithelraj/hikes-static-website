const React = require('react');

const Toolbar = () => React.createElement('div', { className: 'toolbar' },
  React.createElement('nav', null,
    React.createElement('a', { href: '../../index.html', className: 'nav-item' }, 'Home'),
    React.createElement('a', { href: '../../trip/tripLists/tripsList.html', className: 'nav-item' }, 'Trips'),
    React.createElement('a', { href: '../../hike/hikeLists/hikesList.html', className: 'nav-item' }, 'Hikes'),
    React.createElement('a', { href: '../../report/reportLists/reportsList.html', className: 'nav-item' }, 'Reports')
  )
);

const HikePage = ({ content }) => {
  return React.createElement('div', { className: 'page-layout' },
    React.createElement('script', { 
      dangerouslySetInnerHTML: { 
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            function showImage(index) {
              document.querySelectorAll('.sub-image-item').forEach(item => {
                item.style.display = 'none';
              });
              document.querySelectorAll('.image-number').forEach(num => {
                num.classList.remove('active');
              });
              document.querySelector('.sub-image-item[data-index="' + index + '"]').style.display = 'block';
              document.querySelector('.image-number[data-index="' + index + '"]').classList.add('active');
            }

            document.querySelectorAll('.image-number').forEach(num => {
              num.addEventListener('click', function() {
                showImage(this.getAttribute('data-index'));
              });
            });
          });
        `
      }
    }),
    React.createElement(Toolbar),
    React.createElement('div', { className: 'main-content' },
      React.createElement('div', { className: 'image-section title-padding' },
        React.createElement('img', { 
          src: content.MainImagePath, 
          alt: content.EventName,
          className: 'main-image'
        })
      ),
      React.createElement('div', { className: 'content-section' },
        React.createElement('h1', { className: 'event-title title-padding' }, content.EventName),
        
        React.createElement('div', { className: 'info-item title-padding' },
          React.createElement('h3', null, 'Date'),
          React.createElement('p', null, content.EventDate)
        ),
        
        content.UniqueKomootURL && React.createElement('div', { className: 'title-padding' },
          React.createElement('h3', null, 'Komoot'),
          React.createElement('iframe', {
            src: `https://www.komoot.com/de-de/tour/${content.UniqueKomootURL}/embed?share_token=a2KxWmuUWvpGMaMPGOdOxc7OPz02vwsuxgZr0F15DJKKw3QJrc&profile=1&gallery=1`,
            width: '100%',
            height: '700',
            frameBorder: '0',
            scrolling: 'no',
            className: 'komoot-frame'
          })
        ),
        
        React.createElement('div', { className: 'info-item title-padding' },
          React.createElement('h3', null, 'Description'),
          React.createElement('div', { 
            dangerouslySetInnerHTML: { __html: content.Description } 
          })
        ),
        
        React.createElement('div', { className: 'info-item title-padding' },
          React.createElement('h3', null, 'Transportation'),
          React.createElement('div', { 
            dangerouslySetInnerHTML: { __html: content.Transportation } 
          })
        ),
        
        React.createElement('div', { className: 'info-item title-padding' },
          React.createElement('h3', null, 'Equipment'),
          React.createElement('div', { 
            dangerouslySetInnerHTML: { __html: content.Equipment } 
          })
        ),
        
        React.createElement('div', { className: 'info-item title-padding' },
          React.createElement('h3', null, 'Costs'),
          React.createElement('div', { 
            dangerouslySetInnerHTML: { __html: content.Costs } 
          })
        ),
        
        content.SubImages?.length > 0 && React.createElement('div', { className: 'sub-images-container title-padding' },
          React.createElement('div', { className: 'sub-images-wrapper title-padding' },
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
          React.createElement('div', { className: 'pagination-numbers title-padding' },
            ...content.SubImages.map((_, index) =>
              React.createElement('button', {
                key: index,
                className: `number-btn image-number ${index === 0 ? 'active' : ''}`,
                'data-index': index
              }, index + 1)
            )
          )
        ),
        
        React.createElement('div', { className: 'related-links title-padding' },
          React.createElement('h3', null, 'Related Links'),
          React.createElement('div', { className: 'links' },
            content.UniqueReportURL && React.createElement('a', { 
              href: content.UniqueReportURL,
              className: 'link-item'
            }, 'View Report'),
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

exports.HikePage = HikePage;