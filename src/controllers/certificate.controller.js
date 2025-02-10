const Certificate = require("../models/certificate.model");

const genrateCertificate = async(req,res)=>{
    try{
    const { userId, quizId} = req.body;
    
    const certificate = await Certificate.create({
      userId,
      quizId,
      score
    });
    
    res.json({
      shareLink: `https://yourapp.com/certificate/${certificate.uniqueShareId}`,
      certificateId: certificate.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}