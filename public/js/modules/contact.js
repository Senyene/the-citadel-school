import { db } from '../firebase/config.js';

// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
  initializeContactForm();
  initializeMap();
  initializeContactInfo();
});

// Contact form handling
function initializeContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateContactForm()) {
      submitContactForm();
    }
  });

  // Real-time validation
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateContactField(this);
    });
    
    input.addEventListener('input', function() {
      clearContactFieldError(this);
    });
  });
}

// Contact form validation
function validateContactForm() {
  const form = document.getElementById('contactForm');
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach(field => {
    if (!validateContactField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

// Individual contact field validation
function validateContactField(field) {
  const value = field.value.trim();
  
  clearContactFieldError(field);

  if (field.hasAttribute('required') && !value) {
    showContactFieldError(field, `${getContactFieldLabel(field)} is required`);
    return false;
  }

  if (field.type === 'email' && value && !validateEmail(value)) {
    showContactFieldError(field, 'Please enter a valid email address');
    return false;
  }

  field.parentElement.classList.add('success');
  return true;
}





// Contact form error handling
function showContactFieldError(field, message) {
  const formGroup = field.parentElement;
  formGroup.classList.remove('success');
  formGroup.classList.add('error');
  
  let errorElement = formGroup.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    formGroup.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
}

function clearContactFieldError(field) {
  const formGroup = field.parentElement;
  formGroup.classList.remove('error');
  
  const errorElement = formGroup.querySelector('.error-message');
  if (errorElement) {
    errorElement.remove();
  }
}

function getContactFieldLabel(field) {
  const label = field.parentElement.querySelector('label');
  return label ? label.textContent.replace('*', '') : field.name;
}


function submitContactForm() {
  // Contact form submission
  const submitButton = document.querySelector('.submit-button');
  const originalText = submitButton.textContent;
  
  // Show loading state
  submitButton.classList.add('loading');
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="loading-spinner"></span>Sending...';
  
  // Get form data
  const formData = new FormData(document.getElementById('contactForm'));
  const contactData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    timestamp: new Date().toISOString()
  };
  
  // Submit to Firestore
  db.collection("messages").add(contactData)
    .then((docRef) => {
      // Reset button state
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
      submitButton.textContent = originalText;

      // Show success message
      showContactSuccessMessage();

      // Reset form
      form.reset();

      // Remove saved draft
      localStorage.removeItem('contactFormData');
    })
    .catch((error) => {
      console.error("Error submitting to Firestore:", error);
      alert("Something went wrong. Please try again.");
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    });

}

function showContactSuccessMessage(messageId) {
  const form = document.getElementById('contactForm');

  // 🔒 Prevent duplicate messages
  const existing = form.parentElement.querySelector('.success-message');
  if (existing) existing.remove();

  const successMessage = document.createElement('div');
  successMessage.className = 'success-message';
  successMessage.innerHTML = `
    <strong>Message Sent Successfully!</strong><br>
    Thank you for contacting us. We will respond to your inquiry within 24 hours.<br>
    <small>Reference ID: <code>${messageId}</code></small>
  `;

  form.parentElement.insertBefore(successMessage, form);
  successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

  setTimeout(() => successMessage.remove(), 8000);
}


// Map functionality
function initializeMap() {
  const mapContainer = document.querySelector('.map-container');
  if (!mapContainer) return;
  
  // Add click handler for map interaction
  const iframe = mapContainer.querySelector('iframe');
  if (iframe) {
    iframe.addEventListener('load', function() {
      // Map loaded successfully
      console.log('Map loaded');
    });
    
    iframe.addEventListener('error', function() {
      // Fallback if map fails to load
      showMapFallback();
    });
  }
}

function showMapFallback() {
  const mapContainer = document.querySelector('.map-container');
  if (!mapContainer) return;
  
  mapContainer.innerHTML = `
    <div style="background: var(--peach-light); padding: 3rem; text-align: center; border-radius: 10px;">
      <h3 style="color: var(--oxblood); margin-bottom: 1rem;">📍 Our Location</h3>
      <p><strong>The Citadel School</strong></p>
      <p>Okoria, Agudama-Epie<br>Bayelsa State, Nigeria</p>
      <a href="https://maps.google.com/?q=Okoria,+Agudama-Epie,+Bayelsa+State,+Nigeria" 
         target="_blank" 
         style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: var(--oxblood); color: white; text-decoration: none; border-radius: 5px;">
        View on Google Maps
      </a>
    </div>
  `;
}

// Contact info interactions
function initializeContactInfo() {
  const infoItems = document.querySelectorAll('.info-item');
  
  infoItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Add click-to-copy functionality for contact details
  const phoneNumbers = document.querySelectorAll('.info-item p');
  phoneNumbers.forEach(p => {
    if (p.textContent.includes('+234')) {
      p.style.cursor = 'pointer';
      p.title = 'Click to copy phone number';
      
      p.addEventListener('click', function() {
        copyToClipboard(this.textContent.trim());
        showCopyNotification('Phone number copied!');
      });
    }
    
    if (p.textContent.includes('@')) {
      p.style.cursor = 'pointer';
      p.title = 'Click to copy email address';
      
      p.addEventListener('click', function() {
        const email = this.textContent.trim();
        copyToClipboard(email);
        showCopyNotification('Email address copied!');
      });
    }
  });
}

// Utility functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

function showCopyNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--oxblood);
    color: white;
    padding: 1rem;
    border-radius: 5px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 2000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Contact form auto-save
function initializeContactAutoSave() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  const formData = JSON.parse(localStorage.getItem('contactFormData') || '{}');
  
  // Restore saved data
  Object.keys(formData).forEach(key => {
    const field = form.querySelector(`[name="${key}"]`);
    if (field) {
      field.value = formData[key];
    }
  });
  
  // Save data on input
  form.addEventListener('input', function(e) {
    formData[e.target.name] = e.target.value;
    localStorage.setItem('contactFormData', JSON.stringify(formData));
  });
  
  // Clear saved data on successful submission
  form.addEventListener('submit', function() {
    localStorage.removeItem('contactFormData');
  });
}

// Quick contact actions
function initializeQuickActions() {
  // Add quick call buttons
  const phoneNumbers = ['+234 123 456 7890', '+234 987 654 3210'];
  const emailAddresses = ['info@citadelschool.edu.ng', 'admissions@citadelschool.edu.ng'];
  
  // Create quick action buttons
  const quickActions = document.createElement('div');
  quickActions.className = 'quick-actions';
  quickActions.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 100;
  `;
  
  // Call button
  const callButton = document.createElement('button');
  callButton.innerHTML = '📞';
  callButton.title = 'Quick Call';
  callButton.style.cssText = `
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--oxblood);
    color: white;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: transform 0.3s ease;
  `;
  
  callButton.addEventListener('click', function() {
    window.open(`tel:${phoneNumbers[0]}`);
  });
  
  callButton.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
  });
  
  callButton.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
  
  // Email button
  const emailButton = document.createElement('button');
  emailButton.innerHTML = '✉️';
  emailButton.title = 'Quick Email';
  emailButton.style.cssText = callButton.style.cssText;
  
  emailButton.addEventListener('click', function() {
    window.open(`mailto:${emailAddresses[0]}?subject=Inquiry from Website`);
  });
  
  emailButton.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
  });
  
  emailButton.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
  
  quickActions.appendChild(callButton);
  quickActions.appendChild(emailButton);
  document.body.appendChild(quickActions);
  
  // Hide quick actions on mobile if contact form is visible
  function toggleQuickActions() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm && window.innerWidth <= 768) {
      const formRect = contactForm.getBoundingClientRect();
      const isFormVisible = formRect.top < window.innerHeight && formRect.bottom > 0;
      quickActions.style.display = isFormVisible ? 'none' : 'flex';
    }
  }
  
  window.addEventListener('scroll', toggleQuickActions);
  window.addEventListener('resize', toggleQuickActions);
}

// Initialize all contact features
document.addEventListener('DOMContentLoaded', function() {
  initializeContactAutoSave();
  initializeQuickActions();
});

// Export functions for use in other modules
window.ContactModule = {
  initializeContactForm,
  validateContactForm,
  submitContactForm,
  initializeMap
};

// Contact form subject-based message templates
const messageTemplates = {
  admissions: "I would like to inquire about admission requirements and procedures for...",
  academics: "I have questions about the academic programs and curriculum for...",
  feedback: "I would like to provide feedback about...",
  other: "I would like to inquire about..."
};

// Update message placeholder based on subject selection
document.addEventListener('DOMContentLoaded', function() {
  const subjectSelect = document.getElementById('subject');
  const messageTextarea = document.getElementById('message');
  
  if (subjectSelect && messageTextarea) {
    subjectSelect.addEventListener('change', function() {
      const template = messageTemplates[this.value];
      if (template) {
        messageTextarea.placeholder = template;
      }
    });
  }
});