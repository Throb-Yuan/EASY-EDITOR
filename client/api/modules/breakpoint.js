/*
* 断点续传所需接口
**/
import $axios from "@/service/httpServer";
/**
 * 根据文件的md5获取未上传完的任务
 * @param fileHash 文件md5
 * @returns {Promise<AxiosResponse<any>>}
 */
 export const taskInfo = fileHash => {return $axios.get(`/file/multipart/tasks/${fileHash}`)}
// 获取天气列表
/**
 * 初始化一个分片上传任务
 * @param fileHash 文件md5
 * @param fileName 文件名称
 * @param totalSize 文件大小
 * @param chunkSize 分块大小
 * @returns {Promise<AxiosResponse<any>>}
 */
export const initTask =   ({ fileHash, fileName, totalSize, chunkSize }) =>  {return $axios.post('/file/multipart/tasks', {fileHash, fileName, totalSize, chunkSize})}

/**
 * 获取预签名分片上传地址
 * @param fileHash 文件md5
 * @param partNumber 分片编号
 * @returns {Promise<AxiosResponse<any>>}
 */
export const preSignUrl =  ({ fileHash, partNumber }) =>{return $axios.get(`/file/multipart/tasks/${fileHash}/${partNumber}`)}
/**
 * 合并分片
 * @param fileHash
 * @returns {Promise<AxiosResponse<any>>}
 */
 export const merge = fileHash => {return $axios.post(`/file/multipart/tasks/merge/${fileHash}`)}
