/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import '@testing-library/jest-dom';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import ChatWindow from '../components/ChatWindow';

const userData = { name: 'Test User', email: 'test@example.com' };

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: userData } }),
}));

const createMockSocket = () => {
  const events = {};

  const on = jest.fn((event, callback) => {
    events[event] = callback;
  });

  const off = jest.fn();
  const emit = jest.fn();

  const emitEvent = (event, ...args) => {
    if (events[event]) {
      events[event](...args);
    }
  };

  return {
    on, off, emit, emitEvent,
  };
};

describe('ChatWindow Component', () => {
  let mockSocket;

  beforeEach(() => {
    mockSocket = createMockSocket();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    render(<ChatWindow gameCode="testGameCode" socket={mockSocket} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display messages received from the socket', async () => {
    mockSocket.emitEvent('receive_message', [{ user_name: 'John Doe', message: 'Test message from John' }]);

    expect(await screen.findByText('Test message from John')).toBeInTheDocument();
  });

  it('should send a message when the form is submitted', async () => {
    const input = screen.getByPlaceholderText('Message');
    const message = 'Hello World';
    const sendButton = screen.getByLabelText('Send Message');

    fireEvent.change(input, { target: { value: message } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockSocket.emit).toHaveBeenCalledWith('send_message', { message, room: 'testGameCode', user: JSON.stringify(userData) });
    });
  });

  it('should scroll to the last message when a new message is received', async () => {
    mockSocket.emitEvent('receive_message', [{ user_name: 'John Doe', message: 'First message' }, { user_name: 'Jane Doe', message: 'Last message' }]);

    await waitFor(() => {
      expect(screen.getByText('Last message')).toBeVisible();
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });

  it('should display 100 messages received from the socket', async () => {
    const messages = Array.from({ length: 100 }, (_, index) => ({
      user_name: `User ${index + 1}`,
      message: `Message ${index + 1} from user ${index + 1}`,
    }));

    mockSocket.emitEvent('receive_message', messages);

    render(<ChatWindow gameCode="testGameCode" socket={mockSocket} />);

    for (let i = 0; i < messages.length; i += 1) {
      const messageText = `Message ${i + 1} from user ${i + 1}`;
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => expect(screen.getByText(messageText)).toBeInTheDocument());
    }
  });

  it('displays system messages in green', async () => {
    const message = 'John Doe has joined the game.';
    mockSocket.emitEvent('receive_message', [{ system: true, message }]);

    const systemMessage = await screen.findByText(message);
    expect(systemMessage).toBeVisible();
    expect(systemMessage).toHaveClass('text-green-300');
  });
});
