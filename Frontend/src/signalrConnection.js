import * as signalR from "@microsoft/signalr";

let connection = null;

export const startSignalRConnection = async (userId, token) => {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7085/chathub", {
      accessTokenFactory: () => token,
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  try {
    await connection.start();
    console.log("✅ SignalR connected as user:", userId);
  } catch (err) {
    console.error("❌ SignalR connection failed:", err);
  }

  return connection;
};

export const getConnection = () => connection;
