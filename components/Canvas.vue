<template>
  <div class="flex flex-row">
    <!-- Canvas Element -->
    <canvas ref="canvasEl" width="600" height="600" style="border: 1px solid #999999; border-radius: 50px;"></canvas>
    <!-- List of objects with drag-and-drop -->
    <div class="object-list">
      <draggable v-model="objectList" @end="onDrop">
        <template #item="{ element }">
          <div class="object-item">
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>
    <!-- Controls for shapes and text -->
    <div class="controls">
      <button @click="downloadCanvasAsImage">Download Canvas as Image</button><br />
      BG Color: <input type="color" v-model="canvasStore.options.backgroundColor" @change="updateCanvasBackgroundColor"><br />
       <!-- Background Image Upload -->
      <label for="bgImageUpload">Upload Background Image:</label><br /><br />
      <button @click="sendBackwards">Send Backward</button>
<button @click="bringForward">Bring Forward</button><br />
      <input type="file" id="bgImageUpload" @change="uploadBackgroundImage" accept="image/*"><br />
      <button @click="addSquare"><Icon name="tdesign:add-rectangle" title="Add Square" color="black" size="30" /></button>
      <button @click="addCircle"><Icon name="tdesign:add-circle" title="Add Circle" color="black" size="30" /></button>
      <button @click="removeSelected"><Icon name="tdesign:delete" title="Remove Selected" color="black" size="30" /></button>
      <input type="color" v-model="canvasStore.selectedColor" @change="changeColor" />
      
      <!-- Controls for text customization -->
      <div>
        <textarea v-model="canvasStore.textContent" class="w-[400px] border" placeholder="Enter multi-line text" @input="updateTextContent" rows="5" cols="15" /><br />
        <select v-model="canvasStore.selectedFont" @change="updateFont">
          <option v-for="font in canvasStore.fonts" :key="font" :value="font">{{ font }}</option>
        </select>
        <input type="number" v-model="canvasStore.fontSize" @input="updateFontSize" placeholder="Font Size" />
        <input type="color" v-model="canvasStore.textColor" @change="updateTextColor" />

        <!-- Text alignment options -->
        <select v-model="textAlignment" @change="updateTextAlign">
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRapStore } from "~/stores/rap";
import { useCanvasStore } from "~/stores/canvas";
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as fabric from 'fabric'; // v6
import draggable from 'vuedraggable';  // Import vuedraggable

const rapStore = useRapStore()
const canvasStore = useCanvasStore()

const canvasEl = ref<HTMLCanvasElement | null>(null);
let canvas: fabric.Canvas | null = null;

const objectList = ref([]);  // List of objects on the canvas
let defaultText = null;

onMounted(async() => {
  await nextTick();
  if (canvasEl.value) {
    // Initialize Fabric.js canvas
    canvas = new fabric.Canvas(canvasEl.value, canvasStore.options);

    console.log("Canvas initialized:", canvas);


    const activeObject = canvas?.getActiveObject();
    if (activeObject && typeof activeObject.sendBackwards === 'function') {
      activeObject.sendBackwards();
    } else {
      console.error("sendBackwards is not a function on the active object");
    }
    // Check if functions exist
    console.log("Canvas has sendBackwards:", typeof canvas.sendBackwards === "function");
    console.log("Canvas has bringForward:", typeof canvas.bringForward === "function");

    // Add default multi-line text field to the canvas
    defaultText = new fabric.Textbox(canvasStore.textContent, canvasStore.textboxDefaults);
    canvas.add(defaultText);
    objectList.value.push({ name: 'Text', object: defaultText });
    console.log("Canvas:", canvas);
    console.log("Canvas has sendBackwards:", typeof canvas.sendBackwards === "function");
    console.log("Canvas has bringForward:", typeof canvas.bringForward === "function");
    // Optional: Set default selection style for active objects
    canvas.selection = true;

    // Add basic event listeners (e.g., selection updates)
    canvas.on('selection:updated', () => {
      console.log("Object selected: ", canvas?.getActiveObject());
    });
    canvas.renderAll();
    if (canvas) {
      console.log('Canvas initialized:', canvas);
      // Add objects and other functionality
    }
    console.log("canvas.moveTo exists:", typeof canvas.moveTo === 'function');
  }
});

onBeforeUnmount(() => {
  if (canvas) {
    canvas.dispose();  // Clean up the canvas when the component is destroyed
  }
});

const sendBackwards = () => {
  const activeObject = canvas?.getActiveObject();
  if (activeObject && typeof activeObject.sendBackwards === "function") {
    activeObject.sendBackwards();
    canvas?.renderAll();
  } else {
    console.error("No active object or method sendBackwards is not available");
  }
};

