import Course from "./components/Course"

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  

  return (
    <>
  {courses.map(course=>
  <Section key={course.id} course={course}/>
  
  )}
</>
);
};

const Section=({course})=>{
  const totalExercises=course.parts.reduce((acc,current)=>acc+current.exercises,0)
  return(
  <>
    <Course course={course} />
    <b>total of {totalExercises} exercises</b>
  </>
)
}
export default App;