import image_similarity
import numpy as np
import statistics 

def find_similarity(image, url_arr):
    vec = image_similarity.fetch_vector_no_url(image)
    vec_arr = [image_similarity.fetch_vector(url) for url in url_arr]
    vec_arr = np.array(vec_arr, dtype=np.ndarray)
    s = image_similarity.similarity_measures_cmp(vec, vec_arr)
    avg_s = statistics.mean(s)
    indexes = []
    for i in range(0, len(s)):
        if s[i] >= avg_s:
            indexes.append([s[i], i])
            indexes = sorted(indexes, key=lambda x: x[0], reverse=True)
    return indexes
