export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function sendChatMessage(message: string, history: ChatMessage[]): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, chatHistory: history }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'فشل الاتصال بالذكاء الاصطناعي');
  }

  const data = await response.json();
  return data.text;
}
