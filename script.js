document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake"); // Select the cake element
  const candleCountDisplay = document.getElementById("candleCount"); // Display active candle count
  let candles = []; // Array for candle elements
  let audioContext; // Audio context for sound detection
  let analyser; // Analyser node for sound levels
  let microphone; // Microphone input stream
  let songPlayed = false; // Flag to ensure song plays only once

  // Predefined positions for candles
  const candlePositions = [
    { left: 30, top: 20 },
    { left: 80, top: 30 },
    { left: 130, top: 10 },
    { left: 170, top: 30 },
    { left: 230, top: 30 },
    { left: 200, top: 0 },
  ];

  // Function to update active candle count
  function updateCandleCount() {
    const activeCandles = candles.filter(candle => !candle.classList.contains("out")).length;
    candleCountDisplay.textContent = activeCandles;
  }

  // Function to add candles at predefined positions
  function addCandles() {
    candlePositions.forEach((position) => {
      const candle = document.createElement("div");
      candle.className = "candle";
      candle.style.left = position.left + "px";
      candle.style.top = position.top + "px";

      const flame = document.createElement("div");
      flame.className = "flame";
      candle.appendChild(flame);

      cake.appendChild(candle);
      candles.push(candle);
    });
    updateCandleCount();
  }

  // Function to detect blowing sound and blow out candles
  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 40;
  }

  // Function to blow out candles based on sound detection
  function blowOutCandles() {
    let blownOut = 0;

    if (isBlowing()) {
      candles.forEach((candle) => {
        if (!candle.classList.contains("out") && Math.random() > 0.5) {
          candle.classList.add("out");
          blownOut++;
        }
      });
    }

    if (blownOut > 0) {
      updateCandleCount();
    }

    if (candles.every(candle => candle.classList.contains("out"))) {
      triggerCelebration();
    }
  }

  // Function to trigger the celebration when all candles are blown out
  // Function to trigger the celebration when all candles are blown out
function triggerCelebration() {
  if (!songPlayed) {
    songPlayed = true;
    cake.classList.add("celebration-animation"); // Add spinning zoom effect

    let song = new Audio('Happy.mp3');
    song.play();

    song.onended = function () {
      zoomCakeAndOpenNextHTML(); // After the song ends, zoom cake and open next HTML
    };
  }
}

// Function to zoom the cake and open a new HTML file after the song ends
function zoomCakeAndOpenNextHTML() {
  cake.classList.add("zoom-animation"); // Apply zoom effect

  // Wait for the animation to finish before opening the next page
  setTimeout(function () {
    openHTMLFile(); // Open the next HTML file after animation finishes
  }, 1000); // 1000ms for the zoom effect duration (adjust as needed)
}

// Function to open a new HTML file after the zoom effect
function openHTMLFile() {
  window.location.href = 'index1.html'; // Replace with your desired URL
}


  // Function to zoom the cake and open a new HTML file after the song ends
  function zoomCakeAndOpenNextHTML() {
    cake.classList.add("zoom-animation"); // Apply zoom effect

    // Wait for the animation to finish before opening the next page
    setTimeout(function () {
      openHTMLFile();
    }, 1000); // 1000ms for the zoom effect duration (adjust as needed)
  }

  // Function to open a new HTML file after the zoom effect
  function openHTMLFile() {
    window.location.href = 'index1.html'; // Replace with your desired URL
  }

  // Initialize microphone for detecting sound
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;

        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  }

  addCandles();

  // Add draggable functionality to the image
  const movableImage = document.getElementById("movableImage");

  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  // Mouse down event to start dragging
  movableImage.addEventListener("mousedown", function (e) {
    isDragging = true;

    // Calculate the offset from mouse click to image position
    const imageRect = movableImage.getBoundingClientRect(); // Ensure this works correctly
    offsetX = e.clientX - imageRect.left;
    offsetY = e.clientY - imageRect.top;

    document.addEventListener("mousemove", moveImage);
    document.addEventListener("mouseup", stopDragging);
  });

  // Move the image as the mouse moves
  function moveImage(e) {
    if (isDragging) {
      const newLeft = e.clientX - offsetX;
      const newTop = e.clientY - offsetY;

      // Optionally, add boundaries here (if you want the image to stay inside the cake)
      movableImage.style.left = newLeft + "px";
      movableImage.style.top = newTop + "px";
    }
  }

  // Stop dragging when mouse is released
  function stopDragging() {
    isDragging = false;
    document.removeEventListener("mousemove", moveImage);
    document.removeEventListener("mouseup", stopDragging);
  }
});
