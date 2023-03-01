<template>
  <div>
    <el-upload class="upload-demo" drag action="/" multiple :http-request="handleHttpRequest"
      :on-remove="handleRemoveFile">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>
<script>
import md5 from "../common/js/md5";
import { taskInfo, initTask, preSignUrl, merge } from '../api/modules/breakpoint';
import { addResource } from '../api/modules/page';
import { Notification } from "element-ui";
import Queue from 'promise-queue-plus';
import axios from 'axios'
import { ref } from 'vue'
const axiosReq = axios.create()
// 文件上传分块任务的队列（用于移除文件时，停止该文件的上传队列） key：fileUid value： queue object
const fileUploadChunkQueue = ref({}).value
export default {
  data() {
    return {
    }
  },
  methods: {
    async getTaskInfo(file) {
      let task;
      const fileMd5 = await md5(file)
      const { code, data, msg } = await taskInfo(fileMd5)
      if (code === 200) {
        task = data
        if (!task) {
          const initTaskData = {
            fileHash: fileMd5,
            fileName: file.name,
            totalSize: file.size,
            chunkSize: 5 * 1024 * 1024
          }
          const { code, data, msg } = await initTask(initTaskData)
          if (code === 200) {
            task = data
          } else {
            Notification.error({
              title: '文件上传错误',
              message: msg
            })
          }
        }
      } else {
        Notification.error({
          title: '文件上传错误',
          message: msg
        })
      }
      return task
    },
    handleUpload(file, taskRecord, options) {
      let lastUploadedSize = 0; // 上次断点续传时上传的总大小
      let uploadedSize = 0 // 已上传的大小
      const totalSize = file.size || 0 // 文件总大小
      let startMs = new Date().getTime(); // 开始上传的时间
      const { exitPartList, chunkSize, chunkNum, fileHash } = taskRecord

      // 获取从开始上传到现在的平均速度（byte/s）
      const getSpeed = () => {
        // 已上传的总大小 - 上次上传的总大小（断点续传）= 本次上传的总大小（byte）
        const intervalSize = uploadedSize - lastUploadedSize
        const nowMs = new Date().getTime()
        // 时间间隔（s）
        const intervalTime = (nowMs - startMs) / 1000
        return intervalSize / intervalTime
      }

      const uploadNext = async (partNumber) => {
        const start = new Number(chunkSize) * (partNumber - 1)
        const end = start + new Number(chunkSize)
        const blob = file.slice(start, end)
        const { code, data, msg } = await preSignUrl({ fileHash: fileHash, partNumber: partNumber })
        if (code === 200 && data) {
          await axiosReq.request({
            url: data,
            method: 'PUT',
            data: blob,
            headers: { 'Content-Type': 'application/octet-stream' }
          })
          return Promise.resolve({ partNumber: partNumber, uploadedSize: blob.size })
        }
        return Promise.reject(`分片${partNumber}， 获取上传地址失败`)
      }

      /**
       * 更新上传进度
       * @param increment 为已上传的进度增加的字节量
       */
      const updateProcess = (increment) => {
        increment = new Number(increment)
        const { onProgress } = options
        let factor = 1000; // 每次增加1000 byte
        let from = 0;
        // 通过循环一点一点的增加进度
        while (from <= increment) {
          from += factor
          uploadedSize += factor
          const percent = Math.round(uploadedSize / totalSize * 100).toFixed(2);
          onProgress({ percent: percent })
        }

        const speed = getSpeed();
        const remainingTime = speed != 0 ? Math.ceil((totalSize - uploadedSize) / speed) + 's' : '未知'
        console.log('剩余大小：', (totalSize - uploadedSize) / 1024 / 1024, 'mb');
        console.log('当前速度：', (speed / 1024 / 1024).toFixed(2), 'mbps');
        console.log('预计完成：', remainingTime);
      }


      return new Promise(resolve => {
        const failArr = [];
        const queue = Queue(5, {
          "retry": 3,               //Number of retries
          "retryIsJump": false,     //retry now?
          "workReject": function (reason, queue) {
            failArr.push(reason)
          },
          "queueEnd": function (queue) {
            resolve(failArr);
          }
        })
        fileUploadChunkQueue[file.uid] = queue
        for (let partNumber = 1; partNumber <= chunkNum; partNumber++) {
          const exitPart = (exitPartList || []).find(exitPart => exitPart.partNumber == partNumber)
          if (exitPart) {
            // 分片已上传完成，累计到上传完成的总额中,同时记录一下上次断点上传的大小，用于计算上传速度
            lastUploadedSize += new Number(exitPart.size)
            updateProcess(exitPart.size)
          } else {
            queue.push(() => uploadNext(partNumber).then(res => {
              // 单片文件上传完成再更新上传进度
              updateProcess(res.uploadedSize)
            }))
          }
        }
        if (queue.getLength() == 0) {
          // 所有分片都上传完，但未合并，直接return出去，进行合并操作
          resolve(failArr);
          return;
        }
        queue.start()
      })
    },
    handleRemoveFile(uploadFile, uploadFiles) {
      const queueObject = fileUploadChunkQueue[uploadFile.uid]
      if (queueObject) {
        queueObject.stop()
        fileUploadChunkQueue[uploadFile.uid] = undefined
      }
    },
    async handleHttpRequest(options) {
      const file = options.file
      const task = await this.getTaskInfo(file)
      if (task) {
        const { finished, path, taskRecord } = task
        const { fileHash: fileHash } = taskRecord
        if (finished) {
          return path
        } else {
          const errorList = await this.handleUpload(file, taskRecord, options)
          if (errorList.length > 0) {
            Notification.error({
              title: '文件上传错误',
              message: '部分分片上次失败，请尝试重新上传文件'
            })
            return;
          }
          const { code, data, msg } = await merge(fileHash)
          if (code === 200) {
            // 上传完后添加至资源列表
            let fileTs = this.getFileType(data.fileName)
            let param = {
              resourceId: data.fileId,
              resourceName: data.fileName,
              resourceTypeId: fileTs.resourceTypeId,
              resourceMd5: data.fileHash,
              fileSize: data.fileSize,
              fileType: fileTs.fileType,
              fileUrl: process.env.VUE_APP_BASE_API + '/file/download/' + data.fileId
            }
            addResource(param).then(() => {
              this.$modal.msgSuccess("新增成功");
            return path;
              
            });
          } else {
            Notification.error({
              title: '文件上传错误',
              message: msg
            })
          }
        }
      } else {
        Notification.error({
          title: '文件上传错误',
          message: '获取上传任务失败'
        })
      }
    },
    getFileType(fileName) {
      let suffix = ''; // 后缀获取
      let result = ''; // 获取类型结果
      if (fileName) {
        const flieArr = fileName.split('.'); // 根据.分割数组
        suffix = flieArr[flieArr.length - 1]; // 取最后一个
      }
      if (!suffix) return false; // fileName无后缀返回false
      suffix = suffix.toLocaleLowerCase(); // 将后缀所有字母改为小写方便操作
      // 匹配图片
      const imgList = ['png', 'jpg', 'jpeg', 'bmp', 'gif']; // 图片格式
      result = imgList.find(item => item === suffix);
      if (result) return {fileType:'I',resourceTypeId:'1'};
      // 匹配文档
      const txtList = ['txt','xls', 'xlsx','doc', 'docx','pdf','html','ppt', 'pptx'];
      result = txtList.find(item => item === suffix);
      if (result) return {fileType:'D',resourceTypeId:'4'};
      // 匹配视频
      const videoList = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v'];
      result = videoList.find(item => item === suffix);
      if (result) return {fileType:'V',resourceTypeId:'2'};
      // 匹配音频
      const radioList = ['mp3', 'wav', 'wmv'];
      result = radioList.find(item => item === suffix);
      if (result) return {fileType:'M',resourceTypeId:'3'};
      // 匹配音频
      const apkList = ['apk', 'pxl','ipa','sis','sisx','jar'];
      result = apkList.find(item => item === suffix);
      if (result) return {fileType:'A',resourceTypeId:'5'};
      // 其他文件类型
      return {fileType:'O',resourceTypeId:'6'};
}
  }
}
</script>
