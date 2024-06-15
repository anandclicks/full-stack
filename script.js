try {
      const fetchdata = async()=> {
    const result = await fetch("http://localhost:3000/users")
     const data = await result.json()
     console.log(data)
}
fetchdata()
} catch (error) {
    
}
