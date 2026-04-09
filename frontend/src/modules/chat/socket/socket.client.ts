import { io, Socket } from 'socket.io-client';
import { getAxiosAccessToken } from '../../../common/api/axios.instance';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:3000/swaps', {
      auth: {
        token: getAxiosAccessToken(),
      },
    });
  }

  return socket;
};