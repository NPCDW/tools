<template>
  <div style="margin: 0;padding: 40px;display: flex;">
    <div style="margin-right: 40px;">
      <div style="margin-bottom: 40px">
        <el-button type="primary" @click="renderPage(currentPage, scale + 0.25, rotate)" style="margin-right: 8px" :disabled="pdfDoc == null">放大</el-button>
        <span style="margin-right: 8px">{{ (scale * 100) + '%' }}</span>
        <el-button type="primary" @click="renderPage(currentPage, scale - 0.25, rotate)" style="margin-right: 8px" :disabled="pdfDoc == null">缩小</el-button>

        <el-input-number v-model="currentPage" @change="renderPage(currentPage, scale, rotate)" :min="pdfDoc ? 1 : 0" :max="total" />
        <span style="margin-right: 8px"> / {{ total }} </span>

        <el-button type="primary" @click="renderPage(currentPage, scale, rotate - 90)" style="margin-right: 8px" :disabled="pdfDoc == null">旋转</el-button>
        <span style="margin-right: 8px"> {{ rotate }}° </span>
      </div>
      <div style="margin-bottom: 40px">
        <div style="margin-bottom: 10px">请选择导出图片选项</div>
        <div style="margin-bottom: 10px">
          <el-radio v-model="exportImgRadio" :label="0" >当前页</el-radio>
          <el-radio v-model="exportImgRadio" :label="1" >全部页</el-radio>
          <el-radio v-model="exportImgRadio" :label="2" >自定义范围</el-radio>
        </div>
        <div style="margin-bottom: 10px" v-if="exportImgRadio === 2">
          <el-input-number v-model="startPage" :min="1" :max="total"></el-input-number>
          <span> - </span>
          <el-input-number v-model="endPage" :min="1" :max="total"></el-input-number>
        </div>
        <div>
          <el-button @click="exportImg" :loading="exportImgButtonLoading" :disabled="pdfDoc == null" type="primary">导出图片</el-button>
        </div>
      </div>
    </div>
    <div v-if="!pdfDoc" style="border: #DDDDDD 3px dashed;width: 512px;height: 256px;position: relative">
      <div style="position: absolute;width: 100%;height: 100%;display: flex;flex-direction: column;justify-content: center">
        <span style="font-size: 40px;text-align: center;color: #AAAAAA;width: 100%;">+</span>
        <span style="font-size: 15px;text-align: center;color: #AAAAAA;width: 100%;">点击上传，或拖拽到此处上传</span>
      </div>
      <input type="file" accept="application/pdf" @change="handlePdfUpload($event)" style="position: absolute;width: 100%;height: 100%;top:0;left: 0;opacity: 0"/>
    </div>
    <div v-else class="canvas" :style="{height: height + 'px', width: width + 'px'}">
      <canvas ref="canvas" :height="height" :width="width">
      </canvas>
      <input type="file" accept="application/pdf" @change="handlePdfUpload($event)" style="position: absolute;width: 100%;height: 100%;top:0;left: 0;opacity: 0"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import PDFJS, {pdfDoc} from 'pdfjs-dist';
import {saveAs} from 'file-saver';
import JSZip from 'jszip'
import {ref, nextTick} from "vue";

PDFJS.workerSrc = import('pdfjs-dist/build/pdf.worker.entry');

const pdfDoc = ref<pdfDoc | null>(null);
const currentPage = ref(1);
const total = ref(0);
const scale = ref(1);
const rotate = ref(0);
const height = ref(842);
const width = ref(595);
const exportImgRadio = ref(0);
const exportImgButtonLoading = ref(false);
const startPage = ref(1);
const endPage = ref(1);
const fileName = ref('');
const canvas = ref<HTMLCanvasElement | null>(null);

function exportImg() : void {
  exportImgButtonLoading.value = true
  nextTick(() => {
    if (exportImgRadio.value === 0) {
      new Promise((resolve) => {
        canvasToImg(currentPage.value, scale.value, rotate.value, resolve)
      }).then((imgData) => {
        saveAs(imgData as Blob, fileName.value + '.' + currentPage.value + ".png");
        exportImgButtonLoading.value = false
      })
    } else {
      if (exportImgRadio.value === 1) {
        startPage.value = 1
        endPage.value = total.value
      }
      let allPromise = []
      let zip = new JSZip();
      let img = zip.folder(fileName.value);
      for (let i = startPage.value; i <= endPage.value; i++) {
        let promise = new Promise((resolve) => {
          canvasToImg(i, scale.value, rotate.value, resolve)
        }).then((imgData) => {
          img!.file(i + '.png', imgData);
        })
        allPromise.push(promise)
      }
      Promise.all(allPromise).then(() => {
        zip.generateAsync({type: "blob"}).then(content => saveAs(content, fileName.value + ".zip"));
        exportImgButtonLoading.value = false
      })
    }
  })
}

function canvasToImg(currentPage: number, scale: number, rotate: number, resolve: (value: unknown) => void) : void {
  pdfDoc.value!.getPage(currentPage).then((page) => {
    let viewport = page.getViewport({scale, rotation: rotate});

    let canvas = document.createElement('canvas');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    let renderContext = {
      canvasContext: canvas.getContext('2d')!,
      viewport: viewport
    };
    page.render(renderContext).promise.then(() => {
      canvas.toBlob((imgData) => {
        resolve(imgData)
      })
    });
  })
}

function renderPage(currentPageTmp: number, scaleTmp: number, rotateTmp: number) : void {
  if (total.value <= 0) {
    return;
  }
  if (currentPageTmp < 1) {
    currentPageTmp = 1
  }
  if (currentPageTmp > total.value) {
    currentPageTmp = total.value
  }
  currentPage.value = currentPageTmp
  if (scaleTmp < 0.25) {
    return
  }
  scale.value = scaleTmp
  rotate.value = rotateTmp % 360
  pdfDoc.value!.getPage(currentPageTmp).then((page) => {
    let viewport = page.getViewport({scale: scaleTmp, rotation: rotateTmp});

    let context = canvas.value!.getContext('2d');
    height.value = viewport.height;
    width.value = viewport.width;

    let renderContext = {
      canvasContext: context!,
      viewport: viewport
    };
    page.render(renderContext);
  })
}

function loadFile(data: ArrayBuffer) : void {
  // https://cdn.jsdelivr.net/npm/pdfjs-dist@2.4.456/cmaps/
  const CMAP_URL = 'https://unpkg.zhimg.com/pdfjs-dist@2.4.456/cmaps/';
  PDFJS.getDocument({data: data, cMapUrl: CMAP_URL, cMapPacked: true}).promise.then((pdf) => {
    pdfDoc.value = pdf
    total.value = pdf.numPages
    scale.value = 1
    currentPage.value = 1
    rotate.value = 0
    nextTick(() => {
      renderPage(currentPage.value, scale.value, rotate.value);
    });
  })
}

function handlePdfUpload(event: Event) : void {
  let files = (event.target as HTMLInputElement).files;
  if (!files) {
    return
  }
  let file = files[0]
  fileName.value = file.name.substr(0, file.name.length - 4)
  let reader = new FileReader();
  reader.readAsArrayBuffer(file)
  reader.onload = function () {
    loadFile(this.result as ArrayBuffer)
  }
}
</script>

<style scoped>
.canvas {
  box-shadow: 0 0 5px 1px #999;
  position: relative;
}
</style>