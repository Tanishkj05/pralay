// Handle location capture
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  document.getElementById("latitude").value = position.coords.latitude.toFixed(6);
  document.getElementById("longitude").value = position.coords.longitude.toFixed(6);
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    default:
      alert("An unknown error occurred.");
      break;
  }
}

// Preview media before uploading
document.getElementById('media').addEventListener('change', function(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('preview');
  preview.innerHTML = '';

  if (file) {
    const fileType = file.type.split('/')[0];
    const fileURL = URL.createObjectURL(file);

    if (fileType === 'image') {
      const img = document.createElement('img');
      img.src = fileURL;
      img.alt = "Hazard Image Preview";
      preview.appendChild(img);
    } else if (fileType === 'video') {
      const video = document.createElement('video');
      video.src = fileURL;
      video.controls = true;
      preview.appendChild(video);
    }
  }
});

// Save report data and show success message
document.getElementById('hazardForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const description = document.getElementById('description').value.trim();
  const latitude = document.getElementById('latitude').value.trim();
  const longitude = document.getElementById('longitude').value.trim();
  const fileInput = document.getElementById('media').files[0];

  if (!description || !latitude || !longitude || !fileInput) {
    alert("Please fill out all fields and upload media.");
    return;
  }

  const fileURL = URL.createObjectURL(fileInput);

  // Create hazard object
  const hazardReport = {
    id: Date.now(),
    description: description,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    mediaType: fileInput.type.split('/')[0], // "image" or "video"
    mediaURL: fileURL,
    timestamp: new Date().toLocaleString()
  };

  // Retrieve old reports and add new one
  let hazardData = JSON.parse(localStorage.getItem('hazardReports')) || [];
  hazardData.push(hazardReport);
  localStorage.setItem('hazardReports', JSON.stringify(hazardData));

  // Show success message
  document.getElementById('successMessage').style.display = 'block';

  // Reset form
  document.getElementById('hazardForm').reset();
  document.getElementById('preview').innerHTML = '';
});

