// JSON data URL (replace with yours if needed)
const DATA_URL = "https://raw.githubusercontent.com/nicksanford2323/business-data-fixed2/main/data.json";

// Grab the ?id= from the URL
const urlParams = new URLSearchParams(window.location.search);
const businessId = urlParams.get("id");

// DOM references
const logoArea = document.getElementById("logoArea");

// Hero
const heroContainer = document.getElementById("heroSlidesContainer");
const prevSlideBtn = document.getElementById("prevSlideBtn");
const nextSlideBtn = document.getElementById("nextSlideBtn");
let slidesData = [];
let currentSlideIndex = 0;
let slideInterval = null;

// About
const aboutSlidesContainer = document.getElementById("aboutSlidesContainer");
const prevAboutSlideBtn = document.getElementById("prevAboutSlideBtn");
const nextAboutSlideBtn = document.getElementById("nextAboutSlideBtn");
let aboutSlidesData = [];
let currentAboutSlideIndex = 0;
let aboutSlideInterval = null;

// "dynamicBusinessName" & "dynamicCity" removed from code 
// because you're now directly referencing them in your HTML 
// but we no longer mention "20 years" anywhere.

// Reviews
const reviewsSection = document.getElementById("reviewsSection");
const reviewsSlidesContainer = document.getElementById("reviewsSlidesContainer");
const prevReviewSlideBtn = document.getElementById("prevReviewSlideBtn");
const nextReviewSlideBtn = document.getElementById("nextReviewSlideBtn");
const reviewsLinkArea = document.getElementById("reviewsLinkArea");
let reviewsData = [];
let currentReviewIndex = 0;
let reviewsInterval = null;

// Gallery
const gallerySlidesContainer = document.getElementById("gallerySlidesContainer");
const prevGallerySlideBtn = document.getElementById("prevGallerySlideBtn");
const nextGallerySlideBtn = document.getElementById("nextGallerySlideBtn");
let galleryData = [];
let currentGalleryIndex = 0;
let galleryInterval = null;

// Location
const serviceAreaInfo = document.getElementById("serviceAreaInfo");
const mapArea = document.getElementById("mapArea");

// Contact
const contactForm = document.getElementById("contactForm");

// Footer
const footerContent = document.getElementById("footerContent");
const footerYear = document.getElementById("footerYear");

// Fetch Data
fetch(DATA_URL)
  .then(res => res.json())
  .then(data => {
    if (!businessId || !data[businessId]) {
      logoArea.textContent = "No valid ID in URL.";
      return;
    }

    const business = data[businessId];
    renderHeader(business);
    renderHero(business.sections?.hero || []);
    renderAboutSlideshow(business.sections?.aboutUs || []);
    renderReviewsSlideshow(business.reviews || [], business.businessInfo);
    renderGallerySlideshow(business.sections?.gallery || []);
    renderLocation(business.businessInfo);
    renderFooter(business);
  })
  .catch(err => {
    console.error("Error fetching data:", err);
    logoArea.textContent = "Error loading data";
  });

/* --------------------------------
   1) Render Header (logo, colors)
-------------------------------- */
function renderHeader(business) {
  const info = business.businessInfo || {};
  const rootStyle = document.documentElement.style;

  if (info.color1) {
    rootStyle.setProperty("--primary-color", info.color1);
  }
  if (info.color2) {
    rootStyle.setProperty("--accent-color", info.color2);
  }

  // Clean up logo if present
  let cleanedLogo = null;
  if (info.logo) {
    cleanedLogo = info.logo.replace("/s44-p-k-no-ns-nd", "");
  }
  if (cleanedLogo) {
    const img = document.createElement("img");
    img.src = cleanedLogo;
    img.alt = business.businessName || "Business Logo";
    img.style.maxHeight = "60px";
    img.onerror = () => {
      // fallback if logo fails
      logoArea.textContent = business.businessName || "Business Name";
    };
    logoArea.innerHTML = "";
    logoArea.appendChild(img);
  } else {
    logoArea.textContent = business.businessName || "Business Name";
  }
}

