import { db, storage } from '../firebase/config.js';

// Admissions page functionality
document.addEventListener('DOMContentLoaded', function() {
  initAdmissions();
});

export function initAdmissions() {
  // Initialize tab functionality
  initAdmissionsTabs();
  
  // Rest of your admissions functionality...
  initializeApplicationForm();
  initializeFAQ();
}

function initAdmissionsTabs() {
  const tabButtons = document.querySelectorAll('.requirements-tabs .tab-button');
  const tabContents = document.querySelectorAll('.requirements-content .tab-content');
  
  // Only proceed if we have matching buttons and contents
  if (tabButtons.length > 0 && tabContents.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the target tab from data attribute
        const targetTab = this.dataset.tab;
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Find and activate corresponding content
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
          targetContent.classList.add('active');
        } else {
          console.error(`Tab content not found: ${targetTab}`);
        }
      });
    });
    
    // Activate the first tab by default if none are active
    const activeTabs = document.querySelectorAll('.requirements-tabs .tab-button.active');
    if (activeTabs.length === 0 && tabButtons.length > 0) {
      tabButtons[0].classList.add('active');
      const firstTabId = tabButtons[0].dataset.tab;
      const firstContent = document.getElementById(firstTabId);
      if (firstContent) firstContent.classList.add('active');
    }
  }
}

// Application form handling
function initializeApplicationForm() {
  const form = document.getElementById('applicationForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Application submitted successfully! (This is a demo)');
  });
}

// FAQ functionality
function initializeFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      const answer = faqItem.querySelector('.faq-answer');
      const isActive = this.classList.contains('active');
      
      // Close all other FAQ items
      faqQuestions.forEach(q => {
        q.classList.remove('active');
        q.parentElement.querySelector('.faq-answer').classList.remove('active');
      });
      
      // Toggle current item
      if (!isActive) {
        this.classList.add('active');
        answer.classList.add('active');
      }
    });
  });
}