import Text from './text'
import imageSrc from './imageSrc'
import imageSrcList from './imageSrcList'
import Url from './url'
import musicSrc from './musicSrc'
import videoSrc from './videoSrc'
import noticeText from './noticeText'
import qrcodeValue from './qrcodeValue'
import dateType from './dateType'
import weekType from './weekType'
import countDownTime from './countDownTime'
import pdfSrc from './pdfSrc'
import weatherArea from './weatherArea'

export default {
	[Text.name]: Text,
	[imageSrc.name]: imageSrc,
	[Url.name]: Url,
	[musicSrc.name]: musicSrc,
	[imageSrcList.name]: imageSrcList,
	[videoSrc.name]: videoSrc,
	[noticeText.name]: noticeText,
	[qrcodeValue.name]: qrcodeValue,
	[dateType.name]: dateType,
	[weekType.name]: weekType,
	[countDownTime.name]: countDownTime,
	[pdfSrc.name]: pdfSrc,
	[weatherArea.name]: weatherArea
}
