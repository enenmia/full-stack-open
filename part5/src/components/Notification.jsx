const Notification = ({ message, type }) => {
    if (!message) return null
  
    const notificationStyle = {
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '5px',
      backgroundColor: type === 'success' ? 'lightgreen' : 'lightcoral',
      color: 'white',
      fontWeight: 'bold'
    }
  
    return <div style={notificationStyle}>{message}</div>
  }
  
  export default Notification
  