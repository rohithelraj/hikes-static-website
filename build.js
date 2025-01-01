require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react']
});
const React = require('react');
const { renderToString } = require('react-dom/server');
const fs = require('fs');
const path = require('path');
const { ReportPage } = require('./src/ReportPage');
const { ReportsListPage } = require('./src/ReportsListPage');
const { TripPage } = require('./src/TripPage');
const { TripListPage } = require('./src/TripListPage');
const { HikePage } = require('./src/HikePage');
const { HikeListsPage } = require('./src/HikeListsPage');

function generateReportsPage(reports, currentPage, totalPages) {
  const listingHtml = renderToString(
    React.createElement(ReportsListPage, { 
      reports,
      currentPage,
      totalPages
    })
  );

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reports - Page ${currentPage}</title>
        <link rel="stylesheet" href="../../styles.css">
      </head>
      <body>
        <div id="app">${listingHtml}</div>
      </body>
    </html>`;
}

function generateTripsPage(trips, currentPage, totalPages) {
  const listingHtml = renderToString(
    React.createElement(TripListPage, { 
      trips,
      currentPage,
      totalPages
    })
  );

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trips - Page ${currentPage}</title>
        <link rel="stylesheet" href="../../styles.css">
      </head>
      <body>
        <div id="app">${listingHtml}</div>
      </body>
    </html>`;
}

