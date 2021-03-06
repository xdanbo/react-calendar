import styled from 'styled-components'
import moment from "moment";

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  //grid-template-rows: repeat(6, 1fr);
  grid-gap: 1px;
  background-color: ${props => props.isHeader ? '#1e1f21' : '#404040'};
  ${props => props.isHeader && 'border-bottom: 1px solid #404040'}
`

const CellWrapper = styled.div`
  min-width: 140px;
  min-height: ${props => props.isHeader ? 24 : 80}px;
  background: ${props => props.isWeekend ? '#272829' : '#1e1f21'};
  color: ${props => props.isCurrentMonth ? '#ddd' : '#555759'}; ;
`

const RowInCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
  ${props => props.pr && `padding-right: ${props.pr * 8}px`}
`

const DayWrapper = styled.div`
  height: 33px;
  width: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px;
  cursor: pointer;
`

const CurrentDay = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f00;
`

const ShowDayWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const EventListWrapper = styled.ul`
  margin: unset;
  list-style-position: inside;
  padding-left: 4px;
`

const EventItemWrapper = styled.button`
  position: relative;
  left: -14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 114px;
  border: unset;
  background: unset;
  color: #ddd;
  cursor: pointer;
  margin: 0;
  padding: 0;
  text-align: left;
`

const CalendarGrid = ({startDay, today, totalDays, events, openFormHandler}) => {
  const day = startDay.clone().subtract(1, 'day')
  const daysArray = [...Array(totalDays)].map(() => day.add(1, 'day').clone())
  const isCurrentDay = (day) => moment().isSame(day, 'day')
  const isCurrentMonth = (day) => today.isSame(day, 'month')
  return (
    <>
      <GridWrapper isHeader>
        {[...Array(7)].map((_, i) => (
          <CellWrapper isHeader isCurrentMonth key={i}>
            <RowInCell
              justifyContent={'flex-end'}
              pr={1}
            >
              { moment().day(i + 1).format('ddd')}
            </RowInCell>
          </CellWrapper>
        ) )}
      </GridWrapper>
      <GridWrapper>
        {
          daysArray.map((dayItem) => (
            <CellWrapper
              key={dayItem.unix()}
              isWeekend={(dayItem.day() === 6 || dayItem.day() === 0)}
              isCurrentMonth={isCurrentMonth(dayItem)}
            >
              <RowInCell
                justifyContent={'flex-end'}
              >
                <ShowDayWrapper>
                  <DayWrapper onDoubleClick={() => openFormHandler('Create')}>
                    {
                      !isCurrentDay(dayItem) ? <div>{dayItem.format('D')}</div> : <CurrentDay>{dayItem.format('D')}</CurrentDay>
                    }
                  </DayWrapper>
                </ShowDayWrapper>
                <EventListWrapper>
                  {
                    events
                      .filter(event => event.timestamp >= dayItem.format('X') && event.timestamp <= dayItem.clone().endOf('day').format('X'))
                      .map(event => (
                        <li key={event.id}>
                          <EventItemWrapper onDoubleClick={() => openFormHandler('Update', event)}>
                            {event.title}
                          </EventItemWrapper>
                        </li>
                      ))
                  }
                </EventListWrapper>
              </RowInCell>
            </CellWrapper>
          ))
        }
      </GridWrapper>
    </>
  )
}

export { CalendarGrid }
