/**
 * GA4 UCP Code Reference - Main JavaScript
 * Handles search, filtering, and interactive features
 */

(function() {
  'use strict';

  // State
  let allSections = [];
  let currentCategory = null;

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initCategoryFilter();
    initSectionNavigation();
    initCopyButtons();
    initKeyboardShortcuts();
    
    // Store all sections for filtering
    allSections = Array.from(document.querySelectorAll('.code-section'));
  });

  /**
   * Initialize search functionality
   */
  function initSearch() {
    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('search-clear');
    
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase().trim();
      
      // Show/hide clear button
      if (clearButton) {
        clearButton.style.display = query ? 'block' : 'none';
      }
      
      filterSections(query);
    });

    if (clearButton) {
      clearButton.addEventListener('click', function() {
        searchInput.value = '';
        clearButton.style.display = 'none';
        filterSections('');
        searchInput.focus();
      });
    }
  }

  /**
   * Filter code sections based on search query
   */
  function filterSections(query) {
    const sections = document.querySelectorAll('.code-section');
    const emptyState = document.getElementById('empty-state');
    let visibleCount = 0;

    sections.forEach(function(section) {
      const title = section.querySelector('.code-section__title').textContent.toLowerCase();
      const description = section.querySelector('.code-section__description').textContent.toLowerCase();
      const tags = Array.from(section.querySelectorAll('.code-tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
      const code = section.querySelector('code').textContent.toLowerCase();
      
      const matches = !query || 
        title.includes(query) || 
        description.includes(query) || 
        tags.includes(query) || 
        code.includes(query);

      // Also check category filter
      const categoryMatch = !currentCategory || section.dataset.category === currentCategory;

      if (matches && categoryMatch) {
        section.style.display = 'block';
        visibleCount++;
      } else {
        section.style.display = 'none';
      }
    });

    // Update count
    const countElement = document.getElementById('results-count');
    if (countElement) {
      countElement.textContent = `${visibleCount} ${visibleCount === 1 ? 'example' : 'examples'} found`;
    }

    // Show/hide empty state
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  /**
   * Initialize category filtering
   */
  function initCategoryFilter() {
    const categoryButtons = document.querySelectorAll('[data-category-filter]');
    
    categoryButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        const category = this.dataset.categoryFilter;
        
        // Update active state
        categoryButtons.forEach(btn => btn.classList.remove('nav-button--active'));
        this.classList.add('nav-button--active');
        
        // Update current category
        currentCategory = category === 'all' ? null : category;
        
        // Re-run search filter
        const searchInput = document.getElementById('search-input');
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        filterSections(query);
      });
    });
  }

  /**
   * Initialize section navigation (smooth scroll)
   */
  function initSectionNavigation() {
    const sectionButtons = document.querySelectorAll('[data-section-id]');
    
    sectionButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.dataset.sectionId;
        const section = document.getElementById(sectionId);
        
        if (section) {
          // Update active state
          sectionButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          // Smooth scroll
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /**
   * Initialize copy to clipboard buttons
   */
  function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.code-block__copy');
    
    copyButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        const codeBlock = this.closest('.code-block');
        const code = codeBlock.querySelector('code').textContent;
        
        // Copy to clipboard
        navigator.clipboard.writeText(code).then(function() {
          // Update button state
          const originalHTML = button.innerHTML;
          button.innerHTML = '<span uk-icon="check"></span> Copied';
          button.classList.add('code-block__copy--copied');
          
          // Reset after 2 seconds
          setTimeout(function() {
            button.innerHTML = originalHTML;
            button.classList.remove('code-block__copy--copied');
          }, 2000);
        }).catch(function(err) {
          console.error('Copy failed:', err);
        });
      });
    });
  }

  /**
   * Initialize keyboard shortcuts
   */
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // Ctrl+K or Cmd+K or / to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      } else if (e.key === '/' && !isInputFocused()) {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  }

  /**
   * Check if an input element is focused
   */
  function isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement && (
      activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    );
  }

  /**
   * Mobile menu toggle
   */
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.querySelector('.site-sidebar');
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('is-open');
    });
  }

})();
