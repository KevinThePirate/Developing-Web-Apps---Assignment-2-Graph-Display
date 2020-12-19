// (x, y , width, height)
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let barValues = [];
const defaultColors = [
  "ffffff",
  "55415f",
  "646964",
  "d77355",
  "508cd7",
  "64b964",
  "e6c86e",
  "dcf5ff",
];
let currentColors = defaultColors;
const render = () => {
  let bars = document.querySelectorAll(".bar-height-slider");
  let numOfBars = document.getElementById("quantity").value;
  let maxWidth = document.getElementById("max-width-slider").value / 100;
  let indivWidth = document.getElementById("indiv-width-slider").value / 100;
  let maxHeight =
    (canvas.height * (document.getElementById("height-slider").value / 100)) /
    100;
  const canWidth = canvas.width * maxWidth;
  let lastAdd = 0;
  let sliderCount = document.querySelectorAll(".bar-height-slider").length;
  const caption = document.getElementById("text-display").value;
  const generateSlider = (num) => {
    num++;
    num += sliderCount;
    console.log({ sliderCount });
    const slider = document.getElementById("chart-slider-area");
    slider.innerHTML += `<div><label>Value ${num} </label><input type="range" min="0" max="100" value="50" class="bar-height-slider" id='${num}'><span>1</span></div>`;
  };
  bars = document.querySelectorAll(".bar-height-slider");
  barValues = [];
  bars.forEach((element) => {
    barValues.push(element.value);
  });
  let currentSliders = document.getElementById("chart-slider-area").children
    .length;
  if (currentSliders < numOfBars) {
    const add = numOfBars - currentSliders;
    for (let i = 0; i < add; i++) {

      lastAdd = add;
      generateSlider(i);
    }
  } else if (currentSliders > numOfBars) {
    const sub = currentSliders - numOfBars;
    let child = document.getElementById("chart-slider-area").children;

    for (let i = sub; i > 0; i--) {

      child[i].parentNode.removeChild(child[i]);
      sliderCount = 0;

    }
    let slider = document.getElementById("chart-slider-area");
    slider.innerHTML = "";
    for (let i = 0; i < numOfBars; i++) {
      generateSlider(i);

    }
  }
  bars = document.querySelectorAll(".bar-height-slider");
  barValues = [];
  bars.forEach((element) => {
    barValues.push(element.value);
  });
  console.log({ bars });
  console.log("%cBackground", `background-color: #${currentColors[7]};`);
  context.fillStyle = "#" + currentColors[7];
  context.fillRect(0, 0, canvas.width, canvas.height);
  console.log({ barValues });
  for (let i = 0; i < numOfBars; i++) {
    const heighOfRect = barValues[i] * maxHeight;
    const barArea = canWidth / numOfBars;
    const barWidth = barArea * indivWidth;
    const centerCorrect = (barArea - barWidth) / 2;
    const startX = (canWidth / numOfBars) * i + centerCorrect;
    const startY = canvas.height - heighOfRect;
    context.beginPath();
    context.rect(
      startX, //Starting point X
      startY, //Starting point Y
      barWidth, //Width
      heighOfRect //Height
    );
    context.fillStyle = "#" + currentColors[i];
    context.fill();
    context.stroke();
    const test = i + 1;

    document.getElementById(test).nextSibling.innerHTML =
      document.getElementById(test).value + "%";
  }
  document.getElementById("height-slider").nextElementSibling.innerHTML =
    document.getElementById("height-slider").value + "%";
  document.getElementById("max-width-slider").nextElementSibling.innerHTML =
    document.getElementById("max-width-slider").value + "%";
  document.getElementById("indiv-width-slider").nextElementSibling.innerHTML =
    document.getElementById("indiv-width-slider").value + "%";

  context.fillStyle = "black";
  let textX = 700;
  let textY = 50;
  let fontSize = 32;
  context.font = `${fontSize}px Poppins`;
  let textMeasure = context.measureText(caption);
  let textWidth = textMeasure["width"];

  let textVal = document.getElementById("position").value;
  console.log({ textVal });
  if (textVal == 1) {
    textX = 10;
    textY = 40;
    context.textAlign = "start";
    context.fillRect(textX, textY - fontSize + 5, textWidth, fontSize);
  } else if (textVal == 2) {
    textX = 790;
    textY = 40;
    context.textAlign = "end";
    context.fillRect(
      textX - textWidth,
      textY - fontSize + 5,
      textWidth,
      fontSize
    );
  } else if (textVal == 3) {
    textX = 10;
    textY = 290;
    context.textAlign = "start";
    context.fillRect(textX, textY - fontSize + 5, textWidth, fontSize);
  } else if (textVal == 4) {
    textX = 790;
    textY = 290;
    context.textAlign = "end";
    context.fillRect(
      textX - textWidth,
      textY - fontSize + 5,
      textWidth,
      fontSize
    );
  }

  context.fillStyle = "white";
  context.fillText(caption, textX, textY);
};

function getData() {

  send_JSONP_Request(
    "http://www.colr.org/json/schemes/random/5?scheme_size_limit=>5&callback=processColorData&rnd=" +
      Math.random()
  );

  document.getElementById("new-colour").innerHTML = "loading...";
  document.getElementById("new-colour").style.opacity = 0.5;
}

function processColorData(data) {

  console.log(data);

  if (data.schemes.length == 0 || data.schemes[0].colors.length < 5) {
    alert("error");
  } else {
    console.log({ currentColors });
    currentColors = data.schemes[0].colors;
    console.log({ currentColors });
    render();
    var randomColours = data.schemes[0].colors;

  }

  document.getElementById("new-colour").innerHTML = "New Colours";
  document.getElementById("new-colour").style.opacity = 1;
}

function send_JSONP_Request(request) {
  const head = document.getElementsByTagName("head")[0];
  newScript = document.createElement("script");
  newScript.setAttribute("src", request);
  document.getElementsByTagName("head")[0].appendChild(newScript);
}

const resetColour = () => {
  currentColors = defaultColors;
  render();
};

const image = () => {
  const image = canvas.toDataURL();
  const imageArea = document.getElementById("image-area");
  imageArea.innerHTML = "";

  let newImage = document.createElement("img");
  newImage.setAttribute("src", image);
  imageArea.appendChild(newImage);

  let br = document.createElement("br");
  imageArea.appendChild(br);

  let test = document.createElement("a");
  test.setAttribute("href", image);
  test.setAttribute("download", "canvasOutput");
  imageArea.appendChild(test);

  let saveBtn = document.createElement("button");
  saveBtn.setAttribute("onclick", "save()");
  saveBtn.innerHTML = "Save Image";
  test.appendChild(saveBtn);

  let dismissBtn = document.createElement("button");
  dismissBtn.setAttribute("onclick", "dismiss()");
  dismissBtn.innerHTML = "Close";
  imageArea.appendChild(dismissBtn);

  imageArea.style.opacity = "1";
  imageArea.style.display = "block";
};

const dismiss = () => {
  const imageArea = document.getElementById("image-area");
  imageArea.style.opacity = "0";
  imageArea.style.display = "none";
};

const init = () => {
  document.getElementById("page").addEventListener("keyup", render);
  document.getElementById("page").addEventListener("click", render);

  document.getElementById("new-colour").addEventListener("click", getData);
  document
    .getElementById("reset-colour")
    .addEventListener("click", resetColour);
  render();
};
init();
