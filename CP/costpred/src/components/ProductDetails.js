import { useState } from 'react';
import axios from 'axios';
import './ProductDetails.css';
import Button from 'react-bootstrap/Button';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';

function ProductDetails() {
    const [desc, setDesc] = useState('');
    const [results, setResults] = useState([]);
    const [activeRadio, setActiveRadio] = useState('Amazon')
    const [image, setImage] = useState(null);
    const [detected_object, setDetected_object] = useState('')
    function isDigit(char) {
        return /^\d$/.test(char);
    }
    function filterPrice(price){

        let i = 0
        let n = price.length
        while(i< n && !isDigit(price[i]))
        {
            i++
        }
        if(i===n){
            return 0
        }
        let j = i
        while(j < n && isDigit(price[j]))
        {
            j++
        }
        price = price.slice(i,j+1)
        return price
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
                console.log(price)
                mini = Math.min(mini, price)
                maxi = Math.max(maxi, price)
                avg = avg + price
            })
            avg = avg / indexes.length
            console.log(top_five)
            console.log(mini)
            console.log(maxi)
            console.log(avg)

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

    const processHtmlCode = async (object) => {
        try {
            const code = await getHtmlCode(object);
            console.log(code.results);
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
       // console.log("arushi");
        // try {
        //     const formData = new FormData();
        //     formData.append('file', image);
        //     const response = await axios.post('http://localhost:3002/upload', formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     });
        //     // console.log(response.data.result)
        //     setDetected_object(response.data.result)
        //     console.log(detected_object)
            processHtmlCode("clock")

        // } catch (error) {
        //     console.error('Error:', error);
        // }
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
    
    return (
        <>
        <div className="product-main">
            <div className="large-box">
            <div className="product-card">
                {image && <img className="uploaded-img" src={URL.createObjectURL(image)} alt="Uploaded Image" />}
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
            {detected_object && <div className='detected-object'>{detected_object}</div>}
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
</>
    );
}

export default ProductDetails;
