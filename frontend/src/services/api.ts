interface AnalysisResult {
  name: string;
  quality: number;
  moisture: number;
  size: string;
  insight: string;
  price?: string;
  quantity?: string;
}

// const url = import.meta.env.VITE_API_URL;

// Upload image for analysis
export async function analyzeImage(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('shakbhaji.onrender.com/analyze/upload', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Analyze image by URL
export async function analyzeImageUrl(imageUrl: string): Promise<AnalysisResult> {
  const response = await fetch('shakbhaji.onrender.com/analyze/url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ image_url: imageUrl }),
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Get price by product name
export async function getProductPrice(productName: string): Promise<{ price: string; quantity: string }> {
  const response = await fetch(`shakbhaji.onrender.com/price/${encodeURIComponent(productName)}`, {
    headers: {
      'Accept': 'application/json',
    },
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    price: data.price,
    quantity: data.quantity,
  };
}
