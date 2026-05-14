// 🔥 AMANAH PAY SPA ROUTER - FULL FEATURED
class AmanahPayApp {
    constructor() {
        this.pages = {
            home: 'index.html',
            calculator: 'calculator.html',
            features: 'features.html',
            transparency: 'transparency.html',
            gamification: 'gamification.html',
            payment: 'payment.html',
            upload: 'upload.html'
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
            window.history.pushState({ page: pageKey }, newTitle, `/${pageKey}`);
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
                switch (e.key) {
                    case '1': this.loadPage('/'); break;
                    case '2': this.loadPage('/calculator'); break;
                }
            }
        });
    }

    initCurrentPage(pageKey) {
        switch (pageKey) {
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
            case 'upload':
                this.initUmkmUploadPage();
                break;
            case 'home':
            default:
                this.initHomePage();
                this.animateStats();
                break;
        }
    }

    // ========== HOME PAGE ==========
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

                // Manual nominal for Infak & Sedekah.
                if (category === 'Sedekah' || category === 'Infak') {
                    donationAmount.readOnly = false;
                    donationAmountWrapper.classList.remove('disabled');
                    // Jangan auto-set nominal; biarkan user mengisi.
                } else {
                    donationAmount.readOnly = true;
                    donationAmountWrapper.classList.add('disabled');
                    updateDonationAmount();
                }
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
                // Nominal diisi manual, jadi jangan auto-update.
                // (Fungsi ini dipanggil dari event change, tapi kita sengaja tidak mengubah value.)
                return;
            }
        }

        // Home page now uses a static subtitle instead of a tab.
        // Keep tab logic only if elements exist (backward compatibility).
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(item => item.classList.remove('active'));
                bodies.forEach(body => body.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab)?.classList.add('active');
            });
        });

        // Ensure the home form is visible (no tab switching).
        bodies.forEach(body => body.classList.add('active'));

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

    // ========== PAYMENT PAGE ==========
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

    // ========== TRANSPARENCY ==========
    initTransparency() {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => bar.style.width = width, 500);
        });

        // Klik peta untuk menampilkan versi fullscreen
        const mapContainer = document.getElementById('donationMap');
        const mapImg = mapContainer?.querySelector('img.map-image, img.map-image');
        if (mapContainer && mapImg) {

            mapContainer.style.cursor = 'pointer';

            const openModal = () => {
                const overlay = document.createElement('div');
                overlay.className = 'map-modal-overlay';
                overlay.setAttribute('role', 'dialog');
                overlay.setAttribute('aria-modal', 'true');
                overlay.innerHTML = `
                    <div class="map-modal">
                        <div class="map-modal-header">
                            <strong>Peta Distribusi Nasional</strong>
                            <button type="button" class="map-modal-close" aria-label="Tutup">×</button>
                        </div>
                        <div class="map-modal-body">
                            <img src="${mapImg.getAttribute('src') || ''}" alt="Peta full" class="map-modal-image" />
                        </div>
                    </div>
                `;

                document.body.appendChild(overlay);

                requestAnimationFrame(() => {
                    overlay.style.display = 'flex';
                });

                const close = () => {
                    overlay.style.display = 'none';
                    overlay.remove();
                };

                overlay.querySelector('.map-modal-close')?.addEventListener('click', close);

                // Tutup saat klik background
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) close();
                });

                // Tutup via tombol ESC
                const onKeyDown = (e) => {
                    if (e.key === 'Escape') {
                        document.removeEventListener('keydown', onKeyDown);
                        close();
                    }
                };
                document.addEventListener('keydown', onKeyDown);
            };

            mapContainer.addEventListener('click', (e) => {
                // Hindari click berlapis overlay teks
                if (e.target && (e.target.closest('.map-overlay') || e.target.tagName === 'IMG')) {
                    openModal();
                    return;
                }
                openModal();
            });
        }


        const impactNumbers = document.querySelectorAll('.impact-number[data-target]');
        impactNumbers.forEach(num => {
            const target = parseInt(num.dataset.target, 10);
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

    // ========== GAMIFICATION (UMKM) ==========
    initGamification() {
        // Animate leaderboard rows
        const leaderboardRows = document.querySelectorAll('.leaderboard-row');
        leaderboardRows.forEach((row, index) => {
            setTimeout(() => {
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, index * 100);
        });

        // UMKM Funding Form handler
        const form = document.getElementById('umkmFundingForm');
        const messageEl = document.getElementById('umkmFormMessage');

        const setMessage = (type, text) => {
            if (!messageEl) return;
            messageEl.style.display = 'block';
            messageEl.classList.remove('success', 'error');
            messageEl.classList.add(type);
            messageEl.textContent = text;
        };

        const getValue = (id) => document.getElementById(id)?.value?.trim() || '';

        const parseNumberLike = (val) => {
            const cleaned = (val || '').toString().replace(/[^0-9]/g, '');
            const num = parseInt(cleaned, 10);
            return Number.isFinite(num) ? num : 0;
        };

        const nextBtn = document.getElementById('umkmNextStepBtn');

        const validateStep1 = () => {
            const requiredIds = [
                'namaLengkap',
                'nomorHp',
                'nomorKtp',
                'alamatEmail',
                'tanggalPengajuan',
                'namaUmkm',
                'domisiliIbukota',
                'alamatLengkap',
                'jumlahPegawai',
                'tujuanPengajuan',
                'kebutuhanDana',
                'omsetPerbulan'
            ];

            for (const id of requiredIds) {
                const v = getValue(id);
                if (!v) {
                    setMessage('error', 'Lengkapi semua field yang wajib diisi.');
                    document.getElementById(id)?.focus?.();
                    return null;
                }
            }

            const email = getValue('alamatEmail');
            const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!emailOk) {
                setMessage('error', 'Format alamat email tidak valid.');
                document.getElementById('alamatEmail')?.focus?.();
                return null;
            }

            const nomorHp = getValue('nomorHp');
            const nomorKtp = getValue('nomorKtp');

            const hpDigits = nomorHp.replace(/\D/g, '');
            if (hpDigits.length < 10) {
                setMessage('error', 'Nomor HP terlalu pendek. Pastikan sesuai format.');
                document.getElementById('nomorHp')?.focus?.();
                return null;
            }

            const ktpDigits = nomorKtp.replace(/\D/g, '');
            if (ktpDigits.length < 12) {
                setMessage('error', 'Nomor KTP terlalu pendek. Pastikan sesuai format.');
                document.getElementById('nomorKtp')?.focus?.();
                return null;
            }

            const jumlahPegawai = parseNumberLike(getValue('jumlahPegawai'));
            if (jumlahPegawai <= 0) {
                setMessage('error', 'Jumlah pegawai harus lebih dari 0.');
                document.getElementById('jumlahPegawai')?.focus?.();
                return null;
            }

            const kebutuhanDana = parseNumberLike(getValue('kebutuhanDana'));
            if (kebutuhanDana <= 0) {
                setMessage('error', 'Masukan jumlah kebutuhan dana harus lebih dari 0.');
                document.getElementById('kebutuhanDana')?.focus?.();
                return null;
            }

            const omsetPerbulan = parseNumberLike(getValue('omsetPerbulan'));
            if (omsetPerbulan <= 0) {
                setMessage('error', 'Omset perbulan harus lebih dari 0.');
                document.getElementById('omsetPerbulan')?.focus?.();
                return null;
            }

            return {
                namaLengkap: getValue('namaLengkap'),
                nomorHp,
                nomorKtp,
                alamatEmail: email,
                tanggalPengajuan: getValue('tanggalPengajuan'),
                namaUmkm: getValue('namaUmkm'),
                domisiliIbukota: getValue('domisiliIbukota'),
                alamatLengkap: getValue('alamatLengkap'),
                jumlahPegawai,
                tujuanPengajuan: getValue('tujuanPengajuan'),
                kebutuhanDana,
                omsetPerbulan,
                submittedAt: new Date().toISOString()
            };
        };

        nextBtn?.addEventListener('click', () => {
            const payload = validateStep1();
            if (!payload) return;

            sessionStorage.setItem('amanahPayUmkmSubmission', JSON.stringify(payload));
            setMessage('success', 'Data UMKM tersimpan. Lanjut upload dokumen.');

            document.querySelector('input#uploadKtp')?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
        });

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        // Step 2 - Dokumen
        const dokForm = document.getElementById('umkmDokumenForm');
        const dokMsg = document.getElementById('umkmDokumenMessage');

        const setDokMessage = (type, text) => {
            if (!dokMsg) return;
            dokMsg.style.display = 'block';
            dokMsg.classList.remove('success', 'error');
            dokMsg.classList.add(type);
            dokMsg.textContent = text;
        };

        dokForm?.addEventListener('submit', (e) => {
            e.preventDefault();

            const fileFields = [
                'uploadKtp',
                'uploadPasFoto3x4',
                'uploadFotoUsaha',
                'uploadSuratPernyataanRtRw',
                'uploadSuratPernyataan',
                'uploadKartuBank'
            ];

            for (const id of fileFields) {
                const el = document.getElementById(id);
                const file = el?.files?.[0];
                if (!file) {
                    setDokMessage('error', 'Lengkapi semua dokumen yang wajib diupload.');
                    el?.focus?.();
                    return;
                }
            }

            const docsPayload = {
                uploadKtp: document.getElementById('uploadKtp').files[0].name,
                uploadPasFoto3x4: document.getElementById('uploadPasFoto3x4').files[0].name,
                uploadFotoUsaha: document.getElementById('uploadFotoUsaha').files[0].name,
                uploadSuratPernyataanRtRw: document.getElementById('uploadSuratPernyataanRtRw').files[0].name,
                uploadSuratPernyataan: document.getElementById('uploadSuratPernyataan').files[0].name,
                uploadKartuBank: document.getElementById('uploadKartuBank').files[0].name,
                submittedAt: new Date().toISOString()
            };

            sessionStorage.setItem('amanahPayUmkmDokumen', JSON.stringify(docsPayload));
            setDokMessage('success', 'Upload dokumen tersimpan (metadata saja, front-end only).');

            // setelah submit dokumen, lanjut ke page upload (ringkasan dokumen)
            this.loadPage('/upload');
        });
    }

    // ========== UPLOAD PAGE ==========
    initUmkmUploadPage() {
        const submission = JSON.parse(sessionStorage.getItem('amanahPayUmkmSubmission') || '{}');
        const dokumen = JSON.parse(sessionStorage.getItem('amanahPayUmkmDokumen') || '{}');

        const titleEl = document.getElementById('umkmUploadTitle');
        const statusEl = document.getElementById('umkmUploadStatus');
        const listEl = document.getElementById('umkmUploadDocsList');

        if (titleEl) titleEl.textContent = 'Ringkasan Upload Dokumen';

        const hasSubmission = Boolean(submission && submission.namaLengkap);
        const hasDocs = Boolean(dokumen && Object.keys(dokumen).length);

        if (statusEl) {
            if (hasSubmission && hasDocs) {
                statusEl.textContent = 'Pendaftaran berhasil disiapkan. Dokumen tersimpan untuk proses berikutnya.';
                statusEl.classList.remove('error');
                statusEl.classList.add('success');
            } else {
                statusEl.textContent = 'Data belum lengkap. Kembali ke Pendanaan UMKM Syariah untuk mengisi formulir.';
                statusEl.classList.remove('success');
                statusEl.classList.add('error');
            }
        }

        if (listEl) {
                    const docEntries = [
                ['KTP', dokumen.uploadKtp],
                ['Pasfoto 3x4', dokumen.uploadPasFoto3x4],
                ['Foto usaha', dokumen.uploadFotoUsaha],
                ['Surat pernyataan RT/RW', dokumen.uploadSuratPernyataanRtRw],
                ['Surat pernyataan', dokumen.uploadSuratPernyataan],
                ['Kartu bank', dokumen.uploadKartuBank]
            ];

            listEl.innerHTML = docEntries
                .filter(([, name]) => name)
                .map(([label, name]) => `
                    <div class="upload-doc-item">
                        <span class="upload-doc-label">${label}</span>
                        <span class="upload-doc-file">${name}</span>
                    </div>
                `)
                .join('');
        }

        document.getElementById('umkmUploadBackBtn')?.addEventListener('click', () => {
            this.loadPage('/gamification');
        });
    }

    // ========== CALCULATOR ==========
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
        let zakat = 0;

        if (activeTab.id === 'penghasilan') {
            const monthly = parseFloat(document.getElementById('incomeMonthly')?.value) || 0;
            const bonus = parseFloat(document.getElementById('incomeBonus')?.value) || 0;
            const annualIncome = monthly * 12 + bonus;
            title = 'Zakat Penghasilan';
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
            const target = parseInt(stat.dataset.target, 10);
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
        if (!loading) return;
        loading.style.opacity = '0';
        setTimeout(() => loading.style.display = 'none', 500);
    }

    loadFallback(pageKey) {
        const main = document.getElementById('main-content');
        if (!main) return;
        main.innerHTML = `
            <div style="padding: 5rem 2rem; text-align: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 5rem; color: var(--gold); margin-bottom: 2rem;"></i>
                <h2>Halaman ${pageKey} Belum Tersedia</h2>
                <p>Sedang dalam pengembangan. Kembali ke <a href="/" style="color: var(--primary);">Beranda</a></p>
            </div>
        `;
    }
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