# image_similarity.py

from PIL import Image
import numpy as np
import cv2
import requests
import math
from math import sqrt
from scipy.spatial.distance import euclidean
from skimage.metrics import structural_similarity as ssim
from sklearn.metrics.pairwise import cosine_similarity
import statistics

# Paste the rest of your functions here...

def fetch_vector_no_url(image):
    im = image
    opencv_image = np.array(im)
    opencv_image = cv2.cvtColor(opencv_image, cv2.COLOR_RGB2BGR)  # Convert RGB to BGR
    im_vector = opencv_image.flatten()
    return im_vector

def fetch_vector(url):
    im = Image.open(requests.get(url, stream=True).raw)
    opencv_image = np.array(im)
    opencv_image = cv2.cvtColor(opencv_image, cv2.COLOR_RGB2BGR)  # Convert RGB to BGR
    im_vector = opencv_image.flatten()
    return im_vector

def cosine_similarity(vector1, vector2):
    vector1 = vector1.astype(float)
    vector2 = vector2.astype(float)
    norm_vector1 = np.linalg.norm(vector1)
    norm_vector2 = np.linalg.norm(vector2)
    if norm_vector1 == 0 or norm_vector2 == 0:
        return 0.0
    vector1 /= norm_vector1
    vector2 /= norm_vector2
    similarity = np.dot(vector1, vector2)
    return similarity

def jaccard_similarity(list1, list2):
    set1 = set(np.nonzero(list1)[0])
    set2 = set(np.nonzero(list2)[0])
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    similarity = intersection / union if union != 0 else 0.0
    return similarity

def resize_or_pad_vector(vector, target_length):
    current_length = len(vector)
    
    if current_length < target_length:
        # Pad with zeros
        vector = np.pad(vector, (0, target_length - current_length), 'constant')
    elif current_length > target_length:
        # Resize by truncating or some other method
        vector = vector[:target_length]
    
    return vector

def similarity_measures_cmp(vec1, vec_array):
    vec_array = [resize_or_pad_vector(vector, len(vec1)) for vector in vec_array]
    cs = np.array([cosine_similarity(vec1,vec2) for vec2 in vec_array])
    js = np.array([jaccard_similarity(vec1, vec2) for vec2 in vec_array])
    similarity = (cs + js) /2
    return similarity