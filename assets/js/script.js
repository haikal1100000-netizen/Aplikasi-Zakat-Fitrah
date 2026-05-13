// 🔥 AMANAH PAY SPA ROUTER - FULL FEATURED
class AmanahPayApp {
    constructor() {
        this.pages = {
            home: 'index.html',
            calculator: 'calculator.html',
            features: 'features.html',
            transparency: 'transparency.html',
            gamification: 'gamification.html'
        };
        this.currentPage = 'home';
        this.init();
    }

    async init() {
        // Preload all pages
        await this.preloadPages();
        
        // Bind events
        this.bindEvents();
        
        // Load initial page
        await this.loadPage(window.location.pathname || '/');
        
        // Hide loading
        this.hideLoading();
        
        // Animate stats
        this.animateStats();
    }

    async preloadPages() {
        const cache = {};
        for (let [key, url] of Object.entries(this.pages)) {
            try {
                const response = await fetch(url);
                cache[key] = await response.text();
            } catch (e) {
                console.warn(`Failed to preload ${key}`);
            }
        }
        window.pageCache = cache;
    }

    async loadPage(path = '/') {
        const pageKey = this.getPageKey(path);
        
        // Show loading state
        document.body.classList.add('loading');
        const main = document.getElementById('main-content');
        
        // Get cached content
        const cachedHTML = window.pageCache?.[pageKey];
        if (!cachedHTML) {
            this.loadFallback(pageKey);
            return;
        }

        // Parse HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(cachedHTML, 'text/html');
        
        // Extract content
        const newMainContent = doc.querySelector('#main-content').innerHTML;
        const newTitle = doc.title;
        
        // Update title & nav
        document.title = newTitle;
        this.updateActiveNav(pageKey);
        
        // Animate transition
        main.style.opacity = '0';
        main.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            main.innerHTML = newMainContent;
            main.style.opacity = '1';
            main.style.transform = 'translateY(0)';
            
            // Init page
            this.initCurrentPage(pageKey);
            
            document.body.classList.remove('loading');
            
            // Update URL
            window.history.pushState({page: pageKey}, newTitle, `/${pageKey}`);
            this.currentPage = pageKey;
        }, 300);
    }

    getPageKey(path) {
        const cleanPath = path.replace('/', '').replace('.html', '');
        return cleanPath === '' ? 'home' : cleanPath;
    }

    updateActiveNav(pageKey) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageKey);
        });
    }

    bindEvents() {
        // Navigation
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink) {
                e.preventDefault();
                this.loadPage(`/${navLink.dataset.page}`);
            }
        });

        // Mobile menu
        document.getElementById('mobileMenu')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelector('.nav-links').classList.toggle('active');
        });

        // Browser navigation
        window.addEventListener('popstate', (e) => {
            if (e.state?.page) {
                this.loadPage(`/${e.state.page}`);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1': this.loadPage('/'); break;
                    case '2': this.loadPage('/calculator'); break;
                }
            }
        });
    }

    initCurrentPage(pageKey) {
        switch(pageKey) {
            case 'calculator':
                this.initCalculator();
                break;
            case 'transparency':
                this.initTransparency();
                break;
            case 'gamification':
                this.initGamification();
                break;
            case 'home':
                this.initHomePage();
                this.animateStats();
                break;
        }
    }

    initHomePage() {
        const tabs = document.querySelectorAll('.home-tab');
        const bodies = document.querySelectorAll('.home-tab-body');
        const methods = document.querySelectorAll('.payment-method input[type="radio"]');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(item => item.classList.remove('active'));
                bodies.forEach(body => body.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById(tab.dataset.tab)?.classList.add('active');
            });
        });

        methods.forEach(input => {
            input.addEventListener('change', () => {
                methods.forEach(item => item.closest('.payment-method')?.classList.remove('selected'));
                input.closest('.payment-method')?.classList.add('selected');
            });
        });

        document.querySelector('.select-payment-btn')?.addEventListener('click', () => {
            document.getElementById('paymentMethodsSection')?.scrollIntoView({ behavior: 'smooth' });
        });

        document.getElementById('homeCalcBtn')?.addEventListener('click', () => {
            const value = parseFloat(document.getElementById('homeCalcValue')?.value) || 0;
            const amount = value * 0.025;
            document.getElementById('homeCalcResult').textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
            document.getElementById('homeCalcDesc').textContent = 'Perkiraan zakat 2.5% dari nominal Anda.';
            document.getElementById('homeCalcResultBox').style.display = 'block';
        });
    }
    // Tambah ke AmanahPayApp class
initTransparency() {
    // Animate progress bars
    document.querySelectorAll('.progress-fill').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => bar.style.width = width, 500);
    });
    
    // Animate impact numbers
    const impactNumbers = document.querySelectorAll('.impact-number[data-target]');
    impactNumbers.forEach(num => {
        const target = parseInt(num.dataset.target);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            num.textContent = Math.floor(current).toLocaleString();
        }, 50);
    });
}

