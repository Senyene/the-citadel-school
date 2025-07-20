// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const dropdown = document.querySelector('.dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');

  // Mobile menu functionality
  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
    });
  }

  // Dropdown functionality
  if (dropdown && dropdownToggle) {
    // Toggle dropdown on click
    dropdownToggle.addEventListener('click', function(e) {
      e.preventDefault();
      dropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    // Handle keyboard navigation
    dropdownToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
      if (e.key === 'Escape') {
        dropdown.classList.remove('active');
      }
    });

    // Close dropdown on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        dropdown.classList.remove('active');
      }
    });
  }

  // Load announcements if on home page
  const announcementsContainer = document.getElementById('announcements');
  if (announcementsContainer) {
    loadAnnouncements();
  }

  // Set active navigation item
  setActiveNavItem();
});

// Sample announcements data
function loadAnnouncements() {
  const announcements = [
    {
      title: "New Academic Session 2024/2025",
      date: "January 15, 2024",
      content: "Registration for the new academic session is now open. Early bird discounts available until February 28th."
    },
    {
      title: "Inter-House Sports Competition",
      date: "January 10, 2024",
      content: "Annual sports competition scheduled for March 15-17, 2024. All students are encouraged to participate."
    },
    {
      title: "Parent-Teacher Conference",
      date: "January 5, 2024",
      content: "Quarterly parent-teacher meetings scheduled for February 10th. Please confirm attendance with your child's class teacher."
    }
  ];

  const container = document.getElementById('announcements');
  if (container) {
    container.innerHTML = announcements.map(announcement => `
      <div class="announcement-card">
        <h3>${announcement.title}</h3>
        <div class="announcement-date">${announcement.date}</div>
        <p>${announcement.content}</p>
      </div>
    `).join('');
  }
}

// Set active navigation item based on current page
function setActiveNavItem() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.main-nav a:not(.dropdown-toggle)');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
  
  // Remove active class from all links
  navLinks.forEach(link => link.classList.remove('active'));
  if (dropdownToggle) dropdownToggle.classList.remove('active');
  dropdownLinks.forEach(link => link.classList.remove('active'));
  
  // Check if current page is a school page
  const isSchoolPage = currentPath.includes('/schools/');
  
  if (isSchoolPage && dropdownToggle) {
    dropdownToggle.classList.add('active');
    // Also mark the specific school page as active
    dropdownLinks.forEach(link => {
      if (currentPath.includes(link.getAttribute('href'))) {
        link.classList.add('active');
      }
    });
  } else {
    // Set active for regular nav items
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || 
          (currentPath.endsWith('/') && href === currentPath.slice(0, -1)) ||
          (href.endsWith('/') && currentPath === href.slice(0, -1))) {
        link.classList.add('active');
      }
    });
  }
}

// Export functions for use in other modules
window.CitadelSchool = {
  loadAnnouncements,
  setActiveNavItem
};