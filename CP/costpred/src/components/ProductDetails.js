import {useState} from 'react'

function ProductDetails() {

    const [desc, setDesc] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(desc)
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