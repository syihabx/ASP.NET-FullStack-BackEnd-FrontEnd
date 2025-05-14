const contentRouter = {
    currentRoute: null,
    contentArea: null,
    loadingArea: null,
    isLoading: false,
    routes: {},
    
    init() {
        this.contentArea = document.getElementById('dynamic-content');
        this.loadingArea = document.getElementById('content-loading');
        window.addEventListener('popstate', this.handlePopState.bind(this));
        return this;
    },
    
    registerRoutes(routes) {
        this.routes = routes;
        return this;
    },
    
    showLoading() {
        this.isLoading = true;
        if (this.loadingArea) {
            this.loadingArea.classList.remove('hidden');
        }
    },
    
    hideLoading() {
        this.isLoading = false;
        if (this.loadingArea) {
            this.loadingArea.classList.add('hidden');
        }
    },
    
    navigateTo(path, pushState = true) {
        if (this.isLoading) return;
        
        this.showLoading();
        
        const route = this.routes[path];
        if (!route) {
            console.error(`Route not found: ${path}`);
            this.hideLoading();
            return;
        }
        
        this.currentRoute = path;
        
        if (pushState) {
            history.pushState({ path }, '', path);
        }

        // Perbarui judul header
        const headerTitle = document.querySelector('.header-title');
        if (headerTitle) {
            headerTitle.textContent = route.title;
        }
        
        // Clean up existing scripts
        this.removeScriptsByUrl(route.scriptUrl);
        
        fetch(route.contentUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                if (this.contentArea) {
                    // Ekstrak konten dari respons HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const content = doc.querySelector('#app');
                    
                    if (content) {
                        // Update konten
                        this.contentArea.innerHTML = '';
                        this.contentArea.appendChild(content);
                        
                        // Jalankan script
                        document.title = `Indotalent - ${route.title}`;
                        this.loadScript(route.scriptUrl)
                            .then(() => {
                                this.hideLoading();
                            })
                            .catch(error => {
                                console.error('Error loading script:', error);
                                this.hideLoading();
                            });
                    } else {
                        console.error('Content area not found in response');
                        this.hideLoading();
                    }
                } else {
                    console.error('Content area not found');
                    this.hideLoading();
                }
            })
            .catch(error => {
                console.error('Error loading content:', error);
                this.hideLoading();
                
                // Show error message in content area
                if (this.contentArea) {
                    this.contentArea.innerHTML = `
                        <div class="alert alert-danger my-5">
                            <h4 class="alert-heading">Error Loading Content</h4>
                            <p>There was an error loading the requested content. Please try again later.</p>
                            <hr>
                            <p class="mb-0">Details: ${error.message}</p>
                        </div>
                    `;
                }
            });
    },
    
    handlePopState(event) {
        if (event.state && event.state.path) {
            this.navigateTo(event.state.path, false);
        }
    },
    
    loadScript(url) {
        return new Promise((resolve, reject) => {
            // Remove any existing scripts with the same URL
            this.removeScriptsByUrl(url);
            
            // Create a new script element with a unique query parameter to avoid caching
            const script = document.createElement('script');
            script.type = 'module';
            script.src = `${url}?_=${new Date().getTime()}`; // Add cache-busting parameter
            script.onload = resolve;
            script.onerror = (err) => {
                console.error('Script load error:', err);
                reject(err);
            };
            document.head.appendChild(script);
        });
    },
    
    removeScriptsByUrl(url) {
        // Remove any existing scripts with the same URL
        const existingScripts = document.querySelectorAll(`script[src="${url}"]`);
        existingScripts.forEach(script => script.remove());
    }
};

export default contentRouter; 