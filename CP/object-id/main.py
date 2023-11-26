
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import cv2
import numpy as np
import sys
import io
import pickle
from typing import List
import find_similarity
from pydantic import BaseModel

app = FastAPI()

# Load the YOLO model
model = YOLO("yolov8x.pt")
main_image = None
# Dictionary mapping class indices to class names
names =   {0: 'person', 1: 'bicycle', 2: 'car', 3: 'motorcycle', 4: 'airplane', 5: 'bus', 6: 'train', 7: 'truck', 8: 'boat', 9: 'traffic light', 10: 'fire hydrant', 11: 'stop sign', 12: 'parking meter', 13: 'bench', 14: 'bird', 15: 'cat', 16: 'dog', 17: 'horse', 18: 'sheep', 19: 'cow', 20: 'elephant', 21: 'bear', 22: 'zebra', 23: 'giraffe', 24: 'backpack', 25: 'umbrella', 26: 'handbag', 27: 'tie', 28: 'suitcase', 29: 'frisbee', 30: 'skis', 31: 'snowboard', 32: 'sports ball', 33: 'kite', 34: 'baseball bat', 35: 'baseball glove', 36: 'skateboard', 37: 'surfboard', 38: 'tennis racket', 39: 'bottle', 40: 'wine glass', 41: 'cup', 42: 'fork', 43: 'knife', 44: 'spoon', 45: 'bowl', 46: 'banana', 47: 'apple', 48: 'sandwich', 49: 'orange', 50: 'broccoli', 51: 'carrot', 52: 'hot dog', 53: 'pizza', 54: 'donut', 55: 'cake', 56: 'chair', 57: 'couch', 58: 'potted plant', 59: 'bed', 60: 'dining table', 61: 'toilet', 62: 'tv', 63: 'laptop', 64: 'mouse', 65: 'remote', 66: 'keyboard', 67: 'cell phone', 68: 'microwave', 69: 'oven', 70: 'toaster', 71: 'sink', 72: 'refrigerator', 73: 'book', 74: 'clock', 75: 'vase', 76: 'scissors', 77: 'teddy bear', 78: 'hair drier', 79: 'toothbrush'}  # Your class names dictionary here

@app.post("/detect_object")
async def detect_object(file: UploadFile = File(...)):
    global main_image 
    try:
        # Read the uploaded image using OpenCV
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        main_image = image
           # Create a StringIO object to capture the printed output
      
        print("checkpt 1")
        predictions = model.predict(image)
       
        print('check 5')
        ind = int(predictions[0].boxes.cls.to("cpu").numpy()[0])
        print(names[ind])

        # Extract the captured logs as a string
       


        print('check 7')
        
      
        # Returning the detected objects (you can modify the response format as needed)
        return JSONResponse(content={"detected_object": names[ind]})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

class ImageData(BaseModel):
    url_array: List[str]
# Import the loaded function
@app.post("/similarity_finder")
async def similarity_finder(image_data: ImageData):
    try:
        print(main_image)
        indexes = find_similarity.find_similarity(main_image, image_data.url_array)
        
        # Returning the result as JSON
        print(indexes)
        return JSONResponse(content={"indexes": indexes})


    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
