const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const viewsPath = path.join('/Users/kikin/Documents/Escuela/Escuela/neupsipro-Web', 'front/views');

ejs.renderFile(
  path.join(viewsPath, 'initialInterview/initialInterview.ejs'),
  {
    id_user: 'test-user-id',
    activePage: 'users',
    tutorialModule: 'financial',
    csrfToken: 'test-token',
    locals: { csrfToken: 'test-token' },
  },
  {},
  (err, html) => {
    if (err) {
      console.error('RENDER ERROR:', err);
      process.exit(1);
    }
    // Fix CSS path to absolute
    html = html.replace('/css/output.css', `file://${  path.join('/Users/kikin/Documents/Escuela/Escuela/neupsipro-Web', 'front/public/css/output.css')}`);
    html = html.replace(/src="\/assets\//g, `src="file://${  path.join('/Users/kikin/Documents/Escuela/Escuela/neupsipro-Web', 'front/public/assets/')}`);
    html = html.replace(/src="\/js\//g, `src="file://${  path.join('/Users/kikin/Documents/Escuela/Escuela/neupsipro-Web', 'front/public/js/')}`);
    fs.writeFileSync('/tmp/rendered_test.html', html);
    console.log('OK, written to /tmp/rendered_test.html');
  }
);
