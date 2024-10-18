const Header= ({course}) => {
    return <h1>{course.name}</h1>;
  };
  const Content=({ course })=>{
    return (
      <div>
        {course.parts.map(part=>
            <Part key={part.id} part={part.name} exercise={part.exercises} />
        )}
      </div>
    );
  
  };
  const Part=({part,exercise})=>{
    return(
      <p>{part}{exercise}</p>);
  }
  
  
const Course=({course})=>{
return(
    <div>
    <Header course={course}/>
    <Content
    course={course}
     />
  </div>
)
}
export default Course