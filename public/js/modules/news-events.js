import { db } from '../firebase/config.js';

export async function loadNewsAndEvents() {
  try {
    // Load news articles
    const newsSnapshot = await db.collection('news')
      .orderBy('date', 'desc')
      .limit(3)
      .get();
    
    const newsContainer = document.getElementById('newsContainer');
    if (newsSnapshot.empty) {
      newsContainer.innerHTML = '<p>No news articles available at this time.</p>';
    } else {
      let newsHtml = '';
      newsSnapshot.forEach(doc => {
        const news = doc.data();
        newsHtml += `
          <div class="news-card">
            <img src="${news.imageUrl || '../assets/images/news-placeholder.jpg'}" alt="${news.title}">
            <div class="news-content">
              <h3>${news.title}</h3>
              <p class="news-date">${new Date(news.date.seconds * 1000).toLocaleDateString()}</p>
              <p class="news-excerpt">${news.excerpt}</p>
              <a href="#" class="read-more">Read More →</a>
            </div>
          </div>
        `;
      });
      newsContainer.innerHTML = newsHtml;
    }

    // Load upcoming events
    const now = new Date();
    const eventsSnapshot = await db.collection('events')
      .where('date', '>=', now)
      .orderBy('date')
      .limit(4)
      .get();
    
    const eventsContainer = document.getElementById('eventsContainer');
    if (eventsSnapshot.empty) {
      eventsContainer.innerHTML = '<p>No upcoming events scheduled.</p>';
    } else {
      let eventsHtml = '';
      eventsSnapshot.forEach(doc => {
        const event = doc.data();
        eventsHtml += `
          <div class="event-card">
            <div class="event-date">
              <span class="event-day">${new Date(event.date.seconds * 1000).getDate()}</span>
              <span class="event-month">${new Date(event.date.seconds * 1000).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div class="event-details">
              <h3>${event.title}</h3>
              <p><i class="icon">⏰</i> ${new Date(event.date.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p><i class="icon">📍</i> ${event.location}</p>
              <a href="#" class="event-link">More Details →</a>
            </div>
          </div>
        `;
      });
      eventsContainer.innerHTML = eventsHtml;
    }
  } catch (error) {
    console.error('Error loading news and events:', error);
    document.getElementById('newsContainer').innerHTML = '<p>Error loading news.</p>';
    document.getElementById('eventsContainer').innerHTML = '<p>Error loading events.</p>';
  }
}

// Initialize when DOM is loaded
if (document.getElementById('newsContainer')) {
  document.addEventListener('DOMContentLoaded', loadNewsAndEvents);
}