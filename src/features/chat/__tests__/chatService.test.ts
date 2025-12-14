import { chatService } from '../api/chatService';

describe('chatService', () => {
  it('responde a hola', async () => {
    const response = await chatService.sendMessage('Hola');
    expect(response).toBe('¡Hola! ¿En qué puedo ayudarte hoy?');
  });

  it('responde con la hora', async () => {
    const response = await chatService.sendMessage('Que hora es');
    expect(response).toContain('Son las');
  });

  it('repite otros mensajes', async () => {
    const response = await chatService.sendMessage('Test message');
    expect(response).toContain('Entendido: "Test message"');
  });
});
