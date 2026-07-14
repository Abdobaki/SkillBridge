import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  QrCode, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw,
  AppWindow
} from 'lucide-react';

interface DownloadViewProps {
  showToast?: (message: string, type: 'success' | 'info' | 'favorite') => void;
}

export default function DownloadView({ showToast }: DownloadViewProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const handleDownload = (platformName: string, fileName: string) => {
    if (downloadingId) return; // Prevent double downloads
    
    setDownloadingId(platformName);
    setDownloadProgress(0);
    if (showToast) {
      showToast(`Initializing secure download for ${platformName}...`, 'info');
    }

    // Simulate progress bar loading
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingId(null);
            setDownloadProgress(0);
            
            // Trigger success toast
            if (showToast) {
              showToast(`"${fileName}" downloaded successfully! Check your downloads folder.`, 'success');
            }
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-7xl mx-auto px-5 md:px-12 py-10 min-h-screen">
      
      {/* Header Promo Banner */}
      <section className="mb-12 text-center max-w-3xl mx-auto">
        <span className="bg-secondary/10 text-secondary text-xs font-extrabold uppercase px-3 py-1 rounded-full inline-block mb-3 tracking-wider">
          Learn & Apply Anywhere
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight mb-4">
          Get the SkillBridge Mobile App
        </h1>
        <p className="text-on-surface-variant text-base sm:text-lg font-semibold leading-relaxed">
          Unlock maximum convenience! Study courses offline, receive real-time push job alerts, and chat directly with recruiters right from your mobile phone.
        </p>
      </section>

      {/* Main Dual Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* LEFT COLUMN: Download Packages cards (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Android Download */}
          <div className="bg-white border border-outline-variant/35 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              <div className="space-y-3">
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Android Package
                </span>
                <h3 className="text-xl font-extrabold text-primary">SkillBridge for Android (.apk)</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Optimized for Samsung, Xiaomi, Huawei, Oppo, and Google Pixel devices. Safe installation package directly verified by PlayProtect.
                </p>
                <ul className="text-xs text-outline space-y-1.5 font-semibold pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> Version 2.4.1 (Stable Release)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> Required Android OS 8.0 or higher
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> File size: ~48.2 MB
                  </li>
                </ul>
              </div>

              {/* Button / Progress */}
              <div className="w-full sm:w-auto shrink-0 self-stretch sm:self-center flex flex-col justify-center items-center">
                {downloadingId === 'android' ? (
                  <div className="w-full sm:w-44 bg-surface-container rounded-2xl p-4 text-center">
                    <RefreshCw className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
                    <p className="text-xs font-bold text-primary">{downloadProgress}%</p>
                    <div className="w-full bg-outline-variant/30 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-150" style={{ width: `${downloadProgress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDownload('android', 'skillbridge-v2.4.apk')}
                    className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-extrabold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download APK
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* iOS Download */}
          <div className="bg-white border border-outline-variant/35 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              <div className="space-y-3">
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Apple iOS App
                </span>
                <h3 className="text-xl font-extrabold text-primary">SkillBridge for iPhone (iOS)</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Download the official safe application from the Apple App Store. Available on all modern iOS models.
                </p>
                <ul className="text-xs text-outline space-y-1.5 font-semibold pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> Version 2.4.0 (Latest Store Candidate)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> Requires iOS 15.0 or later
                  </li>
                </ul>
              </div>

              <div className="w-full sm:w-auto shrink-0 self-stretch sm:self-center">
                <button
                  onClick={() => {
                    if (showToast) showToast("Redirecting to App Store...", "info");
                  }}
                  className="w-full sm:w-auto px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <AppWindow className="w-4 h-4" />
                  App Store
                </button>
              </div>
            </div>
          </div>

          {/* Core benefits summary */}
          <div className="bg-surface-container-low border border-outline-variant/30 p-6 rounded-3xl space-y-4">
            <h4 className="text-sm font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-secondary" />
              Secure Enterprise Standards
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed font-semibold">
              All package distributions on SkillBridge undergo strict automation scanning for malware and viruses. SHA-256 integrity checksums are validated before installation. Enjoy a secure, modern mobile application.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: QR Scanner & Feature Highlights (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* QR Scan box */}
          <div className="bg-white border border-outline-variant/35 rounded-3xl p-6 text-center shadow-sm flex flex-col justify-center items-center">
            <div className="p-4 bg-surface-container rounded-2xl mb-4 border border-outline-variant/20 inline-block">
              <QrCode className="w-32 h-32 text-primary" strokeWidth={1.5} />
            </div>
            <h4 className="text-sm font-extrabold text-primary mb-1">Scan to Download Instantly</h4>
            <p className="text-xs text-on-surface-variant max-w-xs font-semibold leading-relaxed">
              Open your smartphone camera over this QR code to securely scan and download the mobile application setup directly.
            </p>
          </div>

          {/* App features checklist */}
          <div className="bg-gradient-to-b from-primary to-primary-variant text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-md">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
              App-Only Features
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white/10 rounded-lg text-secondary shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold">Instant Recruitment Chats</h4>
                  <p className="text-[11px] text-white/80 mt-0.5 leading-relaxed font-semibold">
                    Skip standard email queues. Send rich CVs and communicate directly with hiring authorities.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white/10 rounded-lg text-secondary shrink-0 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold">Offline Syllabus Study</h4>
                  <p className="text-[11px] text-white/80 mt-0.5 leading-relaxed font-semibold">
                    Download full video courses to study during travels or remote locations without consuming active mobile data.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white/10 rounded-lg text-secondary shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold">Dynamic Widgets & Push Alerts</h4>
                  <p className="text-[11px] text-white/80 mt-0.5 leading-relaxed font-semibold">
                    Never miss a job opening. Immediate notification triggers the minute application requirements match your profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
