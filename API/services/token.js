import jwt from 'jsonwebtoken';



export const generateAccessToken = (user) => 
{
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
    return jwt.sign(user, tokenSecret);
}

export const authenticateToken = (req,res,next) =>
{
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
    let authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, tokenSecret, (err, user) => 
    {
        if (err) return res.sendStatus(401);

        req.body.username = user.username;
        next();
    });
}

