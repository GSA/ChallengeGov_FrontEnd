import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useLocation } from "react-router-dom";

import { ChallengeDetails } from '../components/ChallengeDetails';
import { ApiUrlContext } from '../ApiUrlContext'
import NotFound from '../components/NotFound'

import queryString from 'query-string'
import $ from "jquery"
import { Helmet } from 'react-helmet';

export const DetailsPage = ({challengeId}) => {
  const [currentChallenge, setCurrentChallenge] = useState()
  const [challengePhases, setChallengePhases] = useState([])
  const [loadingState, setLoadingState] = useState(true)

  let query = useLocation().search
  const { print, tab } = queryString.parse(query)

  const { apiUrl } = useContext(ApiUrlContext)

  useEffect(() => {
    setLoadingState(true)
    // TODO: Temporary hiding of layout on chal details until the layout is moved
    // $(".top-banner").hide()
    // $(".help-section").hide()
    // $(".section-divider").hide()
    // $(".footer").hide()
    // $(".usa-hero").hide()
    // $(".video").hide()
    // $(".challenges-header").hide()
    // $(".newsletter").hide()
   console.log(challengeId + " <--id")    

    let challengeApiPath = apiUrl + `/api/challenges/${challengeId}`
    axios
      .get(challengeApiPath)
      .then(res => {
        console.log(res.data)
        setCurrentChallenge(res.data)
        setChallengePhases(res.data.phases)
        setLoadingState(false)
      })
      .catch(e => {
        setLoadingState(false)
        console.log({e})
      })
  }, [])

  const renderContent = () => {
    if (currentChallenge) {
      return   <spam>

        <Helmet>
      <title>{currentChallenge.title} - Challenge.Gov</title>
      <meta name="description" content={currentChallenge.tagline}  />
      <meta property="og:title" content={currentChallenge.title} />
      <meta property="og:description" content={currentChallenge.tagline} />
      <link rel="canonical" data-hr="true" href={currentChallenge.id} />
  </Helmet><ChallengeDetails challenge={currentChallenge} challengePhases={challengePhases} tab={tab} print={print} /> </spam>   
    } else if (!currentChallenge && !loadingState) {
      return <NotFound />
    }
  }

  return (
    <div>
      {renderContent()}
    </div>
  )
}