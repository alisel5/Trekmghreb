let hotelInfo;

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const hotelKey = urlParams.get("key");

    if (!hotelKey) {
        alert("No hotel key provided in the URL!");
        return;
    }

    fetch("hotel_info.json")
        .then((response) => response.json())
        .then((data) => {
            hotelInfo = data[hotelKey];
            if (!hotelInfo) {
                alert("Invalid hotel key provided!");
                return;
            }

            // Update hotel details
            document.getElementById("hotel-title").innerText = hotelInfo.title;
            document.getElementById("hotel-location").innerText = hotelInfo.location;
            document.getElementById("rating-value").innerText = hotelInfo.rating;

            // Populate photos
            const photoGrid = document.getElementById("photo-grid");
            hotelInfo.photos.forEach((photoUrl) => {
                const img = document.createElement("img");
                img.src = photoUrl;
                img.alt = "Hotel Photo";
                photoGrid.appendChild(img);
            });

            // Populate amenities
            const amenitiesList = document.getElementById("amenities-list");
            hotelInfo.amenities.forEach((amenity) => {
                const amenityDiv = document.createElement("div");
                amenityDiv.innerText = amenity;
                amenitiesList.appendChild(amenityDiv);
            });

            // Update price
            document.getElementById("price").innerText = `$${hotelInfo.price}/night`;
        })
        .catch((error) => console.error("Error fetching hotel info:", error));

    // Reserve button functionality
    const reserveButton = document.getElementById("reserve-btn");
    reserveButton.addEventListener("click", () => {
        const checkIn = document.getElementById("check-in").value;
        const checkOut = document.getElementById("check-out").value;

        if (!checkIn || !checkOut) {
            alert("Please select both check-in and check-out dates.");
            return;
        }

        const totalPrice = calculateTotal();
        if (totalPrice > 0) {
            alert(`Reservation confirmed from ${checkIn} to ${checkOut}! Total Price: $${totalPrice}`);
        }
    });

    // Attach event listeners to calculate total price when dates are selected
    document.getElementById("check-in").addEventListener("input", updateTotalPrice);
    document.getElementById("check-out").addEventListener("input", updateTotalPrice);
});

// Function to calculate the total price based on selected dates
function calculateTotal() {
    const checkInInput = document.getElementById("check-in").value;
    const checkOutInput = document.getElementById("check-out").value;

    if (checkInInput && checkOutInput) {
        const checkInDate = new Date(checkInInput);
        const checkOutDate = new Date(checkOutInput);

        // Calculate the difference in days
        const timeDiff = checkOutDate - checkInDate;
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

        if (days > 0) {
            const totalPrice = days * hotelInfo.price;
            return totalPrice;
        }
    }
    return 0; // Return 0 if dates are invalid or not selected
}

// Function to update total price dynamically in the UI
function updateTotalPrice() {
    const totalPrice = calculateTotal();
    if (totalPrice > 0) {
        document.getElementById("total-price").innerText = `Total: $${totalPrice}`;
    } else {
        document.getElementById("total-price").innerText = "Invalid dates selected!";
    }
}
