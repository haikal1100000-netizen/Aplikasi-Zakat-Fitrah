        // Header scroll effect
        window.addEventListener('scroll', () => {
            document.getElementById('header').classList.toggle('scrolled', window.scrollY > 50);
        });

        // Mobile menu toggle
        document.querySelector('.mobile-menu').addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('mobile');
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Tab switching
        function switchTab(tabName) {
            document.querySelectorAll('.calc-tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.calc-content').forEach(content => content.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        }

        // Zakat Calculator
        function calculateZakat(type) {
            let amount = 0;
            let nisab = 0;
            let zakat = 0;
            let title = '';
            let desc = '';
            let goldPrice = parseFloat(document.getElementById('goldPrice').value) || 1200000;

            if (type === 'penghasilan') {
                let monthly = parseFloat(document.getElementById('income').value) || 0;
                amount = monthly * 12; // Annual income
                nisab = 85 * goldPrice;
                title = 'Zakat Penghasilan';
                if (amount >= nisab) {
                    zakat = amount * 0.025;
                    desc = `Zakat wajib ${zakat.toLocaleString('id-ID')} (2.5% dari penghasilan tahunan Rp${amount.toLocaleString('id-ID')})`;
                } else {
                    zakat = 0;
                    desc = `Belum wajib zakat (nisab: Rp${nisab.toLocaleString('id-ID')}, penghasilan tahunan: Rp${amount.toLocaleString('id-ID')})`;
                }
            } else if (type === 'maal') {
                const gold = parseFloat(document.getElementById('gold').value) || 0;
                amount = gold * goldPrice;
                nisab = 85 * goldPrice;
                title = 'Zakat Maal/Emas';
                if (amount >= nisab) {
                    zakat = amount * 0.025;
                    desc = `Zakat maal wajib ${zakat.toLocaleString('id-ID')} (nisab terpenuhi ${Math.round(amount/nisab*100)}%)`;
                } else {
                    zakat = 0;
                    desc = `Belum wajib zakat maal (nisab: Rp${nisab.toLocaleString('id-ID')}, nilai: Rp${amount.toLocaleString('id-ID')})`;
                }
            } else if (type === 'perdagangan') {
                amount = parseFloat(document.getElementById('trade').value) || 0;
                nisab = 85 * goldPrice;
                title = 'Zakat Perdagangan';
                if (amount >= nisab) {
                    zakat = amount * 0.025;
                    desc = `Zakat perdagangan wajib ${zakat.toLocaleString('id-ID')} (nisab terpenuhi ${Math.round(amount/nisab*100)}%)`;
                } else {
                    zakat = 0;
                    desc = `Belum wajib zakat perdagangan (nisab: Rp${nisab.toLocaleString('id-ID')}, nilai: Rp${amount.toLocaleString('id-ID')})`;
                }
            }
            
            document.getElementById('resultTitle').textContent = title;
            document.getElementById('zakatAmount').textContent = 
                new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(zakat);
            document.getElementById('resultDesc').textContent = desc;
            
            document.getElementById('calcResult').style.display = 'block';
            document.getElementById('calcResult').scrollIntoView({ behavior: 'smooth' });
        }

        // Auto calculate
        document.addEventListener('input', function(e) {
            if (e.target.id === 'income' || e.target.id === 'gold' || e.target.id === 'goldPrice' || e.target.id === 'trade') {
                const activeTab = document.querySelector('.calc-content.active').id;
                calculateZakat(activeTab);
            }
        });

        // Simulate payment
        function payZakat() {
            alert('🕌 Redirect ke pembayaran QRIS...\n\nFitur ini akan tersedia di aplikasi mobile!');
        }

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-up');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .donation-track, .badge-card').forEach(el => {
            observer.observe(el);
        });

        // Progress bar animation
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });