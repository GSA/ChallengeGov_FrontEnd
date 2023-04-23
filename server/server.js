import path from 'path';
import fs from 'fs';
import express from 'express';
// import React from 'react';
import React, { useEffect, useState, useContext } from 'react'
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
//import RenderRouter from '../index'; 
import axios from 'axios'

const app = express();
const port = 3001;




//const [currentChallenge, setCurrentChallenge] = useState()
//const [loadingState, setLoadingState] = useState(true)


// what is the difference btw path join and resolve
//app.use(express.static(path.join(__dirname, 'build')));

app.use(express.static(path.resolve(__dirname, "..", "build")));
//const indexPath  = path.resolve(__dirname, '.', 'build', 'index.html');

app.get('*', (req, res) => {
  const context = {};
  // const html = renderToString(
  //   <StaticRouter location={req.url} context={context}>
  //     <RenderRouter />
  //   </StaticRouter>
  // );

  const ChangeMeta = (currentChallenge) => {
  
    console.log("current title: " + currentChallenge.title)
    fs.readFile(path.resolve("./build/index.html"), 'utf8', (err, htmlData) => {
      if (err) {
          console.error('Error during file reading', err);
          //return res.status(404).end()
      }
      // get post info
      //const postId = req.query.id;
      //const post = getPostById(postId);
      //if(!post) return res.status(404).send("Post not found");
      // inject meta tags
      htmlData = htmlData.replace(
          "<title>Challenge.Gov</title>",
          `<title>${currentChallenge.title}</title>`
      )
      .replace('__META_OG_TITLE__', currentChallenge.title)
      .replace('__META_OG_DESCRIPTION__', currentChallenge.tagline)
      .replace('__META_DESCRIPTION__', currentChallenge.tagline)
      .replace('__META_OG_IMAGE__', currentChallenge.logo)
   
      //return htmlData;
      return res.send(htmlData);
    });
  }


  const match = matchPath(req.url, { path: '/:chalId', exact: true });
  if (match && match.params && match.params.chalId) {
    // Challenge-ID 
    const chalId = match.params.chalId;
   
    
    let challengeApiPath = `https://challenge-portal-staging.app.cloud.gov` + `/api/challenges/${chalId}`

    axios.get(challengeApiPath)
    .then(response => {
      console.log(chalId + " <-- -------  id") 
      const html_ = ChangeMeta(response.data);
      //return res.send(html_)
      //console.log(response.data);
    })
    .catch(error => {
      // Handle any errors that occurred during the request
      console.error(error);
    });  


    // fs.readFile(path.resolve("./build/index.html"), 'utf8', (err, htmlData) => {
    //   if (err) {
    //       console.error('Error during file reading', err);
    //       return res.status(404).end()
    //   }
    //   // get post info
    //   //const postId = req.query.id;
    //   //const post = getPostById(postId);
    //   //if(!post) return res.status(404).send("Post not found");
      
    //   // inject meta tags
    //   htmlData = htmlData.replace(
    //       "<title>Challenge.Gov</title>",
    //       `<title>${currentChallenge.title}</title>`
    //   )
    //   .replace('__META_OG_TITLE__', currentChallenge.title)
    //   .replace('__META_OG_DESCRIPTION__', currentChallenge.tagline)
    //   .replace('__META_DESCRIPTION__', currentChallenge.tagline)
    //   .replace('__META_OG_IMAGE__', currentChallenge.logo)

    //   return res.send(htmlData);
    // });

  } else {
    
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


