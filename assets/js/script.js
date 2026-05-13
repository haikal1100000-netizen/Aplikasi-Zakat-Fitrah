// 🔥 AMANAH PAY SPA ROUTER - FULL FEATURED
class AmanahPayApp {
    constructor() {
        this.pages = {
            home: 'index.html',
            calculator: 'calculator.html',
            features: 'features.html',
            transparency: 'transparency.html',
            gamification: 'gamification.html',
            payment: 'payment.html'
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
            case 'payment':
                this.initPaymentPage();
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
        const donationCategory = document.getElementById('donationCategory');
        const donationItemGroup = document.getElementById('donationItemGroup');
        const donationItemLabel = document.getElementById('donationItemLabel');
        const donationItem = document.getElementById('donationItem');
        const donationQuantityGroup = document.getElementById('donationQuantityGroup');
        const donationQuantity = document.getElementById('donationQuantity');
        const donationAmount = document.getElementById('donationAmount');

        const donationItems = {
            Kurban: [
                { label: 'Domba/Kambing Standar (21-26 kg) Rp2,45jt', value: 2450000 },
                { label: 'Domba/Kambing Medium (27-29 kg) Rp2,9jt', value: 2900000 },
                { label: 'Domba/Kambing Premium (30-33 kg) Rp3,1jt', value: 3100000 },
                { label: 'Sapi 1/7 (250-300 kg) Rp3jt', value: 3000000 },
                { label: 'Sapi (250-300 kg) Rp2,1jt', value: 2100000 },
                { label: 'Sapi Kemasan (250 kaleng) Rp21jt', value: 21000000 },
                { label: 'Domba/Kambing Palestina Reguler (35 Kg) Rp5,9jt', value: 5900000 },
                { label: 'Domba/Kambing Palestina Premium (45 Kg) Rp9jt', value: 9000000 },
                { label: 'Sapi Palestina 1/7 Dalam Kaleng (20 Kg) Rp5,9jt', value: 5900000 },
                { label: 'Sapi Al-Quds (450 Kg) Rp59jt', value: 59000000 }
            ],
            'Dam Haji': [
                { label: 'Dam Haji Standar (21-26 kg) Rp2,45jt', value: 2450000 },
                { label: 'Dam Haji Medium (27-29 kg) Rp2,9jt', value: 2900000 },
                { label: 'Dam Haji Premium (30-33 kg) Rp3,1jt', value: 3100000 }
            ],
            Sedekah: [
                { label: 'Sedekah Palestina', value: 500000 },
                { label: 'Sedekah Dunia Islam', value: 250000 },
                { label: 'Sedekah BAZNAS', value: 150000 },
                { label: 'Sedekah Bencana', value: 200000 },
                { label: 'Sedekah Daging', value: 350000 }
            ],
            Infak: [
                { label: 'Infak Kemanusiaan', value: 100000 },
                { label: 'Infak Pendidikan', value: 150000 },
                { label: 'Infak Kesehatan', value: 200000 },
                { label: 'Infak Ekonomi', value: 250000 },
                { label: 'Infak Dakwah', value: 120000 }
            ]
        };

        function formatNumber(value) {
            return new Intl.NumberFormat('id-ID').format(value);
        }

        const donationAmountWrapper = document.getElementById('donationAmountWrapper');

        function updateDonationInputs() {
            const category = donationCategory.value;
            const showQuantity = category === 'Kurban' || category === 'Dam Haji';
            const isPackageCategory = showQuantity || category === 'Sedekah' || category === 'Infak';

            if (isPackageCategory) {
                donationItemGroup.style.display = 'block';
                donationItem.innerHTML = donationItems[category].map(item => `
                    <option value="${item.value}">${item.label}</option>
                `).join('');
                donationItemLabel.textContent = category === 'Kurban' ? 'Pilih Paket Kurban' : category === 'Dam Haji' ? 'Pilih Paket Dam Haji' : category === 'Sedekah' ? 'Pilih Program Sedekah' : 'Pilih Program Infak';
                donationQuantityGroup.style.display = showQuantity ? 'block' : 'none';
                donationQuantity.value = '1';
                donationAmount.readOnly = true;
                donationAmountWrapper.classList.add('disabled');
                updateDonationAmount();
            } else {
                donationItemGroup.style.display = 'none';
                donationQuantityGroup.style.display = 'none';
                donationAmount.readOnly = false;
                donationAmountWrapper.classList.remove('disabled');
                donationAmount.value = '';
            }
        }

        function updateDonationAmount() {
            const category = donationCategory.value;
            if (category === 'Kurban' || category === 'Dam Haji') {
                const unit = parseInt(donationQuantity.value, 10) || 1;
                const itemPrice = parseInt(donationItem.value, 10) || 0;
                donationAmount.value = formatNumber(itemPrice * unit);
            } else if (category === 'Sedekah' || category === 'Infak') {
                const itemPrice = parseInt(donationItem.value, 10) || 0;
                donationAmount.value = formatNumber(itemPrice);
            }
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(item => item.classList.remove('active'));
                bodies.forEach(body => body.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab)?.classList.add('active');
            });
        });

        donationCategory?.addEventListener('change', updateDonationInputs);
        donationItem?.addEventListener('change', updateDonationAmount);
        donationQuantity?.addEventListener('change', updateDonationAmount);

        updateDonationInputs();

        document.querySelector('.select-payment-btn')?.addEventListener('click', () => {
            const rawAmount = donationAmount.value || '0';
            const paymentAmount = parseInt(rawAmount.replace(/\D/g, ''), 10) || 0;
            const category = donationCategory.value;
            const packageLabel = donationItem?.options[donationItem.selectedIndex]?.text || '';
            const quantity = donationQuantity?.value || '1';

            sessionStorage.setItem('amanahPayPayment', JSON.stringify({
                amount: paymentAmount,
                category,
                packageLabel,
                quantity
            }));

            this.loadPage('/payment');
        });
    }

    initPaymentPage() {
        const paymentData = JSON.parse(sessionStorage.getItem('amanahPayPayment') || '{}');
        const defaultAmount = paymentData.amount || 2450000;
        const amount = paymentData.amount || defaultAmount;

        const paymentAmountLabel = document.getElementById('paymentAmount');
        const paymentCategoryLabel = document.getElementById('paymentCategory');
        const paymentPackageLabel = document.getElementById('paymentPackage');
        const paymentQuantityLabel = document.getElementById('paymentQuantity');
        const paymentMethodContainer = document.getElementById('vaMethods');
        const paymentInstruction = document.getElementById('paymentInstruction');
        const paymentBankName = document.getElementById('paymentBankName');
        const paymentVaNumber = document.getElementById('paymentVaNumber');
        const paymentIntention = document.querySelector('.payment-intention');

        const methods = [
            { id: 'BSI', label: 'BSI Virtual Account', note: 'Menerima transfer dari bank lain', va: '20203814063892657', bank: 'Bank BSI' },
            { id: 'BCA', label: 'BCA Virtual Account', note: 'Menerima transfer dari bank lain', va: '8881234567890123', bank: 'Bank BCA' },
            { id: 'Mandiri', label: 'Mandiri Virtual Account', note: 'Menerima transfer dari bank lain', va: '8889876543210987', bank: 'Bank Mandiri' },
            { id: 'BNI', label: 'BNI Virtual Account', note: 'Menerima transfer dari bank lain', va: '8885678901234567', bank: 'Bank BNI' },
            { id: 'BRI', label: 'BRI Virtual Account', note: 'Menerima transfer dari bank lain', va: '8882468013579246', bank: 'Bank BRI' },
            { id: 'CIMB', label: 'CIMB Virtual Account', note: 'Menerima transfer dari bank lain', va: '8883141592653589', bank: 'Bank CIMB' },
            { id: 'Permata', label: 'Permata Virtual Account', note: 'Menerima transfer dari bank lain', va: '8882718281828459', bank: 'Bank Permata' }
        ];

        const formatCurrency = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

        const renderSelectedMethod = (method) => {
            if (!method) return;
            paymentBankName.textContent = method.bank;
            paymentInstruction.textContent = `Lakukan pembayaran dari rekening ${method.bank} ke nomor virtual account di bawah ini.`;
            paymentVaNumber.textContent = method.va;
        };

        paymentAmountLabel.textContent = formatCurrency(amount);
        paymentCategoryLabel.textContent = paymentData.category || 'Zakat';
        paymentPackageLabel.textContent = paymentData.packageLabel || 'Paket Standar';
        paymentQuantityLabel.textContent = paymentData.quantity || '1';

        if (paymentIntention) {
            paymentIntention.style.display = paymentData.category === 'Zakat' ? 'block' : 'none';
        }

        paymentMethodContainer.innerHTML = methods.map((method, index) => `
            <label class="va-option ${index === 0 ? 'active' : ''}">
                <input type="radio" name="vaMethod" value="${method.id}" ${index === 0 ? 'checked' : ''}>
                <span class="bank-logo bank-logo-${method.id.toLowerCase()}">${method.id}</span>
                <div>
                    <strong>${method.label}</strong>
                    <span>${method.note}</span>
                </div>
            </label>
        `).join('');

        const radioButtons = paymentMethodContainer.querySelectorAll('input[name="vaMethod"]');
        let selectedMethod = methods[0];
        renderSelectedMethod(selectedMethod);

        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                selectedMethod = methods.find(method => method.id === radio.value) || methods[0];
                paymentMethodContainer.querySelectorAll('.va-option').forEach(option => {
                    option.classList.toggle('active', option.contains(radio));
                });
                renderSelectedMethod(selectedMethod);
            });
        });

        document.getElementById('paymentBack')?.addEventListener('click', () => {
            window.history.back();
        });

        document.getElementById('paymentPay')?.addEventListener('click', () => {
            const orderId = `#T-${Date.now()}`;
            const modal = document.createElement('div');
            modal.className = 'payment-modal-overlay';
            modal.innerHTML = `
                <div class="payment-modal">
                    <div class="modal-header">
                        <strong>BAZNAS</strong>
                        <button class="modal-close" type="button">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-amount">${formatCurrency(amount)}</div>
                        <div class="modal-meta">
                            <span>Order ID ${orderId}</span>
                            <span>Bayar dalam 00:59:55</span>
                        </div>
                        <div class="modal-bank">
                            <h4>${selectedMethod.bank}</h4>
                            <p>Lakukan pembayaran dari rekening ${selectedMethod.bank} ke nomor virtual account di bawah ini.</p>
                            <div class="modal-va">
                                <span>${selectedMethod.va}</span>
                                <button class="copy-btn" type="button">Salin</button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-reset modal-close">Tutup</button>
                        <button type="button" class="cta-primary">Cek status</button>
                    </div>
                </div>
            `;

            modal.querySelectorAll('.modal-close').forEach(btn => {
                btn.addEventListener('click', () => modal.remove());
            });
            modal.querySelector('.copy-btn')?.addEventListener('click', () => {
                navigator.clipboard.writeText(selectedMethod.va);
            });

            document.body.appendChild(modal);
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
        const resetButton = document.getElementById('calcReset');
        const calculateButton = document.getElementById('calcBtn');
        const inputs = document.querySelectorAll('.calculator-section input');

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

        calculateButton?.addEventListener('click', () => {
            this.calculateZakat();
        });

        resetButton?.addEventListener('click', () => {
            inputs.forEach(input => input.value = '0');
            resultBox && (resultBox.style.display = 'none');
        });
    }

    calculateZakat() {
        const activeTab = document.querySelector('.calc-content.active');
        const resultBox = document.getElementById('calcResult');
        if (!activeTab || !resultBox) return;

        const rate = 0.025;
        const nisabThreshold = 85 * 1200000;
        let title = '';
        let desc = '';
        let totalAssets = 0;
        let zakat = 0;

        if (activeTab.id === 'penghasilan') {
            const monthly = parseFloat(document.getElementById('incomeMonthly')?.value) || 0;
            const bonus = parseFloat(document.getElementById('incomeBonus')?.value) || 0;
            const annualIncome = monthly * 12 + bonus;
            title = 'Zakat Penghasilan';
            totalAssets = annualIncome;
            if (annualIncome >= nisabThreshold) {
                zakat = annualIncome * rate;
                desc = `Nisab terpenuhi (Rp${nisabThreshold.toLocaleString('id-ID')}). Zakat 2.5% dari penghasilan tahunan Rp${annualIncome.toLocaleString('id-ID')}.`;
            } else {
                desc = `Belum nisab (minimal Rp${nisabThreshold.toLocaleString('id-ID')} per tahun). Penghasilan tahunan saat ini Rp${annualIncome.toLocaleString('id-ID')}.`;
            }
        } else if (activeTab.id === 'maal') {
            const jewelry = parseFloat(document.getElementById('maalJewelry')?.value) || 0;
            const cash = parseFloat(document.getElementById('maalCash')?.value) || 0;
            const assets = parseFloat(document.getElementById('maalAssets')?.value) || 0;
            const debt = parseFloat(document.getElementById('maalDebt')?.value) || 0;
            const netMaal = Math.max(jewelry + cash + assets - debt, 0);
            title = 'Zakat Maal';
            totalAssets = netMaal;
            if (netMaal >= nisabThreshold) {
                zakat = netMaal * rate;
                desc = `Nisab terpenuhi (Rp${nisabThreshold.toLocaleString('id-ID')}). Zakat 2.5% dari total harta Rp${netMaal.toLocaleString('id-ID')}.`;
            } else {
                desc = `Belum nisab (minimal Rp${nisabThreshold.toLocaleString('id-ID')}). Total harta saat ini Rp${netMaal.toLocaleString('id-ID')}.`;
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