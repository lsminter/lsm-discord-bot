import axios from "axios";
import fetch from "node-fetch";
import dotenv from 'dotenv'
dotenv.config()

const groupId = process.env.WISE_OLD_MAN_GROUP_ID
export const recentCompetition = await fetch(`https://wiseoldman.net/api/groups/${groupId}/competitions`)
  .then(response => response.json())
  .then(data => data[0])

export const recentCompetitionId = recentCompetition.id

export const competitionData = await fetch(`https://wiseoldman.net/api/competitions/${recentCompetitionId}`)
      .then(response => response.json())
      .then(data => data.participants)

const endingDate = new Date(recentCompetition.endsAt)
export const endDateUNIX = Math.floor(endingDate.getTime() / 1000)    

const today = new Date()
export const todayUNIX = Math.floor(today.getTime() / 1000)

export default function updateAllUserStats () {
  return axios.post(`https://wiseoldman.net/api/competitions/${recentCompetitionId}/update-all`, {
  "verificationCode": `${process.env.VERIFICATION_CODE}`
})}
