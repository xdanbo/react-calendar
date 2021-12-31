import moment from "moment";
import {Header} from "../Header";
import {Monitor} from "../Monitor";
import {CalendarGrid} from "../CalendarGrid";
import styled from "styled-components";
import {useEffect, useState} from "react";

const ShadowsWrapper = styled.div`
  border-top: 1px solid #737374;
  border-left: 1px solid #464648;
  border-right: 1px solid #464648;
  border-bottom: 1px solid #464648;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 0 1px #1a1a1a, 0 8px 20px 6px #888;
`

const URL = 'http://localhost:5000'

function App() {
  const totalDays = 42
  const [today, setToday] = useState(moment())
  moment.updateLocale('en', {week: {dow: 1}})
  const startDay = today.clone().startOf('month').startOf('week')

  const prevHandler = () => setToday(prev => prev.clone().subtract(1, 'month'))
  const todayHandler = () => setToday(moment())
  const nextHandler = () => setToday(prev => prev.clone().add(1, 'month'))

  const [events, setEvents] = useState([])

  const startTimestampQuery = startDay.clone().format('X')
  const endTimestampQuery = startDay.clone().add(42, 'day').format('X')

  useEffect(() => {
    fetch(`${URL}/events?timestamp_gte=${startTimestampQuery}&timestamp_lte=${endTimestampQuery}`)
      .then(res => res.json())
      .then(setEvents)
  }, [startTimestampQuery, endTimestampQuery])

  return (
    <ShadowsWrapper>
      <Header/>
      <Monitor today={today} prevHandler={prevHandler} todayHandler={todayHandler} nextHandler={nextHandler} />
      <CalendarGrid startDay={startDay} today={today} totalDays={totalDays} events={events}/>
    </ShadowsWrapper>
  );
}

export default App;
