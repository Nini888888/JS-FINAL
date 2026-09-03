document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. Header background on scroll
     ========================================================= */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* =========================================================
     2. Burger menu
     ========================================================= */
  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('mainNav');

  const closeMenu = () => {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* =========================================================
     3. Graceful fallback for destination photos not yet uploaded
     ========================================================= */
  document.querySelectorAll('.dest-card img').forEach(img => {
    img.addEventListener('error', () => {
      img.closest('.dest-card').classList.add('img-missing');
    }, { once: true });
  });

  /* =========================================================
     4. Weather widget — Open-Meteo (no API key required)
     ========================================================= */
  const weatherSelect = document.getElementById('weatherSelect');
  const weatherStatus = document.getElementById('weatherStatus');
  const weatherMain = document.getElementById('weatherMain');
  const weatherTemp = document.getElementById('weatherTemp');
  const weatherCondition = document.getElementById('weatherCondition');
  const weatherWind = document.getElementById('weatherWind');
  const weatherPlace = document.getElementById('weatherPlace');

  const weatherCodeMap = {
    0: 'ცხადი ცა', 1: 'ძირითადად ცხადი', 2: 'ნაწილობრივ ღრუბლიანი', 3: 'ღრუბლიანი',
    45: 'ნისლი', 48: 'ხმელი ხმელი ნისლი',
    51: 'სუსტი ცრიმლა', 53: 'ზომიერი ცრიმლა', 55: 'ძლიერი ცრიმლა',
    61: 'სუსტი წვიმა', 63: 'ზომიერი წვიმა', 65: 'ძლიერი წვიმა',
    71: 'სუსტი თოვლი', 73: 'ზომიერი თოვლი', 75: 'ძლიერი თოვლი',
    80: 'წვიმის კრუშა', 81: 'ზომიერი კრუშა', 82: 'ძლიერი კრუშა',
    95: 'ჭექა-ქუხილი', 96: 'ჭექა-ქუხილი სეტყვით'
  };

  async function loadWeather() {
    const option = weatherSelect.selectedOptions[0];
    const [lat, lon] = option.value.split(',');
    const placeName = option.dataset.name;

    weatherStatus.hidden = false;
    weatherStatus.textContent = 'იტვირთება…';
    weatherMain.hidden = true;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('სერვისმა უპასუხოდ დატოვა მოთხოვნა');

      const data = await response.json();
      const current = data.current_weather;

      weatherTemp.textContent = `${Math.round(current.temperature)}°C`;
      weatherCondition.textContent = weatherCodeMap[current.weathercode] || 'ამინდის მონაცემი მიღებულია';
      weatherWind.textContent = `ქარი: ${Math.round(current.windspeed)} კმ/სთ`;
      weatherPlace.textContent = placeName;

      weatherStatus.hidden = true;
      weatherMain.hidden = false;
    } catch (err) {
      weatherStatus.textContent = 'ამინდის მონაცემის მიღება ვერ მოხერხდა — სცადეთ მოგვიანებით.';
      weatherMain.hidden = true;
    }
  }

  weatherSelect.addEventListener('change', loadWeather);
  loadWeather();

  /* =========================================================
     5. Cookie consent (localStorage)
     ========================================================= */
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const COOKIE_KEY = 'bilikia_cookie_consent';

  if (!localStorage.getItem(COOKIE_KEY)) {
    cookieBanner.hidden = false;
  }

  cookieAccept.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    cookieBanner.hidden = true;
  });

  /* =========================================================
     6. Booking form (client-side only)
     ========================================================= */
  const bookForm = document.getElementById('bookForm');
  const formConfirm = document.getElementById('formConfirm');

  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!bookForm.checkValidity()) {
      bookForm.reportValidity();
      return;
    }
    formConfirm.hidden = false;
    bookForm.reset();
  });

  /* =========================================================
     7. Newsletter (localStorage)
     ========================================================= */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterNote = document.getElementById('newsletterNote');
  const NEWSLETTER_KEY = 'bilikia_newsletter_subscribers';

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();
    if (!email) return;

    const subscribers = JSON.parse(localStorage.getItem(NEWSLETTER_KEY) || '[]');

    if (subscribers.includes(email)) {
      newsletterNote.textContent = 'ეს ელფოსტა უკვე გამოწერილია.';
    } else {
      subscribers.push(email);
      localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subscribers));
      newsletterNote.textContent = 'გამოწერილია — მადლობა!';
      newsletterForm.reset();
    }
  });

  /* =========================================================
     8. Testimonial slider (Splide)
     ========================================================= */
  if (window.Splide) {
    new Splide('#storySlider', {
      type: 'loop',
      perPage: 2,
      gap: '1.5rem',
      pagination: true,
      arrows: true,
      breakpoints: {
        768: { perPage: 1 }
      }
    }).mount();
  }

});