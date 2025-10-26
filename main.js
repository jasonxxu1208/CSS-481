const canvas = document.getElementById("rplaceCanvas");
const ctx = canvas.getContext("2d");

// Scale factor so the data fits nicely on canvas
const SCALE = 3;

// Load dataset
fetch("data_sample.json")
  .then(res => res.json())
  .then(data => {
    // Initial draw
    drawPixels(data);

    // ===== Helper functions =====
    function drawPixels(pixels) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pixels.forEach(p => {
        const [x, y] = p.coordinate.split(",").map(Number);
        ctx.fillStyle = p.pixel_color;
        ctx.fillRect(x / SCALE, y / SCALE, 2, 2);
      });
    }

    function summarize(pixels) {
      const total = pixels.length;
      const users = new Set(pixels.map(p => p.user_id)).size;
      const colorCount = pixels.reduce((acc, p) => {
        acc[p.pixel_color] = (acc[p.pixel_color] || 0) + 1;
        return acc;
      }, {});
      const topColor = Object.entries(colorCount).sort((a,b) => b[1]-a[1])[0][0];

      const section = document.getElementById("sectionSummary");
      section.innerHTML = `
        <p style="color:#FF5700;">Total Pixels: ${total}</p>
        <p>Unique Users: ${users}</p>
        <p>Most Frequent Color: <span style="color:${topColor}">${topColor}</span></p>
      `;
    }

    // ===== Button Event Listeners =====
    document.getElementById("showAll").onclick = () => {
      drawPixels(data);
      summarize(data);
    };

    document.getElementById("filterBlue").onclick = () => {
      const filtered = data.filter(p => p.pixel_color === "#94B3FF");
      drawPixels(filtered);
      summarize(filtered);
    };

    document.getElementById("filterPurple").onclick = () => {
      const filtered = data.filter(p => p.pixel_color === "#6A5CFF");
      drawPixels(filtered);
      summarize(filtered);
    };

    document.getElementById("recent").onclick = () => {
      const recent = [...data]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 200); // show latest 200 pixels
      drawPixels(recent);
      summarize(recent);
    };

    document.getElementById("summary").onclick = () => summarize(data);
  })
  .catch(err => {
    console.error("Error loading data_sample.json:", err);
  });
