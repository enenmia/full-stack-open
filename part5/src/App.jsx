import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newBlog, setNewBlog] = useState({title:'',author:'',url:''})
  const [notification, setNotification] = useState({message: null,type:''})

  // Fetch blogs when component mounts
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  // Check if user is stored in localStorage
  // useEffect(() => {
  //   const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
  //   if (loggedUserJSON) {
  //     const user = JSON.parse(loggedUserJSON)
  //     setUser(user)
  //     blogService.setToken(user.token) // Set token for API requests
  //   }
  // }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
  
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
    
      setUser(user);
      blogService.setToken(user.token); // ✅ 确保后续 API 请求带 Token
    }
  }, []);
  
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })
    
  
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(loggedUser))
     
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error('🔴 Wrong credentials:', exception)
      showNotification('Incorrect username or password', 'error')
    }
  }
  
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  const handleNewBlog = async (event) => {
    //prevent default submission
    event.preventDefault()
    try{
      //send blog data to the backend
      const addedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(addedBlog))
      setNewBlog({ title: '', author: '', url: '' })
      showNotification(`A new blog "${newBlog.title}" added!`, 'success')
    } catch (exception) {
      console.error('Error adding blog:', exception)
      showNotification('Error adding blog', 'error')
    }
  }
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: '' }), 3000) // ✅ 3s 后清除通知
  }
  
  // Show login form if user is not logged in
  if (!user) {
    return (
      <div>
        <Notification message={notification.message} type={notification.type} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password
            <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  // Show blogs if user is logged in
  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      <h2>blogs</h2>
      <p>{user.name} logged in<button onClick={handleLogout}>Logout</button></p>
      <form onSubmit={handleNewBlog}>
  <div>
    Title:
    <input 
      type="text"
      value={newBlog.title}
      onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
    />
  </div>
  <div>
    Author:
    <input 
      type="text"
      value={newBlog.author}
      onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
    />
  </div>
  <div>
    Content:
    <input 
      type="text"
      value={newBlog.url}
      onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
    />
  </div>
  <button type="submit">Create</button>
</form>

      <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
    </div>
  )
}

export default App
