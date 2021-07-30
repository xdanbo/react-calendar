import styled from "styled-components";

const MonitorWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  background: #1e1f21;
  color: #ddd;
  padding: 16px;
`

const TextWrapper = styled('span')`
  font-size: 32px;
`

const TitleWrapper = styled(TextWrapper)`
  font-weight: 700;
  margin: 0 8px 0 0;
`

const ButtonsWrapper = styled('div')`
  display: flex;
  align-items: center;
`

const ButtonWrapper = styled('button')`
  border: unset;
  outline: unset;
  background: #565759;
  height: 28px;
  margin: 0 2px 0 0;
  border-radius: 4px;
  color: #e6e6e6;
  cursor: pointer;
`

const TodayButton = styled(ButtonWrapper)`
  padding: 0 16px;
  font-weight: 700;
`

const Monitor = ({today, nextHandler, prevHandler, todayHandler}) => {

  return (
    <MonitorWrapper>
      <div>
        <TitleWrapper>{today.format('MMMM')}</TitleWrapper>
        <TextWrapper>{today.format('YYYY')}</TextWrapper>
      </div>
      <ButtonsWrapper>
        <ButtonWrapper onClick={prevHandler}>&lt;</ButtonWrapper>
        <TodayButton onClick={todayHandler}>Today</TodayButton>
        <ButtonWrapper onClick={nextHandler}>&gt;</ButtonWrapper>
      </ButtonsWrapper>
    </MonitorWrapper>
  )
}

export { Monitor }