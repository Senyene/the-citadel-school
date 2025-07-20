import { db } from '../firebase/config.js';

export async function loadAnnouncements() {
  try {
    const announcementsContainer = document.getElementById('announcements');
    
    // Get the 5 most recent announcements
    const querySnapshot = await db.collection('announcements')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();
    
    if (querySnapshot.empty) {
      announcementsContainer.innerHTML = '<p>No current announcements</p>';
      return;
    }
    
    let html = '';
    querySnapshot.forEach(doc => {
      const announcement = doc.data();
      html += `
        <div class="announcement-card">
          <h3>${announcement.title}</h3>
          <p>${announcement.content}</p>
          <small>Posted on ${new Date(announcement.createdAt.seconds * 1000).toLocaleDateString()}</small>
        </div>
      `;
    });
    
    announcementsContainer.innerHTML = html;
  } catch (error) {
    console.error('Error loading announcements:', error);
    document.getElementById('announcements').innerHTML = `
      <p class="error">Unable to load announcements at this time.</p>
    `;
  }
}

// Initialize when DOM is loaded
if (document.getElementById('announcements')) {
  document.addEventListener('DOMContentLoaded', loadAnnouncements);
}