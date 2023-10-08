import { useState } from 'react';
import axios from 'axios';
import './ProductDetails.css'

function ProductDetails() {
    async function getCode(searchQuery) {
        try {
            const response = await axios.post('http://localhost:3001/searchRes/getResults', {
                data: searchQuery,
            });

            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    const [desc, setDesc] = useState('');
    const [results, setResults] = useState([]);

    const processCode = async () => {
        try {
            const code = await getCode(desc); 
            console.log(code.results);

            const newResults = [...results];
            code.results.forEach((result) => {
                newResults.push(result);
            });

            setResults(newResults);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
       
      
       

        processCode();
       
    };

    const handleChange = (e) => {
        setDesc(e.target.value);
    };

    return (
        <div className="product-main">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter Product Description"
                    value={desc}
                    onChange={handleChange}
                />
                <button type="submit">Submit</button>
            </form>
            <div className="display-results">
                {results.map((result, index) => (
                    <div key={index} className='display-result-element'>
                        <img src={result.image} alt={result.title} />
                        <p><b>Title:</b> {result.title}</p>
                        <p><b>Price:</b> {result.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductDetails;
