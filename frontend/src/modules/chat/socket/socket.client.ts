import { io, Socket } from 'socket.io-client';
import { getAxiosAccessToken } from '../../../common/api/axios.instance';

let socket: Socket | null = null;

const getSocketBaseUrl = () => {
  const normalize = (url: string) => url.trim().replace(/\/$/, '');

  const socketUrl = import.meta.env.VITE_SOCKET_URL as string | undefined;
  if (socketUrl && socketUrl.trim()) {
    return normalize(socketUrl);
  }

  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (apiUrl && apiUrl.trim()) {
    return normalize(apiUrl);
  }

  return 'http://localhost:3000';
};

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(`${getSocketBaseUrl()}/swaps`, {
      auth: {
        token: getAxiosAccessToken(),
      },
    });
  }

  return socket;
};