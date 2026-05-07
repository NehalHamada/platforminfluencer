import Pusher from "pusher-js";
import { env } from "@/config/env";

// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;

export const pusher = new Pusher(env.PUSHER_APP_KEY, {
  cluster: env.PUSHER_APP_CLUSTER,
  forceTLS: true,
  // If the backend uses a custom authorizer for private channels:
  // authEndpoint: `${env.API_BASE_URL}/api/broadcasting/auth`,
  // auth: {
  //   headers: {
  //     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //   },
  // },
});
