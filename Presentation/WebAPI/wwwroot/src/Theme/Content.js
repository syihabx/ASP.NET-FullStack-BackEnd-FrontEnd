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

// Add event listener for sidebar toggle
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const toggleSidebar = document.getElementById('toggleSidebar');
    const contentLoading = document.getElementById('content-loading');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const userMenu = document.getElementById('userMenu');
    const username = document.getElementById('username');
    const headerUsername = document.getElementById('headerUsername');
    const activeConfig = document.getElementById('activeConfig');
    const activeCurrency = document.getElementById('activeCurrency');

    // User data from localStorage
    const userName = localStorage.getItem('userName') || 'Guest User';
    if (username) username.textContent = userName;
    if (headerUsername) headerUsername.textContent = userName;

    // Config and currency data
    if (activeConfig) activeConfig.textContent = localStorage.getItem('activeConfig') || 'Default';
    if (activeCurrency) activeCurrency.textContent = localStorage.getItem('activeCurrency') || 'IDR';

    // Check if sidebar state is saved in localStorage
    const sidebarState = localStorage.getItem('sidebarState');
    if (sidebarState === 'closed') {
        sidebar.classList.add('closed');
        mainContent.classList.add('closed');
    }

    // Toggle sidebar on button click
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('closed');
            mainContent.classList.toggle('closed');
            
            // Save sidebar state to localStorage
            if (sidebar.classList.contains('closed')) {
                localStorage.setItem('sidebarState', 'closed');
            } else {
                localStorage.setItem('sidebarState', 'open');
            }
        });
    }

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('closed');
        });
    }

    // Loading indicator
    window.showLoading = function() {
        contentLoading.classList.remove('hidden');
    };

    window.hideLoading = function() {
        contentLoading.classList.add('hidden');
    };

    // Generate menu items based on user role
    generateMenuItems();

    // Handle submenu toggles
    setupSubmenuToggles();
});

// Function to generate menu items based on user role and access
function generateMenuItems() {
    const menuContainer = document.querySelector('.menu');
    if (!menuContainer) return;

    // Get user permissions from localStorage
    const userPermissions = JSON.parse(localStorage.getItem('userPermissions')) || [];
    const currentPath = window.location.pathname;

    // Define menu structure with required permissions
    const menuItems = [
        {
            name: 'Dashboard',
            icon: 'bi bi-speedometer2',
            path: '/Dashboards',
            permission: 'Dashboard:Read'
        },
        {
            name: 'Master Data',
            icon: 'bi bi-database',
            submenu: [
                {
                    name: 'Currencies',
                    path: '/Currencies',
                    permission: 'Currency:Read'
                },
                {
                    name: 'Genders',
                    path: '/Genders',
                    permission: 'Gender:Read'
                }
            ]
        },
        {
            name: 'Vendors',
            icon: 'bi bi-building',
            submenu: [
                {
                    name: 'Vendor Groups',
                    path: '/VendorGroups',
                    permission: 'VendorGroup:Read'
                },
                {
                    name: 'Vendor Sub Groups',
                    path: '/VendorSubGroups',
                    permission: 'VendorSubGroup:Read'
                },
                {
                    name: 'Vendors',
                    path: '/Vendors',
                    permission: 'Vendor:Read'
                },
                {
                    name: 'Vendor Contacts',
                    path: '/VendorContacts',
                    permission: 'VendorContact:Read'
                }
            ]
        },
        {
            name: 'Customers',
            icon: 'bi bi-people',
            submenu: [
                {
                    name: 'Customer Groups',
                    path: '/CustomerGroups',
                    permission: 'CustomerGroup:Read'
                },
                {
                    name: 'Customer Sub Groups',
                    path: '/CustomerSubGroups',
                    permission: 'CustomerSubGroup:Read'
                },
                {
                    name: 'Customers',
                    path: '/Customers',
                    permission: 'Customer:Read'
                },
                {
                    name: 'Customer Contacts',
                    path: '/CustomerContacts',
                    permission: 'CustomerContact:Read'
                }
            ]
        },
        {
            name: 'Accounts',
            icon: 'bi bi-people-fill',
            submenu: [
                {
                    name: 'Roles',
                    path: '/Roles',
                    permission: 'Role:Read'
                },
                {
                    name: 'Members',
                    path: '/Members',
                    permission: 'Member:Read'
                },
                {
                    name: 'Claims',
                    path: '/Claims',
                    permission: 'RoleClaim:Read'
                }
            ]
        },
        {
            name: 'User Profile',
            icon: 'bi bi-person-circle',
            path: '/UserProfiles',
            permission: 'UserProfile:Read'
        }
    ];

    let menuHtml = '';

    // Generate HTML for menu items
    menuItems.forEach(item => {
        // Check if user has permission for this menu item
        let hasPermission = true;
        if (item.permission && !userPermissions.includes(item.permission)) {
            hasPermission = false;
        }

        // For submenu items, check if user has permission for at least one submenu
        if (item.submenu) {
            const hasSubPermission = item.submenu.some(subItem => 
                !subItem.permission || userPermissions.includes(subItem.permission)
            );
            if (!hasSubPermission) {
                hasPermission = false;
            }
        }

        if (hasPermission) {
            // Check if current menu item or any of its subitems are active
            const isActive = item.path === currentPath || 
                (item.submenu && item.submenu.some(sub => sub.path === currentPath));
            
            if (item.submenu) {
                // Has submenu
                const isOpen = item.submenu.some(sub => sub.path === currentPath);
                menuHtml += `
                    <div class="menu-group">
                        <div class="menu-item submenu-toggle ${isActive ? 'menu-selected' : ''}">
                            <i class="${item.icon}"></i>
                            <span>${item.name}</span>
                            <i class="bi bi-chevron-right caret ${isOpen ? 'rotate' : ''}"></i>
                        </div>
                        <div class="submenu ${isOpen ? 'open' : ''}">
                `;
                
                item.submenu.forEach(subItem => {
                    if (!subItem.permission || userPermissions.includes(subItem.permission)) {
                        const isSubActive = subItem.path === currentPath;
                        menuHtml += `
                            <a href="${subItem.path}" class="menu-item ${isSubActive ? 'menu-selected' : ''}">
                                <i class="bi bi-circle-fill" style="font-size: 0.5rem;"></i>
                                <span>${subItem.name}</span>
                            </a>
                        `;
                    }
                });
                
                menuHtml += `
                        </div>
                    </div>
                `;
            } else {
                // Single menu item
                menuHtml += `
                    <a href="${item.path}" class="menu-item ${isActive ? 'menu-selected' : ''}">
                        <i class="${item.icon}"></i>
                        <span>${item.name}</span>
                    </a>
                `;
            }
        }
    });

    menuContainer.innerHTML = menuHtml;
}

// Setup submenu toggle functionality
function setupSubmenuToggles() {
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Toggle caret icon rotation
            const caret = this.querySelector('.caret');
            caret.classList.toggle('rotate');
            
            // Toggle submenu visibility
            const submenu = this.nextElementSibling;
            submenu.classList.toggle('open');
        });
    });
}
