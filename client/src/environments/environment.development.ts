export const environment = {
    production: false,
    apiUrl: "https://localhost:5001/api/",
    hubUrl: "https://localhost:5001/hubs/",
    wsEndpoint: "wss://<replace with your own remote signalling server address>:443/ws/",
    RTCPeerConfiguration: {
        iceServers: [
          {
            urls: 'turn:turnserver:3478',
            username: 'user',
            credential: 'password'
          }
        ]
      }
};
