const statusText = document.getElementById("status");
const arTarget = document.getElementById("arTarget");

// 経路案内する地点のリスト（各地点に異なる音声 & 画像）
const destinations = [
    { name: "チェックポイント1", lat: 35.6895, lon: 139.6917, audio: "audio1.mp3", arImage: "ar1.png" },
    { name: "チェックポイント2", lat: 35.6905, lon: 139.6927, audio: "audio2.mp3", arImage: "ar2.png" },
    { name: "チェックポイント3", lat: 35.6915, lon: 139.6937, audio: "audio3.mp3", arImage: "ar3.png" },
    { name: "最終地点", lat: 35.6925, lon: 139.6947, audio: "goal.mp3", arImage: "goal.png" }
];

let currentDestinationIndex = 0;
let currentAudio = null; // 現在再生中の音声

// GPS追跡を開始
function startTracking() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(checkPosition, handleError, { enableHighAccuracy: true });
    } else {
        alert("GPSがサポートされていません");
    }
}

// 位置情報を監視し、目的地に近づいたら音声 & AR表示
function checkPosition(position) {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
    const target = destinations[currentDestinationIndex];

    const distance = getDistance(userLat, userLon, target.lat, target.lon);
    statusText.innerText = `現在地: ${userLat}, ${userLon} -> ${target.name}まで${Math.round(distance)}m`;

    if (distance < 10) { // 10m以内に入ったら案内開始
        playAudio(target.audio);
        showAR(target.arImage);
        currentDestinationIndex++;

        if (currentDestinationIndex >= destinations.length) {
            alert("🎉 すべてのチェックポイントを通過し、目的地に到着しました！ 🎉");
        }
    }
}

// 2地点間の距離を計算（Haversine公式）
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // 地球の半径（m）
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // 距離（m）
}

// 音声を再生（再生中の音声を止めて新しい音声を再生）
function playAudio(audioFile) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(audioFile);
    currentAudio.play();
}

// AR画像を表示
function showAR(imagePath) {
    arTarget.setAttribute("src", imagePath);
}

// 位置情報エラー処理
function handleError(error) {
    console.error("位置情報エラー:", error);
}

if (currentDestinationIndex >= destinations.length) {
    alert("到着です");
}

startTracking();
