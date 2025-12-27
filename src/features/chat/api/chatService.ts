export const chatService = {
  sendMessage: async (text: string): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response logic
    const lowerText = text.toLowerCase();
    if (lowerText.includes('hola')) {
      return '¡Hola! ¿En qué puedo ayudarte hoy?';
    } else if (lowerText.includes('hora')) {
      return `Son las ${new Date().toLocaleTimeString()}`;
    } else {
      return `Entendido: "${text}". Soy un asistente en desarrollo.`;
    }
  }
};
