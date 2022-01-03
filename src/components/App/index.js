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

const FormPositionWrapper = styled.div`
  position: absolute;
  z-index: 100;
  background-color: rgba(0, 0, 0, .35);
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FormWrapper = styled(ShadowsWrapper)`
  width: 200px;
  background-color: #1e1f21;
  color: #ddd;
  box-shadow: unset;
`

const EventTitle = styled.input`
  padding: 4px 4px;
  font-size: .85rem;
  width: 100%;
  border: unset;
  background-color: #1e1f21;
  color: #ddd;
  outline: unset;
  border-bottom: 1px solid #464648;
`

const EventBody = styled.input`
  padding: 4px 4px;
  font-size: .85rem;
  width: 100%;
  border: unset;
  background-color: #1e1f21;
  color: #ddd;
  outline: unset;
  border-bottom: 1px solid #464648;
`

const ButtonsWrapper = styled.div`
  padding: 8px 14px;
  display: flex;
  justify-content: flex-end;
`

const URL = 'http://localhost:5000'
const totalDays = 42
const defaultEvent = {
  title: '',
  description: '',
  timestamp: moment().format('X')
}

function App() {
  const [today, setToday] = useState(moment())
  moment.updateLocale('en', {week: {dow: 1}})
  const startDay = today.clone().startOf('month').startOf('week')

  const prevHandler = () => setToday(prev => prev.clone().subtract(1, 'month'))
  const todayHandler = () => setToday(moment())
  const nextHandler = () => setToday(prev => prev.clone().add(1, 'month'))

  const [method, setMethod] = useState(null)
  const [isShowForm, setShowForm] = useState(false)
  const [event, setEvent] = useState(null)

  const [events, setEvents] = useState([])
  const startTimestampQuery = startDay.clone().format('X')
  const endTimestampQuery = startDay.clone().add(42, 'day').format('X')

  useEffect(() => {
    fetch(`${URL}/events?timestamp_gte=${startTimestampQuery}&timestamp_lte=${endTimestampQuery}`)
      .then(res => res.json())
      .then(setEvents)
  }, [startTimestampQuery, endTimestampQuery])

  const openFormHandler = (formHandlerMethod, eventForUpdate) => {
    console.log('method', formHandlerMethod)
    setShowForm(true)
    setEvent(eventForUpdate || defaultEvent)
    setMethod(formHandlerMethod)
  }

  const cancelButtonHandler = () => {
    setShowForm(false)
    setEvent(null)
  }

  const changeEventHandler = (text, field) => {
    setEvent(prevState => ({
      ...prevState,
      [field]: text
    }))
  }

  const eventFetchHandler = () => {
    console.log('event', event)
    const fetchUrl = method === 'Update' ? `${URL}/events/${event.id}` : `${URL}/events`
    const httpMethod = method === 'Update' ? 'PATCH' : 'POST'

    fetch(fetchUrl, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    })
      .then(res => res.json())
      .then((res) => {
        console.log(res)
        if (method === 'Update') {
          setEvents(prevState => prevState.map(el => el.id === res.id ? res : el))
        } else setEvents(prevState => [...prevState, res])
        cancelButtonHandler()
      })
  }

  return (
    <>
      {
        isShowForm ?
          <FormPositionWrapper onClick={cancelButtonHandler}>
            <FormWrapper onClick={e => e.stopPropagation()}>
              <EventTitle
                value={event.title}
                onChange={e => changeEventHandler(e.target.value, 'title')}
              />
              <EventBody
                value={event.description}
                onChange={e => changeEventHandler(e.target.value, 'description')}
              />
              <ButtonsWrapper>
                <button onClick={cancelButtonHandler}>Cancel</button>
                <button onClick={eventFetchHandler}>{method}</button>
              </ButtonsWrapper>
            </FormWrapper>
          </FormPositionWrapper>
        : null
      }
      <ShadowsWrapper>
        <Header/>
        <Monitor today={today} prevHandler={prevHandler} todayHandler={todayHandler} nextHandler={nextHandler} />
        <CalendarGrid startDay={startDay} today={today} totalDays={totalDays} events={events} openFormHandler={openFormHandler}/>
      </ShadowsWrapper>
    </>
  );
}

export default App;
