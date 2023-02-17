import { post } from '@/utils/http/request';

/**
 * 公共api
 * @method upload 文件上传
 * @method delImg 删除图片
 */
export const CommonApi = {
    /**
     * 生成单号
     * @param data prefix   单号前缀
     * @returns 
     */
    billNum: (data: { prefix: string }) => post<{ sn: string }>("/api/common/create_sn", data),



}
