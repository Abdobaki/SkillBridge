import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

import { supabase } from './lib/supabase';

if (Capacitor.isNativePlatform()) {
  CapacitorApp.addListener('appUrlOpen', async (event) => {
    if (event.url.includes('#access_token=') || event.url.includes('?code=')) {
      await Browser.close();
      const urlObj = new URL(event.url);
      
      if (urlObj.hash) {
        // Supabase implicit flow
        const hashParams = new URLSearchParams(urlObj.hash.substring(1));
        const access_token = hashParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token');
        
        if (access_token && refresh_token) {
          await supabase.auth.setSession({
            access_token,
            refresh_token
          });
        }
      }
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);