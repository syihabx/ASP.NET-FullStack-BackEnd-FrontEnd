// Pastikan DOM telah dimuat sepenuhnya sebelum menjalankan kode
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Impor router
        const contentRouterModule = await import('contentRouter');
        const contentRouter = contentRouterModule.default;
        
        // Get elements for sidebar, main content, menu container, user greeting, and brand text
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const toggleButton = document.getElementById('toggleSidebar');
        const menuContainer = document.querySelector('.menu');
        const userInfo = document.querySelector('.user-info');
        const brandText = document.querySelector('.brand-text');
        const contentLoading = document.getElementById('content-loading');
        
        if (!sidebar || !mainContent || !toggleButton || !menuContainer) {
            console.error('One or more required elements not found in DOM');
            return;
        }

        // Toggle sidebar and adjust main content
        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
            mainContent.classList.toggle('closed');
            userInfo.classList.toggle('d-none'); 
            menuContainer.classList.toggle('d-none'); 
            brandText.classList.toggle('d-none'); 
        });

        // Inisialisasi router
        const router = contentRouter.init();
        const routes = {};

        // Menu data structure
        const storedMenu = localStorage.getItem('mainNavigations');
        let menuData = [];
        if (storedMenu) {
            try {
                menuData = JSON.parse(storedMenu);
                if (!Array.isArray(menuData)) {
                    throw new Error('Menu data is not an array');
                }
            } catch (error) {
                console.error('Error parsing menu data:', error);
                localStorage.removeItem('mainNavigations'); // Hapus data yang rusak
                return;
            }
        } else {
            console.log('Menu data not found in localStorage. Fetching from API...');
            // Coba ambil menu dari API
            try {
                const response = await fetch('/api/Account/GetCurrentUserNavigations');
                if (response.ok) {
                    const data = await response.json();
                    if (data?.content?.data) {
                        menuData = data.content.data;
                        localStorage.setItem('mainNavigations', JSON.stringify(menuData));
                    }
                } else {
                    console.error('Failed to fetch menu data:', response.status);
                }
            } catch (error) {
                console.error('Error fetching menu data:', error);
            }
        }

        // Bersihkan menu container sebelum diisi kembali
        menuContainer.innerHTML = '';

        const selectedMenu = localStorage.getItem('selected-menu');

        // Generate menu items
        menuData?.forEach(parent => {
            // Skip jika parent invalid
            if (!parent || !parent.caption) {
                return;
            }
            
            const parentItem = document.createElement('div');
            parentItem.className = 'menu-item';
            parentItem.innerHTML = `
                <span>${parent.caption}</span>
                <span class="caret">&#9656;</span> <!-- Caret for submenu -->
            `;
            menuContainer.appendChild(parentItem);

            // Create submenu for parent item
            const submenu = document.createElement('div');
            submenu.className = 'submenu';

            let isChildSelected = false; // Track if a child item is selected

            if (Array.isArray(parent?.children)) {
                parent.children.forEach(child => {
                    // Skip jika child invalid
                    if (!child || !child.caption) {
                        return;
                    }
                    
                    const childItem = document.createElement('a');
                    childItem.href = "javascript:void(0)"; // Prevent default navigation
                    childItem.setAttribute('data-url', child?.url);
                    childItem.className = 'menu-item';
                    childItem.innerText = child?.caption;

                    // Tambahkan ke routes
                    if (child?.url && child?.isAuthorized) {
                        const urlParts = child.url.split('/');
                        let controllerName = urlParts[1] || ''; // Ambil bagian pertama dari path (/Controller/Action)
                        
                        // Jika URL kosong atau hanya '/', gunakan 'Dashboards'
                        if (controllerName === '') {
                            controllerName = 'Dashboards';
                        }
                        
                        routes[child.url] = {
                            title: child.caption,
                            contentUrl: child.url,
                            scriptUrl: `/src/Pages/${controllerName}/Index.js`
                        };
                    }

                    // Jika child tidak diizinkan (isAuthorized = false), tambahkan icon gembok
                    if (!child?.isAuthorized) {
                        const lockIcon = document.createElement('span');
                        lockIcon.className = 'lock-icon'; // Berikan class untuk styling icon
                        lockIcon.innerHTML = '🔒'; // Anda bisa menggunakan ikon gembok lain (misal dari FontAwesome)
                        childItem.appendChild(lockIcon); // Tambahkan icon ke elemen childItem
                    }

                    // Check if the current URL matches the menu item URL or matches selected-menu from localStorage
                    if (selectedMenu === child?.name || window.location.pathname === child?.url) {
                        childItem.classList.add('menu-selected');
                        submenu.classList.add('open'); // Automatically open the parent submenu
                        const caret = parentItem.querySelector('.caret');
                        if (caret) {
                            caret.classList.add('rotate'); // Rotate caret when submenu is open
                        }
                        isChildSelected = true; // Mark this parent as containing a selected child
                    }

                    // Add event listener for SPA navigation
                    childItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        
                        // Hapus semua menu-selected
                        document.querySelectorAll('.menu-item').forEach(item => {
                            item.classList.remove('menu-selected');
                        });
                        
                        // Tambahkan menu-selected ke item yang diklik
                        childItem.classList.add('menu-selected');
                        
                        // Simpan menu yang dipilih
                        localStorage.setItem('selected-menu', child?.name);
                        
                        // Navigasi ke halaman
                        if (child?.url && child?.isAuthorized) {
                            router.navigateTo(child.url);
                        }
                    });

                    submenu.appendChild(childItem);
                });
            }

            // Hanya tampilkan submenu jika ada children
            if (submenu.children.length > 0) {
                // Append submenu to parent item
                menuContainer.appendChild(submenu);

                // Toggle submenu display on click, regardless of child selection
                parentItem.addEventListener('click', () => {
                    submenu.classList.toggle('open');
                    const caret = parentItem.querySelector('.caret');
                    if (caret) {
                        caret.classList.toggle('rotate'); // Rotate caret when toggled
                    }
                });
            } else {
                // Jika tidak ada child, hapus parentItem
                parentItem.remove();
            }
        });

        // Registrasi routes
        router.registerRoutes(routes);

        // Navigasi ke halaman awal jika ada
        const currentPath = window.location.pathname;
        if (routes[currentPath]) {
            // Tunda sedikit agar UI siap
            setTimeout(() => {
                router.navigateTo(currentPath, false);
            }, 300);
        }

        // Load user info
        const firstName = localStorage.getItem('firstName')?.replace(/"/g, '');
        const lastName = localStorage.getItem('lastName')?.replace(/"/g, '');

        const usernameElement = document.getElementById('username');
        if (usernameElement) {
            if (firstName && lastName) {
                usernameElement.textContent = `${firstName} ${lastName}`;
            } else {
                usernameElement.textContent = 'UserName'; 
            }
        }

        // Get currently active config
        try {
            const response = await fetch('/api/Config/GetActiveConfig', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const activeConfigElement = document.getElementById('activeConfig');
                const activeCurrencyElement = document.getElementById('activeCurrency');
                
                if (activeConfigElement) {
                    activeConfigElement.textContent = data?.content?.data?.name || 'N/A';
                }
                
                if (activeCurrencyElement) {
                    activeCurrencyElement.textContent = data?.content?.data?.currencyName || 'N/A';
                }
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error during Config API call:', error);
        }
    } catch (error) {
        console.error('Error initializing content:', error);
    }
});
