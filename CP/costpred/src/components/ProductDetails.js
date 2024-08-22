import { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductDetails.css';
import Button from 'react-bootstrap/Button';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import CircularProgress from '@mui/material/CircularProgress';


function ProductDetails() {
    const [desc, setDesc] = useState('');
    const [results, setResults] = useState([]);
    const [activeRadio, setActiveRadio] = useState('Amazon')
    const [image, setImage] = useState(null);
    const [detected_object, setDetected_object] = useState('')
    const [minPrice, setMinprice] = useState()
    const [maxPrice, setMaxprice] = useState()
    const [avgPrice, setAvgprice] = useState()
    const [bestPrice, setBestprice] = useState(null)
    const [age, setAge] = useState(100); 
    const [loading, setLoading] = useState(false);
    const [submitted,setSubmitted] = useState(false)

 
    useEffect(() => {
        console.log("bestPrice:", bestPrice);
    }, [bestPrice]);
    function isDigit(char) {
        return /^\d$/.test(char);
    }

    function filterPrice(price) {
        let i = 0;
        let n = price.length;

        // Find the start index of the price
        while (i < n && !isDigit(price[i])) {
            i++;
        }

        if (i === n) {
            return price; // No digits found, return the original string
        }

        let j = i;
        while (j < n && (isDigit(price[j]) || price[j] === ',')) {
            j++;
        }

        // Adjust the slice to extract the price portion
        let extractedPrice = price.slice(i, j);

        // Remove commas from the extracted price
        let cleanPrice = extractedPrice.replace(/,/g, '');

        return cleanPrice;
    }


    async function sendUrls(codeResults){

        const urlArray = []
        // console.log(codeResults)
        codeResults.map((result,index)=>{
            // console.log(result.image)
            urlArray.push(result.image)
        })
        // console.log(urlArray)
        try{
            const response = await axios.post(`http://localhost:3001/apis/similarity/sendUrls`, {
                data: urlArray,
            });
            const indexes = response.data.data
            const top_five = indexes.slice(0, 5)
            let avg = 0
            let mini = Number.POSITIVE_INFINITY
            let maxi = 0
        
            indexes.map((element, index) => {
                let price = codeResults[element[1]].price
                price = filterPrice(price)
                // console.log(price)
                let price_int = parseFloat(price)
                mini = Math.min(mini, price_int)
                maxi = Math.max(maxi, price_int)
                avg = avg + price_int
            })
            avg = (avg / indexes.length).toFixed(2);
            let best = parseFloat(filterPrice(codeResults[top_five[0][1]].price)).toFixed(2)
            
            maxi = (maxi*age/100)
            mini = (mini * age / 100)
            avg = (avg * age / 100)
            best = (best * age / 100)
            maxi = parseFloat(maxi).toFixed(2)
            mini = parseFloat(mini).toFixed(2)
            avg = parseFloat(avg).toFixed(2)


            setMaxprice(maxi)
            setMinprice(mini)
            setAvgprice(avg)
            console.log(best)
            setBestprice(best)

            console.log(top_five)
            
            console.log("minimum" + mini)
            console.log("maximum" + maxi)
            console.log("avg" + avg)
            console.log("best" + bestPrice)


            // console.log(response.data)
        }catch(err){
            console.log(err)
        }
    }


    async function getHtmlCode(searchQuery) {
        try {
            const response = await axios.post(`http://localhost:3001/apis/scrape/getResults${activeRadio}`, {
                data: searchQuery,
            });
            return response.data;

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }


    }
    async function getHtmlCode2(searchQuery) {
        try {
            const response = await axios.post(`http://localhost:3001/apis/scrape/getResultsFlipkart`, {
                data: searchQuery,
            });
            return response.data;

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }


    }

    const processHtmlCode = async (object) => {
        try {
            const code = await getHtmlCode(object);
            // const code2 = await getHtmlCode2(object);

            // code.results.push(code2.results)

            // console.log(typeof(code.results));
            sendUrls(code.results)

            const newResults = [];
            code.results.forEach((result) => {
                newResults.push(result);
            });

            setResults(newResults);

        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitted(true)
            setLoading(true); // Set loading to true during submission
            const formData = new FormData();
            formData.append('file', image);
            const response = await axios.post('http://localhost:3002/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setDetected_object(response.data.result);
            processHtmlCode(response.data.result);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false); // Reset loading to false after submission completes
        }
    };

    const handleAgeChange = (e) => {
        setAge(e.target.value); // Update the selected age value
    };
    const handleChange = (e) => {
        setDesc(e.target.value);
    };

    const handleRadioChange = (e)=>{
        setActiveRadio(e.target.value)
    }
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };
    const handleCaptureUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

   
    
    return (
            <div className='product'>
            
            <div className="product-main">
                {(!bestPrice && submitted)? (
                    <div className="loading-sign">
                        <CircularProgress />
                    </div>
                ) : null}

                <div className="large-box">
                    <div className='product-age'>
                        <select value={age} onChange={handleAgeChange}>
                            <option value="">Select Age</option>
                            <option value="70">Less than 1 month</option>
                            <option value="50">Less than 6 months</option>
                            <option value="30">Less than 12 months</option>
                            <option value="10">More than 12 months</option>

                        </select>

                    </div>
                <div className="product-card">
                        {image && (
                            <img
                                className="uploaded-img"
                                src={URL.createObjectURL(image)}
                                alt="Uploaded Image"
                            />
                        )}
                    <form onSubmit={handleSubmit}>
                    <div className="label-container">
                        <UploadOutlinedIcon className="upload-icon" />
                        <label htmlFor="input-file">Drop Image here to upload</label>
                        
                    </div>
                        
                        <input
                            className="input-file"
                            id="input-file"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        {/* <button type="submit">Submit</button> */}
                        <Button variant="success" type="submit">Submit</Button>{' '}
                    </form>
                </div>
                    
                </div>
                <div className='price-details'>
                    {detected_object && <h2 className='detected-object'>Detected Object: {detected_object}</h2>}
                    <div className="price-info">
                        <div className='price-analysis'>
                            <p><strong>Max:</strong> <br></br>Rs {maxPrice}</p>
                            <p><strong>Min:</strong> <br></br>Rs {minPrice}</p>
                            <p><strong>Avg:</strong> <br></br>Rs {avgPrice}</p>
                            
                        </div>
                        <div className='predicted-price'>
                            <p><strong>PREDICTED PRICE: <br></br>Rs {bestPrice}</strong></p>
                        </div>
                       
                     
                    </div>
                </div>
                <br></br>
                
            </div>

    <div className="display-results">
    {results.map((result, index) => (
        <div key={index} className="display-result-element">
            <img src={result.image} alt={result.title} />
            <p>
                <b>Title:</b> {result.title}
            </p>
            <p>
                <b>Price:</b> {result.price}
            </p>
        </div>
    ))}
    </div>
    </div>
        );
    }

export default ProductDetails;
