import path from 'path';
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import RenderRouter from '../index';

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  const context = {};
  const html = renderToString(
    <StaticRouter location={req.url} context={context}>
      <RenderRouter />
    </StaticRouter>
  );

  const match = matchPath(req.url, { path: '/:productId', exact: true });
  if (match && match.params && match.params.productId) {
    // Product route was matched
    const productId = match.params.productId;
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Product ${productId}</title>
        </head>
        <body>
          <div id="root">${html}</div>
          <!-- script src="/bundle.js"></script -->
        </body>
      </html>
    `);
  } else {
    // Not a product route, send regular HTML
    if (context.url) {
      res.redirect(context.url);
    } else {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>My App</title>
          </head>
          <body>
            <div id="root">${html}</div>
            <script src="/bundle.js"></script>
          </body>
        </html>
      `);
    }
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});