// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// === Database Path Configuration ===
// This path should be defined globally (e.g., in index.html)
// Example: <script>window.SENSOR_DATA_PATH = "/data/sensor data/";</script>
const DATABASE_PATH = window.SENSOR_DATA_PATH || "/your/path/here";

let isPaused = false;
const pauseButton = document.getElementById('pause-btn');
const statusMessage = document.getElementById('status-msg');

// Function to update the sensor data
function updateSensorData(sensorData) {
  if (isPaused) return;

  if (sensorData.exists()) {
    const data = sensorData.val();
    const latestEntry = Object.values(data).pop();

    if (latestEntry) {
      document.getElementById('temp-value').innerText = latestEntry.Temperature || '--';
      document.getElementById('hum-value').innerText = latestEntry.Humidity || '--';
      document.getElementById('soil-value').innerText = latestEntry.SoilMoisture || '--';
      statusMessage.innerText = 'Data is up-to-date';
      statusMessage.style.color = 'green';
    } else {
      statusMessage.innerText = 'Latest entry does not have expected data.';
      statusMessage.style.color = 'red';
    }
  } else {
    statusMessage.innerText = 'No data available';
    statusMessage.style.color = 'red';
  }
}

// Monitor the database for changes
function monitorDatabase() {
  const refPath = db.ref(DATABASE_PATH);
  refPath.on('value', (sensorData) => {
    updateSensorData(sensorData);
  });
}

monitorDatabase();

// Pause/resume button functionality
pauseButton.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseButton.innerHTML = isPaused
    ? '<i class="fas fa-play-circle"></i> Resume'
    : '<i class="fas fa-pause-circle"></i> Pause';
  statusMessage.innerText = isPaused ? 'Update is paused' : 'Resuming...';
  statusMessage.style.color = isPaused ? 'orange' : 'green';
});
