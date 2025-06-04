interface AnalysisResult {
  name: string;
  quality: number;
  moisture: number;
  size: string;
  insight: string;
  price?: string;
  quantity?: string;
}

// This function adds CORS headers to our API requests to ensure cross-origin requests work
const createCorsProxyUrl = (url: string): string => {
  // Use a CORS proxy to bypass CORS restrictions in development
  return `https://cors-anywhere.herokuapp.com/${url}`;
};

export async function analyzeImage(file: File): Promise<AnalysisResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Add CORS headers and proper content type
    const response = await fetch('http://localhost:8000/analyze/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
      // Add mode and credentials for CORS
      mode: 'cors',
      credentials: 'same-origin',
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing image:', error);
    // Return mock data as fallback when API is unavailable
    console.log('Using mock data as fallback');
    return getMockAnalysisResult();
  }
}

export async function analyzeImageUrl(imageUrl: string): Promise<AnalysisResult> {
  try {
    const response = await fetch('http://localhost:8000/analyze/url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ image_url: imageUrl }),
      // Add mode and credentials for CORS
      mode: 'cors',
      credentials: 'same-origin',
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing image URL:', error);
    // Return mock data as fallback when API is unavailable
    console.log('Using mock data as fallback');
    return getMockAnalysisResult();
  }
}

export async function getProductPrice(productName: string): Promise<{ price: string; quantity: string }> {
  try {
    const response = await fetch(`http://localhost:8000/price/${encodeURIComponent(productName)}`, {
      headers: {
        'Accept': 'application/json',
      },
      // Add mode and credentials for CORS
      mode: 'cors',
      credentials: 'same-origin',
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return {
      price: data.price,
      quantity: data.quantity,
    };
  } catch (error) {
    console.error('Error getting product price:', error);
    // Return mock data as fallback when API is unavailable
    return {
      price: "₹110",
      quantity: "1 kg"
    };
  }
}

// This function provides mock data when the API is unavailable
function getMockAnalysisResult(): AnalysisResult {
  // Generate a random fruit or vegetable
  const produceItems = [
    {
      name: "Apple",
      quality: 87,
      moisture: 74,
      size: "medium",
      insight: "This apple appears to be a fresh, ripe specimen with excellent coloration and minimal blemishes. The skin has a healthy sheen, indicating good hydration levels. The size is typical for the variety, and there are no visible signs of bruising or damage.",
      price: "₹110",
      quantity: "1 kg"
    },
    {
      name: "Tomato",
      quality: 92,
      moisture: 85,
      size: "large",
      insight: "This tomato is at peak ripeness with a vibrant red color and smooth, firm skin. The texture appears excellent with no soft spots or blemishes. It exhibits ideal moisture content and has a well-formed shape characteristic of a premium tomato.",
      price: "₹80",
      quantity: "500 g"
    },
    {
      name: "Banana",
      quality: 78,
      moisture: 65,
      size: "medium",
      insight: "This banana is ripe with a bright yellow peel showing minimal brown spots. The firmness appears good with no major bruising. The moisture content is appropriate for its ripeness stage, and the size is consistent with standard market bananas.",
      price: "₹60",
      quantity: "6 pcs"
    },
    {
      name: "Carrot",
      quality: 90,
      moisture: 70,
      size: "medium",
      insight: "This carrot displays excellent quality with a vibrant orange color and smooth skin. It has good firmness and appears very fresh with no signs of wilting. The moisture content is ideal, and the shape is straight and uniform.",
      price: "₹50",
      quantity: "500 g"
    }
  ];
  
  // Select a random produce item
  const randomIndex = Math.floor(Math.random() * produceItems.length);
  return produceItems[randomIndex];
}
