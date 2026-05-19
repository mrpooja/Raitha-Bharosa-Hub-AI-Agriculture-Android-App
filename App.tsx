import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logOut } from './lib/firebase';
import { handleFirestoreError, OperationType } from './lib/firebaseUtils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  LayoutDashboard, 
  ClipboardList, 
  Calendar, 
  History as HistoryIcon,
  LogOut
} from 'lucide-react';

// Components
import Registration from './components/onboarding/Registration';
import Dashboard from './components/dashboard/Dashboard';
import InputCenter from './components/dashboard/InputCenter';
import KrishiCalendar from './components/dashboard/KrishiCalendar';
import History from './components/dashboard/History';
import NotificationToast, { Alert } from './components/dashboard/NotificationToast';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const pushAlert = (alert: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 3)); // Keep last 3
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  useEffect(() => {
    // Test connection on boot as per requirements
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, '_connection_test_', 'init'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration or internet connection.");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const path = `farmers/${u.uid}`;
        try {
          const docRef = doc(db, 'farmers', u.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, path);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleRegister = async (data: any) => {
    if (!user) return;
    const profileData = {
      ...data,
      userId: user.uid,
      createdAt: serverTimestamp()
    };
    const path = `farmers/${user.uid}`;
    try {
      await setDoc(doc(db, 'farmers', user.uid), profileData);
      setProfile(profileData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sprout className="w-12 h-12 text-[#5A5A40]" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-xl border border-[#DEDECB] text-center"
        >
          <div className="bg-[#F5F5F0] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sprout className="w-10 h-10 text-[#5A5A40]" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#141414] mb-2">Raitha-Bharosa Hub</h1>
          <p className="text-[#8E9299] mb-8 font-serif italic">Your Smart Sowing Assistant</p>
          
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-[#5A5A40] text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-medium hover:bg-[#4A4A35] transition-colors shadow-lg active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return <Registration onComplete={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans pb-24">
      {/* Notification Toast */}
      <NotificationToast alerts={alerts} onDismiss={dismissAlert} />

      {/* Header */}
      <header className="bg-white border-b border-[#DEDECB] px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[#F5F5F0] p-2 rounded-lg">
              <Sprout className="w-6 h-6 text-[#5A5A40]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg leading-tight">Raitha-Bharosa</h2>
              <span className="text-[10px] text-[#5A5A40] uppercase tracking-widest font-bold font-mono">Hub</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold">{profile.name}</p>
              <p className="text-[10px] text-[#8E9299] uppercase">{profile.primaryCrop}</p>
            </div>
            <button 
              onClick={logOut}
              className="p-2 border border-[#DEDECB] rounded-xl hover:bg-red-50 text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <Dashboard profile={profile} onAlert={pushAlert} />
            </motion.div>
          )}
          {activeTab === 'input' && (
            <motion.div key="input" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <InputCenter profile={profile} />
            </motion.div>
          )}
          {activeTab === 'calendar' && (
            <motion.div key="cal" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <KrishiCalendar profile={profile} />
            </motion.div>
          )}
          {activeTab === 'history' && (
            <motion.div key="hist" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <History profile={profile} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#DEDECB] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-4 py-2 z-50">
        <div className="max-w-lg mx-auto flex justify-around">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
            { id: 'input', icon: ClipboardList, label: 'Input' },
            { id: 'calendar', icon: Calendar, label: 'Calendar' },
            { id: 'history', icon: HistoryIcon, label: 'History' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                activeTab === tab.id ? 'text-[#5A5A40]' : 'text-[#8E9299]'
              }`}
            >
              <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-tight">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="w-1 h-1 bg-[#5A5A40] rounded-full mt-1"
                />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
