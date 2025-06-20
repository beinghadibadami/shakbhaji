interface AnalysisResult {
  name: string;
  quality: number;
  moisture: number;
  size: string;
  insight: string;
  price?: string;
  quantity?: string;
}

// ✅ Render backend base URL from env
// const BASE_URL = "shakbhaji.onrender.com";

// ✅ Check fallback only in development
// const isDev = import.meta.env.DEV;

// ------------------------
// 🟢 Analyze Image Upload
// ------------------------
export async function analyzeImage(file: File): Promise<AnalysisResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('shakbhaji.onrender.com/analyze/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing image:', error);
    // return isDev ? getMockAnalysisResult() : throwClientError();
  }
}

// ------------------------
// 🟢 Analyze by Image URL
// ------------------------
export async function analyzeImageUrl(imageUrl: string): Promise<AnalysisResult> {
  try {
    const response = await fetch('shakbhaji.onrender.com/analyze/url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ image_url: imageUrl }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing image URL:', error);
    // return isDev ? getMockAnalysisResult() : throwClientError();
  }
}

// ------------------------
// 🟢 Get Product Price
// ------------------------
export async function getProductPrice(productName: string): Promise<{ price: string; quantity: string }> {
  try {
    const response = await fetch(`shakbhaji.onrender.com/price/${encodeURIComponent(productName)}`, {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return {
      price: data.price,
      quantity: data.quantity,
    };
  } catch (error) {
    console.error('Error getting product price:', error);
  //   return isDev
  //     ? { price: "₹110", quantity: "1 kg" }
  //     : throwClientError();
  // }
}

// ------------------------
// 🟡 Dev Mock Fallback
// ------------------------
// function getMockAnalysisResult(): AnalysisResult {
//   const produceItems = [
//     {
//       name: "Apple",
//       quality: 87,
//       moisture: 74,
//       size: "medium",
//       insight: "This apple appears to be a fresh, ripe specimen with excellent coloration and minimal blemishes.",
//       price: "₹110",
//       quantity: "1 kg"
//     },
//     {
//       name: "Tomato",
//       quality: 92,
//       moisture: 85,
//       size: "large",
//       insight: "This tomato is at peak ripeness with a vibrant red color and smooth, firm skin.",
//       price: "₹80",
//       quantity: "500 g"
//     },
//     {
//       name: "Banana",
//       quality: 78,
//       moisture: 65,
//       size: "medium",
//       insight: "This banana is ripe with a bright yellow peel showing minimal brown spots.",
//       price: "₹60",
//       quantity: "6 pcs"
//     },
//     {
//       name: "Carrot",
//       quality: 90,
//       moisture: 70,
//       size: "medium",
//       insight: "This carrot displays excellent quality with a vibrant orange color and smooth skin.",
//       price: "₹50",
//       quantity: "500 g"
//     }
//   ];
  
//   const randomIndex = Math.floor(Math.random() * produceItems.length);
//   return produceItems[randomIndex];
// }

// // Optional: uniform way to throw clean error to client
// function throwClientError(): never {
//   throw new Error("Service temporarily unavailable. Please try again later.");
}