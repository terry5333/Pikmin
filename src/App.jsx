import { useEffect, useState } from 'react';
import liff from '@line/liff';
import MushroomForm from './components/MushroomForm';
import NotificationSettings from './components/NotificationSettings';
import BindNameForm from './components/BindNameForm';

function App() {
  const [liffState, setLiffState] = useState({ init: false, profile: null });
  const queryParams = new URLSearchParams(window.location.search);
  const page = queryParams.get('page') || 'recruit';

  useEffect(() => {
    liff.init({ liffId: import.meta.env.VITE_LIFF_ID }).then(() => {
      if (liff.isLoggedIn()) liff.getProfile().then(profile => setLiffState({ init: true, profile }));
      else liff.login();
    }).catch(console.error);
  }, []);

  if (!liffState.init) return <div className="flex h-screen items-center justify-center font-bold text-gray-500">載入中...</div>;

  return (
    <div className="p-4 md:p-8 max-w-md mx-auto">
      {page === 'recruit' && <MushroomForm profile={liffState.profile} />}
      {page === 'notify' && <NotificationSettings profile={liffState.profile} />}
      {page === 'bind' && <BindNameForm profile={liffState.profile} />}
    </div>
  );
}
export default App;