function generateHikesPage(hikes, currentPage, totalPages) {
  const listingHtml = renderToString(
    React.createElement(HikeListsPage, { 
      hikes,
      currentPage,
      totalPages
    })
  );

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trips - Page ${currentPage}</title>
        <link rel="stylesheet" href="../../styles.css">
      </head>
      <body>
        <div id="app">${listingHtml}</div>
      </body>
    </html>`;
}

async function buildSite() {
  const contentDir = path.join(__dirname, 'content', 'reports');
  const tripsContentDir = path.join(__dirname, 'content', 'trips');
  const hikesContentDir = path.join(__dirname, 'content', 'hikes');
  
  // Create directory structure
  const distDir = path.join(__dirname, 'dist');
  const reportListsDir = path.join(distDir, 'report', 'reportLists');
  const reportsDir = path.join(distDir, 'report', 'reports');
  const tripsDir = path.join(distDir, 'trip', 'trips');
  const tripListsDir = path.join(distDir, 'trip', 'tripLists');
  const hikesDir = path.join(distDir, 'hike', 'hikes');
  const hikeListsDir = path.join(distDir, 'hike', 'hikeLists');
  
  [distDir, reportListsDir, reportsDir, tripsDir, tripListsDir, hikesDir, hikeListsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Load content
  const reports = fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(contentDir, file);
      const content = JSON.parse(fs.readFileSync(filePath));
      return { path: file.replace('.json', ''), content };
    });

  const trips = fs.readdirSync(tripsContentDir)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(tripsContentDir, file);
      const content = JSON.parse(fs.readFileSync(filePath));
      return { path: file.replace('.json', ''), content };
    });

  const hikes = fs.readdirSync(hikesContentDir)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(hikesContentDir, file);
      const content = JSON.parse(fs.readFileSync(filePath));
      return { path: file.replace('.json', ''), content };
    });

  // Generate list pages
  const ITEMS_PER_PAGE = 6;
  
  // Reports list pages
  const reportTotalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  for (let page = 1; page <= reportTotalPages; page++) {
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const pageReports = reports
      .sort((a, b) => new Date(b.content.ReportDate) - new Date(a.content.ReportDate))
      .slice(startIdx, endIdx)
      .map(r => r.content);

    fs.writeFileSync(
      path.join(reportListsDir, page === 1 ? 'reportsList.html' : `reportsList${page}.html`),
      generateReportsPage(pageReports, page, reportTotalPages)
    );
  }

  // Trip list pages
  const tripTotalPages = Math.ceil(trips.length / ITEMS_PER_PAGE);
  for (let page = 1; page <= tripTotalPages; page++) {
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const pageTrips = trips
      .sort((a, b) => new Date(b.content.TripStartDate) - new Date(a.content.TripStartDate))
      .slice(startIdx, endIdx)
      .map(t => t.content);

    fs.writeFileSync(
      path.join(tripListsDir, page === 1 ? 'tripsList.html' : `tripsList${page}.html`),
      generateTripsPage(pageTrips, page, tripTotalPages)
    );
  }

  // Trip list pages
  const hikeTotalPages = Math.ceil(hikes.length / ITEMS_PER_PAGE);
  for (let page = 1; page <= hikeTotalPages; page++) {
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const pageHikes = hikes
      .sort((a, b) => new Date(b.content.EventDate) - new Date(a.content.EventDate))
      .slice(startIdx, endIdx)
      .map(t => t.content);

    fs.writeFileSync(
      path.join(hikeListsDir, page === 1 ? 'hikesList.html' : `hikesList${page}.html`),
      generateHikesPage(pageHikes, page, hikeTotalPages)
    );
  }


  // Find upcoming item for index page
  const currentDate = new Date();
  const formatDate = (dateStr) => new Date(dateStr.split('-').reverse().join('-'));
  
  const futureItems = [
    ...trips.map(t => ({
      type: 'trip',
      displayDate: t.content.TripStartDate,
      date: formatDate(t.content.TripStartDate),
      title: t.content.TripName,
      url: `./trip/trips/${t.content.TripName.replace(/[^a-zA-Z0-9]/g, '-')}-${t.content.UniqueTripID}.html`,
      mainImage: t.content.MainImagePath
    })),
    ...hikes.map(e => ({
      type: 'hike',
      displayDate: e.content.EventDate,
      date: formatDate(e.content.EventDate),
      title: e.content.EventName,
      url: `./hike/hikes/${e.content.EventName.replace(/[^a-zA-Z0-9]/g, '-')}-${e.content.UniqueEventID}.html`,
      mainImage: e.content.MainImagePath
    }))
  ]
  .filter(item => item.date > currentDate)
  .sort((a, b) => a.date - b.date);

  const featuredItem = futureItems[0] || {
    title: "Welcome to Adventure Journal",
    displayDate: "Explore our trips and hikes",
    url: "/trip/tripLists/tripsList.html",
    mainImage: trips[0]?.content.MainImagePath || ""
  };

  // Generate individual pages
  for (const report of reports) {
    const html = renderToString(React.createElement(ReportPage, { content: report.content }));
    fs.writeFileSync(
      path.join(reportsDir, `${report.content.ReportName.replace(/[^a-zA-Z0-9]/g, '-')}-${report.content.UniqueReportID}.html`),
      `<!DOCTYPE html>
       <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${report.content.ReportName}</title>
          <link rel="stylesheet" href="../../styles.css">
        </head>
        <body>
          <div id="app">${html}</div>
        </body>
      </html>`
    );
  }

  for (const trip of trips) {
    const html = renderToString(React.createElement(TripPage, { content: trip.content }));
    fs.writeFileSync(
      path.join(tripsDir, `${trip.content.TripName.replace(/[^a-zA-Z0-9]/g, '-')}-${trip.content.UniqueTripID}.html`),
      `<!DOCTYPE html>
       <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${trip.content.TripName}</title>
          <link rel="stylesheet" href="../../styles.css">
        </head>
        <body>
          <div id="app">${html}</div>
        </body>
      </html>`
    );
  }

  for (const hike of hikes) {
    const html = renderToString(React.createElement(HikePage, { content: hike.content }));
    fs.writeFileSync(
      path.join(hikesDir, `${hike.content.EventName.replace(/[^a-zA-Z0-9]/g, '-')}-${hike.content.UniqueEventID}.html`),
      `<!DOCTYPE html>
       <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${hike.content.EventName}</title>
          <link rel="stylesheet" href="../../styles.css">
        </head>
        <body>
          <div id="app">${html}</div>
        </body>
      </html>`
    );
  }

  // Generate index.html
  const indexHtml = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Adventure Journal</title>
        <link rel="stylesheet" href="./styles.css">
      </head>
      <body>
        <div class="page-layout">
          <div class="toolbar">
            <nav>
              <a href="index.html" class="nav-item">Home</a>
              <a href="./trip/tripLists/tripsList.html" class="nav-item">Trips</a>
              <a href="./hike/hikeLists/hikesList.html" class="nav-item">Hikes</a>
              <a href="./report/reportLists/reportsList.html" class="nav-item">Reports</a>
            </nav>
          </div>
          <div class="landing-content">
            <div class="hero-banner  title-padding">
              <div class="banner-content  title-padding">
                <h1>${featuredItem.title}</h1>
                <p class="date">${featuredItem.displayDate}</p>
                <a href="${featuredItem.url}" class="banner-link">View Details</a>
              </div>
            </div>
            <div class="hero-image  title-padding">
              <img src="${featuredItem.mainImage}" alt="${featuredItem.title}">
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  // Copy styles and generate index
  fs.copyFileSync(path.join(__dirname, 'styles.css'), path.join(distDir, 'styles.css'));
  fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
}

buildSite();