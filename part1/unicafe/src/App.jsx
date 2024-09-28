import { useState } from 'react'
const Statistics = ({good,neutral,bad,count}) => {
  if (count===0){
    return <p>No feedback given</p>;
  }
  return(
  <table>
    <tbody>
    <StatisticLine
    text="good"
    value={good}/>
    <StatisticLine
    text="neutral"
    value={neutral}/>
    <StatisticLine
    text="bad"
    value={bad}/>
    <StatisticLine
    text="all"
    value={good+bad+neutral}/>
    <StatisticLine
    text="average"
    value={(good-bad)/(good+bad+neutral)}/>  
    <StatisticLine
    text="percentage"
    value={`${(good/(good+bad+neutral))*100}%`}/>  
    </tbody>  
  </table>);
}
const Button=({onClick,text})=>{
  return(
    <button onClick={onClick}>
    {text}
    </button>
  )
}
const StatisticLine =({value, text})=>{
  return(
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [count,setCount] = useState(0)
  const handleGoodFeefback=()=>{
    setGood(good+1)
    setCount(count+1)
  }
  const handleNeutralFeefback=()=>{
    setNeutral(neutral+1)
    setCount(count+1)
  }
  const handleBadFeefback=()=>{
    setBad(bad+1)
    setCount(count+1)
  }
  return (
    <div>
      <div>
        <h1>Give feedback</h1>
        <div display="flex">
          <Button 
          onClick={handleGoodFeefback}
          text="good"
          />
          <Button 
          onClick={handleNeutralFeefback}
          text="neutral"
          />
          <Button 
          onClick={handleBadFeefback}
          text="bad"
          />
        </div>
      </div>
      <h1>Statistics</h1>
      <Statistics
      good={good}
      neutral={neutral}
      bad={bad}
      count={count}/>
    </div>
  )
}

export default App