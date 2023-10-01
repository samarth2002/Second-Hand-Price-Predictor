import {useState} from 'react'
import axios from 'axios'; // Import axios if you haven't already

function ProductDetails() {

    const [desc, setDesc] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.get('/searchRes').then((response)=>{
            console.log(response.data)
        }).catch((err)=>{
            console.log(err)
        })

    }

    const handleChange = (e) =>{
        setDesc(e.target.value)
        console.log(desc)
    } 


  return (
    <div className='product-main' onSubmit={handleSubmit}>
        <form>
            <input type="text" placeholder='Enter Product Description' value = {desc} onChange = {handleChange}/>
            <button type='submit'>submit</button>
        </form>
    </div>
  )
}

export default ProductDetails