<template>
  <div style="display: flex;margin: 40px;">
    <div class="outline outline-offset-2 outline-1 outline-indigo-500/100" style="height: 800px;min-width:550px;position:relative; z-index:999">
      <embed v-show="pdfSrc" :src="pdfSrc" type="application/pdf" style="overflow: auto; width: 100%; height: 100%; background-color: black"/>
    </div>
    <div style="margin: 40px;">
      <el-upload action="#" list-type="picture-card" :auto-upload="false" accept="image/*" v-model:file-list="fileList"
                 :multiple="true" :on-change="handleChange">
        <el-icon><Plus /></el-icon>
        <template #file="{ file }">
          <div class="demo-image__preview">
            <el-image fit="cover" style="width: 150px; height: 150px"
                      :src="file.url"
                      alt=""/>
            <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-left" @click="handleMove(file, 'left')">
                  <el-icon><Back /></el-icon>
                </span>
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <el-icon><ZoomIn /></el-icon>
                </span>
                <span class="el-upload-list__item-delete" @click="handleRemove(file, [file])">
                  <el-icon><Delete /></el-icon>
                </span>
                <span class="el-upload-list__item-right" @click="handleMove(file, 'right')">
                  <el-icon><Right /></el-icon>
                </span>
              </span>
          </div>
        </template>
      </el-upload>
      <el-image-viewer
          v-if="previewVisible"
          @close="() => previewVisible = false"
          :teleported="true"
          :hide-on-click-modal="true"
          :initial-index="initialIndex"
          :url-list="previewImage" />
      <div style="margin-top: 40px">
        <div>
          <span style="margin-right: 10px">计量单位：</span>
          <el-radio-group v-model="unit" :disabled="unitDisabled">
            <el-radio label="pt">points</el-radio>
            <el-radio label="mm">mm</el-radio>
            <el-radio label="cm">cm</el-radio>
            <el-radio label="in">in</el-radio>
            <el-radio label="px">px</el-radio>
            <el-radio label="pc">pc</el-radio>
            <el-radio label="em">em</el-radio>
            <el-radio label="ex">ex</el-radio>
          </el-radio-group>
        </div>
        <div style="margin-top: 20px">
          <span style="margin-right: 10px">纸张大小：</span>
          <el-radio-group v-model="pageSizeRadio">
            <el-radio :label="0">a4</el-radio>
            <el-radio :label="1">b3</el-radio>
            <el-radio :label="2">原图尺寸</el-radio>
            <el-radio :label="3">自定义规格</el-radio>
            <el-radio :label="4">自定义尺寸</el-radio>
          </el-radio-group>
        </div>
        <div v-if="pageSizeRadio === 3" style="margin-top: 20px">
          <ul>
            <li>a0 - a10</li>
            <li>b0 - b10</li>
            <li>c0 - c10</li>
            <li>dl</li>
            <li>letter</li>
            <li>government-letter</li>
            <li>legal</li>
            <li>junior-legal</li>
            <li>ledger</li>
            <li>tabloid</li>
            <li>credit-card</li>
          </ul>
          <el-input v-model="pageSize" style="width: 400px" placeholder="请输入上面列出来的值，如：a4、b3"/>
        </div>
        <div v-if="pageSizeRadio === 4" style="margin-top: 20px">
          <el-input-number v-model="pageWidth" style="width: 200px" placeholder="如：210"/>
          <span> × </span>
          <el-input-number v-model="pageHeight" style="width: 200px" placeholder="如：297"/>
        </div>
        <div style="margin-top: 20px">
          <div>
            <span style="margin-right: 10px">纸张方向：</span>
            <el-radio-group v-model="pageDirection" :disabled="pageDirectionDisabled">
              <el-radio label="portrait">纵向</el-radio>
              <el-radio label="landscape">横向</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div style="margin-top: 20px">
          <div>
            <span style="margin-right: 10px">左右边距：</span>
            <el-input-number v-model="x" :min="0"/>
          </div>
        </div>
        <div style="margin-top: 20px">
          <div>
            <span style="margin-right: 10px">上下边距：</span>
            <el-input-number v-model="y" :min="0"/>
          </div>
        </div>
        <div style="margin-top: 20px">
          <div>
            <span style="margin-right: 10px">访问密码：</span>
            <el-input style="width: 400px" v-model="password"/>
          </div>
        </div>
        <div style="margin-top: 20px;">
          <el-button type="primary" @click="convert" :loading="loading">导出PDF</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import jsPDF from "jspdf";
import { ElMessage } from 'element-plus'

import type { UploadProps, UploadUserFile } from 'element-plus'
import type { jsPDFOptions } from 'jspdf'

const previewVisible = ref(false);
const initialIndex = ref(0);
const fileList = ref<UploadUserFileExtend[]>([]);
const loading = ref(false);
const unitDisabled = ref(false);
const pageDirectionDisabled = ref(false);
const pageSizeRadio = ref(0);
const pageSize = ref('a4');
const pageWidth = ref(210);
const pageHeight = ref(297);
const pageDirection = ref('portrait');
const x = ref(0);
const y = ref(0);
const unit = ref<"pt" | "px" | "in" | "mm" | "cm" | "ex" | "em" | "pc" | undefined>('mm');
const password = ref(undefined);
const pdfSrc = ref<string | undefined>(undefined);