initGamification() {
    // Animate leaderboard
    const leaderboardRows = document.querySelectorAll('.leaderboard-row');
    leaderboardRows.forEach((row, index) => {
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, index * 100);
    });
}
    initCalculator() {
        const tabs = document.querySelectorAll('.calc-tab');
        const contents = document.querySelectorAll('.calc-content');
        const resultBox = document.getElementById('calcResult');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;

                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                resultBox && (resultBox.style.display = 'none');

                tab.classList.add('active');
                document.getElementById(target).classList.add('active');
            });
        });

        document.querySelectorAll('.calculator-section input').forEach(input => {
            input.addEventListener('input', debounce(() => this.calculateZakat(), 300));
        });

        this.calculateZakat();
    }

    calculateZakat() {
        const activeTab = document.querySelector('.calc-content.active');
        const resultBox = document.getElementById('calcResult');
        if (!activeTab || !resultBox) return;

        const goldPrice = parseFloat(document.getElementById('goldPrice')?.value) || 1200000;
        const rate = 0.025;
        let title = '';
        let desc = '';
        let amount = 0;
        let nisab = 85 * goldPrice;
        let zakat = 0;

        if (activeTab.id === 'penghasilan') {
            const monthly = parseFloat(document.getElementById('income')?.value) || 0;
            amount = monthly * 12;
            title = 'Zakat Penghasilan';
            if (amount >= nisab) {
                zakat = amount * rate;
                desc = `Nisab terpenuhi (Rp${nisab.toLocaleString('id-ID')}). Zakat 2.5% dari penghasilan tahunan Rp${amount.toLocaleString('id-ID')}.`;
            } else {
                desc = `Belum nisab (minimal Rp${nisab.toLocaleString('id-ID')} per tahun). Penghasilan tahunan saat ini Rp${amount.toLocaleString('id-ID')}.`;
            }
        } else if (activeTab.id === 'maal') {
            const gold = parseFloat(document.getElementById('gold')?.value) || 0;
            amount = gold * goldPrice;
            title = 'Zakat Maal / Emas';
            if (amount >= nisab) {
                zakat = amount * rate;
                desc = `Nisab terpenuhi (${Math.round(amount / nisab * 100)}%). Zakat 2.5% dari total Rp${amount.toLocaleString('id-ID')}.`;
            } else {
                desc = `Belum nisab (Rp${nisab.toLocaleString('id-ID')}), nilai emas saat ini Rp${amount.toLocaleString('id-ID')}.`;
            }
        } else if (activeTab.id === 'perdagangan') {
            const trade = parseFloat(document.getElementById('trade')?.value) || 0;
            amount = trade;
            title = 'Zakat Perdagangan';
            if (amount >= nisab) {
                zakat = amount * rate;
                desc = `Nisab terpenuhi (${Math.round(amount / nisab * 100)}%). Zakat 2.5% dari total persediaan Rp${amount.toLocaleString('id-ID')}.`;
            } else {
                desc = `Belum nisab (Rp${nisab.toLocaleString('id-ID')}), nilai persediaan saat ini Rp${amount.toLocaleString('id-ID')}.`;
            }
        }

        document.getElementById('resultTitle').textContent = title;
        document.getElementById('zakatAmount').textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(zakat);
        document.getElementById('resultDesc').textContent = desc;
        resultBox.style.display = 'block';
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-item h3[data-target]');
        stats.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current).toLocaleString();
            }, 16);
        });
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        loading.style.opacity = '0';
        setTimeout(() => loading.style.display = 'none', 500);
    }

    loadFallback(pageKey) {
        document.getElementById('main-content').innerHTML = `
            <div style="padding: 5rem 2rem; text-align: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 5rem; color: var(--gold); margin-bottom: 2rem;"></i>
                <h2>Halaman ${pageKey} Belum Tersedia</h2>
                <p>Sedang dalam pengembangan. Kembali ke <a href="/" style="color: var(--primary);">Beranda</a></p>
            </div>
        `;
    }
}

// Utilities
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function simulatePayment() {
    // Simulate QRIS payment
    const paymentModal = document.createElement('div');
    paymentModal.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;">
            <div style="background:white;padding:3rem;border-radius:20px;max-width:400px;width:90%;text-align:center;">
                <i class="fas fa-qrcode" style="font-size:4rem;color:var(--success);margin-bottom:1rem;"></i>
                <h3>QRIS Ready!</h3>
                <p>Scan QR code untuk bayar zakat Anda</p>
                <button onclick="this.parentElement.parentElement.remove()" style="background:var(--gold);color:var(--primary);padding:15px 30px;border:none;border-radius:25px;font-weight:600;margin-top:1rem;cursor:pointer;">Tutup</button>
            </div>
        </div>
    `;
    document.body.appendChild(paymentModal);
}

// INIT APP
document.addEventListener('DOMContentLoaded', () => {
    window.amanahPay = new AmanahPayApp();
});