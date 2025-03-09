
interface AnalysisResult {
  name: string;
  quality: number;
  moisture: number;
  size: string;
  insight: string;
  price?: string;
  quantity?: string;
}

export async function analyzeImage(file: File): Promise<AnalysisResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8000/analyze/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

export async function analyzeImageUrl(imageUrl: string): Promise<AnalysisResult> {
  try {
    const response = await fetch('http://localhost:8000/analyze/url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_url: imageUrl }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing image URL:', error);
    throw error;
  }
}

export async function getProductPrice(productName: string): Promise<{ price: string; quantity: string }> {
  try {
    const response = await fetch(`http://localhost:8000/price/${encodeURIComponent(productName)}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return {
      price: data.price,
      quantity: data.quantity,
    };
  } catch (error) {
    console.error('Error getting product price:', error);
    throw error;
  }
}
