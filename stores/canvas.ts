import { defineStore } from 'pinia'

export const useCanvasStore = defineStore({
  id: 'canvasStore',
  state: () => ({
    textContent: "",
    options: {
      backgroundColor: '#ffffff',
      selectionBorderColor: '#666666'
    },
    fontSize: "20",
    textColor: "#000000",
    selectedFont: "Arial",
    textAlignment: "left",
    selectedColor: "#ff0000"
  }),
  getters: {
    textboxDefaults(state) {
      return {
        left: 200,
        top: 200,
        width: 200,  // Set the width for the textbox
        fontSize: state.fontSize,
        fill: state.textColor, // Set default text color
        fontFamily: state.selectedFont,
        textAlign: state.textAlignment, // Set default alignment
        splitByGrapheme: true,  // Ensure proper text wrapping
      }
    },
    squareDefaults(state) {
      return {
        left: 100,
        top: 100,
        fill: state.selectedColor,
        width: 50,
        height: 50,
      }
    },
    circleDefaults(state) {
      return {
        left: 150,
        top: 150,
        radius: 30,
        fill: state.selectedColor,
      }
    }
  },
  actions: {}
})