/* --------------------------------
   2) Hero Slideshow
-------------------------------- */
function renderHero(heroArr) {
  slidesData = heroArr;
  if (!slidesData.length) {
    heroContainer.innerHTML = "<div style='padding:1rem;'>No Hero Slides Available.</div>";
    prevSlideBtn.style.display = "none";
    nextSlideBtn.style.display = "none";
    return;
  }

  heroContainer.innerHTML = heroArr.map(item => `
    <div class="slide" style="background-image: url('${item.imageIndex}')">
      <div class="slide-content">
        <h2>${item.callToAction || "Electrical Solutions"}</h2>
      </div>
    </div>
  `).join("");

  showSlide(currentSlideIndex);
  prevSlideBtn.onclick = prevSlide;
  nextSlideBtn.onclick = nextSlide;

  if (slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 6000); // 6s
}

function showSlide(index) {
  const slideEls = heroContainer.querySelectorAll(".slide");
  slideEls.forEach(s => s.classList.remove("active"));
  slideEls[index].classList.add("active");
}

function nextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % slidesData.length;
  showSlide(currentSlideIndex);
}

function prevSlide() {
  currentSlideIndex = (currentSlideIndex - 1 + slidesData.length) % slidesData.length;
  showSlide(currentSlideIndex);
}

/* --------------------------------
   3) About Slideshow
-------------------------------- */
function renderAboutSlideshow(aboutArr) {
  aboutSlidesData = aboutArr;
  if (!aboutSlidesData.length) {
    aboutSlidesContainer.innerHTML = "<div style='padding:1rem;'>No About Images Available.</div>";
    prevAboutSlideBtn.style.display = "none";
    nextAboutSlideBtn.style.display = "none";
    return;
  }

  aboutSlidesContainer.innerHTML = aboutArr.map(item => `
    <div class="about-slide" style="background-image: url('${item.imageIndex}')"></div>
  `).join("");

  showAboutSlide(currentAboutSlideIndex);

  prevAboutSlideBtn.onclick = prevAboutSlide;
  nextAboutSlideBtn.onclick = nextAboutSlide;

  if (aboutSlideInterval) clearInterval(aboutSlideInterval);
  aboutSlideInterval = setInterval(nextAboutSlide, 6000);
}

function showAboutSlide(index) {
  const slides = aboutSlidesContainer.querySelectorAll(".about-slide");
  slides.forEach(s => s.classList.remove("active"));
  slides[index].classList.add("active");
}

function nextAboutSlide() {
  currentAboutSlideIndex = (currentAboutSlideIndex + 1) % aboutSlidesData.length;
  showAboutSlide(currentAboutSlideIndex);
}

function prevAboutSlide() {
  currentAboutSlideIndex = (currentAboutSlideIndex - 1 + aboutSlidesData.length) % aboutSlidesData.length;
  showAboutSlide(currentAboutSlideIndex);
}

/* --------------------------------
   4) Reviews Slideshow
-------------------------------- */
function renderReviewsSlideshow(reviews, info) {
  // Hide entire section if fewer than 3 reviews
  if (reviews.length < 3) {
    reviewsSection.style.display = "none";
    return;
  }

  reviewsData = reviews;
  if (!reviewsData.length) {
    reviewsSlidesContainer.innerHTML = "<p class='no-reviews'>No reviews yet.</p>";
    return;
  }

  // Build slides
  reviewsSlidesContainer.innerHTML = reviews.map((review, i) => `
    <div class="review-slide" role="group" aria-roledescription="slide"
         aria-label="Review ${i + 1} of ${reviews.length}">
      <strong>${review.reviewer_name || "Anonymous"}</strong>
      <div class="review-rating">${renderStarIcons(info?.rating)}</div>
      <p>${review.review_text || "No text provided"}</p>
    </div>
  `).join("");

  // Show first slide
  showReviewSlide(currentReviewIndex);

  // Next/Prev
  prevReviewSlideBtn.onclick = prevReviewSlide;
  nextReviewSlideBtn.onclick = nextReviewSlide;

  // Auto-play
  if (reviewsInterval) clearInterval(reviewsInterval);
  reviewsInterval = setInterval(nextReviewSlide, 6000);

  // Additional link
  if (info && (info.reviews_link || info.location_reviews_link)) {
    const link = info.reviews_link || info.location_reviews_link;
    reviewsLinkArea.innerHTML = `<a href="${link}" target="_blank">More Google Reviews</a>`;
  }
}