const previewImage = computed(() => {
    return fileList.value.map(file => {
      return file.url
    })
})

watch(pageSizeRadio, (newValue, oldValue) => {
  if (newValue === 2) {
    unit.value = 'px'
    unitDisabled.value = true
    pageDirectionDisabled.value = true
  } else if (oldValue === 2) {
    unit.value = 'mm'
    unitDisabled.value = false
    pageDirectionDisabled.value = false
  }
})

interface UploadUserFileExtend extends UploadUserFile {
  pageDirection: "p" | "portrait" | "l" | "landscape" | undefined;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  pageSize: string | number[];
}

function convert() : void {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先上传至少一张图片')
    return;
  }
  loading.value = true
  let allPromise = []
  for (let i = 0; i < fileList.value.length; i++) {
    allPromise.push(getFormat(fileList.value[i]))
  }
  Promise.all(allPromise).then(() => {
    let file0 = fileList.value[0]
    const options: jsPDFOptions = {
      orientation: file0.pageDirection,
      unit: unit.value,
      format: file0.pageSize,
      hotfixes: unit.value === 'px' ? ["px_scaling"] : undefined,
      encryption: {
        ownerPassword: password ? password.value : undefined,
        userPassword: password ? password.value : undefined,
      },
    };
    let doc = new jsPDF(options);
    let zoom = Math.max(file0.width / (doc.getPageWidth(1) - (x.value * 2)), file0.height / (doc.getPageHeight(1) - (y.value * 2)))
    doc.addImage({
      imageData: file0.canvas,
      x: x.value,
      y: y.value,
      width: file0.width / zoom,
      height: file0.height / zoom,
    })
    for (let i = 1; i < fileList.value.length; i++) {
      let fileTmp = fileList.value[i]
      doc.addPage(fileTmp.pageSize, fileTmp.pageDirection);
      let zoom = Math.max(fileTmp.width / (doc.getPageWidth(i + 1) - (x.value * 2)), fileTmp.height / (doc.getPageHeight(i + 1) - (y.value * 2)))
      doc.addImage({
        imageData: fileTmp.canvas,
        x: x.value,
        y: y.value,
        width: fileTmp.width / zoom,
        height: fileTmp.height / zoom,
      })
    }
    pdfSrc.value = doc.output("bloburi").toString()
    loading.value = false
  }).catch(e => {
    console.error(e)
    ElMessage.error("导出失败")
    loading.value = false
  })
}

function getFormat(file: UploadUserFileExtend) : Promise<{}> {
  return new Promise((resolve, reject) => {
    file.pageDirection = pageDirection.value as "portrait" | "p" | "l" | "landscape"
    let url = getFileUrl(file)
    let image = new Image();
    image.src = url!;
    image.onload = () => {
      let canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      file.width = image.width
      file.height = image.height

      let ctx = canvas.getContext("2d");
      ctx!.fillStyle = "white";
      ctx?.fillRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(image, 0, 0, image.width, image.height);
      file.canvas = canvas

      if (pageSizeRadio.value === 0) {
        file.pageSize = 'a4'
        resolve({})
      } else if (pageSizeRadio.value === 1) {
        file.pageSize = 'b3'
        resolve({})
      } else if (pageSizeRadio.value === 2) {
        file.pageSize = [image.width + (x.value * 2), image.height + (y.value * 2)]
        file.pageDirection = image.width > image.height ? 'landscape' : 'portrait'
        resolve({})
      } else if (pageSizeRadio.value === 3) {
        file.pageSize = pageSize.value
        resolve({})
      } else if (pageSizeRadio.value === 4) {
        file.pageSize = [pageWidth.value, pageHeight.value]
        resolve({})
      } else {
        reject()
      }
    }
    image.onerror = error => reject(error);
  })
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) : void => {
  initialIndex.value = getFileIndex(uploadFile)
  previewVisible.value = true;
}

function handleChange(file: UploadUserFile, fileList: UploadUserFile[]) : void {
  fileList = [...fileList]
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) : void => {
  let index = getFileIndex(file)
  fileList.value.splice(index, 1)
}

function handleMove(file: UploadUserFile, direction: string) : void {
  let index = getFileIndex(file)
  if (index === 0 && direction === 'left') {
    ElMessage.warning('已经是第一张图片了，不能再向左移动了')
    return
  }
  if (index === fileList.value.length - 1 && direction === 'right') {
    ElMessage.warning('已经是最后一张图片了，不能再向右移动了')
    return
  }
  let item = fileList.value[index]
  fileList.value.splice(index, 1)
  if (direction === 'left') {
    fileList.value.splice(index - 1, 0, item)
  } else {
    fileList.value.splice(index + 1, 0, item)
  }
}

function getFileIndex(file: UploadUserFile) : number {
  for (let i = 0; i < fileList.value.length; i++) {
    if (fileList.value[i].uid === file.uid) {
      return i
    }
  }
  return 0
}

function getFileUrl(file: UploadUserFile) : string | undefined {
  console.log(file)
  let url = file.url;
  if (!file.url) {
    if (window.URL !== undefined) {
      url = window.URL.createObjectURL(file.raw as Blob);
    } else if (window.webkitURL !== undefined) {
      url = window.webkitURL.createObjectURL(file.raw as Blob);
    }
  }
  file.url = url
  return url
}
</script>

<style scoped>
</style>