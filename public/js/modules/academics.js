// Academics page functionality
document.addEventListener('DOMContentLoaded', function() {
  initializeTabs();
  initializeCalendarInteractions();
  initializeAchievementCounters();
  initializeActivityCards();
});

// Tab functionality for curriculum sections
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      this.classList.add('active');
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // Keyboard navigation for tabs
  tabButtons.forEach(button => {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
}

// Calendar interactions
function initializeCalendarInteractions() {
  const termInfos = document.querySelectorAll('.term-info');
  
  termInfos.forEach(termInfo => {
    termInfo.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.transition = 'transform 0.3s ease';
      this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    });
    
    termInfo.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });
  });
}

// Achievement counter animation
function initializeAchievementCounters() {
  const achievementCards = document.querySelectorAll('.achievement-card');
  
  // Intersection Observer for scroll-triggered animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target.querySelector('p[style*="font-size: 2rem"]');
        if (counter && !counter.classList.contains('animated')) {
          animateCounter(counter);
          counter.classList.add('animated');
        }
      }
    });
  }, { threshold: 0.5 });

  achievementCards.forEach(card => {
    observer.observe(card);
  });
}

// Counter animation function
function animateCounter(element) {
  const target = element.textContent.replace('%', '');
  const isPercentage = element.textContent.includes('%');
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    const displayValue = Math.floor(current);
    element.textContent = isPercentage ? `${displayValue}%` : displayValue;
  }, 16);
}

// Activity cards interactions
function initializeActivityCards() {
  const activityCategories = document.querySelectorAll('.activity-category');
  
  activityCategories.forEach(category => {
    // Add hover effects
    category.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.transition = 'all 0.3s ease';
      this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
    });
    
    category.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    });

    // Add click interactions for list items
    const listItems = category.querySelectorAll('li');
    listItems.forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', function() {
        // Toggle selection effect
        if (this.style.backgroundColor === 'rgb(255, 204, 203)') {
          this.style.backgroundColor = '';
          this.style.color = '';
        } else {
          this.style.backgroundColor = 'var(--peach)';
          this.style.color = 'var(--oxblood)';
          this.style.fontWeight = 'bold';
        }
      });
    });
  });
}

// Smooth scrolling for internal links
function initializeSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Calendar data management
const academicCalendar = {
  terms: [
    {
      name: "First Term",
      resumption: "September 11, 2023",
      midterm: "October 23-27, 2023",
      examinations: "November 27 - December 8, 2023",
      vacation: "December 15, 2023"
    },
    {
      name: "Second Term",
      resumption: "January 8, 2024",
      midterm: "February 19-23, 2024",
      examinations: "March 25 - April 5, 2024",
      vacation: "April 12, 2024"
    },
    {
      name: "Third Term",
      resumption: "April 29, 2024",
      midterm: "June 3-7, 2024",
      examinations: "July 8-19, 2024",
      vacation: "July 26, 2024"
    }
  ],
  
  getCurrentTerm: function() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    
    if (currentMonth >= 9 || currentMonth <= 12) {
      return this.terms[0]; // First Term
    } else if (currentMonth >= 1 && currentMonth <= 4) {
      return this.terms[1]; // Second Term
    } else {
      return this.terms[2]; // Third Term
    }
  },
  
  getUpcomingEvents: function() {
    const currentTerm = this.getCurrentTerm();
    const events = [];
    
    // Add logic to determine upcoming events based on current date
    // This is a simplified version
    events.push({
      title: `${currentTerm.name} Mid-term Break`,
      date: currentTerm.midterm
    });
    
    return events;
  }
};

// Achievement data
const achievements = {
  wassce: { value: 95, label: "WASSCE Pass Rate", suffix: "%" },
  university: { value: 88, label: "University Admission", suffix: "%" },
  competitions: { value: 12, label: "State Competition Awards", suffix: "" },
  reading: { value: 100, label: "Reading Program Participation", suffix: "%" }
};

// Export functions for use in other modules
window.AcademicsModule = {
  initializeTabs,
  initializeCalendarInteractions,
  initializeAchievementCounters,
  academicCalendar,
  achievements
};

// Initialize smooth scrolling
document.addEventListener('DOMContentLoaded', initializeSmoothScrolling);

// Add print functionality for academic calendar
function printCalendar() {
  const printWindow = window.open('', '_blank');
  const calendarContent = document.querySelector('.calendar-overview').innerHTML;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Academic Calendar - The Citadel School</title>
        <style>
          body { font-family: Georgia, serif; margin: 20px; }
          h3 { color: #4A0404; }
          ul { list-style: none; padding: 0; }
          li { padding: 8px 0; border-bottom: 1px solid #eee; }
          .term-info { margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <h1>Academic Calendar 2023/2024 - The Citadel School</h1>
        ${calendarContent}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.print();
}

// Add print button functionality if needed
const printButton = document.getElementById('printCalendar');
if (printButton) {
  printButton.addEventListener('click', printCalendar);
}