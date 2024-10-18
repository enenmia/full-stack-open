
const Filter=({newQuery,handleNewQuery})=>{
return(
    <div>
    filter shown with: <input value={newQuery} onChange={handleNewQuery}/>
  </div>
  )
}

export default Filter