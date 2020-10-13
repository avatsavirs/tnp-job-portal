const { secrets } = require('../../config');
const {Tnp, Validate} = require('../../resources/tnp/tnp.model');
const jwt = require('jsonwebtoken')

async function tnpSingin(req, res) {
    const input =  { email, password } = req.body;
    
    const { error } = Validate(input);
    if (error)
      return res.status(400).send({
        success: false,
        message: error.details[0].message
      });
  
    try {
      const tnp = await Tnp.findOne({ email: input.email })
      if (!tnp) {
        return res
          .status(404)
          .send({ message: `Error: tnp user with email - ${input.email} not found` });
      }
      if(!await tnp.validatePassword(input.password,tnp.password)){
        return res.status(403).send({
            success: false,
            message: "Email/Password incorrect"
        }) 
    }
    //   const token = createToken(tnp);
      const token = await tnp.generateAuthToken(tnp.email)
      
      return res
      .status(200)
      .json({ message: 'Signin Successful', data: { token } });
      
    } catch (e) {
      console.error(e);
    }
  }


  async function tnpProtect(req, res, next) {
    try {
      const token = req.headers.authorization.split('Bearer ')[1];
      if (!token) {
        throw new Error('Unauthorized Access');
      }
      const payload = await verifyToken(token);
      const tnp = await Tnp.findOne(payload.email)
        .select('-password')
        .lean()
        .exec();
      if (!tnp) {
        throw new Error('Unauthorized Access');
      }
      req.tnp = tnp;
      next();
    } catch (e) {
      console.error(e);
      return res.status(401).json({
        message: 'Unauthorized Access'
      });
    }
  }

  function verifyToken(token) {
    return new Promise(function (resolve, reject) {
      jwt.verify(token, secrets.jwt, function (error, payload) {
        if (error) return reject(error);
        resolve(payload);
      });
    });
  }

module.exports={
    tnpSingin,
    tnpProtect
}