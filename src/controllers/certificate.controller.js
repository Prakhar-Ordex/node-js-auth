const Result = require("../models/result.model");
const User = require("../models/auth.model");
const Certificate = require("../models/certificate.model");

const genrateCertificate = async (req, res) => {
  try {
    const { userId, quizId } = req.body;

    const certificate = await Certificate.create({
      userId,
      quizId,
      score
    });

    res.status(201).json({
      shareLink: `https://yourapp.com/certificate/${certificate.uniqueShareId}`,
      certificateData: certificate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const findCertificatesByID = async (req, res) => {
  try {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.isAuth)
    const certificate = await Certificate.findByPk(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    const user = await User.findOne({ where: { id: certificate.userId } });

    const result = await Result.findOne({where:{id:certificate.dataValues.quizId}})

    const certificateData = certificate.dataValues;
    const userData = user.dataValues;
    const resultData = result.dataValues;

    console.log("user data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",userData)
    console.log("certi data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",certificateData)
    console.log("result data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",resultData)

    res.status(200).json({
      certificate:certificateData.id,
      name:userData.username,
      quizName:resultData.quizName,
      createdDate:certificateData.createdAt,
      isAuth:req.isAuth
    });

    // res.status(201), json(certificate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  genrateCertificate,
  findCertificatesByID
};