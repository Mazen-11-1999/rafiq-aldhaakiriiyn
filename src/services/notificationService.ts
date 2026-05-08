
export class NotificationService {
  static async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported in this browser');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static async sendNotification(title: string, options?: NotificationOptions) {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/logo.png', // Fallback to a placeholder if logo doesn't exist
        badge: '/logo.png',
        ...options
      });
    }
  }

  // Schedule logic for Morning/Evening
  static scheduleReminders() {
    // This is a simplified version for the web environment.
    // In a real app, you'd use a Service Worker or FCM.
    
    const schedule = () => {
      const now = new Date();
      
      // Morning (8:00 AM)
      const morning = new Date();
      morning.setHours(8, 0, 0, 0);
      
      // Evening (6:00 PM)
      const evening = new Date();
      evening.setHours(18, 0, 0, 0);
      
      if (now.getHours() === 8 && now.getMinutes() === 0) {
        this.sendNotification('سند: أذكار الصباح', { body: 'حان وقت أذكار الصباح لتبدأ يومك ببركة.' });
      }
      
      if (now.getHours() === 18 && now.getMinutes() === 0) {
        this.sendNotification('سند: أذكار المساء', { body: 'حان وقت أذكار المساء لتختم يومك بذكر الله.' });
      }
    };

    // Check every minute
    setInterval(schedule, 60000);
  }
}
