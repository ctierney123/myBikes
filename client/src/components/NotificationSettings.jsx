import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function NotificationSettings() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [digestTime, setDigestTime] = useState("08:00");

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const res = await fetch(`http://localhost:3000/users/${currentUser.uid}/notification-preferences`);
        if (!res.ok) throw new Error("Failed to load preferences");
        const prefs = await res.json();
        setEmailNotifications(prefs.emailNotifications);
        setDailyDigest(prefs.dailyDigest);
        setDigestTime(prefs.digestTime);
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, [currentUser]);

  const handleSavePreferences = async () => {
    try {
      const res = await fetch(`http://localhost:3000/users/${currentUser.uid}/notification-preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailNotifications,
          dailyDigest,
          digestTime
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save preferences");
      alert("Notification preferences saved successfully!");
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      alert("Failed to save preferences. Please try again.");
    }
  };

  if (loading) return <div>Loading preferences...</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Email notifications</h3>
          <p className="text-sm text-gray-500">
            Receive immediate alerts when your favorite stations have no bikes available
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Daily digest email</h3>
          <p className="text-sm text-gray-500">
            Get a summary of your favorite stations' statuses at a specific time
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={dailyDigest}
            onChange={(e) => setDailyDigest(e.target.checked)}
            disabled={!emailNotifications}
          />
          <div className={`w-11 h-6 ${!emailNotifications ? 'bg-gray-100' : 'bg-gray-200'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500`}></div>
        </label>
      </div>

      {dailyDigest && emailNotifications && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Daily digest time (EST)</h3>
            <p className="text-sm text-gray-500">
              Choose when you'd like to receive your daily summary
            </p>
          </div>
          <select
            className="border border-gray-300 rounded-md px-3 py-1"
            value={digestTime}
            onChange={(e) => setDigestTime(e.target.value)}
          >
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i < 10 ? `0${i}` : i;
              return (
                <option key={i} value={`${hour}:00`}>
                  {hour}:00
                </option>
              );
            })}
          </select>
        </div>
      )}

      <button
        onClick={handleSavePreferences}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 self-end"
      >
        Save Preferences
      </button>
    </div>
  );
}
