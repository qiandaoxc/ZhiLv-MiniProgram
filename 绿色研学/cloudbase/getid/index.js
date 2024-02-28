exports.main = async (event, context) => {
	let{ APPID,OPENID}=cloud.getWXContext()
	 return {
		 APPID,
		 OPENID
	 }
	}