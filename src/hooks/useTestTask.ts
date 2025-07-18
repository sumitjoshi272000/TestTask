import { useEffect, useRef, useState } from 'react';

interface TickerData {
  price: string;
  time: number;
}

export const useTestTask = (streamSymbol: string) => {
  const [socketData, setSocketData] = useState<TickerData[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {

    const streamUrl = `wss://stream.binance.com:9443/ws/${streamSymbol.toLowerCase()}@trade`;
    socketRef.current = new WebSocket(streamUrl);

    socketRef.current.onmessage = (event) => {
      const socketMessage = JSON.parse(event.data);
      console.log('message', socketMessage);
      setSocketData((previousSocketData) => [
        {
          price: socketMessage.p,
          time: socketMessage.T,
        },
        ...previousSocketData.slice(0, 49),
      ]);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [streamSymbol]);

  return socketData;
};
