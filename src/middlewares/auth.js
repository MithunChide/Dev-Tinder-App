

const adminAuth = (req,res,next) => {
    let token = "mithun"
    const isAuthenticate = token === "mithun"
    if (!isAuthenticate) {
        return res.status(401).send("Unauthorized Request")
    }
    next();
}

const userAuth = (req,res,next) => {
    let token = "mithun"
    const isAuthenticate = token === "mithun"
    if (!isAuthenticate) {
        return res.status(401).send("Unauthorized Request")
    }
    next();
}

module.exports = {
    adminAuth,
    userAuth
}