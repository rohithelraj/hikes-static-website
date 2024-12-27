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
  
  // Create directory structure
  const distDir = path.join(__dirname, 'dist');
  const reportListsDir = path.join(distDir, 'report', 'reportLists');
  const reportsDir = path.join(distDir, 'report', 'reports');
  const tripsDir = path.join(distDir, 'trip', 'trips');
  
  [distDir, reportListsDir, reportsDir, tripsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Load reports and trips
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

  // Generate report list pages
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
      path.join(reportListsDir, page === 1 ? 'reportsList.html' : `reportsList${page}.html`),
      generateReportsPage(pageReports, page, totalPages)
    );
  }

  // Generate index.html
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
            <a href="/report/reports/${report.content.UniqueReportID}.html">
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

  // Generate individual report pages
  for (const report of reports) {
    const html = renderToString(React.createElement(ReportPage, { content: report.content }));
    fs.writeFileSync(
      path.join(reportsDir, `${report.content.UniqueReportID}.html`),
      `<!DOCTYPE html>
      <html>
        <head>
          <title>${report.content.ReportName}</title>
          <link rel="stylesheet" href="../../styles.css">
        </head>
        <body>
          <div id="app">${html}</div>
        </body>
      </html>`
    );
  }

  // Generate trip pages
  for (const trip of trips) {
    const html = renderToString(React.createElement(TripPage, { content: trip.content }));
    fs.writeFileSync(
      path.join(tripsDir, `${trip.content.UniqueTripID}.html`),
      `<!DOCTYPE html>
      <html>
        <head>
          <title>${trip.content.TripName}</title>
          <link rel="stylesheet" href="../../styles.css">
        </head>
        <body>
          <div id="app">${html}</div>
        </body>
      </html>`
    );
  }

  // Copy styles and generate index
  fs.copyFileSync(path.join(__dirname, 'styles.css'), path.join(distDir, 'styles.css'));
  fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
}

buildSite();