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

function generateReportsPage(reports, currentPage, totalPages) {
  const listingHtml = renderToString(
    React.createElement(ReportsListPage, { 
      reports,
      currentPage,
      totalPages
    })
  );

  return `<!DOCTYPE html>
    <html>
      <head>
        <title>Reports - Page ${currentPage}</title>
        <link rel="stylesheet" href="./styles.css">
      </head>
      <body>
        <div id="app">${listingHtml}</div>
      </body>
    </html>`;
}

async function buildSite() {
  //Loading contents for Reports
  const contentDir = path.join(__dirname, 'content', 'reports');
  //console.log('Content directory:', path.join(__dirname, 'content', 'reports'));
  //console.log('Files:', fs.readdirSync(path.join(__dirname, 'content', 'reports')));
  const reports = fs.readdirSync(contentDir)
  .filter(file => file.endsWith('.json'))
  .map(file => {
    console.log('Reading file:', file);
    const filePath = path.join(contentDir, file);
    const content = JSON.parse(fs.readFileSync(filePath));
    console.log('Content:', content);
    return { path: file.replace('.json', ''), content };
  });
  //Loading contents for Trips
  const tripsDir = path.join(__dirname, 'content', 'trips');
  const trips = fs.readdirSync(tripsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(tripsDir, file);
      const content = JSON.parse(fs.readFileSync(filePath));
      return { path: file.replace('.json', ''), content };
    });
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

// Create a page for each set of reports
// Inside buildSite function
const ITEMS_PER_PAGE = 6;
const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);

for (let page = 1; page <= totalPages; page++) {
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const pageReports = reports
    .sort((a, b) => new Date(b.content.ReportDate) - new Date(a.content.ReportDate))
    .slice(startIdx, endIdx)
    .map(r => r.content);

  fs.writeFileSync(
    path.join(distDir, page === 1 ? 'reportsList.html' : `reportsList${page}.html`),
    generateReportsPage(pageReports, page, totalPages)
  );
}
  fs.copyFileSync(path.join(__dirname, 'styles.css'), path.join(distDir, 'styles.css'));

  const indexHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hiking Reports</title>
        <link rel="stylesheet" href="./styles.css">
      </head>
      <body>
        <div class="reports-list">
          ${reports.map(report => `
            <a href="/${report.content.UniqueReportID}.html">
              <div class="report-card">
                <img src="${report.content.MainImagePath}" alt="${report.content.ReportName}">
                <h2>${report.content.ReportName}</h2>
                <p>${report.content.ReportDate}</p>
              </div>
            </a>
          `).join('')}
        </div>
      </body>
    </html>
  `;

  fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);

  // Generate reports listing page
  const listingHtml = renderToString(React.createElement(ReportsListPage, { 
    reports: reports.map(r => r.content)
  }));
fs.writeFileSync(
  path.join(distDir, 'reports.html'),
  `<!DOCTYPE html>
  <html>
    <head>
      <title>Reports</title>
      <link rel="stylesheet" href="./styles.css">
    </head>
    <body>
      <div id="app">${listingHtml}</div>
    </body>
  </html>`
);
  for (const report of reports) {
    const html = renderToString(React.createElement(ReportPage, { content: report.content }));
    fs.writeFileSync(
      path.join(distDir, `${report.content.UniqueReportID}.html`),
      `<!DOCTYPE html>
      <html>
        <head>
          <title>${report.content.ReportName}</title>
          <link rel="stylesheet" href="./styles.css">
        </head>
        <body>
          <div id="app">${html}</div>
        </body>
      </html>`
    );
    console.log('Generated HTML:', html);
  }
  for (const trip of trips) {
    const html = renderToString(React.createElement(TripPage, { content: trip.content }));
    fs.writeFileSync(
      path.join(distDir, `${trip.content.UniqueTripID}.html`),
      `<!DOCTYPE html>
      <html>
        <head>
          <title>${trip.content.TripName}</title>
          <link rel="stylesheet" href="./styles.css">
        </head>
        <body>
          <div id="app">${html}</div>
        </body>
      </html>`
    );
  }
}

buildSite();