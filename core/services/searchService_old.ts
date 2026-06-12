// core/services/searchService.ts
import axios, { AxiosResponse } from 'axios';

export async function searchInternet(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    return 'Maaf Mat, TAVILY_API_KEY tak jumpa dalam `.env`.';
  }

  try {
    console.log(`[Tavily] Tengah Google pasal: "${query}"...`);
    
    const response: AxiosResponse = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'basic', // 'basic' dah cukup laju dan jimat token
      include_answer: true,  // Tavily akan tolong rumuskan terus jawapan ringkas
      max_results: 3
    });

    // Kalau Tavily dah siap buat rumusan (answer), kita ambil yang tu terus
    if (response.data && response.data.answer) {
      return response.data.answer;
    }

    // Kalau tak ada rumusan, kita cantumkan snippets daripada hasil carian
    if (response.data && response.data.results) {
      return response.data.results
        .map((res: any) => `- ${res.title}: ${res.content}`)
        .join('\n');
    }

    return 'Tavily tak jumpa apa-apa info Mat.';
  } catch (error) {
    console.error('Error Tavily Search:', error);
    return 'Gagal nak connect dengan server Tavily, Mat.';
  }
}