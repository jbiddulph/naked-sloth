<template>
  <div class="flex flex-row">
    <!-- Canvas Element -->
    <canvas ref="canvasEl" width="600" height="600" style="border: 1px solid #999999; border-radius: 50px; margin-right: 10px;"></canvas>
    <!-- Controls for shapes and text -->
    <div class="controls">
      <UButton @click="downloadCanvasAsImage" variant="solid">Download Canvas as Image</UButton><br />
      BG Color: <input type="color" v-model="canvasStore.options.backgroundColor" @change="updateCanvasBackgroundColor"><br />
       <!-- Background Image Upload -->
      <label for="bgImageUpload">Upload Background Image:</label><br /><br />
      <input type="file" id="bgImageUpload" @change="uploadBackgroundImage" accept="image/*"><br />
      <button @click="addSquare"><Icon name="tdesign:add-rectangle" title="Add Square" color="black" size="30" /></button>
      <button @click="addCircle"><Icon name="tdesign:add-circle" title="Add Circle" color="black" size="30" /></button>
      <button @click="removeSelected"><Icon name="tdesign:delete" title="Remove Selected" color="black" size="30" /></button>
      <input type="color" v-model="canvasStore.selectedColor" @change="changeColor" />
      <!-- Layer reordering buttons -->
      <div class="layer-controls">
        <button @click="bringToFront"><Icon name="tdesign:flip-to-front" title="Bring to Front" color="black" size="30" /></button>
        <button @click="sendToBack"><Icon name="tdesign:flip-to-back" title="Send to Back" color="black" size="30" /></button>
        <button @click="bringForward"><Icon name="tdesign:jump" title="Bring Forward" color="black" size="30" /></button>
        <button @click="sendBackwards"><Icon name="tdesign:jump-off" title="Push Back" color="black" size="30" /></button>
      </div>
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
import { useDesignStore } from "~/stores/design";

import { ref, onMounted, onBeforeUnmount, nextTick, defineEmits } from 'vue';
import * as fabric from 'fabric'; // v6
const emit = defineEmits(['downloaded'])
const rapStore = useRapStore()
const canvasStore = useCanvasStore()
const designStore = useDesignStore()

const canvasEl = ref<HTMLCanvasElement | null>(null);
let canvas: fabric.Canvas | null = null;


let objectToSendBack = null;
let defaultText = null;

onMounted(async() => {
  await nextTick();
  if (canvasEl.value) {
    // Initialize Fabric.js canvas
    canvas = new fabric.Canvas(canvasEl.value, canvasStore.options);

    // Event listener for selection
    canvas.on('selection:created', (event) => {
      objectToSendBack = event.target;
      console.log("Object selected (created):", objectToSendBack);
    });

    canvas.on('selection:updated', (event) => {
      objectToSendBack = event.target;
      console.log("Object selected (updated):", objectToSendBack);
    });
    
    // Add default multi-line text field to the canvas
    defaultText = new fabric.Textbox(canvasStore.textContent, canvasStore.textboxDefaults);
    canvas.add(defaultText);
    
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
    console.log("canvas.moveObjectTo exists:", typeof canvas.moveObjectTo === 'function');
  }
});

onBeforeUnmount(() => {
  if (canvas) {
    canvas.off('selection:created');
    canvas.off('selection:updated');
    canvas.dispose();  // Clean up the canvas when the component is destroyed
  }
});

const sendToBack = () => {
  const activeObject = canvas?.getActiveObject();  // Get the active object
  if (activeObject) {
    // Use canvas.sendToBack() to send the object to the back of the stack
    canvas.sendObjectToBack(activeObject);  
    canvas.renderAll();  // Re-render the canvas after updating the object position
  } else {
    console.error("No object selected");
  }
};

const bringToFront = () => {
  const activeObject = canvas?.getActiveObject();
  if (activeObject) {
    canvas.bringObjectToFront(activeObject);
    canvas.renderAll();
  } else {
    console.error("No active object selected");
  }
};

const sendBackward = () => {
  const activeObject = canvas?.getActiveObject();  // Get the active object
  if (activeObject) {
    // Use canvas.sendToBack() to send the object to the back of the stack
    canvas.sendObjectBackwards(activeObject);  
    canvas.renderAll();  // Re-render the canvas after updating the object position
  } else {
    console.error("No object selected");
  }
};

const bringForward = () => {
  const activeObject = canvas?.getActiveObject();
  if (activeObject) {
    canvas.bringObjectForward(activeObject);
    canvas.renderAll();
  } else {
    console.error("No active object selected");
  }
};

const downloadCanvasAsImage = () => {
  if (canvas) {
    // Get the canvas image as base64 (you can choose 'image/png' if necessary)
    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    // Convert the base64 to a Blob with the correct MIME type
    const blob = base64ToBlob(dataUrl, 'image/jpeg');
    // Store the Blob in the Pinia store as fileData (this simulates a File object)
    designStore.setImageData(dataUrl, blob);  // fileDisplay for preview, blob for upload
    emit('downloaded')
  } else {
    console.error('Canvas is not initialized.');
  }
};
  
const base64ToBlob = (base64, mimeType) => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
};

const updateCanvasBackgroundColor = () => {
  nextTick(() => {
  
    // Update the background color in the store
    canvasStore.updateBackgroundColor(canvasStore.options.backgroundColor); 
    console.log("change background colour to: ", canvasStore.options.backgroundColor);

    // Update the canvas background color using Fabric.js
    if (canvas) {
        console.log("Setting bg colorsx");

        // canvas.setBackgroundColor(canvasStore.options.backgroundColor, canvas.renderAll.bind(canvas));
        canvas.backgroundColor(canvasStore.options.backgroundColor, canvas.renderAll.bind(canvas));
    }
  })
}







const uploadBackgroundImage = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0] && canvas) {
    const reader = new FileReader();

    reader.onload = function (e: ProgressEvent<FileReader>) {
      const imgSrc = e.target?.result as string;

      console.log("Base64 image string:", imgSrc);  // Log the base64 string

      const imageElement = new Image();
      imageElement.src = imgSrc;

      // When the image is loaded, set it as the Fabric.js background image
      imageElement.onload = () => {
        const fabricImage = new fabric.Image(imageElement);

        // Scale the image to fit the canvas
        fabricImage.scaleToWidth(canvas.width);
        fabricImage.scaleToHeight(canvas.height);

        // Set the background image and re-render the canvas
        canvas.setBackgroundImage(fabricImage, canvas.renderAll.bind(canvas));
      };

      // Handle error if the image fails to load
      imageElement.onerror = () => {
        console.error('Failed to load base64 image.');
      };
    };

    // Here is the missing step: read the image as a Data URL (base64)
    reader.readAsDataURL(input.files[0]);  // This will generate the base64 string
  }
};











// Function to add a new square
const addSquare = () => {
  const square = new fabric.Rect(canvasStore.squareDefaults);
  canvas?.add(square);
};

// Function to add a new circle
const addCircle = () => {
  const circle = new fabric.Circle(canvasStore.circleDefaults);
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

</script>

<style scoped>
.controls {
  margin-top: 20px;
  margin-left: 20px;
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
