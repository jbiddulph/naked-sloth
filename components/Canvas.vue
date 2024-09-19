<template>
  <div class="flex flex-row">
    <!-- Canvas Element -->
    <canvas ref="canvasEl" width="600" height="600" style="border: 1px solid #999999; border-radius: 50px;"></canvas>

    <!-- Controls for shapes and text -->
    <div class="controls">
      <button @click="addSquare"><Icon name="tdesign:add-rectangle" title="Add Square" color="black" size="30" /></button>
      <button @click="addCircle"><Icon name="tdesign:add-circle" title="Add Circle" color="black" size="30" /></button>
      <button @click="removeSelected"><Icon name="tdesign:delete" title="Remove Selected" color="black" size="30" /></button>
      <input type="color" v-model="selectedColor" @change="changeColor" />
      <!-- Layer reordering buttons -->
      <div class="layer-controls">
        <button @click="bringToFront"><Icon name="tdesign:flip-to-front" title="Bring to Front" color="black" size="30" /></button>
        <button @click="sendToBack"><Icon name="tdesign:flip-to-back" title="Send to Back" color="black" size="30" /></button>
        <button @click="bringForward"><Icon name="tdesign:jump" title="Bring Forward" color="black" size="30" /></button>
        <button @click="sendBackward"><Icon name="tdesign:jump-off" title="Push Back" color="black" size="30" /></button>
      </div>
      <!-- Controls for text customization -->
      <div>
        <textarea v-model="textContent" class="w-[400px] border" placeholder="Enter multi-line text" @input="updateTextContent" rows="5" cols="15" /><br />
        <select v-model="selectedFont" @change="updateFont">
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier">Courier</option>
        </select>
        <input type="number" v-model="fontSize" @input="updateFontSize" placeholder="Font Size" />
        <input type="color" v-model="textColor" @change="updateTextColor" />

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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as fabric from 'fabric'; // v6

const rapStore = useRapStore()

const canvasEl = ref<HTMLCanvasElement | null>(null);
let canvas: fabric.Canvas | null = null;

// Store selected color for shapes
const selectedColor = ref('#ff0000');

// Store properties for text
const textContent = ref(rapStore.rapText);
const fontSize = ref(20);
const selectedFont = ref('Arial');
const textColor = ref('#000000'); // Default text color
const textAlignment = ref('left'); // Default text alignment
let defaultText = null;

onMounted(() => {
  const options = {
    backgroundColor: '#ffffff',
    selectionBorderColor: '#666666'
  };

  // Initialize Fabric.js canvas
  canvas = new fabric.Canvas(canvasEl.value, options);

  // Add default multi-line text field to the canvas
  defaultText = new fabric.Textbox(textContent.value, {
    left: 200,
    top: 200,
    width: 200,  // Set the width for the textbox
    fontSize: fontSize.value,
    fill: textColor.value, // Set default text color
    fontFamily: selectedFont.value,
    textAlign: textAlignment.value, // Set default alignment
    splitByGrapheme: true,  // Ensure proper text wrapping
  });
  canvas.add(defaultText);

  // Optional: Set default selection style for active objects
  canvas.selection = true;

  // Add basic event listeners (e.g., selection updates)
  canvas.on('selection:updated', () => {
    console.log("Object selected: ", canvas?.getActiveObject());
  });
});

onBeforeUnmount(() => {
  if (canvas) {
    canvas.dispose();
  }
});

// Function to add a new square
const addSquare = () => {
  const square = new fabric.Rect({
    left: 100,
    top: 100,
    fill: selectedColor.value,
    width: 50,
    height: 50,
  });
  canvas?.add(square);
};

// Function to add a new circle
const addCircle = () => {
  const circle = new fabric.Circle({
    left: 150,
    top: 150,
    radius: 30,
    fill: selectedColor.value,
  });
  canvas?.add(circle);
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
    activeObject.set('fill', selectedColor.value);
    canvas?.renderAll(); // Re-render the canvas to apply changes
  }
};

// Function to update the text content on the canvas
const updateTextContent = () => {
  if (defaultText) {
    defaultText.set('text', textContent.value);
    canvas?.renderAll();
  }
};

// Function to update the font family of the text
const updateFont = () => {
  if (defaultText) {
    defaultText.set('fontFamily', selectedFont.value);
    canvas?.renderAll();
  }
};

// Function to update the font size of the text
const updateFontSize = () => {
  if (defaultText) {
    defaultText.set('fontSize', parseInt(fontSize.value));
    canvas?.renderAll();
  }
};

// Function to update the text color
const updateTextColor = () => {
  if (defaultText) {
    defaultText.set('fill', textColor.value);
    canvas?.renderAll();
  }
};

// Function to update the text alignment
const updateTextAlign = () => {
  if (defaultText) {
    defaultText.set('textAlign', textAlignment.value);
    canvas?.renderAll();
  }
};

// Layer reordering functions
const bringToFront = () => {
  const activeObject = canvas?.getActiveObject();
  if (activeObject) {
    canvas?.bringToFront(activeObject);  // Brings the active object to the top of the stack
    canvas?.renderAll();  // Re-render the canvas to apply changes
  }
};

const sendToBack = () => {
  const activeObject = canvas?.getActiveObject();
  if (activeObject) {
    canvas?.sendToBack(activeObject);  // Sends the active object to the bottom of the stack
    canvas?.renderAll();  // Re-render the canvas to apply changes
  }
};

const bringForward = () => {
  const activeObject = canvas?.getActiveObject();
  if (activeObject) {
    canvas?.bringForward(activeObject);  // Moves the active object one step forward
    canvas?.renderAll();  // Re-render the canvas to apply changes
  }
};

const sendBackward = () => {
  const activeObject = canvas?.getActiveObject();
  if (activeObject) {
    canvas?.sendBackwards(activeObject);  // Moves the active object one step backward
    canvas?.renderAll();  // Re-render the canvas to apply changes
  }
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
</style>
