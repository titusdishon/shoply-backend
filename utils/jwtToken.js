//create and send token and save in cookie

const sendToken = (user, statusCode, res)=>{
    const token = user.getJwtToken();
    const options = {
        expiresIn: new Date(
            Date.now()+process.env.COOKIE_EXPIRES_IN*24*60*60*1000
        ),
        httpOnly:true
    }
    res.status(statusCode).cookie('token', token, options).json({
        success:true,
        token,
        user
    })
}

export default  sendToken;