function renderStarIcons(ratingStr) {
  const rating = parseFloat(ratingStr) || 0;
  const fullStars = Math.round(rating);
  let starHtml = "";
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starHtml += '<i class="fas fa-star"></i>';
    } else {
      starHtml += '<i class="far fa-star"></i>';
    }
  }
  return starHtml;
}

function showReviewSlide(index) {
  const slides = reviewsSlidesContainer.querySelectorAll(".review-slide");
  slides.forEach(s => s.classList.remove("active", "previous"));

  // Mark previous slide for transitions if you want
  const prevIndex = (index - 1 + slides.length) % slides.length;
  slides[prevIndex].classList.add("previous");

  slides[index].classList.add("active");
  currentReviewIndex = index;
}

function nextReviewSlide() {
  showReviewSlide((currentReviewIndex + 1) % reviewsData.length);
}

function prevReviewSlide() {
  showReviewSlide((currentReviewIndex - 1 + reviewsData.length) % reviewsData.length);
}

/* --------------------------------
   5) Gallery Slideshow
-------------------------------- */
function renderGallerySlideshow(galleryArr) {
  galleryData = galleryArr;
  if (!galleryData.length) {
    gallerySlidesContainer.innerHTML = "<p>No gallery images.</p>";
    prevGallerySlideBtn.style.display = "none";
    nextGallerySlideBtn.style.display = "none";
    return;
  }

  gallerySlidesContainer.innerHTML = galleryArr.map(url => `
    <div class="gallery-slide" style="background-image: url('${url}')"></div>
  `).join("");

  showGallerySlide(currentGalleryIndex);
  prevGallerySlideBtn.onclick = prevGallerySlide;
  nextGallerySlideBtn.onclick = nextGallerySlide;

  if (galleryInterval) clearInterval(galleryInterval);
  galleryInterval = setInterval(nextGallerySlide, 6000);
}

function showGallerySlide(index) {
  const slides = gallerySlidesContainer.querySelectorAll(".gallery-slide");
  slides.forEach(s => s.classList.remove("active"));
  slides[index].classList.add("active");
}
function nextGallerySlide() {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
  showGallerySlide(currentGalleryIndex);
}
function prevGallerySlide() {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
  showGallerySlide(currentGalleryIndex);
}

/* --------------------------------
   6) Location
-------------------------------- */
function renderLocation(info) {
  if (!info) {
    serviceAreaInfo.textContent = "No location data.";
    return;
  }
  const { city, state, postal_code, latitude, longitude } = info;
  let locationText = "We proudly serve your area!";
  if (city || state || postal_code) {
    locationText = `We proudly serve ${city || "Unknown City"}${state ? ", " + state : ""}${postal_code ? " " + postal_code : ""} and nearby areas.`;
  }
  serviceAreaInfo.textContent = locationText;

  if (latitude && longitude) {
    const mapIframe = document.createElement("iframe");
    mapIframe.width = "100%";
    mapIframe.height = "100%";
    mapIframe.style.border = "0";
    mapIframe.src = `https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`;
    mapArea.appendChild(mapIframe);
  } else {
    mapArea.innerHTML = "<p>No map data available.</p>";
  }
}

/* --------------------------------
   7) Footer
-------------------------------- */
function renderFooter(business) {
  const info = business.businessInfo || {};
  const currentYear = new Date().getFullYear();
  if (footerYear) footerYear.textContent = currentYear;

  let html = `
    <p><strong>${business.businessName || "Business Name"}</strong></p>
    <p>Address: ${info.full_address || "N/A"}</p>
    <p>Rating: ${info.rating || "N/A"} (${info.reviews || 0} reviews)</p>
    <p>Hours: ${info.working_hours || "Not available"}</p>
  `;
  footerContent.innerHTML = html;
}

/* --------------------------------
   8) Contact Form Submission (Optional)
-------------------------------- */
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameVal = e.target.formName.value.trim();
    const emailVal = e.target.formEmail.value.trim();
    const msgVal   = e.target.formMessage.value.trim();
    alert(`Thanks, ${nameVal}! We'll be in touch at ${emailVal} soon.`);
    contactForm.reset();
  });
}
