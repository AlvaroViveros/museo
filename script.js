// Lista de videos y sus JSON correspondientes
const videoData = [
    { video: "Portafolio/Videos/Piso 1.mp4", json: "Piso_1.json", carpeta: "1er piso" },
    { video: "Portafolio/Videos/Piso -1.mp4", json: "Piso_.1.json", carpeta: "-1 piso"  },
    { video: "Portafolio/Videos/Piso 2.mp4", json: "Piso_2.json", carpeta: "2do piso" },
    { video: "Portafolio/Videos/Piso 3.mp4", json: "Piso_3.json", carpeta: "3er piso" },
];

let currentVideoIndex = 0; // Índice del video actual

// Función para cargar un video y sus imágenes
function cargarVideo(index) {
    if (index >= videoData.length) {
        console.log("Todos los videos han sido reproducidos.");
        return;
    }

    const videoElement = document.getElementById("miVideo");
    const sourceElement = videoElement.querySelector("source");

    // Establecer el video actual
    const videoInfo = videoData[index];
    sourceElement.src = videoInfo.video;
    videoElement.load();

    // Cargar y procesar el JSON correspondiente
    fetch(videoInfo.json)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            inicializar(data, videoInfo.carpeta); // Procesar las imágenes del JSON
        })
        .catch(error => {
            console.error('Error al cargar o procesar el JSON:', error);
        });

    // Reproducir el video
    // videoElement.play();
}

// Evento para pasar al siguiente video al terminar
document.getElementById("miVideo").addEventListener("ended", () => {
    currentVideoIndex++;
    cargarVideo(currentVideoIndex);
});

// Cargar el primer video al iniciar
cargarVideo(currentVideoIndex);

// Función principal para procesar el JSON
function inicializar(jsonData, carpeta) {
    const videoContainer = document.getElementById("contenedorVideo");
    const videoElement = document.getElementById("miVideo");
    const sourceElement = videoElement.querySelector("source");

    // Obtener el nombre del video desde el primer elemento del JSON
    const videoFileName = jsonData[0].Vídeo;
    sourceElement.src = `Portafolio/Videos/${videoFileName}`;
    videoElement.load();

    // Obtener dimensiones del contenedor
    const containerWidth = videoContainer.offsetWidth;
    const containerHeight = videoContainer.offsetHeight;

    const sectorWidth = containerWidth / 5; // Ancho de cada sector
    const sectorHeight = containerHeight / 5; // Altura de cada sector

    // Crear dinámicamente los enlaces y las imágenes
    jsonData.forEach((item, index) => {
        const link = document.createElement("a");
        link.href = item.Gelería;
        link.id = `link-${index}`;
        link.target = "_blank";
        link.style.position = "absolute";
        link.style.display = "none"; // Inicialmente oculto

        // Cargar la imagen para obtener sus dimensiones reales
        const img = document.createElement("img");
        const tempImage = new Image(); // Objeto temporal para cargar la imagen
        tempImage.src = `Portafolio/Fotos portafolio/${carpeta}/${item.Imagen}.jpg`;

        tempImage.onload = () => {
            // Calcular dimensiones reducidas manteniendo la proporción
            const originalWidth = tempImage.naturalWidth;
            const originalHeight = tempImage.naturalHeight;
            const reducedWidth = originalWidth * 0.14; // Reducir al 20%
            const reducedHeight = (originalHeight / originalWidth) * reducedWidth;

            // Calcular fila y columna del sector
            const fila = Math.floor(item.Posición / 5);
            const columna = item.Posición % 5;

            // Calcular las coordenadas del centro del sector
            const centerX = columna * sectorWidth + sectorWidth / 2;
            const centerY = fila * sectorHeight + sectorHeight / 2;

            // Ajustar las coordenadas para centrar la imagen
            link.style.left = `${centerX - reducedWidth / 2}px`;
            link.style.top = `${centerY - reducedHeight / 2}px`;

            // Establecer las dimensiones calculadas en el elemento <img>
            img.src = tempImage.src;
            img.width = reducedWidth;
            img.height = reducedHeight;
            img.alt = `Imagen ${index + 1}`;

            link.appendChild(img);
            videoContainer.appendChild(link);
        };
    });

    // Mostrar/ocultar enlaces según el tiempo del video
    videoElement.addEventListener("timeupdate", () => {
        const currentTime = videoElement.currentTime;

        jsonData.forEach((item, index) => {
            const linkId = `link-${index}`;
            const linkElement = document.getElementById(linkId);

            if (currentTime >= item.SegundosDesde && currentTime <= item.SegundosHasta) {
                linkElement.style.display = "block";
            } else {
                linkElement.style.display = "none";
            }
        });
    });
}
