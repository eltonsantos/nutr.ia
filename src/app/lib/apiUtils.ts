import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ApiHealthStatus {
  isHealthy: boolean;
  error?: string;
  responseTime?: number;
}

export async function checkGoogleAIHealth(): Promise<ApiHealthStatus> {
  const startTime = Date.now();
  
  try {
    const genIA = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY!);
    const model = genIA.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const response = await model.generateContent("Test");
    const responseTime = Date.now() - startTime;
    
    if (response.response && response.response.candidates) {
      return {
        isHealthy: true,
        responseTime
      };
    } else {
      return {
        isHealthy: false,
        error: "No candidates returned",
        responseTime
      };
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    return {
      isHealthy: false,
      error: error?.message || "Unknown error",
      responseTime
    };
  }
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: Error = new Error('No attempts made');
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain types of errors
      if (error?.status === 400 || error?.status === 401 || error?.status === 403) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(backoffMultiplier, attempt - 1);
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
} 