const bringForward = () => {
  const activeObject = canvas?.getActiveObject();
  if (activeObject) {
    console.log("Active object:", activeObject); // Log the active object to check
    if (typeof activeObject.bringForward === "function") {
      activeObject.bringForward();
      canvas?.renderAll();
    } else {
      console.error("Method bringForward is not available on this object");
    }
  } else {
    console.error("No active object selected");
  }
};

const downloadCanvasAsImage = () => {
  // Show confirmation dialog
  const confirmDownload = confirm("Are you sure you want to download the canvas image?");
  
  if (confirmDownload) {
    if (canvas) {
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1.0,
      });

      // Create a link element and simulate a click to download the image
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'canvas-image.png'; // Specify the file name
      link.click();
    } else {
      console.error("Canvas is not initialized");
    }
  } else {
    console.log("Download canceled by user.");
  }
};
  


const updateCanvasBackgroundColor = () => {
  nextTick(() => {
    // Update the background color in the store
    canvasStore.updateBackgroundColor(canvasStore.options.backgroundColor); 
    // Update the canvas background color using Fabric.js
    if (canvas) {
        console.log("Setting bg colors");
        canvas.setBackgroundColor(canvasStore.options.backgroundColor, canvas.renderAll.bind(canvas));
    }
  })
}

const uploadBackgroundImage = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0] && canvas) {
    const reader = new FileReader();
    reader.onload = function (e: ProgressEvent<FileReader>) {
      const imgSrc = e.target?.result as string;
      const image = new Image();
      image.src = imgSrc;
      image.onload = () => {
        const imgElement = new fabric.Image(image);
        console.log("Image loadeds:", imgElement);

        // Set as background
        canvas.setBackgroundImage(imgElement, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width ? canvas.width / imgElement.width! : 1,
          scaleY: canvas.height ? canvas.height / imgElement.height! : 1,
        });
      };
    };
    reader.readAsDataURL(input.files[0]);
  }
};



// Function to add a new square
const addSquare = () => {
  const square = new fabric.Rect(canvasStore.squareDefaults);
  canvas?.add(square);
  objectList.value.push({ name: 'Rectangle', object: square });
};

// Function to add a new circle
const addCircle = () => {
  const circle = new fabric.Circle(canvasStore.circleDefaults);
  canvas?.add(circle);
  objectList.value.push({ name: 'Circle', object: circle });
};

// Function to remove the selected object from the canvas
const removeSelected = () => {
  const activeObject = canvas?.getActiveObject();
  if (activeObject) {
    canvas?.remove(activeObject);
  }
};

// Function to change the color of the selected object
const changeColor = () => {
  const activeObject = canvas?.getActiveObject();
  if (activeObject) {
    activeObject.set('fill', canvasStore.selectedColor);
    canvas?.renderAll(); // Re-render the canvas to apply changes
  }
};

// Function to update the text content on the canvas
const updateTextContent = () => {
  if (defaultText) {
    defaultText.set('text', canvasStore.textContent);
    canvas?.renderAll();
  }
};

// Function to update the font family of the text
const updateFont = () => {
  // Update the selected font in the store
  canvasStore.updateSelectedFont(canvasStore.selectedFont);

  if (defaultText) {
    defaultText.set('fontFamily', canvasStore.selectedFont);
    canvas?.renderAll();
  }
};

// Function to update the font size of the text
const updateFontSize = () => {
  if (defaultText) {
    defaultText.set('fontSize', parseInt(canvasStore.fontSize));
    canvas?.renderAll();
  }
};

// Function to update the text color
const updateTextColor = () => {
  if (defaultText) {
    defaultText.set('fill', canvasStore.textColor);
    canvas?.renderAll();
  }
};

// Function to update the text alignment
const updateTextAlign = () => {
  if (defaultText) {
    defaultText.set('textAlign', canvasStore.textAlignment);
    canvas?.renderAll();
  }
};

// Function to handle drop event
const onDrop = () => {
if (canvas) {
  // Update z-index order on canvas based on objectList order
  objectList.value.forEach((item, index) => {
    canvas.moveTo(item.object, index);
  });

  console.log("Helloooo");  // This will log after nextTick resolves
}
  // Render canvas after reordering
  canvas.renderAll();
};
</script>

<style scoped>
.controls {
  margin-top: 20px;
}

button {
  margin-right: 10px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

input, select, textarea {
  margin-right: 10px;
  padding: 5px;
  font-size: 16px;
}

.layer-controls {
  margin-top: 10px;
}

.object-list {
  margin-left: 20px;
  width: 200px;
}

.object-item {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  background-color: #f9f9f9;
  cursor: grab;
}

.object-item:active {
  cursor: grabbing;
}
</style>
