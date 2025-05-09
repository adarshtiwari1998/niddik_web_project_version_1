/**
 * Projects data and functionality for Adarsh Tripathi's Portfolio
 * Author: Adarsh Tripathi
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize projects functionality
    initProjects();
});

// Project data
const projects = [
    {
        title: "Niddik Job Pottal",
        description: "Full Stack job Recruiting website with complete service showcase.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        url: "https://niddik.com/",
        category: "corporate",
        technologies: ["Full Stack", "Backend Developet", "Web Developement", "UI/UX Design"]
    },
    {
        title: "DoubleR Bags",
        description: "E-commerce website for a premium bag brand.",
        image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        url: "https://doublerbags.com/",
        category: "ecommerce",
        technologies: ["Shopify", "E-commerce", "Web Design"]
    },
    {
        title: "Shop Rangoli",
        description: "E-commerce platform for traditional Indian products.",
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        url: "https://shoprangoli.in/",
        category: "ecommerce",
        technologies: ["Shopify", "E-commerce", "Custom Theme"]
    },
    {
        title: "UBON",
        description: "E-commerce website for electronic accessories brand.",
        image: "https://images.unsplash.com/photo-1551376347-075b0121a65b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        url: "https://ubon.in/",
        category: "ecommerce",
        technologies: ["E-commerce", "Custom CMS", "UI/UX"]
    },
    {
        title: "Vingajoy",
        description: "Corporate website for consumer electronics brand.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        url: "https://vingajoy.com/",
        category: "corporate",
        technologies: ["Corporate", "CMS", "Frontend"]
    },
    {
        title: "Rock Music",
        description: "Music platform focused on rock genre content.",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        url: "https://www.rockmusic.life/",
        category: "other",
        technologies: ["Entertainment", "Full Stack", "MERN"]
    },
    {
        title: "Shirt Theory",
        description: "Fashion e-commerce store for premium shirts.",
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        url: "https://shirttheory.co.in/",
        category: "ecommerce",
        technologies: ["E-commerce", "Shopify", "Design"]
    },
    {
        title: "White Dahlia",
        description: "Beauty and skincare e-commerce platform.",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        url: "https://whitedahlia.co.in/",
        category: "ecommerce",
        technologies: ["E-commerce", "Shopify", "Web Design"]
    },
    {
        title: "Furry Buddy",
        description: "Pet care and accessories online store.",
        image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        url: "https://www.furrybudy.com/",
        category: "ecommerce",
        technologies: ["Pet Care", "E-commerce", "Web Development"]
    },
    {
        title: "Aimil Pharma",
        description: "Pharmaceutical company corporate website.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        url: "https://www.aimilpharma.life/",
        category: "corporate",
        technologies: ["Healthcare", "Corporate", "CMS"]
    },

    {
        title: "Smart Yums",
        description: "Food delivery service platform.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        url: "https://smartyums.com/",
        category: "other",
        technologies: ["Food Delivery", "UI/UX", "MEAN Stack"]
    },
    {
        title: "Aimil Vets",
        description: "Veterinary pharmaceutical company website.",
        image: "https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        url: "https://www.aimilvets.life/",
        category: "corporate",
        technologies: ["Veterinary", "Healthcare", "Web Development"]
    }
];

/**
 * Initialize projects functionality
 */
function initProjects() {
    const projectGrid = document.querySelector('.project-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('load-more');
    
    let currentFilter = 'all';
    let visibleProjects = 6;
    
    // Generate initial projects
    renderProjects();
    
    // Filter button click handler
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update filter and reset visible count
            currentFilter = this.getAttribute('data-filter');
            visibleProjects = 6;
            
            // Re-render projects
            renderProjects();
            
            // Check if we need to show load more button
            checkLoadMoreButton();
        });
    });
    
    // Load more button click handler
    loadMoreBtn.addEventListener('click', function() {
        visibleProjects += 3;
        renderProjects();
        checkLoadMoreButton();
    });
    
    /**
     * Render projects based on current filter and visible count
     */
    function renderProjects() {
        // Clear project grid
        projectGrid.innerHTML = '';
        
        // Filter projects
        const filteredProjects = currentFilter === 'all' 
            ? projects 
            : projects.filter(project => project.category === currentFilter);
        
        // Limit to visible count
        const projectsToShow = filteredProjects.slice(0, visibleProjects);
        
        // Create project cards
        projectsToShow.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card fade-in';
            
            const techTags = project.technologies.map(tech => 
                `<span class="project-tag">${tech}</span>`
            ).join('');
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-overlay">
                        <h3>${project.title}</h3>
                    </div>
                </div>
                <div class="project-content">
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${techTags}
                    </div>
                    <a href="${project.url}" class="project-link" target="_blank" rel="noopener noreferrer">
                        View Project <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
            
            projectGrid.appendChild(projectCard);
        });
        
        // Trigger animation for newly added elements
        setTimeout(() => {
            document.querySelectorAll('.project-card.fade-in').forEach(card => {
                card.classList.add('active');
            });
        }, 100);
    }
    
    /**
     * Check if load more button should be visible
     */
    function checkLoadMoreButton() {
        const filteredProjects = currentFilter === 'all' 
            ? projects 
            : projects.filter(project => project.category === currentFilter);
        
        if (filteredProjects.length <= visibleProjects) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
    }
    
    // Initial check for load more button
    checkLoadMoreButton();
}