import { useEffect } from 'react';
import { Settings } from '../components/pengaturan/Settings';
import { useRightPanel } from '../context/right-panel-context';

export const SettingsPage = () => {
  const { clearContent, setContent } = useRightPanel();

  useEffect(() => {
    // Hide right panel on settings page
    clearContent();

    // Restore default panel when leaving settings page
    return () => {
      setContent('payment');
    };
  }, [clearContent, setContent]);

  return (
    <div className="w-full">
      <Settings />
    </div>
  );
};
