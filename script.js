// Main JavaScript for Real Estate Portfolio

document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for fixed navbar
          behavior: "smooth",
        });

        // Close mobile menu if open
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse.classList.contains("show")) {
          navbarCollapse.classList.remove("show");
        }
      }
    });
  });

  // Active navigation highlighting based on scroll position
  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;

    document.querySelectorAll("section, header").forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        document.querySelectorAll(".navbar-nav a").forEach((navLink) => {
          navLink.classList.remove("active");
          if (navLink.getAttribute("href") === "#" + sectionId) {
            navLink.classList.add("active");
          }
        });
      }
    });
  });

  // Scroll to top button visibility
  const scrollToTopButton = document.querySelector(".scroll-to-top");

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      scrollToTopButton.classList.add("active");
    } else {
      scrollToTopButton.classList.remove("active");
    }
  });

  // Add fixed background color to navbar when scrolling
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
      navbar.style.backgroundColor = "rgba(0, 83, 166, 1)"; // Xanh dương đậm
    } else {
      navbar.style.backgroundColor = "rgba(0, 83, 166, 0.9)"; // Xanh dương đậm với độ trong suốt
    }
  });

  // Load property data from Google Sheet
  loadPropertyData();
});

// Function to load property data from Google Sheet
function loadPropertyData() {
  // URL của Google Sheet được xuất bản dưới dạng HTML
  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRi1ZyjR__6YDErmrUqGdgxd15hKKG4V5KKR0gWPFPXCibGC7TYeQwqM4gZkO9aeC50T-dTG-_bepBy/pubhtml?gid=354537414&single=true";

  fetch(sheetURL)
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const rows = doc.querySelectorAll("table tbody tr");

      const propertyList = document.getElementById("propertyList");
      propertyList.innerHTML = ""; // Clear loading spinner

      // Skip header (first row)
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll("td");

        // Check if we have enough cells with data
        if (cells.length >= 4 && cells[0].textContent.trim() !== "") {
          const name = cells[0].textContent.trim();
          const address = cells[1].textContent.trim();
          const price = cells[2].textContent.trim();
          const imageUrl = cells[3].textContent.trim();

          // Create property card
          const propertyCard = document.createElement("div");
          propertyCard.className = "col-lg-4 col-md-6 mb-4";

          // Use placeholder if image URL is empty
          const imgSrc = imageUrl || "images/property-placeholder.jpg";

          propertyCard.innerHTML = `
              <div class="property-card">
                <img src="${imgSrc}" alt="${name}" class="property-img">
                <div class="property-info">
                  <h3 class="property-name">${name}</h3>
                  <p class="property-address">${address}</p>
                  <div class="property-price">${price}</div>
                  <span class="property-type">Đang mở bán</span>
                  <div class="mt-3">
                    <a href="#contact" class="btn btn-sm btn-outline-primary">Liên hệ ngay: 0946 314286</a>
                  </div>
                </div>
              </div>
            `;

          propertyList.appendChild(propertyCard);
        }
      }

      // If no properties were loaded
      if (propertyList.children.length === 0) {
        propertyList.innerHTML =
          '<div class="col-12 text-center"><p>Không có dự án nào được tìm thấy.</p></div>';
      }
    })
    .catch((err) => {
      console.error("Lỗi tải dữ liệu từ Google Sheet:", err);
      document.getElementById("propertyList").innerHTML =
        '<div class="col-12 text-center"><p class="text-danger">Lỗi tải dữ liệu từ Google Sheet!</p></div>';
    });
}

// Handle form submissions
document.addEventListener("DOMContentLoaded", function () {
  // Newsletter form
  const newsletterForm = document.querySelector(".newsletter-form form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      if (emailInput.value) {
        alert("Cảm ơn bạn đã đăng ký nhận thông báo!");
        emailInput.value = "";
      }
    });
  }

  // Contact form
  const contactForm = document.querySelector(".contact-form form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert(
        "Cảm ơn bạn đã gửi tin nhắn. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất!"
      );
      this.reset();
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Lấy các phần tử
  const zaloBtn = document.querySelector(".zalo-btn");
  const zaloQrPopup = document.getElementById("zaloQrPopup");
  const qrClose = document.querySelector(".qr-close");

  // Hiển thị popup khi click vào nút Zalo
  zaloBtn.addEventListener("click", function (e) {
    e.preventDefault(); // Ngăn chặn hành vi mặc định (chuyển hướng)
    zaloQrPopup.style.display = "block";
  });

  // Đóng popup khi click vào nút close
  qrClose.addEventListener("click", function () {
    zaloQrPopup.style.display = "none";
  });

  // Đóng popup khi click bên ngoài
  window.addEventListener("click", function (e) {
    if (e.target == zaloQrPopup) {
      zaloQrPopup.style.display = "none";
    }
  });
});
