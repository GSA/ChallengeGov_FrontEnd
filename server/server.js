import path from 'path';
import fs from 'fs';
import express from 'express';
// import React from 'react';
import React, { useEffect, useState, useContext } from 'react'
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
//import RenderRouter from '../index'; 
import axios from 'axios'
import {NotFound} from '../src/components/NotFound';

const app = express();
const port = process.env.PORT || 3000;



// what is the difference btw path join and resolve
//app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, "..", "build")));
//app.use(express.static(path.resolve(__dirname, "..", "build")));

app.get('/:chalId', (req, res) => {
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
          
      }

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
    console.log("check id ------>" + chalId)
      
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
      return res.send("not found!")
      console.log("not found!");
    });  


  } else {
  
    console.log("requested url =  "+ req.url +" |Context URL = " + context.url)  
    if (context.url) {
      res.redirect(req.url);
    } else {

      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Not found</title>
          </head>
          <body>
            <div id="root">Not found!</div>
          </body>
        </html>
      `);
    }
  }

});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


