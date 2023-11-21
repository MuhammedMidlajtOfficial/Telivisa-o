module.exports.errorHandler = (err,req,res,next)=>{
    res.status(500).render('User/page-500',{ err })
}