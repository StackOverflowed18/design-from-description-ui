
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface Product {
  id: number;
  name: string;
  price: string;
  store: string;
  confidence: number;
  image: string;
  category: string;
  description?: string;
  rating?: number;
  reviews?: number;
}

export interface SearchImageResponse {
  products: Product[];
  processing_time?: number;
  total_results?: number;
}

// Convert image to the format expected by your ML model
const prepareImageForAPI = (imageData: string) => {
  // Remove data:image/jpeg;base64, prefix if present
  const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
  
  return {
    image: base64Data,
    // Add any additional configuration your ML model needs
    config: {
      max_results: 10,
      confidence_threshold: 0.5
    }
  };
};

export const searchProductsByImage = async (imageData: string): Promise<SearchImageResponse> => {
  try {
    const payload = prepareImageForAPI(imageData);
    
    const response = await fetch(`${API_BASE_URL}/api/search-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching products by image:', error);
    throw error;
  }
};

export const getProductDetails = async (productId: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product details: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};
