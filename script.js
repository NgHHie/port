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

  // Load property data from the API
  loadPropertyData();

  // Newsletter form
  const newsletterForm = document.querySelector(".newsletter-form form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      if (emailInput.value) {
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ...';

        // Send subscription to API
        fetch(config.apiBaseUrl + "/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailInput.value }),
        })
          .then((response) => response.json())
          .then((data) => {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;

            // Hiển thị cả alert và toast notification
            alert(data.message || "Cảm ơn bạn đã đăng ký nhận thông báo!");
            showSuccessToast(
              data.message || "Cảm ơn bạn đã đăng ký nhận thông báo!"
            );
            emailInput.value = "";
          })
          .catch((error) => {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;

            // Hiển thị cả alert và toast notification
            alert(
              data.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau!"
            );
            showErrorToast(
              data.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau!"
            );
          });
      }
    });
  }

  // Contact form
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = this.querySelector('input[name="name"]').value;
      const email = this.querySelector('input[name="email"]').value;
      const phone = this.querySelector('input[name="phone"]').value;
      const message = this.querySelector('textarea[name="message"]').value;

      const contactData = {
        name,
        email,
        phone,
        message,
      };

      if (!email) {
        alert("Vui lòng nhập email của bạn!");
        return;
      }

      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang gửi...';

      // Send contact info to API
      fetch(config.apiBaseUrl + "/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Reset button state
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;

          // Hiển thị cả alert và toast notification
          alert(
            data.message ||
              "Cảm ơn bạn đã gửi tin nhắn. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất!"
          );
          showSuccessToast(
            data.message ||
              "Cảm ơn bạn đã gửi tin nhắn. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất!"
          );
          this.reset();
        })
        .catch((error) => {
          // Reset button state
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;

          // Hiển thị cả alert và toast notification
          alert("Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau!");
          showErrorToast(
            "Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau!"
          );
        });
    });
  }

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

  // Update contact information and links from config
  document.getElementById("contactPhone").textContent = config.contactPhone;
  document.getElementById("contactEmail").textContent = config.contactEmail;
  document.getElementById("zaloPhone").textContent = config.zaloPhone;

  // Update Facebook links
  const facebookLinks = document.querySelectorAll("a[href*='facebook.com']");
  facebookLinks.forEach((link) => {
    link.href = config.facebookUrl;
  });
});

// Function to load property data from API
function loadPropertyData() {
  const apiURL = config.apiBaseUrl + "/api/properties";

  // Show loading spinner
  const propertyList = document.getElementById("propertyList");
  propertyList.innerHTML = `
    <div class="col-12 text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>
  `;

  fetch(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((properties) => {
      propertyList.innerHTML = ""; // Clear loading spinner

      if (properties && properties.length > 0) {
        properties.forEach((property) => {
          const propertyCard = document.createElement("div");
          propertyCard.className = "col-lg-4 col-md-6 mb-4";

          // Use placeholder if image URL is empty
          const imgSrc =
            property.image_url || "images/property-placeholder.jpg";

          propertyCard.innerHTML = `
            <div class="property-card">
              <img src="${imgSrc}" alt="${property.name}" class="property-img">
              <div class="property-info">
                <h3 class="property-name">${property.name}</h3>
                <p class="property-address">${property.address}</p>
                <div class="property-price">${property.price}</div>
                <span class="property-type">Đang mở bán</span>
                <div class="mt-3">
                  <a href="tel:${config.contactPhone}" class="btn btn-sm btn-outline-primary">Liên hệ ngay: ${config.contactPhone}</a>
                </div>
              </div>
            </div>
          `;

          propertyList.appendChild(propertyCard);
        });

        // Show success toast only if not the initial page load
        if (window.hasLoadedPropertiesBefore) {
          showSuccessToast("Đã tải danh sách dự án thành công!");
        }
        window.hasLoadedPropertiesBefore = true;
      } else {
        propertyList.innerHTML = `
          <div class="col-12">
            <div class="empty-state">
              <div class="empty-state-icon">
                <i class="fas fa-home"></i>
              </div>
              <div class="empty-state-text">Hiện chưa có dự án nào được đăng tải</div>
              <p class="text-muted">Vui lòng quay lại sau để xem các dự án mới nhất</p>
            </div>
          </div>`;
      }
    })
    .catch((error) => {
      console.error("Lỗi khi tải dữ liệu từ API:", error);
      propertyList.innerHTML = `
        <div class="col-12">
          <div class="api-error">
            <h5><i class="fas fa-exclamation-circle"></i> Không thể tải dữ liệu</h5>
            <p>Đã xảy ra lỗi khi tải danh sách dự án. Vui lòng tải lại trang hoặc thử lại sau.</p>
            <button class="btn btn-sm btn-outline-danger" onclick="loadPropertyData()">Thử lại</button>
          </div>
        </div>`;

      // Show error toast
      showErrorToast("Không thể tải danh sách dự án. Vui lòng thử lại sau!");
    });
}
